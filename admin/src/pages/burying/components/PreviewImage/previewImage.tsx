import React, { FC, useEffect, useState, useContext } from "react";
import GroupPicture from "./groupPicture";
import useImageSize from "../../../../hooks/useImageSize";
import { message } from "antd";
import "./previewImage.less";
import { loadImg } from "../../utils/tools";
import { BuryingDetailContext } from "../../detailPage";
import { deleteTrace } from "@/../api/tracevisual/tracevisual";

interface IPreviewImage {
  src: string;
  element?: boolean;
  item?: any;
  info?: any; // 用于模拟onSelect的参数
  currentElementPictureAndTableData?: any; // 判断页面的图片数量
  onSelect: Function; // 模拟点击节点
}

const PreviewImage: FC<IPreviewImage> = (props) => {
  const [isShowDetail, SetIsShowDetail] = useState(false);

  const { currentTree, currentPhoneType, initQueryPageDetail } = useContext(
    BuryingDetailContext
  );
  // 用来展示一个小元素的图片尺寸
  let [elementWidth] = useImageSize(props.item.smallPicture, 4.4);

  // 用来展示 元素和整张图的 组合图片
  let [smallPictureWidth, smallPictureHeight] = useImageSize(
    props.item.smallPicture,
    1
  );
  let [fullPictureWidth, fullPictureHeight] = useImageSize(
    props.item.fullPicture,
    1
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  let screenWidth: any, screenHeight: any;
  // 计算展示区域 详情展示区域和全屏展示区域
  function countScreen() {
    // 浏览器窗口宽高
    screenWidth = document.body.clientWidth * 0.8;
    screenHeight = document.body.clientHeight;
    // 详情区域宽高 不展示弹窗时
    if (isShowDetail && !isModalVisible) {
      const dom: any = document.querySelector(".more-image");
      screenWidth = dom.clientWidth;
      screenHeight = dom.clientHeight;
    }
  }
  countScreen();
  const { xStart, yStart } = props.item.position;
  const [containerStyleDetail, setContainerStyleDetail] = useState<any>({});
  const [containerStyle, setContainerStyle] = useState<any>({});
  const [elementStyle, setElementStyle] = useState<any>({});

  useEffect(() => {
    getContainerAndElementStyle();
  }, [
    fullPictureHeight,
    fullPictureWidth,
    containerStyle.height,
    containerStyle.width,
    elementStyle.left,
    elementStyle.top,
    xStart,
    yStart,
    isShowDetail,
  ]);

  // 切换展示区域 重新计算
  useEffect(() => {
    countScreen();
    getContainerAndElementStyle();
  }, [isModalVisible]);

  useEffect(() => {
    // 最小节点 只有一张图片
    if (props?.currentElementPictureAndTableData?.pictureArray?.length === 1) {
      SetIsShowDetail(true);
    } else {
      SetIsShowDetail(false);
    }
  }, [props.currentElementPictureAndTableData?.pictureArray?.length]);

  const useOnlyScreenHeight = (heightZoom: number) => {
    const containerStyle = {
      height: screenHeight,
      width: fullPictureWidth * heightZoom,
    };

    const elementStyle = {
      height: smallPictureHeight * heightZoom,
      width: smallPictureWidth * heightZoom,
    };

    return [containerStyle, elementStyle];
  };

  const useOnlyScreenWidth = (widthZoom: number) => {
    const containerStyle = {
      height: fullPictureHeight * widthZoom,
      width: screenWidth,
    };

    const elementStyle = {
      height: smallPictureHeight * widthZoom,
      width: smallPictureWidth * widthZoom,
    };

    return [containerStyle, elementStyle];
  };

  const useFullPictureSize = () => {
    const containerStyle = {
      height: fullPictureHeight,
      width: fullPictureWidth,
    };

    const elementStyle = {
      height: fullPictureHeight,
      width: fullPictureWidth,
    };

    return [containerStyle, elementStyle];
  };

  // 详细图片计算
  const detailStyle = () => {
    if (isShowDetail) {
      let num: number = 1;
      // 宽度可能会超出 另外再算下 即可
      for (let i = 99; i > 0; i--) {
        num = Number((i / 100).toFixed(2)); // 获取最高高度
        // 570 是容器的高度
        if (containerStyle.height * num <= 570) {
          break;
        }
      }
      setContainerStyleDetail({
        width: containerStyle.width * num,
        height: containerStyle.height * num,
        elementWidth: elementStyle.width * num,
        elementHeight: elementStyle.height * num,
        elementTop: elementStyle.top * num,
        elementLeft: elementStyle.left * num,
      });
    }
  };

  function getContainerAndElementStyle() {
    const heightZoom = screenHeight / fullPictureHeight;
    const widthZoom = screenWidth / fullPictureWidth;

    let containerStyle: any = {
      height: 0,
      width: 0,
    };
    let elementStyle: any = {
      height: 0,
      width: 0,
      top: 0,
      left: 0,
    };

    if (fullPictureHeight >= fullPictureWidth) {
      // 说明是高度大于宽度的长方形
      if (fullPictureHeight >= screenHeight) {
        // 容器高度取screenHeight  宽度等比缩放
        [containerStyle, elementStyle] = useOnlyScreenHeight(heightZoom);
      } else {
        [containerStyle, elementStyle] = useFullPictureSize();
      }
    } else {
      if (
        fullPictureHeight >= screenHeight &&
        fullPictureWidth >= screenWidth
      ) {
        if (fullPictureWidth * heightZoom <= screenWidth) {
          // 说明 高度超过了，宽度缩放没超过
          // 容器高度取 screenHeight  宽度等比缩放
          [containerStyle, elementStyle] = useOnlyScreenHeight(heightZoom);
        }
        if (fullPictureHeight * widthZoom <= screenHeight) {
          // 容器宽度取 screenWidth  高度等比缩放
          [containerStyle, elementStyle] = useOnlyScreenWidth(widthZoom);
        }
      }

      if (fullPictureHeight >= screenHeight && fullPictureWidth < screenWidth) {
        // 高度超过了，宽度没超过
        // 容器高度取 screenHeight     宽度等比缩放
        [containerStyle, elementStyle] = useOnlyScreenHeight(heightZoom);
      }

      if (fullPictureWidth >= screenWidth && fullPictureHeight < screenHeight) {
        // 宽度超过了，高度没超过
        // 容器宽度取 screenWidth     高度等比缩放
        [containerStyle, elementStyle] = useOnlyScreenWidth(widthZoom);
      }
      // 高度也没超出 宽度也没超出 使用宽度缩放 有留白
      if (containerStyle.width === 0 || elementStyle.width === 0) {
        [containerStyle, elementStyle] = useOnlyScreenWidth(widthZoom);
      }
    }

    setContainerStyle(containerStyle);
    elementStyle.top = (yStart * containerStyle.height) / 10000;
    elementStyle.left = (xStart * containerStyle.width) / 10000;
    setElementStyle(elementStyle);
    detailStyle();
  }

  // 点击树的某个节点
  const clickTree = (nodeTitle: string) => {
    let nodeAll = document.querySelectorAll(".ant-tree-node-content-wrapper");
    nodeAll.forEach((item: any) => {
      let title = item.getAttribute("title");
      if (title === nodeTitle) {
        item.click();
      }
    });
  };

  // 末端节点展示详细图片
  const showDetailFn = (props: IPreviewImage) => {
    clickTree(props.info.node.title);
    SetIsShowDetail(true);
  };

  const showModal = (props: IPreviewImage) => {
    if (!isShowDetail) {
      if (containerStyle.height === 0 || containerStyle.width === 0) {
        // 加载图片
        loadImg([props.item.fullPicture, props.item.smallPicture]).then(
          (res: any) => {
            showDetailFn(props);
          }
        );
      } else {
        showDetailFn(props);
      }
    } else {
      // 图片未加载
      if (containerStyle.height === 0 || containerStyle.width === 0) {
        // 两张图片加载完毕 再显示
        loadImg([props.item.fullPicture, props.item.smallPicture]).then(
          (res) => {
            setIsModalVisible(true);
          }
        );
      } else {
        setIsModalVisible(true);
      }
    }
    console.log("当前页面的数据:containerStyle", containerStyle);
    console.log("当前页面的数据:elementStyle", elementStyle);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteBtnFn = async (all = false) => {
    let params: any = {
      componentName: props.info.node.componentName, // 叶子节点
      path: props.info.node.path, // 叶子节点
      version: currentTree.version, // 版本号
      platform: currentPhoneType === "ios" ? "iOS" : "android", // ios 或者 android
      isAllVersion: all, // 是否删除所有版本
    };
    const res = await deleteTrace(params);
    if (res.code === 0) {
      initQueryPageDetail();
      clickTree("root"); // 回到根节点
      localStorage.setItem("removePage", "删除页面成功");
      window.location.reload();
    } else {
      message.success(`删除失败${res}`);
    }
  };

  return (
    <>
      <div className="element-wrapper">
        {isShowDetail && !isModalVisible ? (
          <div
            className="group-picture-main2"
            style={{
              width: containerStyleDetail.width,
              height: containerStyleDetail.height,
            }}
            onClick={() => {
              showModal(props);
            }}
          >
            <img
              src={props.item.fullPicture}
              alt=""
              className="group-full-picture"
            />
            <img
              src={props.item.smallPicture}
              alt=""
              style={{
                width: containerStyleDetail.elementWidth,
                height: containerStyleDetail.elementHeight,
                top: containerStyleDetail.elementTop,
                left: containerStyleDetail.elementLeft,
              }}
              className="group-small-picture"
            />
          </div>
        ) : (
          <img
            src={props.item.smallPicture}
            alt=""
            style={{ width: `${elementWidth * 1.5}px`, cursor: "pointer" }}
            onClick={() => {
              showModal(props);
            }}
          />
        )}

        <GroupPicture
          visible={isModalVisible}
          onCancel={handleCancel}
          onDeleteFn={deleteBtnFn}
          item={props.item}
        >
          <div className="group-picture-main" style={containerStyle}>
            <img
              src={props.item.fullPicture}
              alt=""
              className="group-full-picture"
            />
            <img
              src={props.item.smallPicture}
              alt=""
              style={elementStyle}
              className="group-small-picture"
            />
          </div>
        </GroupPicture>
      </div>
    </>
  );
};

export default PreviewImage;
