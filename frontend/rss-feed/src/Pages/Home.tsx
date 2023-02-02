import React, {useState, useEffect} from 'react';
import {Button} from "react-bootstrap";
import Axios from 'axios';

const Home: React.FC = () => {
    const [rssFeedUrl, setRssFeedUrl] = useState('');
    const [rssFeeds, setRssFeeds] = useState<string[]>(['']);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    const userId = userInfo.id;

    const fetchData = async () => {
        try {
            const {data} = await Axios.get(`http://localhost:8000/getFeeds/${userId}`, {
            });
            const userFeedUrls: string[]= [];
            data.map((feed: { id: string, url: string; }) => userFeedUrls.push(feed.url));
            setRssFeeds(userFeedUrls);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log("hit use effect");
        fetchData().then(() => console.log("Fetched user rss feeds on page load"));
    }, []);

    const addRssFeed = async () => {
        if (!userId) {
            alert("Missing user information from local storage. Try logging in again");
            return;
        }
        try {
            await Axios.post('http://localhost:8000/addRssFeed', {
                user: userId,
                url: rssFeedUrl,
            }).then(() => setRssFeeds([...rssFeeds, rssFeedUrl]));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='App-header' style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div className={"url-card"}>
                <input type="text" placeholder="Enter any RSS Feed URL" value={rssFeedUrl}
                       onChange={(e) => setRssFeedUrl(e.target.value)}/>
                <br/>
                <Button onClick={addRssFeed}>Save RSS Feed</Button>
            </div>
        </div>
    );
};

export default Home;