import Image from 'next/image'
import styles from './Career.module.scss'
import career from 'public/assets/img/HomePage/Career/title.png'
import item from 'public/assets/img/HomePage/Career/item.png'
import { Button } from 'antd'
import { memo } from 'react'
import { CompanyPagingProps } from 'models/HomePage'
import { API } from 'constants/enums/Common'
const Career = ({companyPaging}: {companyPaging: CompanyPagingProps<string>[]}) => {
	const careerList = [
		{
			id: '1',
			title: 'Tạo CV online ấn tượng',
			button: ' Tạo CV ngay',
			des: '50+ mẫu CV chuyên nghiệp, độc đáo phù hợp với mọi ngành nghề và từng lĩnh vực. Dễ dàng tiếp cận thông qua các công cụ hữu ích',
		},
		{
			id: '2',
			title: 'Sử dụng CV sẵn có để tìm việc',
			button: ' Upload CV ngay',
			des: 'Cách đơn giản để bắt đầu tìm việc làm tại website, Nhà tuyển dụng sẽ nhìn thấy CV bạn đã tải lên',
		},
		{
			id: '3',
			title: 'Tra cứu thông tin sự nghiệp',
			button: 'Đăng tin',
			des: 'Cung cấp cho sinh viên thông tin về thị trường tuyển dụng và đào tạo kỹ năng ứng tuyển, kết nối Nhà trường và Doanh nghiệp',
		},
	]
	return (
		<section className={styles.career}>
			<div className={styles.career__child}>
				<div className={styles.career__child__img}>
					<Image src={career} alt="SolidBytesCareer" objectFit="contain" width={531} height={62} />
				</div>
				<div className={styles.career__child__parent}>
					{careerList?.length > 0 &&
						careerList.map((values) => {
							return (
								<div key={values.id} className={styles.career__child__parent__item}>
									<Image
										src={item}
										alt="SolidBytesCareer"
										objectFit="contain"
										width={145}
										height={87.97}
									/>
									<h1>{values.title}</h1>
									<p>{values.des}</p>
									<div className={styles.career__child__parent__item__button}>
										<Button
											type="primary"
											className={styles.career__child__parent__item__button__child}
										>
											{values.button}
										</Button>
									</div>
								</div>
							)
						})}
				</div>
				<div className={styles.career__child__company}>
					{
						companyPaging?.length > 0 && companyPaging?.map((values) => {
							return (
								<Image
								key={values?.uuid}
								src={`${API.IMAGE}${values?.logo || ''}`}
								alt="SolidBytesCompany"
								objectFit="contain"
								width={140}
								height={52}
							/>
							)
						})
					}
				</div>
			</div>
		</section>
	)
}
export default memo(Career)
