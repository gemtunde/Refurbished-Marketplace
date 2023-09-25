import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import TitleText from "../../helpers/Title-Text/TitleText";
import Divider from "../../helpers/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";

const Register = () => {
  const navigate = useNavigate();

  //state
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await RegisterUser(values);
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        throw new Error("user already exists");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <div className="bg-white p-5 roinded w-[450px]">
        <TitleText title="Register" />
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input type="text" placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="text" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input type="password" placeholder="xxxxxxx" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>

          <div className="mt-5 text-center justify-center">
            <span className="text-gray-500">
              Already have an account?{" "}
              <Link className="text-primary" to="/login">
                Login
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
