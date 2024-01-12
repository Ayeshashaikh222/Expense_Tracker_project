import { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import AuthContext from "../../Store/AuthContext";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi'

const Header = (props) => {

    const authcontext = useContext(AuthContext)

    const location = useLocation()

    const navigate = useNavigate()

    return (
        <>
            <Navbar className="bg-body-tertiary" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                <Container>
                    {/* <Navbar.Brand className="b" style={{ backgroundColor: "gray",
                            color: '#fff', fontSize: "25px" }}>
                        Expense Tracker
                    </Navbar.Brand > */}
                    <Nav className='flex-grow-3'>
                        <Nav.Item style={{ backgroundColor: "gray",
                            color: '#fff', fontSize: "25px" }}>
                            Expense Tracker
                        </Nav.Item>
                       
                    </Nav>
                    {
                        authcontext.isLoggedIn && location.pathname !== "/auth" &&
                        (<Button style={{ color: "turquoise" }}><BiLogOut /></Button>)
                    }

                </Container>

                {/* {
                    authcontext.isLoggedIn && location.pathname !== "/auth" &&
                    (<Button style={{ color: "turquoise" }}><BiLogOut/></Button>)
                } */}

            </Navbar>

            {
                location.pathname !== '/profile' &&
                (
                    <span>Your Profile is Incomplete
                        <NavLink to='/profile'>Complete Now</NavLink>
                    </span>
                )
            }
        </>
    );
};

export default Header;