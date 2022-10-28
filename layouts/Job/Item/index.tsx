import heart from 'public/assets/img/Job/heart.png'
import stick from 'public/assets/img/Job/stick.png'
import heartClicked from 'public/assets/img/Job/heartClicked.png'
import Image from 'next/image'
import styles from './../Job.module.scss'
import { menuType } from 'layouts/Account'
import { API } from 'constants/enums/Common'
import { JobPagingProps } from 'models/HomePage'
import { formatDate, formatMoneyCustom } from 'utils/format'
import { DateFormat } from 'constants/time'
import Link from 'next/link'
import { WebsiteRoutesRedirect } from 'constants/routes'
import { useAppSelector } from 'redux/reducers/hooks'
import { userInformationReducer } from 'redux/reducers/common'
import { JobProfileActionStatus } from 'constants/enums/Admin/Account'
const ItemJobComponent = ({
	values,
	type,
	status,
	handleChangeStatusHeart,
}: {
	values: JobPagingProps<string>
	status?: string
	type?: string
	handleChangeStatusHeart: (jobUuid: string) => void
}) => {
	const userInformationReducerData = useAppSelector(userInformationReducer)
	const indexStringTP = 10
	return (
		<div
			className={`${styles.job__content__bottom__job__item} ${
				type === menuType.saved || type === menuType.applied
					? styles.job__content__bottom__job__itemSaved
					: ''
			}`}
		>
			<div className={styles.job__content__bottom__job__item__img}>
				<Link href={`${WebsiteRoutesRedirect.jobDetail}/${values.uuid}`} passHref>
					<a target="_blank">
						<Image
							src={`${API.IMAGE}${values?.user?.company?.logo || ''}`}
							alt="SolidBytesJobs"
							objectFit="contain"
							width={178}
							height={72}
						/>
					</a>
				</Link>
			</div>
			<div className={styles.content}>
				<div className={styles.job__content__bottom__job__item__content}>
					<Link href={`${WebsiteRoutesRedirect.jobDetail}/${values.uuid}`} passHref>
						<a target="_blank">
							<div className={styles.job__content__bottom__job__item__content__title}>
								<h1>{values?.title || ''}</h1>
								<div>
									<span className={styles.job__content__bottom__job__item__content__title__money}>
										{`${formatMoneyCustom(values?.salary?.from) || '0'}${
											values?.salary?.type_currency
										}-${formatMoneyCustom(values?.salary?.to) || '0'}${
											values?.salary?.type_currency
										}/`}
									</span>
									{values?.periodic?.toLowerCase() || 'month'}
								</div>
							</div>
							<p className={styles.job__content__bottom__job__item__content__des}>
								{values?.user?.company?.name || 'ABC'}
							</p>
							<div className={styles.job__content__bottom__job__item__content__tag}>
								{values?.areas?.length > 0 &&
									values.areas.map((values, index) => {
										return (
											<span
												className={styles.job__content__bottom__job__item__content__tag__item}
												key={index}
											>
												{values?.name.slice(indexStringTP) || 'HCM'}
											</span>
										)
									})}
								<span className={styles.job__content__bottom__job__item__content__tag__time}>
									{values?.updatedAt
										? `Cập nhật ${formatDate(values?.updatedAt, DateFormat.VI_TIME)}`
										: 'Cập nhật 0h trước'}
								</span>
								{type === menuType.saved ? (
									values.isExpired ? (
										<span className={styles.job__content__bottom__job__item__content__tag__expire}>
											Đã hết hạn
										</span>
									) : (
										''
									)
								) : status ? (
									<span className={styles.job__content__bottom__job__item__content__tag__expire}>
										{(() => {
											switch (status.toUpperCase()) {
												case JobProfileActionStatus.SUBMITTED: {
													return 'Đã nộp'
												}
												case JobProfileActionStatus.WAITING_INTERVIEW: {
													return 'Chờ phỏng vấn'
												}
												case JobProfileActionStatus.REJECT: {
													return 'Từ chối'
												}
												case JobProfileActionStatus.SAVE: {
													return 'Đã lưu'
												}
												default:
													return 'Đã xem'
											}
										})()}
									</span>
								) : (
									''
								)}
							</div>
						</a>
					</Link>
				</div>
				<div
					className={`${styles.job__content__bottom__job__item__heart} ${
						values.status ? styles.job__content__bottom__job__item__heartActive : ''
					}`}
				>
					{/* <Image
						onClick={() => handleCheckLogin(values?.uuid || '-1')}
						src={heart}
						alt="SolidBytesHeart"
						width={34}
						height={34}
						objectFit="contain"
					/> */}
					{Object.keys(userInformationReducerData).length > 0 ? (
						values.isSaved || menuType.saved === type ? (
							<Image
								onClick={() => handleChangeStatusHeart(values?.uuid || '-1')}
								src={heartClicked}
								alt="SolidBytesHeart"
								width={34}
								height={34}
								objectFit="contain"
							/>
						) : (
							<Image
								onClick={() => handleChangeStatusHeart(values?.uuid || '-1')}
								src={heart}
								alt="SolidBytesHeart"
								width={34}
								height={34}
								objectFit="contain"
							/>
						)
					) : (
						''
					)}
					{type === menuType.applied && (
						<div className={styles.job__content__bottom__job__item__heart__stick}>
							<Image src={stick} alt="SolidBytesHeart" width={34} height={34} objectFit="contain" />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
export default ItemJobComponent
