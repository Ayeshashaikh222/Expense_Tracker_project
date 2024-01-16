import React, {useState} from 'react'
import Header from '../components/Layout/Header';
import AddExpenses from '../components/Expenses/AddExpenses';
import Expenses from '../components/Expenses/Expenses';
import {Container} from "react-bootstrap";

const Home = (props) => {

  const [expenses, setExpenses] = useState([])

    const addExpenseHandler = (expenseData) =>{
        setExpenses((prevExpense) => {
           return  [...prevExpense, expenseData]
        })
    };
    console.log(expenses);

  return (

      <Container style={{minHeight: "100vh", height: "100%"}}>
         <Header />
         <AddExpenses  onAddExpense={addExpenseHandler}/>
         <Expenses expenses={expenses}/> 
      </Container>
    
  );
};

export default Home;