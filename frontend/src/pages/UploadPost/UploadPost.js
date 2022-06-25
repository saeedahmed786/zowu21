import React, { useState } from "react";
import { Modal } from 'antd'
import './UploadPost.css'
import { CropImage } from "./CropImage";
import axios from "axios";
import { ErrorMessage, SuccessMessage } from "../../components/Messages/Messages";
import { Loading } from "../../components/Loading/Loading";
import ReactQuill from 'react-quill';
import { TreeSelect } from 'antd';
import { data } from "../../categories";
const { TreeNode } = TreeSelect;

export const UploadPost = (props) => {
    const [file, setFile] = useState('');
    const [video, setVideo] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');


    const handleVideoChange = (e) => {
        setFile(e.target.files[0])
    }

    const croppedImage = (image) => {
        setFile(image);
    }

    console.log(file)

    const submitHandler = async () => {
        if (!file) {
            ErrorMessage('Upload Image or Video');
        }
        else if (!category) {
            ErrorMessage('Category is required');
        }
        else if (!description) {
            ErrorMessage('Description is required');
        }
        else {
            setLoading(true);
            let data = new FormData();
            data.append('file', file);
            data.append('description', description);
            data.append('category', category);

            await axios.post('/api/post/upload', data, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                setLoading(false)
                if (res.status === 200) {
                    SuccessMessage(res.data.successMessage);
                    props.history.push('/user');
                } else {
                    ErrorMessage(res.data.errorMessage);
                }
            }).catch(err => {
                setLoading(false)
                ErrorMessage('Error' + err);
            })
        }
    }

    const onChange = (newValue) => {
        setCategory(newValue);
    };

    return (
        <div className='UploadPost'>
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
                                        file && file.type == 'video/mp4' &&
                                        <video src={URL.createObjectURL(file)} autoPlay className='w-100 my-4' />
                                    }
                                </span>
                            </div>
                            <div className='my-4'>
                                <TreeSelect
                                    showSearch
                                    style={{
                                        width: '80%',
                                    }}
                                    dropdownStyle={{
                                        maxHeight: 400,
                                        overflowY: 'auto',
                                    }}
                                    placeholder="Please choose category..."
                                    allowClear
                                    onChange={onChange}
                                >
                                    {
                                        data && data.length > 0 && data.map(d => {
                                            return (
                                                <TreeNode value={d.name} title={d.name}>
                                                    {
                                                        d.categories && d.categories.length > 0 && d.categories.map(cat => {
                                                            return (
                                                                <TreeNode value={cat.name} title={cat.name}>
                                                                    {
                                                                        cat.subCategories && cat.subCategories.length > 0 && cat.subCategories.map(subCat => {
                                                                            return (
                                                                                <TreeNode value={subCat.name} title={subCat.name}>
                                                                                    {
                                                                                        subCat.subSubCategories && subCat.subSubCategories.length > 0 && subCat.subSubCategories.map(subSubCat => {
                                                                                            return (
                                                                                                <TreeNode value={subSubCat.name} title={subSubCat.name} />
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </TreeNode>
                                                                            )
                                                                        })
                                                                    }
                                                                </TreeNode>
                                                            )
                                                        })
                                                    }
                                                </TreeNode>
                                            )
                                        })
                                    }
                                </TreeSelect>
                            </div>
                            <div>
                                {/* <textarea required className="form-control" placeholder="Description" onChange={(e) => setDescription(e.target.value)}></textarea> */}
                                <ReactQuill placeholder="Description" theme="snow" onChange={(value) => setDescription(value)} />
                            </div>
                            <div className='upload my-3'>
                                <button className='btn' onClick={submitHandler}>Upload</button>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}
