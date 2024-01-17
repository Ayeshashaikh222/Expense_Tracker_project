import React, {useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import {Form, Row, Col, Button} from "react-bootstrap"; 
import styleSheet from "./ResetPassword.module.css";

const ResetPassword = (props) => {

    const emailInputRef = useRef();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [isLoading, setIsLoading] = useState("");


    const resetPasswordSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true)

        const enteredEmail = emailInputRef.current.value;

        fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCx6diWtCvuIc81jygEdF0IKmvnDVNFLyE", {
            method: "POST",
            body: JSON.stringify({
                requestType : "PASSWORD_RESET",
                email: enteredEmail,
                returnSecureToken: true,

            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            setIsLoading(false);
            if(res.ok){
               setEmail("");
               return res.json();
            } else {
                return res.json().then((data) => {
                    if(data.error && data.error.message){
                        const errorMessage = data.error.message;
                    }

                    if(errorMessage.include("EMAIL_NOT_FOUND")){
                        throw new Error("Email not found. Please try again.");
                    }

                    if(errorMessage.include("INVALID_EMAIL")){
                        throw new Error("Invalid email format. Please provide a valid email.");
                    }

                    if(errorMessage.include("USER_DISABLED")){
                        throw new Error("This user account has been disabled. Contact support.");
                    } else {
                        throw new Error("Verification failed. Please try again later.");
                      } 
                });
               
            }
        }).then((data) => {
            navigate("/auth");
        }).catch((error) => {
            alert(error.message);
        });
        
    };

    const emailInputChangeHandler = () => {
       setEmail(emailInputRef.current.value);
    };


    return (
        <>
            <Form onSubmit={resetPasswordSubmitHandler} className={StyleSheet["auth-root-reset"]}>
                <Row>
                    <Col>
                        <h2 className={StyleSheet.heading}>
                            <MdLockReset className={StyleSheet.lock} />
                            Reset Password
                        </h2>
                    </Col>
                    <Form.Group className={`${styleSheet["form-group"]}`} >
                      <Form.Label className={styleSheet["form-label"]}>Email</Form.Label>
                      <Form.Control className={`${styleSheet["form-controls"]}`}
                      type="email" placeholder="Enter Register Email" value={email} ref={emailInputRef} required onChange={emailInputChangeHandler}/>
                    </Form.Group>
                    <Form.Group className={`${styleSheet["form-group"]}`}>
                     {!isLoading ? (<Button type="submit"  className={styleSheet.btn}>Reset</Button>) : 
                     <Button type="submit" className={styleSheet.btn}>Sending Url...</Button>}
                    </Form.Group>

                </Row>
            </Form>
        </>
    );
};

export default ResetPassword;