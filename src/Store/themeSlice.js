import {createSlice} from "@reduxjs/toolkit"

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        isDarkTheme: false,
        isDarkThemeActivate:false
    },
    reducers: {
       enableDarkTheme (state) {
        state.isDarkTheme = true
       },
       enableLightTheme (state) {
        state.isDarkTheme = false
       },
       toogleDarkThemeActivate (state) {
        state.isDarkThemeActivate = !state.isDarkThemeActivate
       },
    },
});

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;