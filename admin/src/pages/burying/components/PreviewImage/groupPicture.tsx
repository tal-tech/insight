import React, { FC, useContext } from "react";
import ReactDOM from "react-dom";
import "./groupPicture.less";
import { Popconfirm } from "antd";
interface IGroupPicture {
  item: any;
  visible: boolean;
  onDeleteFn: any;
  onCancel: () => void;
}

const GroupPicture: FC<IGroupPicture> = (props) => {
  const { visible, onCancel, onDeleteFn } = props;
  return (
    <>
      {visible && (
        <div className="group-picture-wrapper">
          <div className="group-picture-background" onClick={onCancel} />
          <Popconfirm
            placement="bottomRight"
            title="确定删除吗?"
            onConfirm={() => {
              onDeleteFn(false);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#" className="background-btn">
              删除
            </a>
          </Popconfirm>
          <Popconfirm
            placement="bottomRight"
            title="确定删除所有版本吗?"
            onConfirm={() => {
              onDeleteFn(true);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#" className="background-btn-all">
              删除所有版本
            </a>
          </Popconfirm>

          {props.children}
        </div>
      )}
    </>
  );
};

export default GroupPicture;
