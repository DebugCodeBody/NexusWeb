import { getToken, setToken } from "./lib/cookies"
import { getInfo, getCorpId, tokenLogin, dingCodeLogin, toLogin } from "./lib/api"



type DingAuthCode = {
    corpId: string,
    code: string
}

type permissionResult = {
    code: string
}


const dingUtils = {

    isDing() {
        return (typeof dd != "undefined" && dd.env.platform != "notInDingTalk");
    },

    getAuthCode(corpId: string | string[]): Promise<DingAuthCode> {
        if (!Array.isArray(corpId)) {
            corpId = [corpId];
        }

        const length = corpId.length - 1;
        const errorArr = [] as string[];

        return new Promise((resolve, reject) => {

            function nextGet(index: number) {

                if (index > length) {
                    reject(errorArr.join("\r\n"));
                    return;
                }

                function callNext() {
                    nextGet(index + 1);
                }

                const tempId = corpId[index];
                if (tempId) {
                    dd.runtime.permission.requestAuthCode({
                        corpId: tempId
                    }).then((result: permissionResult) => {

                        const { code } = result;
                        resolve({
                            corpId: tempId,
                            code
                        });

                    }).catch((err: any) => {
                        errorArr.push(err.errorMessage);
                        callNext();
                    })
                } else {
                    callNext();
                }

            }

            nextGet(0);

        })


    }

}


class nexusAuth {

    info = null as any;

    reject = undefined as any;
    resolve = undefined as any;

    init() {

        return new Promise((resolve, reject) => {


            this.reject = reject;
            this.resolve = resolve;

            const urlToken = this.getUrlToken();
            if (urlToken) {
                this.tokenLogin(urlToken);
            } else {

                const token = getToken();
                if (token) {
                    this.getInfo();
                } else {
                    this.ddLogin();
                }
            }

        })

    }


    getInfo() {

        getInfo().then((info) => {

            this.info = info;
            this.resolve(info);

        }).catch(() => {
            this.ddLogin();
        })

    }


    tokenLogin(token: string) {

        tokenLogin(token).then((info) => {

            this.info = info;
            this.resolve(info);

        }).catch((error: string) => {

            if (dingUtils.isDing()) {
                this.ddLogin();
            } else {
                toLogin(error);
            }
            
        })

    }

    ddLogin() {

        if (!dingUtils.isDing()) {
            return;
        }

        getCorpId().then((idList) => {

            dingUtils.getAuthCode(idList).then(({ corpId, code }) => {

                dingCodeLogin(corpId, code).then((info) => {

                    this.info = info;
                    this.resolve(info);

                })

            }).catch((error: string) => {
                toLogin(error);
            })

        })

    }

    getUrlToken() {
        return "85e141710a25880d6f498f4522dfc282";
    }


}


const defaultValue = new nexusAuth();;


window.authLogin = defaultValue;


export default defaultValue;




