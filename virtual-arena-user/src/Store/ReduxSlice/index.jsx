import { combineReducers } from "redux";
import modalReducer from './ModalSlice'
import bookModalReducer from './bookModalSlice'
import userDataReducer from './userSlice'
import tournamentsReducer from './tournamentSlice'
import productsReducer from './productSlice'
import dealsReducer from './dealSlice'
import cartSidebarReducer from './cartSideBarSlice'
import cartReducer from './addToCartSlice'
import wishlistReducer from './wishlistSlice'
import notificationReducer from './notificationSlice'
import reviewsReducer from './reviewSlice'
import languageReducer from './languageSlice'

export default combineReducers({
    modal: modalReducer,
    bookModal: bookModalReducer,
    userData: userDataReducer,
    tournaments: tournamentsReducer,
    products: productsReducer,
    deals: dealsReducer,
    cartSidebar: cartSidebarReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
    review: reviewsReducer,
    language: languageReducer,
})