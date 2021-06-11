import React, { FC, useState, useEffect } from "react";
import { Typography } from "antd";
import "./index.less";
import { Button, Empty, Popover, Input, message } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import NewWaterFall from "./components/Waterfall/waterfall";
import PopoverSearch from "./components/PopoverSearch/popoverSearch";
import DetailPage from "./detailPage";
import {
  webQueryPage,
  updatePageOrder,
} from "../../api/tracevisual/tracevisual";
import {
  WebQueryPageRequest,
  Module,
} from "../../api/tracevisual/tracevisualComponents";
import { useAppState } from "stores";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";
import { UrlParamsProps } from "../../interface/burying/burying";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggablePage from "./draggablePage";

type ICurrentPage = "index" | "detail" | "draggable";

import setting from "../../assets/header/setting.png";

const BuryingPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { initBury } = useAppState((state) => state.tagsView);
  const [imageList, setImageList] = useState<any>([]);

  const [pageModuleItem, setPageModuleItem] = useState<Module>({
    moduleName: "全部",
    id: 0,
  });
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [urlParams, setUrlParams] = useState<UrlParamsProps>((): any => {
    return qs.parse(location.search, { ignoreQueryPrefix: true });
  });
  const [currentPage, setCurrentPage] = useState<ICurrentPage>("index");

  const [searchParams, setSearchParams] = useState<WebQueryPageRequest>({
    currentPage: 1,
    pageSize: 20,
    moduleId: 0,
  });

  const [searchTimer, setSearchTimer] = useState<string>("");
  const [imageListHasAll, setImageListHasAll] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    // 判断当前页面是列表页，还是详情页

    if (urlParams["pageGroupId"]) {
      // 说明是详情页
      // @ts-ignore
      setUrlParams(urlParams);
      setCurrentPage("detail");
    } else {
      setCurrentPage("index");

      navigate("/burying");
    }
  }, [location.pathname]);

  useEffect(() => {
    getPageList(searchParams, "init");
  }, []);

  useEffect(() => {
    if (initBury.indexOf("true") >= 0) {
      //说明是要初始化页面
      setImageList([]);
      setPageModuleItem({ moduleName: "全部", id: 0 });
      setPopoverVisible(false);
      setCurrentPage("index");
      setSearchTimer("");
      setImageListHasAll(false);
      setSearchString("");

      const params = {
        currentPage: 1,
        pageSize: 20,
        moduleId: 0,
      };
      setSearchParams(params);
      setTimeout(() => {
        getPageList(params, "init");
      });
    }
  }, [initBury]);

  const getPageList = (params: WebQueryPageRequest, type: string) => {
    webQueryPage(params).then((res) => {
      console.log("列表res", res);
      if (res.code === 0) {
        let list = [];
        if (res.data.pages.length < 20) {
          // 说明已经没有了
          setImageListHasAll(true);
        }
        if (type === "init") {
          list = res.data.pages;
        } else {
          list = [...imageList, ...res.data.pages];
        }
        // list = list.map((item,index)=>{
        //   return {...item,id:index}
        // });
        setImageList(list);
      } else {
        setImageList([]);
        setImageListHasAll(false);
      }
    });
  };

  const onKeyPressEnter = (e: React.KeyboardEvent) => {
    if (e.keyCode !== 13) return;
    onSearch(searchString);
  };

  const onSearch = (e: String | React.ChangeEvent<HTMLInputElement>) => {
    let searchString = e;
    if (typeof e !== "string") {
      // @ts-ignore
      searchString = e.target.value.trim();
      setSearchString(searchString as string);
    }

    let timer: any;
    if (searchTimer) return;
    timer = setTimeout(() => {
      // 如果在第二个页面，就回到第一个页面
      if (currentPage !== "index") {
        setCurrentPage("index");
        navigate("/burying");
      }

      const params: any = {
        moduleId: pageModuleItem.id,
        searchStr: searchString,
        currentPage: 1,
        pageSize: 20,
      };

      setImageList([]);
      setSearchParams(params);
      setImageListHasAll(false);

      getPageList(params, "init");
      clearTimeout(timer);
      setSearchTimer("");
    }, 800);
    setSearchTimer(timer);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const onClick = () => {
    // 弹出弹框
    setPopoverVisible(true);
  };

  const setCurrentModuleName = (item: Module): void => {
    // 如果是第二个页面，那么就回到第一个页面
    currentPage !== "index" && setCurrentPage("index");

    setPageModuleItem(item);
    setPopoverVisible(false);
    // 搜索瀑布流列表
    const params = Object.assign(searchParams, {
      moduleId: item.id,
      currentPage: 1,
    });
    setImageList([]);
    setSearchParams(params);
    getPageList(params, "init");
  };

  const updateImageList = (list: any): void => {
    setImageList(list);
  };

  const goBack = () => {
    setPopoverVisible(false);
    setImageListHasAll(false);
    currentPage !== "index" && setCurrentPage("index");

    navigate(`/burying`);

    // 搜索瀑布流列表
    const params = Object.assign(searchParams, {
      moduleId: pageModuleItem.id,
      currentPage: 1,
    });
    setImageList([]);
    setSearchParams(params);
    getPageList(params, "init");
  };

  const toDetailPage = (item: UrlParamsProps) => {
    setUrlParams(item);
    setCurrentPage("detail");
    navigate(
      `/burying?pageGroupId=${item.pageGroupId}&pageName=${item.pageName}`
    );
  };

  const updateRelativePage = (item: UrlParamsProps) => {
    setCurrentPage("index");

    setUrlParams(item);
    setTimeout(() => {
      setCurrentPage("detail");
      navigate(
        `/burying?pageGroupId=${item.pageGroupId}&pageName=${item.pageName}&phoneType=${item.phoneType}`
      );
    });
  };

  const onScroll = (event: any) => {
    const target = event.target;
    // 滚动条的总高度
    const scrollHeight = target.scrollHeight;
    // 可视区的高度
    const clientHeight = target.clientHeight;
    // 距离顶部的距离
    const scrollTop = target.scrollTop;

    // 滚动到底部
    if (scrollTop + clientHeight >= scrollHeight && !imageListHasAll) {
      const { currentPage } = searchParams;
      const params = Object.assign(searchParams, {
        currentPage: currentPage + 1,
      });
      setSearchParams(params);
      getPageList(params, "add");
    }
  };

  const saveImageSort = (imageSortList: any) => {
    const pageGroupIds = imageSortList.map((item: any) => {
      return item.pageGroupId;
    });
    const params = {
      moduleId: pageModuleItem.id,
      pageGroupIds,
    };
    updatePageOrder(params).then((res) => {
      if (res.code === 0) {
        updateImageList(imageSortList);
        setCurrentPage("index");
        message.success(`已更新 ${pageModuleItem.moduleName} 模块排序`);
      } else {
        message.error("排序失败");
      }
    });
  };

  const ModuleOperation = () => {
    return (
      <div
        onClick={() => setCurrentPage("draggable")}
        style={{ cursor: "pointer" }}
      >
        整理模块
      </div>
    );
  };

  return (
    <div className="burying" onScroll={(e) => onScroll(e)}>
      <Typography className="innerText">
        <div className="header">
          <Button
            type="primary"
            onClick={onClick}
            size="large"
            style={{ borderRadius: "15px", width: "15%", minWidth: "120px" }}
            className="module-button"
          >
            <div className="modules">模块</div>
            <div className="name">
              <div className="text">{pageModuleItem.moduleName}</div>
              <DownOutlined className="module-icon" />
            </div>
          </Button>

          {popoverVisible && (
            <PopoverSearch
              closePopover={closePopover}
              setCurrentModuleName={setCurrentModuleName}
              hasAllModule={true}
            />
          )}

          <div className="search">
            <SearchOutlined className="search-icon" style={{ zIndex: 5 }} />
            <Input
              size="large"
              placeholder="请输入页面名称、页面路径、页面及元素参数"
              allowClear
              value={searchString}
              style={{ marginLeft: "20px", borderRadius: "20px" }}
              onChange={onSearch}
              onKeyUp={(e) => onKeyPressEnter(e)}
            />
          </div>
        </div>

        {currentPage === "index" && pageModuleItem.id > 0 && (
          <div className="module-operation">
            <Popover
              placement="bottom"
              content={ModuleOperation}
              trigger="click"
              className="module-operation-popover"
            >
              <div className="text">{pageModuleItem.moduleName}</div>
              <img
                src={setting}
                alt=""
                style={{ width: 10, height: 10, marginLeft: 10 }}
              />
            </Popover>
          </div>
        )}

        {currentPage === "draggable" && (
          <DndProvider backend={HTML5Backend}>
            <DraggablePage
              saveImageSort={saveImageSort}
              goBack={goBack}
              toDetailPage={toDetailPage}
              updateImageList={updateImageList}
              imageList={imageList}
            />
          </DndProvider>
        )}

        {currentPage === "index" && (
          <div className="main">
            {imageList.length > 0 ? (
              <NewWaterFall
                imageList={imageList}
                updateImageList={updateImageList}
                toDetailPage={toDetailPage}
              />
            ) : (
              <Empty />
            )}
          </div>
        )}

        {currentPage === "detail" && (
          <div className="main">
            <DetailPage
              goBack={goBack}
              urlParams={urlParams}
              updateRelativePage={updateRelativePage}
            />
          </div>
        )}
      </Typography>
    </div>
  );
};

export default BuryingPage;
