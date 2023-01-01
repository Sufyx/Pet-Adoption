/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 03/09/2022
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import {
    Button, Table, Thead, Tbody, Tfoot,
    Tr, Th, Td, TableCaption, TableContainer
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import UsersContext from '../context/UsersContext';
import axios from 'axios';


export default function UsersPage() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const { userLogged } = useContext(UsersContext);


    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
        } else {
            fetchUsers();
        }
    }, []);


    async function fetchUsers() {
        try {
            const { token } = JSON.parse(localStorage.getItem('loggedUser'));
            const res = await axios.get(`${baseUrl}/users`,
                { headers: { authorization: `Bearer ${token}` } });
            setAllUsers([...res.data.users]);
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }


    async function changeAdminStatus(user) {
        try {
            if (userLogged._id === user._id) {
                console.error("Action refused. You can't un-admin yourself.");
                return;
            }
            const { token } = JSON.parse(localStorage.getItem('loggedUser'));
            const status = user.isAdmin ? false : true;
            const res = await axios.put(`${baseUrl}/users/admin/${user._id}`, { status: status },
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
                        <Tr fontWeight='bold'>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Phone</Th>
                            <Th>Admin</Th>
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
