import {configureStore} from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import expenseReducer from "./expenseSlice";
import themeSliceReducer from "./themeSlice";


const store = configureStore({
    reducer: {
        authentication: authReducer,
        expense: expenseReducer,
        theme: themeSliceReducer,
    }
});


export default store;