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
        useBookingStore.getState().clearBookings()
        console.log(error)
    }
}

export const getBookingByRoomId = async ( roomId : string ) => {
    try {
        const response = await api.get(`/booking/`)
        return response.data;
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
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getRoomsByBuildingIdAndStatus = async (
  buildingId: string,
  status: number
) => {
  try {
    const response = await api.get(
      `/room/getroombybuildingidandstatus?BuildingId=${buildingId}&status=${status}`
    );

    const rooms = response.data?.data || []; 
    console.log("Danh sách phòng:", rooms); 
    return rooms; 
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng:", error);
    return [];
  }
};

export const getBuildingByRoomId = async (
    RoomId: string,
  ) => {
    try {
      const response = await api.get(
        `/building/getbuildingbyroomid?id=${RoomId}`
      );
      const building = response.data; 
      return building; 
    } catch (error) {
      console.error("Lỗi khi lấy building:", error);
      return [];
    }
  };



