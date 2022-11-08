/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 15/08/2022
 * Asaf Gilboa
*/


import PetCard from './PetCard';
import { React, useState, useEffect } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';


export default function PetSearchResults({ searchParams }) {
    const baseUrl = "http://localhost:6060";
    const [searchRes, setSearchRes] = useState([]);


    useEffect(() => {
        fetchPets();
    }, [searchParams]);


    async function fetchPets() {
        try {
            const res = await axios.get(`${baseUrl}/pet`,
                { params: { searchParams: searchParams } });
            setSearchRes(res.data);
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }


    return (
        <Box m="1%" rounded='md' w="80%" >
            <Grid templateColumns='repeat(4, 1fr)' gap={5} >
                {searchRes.map(pet =>
                    <GridItem key={pet._id}>
                        <PetCard pet={pet} />
                    </GridItem>
                )}
            </Grid>
        </Box>
    )
}
