import React from "react";
import stylesheet from "./Header.module.css";
import { Navbar, Nav, Button } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { logout } from "../../Store/authSlice";
import {useDispatch, useSelector} from "react-redux";

const Header = (props) => {
    
  const auth = useSelector(state => state.authentication);

  const isDarkTheme = useSelector(state => state.theme.isDarkTheme);

    const dispatch = useDispatch();

    const location = useLocation();

    const navigate = useNavigate();

    const logoutHandler = () => {
        
        dispatch(logout());
        navigate("/auth",{replace:true})
    
      };

    return (
        <>
           <Navbar className={isDarkTheme?stylesheet["navbar-dark"]:stylesheet["navbar"]}
       breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs">
        <div  breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs">
          <Nav >
            <Nav.Item style={{ color: "turquoise", fontSize: "25px" }}>
              Expense Tracker
            </Nav.Item>
          </Nav>
          </div>
        <div  breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs">
          {location.pathname !== "/profile" && (
            <span>
              Your Profile is Incomplete
              <NavLink to="/profile" className={stylesheet.completeProfile}>
                Complete Now
              </NavLink>
            </span>
          )}
        </div>
        <div  breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs">
        {auth.isLoggedIn && location.pathname !== "/auth" && (
          <Button className={stylesheet.logoutBtn} onClick={logoutHandler}>
            <BiLogOut className={stylesheet["logout-icon"]} />
            <span>Log Out</span>
          </Button>
        )}
        </div>
      </Navbar> 
        </>
    );
};

export default Header;