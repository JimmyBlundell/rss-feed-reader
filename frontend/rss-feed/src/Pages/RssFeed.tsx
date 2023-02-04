import React, {useState, useEffect} from 'react';
import {Button, Card, Dropdown, DropdownButton} from "react-bootstrap";
import Parser from 'rss-parser';
import striptags from "striptags";

type RssFeedProps = {
    url: string
}

const goToLink = (url: string) => {
    window.location.href = url;
}

// helper function to sort feeds based on a criteria the user selects
// const sortFeeds = (feed: Array<any>, sortCriteria: string): any => {
//     const sortedFeeds = feed.sort((a, b) => {
//         // sort by date
//         if (sortCriteria === 'date') {
//             return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
//         }
//
//         // sort by title
//         if (sortCriteria === 'title') {
//             return a.title.localeCompare(b.title);
//         }
//
//         // sort by description
//         if (sortCriteria === 'description') {
//             return a.description.localeCompare(b.description);
//         }
//
//         // return feeds in original order by default
//         return 0;
//     });
// }

const RssFeed = ({url}: RssFeedProps) => {

    // will run into cors errors if this is not prepended on the rss feed url
    // TODO: find better way to proxy
    const proxy = "https://cors-anywhere.herokuapp.com/";

    // state to keep track of how we sort the feeds
    const [selectedSortCriteria, setSelectedSortCriteria] = useState<string>("pubDate");
    const [feeds, setFeeds] = useState<Array<any>>([]);

    // fetch new content each time url changes
    useEffect(() => {
        const fetchData = async () => {
            const parser = new Parser();
            const feed = await parser.parseURL(`${proxy}${url}`);
            const sortedFeeds = feed.items.sort((a, b) => {
                // sort by date
                if (selectedSortCriteria === 'date') {
                    // @ts-ignore
                    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
                }

                // sort by title
                if (selectedSortCriteria === 'title') {
                    // @ts-ignore
                    return a.title.localeCompare(b.title);
                }

                // sort by description
                if (selectedSortCriteria === 'description') {
                    return a.contentSnippet && b.contentSnippet ? a.contentSnippet.localeCompare(b.contentSnippet) : 0;
                }

                // by default, return the feed items in their original order
                return 0;
            });

            setFeeds(sortedFeeds);
        }
        fetchData().then(() => {
        });
    }, [url, selectedSortCriteria]);


    return (
        <div style={{width: "80%"}}>
            <DropdownButton style={{marginBottom: "20px"}} title={"Sort Feeds By:"}>
                <Dropdown.Item
                    onClick={() => {
                        setSelectedSortCriteria("pubDate");
                    }}
                >
                    Published Date
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => {
                        setSelectedSortCriteria("title");
                    }}
                >
                    Title
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => {
                        setSelectedSortCriteria("description");
                    }}
                >
                    Description
                </Dropdown.Item>

            </DropdownButton>
            {feeds.map((feed, index) => {
                let image = null;
                if (feed.enclosure && feed.enclosure.url) {
                    image = <img src={feed.enclosure.url} alt={feed.title} height={"200"} width={"200"}/>
                }
                return (
                    <Card style={{marginBottom: "15px"}} key={index}>
                        <Card.Title style={{padding: "20px"}}>{feed.title}</Card.Title>
                        <Card.Title style={{padding: "20px"}}>{feed.pubDate}</Card.Title>
                        {image}
                        <Card.Body>
                            <p>{feed.description}</p>
                            <p>{feed.contentSnippet}</p>
                            <p>{feed.creator}</p>
                            <Button variant="primary" onClick={() => {goToLink(feed.link)}}>
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