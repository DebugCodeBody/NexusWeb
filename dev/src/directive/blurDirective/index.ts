



const blurDirective = {
    install(Vue: any) {
        Vue.directive("blur", blurDirective)
    },
    mounted(el: any) {

        el.blurDirectiveEvent = function (event:Event) {
            el.blur();
        }

        el.addEventListener("click", el.blurDirectiveEvent);
    },
    unmounted(el: any) {
        el.removeEventListener("click", el.blurDirectiveEvent);
    }
}

export default blurDirective;