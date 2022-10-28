import { Input, Select, Button, Popover } from 'antd'
import { Breakpoint, Status, TimeDebounce } from 'constants/enums/Common'
import { LanguageEnum } from 'constants/language'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { Time } from 'constants/time'
import ItemJobComponent from 'layouts/Job/Item'
import { ListCommon } from 'models/common'
import { HashtagProps, JobPagingProps, StatisticalProps } from 'models/HomePage'
import { useRouter } from 'next/router'
import { memo, useCallback, useEffect, useState } from 'react'
import { keyCityReducer, keySearchReducer, setKeyCommon } from 'redux/reducers/common'
import { useAppDispatch, useAppSelector } from 'redux/reducers/hooks'
import homePage from 'services/HomePage'
import useMedia from 'use-media'
import { notify } from 'utils/notification'
import { debounce } from 'utils/utils'
import styles from './Banner.module.scss'
const HashtagComponent = ({ hashtag }: { hashtag: HashtagProps<string>[] }) => {
	return (
		<div className={styles.banner__child__tag}>
			<span className={styles.banner__child__tag__search}>Tìm kiếm hàng đầu:</span>
			{hashtag?.length > 0 &&
				hashtag.reverse().map((values) => {
					return (
						<span key={values.uuid} className={styles.banner__child__tag__position}>
							{values?.name || ''}
						</span>
					)
				})}
		</div>
	)
}
const HashtagComponentHOC = memo(HashtagComponent)
const BannerComponent = ({
	statistical,
	hashtag,
}: {
	statistical: StatisticalProps
	hashtag: HashtagProps<string>[]
}) => {
	const { Option } = Select
	const dispatch = useAppDispatch()
	const router = useRouter()
	const keySearchData = useAppSelector(keySearchReducer)
	const keyCityData = useAppSelector(keyCityReducer)
	const haNoiCity = 'Thành phố Hà Nội'
	const [dataCommon, setDataCommon] = useState<{
		cityFilter: string
		listJobPaging: JobPagingProps<string>[]
	}>({
		cityFilter: haNoiCity,
		listJobPaging: [],
	})
	const isMobile = useMedia({ maxWidth: Breakpoint.SDPhone })
	const handleChange = (value: string) => {
		dispatch(
			setKeyCommon({
				keyCity: value,
				keySearch: '',
				keyWorkForm: '',
				keyExperience: '',
				keyLevel: '',
				keySalary: '',
			})
		)
		setDataCommon({ ...dataCommon, cityFilter: value, listJobPaging: [] })
	}
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleOnchangeSearch = useCallback(
		debounce(async (e: any) => {
			const { value } = e.target
			if (value) {
				try {
					// dispatch(setLoading(true))
					const { status, data }: { status: number; data: any } = await homePage.getAllJobPaging(
						LanguageEnum.VIETNAMESE_LOCALE,
						value,
						`$eq:${dataCommon.cityFilter}`,
						'',
						'',
						'',
						'',
						''
					)
					if (status === Status.SUCCESS) {
						setDataCommon({ ...dataCommon, listJobPaging: data?.data?.data || [] })
						// notify('success', data?.message || '', Time.NOTIFY)
					}
					// setTimeout(() => {
					// 	dispatch(setLoading(false))
					// }, Time.LOADING)
				} catch (error: any) {
					notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
					// dispatch(setLoading(false))
				}
			} else {
				setDataCommon({ ...dataCommon, listJobPaging: [] })
			}
		}, TimeDebounce.TIME),
		[dataCommon]
	)
	const handleChangeStatusHeart = async (jobUuid: string) => {
		const listTemp = [...dataCommon.listJobPaging]
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
					setDataCommon({ ...dataCommon, listJobPaging: [...listTemp] })
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
	const content = (
		<div
			className={`${styles.contentSearch} ${
				dataCommon.listJobPaging?.length === 0 ? styles.contentSearchEmpty : ''
			}`}
		>
			{dataCommon.listJobPaging?.length > 0 ? (
				dataCommon.listJobPaging.map((values) => {
					return (
						<ItemJobComponent
							key={values.uuid}
							values={values}
							handleChangeStatusHeart={handleChangeStatusHeart}
						/>
					)
				})
			) : (
				<h1>Chưa có dữ liệu</h1>
			)}
		</div>
	)
	useEffect(() => {
		if (!keySearchData) {
			setDataCommon({ ...dataCommon, listJobPaging: [] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keySearchData])
	return (
		<section className={styles.banner}>
			<div className={styles.banner__child}>
				<h1 className={styles.banner__child__title}>
					Tìm kiếm công việc
					<span> MƠ ƯỚC </span>
					của bạn
				</h1>
				<p className={styles.banner__child__des}>{`${statistical?.count_job || 0} việc làm & ${
					statistical?.count_cv || 0
				} ứng viên đang đăng ký`}</p>
				<div className={styles.banner__child__information}>
					<Popover
						trigger="click"
						placement={isMobile ? undefined : 'bottomLeft'}
						content={content}
					>
						<Input
							allowClear
							value={keySearchData}
							onChange={(e) => {
								handleOnchangeSearch(e)
								dispatch(
									setKeyCommon({
										keyCity: keyCityData,
										keySearch: e.target.value,
										keyWorkForm: '',
										keyExperience: '',
										keyLevel: '',
										keySalary: '',
									})
								)
							}}
							className={styles.banner__child__information__input}
							placeholder="Tìm kiếm việc làm, công ty..."
						/>
					</Popover>
					<div className={styles.banner__child__information__filter}>
						<Select
							placeholder="Chọn thành phố"
							defaultValue={listAreas?.length > 0 ? listAreas[0].key : haNoiCity}
							className={styles.banner__child__information__filter__select}
							onChange={handleChange}
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
						<Button
							onClick={() => {
								router.push({
									pathname: WebsiteRoutesRedirect.job,
									query: { search: keySearchData, city: keyCityData || haNoiCity },
								})
							}}
							className={styles.banner__child__information__filter__button}
							type="primary"
						>
							Tìm việc ngay
						</Button>
					</div>
				</div>
				<HashtagComponentHOC hashtag={hashtag?.length > 0 ? hashtag.reverse() : []} />
			</div>
		</section>
	)
}
export default memo(BannerComponent)
