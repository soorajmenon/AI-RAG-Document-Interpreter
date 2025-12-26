import { openai } from "./openai.client";

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text
  });

  return response.data[0].embedding;
}
