import express from "express";
import cors from "cors";
import { runAgent } from "./agent.js";
import {format} from "./format.js";
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bun backend running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await runAgent(message, "thread-1");
    const cleanReply = format(reply);

    res.json({ reply:cleanReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Agent failed" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});
