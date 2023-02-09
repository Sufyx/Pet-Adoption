/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState, useEffect } from 'react';
import { Box, ListItem, UnorderedList, Text } from '@chakra-ui/react';
import axios from 'axios';
import uuid from 'react-uuid';


export default function NewsFeed() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const [newsArray, setNewsArray] = useState([]);

    useEffect(() => {
        fetchNewsFeed();
    }, []);


    async function fetchNewsFeed() {
        try {
            const res = await axios.get(`${baseUrl}/users/news`);
            if (res.data) {
                const dataArray = res.data.news;
                const newsArray = [];
                for (let i = 0; i < dataArray.length; i++) {
                    const timeStamp = dataArray[i].slice(0, dataArray[i].indexOf('[#]'));
                    const newsLine = dataArray[i].slice(dataArray[i].indexOf('[#]') + 3,
                    dataArray[i].length);
                    newsArray.push({
                        timeStamp: timeStamp,
                        newsLine: newsLine
                    });
                }
                setNewsArray(newsArray.reverse());
            }
        }  catch (err) {
            console.error("News feed fetch error: " + err.message);
        }
    }


    return (
        <Box >
            <UnorderedList pl="1%">
                {newsArray.map(item =>
                    <ListItem key={uuid()}>
                        <Text fontSize="0.9vw">
                            {item.timeStamp}
                        </Text>
                        <Text fontSize="1.1vw">
                            {item.newsLine}
                        </Text>
                    </ListItem>
                )}
            </UnorderedList>
        </Box>
    )
}
