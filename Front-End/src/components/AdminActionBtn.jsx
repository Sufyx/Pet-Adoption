/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useContext, useRef } from 'react';
import {
  Button, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import axios from 'axios';
import UsersContext from '../context/UsersContext';
import { useNavigate } from "react-router-dom";
import localforage from 'localforage';


export default function AdminActionBtn({ adminAction, petName, petId }) {

  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const { userLogged } = useContext(UsersContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef()


  async function adminActionClick(e) {
    if (!userLogged.isAdmin) return;

    if (adminAction === "Edit") {
      editPet();
    } else if (adminAction === "Delete") {
      onOpen();
    }
  }

  async function editPet() {
    if (!userLogged.isAdmin) return;
    navigate(`/petsettings?petId=${petId}`);
  }

  async function deletePet() {
    onClose();
    if (!userLogged.isAdmin) return;
    try {
      const { token } = await localforage.getItem('loggedUser');
      await axios.delete(`${baseUrl}/pet/${petId}`,
        { headers: { authorization: `Bearer ${token}` } });
      navigate("/search");
    } catch (err) {
      console.error("Caught: " + err.message);
    }
  }


  return (
    <>
      <Button my="6%" borderRadius="10px" h="4vw" fontSize="1.1vw" colorScheme='red' border="2px inset firebrick"
        onClick={adminActionClick} _hover={{ bg: 'whitesmoke', color: 'red.500' }}>
        {adminAction} {petName}
      </Button>
      <AlertDialog isOpen={isOpen} onClose={onClose}
        leastDestructiveRef={cancelRef} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Pet
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deletePet} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
