import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload ?? null;

        },
        clearUser: (state) => {
            state.userData = null;
        }
    }
})

export const { setUserData, clearUser } = userSlice.actions
export default userSlice.reducer