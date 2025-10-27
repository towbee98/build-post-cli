
import Conf from "conf";

interface BuildPostConfig {
  provider: "openai" | "groq" | "gemini";
  model: string;
  apiKeys: {
    openai?: string;
    groq?: string;
    gemini?: string;
  };
  defaults: {
    style: string;
    platform: string;
    includeHashtags: boolean;
    copyToClipboard: boolean;
  };
}

const schema = {
  provider: { type: "string", default: "openai" },
  model: { type: "string", default: "gpt-4o-mini" },
      apiKeys: {
          type: "object",
          properties: {
              openai: { type: ["string", "null"] },
              groq: { type: ["string", "null"] },
              gemini: { type: ["string", "null"] },
          },
          default: {},
      },  defaults: {
    type: "object",
    properties: {
      style: { type: "string", default: "casual" },
      platform: { type: "string", default: "twitter" },
      includeHashtags: { type: "boolean", default: true },
      copyToClipboard: { type: "boolean", default: true },
    },
  },
};

const store = new Conf<BuildPostConfig>({ projectName: "buildpost", schema });

export function getConfig() {
  return store.store;
}

export function setProvider(provider: "openai" | "groq" | "gemini", model?: string) {
  store.set("provider", provider);
  if (model) store.set("model", model);
}

export function setApiKey(provider: "openai" | "groq" | "gemini", key: string) {
  const keys = store.get("apiKeys");
  keys[provider] = key;
  store.set("apiKeys", keys);
}

export function getApiKey(provider: "openai" | "groq" | "gemini"): string | undefined {
  return store.get("apiKeys")[provider];
}

export function resetConfig() {
  store.clear();
}

export function showConfig() {
  console.log(JSON.stringify(store.store, null, 2));
}

