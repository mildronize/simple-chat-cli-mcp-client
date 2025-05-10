# Doc Written with MCP Client

This document using the prompt
```
read file ./src/main.ts and write README.md for explaining about the code inside MCP Client
```

This document is AI-generated and may not be 100% accurate. Please verify the information before using it.

# MCP Client

## Overview

The MCP Client is a command-line application written in TypeScript that connects to a Model Context Protocol (MCP) server and enables interactive queries using OpenAI's language models. It serves as a client to facilitate interaction with language models via configured servers, enabling additional functionalities through tool calls.

## Features

- Connects to different MCP servers using STDIO or SSE transport mechanisms.
- Dynamically loads server configurations from a JSON file (`mcp.json`).
- Supports querying using OpenAI language models, specifically configured models.
- Automatically handles tool calls available through the connected MCP server.
- Provides an interactive command-line interface for continuous conversation.

## Prerequisites

- Node.js installed on your machine.
- An OpenAI API key.
- An `mcp.json` configuration file available in the project root.

## Getting Started

### Installation

1. Clone the repository.
   
2. Navigate to the project directory:

   ```bash
   cd path/to/your/project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the project root and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

2. Create an `mcp.json` file in the project root to define the server configurations. Example:

   ```json
   {
     "mcpServers": {
       "myServer": {
         "command": "path/to/your/server",
         "args": ["--option1", "value1"],
         "url": "http://localhost:3000"
       }
     }
   }
   ```

### Usage

Run the MCP Client by specifying the server name defined in your `mcp.json`:

```bash
node index.js myServer
```

You can then start typing your queries in the command line. Type `quit` to exit the interaction loop.

## Code Explanation

- **MCPClient class**: This encapsulates the main functionality, including loading MCP configurations, connecting to a server, handling queries, and managing the chat loop.

- **Transport Mechanisms**: Supports two types, STDIO for command-based communication and SSE for server-sent events by evaluating configurations from the `mcp.json`.

- **Tools Handling**: After connecting to the server, it retrieves and registers available tools, which can be called dynamically based on the interaction.

- **Chat Loop**: An interactive loop waits for user input, processes it through the language model, and handles any tool calls if necessary, providing responses accordingly.

- **Main Function**: Parses command-line arguments to obtain the server name, initializes an `MCPClient` instance, establishes a connection, and starts the interactive chat loop.

## Error Handling

The application includes basic error handling for missing configurations and connection errors, printing meaningful error messages to guide the user.

## Conclusion

This MCP Client allows users to interact with language models using specified servers, enhancing capabilities through custom tool integrations and providing human-like responses via OpenAI's API. Its modular architecture and transport flexibility make it easily adaptable for various server configurations and usage scenarios.