import { Controller, useFormContext } from 'react-hook-form'
import TextErrors from 'components/TextErrors'
import styles from './Checkbox.module.scss'
const CheckboxComponent = ({
	name,
	data,
	type,
	className,
}: {
	name: string
	className?: string
	data: any[]
	type: string
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
					<div className={styles.parent}>
						{data?.length > 0 &&
							data.map((values) => {
								return (
									<div className={styles.checkbox} key={values.id}>
										<input id={values.key} type={type} defaultChecked={values.value} {...field} />
										<label className={className} htmlFor={values.key}>
											{values.key}
										</label>
									</div>
								)
							})}
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</div>
				)
			}}
		/>
	)
}
export default CheckboxComponent
