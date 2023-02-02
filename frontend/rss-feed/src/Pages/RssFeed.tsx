import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';

type RssFeedProps = {
    url: string
}

const RssFeed = ({url}: RssFeedProps) => {
    const [feeds, setFeeds] = useState<Array<any>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const parser = new Parser();
            const feed = await parser.parseURL(url);

            setFeeds(feed.items);
        };
        fetchData().then(() => {});
    }, []);

    return (
        <div className='App-header' style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {feeds.map((feed, index) => (
                <div key={index}>
                    <h2>{feed.title}</h2>
                    <p>{feed.pubDate}</p>
                    <p>{feed.content}</p>
                    <p>{feed.creator}</p>
                </div>
            ))}
        </div>
    );
};

export default RssFeed;