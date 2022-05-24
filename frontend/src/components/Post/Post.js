import React, { useState } from 'react'
import './Post.css'
import { LikeFilled } from '@ant-design/icons'
import { Comments } from './Comments'
import { Link, useHistory } from 'react-router-dom'
import { isAuthenticated } from '../auth/auth'
import { ErrorMessage, SuccessMessage } from '../Messages/Messages'
import axios from 'axios'
import { Modal } from 'antd'

export const Post = ({ post, update }) => {
    const history = useHistory();
    const [showComments, setShowComments] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [comment, setComment] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showCommentsHandler = () => {
        setShowComments(true);
    }

    const hideCommentsHandler = () => {
        setShowComments(false);
    }

    const addLike = async (e) => {
        e.stopPropagation();
        isAuthenticated() ?
            post?.likes.length > 0 && post?.likes.filter(f => f == isAuthenticated()._id)?.length > 0 ?
                await axios.delete(`/api/post/remove/like/${post._id}`, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    if (res.status === 200) {
                        SuccessMessage(res.data.successMessage);
                        update();
                    } else {
                        ErrorMessage(res.data.errorMessage);
                    }
                })
                :
                await axios.post(`/api/post/add/like/${post._id}`, { postId: post._id }, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    if (res.status === 200) {
                        SuccessMessage(res.data.successMessage);
                        update();
                    } else {
                        ErrorMessage(res.data.errorMessage);
                    }
                })
            :
            ErrorMessage('Login to like post');
    }

    const addView = async (e) => {
        console.log('jhkw')
        e.stopPropagation();
        isAuthenticated() &&
            post?.views && post?.views.filter(f => f == isAuthenticated()._id)?.length === 0 &&
            await axios.post(`/api/post/add/view/${post._id}`, { postId: post._id }, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.status === 200) {
                    SuccessMessage(res.data.successMessage);
                    update();
                } else {
                    ErrorMessage(res.data.errorMessage);
                }
            })
    }

    const submitHandler = async () => {
        isAuthenticated() && isAuthenticated().role === 0 ?
            await axios.post(`/api/post/add/comment/${post._id}`, { text: comment }, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.status === 200) {
                    SuccessMessage(res.data.successMessage);
                    setComment('');
                    update();
                } else {
                    ErrorMessage(res.data.errorMessage);
                }
            })
            :
            ErrorMessage('Login to leave comment');
    }

    return (
        <div className='post'>
            <div className='main'>
                <div className="card">
                    {
                        post.file?.url.substring(post.file?.url.length - 3, post.file?.url.length) === 'mp4' ?
                            <video className="card-img-top" src={post.file?.url} autoPlay alt='Post Video' />
                            :
                            <img className="card-img-top" src={post.file?.url} alt="Post Photo" />
                    }

                    <div className="card-img-overlay">
                        {
                            showComments ?
                                <div className='comments-shown'>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='my-2 d-flex align-items-center gap-1'>
                                            <img src={post.user?.image?.url} alt='user' width='32' height='32' className='rounded-circle' />
                                            <p className="card-text">@{post.user?.username}</p>
                                        </div>
                                        <div>
                                            <i class="fa-solid fa-xmark" onClick={hideCommentsHandler}></i>
                                        </div>
                                    </div>
                                    <div className='description text-start'>
                                        {post.description}
                                    </div>
                                    {
                                        post?.comments && post?.comments.length > 0 && post.comments.map(c => {
                                            return (
                                                <Comments comment={c} />
                                            )
                                        })
                                    }
                                </div>
                                :
                                <>
                                    <a onClick={(e) => { showCommentsHandler(); addView(e); }} className='comments-hidden'>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div>
                                                <a className='views' onClick={(e) => e.stopPropagation()}>{post?.views?.length} views</a>
                                                <Link onClick={(e) => { e.stopPropagation(); history.push('/user') }} className='my-2 d-flex align-items-center gap-1'>
                                                    <img src={post.user?.image?.url} alt='user' width='32' height='32' className='rounded-circle' />
                                                    <p className="card-text">@{post.user?.username}</p>
                                                </Link>
                                            </div>
                                            <div>
                                                <a className='reactions' onClick={addLike}>
                                                    <a className='views'>{post.likes?.length}</a>
                                                    <LikeFilled />
                                                </a>
                                                <div className='my-2'>
                                                    <a className='reactions'>
                                                        <a className='views'>{post.comments?.length}</a>
                                                        <i class="fa-solid fa-message text-white" onClick={(e) => { showModal(); e.stopPropagation() }}></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </>
                        }
                    </div>
                </div>
                <Modal zIndex={1000} footer={false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <div className='postComments'>
                        <div className="mt-5">
                            <textarea value={comment} className="form-control" placeholder="Leave a comment" onChange={(e) => setComment(e.target.value)}></textarea>
                        </div>
                        <div className='my-3 text-center'>
                            <button className='btn' onClick={submitHandler}>Submit</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}
