
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
     console.log(email);
     setEmailVerified(isEmailVerified);
     localStorage.setItem("token", token);
     localStorage.setItem("email", email);
     localStorage.setItem("isEmailVerified",isEmailVerified)
     
     
    };

    const logoutHandler = () => {
        setToken(null);
        setEmail(null);
        setEmailVerified(false)
        localStorage.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("isEmailVerified");

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