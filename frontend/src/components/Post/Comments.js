import React from 'react'

export const Comments = ({ comment }) => {
    return (
        <div className='comments text-start my-3'>
            <div className=' d-flex align-items-center gap-1'>
                <img src={comment?.user?.image?.url} alt='user' width='32' height='32' className='rounded-circle' />
                <p className="card-text">@{comment?.user?.username}</p>
            </div>
            <div>
                {comment.text}
            </div>
        </div>
    )
}
