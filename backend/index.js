const connectToMongo = require("./db");
const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/auth");

const app = express(); // Define app before using it
const port = 5000;

connectToMongo();

app.use(cors()); // Use cors middleware

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});