import React, { useState, useRef, useEffect, useCallback } from "react";
import { Form, Container, Button } from "react-bootstrap";
import styleSheet from "./AddExpenses.module.css";
import { useDispatch, useSelector } from "react-redux";
import {expenseActions} from "../../Store/expenseSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddExpenses = () => {

    const currencyInputRef = useRef();
    const amountInputRef = useRef();
    const descriptionInputRef = useRef();
    const categoryInputRef = useRef();


    const [currency, setCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const dispatch = useDispatch();

    const userEmail = useSelector(state => state.authentication.userId);
    
    const email = userEmail.replace(/[^a-zA-Z0-9]/g, "");

    const currencyInputChangeHandler = () => {
        setCurrency(currencyInputRef.current.value);
    };

    const amountInputChangeHandler = () => {
        setAmount(amountInputRef.current.value);
    };

    const descriptionInputChangeHandler = () => {
        setDescription(descriptionInputRef.current.value);
    };

    const catergoryInputChangeHandler = () => {
        setCategory(categoryInputRef.current.value);
    };


    const submitHandler = async (event) => {
        event.preventDefault();

        const expenseData = {
            currency: currency,
            amount: amount,
            description: description,
            category: category,

        }
        addExpenseHandler(expenseData);
        onAddEx
        setCurrency("");
        setAmount("");
        setDescription("");
        setCategory("");

    };


    const addExpenseHandler = (expenseData) => {
        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}.json`, {
            method: "POST",
            body: JSON.stringify(expenseData),
            headers: {
                "content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                toast.success("successfully added the expenses", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                res.json()
                // authcontext.setReFetch(prevstate => !prevstate);
                fetchExpenseHandler();

            } else {
                return res.json().then((data) => {
                    // alert("Something went wrong");
                    toast.error("Something went wrong", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                })
            }

        })
    };

    const fetchExpenseHandler = useCallback(() => {
        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}.json`).then((res) => {
            if (res.ok) {
                // console.log("Successful");
                toast.success("successfully fetched expenses", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                return res.json();
            } else {
                return res.json().then((data) => {
                    // console.log("Failed to fetch expenses");
                    toast.error("Failed to fetch expenses", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                });
            }
        }).then((data) => {
            console.log(data);
            let fetchedExpenses = [];
            let loadedAmount = 0;
            for (const key in data) {
                fetchedExpenses.push({
                    id: key,
                    currency: data[key].currency,
                    amount: data[key].amount,
                    description: data[key].description,
                    category: data[key].category,

                });
                loadedAmount = loadedAmount + parseInt(data[key].amount);
            }

            console.log(fetchedExpenses);
            dispatch(expenseActions.setExpenses(fetchedExpenses));
            dispatch(expenseActions.setTotalAmount(loadedAmount));

        })

    }, [addExpenseHandler]);

    useEffect(() => {

        fetchExpenseHandler();

    }, [fetchExpenseHandler]);

    return (
        <>
            <Container breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]} minbreakpoint="xxs"
                className={styleSheet["add-expense"]}>
                <h5 className={styleSheet.title}>Add New Expense</h5>
                <Form onSubmit={submitHandler}>
                    <Form.Group className={styleSheet["form-group"]} style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                        <Form.Label className={styleSheet["form-label"]}>Amount:{" "} </Form.Label>
                        <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                            <Form.Select className={styleSheet["form-controls"]} aria-label="expensecurrency"
                                ref={currencyInputRef}
                                value={currency}
                                onChange={currencyInputChangeHandler}>
                                <option value={null}>Select Currency</option>
                                <option value="$">$</option>
                                <option value="₹">₹</option>
                                <option value="€">€</option>
                                €
                            </Form.Select>
                            <Form.Control style={{ width: "100%" }}
                                type="number"
                                placeholder="Enter the Amount "
                                ref={amountInputRef}
                                value={amount}
                                onChange={amountInputChangeHandler}
                                className={styleSheet["form-controls"]}
                            />
                        </div>

                    </Form.Group>
                    <Form.Group className={styleSheet["form-group"]}>
                        <Form.Label className={styleSheet["form-label"]}>
                            Description:{" "}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Description "
                            ref={descriptionInputRef}
                            value={description}
                            onChange={descriptionInputChangeHandler}
                            className={styleSheet["form-controls"]}
                        />
                    </Form.Group>
                    <Form.Group className={styleSheet["form-group"]}>
                        <Form.Label className={styleSheet["form-label"]}>
                            Category:{" "}
                        </Form.Label>
                        <Form.Select
                            aria-label="expenseCategroy"
                            ref={categoryInputRef}
                            value={category}
                            onChange={catergoryInputChangeHandler}
                            className={styleSheet["form-controls"]}
                        >
                            <option value={null}>Select Where You Spend </option>
                            <option value="car servicing">Car servicing </option>
                            <option value="petrol">Petrol </option>
                            <option value="food">Food</option>
                            <option value="grocery">Grocery</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group style={{ textAlign: 'center' }}>
                        <Button className={styleSheet.btn} type="submit">Add</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
};

export default AddExpenses;