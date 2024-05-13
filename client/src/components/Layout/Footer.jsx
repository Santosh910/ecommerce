import React from 'react'
import {Link} from "react-router-dom"

const Footer = () => {
  return (
    <div className='footer'>
      <h1 className='text-center'>All Right Reserved &copy; SanInfo</h1>
      <p className='flex text-center'>
          <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|<Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  )
}

export default Footer