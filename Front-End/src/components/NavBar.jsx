/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import LogModal from './LogModal';
import { React, useContext } from 'react';
import UsersContext from '../context/UsersContext';
import {
    Menu, MenuButton, MenuList, MenuItem,
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
        <Text bg="rgb(75, 207, 247)" py="0.6%" px="1%" fontWeight='semibold' boxShadow='dark-lg'
            borderRadius="5px" border="0.5px inset teal" color="rgb(14, 48, 45)">
            Hello, {userLogged.firstName} {userLogged.lastName}
        </Text>

    const userLinks =
        <>
            <Divider />
            <MenuGroup title="Users" color="teal.500">
                <NavLink to={JSON.parse(localStorage.getItem('loggedUser')) ? `/mypets?userId=${userLogged._id}&firstName=${userLogged.firstName}` : "/home"}>
                    <MenuItem icon={<ViewIcon />}>My Pets</MenuItem>
                </NavLink>
                <NavLink to={JSON.parse(localStorage.getItem('loggedUser')) ? `/usersettings?userId=${userLogged._id}` : "/home"}>
                    <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
                </NavLink>
                <NavLink to={JSON.parse(localStorage.getItem('loggedUser')) ? `/userprofile?userId=${userLogged._id}` : "/home"}>
                    <MenuItem icon={<CheckIcon />}>Profile</MenuItem>
                </NavLink>
            </MenuGroup>
        </>

    const adminLinks =
        <>
            <Divider />
            <MenuGroup title="Admin" color="red.500">
                <NavLink to={userLogged.isAdmin ? "/dashboard" : "/home"}>
                    <MenuItem icon={<UnlockIcon />}>Dashboard</MenuItem>
                </NavLink>
            </MenuGroup>
        </>

    return (
        <div className="navBarContainer homeFont" >
            <Menu >
                <MenuButton as={IconButton} aria-label='Options' icon={<HamburgerIcon />} variant='outline'
                    marginX={3} backgroundColor='whitesmoke' _hover={{ bg: 'gray.600', color: 'whitesmoke' }}
                    boxShadow='dark-lg' />
                <MenuList>
                    <MenuGroup title="Guests" color="gray.500">
                        <NavLink to={"/home"}>
                            <MenuItem icon={<StarIcon />}>Home</MenuItem>
                        </NavLink>
                        <NavLink to={"/search"}>
                            <MenuItem icon={<Search2Icon />}>Search</MenuItem>
                        </NavLink>
                    </MenuGroup>
                    {userLogged ? userLinks : ''}
                    {userLogged.isAdmin ? adminLinks : ''}
                </MenuList>
            </Menu>
            {userLogged ? welcomeMsg : ''}
            <LogModal />
        </div>
    )
}
