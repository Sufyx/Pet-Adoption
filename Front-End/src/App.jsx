/**
 * Pet Adoption Project
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

  const [loginTrigger, setLoginTrigger] = useState(0);
  const [userLogged, setUserLogged] = useState('');
  const [lastSearch, setLastSearch] = useState({
    petName: '',
    type: '',
    status: '',
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: ''
  });

  useEffect(() => {
    navigate("/home");
  }, []);

  function updateUser(user) {
    if (user) {
      setUserLogged({ ...user });
    } else {
      setUserLogged(false);
    }
  }

  function updateSearch(params) {
    setLastSearch({ ...params });
  }

  function loginHook() {
    setLoginTrigger((loginTrigger) => loginTrigger + 1);
  }


  return (
    <div className="App">
      <UsersContext.Provider value={{
        userLogged, updateUser,
        loginTrigger, loginHook,
        updateSearch, lastSearch
      }} >
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
