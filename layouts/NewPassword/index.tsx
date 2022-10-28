import styles from './NewPassword.module.scss'
import confirm from 'public/assets/img/Header/confirm.png'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import InputComponent from 'components/InputLogin'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { notify } from 'utils/notification'
import homePage from 'services/HomePage'
import { Time } from 'constants/time'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useAppDispatch } from 'redux/reducers/hooks'
import { setLoading } from 'redux/reducers/common'
import { Status } from 'constants/enums/Common'
const NewPassword = () => {
	const t = useTranslations()
	const [typePassword, setTypePassword] = useState<string>('password')
	const router = useRouter()
	const dispatch = useAppDispatch()
	const { email }: any = router.query
	const defaultValues: any = {
		newPassword: '',
		reNewPassword: '',
	}
	const yupSchemaNewPassword = yup.object().shape({
		newPassword: yup.string().required(t('password-required')).min(6, t('password-least')),
		reNewPassword: yup
			.string()
			.required(t('password-required'))
			.min(6, t('password-least'))
			.oneOf([yup.ref('newPassword')], t('pass-word-invalid')),
	})
	const methods = useForm<any>({
		mode: 'onTouched',
		criteriaMode: 'firstError',
		reValidateMode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(yupSchemaNewPassword),
	})
	const handleNewPassword = async (object: any) => {
		try {
			dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = await homePage.postResetPassword(
				object,
				router?.locale || ''
			)
			if (status === Status.SUCCESS) {
				router.push(WebsiteRoutesRedirect.homePage)
				notify('success', data?.message || '', Time.NOTIFY)
			}
			dispatch(setLoading(false))
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || t('common-error'), Time.NOTIFY)
			dispatch(setLoading(false))
		}
	}
	const onSubmit: SubmitHandler<any> = (data: any) => {
		handleNewPassword({
			email: email,
			password: data?.newPassword || '',
		})
	}
	return (
		<section className={styles.forgetPassword}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<div className={styles.forgetPassword__child}>
						<div className={styles.forgetPassword__child__center}>
							<Image
								src={confirm}
								width={215.13}
								height={138.91}
								objectFit="contain"
								alt="SolidBytesForgetPassword"
							/>
							<h3>Tạo mật khẩu mới</h3>
							<InputComponent
								icon={
									typePassword === 'password' ? (
										<EyeOutlined
											onClick={() => setTypePassword('text')}
											className={styles.loginModal__child__icon}
										/>
									) : (
										<EyeInvisibleOutlined
											onClick={() => setTypePassword('password')}
											className={styles.loginModal__child__icon}
										/>
									)
								}
								className={styles.forgetPassword__child__center__input}
								type={typePassword}
								name="newPassword"
								placeholder='Nhập mật khẩu mới'
							/>
							<InputComponent
								icon={
									typePassword === 'password' ? (
										<EyeOutlined
											onClick={() => setTypePassword('text')}
											className={styles.loginModal__child__icon}
										/>
									) : (
										<EyeInvisibleOutlined
											onClick={() => setTypePassword('password')}
											className={styles.loginModal__child__icon}
										/>
									)
								}
								className={`${styles.forgetPassword__child__center__input} ${styles.forgetPassword__child__center__inputLast}`}
								type={typePassword}
								name="reNewPassword"
								placeholder='Nhập mật khẩu mới'
							/>
							<button type="submit">GỬI THÔNG TIN</button>
						</div>
					</div>
				</form>
			</FormProvider>
		</section>
	)
}
export default NewPassword
