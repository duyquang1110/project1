import { Steps } from 'antd'
const { Step } = Steps
const TimelineComponent = ({
	listTimeline,
	direction,
}: {
	direction: any
	listTimeline: { id: number; title: string; description: string }[]
}) => {
	return (
		<Steps progressDot current={listTimeline.length} direction={direction}>
			{listTimeline?.length > 0 &&
				listTimeline.map((values) => {
					return <Step key={values.id} title={values.title} description={values.description} />
				})}
		</Steps>
	)
}
export default TimelineComponent
