require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const app = require("./app");

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
