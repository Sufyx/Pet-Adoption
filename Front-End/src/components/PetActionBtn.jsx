/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 17/08/2022
 * Asaf Gilboa
*/

import { React, useContext } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import UsersContext from '../context/UsersContext';


export default function PetActionBtn({ petAction, petName, petId, updateIsOwnedByUser, updateIsSavedByUser }) {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const { userLogged } = useContext(UsersContext);
  const toast = useToast();


  function petActionClick(e) {
    e.preventDefault();
    if ((petAction === "Adopt") || (petAction === "Foster") || (petAction === "Save")) {
      petStatusAction();
    } else if (petAction === "Return") {
      petReturn();
    } else if (petAction === "Unsave") {
      petUnsave();
    }

  }


  async function petStatusAction() {
    let petActionStr = petAction;
    if (petAction !== "Save") {
      petActionStr = `${petAction}ed`;
    }
    const { token } = JSON.parse(localStorage.getItem('loggedUser'));
    const res = await axios.post(`${baseUrl}/pet/${petId}/${petAction.toLowerCase()}`,
      { petAction: petActionStr, userEmail: userLogged.email },
      { headers: { authorization: `Bearer ${token}` }, });

    if (res.data) {
      if (petAction === "Save") {
        updateIsSavedByUser(true);
        toast({
          title: `${petName} has been saved`,
          description: `You may see them in your profile at any time`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else {
        updateIsOwnedByUser(true);
        toast({
          title: `Awesome!`,
          description: `Thank you for ${petAction.toLowerCase()}ing ${petName} `,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }


  async function petReturn() {
    const { token } = JSON.parse(localStorage.getItem('loggedUser'));
    const res = await axios.post(`${baseUrl}/pet/${petId}/return`,
      {holder: "holder"}, { headers: { authorization: `Bearer ${token}` } });

    if (res.data) {
      updateIsOwnedByUser(false);
      toast({
        title: `${petName} has been returned :(`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  async function petUnsave() {
    const { token } = JSON.parse(localStorage.getItem('loggedUser'));
    const res = await axios.delete(`${baseUrl}/pet/${petId}/save`,
      { headers: { authorization: `Bearer ${token}` } });

    if (res.data) {
      updateIsSavedByUser(false);
      toast({
        title: `${petName} has been removed from your saved pets`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }


  return (
    <Button my="8%" borderRadius="full" h="6vw" fontSize="1.1vw" colorScheme='teal' border="2px outset teal"
      onClick={petActionClick} boxShadow='dark-lg' _hover={{ bg: 'whitesmoke', color: 'teal.500' }}>
      {petAction} {petName}
    </Button>
  )
}
