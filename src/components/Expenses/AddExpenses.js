import React, {useState, useRef, useContext, useEffect} from "react";
import {Form, Container, Button} from "react-bootstrap";
import styleSheet from "./AddExpenses.module.css";
import AuthContext from "../../Store/AuthContext";


const AddExpenses = ({onAddExpense}) => {

    const authcontext = useContext(AuthContext);

    const currencyInputRef = useRef();
    const categoryInputRef = useRef();
    const descriptionInputRef = useRef();
    const amountInputRef= useRef();

    const [currency, setCurrency] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");


   const currencyInputChangeHandler = () => {
     setCurrency(currencyInputRef.current.value);
   };

   const catergoryInputChangeHandler = () => {
    setCategory(categoryInputRef.current.value);
   };

   const descriptionInputChangeHandler = () => {
    setDescription(descriptionInputRef.current.value);
   };

   const amountInputChangeHandler = () => {
    setAmount(amountInputRef.current.value);
   };

   const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            currency: currency,
            category: category,
            description: description,
            amount: amount
        }
        addExpenseHandler(expenseData);
        setCategory("");
        setDescription("");
        setAmount("");
        
   };

   const email = authcontext.email.replace(/[^a-zA-Z0-9]/g, "");

    useEffect = (() => {
        fetch(`https://expensedata-34e5e-default-rtdb.firebaseio.com/expenses${email}.json`, {
        method: "POST",
        body: JSON.stringify([])
      })
    }, [email])

    const addExpenseHandler = (expenseData) => {
       fetch(`https://expensedata-34e5e-default-rtdb.firebaseio.com/expenses${email}.json`, {
        method: "POST",
        body: JSON.stringify(expenseData),
        headers: {
            "content-Type": "application/json",
        },
       }).then((res)=> {
        if(res.ok){
            console.log("successful");
            return res.json()
        } else {
            return res.json().then((data)=> {
                alert("Something went wrong");
            })
        }
       
       })
    };

    return (
        <>
        <Container breakpoints={["xxxl","xxl", "xl", "lg", "md", "sm", "xs", "xxs"]} minbreakpoint="xxs"
        className={styleSheet["add-expense"]}>
            <h5 className={styleSheet.title}>Add New Expense</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group className={styleSheet["form-group"]} style={{display:'flex',flexDirection:"row",alignItems:"center"}}>
              <Form.Label>Amount: </Form.Label>
                 <Form.Select className={styleSheet["form-controls"]} aria-label="expensecurrency"
                  ref={currencyInputRef} 
                  value={currency} 
                  onChange={currencyInputChangeHandler}>
                  <option value={null}>Select Currency</option>
                  <option value="$">$</option>
                  <option value="₹">₹</option>
                  <option value="€">€</option>
                 </Form.Select>
              </Form.Group>  
              <Form.Group className={styleSheet["form-group"]}>
                <Form.Select  aria-label="expenseCategroy"
               ref = {categoryInputRef}
               value={category}
               onChange ={catergoryInputChangeHandler}
              className={styleSheet["form-controls"]}>
                <option value={null}>Select Where you spend</option>
                <option value="car servicing">Car servicing</option>
                <option value="petrol">petrol</option>
                <option value="food">Food</option>
                <option value="grocery">Grocery</option>
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