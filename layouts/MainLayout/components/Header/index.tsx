import styles from './Header.module.scss'
import logo from 'public/assets/img/Header/logo.png'
import logoTablet from 'public/assets/img/Header/logoTablet.png'
import google from 'public/assets/img/Header/google.png'
import { LanguageEnum } from 'constants/language'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputComponent from 'components/InputLogin'
import facebook from 'public/assets/img/Header/facebook.png'
import Image from 'next/image'
import { Button, Drawer, Modal, Popover } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RegisterType, ScrollY } from 'constants/enums/Header'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import Link from 'next/link'
import useMedia from 'use-media'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { API, Breakpoint, Color, Error, Menu, Status } from 'constants/enums/Common'
import {
	ArrowRightOutlined,
	CloseOutlined,
	DownOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	MailOutlined,
	MenuOutlined,
	UpOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'redux/reducers/hooks'
import {
	menuClickedReducer,
	removeAccessToken,
	setKeyCommon,
	setLoading,
	setMenuClicked,
	setUserInformation,
	userInformationReducer,
} from 'redux/reducers/common'
import { notify } from 'utils/notification'
import { Time } from 'constants/time'
import homePage from 'services/HomePage'
import regex from 'utils/regex'
import { LoginProps, RegisterFormProps, RegisterProps } from 'models/Header'

const ModalSignin = ({
	openSignin,
	handleOpenSignin,
}: {
	openSignin: boolean
	handleOpenSignin: (status: boolean, type?: string) => void
}) => {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [typePassword, setTypePassword] = useState<string>('password')
	const defaultValues: LoginProps = {
		email: '',
		password: '',
	}
	const yupSchemaLogin = yup.object().shape({
		email: yup.string().required('B???n ch??a nh???p email').matches(regex.email, 'Email kh??ng h???p l???'),
		password: yup
			.string()
			.required('B???n ch??a nh???p m???t kh???u')
			.min(6, 'M???t kh???u ph???i ??t nh???t 6 k?? t???')
			.max(100, 'M???t kh???u kh??ng ???????c l???n h??n 100 k?? t???'),
	})
	const methods = useForm<LoginProps>({
		mode: 'onTouched',
		criteriaMode: 'firstError',
		reValidateMode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(yupSchemaLogin),
	})
	const handleSubmitLogin = async (object: { email: string; password: string }) => {
		try {
			dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = await homePage.postAuthLogin(
				object,
				LanguageEnum.VIETNAMESE_LOCALE
			)
			if (status === Status.SUCCESS) {
				dispatch(
					setKeyCommon({
						keySearch: '',
						keyCity: '',
						keyWorkForm: '',
						keyExperience: '',
						keyLevel: '',
						keySalary: '',
					})
				)
				dispatch(setMenuClicked(0))
				dispatch(setUserInformation(data?.data))
				handleOpenSignin(false)
				router.push(WebsiteRoutesRedirect.homePage)
				notify('success', data?.message || '', Time.NOTIFY)
			}
			dispatch(setLoading(false))
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
			dispatch(setLoading(false))
		}
	}
	const onSubmit: SubmitHandler<LoginProps> = (data: LoginProps) => {
		handleSubmitLogin(data)
	}
	return (
		<Modal
			width={396}
			bodyStyle={{
				backgroundColor: Color.FFFFFF,
				borderRadius: '8px',
				boxShadow: '1px 4px 8px rgba(0, 0, 0, 0.15)',
			}}
			onCancel={() => handleOpenSignin(false)}
			closable={false}
			title=""
			centered
			footer=""
			visible={openSignin}
		>
			<div className={styles.login}>
				<div className={styles.login__icon}>
					<CloseOutlined
						onClick={() => handleOpenSignin(false)}
						className={styles.login__icon__item}
					/>
				</div>
				<h1 className={styles.login__title}>????ng nh???p</h1>
				<div className={styles.login__form}>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							<InputComponent
								type="text"
								className={styles.login__form__email}
								icon={<MailOutlined />}
								name="email"
								placeholder="Nh???p Email"
							/>
							<InputComponent
								className={styles.login__form__password}
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
								name="password"
								type={typePassword}
								placeholder="Nh???p m???t kh???u"
							/>
							<Link href={WebsiteRoutesRedirect.forget_password}>
								<h1 className={styles.login__form__forgetPassword}>L???y l???i m???t kh???u</h1>
							</Link>
							<div className={styles.login__form__button}>
								<button type="submit" className={styles.login__form__button__item}>
									G???i th??ng tin
								</button>
							</div>
						</form>
					</FormProvider>
				</div>
				<div className={`${styles.login__google} ${styles.login__googleFirst}`}>
					<Image src={google} alt="SolidBytesGoogle" objectFit="contain" width={23} height={23} />
					<p>????ng nh???p v???i Google</p>
				</div>
				<div className={styles.login__google}>
					<Image
						src={facebook}
						alt="SolidBytesFacebook"
						objectFit="contain"
						width={23}
						height={23}
					/>
					<p>????ng nh???p v???i Facebook</p>
				</div>
				<h1
					onClick={() => handleOpenSignin(false, 'new-account')}
					className={styles.login__newAccount}
				>
					T???o t??i kho???n m???i
				</h1>
			</div>
		</Modal>
	)
}
const ModalRegister = ({
	openRegister,
	handleOpenRegister,
}: {
	openRegister: boolean
	handleOpenRegister: (status: boolean, type?: string) => void
}) => {
	const router = useRouter()
	const dispatch = useAppDispatch()
	const [typePassword, setTypePassword] = useState<string>('password')
	const defaultValues: RegisterProps = {
		email: '',
		password: '',
		phone: '',
		firstName: '',
		lastName: '',
	}
	const yupSchemaRegister = yup.object().shape({
		email: yup.string().required('B???n ch??a nh???p email').matches(regex.email, 'Email kh??ng h???p l???'),
		password: yup
			.string()
			.required('B???n ch??a nh???p m???t kh???u')
			.min(6, 'M???t kh???u ph???i ??t nh???t 6 k?? t???')
			.max(100, 'M???t kh???u kh??ng ???????c l???n h??n 100 k?? t???'),
		firstName: yup
			.string()
			.required('B???n ch??a nh???p h???')
			.min(2, 'H??? ph???i l???n h??n ho???c b???ng 2')
			.max(50, 'H??? ph???i nh??? h??n ho???c b???ng 50'),
		lastName: yup
			.string()
			.required('B???n ch??a nh???p t??n')
			.min(2, 'T??n ph???i l???n h??n ho???c b???ng 2')
			.max(50, 'T??n ph???i nh??? h??n ho???c b???ng 50'),
		phone: yup.string().required('B???n ch??a nh???p s??? ??i???n tho???i').matches(regex.phone, {
			message: 'S??? ??i???n tho???i kh??ng h???p l???',
			excludeEmptyString: true,
		}),
	})
	const methods = useForm<LoginProps>({
		mode: 'onTouched',
		criteriaMode: 'firstError',
		reValidateMode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(yupSchemaRegister),
	})
	const countryId = 243
	const handleSubmitRegister = async (objectSubmit: any) => {
		try {
			dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = await homePage.postRegister(
				objectSubmit,
				router?.locale || ''
			)
			if (status === Status.SUCCESS) {
				router.push({
					pathname: WebsiteRoutesRedirect.confirm,
					query: { email: data?.data?.email || '' },
				})
			}
			dispatch(setLoading(false))
		} catch (error: any) {
			// case of re-registering but not authenticated otp
			if (error?.response?.data?.status === Error.Error_422) {
				try {
					const { status }: { status: number } = await homePage.getResendOTP(
						objectSubmit?.email || '',
						router?.locale || ''
					)
					if (status === Status.SUCCESS) {
						router.push({
							pathname: WebsiteRoutesRedirect.confirm,
							query: { email: objectSubmit?.email || '' },
						})
					}
				} catch (error: any) {
					notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
				}
			} else {
				notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
			}
			dispatch(setLoading(false))
		}
	}
	const onSubmit: any = (data: RegisterProps) => {
		const objectSubmit: RegisterFormProps<string> = {
			password: data?.password || '',
			email: data?.email || '',
			first_name: data?.firstName || '',
			last_name: data?.lastName || '',
			full_name: data?.firstName && data?.lastName ? `${data?.firstName} ${data?.lastName}` : '',
			phone: data?.phone || '',
			countryId: countryId,
			type_register: RegisterType.JOBSEEKER,
		}
		handleSubmitRegister(objectSubmit)
	}
	return (
		<Modal
			width={396}
			bodyStyle={{
				backgroundColor: Color.FFFFFF,
				borderRadius: '8px',
				boxShadow: '1px 4px 8px rgba(0, 0, 0, 0.15)',
			}}
			onCancel={() => handleOpenRegister(false)}
			closable={false}
			title=""
			centered
			footer=""
			visible={openRegister}
		>
			<div className={styles.login}>
				<div className={styles.login__icon}>
					<CloseOutlined
						onClick={() => handleOpenRegister(false)}
						className={styles.login__icon__item}
					/>
				</div>
				<h1 className={styles.login__title}>T???o t??i kho???n</h1>
				<div className={styles.login__form}>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							<InputComponent
								type="text"
								className={styles.login__form__email}
								// icon={<MailOutlined />}
								name="firstName"
								placeholder="Nh???p h???"
							/>
							<InputComponent
								type="text"
								className={styles.login__form__email}
								// icon={<MailOutlined />}
								name="lastName"
								placeholder="Nh???p t??n"
							/>
							<InputComponent
								type="text"
								className={styles.login__form__email}
								// icon={<MailOutlined />}
								name="phone"
								placeholder="Nh???p s??? ??i???n tho???i"
							/>
							<InputComponent
								type="text"
								className={styles.login__form__email}
								icon={<MailOutlined />}
								name="email"
								placeholder="Nh???p Email"
							/>
							<InputComponent
								className={styles.login__form__email}
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
								name="password"
								type={typePassword}
								placeholder="Nh???p m???t kh???u"
							/>
							<div className={styles.login__form__button}>
								<button type="submit" className={styles.login__form__button__item}>
									G???i th??ng tin
								</button>
							</div>
						</form>
					</FormProvider>
				</div>
				<p className={styles.login__accept}>B???ng vi???c ti???p t???c, qu?? kh??ch ???? ch???p nh???n </p>
				<h1 className={styles.login__rules}>??i???u kho???n s??? d???ng</h1>
				<h1
					onClick={() => handleOpenRegister(false, 'signin')}
					className={styles.login__newAccount}
				>
					????ng nh???p
				</h1>
			</div>
		</Modal>
	)
}
const ContentItemComponent = ({
	values,
}: {
	values: {
		id: string
		route?: string
		title: string
	}
}) => {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const logoutID = '4'
	const handleClickMenu = () => {
		if (values?.id === logoutID) {
			dispatch(removeAccessToken(''))
			dispatch(
				setKeyCommon({
					keySearch: '',
					keyCity: '',
					keyWorkForm: '',
					keyExperience: '',
					keyLevel: '',
					keySalary: '',
				})
			)
			dispatch(setMenuClicked(0))
			router.push(WebsiteRoutesRedirect.homePage)
		} else {
			dispatch(setMenuClicked(-1))
		}
	}
	return (
		<div onClick={handleClickMenu} className={styles.menuContent__item}>
			<ArrowRightOutlined className={styles.icon} />
			<p>{values?.title || ''}</p>
		</div>
	)
}
const MenuItem = ({ type }: { type: string }) => {
	const isDesktop = useMedia({ maxWidth: Breakpoint.SmDesktop })
	const router = useRouter()
	const dispatch = useAppDispatch()
	const [openSignin, setOpenSignin] = useState<boolean>(false)
	const [openRegister, setOpenRegister] = useState<boolean>(false)
	const [statusClicked, setStatusClicked] = useState<boolean>(false)
	const accessTokenReducerData: any = useAppSelector(userInformationReducer)
	const wrapperRef: any = useRef(null)
	const menuClickedReducerData = useAppSelector(menuClickedReducer)
	const menuJob = '2'
	const menuList = [
		{
			id: '1',
			title: 'Trang ch???',
			route: WebsiteRoutesRedirect.homePage,
		},
		{
			id: '2',
			title: 'Vi???c l??m',
			route: WebsiteRoutesRedirect.job,
		},
		{
			id: '3',
			title: 'Ph???ng v???n',
			route: WebsiteRoutesRedirect.interview,
		},
		{
			id: '4',
			title: 'M???c l????ng',
			route: WebsiteRoutesRedirect.salary,
		},
		{
			id: '5',
			title: 'C??ng ty',
			route: WebsiteRoutesRedirect.company,
		},
	]
	const menuCheck = ['3', '4', '5']
	const haNoiCity = 'Th??nh ph??? H?? N???i'
	const contentList = [
		{
			id: '1',
			title: 'T??i kho???n c???a t??i',
			route: WebsiteRoutesRedirect.account,
		},
		{
			id: '2',
			title: 'Vi???c l??m ???? l??u',
			route: WebsiteRoutesRedirect.jobSaved,
		},
		{
			id: '3',
			title: 'Vi???c l??m ???? ???ng tuy???n',
			route: WebsiteRoutesRedirect.jobApplied,
		},
		{
			id: '4',
			title: '????ng xu???t',
		},
	]
	const content = (
		<div ref={wrapperRef} className={styles.menuContent}>
			{contentList?.length > 0 &&
				contentList.map((values) => {
					return values.id === '4' ? (
						<a className={styles.accountMenu}>
							<ContentItemComponent key={values.id} values={values} />
						</a>
					) : (
						<Link key={values.id} href={values?.route || WebsiteRoutesRedirect.homePage} passHref>
							<a className={styles.accountMenu}>
								<ContentItemComponent values={values} />
							</a>
						</Link>
					)
				})}
		</div>
	)
	const handleOpenSignin = (status: boolean, type?: string) => {
		setOpenSignin(status)
		type === 'new-account' && setOpenRegister(true)
	}
	const handleOpenRegister = (status: boolean, type?: string) => {
		setOpenRegister(status)
		type === 'signin' && setOpenSignin(true)
	}
	const listPage: string[] = [
		WebsiteRoutesRedirect.jobDetailID,
		WebsiteRoutesRedirect.job,
		WebsiteRoutesRedirect.account,
		WebsiteRoutesRedirect.confirm,
		WebsiteRoutesRedirect.new_password,
		WebsiteRoutesRedirect.forget_password,
	]
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event: any) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setStatusClicked(false)
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wrapperRef])
	return (
		<header
			className={`${styles.header} ${scrollY && !isDesktop ? styles.headerScroll : ''} ${
				type === 'tablet' ? styles.headerTablet : ''
			} ${listPage.includes(router.pathname) && type === 'pc' ? styles.headerScroll : ''}`}
		>
			<div
				className={`${styles.header__child} ${type === 'tablet' ? styles.header__childTablet : ''}`}
			>
				<div
					className={`${styles.header__child__img} ${
						isDesktop ? styles.header__child__imgTablet : ''
					}`}
				>
					<Link href={WebsiteRoutesRedirect.homePage} passHref>
						<a target="_parent" onClick={() => dispatch(setMenuClicked(Menu.HomePage))}>
							<Image
								src={isDesktop ? logoTablet : logo}
								alt="SolidBytesLogo"
								objectFit="contain"
								width={175}
								height={33}
							/>
						</a>
					</Link>
				</div>
				<ul
					className={`${styles.header__child__menu} ${
						type === 'tablet' ? styles.header__child__menuTablet : ''
					}`}
				>
					{menuList?.length > 0 &&
						menuList.map((values, index) => {
							return (
								// values.id === '3' && Object.keys(accessTokenReducerData).length > 0 &&
								<Link
									key={index}
									href={
										values.id === menuJob
											? {
													pathname: values.route,
													query: {
														city: haNoiCity,
													},
											  }
											: values.route
									}
								>
									<a
										className={
											menuCheck.includes(values?.id) &&
											Object.keys(accessTokenReducerData).length === 0
												? styles.menuHidden
												: ''
										}
									>
										<li
											onClick={() => dispatch(setMenuClicked(index))}
											className={`${styles.header__child__menu__item} ${
												type === 'tablet' ? styles.header__child__menu__li : ''
											} ${
												menuClickedReducerData === index
													? styles.menuClicked
													: isDesktop
													? styles.menuClickedDesktop
													: ''
											}`}
										>
											{values.title}
										</li>
									</a>
								</Link>
							)
						})}
				</ul>
				{accessTokenReducerData ? (
					<Popover
						overlayClassName={styles.popover}
						trigger="click"
						placement="bottomLeft"
						content={content}
					>
						<div
							onClick={() => setStatusClicked(!statusClicked)}
							className={styles.header__child__account}
						>
							<div className={styles.header__child__account__avatar}>
								<Image
									src={`${API.IMAGE}${accessTokenReducerData?.avatar || ''}`}
									alt="SolidBytesAvatar"
									objectFit="contain"
									width={44}
									height={44}
								/>
							</div>
							<div className={styles.header__child__account__user}>
								<h1>{`${accessTokenReducerData?.first_name || ''} ${accessTokenReducerData?.last_name || ''}`}</h1>
								{/* <UpOutlined /> */}
								{statusClicked ? (
									<UpOutlined className={styles.header__child__account__user__icon} />
								) : (
									<DownOutlined className={styles.header__child__account__user__icon} />
								)}
							</div>
						</div>
					</Popover>
				) : (
					<div
						className={`${styles.header__child__button} ${
							type === 'tablet' ? styles.header__child__buttonTablet : ''
						}`}
					>
						<Button
							onClick={() => setOpenSignin(!openSignin)}
							type="primary"
							className={`${styles.header__child__button__login} ${
								type === 'tablet' ? styles.header__child__button__loginTablet : ''
							}`}
						>
							????ng nh???p
						</Button>
						<Button type="primary" className={styles.header__child__button__post}>
							????ng tin
						</Button>
					</div>
				)}
			</div>
			{openSignin && <ModalSignin handleOpenSignin={handleOpenSignin} openSignin={openSignin} />}
			{openRegister && (
				<ModalRegister handleOpenRegister={handleOpenRegister} openRegister={openRegister} />
			)}
		</header>
	)
}
const MenuComponent = ({
	openMenu,
	handleOpenMenu,
}: {
	openMenu: boolean
	handleOpenMenu: (status: boolean) => void
}) => {
	return (
		<Drawer
			title="Ch???c n??ng"
			placement="right"
			onClose={() => handleOpenMenu(false)}
			visible={openMenu}
		>
			<MenuItem type="tablet" />
		</Drawer>
	)
}

