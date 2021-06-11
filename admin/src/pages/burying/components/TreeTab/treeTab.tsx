import React, { FC, useCallback, useContext } from "react";
import { Button, Empty, Tree } from "antd";
import { BuryingDetailContext } from "../../detailPage";
import "./treeTab.less";

interface ITreeTab {
  changeTabs: (v: string) => void;
  onSelect: (selectedKeys: any, info: any) => void;
}

const TreeTab: FC<ITreeTab> = (props) => {
  const { changeTabs, onSelect } = props;

  const {
    iosElementsVersion,
    androidElementsVersion,
    currentTree,
    hasIOS,
    hasAndroid,
    currentPhoneType,
  } = useContext(BuryingDetailContext);

  const GenerateAndroidTreeList = useCallback(() => {
    return (
      <>
        {androidElementsVersion.map((item: any, index: any) => {
          return (
            <>
              {item.version === currentTree.version ? (
                <Tree
                  key={item.version + "android"}
                  defaultExpandAll={true}
                  showLine
                  onSelect={onSelect}
                  treeData={item.data}
                />
              ) : null}
            </>
          );
        })}
      </>
    );
  }, [currentTree.version, androidElementsVersion]);

  const GenerateIOSTreeList = useCallback(() => {
    // 这样写的目的，是为了切换版本，tree能全部展开
    return (
      <>
        {iosElementsVersion.map((item: any, index: any) => {
          return (
            <>
              {item.version === currentTree.version ? (
                <Tree
                  key={item.version + "ios"}
                  defaultExpandAll={true}
                  showLine
                  onSelect={onSelect}
                  treeData={item.data}
                />
              ) : null}
            </>
          );
        })}
      </>
    );
  }, [currentTree.version]);

  return (
    <div className="page-content-left">
      <div className="page-content-left-name">页面结构</div>
      <div className="page-content-buttons">
        {currentPhoneType === "ios" ? (
          <Button type="primary" shape="round">
            IOS
          </Button>
        ) : (
          <Button
            onClick={(e) => changeTabs("ios")}
            shape="round"
            style={{ border: "1px solid transparent" }}
          >
            IOS
          </Button>
        )}
        {currentPhoneType === "android" ? (
          <Button type="primary" shape="round">
            Android
          </Button>
        ) : (
          <Button
            onClick={(e) => changeTabs("android")}
            shape="round"
            style={{ border: "1px solid transparent" }}
          >
            Android
          </Button>
        )}
      </div>
      <div className="scroll-tree">
        {currentPhoneType === "ios" && (
          <div>
            {currentTree?.data && hasIOS ? (
              <GenerateIOSTreeList />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        )}

        {currentPhoneType === "android" && (
          <div>
            {currentTree?.data && hasAndroid ? (
              <GenerateAndroidTreeList />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeTab;
