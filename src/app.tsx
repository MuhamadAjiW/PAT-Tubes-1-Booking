import { Express, Request, Response } from "express";
import express from 'express';
import { SERVER_PORT } from "./config";

require("express-async-errors")

export class App{
    server: Express;

    constructor(){
        this.server = express();
        this.server.get('/', (req: Request, res: Response) => {
            res.send(`Server setup at ${SERVER_PORT}`);
        });
    }

    run () {
        process.on("uncaughtException", (error) =>{
            console.error("Server encountered an uncaught error: ", error);
            console.log("\n\nServer continues running");
        })

        this.server.listen(SERVER_PORT, () =>{
            console.log(`Server setup at ${SERVER_PORT}`);
        });
    }
}