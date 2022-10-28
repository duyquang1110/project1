import SeoCommon from 'components/Seo'
import { ApiRoutesRedirect } from 'constants/routes'
import type { GetStaticPropsContext } from 'next'
import HomePage from 'layouts/HomePage'
import MainLayout from 'layouts/MainLayout/Website'
import { apiGet } from 'config/api'
import { HomePageProps } from 'models/HomePage'
import { Pagination } from 'constants/enums/Common'
const Home = ({ data }: { data: HomePageProps }) => {
	return (
		<>
			<SeoCommon title="SolidBytesHomePage" />
			<MainLayout>
				<HomePage data={data} />
			</MainLayout>
		</>
	)
}
export async function getServerSideProps({
	locale,
}: {
	locale: GetStaticPropsContext
}) {
	const listRespon = await Promise.all([
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.statistical}?lang=${locale}`,
		}),
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.hashtag}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT_TABLE}`,
		}),
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.jobPaging}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT}`,
		}),
		apiGet({
			url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.companyPaging}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT_TABLE}`,
		}),
	]).then((values) => {
		return values
	})
	return {
		props: {
			data: {
				statistical: listRespon[0]?.data?.data,
				hashtag: listRespon[1]?.data?.data?.data,
				jobPaging: listRespon[2]?.data?.data,
				companyPaging: listRespon[3]?.data?.data,
			},
		},
	}
}
export default Home
