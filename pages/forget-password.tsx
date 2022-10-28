import Header from 'layouts/MainLayout/components/Header'
import SeoCommon from 'components/Seo'
import ForgetPassword from 'layouts/ForgetPassword'
const ForgetPasswordModal = () => {
	return (
		<>
			<SeoCommon title="SolidBytesForgetPassword" />
			<Header />
			<ForgetPassword />
		</>
	)
}
export default ForgetPasswordModal
