import React, {useState, useRef} from "react";
import {Form, Container, Button} from "react-bootstrap";
import styleSheet from "./AddExpenses.module.css";


const AddExpenses = ({onAddExpense}) => {

    const categoryInputRef = useRef();
    const descriptionInputRef = useRef();
    const amountInputRef= useRef();

    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");


   const catergoryInputChangeHandler = () => {
    setCategory(categoryInputRef.current.value);
   };

   const descriptionInputChangeHandler = () => {
    setDescription(descriptionInputRef.current.value);
   };

   const amountInputChangeHandler = () => {
    setAmount(amountInputRef.current.value);
   };

   const addExpenseSubmitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            category: category,
            description: description,
            amount: amount
        }
        onAddExpense(expenseData);
        setCategory("");
        setDescription("");
        setAmount("");
        
   };

    return (
        <>
        <Container breakpoints={["xxxl","xxl", "xl", "lg", "md", "sm", "xs", "xxs"]} minbreakpoint="xxs"
        className={styleSheet["add-expense"]}>
            <h5 className={styleSheet.title}>Add New Expense</h5>
            <Form onSubmit={addExpenseSubmitHandler}>
              <Form.Group className={styleSheet["form-group"]}>
                <Form.Select  aria-label="expenseCategroy"
               ref = {categoryInputRef}
               value={category}
               onChange ={catergoryInputChangeHandler}
              className={styleSheet["form-controls"]}>
                <option>Select Where you spend</option>
                <option>Car servicing</option>
                <option>petrol</option>
                <option>Food</option>
                <option>Grocery</option>
                </Form.Select>
              </Form.Group> 
              <Form.Group className={styleSheet["form-group"]}>
                   <Form.Label>Description:</Form.Label>
                   <Form.Control type="text" placeholder="Enter Description"
                   value={description}
                   ref={descriptionInputRef}
                   required 
                   onChange={descriptionInputChangeHandler}
                   className={styleSheet["form-controls"]}/>
              </Form.Group>
              <Form.Group className={styleSheet["form-group"]}>
                  <Form.Label>Amount:</Form.Label>
                  <Form.Control type="number" 
                  placeholder="Enter the Amount"
                  value={amount} 
                  ref={amountInputRef}
                  required 
                  onChange={amountInputChangeHandler}
                  className={styleSheet["form-controls"]}/>
              </Form.Group> 
              <Form.Group style={{textAlign: 'center'}}>
                 <Button className={styleSheet.btn} type="submit">Add</Button>
              </Form.Group>
            </Form>
        </Container>
        </>
    );
};

export default AddExpenses;