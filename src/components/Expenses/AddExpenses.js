import React, { useState, useRef, useEffect } from "react";
import { Form, Container, Button } from "react-bootstrap";
import styleSheet from "./AddExpenses.module.css";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../../Store/expenseSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import themeSlice from "../../Store/themeSlice";


const AddExpenses = ({ premiumThem }) => {

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
    const emailId = userEmail || "";
    const email = emailId.replace(/[^a-zA-Z0-9]/g, "");

    const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);

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

        if (!currency) {
            toast.error("Please select currency", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return
        }

        if (!amount || isNaN(amount)) {
            toast.error("Please Enter Amount", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return
        }
        if (!description) {
            toast.error("Please Description", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return
        }
        if (!category) {
            toast.error("Please Select a category.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return
        }

        const expenseData = {
            currency: currency,
            amount: amount,
            description: description,
            category: category,

        }
        addExpenseHandler(expenseData);
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

    const fetchExpenseHandler = () => {
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
            fetchExpenseHandler();
        })

    };

    useEffect(() => {
        fetchExpenseHandler();

    }, [fetchExpenseHandler]);

    return (
        <>
            <Container breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]} minbreakpoint="xxs"
                className={premiumThem ? styleSheet["add-expense-dark"] : styleSheet["add-expense"]}>
                <h5 className={styleSheet.title}>Add New Expense</h5>
                <Form onSubmit={submitHandler}>
                    <Form.Group className={styleSheet["form-group"]} style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                        <Form.Label htmlFor="amount" className={styleSheet["form-label"]}>Amount:{" "} </Form.Label>
                        <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                            <Form.Select className={styleSheet["form-controls"]} aria-label="expensecurrency" id="amount"
                                ref={currencyInputRef}
                                value={currency}
                                onChange={currencyInputChangeHandler}>
                                <option value="">Select Currency</option>
                                <option value="$">$</option>
                                <option value="₹">₹</option>
                                <option value="€">€</option>
                                €
                            </Form.Select>
                            <Form.Control style={{ width: "100%" }}
                                type="number"
                                required
                                id="amount"
                                placeholder="Enter the Amount "
                                ref={amountInputRef}
                                value={amount}
                                onChange={amountInputChangeHandler}
                                className={styleSheet["form-controls"]}
                            />
                        </div>

                    </Form.Group>
                    <Form.Group className={styleSheet["form-group"]}>
                        <Form.Label htmlFor="description" className={styleSheet["form-label"]}>
                            Please Description:{" "}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            required
                            id="description"
                            placeholder="Enter Description "
                            ref={descriptionInputRef}
                            value={description}
                            onChange={descriptionInputChangeHandler}
                            className={styleSheet["form-controls"]}
                        />
                    </Form.Group>
                    <Form.Group className={styleSheet["form-group"]}>
                        <Form.Label htmlFor="category" className={styleSheet["form-label"]}>
                            Please Select a Category:{" "}
                        </Form.Label>
                        <Form.Select
                            id="category"
                            required
                            aria-label="expenseCategroy"
                            ref={categoryInputRef}
                            value={category}
                            onChange={catergoryInputChangeHandler}
                            className={styleSheet["form-controls"]}
                        >
                            <option value="">Select Where You Spend </option>
                            <option value="car servicing">Car servicing </option>
                            <option value="petrol">Petrol </option>
                            <option value="food">Food</option>
                            <option value="grocery">Grocery</option>
                            <option value="other">Other</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group style={{ textAlign: 'center' }}>
                        <Button className={styleSheet.btn} type="submit" disabled={!currency || !amount || !description || !category}>Add</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
};

export default AddExpenses;