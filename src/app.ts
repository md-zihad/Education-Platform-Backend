import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);


app.get('/', (_req, res) => {
    res.json({
        message: 'Welcome to Education Platform API',
        version: '1.0.0'
    });
});

export default app;