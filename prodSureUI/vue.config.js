const {defineConfig} = require("@vue/cli-service")
module.exports = defineConfig({
	publicPath:"./",
	productionSourceMap: false,
	devServer: {
		proxy: {
			"/api": {
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					"^/api": "/ding/prodsure"
				},
				target: "http://127.0.0.1:7001"
			},
			"/media": {
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					"^/media": "/ding/media"
				},
				target: "http://127.0.0.1:7001"
			},
			"/onlineorder": {
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					"^/onlineorder": "/ding/onlineorder"
				},
				target: "http://127.0.0.1:7001"
			}
		}
	},
	transpileDependencies: false,
	configureWebpack(config) {
		debugger;
		if (config.mode == "production") {
			config.externals = {
				vue: "Vue",
				vuex: "Vuex",
				vant: "Vant",
				axios: "axios",
				moment: "moment",
				"element-plus" : "ElementPlus",

			}
			config.optimization.splitChunks = undefined;
		}
	}
})



// <script defer="defer" src="https://unpkg.com/vue@3.2.7/dist/vue.global.js"></script>
// <script defer="defer" src="https://unpkg.com/axios@0.27.2/dist/axios.min.js"></script>