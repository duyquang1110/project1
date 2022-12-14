import styles from './JobDetail.module.scss'
import location from 'public/assets/img/Detail/location.png'
import money from 'public/assets/img/Detail/money.png'
import twitter from 'public/assets/img/Detail/twitter.png'
import parse from 'html-react-parser'
import pinterest from 'public/assets/img/Detail/pinterest.png'
import facebook from 'public/assets/img/Detail/facebook.png'
import google from 'public/assets/img/Detail/google.png'
import { FormProps as FormPropsEnum } from 'constants/enums/Job'
import jobDes from 'public/assets/img/Detail/jobDes.png'
import responsive from 'public/assets/img/Detail/responsive.png'
import benefit from 'public/assets/img/Detail/benefit.png'
import Image from 'next/image'
import { Button, Modal } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { Radio, Space } from 'antd'
import { JobPagingProps } from 'models/HomePage'
import { API, Color, Status } from 'constants/enums/Common'
import { formatMoneyCustom } from 'utils/format'
import BestJobs from 'layouts/HomePage/BestJobs'
import { useAppSelector } from 'redux/reducers/hooks'
import { userInformationReducer } from 'redux/reducers/common'
import { useEffect, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import homePage from 'services/HomePage'
import { useRouter } from 'next/router'
import { notify } from 'utils/notification'
import { Time } from 'constants/time'
import { LanguageEnum } from 'constants/language'
const ModalInterview = ({
	openInterview,
	handleOpenInterview,
}: {
	openInterview: boolean
	handleOpenInterview: (status: boolean) => void
}) => {
	const [value, setValue] = useState(1)

	const onChange = (e: RadioChangeEvent) => {
		setValue(e.target.value)
	}
	return (
		<Modal
			width={622}
			bodyStyle={{
				backgroundColor: Color.FFFFFF,
				borderRadius: '8px',
				boxShadow: '1px 4px 8px rgba(0, 0, 0, 0.15)',
			}}
			onCancel={() => handleOpenInterview(false)}
			closable={false}
			title=""
			centered
			footer=""
			visible={openInterview}
		>
			<div className={styles.interview}>
				<div className={styles.interview__icon}>
					<CloseOutlined
						className={styles.interview__icon__item}
						onClick={() => handleOpenInterview(false)}
					/>
				</div>
				<p className={styles.interview__title}>
					B???n ??ang ???ng tuy???n v??? tr?? <span>UI/UX Designer Intern/Junior</span> t???i c??ng ty ITC Group
				</p>
				<div className={styles.interview__time}>
					<h1>Th???i gian ph???ng v???n: </h1>
					<div className={styles.interview__time__schedule}>
						<Radio.Group onChange={onChange} value={value}>
							<Space direction="vertical">
								<Radio value={1}>Option A</Radio>
								<Radio value={2}>Option B</Radio>
								<Radio value={3}>Option C</Radio>
								<Radio value={4}>Option A</Radio>
								<Radio value={5}>Option B</Radio>
								<Radio value={6}>Option C</Radio>
								<Radio value={7}>Option A</Radio>
								<Radio value={8}>Option B</Radio>
								<Radio value={9}>Option C</Radio>
								<Radio value={10}>Option A</Radio>
								<Radio value={11}>Option B</Radio>
								<Radio value={12}>Option C</Radio>
							</Space>
						</Radio.Group>
					</div>
				</div>
				<div className={styles.interview__button}>
					<Button className={styles.interview__button__save}>L??u</Button>
					<Button className={styles.interview__button__applied} type="primary">
						???ng Tuy???n
					</Button>
				</div>
			</div>
		</Modal>
	)
}
const JobDetailComponent = ({ detail, job }: { detail: JobPagingProps<string>; job: any }) => {
	const router = useRouter()
	const [isSavedCSR, setIsSavedCSR] = useState<boolean>(false)
	const [openInterview, setOpenInterview] = useState<boolean>(false)
	const userInformationReducerData = useAppSelector(userInformationReducer)
	const handleOpenInterview = (status: boolean): void => {
		setOpenInterview(status)
	}
	const getAllById = async () => {
		try {
			const res: any = await homePage.getAllJobById(router?.locale || '', detail?.uuid || '')
			if (res.status === Status.SUCCESS) {
				setIsSavedCSR(res?.data?.data?.isSaved)
			}
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
		}
	}
	const handleChangeStatusHeart = async (jobUuid: string) => {
		try {
			// dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = isSavedCSR
				? await homePage.deleteUserSaveJob(jobUuid, LanguageEnum.VIETNAMESE_LOCALE)
				: await homePage.postUserSaveJob(
						{
							jobUuid,
						},
						LanguageEnum.VIETNAMESE_LOCALE
				  )
			if (status === Status.SUCCESS) {
				setIsSavedCSR(!isSavedCSR)
				notify('success', data?.message || '', Time.NOTIFY)
			}
			// setTimeout(() => {
			// 	dispatch(setLoading(false))
			// }, Time.LOADING)
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'L???i', Time.NOTIFY)
			// dispatch(setLoading(false))
		}
	}
	useEffect(() => {
		getAllById()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<section className={styles.jobDetail}>
			<div className={styles.jobDetail__child}>
				<div className={styles.jobDetail__child__company}>
					<div className={styles.jobDetail__child__company__left}>
						<div>
							<Image
								className={styles.jobDetail__child__company__left__img}
								src={`${API.IMAGE}${detail?.user?.company?.logo || ''}`}
								alt="SolidBytesCompany"
								objectFit="contain"
								width={196}
								height={100}
							/>
						</div>
						<div className={styles.jobDetail__child__company__left__information}>
							<h1>{detail?.title || ''}</h1>
							<div className={styles.jobDetail__child__company__left__information__month}>
								<div className={styles.jobDetail__child__company__left__information__month__money}>
									<Image
										src={money}
										alt="SolidBytesCompany"
										objectFit="contain"
										width={20}
										height={20}
									/>
									<p>{`${formatMoneyCustom(detail?.salary?.from) || '0'}${
										detail?.salary?.type_currency
									}-${formatMoneyCustom(detail?.salary?.to) || '0'}${
										detail?.salary?.type_currency
									}/${
										detail?.periodic?.toLowerCase() === 'month' ? 'th??ng' : 'n??m' || 'th??ng'
									}`}</p>
								</div>
								<div>
									<Image
										src={location}
										alt="SolidBytesCompany"
										objectFit="contain"
										width={20}
										height={20}
									/>
									<p>{detail?.user?.company?.address || 'Q3, HCM'}</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.jobDetail__child__company__right}>
						<Button
							onClick={() => handleChangeStatusHeart(detail?.uuid || '')}
							// type='primary'
							disabled={Object.keys(userInformationReducerData).length === 0}
							className={`${styles.jobDetail__child__company__right__save} ${
								isSavedCSR ? styles.jobDetail__child__company__right__saveCSR : ''
							}`}
						>
							{isSavedCSR ? 'B??? l??u' : 'L??u'}
						</Button>
						<Button
							onClick={() => setOpenInterview(true)}
							disabled={Object.keys(userInformationReducerData).length === 0}
							className={styles.jobDetail__child__company__right__application}
							type="primary"
						>
							???ng Tuy???n
						</Button>
					</div>
				</div>
				<div className={styles.jobDetail__child__information}>
					<div>
						<Image
							className={styles.jobDetail__child__information__img}
							src={`${API.IMAGE}${detail?.user?.company?.background || ''}`}
							alt="SolidBytesCompany"
							objectFit="cover"
							width={731}
							height={487}
						/>
					</div>
					<div className={styles.jobDetail__child__information__right}>
						<div className={styles.jobDetail__child__information__right__top}>
							<h1>Th??ng tin chung</h1>
							<div>
								<b>M???c l????ng: </b>
								<span>{`${formatMoneyCustom(detail?.salary?.from) || '0'}${
									detail?.salary?.type_currency
								}-${formatMoneyCustom(detail?.salary?.to) || '0'}${detail?.salary?.type_currency}/${
									detail?.periodic?.toLowerCase() === 'month' ? 'th??ng' : 'n??m' || 'th??ng'
								}`}</span>
							</div>
							<div>
								<b>S??? l?????ng tuy???n: </b>
								<span>{`${detail?.number_vacancies || '1'} nh??n s???`}</span>
							</div>
							<div>
								<b>H??nh th???c l??m vi???c: </b>
								<span>
									{detail?.type_job?.length > 0 &&
										detail.type_job.map((values, index) => {
											return values === FormPropsEnum.COMPANY
												? `t???i c??ng ty${detail?.type_job?.length - 1 !== index ? ', ' : ''}`
												: values === FormPropsEnum.REMOTE
												? `t??? xa${detail?.type_job?.length - 1 !== index ? ', ' : ''}`
												: values === FormPropsEnum.FULLTIME
												? `to??n th???i gian${detail?.type_job?.length - 1 !== index ? ', ' : ''}`
												: `b??n th???i gian${detail?.type_job?.length - 1 !== index ? ', ' : ''}`
										})}
								</span>
							</div>
							<div>
								<b>C???p b???c: </b>
								{detail?.level?.length > 0 &&
									detail.level.map((values, index) => {
										return (
											<span key={index}>{`${values}${
												index !== detail?.level?.length - 1 ? ',' : ''
											}`}</span>
										)
									})}
							</div>
							<div>
								<b>Gi???i t??nh: </b>
								{detail?.gender?.length > 0 ? (
									detail.gender.map((values, index) => {
										return (
											<span key={index}>
												{values === 'female'
													? `n???${index !== detail?.gender?.length - 1 ? ',' : ''}`
													: `nam${index !== detail?.gender?.length - 1 ? ',' : ''}`}
											</span>
										)
									})
								) : (
									<span>Kh??ng y??u c???u</span>
								)}
							</div>
							<div>
								<b>Kinh nghi???m: </b>
								<span>{`${detail?.skill_experience || '1'} n??m`}</span>
							</div>
							<div>
								<b>?????a ch??? l??m vi???c: </b>
								<span>{`${detail?.address || ''}, ${detail?.ward?.name || ''}, ${
									detail?.district?.name || ''
								}, ${detail?.city?.name || ''}`}</span>
							</div>
						</div>
						<div className={styles.jobDetail__child__information__right__bottom}>
							<span>Chia s??? qua:</span>
							<div className={styles.jobDetail__child__information__right__bottom__icon}>
								<div>
									<Image
										src={facebook}
										alt="SolidBytesFacebook"
										objectFit="contain"
										width={30}
										height={30}
									/>
								</div>
								<div>
									<Image
										src={google}
										alt="SolidBytesGoogle"
										objectFit="contain"
										width={30}
										height={30}
									/>
								</div>
								<div>
									<Image
										src={twitter}
										alt="SolidBytesTwitter"
										objectFit="contain"
										width={30}
										height={30}
									/>
								</div>
								<div>
									<Image
										src={pinterest}
										alt="SolidBytesPinterest"
										objectFit="contain"
										width={30}
										height={30}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.jobDetail__child__item}>
					<div className={styles.jobDetail__child__item__title}>
						<div>
							<Image
								src={jobDes}
								alt="SolidBytesJobDescription"
								objectFit="contain"
								width={24}
								height={24}
							/>
						</div>
						<h1>M?? t??? c??ng vi???c</h1>
					</div>
					<div className={styles.jobDetail__child__item__content}>
						{parse(detail?.position || 'kh??ng c??')}
					</div>
				</div>
				<div className={styles.jobDetail__child__item}>
					<div className={styles.jobDetail__child__item__title}>
						<div>
							<Image
								src={responsive}
								alt="SolidBytesJobDescription"
								objectFit="contain"
								width={24}
								height={24}
							/>
						</div>
						<h1>Y??u c???u ???ng vi??n</h1>
					</div>
					<div className={styles.jobDetail__child__item__content}>
						{parse(detail?.skills || 'kh??ng c??')}
					</div>
				</div>
				<div className={styles.jobDetail__child__item}>
					<div className={styles.jobDetail__child__item__title}>
						<div>
							<Image
								src={benefit}
								alt="SolidBytesJobDescription"
								objectFit="contain"
								width={24}
								height={24}
							/>
						</div>
						<h1>Quy???n l???i</h1>
					</div>
					<div className={styles.jobDetail__child__item__content}>
						{parse(detail?.benefit_description || 'kh??ng c??')}
					</div>
				</div>
				<div className={styles.jobDetail__child__button}>
					<Button
						disabled={Object.keys(userInformationReducerData).length === 0}
						className={styles.jobDetail__child__button__save}
					>
						L??u
					</Button>
					<Button
						onClick={() => setOpenInterview(true)}
						disabled={Object.keys(userInformationReducerData).length === 0}
						type="primary"
						className={styles.jobDetail__child__button__application}
					>
						???ng Tuy???n
					</Button>
				</div>
			</div>
			<BestJobs jobPaging={job} type="job-detail" />
			{openInterview && (
				<ModalInterview handleOpenInterview={handleOpenInterview} openInterview={openInterview} />
			)}
		</section>
	)
}
export default JobDetailComponent
