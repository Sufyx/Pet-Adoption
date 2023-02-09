/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import PetCard from './PetCard';
import { React, useState, useEffect } from 'react';
import { Box, Grid, GridItem, useToast } from '@chakra-ui/react';
import axios from 'axios';


export default function PetSearchResults({ searchParams, toggleSpinner }) {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const [searchRes, setSearchRes] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchPets();
    }, [searchParams]);


    async function fetchPets() {
        toggleSpinner(true);
        try {
            const res = await axios.get(`${baseUrl}/pet`,
                { params: { searchParams: searchParams } });
            setSearchRes(res.data);
        } catch (err) {
            toast({
                title: 'Something went wrong',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            console.error("Search results fetch error: " + err.message);
        }
        toggleSpinner(false);
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
