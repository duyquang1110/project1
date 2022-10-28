import { Pagination } from 'antd'
const PaginationComponent = ({
	className,
	totalPage,
	currentPage,
	onChangePagination,
}: {
	className: string
	currentPage: number
	totalPage: number
	onChangePagination: (pageNumber: number) => void
}) => {
	return (
		<Pagination
			total={totalPage}
			onChange={onChangePagination}
			className={className}
			// showTotal={(total) => `Total ${total} items`}
			defaultPageSize={10}
			current={currentPage}
		/>
	)
}
export default PaginationComponent
