const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 1337;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/uploadFile", upload.single("uploadedFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileBuffer = req.file.buffer;
  const fileSize = fileBuffer.length;
  const chunkSize = Math.ceil(fileSize / 5);

  try {
    const processedChunks = [];

    for (let i = 0; i < 5; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, fileSize);
      const chunkData = fileBuffer.slice(start, end);

      function appendCharacterToLines(buffer, character) {
        const lines = buffer.toString().split("\n");
        const processedLines = lines.map((line) => `${character}${line}`);
        return Buffer.from(processedLines.join("\n"));
      }

      const processedDataR = appendCharacterToLines(chunkData, "R");

      const processedData2 = appendCharacterToLines(processedDataR, "2");

      processedChunks.push(processedData2);
    }

    const concatenatedData = Buffer.concat(processedChunks);

    const outputPath = path.join(__dirname, "processedFile.txt");
    fs.writeFileSync(outputPath, concatenatedData);

    res
      .status(200)
      .json({ message: "File uploaded, processed, and saved successfully" });
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
