import React, { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
const Barchart = ({
	width,
	height,
	barSize,
	className,
	colorEmpty,
	colorReality,
	colorGuess,
	data,
	nameGuess,
	nameReality,
}: {
	width: number
	height: number
	barSize: number
	className: string
	colorEmpty: string
	colorReality: string
	colorGuess: string
	data: any[]
	nameGuess: string
	nameReality: string
}) => {
	return (
		<BarChart className={className} width={width} height={height} data={data} barSize={barSize}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" padding={{ left: 5, right: 5 }} />
			<YAxis />
			<Tooltip />
			<Bar
				dataKey={nameReality}
				stackId="a"
				background={{ fill: colorEmpty }}
				fill={colorReality}
			/>
			<Bar dataKey={nameGuess} stackId="a" fill={colorGuess} />
		</BarChart>
	)
}
export default memo(Barchart)
