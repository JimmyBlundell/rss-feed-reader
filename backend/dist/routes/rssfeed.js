"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rssfeed_1 = require("../controllers/rssfeed");
const router = (0, express_1.Router)();
router.post('/addRssFeed', rssfeed_1.addRssFeed);
router.delete('/deleteRssFeed/:user/:url', rssfeed_1.deleteRssFeed);
router.get('/getFeeds/:user', rssfeed_1.getFeeds);
exports.default = router;
