import useTransactionStore from "@/stores/transactionStore";
import api from "../axios";

export const getAllTransaction = async () => {
    try {
        const response = await api.get(`/incomeexpensegroup/incomeexpensegroupall`)
        useTransactionStore.getState().setTransactions(response.data.data)
    } catch (error) {
        console.log(error)
    }
}