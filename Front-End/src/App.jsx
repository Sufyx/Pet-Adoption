/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 10/08/2022
 * Asaf Gilboa
*/

import { React, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Search from './pages/Search';
import PetPage from './pages/PetPage';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserSettings';
import PetSettings from './pages/PetSettings';
import UserPets from './pages/UserPets';
import Dashboard from './pages/Dashboard';
import UsersContext from './context/UsersContext';


function App() {
  const navigate = useNavigate();

  const [userLogged, setUserLogged] = useState('');

  useEffect(() => {
    navigate("/home");
    const data = JSON.parse(localStorage.getItem('loggedUser'));
  }, []);

  function updateUser(user) {
    if (user) {
      setUserLogged({...user});
    } else {
      setUserLogged(false);
    }
  }

  return (
    <div className="App">
      <UsersContext.Provider value={{userLogged, updateUser}} >
        <NavBar />
        <Routes >
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pet" element={<PetPage />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/usersettings" element={<UserSettings />} />
          <Route path="/petsettings" element={<PetSettings />} />
          <Route path="/mypets" element={<UserPets />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </UsersContext.Provider >
    </div>
  );
}

export default App;
