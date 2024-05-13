import { useState,useEffect } from "react";
import axios from 'axios';

export default function useCategory(){
    const[categories,setCategories] = useState([]);

    const getCategories = async()=>{
        try {
            const{data} = await axios.get("http://localhost:5000/api/v1/category/category");
            setCategories(data?.category);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getCategories()
    },[]);

    return categories
}