import {Router, Request, Response} from "express";
import {getRepository} from "typeorm";
import { checkJwt } from "../middlewares/checkJwt";
import { User } from '../entities/User';
import {Phone} from "../entities/Phone";
import {decodeJwt}from '../utils/decodeJwt';

const router = Router();

router.get("/", checkJwt, async function (req: Request, res: Response) {
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    res.json(users);
});

router.get('/phones', checkJwt, async function (req: Request, res: Response) {
    let token = decodeJwt(<string>req.headers["auth"]);
    const phoneRepository = getRepository(Phone);
    const phones = await phoneRepository.find({where: {user: token.id}});

    res.json(phones);
})

router.get("/:id", checkJwt, async function (req: Request, res: Response) {
    const userRepository = getRepository(User);
    const results = await userRepository.findOne(req.params.id);

    return res.send(results);
});

router.put("/put", checkJwt, async function (req: Request, res: Response) {
    let token = decodeJwt(<string>req.headers["auth"]);

    const userRepository = getRepository(User);
    const user = await userRepository.findOne(token.id);

    if (user != undefined) {
        userRepository.merge(user, req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    } else {
        return res.send("User don't exists");
    }
});

router.delete("/delete", checkJwt, async function (req: Request, res: Response) {
    let token = decodeJwt(<string>req.headers["auth"]);

    const userRepository = getRepository(User);
    const results = await userRepository.delete(token.id);

    return res.send(results);
});

router.post("/add-phone/", checkJwt, async function (req: Request, res: Response) {
    let token = decodeJwt(<string>req.headers["auth"]);

    const phoneRepository = getRepository(Phone);
    const newPhone = new Phone();

    newPhone.name = req.body.name;
    newPhone.number = req.body.number;
    newPhone.user = token.id;

    const phone = await phoneRepository.create(newPhone);
    const results = await phoneRepository.save(phone);

    return res.send(results);
});

export default router;