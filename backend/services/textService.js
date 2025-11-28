// services/textService.js
export const buildTextFromTransactions = (transactions) => {
  return transactions
    .map((t) => {
      return `
Date: ${t.date.toISOString().split("T")[0]}
Title: ${t.title}
Amount: ${t.amount}
Type: ${t.type}
Category: ${t.category}
Description: ${t.description || "none"}
`;
    })
    .join("\n-------------------------\n");
};
