import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";
import { GetUsers, UpdateUserStatus } from "../../apicalls/users";

const Users = () => {
  const [users, setUsers] = useState([]);

  //state
  const dispatch = useDispatch();

  const getAllUsers = async () => {
    try {
      dispatch(SetLoader(true));

      const response = await GetUsers();
      if (response.success) {
        setUsers(response.data);
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
      const response = await UpdateUserStatus(id, status);
      if (response.success) {
        message.success(response.message);
        getAllUsers();
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
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
            {status === "active" && (
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
                onClick={() => onStatusUpdate(_id, "active")}
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
    getAllUsers();
  }, []);
  return (
    <div>
      <Table dataSource={users} columns={columns} />
    </div>
  );
};

export default Users;
