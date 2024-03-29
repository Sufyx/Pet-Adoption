/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState, useEffect, useContext } from 'react';
import {
    Table, Thead, Tbody, Tfoot,
    Tr, Th, Td, TableCaption, TableContainer, useStatStyles
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import localforage from 'localforage';
import UsersContext from '../context/UsersContext';
import axios from 'axios';


export default function PetsTable({ toggleSpinner }) {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();

    const [allPets, setAllPets] = useState([]);
    const { userLogged } = useContext(UsersContext);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('down');

    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
        } else {
            fetchPets();
        }
    }, []);


    async function fetchPets() {
        toggleSpinner(true);
        try {
            const { token } = await localforage.getItem('loggedUser');
            const rez = await axios.get(`${baseUrl}/pet/getPetsTable`,
                { headers: { authorization: `Bearer ${token}` }});
            const petsTable = [...rez.data.petList];
            setAllPets([...petsTable]);
        } catch (err) {
            console.error("Pets table fetch error: ", err.message);
        }
        toggleSpinner(false);
    }
    

    function sortTable(param) {
        if (sortBy === param) {
            const sorted = allPets.reverse();
            setAllPets([...sorted]);
            if (sortOrder === "down") {
                setSortOrder("up");
            } else {
                setSortOrder("down");
            }
        } else {
            const sorted = allPets.sort((a, b) => {
                const x = a[param];
                const y = b[param];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            setSortBy(param);
            setAllPets([...sorted]);
            setSortOrder("down");
        }
    }


    async function seePetProfile(pet) {
        navigate(`/pet?petId=${pet._id}`);
    }

    return (
        <div className='usersPageContainer'>
            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>Pets Database</TableCaption>
                    <Thead>
                        <Tr fontWeight='bold' className="cursorPointer">
                            <Th onClick={() => sortTable('name')}>
                                Name &nbsp;
                                {sortBy === 'name' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('type')}>
                                Type &nbsp;
                                {sortBy === 'type' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('breed')}>
                                Breed &nbsp;
                                {sortBy === 'breed' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('height')}>
                                Height &nbsp;
                                {sortBy === 'height' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('weight')}>
                                Weight &nbsp;
                                {sortBy === 'weight' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('adoptionStatus')}>
                                Status &nbsp;
                                {sortBy === 'adoptionStatus' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('ownerName')}>
                                Owner &nbsp;
                                {sortBy === 'ownerName' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allPets.map(pet =>
                            <Tr key={pet._id} className="cursorPointer" fontWeight='semibold'>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.name}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.type}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.breed}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {pet.height ? `${pet.height}` : ''}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {pet.weight ? `${pet.weight}` : ''}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}
                                    fontWeight='semibold' textShadow='-0.4px -0.4px black'
                                    color={(pet.adoptionStatus === "Available") ?
                                        "green.500" : "purple.600"} >
                                    {`${pet.adoptionStatus}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.ownerName}`}
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Type</Th>
                            <Th>Breed</Th>
                            <Th>Height</Th>
                            <Th>Weight</Th>
                            <Th>Status</Th>
                            <Th>Owner</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </div>
    )

}
