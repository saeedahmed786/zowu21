import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ErrorMessage } from '../../components/Messages/Messages';
import { Navbar } from '../../components/Navbar/Navbar';
import { Post } from '../../components/Post/Post'

export const Home = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        await axios.get('/api/post/get').then(res => {
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
    }, [])

    const update = () => {
        getData();
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
            <div className='home row m-5'>
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
        </>
    )
}
