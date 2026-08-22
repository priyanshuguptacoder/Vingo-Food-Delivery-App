import axios from "axios"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    setCurrentAddress,
    setCurrentCity,
    setCurrentState
} from "../redux/userSlice"
import { setAddress, setLocation } from "../redux/mapSlice"

function useGetCity() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported")
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    console.log("Location received:", position)

                    const latitude = position.coords.latitude
                    const longitude = position.coords.longitude

                    dispatch(
                        setLocation({
                            lat: latitude,
                            lon: longitude
                        })
                    )

                    const result = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
                    )

                    const location = result?.data?.results?.[0]

                    if (!location) {
                        console.log("Location details not found")
                        return
                    }

                    const city =
                        location.city ||
                        location.county ||
                        location.town ||
                        location.village

                    const state = location.state || ""

                    const address =
                        location.address_line2 ||
                        location.address_line1 ||
                        ""

                    dispatch(setCurrentCity(city || ""))
                    dispatch(setCurrentState(state))
                    dispatch(setCurrentAddress(address))
                    dispatch(setAddress(address))

                    console.log("Detected city:", city)
                    console.log("Detected state:", state)
                    console.log("Detected address:", address)

                } catch (error) {
                    console.error(
                        "Reverse geocoding error:",
                        error
                    )
                }
            },
            (error) => {
                console.log(
                    "Location permission/error:",
                    error.message
                )
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }, [userData, apiKey])

    return null
}

export default useGetCity
