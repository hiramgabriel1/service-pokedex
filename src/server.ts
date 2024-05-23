import express from "express"
import cors from "cors"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import { database } from "./config/connection.db"

dotenv.config()
database()

const server = express()
const PORT = process.env.PORT
const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "limite de peticiones excedido"
})

server.use(express.json())
server.use(cors({
    origin: "https://pokedex.vercel.app",
    methods: ["POST", "GET"],
    maxAge: 86400 
}))

// todo: middlewares & logger
server.use(rateLimitMiddleware)
server.use(morgan("dev"))

// todo: endpoints here
// server.use()

const bootstrap = () => {
    server.listen(PORT)
    console.log(`http://localhost:${PORT}`);
}

bootstrap()
