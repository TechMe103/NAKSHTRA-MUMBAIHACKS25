// services/chunkService.js
export const splitTextToChunks = (text, size = 1500, overlap = 200) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    let chunk = text.slice(start, end);
    chunks.push(chunk);

    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
};
