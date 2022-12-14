import Image from 'next/image'
import styles from './CvDetail.module.scss'
import React, { useRef, useState } from 'react'
import InputAreaComponent from 'components/InputArea'
import { yupResolver } from '@hookform/resolvers/yup'
import RadioComponent from 'components/Radio/index'
import DatePickerComponent from 'components/DatePicker/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dot from 'public/assets/img/Account/dot.webp'
import {
	faCalendarDays,
	faPhone,
	faEnvelopeSquare,
	faHouseChimney,
	faLink,
	faTrashCan,
	faCog,
	faCertificate,
	faUser,
	faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'
import InputComponent from 'components/Input'
import InputLogin from 'components/InputLogin'
import { Input } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import { ActivitiesProps, CvProps, WorkExperienceProps } from 'models/Admin/Account/index'
import add from 'public/assets/img/Account/add.png'
import * as yup from 'yup'
import { FormProvider, useForm } from 'react-hook-form'
import { formatDate, formatDateISO } from 'utils/format'
import { v4 as uuidv4 } from 'uuid'
import { DateFormat, Time } from 'constants/time'
import { API, ProfileGender, Status } from 'constants/enums/Common'
import common from 'services/Common'
import { useRouter } from 'next/router'
import { notify } from 'utils/notification'
import { useAppDispatch, useAppSelector } from 'redux/reducers/hooks'
import { setLoading, setUserInformation, userInformationReducer } from 'redux/reducers/common'
import moment from 'moment'
import { DatePicker } from 'antd'
import { useEffect } from 'react'
import regex from 'utils/regex'
import adminAccountManager from 'services/Admin/Account'
const { TextArea } = Input
interface FormProps<T> {
	cv_name: T
	full_name: T
	specialized: T
	gender: T
	address: T
	phone: T
	email: T
	website: T
	birth_day: any
	career_goals: T
}
const CvDetail = ({ objectDetail }: { objectDetail: CvProps<string> }) => {
	const refUploadImage: any = useRef(null)
	const dispatch = useAppDispatch()
	const userInformationReducerData: any = useAppSelector(userInformationReducer)
	const router = useRouter()
	const listStatus = [
		{ key: 'Nam', value: ProfileGender.MALE },
		{ key: 'N???', value: ProfileGender.FEMALE },
		{ key: 'Kh??ng x??c ?????nh', value: ProfileGender.OTHER },
	]
	const [objectDetailData, setObjectDetailData] = useState<CvProps<string>>(objectDetail)
	const defaultValues = {
		cv_name:
			objectDetail?.cv_name ||
			`CV_${
				userInformationReducerData?.email ? userInformationReducerData.email : 'abc@gmail.com'
			}`,
		full_name:
			objectDetail?.full_name?.toUpperCase() ||
			`${userInformationReducerData?.first_name || ''} ${
				userInformationReducerData?.last_name || ''
			}`.toUpperCase(),
		specialized: objectDetail?.specialized?.toUpperCase() || 'NH??N VI??N KINH DOANH',
		gender: objectDetail?.gender ? objectDetail.gender : ProfileGender.OTHER,
		address: objectDetail?.address
			? objectDetail.address
			: '27/27, Ng?? Y Linh, An L???c, B??nh T??n, TP.HCM',
		phone: userInformationReducerData?.phone ? userInformationReducerData.phone : '123456789',
		email: userInformationReducerData?.email ? userInformationReducerData.email : 'abc@gmail.com',
		website: objectDetail?.website ? objectDetail.website : 'https://solidbytes.com',
		birth_day: moment(
			formatDate(
				formatDateISO(
					userInformationReducerData?.birthday
						? userInformationReducerData.birthday
						: moment().format()
				),
				DateFormat.VI
			),
			DateFormat.VI_MOMENT
		),
		career_goals:
			objectDetail?.career_goals?.toLowerCase() ||
			'??p d???ng nh???ng kinh nghi???m v??? k??? n??ng b??n h??ng v?? s??? hi???u bi???t v??? th??? tr?????ng ????? tr??? th??nh m???t nh??n vi??n b??n h??ng chuy??n nghi???p, mang ?????n nhi???u gi?? tr??? cho kh??ch h??ng. T??? ???? gi??p C??ng ty t??ng s??? l?????ng kh??ch h??ng v?? m??? r???ng t???p kh??ch h??ng.',
	}
	const yupSchemaRegister = yup.object().shape({
		birth_day: yup.string().required('B???n ch??a ch???n ng??y sinh').nullable(),
		website: yup.string().url('B???n ch??a nh???p website').optional(),
		full_name: yup
			.string()
			.required('B???n ch??a nh???p h??? v?? t??n')
			.min(5, 'H??? v?? t??n ph???i l???n h??n ho???c b???ng 5')
			.max(50, 'H??? v?? t??n ph???i nh??? h??n ho???c b???ng 50'),
		address: yup
			.string()
			.required('B???n ch??a nh???p ?????a ch???')
			.min(10, '?????a ch??? ph???i l???n h??n ho???c b???ng 10')
			.max(200, '?????a ch??? ph???i nh??? h??n ho???c b???ng 200'),
		cv_name: yup
			.string()
			.required('B???n ch??a nh???p t??n cv')
			.min(2, 'T??n cv ph???i l???n h??n ho???c b???ng 2')
			.max(100, 'T??n cv ph???i nh??? h??n ho???c b???ng 100'),
		phone: yup.string().required('B???n ch??a nh???p s??? ??i???n tho???i').matches(regex.phone, {
			message: 'S??? ??i???n tho???i kh??ng h???p l???',
			excludeEmptyString: true,
		}),
		email: yup.string().required('B???n ch??a nh???p email').matches(regex.email, 'Email kh??ng h???p l???'),
		specialized: yup
			.string()
			.required('B???n ch??a nh???p v??? tr?? ???ng tuy???n')
			.min(5, 'V??? tr?? ???ng tuy???n ph???i l???n h??n ho???c b???ng 5')
			.max(50, 'V??? tr?? ???ng tuy???n ph???i nh??? h??n ho???c b???ng 50'),
		career_goals: yup
			.string()
			.required('B???n ch??a nh???p m???c ti??u ngh??? nghi???p')
			.min(5, 'M???c ti??u ngh??? nghi???p ph???i l???n h??n ho???c b???ng 5'),
		// .max(500, 'M???c ti??u ngh??? nghi???p ph???i nh??? h??n ho???c b???ng 50'),
	})
	const methods = useForm<FormProps<string>>({
		mode: 'onTouched',
		criteriaMode: 'firstError',
		reValidateMode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(yupSchemaRegister),
	})
	const onSubmit = async (object: FormProps<string>) => {
		const objectSubmit: any = { ...objectDetailData, ...object }
		delete objectSubmit['user']
		console.log(objectSubmit)
		try {
			dispatch(setLoading(true))
			const { status, data } = await adminAccountManager.putProfile(
				objectSubmit,
				router?.locale || ''
			)
			if (status === Status.SUCCESS) {
				setObjectDetailData(data?.data)
				notify('success', data?.message || '', Time.NOTIFY)
			}
			dispatch(setLoading(false))
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
			dispatch(setLoading(false))
		}
	}
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
			notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
		}
	}
	const handleAddExperience = (listType: string) => {
		const listTemp: any =
			listType === 'experience'
				? [...objectDetailData.work_experience]
				: listType === 'activities'
				? [...objectDetailData.activities]
				: listType === 'education'
				? [...objectDetailData.educations]
				: listType === 'skill'
				? [...objectDetailData.skills]
				: [...objectDetailData.certifications]
		switch (listType) {
			case 'experience': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					positon: 'Nh??n vi??n b??n h??ng',
					company_name: 'C??ng ty SOLIDBYTES',
					description:
						'- Gi???i thi???u, t?? v???n s???n ph???m, gi???i ????p c??c v???n ????? th???c m???c c???a kh??ch h??ng qua ??i???n tho???i v?? email.',
					startAt: moment()?.format(),
					endAt: moment()?.format(),
					isCurrent: objectDetailData?.work_experience?.length === 0 ? 1 : 0,
				})
				setObjectDetailData({ ...objectDetailData, work_experience: [...listTemp] })
				break
			}
			case 'activities': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					name: 'T??nh nguy???n vi??n',
					activity: 'Nh??m t??nh nguy???n SOLIDBYTES',
					description:
						'- Chia s???, ?????ng vi??n h??? v?????t qua giai ??o???n kh?? kh??n, gi??p h??? c?? nh???ng suy ngh?? l???c quan.',
					startAt: moment()?.format(),
					endAt: moment()?.format(),
				})
				setObjectDetailData({ ...objectDetailData, activities: [...listTemp] })
				break
			}
			case 'education': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					description: 'T???t nghi???p lo???i Gi???i, ??i???m trung b??nh 8.0',
					school_name: '?????I H???C SOLIDBYTES',
					startAt: moment()?.format(),
					endAt: moment()?.format(),
					major: 'Qu???n tr??? Doanh nghi???p',
				})
				setObjectDetailData({ ...objectDetailData, educations: [...listTemp] })
				break
			}
			case 'skill': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					name: 'Tin h???c v??n ph??ng SOLIDBYTES',
					description: '- S??? d???ng th??nh th???o c??c c??ng c??? Word, Excel, Power Point',
					status: '',
				})
				setObjectDetailData({ ...objectDetailData, skills: [...listTemp] })
				break
			}
			case 'certificate': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					certification: '2022: Gi???i nh???t T??i n??ng SOLIDBYTES',
					organization: '',
					description: '',
					link_certification: '',
				})
				setObjectDetailData({ ...objectDetailData, certifications: [...listTemp] })
				break
			}
			default:
			// code block
		}
	}
	const onChangeStartAt = (
		date: any,
		dateString: string,
		uuid: string,
		type: string,
		listType: string
	) => {
		const listTemp: any =
			listType === 'experience'
				? [...objectDetailData.work_experience]
				: listType === 'activities'
				? [...objectDetailData.activities]
				: [...objectDetailData.educations]
		const index = listTemp.findIndex((values: any) => values?.uuid === uuid)
		if (index > -1) {
			type === 'startAt'
				? (listTemp[index].startAt = dateString)
				: (listTemp[index].endAt = dateString)
			switch (listType) {
				case 'experience': {
					setObjectDetailData({ ...objectDetailData, work_experience: [...listTemp] })
					break
				}
				case 'activities': {
					setObjectDetailData({ ...objectDetailData, activities: [...listTemp] })
					break
				}
				case 'educations': {
					setObjectDetailData({ ...objectDetailData, educations: [...listTemp] })
					break
				}
				default:
				// code block
			}
		}
	}
	const handlePosition = (e: string, uuid: string, type: string, listType: string) => {
		const listTemp: any =
			listType === 'experience'
				? [...objectDetailData.work_experience]
				: listType === 'activities'
				? [...objectDetailData.activities]
				: listType === 'education'
				? [...objectDetailData.educations]
				: listType === 'skill'
				? [...objectDetailData.skills]
				: [...objectDetailData.certifications]
		const index = listTemp.findIndex((values: any) => values?.uuid === uuid)
		if (index > -1) {
			switch (type) {
				case 'position': {
					if (listType === 'experience') {
						listTemp[index].positon = e
					} else {
						listTemp[index].name = e
					}
					break
				}
				case 'company_name': {
					if (listType === 'experience') {
						listTemp[index].company_name = e
					} else {
						listTemp[index].activity = e
					}
					break
				}
				case 'description': {
					listTemp[index].description = e
					break
				}
				case 'school_name': {
					listTemp[index].school_name = e
					break
				}
				case 'major': {
					listTemp[index].major = e
					break
				}
				case 'name': {
					listTemp[index].name = e
					break
				}
				case 'certification': {
					listTemp[index].certification = e
				}
				default:
				// code block
			}
			switch (listType) {
				case 'experience': {
					setObjectDetailData({ ...objectDetailData, work_experience: [...listTemp] })
					break
				}
				case 'activities': {
					setObjectDetailData({ ...objectDetailData, activities: [...listTemp] })
					break
				}
				case 'education': {
					setObjectDetailData({ ...objectDetailData, educations: [...listTemp] })
					break
				}
				case 'skill': {
					setObjectDetailData({ ...objectDetailData, skills: [...listTemp] })
					break
				}
				case 'certification': {
					setObjectDetailData({ ...objectDetailData, certifications: [...listTemp] })
					break
				}
				default:
				// code block
			}
		}
	}
	const handleDeleteExperience = (uuid: string, listType: string) => {
		const listTemp: any =
			listType === 'experience'
				? [...objectDetailData.work_experience]
				: listType === 'activities'
				? [...objectDetailData.activities]
				: listType === 'education'
				? [...objectDetailData.educations]
				: listType === 'skill'
				? [...objectDetailData.skills]
				: [...objectDetailData.certifications]
		const index = listTemp.findIndex((values: any) => values?.uuid === uuid)
		if (index > -1) {
			listTemp.splice(index, 1)
			switch (listType) {
				case 'experience': {
					setObjectDetailData({ ...objectDetailData, work_experience: [...listTemp] })
					break
				}
				case 'activities': {
					setObjectDetailData({ ...objectDetailData, activities: [...listTemp] })
					break
				}
				case 'education': {
					setObjectDetailData({ ...objectDetailData, educations: [...listTemp] })
					break
				}
				case 'skill': {
					setObjectDetailData({ ...objectDetailData, skills: [...listTemp] })
					break
				}
				case 'certification': {
					setObjectDetailData({ ...objectDetailData, certifications: [...listTemp] })
					break
				}
				default:
				// code block
			}
		}
	}
	useEffect(() => {
		const listWorkExperience: any = [...objectDetailData.work_experience]
		const listActivities: any = [...objectDetailData.activities]
		const listEducations: any = [...objectDetailData.educations]
		const listSkill: any = [...objectDetailData.skills]
		const listCertifications: any = [...objectDetailData.certifications]
		if (listWorkExperience?.length === 0) {
			listWorkExperience.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				positon: 'Nh??n vi??n b??n h??ng',
				company_name: 'C??ng ty SOLIDBYTES',
				description:
					'- Gi???i thi???u, t?? v???n s???n ph???m, gi???i ????p c??c v???n ????? th???c m???c c???a kh??ch h??ng qua ??i???n tho???i v?? email.',
				startAt: moment()?.format(),
				endAt: moment()?.format(),
				isCurrent: objectDetailData?.work_experience?.length === 0 ? 1 : 0,
			})
		}
		if (listActivities?.length === 0) {
			listActivities.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				name: 'T??nh nguy???n vi??n',
				activity: 'Nh??m t??nh nguy???n SOLIDBYTES',
				description:
					'- Chia s???, ?????ng vi??n h??? v?????t qua giai ??o???n kh?? kh??n, gi??p h??? c?? nh???ng suy ngh?? l???c quan.',
				startAt: moment()?.format(),
				endAt: moment()?.format(),
			})
		}
		if (listEducations?.length === 0) {
			listEducations.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				description: 'T???t nghi???p lo???i Gi???i, ??i???m trung b??nh 8.0',
				school_name: '?????I H???C SOLIDBYTES',
				startAt: moment()?.format(),
				endAt: moment()?.format(),
				major: 'Qu???n tr??? Doanh nghi???p',
			})
		}
		if (listSkill?.length === 0) {
			listSkill.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				name: 'Tin h???c v??n ph??ng SOLIDBYTES',
				description: '- S??? d???ng th??nh th???o c??c c??ng c??? Word, Excel, Power Point',
				status: '',
			})
		}
		if (listCertifications?.length === 0) {
			listCertifications.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				certification: '2022: Gi???i nh???t T??i n??ng SOLIDBYTES',
				organization: '',
				description: '',
				link_certification: '',
			})
		}
		setObjectDetailData({
			...objectDetailData,
			activities: [...listActivities],
			work_experience: [...listWorkExperience],
			educations: [...listEducations],
			skills: [...listSkill],
			certifications: [...listCertifications],
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<InputLogin
					className={styles.cvName}
					type="text"
					name="cv_name"
					placeholder="Nh???p t??n cv"
				/>
				<div className={styles.detail}>
					<div className={styles.detail__left}>
						<div
							onClick={() => {
								refUploadImage.current.click()
							}}
							className={styles.detail__left__img}
						>
							<Image
								width={180}
								className={styles.detail__left__img__item}
								height={180}
								src={`${API.IMAGE}${objectDetail?.user?.avatar || ''}`}
								alt="SolidBytesAvatar"
							/>
							<CameraOutlined className={styles.detail__left__img__icon} />
						</div>
						<input
							className={styles.detail__left__upload}
							ref={refUploadImage}
							accept=".png, .jpg, .jpeg"
							onChange={handleUploadImage}
							type="file"
						/>
						<InputComponent
							className={styles.detail__left__fullName}
							type="text"
							name="full_name"
							placeholder="Nh???p h??? v?? t??n"
						/>
						<InputComponent
							className={styles.detail__left__special}
							type="text"
							name="specialized"
							placeholder="Nh???p v??? tr?? c??ng vi???c b???n mu???n ???ng tuy???n"
						/>
						<Image width={29} height={24} src={dot} alt="SolidBytesAvatar" />
						<InputAreaComponent
							className={styles.detail__left__career}
							name="career_goals"
							placeholder="Nh???p m???c ti??u ngh??? nghi???p ng???n h???n, d??i h???n"
						/>
						<div className={styles.detail__left__parent}>
							<div className={styles.add}>
								<h1 className={styles.detail__left__exp}>Kinh nghi???m l??m vi???c</h1>
								<Image
									onClick={() => handleAddExperience('experience')}
									className={styles.add__img}
									src={add}
									alt="SolidBytesExperience"
									objectFit="contain"
									width={30}
									height={30}
								/>
							</div>
							{objectDetailData?.work_experience?.length > 0 &&
								objectDetailData?.work_experience.map((values: WorkExperienceProps<string>) => {
									return (
										<div
											key={values?.uuid || 'Kh??ng c?? d??? li???u'.toLowerCase()}
											className={styles.detail__left__parent__line}
										>
											<div className={styles.detail__left__item}>
												<DatePicker
													defaultValue={moment(values?.startAt)}
													onChange={(date, dateString) =>
														onChangeStartAt(date, dateString, values?.uuid, 'startAt', 'experience')
													}
													format={DateFormat.VI_MOMENT}
													suffixIcon={null}
													className={styles.detail__left__item__input}
													placeholder="Ch???n ng??y b???t ?????u"
													bordered={false}
												/>
												<span
													className={`${styles.detail__left__date} ${styles.detail__left__date__icon}`}
												>
													-
												</span>
												{/* <span className={styles.detail__left__date}>
													{values?.isCurrent === 0
														? formatDate(
																values?.endAt || 'Kh??ng c?? d??? li???u'.toLowerCase(),
																DateFormat.VI
														  )
														: 'Hi???n t???i'}
												</span> */}
												<DatePicker
													defaultValue={moment(values?.endAt)}
													onChange={(date, dateString) =>
														onChangeStartAt(date, dateString, values?.uuid, 'endAt', 'experience')
													}
													format={DateFormat.VI_MOMENT}
													suffixIcon={null}
													className={styles.detail__left__item__input}
													placeholder="Ch???n ng??y k???t th??c"
													bordered={false}
												/>
											</div>
											<input
												onChange={(e) =>
													handlePosition(
														e?.target?.value || '',
														values?.uuid || '',
														'position',
														'experience'
													)
												}
												className={`${styles.detail__left__parent__line__input} ${
													!values?.positon ? styles.detail__left__parent__line__inputError : ''
												}`}
												type="text"
												value={values?.positon?.toUpperCase() || ''}
												placeholder="Nh???p v??? tr?? c??ng vi???c"
											/>
											<input
												onChange={(e) =>
													handlePosition(
														e?.target?.value || '',
														values?.uuid || '',
														'company_name',
														'experience'
													)
												}
												className={`${styles.detail__left__parent__line__input} ${
													!values?.company_name ? styles.detail__left__parent__line__inputError : ''
												} ${styles.detail__left__parent__line__inputCompany}`}
												type="text"
												value={values?.company_name?.toUpperCase() || ''}
												placeholder="Nh???p t??n c??ng ty"
											/>
											<TextArea
												className={`${styles.detail__left__parent__line__area} ${
													!values?.description ? styles.detail__left__parent__line__areaError : ''
												}`}
												onChange={(e) =>
													handlePosition(
														e?.target?.value || '',
														values?.uuid || '',
														'description',
														'experience'
													)
												}
												placeholder="Nh???p m?? t??? chi ti???t c??ng vi???c, nh???ng g?? ?????t ???????c trong qu?? tr??nh l??m vi???c"
												value={values?.description || ''}
											/>
											{objectDetailData?.work_experience?.length > 1 && (
												<FontAwesomeIcon
													onClick={() => handleDeleteExperience(values?.uuid, 'experience')}
													className={styles.detail__left__parent__line__delete}
													icon={faTrashCan}
												/>
											)}
										</div>
									)
								})}
						</div>
						<div className={styles.detail__left__parent}>
							<div className={styles.add}>
								<h1 className={styles.detail__left__exp}>Ho???t ?????ng</h1>
								<Image
									onClick={() => handleAddExperience('activities')}
									className={styles.add__img}
									src={add}
									alt="SolidBytesExperience"
									objectFit="contain"
									width={30}
									height={30}
								/>
							</div>
							{objectDetailData?.activities?.length > 0 &&
								objectDetailData?.activities.map((values: ActivitiesProps<string>) => {
									return (
										<div
											key={values?.uuid || 'Kh??ng c?? d??? li???u'.toLowerCase()}
											className={styles.detail__left__parent__line}
										>
											<div className={styles.detail__left__item}>
												<DatePicker
													defaultValue={moment(values?.startAt)}
													onChange={(date, dateString) =>
														onChangeStartAt(date, dateString, values?.uuid, 'startAt', 'activities')
													}
													format={DateFormat.VI_MOMENT}
													suffixIcon={null}
													className={styles.detail__left__item__input}
													placeholder="Ch???n ng??y b???t ?????u"
													bordered={false}
												/>
												<span
													className={`${styles.detail__left__date} ${styles.detail__left__date__icon}`}
												>
													-
												</span>
												{/* <span className={styles.detail__left__date}>
													{values?.isCurrent === 0
														? formatDate(
																values?.endAt || 'Kh??ng c?? d??? li???u'.toLowerCase(),
																DateFormat.VI
														  )
														: 'Hi???n t???i'}
												</span> */}
												<DatePicker
													defaultValue={moment(values?.endAt)}
													onChange={(date, dateString) =>
														onChangeStartAt(date, dateString, values?.uuid, 'endAt', 'activities')
													}
													format={DateFormat.VI_MOMENT}
													suffixIcon={null}
													className={styles.detail__left__item__input}
													placeholder="Ch???n ng??y k???t th??c"
													bordered={false}
												/>
											</div>
											<input
												onChange={(e) =>
													handlePosition(
														e?.target?.value || '',
														values?.uuid || '',
														'position',
														'activities'
													)
												}
												className={`${styles.detail__left__parent__line__input} ${
													!values?.name ? styles.detail__left__parent__line__inputError : ''
												}`}
												type="text"
												value={values?.name?.toUpperCase() || ''}
												placeholder="Nh???p v??? tr?? c??ng vi???c"
											/>
											<input
												onChange={(e) =>
													handlePosition(
														e?.target?.value || '',
														values?.uuid || '',
														'company_name',
														'activities'
													)
												}
												className={`${styles.detail__left__parent__line__input} ${
													!values?.activity ? styles.detail__left__parent__line__inputError : ''
												} ${styles.detail__left__parent__line__inputCompany}`}
												type="text"
												value={values?.activity?.toUpperCase() || ''}
												placeholder="Nh???p t??n c??ng ty"
											/>
											<TextArea
												className={`${styles.detail__left__parent__line__area} ${
													!values?.description ? styles.detail__left__parent__line__areaError : ''
												}`}
												onChange={(e) =>
													handlePosition(
														e?.target?.value || '',
														values?.uuid || '',
														'description',
														'activities'
													)
												}
												placeholder="Nh???p m?? t??? chi ti???t c??ng vi???c, nh???ng g?? ?????t ???????c trong qu?? tr??nh l??m vi???c"
												value={values?.description || ''}
											/>
											{objectDetailData?.activities?.length > 1 && (
												<FontAwesomeIcon
													onClick={() => handleDeleteExperience(values?.uuid, 'activities')}
													className={styles.detail__left__parent__line__delete}
													icon={faTrashCan}
												/>
											)}
										</div>
									)
								})}
						</div>
					</div>
					<div className={styles.detail__right}>
						<div className={`${styles.detail__right__parent} ${styles.detail__right__parentTop}`}>
							<div className={styles.detail__right__parent__menu}>
								<FontAwesomeIcon
									className={`${styles.detail__right__parent__menu__icon} ${styles.detail__right__parent__menu__iconCalendar}`}
									icon={faCalendarDays}
								/>
								<FontAwesomeIcon
									className={`${styles.detail__right__parent__menu__icon} ${styles.detail__right__parent__menu__iconPhone}`}
									icon={faPhone}
								/>
								<FontAwesomeIcon
									className={`${styles.detail__right__parent__menu__icon} ${styles.detail__right__parent__menu__iconSquare}`}
									icon={faEnvelopeSquare}
								/>
								<FontAwesomeIcon
									className={`${styles.detail__right__parent__menu__icon} ${styles.detail__right__parent__menu__iconLink}`}
									icon={faLink}
								/>
								<FontAwesomeIcon
									className={`${styles.detail__right__parent__menu__icon} ${styles.detail__right__parent__menu__iconLink}`}
									icon={faHouseChimney}
								/>
								<FontAwesomeIcon
									className={`${styles.detail__right__parent__menu__icon} ${styles.detail__right__parent__menu__iconUser}`}
									icon={faUser}
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Ng??y sinh</h1>
								{/* <p>
									{objectDetail?.birth_day
										? formatDate(objectDetail?.birth_day, DateFormat.VI)
										: 'Kh??ng c?? d??? li???u'.toLowerCase()}
								</p> */}
								<DatePickerComponent
									showIcon={false}
									bordered={false}
									className={`${styles.detail__right__item__information} ${styles.detail__right__item__informationCalendar}`}
									name="birth_day"
									placeholder="Ch???n ng??y sinh"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>S??? ??i???n tho???i</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="phone"
									placeholder="Nh???p s??? ??i???n tho???i"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Email</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="email"
									placeholder="Nh???p email"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Website</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="website"
									placeholder="Nh???p website ho???c facebook,...,c???a b???n. V?? d???: https://..."
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>?????a ch???</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="address"
									placeholder="Nh???p ?????a ch???"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Gi???i t??nh</h1>
								<RadioComponent data={listStatus} name="gender" />
							</div>
						</div>
						<div className={styles.detail__right__parent}>
							<div className={styles.detail__right__parent__item}>
								<div className={styles.detail__right__parent__item__titleIcon}>
									{/* <div className={styles.add}>
										<h1 className={styles.detail__right__parent__item__titleIcon__child}>
											H???c v???n
										</h1>
										<Image
											onClick={() => handleAddExperience('experience')}
											className={styles.add__img}
											src={add}
											alt="SolidBytesExperience"
											objectFit="contain"
											width={30}
											height={30}
										/>
									</div> */}
									<div className={styles.add}>
										<h1 className={styles.detail__right__parent__item__titleIcon__child}>
											H???c v???n
										</h1>
										<Image
											onClick={() => handleAddExperience('education')}
											className={styles.add__img}
											src={add}
											alt="SolidBytesExperience"
											objectFit="contain"
											width={30}
											height={30}
										/>
									</div>
									<div className={styles.detail__right__parent__item__titleIcon__icon}>
										<FontAwesomeIcon
											className={styles.detail__right__parent__item__titleIcon__icon__child}
											icon={faGraduationCap}
										/>
									</div>
								</div>
								{objectDetailData?.educations?.length > 0 &&
									objectDetailData?.educations.map((values) => {
										return (
											<div
												className={styles.education}
												key={values?.uuid || 'Kh??ng c?? d??? li???u'.toLowerCase()}
											>
												<div className={styles.detail__right__parent__itemSpecial}>
													{/* <h3
														className={`${styles.detail__right__parent__item__title} ${styles.detail__right__parent__item__titleSpecial}`}
													>
														{values?.school_name || 'Kh??ng c?? d??? li???u'.toLowerCase()}
													</h3> */}
													<input
														onChange={(e) =>
															handlePosition(
																e?.target?.value || '',
																values?.uuid || '',
																'school_name',
																'education'
															)
														}
														className={`${styles.detail__right__parent__itemSpecial__input} ${
															!values?.school_name &&
															styles.detail__right__parent__itemSpecial__inputError
														}`}
														type="text"
														value={values?.school_name?.toUpperCase() || ''}
														placeholder="T??n tr?????ng h???c"
													/>
													<span className={styles.detail__right__parent__itemSpecial__line}>|</span>
													<div className={styles.detail__right__parent__item__time}>
														<DatePicker
															defaultValue={moment(values?.startAt)}
															onChange={(date, dateString) =>
																onChangeStartAt(
																	date,
																	dateString,
																	values?.uuid,
																	'startAt',
																	'education'
																)
															}
															format={DateFormat.VI_MOMENT}
															suffixIcon={null}
															className={styles.detail__right__parent__item__time__input}
															placeholder="Ch???n ng??y b???t ?????u"
															bordered={false}
														/>
														<span className={styles.detail__right__parent__item__time__line}>
															-
														</span>
														<DatePicker
															defaultValue={moment(values?.endAt)}
															onChange={(date, dateString) =>
																onChangeStartAt(
																	date,
																	dateString,
																	values?.uuid,
																	'endAt',
																	'education'
																)
															}
															format={DateFormat.VI_MOMENT}
															suffixIcon={null}
															className={styles.detail__right__parent__item__time__input}
															placeholder="ng??y k???t th??c"
															bordered={false}
														/>
													</div>
													{objectDetailData?.educations?.length > 1 && (
														<FontAwesomeIcon
															onClick={() => handleDeleteExperience(values?.uuid, 'education')}
															className={styles.detail__right__parent__itemSpecial__icon}
															icon={faTrashCan}
														/>
													)}
												</div>
												<div className={styles.detail__right__parent__item__special}>
													<input
														onChange={(e) =>
															handlePosition(
																e?.target?.value || '',
																values?.uuid || '',
																'major',
																'education'
															)
														}
														// className={`${styles.detail__left__parent__line__input} ${
														// 	!values?.company_name
														// 		? styles.detail__left__parent__line__inputError
														// 		: ''
														// } ${styles.detail__left__parent__line__inputCompany}`}
														className={`${styles.detail__right__parent__item__special__input} ${
															!values?.major &&
															styles.detail__right__parent__item__special__inputError
														}`}
														type="text"
														value={values?.major?.toUpperCase() || ''}
														placeholder="Nh???p chuy??n ng??nh"
													/>
													<TextArea
														className={`${styles.detail__right__parent__item__special__area} ${
															!values?.description &&
															styles.detail__right__parent__item__special__areaError
														}`}
														// className={`${styles.detail__left__parent__line__area} ${
														// 	!values?.description
														// 		? styles.detail__left__parent__line__areaError
														// 		: ''
														// }`}
														onChange={(e) =>
															handlePosition(
																e?.target?.value || '',
																values?.uuid || '',
																'description',
																'education'
															)
														}
														placeholder="Nh???p m?? t??? chi ti???t k???t qu??? h???c v???n"
														value={values?.description || ''}
													/>
												</div>
											</div>
										)
									})}
							</div>
						</div>
						<div className={styles.detail__right__parent}>
							<div className={styles.detail__right__parent__item}>
								<div className={styles.detail__right__parent__item__titleIcon}>
									<div className={styles.add}>
										<h1 className={styles.detail__right__parent__item__titleIcon__child}>
											K??? n??ng
										</h1>
										<Image
											onClick={() => handleAddExperience('skill')}
											className={styles.add__img}
											src={add}
											alt="SolidBytesExperience"
											objectFit="contain"
											width={30}
											height={30}
										/>
									</div>
									<div className={styles.detail__right__parent__item__titleIcon__icon}>
										<FontAwesomeIcon
											className={styles.detail__right__parent__item__titleIcon__icon__child}
											icon={faCog}
										/>
									</div>
								</div>
								{objectDetailData?.skills?.length > 0 &&
									objectDetailData?.skills?.map((values: any) => {
										return (
											<div
												className={`${styles.education} ${styles.skillItem}`}
												key={values?.uuid || 'Kh??ng c?? d??? li???u'.toLowerCase()}
											>
												<div className={styles.detail__right__parent__item__special}>
													<div className={styles.skill}>
														<input
															onChange={(e) =>
																handlePosition(
																	e?.target?.value || '',
																	values?.uuid || '',
																	'name',
																	'skill'
																)
															}
															// className={`${styles.detail__left__parent__line__input} ${
															// 	!values?.company_name
															// 		? styles.detail__left__parent__line__inputError
															// 		: ''
															// } ${styles.detail__left__parent__line__inputCompany}`}
															className={`${styles.detail__right__parent__item__special__input} ${
																!values?.name &&
																styles.detail__right__parent__item__special__inputError
															}`}
															type="text"
															value={values?.name?.toUpperCase() || ''}
															placeholder="Nh???p nh??m k??? n??ng"
														/>
														{objectDetailData?.skills?.length > 1 && (
															<FontAwesomeIcon
																onClick={() => handleDeleteExperience(values?.uuid, 'skill')}
																className={styles.skill__icon}
																icon={faTrashCan}
															/>
														)}
													</div>

													<TextArea
														className={`${styles.detail__right__parent__item__special__area} ${
															!values?.description &&
															styles.detail__right__parent__item__special__areaError
														}`}
														// className={`${styles.detail__left__parent__line__area} ${
														// 	!values?.description
														// 		? styles.detail__left__parent__line__areaError
														// 		: ''
														// }`}
														onChange={(e) =>
															handlePosition(
																e?.target?.value || '',
																values?.uuid || '',
																'description',
																'skill'
															)
														}
														placeholder="Nh???p m?? t??? t???ng k??? n??ng"
														value={values?.description || ''}
													/>
												</div>
											</div>
										)
									})}
							</div>
						</div>
						<div className={styles.detail__right__parent}>
							<div className={styles.detail__right__parent__item}>
								<div className={styles.detail__right__parent__item__titleIcon}>
									<div className={styles.add}>
										<h1 className={styles.detail__right__parent__item__titleIcon__child}>
											Ch???ng ch???
										</h1>
										<Image
											onClick={() => handleAddExperience('certificate')}
											className={styles.add__img}
											src={add}
											alt="SolidBytesExperience"
											objectFit="contain"
											width={30}
											height={30}
										/>
									</div>
									<div className={styles.detail__right__parent__item__titleIcon__icon}>
										<FontAwesomeIcon
											className={styles.detail__right__parent__item__titleIcon__icon__child}
											icon={faCertificate}
										/>
									</div>
								</div>
								{objectDetailData?.certifications?.length > 0 &&
									objectDetailData?.certifications?.map((values) => {
										return (
											<div
												className={`${styles.education} ${styles.skillItem}`}
												key={values?.uuid || 'Kh??ng c?? d??? li???u'.toLowerCase()}
											>
												<div
													className={`${styles.detail__right__parent__item__special} ${styles.detail__right__parent__item__specialCertification}`}
												>
													<TextArea
														className={`${styles.detail__right__parent__item__special__area} ${
															styles.detail__right__parent__item__special__areaCertification
														} ${
															!values?.certification &&
															styles.detail__right__parent__item__special__areaError
														}`}
														// className={`${styles.detail__left__parent__line__area} ${
														// 	!values?.description
														// 		? styles.detail__left__parent__line__areaError
														// 		: ''
														// }`}
														onChange={(e) =>
															handlePosition(
																e?.target?.value || '',
																values?.uuid || '',
																'certification',
																'certification'
															)
														}
														placeholder="Nh???p t??n ch???ng ch???"
														value={values?.certification || ''}
													/>
													{objectDetailData?.certifications?.length > 1 && (
														<FontAwesomeIcon
															onClick={() => handleDeleteExperience(values?.uuid, 'certification')}
															className={`${styles.skill__icon} ${styles.skill__iconCertification}`}
															icon={faTrashCan}
														/>
													)}
												</div>
											</div>
										)
									})}
							</div>
						</div>
					</div>
				</div>
				<div className={styles.cvSave}>
					<button className={styles.cvSave__item} type="submit">
						L??u CV
					</button>
				</div>
			</form>
		</FormProvider>
	)
}
export default CvDetail
