import React, { useState } from "react";
import { Modal } from 'antd'
import './UploadPost.css'
import { CropImage } from "./CropImage";
import axios from "axios";
import { ErrorMessage, SuccessMessage } from "../Messages/Messages";
import { Loading } from "../Loading/Loading";

export const UploadPost = ({ update }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [file, setFile] = useState('');
    const [video, setVideo] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0])
    }

    const croppedImage = (image) => {
        setFile(image);
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!file && !video) {
            ErrorMessage('Upload Image or Video');
        } else {
            let data = new FormData();
            if (file) {
                data.append('file', file);
            } else {
                data.append('file', video);
            }
            data.append('description', description);

            await axios.post('/api/post/upload', data, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                setLoading(false)
                if (res.status === 200) {
                    SuccessMessage(res.data.successMessage);
                    update();
                } else {
                    ErrorMessage(res.data.errorMessage);
                }
            }).catch(err => {
                setLoading(false)
                ErrorMessage('Error' + err);
            })
        }
    }

    return (
        <div className='UploadPost'>
            <div className='add-post-btn'>
                <button className='btn' onClick={showModal}>Add New Post!</button>
            </div>
            <Modal destroyOnClose footer={false} visible={isModalVisible} onCancel={handleCancel}>
                <div className='text-center uploadForm mt-3'>
                    {
                        loading ?
                            <Loading />
                            :
                            <>
                                <div>
                                    <CropImage croppedImage={croppedImage} />
                                </div>
                                <div className='my-2'>
                                    <span className="btn btn-file">
                                        <button className='btn upload-file-btn'>Upload Video</button>
                                        <input type="file" accept='.mp4' name='file' onChange={handleVideoChange} />
                                        {
                                            video &&
                                            <video src={URL.createObjectURL(video)} autoPlay className='w-100 my-4' />
                                        }
                                    </span>
                                </div>
                                <div>
                                    <div className="">
                                        <textarea required className="form-control" placeholder="Description" onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </div>
                                <div className='upload my-3'>
                                    <button className='btn' onClick={submitHandler}>Upload</button>
                                </div>
                            </>
                    }
                </div>
            </Modal>
        </div>
    )
}
