import React from 'react';
import { Calendar, ShoppingBag, Clock, BadgeDollarSign } from 'lucide-react';

const SrijanMerchandiseAnnouncement = () => {
  return (
    <div className="border border-gray-600 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-white">
      {/* <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-300">Srijan'25 Official Merchandise</h1>
        <div className="mt-2 border border-yellow-500 p-2 rounded-md inline-block">
          <span className="font-bold text-yellow-300">Early Bird Offer:</span> First 100 T-shirts at ₹319 only! Later ₹349
        </div>
      </div> */}

      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className='flex justify-center relative w-full'>
            <Calendar className="text-blue-300 mr-3 mt-1 flex-shrink-0 absolute left-0" size={24} />
            <h2 className="font-bold text-lg text-blue-300">Important Dates</h2>
          </div>
          <div className='w-full sm:w-5/6 mt-4'>
            <ul className="sm:ml-2 space-y-2 mt-2 w-full">
              <li className="flex items-center justify-between w-full">
                <span className="border border-blue-500 text-blue-200 px-2 py-1 rounded mr-2 text-sm font-medium w-20 sm:w-32 text-center">Order by March 28</span>
                <span className='text-right'>Receive by April 14</span>
              </li>
              <li className="flex items-center justify-between w-full">
                <span className="border border-blue-500 text-blue-200 px-2 py-1 rounded mr-2 text-sm font-medium w-36 sm:w-32 text-center">Order by April 10</span>
                <span className='text-right'>Delivered during Srijan'25 (April 18-19)</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="border border-blue-500 text-blue-200 px-2 py-1 rounded mr-2 text-sm font-medium w-32 text-center">Order after April 11</span>
                <span className='text-right'>Collect from campus on a later date(Post Srijan 20)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className='flex justify-center relative w-full'>
            <ShoppingBag className="text-blue-300 mr-3 mt-1 flex-shrink-0 absolute left-0" size={24} />
            <h2 className="font-bold text-lg text-blue-300 ml-3 sm:ml-0">T-shirt Availability</h2>
          </div>
          <div>
            <p className="ml-2 mt-1 sm:mt-3">T-shirts will be available from April 14 onwards based on your order date.</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className='flex justify-center relative w-full'>
            <BadgeDollarSign className="text-blue-300 mr-3 mt-1 absolute left-0 flex-shrink-0" size={24} />
            <h2 className="font-bold text-lg text-blue-300">Pricing - ₹349</h2>
          </div>
          <div>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-blue-500 p-4 rounded-md">
        <div className="flex items-center justify-center">
          <Clock className="text-blue-300 mr-2" size={20} />
          <h2 className="font-bold text-lg text-blue-300">Hurry Up!</h2>
        </div>
        <p className="text-center mt-1">Payment details and contact information for T-shirt collection are provided at registration.</p>
      </div>
      {
        /*
        <div className="mt-6 text-center">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            Register Now
          </button>
        </div>
        */
      }
    </div>
  );
};

export default SrijanMerchandiseAnnouncement;
