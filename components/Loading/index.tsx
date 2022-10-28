import React from 'react'
import styles from './Loading.module.scss'
import { Spin } from 'antd'
import { loadingReducer } from 'redux/reducers/common'
import { useAppSelector } from 'redux/reducers/hooks'
export default function Loading() {
	const loading = useAppSelector(loadingReducer)
	return (
		<div className={`${styles.loading} ${loading ? styles.loadingShow : styles.loadingNone}`}>
			<Spin className={styles.loading__icon} size="large" />
		</div>
	)
}
