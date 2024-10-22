import require from "@/utils/require.js";


export function get(empid) {
    return require({
        url: "/notice/get",
        params: {
            empid
        }
    })
}

export function set(empid, value, date) {
    return require({
        url: "/notice/set",
        method: "post",
        data: {
            empid,
            value,
            date
        }

    })
}