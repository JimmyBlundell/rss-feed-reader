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
exports.deleteRssFeed = exports.addRssFeed = void 0;
const typeorm_1 = require("typeorm");
const rssfeed_1 = require("../models/rssfeed");
function addRssFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, url } = req.body;
        if (!user || !url) {
            res.status(400).send('Missing user info and/or url');
        }
        try {
            const rssFeedRepository = (0, typeorm_1.getRepository)(rssfeed_1.Rssfeed);
            const existingRssFeed = yield rssFeedRepository.findOne({ where: { url: url, userId: user } });
            if (existingRssFeed) {
                return res.status(409).send("RSS Feed is already saved.");
            }
            const newRssFeed = rssFeedRepository.create({ user, url });
            yield rssFeedRepository.save(newRssFeed);
        }
        catch (error) {
            console.log("Error: ", error.message);
            res.send(error);
        }
    });
}
exports.addRssFeed = addRssFeed;
function deleteRssFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.deleteRssFeed = deleteRssFeed;
