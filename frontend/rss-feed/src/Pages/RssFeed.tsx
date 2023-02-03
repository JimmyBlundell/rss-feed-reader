import React, {useState, useEffect} from 'react';
import Parser from 'rss-parser';
import striptags from "striptags";

type RssFeedProps = {
    url: string
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
        <div className='App-header' style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {feeds.map((feed, index) => (
                <div
                    key={index}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gridGap: '20px'
                    }}>
                    <h2 style={{color: "red"}}>{feed.title}</h2>
                    <p style={{color: "red"}}>{feed.pubDate}</p>
                    <p style={{color: "red"}}>{feed.contentSnippet}</p>
                    <p style={{color: "red"}}>{feed.creator}</p>
                    <p style={{color: "red"}}>{feed.guid}</p>
                </div>
            ))}
        </div>
    );
}

export default RssFeed;