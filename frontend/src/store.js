import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Redux/user/userSlice";
const store = configureStore({
  reducer: { user: userReducer },
});
export default store;
