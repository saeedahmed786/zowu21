import React, { useState, useEffect } from 'react'
import { Post } from '../../components/Post/Post'
import './UserPage.css'
import axios from 'axios'
import { ErrorMessage } from '../../components/Messages/Messages';
import { isAuthenticated, logout } from '../../components/auth/auth'
import { Navbar } from '../../components/Navbar/Navbar'
import { UpdateProfile } from '../../components/UpdateProfile'
import { LogoutOutlined } from '@ant-design/icons';

export const Userpage = (props) => {
    const [data, setData] = useState({});
    const [user, setUser] = useState({});

    const getData = async () => {
        await axios.get(`/api/post/user/${isAuthenticated()._id}`).then(res => {
            console.log(res.data)
            if (res.status === 200) {
                setData(res.data)
            } else {
                ErrorMessage(res.data.errorMessage);
            }
        })
    }

    const getUser = async () => {
        await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setUser(res.data)
            } else {
                ErrorMessage(res.data.errorMessage);
            }
        })
    }


    useEffect(() => {
        getUser();
        getData();

        return () => {

        }
    }, []);


    const update = () => {
        getData();
    }

    const updateUserData = () => {
        getUser();
    }


    const searchHanlder = async (text) => {
        text ?
            setData(data.filter(d => d.description?.toLowerCase()?.includes(text.toLowerCase())))
            :
            getData();
    }


    return (
        <>
            <Navbar searchHanlder={searchHanlder} />
            <div className='Userpage'>
                <div className='UploadPost'>
                    <div className='add-post-btn'>
                        <button className='btn' onClick={() => props.history.push('/add-post')}>Add New Post!</button>
                    </div>
                </div>
                <div className='row m-5 text-center'>
                    <div className='col-md-12 user-info mb-5'>
                        <img src={user?.image?.url ? user.image.url : '/assets/user.png'} alt='Profile Picture' />
                        <h6>@{user.username}</h6>
                        <h3>{user.fullName}</h3>
                        <p className='desc'>{user?.description}</p>
                        <div className='my-3'>
                            <UpdateProfile user={user} update={updateUserData} />
                        </div>
                        <div className='my-3'>
                            <button className='btn' onClick={() => logout(() => { props.history.push('/login') })}>Logout</button>
                        </div>
                    </div>
                    {
                        data && data.length > 0 && data.map(post => {
                            return (
                                <div className='col-md-3 mb-5' key={post._id}>
                                    <Post post={post} update={update} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}
