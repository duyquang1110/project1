import Header from 'layouts/MainLayout/components/Header'
import SeoCommon from 'components/Seo'
import NewPassword from 'layouts/NewPassword'
const NewPasswordModal = () => {
	return (
		<>
			<SeoCommon title="SolidBytesForgetPassword" />
			<Header />
			<NewPassword />
		</>
	)
}
export default NewPasswordModal
