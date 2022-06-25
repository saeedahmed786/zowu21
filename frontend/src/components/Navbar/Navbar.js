import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';
import './Navbar.css';
import { Input } from 'antd';

export const Navbar = ({ searchHanlder }) => {
  const [search, setSearch] = useState('');
  return (
    <div className='main-nav'>
      <nav className="navbar fixed-top">
        <Link className="navbar-brand" to="/"></Link>
        <div>
          <ul className="d-flex gap-2 align-items-center ml-auto mr-5 list-unstyled pt-3">
            <li className='nav-item search d-flex align-items-center'>
              <Input size="large" prefix={<i className="fa-solid fa-magnifying-glass"></i>} onChange={(e) => setSearch(e.target.value)} />
              <button className='btn' onClick={() => searchHanlder(search)}><i className="fa-solid fa-magnifying-glass"></i></button>
            </li>
            <li className='nav-item profile text-center'>
              <Link to={isAuthenticated() ? '/user' : '/login'}>
                <img src={isAuthenticated() ? isAuthenticated()?.image?.url : '/assets/user.png'} width='43' height='43' alt='image' className='rounded-circle' />
              </Link>
            </li>
          </ul>
        </div>
      </nav >
    </div >
  )
}
