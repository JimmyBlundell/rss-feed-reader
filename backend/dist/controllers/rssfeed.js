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
        const { user, url } = req.body;
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
            const newRssFeed = rssFeedRepository.create({ user, url });
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
        console.log("-----req structure----- ", req.params);
        const user = req.params.user;
        console.log("-----user----- ", user);
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
    });
}
exports.deleteRssFeed = deleteRssFeed;
