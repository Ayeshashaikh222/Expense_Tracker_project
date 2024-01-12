import './App.css';
import React, { useContext } from 'react';
import Authentication from './components/Authentication/Authentication';
import { Routes, Route } from "react-router-dom";
import AuthContext from './Store/AuthContext';
import Home from './Pages/Home';

function App() {
  const authcontext = useContext(AuthContext)

  return (
    <>
    <Routes>
      <Route path='/' element={<Authentication />} />

       {authcontext.isLoggedIn && (
       <>
       <Route path='/home' element={<Home/> }/>
       
       </>
       )}

      {!authcontext.isLoggedIn && <Route path='/auth' element={<Authentication />} />}

    </Routes>

    </>

  );
};

export default App;
