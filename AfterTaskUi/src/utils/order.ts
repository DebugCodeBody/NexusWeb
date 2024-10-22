function match(text = '', rules: RegExp) {
    const result = text.match(rules);

    return result && result.join("").length == text.length
}

const Rules = [
    {
        rules: /([a-zA-Z]\d+)-\d+(\/?-\d+)+/g,
        get(value: RegExpExecArray) {
            const order = value[1];

            const split = value[0].slice(value[1].length).match(/(\/?-\d+)/g) || [];

            return split.map((elem) => {
                if (elem.charAt(0) == "/") {
                    elem = elem.slice(1);
                }
                return `${order}${elem}`

            });


        }
    },

    {
        rules: /([a-zA-Z]\d+-\d+)\/?/g,
        get(value: RegExpExecArray) {
            return value.input.match(this.rules)!.map((elem) => {
                if (elem.slice(-1) == "/") {
                    elem = elem.slice(0, -1);
                }
                return elem
            })
        }
    }
]


/**
 *  格式化订单 
 *  J11111-1
 *  J11111-1/2/3/4
 */
function parseOrder(value = ""): string {

    const orderText = value.match(/[a-zA-Z]\d+-\d+([/-]?[/-]?\d+)*/g);
    
    if (orderText) {
        value = orderText[0]
    } else {
        value = ""
    }

    return value


}

export {
    parseOrder
}