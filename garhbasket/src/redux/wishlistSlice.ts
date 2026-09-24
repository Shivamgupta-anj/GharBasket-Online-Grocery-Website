import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IWishlistItem {
    _id: string;
    name: string;
    category: string;
    price: string;
    unit: string;
    image: string;
}

interface IWishlistSlice {
    items: IWishlistItem[];
}

const initialState: IWishlistSlice = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<IWishlistItem>) => {
            const existsIndex = state.items.findIndex((i) => i._id === action.payload._id);
            if (existsIndex >= 0) {
                state.items.splice(existsIndex, 1);
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => i._id !== action.payload);
        },
        clearWishlist: (state) => {
            state.items = [];
        }
    }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
