import api from "../axios";

export const getAllBooking = async () => {
    try {
        const response = api.get(`/booking/bookingall`)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}