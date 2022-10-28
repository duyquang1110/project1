export interface HomePageProps {
	statistical: StatisticalProps
	hashtag: HashtagProps<string>[]
	jobPaging: JobPagingPaginationProps
	companyPaging: {
		data: CompanyPagingProps<string>[]
		links: any
		meta: any
	}
}
export interface DetailProps<T> {
	object: {
		detail: JobPagingProps<T>
		job: JobPagingPaginationProps
	}
}
export interface CompanyPagingProps<T> {
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
export interface JobPagingPaginationProps {
	data: JobPagingProps<string>[]
	links: any
	meta: any
}
export interface HashtagProps<T> {
	count: number
	name: T
	uuid: T
}
export interface StatisticalProps {
	count_cv: number
	count_job: number
}
export interface JobPagingProps<T> {
	address: T
	appointment: T
	avatar: T
	benefit: T[]
	benefit_description: T
	city: any
	country: any
	level: T[]
	isExpired: boolean
	isSaved: boolean
	createdAt: T
	description: T
	areas: {
		createdAt: T
		id: T
		name: T
		slug: T
		status: any
		type: T
		updatedAt: T
	}[]
	district: any
	expireAt: T
	format: any
	introduction: T
	periodic: T
	isBonus: number
	isTurnOn: boolean
	more_detail: T
	gender: T[]
	number_vacancies: T
	optimizeSEO: T
	position: T
	quantity: number
	salary: any
	signature: T
	skill_experience: T
	skills: T
	status: T
	title: T
	type_job: T[]
	updatedAt: T
	user: any
	userUuid: T
	uuid: T
	ward: any
}
