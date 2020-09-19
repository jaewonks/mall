import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'

function FileUpload(props) {

    const [Images, setImages] = useState([]) //array
    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        //이미지를 올렸을때
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                    setImages([...Images,response.data.filePath])
                    props.refreshFunction([...Images,response.data.filePath])
                } else {
                    alert('Fail to save file')
                }
            })
        //formData에 정보를 받아와서 config 어떠한 파일인가에 대한 컨텐츠 타입에 대한 정의를 해줘서
        //백엔드에서 에러가 없이 받을 수 있게 하는 것
    }  
    
    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <section>
                        <div 
                            style ={{
                                width:300, height:240, border: '1px solid lightgray',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type='plus' style={{ fontSize: '3rem' }} />
                        </div>
                    </section>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', heigh: '240px', overflowX:'scroll' }}>
                
                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}> 
                        <img style = {{ minWidth: '300px', width:'300px', height:'240px' }}
                            src={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload
