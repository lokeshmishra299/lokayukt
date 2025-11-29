import axios from 'axios';
import React, { useEffect, useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});


const CoverMeta = () => {

    const [allCoplaints, setAllComplaints] = useState([])

    const getAllComplaints = async()=>{
        try {
            const res = await api.get("/operator/all-complaints")
            console.log("Data jsjs", res.data.data)
            setAllComplaints(res.data.data)
        } catch (error) {
            console.log("Error", error)
        }
    }

    useEffect(()=>{
        getAllComplaints()
    }, [])
  return (
    <div>
        {
            allCoplaints?.map((items)=>(
                <div>
                    <h1>complaiut id{items.complain_no}</h1>
                </div>
            ))
        }
    </div>
  )
}

export default CoverMeta