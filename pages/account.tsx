import SeoCommon from 'components/Seo'
import { apiGet } from 'config/api'
import { Pagination } from 'constants/enums/Common'
import { ApiRoutesRedirect, WebsiteRoutesRedirect } from 'constants/routes'
import { deleteCookie, getCookies } from 'cookies-next'
import AccountComponent from 'layouts/Account'
import MainLayout from 'layouts/MainLayout/Website'
import { AdminProps } from 'models/Admin/Account'
const Account = ({ object }: { object: AdminProps }) => {
	return (
		<>
			<SeoCommon title="SolidBytesAccount" />
			<MainLayout>
				<AccountComponent object={object} />
			</MainLayout>
		</>
	)
}
export async function getServerSideProps({
	locale,
	req,
	res,
}: {
	locale: string
	req: any
	res: any
}) {
	const userInformationJobSeeker: any = getCookies({ req, res })?.userInformationJobSeeker || {}
	if (Object.keys(userInformationJobSeeker).length === 0) {
		return {
			redirect: {
				destination: WebsiteRoutesRedirect.homePage,
				permanent: false,
			},
		}
	}
	const listRespon: any = await Promise.all([
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.userSubmittedJobs}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT}`,
			token: JSON.parse(userInformationJobSeeker).access_token,
		}),
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.userSaveJob}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT}`,
			token: JSON.parse(userInformationJobSeeker).access_token,
		}),
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.profileAbout}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT}`,
			token: JSON.parse(userInformationJobSeeker).access_token,
		}),
	])
		.then((values) => {
			return values
		})
		.catch(() => {
			deleteCookie('userInformationJobSeeker', { req, res })
			return {
				redirect: {
					destination: WebsiteRoutesRedirect.homePage,
					permanent: false,
				},
			}
		})
	if (listRespon?.length === 0) {
		deleteCookie('userInformationJobSeeker', { req, res })
		return {
			redirect: {
				destination: WebsiteRoutesRedirect.homePage,
				permanent: false,
			},
		}
	}
	return {
		props: {
			object: {
				listSubmitted: listRespon[0]?.data?.data || {},
				listSaved: listRespon[1]?.data?.data || {},
				cvDetail: listRespon[2]?.data?.data || {},
			},
		},
	}
}
export default Account
