import styles from './Footer.module.scss'
import logo from 'public/assets/img/Header/logo.png'
import fb from 'public/assets/img/Footer/fb.png'
import google from 'public/assets/img/Footer/google.png'
import pinerest from 'public/assets/img/Footer/pinerest.png'
import twitter from 'public/assets/img/Footer/twitter.png'
import arrow from 'public/assets/img/Footer/arrow.png'
import Image from 'next/image'
import { Button } from 'antd'
import Link from 'next/link'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { setMenuClicked } from 'redux/reducers/common'
import { useAppDispatch } from 'redux/reducers/hooks'
import { Menu } from 'constants/enums/Common'
const FooterComponent = () => {
	const dispatch = useAppDispatch()
	const tagList = [
		{
			id: '1',
			title: 'Về chúng tôi',
			tag: [
				{
					id: '1',
					title: 'Giới thiệu',
				},
				{
					id: '2',
					title: 'Góc báo chí',
				},
				{
					id: '3',
					title: 'Tuyển dụng',
				},
				{
					id: '4',
					title: 'Liên hệ',
				},
				{
					id: '5',
					title: 'Chính sách bảo mật',
				},
			],
		},
		{
			id: '2',
			title: 'Khám phá',
			tag: [
				{
					id: '1',
					title: 'Tính lãi suất kép',
				},
				{
					id: '2',
					title: 'Lập kế hoạch tiết kiệm',
				},
				{
					id: '3',
					title: 'Tính bảo hiểm thất nghiệp',
				},
				{
					id: '4',
					title: 'Tính bảo hiểm xã hội một lần',
				},
				{
					id: '5',
					title: 'Hỏi đáp',
				},
			],
		},
		{
			id: '3',
			title: 'Hồ sơ và CV',
			tag: [
				{
					id: '1',
					title: 'Quản lý CV của bạn',
				},
				{
					id: '2',
					title: 'TopCV Profile',
				},
				{
					id: '3',
					title: 'Hướng dẫn viết CV',
				},
				{
					id: '4',
					title: 'Review CV',
				},
				{
					id: '5',
					title: 'Lập kế hoạch',
				},
			],
		},
		{
			id: '4',
			title: 'Xây dựng sự nghiệp',
			tag: [
				{
					id: '1',
					title: 'Việc làm tốt nhất',
				},
				{
					id: '2',
					title: 'Việc làm lương cao',
				},
				{
					id: '3',
					title: 'Việc làm quản lý',
				},
				{
					id: '4',
					title: 'Việc làm từ xa (remote)',
				},
				{
					id: '5',
					title: 'Việc làm bán thời gian',
				},
			],
		},
	]
	return (
		<footer className={styles.footer}>
			<div className={styles.footer__child}>
				<div className={styles.footer__parent}>
					<div className={styles.footer__child__img}>
						<Link href={WebsiteRoutesRedirect.homePage} passHref>
							<a target='_parent' onClick={() => dispatch(setMenuClicked(Menu.HomePage))}>
								<Image
									src={logo}
									alt="SolidBytesLogo"
									objectFit="contain"
									width={175}
									height={33}
								/>
							</a>
						</Link>
					</div>
					<div className={styles.footer__child__information}>
						<input
							className={styles.footer__child__information__input}
							placeholder="Nhập địa chỉ e-mail"
						/>
						<Button className={styles.footer__child__information__button} type="primary">
							Gửi thông tin
						</Button>
					</div>
					<div className={styles.footer__child__social}>
						<div className={styles.footer__child__social__icon}>
							<Image width={30} height={30} src={fb} alt="SolidBytesSocial" objectFit="contain" />
						</div>
						<div className={styles.footer__child__social__icon}>
							<Image
								width={30}
								height={30}
								src={google}
								alt="SolidBytesSocial"
								objectFit="contain"
							/>
						</div>
						<div className={styles.footer__child__social__icon}>
							<Image
								width={30}
								height={30}
								src={twitter}
								alt="SolidBytesSocial"
								objectFit="contain"
							/>
						</div>
						<div className={styles.footer__child__social__icon}>
							<Image
								width={30}
								height={30}
								src={pinerest}
								alt="SolidBytesSocial"
								objectFit="contain"
							/>
						</div>
					</div>
				</div>
				<div className={styles.footer__child__content}>
					{tagList?.length > 0 &&
						tagList.map((values) => {
							return (
								<div key={values.id} className={styles.footer__child__content__item}>
									<h1>{values.title}</h1>
									{values?.tag?.length > 0 &&
										values.tag.map((valuesTag) => {
											return (
												<div
													key={valuesTag.id}
													className={styles.footer__child__content__item__title}
												>
													<Image
														src={arrow}
														alt="SolidBytesFooter"
														objectFit="contain"
														width={24}
														height={24}
													/>
													<p>{valuesTag?.title || ''}</p>
												</div>
											)
										})}
								</div>
							)
						})}
				</div>
				<div className={styles.footer__child__copyright}>
					<h1>Copyright © 2022 Công ty cổ phần Việt Nam </h1>
					<div className={styles.footer__child__copyright__right}>
						<p>Giới thiệu</p>
						<p>Liên hệ</p>
						<p>Chính sách bảo mật</p>
						<p>Điều khoản dịch vụ</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
export default FooterComponent
