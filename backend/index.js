import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Use the router for API routes
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
