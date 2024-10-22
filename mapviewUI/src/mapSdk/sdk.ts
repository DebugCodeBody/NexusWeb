
function randomString(len: number) {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

class mapSdk {

    loadScript(url: string) {

        const randCallBack = randomString(10);

        return new Promise((resolve, reject) => {


            url = url + "&callback=" + randCallBack;

            const jsapi = document.createElement('script');
            jsapi.src = url;


            document.head.appendChild(jsapi);

            jsapi.onerror = reject;
            (window as any)[randCallBack] = resolve;

        }).then((res:any) => {
          
            (window as any)[randCallBack] = "";
            return Promise.resolve(res);
            
        })



    }

    onLoad() {

    }

    onError() {

    }


    create(el: string) {

    }


}


type mapInstance = InstanceType<typeof mapSdk>


export default mapSdk;

export {
    mapInstance
}