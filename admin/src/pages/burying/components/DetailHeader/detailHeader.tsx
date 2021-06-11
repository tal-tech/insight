import React, { FC, useContext } from "react";
import {
  AlignCenterOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Dropdown, Input, Menu } from "antd";
import { BuryingDetailContext } from "../../detailPage";
import "./detailHeader.less";

interface IDetailHeader {
  changeCurrentPageName: () => void;
  onBlurChangeCurrentPageName: (e: any) => void;
  onKeyUpChangCurrentPageName: (e: any) => void;
  currentPageName: string;
  onClickChangeCurrentPageName: () => void;
  setTempPageName: (r: any) => void;
  focus: boolean;
  setFocus: (r: any) => void;
  editPageName: any;
  setEditPageName: (r: any) => void;
  changeVersion: (r: any) => void;
  goBack: () => void;
}

const DetailHeader: FC<IDetailHeader> = (props) => {
  const {
    goBack,
    editPageName,
    setEditPageName,
    focus,
    setFocus,
    changeVersion,
    setTempPageName,
    changeCurrentPageName,
    onBlurChangeCurrentPageName,
    currentPageName,
    onKeyUpChangCurrentPageName,
  } = props;

  const {
    iosPageInfoVersion,
    androidPageInfoVersion,
    currentTree,
    currentPhoneType,
    hasData,
  } = useContext(BuryingDetailContext);

  const onClickChangeCurrentPageName = () => {
    if (focus) return;
    changeCurrentPageName();
  };

  const changeModuleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPageName(e.target.value);
  };

  const menu = (
    <Menu onClick={changeVersion}>
      {currentPhoneType === "android"
        ? androidPageInfoVersion.map((item: any, index: number) => {
            return <Menu.Item key={item.version}>v{item.version}</Menu.Item>;
          })
        : iosPageInfoVersion.map((item: any, index: number) => {
            return <Menu.Item key={item.version}>v{item.version}</Menu.Item>;
          })}
    </Menu>
  );

  return (
    <>
      <ArrowLeftOutlined className="backIcon" onClick={goBack} />
      {editPageName ? (
        <div className="detail-page-name-can-edit">
          <Input
            placeholder="请输入页面名称"
            onChange={(e) => changeModuleName(e)}
            onBlur={(e) => onBlurChangeCurrentPageName(e)}
            onKeyUp={(e) => onKeyUpChangCurrentPageName(e)}
            defaultValue={currentPageName}
            className="input-ref"
          />
          <CheckCircleOutlined
            className="can-edit-name"
            onClick={(e) => onClickChangeCurrentPageName()}
          />
        </div>
      ) : (
        <div className="detail-page-name">
          <span className="detail-page-name-text">{currentPageName}</span>
          <EditOutlined
            className="editIcon"
            onClick={() => {
              setTempPageName(currentPageName);
              setEditPageName(true);
              setFocus(true);
              setTimeout(() => {
                (document.getElementsByClassName(
                  "input-ref"
                )[0] as HTMLInputElement).focus();
              }, 300);
            }}
          />
        </div>
      )}
      {hasData ? (
        <Dropdown overlay={menu}>
          <div className="page-version has-data">
            <AlignCenterOutlined className="page-version-icon" />
            <span>版本:v{currentTree.version}</span>
          </div>
        </Dropdown>
      ) : (
        <div className="page-version">
          <AlignCenterOutlined className="page-version-icon" />
          <span>暂无版本</span>
        </div>
      )}
    </>
  );
};

export default DetailHeader;
