import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom';



const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});
 
const ViewLeaveFiels = () => {
    const {id} = useParams();

  return (
    <div>
      <h1>View Leave Files</h1>
    </div>
  )
}

export default ViewLeaveFiels
