import './sass/index.sass'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import InteractionTable from './components/InteractionTable'
import D3Graph, {
    ReDrawAction,
    DrawAction,
    LineDrawing,
    CircleDrawing,
    LinkDrawing,
    ArrowLinkDrawing,
    DotDrawing,
    NumberScaleDrawing,
    PathDrawing,
    graphModeEnum,
    TextDrawing,
    RectDrawing,
    LineToolbar,
    CircleToolbar,
    fromActions,
    DeleteAction,
    Toolbar,
    TextToolbar,
    ClearAction,
    NoneToolbar,
    LinkToolbar,
    ArrowLinkToolbar,
    TextCircleDrawing,
    InputAction
} from './components/D3Graph'
import {set as setPath, get as getPath} from 'object-path'
import guid from 'guid'
import * as d3 from 'd3'
import data from '../test/drawing-data'
import update from 'immutability-helper'
import UserInput from "./components/UserInput";

class TestDrawing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interval: 1,
            actions: [],
            scale: 1,
            original: {
                x: 0,
                y: 0
            },
            coordinateType: "screen",
            actionJson: "",
            selectMode: "single",
            attrs: {
                width: 400,
                height: 300,
                viewBox: "0 0 400 300",
                style: {
                    backgroundColor: "#cccccc"
                }
            }
        };
    }

    randomX() {
        const fn = d3.randomUniform(20, 380);
        return Math.floor(fn())
    }

    randomY() {
        const fn = d3.randomUniform(20, 280);
        return Math.floor(fn());
    }

    exec() {
        try {
            const actions = fromActions(JSON.parse(this.state.actionJson));
            console.log("actions", JSON.stringify(actions))
            this.setState({
                actions: actions
            })
        }
        catch (ex) {
            throw ex;
        }
    }

    render() {
        return (
            <div>
                <div>
                    <label>画布设置</label><br/>
                    <textarea defaultValue={JSON.stringify(this.state.attrs)} onChange={({target: {value}}) => {
                        try {
                            const attrs = JSON.parse(value);
                            this.setState({
                                attrs: attrs
                            })
                        }
                        catch (ex) {
                            console.error(ex);
                        }
                    }} style={{width: "100%", height: 100}}>
                    </textarea>
                </div>
                <div>
                    <label>时间间隔</label>
                    <input type="text" value={this.state.interval} onChange={({target: {value}}) => {
                        const num = parseFloat(value);
                        this.setState({
                            interval: isNaN(num) ? 0 : num
                        });
                    }}/>
                </div>
                <div>
                    <label>选择模式</label>
                    <select value={this.state.selectMode} onChange={({target: {value}}) => {
                        this.setState({
                            selectMode: value
                        })
                    }}>
                        <option value="single">single</option>
                        <option value="multiple">multiple</option>
                    </select>
                </div>
                <div>
                    <label>刻度尺</label>
                    <input type="text" value={this.state.scale} onChange={({target: {value}}) => {
                        const num = parseFloat(value);
                        this.setState({
                            scale: isNaN(num) ? 0 : num
                        });
                    }}/>
                </div>
                <div>
                    <label>坐标原点</label>
                    x:<input type="text" value={this.state.original.x} onChange={({target: {value}}) => {
                    const num = parseFloat(value);
                    this.setState(
                        update(this.state, {
                            original: {
                                x: {$set: isNaN(num) ? 0 : num}
                            }
                        })
                    );
                }}/>
                    y:<input type="text" value={this.state.original.y} onChange={({target: {value}}) => {
                    const num = parseFloat(value);
                    this.setState(
                        update(this.state, {
                            original: {
                                y: {$set: isNaN(num) ? 0 : num}
                            }
                        })
                    );
                }}/>
                </div>
                <div>
                    <label>坐标系</label>
                    <select value={this.state.coordinateType} onChange={({target: {value}}) => {
                        this.setState({
                            coordinateType: value
                        })
                    }}>
                        <option value="screen">screen</option>
                        <option value="math">math</option>
                    </select>
                </div>
                <div>
                    <label>图形JSON数据</label><br/>
                    <textarea value={this.state.actionJson}
                              onBlur={() => {
                                  this.exec();
                              }}
                              onChange={({target: {value}}) => {
                                  this.setState({
                                      actionJson: value
                                  })
                              }}
                              style={{width: "100%", height: 100}}></textarea>
                </div>
                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", flex: "1 0 auto"}}>
                    <button type="button" onClick={() => {
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "DotDrawing",
                                    option: {
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>随机画点
                    </button>
                    <button type="button" onClick={() => {
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>随机画圈
                    </button>
                    <button type="button" onClick={() => {
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "LineDrawing",
                                    option: {
                                        attrs: {
                                            x1: this.randomX(),
                                            y1: this.randomY(),
                                            x2: this.randomX(),
                                            y2: this.randomY()
                                        }
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>随机画线
                    </button>
                    <button type="button" onClick={() => {
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "TextCircleDrawing",
                                    option: {
                                        text: "A",
                                        circleAttrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>随机画带圈的文本
                    </button>
                    <button type="button" onClick={() => {
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "PathDrawing",
                                    option: {
                                        d: [
                                            {x: this.randomX(), y: this.randomY()},
                                            {x: this.randomX(), y: this.randomY()},
                                            {x: this.randomX(), y: this.randomY()},
                                        ]
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>随机画多边形(三角形)
                    </button>
                    <button type="button" onClick={() => {
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "input",
                                params: [[
                                    {label: "x", fieldName: "attrs.cx"},
                                    {label: "y", fieldName: "attrs.cy"},
                                ]]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "DotDrawing"
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>画指定点
                    </button>
                    <button type="button" onClick={() => {
                        const sourceId = guid.raw();
                        const targetId = guid.raw();
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: sourceId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: targetId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "LinkDrawing",
                                    option: {
                                        sourceId: sourceId,
                                        targetId: targetId
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>链接图形(link)
                    </button>
                    <button type="button" onClick={() => {
                        const sourceId = guid.raw();
                        const targetId = guid.raw();
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: sourceId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: targetId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "LinkDrawing",
                                    option: {
                                        sourceId: sourceId,
                                        targetId: targetId,
                                        label: "hello"
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>链接图形(link),label=hello
                    </button>
                    <button type="button" onClick={() => {
                        const sourceId = guid.raw();
                        const targetId = guid.raw();
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: sourceId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: targetId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "ArrowLinkDrawing",
                                    option: {
                                        sourceId: sourceId,
                                        targetId: targetId
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>链接图形(arrow-link)
                    </button>
                    <button type="button" onClick={() => {
                        const sourceId = guid.raw();
                        const targetId = guid.raw();
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: sourceId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "CircleDrawing",
                                    option: {
                                        id: targetId,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "draw",
                                params: [{
                                    type: "ArrowLinkDrawing",
                                    option: {
                                        sourceId: sourceId,
                                        targetId: targetId,
                                        label: "abc"
                                    }
                                }]
                            }])
                        }, this.exec.bind(this))
                    }}>链接图形(arrow-link),label=abc
                    </button>
                    <button type="button" onClick={() => {
                        const id = guid.raw();
                        this.setState({
                            actionJson: JSON.stringify([{
                                type: "draw",
                                params: [{
                                    type: "DotDrawing",
                                    option: {
                                        id: id,
                                        attrs: {
                                            cx: this.randomX(),
                                            cy: this.randomY()
                                        }
                                    }
                                }]
                            }, {
                                type: "select",
                                params: [id]
                            }])
                        }, this.exec.bind(this))
                    }}>随机画一个点,并选中它
                    </button>
                    <button type="button"
                            onClick={() => {
                                this.setState({
                                    actionJson: JSON.stringify([{
                                        type: "clear"
                                    }])
                                }, this.exec.bind(this))
                            }}>clear
                    </button>
                </div>
                <D3Graph actions={this.state.actions}
                         attrs={this.state.attrs}
                         selectMode={this.state.selectMode}
                         interval={this.state.interval}/>
            </div>
        )
    }
}

class Example extends Component {
    constructor(props) {
        super(props);
        this.original = {
            x: 20,
            y: 280
        };
        this.state = {
            tableData: [],
            actions: [],
            mode: graphModeEnum.none,
            scale: 20
        };
    }

    draw() {
        this.setState({
            mode: graphModeEnum.draw,
            actions: [
                new DrawAction(new NumberScaleDrawing({
                    original: this.original,
                    xAxisLength: 360,
                    yAxisLength: 260
                })),
                new DrawAction(new DotDrawing({
                    attrs: {
                        cx: 15,
                        cy: 10
                    }
                })),
                new DrawAction(new LineDrawing({
                    id: "line1",
                    attrs: {
                        x1: 0,
                        y1: 1,
                        x2: 5,
                        y2: 5
                    }
                })),
                new DrawAction(new CircleDrawing({
                    id: "circle1",
                    attrs: {
                        cx: 4,
                        cy: 1
                    }
                })),
                new DrawAction(new CircleDrawing({
                    id: "circle2",
                    attrs: {
                        cx: 10,
                        cy: 1
                    }
                }), {
                    nextInterval: 1
                }),
                new DrawAction(new LinkDrawing({
                    sourceId: "circle1",
                    targetId: "circle2",
                    label: "abc"
                })),
                new DrawAction(new CircleDrawing({
                    id: "c3",
                    attrs: {
                        cx: 4,
                        cy: 7
                    }
                })),
                new DrawAction(new CircleDrawing({
                    id: "c4",
                    attrs: {
                        cx: 10,
                        cy: 7
                    }
                })),
                new DrawAction(new ArrowLinkDrawing({
                    sourceId: "c3",
                    targetId: "c4",
                    label: "def"
                }), {
                    nextInterval: 1
                }),
                // new DrawAction(new PathDrawing({
                // 	attrs: {
                // 		d: "M 100 100 L 150 100 L 130 80 Z"
                // 	}
                // })),
                new DrawAction(new TextDrawing({
                    attrs: {
                        x: 10,
                        y: 10
                    },
                    text: "hello text"
                })),
                // new DrawAction(new RectDrawing({
                // 	attrs: {
                // 		d: "M 80 80 L 120 80 L 120 120 L 80 120 Z"
                // 	}
                // })),
                // new DeleteAction("line1")
                new DrawAction(new TextCircleDrawing({
                    text: "abc",
                    circleAttrs: {
                        cx: 12,
                        cy: 3
                    }
                }))
            ]
        })
    }

    playDataActions() {
        const actions = fromActions(data.step.data);
        this.setState({
            mode: graphModeEnum.playing,
            actions: [
                new DrawAction(new NumberScaleDrawing({
                    original: this.original,
                    xAxisLength: 360,
                    yAxisLength: 260,
                    scale: this.state.scale
                })),
                ...actions
            ]
        });
    }

    playCustomAction() {
        this.setState({
            mode: graphModeEnum.playing,
            actions: [
                new DrawAction(new NumberScaleDrawing({
                    original: this.original,
                    xAxisLength: 360,
                    yAxisLength: 260
                })),
                // new DrawAction(new DotDrawing({
                //     attrs: {
                //         cx: 15,
                //         cy: 10
                //     }
                // })),
                // new DrawAction(new LineDrawing({
                //     id: "line1",
                //     attrs: {
                //         x1: 0,
                //         y1: 1,
                //         x2: 5,
                //         y2: 5
                //     }
                // })),
                // new DrawAction(new CircleDrawing({
                //     id: "circle1",
                //     attrs: {
                //         cx: 4,
                //         cy: 1
                //     }
                // })),
                // new DrawAction(new CircleDrawing({
                //     id: "circle2",
                //     attrs: {
                //         cx: 10,
                //         cy: 1
                //     }
                // }), {
                //     nextInterval: 1
                // }),
                // new DrawAction(new LinkDrawing({
                //     sourceId: "circle1",
                //     targetId: "circle2",
                //     label: "abc"
                // })),
                // new DrawAction(new CircleDrawing({
                //     id: "c3",
                //     attrs: {
                //         cx: 4,
                //         cy: 7
                //     }
                // })),
                // new DrawAction(new CircleDrawing({
                //     id: "c4",
                //     attrs: {
                //         cx: 10,
                //         cy: 7
                //     }
                // })),
                // new DrawAction(new ArrowLinkDrawing({
                //     sourceId: "c3",
                //     targetId: "c4",
                //     label: "def"
                // }), {
                //     nextInterval: 1
                // }),
                new InputAction([{
                    label: "x",
                    fieldName: "attrs.cx"
                }, {
                    label: "y",
                    fieldName: "attrs.cy"
                }]),
                new DrawAction(new DotDrawing()),
                new DrawAction(new TextDrawing({
                    attrs: {
                        x: 10,
                        y: 10
                    },
                    text: "hello text"
                })),
                new DrawAction(new TextCircleDrawing({
                    text: "abc",
                    circleAttrs: {
                        cx: 12,
                        cy: 3
                    }
                }))
            ]
        })
    }


    render() {
        return <TestDrawing/>;
        /*
        return (
            <div>
                <TestDrawing/>
                <div>
                    <h6>运筹学图形Example</h6>
                    <div>
                        <button type="button" onClick={this.playDataActions.bind(this)}>play</button>
                        <button type="button" onClick={this.draw.bind(this)}>draw</button>
                        <button type="button" onClick={this.playCustomAction.bind(this)}>play custom action</button>
                    </div>
                    <D3Graph
                        renderToolbar={(graph) => {
                            return (
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <NoneToolbar graph={graph}/>
                                    <LineToolbar graph={graph}/>
                                    <CircleToolbar graph={graph}/>
                                    <LinkToolbar graph={graph}/>
                                    <ArrowLinkToolbar graph={graph}/>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: 40,
                                        height: 40,
                                        cursor: "pointer"
                                    }}
                                         onClick={() => {
                                             graph.doActions([
                                                 new ClearAction()
                                             ])
                                         }}>
                                        清除
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: 40,
                                        height: 40,
                                        cursor: "pointer"
                                    }}
                                         onClick={() => {
                                             const selectedShapes = graph.getSelectedShapes();
                                             if (selectedShapes.length > 0) {
                                                 graph.doActions([
                                                     new DeleteAction(selectedShapes[0].id)
                                                 ])
                                             }
                                         }}>
                                        删除
                                    </div>
                                </div>
                            );
                        }}
                        scale={this.state.scale}
                        original={this.original}
                        coordinateType={"math"}
                        mode={this.state.mode}
                        actions={this.state.actions}/>
                    <InteractionTable tableOption={{
                        firstRow: {
                            renderCell: (text) => <span>{text}</span>,
                            cells: ['a', 'b', 'c']
                        },
                        firstColumn: {
                            renderCell: text => <span>{text}</span>,
                            cells: [1, 2, 3]
                        },
                        renderCell: (data, rowIndex, columnIndex) => {
                            return (
                                <input type="text"
                                       onChange={({target: {value}}) => {
                                           let newState = Object.assign({}, this.state);
                                           setPath(newState, `tableData.${rowIndex}.${columnIndex}`, value);
                                           this.setState(newState);
                                       }}
                                       defaultValue={getPath(this.state, `tableData.${rowIndex}.${columnIndex}`)}/>
                            );
                        },
                        cells: this.state.tableData
                    }}/>
                </div>
            </div>
        );
        */
    }

    componentDidMount() {
        this.playCustomAction();
    }

}

ReactDOM.render(
    <Example></Example>
    , document.getElementById("view"));