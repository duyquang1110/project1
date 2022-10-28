import { Controller, useFormContext } from 'react-hook-form'
import TextErrors from 'components/TextErrors'
import { Checkbox, Col, Row } from 'antd'
const CheckboxListComponent = ({
	name,
	data,
	className,
	col,
}: {
	name: string
	className?: string
	data: any[]
	col: number
}) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<>
						<Checkbox.Group {...field}>
							<Row>
								{data?.length > 0 &&
									data.map((values, index) => {
										return (
											<Col className={className} key={index} span={col}>
												<Checkbox value={values.value}>{values.key}</Checkbox>
											</Col>
										)
									})}
							</Row>
						</Checkbox.Group>
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</>
				)
			}}
		/>
	)
}
export default CheckboxListComponent
