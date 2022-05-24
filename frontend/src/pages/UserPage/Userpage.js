import React, { useState, useEffect } from 'react'
import { Post } from '../../components/Post/Post'
import { UploadPost } from '../../components/UploadPost/UploadPost'
import './UserPage.css'
import axios from 'axios'
import { ErrorMessage } from '../../components/Messages/Messages';
import { isAuthenticated } from '../../components/auth/auth'

export const Userpage = () => {
    const user = isAuthenticated();
    const [data, setData] = useState({});

    const getData = async () => {
        await axios.get(`/api/post/user/${user._id}`).then(res => {
            console.log(res.data)
            if (res.status === 200) {
                setData(res.data)
            } else {
                ErrorMessage(res.data.errorMessage);
            }
        })
    }


    useEffect(() => {
        getData();

        return () => {

        }
    }, []);


    const update = () => {
        getData();
    }


    return (
        <div className='Userpage'>
            <UploadPost update={update} />
            <div className='row m-5 text-center'>
                <div className='col-md-12 user-info mb-5'>
                    <img src={user?.image?.url ? user.image.url : '/assets/user.png'} alt='Profile Picture' />
                    <h6>@{user.username}</h6>
                    <h3>{user.fullName}</h3>
                    <p className='desc'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a malesuada magna, non volutpat ex. Nullam dictum eget nisi eget tristique. Aenean eget enim tristique, rhoncus sem id, rutrum augue. Donec cursus at erat ac imperdiet. Vestibulum faucibus lacus quam, vitae ullamcorper leo viverra sed.</p>
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
    )
}
