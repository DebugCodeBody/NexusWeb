import queryString from "query-string";


const urlSearch = Object.assign({
    corpId: String.Empty,
    path: String.Empty,
    user: String.Empty,

    // 目前就是微信用到
    code: String.Empty,

}, queryString.parse(location.search))


if (process.env.NODE_ENV == "development") {
    if (urlSearch.corpId == "") {
        urlSearch.corpId = "dingf2f1e9ca1da23dff";
    }
}


export function getPathSearch(): string {
    return urlSearch.path
}

export function getCorpId(): string {
    return urlSearch.corpId
}


export function getUserToken(): string {
    return urlSearch.user
}

export function getCode(): string {
    return urlSearch.code;
}


export default function getSearch(key: string): string {
    return urlSearch[key] as any || String.Empty;
}


