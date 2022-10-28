import Image from 'next/image'
import styles from './Confirm.module.scss'
import confirm from 'public/assets/img/Header/confirm.png'
import Countdown from 'react-countdown'
import { Time } from 'constants/time'
import { useTranslations } from 'next-intl'
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import homePage from 'services/HomePage'
import { notify } from 'utils/notification'
import { Input } from 'antd'
import useMedia from 'use-media'
import { setLoading, setUserInformation } from 'redux/reducers/common'
import { useAppDispatch } from 'redux/reducers/hooks'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { Breakpoint, Status } from 'constants/enums/Common'
const { Search } = Input
const ConfirmComponent = () => {
	const router = useRouter()
	const dispatch = useAppDispatch()
	const { email, type }: any = router.query
	const isMobile = useMedia({ maxWidth: `${Breakpoint.LDPhone}px` })
	const [countdown, setCountdown] = useState<boolean>(false)
	const t = useTranslations()
	const handleCountdown = (props: any): ReactNode => {
		const { seconds, completed }: { seconds: number; completed: boolean } = props
		if (completed) {
			setCountdown(false)
		} else {
			return `${seconds}s`
		}
	}
	const handleResendOTP = async () => {
		try {
			const { data, status }: { data: any; status: number } = await homePage.getResendOTP(
				email,
				router?.locale || ''
			)
			if (status === Status.SUCCESS) {
				notify('success', data?.message || '', Time.NOTIFY)
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || t('common-error'), Time.NOTIFY)
		}
	}
	const onSearch = async (value: string) => {
		try {
			dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = await homePage.postVerifyOTP(
				{
					email: email,
					otp: value,
				},
				router?.locale || ''
			)
			if (status === Status.SUCCESS) {
				// is NewPassword
				if (type) {
					router.push({
						pathname: WebsiteRoutesRedirect.new_password,
						query: { email: email },
					})
				} else {
					// is Register
					dispatch(setUserInformation(data?.data))
					router.push(WebsiteRoutesRedirect.homePage)
				}
				notify('success', data?.message || '', Time.NOTIFY)
			}
			dispatch(setLoading(false))
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || t('common-error'), Time.NOTIFY)
			dispatch(setLoading(false))
		}
	}
	return (
		<div className={styles.confirm}>
			<div className={styles.confirm__child}>
				<h3>Chúng tôi đã gửi mã xác nhận mail cho bạn</h3>
				<div className={styles.confirm__child__img}>
					<Image
						className={styles.confirm__child__img__item}
						src={confirm}
						alt="SolidBytesConfirm"
						width={215.13}
						height={138.91}
						objectFit="contain"
					/>
				</div>

				<p className={styles.confirm__child__confirm}>
					Xin vui lòng xác nhận <span>{email}</span>
					{type
						? ' để thay đổi mật khẩu tại SolidBytes. Bạn có thể tìm thư xác nhận qua Email hoặc hộp thư Spam'
						: ' để kích hoạt tài khoản tại SolidBytes. Bạn có thể tìm thư xác nhận qua Email hoặc hộp thư Spam'}
				</p>
				<Search
					className={styles.confirm__child__otp}
					placeholder="Nhập mã OTP tại đây"
					enterButton={type ? 'Thay đổi' : 'Kích hoạt'}
					size={isMobile ? 'middle' : 'large'}
					onSearch={onSearch}
				/>
				<p className={styles.confirm__child__resend}>
					Bạn không nhận được email của chúng tôi.
					<span onClick={() => setCountdown(true)}>
						{countdown ? (
							<Countdown
								date={Date.now() + Time.COUNT_DOWN}
								renderer={(props) => handleCountdown(props)}
							/>
						) : (
							<span onClick={handleResendOTP}>Gửi lại</span>
						)}
					</span>
				</p>
			</div>
		</div>
	)
}
export default ConfirmComponent
