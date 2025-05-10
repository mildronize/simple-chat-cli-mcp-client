# Simple Chat Cli MCP Client

A lightweight CLI tool that connects to Model Context Protocol (MCP) servers and lets you interact using natural language prompts — powered by OpenAI.

## 🧠 What is MCP?

**Model Context Protocol (MCP)** is a protocol that allows large language models (LLMs) to interact with external tools — such as file systems, APIs, databases, or custom business logic — by treating them as callable functions (called “tools”) at runtime.

### 🌐 Key Concept

Think of MCP as the **bridge between your LLM and your application's capabilities.**

Instead of hard-coding logic or manually calling APIs, you define **tools** on an **MCP server**, and your **MCP client** dynamically connects, fetches those tools, and forwards them to the LLM — allowing it to decide **when and how** to call them.

## 🔄 Typical Flow of an MCP Client

Here’s how a basic LLM + MCP interaction looks:

1. **Start the Session**:

   * Your backend (MCP client) connects to an MCP server.
   * The MCP server responds with a list of available tools (name, description, input schema).

2. **Receive User Prompt**:

   * The user types a natural-language prompt.
   * The prompt is sent to the LLM **along with the available tools**.

3. **Tool Calling**:

   * If needed, the LLM responds with a **tool call** (e.g., `read_file`, `search_docs`).
   * Your app (MCP client) invokes the tool on the MCP server.

4. **Post-call Response**:

   * The tool result is returned to the LLM.
   * The LLM integrates the result and generates a final response to the user.

## ⚙️ Why MCP?

MCP makes it easy to:

* Extend LLMs with real capabilities (e.g., reading files, querying APIs)
* Keep tools modular, reusable, and secure
* Integrate into existing backend logic without redesigning your LLM pipeline
* Swap or reuse tools across agents and clients

## 🔧 Requirements

To work with MCP:

* Use an **LLM that supports function/tool calling** (e.g., OpenAI, Anthropic, Claude, etc.)
* Implement or connect to an **MCP server** (e.g., [server-filesystem](https://github.com/modelcontextprotocol/servers))
* Build an **MCP client** that handles connection, tool listing, tool execution, and result forwarding

## ✅ Real Use Case Example

If the user says:

> “Read me the latest log file”

The LLM:

* Receives tool list: `read_file`, `list_directory`, etc.
* Decides to call `read_file` with argument `path: "logs/latest.log"`
* The MCP client executes that tool on the server and sends the content back
* The LLM then summarizes or explains it in natural language

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
* Uses OpenAI’s GPT-4o-mini to interpret your prompt and choose which tools to call
* Executes the tools and returns the results
* Supports STDIO or SSE-based servers

## 🙏 Acknowledgements

This project was inspired by:

* [Create MCP Clients in JavaScript (YouTube)](https://www.youtube.com/watch?v=5tl6D-h2_Qc)
* [alejandro-ao/mcp-clients](https://github.com/alejandro-ao/mcp-clients) (original version used Anthropic API)

## 🔗 Related Projects

* [Slack MCP Client (TypeScript)](https://github.com/csonigo/slack-mcp-client)
