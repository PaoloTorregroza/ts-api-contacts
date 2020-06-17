import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import { User } from "../entities/User";
import config from "../config/config";

class AuthController {
    static login = async (req: Request, res: Response) => {
        //Check if name and password are set
        let {email, password} = req.body;
        if (!(email && password)) {
            res.status(400).send;
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User | undefined = undefined;
        try {
            user = await  userRepository.findOneOrFail({ where: {email} });
        } catch (e) {
            res.status(401).send();
        }

        // Check if encrypted password match
        if (user != undefined && !user.checkUnencryptedPassword(password)) {
            res.status(401).send();
            return;
        }

        //Sing JWT, valid for 1 hour
        if (user != undefined) {
            const token = jwt.sign(
                {id: user.id, email: user.email},
                config.jwtSecret,
                {expiresIn: "1h"}
            );

            // Send the jwt in the response
            res.send(token);
        }
    };

    static  register = async (req: Request, res: Response) => {
        let {name, password, email} = req.body;
        if (!(name && password && email)) {
            res.status(401).send();
        }

        const userRepository = getRepository(User);
        const newUser = new User();
        newUser.name = name;
        newUser.password = password;
        newUser.email = email;
        const user = userRepository.create(newUser);
        const results = await userRepository.save(user);
        res.send(results);
    }

    static changePassword = async (req: Request, res: Response) => {
        // Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User | undefined = undefined;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            res.status(401).send();
            return;
        }

        // Check if the old passwords matchs
        if (!user.checkUnencryptedPassword(oldPassword)) {
            res.status(401).send();
            return;
        }

        if (user != undefined) {
            user.password = newPassword;
            await userRepository.save(user);

            res.status(204).send();
        }
    };
}

export default  AuthController;