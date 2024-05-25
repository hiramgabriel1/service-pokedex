import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import routerPokemon from "./routes/pokemon.routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { database } from "./config/connection.db";

dotenv.config();
database();

const server = express();
const PORT = process.env.PORT;
const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "limite de peticiones excedido",
});

const swaggerDocumentPath = path.join(__dirname, "config", "swagger.yaml");
const swaggerDocument = YAML.load(swaggerDocumentPath);

server.use(express.json());
server.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
        maxAge: 86400,
    })
);

// todo: middlewares & logger
server.use(rateLimitMiddleware);
server.use(morgan("dev"));

// todo: endpoints here
server.use(routerPokemon);
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const bootstrap = () => {
    server.listen(PORT || 4000);
    console.log(`http://localhost:${PORT}`);
};

bootstrap();
