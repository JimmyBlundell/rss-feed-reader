import { getRepository, getConnection } from 'typeorm';
import { Rssfeed } from '../models/rssfeed';
import rssfeed from "../routes/rssfeed";

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
    const user = req.params.user;
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
    const user = req.params.user;
    let url = req.params.url;
    if (!user || ! url) {
        res.status(400).send('Missing user info and/or url');
    }
    // url was encoded on frontend, so decode it here
    url = Buffer.from(url, 'base64').toString('utf8');
    try {
        const rssFeedRepository = getRepository(Rssfeed);
        const existingRssFeed = await rssFeedRepository.findOne({where: {url: url, user: user}})
        if (!existingRssFeed) {
            return;
        }
        await rssFeedRepository.delete({user, url});
        res.status(200).json({message: "RSS Feed deleted successfully!"});
    } catch (error: any) {
        console.log("Error on delete: ", error.message);
        res.send(error);
    }
}