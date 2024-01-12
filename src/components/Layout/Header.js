import React,{ useContext } from "react";
import stylesheet from "./Header.module.css";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import AuthContext from "../../Store/AuthContext";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi'

const Header = (props) => {

    const authcontext = useContext(AuthContext);

    const location = useLocation();

    const navigate = useNavigate();

    return (
        <>
           <Navbar expand="lg" className={stylesheet.navbar}>
        <Container>
          <Nav className="flex">
            <Nav.Item style={{ color: "turquoise", fontSize: "25px" }}>
              Expense Tracker
            </Nav.Item>
          </Nav>
        </Container>
        <Container>
          {location.pathname !== "/profile" && (
            <span>
              Your Profile is Incomplete
              <NavLink to="/profile" className={stylesheet.completeProfile}>
                Complete Now
              </NavLink>
            </span>
          )}
        </Container>
        {authcontext.isLoggedIn && location.pathname !== "/auth" && (
          <Button className={stylesheet.logoutBtn}>
            <BiLogOut className={stylesheet["logout-icon"]} />
            <span>Log Out</span>
          </Button>
        )}
      </Navbar> 
        </>
    );
};

export default Header;