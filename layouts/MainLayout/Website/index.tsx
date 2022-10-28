import { ReactElement, useEffect } from 'react'
import Aos from 'aos'
import FooterComponent from '../components/Footer'
import HeaderComponent from '../components/Header'
const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null
const MainLayout = (props: { children: ReactElement }) => {
	useEffect(() => {
		new WOW({ live: false }).init()
		Aos.init({
			// 1 là duration 2000 thôi
			//duration:2000
			// 2 là dùng cả 4 thuộc tính này
			offset: 200,
			duration: 600,
			easing: 'ease-in-sine',
			delay: 100,
			// disable: 'mobile'
			//  disable: window.innerWidth < 1024
			//  disable: function () {
			// var maxWidth = 1024;
			// return window.innerWidth < maxWidth;
			// startEvent: 'someCoolEvent'
			//}
		})
	}, [])
	return (
		<>
			<HeaderComponent />
			<main>{props.children}</main>
			<FooterComponent />
		</>
	)
}
export default MainLayout
