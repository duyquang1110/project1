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
		{ key: 'Nữ', value: ProfileGender.FEMALE },
		{ key: 'Không xác định', value: ProfileGender.OTHER },
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
		specialized: objectDetail?.specialized?.toUpperCase() || 'NHÂN VIÊN KINH DOANH',
		gender: objectDetail?.gender ? objectDetail.gender : ProfileGender.OTHER,
		address: objectDetail?.address
			? objectDetail.address
			: '27/27, Ngô Y Linh, An Lạc, Bình Tân, TP.HCM',
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
			'Áp dụng những kinh nghiệm về kỹ năng bán hàng và sự hiểu biết về thị trường để trở thành một nhân viên bán hàng chuyên nghiệp, mang đến nhiều giá trị cho khách hàng. Từ đó giúp Công ty tăng số lượng khách hàng và mở rộng tập khách hàng.',
	}
	const yupSchemaRegister = yup.object().shape({
		birth_day: yup.string().required('Bạn chưa chọn ngày sinh').nullable(),
		website: yup.string().url('Bạn chưa nhập website').optional(),
		full_name: yup
			.string()
			.required('Bạn chưa nhập họ và tên')
			.min(5, 'Họ và tên phải lớn hơn hoặc bằng 5')
			.max(50, 'Họ và tên phải nhỏ hơn hoặc bằng 50'),
		address: yup
			.string()
			.required('Bạn chưa nhập địa chỉ')
			.min(10, 'Địa chỉ phải lớn hơn hoặc bằng 10')
			.max(200, 'Địa chỉ phải nhỏ hơn hoặc bằng 200'),
		cv_name: yup
			.string()
			.required('Bạn chưa nhập tên cv')
			.min(2, 'Tên cv phải lớn hơn hoặc bằng 2')
			.max(100, 'Tên cv phải nhỏ hơn hoặc bằng 100'),
		phone: yup.string().required('Bạn chưa nhập số điện thoại').matches(regex.phone, {
			message: 'Số điện thoại không hợp lệ',
			excludeEmptyString: true,
		}),
		email: yup.string().required('Bạn chưa nhập email').matches(regex.email, 'Email không hợp lệ'),
		specialized: yup
			.string()
			.required('Bạn chưa nhập vị trí ứng tuyển')
			.min(5, 'Vị trí ứng tuyển phải lớn hơn hoặc bằng 5')
			.max(50, 'Vị trí ứng tuyển phải nhỏ hơn hoặc bằng 50'),
		career_goals: yup
			.string()
			.required('Bạn chưa nhập mục tiêu nghề nghiệp')
			.min(5, 'Mục tiêu nghề nghiệp phải lớn hơn hoặc bằng 5'),
		// .max(500, 'Mục tiêu nghề nghiệp phải nhỏ hơn hoặc bằng 50'),
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
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
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
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
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
					positon: 'Nhân viên bán hàng',
					company_name: 'Công ty SOLIDBYTES',
					description:
						'- Giới thiệu, tư vấn sản phẩm, giải đáp các vấn đề thắc mắc của khách hàng qua điện thoại và email.',
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
					name: 'Tình nguyện viên',
					activity: 'Nhóm tình nguyện SOLIDBYTES',
					description:
						'- Chia sẻ, động viên họ vượt qua giai đoạn khó khăn, giúp họ có những suy nghĩ lạc quan.',
					startAt: moment()?.format(),
					endAt: moment()?.format(),
				})
				setObjectDetailData({ ...objectDetailData, activities: [...listTemp] })
				break
			}
			case 'education': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					description: 'Tốt nghiệp loại Giỏi, điểm trung bình 8.0',
					school_name: 'ĐẠI HỌC SOLIDBYTES',
					startAt: moment()?.format(),
					endAt: moment()?.format(),
					major: 'Quản trị Doanh nghiệp',
				})
				setObjectDetailData({ ...objectDetailData, educations: [...listTemp] })
				break
			}
			case 'skill': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					name: 'Tin học văn phòng SOLIDBYTES',
					description: '- Sử dụng thành thạo các công cụ Word, Excel, Power Point',
					status: '',
				})
				setObjectDetailData({ ...objectDetailData, skills: [...listTemp] })
				break
			}
			case 'certificate': {
				listTemp.push({
					uuid: `${uuidv4()} ${uuidv4()}`,
					certification: '2022: Giải nhất Tài năng SOLIDBYTES',
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
				positon: 'Nhân viên bán hàng',
				company_name: 'Công ty SOLIDBYTES',
				description:
					'- Giới thiệu, tư vấn sản phẩm, giải đáp các vấn đề thắc mắc của khách hàng qua điện thoại và email.',
				startAt: moment()?.format(),
				endAt: moment()?.format(),
				isCurrent: objectDetailData?.work_experience?.length === 0 ? 1 : 0,
			})
		}
		if (listActivities?.length === 0) {
			listActivities.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				name: 'Tình nguyện viên',
				activity: 'Nhóm tình nguyện SOLIDBYTES',
				description:
					'- Chia sẻ, động viên họ vượt qua giai đoạn khó khăn, giúp họ có những suy nghĩ lạc quan.',
				startAt: moment()?.format(),
				endAt: moment()?.format(),
			})
		}
		if (listEducations?.length === 0) {
			listEducations.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				description: 'Tốt nghiệp loại Giỏi, điểm trung bình 8.0',
				school_name: 'ĐẠI HỌC SOLIDBYTES',
				startAt: moment()?.format(),
				endAt: moment()?.format(),
				major: 'Quản trị Doanh nghiệp',
			})
		}
		if (listSkill?.length === 0) {
			listSkill.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				name: 'Tin học văn phòng SOLIDBYTES',
				description: '- Sử dụng thành thạo các công cụ Word, Excel, Power Point',
				status: '',
			})
		}
		if (listCertifications?.length === 0) {
			listCertifications.push({
				uuid: `${uuidv4()} ${uuidv4()}`,
				certification: '2022: Giải nhất Tài năng SOLIDBYTES',
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
					placeholder="Nhập tên cv"
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
							placeholder="Nhập họ và tên"
						/>
						<InputComponent
							className={styles.detail__left__special}
							type="text"
							name="specialized"
							placeholder="Nhập vị trí công việc bạn muốn ứng tuyển"
						/>
						<Image width={29} height={24} src={dot} alt="SolidBytesAvatar" />
						<InputAreaComponent
							className={styles.detail__left__career}
							name="career_goals"
							placeholder="Nhập mục tiêu nghề nghiệp ngắn hạn, dài hạn"
						/>
						<div className={styles.detail__left__parent}>
							<div className={styles.add}>
								<h1 className={styles.detail__left__exp}>Kinh nghiệm làm việc</h1>
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
											key={values?.uuid || 'Không có dữ liệu'.toLowerCase()}
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
													placeholder="Chọn ngày bắt đầu"
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
																values?.endAt || 'Không có dữ liệu'.toLowerCase(),
																DateFormat.VI
														  )
														: 'Hiện tại'}
												</span> */}
												<DatePicker
													defaultValue={moment(values?.endAt)}
													onChange={(date, dateString) =>
														onChangeStartAt(date, dateString, values?.uuid, 'endAt', 'experience')
													}
													format={DateFormat.VI_MOMENT}
													suffixIcon={null}
													className={styles.detail__left__item__input}
													placeholder="Chọn ngày kết thúc"
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
												placeholder="Nhập vị trí công việc"
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
												placeholder="Nhập tên công ty"
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
												placeholder="Nhập mô tả chi tiết công việc, những gì đạt được trong quá trình làm việc"
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
								<h1 className={styles.detail__left__exp}>Hoạt động</h1>
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
											key={values?.uuid || 'Không có dữ liệu'.toLowerCase()}
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
													placeholder="Chọn ngày bắt đầu"
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
																values?.endAt || 'Không có dữ liệu'.toLowerCase(),
																DateFormat.VI
														  )
														: 'Hiện tại'}
												</span> */}
												<DatePicker
													defaultValue={moment(values?.endAt)}
													onChange={(date, dateString) =>
														onChangeStartAt(date, dateString, values?.uuid, 'endAt', 'activities')
													}
													format={DateFormat.VI_MOMENT}
													suffixIcon={null}
													className={styles.detail__left__item__input}
													placeholder="Chọn ngày kết thúc"
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
												placeholder="Nhập vị trí công việc"
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
												placeholder="Nhập tên công ty"
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
												placeholder="Nhập mô tả chi tiết công việc, những gì đạt được trong quá trình làm việc"
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
								<h1>Ngày sinh</h1>
								{/* <p>
									{objectDetail?.birth_day
										? formatDate(objectDetail?.birth_day, DateFormat.VI)
										: 'Không có dữ liệu'.toLowerCase()}
								</p> */}
								<DatePickerComponent
									showIcon={false}
									bordered={false}
									className={`${styles.detail__right__item__information} ${styles.detail__right__item__informationCalendar}`}
									name="birth_day"
									placeholder="Chọn ngày sinh"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Số điện thoại</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="phone"
									placeholder="Nhập số điện thoại"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Email</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="email"
									placeholder="Nhập email"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Website</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="website"
									placeholder="Nhập website hoặc facebook,...,của bạn. Ví dụ: https://..."
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Địa chỉ</h1>
								<InputComponent
									className={styles.detail__right__item__input}
									type="text"
									name="address"
									placeholder="Nhập địa chỉ"
								/>
							</div>
							<div className={styles.detail__right__item}>
								<h1>Giới tính</h1>
								<RadioComponent data={listStatus} name="gender" />
							</div>
						</div>
						<div className={styles.detail__right__parent}>
							<div className={styles.detail__right__parent__item}>
								<div className={styles.detail__right__parent__item__titleIcon}>
									{/* <div className={styles.add}>
										<h1 className={styles.detail__right__parent__item__titleIcon__child}>
											Học vấn
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
											Học vấn
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
												key={values?.uuid || 'Không có dữ liệu'.toLowerCase()}
											>
												<div className={styles.detail__right__parent__itemSpecial}>
													{/* <h3
														className={`${styles.detail__right__parent__item__title} ${styles.detail__right__parent__item__titleSpecial}`}
													>
														{values?.school_name || 'Không có dữ liệu'.toLowerCase()}
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
														placeholder="Tên trường học"
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
															placeholder="Chọn ngày bắt đầu"
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
															placeholder="ngày kết thúc"
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
														placeholder="Nhập chuyên ngành"
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
														placeholder="Nhập mô tả chi tiết kết quả học vấn"
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
											Kỹ năng
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
												key={values?.uuid || 'Không có dữ liệu'.toLowerCase()}
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
															placeholder="Nhập nhóm kỹ năng"
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
														placeholder="Nhập mô tả từng kỹ năng"
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
											Chứng chỉ
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
												key={values?.uuid || 'Không có dữ liệu'.toLowerCase()}
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
														placeholder="Nhập tên chứng chỉ"
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
						Lưu CV
					</button>
				</div>
			</form>
		</FormProvider>
	)
}
export default CvDetail
