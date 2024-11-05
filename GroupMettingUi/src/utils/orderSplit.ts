
const Rules = [
    {
        /** 
         * J4102-8/1/-1/2
         * J4102-8/1
         * J4102-8-1
         */
        rules: /([a-zA-Z]\d+)-\d+(\/?-?\d+)+/g,
        get(value: any) {
            const order = value[1];

            const split = value[0].slice(value[1].length).match(/(\/?-?\d+)/g) || [];

            return split.map((elem: any) => {
                let charAt = elem.charAt(0);

                if (charAt == "/") {
                    elem = elem.slice(1);
                    charAt = elem.charAt(0);
                }
                if (charAt != "-") {
                    elem = `-${elem}`
                }

                return `${order}${elem}`
            });
        }
    },
    {
        /**
         * J4102-8
         * 
         */
        rules: /([a-zA-Z]\d+-\d+)\/?/g,
        get(value: any) {
            return value.input.match(this.rules).map((elem: any) => {
                if (elem.slice(-1) == "/") {
                    elem = elem.slice(0, -1);
                }
                return elem
            })
        }
    }
]

function match(text = '', rules: any) {
    const result = text.match(rules);

    return result
}




/**
 *  格式化订单 
 *  J11111-1
 *  J11111-1/2/3/4
 */
export function parseOrder(value = "") {

    let retArr = [] as any[];
    if (!value) {
        return retArr;
    }
    for (const elem of Rules) {
        if (match(value, elem.rules)) {
            const result = elem.get(elem.rules.exec(value));
            if (result.length > 0) {
                retArr = Array.from(new Set(result));
                break;
            }
        }
    }

    return retArr;
}

export function splitText(value = "") {
    const retArr = [];


    const rules = /([a-zA-Z]\d+)-\d+(\/?-?\d+)*/g
    let exec;
    let lastExec: any;
    function slice(end: any) {
        return value.slice(lastExec[0].length + lastExec.index, end)
    }
    if (value) {


        /**
         * 首先用正则一一匹配，因为exec每次匹配只会返回一个匹配结果
         * 所以使用while一直正则取出所有的订单
         * 
         * 需要保存上一次的匹配结果，这个是用来取出中间不是订单内容的字符串
         * 例如：J123-4/1我爱你j475-5
         * 
         * 
         */

        while ((exec = rules.exec(value))) {
            if (!lastExec) {
                lastExec = exec;
            } else {
                retArr.push([false, slice(exec.index)]);
                lastExec = exec;
            }
            retArr.push([true, exec[0]]);
        }
        if (lastExec && lastExec.index + lastExec[0].length < value.length) {
            retArr.push([false, slice(value.length)]);
        }

        if (retArr.length == 0) {
            retArr.push([false, value]);
        }
    }

    return retArr
}
