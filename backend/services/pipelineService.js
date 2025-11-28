// services/pipelineService.js
import { getUserTransactions } from "./transactionService.js";
import { generateTransactionsPDF } from "./pdfService.js";
import { buildTextFromTransactions } from "./textService.js";
import { splitTextToChunks } from "./chunkService.js";
import { embedChunks } from "./embedService.js";
import { storeVectors } from "./vectorService.js";

export const processUserTransactions = async (userId) => {
  console.log("Processing transactions for user:", userId);

  // 1. Get user's transactions
  const transactions = await getUserTransactions(userId);

  // 2. Generate PDF
  const pdfPath = `./pdfs/${userId}-report.pdf`;
  await generateTransactionsPDF(transactions, pdfPath);

  // 3. Generate text
  const text = buildTextFromTransactions(transactions);

  // 4. Split into chunks
  const chunks = splitTextToChunks(text);

  // 5. Create embeddings
  const embeddings = await embedChunks(chunks);

  // 6. Store in vector DB
  await storeVectors(userId, embeddings);

  return { chunks: chunks.length, pdfPath };
};
