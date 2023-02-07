import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from "./user";
@Entity()
export class Rssfeed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    name: string;

    @ManyToOne(() => User, user => user.rssFeeds)
    user: number;
}