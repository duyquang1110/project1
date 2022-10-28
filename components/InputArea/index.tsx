import { Input } from 'antd'
import TextErrors from 'components/TextErrors'
import { memo } from 'react'
import styles from './InputArea.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
const { TextArea } = Input
const InputAreaComponent = ({
	name,
	placeholder,
	className,
}: {
	name: string
	placeholder: string
	className: string
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
					// errors[name]?.message
					<div className={styles.textArea}>
						<TextArea className={`${className} ${styles.textArea__input} ${errors[name]?.message ? styles.textArea__borderError : styles.textArea__borderNormal}`} placeholder={placeholder} {...field} />
						{errors[name]?.message && <TextErrors message={errors[name]?.message} />}
					</div>
				)
			}}
		/>
	)
}
export default memo(InputAreaComponent)
