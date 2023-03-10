"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRssFeed = exports.getFeeds = exports.addRssFeed = void 0;
const typeorm_1 = require("typeorm");
const rssfeed_1 = require("../models/rssfeed");
function addRssFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, name, url } = req.body;
        console.log("addRssFeed hit with: ", { user, url });
        if (!user || !url) {
            res.status(400).send('Missing user info and/or url');
        }
        try {
            const rssFeedRepository = (0, typeorm_1.getRepository)(rssfeed_1.Rssfeed);
            const existingRssFeed = yield rssFeedRepository.findOne({ where: { url: url, user: user } });
            if (existingRssFeed) {
                return res.status(409).send("RSS Feed is already saved.");
            }
            const newRssFeed = rssFeedRepository.create({ user, name, url });
            console.log("------newRssFeed-------", newRssFeed);
            yield rssFeedRepository.save(newRssFeed);
            res.status(200).json({
                message: "RSS Feed added successfully!",
                rssFeed: newRssFeed
            });
        }
        catch (error) {
            console.log("Error: ", error.message);
            res.send(error);
        }
    });
}
exports.addRssFeed = addRssFeed;
function getFeeds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.params.user;
        if (!user) {
            res.status(400).send('Missing user info - please log in and try again');
            return;
        }
        try {
            const rssFeeds = yield (0, typeorm_1.getRepository)(rssfeed_1.Rssfeed).find({ where: { user } });
            res.json(rssFeeds);
        }
        catch (err) {
            console.log("Error: ", err.message);
            res.send(err);
        }
    });
}
exports.getFeeds = getFeeds;
function deleteRssFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.params.user;
        let url = req.params.url;
        if (!user || !url) {
            res.status(400).send('Missing user info and/or url');
        }
        // url was encoded on frontend, so decode it here
        url = Buffer.from(url, 'base64').toString('utf8');
        try {
            const rssFeedRepository = (0, typeorm_1.getRepository)(rssfeed_1.Rssfeed);
            const existingRssFeed = yield rssFeedRepository.findOne({ where: { url: url, user: user } });
            if (!existingRssFeed) {
                return;
            }
            yield rssFeedRepository.delete({ user, url });
            res.status(200).json({ message: "RSS Feed deleted successfully!" });
        }
        catch (error) {
            console.log("Error on delete: ", error.message);
            res.send(error);
        }
    });
}
exports.deleteRssFeed = deleteRssFeed;
