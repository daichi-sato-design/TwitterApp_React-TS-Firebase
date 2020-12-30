import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface USER {
  displayName: string;
  photoURL: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", photoURL: "", displayName: "" },
  },
  reducers: {
    // actionがpayloadを含みdispatchされると、stateをpayloadデータで更新する
    login: (state, action) => {
      state.user = action.payload;
    },
    // actionがdispatchされるとデータをstateから削除する
    logout: (state) => {
      state.user = { uid: "", photoURL: "", displayName: "" };
    },
    // Emailでユーザー登録した際にPayloadのdisplayNameとphotoURLをstateに登録するリデューサー
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoURL = action.payload.photoURL;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;
// selectUser UserStateの値を参照する関数
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
