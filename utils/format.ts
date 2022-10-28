import { format, parseISO } from 'date-fns'

export const currency = {
	USD: '$0,000',
}
// Example 1: (123) 456 - 7890
// numericStringMask('1234567890', '(###) ### - ####')
// Example 2: (123) 456-7890
// numericStringMask('1234567890', '(###) ###-####')
// Example 3: (11) 90056-7890
// numericStringMask('11900567890', '(##) #####-####')
export function numericStringMask(str: string, mask: string) {
	if (!mask) return str
	const numeric = str.replaceAll(/[^\d]/g, '')
	let idx = 0
	const formated = mask.split('').map((el) => {
		if (el === '#') {
			el = numeric[idx]
			idx++
		}
		return el
	})
	return formated.join('')
}
const formatComaSystem = (value: string) => {
	const indexOfComa = value.toString().indexOf('.')
	if (indexOfComa === -1) {
		return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}
	const partDecimal = value.toString().substr(indexOfComa, value.length)
	const partNumber = value.toString().substr(0, indexOfComa)
	return `${partNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${partDecimal}`
}
export function formatDateISO(date: string) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}
export const formatDate = (date: string, type: string) => {
	return format(parseISO(date), type)
}
export const formatDateSpecial = (date: number, type: string) => {
	return format(date, type)
}
export const calculatorDate = (date: Date, distance: number, type: string) => {
	return type === 'before'
		? date.setDate(date.getDate() - distance)
		: date.setDate(date.getDate() + distance)
}
export const formatMoney = (money: number) => {
	return money.toLocaleString('it-IT', {
		style: 'currency',
		currency: 'VND',
	})
}
export const formatMoneyCustom = (money: string) => {
	return money.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const renderAmount = (value: any) => {
	if (!value || value?.toString().toLowerCase() === 'nan') return 0
	return formatComaSystem(value)
}

export const splitString = (hex: string | null | undefined, numStart = 6, numEnd = 4): string => {
	if (!hex?.length) return ''
	if (hex?.length < numStart + numEnd) return hex
	return hex?.substring(0, numStart) + '...' + hex.substring(hex.length - numEnd)
}
