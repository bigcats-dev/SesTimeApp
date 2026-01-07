import { createSlice } from "@reduxjs/toolkit";

const timestamp = createSlice({
  name: 'timestamp',
  initialState: { checkIn: null },
  reducers: {
    setTime: (state, action) => {
      state.checkIn = action.payload
    },
    clearTime: (state) => {
      state.checkIn = null
    },
  },
})

export const { setTime, clearTime } = timestamp.actions;
export default timestamp.reducer