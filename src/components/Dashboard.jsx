import { useState } from "react";
import { FaDollarSign, FaExchangeAlt, FaUser } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import SalesTrendChart from "./Chart/graph";
import SalesTrendChart1 from "./Chart/graph1";
import Sidebar from "./Sidebar";
import CommonHeader from "./commonHeader/CommonHeader";

const Dashboard = () => {
  const orders = [
    {
      id: "12345",
      paymentMethod: "Credit Card",
      orderDateTime: "2024-10-21 10:30 AM",
      deliveryDate: "2024-10-23",
      status: "Processing",
      amount: 50,
    },
    {
      id: "12346",
      paymentMethod: "PayPal",
      orderDateTime: "2024-10-21 11:00 AM",
      deliveryDate: "2024-10-23",
      status: "Pending",
      amount: 30,
    },
    {
      id: "12347",
      paymentMethod: "Cash on Delivery",
      orderDateTime: "2024-10-20 09:15 AM",
      deliveryDate: "2024-10-22",
      status: "Delivered",
      amount: 70,
    },
    // More orders...
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex bg-[#F9F6FF]">
      <div>
        <Sidebar />
      </div>
      <div className="w-full p-6 min-h-screen">
        <CommonHeader name={"Dashboard"} />
        {/* Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white  p-4 rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.3)]">
            <div className="flex justify-left items-center">
              <FaDollarSign className="w-6 h-6 text-[#6BA6FA] mr-[10px]" />
              <h3 className="text-[1rem]">Total Revenue</h3>
            </div>
            <p className="text-[30px] mt-[10px]">₹244,124</p>
          </div>
          <div className="bg-white  justify-between p-6 rounded-[10px]  shadow-[0_0_5px_rgba(0,0,0,0.3)]">
            <div className="flex justify-left items-center">
              <FaUser className="w-6 h-6 text-[#6BA6FA] mr-[10px]" />
              <h3 className="text-[1rem]">Total Customer</h3>
            </div>
            <p className="text-[30px] mt-[10px]">₹1,023</p>
          </div>
          <div className="bg-white  justify-between p-6 rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.3)]">
            <div className="flex justify-left items-center">
              <FaExchangeAlt className="w-6 h-6 text-[#6BA6FA] mr-[10px] " />
              <h3 className="text-[1rem]">Total Trancsition</h3>
            </div>
            <p className="text-[30px] mt-[10px]">₹21,323</p>
            <p></p>
          </div>
          <div className="bg-white  justify-between p-6 rounded-[10px] shadow-[0_0_5px_rgba(0,0,0,0.3)]">
            <div className="flex justify-left items-center">
              <FiBox className="w-6 h-6 text-[#6BA6FA] mr-[10px]" />
              <h3 className="text-[1rem] ">Total Production</h3>
            </div>
            <p className="text-[30px] mt-[10px]">₹2,32</p>
          </div>
        </div>
        {/* Orders Table */}
        <div className="flex justify-between items-center">
          <SalesTrendChart />
          <div className="w-[38%]">
            <SalesTrendChart1 />
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
