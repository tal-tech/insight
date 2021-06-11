import React, { FC, useState, useRef, useEffect } from "react";
import WaterFall from "../../../../components/waterfall";
import "./waterfall.less";
import { NewWaterFallProps } from "../../../../interface/burying/waterfall";
import { Input, message } from "antd";
import {
  DownOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { limitStringLength } from "../../../../utils/tools";
import PopoverSearch from "../PopoverSearch/popoverSearch";
import {
  Module,
  WebQueryPageItem,
} from "../../../../api/tracevisual/tracevisualComponents";
import {
  updatePageModuleId,
  updatePageName,
} from "../../../../api/tracevisual/tracevisual";

const NewWaterFall: FC<NewWaterFallProps> = (props) => {
  const { imageList, updateImageList, toDetailPage } = props;
  const [currentEnterId, setCurrentEnterId] = useState<string>("");
  const [canEditName, setCanEditName] = useState<boolean>(false);
  const [currentPageNameInfo, setCurrentPageNameInfo] = useState<any>({});
  const [hasAuth] = useState<boolean>(true);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [getDomTimer, setGetDomTimer] = useState<number>(0);

  const hoverEditRef = useRef<HTMLDivElement>(null);

  const mouseOver = (pageGroupId: string) => {
    if (canEditName || popoverVisible) return;
    setCurrentEnterId(pageGroupId);
  };

  const mouseLeave = (pageGroupId: string) => {
    if (canEditName || popoverVisible) return;
    setCurrentEnterId("");
  };

  const changeEditState = (pageName: string, item: any) => {
    setCanEditName(true);
    setCurrentPageNameInfo({
      pageName,
      item,
    });
    const timer = setTimeout(() => {
      (document.getElementsByClassName(
        "edit-input"
      )[0] as HTMLInputElement).focus();
    });
    setGetDomTimer(timer);
  };

  const changeCurrentPageName = (item: WebQueryPageItem) => {
    let targetIndex = 0;
    imageList.forEach((image: any, index: number) => {
      if (image.pageGroupId === item.pageGroupId) {
        targetIndex = index;
      }
    });
    // 发送请求给后端，修改名字，成功的话
    const params = {
      pageGroupId: item.pageGroupId,
      pageName: currentPageNameInfo.pageName,
    };

    updatePageName(params).then((res) => {
      if (res.code === 0) {
        imageList[targetIndex].pageName = currentPageNameInfo?.pageName;
        message.success("修改页面名称成功");
        console.log("[changeCurrentPageName]的结果", res);
        setCanEditName(false);
        // setImageList(imageList)
        updateImageList(imageList);
        clearTimeout(getDomTimer);
      } else {
        message.error("页面名称已重名,请重新修改");
      }
    });
  };

  const onKeyUpChangCurrentPageName = (e: React.KeyboardEvent, item: any) => {
    if (e.keyCode !== 13) return;
    changeCurrentPageName(item);
  };

  const changeInputPageName = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    console.log(e.target.value);
    const obj: any = {
      pageName: e?.target.value,
      item,
    };
    setCurrentPageNameInfo(obj);
  };

  const showPopover = () => {
    setPopoverVisible(true);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const setCurrentModuleName = (
    moduleItem: Module,
    pageItem: WebQueryPageItem
  ): void => {
    // setModuleName(item.key);
    setPopoverVisible(false);
    const params = {
      pageGroupId: pageItem.pageGroupId,
      pageModuleId: moduleItem.id,
    };

    console.log("[setCurrentModuleName][params]", params);
    // 修改模块分类
    imageList.forEach((i: WebQueryPageItem) => {
      if (i.pageGroupId === currentEnterId) {
        i.pageModuleName = moduleItem.moduleName;
      }
    });
    message.success("修改模块名称成功");

    updatePageModuleId(params).then((res) => {
      console.log("[setCurrentModuleName]修改模块分类的结果", res);
    });
  };

  const goToDetailPage = (
    e: React.MouseEvent,
    params: WebQueryPageItem
  ): void => {
    console.log("params", params);
    if ((e.target as HTMLElement).className === "hover-editor") {
      console.log("可以跳转");
      toDetailPage(params);
    } else {
      console.log("不可以跳转");
    }
  };
  const renderItem = (item: any, index: number) => {
    const { pageGroupId, pageUrl, pageModuleName, pageName } = item;
    return (
      <div className="waterfall-item-wrapper" key={index}>
        <div
          className="waterfall-item-image"
          onMouseOver={(e) => mouseOver(pageGroupId)}
          onMouseLeave={(e) => mouseLeave(pageGroupId)}
        >
          <img src={pageUrl} alt="" />
          {currentEnterId === pageGroupId && (
            <div className="hover-editor-background" />
          )}
          {currentEnterId === pageGroupId && (
            <div
              className="hover-editor"
              onClick={(e) => goToDetailPage(e, item)}
              ref={hoverEditRef}
            >
              <div className="hover-editor-header" onClick={showPopover}>
                <div className="hover-editor-name">
                  {limitStringLength(pageModuleName, 5)}
                </div>
                <DownOutlined className="hover-editor-downOutIcon" />
                <div className="hover-editor-text">归类</div>
              </div>

              {popoverVisible && currentEnterId === pageGroupId && (
                <PopoverSearch
                  className="popover-classname"
                  closePopover={closePopover}
                  setCurrentModuleName={(moduleItem) =>
                    setCurrentModuleName(moduleItem, item)
                  }
                  hasAllModule={false}
                />
              )}
              <div className="hover-editor-footer">
                {!canEditName && (
                  <div>
                    <Input
                      className="hover-editor-input"
                      placeholder="请输入页面名称"
                      disabled
                      value={limitStringLength(pageName, 12)}
                    />
                    {hasAuth && (
                      <EditOutlined
                        className="can-edit-name"
                        onClick={() => changeEditState(pageName, item)}
                      />
                    )}
                  </div>
                )}

                {canEditName && (
                  <div>
                    <Input
                      placeholder="请输入页面名称"
                      className="hover-editor-input edit-input"
                      disabled={!hasAuth}
                      onChange={(e) => changeInputPageName(e, item)}
                      onKeyUp={(e) => onKeyUpChangCurrentPageName(e, item)}
                      defaultValue={pageName}
                    />
                    <CheckCircleOutlined
                      className="can-edit-name"
                      onClick={(e) => changeCurrentPageName(item)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  return <WaterFall data={imageList} renderItem={renderItem} />;
};

export default NewWaterFall;
