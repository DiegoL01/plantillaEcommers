import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/productSlice'
import cartReducer from './features/cartSlice'
import userReducer from './features/userSlice'
import toastReducer from './features/toastSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productReducer,
      cart: cartReducer,
      user: userReducer,
      toast: toastReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
