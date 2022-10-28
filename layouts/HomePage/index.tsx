import { HomePageProps } from 'models/HomePage'
import BannerComponent from './Banner'
import BestJobs from './BestJobs'
import Career from './Career'
import FindJobs from './FindJobs'
const HomePage = ({ data }: { data: HomePageProps }) => {
	return (
		<>
			<BannerComponent hashtag={data?.hashtag || []} statistical={data?.statistical} />
			<BestJobs jobPaging={data?.jobPaging} type="home" />
			<FindJobs />
			<Career companyPaging={data?.companyPaging?.data} />
		</>
	)
}
export default HomePage