const HeaderComponent = () => {
	const [openMenu, setOpenMenu] = useState<boolean>(false)
	const router = useRouter()
	const [scrollY, setScrollY] = useState<boolean>(false)
	const isDesktop = useMedia({ maxWidth: Breakpoint.SmDesktop })
	const listPage: string[] = [
		WebsiteRoutesRedirect.jobDetailID,
		WebsiteRoutesRedirect.job,
		WebsiteRoutesRedirect.account,
		WebsiteRoutesRedirect.confirm,
		WebsiteRoutesRedirect.new_password,
		WebsiteRoutesRedirect.forget_password,
	]
	const handleNavigation = useCallback(() => {
		if (window.scrollY > ScrollY.initial) {
			!scrollY && setScrollY(true)
		} else {
			window.scrollY === ScrollY.initial && scrollY && setScrollY(false)
		}
	}, [scrollY])
	const handleOpenMenu = (status: boolean) => {
		setOpenMenu(status)
	}
	useEffect(() => {
		window.addEventListener('scroll', handleNavigation)
		return () => {
			window.removeEventListener('scroll', handleNavigation)
		}
	}, [handleNavigation])
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<>
			{isDesktop ? (
				<div
					className={`${styles.menu} ${
						scrollY || listPage.includes(router.pathname) ? styles.menuTablet : ''
					}`}
				>
					<MenuOutlined onClick={() => setOpenMenu(!openMenu)} className={styles.menu__icon} />
				</div>
			) : (
				<MenuItem type="pc" />
			)}
			{openMenu && <MenuComponent handleOpenMenu={handleOpenMenu} openMenu={openMenu} />}
		</>
	)
}
export default HeaderComponent
