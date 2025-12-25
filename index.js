import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import readline from "node:readline/promises";

/***
 * 1. Define the node function
 * 2. Define the graph
 * 3.Compile and invoked the graph
 *
 */

/**
 * Initialise the LLM
 */
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  timeout: null,
  max_retries: 2,
  //other params...
});

const callModel = async (state) => {
  //call the LLM using API
  console.log(`calling LLM...`);
  const response = await llm.invoke(state.messages);
  return { messages: [response] };
};

/**
 * Build the graph
 */

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__");

/**
 * Compile the graph
 */

export const model = workflow.compile();

const main = async () => {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    while (true) {
      const userInput = await rl.question("You: ");
      if (
        userInput === "/bye" ||
        userInput === "/stop" ||
        userInput === "/exit"
      )
        break;
      const initialState = {
        messages: [{ role: "user", content: userInput }],
      };
      const finalState = await model.invoke(initialState);

      console.log("AI:", finalState.messages.at(-1).content);// to get last message we use -1
    }
    rl.close();
  } catch (e) {
    console.error(e);
  }
};

main();
