"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rssfeed_1 = require("../controllers/rssfeed");
const router = (0, express_1.Router)();
router.post('/addRssFeed', rssfeed_1.addRssFeed);
router.post('/deleteRssFeed', rssfeed_1.deleteRssFeed);
router.get('/getFeeds', rssfeed_1.getFeeds);
exports.default = router;
