export interface userInformationProps<T> {
	access_token: T
	avatar: T
	background: T
	country: T
	email: T
	first_name: T
	last_name: T
	phone: T
	refresh_token: T
	role: T
	status: T
	wallet: {
		amount: number
		amount_past: number
		createdAt: T
		updatedAt: T
		userUuid: T
		uuid: T
	}
	point_session_profile: {
		createdAt: T
		expiredAt: T
		isActive: number
		isFirstTime: number
		package: T
		point: number
		status: T
		updatedAt: T
		uuid: T
	}
	company: {
		address: T
		background: T
		createdAt: T
		format: T
		logo: T
		name: T
		number_personnel: number
		updatedAt: T
		uuid: T
	}
}
export interface LoginProps {
	email: string
	password: string
}
export interface NewPasswordConfirmProps<T> {
	email: T
	password: T
}
export interface RegisterProps {
	email: string
	password: string
	firstName: string
	lastName: string
	phone: string
}
export interface VerifyOTPProps<T> {
	email: T
	otp: T
}
export interface RegisterFormProps<T> {
	password: T
	email: T
	first_name: T
	last_name: T
	full_name: T
	type_register: T
	phone: T
	countryId: number
}