import styles from './BestJobs.module.scss'
import title from 'public/assets/img/HomePage/BestJobs/title.png'
import Image from 'next/image'
import related from 'public/assets/img/Detail/related.png'
import { memo, useState } from 'react'
import { Button, Tooltip } from 'antd'
import Link from 'next/link'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { ListCommon } from 'models/common'
import homePage from 'services/HomePage'
import { LanguageEnum } from 'constants/language'
import { API, Pagination, Status } from 'constants/enums/Common'
import { notify } from 'utils/notification'
import { Time } from 'constants/time'
import { JobPagingPaginationProps, JobPagingProps } from 'models/HomePage'
import { formatMoneyCustom } from 'utils/format'
const ItemComponent = ({ values }: { values: JobPagingProps<string> }) => {
	return (
		<div className={styles.bestJobs__item__child}>
			<Image
				width={178}
				height={72}
				src={`${API.IMAGE}${values?.user?.company?.logo || ''}`}
				alt="SolidBytesBestJobs"
				objectFit="contain"
			/>
			<h1>{values?.title || ''}</h1>
			<p className={styles.bestJobs__item__child__address}>{values?.address || ''}</p>
			<div className={styles.bestJobs__item__child__button}>
				<Tooltip
					placement="bottom"
					title={
						<>
							{`${formatMoneyCustom(values?.salary?.from) || '0'}${values?.salary?.type_currency}-${
								formatMoneyCustom(values?.salary?.to) || '0'
							}${values?.salary?.type_currency}/`}
							<span>{`${values?.periodic?.toLowerCase() || 'month'}`}</span>
						</>
					}
				>
					<p className={styles.bestJobs__item__child__button__money}>
						{`${formatMoneyCustom(values?.salary?.from) || '0'}${values?.salary?.type_currency}-${
							formatMoneyCustom(values?.salary?.to) || '0'
						}${values?.salary?.type_currency}/`}
						<span>{`${values?.periodic?.toLowerCase() || 'month'}`}</span>
					</p>
				</Tooltip>

				<Link href={`${WebsiteRoutesRedirect.jobDetail}/${values?.uuid || '-1'}`} passHref>
					<a className={styles.bestJobs__item__child__button__application} target="_blank">
						<p>Ứng tuyển</p>
					</a>
				</Link>
			</div>
		</div>
	)
}
const BestJobs = ({ type, jobPaging }: { type: string; jobPaging: JobPagingPaginationProps }) => {
	const [indexClickedLocation, setIndexClickedLocation] = useState<number>(0)
	const [jobPagingData, setJobPagingData] = useState<any>(jobPaging)
	const listAreas: ListCommon<string>[] = [
		{
			id: '4',
			key: 'Tất cả',
			value: '',
		},
		{
			id: '1',
			key: 'TP. Hà Nội',
			value: 'Thành phố Hà Nội',
		},
		{
			id: '2',
			key: 'TP. Đà Nẵng',
			value: 'Thành phố Đà Nẵng',
		},
		{
			id: '3',
			key: 'TP. Hồ Chí Minh',
			value: 'Thành phố Hồ Chí Minh',
		},
	]
	const handleGetAllJob = async (value: string, page: number, type: string) => {
		try {
			// dispatch(setLoading(true))
			const { status, data }: { status: number; data: any } = await homePage.getAllJobPaging(
				LanguageEnum.VIETNAMESE_LOCALE,
				'',
				value ? `$eq:${value}` : '',
				'',
				'',
				'',
				'',
				'',
				page,
			)
			if (status === Status.SUCCESS) {
				if (type === 'newPage') {
					const listTotal = jobPagingData?.data.concat(data?.data?.data)
					setJobPagingData({ ...data?.data, data: [...listTotal] })
				} else {
					setJobPagingData(data?.data)
				}
				// notify('success', data?.message || '', Time.NOTIFY)
			}
			// setTimeout(() => {
			// 	dispatch(setLoading(false))
			// }, Time.LOADING)
		} catch (error: any) {
			notify('warning', error?.response?.data?.message || 'Lỗi', Time.NOTIFY)
			// dispatch(setLoading(false))
		}
	}
	return (
		<section className={`${styles.bestJobs} ${type !== 'home' ? styles.bestJobsDetail : ''}`}>
			<div className={styles.bestJobs__child}>
				<div className={styles.bestJobs__child__left}>
					<Image
						width={280}
						height={62}
						src={type === 'home' ? title : related}
						alt="SolidBytesBestJobs"
						objectFit="contain"
					/>
				</div>
				{type === 'home' && (
					<div className={styles.bestJobs__child__right}>
						{listAreas?.length > 0 &&
							listAreas.map((values, index) => {
								return (
									<span
										onClick={() => {
											handleGetAllJob(values?.value, Pagination.PAGE, 'tab')
											setIndexClickedLocation(index)
										}}
										className={
											indexClickedLocation === index
												? styles.bestJobs__child__right__active
												: styles.bestJobs__child__right__deactive
										}
										key={values?.id}
									>
										{values?.key || ''}
									</span>
								)
							})}
					</div>
				)}
			</div>
			<div className={styles.bestJobs__item}>
				{jobPagingData?.data?.length > 0 ? (
					// indexClickedLocation === 0 &&
					jobPagingData.data.map((values: JobPagingProps<string>) => {
						return <ItemComponent values={values} key={values?.uuid} />
					})
				) : (
					<h1 className={styles.bestJobs__item__empty}>Không có việc làm</h1>
				)}
			</div>
			{type === 'home' && jobPagingData?.data?.length > 0 && (
				<div className={styles.bestJobs__button}>
					<Button
						disabled={jobPagingData?.meta?.currentPage >= jobPagingData?.meta?.totalPages}
						type="primary"
						onClick={() =>
							handleGetAllJob(
								'',
								jobPagingData?.meta?.currentPage + Pagination.PAGE || Pagination.PAGE,
								'newPage'
							)
						}
						className={styles.bestJobs__button__child}
					>
						Xem thêm
					</Button>
				</div>
			)}
		</section>
	)
}
export default memo(BestJobs)
