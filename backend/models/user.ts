import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Rssfeed} from "./rssfeed";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Rssfeed, rssFeed => rssFeed.user)
    rssFeeds: Rssfeed[];
}