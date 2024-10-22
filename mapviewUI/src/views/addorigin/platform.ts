import { ref, reactive } from "vue"




type option = {
    name: string,
    location: string,
}

class platform {

    select: number | undefined = undefined;
    list:option[] = [];


    addResult(child: option[]) {
        this.list.push(...child);
    }

    getLocation() {
        return this.list[this.select!].location;
    }

}


export default platform;