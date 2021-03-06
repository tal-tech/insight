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
  // ??????setCurrentId???currentId???????????????????????????relativeImageList
  const [relativeImageList, setRelativeImageList] = useRelativeImageList(
    currentId
  );

  const [hasAndroid, setHashAndroid] = useState<boolean>(true);
  const [hasIOS, setHasIOS] = useState<boolean>(true);
  const [hasData, setHasData] = useState<boolean>(true);

  const [currentClickNodeTree, setCurrentClickNodeTree] = useState<any>({});

  useEffect(() => {
    // ????????? ????????? ,????????????
    initQueryPageDetail();
    const value = localStorage.getItem("unbundling");
    const removePage = localStorage.getItem("removePage");
    if (value) {
      message.success("????????????");
      localStorage.removeItem("unbundling");
    } else if (removePage) {
      message.success("????????????");
      localStorage.removeItem("removePage");
    }
  }, []);
  useEffect(() => {
    if (isInit) {
      initQueryPageDetail();
    }
  }, [location.search]);

  // ???????????????????????????????????????
  const updateDetailPage = (item: WebQueryPageItem) => {
    console.log("webQueryPage", item);
    // ???????????????
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
    // ??????
    androidVersion = versionSort(androidVersion);
    iosVersion = versionSort(iosVersion);
    //????????????????????? [{version:xxx,data:xxx},{version:xxx,data:xxx}]
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
    //????????????????????? [{version:xxx,data:xxx},{version:xxx,data:xxx}]
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
      // ????????????????????????????????????
      setHasData(hasIOS);
      // ??????????????????????????????
      if (currentTree.version) {
        // ????????????????????????
        iosVersion.forEach((item: any, index: number) => {
          if (item.version === currentTree.version) {
            updateCurrentTree = iosVersion[index];
            nodePictureAndTableData = iosVersion[index].data;
            currentPageInfoInTable = iosPageInfoVersion[index].data;
            setPageUrl(iosPageInfoVersion[index].data.picture);
          }
        });
      } else if (!currentTree.version && hasIOS) {
        // ??????????????????????????? ????????????????????????
        updateCurrentTree = iosVersion[0];
        nodePictureAndTableData = iosVersion[0].data;
        currentPageInfoInTable = iosPageVersion[0].data;
        setPageUrl(iosPageVersion[0].data.picture);
      }
      // ?????????????????????????????????ID
      relativePageId = iosId;
    }

    if (displayCurrentPhoneType === "android") {
      setHasData(hasAndroid);

      if (currentTree.version) {
        // ????????????????????????
        androidVersion.forEach((item: any, index: number) => {
          if (item.version === currentTree.version) {
            updateCurrentTree = androidVersion[index];
            nodePictureAndTableData = androidVersion[index].data;
            currentPageInfoInTable = androidPageInfoVersion[index].data;
            setPageUrl(androidPageInfoVersion[index].data.picture);
          }
        });
      } else if (hasAndroid && !currentTree.version) {
        // ???????????????????????????
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

      // ?????????????????????????????????????????? ??????????????????  {version:xxx,data:xxx}
      // ????????????????????????????????????
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
      //??????androidId ??? iosId ???????????????????????????
      setAndroidAndIOSId({
        androidId: res.data.androidId,
        iosId: res.data.iosId,
      });

      // ?????????????????????????????????
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
      console.log("??????????????????", androidVersion, iosVersion);

      const {
        updateCurrentTree,
        nodePictureAndTableData,
        relativePageId,
        currentPageInfoInTable,
      } = initCurrentDisplayParams(params);

      // ?????????????????????????????????
      setCurrentPhoneType(displayCurrentPhoneType);
      // ?????? ????????????
      setCurrentId(relativePageId); // ???????????????useRelativeImageList hook
      // ?????????????????????????????????
      setCurrentTree(updateCurrentTree);
      // ????????????pageInfo??????
      setCurrentPageInfoData(currentPageInfoInTable);
      // ?????? ?????? table??????
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
    // ????????????page?????????table??????
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

    //??????????????????
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
      //?????????????????????

      //?????????????????????
      const singleNodeInfo = {
        id: info.node.id,
        key: info.node.key,
        name: info.node.traceName,
        route: [info.node.componentName, info.node.path],
        params: 32,
        state: info.node.hasData,
        type: "item",
      };
      // ????????????????????????
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
        // ???????????? ?????? state ??? ??????
        tableArray: [pageInfo, singleNodeInfo],
      };

      setCurrentElementPictureAndTableData(currentElementPictureAndTableData);
    } else {
      //??????????????????????????????????????????children????????????table
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
          type: "item", // ??????????????????????????? item , page??????
        });

      getPictureAndTableArrayFromClickNode(
        childNode,
        null,
        pictureArray,
        tableArray
      );
      // TODO: ????????????
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
    //  ????????????????????? tempPageName;
    // ???????????????????????????????????????????????????
    const params = {
      pageName: tempPageName,
      pageGroupId,
    };

    updatePageName(params).then((res) => {
      if (res.code === 0) {
        message.success("????????????????????????");
        setCurrentPageName(tempPageName);
        setEditPageName(false);
        setFocus(false);

        //??????url
        navigate(
          `/burying?pageGroupId=${pageGroupId}&pageName=${tempPageName}`
        );

        // ??????table???????????????
        // ????????? ????????????currentPageInfoData???????????????????????????????????????
        currentPageInfoData.pageName = tempPageName;
        // ?????????????????????iosPageInfo???androidPageInfo ??????????????????????????????????????????????????????????????????????????????setCurrentElementPictureAndTableData ?????????
        const { pictureArray, tableArray } = currentElementPictureAndTableData;
        tableArray[0].name = tempPageName;
        setCurrentElementPictureAndTableData({
          pictureArray,
          tableArray,
        });

        // ?????? ?????????????????????????????????????????????????????????????????????
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
        message.error("????????????????????????,???????????????");
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
    // ???????????????table??????
    getPictureAndTableArrayFromClickNode(
      node,
      currentPageInfoInTable,
      pictureArray,
      tableArray
    );
    //?????? ?????????table??????
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
        // ???????????????
        setHasIOS(hasIOSVersion);
        // ??????pageInfo
        iosPageInfoVersion.forEach((iosItem: any) => {
          if (iosItem.version === key) {
            //????????????pageInfo
            setCurrentPageInfoData(iosItem.data);
            setPageUrl(iosItem.data.picture);
            setCurrentPageName(iosItem.data.pageName);
          }
        });
      } else {
        setHasIOS(hasIOSVersion);
        iosElementsVersion.forEach((item: any) => {
          if (item.version === key) {
            // ???????????????
            setCurrentTree(item);
            iosPageInfoVersion.forEach((iosItem: any) => {
              if (iosItem.version === key) {
                //????????????pageInfo
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
      console.log("hasAndroidVersion ????????????????????????", hasAndroidVersion);

      if (!hasAndroidVersion) {
        console.log("?????????", hasAndroidVersion);

        // ???????????????
        setHashAndroid(hasAndroidVersion);
        // ??????pageInfo
        androidPageInfoVersion.forEach((iosItem: any) => {
          if (iosItem.version === key) {
            //????????????pageInfo
            setCurrentPageInfoData(iosItem.data);
            setPageUrl(iosItem.data.picture);
            setCurrentPageName(iosItem.data.pageName);
          }
        });
      } else {
        console.log("?????????", hasAndroidVersion);
        setHashAndroid(hasAndroidVersion);
        androidElementsVersion.forEach((item: any) => {
          if (item.version === key) {
            setCurrentTree(item);
            androidPageInfoVersion.forEach((androidItem: any) => {
              if (androidItem.version === key) {
                //????????????pageInfo
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
    // ??????????????? version
    // ?????? ???????????? ???????????????
    // ?????????????????????
    if (activeKey === "ios") {
      if (isHasIos) {
        // ???????????????ios???????????? ?????????{}
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
        // ????????????????????????????????? ?????????{}
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

  // ???????????????????????????????????????
  const deletePageFn = async () => {
    console.log("currentPageInfoData", currentPageInfoData, currentTree);
    let params = {
      pageId: currentPageInfoData.pageId,
      platform: currentPhoneType === "ios" ? "iOS" : "android", // ios ?????? android
      version: currentTree.version,
    };
    const res = await deletePage(params);
    if (res.code === 0) {
      localStorage.setItem("removePage", "??????????????????");
      navigate("/burying");
      window.location.reload();
    }
  };
  // ????????????
  const unbundlingFn = async () => {
    const params = {
      pageGroupId: pageGroupId,
      platform: currentPhoneType === "ios" ? "iOS" : "android", // ios ?????? android
    };
    let res = await movePageMatch(params);
    if (res.code === 0) {
      // ???????????????????????????
      navigate(`/burying?pageGroupId=${res.data.newPageGroupId}`);
      localStorage.setItem("unbundling", "????????????");
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
