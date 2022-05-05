import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { wipe as project_wipe } from "../projects/projectSlice";
import { wipe as message_wipe } from "../messages/messageSlice";
import { wipe as viewToken_wipe } from "../viewTokens/viewTokenSlice";
// get user from local storage
const user = JSON.parse(localStorage.getItem("user"));


const initialState = {
    user: user ? user : null ,
    friend: {
        _id : "",
        f_name : "",
        l_name : "",
        email : "",
        company : "",
        followers : [],
        following : [],
        verified : false,
        createdAt : "",
        updatedAt : "",
        img_url : "",
        intro : ""
    },
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

// register user
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try{
        const payload =  await authService.register(user);
        if (payload.success) {
            return payload;
        }
        return thunkAPI.rejectWithValue(payload);
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try{

        const payload =  await authService.login(user);
        if (!payload.success){
            return thunkAPI.rejectWithValue({message: payload.message});
        }
        return payload;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
});

export const verifyAccount = createAsyncThunk("auth/verify", async (token, thunkAPI) => {
    try{
        const payload = await authService.verifyAccount(token)
        if (payload.success){
            return payload;
        }
        return thunkAPI.rejectWithValue({message: payload.message});
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const getUser = createAsyncThunk("auth/getUser", async (username, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        const payload = await authService.getUser(username, token);
        if (!payload.success){
            return thunkAPI.rejectWithValue({message: payload.message});
        }
        return payload;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const updateFollow = createAsyncThunk("auth/following", async (username, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        const payload =  await authService.updateFollow(username, token);
        if (!payload.success){
            return thunkAPI.rejectWithValue({message: payload.message});
        }
        return payload;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const searchUser = createAsyncThunk("auth/searchUser", async (username, thunkAPI) => {
    try{
        const payload =  await authService.searchUser(username);
        if (!payload.success){
            return thunkAPI.rejectWithValue({message: payload.message});
        }
        return payload;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const getUserByid = createAsyncThunk("auth/getUserByid", async (id, thunkAPI) => {
    try{
        const payload =  await authService.getUserByid(id);
        if (!payload.success){
            return thunkAPI.rejectWithValue({message: payload.message});
        }
        return payload;
    }
    catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        }).addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
        }).addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                }).addCase(login.pending, (state) => {
                    state.isLoading = true;
                }).addCase(login.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.user = action.payload.user;
                }).addCase(login.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                    state.user = null;
                    })
                    .addCase(getUser.pending, (state) => {
                        state.isLoading = true;
                    }).addCase(getUser.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                        state.friend = action.payload.user;
                    }).addCase(getUser.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload.message;
                        })
                    .addCase(verifyAccount.pending, (state) => {
                        state.isLoading = true;
                    }).addCase(verifyAccount.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                    }).addCase(verifyAccount.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload;
                        })
                        .addCase(updateFollow.pending, (state) => {
                            state.isLoading = true;
                        }).addCase(updateFollow.fulfilled, (state, action) => {
                            state.isLoading = false;
                            state.isSuccess = true;
                            state.friend = action.payload.friend;
                            state.user = {...action.payload.user, token: state.user.token};
                            localStorage.setItem("user", JSON.stringify(state.user));
                        }).addCase(updateFollow.rejected, (state, action) => {
                            state.isLoading = false;
                            state.isError = true;
                            state.message = action.payload;
                            })
                            .addCase(searchUser.pending, (state) => {
                                state.isLoading = true;
                            }).addCase(searchUser.fulfilled, (state, action) => {
                                state.isLoading = false;
                                state.isSuccess = true;
                            }).addCase(searchUser.rejected, (state, action) => {
                                state.isLoading = false;
                                state.isError = true;
                                state.message = action.payload;
                                })
                                .addCase(getUserByid.pending, (state) => {
                                    state.isLoading = true;
                                }).addCase(getUserByid.fulfilled, (state, action) => {
                                    state.isLoading = false;
                                    state.isSuccess = true;
                                }).addCase(getUserByid.rejected, (state, action) => {
                                    state.isLoading = false;
                                    state.isError = true;
                                    state.message = action.payload;
                                    })
                        
    }
});

export const { reset } = authSlice.actions;
export default  authSlice.reducer;