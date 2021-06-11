import React, { FC, useState, useRef, useEffect } from "react";
import "./popoverSearch.less";
import { Divider, Input, message, Modal } from "antd";
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { limitStringLength } from "../../../../utils/tools";
// @ts-ignore
import classNames from "classnames";
import useClickOutside from "../../../../hooks/useClickOustSide";
import {
  queryModuleList,
  addModule,
  updateModule,
} from "../../../../api/tracevisual/tracevisual";
import { Module } from "../../../../api/tracevisual/tracevisualComponents";

interface PopoverSearchProps {
  setCurrentModuleName: (arg0: Module) => void;
  closePopover: () => void;
  hasAllModule?: boolean;
  className?: string;
}

const PopoverSearch: FC<PopoverSearchProps> = (props) => {
  const { setCurrentModuleName, closePopover, hasAllModule, className } = props;
  const [hoverCurrentModule, setHoverCurrentModule] = useState<number>(-1);
  const [moduleList, setModuleList] = useState<Array<Module>>([]);
  const [isEdit, setEditState] = useState<boolean>(false);
  const [activeType, setActiveType] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [createModuleName, setCreateModuleName] = useState<string>("");
  const [currentEditModuleInfo, setCurrentEditModuleInfo] = useState<any>({});

  const componentRef = useRef<HTMLDivElement>(null);

  const allModuleClassNames = classNames("search-modules all-modules", {
    active: activeType === "all",
  });
  const unclassifiedModuleClassNames = classNames(
    "search-modules unclassified-modules",
    {
      active: activeType === "unclassified",
    }
  );

  const getModuleList = (moduleName: string | null) => {
    const params = moduleName ? { moduleName } : {};

    queryModuleList(params).then((res) => {
      console.log("res 模块结果", res.data.moduleList);
      setModuleList(res.data.moduleList || []);
    });
  };

  useEffect(() => {
    // 初始化 获取模块列表
    getModuleList(null);
  }, []);

  const resetInitData = (): void => {
    setHoverCurrentModule(-1);
    setEditState(false);
    setActiveType("");
    setCurrentEditModuleInfo({});
  };

  console.log("[hahahaha]");
  useClickOutside(componentRef, (event: React.MouseEvent) => {
    // 获取modal 的所有元素
    const modalRef = document.getElementsByClassName("ant-modal-root")[0];

    if (modalRef && modalRef.contains(event.target as HTMLElement)) {
      //打开了弹框新增
      console.log("不关闭");
    } else {
      console.log("可以关闭了");
      closePopover(); // 同时会把modal弹框关闭
    }
  });

  const selectedModule = (item: any): void => {
    if (isEdit) return;
    setCurrentModuleName(item);
    resetInitData();
  };
  const searchModule = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isEdit) return;
    console.log(e?.target.value);
    // setCurrentModuleValue(e?.target.value);
    // 发送请求给后端 ，拿到列表数据
    getModuleList(e.target.value);
    // setCurrentEditModuleInfo(res.data)
  };

  const onKeyUpAboutChangeModuleName = (e: React.KeyboardEvent) => {
    console.log(e.keyCode);
    if (e.keyCode !== 13) return;

    //说明并没有修改，直接按回车了
    if (JSON.stringify(currentEditModuleInfo) === "{}") {
      message.success("修改模块名称成功");
      setEditState(false);
      return;
    }

    //操作你的提交事件
    console.log(currentEditModuleInfo);
    console.log("回车");

    // 发送请求给后端，

    const params = {
      moduleId: currentEditModuleInfo.item.id,
      moduleName: currentEditModuleInfo.currentValue,
    };

    console.log(params);

    updateModule(params).then((res) => {
      if (res.code === 0) {
        getModuleList(null);
        message.success("修改模块名称成功");
        setEditState(false);
      } else {
        message.error("修改模块名称已存在");
      }
    });
  };

  const changeModuleName = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: Module,
    index: number
  ): void => {
    console.log(e?.target.value);
    setCurrentEditModuleInfo({
      currentValue: e?.target.value,
      item,
      index,
    });
  };

  // 全部和未分类高亮
  const enterModule = (e: React.MouseEvent, type: string = "all"): void => {
    if (isEdit) return;
    setActiveType(type); // all 或者 unclassified
  };

  // 全部和未分类取消
  const leaveModule = (e: React.MouseEvent): void => {
    if (isEdit) return;
    setActiveType("");
  };

  // 其他模块高亮
  const enterCurrentModule = (e: React.MouseEvent, index: number): void => {
    if (isEdit) return;
    setHoverCurrentModule(index);
  };

  // 其他模块取消高亮
  const leaveCurrentModule = (e: React.MouseEvent): void => {
    if (isEdit) return;
    setHoverCurrentModule(-1);
  };

  const changeCurrentModuleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setCurrentEditModuleInfo({});
    setEditState(true);
  };

  const handleAddModules = () => {
    console.log("确定", createModuleName);
    if (!createModuleName.trim()) {
      return message.error("模块名称不能为空");
    }
    // 发送请求给后端，createModuleName 字段
    addModule({
      moduleName: createModuleName,
    }).then((res) => {
      console.log("添加模块结果", res);

      if (res.code === 0) {
        // 成功
        setCreateModuleName("");
        setModalVisible(false);
        message.success("新增模块名称成功");
        getModuleList(null);
      } else {
        message.error("修改模块名称已存在");
      }
    });
  };

  const handleCancel = (): void => {
    setModalVisible(false);
    // 清除input内容
    setCreateModuleName("");
  };
  const addNewModulesName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCreateModuleName(e?.target.value.trim());
  };

  const popoverClassName = classNames("popover", className);
  return (
    <div className={popoverClassName} ref={componentRef}>
      <div className="can-scroll">
        <Input
          style={{ width: "85%", borderRadius: "5px", margin: "15px" }}
          placeholder="搜索"
          allowClear
          onChange={searchModule}
        />

        {hasAllModule && (
          <div
            className={allModuleClassNames}
            onClick={(e) => selectedModule({ moduleName: "全部", id: 0 })}
            onMouseLeave={leaveModule}
            onMouseEnter={(e) => enterModule(e, "all")}
          >
            全部
          </div>
        )}

        {hasAllModule && moduleList.length > 0 && (
          <div
            className={unclassifiedModuleClassNames}
            onClick={(e) => selectedModule({ moduleName: "未分类", id: -1 })}
            onMouseLeave={leaveModule}
            onMouseEnter={(e) => enterModule(e, "unclassified")}
          >
            未分类
          </div>
        )}

        {moduleList.map((i: any, index: number) => {
          const classes = classNames("search-modules single-modules", {
            active: hoverCurrentModule === index && !isEdit,
          });

          return (
            <div key={index}>
              {hoverCurrentModule === index && isEdit ? (
                <Input
                  style={{
                    width: "85%",
                    borderRadius: "5px",
                    margin: " 0 15px",
                  }}
                  defaultValue={i.moduleName}
                  onKeyUp={onKeyUpAboutChangeModuleName}
                  onChange={(e) => changeModuleName(e, i, index)}
                />
              ) : (
                <div
                  className={classes}
                  onMouseLeave={leaveCurrentModule}
                  onMouseEnter={(e) => enterCurrentModule(e, index)}
                  onClick={(e) => selectedModule(i)}
                >
                  <span>{limitStringLength(i.moduleName, 10)}</span>
                  {hoverCurrentModule === index && (
                    <EditOutlined onClick={changeCurrentModuleEdit} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Divider plain style={{ margin: 0 }} />
      <div
        className="search-modules add-modules"
        onClick={() => {
          setCreateModuleName("");
          setModalVisible(true);
        }}
      >
        <PlusCircleOutlined />
        <span className="add-module-text">添加模块</span>
      </div>
      <Modal
        title="创建模块"
        className="popover-modal"
        visible={modalVisible}
        onOk={handleAddModules}
        onCancel={handleCancel}
      >
        <Input
          style={{ width: "85%", borderRadius: "5px", margin: " 0 15px" }}
          value={createModuleName}
          onChange={(e) => addNewModulesName(e)}
        />
      </Modal>
    </div>
  );
};

export default PopoverSearch;
