"use client"
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './ReduxSlice/index'
export const store=configureStore({
    reducer: rootReducer,
})