import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { User } from "./user";
@Entity()
export class Rssfeed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => User)
    @JoinColumn({name: "userId"})
    user: User;
}