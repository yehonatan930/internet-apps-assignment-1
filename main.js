const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Another example route
app.get("/api/example", (req, res) => {
  res.json({ message: "This is an example route." });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
