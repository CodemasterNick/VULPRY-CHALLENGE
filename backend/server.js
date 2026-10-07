const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const vulnerabilityRoutes = require("./routes/vulnerabilityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(applicationRoutes);
app.use("/vulnerabilidades", vulnerabilityRoutes);

app.get("/", (req, res) => {
    res.send("API da VULPRY funcionando");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});