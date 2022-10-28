import { ListResponse } from 'models/common/index'
import axiosClient from 'config/axiosClient'
import { Pagination } from 'constants/enums/Common'
import { CvProps } from 'models/Admin/Account'
const adminAccountManager = {
	putUserUpdate(
		object: {
            first_name: string
			last_name: string
			phone: string
            birthday: string
			facebook_link: string
            gender: string
			email: string
			countryId: number
		},
		lang: string
	): Promise<ListResponse> {
		const url = '/user/update'
		return axiosClient.put(url, object, {
			params: {
				lang,
			},
		})
	},
	putProfile(
		object: CvProps<string>,
		lang: string
	): Promise<ListResponse> {
		const url = '/profile'
		return axiosClient.put(url, object, {
			params: {
				lang,
			},
		})
	},
	getAllUserSaveJob(lang: string, page: number): Promise<ListResponse> {
		const url = '/user/save-job'
		return axiosClient.get(url, {
			params: {
				lang,
				page: page ? page : Pagination.PAGE,
				limit: Pagination.LIMIT,
			},
		})
	},
	getAllUserSubmittedJob(lang: string, page: number): Promise<ListResponse> {
		const url = '/user/submitted-jobs'
		return axiosClient.get(url, {
			params: {
				lang,
				page: page ? page : Pagination.PAGE,
				limit: Pagination.LIMIT,
			},
		})
	},
}
export default adminAccountManager
