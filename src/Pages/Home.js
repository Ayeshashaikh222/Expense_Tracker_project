import React from 'react'
import Header from '../components/Layout/Header';
import AddExpenses from '../components/Expenses/AddExpenses';
import Expenses from '../components/Expenses/Expenses';
import {Container, Button} from "react-bootstrap";
import stylesheet from './Home.module.css';
import {useDispatch, useSelector} from "react-redux";
import { themeActions } from '../Store/themeSlice';
import { expenseActions } from '../Store/expenseSlice';


const Home = (props) => {

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.authentication.isLoggedIn);
  const totalAmount = useSelector((state) => state.expenses);
  const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
  const isDarkThemeActivate = useSelector(state => state.theme.isDarkThemeActivate);
  
  
  // const [expenses, setExpenses] = useState([]);


  const toogleTheme = () => {
     if(isDarkTheme){
      dispatch(themeActions.enableLightTheme());
     } else {
         dispatch(themeActions.enableDarkTheme());
     }
  };

    const addExpenseHandler = (expenseData) =>{
        // setExpenses((prevExpense) => {
        //    return  [...prevExpense, expenseData]
        dispatch(expenseActions.setTotalAmount(expenseData));
    if (
      totalAmount + expenseData.amount >= 10000 &&
      !isDarkThemeActivate &&
      isLoggedIn
    ) {
      dispatch(toogleDarkThemActivate());
    }
  };
  const premiumThem = isDarkTheme ? stylesheet["dark-them"] : ""

    //     })
    // };
    // console.log(expenses);

  return (

    <Container fluid  className={isDarkTheme?stylesheet["dark-them"]:''}>
         <Header />
         <Button className={stylesheet['active-premium']} onClick={toogleTheme}>Active Premium</Button>
         <AddExpenses onAddExpense={addExpenseHandler} premiumThem={premiumThem}/>
         <Expenses/> 
      </Container>
    
  );
};

export default Home;