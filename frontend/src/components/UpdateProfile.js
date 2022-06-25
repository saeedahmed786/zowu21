import { Modal } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { isAuthenticated } from './auth/auth';
import { Loading } from './Loading/Loading';
import { ErrorMessage, SuccessMessage } from './Messages/Messages';

export const UpdateProfile = ({ user, update }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');

    console.log(user);

    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        description: ''
    });

    const { fullName, username, description } = userData;

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }


    const handleImageChange = (e) => {
        setFile(
            e.target.files[0]
        );
    }

    const showModal = () => {
        setIsModalVisible(true);
        setUserData(user);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = new FormData();
        data.append('fullName', fullName);
        data.append('username', username);
        data.append('description', description);
        if (file) {
            data.append('file', file);
        }
        await axios.put(`/api/users/update/${isAuthenticated()._id}`, data, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                SuccessMessage(res.data.successMessage);
                update();
            }
            else {
                ErrorMessage(res.data.errorMessage);
            }
        })

    };


    return (
        <div>
            <button className='btn' onClick={showModal}>Edit</button>
            <Modal title="Update Profile" footer={false} visible={isModalVisible} onCancel={handleCancel}>
                {
                    loading ?
                        <Loading />
                        :
                        <form onSubmit={submitHandler} className='update-profile'>
                            <div className='update-file text-center'>
                                <span className="btn btn-file">
                                    {
                                        file ?
                                            <img src={file && URL.createObjectURL(file)} alt='user' width='100' className='rounded-circle' />
                                            :
                                            <img src={user.image?.url} alt='user' width='100' />
                                    }
                                    <input type="file" name='file' onChange={handleImageChange} />
                                </span>
                            </div>
                            <div className="form-floating mb-3">
                                <input required type="text" name='username' value={username} className="form-control" id="username" placeholder="Add Username" onChange={handleChange} />
                                <label for="username">Add Username</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input required type="text" name='fullName' value={fullName} className="form-control" id="fullName" placeholder="Add Name" onChange={handleChange} />
                                <label for="fullName">Add Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea required type="text" name='description' value={description} className="form-control" id="about" placeholder="Share about yourself" onChange={handleChange} />
                                <label for="about">Share about yourself</label>
                            </div>
                            <div className='my-3 text-center'>
                                <button className='btn submit-btn w-25'>Save</button>
                            </div>
                        </form>
                }
            </Modal>
        </div>
    )
}
