import { createSlice } from "@reduxjs/toolkit";
const User =
  localStorage.getItem("userDetail") !== null
    ? JSON.parse(localStorage.getItem("userDetail"))
    : { name: "", email: "", profile_image: "", _id: "", post: [] };
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: User,
    error: null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userDetail", JSON.stringify(state.user));
    },
    setLoading: (state) => {
      state.loading = !state.loading;
    },
    setError: (state, action) => {
      state.error = {
        message: action.payload.message,
        stack: action.payload.stack,
      };
    },

    logout: (state) => {
      state.user = {
        name: "",
        email: "",
        profile_image: "",
        _id: "",
        post: [],
      };

      localStorage.removeItem("userDetail");
    },
  },
});
export const { setUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
