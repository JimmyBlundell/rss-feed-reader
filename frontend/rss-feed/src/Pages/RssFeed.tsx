import React, {useState, useEffect} from 'react';
import {Button, Card} from "react-bootstrap";
import Parser from 'rss-parser';
import striptags from "striptags";

type RssFeedProps = {
    url: string
}

const goToLink = (url: string) => {
    window.location.href = url;
}


const RssFeed = ({url}: RssFeedProps) => {

    // will run into cors errors if this is not prepended on the rss feed url
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const [feeds, setFeeds] = useState<Array<any>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const parser = new Parser();
            const feed = await parser.parseURL(`${proxy}${url}`);
            console.log("feed: ", feed);
            const cleanedItems = feed.items.map((item: any) => {
                // get rid of html tags like <br>
                item.contentSnippet = striptags(item.contentSnippet);
                //get rid of html entities like &nbsp
                item.contentSnippet.replace(/(&nbsp;|<([^>]+)>)/ig, "");
                return item;
            });
            setFeeds(cleanedItems);
        }
        fetchData().then(() => {
        });
    }, [url])


    return (
        <div className="feed-page">
            {feeds.map((feed, index) => {
                return (
                    <Card key={index}>
                        <Card.Title style={{padding: "20px"}}>{feed.title}</Card.Title>
                        <Card.Body>
                            <p>{feed.description}</p>
                            <p>{feed.contentSnippet}</p>
                            <Button variant="primary" onClick={goToLink.bind(this, feed.link)}>
                                Open
                            </Button>{" "}
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
    );
}

export default RssFeed;