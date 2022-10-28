import { Button, Input, Tooltip } from 'antd'
import line from 'public/assets/img/Job/line.png'
import top from 'public/assets/img/Job/top.png'
import advertisement from 'public/assets/img/Job/advertisement.png'
import bottom from 'public/assets/img/Job/bottom.png'
import styles from './Job.module.scss'
import { Select } from 'antd'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import PaginationComponent from 'components/Pagination'
import { FilterProps } from 'models/Job'
import ItemJobComponent from './Item'
import { useAppDispatch, useAppSelector } from 'redux/reducers/hooks'
import { ListCommon, ListProps } from 'models/common'
import { getQueryParam, updateUrlGallery } from 'utils/query'
import {
	keyCityReducer,
	keyExperienceReducer,
	keyLevelReducer,
	keySalaryReducer,
	keySearchReducer,
	keyWorkFormReducer,
	setKeyCommon,
} from 'redux/reducers/common'
import { JobPagingPaginationProps, JobPagingProps } from 'models/HomePage'
import homePage from 'services/HomePage'
import { LanguageEnum } from 'constants/language'
import { Pagination, Status, TimeDebounce } from 'constants/enums/Common'
import { notify } from 'utils/notification'
import { Time } from 'constants/time'
import { debounce } from 'utils/utils'
import { FormProps, Level } from 'constants/enums/Job'
const { Option } = Select
const SelectComponent = ({
	placeholder,
	defaultValue,
	handleOnChange,
	list,
}: {
	placeholder: string
	defaultValue: any
	handleOnChange: (value: string) => void
	list: ListProps<string>[]
}) => {
	return (
		<Select
			className={styles.job__content__top__right__select}
			placeholder={placeholder}
			defaultValue={defaultValue}
			onChange={handleOnChange}
		>
			{list?.length > 0 &&
				list.map((values: any) => {
					return (
						<Option key={values.key} value={values?.value || ''}>
							{values?.key || ''}
						</Option>
					)
				})}
		</Select>
	)
}
export const listJob = [
	{
		id: '1',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
	{
		id: '2',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: true,
	},
	{
		id: '3',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: true,
	},
	{
		id: '4',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
	{
		id: '5',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
	{
		id: '6',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
	{
		id: '7',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
	{
		id: '8',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
	{
		id: '9',
		title: 'Senior UI Designer',
		money: '$1500',
		date: '/month',
		des: 'CÔNG TY TNHH QUẢN LÝ XUẤT NHẬP KHẨU VIỆT NAM',
		location: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
		time: 'Cập nhật 3 giờ trước',
		status: false,
		stick: false,
	},
]
const CityComponent = ({
	handleOnchangeCity,
}: {
	handleOnchangeCity: (value: string, type: string) => void
}) => {
	const keyCityReducerData = useAppSelector(keyCityReducer)
	const keyWorkFormReducerData = useAppSelector(keyWorkFormReducer)
	const keySearchReducerData = useAppSelector(keySearchReducer)
	const keyExperienceReducerData = useAppSelector(keyExperienceReducer)
	const keyLevelReducerData = useAppSelector(keyLevelReducer)
	const keySalaryReducerData = useAppSelector(keySalaryReducer)
	const dispatch = useAppDispatch()
	const listAreas: ListCommon<string>[] = [
		{
			id: '1',
			key: 'Thành phố Hà Nội',
			value: 'Thành phố Hà Nội',
		},
		{
			id: '2',
			key: 'Thành phố Đà Nẵng',
			value: 'Thành phố Đà Nẵng',
		},
		{
			id: '3',
			key: 'Thành phố Hồ Chí Minh',
			value: 'Thành phố Hồ Chí Minh',
		},
	]
	return (
		<Select
			placeholder="Chọn thành phố"
			defaultValue={keyCityReducerData}
			className={styles.job__child__search__select__child}
			onChange={(e) => {
				handleOnchangeCity(e, 'city')
				dispatch(
					setKeyCommon({
						keyCity: e,
						keySearch: keySearchReducerData,
						keyWorkForm: keyWorkFormReducerData,
						keyExperience: keyExperienceReducerData,
						keyLevel: keyLevelReducerData,
						keySalary: keySalaryReducerData,
					})
				)
			}}
		>
			{listAreas?.length > 0 &&
				listAreas.map((values) => {
					return (
						<Option key={values.id} value={values.key}>
							{values.key}
						</Option>
					)
				})}
		</Select>
	)
}
export const SearchComponent = ({
	handleOnchangeSearch,
}: {
	handleOnchangeSearch: (e: any, type: string) => void
}) => {
	const dispatch = useAppDispatch()
	const keyCityReducerData = useAppSelector(keyCityReducer)
	const keyWorkFormReducerData = useAppSelector(keyWorkFormReducer)
	const keySearchReducerData = useAppSelector(keySearchReducer)
	const keyExperienceReducerData = useAppSelector(keyExperienceReducer)
	const keyLevelReducerData = useAppSelector(keyLevelReducer)
	const keySalaryReducerData = useAppSelector(keySalaryReducer)
	return (
		<div className={styles.job__child}>
			<div className={styles.job__child__search}>
				<Input
					allowClear
					value={keySearchReducerData}
					onChange={(e) => {
						handleOnchangeSearch(e.target.value, 'search')
						dispatch(
							setKeyCommon({
								keyCity: keyCityReducerData,
								keySearch: e.target.value,
								keyWorkForm: keyWorkFormReducerData,
								keyExperience: keyExperienceReducerData,
								keyLevel: keyLevelReducerData,
								keySalary: keySalaryReducerData,
							})
						)
					}}
					className={styles.job__child__search__input}
					placeholder="Tìm kiếm việc làm, công ty..."
				/>
				<div className={styles.search}>
					<div className={styles.job__child__search__select}>
						{keyCityReducerData && <CityComponent handleOnchangeCity={handleOnchangeSearch} />}
					</div>
					<Button type="primary" className={styles.job__child__search__button}>
						Tìm việc ngay
					</Button>
				</div>
			</div>
		</div>
	)
}
export const PaginationComponentItem = ({
	pagination,
	onChangePagination,
}: {
	pagination: any
	onChangePagination: (pageNumber: number) => void
}) => {
	return (
		<div className={styles.job__content__bottom__job__pagination}>
			<div className={styles.job__content__bottom__job__pagination__item}>
				<span className={styles.job__content__bottom__job__pagination__number}>
					{pagination?.firstItemIndex || Pagination.PAGE}
				</span>
				<span className={styles.job__content__bottom__job__pagination__number}>-</span>
				<span className={styles.job__content__bottom__job__pagination__number}>
					{pagination?.lastItemIndex <= pagination?.totalItems
						? pagination?.lastItemIndex
						: pagination?.totalItems || Pagination.PAGE}
				</span>
				<span className={styles.job__content__bottom__job__pagination__number}>/</span>
				<span className={styles.job__content__bottom__job__pagination__number}>
					{pagination?.totalItems || Pagination.PAGE_EMPTY}
				</span>
				<span className={styles.job__content__bottom__job__pagination__number}>
					Việc làm phù hợp
				</span>
			</div>
			<div className={styles.job__content__bottom__job__pagination__item}>
				<PaginationComponent
					currentPage={pagination?.currentPage || Pagination.PAGE_EMPTY}
					onChangePagination={onChangePagination}
					totalPage={pagination?.totalItems || Pagination.PAGE_EMPTY}
					className={styles.job__content__bottom__job__pagination__item__child}
				/>
			</div>
		</div>
	)
}
const JobComponent = ({ data }: { data: JobPagingPaginationProps }) => {
	const dispatch = useAppDispatch()
	const params: FilterProps = getQueryParam<FilterProps>()
	const salaryData = params?.salary ? params.salary.split(' ') : ''
	const [dataCommon, setDataCommon] = useState<{
		listJob: JobPagingProps<string>[]
		pagination: any
	}>({
		listJob: data?.data || [],
		pagination: data?.meta,
	})
	const listLocation: ListProps<string>[] = [
		{
			key: 'Làm việc từ xa',
			value: FormProps.REMOTE,
		},
		{
			key: 'Làm việc tại công ty',
			value: FormProps.COMPANY,
		},
		{
			key: 'Làm việc toàn thời gian',
			value: FormProps.FULLTIME,
		},
		{
			key: 'Làm việc bán thời gian',
			value: FormProps.PART_TIME,
		},
	]
	const listLevel: ListProps<string>[] = [
		{
			key: 'Project Manager',
			value: Level.PROJECT_MANAGER,
		},
		{
			key: 'Senior',
			value: Level.SENIOR,
		},
		{
			key: 'Middle',
			value: Level.MIDDLE,
		},
		{
			key: 'Junior',
			value: Level.JUNIOR,
		},
		{
			key: 'Fresher',
			value: Level.FRESHER,
		},
		{
			key: 'Intern',
			value: Level.INTERN,
		},
	]
	const gtExperience = '10'
	const experienceList = [
		// {
		// 	id: '1',
		// 	key: 'Kinh nghiệm',
		// 	value: 'all',
		// },
		{
			id: '2',
			key: '1 năm',
			value: '1',
		},
		{
			id: '3',
			key: '2 năm',
			value: '2',
		},
		{
			id: '4',
			key: '3 năm',
			value: '3',
		},
		{
			id: '5',
			key: '4 năm',
			value: '4',
		},
		{
			id: '6',
			key: '5 năm',
			value: '5',
		},
		{
			id: '7',
			key: '6 năm',
			value: '6',
		},
		{
			id: '8',
			key: '7 năm',
			value: '7',
		},
		{
			id: '9',
			key: '8 năm',
			value: '8',
		},
		{
			id: '10',
			key: '9 năm',
			value: '9',
		},
		{
			id: '11',
			key: 'Lớn hơn 10 năm',
			value: '10',
		},
	]
	const lgMoney = '30000000'
	const salaryList = [
		{
			id: '1',
			key: '1 Triệu - 5 Triệu VNĐ',
			value: '1000000 5000000',
		},
		{
			id: '2',
			key: '5 Triệu - 10 Triệu VNĐ',
			value: '5000000 10000000',
		},
		{
			id: '3',
			key: '10 Triệu - 15 Triệu VNĐ',
			value: '10000000 15000000',
		},
		{
			id: '4',
			key: '15 Triệu - 20 Triệu VNĐ',
			value: '15000000 20000000',
		},
		{
			id: '5',
			key: '20 Triệu - 25 Triệu VNĐ',
			value: '20000000 25000000',
		},
		{
			id: '6',
			key: '25 Triệu - 30 Triệu VNĐ',
			value: '25000000 30000000',
		},
		{
			id: '7',
			key: 'Lớn hơn 30 Triệu VNĐ',
			value: '30000000 30000000',
		},
	]
	const advertisementList = [
		{
			id: '1',
			title: 'Junior Game Developer',
			location: 'Q1, HCM',
			money: '$2200',
			date: '/month',
		},
		{
			id: '2',
			title: 'Junior Game Developer',
			location: 'Q1, HCM',
			money: '$2200',
			date: '/month',
		},
	]
	const handleChangeStatusHeart = async (jobUuid: string) => {
		const listTemp = [...dataCommon.listJob]
		const index = listTemp.findIndex((values) => values.uuid === jobUuid)
		try {
			// dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = listTemp[index].isSaved
				? await homePage.deleteUserSaveJob(jobUuid, LanguageEnum.VIETNAMESE_LOCALE)
				: await homePage.postUserSaveJob(
						{
							jobUuid,
						},
						LanguageEnum.VIETNAMESE_LOCALE
				  )
			if (status === Status.SUCCESS) {
				if (index > -1) {
					listTemp[index].isSaved = !listTemp[index].isSaved
					setDataCommon({ ...dataCommon, listJob: [...listTemp] })
				}
				notify('success', data?.message || '', Time.NOTIFY)
			}
			// setTimeout(() => {
			// 	dispatch(setLoading(false))
			// }, Time.LOADING)
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
			// dispatch(setLoading(false))
		}
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleGetAllJob = useCallback(
		debounce(
			async (
				page: number,
				search: string,
				type: string,
				city: string,
				workForm: string,
				experience: string,
				level: string,
				fromMoney: string,
				toMoney: string
			) => {
				try {
					// dispatch(setLoading(true))
					const { status, data }: { status: number; data: any } = await homePage.getAllJobPaging(
						LanguageEnum.VIETNAMESE_LOCALE,
						search,
						city ? `$eq:${city}` : '',
						workForm ? `$eq:${workForm}` : '',
						experience
							? experience === gtExperience
								? `$gt:${experience}`
								: `$eq:${experience}`
							: '',
						level ? `$eq:${level}` : '',
						fromMoney ? `$gte:${fromMoney}` : '',
						toMoney ? (toMoney === lgMoney ? '' : `$lte:${toMoney}`) : '',
						page
					)
					if (status === Status.SUCCESS) {
						type === 'search' && updateUrlGallery('search', search)
						type === 'city' && updateUrlGallery('city', city)
						type === 'level' && updateUrlGallery('level', level)
						type === 'salary' && updateUrlGallery('salary', `${fromMoney || ''} ${toMoney || ''}`)
						type === 'experience' && updateUrlGallery('experience', experience)
						type === 'work_form' && updateUrlGallery('workForm', workForm)
						setDataCommon({
							...dataCommon,
							listJob: data?.data?.data || [],
							pagination: data?.data?.meta,
						})
						// notify('success', data?.message || '', Time.NOTIFY)
					}
					// setTimeout(() => {
					// 	dispatch(setLoading(false))
					// }, Time.LOADING)
				} catch (error: any) {
					notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
					// dispatch(setLoading(false))
				}
			},
			TimeDebounce.TIME
		),
		[]
	)
	const handleChangeSalary = (value: string) => {
		const result = value.split(' ')
		handleGetAllJob(
			Pagination.PAGE,
			params?.search || '',
			'salary',
			params?.city || '',
			params?.workForm || '',
			params?.experience || '',
			params?.level || '',
			result[0],
			result[1]
		)
	}
	const handleChangeWorkForm = (value: string) => {
		handleGetAllJob(
			Pagination.PAGE,
			params?.search || '',
			'work_form',
			params?.city || '',
			value,
			params?.experience || '',
			params?.level || '',
			salaryData?.length > 0 ? salaryData[0] : '',
			salaryData?.length > 0 ? salaryData[1] : ''
		)
	}
	const handleChangeExperience = (value: string) => {
		handleGetAllJob(
			Pagination.PAGE,
			params?.search || '',
			'experience',
			params?.city || '',
			params?.workForm || '',
			value,
			params?.level || '',
			salaryData?.length > 0 ? salaryData[0] : '',
			salaryData?.length > 0 ? salaryData[1] : ''
		)
	}
	const handleChangeLevel = (value: string) => {
		handleGetAllJob(
			Pagination.PAGE,
			params?.search || '',
			'level',
			params?.city || '',
			params?.workForm || '',
			params?.experience || '',
			value,
			salaryData?.length > 0 ? salaryData[0] : '',
			salaryData?.length > 0 ? salaryData[1] : ''
		)
	}
	const onChangePagination = (pageNumber: number) => {
		handleGetAllJob(
			pageNumber,
			params?.search || '',
			'pagination',
			params?.city || '',
			params?.workForm || '',
			params?.experience || '',
			params?.level || '',
			salaryData?.length > 0 ? salaryData[0] : '',
			salaryData?.length > 0 ? salaryData[1] : ''
		)
	}
	const handleOnchangeSearch = (e: string, type: string) => {
		if (type === 'search') {
			handleGetAllJob(
				Pagination.PAGE,
				e,
				type,
				params?.city || '',
				params?.workForm || '',
				params?.experience || '',
				params?.level || '',
				salaryData?.length > 0 ? salaryData[0] : '',
				salaryData?.length > 0 ? salaryData[1] : ''
			)
			// is city
		} else {
			handleGetAllJob(
				Pagination.PAGE,
				params?.search || '',
				type,
				e,
				params?.workForm || '',
				params?.experience || '',
				params?.level || '',
				salaryData?.length > 0 ? salaryData[0] : '',
				salaryData?.length > 0 ? salaryData[1] : ''
			)
		}
	}
	useEffect(() => {
		handleGetAllJob(
			Pagination.PAGE,
			params?.search || '',
			'pagination',
			params?.city || '',
			params?.workForm || '',
			params?.experience || '',
			params?.level || '',
			salaryData?.length > 0 ? salaryData[0] : '',
			salaryData?.length > 0 ? salaryData[1] : ''
		)
		dispatch(
			setKeyCommon({
				keySearch: params?.search || '',
				keyCity: params?.city || '',
				keyWorkForm: params?.workForm || '',
				keyExperience: params?.experience || '',
				keyLevel: params?.level || '',
				keySalary: params?.salary || '',
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [dataCommon?.pagination])
	return (
		<section className={styles.job}>
			<SearchComponent handleOnchangeSearch={handleOnchangeSearch} />
			<div className={styles.job__content}>
				<div className={styles.contentChild}>
					<div className={styles.job__content__top}>
						<div className={styles.job__content__top__left}>
							<div className={styles.job__content__top__left__img}>
								<Image src={line} alt="SolidBytes" objectFit="contain" width={50} height={65} />
							</div>
							<div>
								<p>{`${dataCommon?.listJob?.length || 0} việc làm phù hợp với`}</p>
								<Tooltip
									placement="bottomLeft"
									title={params?.search ? params.search.toUpperCase() : 'TẤT CẢ'}
								>
									<h1 className={styles.job__content__top__left__title}>
										{params?.search ? params.search.toUpperCase() : 'TẤT CẢ'}
									</h1>
								</Tooltip>
							</div>
						</div>
						<div className={styles.job__content__top__right}>
							<SelectComponent
								list={listLocation}
								handleOnChange={handleChangeWorkForm}
								placeholder="Hình thức làm việc"
								defaultValue={params?.workForm || null}
							/>
							<SelectComponent
								list={listLevel}
								handleOnChange={handleChangeLevel}
								placeholder="Cấp bậc"
								defaultValue={params?.level || null}
							/>
							<SelectComponent
								list={experienceList}
								handleOnChange={handleChangeExperience}
								placeholder="Kinh nghiệm"
								defaultValue={params?.experience || null}
							/>
							<SelectComponent
								list={salaryList}
								handleOnChange={handleChangeSalary}
								placeholder="Mức lương"
								defaultValue={params?.salary || null}
							/>
						</div>
					</div>
				</div>
				<div className={styles.job__content__bottom}>
					<div className={styles.job__content__bottom__job}>
						{dataCommon.listJob?.length > 0 ? (
							dataCommon.listJob.map((values) => {
								return (
									<ItemJobComponent
										key={values.uuid}
										values={values}
										handleChangeStatusHeart={handleChangeStatusHeart}
									/>
								)
							})
						) : (
							<h1 className={styles.job__content__bottom__job__empty}>Không có dữ liệu</h1>
						)}
						{dataCommon?.listJob?.length > 0 && (
							<PaginationComponentItem
								onChangePagination={onChangePagination}
								pagination={dataCommon.pagination}
							/>
						)}
					</div>
					<div className={styles.job__content__bottom__advertisement}>
						<div className={styles.job__content__bottom__advertisement__img}>
							<Image
								src={top}
								alt="SolidBytesAdvertisement"
								objectFit="contain"
								width={268}
								height={268}
							/>
						</div>
						<div className={styles.job__content__bottom__advertisement__img}>
							<Image
								src={bottom}
								alt="SolidBytesAdvertisement"
								objectFit="contain"
								width={268}
								height={324}
							/>
						</div>
						<h1 className={styles.job__content__bottom__advertisement__title}>
							Công việc liên quan:
						</h1>
						{advertisementList?.length > 0 &&
							advertisementList.map((values) => {
								return (
									<div key={values.id} className={styles.job__content__bottom__advertisement__item}>
										<div>
											<Image
												src={advertisement}
												alt="SolidBytesAdvertisement"
												objectFit="contain"
												width={178}
												height={72}
											/>
										</div>
										<h1 className={styles.job__content__bottom__advertisement__item__title}>
											{values?.title || ''}
										</h1>
										<p className={styles.job__content__bottom__advertisement__item__location}>
											{values?.location || ''}
										</p>
										<div className={styles.job__content__bottom__advertisement__item__bottom}>
											<div>
												<span>{values?.money || ''}</span>
												{values?.date || ''}
											</div>
											<p>Ứng tuyển</p>
										</div>
									</div>
								)
							})}
					</div>
				</div>
			</div>
		</section>
	)
}
export default JobComponent
