import React, {useState, useEffect} from 'react';
import {Button} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import RssFeed from "./RssFeed";


const Home: React.FC = () => {
    const [rssFeedUrl, setRssFeedUrl] = useState('');
    // collection of all a user's rss feeds
    const [rssFeeds, setRssFeeds] = useState<string[]>(['']);
    // determine if we are viewing the feed URLs, or an rssFeed itself
    const [isViewingFeed, setIsViewingFeed] = useState(false);
    // URL for feed we want to view
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


    const deleteRssFeed = async (url: string) => {
        if (!userId) {
            alert("Missing user information from local storage. Try logging in again");
            return;
        }
        if (!url) {
            alert("Missing url to delete.");
            return;
        }
        try {
            await
                Axios.delete(`http://localhost:8000/deleteRssFeed/${userId}/${url}`)
                    .then(() => setRssFeeds(rssFeeds.filter(feed => feed !== url)))
        } catch (error) {
            console.error(error);
        }
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
                    gridTemplateColumns: 'repeat(3, minmax(150px, 1fr))',
                    gridGap: '20px'
                }}>
                    {rssFeeds.map((url, index) => (

                        <>
                            {/*<Button*/}
                            {/*    key={index}*/}
                            {/*    style={{*/}
                            {/*        margin: '10px 0',*/}
                            {/*        backgroundColor: "#45c3e6",*/}
                            {/*        color: "#3e3e3e",*/}
                            {/*        borderColor: "#45c3e6",*/}
                            {/*        overflow: "hidden",*/}
                            {/*        textOverflow: "ellipsis",*/}
                            {/*        whiteSpace: "nowrap"*/}
                            {/*    }}*/}
                            {/*    onClick={(() => {*/}
                            {/*        // console.log("URL URL URL: ", url);*/}
                            {/*        // setIsViewingFeed(true);*/}
                            {/*        // setViewingUrl(url);*/}
                            {/*    })}*/}
                            {/*>*/}
                            {/*    {url}*/}
                            {/*</Button>*/}
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
                                        {url}
                                    </div>
                                }
                            >
                                <Dropdown.Item
                                    onClick={() => {
                                        console.log("url url: ", url);
                                        setIsViewingFeed(true);
                                        setViewingUrl(url)
                                    }}
                                >
                                    View RSS Feed
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => deleteRssFeed(url)}
                                >
                                    Delete
                                </Dropdown.Item>
                            </DropdownButton>

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