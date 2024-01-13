import React, { useState, useRef, useContext, useEffect, } from "react";
import Header from "../components/Layout/Header";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Store/AuthContext";
import stylesheet from "./Profile.module.css";
import { AiOutlineGithub, AiOutlineGlobal } from "react-icons/ai";

const Profile = (props) => {

    const authcontext = useContext(AuthContext)

    const fullNameInputRef = useRef();
    const ProfileUrlInputRef = useRef();

    const [fullName, setFullName] = useState("");
    const [profileUrl, setProfileUrl] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCx6diWtCvuIc81jygEdF0IKmvnDVNFLyE",{
            method: "POST",
            body: JSON.stringify({
                idToken: authcontext.token,
            }),
            headers: {
                "Content-Type": "application/json",
            },
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
    };


    const updateSubmitHandler = (event) => {
        event.preventDefault();

        const enteredFullName = fullNameInputRef.current.value;
        const enteredProfileUrl = ProfileUrlInputRef.current.value;

        let errorMessage;

        fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCx6diWtCvuIc81jygEdF0IKmvnDVNFLyE", {
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
                setFullName(enteredFullName);
                setProfileUrl(enteredProfileUrl);
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
        // console.log(fullName);
    };

    const profileUrlInputChangeHandler = () => {
        setProfileUrl(ProfileUrlInputRef.current.value)
        // console.log(profileUrl);
    };

    return (
        <>
            <Header />
            <Container className={stylesheet.profileContainer}>
                <header style={{ marginBottom: "15px", display: 'flex', justifyContent: "space-between" }}>
                    Update Details
                    <Button onClick={cancelHandler} className={stylesheet.cancelbtn}>Cancel</Button>
                </header>
                <Form onSubmit={updateSubmitHandler} className={stylesheet.profile}>
                    <Container style={{ display: 'flex', flexDirection: 'column' }}>
                        <Container className={stylesheet.inputTxt}>
                            <Form.Group
                                controlId="formBasicFullName"
                                style={{ fontSize: "18px" }}
                            >
                                <Form.Label>
                                    {" "}
                                    <AiOutlineGithub style={{ color: "000" }} /> Name :
                                </Form.Label>
                                <Form.Control
                                    style={{ marginLeft: "10px", borderRadius: "5px" }}
                                    type="text"
                                    placeholder="Enter full Name"
                                    ref={fullNameInputRef}
                                    required
                                    onChange={fullNameInputChangeHandler}
                                    value={fullName}
                                />
                            </Form.Group>
                            <Form.Group
                                controlId="formBasicProfileURL"
                                style={{ marginLeft: "16px", fontSize: "18px" }}
                            >
                                <Form.Label>
                                    {" "}
                                    <AiOutlineGlobal style={{ color: "000" }} /> Profile Photo
                                    URL:
                                </Form.Label>
                                <Form.Control
                                    style={{ marginLeft: "10px", borderRadius: "5px"}}
                                    type="text"
                                    placeholder="Paste profile photo url here"
                                    ref={ProfileUrlInputRef}
                                    required
                                    onChange={profileUrlInputChangeHandler}
                                    value={profileUrl}
                                />
                            </Form.Group>
                        </Container>
                        <Form.Group className={stylesheet.updateBtn}>
                            <Button type="submit">Update</Button>
                        </Form.Group>
                    </Container>
                </Form>
            </Container>
        </>
    );
};

export default Profile;