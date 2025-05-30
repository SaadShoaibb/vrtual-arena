import { combineReducers } from "redux";
import modalReducer from './ModalSlice'
import bookModalReducer from './bookModalSlice'
import userDataReducer from './userSlice'
import tournamentsReducer from './tournamentSlice'
import productsReeducer from './productSlice'
import cartSidebarReducer from './cartSideBarSlice'
import cartReducer from './addToCartSlice'
import wishlistReducer from './wishlistSlice'
import notificationReducer from './notificationSlice'
import reviewsReducer from './reviewSlice'
export default combineReducers({
    modal: modalReducer,
    bookModal: bookModalReducer,
    userData:userDataReducer,
    tournaments: tournamentsReducer,
    products:productsReeducer,
    cartSidebar: cartSidebarReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
    review:reviewsReducer
})