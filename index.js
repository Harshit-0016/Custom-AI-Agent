import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import readline from "node:readline/promises";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";


//const checkpointer = new SqliteSaver("memory.db");  //persistent 

const checkpointer = new MemorySaver();


const tool = new TavilySearch({
    max_results:5,
    topic:"general",
    // include_answer:false,
    // include_raw_content:false,
    // include_images:false,
    // include_image_descriptions:false,
    // search_depth:"basic",
    // time_range:"day",
    // include_domains:null,
    // exclude_domains:null
})

/**
 * Initialise the tool node
 */

const tools = [tool];
const toolNode = new ToolNode(tools);


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
}).bindTools(tools);

const callModel = async (state) => {
  //call the LLM using API
  console.log(`calling LLM...`);
  const response = await llm.invoke(state.messages);
  return { messages: [...state.messages,response] };
};


function shouldContinue(state){
    //apply condition whether to call tool searching or not
    const lastMessage = state.messages.at(-1);
    console.log('state',state);
    if(lastMessage.tool_calls && lastMessage.tool_calls.length > 0){
        return "tools";
    }
    return '__end__'
}


/**
 * Build the graph
 */

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools",toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent",shouldContinue)
  .addEdge("tools","agent")
  .addEdge("agent", "__end__");

/**
 * Compile the graph
 */

export const model = workflow.compile({checkpointer});

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
      const finalState = await model.invoke(initialState,{configurable:{thread_id: "1" }  });

      console.log("AI:", finalState.messages.at(-1).content);// to get last message we use -1
    }
    rl.close();
  } catch (e) {
    console.error(e);
  }
};

main();
