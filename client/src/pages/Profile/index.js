import React from "react";
import { Tabs } from "antd";
import Products from "./Products";
import UserBids from "./UserBids";

const Profile = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Products" key="1">
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
          <UserBids />
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
          <h1>General</h1>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
