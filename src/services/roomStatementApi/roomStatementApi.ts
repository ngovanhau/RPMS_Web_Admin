import api from "../axios";
import { ServiceMeterReadings } from "@/types/types";
import useServiceMeterReadingsStore from "@/stores/roomStatementStore";



export const getALlServicemeterreadings = async () => {
    try {
        useServiceMeterReadingsStore.getState().clearReadings()
        const response = await api.get(`/servicemeterreadings/serviceall`)
        useServiceMeterReadingsStore.getState().setReadings(response.data.data)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const getServicemeterByRoomId = async ( roomId : string) => {
    try {
        useServiceMeterReadingsStore.getState().clearReadings()
        const response = await api.get(`/servicemeterreadings/getservicebyroomid?id=${roomId}`)
        useServiceMeterReadingsStore.getState().setReading(response.data.data)
        return response
    } catch (error) {
        console.log(error);
    }
}


export const getServicemeterByBuildingId = async ( buildingId : string ) => {
    try {
        useServiceMeterReadingsStore.getState().clearReadings()
        const response = await api.get(`/servicemeterreadings/getlistservicebybuildingid?id=${buildingId}`)
        useServiceMeterReadingsStore.getState().setReadings(response.data.data)
        return response
    } catch (error) {
        console.log(error)
    }
}



export const createServicemeter = async ( data : ServiceMeterReadings ) => {
    try {
        const response = await api.post(`/servicemeterreadings/create`, data)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const editServicemeter = async ( data : ServiceMeterReadings ) => {
    try {
        const response = await api.put(`/servicemeterreadings/update?id=${data.id}`, data) 
        return response
    } catch (error) {
        console.log(error)
    }
}


export const deleteServicemeter = async ( servicemeterId : string ) => {
    try {
        const response = await api.delete(`/servicemeterreadings/delete?id=${servicemeterId}`)
        return response
    } catch (error) {
        throw error
    }
}