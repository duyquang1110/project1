import SeoCommon from 'components/Seo'
import { apiGet } from 'config/api'
import { Pagination } from 'constants/enums/Common'
import { ApiRoutesRedirect } from 'constants/routes'
import { getCookies } from 'cookies-next'
import JobComponent from 'layouts/Job'
import MainLayout from 'layouts/MainLayout/Website'
import { JobPagingPaginationProps } from 'models/HomePage'
const Job = ({ data }: { data: JobPagingPaginationProps }) => {
	return (
		<>
			<SeoCommon title="SolidBytesJob" />
			<MainLayout>
				<JobComponent data={data} />
			</MainLayout>
		</>
	)
}
export async function getServerSideProps({
	locale,
	query,
	req,
	res,
}: {
	locale: string
	query: {
		search: string
		city: string
	}
	req: any
	res: any
}) {
	const userInformationJobSeeker: any = getCookies({ req, res })?.userInformationJobSeeker || {}
	const { search, city } = query
	const respon = await apiGet({
		url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.jobPaging}?lang=${locale}&page=${
			Pagination.PAGE
		}&limit=${Pagination.LIMIT}&search=${search ? search : ''}&filter.areas.name=$eq:${encodeURI(
			city
		)}`,
		token:
			Object.keys(userInformationJobSeeker).length > 0
				? JSON.parse(userInformationJobSeeker).access_token
				: '',
	})
	return {
		props: {
			data: respon?.data?.data,
		},
	}
}
export default Job
