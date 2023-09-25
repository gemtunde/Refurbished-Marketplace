import React, { useEffect, useState } from "react";
import { Modal, Table, message } from "antd";
import { SetLoader } from "../../../redux/loadersSlice";
import { useDispatch } from "react-redux";
import { GetAllBid } from "../../../apicalls/bids";
import moment from "moment";

const Bids = ({ showBidsModal, setShowBidsModal, selectedProduct }) => {
  const [bidsData, setBidsData] = useState([]);

  //state
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(false));
      const response = await GetAllBid({
        product: selectedProduct?._id,
      });
      setBidsData(response.data);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };
  useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [selectedProduct]);
  //columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <div>
            <p> Phone: {record?.buyer?.name}</p>
          </div>
        );
      },
    },
    { title: "Bids Amount", dataIndex: "bidAmount" },
    {
      title: "Bids Date",
      dataIndex: "createdAt",
      render: (text, record) => moment(text).format("MMM D YYYY, h:mm A"),
    },
    { title: "Message", dataIndex: "message" },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p> Phone: {record?.buyer?.name}</p>
            <p> Phone: {record?.phone}</p>
            <p> Email: {record?.buyer?.phone}</p>
          </div>
        );
      },
    },
  ];
  return (
    <Modal
      title="Bids"
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={800}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <hr />
        <h1 className="text-xl text-gray-500">
          {" "}
          Product Name :{selectedProduct?.product_name}
        </h1>
        <Table columns={columns} dataSource={bidsData} />
      </div>
    </Modal>
  );
};

export default Bids;
