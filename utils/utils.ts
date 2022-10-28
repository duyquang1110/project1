export function debounce(fn: any, wait?: number) {
	let timerId: any, lastArguments: any, lastThis: any
	return (...args: any) => {
		timerId && clearTimeout(timerId)
		lastArguments = args
		//@ts-ignore
		lastThis = this
		timerId = setTimeout(function () {
			fn.apply(lastThis, lastArguments)
			timerId = null
		}, wait || 400)
	}
}
