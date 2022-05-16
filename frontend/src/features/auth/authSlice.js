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
        const response =  await authService.register(user);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try{

        const response =  await authService.login(user);
        return response.data;
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
        const response = await authService.verifyAccount(token)
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const getUser = createAsyncThunk("auth/getUser", async (username, thunkAPI) => {
    try{
        const response = await authService.getUser(username);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const updateFollow = createAsyncThunk("auth/following", async (username, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        const response =  await authService.updateFollow(username, token);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const searchUser = createAsyncThunk("auth/searchUser", async (username, thunkAPI) => {
    try{
        const response =  await authService.searchUser(username);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const getUserByid = createAsyncThunk("auth/getUserByid", async (id, thunkAPI) => {
    try{
        const response =  await authService.getUserByid(id);
        return response.data;
    }
    catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const updateUser = createAsyncThunk("auth/updateUser", async (data, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        const response =  await authService.updateUser(data, token);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const updatePassword = createAsyncThunk("auth/updatePassword", async (data, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token;
        const response =  await authService.updatePassword(data, token);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data, thunkAPI) => {
    try{
        const token = data.token;
        const response =  await authService.resetPassword(data, token);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const createResetPassword = createAsyncThunk("auth/createResetPassword", async (data, thunkAPI) => {
    try{
        const response =  await authService.createResetPassword(data);
        return response.data;
    }catch(error){
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
            state.message = action.payload.message;
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
                    state.message = action.payload.message;
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
                        state.message = action.payload.message;
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
                            state.message = action.payload.message;
                            })
                            .addCase(searchUser.pending, (state) => {
                                state.isLoading = true;
                            }).addCase(searchUser.fulfilled, (state, action) => {
                                state.isLoading = false;
                                state.isSuccess = true;
                            }).addCase(searchUser.rejected, (state, action) => {
                                state.isLoading = false;
                                state.isError = true;
                                state.message = action.payload.message;
                                })
                                .addCase(getUserByid.pending, (state) => {
                                    state.isLoading = true;
                                }).addCase(getUserByid.fulfilled, (state, action) => {
                                    state.isLoading = false;
                                    state.isSuccess = true;
                                }).addCase(getUserByid.rejected, (state, action) => {
                                    state.isLoading = false;
                                    state.isError = true;
                                    state.message = action.payload.message;
                                    })
                                    .addCase(updateUser.pending, (state) => {
                                        state.isLoading = true;
                                    }).addCase(updateUser.fulfilled, (state, action) => {
                                        state.isLoading = false;
                                        state.isSuccess = true;
                                        state.user = {...action.payload.user, token: state.user.token};
                                        localStorage.setItem("user", JSON.stringify(state.user));
                                    }).addCase(updateUser.rejected, (state, action) => {
                                        state.isLoading = false;
                                        state.isError = true;
                                        state.message = action.payload.message;
                                        })
                                        .addCase(updatePassword.pending, (state) => {
                                            state.isLoading = true;
                                        }).addCase(updatePassword.fulfilled, (state, action) => {
                                            state.isLoading = false;
                                            state.isSuccess = true;
                                        }).addCase(updatePassword.rejected, (state, action) => {
                                            state.isLoading = false;
                                            state.isError = true;
                                            state.message = action.payload.message;
                                            })
                                            .addCase(resetPassword.pending, (state) => {
                                                state.isLoading = true;
                                            }).addCase(resetPassword.fulfilled, (state, action) => {
                                                state.isLoading = false;
                                                state.isSuccess = true;
                                            }).addCase(resetPassword.rejected, (state, action) => {
                                                state.isLoading = false;
                                                state.isError = true;
                                                state.message = action.payload.message;
                                                })
                                                .addCase(createResetPassword.pending, (state) => {
                                                    state.isLoading = true;
                                                }).addCase(createResetPassword.fulfilled, (state, action) => {
                                                    state.isLoading = false;
                                                    state.isSuccess = true;
                                                }).addCase(createResetPassword.rejected, (state, action) => {
                                                    state.isLoading = false;
                                                    state.isError = true;
                                                    state.message = action.payload.message;
                                                    })
                        
    }
});

export const { reset } = authSlice.actions;
export default  authSlice.reducer;