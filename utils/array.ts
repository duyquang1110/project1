export const convertEmailsToArray = (emails: string): Array<string> => {
	return emails.split(',').map((email) => email.trim())
}
