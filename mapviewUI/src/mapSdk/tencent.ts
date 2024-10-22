import sdk from "./sdk";
import axios from "axios";

// 简单折线 | 腾讯位置服务
// https://lbs.qq.com/webDemoCenter/glAPI/glPolyline/polyline



// 错误详细
// https://lbs.amap.com/api/webservice/guide/tools/info


/** 腾讯坐标格式化 */
function cb(ret: any) {
    //从结果中取出路线坐标串
    const coors = ret.result.routes[0].polyline, pl = [];
    //坐标解压（返回的点串坐标，通过前向差分进行压缩，因此需要解压）
    const kr = 1000000;
    for (let i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    }
    //将解压后的坐标生成LatLng数组
    for (let i = 0; i < coors.length; i += 2) {
        pl.push(new TMap.LatLng(coors[i], coors[i + 1]));
    }
    return pl//显示路线
}

class tencentMap extends sdk {

    el = "";

    resolve: any;

    reject: any;

    map: any;

    option: any;

    init(option: any) {


        this.option = option;

        return new Promise((resolve, reject) => {
            super.loadScript(`https://map.qq.com/api/gljs?v=1.exp&key=${option.appkey}`).then(resolve, reject);
        })

    }


    onLoad() {
        this.resolve();
    }

    create(el: string) {
        this.el = el;

        this.map = new TMap.Map(el, {
            zoom: 16	//缩放级别
        });

    }

    driving(start: string, end: string) {
        const startAMap = this.createPoint(start);
        const endAMap = this.createPoint(end);

        this.map.setCenter(startAMap);

        const url = `https://apis.map.qq.com/ws/direction/v1/driving/?output=jsonp&from=${encodeURIComponent(this.toStringPoint(startAMap))}&to=${encodeURIComponent(this.toStringPoint(endAMap))}&key=${this.option.appkey}`

        return super.loadScript(url).then((resolve: any) => {

            new TMap.MultiPolyline({
                id: 'polyline-layer',
                map: this.map,
                geometries: [
                    {
                        'paths': cb(resolve)
                    }
                ]
            });

        });

    }

    createPoint(str: string) {
        const splStr = str.split(",");
        return new TMap.LatLng(splStr[1], splStr[0]);
    }

    toStringPoint(point:any){
        return `${point.lat},${point.lng}`

    }




}


export default tencentMap;