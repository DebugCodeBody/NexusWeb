import { defineStore } from "pinia"

import dayjs from "dayjs"

import { create } from "@/api/order"




interface state {
    /** 文件列表 */
    files: workPieceItem[],
    /** 是否正在上传中 */
    isUploadIng: boolean
}


const state: state = {
    files: [],
    isUploadIng: false
};



export default defineStore("data", {


    state() {
        return state;
    },
    getters: {

        /** 没有上传的文件数量 */
        notUploadCount(): number {
            return this.notUpload.length;
        },
        /** 没有上传的文件列表 */
        notUpload(): workPieceItem[] {
            return this.files.filter((item) => !item.id);
        }

    },
    actions: {

        addDropFile(item: workPieceItem | workPieceItem[]) {

            if (!Array.isArray(item)) {
                item = [item];
            }

            this.files.push(...item.map((elem) => Object.assign(elem, {
                createDate: dayjs().format("YYYY-MM-DD HH:mm"),
                count: "按图纸",
                material: "按图纸",
                isUploadIng: false
            })));

        },
        /**
         * 寻找项目索引
         * @param item 
         * @returns 
         */
        find(item: workPieceItem) {
            return this.files.findIndex(elem => elem === item);
        },

        /**
         * 删除指定项目
         * @param item 
         */
        del(item: workPieceItem) {
            const index = this.find(item);

            this.files.splice(index, 1);
        },
        startUpload() {

            this.isUploadIng = true;

        },
        stopUpload() {

            this.isUploadIng = false;

        }

    }



})