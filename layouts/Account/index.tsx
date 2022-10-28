import { PaginationComponentItem } from 'layouts/Job'
import {
	faUser,
	faFloppyDisk,
	faCircleCheck,
	faFilePen,
	faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import InputComponent from 'components/Input'
import DatePickerComponent from 'components/DatePicker/index'
import RadioComponent from 'components/Radio/index'
import { AdminProps, CvProps, SubmitUpdateUserProps } from 'models/Admin/Account/index'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from './Account.module.scss'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import userForm from 'public/assets/img/Account/userForm.png'
import message from 'public/assets/img/Account/message.png'
import fb from 'public/assets/img/Account/fb.png'
import phone from 'public/assets/img/Account/phone.png'
import { CameraOutlined } from '@ant-design/icons'
import regex from 'utils/regex'
import { DateFormat, Time } from 'constants/time'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from 'redux/reducers/hooks'
import {
	removeAccessToken,
	setMenuClicked,
	setUserInformation,
	userInformationReducer,
} from 'redux/reducers/common'
import { useRouter } from 'next/router'
import { WebsiteRoutesRedirect } from 'constants/routes'
import ItemJobComponent from 'layouts/Job/Item'
import { UserGender } from 'constants/enums/Admin/Account'
import adminAccountManager from 'services/Admin/Account'
import { API, Pagination, Status } from 'constants/enums/Common'
import { notify } from 'utils/notification'
import { formatDate, formatDateISO } from 'utils/format'
import common from 'services/Common'
import homePage from 'services/HomePage'
import { LanguageEnum } from 'constants/language'
import CvDetail from './CvDetail'
export const menuType = {
	saved: 'saved',
	applied: 'applied',
}
const CvComponent = ({ cvDetail }: { cvDetail: CvProps<string> }) => {
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [])
	return <CvDetail objectDetail={cvDetail} />
}
const SavedMenu = ({ type, listSaved }: { type: string; listSaved: any }) => {
	const [dataCommon, setDataCommon] = useState({
		jobList: listSaved?.data || [],
		pagination: listSaved?.meta,
	})
	const handleChangeStatusHeart = async (jobUuid: string) => {
		const listTemp = dataCommon?.jobList?.length > 0 ? [...dataCommon.jobList] : []
		const index = listTemp.findIndex((values) => values?.job?.uuid === jobUuid)
		try {
			const { status, data }: { status: number; data: any } =
				type === menuType.saved || listTemp[index].job.isSaved
					? await homePage.deleteUserSaveJob(jobUuid, LanguageEnum.VIETNAMESE_LOCALE)
					: await homePage.postUserSaveJob(
							{
								jobUuid,
							},
							LanguageEnum.VIETNAMESE_LOCALE
					  )
			if (status === Status.SUCCESS) {
				if (index > -1) {
					if (type === menuType.saved) {
						onChangePagination(Pagination.PAGE)
					} else {
						listTemp[index].job.isSaved = !listTemp[index].job.isSaved
						setDataCommon({ ...dataCommon, jobList: [...listTemp] })
					}
				}
				notify('success', data?.message || '', Time.NOTIFY)
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
		}
	}
	const onChangePagination = async (pageNumber: number) => {
		try {
			const { status, data }: { status: number; data: any } =
				type === menuType.saved
					? await adminAccountManager.getAllUserSaveJob(LanguageEnum.VIETNAMESE_LOCALE, pageNumber)
					: await adminAccountManager.getAllUserSubmittedJob(
							LanguageEnum.VIETNAMESE_LOCALE,
							pageNumber
					  )
			if (status === Status.SUCCESS) {
				setDataCommon({
					...dataCommon,
					jobList: data?.data?.data?.length > 0 ? data.data.data : [],
					pagination: data?.data?.meta,
				})
				// notify('success', data?.message || '', Time.NOTIFY)
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
		}
	}
	useEffect(() => {
		setDataCommon({ ...dataCommon, jobList: listSaved?.data || [], pagination: listSaved?.meta })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listSaved])
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [dataCommon?.pagination])
	return (
		<div className={styles.job__content__child__right__content__saved}>
			{dataCommon.jobList?.length > 0 ? (
				dataCommon.jobList.map((values: any) => {
					return (
						<ItemJobComponent
							type={type}
							status={values?.status}
							key={values?.uuid}
							handleChangeStatusHeart={handleChangeStatusHeart}
							values={values.job}
						/>
					)
				})
			) : (
				<h1>Không có dữ liệu</h1>
			)}
			{dataCommon?.jobList?.length > 0 && (
				<PaginationComponentItem
					onChangePagination={onChangePagination}
					pagination={dataCommon.pagination}
				/>
			)}
		</div>
	)
}
const AccountMenu = () => {
	const refUploadImage: any = useRef(null)
	const dispatch = useAppDispatch()
	const userInformationReducerData: any = useAppSelector(userInformationReducer)
	const router = useRouter()
	const listStatus = [
		{ key: 'Nam', value: UserGender.MALE },
		{ key: 'Nữ', value: UserGender.FEMALE },
		{ key: 'Không xác định', value: UserGender.OTHER },
	]
	const defaultValues: SubmitUpdateUserProps<string> = {
		firstName: userInformationReducerData?.first_name || '',
		lastName: userInformationReducerData?.last_name || '',
		gender: userInformationReducerData?.gender || '',
		phone: userInformationReducerData?.phone || '',
		facebook: userInformationReducerData?.facebook_link || '',
		email: userInformationReducerData?.email || '',
		birthday: userInformationReducerData?.birthday
			? moment(
					formatDate(formatDateISO(userInformationReducerData?.birthday), DateFormat.VI),
					DateFormat.VI_MOMENT
			  )
			: '',
	}
	const yupSchemaRegister = yup.object().shape({
		email: yup.string().required('Bạn chưa nhập email').matches(regex.email, 'Email không hợp lệ'),
		firstName: yup
			.string()
			.required('Bạn chưa nhập họ')
			.min(2, 'Họ phải lớn hơn hoặc bằng 2')
			.max(50, 'Họ phải nhỏ hơn hoặc bằng 50'),
		lastName: yup
			.string()
			.required('Bạn chưa nhập tên')
			.min(2, 'Tên phải lớn hơn hoặc bằng 2')
			.max(50, 'Tên phải nhỏ hơn hoặc bằng 50'),
		phone: yup.string().required('Bạn chưa nhập số điện thoại').matches(regex.phone, {
			message: 'Số điện thoại không hợp lệ',
			excludeEmptyString: true,
		}),
		birthday: yup.string().required('Bạn chưa chọn ngày').nullable(),
		// gender: yup
		// 	.string()
		// 	.required('Bạn chưa nhập facebook')
		// 	.min(5, 'Facebook phải lớn hơn hoặc bằng 5')
		// 	.max(50, 'Facebook phải nhỏ hơn hoặc bằng 50'),
	})
	const methods = useForm<any>({
		mode: 'onTouched',
		criteriaMode: 'firstError',
		reValidateMode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(yupSchemaRegister),
	})
	const handleUploadImage = async (e: any) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('file', file)
		try {
			const { status, data } = await common.postUploadAvatar(formData, router?.locale || '')
			if (status === Status.SUCCESS) {
				dispatch(
					setUserInformation({
						...userInformationReducerData,
						avatar: data?.data?.avatar || '',
					})
				)
				notify('success', data?.message || '', Time.NOTIFY)
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
		}
	}
	const viID = 243
	const onSubmit: SubmitHandler<SubmitUpdateUserProps<string>> = async (
		object: SubmitUpdateUserProps<string>
	) => {
		try {
			const { data, status }: { data: any; status: number } =
				await adminAccountManager.putUserUpdate(
					{
						first_name: object?.firstName || '',
						last_name: object?.lastName || '',
						birthday: object?.birthday || '',
						phone: object?.phone,
						gender: object?.gender,
						facebook_link: object?.facebook || '',
						email: object?.email || '',
						countryId: viID,
					},
					router?.locale || ''
				)
			if (status === Status.SUCCESS || status === Status.SUCCESS_POST) {
				dispatch(
					setUserInformation({
						...userInformationReducerData,
						phone: object?.phone || '',
						first_name: object?.firstName || '',
						last_name: object?.lastName || '',
						facebook_link: object?.facebook || '',
						email: object?.email || '',
						gender: object?.gender,
						birthday: object?.birthday || '',
					})
				)
				notify('success', data?.message || '', Time.NOTIFY)
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
		}
	}
	return (
		<div className={styles.job__content__child__right__content__upload}>
			<div
				onClick={() => {
					refUploadImage.current.click()
				}}
				className={styles.job__content__child__right__content__upload__icon}
			>
				<div>
					<Image
						src={`${API.IMAGE}${userInformationReducerData?.avatar || ''}`}
						alt="SolidBytesUser"
						objectFit="contain"
						width={80}
						height={80}
					/>
				</div>
				<CameraOutlined
					className={styles.job__content__child__right__content__upload__icon__camera}
				/>
			</div>
			<input
				className={styles.job__content__child__right__content__upload__input}
				ref={refUploadImage}
				accept=".png, .jpg, .jpeg"
				onChange={handleUploadImage}
				type="file"
			/>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<div className={styles.form}>
						<div className={styles.job__content__child__right__content__upload__information}>
							<div
								className={styles.job__content__child__right__content__upload__information__left}
							>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Họ</h1>
									<InputComponent
										// disable={!statusUpdate}
										type="text"
										iconPosition="first"
										className={
											styles.job__content__child__right__content__upload__information__left__item__input
										}
										icon={
											<Image
												src={userForm}
												alt="SolidBytesUser"
												objectFit="contain"
												width={28}
												height={28}
											/>
										}
										name="firstName"
										placeholder="Nhập họ"
										// maxLength={Temp.max}
										// minLength={Temp.min}
									/>
								</div>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Tên</h1>
									<InputComponent
										// disable={!statusUpdate}
										type="text"
										iconPosition="first"
										className={
											styles.job__content__child__right__content__upload__information__left__item__input
										}
										icon={
											<Image
												src={userForm}
												alt="SolidBytesUser"
												objectFit="contain"
												width={28}
												height={28}
											/>
										}
										name="lastName"
										placeholder="Nhập tên"
										// maxLength={Temp.max}
										// minLength={Temp.min}
									/>
								</div>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Sinh nhật</h1>
									<DatePickerComponent
										className={
											styles.job__content__child__right__content__upload__information__left__item__birthday
										}
										name="birthday"
										placeholder="Chọn ngày sinh nhật"
									/>
								</div>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Giới tính</h1>
									<RadioComponent data={listStatus} name="gender" />
								</div>
							</div>
							<div
								className={`${styles.job__content__child__right__content__upload__information__left} ${styles.job__content__child__right__content__upload__information__leftItem}`}
							>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Số điện thoại</h1>
									<InputComponent
										// disable={!statusUpdate}
										type="text"
										iconPosition="first"
										className={
											styles.job__content__child__right__content__upload__information__left__input
										}
										icon={
											<Image
												src={phone}
												alt="SolidBytesUser"
												objectFit="contain"
												width={28}
												height={28}
											/>
										}
										name="phone"
										placeholder="Nhập số điện thoại"
										// maxLength={Temp.max}
										// minLength={Temp.min}
									/>
								</div>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Facebook</h1>
									<InputComponent
										// disable={!statusUpdate}
										type="text"
										iconPosition="first"
										className={
											styles.job__content__child__right__content__upload__information__left__input
										}
										icon={
											<Image
												src={fb}
												alt="SolidBytesUser"
												objectFit="contain"
												width={28}
												height={28}
											/>
										}
										name="facebook"
										placeholder="Nhập facebook"
										// maxLength={Temp.max}
										// minLength={Temp.min}
									/>
								</div>
								<div
									className={
										styles.job__content__child__right__content__upload__information__left__item
									}
								>
									<h1>Email</h1>
									<InputComponent
										// disable={!statusUpdate}
										disable={true}
										type="text"
										iconPosition="first"
										className={
											styles.job__content__child__right__content__upload__information__left__input
										}
										icon={
											<Image
												src={message}
												alt="SolidBytesUser"
												objectFit="contain"
												width={28}
												height={28}
											/>
										}
										name="email"
										placeholder="Nhập email"
										// maxLength={Temp.max}
										// minLength={Temp.min}
									/>
								</div>
								<div
									className={`${styles.job__content__child__right__content__upload__information__left__item} ${styles.job__content__child__right__content__upload__information__left__itemTemp}`}
								>
									<h1>Email</h1>
									<InputComponent
										// disable={!statusUpdate}
										disable={true}
										type="text"
										iconPosition="first"
										className={
											styles.job__content__child__right__content__upload__information__left__input
										}
										icon={
											<Image
												src={message}
												alt="SolidBytesUser"
												objectFit="contain"
												width={28}
												height={28}
											/>
										}
										name="test"
										placeholder="Nhập email"
										// maxLength={Temp.max}
										// minLength={Temp.min}
									/>
								</div>
							</div>
						</div>
						<div className={styles.form__button}>
							<button
								type="button"
								onClick={() => methods.reset(defaultValues)}
								className={styles.form__button__cancel}
							>
								Huỷ
							</button>
							<button className={styles.form__button__save} type="submit">
								Lưu
							</button>
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}
const AccountMenuHOC = memo(AccountMenu)
const AccountComponent = ({ object }: { object: AdminProps }) => {
	const menu = {
		account: '1',
		saved: '2',
		applied: '3',
		servicePackage: '4',
		logout: '5',
	}
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [menuClickedData, setMenuClickedData] = useState<string>(menu.account)
	const menuList = [
		{
			id: '1',
			title: 'Thông tin tài khoản',
			icon: faUser,
		},
		{
			id: '2',
			title: 'Việc làm đã lưu',
			icon: faFloppyDisk,
		},
		{
			id: '3',
			title: 'Việc làm đã ứng tuyển',
			icon: faCircleCheck,
		},
		{
			id: '4',
			title: 'Thông tin CV',
			icon: faFilePen,
		},
		// {
		// 	id: '4',
		// 	title: 'Gói dịch vụ tuyển dụng',
		// 	icon: faGift,
		// },
		{
			id: '5',
			title: 'Đăng xuất',
			icon: faRightFromBracket,
		},
	]
	const handleLogout = () => {
		dispatch(removeAccessToken(''))
		dispatch(setMenuClicked(0))
		router.push(WebsiteRoutesRedirect.homePage)
	}
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [])
	return (
		<section className={styles.job}>
			{/* <SearchComponent handleOnchangeSearch={handleOnchangeSearch} /> */}
			<div className={styles.job__content}>
				<div className={styles.job__content__child}>
					<aside className={styles.job__content__child__left}>
						<div className={styles.job__content__child__left__title}>
							<span>Trang chủ</span>
							<span>/</span>
							<span className={styles.job__content__child__left__title__account}>
								{menuList[parseInt(menuClickedData) - 1].title}
							</span>
						</div>
						<ul className={styles.job__content__child__left__content}>
							{menuList?.length > 0 &&
								menuList.map((values) => {
									return (
										<li
											key={values.id}
											onClick={() => {
												values?.id === menu.logout
													? handleLogout()
													: setMenuClickedData(values?.id || '-1')
											}}
											className={`${styles.job__content__child__left__content__item} ${
												menuClickedData === values.id
													? styles.job__content__child__left__content__itemClicked
													: ''
											}`}
										>
											<FontAwesomeIcon
												className={`${styles.job__content__child__left__content__item__icon} ${
													menuClickedData === values.id
														? styles.job__content__child__left__content__item__iconClicked
														: ''
												}`}
												icon={values.icon}
											/>
											<p>{values?.title || ''}</p>
										</li>
									)
								})}
						</ul>
					</aside>
					<div className={styles.job__content__child__right}>
						{/* <div className={styles.job__content__child__right__title}>
							<span>TÀI KHOẢN CÒN LẠI: 17.000.000 VNĐ</span>
							<span className={styles.job__content__child__right__title__line}>|</span>
							<span>SILVER: 12 ĐIỂM</span>
							<span className={styles.job__content__child__right__title__line}>|</span>
							<div className={styles.button}>
								<span className={styles.job__content__child__right__title__button}>Nạp tiền</span>
							</div>
						</div> */}
						<div className={styles.job__content__child__right__content}>
							<h1 className={styles.job__content__child__right__content__title}>
								{(() => {
									switch (menuClickedData) {
										case menu.account:
											return 'Thông tin tài khoản'
										case menu.saved:
											return 'Việc làm đã lưu'
										case menu.applied:
											return 'Việc làm đã ứng tuyển'
										case menu.servicePackage:
											return 'Thông tin CV'
										default:
											return 'Đăng xuất'
									}
								})()}
							</h1>
							{(() => {
								switch (menuClickedData) {
									case menu.account:
										return <AccountMenuHOC />
									case menu.saved:
										return <SavedMenu listSaved={object.listSaved} type={menuType.saved} />
									case menu.applied:
										return <SavedMenu listSaved={object.listSubmitted} type={menuType.applied} />
									case menu.servicePackage:
										return <CvComponent cvDetail={object.cvDetail} />
									default:
										return ''
								}
							})()}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
export default AccountComponent
