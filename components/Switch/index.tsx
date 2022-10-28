import TextErrors from 'components/TextErrors'
import { memo } from 'react'
import { Switch } from 'antd'
import { Controller, useFormContext } from 'react-hook-form'
const SwitchComponent = ({ name }: { name: string }) => {
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
						<Switch defaultChecked={field.value} {...field} />
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</>
				)
			}}
		/>
	)
}
export default memo(SwitchComponent)
