const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const AutoImport = require("unplugin-auto-import/webpack");
const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");


const { defineConfig } = require("@vue/cli-service");
const { copyDist, getApiPath } = require("./build/copyDist")


function getDevServerProxy(api) {
	const ret = {};

	for (const [key, value] of Object.entries(api)) {
		ret[key] = {
			ws: true,
			changeOrigin: true,
			pathRewrite: {
				[`^${key}`]: value
			},
			target: "http://127.0.0.1",
			cookieDomainRewrite: {
				"/ding": "/"
			},
			cookiePathRewrite: {
				"/ding": "/"
			}
		}
	}

	return ret;
}


const HtmlWebpackInjectorPlugin = require("./build/HtmlWebpackInjector")
module.exports = defineConfig({
	publicPath: "./",
	productionSourceMap: false,
	devServer: {
		proxy: getDevServerProxy({
			"/api/auto": "/ding/auto",
			"/api/auth": "/ding/auth",
			"/api/media": "/ding/media",
			"/api/coolapp": "/ding/coolapp",
			"/api": `/ding/${getApiPath()}`
		})
	},
	transpileDependencies: false,

	chainWebpack(config) {
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap((options) => {
				return {
					...options,
					reactivityTransform: true
				}
			});

		const globalComponentsPath = path.join(__dirname, "../globalComponents") 

		config.resolve.alias
			.set('@', path.join(__dirname, './src'))
			.set('global@', globalComponentsPath);

		if (process.env.NODE_ENV == "production") {
			// config.plugin('compiler').use(HtmlWebpackInjectorPlugin)


			config.plugin('compiler').use(function () {
				this.apply = function (compilation) {


					// compilation.hooks.emit.tap('MyPlugin', (Compilation) => {
					// 	Object.keys(Compilation.assets).find(elem => {
					// 		if (/js\/app.*?js/.test(elem)) {
					// 			// Compilation.assets[elem]._value = "123"
					// 		}
					// 	})
					// });


					compilation.hooks.done.tap('copyDist', ({ compilation }) => {
						setTimeout(() => {
							copyDist(compilation);
						})
					});

				}
			});

		}

	},
	configureWebpack(config) {

		config.plugins.push(new WindiCSSWebpackPlugin());
		config.plugins.push(AutoImport({
			imports: ["vue", "vue/macros", "@vueuse/core"],
			dts: "./declare/auto-imports.d.ts"
		}));

		if (config.mode == "production") {

			config.externals = {
				vue: "Vue",
				vuex: "Vuex",
				vant: "vant",
				axios: "axios",
				moment: "moment",
				"element-plus": "ElementPlus",
			}
			config.optimization.splitChunks = undefined;
		}
	}
})



// <script defer="defer" src="https://unpkg.com/vue@3.2.7/dist/vue.global.js"></script>
// <script defer="defer" src="https://unpkg.com/axios@0.27.2/dist/axios.min.js"></script>