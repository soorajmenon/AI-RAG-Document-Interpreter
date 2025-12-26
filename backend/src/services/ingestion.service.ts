import { pool } from "../config/db.js";
import { randomUUID } from "crypto";
import { chunkText } from "./chunking.service.js";
import { createEmbedding } from "./embedding.service.js";

export async function ingestDocument(
  title: string,
  content: string
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const documentId = randomUUID();

    await client.query(
      "INSERT INTO documents (id, title) VALUES ($1, $2)",
      [documentId, title]
    );

    const chunks = chunkText(content);

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);

      await client.query(
        `
        INSERT INTO document_chunks (id, document_id, content, embedding)
        VALUES ($1, $2, $3, $4)
        `,
        [randomUUID(), documentId, chunk, embedding]
      );
    }

    await client.query("COMMIT");
    return { documentId, chunks: chunks.length };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
