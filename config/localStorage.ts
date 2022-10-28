import Cookies from 'js-cookie'
class LocalStorageClass {
	getLocalMenuClicked() {
		const menuClickedLocal = Cookies.get('menuClicked')
		if (menuClickedLocal) {
			return menuClickedLocal
		}
	}
	getLocalLogin() {
		const login = Cookies.get('saveLogin')
		if (login) {
			return JSON.parse(login)
		}
	}
	updateLocalLogin(object: any) {
		if (object) {
			Cookies.set('saveLogin', JSON.stringify(object))
		}
	}
	updateLocalMenuExpand(menuExpand: string) {
		if (menuExpand) {
			Cookies.set('menuExpand', menuExpand)
		}
	}
	updateLocalMenuClicked(menuClicked: string) {
		if (menuClicked) {
			Cookies.set('menuClicked', menuClicked)
		}
	}
	getLocalUserInformation() {
		const accessTokenLocal = Cookies.get('userInformationJobSeeker')
		if (accessTokenLocal) {
			return JSON.parse(accessTokenLocal)
		}
	}
	updateLocalUserInformation(userInformationJobSeeker: any) {
		if (userInformationJobSeeker) {
			Cookies.set('userInformationJobSeeker', JSON.stringify(userInformationJobSeeker))
		}
	}
	removeLocalUserInformation() {
		Cookies.remove('userInformationJobSeeker')
	}
	removeLocalLogin() {
		Cookies.remove('saveLogin')
	}
	getLocalAccessToken() {
		const accessTokenLocal = Cookies.get('accessToken')
		if (accessTokenLocal) {
			return accessTokenLocal
		}
	}
	updateLocalAccessToken(accessToken: string) {
		if (accessToken) {
			Cookies.set('accessToken', JSON.stringify(accessToken))
		}
	}
	removeLocalAccessToken() {
		Cookies.remove('accessToken')
	}
}

export default new LocalStorageClass()
