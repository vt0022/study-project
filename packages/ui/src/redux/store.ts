import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Config persistence for state
const persistConfig = {
    key: "user",
    storage,
};

// Create reducer with persistence
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Where to store the state of the application
const store = configureStore({
    reducer: {
        user: persistedUserReducer,
    },
});

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
