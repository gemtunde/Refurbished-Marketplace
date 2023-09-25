import { Form, Input, Modal, message } from "antd";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { PlaceNewBid } from "../../apicalls/bids";
import { AddNotification } from "../../apicalls/notifications";

const BidModal = ({ showBidModal, setShowBidModal, product, reloadData }) => {
  const formRef = useRef();
  const rules = [{ required: true, message: "Required" }];

  //state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  //submit
  const onFinish = async (values) => {
    //console.log("success", values);
    try {
      values.product = product?._id;
      values.seller = product?.seller?._id;
      values.buyer = user._id;

      dispatch(SetLoader(true));
      const response = await PlaceNewBid(values);
      if (response.success) {
        message.success(response.message);

        //send notifications to seller
        await AddNotification({
          title: "A New Bid has been placed",
          message: `A new bid has been placed on your product ${product.product_name} by ${user.name} for $ ${values.bidAmount}`,
          user: product.seller._id,
          onClick: `/profile`,
          read: false,
        });

        setShowBidModal(false);
        reloadData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };
  return (
    <Modal
      open={showBidModal}
      onCancel={() => setShowBidModal(false)}
      centered
      width={800}
      onOk={() => formRef.current.submit()}
    >
      <h1 className="text-xl font-semibold mb-5 text-center text-orange-900">
        New Bid
      </h1>
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
          <Input type="text" placeholder="Bid Amount" />
        </Form.Item>
        <Form.Item label="Message" name="message" rules={rules}>
          <Input.TextArea type="text" placeholder="Message" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone">
          <Input type="text" placeholder="Phone Number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BidModal;
