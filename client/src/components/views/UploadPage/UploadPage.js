import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import FileUpload from '../../utils/FileUpload'
import axios from 'axios';

const { TextArea } = Input;

const Continents = [ //items
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" }
]

function UploadPage(props) {

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState("")
    const [Continent, setContinent] = useState("1") //기본값 옵션1
    const [Images, setImages] = useState([]) //array

 
    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)     
    }
    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }
    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }
    const continentSelectChangeHandler = (event) => {
        setContinent(event.currentTarget.value)
    }
    const updateImages = (newImages) => {
        setImages(newImages)
    }
    const submitHandler = (event) => {
        event.preventDefault();

        if (!Title || !Description || !Price ||
            !Continent || !Images) {
            return alert('fill all the fields first!')
        }

        //서버에 채운 값들을 request로 보낸다
        const body = {
            //로그인된 사람의 ID
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price, 
            images: Images, 
            contients: Continent
        }

        axios.post("/api/product", body)
            .then(response => {
                if(response.data.success){
                    alert("Success to upload")
                    props.history.push("/")
                } else {
                    alert("Fail to upload")
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2> Upload Product</h2>
                    </div>


                    <Form onSubmit={submitHandler}>

                        {/* DropZone */}
                        <FileUpload refreshFunction={updateImages}/>

                        <br />
                        <br />
                        <label>Title</label>
                        <Input
                            onChange={titleChangeHandler}
                            value={Title}
                        />
                        <br />
                        <br />
                        <label>Description</label>
                        <TextArea
                            onChange={descriptionChangeHandler}
                            value={Description}
                        />
                        <br />
                        <br />
                        <label>Price($)</label>
                        <Input
                            onChange={priceChangeHandler}
                            value={Price}
                            type="number"
                        />
                        <br /><br />
                        <select onChange={continentSelectChangeHandler} value={Continent}>
                            {Continents.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <br />
                        <br />

                        <Button onClick={submitHandler} >
                            Submit
                        </Button>

                    </Form>

                </div>
            )
        }

export default UploadPage
