import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import messagesReducer from '../features/messages/messageSlice';
import projectReducer from '../features/projects/projectSlice';
import viewTokenReducer from '../features/viewTokens/viewTokenSlice';
import workFlowReducer from '../features/workFlow/workFlowSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    project: projectReducer,
    viewToken: viewTokenReducer,
    workFlow: workFlowReducer,
  },
});
