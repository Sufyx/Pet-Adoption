/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useContext } from 'react';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import UsersContext from '../context/UsersContext';
import { useNavigate } from "react-router-dom";


export default function AdminActionBtn({ adminAction, petName, petId }) {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const { userLogged } = useContext(UsersContext);


  async function adminActionClick(e) {
    if (!userLogged.isAdmin) return;

    if (adminAction === "Edit") {
      editPet();
    } else if (adminAction === "Delete") {
      console.log("delete?");
      deletePet();
    }
  }

  async function editPet() {
    if (!userLogged.isAdmin) return;
    navigate(`/petsettings?petId=${petId}`);
  }

  async function deletePet() {
    if (!userLogged.isAdmin) return;
    try {
      const { token } = JSON.parse(localStorage.getItem('loggedUser'));
      // console.log("deletePet petId: ", petId)
      await axios.delete(`${baseUrl}/pet/${petId}`,
      { headers: { authorization: `Bearer ${token}` } });
      navigate("/search");
    } catch (err) {
      console.error("Caught: " + err.message);
    }
  }


  return (
    <Button my="6%" borderRadius="10px" h="4vw" fontSize="1.1vw" colorScheme='red' border="2px inset firebrick"
      onClick={adminActionClick} _hover={{ bg: 'whitesmoke', color: 'red.500' }}>
      {adminAction} {petName}
    </Button>
  )
}
