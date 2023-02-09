/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState, useEffect, useContext } from 'react';
import { Heading, Image } from '@chakra-ui/react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import UsersContext from '../context/UsersContext';


export default function PetSlides() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const { userLogged } = useContext(UsersContext);

    const [petPics, setPetPics] = useState([]);
    const [slide, setSlide] = useState("https://www.chatelaine.com/wp-content/uploads/2010/11/de81b2c54b7e8d14f9fb65d1363d.jpeg");
    const [slideCaption, setSlideCaption] = useState('');
    const [slidePetId, setSlidePetId] = useState('');

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
        try {
            const res = await axios.get(`${baseUrl}/pet`,
            { params: { searchParams: {} } });
            const petsData = [...res.data];
            const slides = [];
            for (let i = 0; i < petsData.length; i++) {
                if (petsData[i].picture) {
                    slides.push({
                        pic: petsData[i].picture,
                        caption: petsData[i].name,
                        petId: petsData[i]._id
                    });
                }
            }
            slides.sort((a, b) => 0.5 - Math.random());
            setPetPics(slides);
        }  catch (err) {
            console.error("Slides fetch error: " + err.message);
        }
    }

    function activateSlides() {
        clearIntervals();
        if (petPics.length === 0) return;
        let index = 0;
        const currentInterval = setInterval(function () {
            setSlide(petPics[index].pic);
            setSlideCaption(petPics[index].caption);
            setSlidePetId(petPics[index].petId);
            index++;
            if (index > petPics.length - 1) {
                index = 0;
            }
        }, 5000);

    }


    return (
        <NavLink to={userLogged ? `/pet?petId=${slidePetId}` : ``}
            align="center" h="100%" w="100%" position="relative"
            className='petSlidesContainer'>
                < Heading className='slideHeader' >
                    Our pets
                </ Heading >
                <Image borderRadius='6px' src={slide} alt='pet picture' className='imageFrame fadeIn'
                fallbackSrc='https://media.istockphoto.com/id/884276082/photo/turquoise-blue-sheepskin-rug-background.jpg?s=612x612&w=0&k=20&c=K5YSza-nWWUKejPd1v_QGr8GbRZ9fxvFLKfAsUOSFLw='
                fit="contain" maxH="100%" maxW="100%" m="auto" />
                < Heading className='slideCaption' >
                    {slideCaption}
                </ Heading >
        </NavLink>
    )
}
