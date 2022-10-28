import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
// related next document: https://nextjs.org/docs/advanced-features/custom-document
export default class AppDocument extends Document {
	// static async getInitialProps(ctx) {
	// 	const originalRenderPage = ctx.renderPage
	// 	const initialProps = await Document.getInitialProps(ctx)

	// 	// Check if in production
	// 	const isProduction = process.env.NODE_ENV === 'production'

	// 	return {
	// 		...initialProps,
	// 		isProduction,
	// 	}
	// }
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}
	render() {
		return (
			<Html lang="en">
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Roboto:wght@300;400;500;700&display=swap"
						rel="stylesheet"
					/>
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
					/>
				</Head>
				<body className="">
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
