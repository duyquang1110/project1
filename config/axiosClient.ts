import axios from 'axios'
import LocalStorageClass from 'config/localStorage'
import { ApiRoutesRedirect, WebsiteRoutesRedirect } from 'constants/routes'
const apiUrlWithAccessTokens = [ApiRoutesRedirect.statistical]
const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API,
	headers: {
		'content-type': 'application/json',
	},
	withCredentials: false,
	// or
	// headers: {
	// 	Authorization: `Bearer ${LocalStorageClass.getLocalAccessToken()}`,
	// },
})
axiosClient.interceptors.request.use(
	(config: any) => {
		// login thì không cần phải check accessToken
		if (apiUrlWithAccessTokens.includes(config?.url || '')) {
			return config
		}
		const userInformationJobSeeker = LocalStorageClass.getLocalUserInformation()
		if (userInformationJobSeeker?.access_token) {
			if (config?.headers) {
				// 'x-access-token' phải hỏi BE để là gì để FE để theo
				//config.headers['x-access-token'] = accessToken?.access_token
				// or
				config.headers.Authorization = `Bearer ${userInformationJobSeeker?.access_token}`
			}
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)
axiosClient.interceptors.response.use(
	(res) => {
		return res
	},
	async (err) => {
		console.log('err: ', err)
		const originalConfig = err.config
		const userInformationJobSeeker = LocalStorageClass.getLocalUserInformation()
		if (!apiUrlWithAccessTokens.includes(originalConfig?.url)) {
			// Access Token was expired
			if (
				err.response &&
				err.response.status === 401 &&
				originalConfig &&
				!originalConfig._retry &&
				userInformationJobSeeker?.refresh_token
			) {
				LocalStorageClass.removeLocalUserInformation()
				window.location.assign(WebsiteRoutesRedirect.homePage)
				originalConfig._retry = true
				// await fetch('http://localhost:3000/v1/api/auth/refresh-token', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 	},
				// 	body: JSON.stringify({
				// 		token: userInformation?.data?.refresh_token,
				// 	}),
				// })
				// 	.then((res) => res.json())
				// 	.then((res) => {
				// 		const { access_token } = res?.data
				// 		if (res?.status === Status.SUCCESS && access_token) {
				// 			originalConfig.headers.Authorization = `Bearer ${access_token}`
				// 			userInformation.data.access_token = access_token
				// 			LocalStorageClass.updateLocalUserInformation(userInformation)
				// 			return axiosClient(originalConfig)
				// 		}
				// 	})
			}
		}
		return Promise.reject(err)
	}
)
export default axiosClient
