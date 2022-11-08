/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 28/08/2022
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import { Box, Image, Flex, Button, Divider } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import PetSettings from "./PetSettings"
import UsersPage from './UsersPage';
import PetsTable from './PetsTable';
import axios from 'axios';
import UsersContext from '../context/UsersContext';
import Search from './Search';

export default function Dashboard() {
    const baseUrl = "http://localhost:6060";
    const navigate = useNavigate();

    const { userLogged } = useContext(UsersContext);
    const [activeTab, setActiveTab] = useState("users");


    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
        } else {
            verifyAdmin();
        }
    }, []);


    async function verifyAdmin() {
        const { token } = JSON.parse(localStorage.getItem('loggedUser'));
        const res = await axios.get(`${baseUrl}/users/${userLogged._id}`,
            { headers: { authorization: `Bearer ${token}` } });
        const user = res.data.user;
        console.log("verifyAdmin user ", user);
        if (!user.isAdmin) {
            navigate("/home");
        }
    }


    const petsTab =
        // <><Search dashboard={true} /></>
        <><PetsTable /></>

    const usersTab =
        <><UsersPage /></>

    const addPetTab =
        <><PetSettings newPet={true} /></>


    return (
        <div className="dashBoardContainer">
            <Flex flexDir="column">
                <Flex justify='center' >
                    <Button onClick={() => setActiveTab("pets")} bg='rgb(57, 164, 164)' w="10%"
                        color="whitesmoke" fontSize="1.8vw" m="1% 5%" border="1px outset teal"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} boxShadow='dark-lg'>
                        Pets
                    </ Button>
                    <Button onClick={() => setActiveTab("users")} bg='rgb(57, 164, 164)' w="10%"
                        color="whitesmoke" fontSize="1.8vw" m="1% 5%" border="1px outset teal"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} boxShadow='dark-lg'>
                        Users
                    </ Button>
                    <Button onClick={() => setActiveTab("addPet")} bg='rgb(57, 164, 164)' w="10%"
                        color="whitesmoke" fontSize="1.8vw" m="1% 5%" border="1px outset teal"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} boxShadow='dark-lg'>
                        Add Pet
                    </ Button>
                </Flex>
                <Divider />
                <Box>
                    {activeTab === "pets" ? petsTab : ""}
                    {activeTab === "users" ? usersTab : ""}
                    {activeTab === "addPet" ? addPetTab : ""}
                </Box>
            </Flex>
        </div>
    )
}
