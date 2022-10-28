import React from 'react'
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'
const ExcelComponent = ({
	fileName,
	csvData,
	className,
}: {
	fileName: string
	csvData: any
	className: string
}) => {
	const t = useTranslations()
	const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
	const fileExtension = '.xlsx'
	const exportToCSV = (csvData: any, fileName: string) => {
		const ws = XLSX.utils.json_to_sheet(csvData)
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
		const data = new Blob([excelBuffer], { type: fileType })
		fileSaver.saveAs(data, fileName + fileExtension)
	}

	return (
		<Button type="primary" className={className} onClick={() => exportToCSV(csvData, fileName)}>
			{t('menu-excel')}
		</Button>
	)
}
export default ExcelComponent
