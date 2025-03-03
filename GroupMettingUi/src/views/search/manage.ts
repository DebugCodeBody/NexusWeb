import { getAllActorUser } from "@/api"

import { searchGet, searchExport } from "@/api/search"
import to from "await-to-js";

import { getMettItemDetail } from "@/utils/other"
import dayjs from "dayjs";


const thisManage = {


    formEl: {} as any,
    formData: reactive({
        status: 0,

        type: "全部",

        time: [] as Date[],

        track_user: [] as string[],

        create_user: [] as string[],

        actor_user: [] as string[],

        content: "",

        /** 只显示群内用户 */
        isExistGroup: true,

        /** 只显示群内用户 */
        is_optimize: false
    }),

    tab: {} as any,

    data: reactive<mettItems>([]),

    actorUser: reactive<userItem[]>([]),

    compute: reactive<{
        name: string,
        create: number,
        actor: number,
    }[]>([]),


    other: reactive({
        loading: false
    }),

    async init() {


        const [err, result] = await to(getAllActorUser());
        if (err) {
            return;
        }

        this.actorUser.push(...(result as any));


    },

    getWhere() {

        const data = Object.assign({}, this.formData);

        if (data.time) {
            data.time = data.time.map((elem) => elem.getTime()) as any;

            const time = {
                start: data.time[0],
                end: data.time[1]
            }

            data.time = time as any;

        } else {

            data.time = {
                start: null,
                end: null
            } as any

        }

        if (data.type == "全部") {
            data.type = "";
        }

        const { order } = this.tab.table.filter;

        if (order && Object.keys(order).length > 0) {
            (data as any).order = order;
        }

        return data;

    },

    async search() {

        try {
            await this.formEl.validate();
        } catch {
            return;
        }

        const data = this.getWhere();

        this.other.loading = true;

        const [err, result] = await to(searchGet(data));

        this.other.loading = false;

        if (err) {
            return;
        }

        this.data.length = 0;
        this.data.push(...(result as any).view);


        this.compute.length = 0;
        this.compute.push(...(result as any).count);


    },

    async export() {

        try {
            await this.formEl.validate();
        } catch {
            return;
        }

        const data = this.getWhere();

        this.other.loading = true;

        const [err, result] = await to(searchExport(data));

        this.other.loading = false;

        if (err) {
            return;
        }

        const detailList = result!.map((item) => getMettItemDetail(item));

        const content = detailList.join("\r\n\r\n");


        const nowTime = dayjs();


        


        const a = document.createElement('a');
        a.href = `data:text/plain;charset=utf-8,${content}`;
        a.download = `${ nowTime.format("MM-DD") }会议导出记录.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);



    },

    reset() {

        Object.assign(this.formData, {
            status: 0,
            type: "全部",
            time: [],
            track_user: [] as string[],
            create_user: [] as string[],
            actor_user: [] as string[],
            content: ""
        });


    },

    setFormEl(el: any) {
        this.formEl = el;
    },

    setTabManage(tab: any) {

        this.tab = tab;

    }


}


export default thisManage;