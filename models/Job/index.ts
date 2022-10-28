export interface JobProps<T> {
	id: T
	title: T
	money: T
	date: T
	des: T
	location: T[]
	time: T
	status: boolean
	stick: boolean
}
export interface FilterProps {
	city: string
	search: string
	level: string
	workForm: string
	salary: string
	experience: string
}