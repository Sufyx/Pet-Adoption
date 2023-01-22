/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import { React, useEffect, useContext } from 'react';
import {
  Image, Box, Flex, Spacer, Heading,
   Text, HStack, VStack, Link
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

      <Flex m="auto" marginTop="1%" w="96%" h="80vh"
        bg="rgba(57, 164, 164, 0.2)" borderRadius="30px" p="2%"
        boxShadow='dark-lg' direction='column' align='center'>

        <HStack w="100%" h="100%" justify='space-between'>

          <VStack className='homeVStack'>
            <Image src='https://i.imgur.com/RnTb6Em.jpg' alt='Hyper Dog' className='homePageImage'
              borderRadius='full' roundedRight="md" objectFit='cover'  />
            <Spacer h="5vh" />
            <Box marginX={3} className='homeFont homeGadget'  >
              <PetSlides />
            </Box>
          </VStack>

          <VStack className='homeVStack' w='25%'>
            <Box marginX={3} className='homeFont' textAlign="center">
              <Text fontSize="1.3vw" fontWeight="semibold" color="teal.900">
                Hey there pet person. <br />
                Thank you for visiting. <br />
                This is a prestige digital database of various precious animals. <br />
                These animals deserve a loving home, and together we can give it to them. <br />
              </ Text >
            </Box>
            <Spacer h="6vh" />
            <Box marginX={3} className='homeFont' textAlign="center">
              <Text fontSize="1.3vw" fontWeight="semibold" color="teal.900">
                To browse our various pets, go to "Search". <br />
                Log-in or sign-up to get full access, <br />
                and start your (digital) pet family <br />
                :) <br /><br />
                <b>This website is free-hosted, please allow a minute for the server to load before engaging.</b>
              </ Text >
            </Box>
          </VStack>

          <VStack className='homeVStack'>
            <Image src='https://i.imgur.com/E2uVXFh.jpg' alt='Hyper Cat' className='homePageImage'
              objectFit='cover' borderRadius='full' roundedLeft="md" />
            <Spacer h="5vh" />
            <Box marginX={3} className='homeFont homeGadget imageFrame' >
              < Heading fontSize="1.3vw" color="teal.900" align="center">
                Recent Activity
              </ Heading >
              <NewsFeed />
            </Box>
          </VStack>

        </HStack>

      </Flex>

    </div>

  )
}
