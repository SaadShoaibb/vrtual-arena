import { combineReducers } from "redux";
import dropdownReducer from './dropdownSlice'
import notificationReducer from './notificationSlice'
import reviewsReducer from './fetchReviewSlice'
import ordersReducer from './orderSlice'




export default combineReducers({

    dropdown: dropdownReducer,
    notifications: notificationReducer,
    reviews: reviewsReducer,
    orders: ordersReducer, 
})