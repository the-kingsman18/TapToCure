import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from './UserReducer'; // import your root reducer

// Set up the configuration for redux-persist
const persistConfig = {
  key: 'root', // key for the storage
  storage, // storage engine
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = createStore(persistedReducer);

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };

// Type of the dispatch
export type AppDispatch = typeof store.dispatch;

// Type for Thunk
export type RootState = ReturnType<typeof store.getState>;