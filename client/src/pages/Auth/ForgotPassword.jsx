import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import "../../styles/AuthStyles.css"
import Layout from '../../components/Layout/Layout';

const ForgotPassword = () => {
            
            const[inputs,setInputs] = useState({email:"",newPassword:"",answer:""})

  const router = useNavigate()

  const handleChange = (event)=>{
    setInputs({...inputs,[event.target.name]:event.target.value})
  }

  const handleSubmit = async(event)=>{
    event.preventDefault()
    try {
        const res = await axios.post("http://localhost:5000/api/v1/user/forgot-pass",{inputs})
        if(res.data.success){
            toast.success(res.data.message)
            router("/login");

        }else{
            toast.error(res.data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error("something went wrong")
    }
  }
  return (
    <Layout title="Forgot Password-Ecommer App">
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h4 className="title mb-2 font-bold">RESET PASSWORD</h4>
        
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter Your email"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
            <input
              type="text"
              name="answer"
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your favorite Sport Name "
              required
            />
          </div>
        <div className="mb-3">
          <input
            type="password"
            name="newPassword"
            className="form-control"
            placeholder="Enter Your password"
            required
            onChange={handleChange}
          />
        </div>
        
        
        <button type="submit" className="btn btn-primary">
          RESET
        </button>
      </form>
    </div>
  </Layout>
  )
}

export default ForgotPassword