import {Request, Response, NextFunction} from "express";
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["auth"];
    let jwtPayload;
    
    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    } catch (error) {
        // If token is not valid respond whit 401 (unauthorized)
        res.status(401).send("Invalid token");
        return;
    }

    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { id, name } = jwtPayload;
    const newToken = jwt.sign({ id, name }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    // Call the nex middleware or controller
    next();
}