// services/pdfService.js
import PDFDocument from "pdfkit";
import fs from "fs";

export const generateTransactionsPDF = (transactions, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(20).text("Transaction Report", { align: "center" });
    doc.moveDown();

    transactions.forEach((t) => {
      doc.fontSize(12).text(
        `${t.date.toISOString().split("T")[0]} | ${t.title} | ₹${t.amount}`
      );
      doc.text(`Type: ${t.type}`);
      doc.text(`Category: ${t.category}`);
      if (t.description) doc.text(`Note: ${t.description}`);
      doc.moveDown();
    });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", (err) => reject(err));
  });
};
