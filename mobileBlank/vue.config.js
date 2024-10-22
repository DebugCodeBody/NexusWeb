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
					"^/api": "/test/blank"
				},
				target: "http://127.0.0.1:7001"
			}
		}
	},
	transpileDependencies: false,
	configureWebpack(config) {

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