import './App.css';
import React from 'react';
import Authentication from './components/Authentication/Authentication';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Verification from './components/Authentication/Verification';
import ResetPassword from './components/Authentication/ResetPassword';
import {useSelector} from "react-redux";
import themeSlice from './Store/themeSlice';
import stylesheet from './App.module.css';


function App() {
  
const isLoggedIn = useSelector(state => state.authentication.isLoggedIn);
const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);

console.log(isLoggedIn);

  return (
    <div breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
    minbreakpoint="xxs" className={isDarkTheme && isLoggedIn? stylesheet['dark']:""}>
    
    <Routes>
      
      <Route path="/" element={<Authentication />} />

       {isLoggedIn && (
       <>
       <Route path="/verification" element={<Verification />}/>
       <Route path="/home" element={<Home />}/>
       <Route path="/profile" element={<Profile />}/>
       </>
       )}

      {!isLoggedIn && 
      <Route path="/auth" element={<Authentication />} />}

      <Route path="*" element={<Navigate to="/" />} />  

      <Route path="/forget" element={<ResetPassword />} />
    
    </Routes>

    </div>

  );
}
export default App;
