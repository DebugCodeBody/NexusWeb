
const storeData = reactive({
    loading: false,
    showAssign: false,
    selectItem: {} as viewInfo
});



export async function refreshData() {

    storeData.loading = true;




}



export default storeData;
