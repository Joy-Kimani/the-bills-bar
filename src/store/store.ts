import { configureStore } from '@reduxjs/toolkit'
import { AuthApi } from '../features/api/AuthApi'
import authSlice from '../features/slice/AuthSlice'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// configure the Redux store
const authPersistConfig = {
    key: 'auth',
    storage,
    version: 1,
    whitelist: ['token', 'isAuthenticated', 'user'], // only persist these keys
};

//Create the persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

export const store = configureStore({
    reducer: {
        // Add the AuthApi reducer
        [AuthApi.reducerPath]: AuthApi.reducer,
        

        //add the auth slice reducer
        authSlice: persistedAuthReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(AuthApi.middleware),
})

//export the persisted store
export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch