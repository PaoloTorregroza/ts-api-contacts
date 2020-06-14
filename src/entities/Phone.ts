import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from './User';

@Entity()
export class Phone
{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    number!: string;

    @Column()
    name!: string;

    @ManyToOne(type => User, user => user.phones)
    user!: User;
}