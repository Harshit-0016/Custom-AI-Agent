import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";

// In-memory memory (can be Sqlite later)
const checkpointer = new MemorySaver();

/**
 * Tool
 */
const tool = new TavilySearch({
  max_results: 5,
  topic: "general",
});

const tools = [tool];
const toolNode = new ToolNode(tools);

/**
 * LLM
 */
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  max_retries: 2,
}).bindTools(tools);

/**
 * Agent logic
 */
const callModel = async (state) => {
  const response = await llm.invoke(state.messages);
  return { messages: [...state.messages, response] };
};

function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

/**
 * Graph
 */
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .addEdge("agent", "__end__");

const model = workflow.compile({ checkpointer });

/**
 * ✅ EXPORT THIS FUNCTION
 */
export async function runAgent(userMessage, threadId = "default") {
  const initialState = {
    messages: [{ role: "user", content: userMessage }],
  };

  const finalState = await model.invoke(initialState, {
    configurable: { thread_id: threadId },
  });

  return finalState.messages.at(-1).content;
}
