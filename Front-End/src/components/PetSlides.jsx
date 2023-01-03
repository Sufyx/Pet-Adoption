/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState, useEffect } from 'react';
import {
    Box, Heading, Image
} from '@chakra-ui/react';
import axios from 'axios';
import uuid from 'react-uuid';


export default function PetSlides() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;

    const [petPics, setPetPics] = useState([]);
    // const [slideInterval, setSlideInterval] = useState('');
    const [slide, setSlide] = useState("https://www.chatelaine.com/wp-content/uploads/2010/11/de81b2c54b7e8d14f9fb65d1363d.jpeg");

    useEffect(() => {
        fetchSlides();
        return () => {
            clearIntervals();
        }
    }, []);

    useEffect(() => {
        activateSlides();
    }, [petPics]);


    function clearIntervals() {
        const interval_id = window.setInterval(
            function () { }, Number.MAX_SAFE_INTEGER);
        for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }
    }

    async function fetchSlides() {
        const res = await axios.get(`${baseUrl}/pet`,
            { params: { searchParams: {} } });
        const petsData = [...res.data];
        const pics = [];
        for (let i = 0; i < petsData.length; i++) {
            if (petsData[i].picture) {
                pics.push(petsData[i].picture);
            }
        }

        pics.sort((a, b) => 0.5 - Math.random());
        setPetPics(pics);
    }

    function activateSlides() {
        clearIntervals();
        if (petPics.length === 0) return;
        console.log("petPics.length ", petPics.length);

        let index = 0;
        const currentInterval = setInterval(function () {
            console.log("slide ", slide);
            console.log("index ", index);
            setSlide(petPics[index]);
            index++;
            if (index > petPics.length - 1) {
                index = 0;
            }
        }, 5000);

        // if (slideInterval !== currentInterval) {
        //     clearInterval(slideInterval);
        // }
        // setSlideInterval(currentInterval);
    }


    return (
        <Box align="center" h="100%" w="100%" >
            < Heading className='slideHeader' >
                Our pets
            </ Heading >
            <Image borderRadius='6px' src={slide} alt='pet picture' className='slideImg imageFrame fadeIn'
                fallbackSrc='https://media.istockphoto.com/id/884276082/photo/turquoise-blue-sheepskin-rug-background.jpg?s=612x612&w=0&k=20&c=K5YSza-nWWUKejPd1v_QGr8GbRZ9fxvFLKfAsUOSFLw='
                fit="contain" maxH="100%" maxW="100%" />
        </Box>
    )
}
