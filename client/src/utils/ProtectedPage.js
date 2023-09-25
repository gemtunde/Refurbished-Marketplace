import { Avatar, Badge, message } from "antd";
import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";
import Notifications from "../components/Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";

const ProtectedPage = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  //state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  //nalidate tokens
  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      if (response.success) {
        message.success(response.message);
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  //get notifications
  const getNotifications = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };
  //read notifications
  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    user && (
      <div>
        {/* header */}
        <div className="flex justify-between items-center bg-primary p-5">
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            GEMTUNDE-MarketPlace
          </h1>
          <div className="bg-white py-2 px-5 flex gap-1 rounded items-center">
            <span
              className="cursor-pointer underline mr-3"
              onClick={() => {
                user.role === "admin"
                  ? navigate("/admin")
                  : navigate("/profile");
              }}
            >
              {user.name}
            </span>

            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={<i className="ri-notification-3-line"></i>}
              />
            </Badge>
            <i
              className="ri-logout-box-r-line ml-10 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* content body  */}
        <div className="p-5">
          {" "}
          {children}
          <Notifications
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            reloadNotifications={getNotifications}
          />
        </div>
      </div>
    )
  );
};

export default ProtectedPage;
