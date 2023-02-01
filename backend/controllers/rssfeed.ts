import { getRepository } from 'typeorm';
import { Rssfeed } from '../models/rssfeed';

export async function addRssFeed(req: any, res: any) {
    const {user, url} = req.body;
    if (!user || ! url) {
        res.status(400).send('Missing user info and/or url');
    }
    try {
        const rssFeedRepository = getRepository(Rssfeed);
        const existingRssFeed = await rssFeedRepository.findOne({where: {url: url, userId: user}})

        if (existingRssFeed) {
            return res.status(409).send("RSS Feed is already saved.");
        }
        const newRssFeed = rssFeedRepository.create({user, url});
        await rssFeedRepository.save(newRssFeed);



    } catch(error: any) {
        console.log("Error: ", error.message);
        res.send(error);
    }
}

export async function deleteRssFeed(req: any, res: any) {

}