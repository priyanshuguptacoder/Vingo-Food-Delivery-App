import axios from "axios"
import React, { useEffect } from "react"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from "react-redux"
import { setShopsInMyCity } from "../redux/userSlice"

function useGetShopByCity() {
    const dispatch = useDispatch()
    const { currentCity, userData } = useSelector(state => state.user)

    useEffect(() => {
        if (!userData) return;
        const fetchShops = async () => {
            try {
                const city = currentCity?.trim() || "NoCity"

                const result = await axios.get(
                    `${serverUrl}/api/shop/get-by-city/${encodeURIComponent(city)}`,
                    {
                        withCredentials: true
                    }
                )

                dispatch(setShopsInMyCity(result.data))

                console.log("Shops:", result.data)

            } catch (error) {
                console.log(
                    "FETCH SHOPS ERROR:",
                    error.response?.data || error.message
                )
            }
        }

        fetchShops()
    }, [currentCity])

    return null
}

export default useGetShopByCity
