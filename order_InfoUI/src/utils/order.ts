
function match(text = '', rules: RegExp) {
    const result = text.match(rules);

    return result && result.join("").length == text.length
}

const Rules = [
    {
        rules: /([a-zA-Z]\d+)-\d+(\/?-?\d+)+/g,
        get(value: RegExpExecArray) {
            const order = value[1];

            const split = value[0].slice(value[1].length).match(/(\/?-?\d+)/g) || [];

            return split.map((elem) => {
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
function parseOrder(value = ""): Array<string> {

    let retArr: Array<string> = [];
    if (!value) {
        return retArr;
    }
    for (const elem of Rules) {
        if (match(value, elem.rules)) {

            const result = elem.get(elem.rules.exec(value)!);
            if (result.length > 0) {
                retArr = Array.from(new Set(result));
                break;
            }
        }
    }

    return retArr;
}


export function getOrderUrl(val:string) {
    const split = val.split("-");
    const join = [];


    join.push(`${split[0]}`);

    if(split.length > 1){
        join.push(val)
    }
    
    return `NexusNet://folder/%5C%5C192.168.0.69%5C%E7%94%9F%E4%BA%A7%E5%9B%BE%E6%A1%A3%5C${encodeURIComponent(join.join("\\"))}`
}




export default parseOrder