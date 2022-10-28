import { Table } from 'antd'
import styles from './Table.module.scss'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { memo } from 'react'
import { useTranslations } from 'next-intl'
const TableComponent = ({
	columns,
	data,
	handleTableChange,
	pagination,
	loading,
}: {
	columns: ColumnsType<any>
	data: any[]
	handleTableChange: (newPagination: TablePaginationConfig) => void
	pagination: TablePaginationConfig
	loading?: boolean
}) => {
	const t = useTranslations()
	return (
		<Table
			rowKey={(record: any) => record.key}
			columns={columns}
			loading={loading}
			bordered
			dataSource={data}
			scroll={{ x: 1100 }}
			onChange={handleTableChange}
			// pagination={{
			// 	...pagination,
			// 	pageSizeOptions: [10, 30, 50, 100],
			// 	showSizeChanger: true,
			// 	// onChange: onChangePage,
			// 	// defaultPageSize: 30,
			// 	// defaultCurrent: 30,
			// 	showTotal: (total: number, range: any) => {
			// 		return data?.length > 0 ? (
			// 			<b>{`${t('menu-total')}: ${total} (${t('menu-show')}: ${range[0]}-${range[1]})`}</b>
			// 		) : (
			// 			''
			// 		)
			// 	},
			// }}
			// pagination={{
			// 	pageSize: pagination.pageSize,
			// 	showSizeChanger: true,
			// 	// defaultPageSize: 30,
			// 	// defaultCurrent: 30,
			// 	// current: 30,
			// 	// position: ['bottomRight'],
			// 	total,
			// 	// onChange: onChangePage,
			// 	/* @ts-ignore */
			// 	pageSizeOptions: [10, 30, 50, 100],
			// 	// showQuickJumper: true,
			// 	// showTotal: (total: number, range: any) => {
			// 	// 	return (
			// 	// 		<span className="gFontSize">
			// 	// 			123 {2}
			// 	// 			456
			// 	// 		</span>
			// 	// 	)
			// 	// },
			// }}
			// onChange={(pagination) => onTableChange(pagination)}
			className={styles.table}
		/>
	)
}
export default memo(TableComponent)
