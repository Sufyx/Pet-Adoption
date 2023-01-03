/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState, useEffect } from 'react';
import { ListItem, UnorderedList } from '@chakra-ui/react';
import axios from 'axios';
import uuid from 'react-uuid';


export default function NewsFeed() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const [newsArray, setNewsArray] = useState([]);

    useEffect(() => {
        fetchNewsFeed();
    }, []);


    async function fetchNewsFeed() {
        const res = await axios.get(`${baseUrl}/users/news`);
        if (res.data) {
            const newsArray = res.data.news;
            setNewsArray(newsArray.reverse());
        }
    }


    return (
        <div>
            <UnorderedList>
                {newsArray.map(item =>
                    <ListItem key={uuid()}>
                        {item}
                    </ListItem>
                )}
            </UnorderedList>
        </div>
    )
}
