import { Booking } from "@/types/types";
import api from "../axios";
import useBookingStore from "@/stores/bookingStore";

export const getAllBooking = async () => {
    try {
        const response = await api.get(`/booking/bookingall`)
        useBookingStore.getState().clearBookings()
        useBookingStore.getState().setBookings(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export const createBooking = async (booking : Booking) => {
    try {
        const response = await api.post(`/booking/create`, booking)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getBookingByBuildingId = async ( buildingId : string ) => {
    try {
        const response = await api.get(`/booking/getbookingbybuildingid?id=${buildingId}`)
        useBookingStore.getState().clearBookings()
        useBookingStore.getState().setBookings(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getBookingByRoomId = async ( roomId : string ) => {
    try {
        const response = await api.get(`/booking/`)
    } catch (error) {
        console.log(error)
    }
}

export const updateBookingById = async ( booking : Booking ) => {
    try {
        const response = await api.put(`/booking/update?id=${booking.id}`, booking)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteBookingById = async ( bookingId : string ) => {
    try {
        const response = await api.delete(`booking/delete?id=${bookingId}`)
        console.log(response.data.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}