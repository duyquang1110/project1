import { ListResponse } from 'models/common/index'
import axiosClient from 'config/axiosClient'
import { Pagination } from 'constants/enums/Common'
import { NewPasswordConfirmProps, RegisterFormProps, VerifyOTPProps } from 'models/Header';
const homePage = {
	postAuthLogin(object: { email: string; password: string }, lang: string): Promise<ListResponse> {
		const url = '/auth/login'
		return axiosClient.post(url, object, {
			params: {
				lang,
			},
		})
	},
	postUserSaveJob(
		object: {
			jobUuid: string
		},
		lang: string
	): Promise<ListResponse> {
		const url = '/user/save-job'
		return axiosClient.post(url, object, {
			params: {
				lang,
			},
		})
	},
	deleteUserSaveJob(uuid: string, lang: string): Promise<ListResponse> {
		const url = `/user/save-job/${uuid}`
		return axiosClient.delete(url, {
			params: {
				lang,
			},
		})
	},
	getAllJobPaging(
		lang: string,
		search: string,
		cityName: string,
		workForm: string,
		experience: string,
		level: string,
		fromMoney: string,
		toMoney: string,
		page?: number
	): Promise<ListResponse> {
		const url = '/job/paging'
		return axiosClient.get(url, {
			params: {
				lang,
				page: page ? page : Pagination.PAGE,
				limit: Pagination.LIMIT,
				search,
				['filter.areas.name']: cityName,
				['filter.type_job']: workForm,
				['filter.skill_experience']: experience,
				['filter.level']: level,
				['filter.salary.from']: fromMoney,
				['filter.salary.to']: toMoney,

			},
		})
	},
	getAllHashtagPaging(lang: string): Promise<ListResponse> {
		const url = '/hashtag/paging'
		return axiosClient.get(url, {
			params: {
				lang,
				page: Pagination.PAGE,
				limit: Pagination.LIMIT,
			},
		})
	},
	getAllJobById(lang: string, uuid: string): Promise<ListResponse> {
		const url = `/job/${uuid}`
		return axiosClient.get(url, {
			params: {
				lang,
				page: Pagination.PAGE,
				limit: Pagination.LIMIT,
			},
		})
	},
	getAllUserSubmittedJobs(lang: string): Promise<ListResponse> {
		const url = '/user/submitted-jobs'
		return axiosClient.get(url, {
			params: {
				lang,
				page: Pagination.PAGE,
				limit: Pagination.LIMIT,
			},
		})
	},
	postResetPassword(object: NewPasswordConfirmProps<string>, lang: string): Promise<ListResponse> {
		const url = '/auth/reset-password'
		return axiosClient.post(url, object, {
			params: {
				lang,
			},
		})
	},
	postVerifyOTP(object: VerifyOTPProps<string>, lang: string): Promise<ListResponse> {
		const url = '/user/verify-otp'
		return axiosClient.post(url, object, {
			params: {
				lang,
			},
		})
	},
	postRegister(object: RegisterFormProps<string>, lang: string): Promise<ListResponse> {
		const url = '/auth/register'
		return axiosClient.post(url, object, {
			params: {
				lang,
			},
		})
	},
	getResendOTP(email: string, lang: string): Promise<ListResponse> {
		const url = `/user/send-otp/${email}`
		return axiosClient.get(url, {
			params: {
				lang,
			},
		})
	},
}
export default homePage
