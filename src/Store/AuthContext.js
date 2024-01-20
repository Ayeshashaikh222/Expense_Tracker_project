
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

    const initialToken = localStorage.getItem("token");
    const initialEmail = localStorage.getItem("email");

    const [token, setToken] = useState(initialToken);
    const [email, setEmail] = useState(initialEmail);
    const [reFetch, setReFetch] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const userIsLoggedIn = !!token;


  
    // useEffect(() => {
    //     const initialToken = localStorage.getItem("token");
    //     const initialEmail = localStorage.getItem("email");
        
    //     if(isLoggedIn){
    //         setToken(initialToken);
    //         setEmail(initialEmail);
    //     }
    //     // if (initialToken) {
    //     //     setToken(initialToken);
    //     // }
    
    //     // if (initialEmail) {
    //     //     setEmail(initialEmail);
    //     // }
    //     // console.log("redirecting");
    // }, []);

    

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
        // localStorage.clear();
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
        logout: logoutHandler,
        fetch: reFetch,
        setReFetch: setReFetch
    }

    return (
        <AuthContext.Provider value={contextValue}>
           {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;