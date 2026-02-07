const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log("server on", PORT)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
