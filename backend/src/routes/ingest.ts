import { Router } from "express";
import { ingestDocument } from "../services/ingestion.service.js";

const router = Router();

router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Missing title or content" });
  }

  const result = await ingestDocument(title, content);
  res.json(result);
});

export default router;
