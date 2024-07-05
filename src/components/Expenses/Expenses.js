import React, { useCallback, useState, useEffect} from "react";
import { Container, ListGroup, Modal, Form, Button } from "react-bootstrap";
import styleSheet from "./Expenses.module.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GiCancel } from 'react-icons/gi'
import { BsSave } from 'react-icons/bs'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { expenseActions } from "../../Store/expenseSlice";


const Expenses = () => {

    const [csvData, setCsvData] = useState("");
    const dispatch = useDispatch();
    const userEmail = useSelector(state => state.authentication.userId);
    const email = userEmail.replace(/[^a-zA-Z0-9]/g, "");

    const { expenses,
        totalAmount,
        showEditModal,
        showDeleteModal,
        expenseToEdit,
        expenseToDelete,

    } = useSelector(state => state.expense);

    const handlerDeleteModalClose = () => {
        dispatch(expenseActions.setShowDeleteModal(false));
        dispatch(expenseActions.setExpenseToDelete(null));

    };

    const handlerDeleteModalShow = (expense) => {
        dispatch(expenseActions.setShowDeleteModal(true));
        dispatch(expenseActions.setExpenseToDelete(expense))

    };

    const handlerEditModalClose = () => {
        dispatch(expenseActions.setShowEditModal(false));
        dispatch(expenseActions.setExpenseToEdit(null));

    };

    const handlerEditModalShow = (expense) => {
        dispatch(expenseActions.setShowEditModal(true));
        dispatch(expenseActions.setExpenseToEdit(expense));

    };

    // delete expnese handler
    const deleteExpenseHandler = (id) => {
        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}/${expenseToDelete.id}.json`, {
            method: "DELETE",
        }
        ).then((res) => {
            if (res.ok) {
                toast.success("successfully deleted", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                const updatedExpense = expenses.filter(
                    (expense) => expense.id !== expenseToDelete.id
                );
                dispatch(expenseActions.setExpenses(updatedExpense));
                dispatch(expenseActions.setExpenseToDelete(null));
                dispatch(expenseActions.setShowDeleteModal(false));
                res.json();
                // authcontext.setReFetch(prevstate => !prevstate);
                fetchExpenseHandler();

            }
        });

        // handlerDeleteModalClose();
        fetchExpenseHandler();
    };



    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        const updatedExpenseToEdit = {
            ...expenseToEdit,
            [name]: value,
        };
        dispatch(expenseActions.setExpenseToEdit(updatedExpenseToEdit));
    };

    const handlerEditExpense = (event) => {
        event.preventDefault();

        const updateExpense = {
            ...expenseToEdit,
            currency: event.target.currency.value,
            amount: event.target.amount.value,
            category: event.target.category.value,
            description: event.target.description.value,

        };

        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}/${updateExpense.id}.json`, {
            method: "PUT",
            body: JSON.stringify(updateExpense),
            headers: {
                "content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                toast.success("successfully updated", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                const updatedExpenses = expenses.map((expense) =>
                    expense.id === updatedExpense.id ? updatedExpense : expense
                );
                // Update the state
                dispatch(expenseActions.setExpenses(updatedExpenses));
                dispatch(expenseActions.setExpenseToEdit(null));
                dispatch(expenseActions.setShowEditModal(false));
                res.json();
                fetchExpenseHandler();
                // authcontext.setReFetch(prevstate => !prevstate);
                
            } else {
                return res.json().then((data) => {
                    toast.error("Failed to update expense", {
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
        }).catch((error) => {
            console.log(error)
        })

        handlerEditModalClose();
        fetchExpenseHandler();

    };

    const fetchExpenseHandler = useCallback(() => {
        fetch(`https://expense-tracker-4f57e-default-rtdb.firebaseio.com/expenses${email}.json`).then((res) => {
            if (res.ok) {
                toast.success("successfully fetched", {
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
                    category: data[key].category,
                    description: data[key].description,

                });
                loadedAmount = loadedAmount + parseInt(data[key].amount);
                console.log(loadedAmount);
            }

            console.log(fetchedExpenses);
            dispatch(expenseActions.setExpenses(fetchedExpenses));
            dispatch(expenseActions.setTotalAmount(loadedAmount));

        });
    }, []);

    useEffect(() => {

        fetchExpenseHandler();

    }, []);

    useEffect(() => {
        const csv = expenses.reduce((csvString, expense) => {
            return `${csvString} ${expense.currency}, ${expense.amount},${expense.description},${expense.category}\n`;
        }, "Title,Amount,Description,Category\n");
        const totalAmount = expenses.reduce((total, expense) => {
            return total + parseInt(expense.amount);
        }, 0);
        setCsvData(`${csv}Total,${totalAmount},\n`);
        //setCsvData(csv);
    }, [expenses]);


    return (
        <>
            <Container className={styleSheet.expenses}>
                <ListGroup as="ul" className={styleSheet.ul} breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs">
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

                <div className={styleSheet['total-expenses']}>
                    <h5>Total: {totalAmount}</h5>
                    <Button
                        className={styleSheet.downloadbtn}
                        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`}
                        download="expenses.csv"
                        style={{ marginLeft: "45%" }}
                    >
                        Download Expenses
                    </Button>
                </div>

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

                            <Form.Group className={styleSheet["form-group"]} >
                                <Form.Label className={styleSheet["form-label"]} >Amount: {" "} </Form.Label>
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