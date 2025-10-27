# BuildPost CLI

Turn your Git commits into engaging social media posts using AI (Node.js CLI).

## Description

`buildpost-cli` is a command-line interface tool that leverages AI to transform your Git commit messages into ready-to-share social media posts. It supports various AI providers (OpenAI, Groq, Gemini) and allows you to customize the post's style and target platform.

## Features

- Generate social media posts from your latest Git commit.
- Summarize a range of Git commits into a single post.
- Customize post style: casual, professional, or technical.
- Target specific platforms: Twitter, LinkedIn, Dev.to, or generic.
- Support for OpenAI, Groq, and Gemini AI providers.
- Dynamic prompt injection using YAML templates.
- Post length validation for each platform.
- Automatically copies generated posts to your clipboard.

## Installation

To install the `buildpost-cli`, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/buildpost-cli.git
cd buildpost-cli
npm install
npm run build
```

## Configuration

Before using the CLI, you need to configure your AI provider and API key.

### Set API Key

Set your API key for your chosen provider. Replace `<YOUR_API_KEY>` with your actual key.

```bash
node dist/cli.js config set-key --provider openai <YOUR_OPENAI_API_KEY>
node dist/cli.js config set-key --provider groq <YOUR_GROQ_API_KEY>
node dist/cli.js config set-key --provider gemini <YOUR_GEMINI_API_KEY>
```

### Set AI Provider and Model

Set your preferred AI provider and optionally specify a model. If no model is specified, a default will be used.

```bash
# Set OpenAI as provider (default model: gpt-4o-mini)
node dist/cli.js config set-provider --provider openai

# Set Groq as provider with a specific model
node dist/cli.js config set-provider --provider groq --model mixtral-8x7b

# Set Gemini as provider with a specific model
node dist/cli.js config set-provider --provider gemini --model gemini-pro
```

### Show Current Configuration

To view your current `buildpost-cli` configuration:

```bash
node dist/cli.js config show
```

### Reset Configuration

To reset all configuration settings to their defaults:

```bash
node dist/cli.js config reset
```

## Usage

**Important:** You must run the `buildpost-cli` from within the root directory of the Git repository for which you want to generate social media posts. The CLI needs access to the `.git` directory to fetch commit information.

```bash
cd /path/to/your/git/repo
node /path/to/buildpost-cli/dist/cli.js generate [options]
```

### Generate a Post from the Latest Commit

Generate a post from your most recent commit using default settings (casual style, Twitter platform):

```bash
node dist/cli.js generate
```

### Generate with Specific Style and Platform

```bash
# Professional post for LinkedIn
node dist/cli.js generate --style professional --platform linkedin

# Technical post for Dev.to
node dist/cli.js generate --style technical --platform devto
```

### Generate from a Specific Commit

Use a specific commit hash to generate a post:

```bash
node dist/cli.js generate --commit <COMMIT_HASH>
```

### Generate from a Commit Range (Summarization)

Summarize a range of commits into a single post. For example, the last 3 commits:

```bash
node dist/cli.js generate --range HEAD~3..HEAD
```

### Prevent Copying to Clipboard

By default, the generated post is copied to your clipboard. To disable this:

```bash
node dist/cli.js generate --no-copy
```

## Prompt Templates

The CLI uses YAML files located in the `src/templates` directory to define the prompts for different styles (casual, professional, technical). You can modify these files or add new ones to customize the AI's behavior.

Each template file (e.g., `casual.yaml`) should contain a `prompt` field:

```yaml
prompt: |
  You are a developer writing a casual post for {platform}.
  Write a short, engaging social media post based on this commit:
  "{message}"
  Author: {author}
  Date: {date}
```

Placeholders like `{platform}`, `{message}`, `{author}`, and `{date}` will be dynamically replaced with the relevant information.

## Development

### Running Tests

To run the test suite:

```bash
npm test
```

### Building the Project

To compile the TypeScript code and copy assets:

```bash
npm run build
```

## License

This project is licensed under the MIT License.
