import usePaymentScheduleStore from "@/stores/paymentSchedule";
import api from "../axios";

export const getAllPaymentSchedule = async () => {
    try {
        const response = await api.get(`/paymentschedule/all`)
        usePaymentScheduleStore.getState().clearSchedules()
        usePaymentScheduleStore.getState().setSchedules(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getPaymentScheduleByBuildingId = async ( buildingId : string) => {
    try {
        const response = await api.get(`/paymentschedule/getbybuildingid?id=${buildingId}`)
        usePaymentScheduleStore.getState().clearSchedules()
        usePaymentScheduleStore.getState().setSchedules(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const getPaymentScheduleByRoomId = async ( roomId : string, status : number) => {
    try {
        const response = await api.get(`/paymentschedule/getbillbyroomidandstatus?id=${roomId}&statuspayment=${status}`)
        usePaymentScheduleStore.getState().clearSchedules()
        usePaymentScheduleStore.getState().setSchedules(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}