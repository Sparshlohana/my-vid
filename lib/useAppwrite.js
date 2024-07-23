import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fn();
            setData(res)
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsLoading(false)
        }
    }
    const reFetch = () => fetchData();


    return { data, reFetch, isLoading }
}

export default useAppwrite;