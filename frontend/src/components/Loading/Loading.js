import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd'
import React from 'react'

export const Loading = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '19px' }}>
            <Spin indicator={antIcon} />
        </div>
    )
}
