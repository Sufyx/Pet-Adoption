/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import {
    Button, Table, Thead, Tbody, Tfoot,
    Tr, Th, Td, TableCaption, TableContainer
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import localforage from 'localforage';
import UsersContext from '../context/UsersContext';
import axios from 'axios';


export default function UsersPage({ toggleSpinner }) {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const { userLogged } = useContext(UsersContext);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('down');


    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
        } else {
            fetchUsers();
        }
    }, []);


    async function fetchUsers() {
        try {
            toggleSpinner(true);
            const { token } = await localforage.getItem('loggedUser');
            const res = await axios.get(`${baseUrl}/users`,
                { headers: { authorization: `Bearer ${token}` } });
            setAllUsers([...res.data.users]);
            toggleSpinner(false);
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }


    function sortTable(param) {
        if (sortBy === param) {
            const sorted = allUsers.reverse();
            setAllUsers([...sorted]);
            if (sortOrder === "down") {
                setSortOrder("up");
            } else {
                setSortOrder("down");
            }
        } else {
            const sorted = allUsers.sort((a, b) => {
                const x = a[param];
                const y = b[param];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            setSortBy(param);
            setAllUsers([...sorted]);
            setSortOrder("down");
        }
    }


    async function changeAdminStatus(user) {
        try {
            if (userLogged._id === user._id) {
                console.error("Action refused. You can't un-admin yourself.");
                return;
            }
            const { token } = await localforage.getItem('loggedUser');
            const status = user.isAdmin ? false : true;
            await axios.put(`${baseUrl}/users/admin/${user._id}`, { status: status },
                { headers: { authorization: `Bearer ${token}` } });
            fetchUsers();
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }

    async function seeUserProfile(user) {
        navigate(`/userprofile?userId=${user._id}&firstName=${user.firstName}`);
    }



    return (
        <div className='usersPageContainer'>
            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>Registered users</TableCaption>
                    <Thead>
                        <Tr fontWeight='bold' className="cursorPointer">
                            <Th onClick={() => sortTable('firstName')}>
                                Name &nbsp;
                                {sortBy === 'firstName' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('email')}>
                                Email &nbsp;
                                {sortBy === 'email' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('phone')}>
                                Phone &nbsp;
                                {sortBy === 'phone' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                            <Th onClick={() => sortTable('isAdmin')}>
                                Admin &nbsp;
                                {sortBy === 'isAdmin' ? sortOrder === 'down' ?
                                    <ChevronDownIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> :
                                    <ChevronUpIcon color='rgb(7, 59, 59)' fontSize='1.2vw' /> : ''}
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allUsers.map(user =>
                            <Tr key={user._id} className="cursorPointer" fontWeight='semibold'>
                                <Td onClick={() => seeUserProfile(user)}>{`${user.firstName} ${user.lastName}`}</Td>
                                <Td onClick={() => seeUserProfile(user)}>{`${user.email}`}</Td>
                                <Td onClick={() => seeUserProfile(user)}>{`${user.phone}`}</Td>
                                <Td onClick={() => changeAdminStatus(user)}>
                                    <Button bg={user.isAdmin ? "red.500" : "cyan.500"} color="whitesmoke" py="4%" fontSize="1.2vw"
                                        w="70%" h="fit-content" border="1px outset teal">
                                        {user.isAdmin ? "Remove admin" : "Make admin"}
                                    </Button>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Phone</Th>
                            <Th>Admin</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </div>
    )
}
