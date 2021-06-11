import React, { FC, useState, useEffect, createContext } from "react";

import { message, Menu } from "antd";
import "./detailPage.less";
import { WebQueryPageItem } from "../../api/tracevisual/tracevisualComponents";
import {
  updatePageName,
  queryPageDetail,
  movePageMatch,
  deletePage,
} from "../../api/tracevisual/tracevisual";
import {
  DetailPageProps,
  AndroidAndIOSType,
} from "../../interface/burying/burying";
import RelativePage from "./components/RelativePage/relativePage";
import TreeTab from "./components/TreeTab/treeTab";
import PictureAndTable from "./components/PictureAndTable/pictureAndTable";
import { useNavigate } from "react-router-dom";
import DetailHeader from "./components/DetailHeader/detailHeader";
import {
  initPageHandleDataTree,
  getCurrentDisplayType,
  versionSort,
} from "./utils/tools";
import useRelativeImageList from "./hooks/useRelativeImageList";

export const BuryingDetailContext = createContext<any>({ name: "0" });

const DetailPage: FC<DetailPageProps> = (props) => {
  const navigate = useNavigate();

  const { urlParams, goBack, updateRelativePage } = props;
  const { pageName, pageGroupId: rawId, phoneType = "" } = urlParams;

  const [pageUrl, setPageUrl] = useState<string>("");
  const [pageGroupId, setPageGroupId] = useState<string>(rawId);
  const [currentPageName, setCurrentPageName] = useState<string>(pageName);

  const [tempPageName, setTempPageName] = useState<string>("");
  const [editPageName, setEditPageName] = useState<boolean>(false);

  const [androidElementsVersion, setAndroidElementsVersion] = useState<any>([
    { version: null, data: null },
  ]);
  const [iosElementsVersion, setIOSElementsVersion] = useState<any>([
    { version: null, data: null },
  ]);
  const [iosPageInfoVersion, setIOSPageInfoVersion] = useState<any>([
    { version: null, data: null },
  ]);
  const [androidPageInfoVersion, setAndroidPageInfoVersion] = useState<any>([
    { version: null, data: null },
  ]);

  const [currentPageInfoData, setCurrentPageInfoData] = useState<any>({
    version: null,
    data: null,
  });
  const [currentTree, setCurrentTree] = useState<any>({
    version: null,
    data: null,
  });
  const [currentPhoneType, setCurrentPhoneType] = useState<string>("ios");
  const [
    currentElementPictureAndTableData,
    setCurrentElementPictureAndTableData,
  ] = useState<any>({
    pictureArray: [],
    tableArray: [],
  });
  const [isInit, setIsInit] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);

  const [androidAndIOSId, setAndroidAndIOSId] = useState<AndroidAndIOSType>({
    androidId: -1,
    iosId: -1,
  });
  const [currentId, setCurrentId] = useState<number>(-1);
  // 每当setCurrentId，currentId变化了都会重新获得relativeImageList
  const [relativeImageList, setRelativeImageList] = useRelativeImageList(
    currentId
  );

  const [hasAndroid, setHashAndroid] = useState<boolean>(true);
  const [hasIOS, setHasIOS] = useState<boolean>(true);
  const [hasData, setHasData] = useState<boolean>(true);

  const [currentClickNodeTree, setCurrentClickNodeTree] = useState<any>({});

  useEffect(() => {
    // 初始化 树结构 ,相关页面
    initQueryPageDetail();
    const value = localStorage.getItem("unbundling");
    const removePage = localStorage.getItem("removePage");
    if (value) {
      message.success("解绑成功");
      localStorage.removeItem("unbundling");
    } else if (removePage) {
      message.success("删除成功");
      localStorage.removeItem("removePage");
    }
  }, []);
  useEffect(() => {
    if (isInit) {
      initQueryPageDetail();
    }
  }, [location.search]);

  // 点击相关页面，刷新页面数据
  const updateDetailPage = (item: WebQueryPageItem) => {
    console.log("webQueryPage", item);
    // 初始化参数
    const params = { ...item, phoneType: currentPhoneType };
    updateRelativePage(params);
  };

  const handleAndroidAndIOSData = (android: any, ios: any) => {
    let androidVersion: any = [];
    let iosVersion: any = [];

    for (let key in android) {
      androidVersion.push({
        version: key,
        data: initPageHandleDataTree([android[key]]),
      });
    }

    for (let key in ios) {
      iosVersion.push({
        version: key,
        data: initPageHandleDataTree([ios[key]]),
      });
    }
    // 排序
    androidVersion = versionSort(androidVersion);
    iosVersion = versionSort(iosVersion);
    //数据结构如下： [{version:xxx,data:xxx},{version:xxx,data:xxx}]
    setAndroidElementsVersion(androidVersion);
    setIOSElementsVersion(iosVersion);

    return {
      androidVersion,
      iosVersion,
    };
  };

  const handleAndroidAndIOSPageInfo = (
    androidPageInfo: any,
    iosPageInfo: any
  ) => {
    let androidPageVersion: any = [];
    let iosPageVersion: any = [];

    for (let key in androidPageInfo) {
      androidPageVersion.push({
        version: key,
        data: androidPageInfo[key],
      });
    }

    for (let key in iosPageInfo) {
      iosPageVersion.push({
        version: key,
        data: iosPageInfo[key],
      });
    }

    androidPageVersion = versionSort(androidPageVersion);
    iosPageVersion = versionSort(iosPageVersion);
    //数据结构如下： [{version:xxx,data:xxx},{version:xxx,data:xxx}]
    setAndroidPageInfoVersion(androidPageVersion);
    setIOSPageInfoVersion(iosPageVersion);

    return {
      androidPageVersion,
      iosPageVersion,
    };
  };

  const initCurrentDisplayParams = (params: any) => {
    const {
      displayCurrentPhoneType,
      androidPageVersion,
      androidVersion,
      iosVersion,
      iosPageVersion,
      iosId,
      androidId,
    } = params;

    let updateCurrentTree = null;
    let nodePictureAndTableData = null;
    let relativePageId = -1;
    let currentPageInfoInTable = null;
    if (displayCurrentPhoneType === "ios") {
      // 设置无数据状态的页面变量
      setHasData(hasIOS);
      // 获取当前渲染树的数据
      if (currentTree.version) {
        // 表示更新页面数据
        iosVersion.forEach((item: any, index: number) => {
          if (item.version === currentTree.version) {
            updateCurrentTree = iosVersion[index];
            nodePictureAndTableData = iosVersion[index].data;
            currentPageInfoInTable = iosPageInfoVersion[index].data;
            setPageUrl(iosPageInfoVersion[index].data.picture);
          }
        });
      } else if (!currentTree.version && hasIOS) {
        // 表示初始化页面数据 取第一个版本数据
        updateCurrentTree = iosVersion[0];
        nodePictureAndTableData = iosVersion[0].data;
        currentPageInfoInTable = iosPageVersion[0].data;
        setPageUrl(iosPageVersion[0].data.picture);
      }
      // 获取相关页面请求的参数ID
      relativePageId = iosId;
    }

    if (displayCurrentPhoneType === "android") {
      setHasData(hasAndroid);

      if (currentTree.version) {
        // 表示更新页面数据
        androidVersion.forEach((item: any, index: number) => {
          if (item.version === currentTree.version) {
            updateCurrentTree = androidVersion[index];
            nodePictureAndTableData = androidVersion[index].data;
            currentPageInfoInTable = androidPageInfoVersion[index].data;
            setPageUrl(androidPageInfoVersion[index].data.picture);
          }
        });
      } else if (hasAndroid && !currentTree.version) {
        // 表示初始化页面数据
        updateCurrentTree = androidVersion[0];
        nodePictureAndTableData = androidVersion[0]
          ? androidVersion[0].data
          : [{}];
        currentPageInfoInTable = androidPageVersion[0]
          ? androidPageVersion[0].data
          : [{}];
        setPageUrl(
          androidPageVersion[0] ? androidPageVersion[0].data.picture : ""
        );
      }
      relativePageId = androidId;
    }

    return {
      updateCurrentTree,
      nodePictureAndTableData,
      relativePageId,
      currentPageInfoInTable,
    };
  };

  const hasIosAndroid = (
    iosArr = iosElementsVersion,
    androidArr = androidElementsVersion
  ) => {
    const hasIOS = iosArr.length !== 0;
    const hasAndroid = androidArr.length !== 0;
    console.log("hasIosAndroid", hasAndroid, hasIOS, iosArr, androidArr);
    setHashAndroid(hasAndroid);
    setHasIOS(hasIOS);
    return {
      isHasIos: hasIOS,
      isHasAndroid: hasAndroid,
    };
  };

  const initQueryPageDetail = (displayCurrentPhoneType: string = phoneType) => {
    const params = { pageGroupId };
    queryPageDetail(params).then((res) => {
      setIsInit(true);
      const {
        androidElements,
        iosElements,
        androidPageInfo = {},
        iosPageInfo = {},
      } = res.data;

      // 当前页面的树，图片，表格数据 ，结构如下：  {version:xxx,data:xxx}
      // 保存了原始数据并做了处理
      const { iosVersion, androidVersion } = handleAndroidAndIOSData(
        androidElements,
        iosElements
      );
      const {
        androidPageVersion,
        iosPageVersion,
      } = handleAndroidAndIOSPageInfo(androidPageInfo, iosPageInfo);
      const hasAndroid = JSON.stringify(androidElements) !== "{}";
      const hasIOS = JSON.stringify(iosElements) !== "{}";

      setHashAndroid(hasAndroid);
      setHasIOS(hasIOS);
      //保存androidId 和 iosId 提供给相关页面查询
      setAndroidAndIOSId({
        androidId: res.data.androidId,
        iosId: res.data.iosId,
      });

      // 判断当前展示的手机类型
      displayCurrentPhoneType = getCurrentDisplayType(
        displayCurrentPhoneType,
        hasAndroid,
        hasIOS
      );

      const params = {
        displayCurrentPhoneType,
        androidPageVersion,
        androidVersion,
        iosVersion,
        iosPageVersion,
        iosId: res.data.iosId,
        androidId: res.data.androidId,
      };
      console.log("两颗树的数据", androidVersion, iosVersion);

      const {
        updateCurrentTree,
        nodePictureAndTableData,
        relativePageId,
        currentPageInfoInTable,
      } = initCurrentDisplayParams(params);

      // 设置当前展示的手机类型
      setCurrentPhoneType(displayCurrentPhoneType);
      // 渲染 相关页面
      setCurrentId(relativePageId); // 设置后触发useRelativeImageList hook
      // 设置当前渲染树结构列表
      setCurrentTree(updateCurrentTree);
      // 设置当前pageInfo数据
      setCurrentPageInfoData(currentPageInfoInTable);
      // 渲染 图片 table数据
      updateNodePictureAndTable(
        nodePictureAndTableData,
        currentPageInfoInTable
      );
    });
  };

  const getPictureAndTableArrayFromClickNode = (
    childNode: any,
    currentPageInfoInTable: any,
    pictureArray: any,
    tableArray: any
  ) => {
    // 添加页面page数据到table列表
    if (currentPageInfoInTable) {
      tableArray.push({
        id: currentPageInfoInTable.id,
        key: currentPageInfoInTable.key || -100,
        name: currentPageInfoInTable.pageName,
        route: [
          currentPageInfoInTable.componentName,
          currentPageInfoInTable.path,
        ],
        params: 32,
        state: currentPageInfoInTable.hasData,
        type: "page",
      });
    }

    childNode &&
      childNode.forEach((item: any) => {
        if (item.id !== 0) {
          tableArray.push({
            id: item.id,
            key: item.key,
            name: item.traceName,
            route: [item.componentName, item.path],
            params: 32,
            state: item.hasData,
            type: "item",
          });
        }

        if (item.id === 0 || !item.id) {
          getPictureAndTableArrayFromClickNode(
            item.children,
            null,
            pictureArray,
            tableArray
          );
        } else {
          pictureArray.push({
            smallPicture: item.picture,
            fullPicture: item.fullPicture,
            position: item.position,
            title: item.title,
            info: { node: item },
          });
        }
      });
  };

  function onSelect(selectedKeys: any, info: any) {
    console.log("infoinfoinfoinfo--------", info);
    setCurrentClickNodeTree(info);

    //当前页面数据
    const pageInfo = {
      id: currentPageInfoData.id,
      key: currentPageInfoData.key || -100,
      name: currentPageInfoData.pageName,
      route: [currentPageInfoData.componentName, currentPageInfoData.path],
      params: 32,
      state: currentPageInfoData.hasData,
      type: "page",
    };

    if (info.node.id > 0) {
      //说明是单一元素

      //当前末节点数据
      const singleNodeInfo = {
        id: info.node.id,
        key: info.node.key,
        name: info.node.traceName,
        route: [info.node.componentName, info.node.path],
        params: 32,
        state: info.node.hasData,
        type: "item",
      };
      // 合并节点保存渲染
      const currentElementPictureAndTableData = {
        pictureArray: [
          {
            smallPicture: info.node.picture,
            fullPicture: info.node.fullPicture,
            position: info.node.position,
            title: info.node.title,
            info: info,
          },
        ],
        // 发送请求 拿到 state 的 结果
        tableArray: [pageInfo, singleNodeInfo],
      };

      setCurrentElementPictureAndTableData(currentElementPictureAndTableData);
    } else {
      //说明是路径元素，需要拿到所有children的图片和table
      // info.node.children
      const pictureArray: Array<string> = [];
      const tableArray: Array<any> = [pageInfo];
      const childNode = info.node.children;
      info.node.id !== 0 &&
        tableArray.push({
          id: info.node.id,
          key: info.node.key,
          name: info.node.traceName,
          route: [info.node.componentName, info.node.path],
          params: 32,
          state: info.node.hasData,
          type: "item", // 表示是具体元素数据 item , page两种
        });

      getPictureAndTableArrayFromClickNode(
        childNode,
        null,
        pictureArray,
        tableArray
      );
      // TODO: 排序图片
      console.log("pictureArray222", pictureArray);
      setCurrentElementPictureAndTableData({
        pictureArray,
        tableArray,
      });
    }
  }

  const onKeyUpChangCurrentPageName = (e: React.KeyboardEvent) => {
    if (e.keyCode !== 13) return;
    changeCurrentPageName();
  };

  const onBlurChangeCurrentPageName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    changeCurrentPageName();
  };

  const onClickChangeCurrentPageName = () => {
    if (focus) return;
    changeCurrentPageName();
  };

  const changeCurrentPageName = () => {
    //  发送请求给后端 tempPageName;
    // 发送请求给后端，修改名字，成功的话
    const params = {
      pageName: tempPageName,
      pageGroupId,
    };

    updatePageName(params).then((res) => {
      if (res.code === 0) {
        message.success("修改页面名称成功");
        setCurrentPageName(tempPageName);
        setEditPageName(false);
        setFocus(false);

        //更新url
        navigate(
          `/burying?pageGroupId=${pageGroupId}&pageName=${tempPageName}`
        );

        // 更新table表格的数据
        // 第一步 直接修改currentPageInfoData，但是切换后数据并没有变化
        currentPageInfoData.pageName = tempPageName;
        // 更新：因为这个iosPageInfo、androidPageInfo 后端是另外给了字段的，不需要从接点遍历过去，所以直接setCurrentElementPictureAndTableData 来更新
        const { pictureArray, tableArray } = currentElementPictureAndTableData;
        tableArray[0].name = tempPageName;
        setCurrentElementPictureAndTableData({
          pictureArray,
          tableArray,
        });

        // 所以 第二步修改原始数据，使得切换后数据能够是最新的
        if (currentPhoneType === "ios") {
          iosPageInfoVersion.forEach((item: any) => {
            if (item.version === currentTree.version) {
              item.pageName = tempPageName;
            }
          });
          setIOSPageInfoVersion(iosPageInfoVersion);
        } else {
          androidPageInfoVersion.forEach((item: any) => {
            if (item.version === currentTree.version) {
              item.data.pageName = tempPageName;
            }
          });
          setAndroidPageInfoVersion(androidPageInfoVersion);
        }
      } else {
        message.error("该页面名称已存在,请重新输入");
      }
    });
  };

  const updateImageList = (imageList: any) => {
    setRelativeImageList(imageList);
  };

  const updateNodePictureAndTable = (
    node: any,
    currentPageInfoInTable: any
  ) => {
    const pictureArray: Array<any> = [];
    const tableArray: Array<any> = [];
    // 获取图片和table数据
    getPictureAndTableArrayFromClickNode(
      node,
      currentPageInfoInTable,
      pictureArray,
      tableArray
    );
    //渲染 图片和table表格
    setCurrentElementPictureAndTableData({
      pictureArray,
      tableArray,
    });
  };

  const hasVersionInElements = (key: string, elementsVersion: any) => {
    return elementsVersion.reduce(
      (result: boolean, item: any) => result || item.version === key,
      false
    );
  };

  const changeVersion = ({ key }: any) => {
    if (currentPhoneType === "ios") {
      const hasIOSVersion = hasVersionInElements(key, iosElementsVersion);
      if (!hasIOSVersion) {
        // 改变树结构
        setHasIOS(hasIOSVersion);
        // 改变pageInfo
        iosPageInfoVersion.forEach((iosItem: any) => {
          if (iosItem.version === key) {
            //改变当前pageInfo
            setCurrentPageInfoData(iosItem.data);
            setPageUrl(iosItem.data.picture);
            setCurrentPageName(iosItem.data.pageName);
          }
        });
      } else {
        setHasIOS(hasIOSVersion);
        iosElementsVersion.forEach((item: any) => {
          if (item.version === key) {
            // 改变树结构
            setCurrentTree(item);
            iosPageInfoVersion.forEach((iosItem: any) => {
              if (iosItem.version === key) {
                //改变当前pageInfo
                setCurrentPageInfoData(iosItem.data);
                setPageUrl(iosItem.data.picture);
                setCurrentPageName(iosItem.data.pageName);
                updateNodePictureAndTable(item.data, iosItem.data);
              }
            });
          }
        });
      }
    } else if (currentPhoneType === "android") {
      const hasAndroidVersion = hasVersionInElements(
        key,
        androidElementsVersion
      );
      console.log("hasAndroidVersion 包含了版本了吗？", hasAndroidVersion);

      if (!hasAndroidVersion) {
        console.log("没包含", hasAndroidVersion);

        // 改变树结构
        setHashAndroid(hasAndroidVersion);
        // 改变pageInfo
        androidPageInfoVersion.forEach((iosItem: any) => {
          if (iosItem.version === key) {
            //改变当前pageInfo
            setCurrentPageInfoData(iosItem.data);
            setPageUrl(iosItem.data.picture);
            setCurrentPageName(iosItem.data.pageName);
          }
        });
      } else {
        console.log("包含了", hasAndroidVersion);
        setHashAndroid(hasAndroidVersion);
        androidElementsVersion.forEach((item: any) => {
          if (item.version === key) {
            setCurrentTree(item);
            androidPageInfoVersion.forEach((androidItem: any) => {
              if (androidItem.version === key) {
                //改变当前pageInfo
                setCurrentPageInfoData(androidItem.data);
                setPageUrl(androidItem.data.picture);
                setCurrentPageName(androidItem.data.pageName);
                updateNodePictureAndTable(item.data, androidItem.data);
              }
            });
          }
        });
      }
    }
  };

  const changeTabs = (activeKey: string) => {
    setCurrentPhoneType(activeKey);
    const { isHasIos, isHasAndroid } = hasIosAndroid();
    // 更新第一个 version
    // 更新 页面结构 获取第一个
    // 更新页面的数据
    if (activeKey === "ios") {
      if (isHasIos) {
        // 后端接口的ios元素信息 不返回{}
        setHasData(true);
        setRelativeImageList([]);
        setCurrentTree(iosElementsVersion[0]);
        setCurrentPageInfoData(iosPageInfoVersion[0].data);
        setPageUrl(iosPageInfoVersion[0].data.picture);
        updateNodePictureAndTable(
          iosElementsVersion[0].data,
          iosPageInfoVersion[0].data
        );
        // getRelativePage(androidAndIOSId.iosId)
        setCurrentId(androidAndIOSId.iosId);
        return;
      }
    }

    if (activeKey === "android") {
      if (isHasAndroid) {
        // 后端接口的安卓元素信息 不返回{}
        setHasData(true);
        setRelativeImageList([]);
        setCurrentTree(androidElementsVersion[0]);
        setCurrentPageInfoData(androidPageInfoVersion[0].data);
        setPageUrl(androidPageInfoVersion[0].data.picture);
        updateNodePictureAndTable(
          androidElementsVersion[0].data,
          androidPageInfoVersion[0].data
        );
        // getRelativePage(androidAndIOSId.androidId)
        setCurrentId(androidAndIOSId.androidId);
        return;
      }
    }
    setHasData(false);
    setPageUrl("");
    setRelativeImageList([]);
  };

  // 页面详情右侧的删除页面按钮
  const deletePageFn = async () => {
    console.log("currentPageInfoData", currentPageInfoData, currentTree);
    let params = {
      pageId: currentPageInfoData.pageId,
      platform: currentPhoneType === "ios" ? "iOS" : "android", // ios 或者 android
      version: currentTree.version,
    };
    const res = await deletePage(params);
    if (res.code === 0) {
      localStorage.setItem("removePage", "删除页面成功");
      navigate("/burying");
      window.location.reload();
    }
  };
  // 解绑类型
  const unbundlingFn = async () => {
    const params = {
      pageGroupId: pageGroupId,
      platform: currentPhoneType === "ios" ? "iOS" : "android", // ios 或者 android
    };
    let res = await movePageMatch(params);
    if (res.code === 0) {
      // 跳转解绑后的新页面
      navigate(`/burying?pageGroupId=${res.data.newPageGroupId}`);
      localStorage.setItem("unbundling", "解绑成功");
      window.location.reload();
    }
  };
  return (
    <div className="detail-page">
      <BuryingDetailContext.Provider
        value={{
          hasData,
          iosPageInfoVersion,
          hasIOS,
          hasAndroid,
          currentPhoneType,
          initQueryPageDetail,
          androidPageInfoVersion,
          iosElementsVersion,
          androidElementsVersion,
          currentTree,
          deletePageFn,
          unbundlingFn,
          setCurrentTree,
        }}
      >
        <div className="detail-header">
          <DetailHeader
            changeVersion={changeVersion}
            setEditPageName={setEditPageName}
            editPageName={editPageName}
            setFocus={setFocus}
            focus={focus}
            goBack={goBack}
            setTempPageName={setTempPageName}
            currentPageName={currentPageName}
            onClickChangeCurrentPageName={onClickChangeCurrentPageName}
            changeCurrentPageName={changeCurrentPageName}
            onBlurChangeCurrentPageName={onBlurChangeCurrentPageName}
            onKeyUpChangCurrentPageName={onKeyUpChangCurrentPageName}
          />
        </div>

        <div className="page-content">
          <TreeTab onSelect={onSelect} changeTabs={changeTabs} />

          <PictureAndTable
            initQueryPageDetail={initQueryPageDetail}
            currentClickNodeTree={currentClickNodeTree}
            currentElementPictureAndTableData={
              currentElementPictureAndTableData
            }
            pageUrl={pageUrl}
            onSelect={onSelect}
          />
        </div>

        <RelativePage
          updateDetailPage={updateDetailPage}
          updateImageList={updateImageList}
          relativeImageList={relativeImageList}
        />
      </BuryingDetailContext.Provider>
    </div>
  );
};

export default DetailPage;
