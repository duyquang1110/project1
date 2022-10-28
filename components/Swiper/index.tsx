import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { SwiperInterface } from 'models/common'
const SwiperCommon = <T,>(props: SwiperInterface<T>) => {
	const { component: Component, getIndexSwiper } = props
	return (
		<Swiper
			onSlideChange={(values) => getIndexSwiper && getIndexSwiper(values.activeIndex)}
			modules={[Navigation]}
			{...props.slideProps}
		>
			{props.list.map((item, index) => (
				<SwiperSlide key={index}>
					<Component item={item} />
				</SwiperSlide>
			))}
		</Swiper>
	)
}
export default SwiperCommon
