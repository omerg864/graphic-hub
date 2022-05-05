import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
    projects: [],
    top_projects: [],
    private_projects: [],
    private_view_projects: [],
    project: {
        name: "",
        description: "",
        visability: "",
        images: [],
        user: "",
        createdAt: "",
        updatedAt: "",
        likes: []
    },
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getProjects = createAsyncThunk("projects/getAll", async (query, thunkAPI) => {
    try {
        const response = await projectService.getProjects(query);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data.message) || error.message;
        thunkAPI.rejectWithValue({ message });
    }
});

export const createProject = createAsyncThunk("projects/create", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await projectService.createProject(data, token);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const updateProject = createAsyncThunk("projects/update", async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await projectService.updateProject(data.id, data.content, data.type, token);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const deleteProject = createAsyncThunk("projects/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await projectService.deleteProject(id, token);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const getProject = createAsyncThunk("projects/get", async (params, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await projectService.getProject(params.name, params.username, token);
        if (response.status === 400 || response.status === 404 || response.status === 401) {
            thunkAPI.rejectWithValue({message: response.data.message});
        } else {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
});

export const getPrivateProjects = createAsyncThunk("projects/privateGet", async (_,thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await projectService.getPrivateProjects(token);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const searchProjects = createAsyncThunk("projects/search", async (query, thunkAPI) => {
    try {
        const payload = await projectService.searchProjects(query);
        if (!payload.success){
            return thunkAPI.rejectWithValue({message: payload.message});
        }
        return payload;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue({message});
    }
});


export const projectSlice = createSlice({
    name: "project",
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
        builder.addCase(getProjects.pending, (state) => {
            state.isLoading = true;
        }).addCase(getProjects.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            if (action.meta.arg.type) {
                if (action.meta.arg.type === "top") {
                    state.top_projects = action.payload.projects;
                } else {
                    state.projects = action.payload.projects;
                }
            } else {
                state.projects = action.payload.projects;
            }
        }).addCase(getProjects.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message;
            })
            .addCase(createProject.pending, (state) => {
                    state.isLoading = true;
                }).addCase(createProject.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;
                    state.projects.push(action.payload.project);
                }).addCase(createProject.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                    })
                    .addCase(deleteProject.pending, (state) => {
                        state.isLoading = true;
                    }).addCase(deleteProject.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                        state.projects = state.projects.filter(project => project.id !== action.payload.id);
                    }).addCase(deleteProject.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload;
                        })
                        .addCase(updateProject.pending, (state) => {
                            state.isLoading = true;
                        }).addCase(updateProject.fulfilled, (state, action) => {
                            state.isLoading = false;
                            state.isSuccess = true;
                            state.project = action.payload.project;
                            if (action.meta.arg.type) {
                                if (action.meta.arg.type === "top") {
                                    state.top_projects = [...state.top_projects.filter(project => project._id !== action.payload.project._id), action.payload.project];
                                }
                            } else {
                                state.projects = [...state.projects.filter(project => project._id !== action.payload.project._id), action.payload.project];
                            }
                        }).addCase(updateProject.rejected, (state, action) => {
                            state.isLoading = false;
                            state.isError = true;
                            state.message = action.payload;
                            })
                            .addCase(getProject.pending, (state) => {
                                state.isLoading = true;
                            }).addCase(getProject.fulfilled, (state, action) => {
                                state.isLoading = false;
                                state.isSuccess = true;
                                state.project = action.payload.project;
                            }).addCase(getProject.rejected, (state, action) => {
                                state.isLoading = false;
                                state.isError = true;
                                state.message = action.payload;
                                })
                                    .addCase(getPrivateProjects.pending, (state) => {
                                        state.isLoading = true;
                                    }).addCase(getPrivateProjects.fulfilled, (state, action) => {
                                        state.isLoading = false;
                                        state.isSuccess = true;
                                        state.private_projects = action.payload.projects;
                                    }).addCase(getPrivateProjects.rejected, (state, action) => {
                                        state.isLoading = false;
                                        state.isError = true;
                                        state.message = action.payload;
                                        })
                                        .addCase(searchProjects.pending, (state) => {
                                            state.isLoading = true;
                                        }).addCase(searchProjects.fulfilled, (state, action) => {
                                            state.isLoading = false;
                                            state.isSuccess = true;
                                        }).addCase(searchProjects.rejected, (state, action) => {
                                            state.isLoading = false;
                                            state.isError = true;
                                            state.message = action.payload;
                                            })
    }
});

export const { reset, wipe } = projectSlice.actions;
export default  projectSlice.reducer;