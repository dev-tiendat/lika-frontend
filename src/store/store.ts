import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistCombineReducers } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import auth from "./auth";
import global from "./global";
import test from "./test";

const persistConfig = {
	key: "root",
	storage
};

const reducers = persistCombineReducers(persistConfig, {
	auth: auth.reducer,
	global: global.reducer,
	test: test.reducer
});

const store = configureStore({
	reducer: reducers,
	middleware: [thunk]
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
