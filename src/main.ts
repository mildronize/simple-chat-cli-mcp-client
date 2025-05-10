import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import dotenv from "dotenv";
import readline from "readline/promises";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

interface MCPServerConfig {
  command?: string;
  args?: string[];
  url?: string;
}

interface MCPConfig {
  mcpServers: {
    [key: string]: MCPServerConfig;
  };
}

class MCPClient {
  private mcp: Client;
  private llm: OpenAI;
  private transport: any = null;
  private tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [];

  constructor() {
    this.llm = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  // Load MCP configuration from mcp.json
  private loadMCPConfig(): MCPConfig {
    const configPaths = [
      path.resolve(process.cwd(), "mcp.json"),
      // path.resolve(process.cwd(), ".vscode", "mcp.json"),
    ];

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, "utf-8");
        return JSON.parse(configContent) as MCPConfig;
      }
    }

    throw new Error("mcp.json not found in project root or .vscode directory");
  }

  // Connect to the MCP Server
  async connectToServer(serverName: string) {
    const config = this.loadMCPConfig();
    const serverConfig = config.mcpServers[serverName];

    if (!serverConfig) {
      throw new Error(`Server '${serverName}' not found in mcp.json`);
    }

    if (serverConfig.command && serverConfig.args) {
      // STDIO transport
      this.transport = new StdioClientTransport({
        command: serverConfig.command,
        args: serverConfig.args,
      });
    } else if (serverConfig.url) {
      // SSE transport
      this.transport = new SSEClientTransport(new URL(serverConfig.url));
    } else {
      throw new Error(`Invalid server configuration for '${serverName}'`);
    }

    await this.mcp.connect(this.transport);

    // Register tools
    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));

    console.log(
      "Connected to server with tools:",
      this.tools.map((tool) => tool.function.name)
    );
  }

  // Process query
  async processQuery(query: string) {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];

    const response = await this.llm.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      tools: this.tools,
      tool_choice: "auto",
    });

    const finalText: string[] = [];

    for (const choice of response.choices) {
      const message = choice.message;
      if (message.content) {
        finalText.push(message.content);
      }

      if (message.tool_calls) {
        for (const toolCall of message.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

          const result = await this.mcp.callTool({
            name: toolName,
            arguments: toolArgs,
          });

          finalText.push(
            `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
          );
          messages.push({
            role: "user",
            content: result.content as string,
          });

          const followUpResponse = await this.llm.chat.completions.create({
            model: "gpt-4o",
            messages,
          });

          finalText.push(
            followUpResponse.choices[0].message.content || ""
          );
        }
      }
    }

    return finalText.join("\n");
  }

  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log("\nMCP Client Started!");
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await rl.question("\nQuery: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }

  async cleanup() {
    await this.mcp.close();
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.log("Usage: node index.js <server_name>");
    return;
  }
  const serverName = process.argv[2];
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer(serverName);
    await mcpClient.chatLoop();
  } catch (err: any) {
    console.error("❌ MCP Client Error:", err.message);
    process.exit(1);
  } finally {
    await mcpClient.cleanup();
  }
}

main();
