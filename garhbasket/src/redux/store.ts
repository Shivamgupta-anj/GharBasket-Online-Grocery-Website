import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlics'
import cartSlice from './cartSlice'
import wishlistSlice from './wishlistSlice'
export const store = configureStore({
    reducer:{
        user:userSlice,
        cart:cartSlice,
        wishlist:wishlistSlice
    }
})



// export type Rootstate= ReturnType<typeof store.getState>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch