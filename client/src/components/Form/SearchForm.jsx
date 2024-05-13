import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchForm = ()=>{
    const [values,setValues] = useSearch();
    const router = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.get(`http://localhost:5000/api/v1/product/search/${values.keyword}`);
            setValues({...values,results:data});
            router("/search")
        } catch (error) {
            console.log(error)
        }
    }
    return(
      <div>
        <form role="search" onSubmit={handleSubmit} className="d-flex search-form">

            <input
             type="search" 
             className="form-control me-2"  placeholder="Search" aria-label="Search" value={values.keyword}
            onChange={(e)=>setValues({...values,keyword:e.target.value})}/>

            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    )

}

export default SearchForm;