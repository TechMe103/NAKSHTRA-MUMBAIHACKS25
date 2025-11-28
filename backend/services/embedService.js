// services/embedService.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const embedChunks = async (chunks) => {
  const embedded = [];

  for (const chunk of chunks) {
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });

    embedded.push({
      text: chunk,
      vector: res.data[0].embedding,
    });
  }

  return embedded;
};
