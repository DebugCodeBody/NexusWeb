const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const AutoImport = require("unplugin-auto-import/webpack");;

const { defineConfig } = require("@vue/cli-service")

function getDevServerProxy(api) {
	const ret = {};

	for (const [key, value] of Object.entries(api)) {
		ret[key] = {
			ws: true,
			changeOrigin: true,
			pathRewrite: {
				[`^${key}`]: value
			},
			target: "http://127.0.0.1:80",
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

const appServer = "C:/Users/Administrator/Desktop/egg-moduleApplication/src/Server/application";

function getAppName(name) {
	const match = name.match(/(.*?)UI/)

	return match && match.length == 2 && match[1].toLocaleLowerCase();
}



const HtmlWebpackInjectorPlugin = require("./build/HtmlWebpackInjector")
module.exports = defineConfig({
	publicPath: "./",
	productionSourceMap: false,
	devServer: {
		proxy: getDevServerProxy({
			"/api/auto": "/ding/auto",
			"/api": "/ding/caiduo/feeder",
			"/media": "/ding/media",
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

		if (process.env.NODE_ENV == "production") {
			// config.plugin('compiler').use(HtmlWebpackInjectorPlugin)


			config.plugin('compiler').use(function () {
				this.apply = function (compilation) {


					compilation.hooks.emit.tap('MyPlugin', (Compilation) => {
						Object.keys(Compilation.assets).find(elem => {
							if (/js\/app.*?js/.test(elem)) {
								// Compilation.assets[elem]._value = "123"
							}
						})
					});

					compilation.hooks.done.tap('MyPlugin', ({ compilation }) => {

						setTimeout(() => {
							const {
								log,
								done,
								info,
								error,
								logWithSpinner,
								stopSpinner
							} = require('@vue/cli-shared-utils');

							info("开始复制文件到服务端应用目录")
							try {
								const appName = getAppName(path.basename(compilation.options.context));
								if (!appName) {
									return error("应用目录名字不符合规则 【****UI】");
								}

								const appPath = path.join(appServer, appName);
								if (!fs.existsSync(appPath)) {
									return error(`目录不存在：${appPath}`);
								}

								info(`应用名称：${appName}`);
								info(`应用目录：${appPath}`);

								const publicPath = path.join(appPath, "public")
								fsExtra.emptyDirSync(publicPath)


								fsExtra.copySync(compilation.outputOptions.path, publicPath);

								info("完成辣");
							} catch (err) {
								error(err);
							}
						})
					});
				}
			});

		}

	},
	configureWebpack(config) {

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