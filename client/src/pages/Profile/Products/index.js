import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import ProductsForm from "./ProductsForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { DeleteProduct, GetProducts } from "../../../apicalls/products";
import moment from "moment";
import Bids from "./BidsModal";

const Products = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getAllProducts = async () => {
    try {
      dispatch(SetLoader(true));

      const response = await GetProducts({
        seller: user._id,
      });
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

  //on delete
  const onDelete = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      if (response.success) {
        message.success(response.message);
        getAllProducts();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Image",
      dataIndex: "images",
      render: (text, record) => (
        <img
          src={record?.images ? record?.images[0] : ""}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-contain"
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-3 items-center">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                onDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedProduct(record);
                setShowProductForm(true);
              }}
            ></i>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                setShowBidsModal(true);
                setSelectedProduct(record);
              }}
            >
              {" "}
              Show Bids
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(true);
            setSelectedProduct(null);
          }}
        >
          Add Product
        </Button>
      </div>
      <Table dataSource={products} columns={columns} />
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getAllProducts}
        />
      )}

      {setShowBidsModal && (
        <Bids
          setShowBidsModal={setShowBidsModal}
          showBidsModal={showBidsModal}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;
