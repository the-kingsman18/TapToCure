import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../../services/roles";

 
interface UserState {
    isLogIn: boolean;
    userId: number | null;
    role:UserRole|null
}
// define initial state for the slice
const initialState: UserState = {
    isLogIn: false, 
    userId: null,
    role:null,
};
  
const userSlicer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        //on logout update state
        logout: (state) => {
            state.isLogIn = false;
            state.userId = null;
            state.role=null;
        },
        //on login store user details
        login: (state, action: PayloadAction<number>) => {
            state.isLogIn = true;
            state.userId = action.payload;
        },
        //set role on login
        setRole:(state,action:PayloadAction<UserRole>)=>{
                state.role=action.payload;
        },
    },
 
});
 
export const { logout, login,setRole } = userSlicer.actions;
export default userSlicer.reducer;