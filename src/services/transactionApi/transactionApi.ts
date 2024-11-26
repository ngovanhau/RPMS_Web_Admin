import useTransactionStore from "@/stores/transactionStore";
import api from "../axios";
import { Transaction } from "@/types/types";

export const getAllTransaction = async () => {
    try {
        const response = await api.get(`/incomeexpensegroup/incomeexpensegroupall`)
        useTransactionStore.getState().clearTransactions()
        useTransactionStore.getState().setTransactions(response.data.data)
    } catch (error) {
        console.log(error)
    }
}

export const getTransactionByBuildingId = async ( buildingId : string ) => {
    try {
        const response = await api.get(`/incomeexpensegroup/getincomeexpensegroupbybuildingid?id=${buildingId}`)
        useTransactionStore.getState().clearTransactions()
        useTransactionStore.getState().setTransactions(response.data.data)
    } catch (error) {
        console.log(error)
    }
}

export const createTransaction = async ( transaction : Partial<Transaction>) => {
    try {
        const response = await api.post(`incomeexpensegroup/create`, transaction)
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
}

export const deleteTransaction = async ( transactionId : String ) => {
    try {
        const response = await api.delete(`incomeexpensegroup/delete?id=${transactionId}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const updateTransaction = async ( transaction : Transaction ) => {
    try {
        const response = await api.put(`incomeexpensegroup/update?id=${transaction.id}`, transaction)
        return response.data
    } catch (error) {
        console.log(error)
    }
}