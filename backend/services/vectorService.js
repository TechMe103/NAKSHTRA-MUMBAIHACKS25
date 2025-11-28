// services/vectorService.js
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("transactions");

export const storeVectors = async (userId, vectors) => {
  const formatted = vectors.map((v, i) => ({
    id: `${userId}_${i}`,
    values: v.vector,
    metadata: { userId, text: v.text },
  }));

  await index.upsert(formatted);
};
