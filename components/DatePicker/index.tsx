import { DatePicker } from 'antd'
import TextErrors from 'components/TextErrors'
import { DateFormat } from 'constants/time'
import { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
const DatePickerComponent = ({
	name,
	placeholder,
	bordered,
	className,
	showIcon,
}: {
	name: string
	className?: string
	bordered?: boolean
	placeholder: string
	showIcon?: boolean
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
						<DatePicker
							bordered={bordered}
							suffixIcon={showIcon ? '' : null}
							// defaultValue={moment('01/01/2015', DateFormat.VI_MOMENT)}
							format={DateFormat.VI_MOMENT}
							className={className}
							placeholder={placeholder}
							{...field}
						/>
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</>
				)
			}}
		/>
	)
}
export default memo(DatePickerComponent)
