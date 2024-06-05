import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import express from "express";
import { watch } from "chokidar";
import cors from "cors";
import formidable from "formidable";

const __dirname = import.meta.dirname;
const app = express();
const port = process.env.PORT ?? 3000;
const dataPath = join(__dirname, "../data.json");
const watcher = watch(dataPath);
const clients = [];

let data = await readFile(dataPath, "utf-8");

watcher.on("change", async () => {
  data = await readFile(dataPath, "utf-8");
  clients.forEach((client) => {
    client.write(`data: ${data.split("\n").join("\ndata: ")}\n\n`);
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET",
  })
);

app.get("/schedule", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`data: ${data.split("\n").join("\ndata: ")}\n\n`);
  clients.push(res);

  req.on("close", () => {
    clients.splice(clients.indexOf(res), 1);
  });
});

app.post("/schedule", (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields) => {
    await writeFile(dataPath, fields.schedule[0]);
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
