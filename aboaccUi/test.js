const babel = require("@babel/core");

let source = `import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, createElementVNode as _createElementVNode, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createBlock as _createBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from "vue"

const _withScopeId = n => (_pushScopeId("data-v-46d345c3"),n=n(),_popScopeId(),n)
const _hoisted_1 = { class: "h-full overflow-hidden no-md" }
const _hoisted_2 = { class: "mb-10px flex" }
const _hoisted_3 = { class: "flex mr-10px" }
const _hoisted_4 = { class: "flex-1" }

export function render(_ctx: any,_cache: any,$props: any,$setup: any,$data: any,$options: any) {
  const _component_el_button = _resolveComponent("el-button")!
  const _component_el_option = _resolveComponent("el-option")!
  const _component_el_select = _resolveComponent("el-select")!

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, [
        _createVNode(_component_el_button, {
          type: "danger",
          onClick: $setup.onClickCance
        }, {
          default: _withCtx(() => [
            _createTextVNode("注销登录")
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _createElementVNode("div", null, [
        _createVNode(_component_el_select, {
          modelValue: $setup.selectVal,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event: any) => (($setup.selectVal) = $event)),
          placeholder: "选择器",
          onChange: $setup.onSelectChange
        }, {
          default: _withCtx(() => [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($setup.option, (item, index) => {
              return (_openBlock(), _createBlock(_component_el_option, {
                key: item,
                label: item,
                value: index
              }, null, 8 /* PROPS */, ["label", "value"]))
            }), 128 /* KEYED_FRAGMENT */))
          ]),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["modelValue"])
      ])
    ]),
    _createElementVNode("div", _hoisted_4, [
      _createVNode($setup["Table"], { pagination: false })
    ])
  ]))
}`

source = babel.transformSync(source, {
    filename: '__filename',
    plugins: ["@babel/plugin-transform-nullish-coalescing-operator"],

    "sourceType": "module"
}).code


console.log(source)
