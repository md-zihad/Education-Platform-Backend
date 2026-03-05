import "reflect-metadata";
import app from "./app.js";
import { AppDataSource } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startServer();