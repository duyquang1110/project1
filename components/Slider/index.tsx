import { Col, InputNumber, Row, Slider } from 'antd'
import TextErrors from 'components/TextErrors'
import { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from './Input.module.scss'
const SliderComponent = ({ name, min, max }: { name: string; min: number; max: number }) => {
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
						<Slider
							{...field}
							style={{ width: '40%', margin: '1.4rem 1rem 0 0' }}
							min={min}
							max={max}
						/>
						{/* {errors[name]?.message && <TextErrors message={errors[name]?.message} />} */}
					</>
				)
			}}
		/>
	)
}
export default memo(SliderComponent)
