
import React, { useState , useEffect} from "react";

const AuthContext = React.createContext({
    token: null,
    email: null,
    isLoggedIn: false,
    emailVerified: false,
    login: (token, email) => {},
    logout: () => {}


});

export const AuthContextProvider = (props) => {

    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    const userIsLoggedIn = !!token;

    useEffect(() => {
        const initialToken = localStorage.getItem("token");
        const initialEmail = localStorage.getItem("email");
        if(initialToken && initialEmail){
            setToken(initialToken);
            setEmail(initialEmail);
        }
    }, []);

    const logInHandler = (token, email, isEmailVerified) => {
     setToken(token);
     setEmail(email);
     setEmailVerified(isEmailVerified);
     localStorage.setItem("token", token);
     localStorage.setItem("email", email);
    //  console.log(token);
    //  console.log(email);
    };

    const logoutHandler = () => {
        setToken(null);
        setEmail(null);
        localStorage.removeItem("token");
        localStorage.removeItem("email");

    };

    const contextValue = {
        token: token,
        email: email,
        isLoggedIn: userIsLoggedIn,
        emailVerified: emailVerified,
        login: logInHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
           {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;