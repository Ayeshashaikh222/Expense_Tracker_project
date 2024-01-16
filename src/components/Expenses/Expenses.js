import React, {useState, useEffect, useContext} from "react";
import { Container, ListGroup } from "react-bootstrap";
import styleSheet from "./Expenses.module.css";
import AuthContext from "../../Store/AuthContext";

const Expenses = () => {

    const authcontext = useContext(AuthContext);

    const [expenses, setExpenses] = useState([]);

    const email = authcontext.email.replace(/[^a-zA-Z0-9]/g, "");

    const fetchExpenseHandler = () => {
        fetch(`https://expensedata-34e5e-default-rtdb.firebaseio.com/expenses${email}.json`).then((res) => {
            if(res.ok){
                console.log("Successful");
                return res.json();
            } else {
                return res.json().then((data)=> {
                    console.log("Failed to fetch expenses");
                });
            }
        }).then((data) => {
            let fetchedExpenses = []
            for(const key in data){
                fetchedExpenses.push({
                    id: key,
                    currency: data[key].currency,
                    category: data[key].category,
                    description: data[key].description,
                    amount: data[key].amount
                })
            }
            setExpenses(fetchedExpenses);
        }).catch((error) => {
            console.log("Error", error);
        })
    };

    useEffect(() => {
        fetchExpenseHandler();
    }, [fetchExpenseHandler]);


    return (
        <>
        <Container breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs"
        className={styleSheet.expenses}>
            <ListGroup as="ul" className={styleSheet.ul}>
                {expenses.map((expense, index) => (
                   <ListGroup.Item key={index} as="li" style={{color: "#000"}} className={styleSheet.list}>
                   {expenses.currency} - {expense.category} - {expense.description} -  ${expense.amount}  
                    
                   </ListGroup.Item>
                     
                ))}
                
            </ListGroup>
        </Container>
        </>
    );
};

export default Expenses;