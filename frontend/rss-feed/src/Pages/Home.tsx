import React, {useState, useEffect} from 'react';
import {Button} from "react-bootstrap";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import RssFeed from "./RssFeed";

const Home: React.FC = () => {
    const [rssFeedUrl, setRssFeedUrl] = useState('');
    const [rssFeeds, setRssFeeds] = useState<string[]>(['']);
    const [isViewingFeed, setIsViewingFeed] = useState(false);
    const [viewingUrl, setViewingUrl] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    const userId = userInfo.id;

    const fetchData = async () => {
        try {
            const {data} = await Axios.get(`http://localhost:8000/getFeeds/${userId}`, {});
            const userFeedUrls: string[] = [];
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

    const urlValidation = (url: string) => {
        return url.length > 0;
    }

    return (
        <div className='App-header' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {!isViewingFeed &&
            <div className={"url-card"} style={{position: "fixed", top: "60px"}}>
                <input type="text" placeholder="Enter any RSS Feed URL" value={rssFeedUrl}
                       onChange={(e) => setRssFeedUrl(e.target.value)}/>
                <br/>
                <Button
                    style={{
                        backgroundColor: "#45c3e6",
                        color: "#3e3e3e",
                        borderColor: "#45c3e6",
                    }}
                    onClick={addRssFeed}
                    disabled={!urlValidation(rssFeedUrl)}
                >
                    Save RSS Feed
                </Button>
                <br/>
                <hr/>
                <br/>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gridGap: '20px'
                }}>
                    {rssFeeds.map((url, index) => (

                        <>
                            {console.log("index, url: ", index, url)}
                            <Button
                                key={index}
                                style={{
                                    margin: '10px 0',
                                    backgroundColor: "#45c3e6",
                                    color: "#3e3e3e",
                                    borderColor: "#45c3e6",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                                onClick={(() => {
                                    console.log("URL URL URL: ", url);
                                    setIsViewingFeed(true);
                                    setViewingUrl(url);
                                })}
                            >
                                {url}
                            </Button>
                        </>
                    ))}
                </div>
            </div>
            }
            {viewingUrl && <RssFeed url={viewingUrl}/>}
        </div>
    );
};

export default Home;