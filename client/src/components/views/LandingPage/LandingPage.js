import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Icon, Col, Row } from 'antd'
import ImageSlider from '../../utils/ImageSlider'

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([])    
        useEffect(() => {

        axios.post('/api/product/products')
            .then(response => {
                if(response.data.success){
                    setProducts(response.data.productInfo)
                } else {
                    alert('상품을 가져오는데 실패했습니다.')
                }
            })
    }, [])

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

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign:'center' }}>
                <h2>FAIR N' SQUARE<Icon type="rocket"/></h2>
            </div>
            {/* Filter */}
            {/* Search */}
            <Row gutter={[16,16]}>
            {renderCards}
            </Row>
            <div style={{ display:'flex', justifyContent:'center' }}>
                <button>See more</button>
            </div>
        </div>
    )
}

export default LandingPage
