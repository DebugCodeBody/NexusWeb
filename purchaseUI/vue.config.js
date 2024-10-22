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

module.exports = defineConfig({
	publicPath: "./",
	productionSourceMap: false,
	devServer: {
		proxy: getDevServerProxy({
			"/api/auto": "/ding/auto",
			"/media": "/ding/media",
			"/api": "/ding/purchase"
		})
	},
	transpileDependencies: false,
	chainWebpack(config) {
		if (process.env.NODE_ENV == "production") {
			config.plugin('compiler').use(function () {
				this.apply = function (compilation) {
					compilation.hooks.emit.tap('MyPlugin', (Compilation) => {
						Object.keys(Compilation.assets).find(elem => {
							if (/js\/app.*?js/.test(elem)) {
								// Compilation.assets[elem]._value = "123"
							}
						})
					});
				}
			});
		}

	},
	configureWebpack(config) {
		if (config.mode == "production") {
			config.externals = {
				vue: "Vue",
				vuex: "Vuex",
				vant: "Vant",
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