import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express';
import { Request, Response } from "express";
import * as bodyParser from 'body-parser';
import {Phone} from './entities/Phone';
import {User} from './entities/User';
import routes from './routes';

createConnection({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "dev",
    password: "",
    database: "tscrud",
    entities: [Phone, User],
    synchronize: true,
    logging: false
}).then(async connection => {
    const app = express();

    // Call midlewares
    app.use(bodyParser.json());

    app.get('/', function (req: Request, res: Response) {
        res.send("Root route");
    });

    // Set index
    app.use("/", routes);

    // start express server
    app.listen(4000, () => console.log("Server at localhost:4000"));
}).catch(error => console.log(error));