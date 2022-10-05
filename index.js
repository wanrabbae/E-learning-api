require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes/routes");
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/assets", express.static("assets"));

try {
  db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "root",
  });
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`App run on http://localhost:${PORT}`);
});
