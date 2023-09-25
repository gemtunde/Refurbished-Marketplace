import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetProducts, UpdateProductStatus } from "../../apicalls/products";
import moment from "moment";

const Products = () => {
  const [products, setProducts] = useState([]);

  //state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getAllProducts = async () => {
    try {
      dispatch(SetLoader(true));

      const response = await GetProducts(null);
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

  //on Status Update
  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateProductStatus(id, status);
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
      title: "Seller",
      dataIndex: "seller",
      render: (text, record) => record.seller.name,
    },
    {
      title: "Category",
      dataIndex: "category",
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
      render: (text, record) => record.status.toUpperCase(),
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
        const { _id, status } = record;
        return (
          <div className="flex gap-3">
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "approved" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Unblock
              </span>
            )}
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
      <Table dataSource={products} columns={columns} />
    </div>
  );
};

export default Products;
