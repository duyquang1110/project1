const regex = {
	password: new RegExp(
		/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%#*?&+~^|{}:;<>])[A-Za-z\d#$@$!%*?&+~^|{}:;<>]{8,30}$/
	),
	email: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
	phone: new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,9}$/),
}
export default regex
