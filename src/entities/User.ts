import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany} from "typeorm";
import {Phone} from './Phone';
const bcrypt = require("bcrypt");

@Entity()
export class User
{
    @BeforeInsert()
    encryptPassword(){
        this.password = bcrypt.hashSync(this.password, 10);
    }

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @OneToMany(type => Phone, phone => phone.user)
    phones!: Phone[];

    checkUnencryptedPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}