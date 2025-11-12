"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import authReducer from "../store/slices/authSlice";

// 🔹 Combine all reducers (you may have more later)
const rootReducer = combineReducers({
  auth: authReducer,
});

// 🔹 Persist configuration
const persistConfig = {
  key: "root",          // key for localStorage
  storage,              // use localStorage
  whitelist: ["auth"],  // only persist auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Configure store with persistence
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 🔹 Create persistor
export const persistor = persistStore(store);

// 🔹 Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
