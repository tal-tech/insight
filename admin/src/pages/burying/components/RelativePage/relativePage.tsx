import React, { FC } from "react";
import NewWaterFall from "../Waterfall/waterfall";
import { Empty } from "antd";
import "./relativePage.less";
interface IRelativePage {
  relativeImageList: any;
  updateImageList: (r: any) => void;
  updateDetailPage: (r: any) => void;
}

const RelativePage: FC<IRelativePage> = (props) => {
  const { relativeImageList, updateImageList, updateDetailPage } = props;
  return (
    <div className="relative-page">
      <div className="button-name">相关页面</div>
      {relativeImageList.length > 0 ? (
        <NewWaterFall
          imageList={relativeImageList}
          updateImageList={updateImageList}
          toDetailPage={updateDetailPage}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default RelativePage;
