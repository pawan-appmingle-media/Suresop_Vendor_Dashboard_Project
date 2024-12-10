import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Sidebar from "../Sidebar";

const EditAllProducts = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    quantity: "",
    status: "",
    featured_image: [],

    category_id: "",
    sub_category_id: "",
    brand_name: "",
    prices: [
      {
        color_name: "",
        size_name: "",
        old_price: "",
        sale_price: "",
        images: [],
        specifications: [{ spec_key: "", spec_value: "" }],
        configuration: [{ size: "", old_price: "", sale_price: "", stock: "" }],
      },
    ],
  });

  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // bhu
  const handleDescriptionChange = (value) => {
    setProductData({ ...productData, description: value }); // Update product data
  };

  //bhu
  // Remove image by index
  // Handle multiple image uploads
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    const images = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(images).then((base64Images) => {
      setProductData({
        ...productData,
        featured_image: [...productData.featured_image, ...base64Images],
      });
    });
  };

  // Remove image by index
  const handleRemoveImage = (index) => {
    const updatedImages = productData.featured_image.filter(
      (_, i) => i !== index
    );
    setProductData({ ...productData, featured_image: updatedImages });
  };

  // bhu
  // multiple images
  const handleAddPriceImage = (priceIndex, e) => {
    const file = e.target.files[0]; // Only handle one file at a time
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPrices = [...productData.prices];
        updatedPrices[priceIndex].images.push(reader.result); // Push the base64 image
        setProductData({ ...productData, prices: updatedPrices });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemovePriceImage = (priceIndex, imgIndex) => {
    const updatedPrices = [...productData.prices];
    updatedPrices[priceIndex].images = updatedPrices[priceIndex].images.filter(
      (_, index) => index !== imgIndex
    );
    setProductData({ ...productData, prices: updatedPrices });
  };

  // const handleAddImage = (priceIndex) => {
  //   const updatedPrices = [...productData.prices];
  //   updatedPrices[priceIndex].images.push(""); // Push an empty string to show a new input
  //   setProductData({ ...productData, prices: updatedPrices });
  // };

  // Fetch all categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://uvfolderking.com/suresop/api/categories/getallcategory`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  // Fetch subcategories when a category is selected
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setProductData({ ...productData, category_id: categoryId });

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://uvfolderking.com/suresop/api/getSubCatgoryBy/${categoryId}`
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle status of visibilty
  const handleStatusChange = (event) => {
    setProductData({ ...productData, status: event.target.value });
  };
  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    setProductData({ ...productData, sub_category_id: e.target.value });
  };

  // Handle form data input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle changes in price details
  const handlePriceChange = (index, e) => {
    const { name, value } = e.target;
    const prices = [...productData.prices];
    prices[index][name] = value;
    setProductData({ ...productData, prices });
  };

  // Handle specification changes
  const handleSpecificationChange = (priceIndex, specIndex, e) => {
    const { name, value } = e.target;
    const prices = [...productData.prices];
    prices[priceIndex].specifications[specIndex][name] = value;
    setProductData({ ...productData, prices });
  };

  // Handle configuration changes
  const handleConfigurationChange = (priceIndex, configIndex, e) => {
    const { name, value } = e.target;
    const prices = [...productData.prices];
    prices[priceIndex].configuration[configIndex][name] = value;
    setProductData({ ...productData, prices });
  };

  // Add a new price entry
  const handleAddPrice = () => {
    setProductData({
      ...productData,
      prices: [
        ...productData.prices,
        {
          color_name: "",
          size_name: "",
          old_price: "",
          sale_price: "",
          images: [],
          specifications: [{ spec_key: "", spec_value: "" }],
          configuration: [
            { size: "", old_price: "", sale_price: "", stock: "" },
          ],
        },
      ],
    });
  };

  // Add a new specification to a price entry
  const handleAddSpecification = (index) => {
    const prices = [...productData.prices];
    prices[index].specifications.push({ spec_key: "", spec_value: "" });
    setProductData({ ...productData, prices });
  };

  // Add a new configuration to a price entry
  const handleAddConfiguration = (index) => {
    const prices = [...productData.prices];
    prices[index].configuration.push({
      size: "",
      old_price: "",
      sale_price: "",
      stock: "",
    });
    setProductData({ ...productData, prices });
  };

  // Add a new image to a price entry
  const handleAddImage = (priceIndex) => {
    const prices = [...productData.prices];
    prices[priceIndex].images.push(null); // Placeholder for the new image
    setProductData({ ...productData, prices });
  };

  // Handle image changes
  const handleImageChange = (priceIndex, imgIndex, e) => {
    const file = e.target.files[0]; // Only handle the first file

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result; // This is the base64 encoded image string
        const prices = [...productData.prices];
        prices[priceIndex].images[imgIndex] = base64String; // Store base64 string instead of file
        setProductData({ ...productData, prices });
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("the productData is ", productData);
    // Add product to API
    try {
      const formData = new FormData();
      for (const key in productData) {
        if (key === "prices") {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }

      const response = await axios.post(
        `https://uvfolderking.com/suresop/api/product/add/${userId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setMessage("Product added successfully!");
    } catch (error) {
      console.error("Error in adding product", error);
    }

    alert("Product data submitted");
  };

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl text-center font-bold mb-4">
          Edit Add Products
        </h1>
        {message && <p className="text-green-500 mb-2">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />

          {/* <textarea
            name="description"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          /> */}

          {/* description quill wala */}

          <ReactQuill
            value={productData.description}
            onChange={handleDescriptionChange}
            placeholder="Product Description"
            className="w-full border rounded p-2"
            // style={{
            //   height: "200px", // Set custom height
            // }}
          />
          {/* end description quill */}

          <input
            type="text"
            name="quantity"
            placeholder=" Total Product Quantity"
            value={productData.quantity}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded  p-2"
          />
          <div>
            <p className="pb-2">Visibility of the product</p>
            <div className="w-full border border-gray-300 rounded p-2">
              <label className="mr-4">
                <input
                  type="radio"
                  name="status"
                  value="show"
                  checked={productData.status === "show"}
                  onChange={handleStatusChange}
                  className="mr-2"
                />
                Show Product
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="hide"
                  checked={productData.status === "hide"}
                  onChange={handleStatusChange}
                  className="mr-2"
                />
                Hide Product
              </label>
            </div>
          </div>

          {/* Multiple Image Input */}
          {/* Multiple Image Input */}
          <input
            type="file"
            name="featured_image"
            multiple
            onChange={handleImagesChange}
            className="w-full border border-gray-300 rounded p-2"
          />

          {/* Show Selected Images */}
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.featured_image.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                {/* Image Preview */}
                <img
                  src={image}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded"
                />
                {/* Remove Icon */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* end images */}

          <label>Category:</label>
          <select
            name="category_id"
            value={productData.category_id}
            onChange={handleCategoryChange}
            required
            className="w-[200px] border border-gray-300 rounded p-2 "
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Subcategory Dropdown */}
          <label className="lg:pl-5">Subcategory:</label>
          <select
            name="sub_category_id"
            value={productData.sub_category_id}
            onChange={handleSubCategoryChange}
            required
            className="w-[200px] border border-gray-300 rounded p-2 "
            disabled={isLoading || !subCategories.length}
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="brand_name"
            placeholder="Brand Name"
            value={productData.brand_name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />

          <h2 className="text-xl font-semibold mt-6">Prices</h2>
          {productData.prices.map((price, priceIndex) => (
            <div key={priceIndex} className="border border-gray-200 p-4">
              <input
                type="text"
                name="color_name"
                placeholder="Color"
                value={price.color_name}
                onChange={(e) => handlePriceChange(priceIndex, e)}
                required
                className="w-full border border-gray-300 rounded p-2 mb-2"
              />

              {/* <h3 className="font-semibold mt-2">Images</h3>
              {price.images.map((img, imgIndex) => (
                <div key={imgIndex} className="mb-2">
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(priceIndex, imgIndex, e)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              ))} */}

              <h3 className="font-semibold mt-2">Images</h3>
              <div className="flex flex-wrap gap-4">
                {price.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative w-32 h-32">
                    {/* Show image preview */}
                    <img
                      src={img}
                      alt={`Price Image ${imgIndex}`}
                      className="w-full h-full object-cover rounded"
                    />
                    {/* Remove Image Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemovePriceImage(priceIndex, imgIndex)
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Image Input */}
              {/* <input
              type="file"
              placeholder=" Add More Images"
              onChange={(e) => handleAddPriceImage(priceIndex, e)}
              className="w-full border border-gray-300 rounded p-2 mt-4"
            /> */}

              {/* Hidden File Input */}
              <input
                type="file"
                id={`fileInput-${priceIndex}`}
                onChange={(e) => handleAddPriceImage(priceIndex, e)}
                className="hidden"
              />

              {/* Custom Button to Trigger File Input */}
              <label
                htmlFor={`fileInput-${priceIndex}`}
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add More Images
              </label>

              {/* 
              <button
                type="button"
                onClick={() =>  handleAddPriceImage(priceIndex)}
                className="text-blue-500"
              >
                Add More Images
              </button> */}

              <h3 className="font-semibold mt-4">Configurations</h3>
              {price.configuration.map((config, configIndex) => (
                <div
                  key={configIndex}
                  className="mb-2 border-black-800  border-b-2"
                >
                  <input
                    type="text"
                    name="size"
                    placeholder="Size:M,L,XL, ( 6+128 ) "
                    value={config.size}
                    onChange={(e) =>
                      handleConfigurationChange(priceIndex, configIndex, e)
                    }
                    required
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                  <input
                    type="text"
                    name="old_price"
                    placeholder="Old Price"
                    value={config.old_price}
                    onChange={(e) =>
                      handleConfigurationChange(priceIndex, configIndex, e)
                    }
                    required
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                  <input
                    type="text"
                    name="sale_price"
                    placeholder="Sale Price"
                    value={config.sale_price}
                    onChange={(e) =>
                      handleConfigurationChange(priceIndex, configIndex, e)
                    }
                    required
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                  <input
                    type="text"
                    name="stock"
                    placeholder="Quantity"
                    value={config.stock}
                    onChange={(e) =>
                      handleConfigurationChange(priceIndex, configIndex, e)
                    }
                    required
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddConfiguration(priceIndex)}
                className="text-blue-500"
              >
                Add More Configurations
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPrice}
            className="text-blue-500"
          >
            Add More Price Options
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded mt-4"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditAllProducts;
