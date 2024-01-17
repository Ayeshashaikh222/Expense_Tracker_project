import './App.css';
import React, { useContext } from 'react';
import Authentication from './components/Authentication/Authentication';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthContext from './Store/AuthContext';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Verification from './components/Authentication/Verification';
import ResetPassword from './components/Authentication/ResetPassword';


function App() {
  
  const authcontext = useContext(AuthContext);
  return (
    <>
    <Routes>
      
      <Route path='/' element={<Authentication />} />

       {authcontext.isLoggedIn && (
       <>
       <Route path="/verification" element={<Verification />}/>
       <Route path="/home" element={<Home />}/>
       <Route path="/profile" element={<Profile />}/>
       </>
       )}

      {!authcontext.isLoggedIn && 
      <Route path="/auth" element={<Authentication />} />}

      <Route path="*" element={<Navigate to="/" />} />  

      <Route path="/forget" element={<ResetPassword />} />
    
    </Routes>

    </>

  );
}
export default App;
