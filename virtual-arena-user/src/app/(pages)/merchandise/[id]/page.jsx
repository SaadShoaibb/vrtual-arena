'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '@/Store/ReduxSlice/productSlice'
import MerchandiseDetail from '../MerchandiseDetail'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import AuthModel from '@/app/components/AuthModal'
import AuthComponents from '@/app/components/AuthComponents'

const MerchandiseDetailPage = ({ params }) => {
  const productId = params.id
  const dispatch = useDispatch()
  const { singleProduct, singleProductStatus, error } = useSelector(state => state.products)
  const { showModal } = useSelector(state => state.modal)

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId))
    }
  }, [dispatch, productId])

  return (
    <>
      <div className="relative">
        <Navbar />
        <HeroHeader
          btn='Shop'
          title='Shop'
          bg='bg-pricingbg'
        />
        {singleProductStatus === 'loading' ? (
          <div className="w-full h-[50vh] flex justify-center items-center bg-blackish">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : singleProductStatus === 'failed' ? (
          <div className="w-full h-[50vh] flex justify-center items-center bg-blackish">
            <div className="text-white text-center">
              <h2 className="text-xl font-bold">Failed to load product</h2>
              <p>{error || "Something went wrong"}</p>
            </div>
          </div>
        ) : singleProduct ? (
          <MerchandiseDetail product={singleProduct} />
        ) : (
          <div className="w-full h-[50vh] flex justify-center items-center bg-blackish">
            <div className="text-white text-center">
              <h2 className="text-xl font-bold">Product not found</h2>
            </div>
          </div>
        )}
        <Connected />
        <Footer />
      </div>
      {showModal && (
        <AuthModel>
          <AuthComponents />
        </AuthModel>
      )}
    </>
  )
}

export default MerchandiseDetailPage
