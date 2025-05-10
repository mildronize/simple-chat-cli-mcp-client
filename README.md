# Simple Prompt MCP Client

A lightweight CLI tool that connects to Model Context Protocol (MCP) servers and lets you interact using natural language prompts — powered by OpenAI.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mildronize/simple-prompt-mcp-client
cd simple-prompt-mcp-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env` and add your [OpenAI API Key](https://platform.openai.com/account/api-keys):

```bash
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=your-openai-key-here
```

### 4. Configure MCP server

Copy `mcp.example.json` to `mcp.json`. This file defines your available MCP servers.

```bash
cp mcp.example.json mcp.json
```

Example config for filesystem server:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "src"
      ]
    }
  }
}
```

> ⚠️ Make sure `mcp.json` is in `.gitignore`, as it may contain local paths or sensitive info.

## 💬 Run the Client

Run with the server name you configured (`filesystem` in this example):

```bash
npx tsx src/main.ts filesystem
```

## 📦 Example Output

```bash
Secure MCP Filesystem Server running on stdio
Allowed directories: [
  '/Users/<YOUR-USERNAME>/gits/simple-prompt-mcp-client/src'
]
Connected to server with tools: [
  'read_file',
  'write_file',
  'list_directory',
  ...
]

MCP Client Started!
Type your queries or 'quit' to exit.

Query: read file ./src/main.ts

[Calling tool read_file with args {"path":"./src/main.ts"}]
This `main.ts` file appears to set up a command-line interface...
```

## 📖 Code Overview

The CLI client:

* Loads server config from `mcp.json`
* Connects to a selected MCP server
* Retrieves and registers tools
* Uses OpenAI’s GPT-4o to interpret your prompt and choose which tools to call
* Executes the tools and returns the results
* Supports STDIO or SSE-based servers

## 🙏 Acknowledgements

This project was inspired by:

* [Create MCP Clients in JavaScript (YouTube)](https://www.youtube.com/watch?v=5tl6D-h2_Qc)
* [alejandro-ao/mcp-clients](https://github.com/alejandro-ao/mcp-clients) (original version used Anthropic API)

## 🔗 Related Projects

* [Slack MCP Client (TypeScript)](https://github.com/csonigo/slack-mcp-client)
