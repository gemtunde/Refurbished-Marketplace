import React, { useEffect, useState } from "react";
import { Modal, Table, message } from "antd";
import { SetLoader } from "../../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBid } from "../../../apicalls/bids";
import moment from "moment";

const UserBids = () => {
  const [bidsData, setBidsData] = useState([]);

  //state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(false));
      const response = await GetAllBid({
        buyer: user._id,
      });
      setBidsData(response.data);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };
  useEffect(() => {
    getData();
  }, []);
  //columns
  const columns = [
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <div>
            <p> {record?.seller?.name}</p>
          </div>
        );
      },
    },
    {
      title: "Product ",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <div>
            <p> {record?.product?.product_name}</p>
          </div>
        );
      },
    },
    {
      title: "Product Price ",
      dataIndex: "productPrice",
      render: (text, record) => {
        return (
          <div>
            <p>$ {record?.product.price}.00</p>
          </div>
        );
      },
    },
    {
      title: "Bids Amount",
      dataIndex: "bidAmount",
      render: (text, record) => {
        return (
          <div>
            <p>$ {record?.bidAmount}.00</p>
          </div>
        );
      },
    },
    {
      title: "Bids Date",
      dataIndex: "createdAt",
      render: (text, record) => moment(text).format("MMM D YYYY, h:mm A"),
    },
    { title: "Message", dataIndex: "message" },
  ];
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl text-gray-500">Bids</h1>
      <Table columns={columns} dataSource={bidsData} />
    </div>
  );
};

export default UserBids;
