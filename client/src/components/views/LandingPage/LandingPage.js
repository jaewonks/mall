import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Icon, Col, Row } from 'antd'
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Sections/CheckBox'
import { continents } from './Sections/Datas'

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([])    
    const [Skip, setSkip] = useState(0) 
    const [Limit, setLimit] = useState(8) 
    const [PostSize, setPostSize] = useState(0) 
    const [Filters, setFilters] = useState({
        continents:[],
        price:[]
    }) 

        useEffect(() => {
        
        let body = {
            skip:Skip,
            limit:Limit
        }    
        getProducts(body)
        
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success){
                    if(body.loadMore){
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('상품을 가져오는데 실패했습니다.')
                }
            })
    }

    const leadMoreHandler = () => {

        let skip = Skip + Limit;

        let body = {
            skip:skip,
            limit:Limit,
            loadMore:true
        }    
        getProducts(body)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
        <Card 
                cover={<ImageSlider images={product.images}/>}
                >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>     
})
    const showFilteredResults = (filters) => {
        let body = {
            skip:0,
            limit:Limit,
            filters:filters
        }    
        getProducts(body)
        setSkip(0)
        
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}
        newFilters[category] = filters
        showFilteredResults(newFilters)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign:'center' }}>
                <h2>FAIR N' SQUARE<Icon type="rocket"/></h2>
            </div>
            <div>
            {/* Filter */}
            {/* CheckBox for continents */}
            <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
            {/* Radio for Price */}
            {/* Search */}
            <Row gutter={[16,16]}>    
                {renderCards}
            </Row>
            </div>
            <br />
            <br />
            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={leadMoreHandler}>See more</button>
                </div>
            }
        </div>
    )
}

export default LandingPage
