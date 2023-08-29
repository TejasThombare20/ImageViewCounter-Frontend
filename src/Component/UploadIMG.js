import React from "react";
import { useState } from "react";
import { imageToBase64 } from "../Utility/ImageToBase64";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, setProductReducer ,updateViewCountReducer } from "../Redux/productSlice";

const UploadIMG = () => {
  const dispatch = useDispatch();
  const productdata = useSelector((state) => state.product.products);

  const [image, setImage] = useState("");

  const [data, setdata] = useState({
    product_name: "",
    image: "",
    description: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setdata((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleUploadAndSubmit = async (e) => {
    e.preventDefault();

    // Upload the image to Cloudinary
    const imageData = new FormData();
    imageData.append("file", image);
    imageData.append("upload_preset", "Tejas123");
    imageData.append("cloud_name", "df3a7sxnl");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/df3a7sxnl/image/upload`,
        imageData
      );
      
      console.log("resposnedata cloudinary", response)
      const imageID = response.data.public_id

      const imageUrl = response.data.secure_url;

      // Submit form data to backend with image URL
      const { product_name, description } = data;

      const productData = {
        product_name,
        description,
        image: imageUrl,
        imageID : imageID
      };

      const backendResponse = await axios.post(
        `${api}/api/product/addProduct`,
        JSON.stringify(productData),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("backendResponse", backendResponse);
      console.log("backendResponse product : ", backendResponse.data.product);

      console.log("Product saved to MongoDB:", backendResponse.data);

      dispatch(addProduct(productData));
      toast("Product added successfully");

      setdata({
        product_name: "",
        image: "",
        description: "",
      });
      setImage(null);
      
    } catch (error) {
      console.log("error", error);
    }
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/api/product/fetchAllProduct`);
      setProducts(response.data);
      dispatch(setProductReducer(response.data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const [selectedProduct, setSelectedProduct] = useState(null);
 
  const handleViewImage = async (product) => {
    setSelectedProduct(product);
  console.log("hello")
    try {
      
      // Update view count on the backend
     const response =   await axios.post(`${api}/api/product/images/${product.imageID}/view`);
      const viewCount = response.data.count
     dispatch(updateViewCountReducer({ imageID: product.imageID, views:viewCount  }));

     console.log("response",response)
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };
  

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <form
        className=" m-auto bg-white w-full max-w-md p-4 shadow-lg drop-shadow-md flex flex-col"
        action=""
        onSubmit={handleUploadAndSubmit}
      >
        <label htmlFor="product_name" className="mt-1">
          Name :
        </label>
        <input
          id="product_name"
          type="text"
          name="product_name"
          value={data.product_name}
          onChange={onChange}
          className="bg-slate-200 px-2 py-1 my-1"
        />
        <label htmlFor="description" className="mt-1">
          Description :
        </label>
        <textarea
          name="description"
          id="description"
          rows="3"
          value={data.description}
          onChange={onChange}
          className="bg-slate-200 px-2 py-1 my-1 resize-none"
        ></textarea>

        <label htmlFor="image" className="mt-1 cursor-pointer">
          Image :
          <div className="h-40 w-full bg-slate-200  my-1 py-1 flex items-center justify-center">
            {image ? (
              <img src={URL.createObjectURL(image)} className="h-full" alt="productImage" />
            ) : (
              <span className="text-5xl">
                <FaUpload />
              </span>
            )}

            <input
              type="file"
              accept="image/*"
              id="image"
              
              onChange={(e) => {
                console.log(e);
                setImage(e.target.files[0]);
              }}
              className="hidden"
            />
          </div>
        </label>

        <div className="flex justify-center">
          <button
            type="submit"
            className=" w-fit  bg-blue-500 px-2 py-1 my-1 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="bg-gray-100 py-8  my-10">
        <div className=" mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {productdata.map((product) => (
              <div
                key={product._id}
                className="bg-white  border rounded-lg shadow-md w-[400px] h-[450px] flex flex-col justify-center items-center  px-4 gap-4"
              >
                <div className="w-[200] h-[200] flex justify-center items-center">
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-contain "
                  />
                </div>
                <div className="flex flex-col  justify-center items-start w-full gap-2">
                  <p className="mt-2 text-lg font-semibold">
                    Name : {product.product_name}
                  </p>
                  <p className="text-gray-600 mt-1 font-semibold">
                    Description : {product.description}
                  </p>
                </div>
                <div className="flex justify-center items-center gap-8">
                  <button
                    onClick={() => handleViewImage(product)}
                    className="mt-2 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <p>View Count: {product.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>
          <div className="modal-container bg-white w-4/5 md:max-w-3xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div
              className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
              onClick={handleCloseModal}
            >
              <svg
                className="fill-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M9 .998c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9zm4.293 11.293a1 1 0 0 1-1.414 1.414L9 10.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L7.586 9l-3.293-3.293a1 1 0 1 1 1.414-1.414L9 7.586l3.293-3.293a1 1 0 0 1 1.414 1.414L10.414 9l3.293 3.293z"
                  fillRule="evenodd"
                />
              </svg>
              <span className="text-sm">(Esc)</span>
            </div>
            <div className="modal-content">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                className="w-full h-auto"
              />
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadIMG;
