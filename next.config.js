/** @type {import('next').NextConfig} */
const nextConfig = {
	// sassOptions: {
	// 	includePaths: [path.join(__dirname, 'styles')],
	// },
	// assetPrefix: 'assetPrefixPath',
	// publicRuntimeConfig: {
	// 	basePath: 'basePath',
	// },
	reactStrictMode: false,
	i18n: {
		locales: ['en', 'vi'],
		defaultLocale: 'vi',
	},
	env: {
		NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
	},
	images: {
		domains: ['103.153.75.168'],
	},
}

module.exports = nextConfig
