import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "./messageService";

const initialState = {
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getMessages = createAsyncThunk("messages/get", async (username, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.getMessages(username, token);
        if (response.status === 200) {
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
});

export const sendMessage = createAsyncThunk("messages/send", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.sendMessage(data.username, data.message, token);
        if (response.status === 200) {
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
});

export const deleteMessage = createAsyncThunk("messages/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await messageService.deleteMessage(id, token);
        if (response.status === 200) {
            return response.data;
        } else {
            response.status(400);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error);
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
            state.message = action.payload;
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
                    state.message = action.payload;
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
                        state.message = action.payload;
                        })
    }
});

export const { reset } = messageSlice.actions;
export default  messageSlice.reducer;