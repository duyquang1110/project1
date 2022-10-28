import Header from 'layouts/MainLayout/components/Header'
import SeoCommon from 'components/Seo'
import ConfirmComponent from 'layouts/Confirm'
const ConfirmModal = () => {
	return (
		<>
			<SeoCommon title="SolidBytesConfirm" />
			<Header />
			<ConfirmComponent />
		</>
	)
}
export default ConfirmModal
