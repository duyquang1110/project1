import { userInformationProps } from 'models/Header'

export interface InitialStateProps {
	menuClicked: number
	filterCommon: {
		keySearch: string
		keyCity: string
		keyWorkForm: string
		keyExperience: string
		keyLevel: string
		keySalary: string
	}
	loading: boolean
	userInformationJobSeeker: userInformationProps<string> | string
}
