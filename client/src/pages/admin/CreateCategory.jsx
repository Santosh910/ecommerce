import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from '../../components/Form/CategoryForm';
import {Modal} from 'antd'

const CreateCategory = () => {
  const[categories,setCategories] = useState([]);
  const [name,setName] = useState("");
  const[visible,setVisible] = useState("");
  const[selected,setSelected] = useState("");
  const[updateName,setUpdateName] = useState("");

  const handleSubmit = async(event)=>{
    event.preventDefault()
    try {
      const {data} = await axios.post("http://localhost:5000/api/v1/category/create-category",{name})

      if(data?.success){
        toast.success(`${name} is created`)
        getAllCategory();
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllCategory = async()=>{
    try {
      const{data} = await axios.get("http://localhost:5000/api/v1/category/category");
      if(data?.success){
        setCategories(data?.category)
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in getting category");
    }
  }

  useEffect(()=>{
    getAllCategory();
  },[])

  const handleUpdate = async(event)=>{
    event.preventDefault();
    try {
      const {data} = await axios.put(`http://localhost:5000/api/v1/category/update-category/${selected._id}`,{name:updateName})
      if(data?.success){
        toast.success(`${updateName}is updated`)
        setSelected(null);
        setUpdateName("");
        setVisible(false);
        getAllCategory();
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async(pId)=>{
    try {
      const {data} = await axios.delete(`http://localhost:5000/api/v1/category/delete-category/${pId}`);
      if(data.success){
        toast.success(`category is deleted`)
        getAllCategory()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
       toast.error("Somtihing went wrong");
    }
  }
  return (
    <Layout title={"Dashboard - Create Category"}>
        <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
            <div className="col-md-3">
                <AdminMenu/>
            </div>
            <div className="col-md-9">
                <h1>Manage Category</h1>
                <div className="p-3 w-50">
                  <CategoryForm
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                  />
                </div>
                <div className="w-75">
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories?.map((c)=>(
                        <>
                          <tr>
                            <td key={c._id}>{c.name}</td>
                            <td>
                              <button className='btn btn-primary ms-2' onClick={()=>{
                                setVisible(true);
                                setUpdateName(c.name);
                                setSelected(c);
                              }}>Edit</button>
                              <button className='btn bg-red-500 ms-2' onClick={()=>{handleDelete(c._id)}}>Delete</button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Modal
                 onCancel={()=>setVisible(false)}
                 footer={null}
                 visible={visible}
                >
                  <CategoryForm 
                   value={updateName}
                   setValue={setUpdateName}
                   handleSubmit={handleUpdate}
                  />
                </Modal>
            </div>
        </div>
        </div>
    </Layout>
  )
}

export default CreateCategory