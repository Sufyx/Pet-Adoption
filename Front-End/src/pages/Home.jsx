/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 12/08/2022
 * Asaf Gilboa
*/


import { React, useEffect, useContext } from 'react';
import {
  Image, Box, Flex, Spacer, Heading, Text, HStack
} from '@chakra-ui/react';
import axios from 'axios';
import UsersContext from '../context/UsersContext';
import NewsFeed from '../components/NewsFeed';
import PetSlides from '../components/PetSlides';

export default function Home() {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const { updateUser } = useContext(UsersContext);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('loggedUser'));
    if (data) {
      reLogUser(data.token);
    }
  }, []);

  async function reLogUser(token) {
    const res = await axios.get(`${baseUrl}/users/logged`,
      { headers: { authorization: `Bearer ${token}` } });
    if (res.data) {
      updateUser(res.data.user);
    }
  }


  return (

    <div className='homePageContainer'>

      < Heading className='homeFont' fontSize="2.5vw" color="teal.900" align="center">
        Welcome to A.G Pet Adoption agency
      </ Heading >

      <Flex className="homeDisplayDiv" m="auto" marginTop="1%" w="96%"
        bg="rgba(57, 164, 164, 0.2)" borderRadius="30px" p="2%"
        boxShadow='dark-lg' direction='column' align='center'>

        <HStack w="100%" justify='space-between'>
          <Image src='https://i.imgur.com/RnTb6Em.jpg' alt='Hyper Dog' className='homePageImage'
            objectFit='cover' borderRadius='full' roundedRight="md" />
          {/* < Spacer /> */}
          <Box marginX={3} className='homeFont' w="30%" textAlign="center">
            <Text fontSize="1.3vw" fontWeight="semibold" color="teal.900">
              Hey there pet person. <br />
              Thank you for visiting. <br />
              This is a prestige digital database of various precious animals. <br />
              These animals deserve a loving home, and together we can give it to them. <br />
              Take your time to browse our various pets.
            </ Text >
          </Box>

          <Box marginX={3} className='homeFont homeGadget imageFrame' w="35%">
            < Heading fontSize="1.3vw" color="teal.900" align="center">
              News Feed
            </ Heading >
            <NewsFeed />
          </Box>

        </HStack>

        <Box h="5vh"><Spacer /></Box>

        <HStack w="100%" justify='space-between'>

          <Box marginX={3} className='homeFont homeGadget' w="36%" >
            <PetSlides />
          </Box>

          <Box marginX={3} className='homeFont' w="30%" textAlign="center">
            <Text fontSize="1.3vw" fontWeight="semibold" color="teal.900">
              To browse pets, go to "search" on the menu on the top right. <br />
              Log-in or sign-up to get full access, and start your (digital) pet family <br />
              :)
            </ Text >
          </Box>

          <Image src='https://i.imgur.com/E2uVXFh.jpg' alt='Hyper Dog' className='homePageImage'
            objectFit='cover' borderRadius='full' roundedLeft="md" />
        </HStack>
      </Flex>

    </div>

  )
}
