
import OpenAI from "openai";
import Groq from "groq-sdk";
import { getConfig, getApiKey } from "../utils/config";
import fs from "fs";
import yaml from "yaml";
import path from "path";

async function generateWithOpenAI(prompt: string, model: string, apiKey: string): Promise<string> {
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are an expert social media content writer for developers." },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0].message?.content?.trim() || "No output generated.";
}

async function generateWithGroq(prompt: string, model: string, apiKey: string): Promise<string> {
  const groq = new Groq({ apiKey });
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are an expert social media content writer for developers." },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0].message?.content?.trim() || "No output generated.";
}

async function generateWithGemini(prompt: string, model: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error.message}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim() || "No output generated.";
}

function loadPromptTemplate(style: string): string {
  const templatePath = path.resolve(__dirname, `../templates/${style}.yaml`);
  const templateFile = fs.readFileSync(templatePath, "utf8");
  const template = yaml.parse(templateFile);
  return template.prompt;
}

import { getPlatformConfig } from "../utils/platform";
import { log } from "../utils/logger";



export async function generatePost(commits: any, style: string, platform: string): Promise<string> {
  const cfg = getConfig();
  const apiKey = getApiKey(cfg.provider);

  if (!apiKey) throw new Error(`No API key found for provider ${cfg.provider}`);

  const template = loadPromptTemplate(style);

  const prompt = Array.isArray(commits)
    ? template
        .replace("{platform}", platform)
        .replace("{message}", commits.map((c: any) => `"${c.message}" by ${c.author}`).join("\n"))
        .replace("Author: {author}", "")
        .replace("Date: {date}", "")
    : template
        .replace("{platform}", platform)
        .replace("{message}", commits.message)
        .replace("{author}", commits.author)
        .replace("{date}", commits.date);

  let generatedPost: string;

  switch (cfg.provider) {
    case "openai":
      generatedPost = await generateWithOpenAI(prompt, cfg.model, apiKey);
      break;
    case "groq":
      generatedPost = await generateWithGroq(prompt, cfg.model, apiKey);
      break;
    case "gemini":
      generatedPost = await generateWithGemini(prompt, cfg.model, apiKey);
      break;
    default:
      throw new Error(`Unsupported provider: ${cfg.provider}`);
  }

  const platformConfig = getPlatformConfig(platform);
  if (generatedPost.length > platformConfig.maxLength) {
    log.warn(`Post truncated to ${platformConfig.maxLength} characters for ${platform}`);
    return generatedPost.slice(0, platformConfig.maxLength);
  }

  return generatedPost;
}

