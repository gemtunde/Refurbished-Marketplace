import { Col, Form, Input, Modal, Row, Tabs, TextArea, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { AddProduct, EditProduct } from "../../../apicalls/products";
import Images from "./Images";

const ProductsForm = ({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData,
}) => {
  const formRef = useRef(null);

  //selectedtab
  const [selectedTab, setSelectedTab] = useState("1");

  //states
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const additinalThings = [
    {
      label: "Bill Available",
      name: "billAvailable",
    },
    {
      label: "Warranty Available",
      name: "warrantyAvailable",
    },
    {
      label: "Accessories Available",
      name: "accessoriesAvailable",
    },
    {
      label: "Box Available",
      name: "boxAvailable",
    },
  ];

  const rules = [
    {
      required: true,
      message: "Required",
    },
  ];

  const onFinish = async (values) => {
    //console.log("sucess", values);
    try {
      dispatch(SetLoader(true));

      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        response = await AddProduct(values);
        setShowProductForm(false);
      }
      if (response.success) {
        message.success(response.message);
        getData();
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
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);
  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText={selectedProduct ? "Edit Product" : "Save Product"}
      onOk={() => formRef.current.submit()}
      {...(selectedTab === "2" && { footer: false })}
    >
      <div>
        <h1 className="text-primary">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>
        <Tabs
          defaultActiveKey="1"
          activeKey={selectedTab}
          onChange={(key) => setSelectedTab(key)}
        >
          <Tabs.TabPane tab="General" key="1">
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
              <Form.Item label="Name" name="product_name" rules={rules}>
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={rules}>
                <Input.TextArea
                  rows={4}
                  type="text"
                  placeholder="description"
                />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item label="Price" name="price" rules={rules}>
                    <Input placeholder="price" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Category" name="category" rules={rules}>
                    <select>
                      <option>Please select your options</option>
                      <option value="electronics"> Electronics</option>
                      <option value="fashion"> Fashion</option>
                      <option value="home"> Home</option>
                      <option value="sports"> Sports</option>
                      <option value="toys"> Toys</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Age" name="age" rules={rules}>
                    <Input placeholder="age" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex gap-10">
                {additinalThings.map((item) => {
                  return (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      valuePropName="checked"
                    >
                      <Input
                        type="checkbox"
                        value={item.name}
                        onChange={(e) => {
                          formRef.current.setFieldsValue({
                            [item.name]: e.target.checked,
                          });
                        }}
                        checked={formRef.current?.getFieldValue(item.name)}
                      />
                    </Form.Item>
                  );
                })}
              </div>
              <Row>
                <Col span={8}>
                  <Form.Item
                    label="Show Bids on Product Page"
                    name="showBidsOnProductPage"
                    valuePropName="checked"
                  >
                    <Input
                      type="checkbox"
                      onChange={(e) => {
                        formRef.current.setFieldsValue({
                          showBidsOnProductPage: e.target.checked,
                        });
                      }}
                      checked={formRef.current?.getFieldValue(
                        "showBidsOnProductPage"
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
            <Images
              setShowProductForm={setShowProductForm}
              selectedProduct={selectedProduct}
              getData={getData}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ProductsForm;
