import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "./messageService";

const initialState = {
    messages: [],
    chats: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getMessages = createAsyncThunk("messages/get", async (username, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.getMessages(username, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const getChats = createAsyncThunk("messages/getChats", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.getChats(token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const deleteChats = createAsyncThunk("messages/deleteChats", async (username, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.deleteChats(username, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});



export const sendMessage = createAsyncThunk("messages/send", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.sendMessage(data.username, data.message, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const deleteMessage = createAsyncThunk("messages/delete", async (username, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.deleteMessage(username, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers:{
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        },
        wipe: (state) => {
            state = initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMessages.pending, (state) => {
            state.isLoading = true;
        }).addCase(getMessages.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.messages = action.payload.messages;
        }).addCase(getMessages.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message;
            })
            .addCase(sendMessage.pending, (state) => {
                    state.isLoading = true;
                }).addCase(sendMessage.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.messages.push(action.payload.message);
                }).addCase(sendMessage.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload.message;
                    })
                    .addCase(deleteMessage.pending, (state) => {
                        state.isLoading = true;
                    }).addCase(deleteMessage.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                        state.messages = state.messages.filter(message => message.id !== action.payload.id);
                    }).addCase(deleteMessage.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload.message;
                        })
                        .addCase(getChats.pending, (state) => {
                            state.isLoading = true;
                        }).addCase(getChats.fulfilled, (state, action) => {
                            state.isLoading = false;
                            state.isSuccess = true;
                            state.chats = action.payload.chats;
                        }).addCase(getChats.rejected, (state, action) => {
                            state.isLoading = false;
                            state.isError = true;
                            state.message = action.payload.message;
                            })
                            .addCase(deleteChats.pending, (state) => {
                                state.isLoading = true;
                            }).addCase(deleteChats.fulfilled, (state, action) => {
                                state.isLoading = false;
                                state.isSuccess = true;
                                state.chats = action.payload.chats.filter(chat => chat.user.username !== action.payload.username);
                            }).addCase(deleteChats.rejected, (state, action) => {
                                state.isLoading = false;
                                state.isError = true;
                                state.message = action.payload.message;
                                })
    }
});

export const { reset, wipe } = messageSlice.actions;
export default  messageSlice.reducer;