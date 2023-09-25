import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetProducts } from "../../apicalls/products";
import { Divider, message } from "antd";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

const Home = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "approved",
    category: [],
    age: [],
  });

  //navigate
  const navigate = useNavigate();

  //state
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);

      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          getData={getData}
        />
      )}
      <div>
        <div className="flex gap-5  my-5">
          <i
            className={`ri-equalizer-line cursor-pointer ${
              showFilters && "hidden"
            }`}
            onClick={() => setShowFilters(true)}
          ></i>
          <input
            type="text"
            placeholder="Search Products here..."
            className="border border-gray-300 rounded border-solid p-2 h-14"
          />
        </div>
        <div
          className={`grid gap-5 ${
            showFilters ? "grid-cols-4" : "grid-cols-5"
          }`}
        >
          {products?.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="border border-gray-300 rounded border-solid flex flex-col gap-5 mb-2 cursor-pointer"
            >
              <img
                src={product.images[0]}
                className="w-full h-40 object-cover"
                alt=""
              />
              <div className="flex flex-col gap-2 px-2">
                <h1 className="text-sm font-semibold text-primary">
                  {product.category.toUpperCase()}
                </h1>
                <hr />
                <h1 className="text-lg font-semibold">
                  {product.product_name.split("", 20)}
                </h1>
                <p className="text-sm text-gray-800">
                  {product.description.split("", 130)}
                </p>
                <hr />
                <span className="text-lg font-semibold text-red-700">
                  ${product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
