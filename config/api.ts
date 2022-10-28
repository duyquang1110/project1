import { AxiosPromise } from 'axios'
import Cookies from 'js-cookie'
import { ListResponse } from 'models/common'
import axiosClient from './axiosClient'
interface ApiRequestProps {
	url: string
	data?: any
	customHeader?: any
	token?: string
}
const tokenCSR = Cookies.get('userInformationJobSeeker')
const getHeader = () => {
	if (tokenCSR)
		return {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + tokenCSR,
		}
	else {
		return {}
	}
}
const apiGet = ({ url, customHeader, token }: ApiRequestProps): AxiosPromise<ListResponse> => {
	return axiosClient({
		method: 'get',
		url,
		headers: {
			...getHeader(),
			...(token && {
				Authorization: 'Bearer ' + token,
			}),
			...customHeader,
		},
	})
}
// const apiPost = ({ url, customHeader, data }: ApiRequestProps): AxiosPromise<ListResponse<any>> => {
// 	return axiosClient({
// 		method: 'post',
// 		data,
// 		url,
// 		headers: { ...getHeader(), ...customHeader },
// 	})
// }
export { apiGet }
