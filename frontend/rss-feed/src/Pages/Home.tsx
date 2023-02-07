import React, {useState, useEffect} from 'react';
import {Button, Dropdown, DropdownButton} from "react-bootstrap";
import Axios from 'axios';
import RssFeed from "./RssFeed";

const Home: React.FC = () => {
    const [rssFeedUrl, setRssFeedUrl] = useState('');
    const [rssFeedName, setRssFeedName] = useState('');
    // collection of all a user's rss feeds
    const [rssFeeds, setRssFeeds] = useState<{name: string, url: string}[]>([{name: '', url: ''}]);
    // determine if we are viewing the feed URLs, or results of an rssFeed itself
    const [isViewingFeed, setIsViewingFeed] = useState(false);
    // URL for feed we want to view - will use this to fetch feed data
    const [viewingUrl, setViewingUrl] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    const userId = userInfo?.id;



    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                try {
                    const {data} = await Axios.get(`http://localhost:8000/getFeeds/${userId}`, {});
                    const userFeedInfo: {name: string, url: string }[] = [];

                    for (let i = 0; i< data.length; i++){
                        const entry = {name: data[i].name, url: data[i].url}
                        userFeedInfo.push(entry);
                    }
                    setRssFeeds(userFeedInfo);
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                return;
            }
        }
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
                name: rssFeedName,
                url: rssFeedUrl,
            }).then(() => setRssFeeds([...rssFeeds, {name: rssFeedName, url: rssFeedUrl}]));
        } catch (error) {
            console.error(error);
        }
    };

    const rssFeedInfoValidation = (name: string, url: string) => {
        return name.length > 0 && url.length > 0;
    }


    const deleteRssFeed = async (url: string) => {
        if (!userId) {
            alert("Missing user information from local storage. Try logging in again");
            return;
        }
        if (!url) {
            alert("Missing url to delete.");
            return;
        }
        // Encode the url so that the '/' characters don't interfere with routes when passing urls
        const encodedUrl: string = Buffer.from(url, 'utf8').toString('base64');

        try {
            await
                Axios.delete(`http://localhost:8000/deleteRssFeed/${userId}/${encodedUrl}`)
                    .then(() => {
                            setRssFeeds(rssFeeds.filter(feed => feed.url !== url));
                            alert(`Successfully deleted ${url} from your feeds`);
                        }
                    )
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='App-header' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {!isViewingFeed &&
            <div className={"url-card"} style={{position: "absolute", top: "60px"}}>
                <input type="text" placeholder="Enter a name for your RSS feed" value={rssFeedName}
                       onChange={(e) => setRssFeedName(e.target.value)}
                />
                <br/>
                <input type="text" placeholder="Enter any RSS Feed URL" value={rssFeedUrl}
                       onChange={(e) => setRssFeedUrl(e.target.value)}
                />
                <br/>
                <Button
                    style={{
                        backgroundColor: "#45c3e6",
                        color: "#3e3e3e",
                        borderColor: "#45c3e6",
                    }}
                    onClick={addRssFeed}
                    disabled={!rssFeedInfoValidation(rssFeedName, rssFeedUrl)}
                >
                    Save RSS Feed
                </Button>
                <br/>
                <hr/>
                <br/>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))",
                    gridGap: '20px'
                }}>
                    {rssFeeds.map((feed, index) => (
                        <>
                            <div className={"grid-cell"}>
                                <DropdownButton
                                    key={index}
                                    id="dropdown-basic-button"
                                    title={
                                        <div style={{
                                            maxWidth: '250px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {feed.name}
                                        </div>
                                    }
                                >
                                <Dropdown.Item
                                    onClick={() => {
                                        setIsViewingFeed(true);
                                        setViewingUrl(feed.url)
                                    }}
                                >
                                    View RSS Feed
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => deleteRssFeed(feed.url)}
                                >
                                    Delete
                                </Dropdown.Item>
                            </DropdownButton>
                            </div>
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