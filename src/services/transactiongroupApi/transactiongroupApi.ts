import { TransactionGroup } from "@/types/types";
import api from "../axios";
import useTransactionGroupStore from "@/stores/transactiongroupStore";

export const getAllTransactionGroup = async () => {
    try {
        const response = await api.get(`/transactiongroup/getalltransactiongroup`)
        useTransactionGroupStore.getState().setTransactionGroups(response.data.data)
        return response
    } catch (error) {
     console.log(error)   
    }
}



export const createTransactionGroup = async ( data : TransactionGroup ) => {
    try {
        const response = await api.post(`/transactiongroup/create`, data)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

