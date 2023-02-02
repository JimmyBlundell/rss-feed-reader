import React, { useState } from 'react';
import Axios from 'axios';

const Home: React.FC = () => {
    const [rssFeedUrl, setRssFeedUrl] = useState('');

    const handleAddButtonClick = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
        const userId = userInfo.id;

        try {
            const response = await Axios.post('http://localhost:8000/addRssFeed', {
                user: userId,
                url: rssFeedUrl,
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <input type="text" placeholder="Enter RSS Feed URL" value={rssFeedUrl} onChange={(e) => setRssFeedUrl(e.target.value)} />
            <br />
            <button onClick={handleAddButtonClick}>Add</button>
        </div>
    );
};

export default Home;