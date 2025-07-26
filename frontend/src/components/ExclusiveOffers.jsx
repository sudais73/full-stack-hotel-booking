import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30'>
      <div className='flex flex-col md:flex-row items-center w-full justify-between '>
        <Title align='left' title='Exclusive Offers' subTitle='Voluptatibus hic eos suscipit amet atque impedit tempore recusandae autem, nulla porro minima laboriosam quod tenetur veritatis. Voluptates dignissimos nemo earum autem!' />
        <button className='flex gap-1 items-center group cursor-pointer'>
            View All Offers <img src={assets.arrowIcon} alt="" className='group-hover:translate-x-1 transition-all' />
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
        {exclusiveOffers.map((item)=>(
            <div key={item._id} className='group relative flex flex-col items-start justify-between 
            gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center' style={{backgroundImage:`url(${item.image})`}}>
                <p className='px-3 PY-1 absolute top-4 
                text-xl bg-white text-gray-800 font-medium rounded-full'>{item.priceOff}%OFF</p>
                <div>
                    <p className='text-2xl font-medium'>{item.title}</p>
                    <p >{item.description}</p>
                    <p className='text-xs text-white/70 mt-3'>Expires {item.expiryDate}</p>
                   
                </div>
                 <button className='flex gap-2 items-center group cursor-pointer mt-4 mb-3 font-medium'>
            View  Offers <img src={assets.arrowIcon} alt="" className='invert group-hover:translate-x-1 transition-all' />
        </button>
            </div>
        ))}
      </div>
    </div>
  )
}

export default ExclusiveOffers
