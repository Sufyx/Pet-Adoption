/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState } from 'react';
import { Button, useToast, Spinner } from '@chakra-ui/react';
import localforage from 'localforage';
import axios from 'axios';


export default function PetActionBtn({
  petAction, petName, petId, updateIsOwnedByUser, updateIsSavedByUser }) {

  const baseUrl = process.env.REACT_APP_SERVER_URL;

  const [spinnerUp, setSpinnerUp] = useState(false);

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
    setSpinnerUp(true);
    let petActionStr = petAction;
    if (petAction !== "Save") {
      petActionStr = `${petAction}ed`;
    }
    const { token } = await localforage.getItem('loggedUser');
    const res = await axios.post(`${baseUrl}/pet/${petId}/${petAction.toLowerCase()}`,
      { petAction: petActionStr },
      { headers: { authorization: `Bearer ${token}` }, });

    if (res.data) {
      if (petAction === "Save") {
        updateIsSavedByUser(true);
        toast({
          title: `${petName} has been saved`,
          description: `You may see them in your profile at any time`,
          status: 'info',
          duration: 4000,
          isClosable: true,
        });
      } else {
        updateIsOwnedByUser(true);
        toast({
          title: `Awesome!`,
          description: `Thank you for ${petAction.toLowerCase()}ing ${petName} `,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setSpinnerUp(false);
  }


  async function petReturn() {
    setSpinnerUp(true);
    const { token } = await localforage.getItem('loggedUser');
    const res = await axios.post(`${baseUrl}/pet/${petId}/return`,
      { holder: "holder" }, { headers: { authorization: `Bearer ${token}` } });

    if (res.data) {
      updateIsOwnedByUser(false);
      toast({
        title: `${petName} has been returned :(`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    }
    setSpinnerUp(false);
  }

  async function petUnsave() {
    setSpinnerUp(true);
    const { token } = await localforage.getItem('loggedUser');
    const res = await axios.delete(`${baseUrl}/pet/${petId}/save`,
      { headers: { authorization: `Bearer ${token}` } });

    if (res.data) {
      updateIsSavedByUser(false);
      toast({
        title: `${petName} has been removed from your saved pets`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    }
    setSpinnerUp(false);
  }

  const spinner =
    <>
      <Spinner thickness='6px' speed='0.7s' emptyColor='teal.200' color='teal.800' size='md' />
    </>

  return (
    <Button my="8%" borderRadius="full" h="6vw" fontSize="1.1vw" colorScheme='teal' border="2px outset teal"
      onClick={petActionClick} boxShadow='dark-lg' _hover={{ bg: 'whitesmoke', color: 'teal.500' }}>
      {spinnerUp ? spinner : `${petAction} ${petName}` }
    </Button>
  )
}
