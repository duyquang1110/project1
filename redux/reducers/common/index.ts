import { configureStore, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
import { Action } from 'redux'
import LocalStorageClass from 'config/localStorage'
import { RootState } from 'config/configureStore'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { InitialStateProps } from './model'
import { userInformationProps } from 'models/Header'
const nameReducers = 'commonReducers'
const initialState: InitialStateProps = {
	loading: false,
	filterCommon: {
		keySearch: '',
		keyCity: '',
		keyWorkForm: '',
		keyExperience: '',
		keyLevel: '',
		keySalary: ''
	},
	userInformationJobSeeker:
		typeof window !== 'undefined' ? LocalStorageClass.getLocalUserInformation() || '' : '',
	menuClicked: parseInt(LocalStorageClass?.getLocalMenuClicked() || '0') || 0,
}
const commonReducers = createSlice({
	name: nameReducers,
	initialState: initialState,
	reducers: {
		setUserInformation: (state, action: PayloadAction<userInformationProps<string>>) => {
			state.userInformationJobSeeker = action.payload
			LocalStorageClass.updateLocalUserInformation(action.payload)
		},
		setMenuClicked: (state, action: PayloadAction<number>) => {
			state.menuClicked = action.payload
			LocalStorageClass.updateLocalMenuClicked(String(action.payload))
		},
		removeAccessToken: (state, action: PayloadAction<string>) => {
			state.userInformationJobSeeker = action.payload
			LocalStorageClass.removeLocalUserInformation()
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload
		},
		setKeyCommon: (state, action: PayloadAction<{
			keySearch: string
			keyCity: string
			keyWorkForm: string
			keyExperience: string
			keyLevel: string
			keySalary: string
		}>) => {
			state.filterCommon = action.payload
		},
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			console.log('HYDRATE', state, action.payload)
			return {
				...action.payload,
			}
		},
	},
})
const makeStore = () =>
	configureStore({
		reducer: {
			[commonReducers.name]: commonReducers.reducer,
		},
		devTools: true,
	})
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>
const { reducer, actions } = commonReducers
export const { setMenuClicked, setKeyCommon, setUserInformation, setLoading, removeAccessToken } = actions
export const menuClickedReducer = (state: RootState) => state[nameReducers].menuClicked
export const loadingReducer = (state: RootState) => state[nameReducers].loading
export const keySearchReducer = (state: RootState) => state[nameReducers].filterCommon.keySearch
export const keyCityReducer = (state: RootState) => state[nameReducers].filterCommon.keyCity
export const keyLevelReducer = (state: RootState) => state[nameReducers].filterCommon.keyLevel
export const keySalaryReducer = (state: RootState) => state[nameReducers].filterCommon.keySalary
export const keyWorkFormReducer = (state: RootState) => state[nameReducers].filterCommon.keyWorkForm
export const keyExperienceReducer = (state: RootState) => state[nameReducers].filterCommon.keyExperience
export const userInformationReducer = (state: RootState) => state[nameReducers].userInformationJobSeeker
export default reducer
export const wrapper = createWrapper<AppStore>(makeStore)
