import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';

export const CropImage = ({ croppedImage }) => {
    const [fileList, setFileList] = useState([]);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onPreview = async (file) => {
        let src = file.url;

        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);

                reader.onload = () => resolve(reader.result);
            });
        }

        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    const handleUpload = (image) => {
        croppedImage(image.file);
    }

    return (
        <ImgCrop rotate>
            <Upload
                customRequest={handleUpload}
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
            >
                {
                    fileList.length == 0 &&
                    <span className="btn btn-file">
                        <button className='btn upload-file-btn'>Upload Image</button>
                    </span>
                }
            </Upload>
        </ImgCrop>
    );
};
