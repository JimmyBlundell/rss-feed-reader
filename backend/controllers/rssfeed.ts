import { getRepository } from 'typeorm';
import { Rssfeed } from '../models/rssfeed';

export async function addRssFeed(req: any, res: any) {
    const {user, url} = req.body;
    console.log("addRssFeed hit with: ", {user, url});
    if (!user || ! url) {
        res.status(400).send('Missing user info and/or url');
    }
    try {
        const rssFeedRepository = getRepository(Rssfeed);
        const existingRssFeed = await rssFeedRepository.findOne({where: {url: url, user: user}})

        if (existingRssFeed) {
            return res.status(409).send("RSS Feed is already saved.");
        }
        const newRssFeed = rssFeedRepository.create({user, url});
        console.log("------newRssFeed-------", newRssFeed);
        await rssFeedRepository.save(newRssFeed);
        res.status(200).json({
            message: "RSS Feed added successfully!",
            rssFeed: newRssFeed
        });
    } catch(error: any) {
        console.log("Error: ", error.message);
        res.send(error);
    }
}

export async function getFeeds(req: any, res: any) {
    console.log("-----req structure----- ", req.params);
    const user = req.params.user;
    console.log("-----user----- ", user);
    if (!user) {
        res.status(400).send('Missing user info - please log in and try again');
        return;
    }
    try {
        const rssFeeds = await getRepository(Rssfeed).find({where: {user}});
        res.json(rssFeeds);
    } catch (err: any) {
        console.log("Error: ", err.message);
        res.send(err);
    }
}

export async function deleteRssFeed(req: any, res: any) {

}