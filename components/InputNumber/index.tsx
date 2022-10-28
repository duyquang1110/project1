import { InputNumber } from 'antd'
import TextErrors from 'components/TextErrors'
import { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from './Input.module.scss'
const InputNumberComponent = ({
	name,
	className,
	min,
	max,
	type,
	disable,
}: {
	name: string
	className?: string
	min: number
	max: number
	type?: string
	disable?: boolean
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
					<div className={styles.inputNumber}>
						<InputNumber
							disabled={disable}
							className={className}
							min={min}
							style={{ width: '100%' }}
							max={max}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
							defaultValue={1}
							{...field}
							addonAfter={type}
						/>
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</div>
				)
			}}
		/>
	)
}
export default memo(InputNumberComponent)
