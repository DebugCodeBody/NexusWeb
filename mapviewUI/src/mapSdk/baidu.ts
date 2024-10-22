import sdk from "./sdk";


class baiduMap extends sdk {

    el = "";

    resolve: any;

    reject: any;

    map: any;

    option: any;


    createPoint(str:string){
        const splStr = str.split(",");
        return new BMap.Point(splStr[0],splStr[1]);
    }

    init(option: any) {

        this.option = option;

        return new Promise((resolve, reject) => {
            super.loadScript(`https://api.map.baidu.com/api?v=3.0&ak=${option.appkey}`).then(resolve, reject);
        })

    }

    create(el: string) {
        this.el = el;

        const map = this.map = new BMap.Map(el);

        map.enableScrollWheelZoom(true);
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());
        map.addControl(new BMap.MapTypeControl());

    }

    driving(start: string, end: string) {
        // https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/routeplan

        return new Promise((resolve, reject) => {


            
            const startAMap = this.createPoint(start);
            const endAMap = this.createPoint(end);

            const { map } = this;

            map.centerAndZoom(startAMap, 15);

            const driving = new BMap.DrivingRoute(map, { renderOptions: { 
                map: map, 
                autoViewport: true,
                onSearchComplete(){
                    debugger;
                }
             } });


            driving.search(startAMap, endAMap);

        })

    }


}


export default baiduMap;