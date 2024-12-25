import api from "../axios";
import useDebtStore from "@/stores/debtStore";

export const getAllDebt = async ( status : number ) => {
    try {
        const response = await api.get(`/debit/getallbystatuspayment?status=${status}`)
        useDebtStore.getState().clearDebts()
        useDebtStore.getState().setDebts(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getDebtByBuildingIdAndStatus = async ( buildingId : string, status : number ) => {
    try {
        const response = await api.get(`/debit/getbybuildingidandstatus?buildingid=${buildingId}&status=${status}`)
        useDebtStore.getState().clearDebts()
        useDebtStore.getState().setDebts(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getDebtByRoomIdAndStatus = async ( roomId : string, status : number ) => {
    try {
        const response = await api.get(`/debit/getbyroomidandstatus?id=${roomId}&status=${status}`)
        useDebtStore.getState().clearDebts()
        useDebtStore.getState().setDebts(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}
