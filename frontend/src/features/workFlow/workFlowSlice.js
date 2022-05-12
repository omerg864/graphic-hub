import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workFlowService from "./workFlowService";

const initialState = {
    workFlow: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getWorkFlows = createAsyncThunk("workFlow/getAll", async (query, thunkAPI) => {
    try {
        const response = await workFlowService.getWorkFlows(query);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const updateWorkFlow = createAsyncThunk("workFlow/update", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await workFlowService.updateWorkFlow(data, token);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});

export const workFlowSlice = createSlice({
    name: "workFlow",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        },
    },
    extraReducers: builder => {
        builder.addCase(getWorkFlows.fulfilled, (state, action) => {
            state.workFlow = action.payload.workFlow;
            state.isSuccess = true;
            state.isLoading = false;
        })
        .addCase(getWorkFlows.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload.message;
        })
        .addCase(getWorkFlows.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(updateWorkFlow.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.message = action.payload.message;
        })
        .addCase(updateWorkFlow.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload.message;
        })
        .addCase(updateWorkFlow.pending, (state, action) => {
            state.isLoading = true;
        });
    }
});

export const { reset } = workFlowSlice.actions;
export default  workFlowSlice.reducer;