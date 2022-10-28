import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from 'config/configureStore'
import SeoCommon from 'components/Seo'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/antd.css'
import 'aos/dist/aos.css'
import 'swiper/css/bundle'
import 'styles/reset.scss'
import { NextIntlProvider } from 'next-intl'
import { useEffect, useState } from 'react'
import Loading from 'components/Loading'
import { wrapper } from 'redux/reducers/common'
function App({ Component, pageProps }: AppProps) {
	const [showChild, setShowChild] = useState<boolean>(false)
	useEffect(() => {
		setShowChild(true)
	}, [])

	if (!showChild) {
		return null
	}

	if (typeof window === 'undefined') {
		return <></>
	} else {
		return (
			<>
				<SeoCommon title="Web Dashboard" />
				<meta
					name="viewport"
					content="initial-scale=1.0,width=device-width,maximum-scale=1, user-scalable=0"
				/>
				<Provider store={store}>
					<NextIntlProvider
						// To achieve consistent date, time and number formatting
						// across the app, you can define a set of global formats.
						formats={{
							dateTime: {
								short: {
									day: 'numeric',
									month: 'short',
									year: 'numeric',
								},
							},
						}}
						messages={pageProps.messages}
						// Providing an explicit value for `now` ensures consistent formatting of
						// relative values regardless of the server or client environment.
						now={new Date(pageProps.now)}
						// Also an explicit time zone is helpful to ensure dates render the
						// same way on the client as on the server, which might be located
						// in a different time zone.
						timeZone="Asia/Ho_Chi_Minh"
					>
						<Component {...pageProps} />
						<Loading />
					</NextIntlProvider>
					<ToastContainer />
				</Provider>
			</>
		)
	}
}
export default wrapper.withRedux(App)
