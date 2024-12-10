import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://uvfolderking.com/suresop/api/product/getpbyvendor/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(response.data.products.reverse());
    } catch (error) {
      console.error("Error in fetching Products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/editProduct/${productId}`);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the product?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `https://uvfolderking.com/suresop/api/product/delete/${userId}/${productId}`,
          { headers: { Authorization: ` Bearer ${token} ` } }
        );
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh the product list without reloading the page
      } catch (error) {
        console.error("Error while trying to delete:", error);
        alert("An error occurred while deleting the product.");
      }
    } else {
      alert("Product deletion canceled.");
    }
  };

  const handleView = (productId) => {
    navigate(`/viewProduct/${productId}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => (
    <div className="flex justify-center justify-between items-center mt-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2 disabled:opacity-50"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <div className="container mx-auto mt-4 p-4  ">
        <p className="text-2xl font-semibold text-center mb-3">Our Products</p>

        <div className="flex justify-between">
          <div className="w-2/3 ">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Link to="/add-product" className="flex justify-end mb-3">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Product
              </button>
            </Link>
          </div>
        </div>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="pt-4 pb-4 pl-2 border-b">Product Id</th>
              <th className="border-b">Product Title</th>
              <th className="border-b">Image</th>
              {/* <th className="border-b">Category</th> */}
              <th className="border-b">Visibility Status</th>
              <th className="border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length ? (
              currentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="p-4 text-blue-500 font-semibold border-b">
                    {product.id}
                  </td>
                  <td className="border-b">{product.name}</td>
                  <td className="border-b">
                    <img
                      src={`https://uvfolderking.com/suresop/storage/app/public/${product.featured_image}`}
                      className="h-10 w-10 object-cover"
                      alt=""
                    />
                  </td>
                  {/* <td className="border-b">{product.category}</td> */}
                  <td className="border-b">{product.status}</td>
                  <td className="border-b">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleView(product.id)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(product.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 border-b">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredProducts.length > productsPerPage && renderPagination()}
      </div>
    </div>
  );
};

export default ProductList;
