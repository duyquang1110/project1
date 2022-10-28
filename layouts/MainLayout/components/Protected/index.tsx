import { Time } from 'constants/time'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { notify } from 'utils/notification'
const ProtectedComponent = (props: any) => {
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
	const t = useTranslations()
	useEffect(() => {
		// setIsAuthorized(ListPermission.includes(props.requiredPermission))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return isAuthorized ? props.children : notify('success', t('authorized'), Time.NOTIFY)
}
export default ProtectedComponent
