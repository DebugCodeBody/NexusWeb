import sdk from "./sdk";

// https://lbs.amap.com/demo/jsapi-v2/example/driving-route/plan-route-according-to-lnglat

// https://lbs.amap.com/api/jsapi-v2/guide/abc/load

// 错误详细
// https://lbs.amap.com/api/webservice/guide/tools/info




class gaodeMap extends sdk {

    el = "";

    resolve: any;

    reject: any;

    /** 地图的实例化对象 */
    map: any;

    option: any;


    geolocation: any;

    geocoder: any;

    marker: any;

    click: any;

    placeClick: any;

    searchPlace: any



    init(option: any) {


        this.option = option;
        // {
        //     appid: string
        //     appkey: string
        // }

        (window as any)._AMapSecurityConfig = {
            securityJsCode: option.appid,
        }

        return new Promise((resolve, reject) => {
            super.loadScript(`https://webapi.amap.com/maps?v=2.0&plugin=AMap.Driving&key=${option.appkey}`).then(resolve, reject);
        })

    }


    onLoad() {
        this.resolve();
    }

    create(el: string) {
        this.el = el;


        const start = new AMap.LngLat(113.771872, 22.788057)
        const end = new AMap.LngLat(113.774992, 22.791545)


        const map = window.map = this.map = new AMap.Map(el, {
            resizeEnable: true,
            zoom: 13
        });


        map.plugin("AMap.PlaceSearch", () => {

        });
        map.plugin("AMap.PolyEditor", () => {

        });




        map.on('click', (e: any) => {


            const { target } = e.originEvent

            if (target.classList.contains("amap-marker") || (target.parentNode && target.parentNode.classList.contains("amap-marker"))) {
                return;
            }


            this.click && this.click(e.lnglat);
        });


    }

    driving(start: string, end: string) {


        return new Promise((resolve, reject) => {
            const startAMap = this.createPoint(start);
            const endAMap = this.createPoint(end);

            const driving = new AMap.Driving({
                map: this.map,
            });

            // 根据起终点经纬度规划驾车导航路线
            driving.search(startAMap, endAMap, function (status: any, result: any) {
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === 'complete') {
                    resolve(result);
                    console.log('绘制驾车路线完成')
                } else {
                    reject(result);
                    console.log('获取驾车数据失败：' + result)
                }
            });

        })

    }


    createPoint(str: string) {
        const splStr = str.split(",");
        return new AMap.LngLat(splStr[0], splStr[1]);
    }

    /** 通过经纬度来获取地址信息 */
    getAddress(position: any) {

        return new Promise((resolve, reject) => {

            const getAddress = () => {

                this.geocoder.getAddress([position.lng, position.lat], (status: any, result: any) => {

                    if (this.resultResolve(status)) {
                        resolve(result.regeocode);
                    } else {
                        reject({
                            status,
                            result
                        });
                    }
                })
            }

            if (!this.geocoder) {

                this.map.plugin('AMap.Geocoder', () => {

                    this.geocoder = new AMap.Geocoder({});

                    getAddress();
                });

            } else {
                getAddress();
            }


        })

    }

    /** 定位 */
    Geolocation(call: (a: any) => void, errCall: (a: any) => void, isCurrentPosition = true) {

        const getCurrentPosition = () => {
            if (isCurrentPosition) {
                this.geolocation.getCurrentPosition();
            }
        }

        if (!this.geolocation) {

            this.map.plugin('AMap.Geolocation', () => {

                this.geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认：true
                    timeout: 10000, // 超过10秒后停止定位，默认：无穷大
                    buttonPosition: 'RB', // 定位按钮的位置
                    zoomToAccuracy: false, // 定位成功后是否自动缩放地图到定位结果的范围
                    showButton: true, // 是否显示定位按钮
                    showMarker: false, // 不展示默认marker
                    showCircle: false, // 不展示默认范围

                });


                this.map.addControl(this.geolocation);

                this.geolocation.on("complete", (result: any) => {
                    const { position } = result;
                    call(position);
                })

                this.geolocation.on("error", (result: any) => {
                    errCall(result.originMessage);
                })


                getCurrentPosition();

            });

        } else {
            getCurrentPosition();
        }
    }


    /** 搜索关键字 */
    placeSearch(cpoint: number[], value: string, city:string) {

        this.searchPlace = new AMap.PlaceSearch({
            city,
            citylimit: true, 
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            map: this.map, // 展现结果的地图实例
            panel: "search-list", // 结果列表将在此容器中进行展示。
            autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围,
        });
        


        // cpoint = [113.771872, 22.788057]; //中心点坐标

        // this.searchPlace.searchNearBy(value, cpoint, undefined,

        this.searchPlace.search(value, (status: any, result: any) => {

            if (status != "complete") {
                return;
            }

            [].forEach.call(document.querySelectorAll("#search-list .poibox"), (elem: HTMLElement, index) => {

                elem.addEventListener("click", () => {

                    this.placeClick && this.placeClick(result.poiList.pois[index]);

                })

            })

        });

    }

    /** 清楚搜索结果 */
    clearPlaceSearch() {
        this.searchPlace && this.searchPlace.render.clear();
    }

    /** 
     * 添加一个锚点，缩放到当前坐标的街道
     */
    setZoomAndCenter(position: any) {

        if (this.marker) {
            this.marker.destroy()
        }

        const { map } = this;

        this.marker = this.addMarker(position);
        map.setZoomAndCenter(map.getZooms()[1], position);

    }

    resultResolve(status: string) {
        return status == "complete";
    }

    addMarker(position: any, params = {}) {

        return new AMap.Marker(Object.assign({
            position,
            map: this.map,

            // snippet: "内容",
            // title: "标题"

        }, params));

    }

    removeMarker(position: any | any[]) {

        if (!Array.isArray(position)) {
            position = [position]
        }

        position.forEach((elem: any) => elem.destroy());

    }




    onClick(a: any) {
        this.click = a;
    }

    initAutoComplete(el: string) {

        const autoOptions = {
            input: el
        };

        const that = (this as any);

        AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
            const auto = new AMap.AutoComplete(autoOptions);
            const placeSearch = new AMap.PlaceSearch({
                map: this.map,
            });

            auto.on("select", select);//注册监听，当选中某条记录时会触发
            function select(e: any) {

                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name, () => {


                    setTimeout(() => {


                        placeSearch.render._overlays.forEach((elem: any) => {

                            elem.dom.addEventListener("click", () => {

                                that.placeClick && that.placeClick(elem._data);

                            })

                        })


                    })


                });
            }

        });

    }


}




export default gaodeMap;













