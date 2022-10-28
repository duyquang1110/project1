import SeoCommon from 'components/Seo'
import JobDetailComponent from 'layouts/Job/Detail'
import type { GetStaticPropsContext } from 'next'
import MainLayout from 'layouts/MainLayout/Website'
import type { NextPage } from 'next'
import { Pagination } from 'constants/enums/Common'
import { ApiRoutesRedirect } from 'constants/routes'
import { apiGet } from 'config/api'
const JobDetail: NextPage = (data: any) => {
	return (
		<>
			<SeoCommon title="SolidBytesJobDetail" />
			<MainLayout>
				<JobDetailComponent job={data?.object?.job} detail={data?.object?.detail} />
			</MainLayout>
		</>
	)
}
export async function getStaticPaths({ locales }: { locales: string[] }) {
	const vi = 0
	const res: any = await fetch(
		`${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.jobDetail}?lang=${locales[vi]}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT}`
	)
	const data = await res.json()
	const paths =
		data?.data?.length ?
		data.data.map((values: any) => {
			return {
				params: {
					id: values.uuid,
				},
			}
		}) : []

	return {
		paths,
		//   fallback: true,
		fallback: false,
	}
}
export async function getStaticProps({
	locale,
	params,
}: {
	locale: GetStaticPropsContext
	params: any
}) {
	const { id } = params
	if (!id) {
		return { notFound: true }
	}
	const respon: any = await fetch(
		`${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.jobDetail}/${id}?lang=${locale}`
	)
	const product = await respon.json()
	if (Object.keys(product?.data || {}).length === 0 || !product || !product?.data) {
		return { notFound: true }
	}
	const resJobPaging = await apiGet({
		url: `${process.env.NEXT_PUBLIC_API}${ApiRoutesRedirect.jobPaging}?lang=${locale}&page=${Pagination.PAGE}&limit=${Pagination.LIMIT}`,
	})
	return {
		props: {
			object: {
				detail: product?.data,
				job: resJobPaging?.data?.data,
			},
		},
		revalidate: 10,
	}
}
export default JobDetail
