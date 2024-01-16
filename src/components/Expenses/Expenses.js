import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import styleSheet from "./Expenses.module.css";

const Expenses = ({ expenses }) => {

    return (
        <>
        <Container breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minbreakpoint="xxs"
        className={styleSheet.expenses}>
            <ListGroup as="ul" className={styleSheet.ul}>
                {expenses.map((expense, index) => (
                   <ListGroup.Item key={index} as="li" style={{color: "#000"}} className={styleSheet.list}>
                   {expense.category} - {expense.description} -  ${expense.amount}  
                    
                   </ListGroup.Item>
                     
                ))}
                
            </ListGroup>
        </Container>
        </>
    );
};

export default Expenses;