import { Button } from 'antd'
import styles from './FindJobs.module.scss'
import arrow from 'public/assets/img/HomePage/FindJobs/arrow.png'
import Image from 'next/image'
import { memo } from 'react'
const FindJobs = () => {
	return (
		<section className={styles.findJobs}>
			<div className={styles.findJobs__child}>
				<div>
					<h1 className={styles.findJobs__child__title}>
						Tìm kiếm và ứng tuyển công việc nhanh gọn, dễ dàng, mọi lúc mọi nơi
					</h1>
					<p>
						Lựa chọn nghề nghiệp chính xác hơn thông qua các bài trắc nghiệm về tính cách, khả năng
						giải quyết vấn đề, trí thông minh,...
					</p>
				</div>
				<div className={styles.findJobs__child__button}>
					<Button type="primary" className={styles.findJobs__child__button__child}>
						Đăng tin
					</Button>
					<div className={styles.findJobs__child__button__arrow}>
						<Image
							width={104.02}
							height={40.95}
							src={arrow}
							objectFit="contain"
							alt="SolidnytesArrow"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
export default memo(FindJobs)
