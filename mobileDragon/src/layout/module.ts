interface order {
	seq: number
	mat_id: number
	mat_name: string
	no?: string
	spec: string
	spec2: string
	qty: number
	date: string
	status: number,
	/**
	 * 尾料名字
	 */
	stname: string,
	/**
	 * 打印时间
	 */
	printtime: string

	/**
	 * 匹配
	 */
	fullmatch: string

	/**
	 * 客户名称
	 */
	custname: string

}

interface machineInfo {
	mid: number
	name: string
	status: number
	

	nextOrder: order

	order: Array<order>
}

type machineList = Array<machineInfo>;


export type {
    order,
    machineInfo,
	machineList

};

