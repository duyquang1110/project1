import { combineReducers, configureStore } from '@reduxjs/toolkit'
import commonReducers from 'redux/reducers/common/index'
const rootReducer = combineReducers({
	commonReducers,
})
const store = configureStore({
	reducer: rootReducer,
})
export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
