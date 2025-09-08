
import { useState,useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";



export function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState([]);
    const [availableTriggers, setAvailableTriggers] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))
            console.log(availableTriggers)
        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(x => setAvailableActions(x.data.availableActions))
            console.log()
    }, [])

    return {
        availableActions,
        availableTriggers
    }
}