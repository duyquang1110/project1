import { ListResponse } from 'models/common/index'
import axiosClient from 'config/axiosClient'
const common = {
	postUploadAvatar(formData: any, lang: string): Promise<ListResponse> {
		const url = '/user/upload-avatar'
		return axiosClient.post(url, formData, {
			params: {
				lang,
			},
		})
	},
}
export default common
