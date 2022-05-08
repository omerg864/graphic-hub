import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import viewTokenService from "./viewTokenService";

const initialState = {
    viewTokens: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getViewTokens = createAsyncThunk("viewTokens/getAll", async (thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await viewTokenService.getViewTokens(token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const createViewToken = createAsyncThunk("viewTokens/create", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await viewTokenService.createViewToken(data, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const updateViewToken = createAsyncThunk("viewTokens/update", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await viewTokenService.updateViewToken(data, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const deleteViewToken = createAsyncThunk("viewTokens/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await viewTokenService.deleteViewToken(id, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const VerifyViewToken = createAsyncThunk("viewTokens/verify", async (token_num, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await viewTokenService.VerifyViewToken(token_num, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const viewTokenSlice = createSlice({
    name: "viewToken",
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
        builder.addCase(getViewTokens.pending, (state) => {
            state.isLoading = true;
        }).addCase(getViewTokens.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.viewTokens = action.payload.tokens;
        }).addCase(getViewTokens.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            })
            .addCase(createViewToken.pending, (state) => {
                    state.isLoading = true;
                }).addCase(createViewToken.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.viewTokens.push(action.payload.token);
                }).addCase(createViewToken.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                    })
                    .addCase(deleteViewToken.pending, (state) => {
                        state.isLoading = true;
                    }).addCase(deleteViewToken.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                        state.viewTokens = state.viewTokens.filter(token => token.id !== action.payload.id);
                    }).addCase(deleteViewToken.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload;
                        })
                        .addCase(updateViewToken.pending, (state) => {
                            state.isLoading = true;
                        }).addCase(updateViewToken.fulfilled, (state, action) => {
                            state.isLoading = false;
                            state.isSuccess = true;
                            state.viewTokens = [...state.viewTokens.filter(token => token.id !== action.payload.token.id), action.payload.token];
                        }).addCase(updateViewToken.rejected, (state, action) => {
                            state.isLoading = false;
                            state.isError = true;
                            state.message = action.payload;
                            })
                            .addCase(VerifyViewToken.pending, (state) => {
                                state.isLoading = true;
                            }).addCase(VerifyViewToken.fulfilled, (state, action) => {
                                state.isLoading = false;
                                state.isSuccess = true;
                                state.viewTokens = [...state.viewTokens.filter(token => token.id !== action.payload.token.id), action.payload.token];
                            }).addCase(VerifyViewToken.rejected, (state, action) => {
                                state.isLoading = false;
                                state.isError = true;
                                state.message = action.payload;
                                })
    }
});

export const { reset, wipe } = viewTokenSlice.actions;
export default  viewTokenSlice.reducer;