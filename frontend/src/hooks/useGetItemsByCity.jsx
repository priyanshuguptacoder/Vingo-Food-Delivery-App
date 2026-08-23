import axios from "axios"
import React, { useEffect } from "react"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from "react-redux"
import { setItemsInMyCity } from "../redux/userSlice"

function useGetItemsByCity() {
    const dispatch = useDispatch()
    const { currentCity, userData } = useSelector(state => state.user)

    useEffect(() => {
        if (!userData) return;
        const fetchItems = async () => {
            try {
                const city = currentCity?.trim() || "NoCity"

                const result = await axios.get(
                    `${serverUrl}/api/item/get-by-city/${encodeURIComponent(city)}`,
                    {
                        withCredentials: true
                    }
                )

                dispatch(setItemsInMyCity(result.data))

                console.log("Items:", result.data)

            } catch (error) {
                console.log(
                    "FETCH ITEMS ERROR:",
                    error.response?.data || error.message
                )
            }
        }

        fetchItems()
    }, [currentCity])

    return null
}

export default useGetItemsByCity
