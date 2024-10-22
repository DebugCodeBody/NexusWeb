<template>
    <div class="search_data-list wh-full overflow-hidden">
        <el-empty v-if="isEmpty" description="没有数据" />
        <div class="list wh-full overflow-auto" v-else>


            <collapse-list :data="thisManage.data">

                <template #item="{ item }">
                    <meet-item :item="item" :type="nowActive" :refresh="refresh">
                    </meet-item>
                </template>
            </collapse-list>



        </div>
    </div>
</template>

<script setup lang="ts">


import collapseList from "@/components/collapseList.vue"

import meetItem from "@/components/meetItem.vue"


import thisManage from "./manage";


const { data } = thisManage;
const nowActive = $ref<any>(undefined);

const isEmpty = computed(() => {
    return data.length == 0;
})


function refresh() {

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.search_data-list {}
</style>
