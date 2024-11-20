
import to from "await-to-js";

import { getSignature } from "@/api/coolapp"


let isAuth = false;




function emitOpenGroup(conversation: string) {


    const result = dd.biz.chat.toConversationByOpenConversationId({
        openConversationId: conversation
    });

    return result;

}


function emitAuth() {

    return new Promise(async (resolve, reject) => {

        const [signErr, signData] = await to(getSignature(location.href));


        const { timeStamp, nonceStr, signature } = signData;

        dd.config({
            agentId: '1662765423',
            corpId: "dingf2f1e9ca1da23dff",
            timeStamp,
            nonceStr,
            signature,
            type: 0,
            jsApiList: [
                'runtime.info',
                'biz.contact.choose',
                'device.notification.confirm',
                'device.notification.alert',
                'device.notification.prompt',
                'biz.ding.post',
                'biz.util.openLink',
                "biz.chat.chooseConvez",
                "biz.chat.chooseConversationByCorpId",
                "biz.chat.toConversationByOpenConversationId",
            ]
        });


        dd.error((err: any) => {
            reject(err);
        })


        dd.ready(() => {
            resolve()
        })
    })

}


export async function openGroup(conversation: string): Promise<any> {


    if (isAuth) {
        return emitOpenGroup(conversation);
    }

    const result = await emitAuth();

    isAuth = true;

    return openGroup(conversation);

}
