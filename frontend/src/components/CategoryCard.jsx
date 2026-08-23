import React from 'react'

function CategoryCard({name, image, onClick}) {
  return (
    <div className='w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-2xl border border-gray-100 shrink-0 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer' onClick={onClick}>
     <img src={image} alt={name} className='w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500'/>
     <div className='absolute bottom-0 w-full left-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-3 text-center'>
       <p className='text-sm font-semibold text-white truncate shadow-sm capitalize'>{name}</p>
     </div>
    </div>
  )
}

export default CategoryCard
