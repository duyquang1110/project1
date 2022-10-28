import styles from './ForgetPassword.module.scss'
import confirm from 'public/assets/img/Header/confirm.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import InputComponent from 'components/InputLogin'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { notify } from 'utils/notification'
import homePage from 'services/HomePage'
import { Time } from 'constants/time'
import regex from 'utils/regex'
import { Status } from 'constants/enums/Common'
const ForgetPassword = () => {
	const router = useRouter()
	const defaultValues: {
		email: string
	} = {
		email: '',
	}
	const yupSchemaForgetPassword = yup.object().shape({
		email: yup.string().required('Bạn chưa nhập email').matches(regex.email, 'Email không hợp lệ'),
	})
	const methods = useForm<{ email: string }>({
		mode: 'onTouched',
		criteriaMode: 'firstError',
		reValidateMode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(yupSchemaForgetPassword),
	})
	const handleSendOTP = async (email: string) => {
		try {
			const { status }: { status: number } = await homePage.getResendOTP(
				email,
				router?.locale || ''
			)
			if (status === Status.SUCCESS) {
				router.push({
					pathname: WebsiteRoutesRedirect.confirm,
					query: { email: email, type: 'new' },
				})
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
		}
	}
	const onSubmit: SubmitHandler<{ email: string }> = (data: { email: string }) => {
		handleSendOTP(data?.email || '')
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
							<h3>Lấy lại mật khẩu</h3>
							<p>Xin vui lòng nhập email khi đăng ký tài khoản tại SolidBytes</p>
							<InputComponent
								className={styles.forgetPassword__child__center__input}
								type="text"
								name="email"
								placeholder="Nhập Email"
							/>
							<button type="submit">GỬI THÔNG TIN</button>
						</div>
					</div>
				</form>
			</FormProvider>
		</section>
	)
}
export default ForgetPassword
