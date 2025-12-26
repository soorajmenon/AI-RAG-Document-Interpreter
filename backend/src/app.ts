import express from "express";
import healthRouter from "./routes/health";
import ingestRouter from "./routes/ingest.js";

export const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/ingest", ingestRouter);
