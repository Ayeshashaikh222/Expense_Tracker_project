import React, { useState, useEffect, useContext } from "react";
import { Container, ListGroup, Modal, Form, Button } from "react-bootstrap";
import styleSheet from "./Expenses.module.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GiCancel } from 'react-icons/gi'
import AuthContext from "../../Store/AuthContext";
import { BsSave } from 'react-icons/bs'

const Expenses = () => {

    const authcontext = useContext(AuthContext);

    const [expenses, setExpenses] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [expenseToDelete, setExpenseToDelete] = useState(null);


    const email = authcontext.email.replace(/[^a-zA-Z0-9]/g, "");

   

    const handlerDeleteModalClose = () => {
        setShowDeleteModal(false)
        setExpenseToEdit(null);
    };

    const handlerDeleteModalShow = (expense) => {
        setShowDeleteModal(true);
        setExpenseToDelete(expense);
    };

    const deleteExpenseHandler = (id) => {
        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}/${expenseToDelete.id}.json`, {
            method: "DELETE",
        }
        ).then((res) => {
            if (res.ok) {
                console.log("successfully deleted");
                res.json();
                authcontext.setReFetch(prevstate => !prevstate);

            }
        });

        handlerDeleteModalClose();
        fetchExpenseHandler();
    };

    const handlerEditModalClose = () => {
        setShowEditModal(false);
        setExpenseToEdit(null);
    };

    const handlerEditModalShow = (expense) => {
        setShowEditModal(true);
        setExpenseToEdit(expense);
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target
        setExpenseToEdit((prevExpense) => (
            {
                ...prevExpense,
                [name]: value,
            }
        ))
        
    };

    const handlerEditExpense = (event) => {
        event.preventDefault();

        const updateExpense = {
            ...expenseToEdit,
            currency: event.target.currency.value,
            category: event.target.category.value,
            description: event.target.description.value,
            amount: event.target.amount.value


        };

        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}/${updateExpense.id}.json`, {
            method: "PUT",
            body: JSON.stringify(updateExpense),
            headers: {
                "content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                console.log("successfully update the expense");
                res.json();
                authcontext.setReFetch(prevstate => !prevstate);
            } else {
                return res.json().then((data) => {
                    console.log("failed to update the expense")
                });
            }
        });
        handlerEditModalClose();
        fetchExpenseHandler();

    };

    const fetchExpenseHandler = () => {
        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}.json`).then((res) => {
            if (res.ok) {
                console.log("Successful");
                return res.json();
            } else {
                return res.json().then((data) => {
                    console.log("Failed to fetch expenses");
                });
            }
        }).then((data) => {
            console.log(data);
            let fetchedExpenses = [];
            for (const key in data) {
                fetchedExpenses.push({
                    id: key,
                    currency: data[key].currency,
                    category: data[key].category,
                    description: data[key].description,
                    amount: data[key].amount
                });
            }
            console.log(fetchedExpenses);
            setExpenses(fetchedExpenses);
        }).catch((error) => {
            console.log("Error", error);
        });
    };

    useEffect(() => {

        fetchExpenseHandler();
        console.log("authcontext.fetch",authcontext.fetch);
       
    }, [authcontext.fetch]);

 
    

    return (
        <>
            <Container className={styleSheet.expenses}>
                <ListGroup as="ul" className={styleSheet.ul}>
                    <ListGroup.Item style={{ textAlign: "justify" }}
                        className={styleSheet.list}>
                        Amount - Description - Category{" "}
                    </ListGroup.Item>
                    {expenses?.map((expense, index) => (
                        <ListGroup.Item
                            key={index}
                            as="li"
                            style={{ color: "#000" }}
                            className={styleSheet.list}
                        >
                            <p>
                                <span>
                                    {expense.currency}
                                    {expense.amount} -
                                </span>
                                <span style={{ margin: "10px" }}>{expense.description} -</span>
                                <span>{expense.category}</span>
                            </p>
                            <span>

                                <Button
                                    type="submit"
                                    onClick={() => handlerDeleteModalShow(expense)}
                                    className={styleSheet.deleteBtn}
                                >
                                    <AiOutlineDelete />{" "}
                                </Button>
                                <Button type="submit" onClick={() => handlerEditModalShow(expense)} className={styleSheet.editBtn}>
                                    <AiOutlineEdit />
                                </Button>
                            </span>
                        </ListGroup.Item>
                    ))}

                </ListGroup>


                {/* Delete Modal */}
                <Modal
                    show={showDeleteModal}
                    backdrop="static"
                    keyboard={false}
                    onHide={handlerDeleteModalClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Delete Expense
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this expense?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className={styleSheet['modal-cancel']} onClick={handlerDeleteModalClose}>
                            <GiCancel />

                        </Button>
                        <Button className={styleSheet['modal-delete']} onClick={deleteExpenseHandler}>
                            <AiOutlineDelete />

                        </Button>
                    </Modal.Footer>

                </Modal>

                {/* Edit modal */}
                <Modal show={showEditModal} onHide={handlerEditModalClose}>
                    <Form onSubmit={handlerEditExpense} className={styleSheet["edit-expense"]}>
                        <Modal.Header closeButton >
                            <Modal.Title>Edit Expense</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form.Group className={styleSheet["form-group"]}>
                                <Form.Label className={styleSheet["form-label"]}>Category: </Form.Label>
                                <Form.Select
                                    className={styleSheet['form-controls']}

                                    aria-label="expenseCategroy"
                                    value={expenseToEdit ? expenseToEdit.category : ""}
                                    name="category"
                                    onChange={handleEditInputChange}

                                >
                                    <option value={null}>Select Where You Spend </option>
                                    <option value="car servicing">Car servicing </option>
                                    <option value="petrol">Petrol </option>
                                    <option value='food'>Food</option>
                                    <option value="grocery">Grocery</option>
                                </Form.Select>
                            </Form.Group>


                            <Form.Group className={styleSheet["form-group"]} >
                                <Form.Label className={styleSheet["form-label"]} >Amount: </Form.Label>
                                <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                                    <Form.Select
                                        name="currency"
                                        value={expenseToEdit ? expenseToEdit.currency : ""}
                                        className={styleSheet['form-controls']}
                                        onChange={handleEditInputChange} >

                                        <option value={null}>Select currency </option>
                                        <option value="$">$</option>
                                        <option value="₹">₹</option>
                                        <option value="€">€</option>
                                        €
                                    </Form.Select>
                                    <Form.Control style={{ width: "100%" }} className={styleSheet['form-controls']}
                                        type="number"
                                        name="amount"
                                        value={expenseToEdit ? expenseToEdit.amount : ""}
                                        onChange={handleEditInputChange}
                                    />
                                </div>

                            </Form.Group>
                            <Form.Group className={styleSheet["form-group"]}>
                                <Form.Label>Description: </Form.Label>
                                <Form.Control
                                    className={styleSheet['form-controls']}
                                    type="text"
                                    name="description"
                                    value={expenseToEdit ? expenseToEdit.description : ""}
                                    onChange={handleEditInputChange}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className={styleSheet['modal-delete']} onClick={handlerEditModalClose}>
                                <GiCancel />
                            </Button>
                            <Button type="submit" className={styleSheet['modal-cancel']}>
                                <BsSave />
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal >
            </Container>
        </>
    );
};


export default Expenses;