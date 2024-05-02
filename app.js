const express = require("express");
const fs = require("fs");
const app = express();
// const multer = require("multer");

app.use(express.json());

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

app.post("/uploadFile", (req, res, next) => {
  req.on("data", (chunk) => {
    const singleChunk = Math.floor(chunk.length / 5);
    const data = [];
    for (let i = 0; i <= chunk.length; i += singleChunk) {
      const dividedChunks = chunk.slice(i, i + singleChunk);
      data.push(dividedChunks);
    }

    fs.writeFileSync("uploadedFile.txt", chunk);
  });

  res.status(200).json({
    sttaus: "success",
    data: req.body,
  });
});

app.listen(1337, () => {
  console.log("server is running in Port 1337");
});
