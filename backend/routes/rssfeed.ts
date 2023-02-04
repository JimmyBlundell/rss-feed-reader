import { Router } from 'express';
import { addRssFeed, deleteRssFeed, getFeeds } from '../controllers/rssfeed';

const router = Router();

router.post('/addRssFeed', addRssFeed);
router.delete('/deleteRssFeed/:user/:url', deleteRssFeed);
router.get('/getFeeds/:user', getFeeds);

export default router;