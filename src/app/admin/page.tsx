"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from '@/components/product-items';

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/product/all')
      .then(response => setData(response.data.result.content))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className='font-cormorant text-teal-600 p-6'>
      <h1 className="text-2xl font-bold">ADMIN PAGE</h1>
      <ul className="mt-4 text-pink-400">
        {data.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </ul>
    </div>
  );
};

export default Page;
