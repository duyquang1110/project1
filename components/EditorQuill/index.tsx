import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), {
	ssr: false,
})
const ReactQuillComponent = ({
	className,
	placeholder,
	handleOnChangeEditor,
	data,
}: {
	className: string
	placeholder?: string
	handleOnChangeEditor: (content: string) => any
	data?: string
}) => {
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, false] }],
			// [{ header: 1 }, { header: 2 }, { font: [] }], // custom button values
			//  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
			// [{ 'direction': 'rtl' }],
			[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
			// [{ color: [] }, { background: [] }], // dropdown with defaults from theme
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			// ['link', 'image', 'video'],
			['clean'],
			['blockquote', 'code-block'],
			//[{ 'font': [] }],
			//[{ 'align': [] }],
			//   ["clean"], // remove formatting button
		],
		// handlers: {
		//   image: this.quillImageCallback,
		// },
	}
	const formats = [
		'mention',
		'header',
		'font',
		'size',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video',
		'code-block',
		'color',
	]
	return (
		<ReactQuill
			placeholder={placeholder}
			modules={modules}
			formats={formats}
			className={className}
			theme="snow"
			value={data}
			onChange={(e: string) => handleOnChangeEditor(e)}
		/>
	)
}
export default ReactQuillComponent
