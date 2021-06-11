import React, { FC, useContext, useState, useEffect } from "react";
import {
  Button,
  Empty,
  Image,
  Input,
  message,
  Modal,
  Popover,
  Space,
  Popconfirm,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { formatTime, limitStringLength } from "../../../../utils/tools";
import {
  queryOneTraceData,
  querySevenDatas,
  queryTraceGroup,
  updateElement,
} from "../../../../api/tracevisual/tracevisual";
import { Line } from "@ant-design/charts";
import { sortTraceData, handleBuryNameInCurrentTree } from "../../utils/tools";
import { BuryingDetailContext } from "../../detailPage";
import PreviewImage from "../PreviewImage/previewImage";
import "./pictureAndTable.less";

interface IPictureAndTable {
  pageUrl: string;
  currentElementPictureAndTableData: any;
  onSelect: (selectedKeys: any, info: any) => void;
  currentClickNodeTree: any;
  initQueryPageDetail: (s: string) => void;
}

const PictureAndTable: FC<IPictureAndTable> = (props) => {
  const {
    pageUrl,
    initQueryPageDetail,
    currentElementPictureAndTableData,
    currentClickNodeTree,
    onSelect,
  } = props;

  const {
    hasData,
    hasIOS,
    hasAndroid,
    currentPhoneType,
    currentTree,
    setCurrentTree,
    deletePageFn,
    unbundlingFn,
  } = useContext(BuryingDetailContext);
  const [currentBuryName, setCurrentBuryName] = useState<string>("");
  const [currentBuryItem, setCurrentBuryItem] = useState<any>({
    id: null,
    name: [],
  });

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [versionVisibleIndex, setVersionVisibleIndex] = useState<number>(-100);
  const [paramsVisibleIndex, setParamsVisibleIndex] = useState<number>(-100);
  const [echartsVisibleIndex, setEchartsVisibleIndex] = useState<number>(-100);
  const [paramsPopoverVisible, setParamsPopoverVisible] = useState<boolean>(
    false
  );
  const [echartsPopoverVisible, setEchartsPopoverVisible] = useState<boolean>(
    false
  );
  const [versionPopoverVisible, setVersionPopoverVisible] = useState<boolean>(
    false
  );

  const [echartsLoading, setEchartsLoading] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [buryTraceLoading, setBuryTraceLoading] = useState<boolean>(false);
  const [hasEchartsData, setHasEchartsData] = useState<boolean>(true);
  const [buryTraceData, setBuryTraceData] = useState<any>([]);
  const [historyData, setHistoryData] = useState<any>({
    groupId: null,
    groups: [],
  });

  const [lineDataConfig, setLineDataConfig] = useState<any>({
    data: [{ year: "1991", value: 3 }],
    height: 400,
    xField: "year",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond",
    },
  });

  const [isDelete, setIsDelete] = useState<boolean>(false);
  useEffect(() => {
    // 只有一个页面 且当前类型为相同类型时可以删除
    if (hasIOS && !hasAndroid && currentPhoneType === "ios") {
      setIsDelete(true);
    } else if (hasAndroid && !hasIOS && currentPhoneType === "android") {
      setIsDelete(true);
    } else {
      setIsDelete(false);
    }
  }, [hasAndroid, hasIOS, currentPhoneType]);

  const changeInputBuryName = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCurrentBuryName(e.target.value);
  };

  const handleParamsVisibleChange = (visible: any, record: any) => {
    if (visible) {
      setParamsVisibleIndex(record.key);
      const params = {
        id: record.id,
      };
      setBuryTraceData([]);
      setBuryTraceLoading(true);
      queryOneTraceData(params).then((res) => {
        const concatArray = sortTraceData(res.data.data);
        setBuryTraceData(concatArray);
        setBuryTraceLoading(false);
      });
    } else {
      setParamsVisibleIndex(-100);
    }
    setParamsPopoverVisible(visible);
  };

  const handleVersionVisibleChange = (visible: any, record: any) => {
    if (visible) {
      setVersionVisibleIndex(record.key);
      setHistoryLoading(true);
      queryTraceGroup({ id: record.id }).then((res) => {
        setHistoryLoading(false);
        const historyData = res.data;
        const groups = [];
        for (let version in historyData.groups) {
          groups.push({
            version,
            route: historyData.groups[version],
          });
        }

        const historyTableData = {
          groups,
          groupsId: historyData.groupId,
        };

        setHistoryData(historyTableData);
      });
    } else {
      setVersionVisibleIndex(-100);
    }
    setVersionPopoverVisible(visible);
  };

  const handleEchartsVisibleChange = (visible: any, record: any) => {
    setEchartsVisibleIndex(visible ? record.key : -100);
    setEchartsPopoverVisible(visible);

    if (!visible) return;

    setEchartsLoading(true);
    const params = {
      id: record.id,
    };

    querySevenDatas(params).then((res) => {
      setEchartsLoading(false);

      if (JSON.stringify(res.data.data) === "{}") {
        setHasEchartsData(false);
        return;
      }

      if (res.code === 0) {
        const echartsData = res.data.data;
        setHasEchartsData(true);
        const lineData = [];
        for (let optionElement in echartsData) {
          lineData.push({
            year: formatTime(Number(optionElement)),
            value: echartsData[optionElement],
          });
        }
        const config = {
          data: lineData,
          height: 400,
          xField: "year",
          yField: "value",
          point: {
            size: 5,
            shape: "diamond",
          },
        };
        setLineDataConfig(config);
        setEchartsLoading(false);
      } else {
        setHasEchartsData(false);
      }
    });
  };

  const handleOkBuryName = () => {
    const params = {
      traceName: currentBuryName,
      id: currentBuryItem.id,
    };

    updateElement(params).then((res) => {
      if (res.code === 0) {
        if (JSON.stringify(currentClickNodeTree) === "{}") {
          // 说明是从根节点修改的
          initQueryPageDetail(currentPhoneType);
        } else {
          // 遍历 currentTree.data 修改
          const data = handleBuryNameInCurrentTree(
            currentTree.data,
            currentBuryItem.id,
            currentBuryName
          );
          setCurrentTree({
            version: currentTree.version,
            data,
          });
          // 直接从 页面修改
          const node = handleBuryNameInCurrentTree(
            [currentClickNodeTree.node],
            currentBuryItem.id,
            currentBuryName
          );
          currentClickNodeTree.node = node[0];
          onSelect("null", currentClickNodeTree);
        }
        message.success("修改埋点名称成功");
        setIsModalVisible(false);
      } else {
        message.success("埋点名称重复，请重新填写");
      }
    });
  };

  const BuryTraceList = () => {
    return (
      <div>
        {buryTraceData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          buryTraceData.map((item: any, index: number) => {
            return (
              <div key={index}>
                <span>{item.key}</span> : <span>{item.value}</span>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const buryDataHtml = () => {
    return (
      <div>
        <div>字段信息</div>
        <div
          style={{
            height: "150px",
            width: "350px",
            minWidth: "350px",
            overflow: "auto",
            position: "relative",
          }}
        >
          {buryTraceLoading ? (
            <Spin
              style={{
                position: "absolute",
                transform: "translate(-50%,-50%)",
                top: "50%",
                left: "50%",
              }}
            />
          ) : (
            <BuryTraceList />
          )}
        </div>
      </div>
    );
  };

  const historyHtml = () => {
    return (
      <div style={{ width: "350px", height: "150px", position: "relative" }}>
        {historyLoading ? (
          <Spin
            style={{
              position: "absolute",
              transform: "translate(-50%,-50%)",
              top: "50%",
              left: "50%",
            }}
          />
        ) : (
          <div style={{ width: "350px", height: "150px", overflow: "auto" }}>
            <div>聚类结果</div>
            <div>group ID: {historyData.groupsId}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "20px",
              }}
            >
              <div style={{ marginRight: "50px" }}>版本</div>
              <div>路径</div>
            </div>
            {historyData.groups.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div style={{ marginRight: "13px" }}>v{item.version}</div>
                  <div>{item.route}</div>
                </div>
              );
            })}
            <div></div>
          </div>
        )}
      </div>
    );
  };

  const EchartsHtml = () => {
    return (
      <div style={{ width: "500px", height: "400px", position: "relative" }}>
        <Line {...lineDataConfig} style={{ width: "500px", height: "350px" }} />
        {!hasEchartsData && (
          <div
            style={{
              width: "500px",
              height: "350px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 5,
              left: 0,
              top: 0,
              background: "white",
              position: "absolute",
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: "埋点名称",
      dataIndex: "name",
      key: "name",
      width: 120,
      render: (text: string, record: any) => {
        return (
          <div>
            <span className="table-bury-name">{text || "-"}</span>
            {record.type !== "page" && (
              <EditOutlined
                className="editIcon"
                onClick={() => {
                  setCurrentBuryName(text);
                  setCurrentBuryItem(record);
                  setIsModalVisible(true);
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "页面/元素路径",
      dataIndex: "route",
      key: "route",
      width: 120,
      render: (text: string, record: any) => {
        if (record.type === "item") {
          return (
            <Tooltip
              placement="topLeft"
              title={
                <div>
                  <div>component_name : {text[0]}</div>
                  <div>path: {text[1]}</div>
                </div>
              }
              arrowPointAtCenter
            >
              <div> {limitStringLength(text[1], 20)}</div>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip placement="topLeft" title={text[0]} arrowPointAtCenter>
              <div> {limitStringLength(text[0], 20)}</div>
            </Tooltip>
          );
        }
      },
    },
    {
      title: "埋点参数",
      dataIndex: "params",
      key: "params",
      width: 80,
      render: (text: string, record: any, index: number) => {
        return (
          <Popover
            content={buryDataHtml}
            trigger="click"
            visible={record.key === paramsVisibleIndex && paramsPopoverVisible}
            onVisibleChange={(visible) =>
              handleParamsVisibleChange(visible, record)
            }
          >
            <Button type="primary" size="small">
              查看埋点字段
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "状态",
      key: "state",
      dataIndex: "state",
      width: 80,
      render: (text: string, record: any, index: number) => {
        return (
          <Popover
            content={
              <div
                style={{
                  height: "400px",
                  minWidth: "500px",
                  overflow: "auto",
                  position: "relative",
                }}
              >
                <div style={{ marginBottom: "20px" }}>上报趋势</div>
                {echartsLoading ? (
                  <Spin
                    style={{
                      position: "absolute",
                      transform: "translate(-50%,-50%)",
                      top: "50%",
                      left: "50%",
                    }}
                  />
                ) : (
                  <EchartsHtml />
                )}
              </div>
            }
            trigger="click"
            visible={
              record.key === echartsVisibleIndex && echartsPopoverVisible
            }
            onVisibleChange={(visible) =>
              handleEchartsVisibleChange(visible, record)
            }
          >
            <Space size={"small"} style={{ cursor: "pointer" }}>
              <Button type="primary" size="small" style={{ cursor: "pointer" }}>
                查看数据趋势
              </Button>
            </Space>
          </Popover>
        );
      },
    },
    {
      title: "历史版本聚类",
      key: "version",
      width: 80,
      render: (text: string, record: any, index: number) => {
        return (
          <>
            {record.type === "item" ? (
              <Popover
                content={historyHtml}
                trigger="click"
                visible={
                  record.key === versionVisibleIndex && versionPopoverVisible
                }
                onVisibleChange={(visible) =>
                  handleVersionVisibleChange(visible, record)
                }
              >
                <Button
                  type="primary"
                  size="small"
                  style={{ cursor: "pointer" }}
                >
                  显示聚类结果
                </Button>
              </Popover>
            ) : (
              <div> - </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="page-content-right">
      <div className="page-content-right-wrapper">
        <div className="page-content-right-name">
          <span>页面截图</span>
          <div className="page-right-button">
            {
              // 同时有数据 则可以解绑
              hasAndroid && hasIOS && (
                <Popconfirm
                  title="确定解绑安卓和ios页面吗?"
                  onConfirm={unbundlingFn}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="#">解绑并重新匹配</a>
                </Popconfirm>
              )
            }
            {
              // 是否删除页面
              isDelete && (
                <Popconfirm
                  title="确定删除该页面吗?"
                  onConfirm={deletePageFn}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="#" className="page-right-button-btn">
                    删除页面
                  </a>
                </Popconfirm>
              )
            }
          </div>
        </div>
        <div className="page-content-right-scroll">
          <div className="page-content-picture">
            {pageUrl ? (
              <div className="page-content-image-wrapper">
                <div>
                  <Image src={pageUrl} />
                </div>
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}

            {hasData ? (
              // more-image 为PreviewImage的单图展示区域 不要更改class
              <div className="more-image ">
                {currentElementPictureAndTableData.pictureArray.map(
                  (item: any, index: number) => {
                    return (
                      <PreviewImage
                        currentElementPictureAndTableData={
                          currentElementPictureAndTableData
                        }
                        src={item.smallPicture}
                        key={item.smallPicture}
                        info={item.info}
                        onSelect={onSelect}
                        element
                        item={item}
                      />
                    );
                    // // <Image src={url} key={index} />;
                  }
                )}
              </div>
            ) : (
              <div className="more-image no-data">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-content-table">
        <div className="page-content-table-name">埋点信息</div>
        {hasData ? (
          <Table
            columns={columns}
            scroll={{ y: 280 }}
            dataSource={currentElementPictureAndTableData.tableArray}
            pagination={false}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>

      <Modal
        title="修改埋点名称"
        visible={isModalVisible}
        onOk={handleOkBuryName}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={currentBuryName}
          placeholder="请输入埋点名称"
          onChange={(e) => changeInputBuryName(e)}
        />
      </Modal>
    </div>
  );
};

export default PictureAndTable;
