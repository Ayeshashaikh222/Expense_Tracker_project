import React, { useState, useRef, useContext, useEffect, } from "react";
import Header from "../components/Layout/Header";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Store/AuthContext";

const Profile = (props) => {

    const authcontext = useContext(AuthContext)

    const fullNameInputRef = useRef();
    const ProfileUrlInputRef = useRef();

    const [fullName, setFullName] = useState("");
    const [profileUrl, setProfileUrl] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBG_zzX0vmA0rh-Ngs3iUqHr5rh6UIpfgM", {
            method: "POST",
            body: JSON.stringify({
                idToken: authcontext.token
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                return res.json().then((data) => {
                    let errorMessage = "Unbale to get user details"
                    if (data && data.error && data.error.message) {
                        errorMessage = data.error.message;
                    }
                    throw new Error(errorMessage);
                })
            }
        }).then((data) => {
            setFullName(data.users[0].displayName);
            setProfileUrl(data.users[0].photoUrl);
        }).catch((error) => {
            alert(error.message);
        });
    }, []);

    const cancelHandler = () => {
        navigate("/home");
    }



    const updateSubmitHandler = (event) => {
        event.preventDefault();

        const enteredFullName = fullNameInputRef.current.value;
        const enteredProfileUrl = ProfileUrlInputRef.current.value;

        let errorMessage;

        fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBG_zzX0vmA0rh-Ngs3iUqHr5rh6UIpfgM", {
            method: "POST",
            body: JSON.stringify({
                idToken: authcontext.token,
                displayName: enteredFullName,
                photoUrl: enteredProfileUrl,
                returnSecureToken: true,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                setFullName(enteredFullName)
                setProfileUrl(enteredProfileUrl)
                return res.json()
            } else {
                return res.json().then((data) => {
                    errorMessage = "Update Failed"
                    if (data && data.error && data.error.message) {
                        errorMessage = data.error.message
                    }
                    throw new Error(errorMessage)
                })
            }
        }).then((data) => {
            console.log(data)
        }).catch((error) => {
            alert(error.message)
        })
    };

    const fullNameInputChangeHandler = () => {
        setFullName(fullNameInputRef.current.value)
        console.log(fullName);
    };

    const profileUrlInputChangeHandler = () => {
        setProfileUrl(ProfileUrlInputRef.current.value)
        console.log(profileUrl);
    };

    return (
        <>
            <Header />
            <Container>
                <Form onSubmit={updateSubmitHandler}>
                    <header style={{ marginBottom: "15px" }}>
                        Update Details
                        <Button onClick={cancelHandler}>Cancel</Button>
                    </header>
                    <Form.Group controlId="formBasicFullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" value={fullName} placeholder="Enter Full Name" ref={fullNameInputRef} required onChange={fullNameInputChangeHandler} />
                    </Form.Group>

                    <Form.Group controlId="formBasicProfileURL">
                        <Form.Label>Profile Photo</Form.Label>
                        <Form.Control type="text" value={profileUrl} placeholder="Paste Profile" ref={ProfileUrlInputRef} required onChange={profileUrlInputChangeHandler} />
                    </Form.Group>
                    <Button type="submit">Update</Button>
                </Form>
            </Container>
        </>
    );
};

export default Profile;