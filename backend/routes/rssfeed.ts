import { Router } from 'express';
import { addRssFeed, deleteRssFeed, getFeeds } from '../controllers/rssfeed';

const router = Router();

router.post('/addRssFeed', addRssFeed);
router.post('/deleteRssFeed', deleteRssFeed);
router.get('/getFeeds', getFeeds);

export default router;