import React, { Component } from "react";
import { Card } from "./components/Draggable/Card";
import update from "immutability-helper";
import "./draggablePage.less";
import { Button, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// const style: CSSProperties = {
//   width: "100%",
//   display: "flex",
//   flexWrap: "wrap",
//   border: "1px solid red",
// };

export type ContainerState = {
  cardsById: { [key: string]: any };
  cardsByIndex: any[];
};

function buildCardData(rawData: any) {
  const cardsById: { [key: string]: any } = {};
  const cardsByIndex = [];

  for (let i = 0; i < rawData.length; i += 1) {
    const card = { ...rawData[i] };
    cardsById[card.pageGroupId] = card;
    cardsByIndex[i] = card;
  }

  return {
    cardsById,
    cardsByIndex,
  };
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export type ContainerProps = {
  toDetailPage: (r: any) => void;
  updateImageList: (r: any) => void;
  imageList: any[];
  goBack: (r: any) => void;
  saveImageSort: (r: any) => void;
};

export class DraggablePage extends Component<ContainerProps, ContainerState> {
  private pendingUpdateFn: any;
  private requestedFrame: number | undefined;

  public constructor(props: ContainerProps) {
    super(props);
    this.state = buildCardData(props.imageList);
  }

  public componentWillUnmount(): void {
    if (this.requestedFrame !== undefined) {
      cancelAnimationFrame(this.requestedFrame);
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.imageList !== this.props.imageList) {
      this.setState(buildCardData(this.props.imageList));
    }
    const { cardsByIndex } = this.state;
    console.log("[componentDidUpdate] cardsByIndex", cardsByIndex);
    // this.props.recordDraggableSort(cardsByIndex)
  }

  render(): JSX.Element {
    const { cardsByIndex } = this.state;
    const { goBack } = this.props;

    return (
      <>
        <div className="draggable-page-header">
          <ArrowLeftOutlined className="backIcon" onClick={goBack} />
          <div className="draggable-title"> 选择并重新排序</div>
        </div>

        {cardsByIndex.length !== 0 && (
          <div className="draggable-page-header button">
            <div>拖拽调整页面位置</div>
            <Button
              type="primary"
              className="save-button"
              onClick={() => this.saveImageSort()}
            >
              保存
            </Button>
          </div>
        )}

        {cardsByIndex.length === 0 && <Empty style={{ marginTop: 72 }} />}

        <div className="draggable-container">
          {cardsByIndex.map((card) => (
            <Card
              key={card.pageGroupId}
              id={card.pageGroupId}
              text={card.pageUrl}
              moveCard={this.moveCard}
            />
          ))}
        </div>
      </>
    );
  }

  private saveImageSort() {
    this.props.saveImageSort(this.state.cardsByIndex);
  }
  private scheduleUpdate(updateFn: any) {
    this.pendingUpdateFn = updateFn;

    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(this.drawFrame);
    }
  }

  private drawFrame = (): void => {
    const nextState = update(this.state, this.pendingUpdateFn);

    this.setState(nextState);

    this.pendingUpdateFn = undefined;
    this.requestedFrame = undefined;
  };

  private moveCard = (id: string, afterId: string): void => {
    const { cardsById, cardsByIndex } = this.state;

    const card = cardsById[id];
    const afterCard = cardsById[afterId];

    const cardIndex = cardsByIndex.indexOf(card);
    const afterIndex = cardsByIndex.indexOf(afterCard);

    this.scheduleUpdate({
      cardsByIndex: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card],
        ],
      },
    });
  };
}
export default DraggablePage;
