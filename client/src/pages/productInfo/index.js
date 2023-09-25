import React, { useEffect, useState } from "react";
import { SetLoader } from "../../redux/loadersSlice";
import { Button, message } from "antd";
import { GetProductById, GetProducts } from "../../apicalls/products";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";
import { GetAllBid } from "../../apicalls/bids";

const ProductInfo = () => {
  const [product, setProduct] = useState([]);
  const params = useParams();
  const [selectedImageIndex = 0, setSelectedImageIndex] = useState(0);
  const [showBidModal = 0, setShowBidModal] = useState(false);

  //navigate
  const navigate = useNavigate();

  //state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(params.id);

      if (response.success) {
        const bidResponse = await GetAllBid({ product: params.id });
        setProduct({
          ...response.data,
          bids: bidResponse.data,
        });
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
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/* images */}
          <div className="flex flex-col gap-2">
            {product.images && (
              <img
                src={product?.images[selectedImageIndex]}
                alt=""
                className="w-full h-56 object-cover rounded-md"
              />
            )}
            <div>
              <h1 className="text-md mt-2">Added on</h1>
              <span>
                {moment(product.createdAt).format("MMM D, YYYY hh:mm A")}
              </span>
            </div>
          </div>
          {/* details */}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900">
                {product.product_name}
              </h1>
              <span>{product.description}</span>
            </div>
            <hr />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Product Details
              </h1>
              <div className="flex justify-between items-center mt-2">
                <span>Price</span>
                <span>${product.price}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Categories</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Owner Details
              </h1>

              <div className="flex justify-between items-center mt-2">
                <span>Seller Name</span>
                <span>{product?.seller?.name}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Seller Email</span>
                <span>{product?.seller?.email}</span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col">
              <div className="flex justify-between my-2">
                <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
                <Button
                  onClick={() => setShowBidModal(true)}
                  disabled={product?.seller?._id === user?._id}
                >
                  New Bid
                </Button>
              </div>

              {product.bids &&
                product.showBidsOnProductPage &&
                product.bids.map((bid) => {
                  return (
                    <div className="border border-gray-300 border-solid p-2 my-2 rounded">
                      <div className="flex justify-between my-2">
                        <span>Name</span>
                        <span>{bid?.buyer?.name}</span>
                      </div>
                      <div className="flex justify-between my-2">
                        <span>Amount</span>
                        <span>${bid?.bidAmount}</span>
                      </div>
                      <div className="flex justify-between my-2">
                        <span>Bid Placed on</span>
                        <span>
                          {moment(bid?.createdAt).format("MMM D, YYYY hh:mm A")}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {showBidModal && (
          <BidModal
            showBidModal={showBidModal}
            setShowBidModal={setShowBidModal}
            reloadData={getData}
            product={product}
          />
        )}
      </div>
    )
  );
};

export default ProductInfo;
