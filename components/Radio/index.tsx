import TextErrors from 'components/TextErrors'
import { memo } from 'react'
import { Radio } from 'antd'
import { Controller, useFormContext } from 'react-hook-form'
import { ListProps } from 'models/common'
const RadioComponent = ({ name, data }: { name: string; data: ListProps<string>[] }) => {
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
						<Radio.Group {...field}>
							{data?.length > 0 &&
								data.map((values, index) => {
									return (
										<Radio key={index} value={values.value}>
											{values.key}
										</Radio>
									)
								})}
						</Radio.Group>
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</>
				)
			}}
		/>
	)
}
export default memo(RadioComponent)
