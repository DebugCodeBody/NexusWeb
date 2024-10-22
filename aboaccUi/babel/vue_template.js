const babel = require("@babel/core");

module.exports = function (source) {

    if (this.resourceQuery.indexOf("type=template") > -1 && source.indexOf(`export function render`) > -1) {
        if(source.indexOf("??") > -1){
            debugger;
        }



        source = babel.transformSync(source, {
            filename: '__filename',
            plugins: ["@babel/plugin-transform-nullish-coalescing-operator"],
            "presets": ["typescript"],

            "sourceType": "module"
        }).code


    }

    return source
}
