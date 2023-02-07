/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import LogModal from './LogModal';
import { React, useContext } from 'react';
import UsersContext from '../context/UsersContext';
import {
    Box, Menu, MenuButton, MenuList, MenuItem,
    Text, MenuGroup, IconButton, Divider
} from '@chakra-ui/react';
import {
    HamburgerIcon, Search2Icon, StarIcon,
    ViewIcon, SettingsIcon, UnlockIcon, CheckIcon
} from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';


export default function NavBar() {
    const { userLogged } = useContext(UsersContext);

    const welcomeMsg =
        <Text bg="rgb(75, 207, 247)" color="rgb(14, 48, 45)" py="0.6%" px="1%"
            fontWeight='semibold' fontSize='1vw' borderRadius="5px" 
            boxShadow='dark-lg' border="0.5px inset teal" >
            Hello, {userLogged.firstName} {userLogged.lastName}
        </Text>

    const homeLink =
        <NavLink to={"/home"}>
            <MenuItem icon={<StarIcon />}>Home</MenuItem>
        </NavLink>
    const searchLink =
        <NavLink to={"/search"}>
            <MenuItem icon={<Search2Icon />}>Search</MenuItem>
        </NavLink>
    const myPetsLink =
        <NavLink to={JSON.parse(localStorage.getItem('loggedUser')) ?
            `/mypets?userId=${userLogged._id}&firstName=${userLogged.firstName}`
            : "/home"}>
            <MenuItem icon={<ViewIcon />}>My Pets</MenuItem>
        </NavLink>
    const settingsLink =
        <NavLink to={JSON.parse(localStorage.getItem('loggedUser')) ?
            `/usersettings?userId=${userLogged._id}` : "/home"}>
            <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
        </NavLink>
    const profileLink =
        <NavLink to={JSON.parse(localStorage.getItem('loggedUser')) ?
            `/userprofile?userId=${userLogged._id}` : "/home"}>
            <MenuItem icon={<CheckIcon />}>Profile</MenuItem>
        </NavLink>
    const dashBoardLink =
        <NavLink to={userLogged.isAdmin ? "/dashboard" : "/home"}>
            <MenuItem icon={<UnlockIcon />}>Dashboard</MenuItem>
        </NavLink>

    const userLinks =
        <>
            <Divider />
            <MenuGroup title="Users" color="teal.500">
                {myPetsLink}
                {settingsLink}
                {profileLink}
            </MenuGroup>
        </>

    const adminLinks =
        <>
            <Divider />
            <MenuGroup title="Admin" color="red.500">
                {dashBoardLink}
            </MenuGroup>
        </>

    return (
        <div className="navBarContainer homeFont" >
            <Menu >
                <MenuButton as={IconButton} aria-label='Options'
                    icon={<HamburgerIcon />} variant='outline'
                    marginX={3} backgroundColor='whitesmoke'
                    _hover={{ bg: 'gray.600', color: 'whitesmoke' }}
                    boxShadow='dark-lg' fontSize='1vw' />
                <MenuList>
                    <MenuGroup title="Guests" color="gray.500">
                        {homeLink}
                        {searchLink}
                    </MenuGroup>
                    {userLogged ? userLinks : ''}
                    {userLogged.isAdmin ? adminLinks : ''}
                </MenuList>
            </Menu>

            <Menu className="navLink">
                <Box className="navLink">{homeLink}</Box>
                <Box className="navLink">{searchLink}</Box>
            </Menu>

            {userLogged ?
                <Menu className="navLink">
                    <Box className="navLink">{myPetsLink}</Box>
                    <Box className="navLink">{settingsLink}</Box>
                    <Box className="navLink">{profileLink}</Box>
                </Menu> : ""}

            {userLogged.isAdmin ?
                <Menu className="navLink">
                    <Box className="navLink">{dashBoardLink}</Box>
                </Menu> : ""}

            {userLogged ? welcomeMsg : ''}

            <LogModal />
        </div>
    )
}
