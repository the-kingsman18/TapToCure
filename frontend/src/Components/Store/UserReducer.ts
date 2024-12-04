import useReducer from './UserSlicer'
import { combineReducers } from '@reduxjs/toolkit';


const rootReducer = combineReducers({
    user: useReducer, // state will be available as state.user
  });

  export default rootReducer