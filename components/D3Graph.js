'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.ArrowLinkToolbar = exports.LinkToolbar = exports.CircleToolbar = exports.LineToolbar = exports.NoneToolbar = exports.DrawingToolbar = exports.Toolbar = exports.TextCircleDrawing = exports.TextDrawing = exports.PathDrawing = exports.LinkDrawing = exports.ArrowLinkDrawing = exports.NumberScaleDrawing = exports.RectDrawing = exports.DotDrawing = exports.CircleDrawing = exports.LineDrawing = exports.Drawing = exports.ReDrawAction = exports.ClearAction = exports.DeleteAction = exports.UnSelectAction = exports.SelectAction = exports.DrawAction = exports.InputAction = exports.coordinateTypeEnum = exports.graphModeEnum = exports.actionTypeEnums = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.fromDrawing = fromDrawing;
exports.fromActions = fromActions;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _guid = require('guid');

var _guid2 = _interopRequireDefault(_guid);

var _WorkSpace = require('./WorkSpace');

var _WorkSpace2 = _interopRequireDefault(_WorkSpace);

var _objectPath = require('object-path');

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _fbemitter = require('fbemitter');

var _UserInput = require('./UserInput');

var _UserInput2 = _interopRequireDefault(_UserInput);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//#region event
var emitter = new _fbemitter.EventEmitter();
//toolbar 按钮切换
/**
 * @todo 实现用户的输入action,输入action是一个中断操作
 * 实现link,arrowLink的label
 * 实现图的drawing
 * @todo 实现transition
 * @todo 实现data action
 *
 * */

var EVENT_TOOLBAR_CHANGE = "EVENT_TOOLBAR_CHANGE";
//#endregion

/**
 * @typedef
 */

/**
 * @typedef
 */


//#region enums
/**
 * action枚举
 * @readonly
 * @enum {string}
 * @property {string} draw - 绘画
 * @property {string} redraw - 重绘/更新
 * @property {string} select - 选择
 * @property {string} unselect - 反选
 * @property {string} delete - 删除
 * @property {string} clear - 清除所有图形
 * @property {string} undo - 撤销
 * @property {string} data - 数据操作
 * @property {string} input - 用户输入操作
 * */
var actionTypeEnums = exports.actionTypeEnums = {
    draw: "draw",
    redraw: "redraw",
    select: "select",
    unselect: "unselect",
    delete: "delete",
    clear: "clear",
    // move: "move",
    // undo: "undo",
    data: "data",
    input: "input"
};

/**
 * 选择模式枚举
 * @readonly
 * @enum {string}
 * @property {string} single - 单选
 * @property {string} multiple - 多选
 * */
var selectModeEnums = {
    single: "single",
    multiple: "multiple"
};

var graphModeEnum = exports.graphModeEnum = {
    none: "none",
    draw: "draw",
    playing: "playing"
};
var coordinateTypeEnum = exports.coordinateTypeEnum = {
    "screen": "screen",
    "math": "math"
    //#endregion

};var drawingIndex = {};
var actionIndex = {};

/**
 * 注册Drawing绘制类
 * @param {String} name - name值必须和绘图类的类名保持一致
 * @param {Function} drawing - 绘图类
 * */
function registerDrawing(name, drawing) {
    drawingIndex[name] = drawing;
}

function isNullOrUndefined(value) {
    if (value === undefined || value === null) {
        return true;
    }
    return false;
}

function getArrowPoints(startPoint, endPoint) {
    var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

    var diffX = startPoint.x - endPoint.x;
    var diffY = startPoint.y - endPoint.y;
    var a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    var q1x = endPoint.x + distance * (diffX + diffY) / a;
    var q1y = endPoint.y + distance * (diffY - diffX) / a;
    var q3x = endPoint.x + distance * (diffX - diffY) / a;
    var q3y = endPoint.y + distance * (diffX + diffY) / a;
    return [new Point(endPoint.x, endPoint.y), new Point(q1x, q1y), new Point(q3x, q3y)];
}

/**
 * 反序列化drawing
 * */
function fromDrawing(drawingOps) {
    var func = drawingIndex[drawingOps.type];
    return new func(drawingOps.option);
}

/**
 * 反序列化actions
 *
 * @example
 *
 * const actions=fromActions([{
 * 	type:"draw",
 * 	params:[{
 * 		type:"LineDrawing",
 * 		option:{
 * 			id:"line1",
 * 			attrs:{}
 * 		}
 * 	}]
 * },{
 * 	type:"draw",
 * 	params:[{
 * 		type:"DotDrawing",
 * 		option:{
 * 			id:"dot1",
 * 			attrs:{}
 * 		}
 * 	}]
 * }])
 *
 * */
function fromActions(actions) {
    return actions.map(function (action) {
        var type = action.type;
        var args = action.params || [];
        var ops = action.ops;
        var func = actionIndex[type];
        if (!func) {
            throw new Error('action ' + type + ' is not defined');
        }
        switch (type) {
            case actionTypeEnums.draw:
                return new (Function.prototype.bind.apply(actionIndex[type], [null].concat((0, _toConsumableArray3.default)(args.map(function (arg) {
                    return fromDrawing(arg);
                }, ops)))))();
            default:
                return new (Function.prototype.bind.apply(actionIndex[type], [null].concat((0, _toConsumableArray3.default)(args), [ops])))();
        }
    });
}

var Point = function Point(x, y) {
    (0, _classCallCheck3.default)(this, Point);

    this.x = x;
    this.y = y;
};

//#region Action
/**
 * action基类
 * */


var Action = function Action(type, params, ops) {
    (0, _classCallCheck3.default)(this, Action);

    /**
     * action的类型,是一个枚举值
     * @member {actionTypeEnums}
     * */
    this.type = type;
    /**
     * action的参数
     * @member {Array}
     * */
    this.params = params;
    /**
     * playing模式执行下一步时的时间间隔,默认没有
     * @member {?Number}
     * */
    this.nextInterval = (0, _objectPath.get)(ops, "nextInterval", null);
    /**
     * 是否允许中断操作
     * @type {boolean}
     */
    this.canBreak = false;
};

/**
 * 用户输入action,中断操作
 */


var InputAction = exports.InputAction = function (_Action) {
    (0, _inherits3.default)(InputAction, _Action);

    /**
     *
     * @param {Array} params
     * @param {String} params[].label
     * @param {String} params[].fieldName
     * @param {any} params[].defaultValue
     * @param {?Object} ops
     */
    function InputAction(params, ops) {
        (0, _classCallCheck3.default)(this, InputAction);

        var _this = (0, _possibleConstructorReturn3.default)(this, (InputAction.__proto__ || (0, _getPrototypeOf2.default)(InputAction)).call(this, actionTypeEnums.input, params, ops));

        _this.canBreak = true;
        return _this;
    }

    return InputAction;
}(Action);

actionIndex[actionTypeEnums.input] = InputAction;

/**
 * 绘图action
 *
 * @example
 *
 * <D3Graph actions={[
 * 	new DrawAction(new LineDrawing({id:"line1",attrs:{x1:0,y1:0,x2:100,y2:100}})),
 * 	new DrawAction(new DotAction({id:"dot1",attrs:{cx:100,cy:100}}))
 * ]}/>
 *
 * */

var DrawAction = exports.DrawAction = function (_Action2) {
    (0, _inherits3.default)(DrawAction, _Action2);

    function DrawAction(drawingOps, ops) {
        (0, _classCallCheck3.default)(this, DrawAction);
        return (0, _possibleConstructorReturn3.default)(this, (DrawAction.__proto__ || (0, _getPrototypeOf2.default)(DrawAction)).call(this, actionTypeEnums.draw, drawingOps, ops));
    }

    return DrawAction;
}(Action);

actionIndex[actionTypeEnums.draw] = DrawAction;

/**
 * 选择action
 *
 * @example
 *
 * <D3Graph actions={[new SelectAction('SHAPE_ID')]}/>
 *
 * */

var SelectAction = exports.SelectAction = function (_Action3) {
    (0, _inherits3.default)(SelectAction, _Action3);

    function SelectAction(shapeId, ops) {
        (0, _classCallCheck3.default)(this, SelectAction);
        return (0, _possibleConstructorReturn3.default)(this, (SelectAction.__proto__ || (0, _getPrototypeOf2.default)(SelectAction)).call(this, actionTypeEnums.select, shapeId, ops));
    }

    return SelectAction;
}(Action);

actionIndex[actionTypeEnums.select] = SelectAction;

/**
 * 取消选择action
 *
 * @example
 *
 * <D3Graph actions={[new UnSelectAction('SHAPE_ID')]}/>
 *
 * */

var UnSelectAction = exports.UnSelectAction = function (_Action4) {
    (0, _inherits3.default)(UnSelectAction, _Action4);

    function UnSelectAction(shapeId, ops) {
        (0, _classCallCheck3.default)(this, UnSelectAction);
        return (0, _possibleConstructorReturn3.default)(this, (UnSelectAction.__proto__ || (0, _getPrototypeOf2.default)(UnSelectAction)).call(this, actionTypeEnums.unselect, shapeId, ops));
    }

    return UnSelectAction;
}(Action);

actionIndex[actionTypeEnums.unselect] = UnSelectAction;

/**
 * 删除图形action
 *
 * @example
 *
 * <D3Graph actions={[new DeleteAction('SHAPE_ID')]}/>
 *
 * */

var DeleteAction = exports.DeleteAction = function (_Action5) {
    (0, _inherits3.default)(DeleteAction, _Action5);

    function DeleteAction(shapeId, ops) {
        (0, _classCallCheck3.default)(this, DeleteAction);
        return (0, _possibleConstructorReturn3.default)(this, (DeleteAction.__proto__ || (0, _getPrototypeOf2.default)(DeleteAction)).call(this, actionTypeEnums.delete, shapeId, ops));
    }

    return DeleteAction;
}(Action);

actionIndex[actionTypeEnums.delete] = DeleteAction;

/**
 * 清除所有的图形action
 *
 * @example
 *
 * <D3Graph actions={[new ClearAction()]}/>
 *
 * */

var ClearAction = exports.ClearAction = function (_Action6) {
    (0, _inherits3.default)(ClearAction, _Action6);

    function ClearAction(ops) {
        (0, _classCallCheck3.default)(this, ClearAction);
        return (0, _possibleConstructorReturn3.default)(this, (ClearAction.__proto__ || (0, _getPrototypeOf2.default)(ClearAction)).call(this, actionTypeEnums.clear, null, ops));
    }

    return ClearAction;
}(Action);

actionIndex[actionTypeEnums.clear] = ClearAction;

/**
 * 重绘action
 * */

var ReDrawAction = exports.ReDrawAction = function (_Action7) {
    (0, _inherits3.default)(ReDrawAction, _Action7);

    function ReDrawAction(shapeId, state, ops) {
        (0, _classCallCheck3.default)(this, ReDrawAction);
        return (0, _possibleConstructorReturn3.default)(this, (ReDrawAction.__proto__ || (0, _getPrototypeOf2.default)(ReDrawAction)).call(this, actionTypeEnums.redraw, {
            id: shapeId,
            state: state
        }, ops));
    }

    return ReDrawAction;
}(Action);

actionIndex[actionTypeEnums.redraw] = ReDrawAction;
//#endregion

//#region Drawing
/**
 * 绘画接口,所有的绘画类都需要继承这个类并实现相关方法
 * @todo 添加 TextCircleDrawing 实现图(有向图/无向图)节点的绘制
 * */

var Drawing = exports.Drawing = function () {

    /**
     * @constructor
     *
     * @param {Object} option
     * @param {?String} option.id - 默认是guid
     * @param {?Object} option.attrs
     * @param {?Function|?String} option.text
     *
     * */
    function Drawing(option) {
        (0, _classCallCheck3.default)(this, Drawing);

        /**
         * 图形的id,如果没有提供会生成一个guid
         * @member {String}
         * */
        this.id = (0, _objectPath.get)(option, "id", _guid2.default.raw());
        /**
         * 图形的attrs
         * @member {Object}
         * */
        this.attrs = (0, _objectPath.get)(option, "attrs", {});
        /**
         * 对应svg元素的text
         * @member {String|Function}
         * */
        this.text = (0, _objectPath.get)(option, "text", "");
        /**
         * 图形svg
         * @member {D3.Selection}
         * @private
         * */
        this.selection = null;
        /**
         * 绘图的类型
         * @member {String}
         * */
        this.type = null;
        /**
         * graph的实例
         * @member {React.Component}
         * @private
         * */
        this.graph = null;
        /**
         * 是否已经初始化
         * @member {Boolean}
         * @protected
         * */
        this.ready = false;
        /**
         * 当前图形是否被选中
         * @member {Boolean}
         * @private
         * */
        this.selected = false;
    }

    /**
     * 默认的attribute
     * @readonly
     * @member {Object}
     * */


    (0, _createClass3.default)(Drawing, [{
        key: 'render',


        /**
         * 绘制,更新selection相关
         * */
        value: function render() {
            this.updateAttrs(this.selection, this.combineAttrs(this.defaultAttrs, this.attrs, this.selectedAttrs, null));
            if (this.text) {
                this.selection.text(this.text);
            }
        }

        /**
         * 获取link的点的位置信息
         * */

    }, {
        key: 'getLinkPoint',
        value: function getLinkPoint() {
            throw new Error('method `getLinkPoint` is not implementation');
        }

        /**
         * 初始化drawing,创建selection,监听事件需要在里面实现
         * */

    }, {
        key: 'initialize',
        value: function initialize(graph) {
            this.graph = graph;
            this.ready = true;
        }

        /**
         * 批量更新attrs
         * */

    }, {
        key: 'updateAttrs',
        value: function updateAttrs(selection, attrs) {
            if (selection) {
                selection.call(function (self) {
                    for (var key in attrs) {
                        self.attr(key, attrs[key]);
                    }
                });
            }
        }

        /**
         * 选中当前图形
         * */

    }, {
        key: 'select',
        value: function select() {
            if (this.graph) {
                this.graph.doActionsAsync([new SelectAction(this.id)]);
            }
        }

        /**
         * 删除图形
         */

    }, {
        key: 'remove',
        value: function remove() {
            if (this.selection) {
                this.selection.remove();
            }
            this.selection = null;
        }
    }, {
        key: 'combineAttrs',
        value: function combineAttrs() {
            var defaultAttrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var defaultSelectedAttrs = arguments[2];
            var selectedAttrs = arguments[3];

            console.log('selected', this.selected);
            var result = (0, _assign2.default)({}, defaultAttrs, attrs, this.selected ? (0, _assign2.default)({}, defaultSelectedAttrs, selectedAttrs) : {});
            if (!isNullOrUndefined(result.x)) {
                result.x = this.graph.getX(result.x);
            }
            if (!isNullOrUndefined(result.y)) {
                result.y = this.graph.getY(result.y);
            }
            if (!isNullOrUndefined(result.x1)) {
                result.x1 = this.graph.getX(result.x1);
            }
            if (!isNullOrUndefined(result.x2)) {
                result.x2 = this.graph.getX(result.x2);
            }
            if (!isNullOrUndefined(result.y1)) {
                result.y1 = this.graph.getY(result.y1);
            }
            if (!isNullOrUndefined(result.y2)) {
                result.y2 = this.graph.getY(result.y2);
            }
            if (!isNullOrUndefined(result.cx)) {
                result.cx = this.graph.getX(result.cx);
            }
            if (!isNullOrUndefined(result.cy)) {
                result.cy = this.graph.getY(result.cy);
            }
            result["shape-id"] = this.id;
            console.log("combined attrs", result);
            return result;
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {};
        }

        /**
         * 选中时的attribute
         * @readonly
         * @member {Object}
         * */

    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {};
        }
    }]);
    return Drawing;
}();

/**
 * 绘画线
 * */


var LineDrawing = exports.LineDrawing = function (_Drawing) {
    (0, _inherits3.default)(LineDrawing, _Drawing);

    function LineDrawing(option) {
        (0, _classCallCheck3.default)(this, LineDrawing);

        var _this8 = (0, _possibleConstructorReturn3.default)(this, (LineDrawing.__proto__ || (0, _getPrototypeOf2.default)(LineDrawing)).call(this, option));

        _this8.type = "line";
        return _this8;
    }

    (0, _createClass3.default)(LineDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this9 = this;

            (0, _get3.default)(LineDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LineDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("line");
            this.selection.on("click", function () {
                _this9.select();
            });
        }

        // renderToolbar(graph, drawType, index) {
        // 	return (
        // 		<a key={index}
        // 		   onClick={() => {
        // 			   console.log('click');
        // 			   d3.select(graph.ele)
        // 				   .on("mousedown", function () {
        // 					   this._id = guid.raw();
        // 					   graph.doActions([
        // 						   new DrawAction({
        // 							   id: this._id,
        // 							   type: this.type,
        // 							   attrs: Object.assign({
        // 								   x1: d3.event.offsetX,
        // 								   y1: d3.event.offsetY,
        // 								   x2: d3.event.offsetX,
        // 								   y2: d3.event.offsetY
        // 							   }, this.defaultAttrs)
        // 						   })])
        // 				   })
        // 				   .on("mousemove", function () {
        // 					   if (drawType.type === "line" && this._id) {
        // 						   graph.doActions([
        // 							   new ReDrawAction(this._id, {
        // 								   attrs: {
        // 									   x2: {$set: d3.event.offsetX},
        // 									   y2: {$set: d3.event.offsetY}
        // 								   }
        // 							   })
        // 						   ]);
        // 					   }
        // 				   })
        // 				   .on("mouseup", function () {
        // 					   delete this._id;
        // 				   })
        // 		   }}
        // 		   href="javascript:void(0)">Line</a>
        // 	);
        // }

    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {
                fill: "transparent",
                stroke: "black",
                "stroke-width": "3px"
            };
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {
                stroke: "red"
            };
        }
    }]);
    return LineDrawing;
}(Drawing);

registerDrawing("LineDrawing", LineDrawing);

/**
 * 绘画圈
 * */

var CircleDrawing = exports.CircleDrawing = function (_Drawing2) {
    (0, _inherits3.default)(CircleDrawing, _Drawing2);

    function CircleDrawing(option) {
        (0, _classCallCheck3.default)(this, CircleDrawing);

        var _this10 = (0, _possibleConstructorReturn3.default)(this, (CircleDrawing.__proto__ || (0, _getPrototypeOf2.default)(CircleDrawing)).call(this, option));

        _this10.type = "circle";
        return _this10;
    }

    (0, _createClass3.default)(CircleDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this11 = this;

            (0, _get3.default)(CircleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(CircleDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("circle");
            this.selection.on("click", function () {
                _this11.select();
            });
        }
    }, {
        key: 'getLinkPoint',
        value: function getLinkPoint() {
            return new Point(parseFloat(this.attrs.cx), parseFloat(this.attrs.cy));
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {
                fill: "transparent",
                stroke: "black",
                r: "10px",
                "stroke-width": "1px"
            };
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {
                stroke: "red"
            };
        }
    }]);
    return CircleDrawing;
}(Drawing);

registerDrawing("CircleDrawing", CircleDrawing);

/**
 * 绘制点
 * */

var DotDrawing = exports.DotDrawing = function (_Drawing3) {
    (0, _inherits3.default)(DotDrawing, _Drawing3);

    function DotDrawing(option) {
        (0, _classCallCheck3.default)(this, DotDrawing);

        var _this12 = (0, _possibleConstructorReturn3.default)(this, (DotDrawing.__proto__ || (0, _getPrototypeOf2.default)(DotDrawing)).call(this, option));

        _this12.type = "dot";
        return _this12;
    }

    (0, _createClass3.default)(DotDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this13 = this;

            (0, _get3.default)(DotDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(DotDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("circle");
            this.selection.on("click", function () {
                _this13.select();
            });
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {
                fill: "black",
                stroke: "black",
                r: "5px"
            };
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {
                stroke: "red"
            };
        }
    }]);
    return DotDrawing;
}(Drawing);

registerDrawing("DotDrawing", DotDrawing);

/**
 * 绘画矩形
 * */

var RectDrawing = exports.RectDrawing = function (_Drawing4) {
    (0, _inherits3.default)(RectDrawing, _Drawing4);

    function RectDrawing(option) {
        (0, _classCallCheck3.default)(this, RectDrawing);

        var _this14 = (0, _possibleConstructorReturn3.default)(this, (RectDrawing.__proto__ || (0, _getPrototypeOf2.default)(RectDrawing)).call(this, option));

        _this14.type = "rect";
        return _this14;
    }

    (0, _createClass3.default)(RectDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this15 = this;

            (0, _get3.default)(RectDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(RectDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("path");
            this.selection.on("click", function () {
                _this15.select();
            });
        }

        // renderToolbar(context, drawType, index) {
        // 	return (
        // 		<a key={index} href="javascript:void(0)" onClick={() => {
        // 			d3.select(context.ele)
        // 				.on('mousedown', function () {
        // 					this._id = guid.raw();
        // 					this._mouseDownEvent = d3.event;
        // 					context.doActions([
        // 						new DrawAction({
        // 							id: this._id,
        // 							type: drawType.type,
        // 							attrs: Object.assign({
        // 								d: `M ${d3.event.offsetX} ${d3.event.offsetY} l 0 0 z`
        // 							}, drawType.defaultAttrs)
        // 						})
        // 					])
        // 				})
        // 				.on('mousemove', function () {
        // 					if (this._id
        // 						&& this._mouseDownEvent
        // 						&& drawType.type === "rect") {
        // 						const width = d3.event.offsetX - this._mouseDownEvent.offsetX;
        // 						const height = d3.event.offsetY - this._mouseDownEvent.offsetY;
        // 						console.log(`width:${width},height:${height}`)
        // 						const d = [
        // 							`M ${this._mouseDownEvent.offsetX} ${this._mouseDownEvent.offsetY}`,
        // 							`L ${d3.event.offsetX} ${this._mouseDownEvent.offsetY}`,
        // 							`L ${d3.event.offsetX} ${d3.event.offsetY}`,
        // 							`L ${this._mouseDownEvent.offsetX} ${d3.event.offsetY}`,
        // 							'z'
        // 						]
        // 						//update
        // 						context.doActions([
        // 							new ReDrawAction(this._id, {
        // 								attrs: {
        // 									d: {$set: d.join(' ')}
        // 								}
        // 							})
        // 						])
        // 					}
        // 				})
        // 				.on("mouseup", function () {
        // 					delete this._id;
        // 					delete this._mouseDownEvent
        // 				})
        // 		}}>Rect</a>
        // 	);
        // }

    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {};
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {};
        }
    }]);
    return RectDrawing;
}(Drawing);

registerDrawing("RectDrawing", RectDrawing);

/**
 * 绘制刻度
 * */

var NumberScaleDrawing = exports.NumberScaleDrawing = function (_Drawing5) {
    (0, _inherits3.default)(NumberScaleDrawing, _Drawing5);

    function NumberScaleDrawing(option) {
        (0, _classCallCheck3.default)(this, NumberScaleDrawing);

        var _this16 = (0, _possibleConstructorReturn3.default)(this, (NumberScaleDrawing.__proto__ || (0, _getPrototypeOf2.default)(NumberScaleDrawing)).call(this, option));

        _this16.type = "number-scale";
        _this16.original = (0, _objectPath.get)(option, "original", {
            x: 20,
            y: 280
        });
        _this16.xAxisLength = (0, _objectPath.get)(option, "xAxisLength", 360);
        _this16.yAxisLength = (0, _objectPath.get)(option, "yAxisLength", 260);
        //刻度的间距大小
        _this16.scale = (0, _objectPath.get)(option, "scale", 20);
        return _this16;
    }

    (0, _createClass3.default)(NumberScaleDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this17 = this;

            (0, _get3.default)(NumberScaleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(NumberScaleDrawing.prototype), 'initialize', this).call(this, graph);
            // const width = graph.ele.clientWidth;
            // const height = graph.ele.clientHeight;
            this.selection = d3.select(graph.ele).append("g");
            var originalPoint = (0, _assign2.default)({}, this.original);
            var xEndPoint = new Point(this.original.x + this.xAxisLength, this.original.y);
            var yEndPoint = new Point(this.original.x, this.original.y - this.yAxisLength);
            //xAxis
            this.selection.append("line").attr("x1", originalPoint.x).attr("y1", originalPoint.y).attr("x2", xEndPoint.x).attr("y2", xEndPoint.y).attr("stroke", "black").attr("stroke-width", "1px");
            //画x轴的箭头
            this.selection.append("path").attr("d", 'M ' + xEndPoint.x + ' ' + xEndPoint.y + ' L ' + xEndPoint.x + ' ' + (xEndPoint.y + 5) + ' L ' + (xEndPoint.x + 15) + ' ' + xEndPoint.y + ' L ' + xEndPoint.x + ' ' + (xEndPoint.y - 5) + ' Z');
            // 画x轴的刻度
            var xScaleCount = Math.floor(Math.abs(xEndPoint.x - originalPoint.x) / this.scale);
            Array.apply(null, { length: xScaleCount }).forEach(function (v, i) {
                var p1 = new Point(originalPoint.x + _this17.scale * i, originalPoint.y);
                var p2 = new Point(originalPoint.x + _this17.scale * i, originalPoint.y - 3);
                _this17.selection.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1);
                _this17.selection.append("text").text(i).attr("x", p1.x).attr("y", p1.y + 10).attr("style", "font-size:10px");
            });
            //yAxis
            this.selection.append("line").attr("x1", originalPoint.x).attr("y1", originalPoint.y).attr("x2", yEndPoint.x).attr("y2", yEndPoint.y).attr("stroke", "black").attr("stroke-width", 1);
            //画y轴的箭头
            this.selection.append("path").attr("d", 'M ' + yEndPoint.x + ' ' + yEndPoint.y + ' L ' + (yEndPoint.x + 5) + ' ' + yEndPoint.y + ' L ' + yEndPoint.x + ' ' + (yEndPoint.y - 15) + ' L ' + (yEndPoint.x - 5) + ' ' + yEndPoint.y + ' Z');
            //画y轴的刻度
            var yScaleCount = Math.floor(Math.abs(yEndPoint.y - originalPoint.y) / this.scale);
            Array.apply(null, { length: yScaleCount }).forEach(function (v, i) {
                var p1 = new Point(originalPoint.x, originalPoint.y - _this17.scale * i);
                var p2 = new Point(originalPoint.x + 3, originalPoint.y - _this17.scale * i);
                _this17.selection.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1);
                _this17.selection.append("text").text(i).attr("x", p1.x - 15).attr("y", p1.y).attr("style", "font-size:10px");
            });
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {};
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {};
        }
    }]);
    return NumberScaleDrawing;
}(Drawing);

registerDrawing("NumberScaleDrawing", NumberScaleDrawing);

/**
 * 绘制带箭头的link
 * @todo 实现label的修改
 * */

var ArrowLinkDrawing = exports.ArrowLinkDrawing = function (_Drawing6) {
    (0, _inherits3.default)(ArrowLinkDrawing, _Drawing6);

    /**
     * @constructor
     *
     * @param {object} option
     * @param {string} option.sourceId - link的源id
     * @param {string} option.targetId - link的目标id
     * @param {string|function} option.label - link的label
     * @param {object} option.labelAttrs - label的attributes
     * */
    function ArrowLinkDrawing(option) {
        (0, _classCallCheck3.default)(this, ArrowLinkDrawing);

        var _this18 = (0, _possibleConstructorReturn3.default)(this, (ArrowLinkDrawing.__proto__ || (0, _getPrototypeOf2.default)(ArrowLinkDrawing)).call(this, option));

        _this18.type = "arrow-link";
        _this18.sourceId = (0, _objectPath.get)(option, "sourceId");
        if (!_this18.sourceId) {
            throw new Error('ArrowLinkDrawing option require sourceId property');
        }
        _this18.targetId = (0, _objectPath.get)(option, "targetId");
        if (!_this18.targetId) {
            throw new Error('ArrowLinkDrawing option require targetId property');
        }
        _this18.source = null;
        _this18.target = null;
        _this18.label = (0, _objectPath.get)(option, "label");
        _this18.labelAttrs = (0, _objectPath.get)(option, "labelAttrs");
        _this18.labelSelection = null;
        return _this18;
    }

    (0, _createClass3.default)(ArrowLinkDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this19 = this;

            (0, _get3.default)(ArrowLinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(ArrowLinkDrawing.prototype), 'initialize', this).call(this, graph);
            this.source = this.graph.findShapeById(this.sourceId);
            this.target = this.graph.findShapeById(this.targetId);
            this.selection = d3.select(graph.ele).append("path");
            this.selection.on("click", function () {
                _this19.select();
            });
            this.labelSelection = d3.select(graph.ele).append("text");
        }
    }, {
        key: 'remove',
        value: function remove() {
            (0, _get3.default)(ArrowLinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(ArrowLinkDrawing.prototype), 'remove', this).call(this);
            if (this.labelSelection) {
                this.labelSelection.remove();
            }
            this.labelSelection = null;
        }
    }, {
        key: 'renderLabel',
        value: function renderLabel(x, y) {
            if (this.labelSelection) {
                if (this.label) {
                    this.labelSelection.text(this.label);
                }
                var attrs = (0, _assign2.default)({
                    x: this.graph.getX(x),
                    y: this.graph.getY(y)
                }, this.labelAttrs);
                this.updateAttrs(this.labelSelection, attrs);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            //计算link的位置信息
            var p1 = this.source.getLinkPoint();
            var p2 = this.target.getLinkPoint();
            this.attrs = (0, _immutabilityHelper2.default)(this.attrs, {
                d: { $set: this.getArrowLinkPath(p1, p2, 10 / this.graph.scale).join(' ') }
            });
            (0, _get3.default)(ArrowLinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(ArrowLinkDrawing.prototype), 'render', this).call(this);
            var hx = Math.abs(p1.x - p2.x) / 2;
            var hy = Math.abs(p1.y - p2.y) / 2;
            var labelX = Math.min(p1.x, p2.x) + hx;
            var labelY = Math.min(p1.y, p2.y) + hy;
            this.renderLabel(labelX, labelY);
        }
    }, {
        key: 'getArrowLinkPath',
        value: function getArrowLinkPath(startPoint, endPoint) {
            var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

            var diffX = startPoint.x - endPoint.x;
            var diffY = startPoint.y - endPoint.y;
            var a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
            var q1x = endPoint.x + distance * (diffX + diffY) / a;
            var q1y = endPoint.y + distance * (diffY - diffX) / a;
            var q2x = endPoint.x + diffX * distance / a;
            var q2y = endPoint.y + diffY * distance / a;
            var q3x = endPoint.x + distance * (diffX - diffY) / a;
            var q3y = endPoint.y + distance * (diffX + diffY) / a;
            return ['M ' + this.graph.getX(startPoint.x) + ' ' + this.graph.getY(startPoint.y), 'L ' + this.graph.getX(q2x) + ' ' + this.graph.getY(q2y), 'L ' + this.graph.getX(q1x) + ' ' + this.graph.getY(q1y), 'L ' + this.graph.getX(endPoint.x) + ' ' + this.graph.getY(endPoint.y), 'L ' + this.graph.getX(q3x) + ' ' + this.graph.getY(q3y), 'L ' + this.graph.getX(q2x) + ' ' + this.graph.getY(q2y), 'L ' + this.graph.getX(startPoint.x) + ' ' + this.graph.getY(startPoint.y), 'Z'];
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {
                fill: "black",
                stroke: "black"
            };
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {
                stroke: "red"
            };
        }
    }]);
    return ArrowLinkDrawing;
}(Drawing);

registerDrawing("ArrowLinkDrawing", ArrowLinkDrawing);

/**
 * 绘制link
 * @todo 添加label
 * @todo 实现label的修改
 * */

var LinkDrawing = exports.LinkDrawing = function (_Drawing7) {
    (0, _inherits3.default)(LinkDrawing, _Drawing7);

    /**
     * @constructor
     *
     * @param {object} option
     * @param {string} option.sourceId - link的源id
     * @param {string} option.targetId - link的目标id
     * @param {string|function} option.label - link的label
     * @param {object} option.labelAttrs - label的attributes
     * */
    function LinkDrawing(option) {
        (0, _classCallCheck3.default)(this, LinkDrawing);

        var _this20 = (0, _possibleConstructorReturn3.default)(this, (LinkDrawing.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing)).call(this, option));

        _this20.type = "link";
        _this20.sourceId = (0, _objectPath.get)(option, "sourceId");
        if (!_this20.sourceId) {
            throw new Error('LinkDrawing option require sourceId property');
        }
        _this20.targetId = (0, _objectPath.get)(option, "targetId");
        if (!_this20.targetId) {
            throw new Error('LinkDrawing option require targetId property');
        }
        _this20.source = null;
        _this20.target = null;
        _this20.label = (0, _objectPath.get)(option, "label");
        _this20.labelAttrs = (0, _objectPath.get)(option, "labelAttrs");
        _this20.labelSelection = null;
        return _this20;
    }

    (0, _createClass3.default)(LinkDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this21 = this;

            (0, _get3.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), 'initialize', this).call(this, graph);
            this.source = this.graph.findShapeById(this.sourceId);
            this.target = this.graph.findShapeById(this.targetId);
            this.selection = d3.select(graph.ele).append("line");
            this.selection.on("click", function () {
                _this21.select();
            });
            this.labelSelection = d3.select(graph.ele).append("text");
        }
    }, {
        key: 'remove',
        value: function remove() {
            (0, _get3.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), 'remove', this).call(this);
            if (this.labelSelection) {
                this.labelSelection.remove();
            }
            this.labelSelection = null;
        }
    }, {
        key: 'renderLabel',
        value: function renderLabel(x, y) {
            if (this.labelSelection) {
                if (this.label) {
                    this.labelSelection.text(this.label);
                }
                var attrs = (0, _assign2.default)({
                    x: this.graph.getX(x),
                    y: this.graph.getY(y)
                }, this.labelAttrs);
                this.updateAttrs(this.labelSelection, attrs);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            //计算link的位置信息
            var p1 = this.source.getLinkPoint();
            var p2 = this.target.getLinkPoint();
            this.attrs = (0, _immutabilityHelper2.default)(this.attrs, {
                x1: { $set: p1.x },
                y1: { $set: p1.y },
                x2: { $set: p2.x },
                y2: { $set: p2.y }
            });
            (0, _get3.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), 'render', this).call(this);
            var hx = Math.abs(p1.x - p2.x) / 2;
            var hy = Math.abs(p1.y - p2.y) / 2;
            var labelX = Math.min(p1.x, p2.x) + hx;
            var labelY = Math.min(p1.y, p2.y) + hy;
            this.renderLabel(labelX, labelY);
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {
                fill: "none",
                "stroke-width": "2px",
                stroke: "black"
            };
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {
                stroke: "red"
            };
        }
    }]);
    return LinkDrawing;
}(Drawing);

registerDrawing("LinkDrawing", LinkDrawing);

/**
 * 绘画Path
 * */

var PathDrawing = exports.PathDrawing = function (_Drawing8) {
    (0, _inherits3.default)(PathDrawing, _Drawing8);

    function PathDrawing(option) {
        (0, _classCallCheck3.default)(this, PathDrawing);

        var _this22 = (0, _possibleConstructorReturn3.default)(this, (PathDrawing.__proto__ || (0, _getPrototypeOf2.default)(PathDrawing)).call(this, option));

        _this22.type = "path";
        _this22.d = (0, _objectPath.get)(option, "d", []);
        return _this22;
    }

    (0, _createClass3.default)(PathDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this23 = this;

            (0, _get3.default)(PathDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(PathDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("path");
            this.selection.on("click", function () {
                _this23.select();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this24 = this;

            if (!this.attrs.d) {
                var d = this.d.map(function (point, index) {
                    if (index === 0) {
                        return 'M ' + _this24.graph.getX(point.x) + ' ' + _this24.graph.getY(point.y);
                    }
                    return 'L ' + _this24.graph.getX(point.x) + ' ' + _this24.graph.getY(point.y);
                });
                d.push("Z");
                this.attrs.d = d.join(" ");
            }
            (0, _get3.default)(PathDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(PathDrawing.prototype), 'render', this).call(this);
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {};
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {};
        }
    }]);
    return PathDrawing;
}(Drawing);

registerDrawing("PathDrawing", PathDrawing);

/**
 * 绘制text
 * */

var TextDrawing = exports.TextDrawing = function (_Drawing9) {
    (0, _inherits3.default)(TextDrawing, _Drawing9);

    function TextDrawing(option) {
        (0, _classCallCheck3.default)(this, TextDrawing);

        var _this25 = (0, _possibleConstructorReturn3.default)(this, (TextDrawing.__proto__ || (0, _getPrototypeOf2.default)(TextDrawing)).call(this, option));

        _this25.type = "text";
        return _this25;
    }

    (0, _createClass3.default)(TextDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            var _this26 = this;

            (0, _get3.default)(TextDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("text");
            this.selection.on("click", function () {
                _this26.select();
            });
        }
    }, {
        key: 'defaultAttrs',
        get: function get() {
            return {
                fill: "black",
                "font-size": "20px"
            };
        }
    }, {
        key: 'selectedAttrs',
        get: function get() {
            return {
                fill: "red"
            };
        }
    }]);
    return TextDrawing;
}(Drawing);

registerDrawing("TextDrawing", TextDrawing);

/**
 * 绘制带文本的圆圈
 */

var TextCircleDrawing = exports.TextCircleDrawing = function (_Drawing10) {
    (0, _inherits3.default)(TextCircleDrawing, _Drawing10);
    (0, _createClass3.default)(TextCircleDrawing, [{
        key: 'defaultCircleAttrs',
        get: function get() {
            return {
                r: 20,
                fill: "transparent",
                stroke: "black"
            };
        }
    }, {
        key: 'defaultCircleSelectedAttrs',
        get: function get() {
            return {
                fill: "transparent",
                stroke: "red"
            };
        }
    }, {
        key: 'defaultTextAttrs',
        get: function get() {
            return {
                "text-anchor": "middle",
                "dominant-baseline": "middle",
                fill: "black"
            };
        }
    }, {
        key: 'defaultTextSelectedAttrs',
        get: function get() {
            return {
                fill: "red"
            };
        }

        /**
         * @constructor
         *
         * @param {Object} option - 绘制的选项
         * @param {Object} option.circleAttrs - 圆圈的属性
         * @param {Object} option.circleSelectedAttrs - 圆圈选中的属性
         * @param {Object} option.textAttrs - 文本的属性
         * @param {Object} option.textSelectedAttrs - 文本选中的属性
         * @param {String} option.text
         *
         * */

    }]);

    function TextCircleDrawing(option) {
        (0, _classCallCheck3.default)(this, TextCircleDrawing);

        /**
         * 绘制的类型
         * @member {String}
         * */
        var _this27 = (0, _possibleConstructorReturn3.default)(this, (TextCircleDrawing.__proto__ || (0, _getPrototypeOf2.default)(TextCircleDrawing)).call(this, option));

        _this27.type = "text-circle";
        /**
         * 圆圈的属性
         * @member {Object}
         * @private
         * */
        _this27.circleAttrs = (0, _objectPath.get)(option, "circleAttrs", {});
        /**
         * 圆圈选中的属性
         * @member {Object}
         * @private
         * */
        _this27.circleSelectedAttrs = (0, _objectPath.get)(option, "circleSelectedAttrs", {});
        /**
         * 文本的属性
         * @member {Object}
         * @private
         * */
        _this27.textAttrs = (0, _objectPath.get)(option, "textAttrs", {});
        /**
         * 文本选中的属性
         * @member {Object}
         * @private
         * */
        _this27.textSelectedAttrs = (0, _objectPath.get)(option, "textSelectedAttrs", {});
        /**
         * 文本的selection
         * @member {D3.Selection}
         * @private
         * */
        _this27.textSelection = null;
        /**
         * 圆圈的selection
         * @member {D3.Selection}
         * @private
         * */
        _this27.circleSelection = null;
        return _this27;
    }

    (0, _createClass3.default)(TextCircleDrawing, [{
        key: 'initialize',
        value: function initialize(graph) {
            (0, _get3.default)(TextCircleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextCircleDrawing.prototype), 'initialize', this).call(this, graph);
            this.selection = d3.select(graph.ele).append("g");
            //add  circle
            this.circleSelection = this.selection.append("circle");
            //add text
            this.textSelection = this.selection.append("text");
            this.selection.on("click", this.select.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            this.textSelection.text(this.text);
            var circleAttrs = this.combineAttrs(this.defaultCircleAttrs, this.circleAttrs, this.defaultCircleSelectedAttrs, this.circleSelectedAttrs);
            var textAttrs = this.combineAttrs(this.defaultTextAttrs, this.textAttrs, this.defaultTextSelectedAttrs, this.textSelectedAttrs);
            textAttrs.x = circleAttrs.cx;
            textAttrs.y = circleAttrs.cy;
            this.updateAttrs(this.textSelection, textAttrs);
            this.updateAttrs(this.circleSelection, circleAttrs);
        }
    }, {
        key: 'getLinkPoint',
        value: function getLinkPoint() {
            var circleAttrs = this.combineAttrs(this.defaultCircleAttrs, this.circleAttrs, this.defaultCircleSelectedAttrs, this.circleSelectedAttrs);
            return new Point(circleAttrs.cx, circleAttrs.cy);
        }
    }]);
    return TextCircleDrawing;
}(Drawing);

registerDrawing("TextCircleDrawing", TextCircleDrawing);
//#endregion

//#region Toolbar

var Toolbar = exports.Toolbar = function (_PureComponent) {
    (0, _inherits3.default)(Toolbar, _PureComponent);

    function Toolbar() {
        (0, _classCallCheck3.default)(this, Toolbar);
        return (0, _possibleConstructorReturn3.default)(this, (Toolbar.__proto__ || (0, _getPrototypeOf2.default)(Toolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(Toolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'svg',
                (0, _extends3.default)({}, this.attrs, {
                    onClick: this.props.onClick,
                    style: this.props.style }),
                this.props.children
            );
        }
    }, {
        key: 'attrs',
        get: function get() {
            return {
                width: 40,
                height: 40
            };
        }
    }]);
    return Toolbar;
}(_react.PureComponent);

Toolbar.propTypes = {
    children: _propTypes2.default.any,
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object
};

var DrawingToolbar = exports.DrawingToolbar = function (_PureComponent2) {
    (0, _inherits3.default)(DrawingToolbar, _PureComponent2);

    function DrawingToolbar(props) {
        (0, _classCallCheck3.default)(this, DrawingToolbar);

        var _this29 = (0, _possibleConstructorReturn3.default)(this, (DrawingToolbar.__proto__ || (0, _getPrototypeOf2.default)(DrawingToolbar)).call(this, props));

        _this29.listener = null;
        _this29.state = {
            selected: false
        };
        return _this29;
    }

    (0, _createClass3.default)(DrawingToolbar, [{
        key: 'render',
        value: function render() {
            var _this30 = this;

            return _react2.default.createElement(
                Toolbar,
                {
                    style: (0, _assign2.default)({}, this.props.style, this.state.selected ? { backgroundColor: "#D6D6D6" } : {}),
                    type: this.props.type,
                    onClick: function onClick() {
                        var _props;

                        emitter.emit(EVENT_TOOLBAR_CHANGE, _this30.props.type);
                        _this30.props.onClick && (_props = _this30.props).onClick.apply(_props, arguments);
                    } },
                this.props.children
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this31 = this;

            this.listener = emitter.addListener(EVENT_TOOLBAR_CHANGE, function (type) {
                _this31.setState({
                    selected: type === _this31.props.type
                });
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.listener) {
                this.listener.remove();
            }
        }
    }]);
    return DrawingToolbar;
}(_react.PureComponent);

DrawingToolbar.propTypes = {
    children: _propTypes2.default.any,
    onClick: _propTypes2.default.func,
    //绘制的类型:如LineDrawing
    type: _propTypes2.default.string,
    style: _propTypes2.default.object
};

var NoneToolbar = exports.NoneToolbar = function (_PureComponent3) {
    (0, _inherits3.default)(NoneToolbar, _PureComponent3);

    function NoneToolbar() {
        (0, _classCallCheck3.default)(this, NoneToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (NoneToolbar.__proto__ || (0, _getPrototypeOf2.default)(NoneToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(NoneToolbar, [{
        key: 'render',
        value: function render() {
            var _this33 = this;

            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: function onClick() {
                        var graph = _this33.props.graph;

                        var svg = d3.select(graph.ele);
                        svg.on("mousedown", null).on("mousemove", null).on("mouseup", null);
                    },
                    type: this.type },
                _react2.default.createElement(
                    'text',
                    { y: 20, fontSize: 12 },
                    'none'
                )
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "";
        }
    }]);
    return NoneToolbar;
}(_react.PureComponent);

NoneToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var LineToolbar = exports.LineToolbar = function (_PureComponent4) {
    (0, _inherits3.default)(LineToolbar, _PureComponent4);

    function LineToolbar() {
        (0, _classCallCheck3.default)(this, LineToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (LineToolbar.__proto__ || (0, _getPrototypeOf2.default)(LineToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(LineToolbar, [{
        key: 'render',
        value: function render() {
            var _this35 = this;

            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: function onClick() {
                        var graph = _this35.props.graph;

                        var svg = d3.select(graph.ele);
                        svg.on("mousedown", function () {
                            var point = graph.getPointFromScreen(d3.event.offsetX, d3.event.offsetY);
                            var drawing = new LineDrawing({
                                attrs: {
                                    x1: point.x,
                                    y1: point.y,
                                    x2: point.x,
                                    y2: point.y
                                }
                            });
                            _this35._id = drawing.id;
                            graph.doActionsAsync([new DrawAction(drawing)]);
                        }).on("mousemove", function () {
                            if (_this35._id) {
                                var point = graph.getPointFromScreen(d3.event.offsetX, d3.event.offsetY);
                                graph.doActionsAsync([new ReDrawAction(_this35._id, {
                                    attrs: {
                                        x2: { $set: point.x },
                                        y2: { $set: point.y }
                                    }
                                })]);
                            }
                        }).on("mouseup", function () {
                            delete _this35._id;
                        });
                    },
                    type: this.type },
                _react2.default.createElement('line', { x1: 10, y1: 10, x2: 30, y2: 30, stroke: "#888888" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "LineDrawing";
        }
    }]);
    return LineToolbar;
}(_react.PureComponent);

LineToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var CircleToolbar = exports.CircleToolbar = function (_PureComponent5) {
    (0, _inherits3.default)(CircleToolbar, _PureComponent5);

    function CircleToolbar() {
        (0, _classCallCheck3.default)(this, CircleToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (CircleToolbar.__proto__ || (0, _getPrototypeOf2.default)(CircleToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(CircleToolbar, [{
        key: 'render',
        value: function render() {
            var _this37 = this;

            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: function onClick() {
                        var graph = _this37.props.graph;

                        var svg = d3.select(_this37.props.graph.ele);
                        svg.on("mousedown", function () {
                            var point = graph.getPointFromScreen(d3.event.offsetX, d3.event.offsetY);
                            var drawing = new CircleDrawing({
                                attrs: {
                                    cx: point.x,
                                    cy: point.y
                                }
                            });
                            graph.doActionsAsync([new DrawAction(drawing)]);
                        });
                    },
                    type: this.type },
                _react2.default.createElement('circle', { cx: 20, cy: 20, r: 8, stroke: "#888888", fill: "#888888" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "CircleDrawing";
        }
    }]);
    return CircleToolbar;
}(_react.PureComponent);

CircleToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var LinkToolbar = exports.LinkToolbar = function (_PureComponent6) {
    (0, _inherits3.default)(LinkToolbar, _PureComponent6);

    function LinkToolbar() {
        (0, _classCallCheck3.default)(this, LinkToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (LinkToolbar.__proto__ || (0, _getPrototypeOf2.default)(LinkToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(LinkToolbar, [{
        key: 'getShapeID',
        value: function getShapeID(ele) {
            try {
                return ele.attributes['shape-id'].nodeValue;
            } catch (ex) {
                return null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this39 = this;

            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: function onClick() {
                        var graph = _this39.props.graph;

                        var svg = d3.select(graph.ele);
                        svg.on("mousedown", function () {
                            var event = d3.event;
                            console.log(event.target);
                            _this39._sourceID = _this39.getShapeID(event.target);
                            console.log('source id : ' + _this39._sourceID);
                        }).on("mouseup", function () {
                            var event = d3.event;
                            var targetID = _this39.getShapeID(event.target);
                            console.log('target id : ' + targetID);
                            if (_this39._sourceID && targetID) {
                                graph.doActionsAsync([new DrawAction(new LinkDrawing({
                                    sourceId: _this39._sourceID,
                                    targetId: targetID
                                }))]);
                            }
                            delete _this39._sourceID;
                        });
                    },
                    type: this.type },
                _react2.default.createElement('circle', { cx: 10, cy: 10, r: 2, stroke: "#888888", fill: "#888888" }),
                _react2.default.createElement('circle', { cx: 30, cy: 30, r: 2, stroke: "#888888", fill: "#888888" }),
                _react2.default.createElement('path', { d: 'M 10 10 S 20 10, 20 20 S 20 30, 30 30', stroke: "#888888", fill: "transparent" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "LinkDrawing";
        }
    }]);
    return LinkToolbar;
}(_react.PureComponent);

LinkToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var ArrowLinkToolbar = exports.ArrowLinkToolbar = function (_PureComponent7) {
    (0, _inherits3.default)(ArrowLinkToolbar, _PureComponent7);

    function ArrowLinkToolbar() {
        (0, _classCallCheck3.default)(this, ArrowLinkToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (ArrowLinkToolbar.__proto__ || (0, _getPrototypeOf2.default)(ArrowLinkToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(ArrowLinkToolbar, [{
        key: 'getShapeID',
        value: function getShapeID(ele) {
            try {
                return ele.attributes['shape-id'].nodeValue;
            } catch (ex) {
                return null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this41 = this;

            var arrowPoint = getArrowPoints({ x: 20, y: 25 }, { x: 30, y: 30 }, 5);
            var arrowPath = arrowPoint.map(function (p, i) {
                if (i === 0) {
                    return 'M ' + p.x + ' ' + p.y;
                }
                return 'L ' + p.x + ' ' + p.y;
            });
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: function onClick() {
                        var graph = _this41.props.graph;

                        var svg = d3.select(graph.ele);
                        svg.on("mousedown", function () {
                            var event = d3.event;
                            _this41._sourceID = _this41.getShapeID(event.target);
                        }).on("mouseup", function () {
                            var event = d3.event;
                            var targetID = _this41.getShapeID(event.target);
                            if (_this41._sourceID && targetID) {
                                graph.doActionsAsync([new DrawAction(new ArrowLinkDrawing({
                                    sourceId: _this41._sourceID,
                                    targetId: targetID
                                }))]);
                            }
                            delete _this41._sourceID;
                        });
                    },
                    type: this.type },
                _react2.default.createElement('path', { d: 'M 10 10 S 20 15, 20 20 S 20 25, 30 30', stroke: "#888888", fill: "transparent" }),
                _react2.default.createElement('path', { d: [].concat((0, _toConsumableArray3.default)(arrowPath), ["Z"]).join(" "), stroke: "#888888", fill: "#888888" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "ArrowLinkDrawing";
        }
    }]);
    return ArrowLinkToolbar;
}(_react.PureComponent);

//#endregion

//#region D3Graph
/**
 * 运筹学图形D3
 * */


ArrowLinkToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var D3Graph = function (_Component) {
    (0, _inherits3.default)(D3Graph, _Component);
    (0, _createClass3.default)(D3Graph, [{
        key: 'scale',

        /**
         * @property {object} attrs - svg的属性
         * @property {Array} actions - 所有的操作
         * @property {single|multiple} selectMode [single] - 选择模式,是多选还是单选
         * @property {object} original - 坐标原点,默认值{x:0,y:0}
         * @property {screen|math} coordinateType - 坐标系,默认值是屏幕坐标系
         * @property {none|playing} mode - 模式,默认是:none,如果是playing,则是样式模式,会一步一步的演示绘图过程
         * @property {object} playingOption - mode===playing时有效
         * @property {Function} renderToolbar - 绘图的工具栏
         * @property {Number} scale - 缩放比例,默认是1(1个单位对应一个像素)
         * @property {Number} interval - action的执行时间间隔
         * */
        get: function get() {
            return this.state.scale;
        }
    }]);

    function D3Graph(props) {
        (0, _classCallCheck3.default)(this, D3Graph);

        var _this42 = (0, _possibleConstructorReturn3.default)(this, (D3Graph.__proto__ || (0, _getPrototypeOf2.default)(D3Graph)).call(this, props));

        _this42.ele = null;
        //画布中已有的图形
        _this42.shapes = [];
        //已经选中的图形的id
        _this42.selectedShapes = [];
        //绘制类型
        // this.definedDrawing = Object.assign({}, builtinDefinedDrawing, this.props.customDefinedDrawing);
        _this42.playingTimer = null;
        /**
         * 播放的索引
         * @type {number}
         */
        _this42.playingIndex = 0;
        /**
         * 正在播放的action
         * @type {Array}
         */
        _this42.playingActions = [];
        /**
         * 播放选项
         * @type {null}
         */
        _this42.playingOption = null;
        /**
         * 执行action的timter
         * @type {null}
         */
        _this42.timer = null;
        _this42.state = {
            /**
             * inputAction的属性
             */
            inputProperties: [],
            /**
             * 是否显示用户输入
             */
            showUserInput: false,
            /**
             * 所有的action
             */
            actions: [],
            /**
             * action执行的时间间隔
             */
            interval: props.interval,
            /**
             * 比例尺
             */
            scale: props.scale,
            /**
             * 原点
             */
            original: props.original,
            /**
             * 坐标系类型
             */
            coordinateType: props.coordinateType
        };
        return _this42;
    }

    /**
     * 根据id查找对应的图形
     * */


    (0, _createClass3.default)(D3Graph, [{
        key: 'findShapeById',
        value: function findShapeById(id) {
            var index = this.shapes.findIndex(function (f) {
                return f.id === id;
            });
            return this.shapes[index];
        }
    }, {
        key: 'getSelectedShapes',
        value: function getSelectedShapes() {
            return this.selectedShapes;
        }

        /**
         * 根据坐标系计算x值
         * */

    }, {
        key: 'getX',
        value: function getX(value) {
            return this.state.original.x + parseFloat(value) * this.state.scale;
        }

        /**
         * 根据坐标系计算y值
         * */

    }, {
        key: 'getY',
        value: function getY(value) {
            if (this.state.coordinateType === coordinateTypeEnum.screen) {
                return this.state.original.y + parseFloat(value) * this.state.scale;
            }
            return this.state.original.y - parseFloat(value) * this.state.scale;
        }

        /**
         * 将屏幕坐标转换成对应坐标系坐标
         * */

    }, {
        key: 'getPointFromScreen',
        value: function getPointFromScreen(screenX, screenY) {
            if (this.state.coordinateType === coordinateTypeEnum.math) {
                return {
                    x: (screenX - this.state.original.x) / this.state.scale,
                    y: (this.state.original.y - screenY) / this.state.scale
                };
            }
            return { x: screenX / this.state.scale, y: screenY / this.state.scale };
        }
    }, {
        key: 'doActionsAsync',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(actions) {
                var _this43 = this;

                var action;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                action = actions.shift();

                                if (!action) {
                                    _context2.next = 5;
                                    break;
                                }

                                _context2.next = 4;
                                return this.doActionAsync(action);

                            case 4:
                                if (!action.canBreak) {
                                    //next
                                    this.timer = setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this43.doActionsAsync(actions);

                                                    case 2:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this43);
                                    })), action.nextInterval ? action.nextInterval : this.state.interval);
                                } else {
                                    //保存后续的action,等待继续执行
                                    this._leftActions = actions;
                                }

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function doActionsAsync(_x5) {
                return _ref.apply(this, arguments);
            }

            return doActionsAsync;
        }()
    }, {
        key: 'doActionAsync',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(action) {
                var _this44 = this;

                var index, id, shape, _id, _shape, _id2, _shape2;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                console.log('action : ' + action.type);
                                _context5.t0 = action.type;
                                _context5.next = _context5.t0 === actionTypeEnums.draw ? 4 : _context5.t0 === actionTypeEnums.redraw ? 7 : _context5.t0 === actionTypeEnums.select ? 10 : _context5.t0 === actionTypeEnums.unselect ? 21 : _context5.t0 === actionTypeEnums.delete ? 27 : _context5.t0 === actionTypeEnums.clear ? 32 : _context5.t0 === actionTypeEnums.input ? 35 : 38;
                                break;

                            case 4:
                                this.shapes.push(action.params);
                                this.drawShapes([action.params]);
                                return _context5.abrupt('break', 38);

                            case 7:
                                index = this.shapes.findIndex(function (f) {
                                    return f.id === action.params.id;
                                });

                                if (index >= 0) {
                                    this.shapes[index] = (0, _immutabilityHelper2.default)(this.shapes[index], action.params.state);
                                    this.drawShapes([this.shapes[index]]);
                                }
                                return _context5.abrupt('break', 38);

                            case 10:
                                id = action.params;
                                shape = this.findShapeById(id);

                                if (!shape.selected) {
                                    _context5.next = 17;
                                    break;
                                }

                                _context5.next = 15;
                                return this.doActionAsync(new UnSelectAction(id));

                            case 15:
                                _context5.next = 19;
                                break;

                            case 17:
                                shape.selected = true;
                                if (this.props.selectMode === selectModeEnums.single) {
                                    //将已选中的shape取消选中
                                    this.selectedShapes.map(function (f) {
                                        return f.id;
                                    }).forEach(function () {
                                        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(i) {
                                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                    switch (_context3.prev = _context3.next) {
                                                        case 0:
                                                            _context3.next = 2;
                                                            return _this44.doActionAsync(new UnSelectAction(i));

                                                        case 2:
                                                        case 'end':
                                                            return _context3.stop();
                                                    }
                                                }
                                            }, _callee3, _this44);
                                        }));

                                        return function (_x7) {
                                            return _ref4.apply(this, arguments);
                                        };
                                    }());
                                    this.selectedShapes = [shape];
                                } else {
                                    this.selectedShapes.push(shape);
                                }

                            case 19:
                                this.drawShapes([shape]);
                                return _context5.abrupt('break', 38);

                            case 21:
                                _id = action.params;
                                _shape = this.findShapeById(_id);

                                _shape.selected = false;
                                this.selectedShapes = this.selectedShapes.filter(function (f) {
                                    return f.id !== _id;
                                });
                                this.drawShapes([_shape]);
                                return _context5.abrupt('break', 38);

                            case 27:
                                _id2 = action.params;
                                //删除的图形

                                _shape2 = this.shapes.find(function (s) {
                                    return s.id === _id2;
                                });
                                //删除后的图形

                                this.shapes = this.shapes.filter(function (s) {
                                    return s.id !== _id2;
                                });
                                // if (shape.selection) {
                                //     shape.selection.remove();
                                //     delete shape.selection;
                                // }
                                _shape2.remove();
                                return _context5.abrupt('break', 38);

                            case 32:
                                this.shapes.forEach(function () {
                                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(shape) {
                                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        _context4.next = 2;
                                                        return _this44.doActionAsync(new DeleteAction(shape.id));

                                                    case 2:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this44);
                                    }));

                                    return function (_x8) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());
                                this.selectedShapes = [];
                                return _context5.abrupt('break', 38);

                            case 35:
                                _context5.next = 37;
                                return this.showUserInputPromise(action);

                            case 37:
                                return _context5.abrupt('break', 38);

                            case 38:
                                this.setState((0, _immutabilityHelper2.default)(this.state, {
                                    actions: { $push: [action] }
                                }));

                            case 39:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function doActionAsync(_x6) {
                return _ref3.apply(this, arguments);
            }

            return doActionAsync;
        }()

        /**
         * 显示用户输入
         * @param action
         */

    }, {
        key: 'showUserInputPromise',
        value: function showUserInputPromise(action) {
            var _this45 = this;

            return new _promise2.default(function (resolve) {
                _this45.setState({
                    showUserInput: true,
                    inputProperties: action.params
                }, function () {
                    resolve();
                });
            });
        }

        /**
         * 隐藏用户输入并执行下一个action
         */

    }, {
        key: 'hideUserInput',
        value: function hideUserInput(nextActionOption) {
            var _this46 = this;

            var params = this.state.inputProperties.map(function (property) {
                return {
                    path: property.fieldName,
                    value: (0, _objectPath.get)(nextActionOption, property.fieldName)
                };
            });
            this.setState({
                showUserInput: false,
                inputProperties: []
            }, function () {
                //执行下一个action
                console.log("next action option", (0, _stringify2.default)(nextActionOption));
                console.log("first action", (0, _stringify2.default)(_this46._leftActions[0]));
                console.log("params", (0, _stringify2.default)(params));
                if (_this46._leftActions.length > 0) {
                    params.forEach(function (p) {
                        (0, _objectPath.set)(_this46._leftActions[0].params, p.path, p.value);
                    });
                }
                console.log("target first action", (0, _stringify2.default)(_this46._leftActions[0]));
                _this46.doActionsAsync(_this46._leftActions);
            });
        }
    }, {
        key: 'drawShapes',
        value: function drawShapes(shapes) {
            var _this47 = this;

            console.log('draw shaped', shapes);
            shapes.forEach(function (shape) {
                //初始化
                if (!shape.ready) {
                    shape.initialize(_this47);
                }
                shape.render();
            });
        }
    }, {
        key: 'play',
        value: function play(actions, playingOps) {
            this.playingActions = actions;
            this.playingIndex = 0;
            this.playingOption = playingOps;
            // let actionIndex = 0;
            // const next = () => {
            //     if (actionIndex >= actions.length) {
            //         return;
            //     }
            //     const action = actions[actionIndex];
            //     /**
            //      * 如果action允许中断操作则停止play
            //      */
            //     if (action.canBreak) {
            //         return;
            //     }
            //     this.doActions([action]);
            //     actionIndex++;
            //     this.playingTimer = setTimeout(next.bind(this), action.nextInterval ? action.nextInterval : getPath(playingOps, "interval", 1000));
            // }
            // next();
            this.playNextAction();
        }

        /**
         * 执行下一个下一个action
         */

    }, {
        key: 'playNextAction',
        value: function playNextAction() {
            if (this.playingIndex >= this.playingActions.length) {
                return;
            }
            var action = this.playingActions[this.playingIndex];
            this.doActionsAsync([action]);
            if (action.canBreak) {
                return;
            }
            this.playingIndex++;
            this.playingTimer = setTimeout(this.playNextAction.bind(this), action.nextInterval ? action.nextInterval : (0, _objectPath.get)(this.playingOption, "interval", 1000));
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.playingTimer) {
                clearTimeout(this.playingTimer);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this48 = this;

            return _react2.default.createElement(
                _WorkSpace2.default,
                { actions: this.props.renderToolbar(this) },
                _react2.default.createElement('svg', (0, _extends3.default)({ ref: function ref(_ref6) {
                        return _this48.ele = _ref6;
                    } }, this.props.attrs)),
                this.state.showUserInput && _react2.default.createElement(_UserInput2.default, { properties: this.state.inputProperties,
                    onOK: function onOK(value) {
                        //执行下一个action,并把用户的输入参数参入到下一个action
                        _this48.hideUserInput(value);
                    } })
            );
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this49 = this;

            var newState = {};
            if (this.state.interval !== nextProps.interval) {
                newState.interval = nextProps.interval;
            }
            if (this.state.scale !== nextProps.scale) {
                newState.scale = nextProps.scale;
            }
            if (this.state.original.x !== nextProps.original.x || this.state.original.y !== nextProps.original.y) {
                newState.original = nextProps.original;
            }
            var doActions = function doActions() {
                if (nextProps.actions.length > 0) {
                    _this49.doActionsAsync(nextProps.actions);
                }
            };
            var keys = (0, _keys2.default)(newState);
            if (keys.length > 0) {
                this.setState(newState, doActions);
            } else {
                doActions();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.doActionsAsync(this.props.actions);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.state.showUserInput !== nextState.showUserInput) {
                return true;
            }
            return false;
        }
    }]);
    return D3Graph;
}(_react.Component);
//#endregion


D3Graph.propTypes = {
    attrs: _propTypes2.default.object,
    //action
    actions: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        type: _propTypes2.default.oneOf((0, _keys2.default)(actionTypeEnums)).isRequired,
        params: _propTypes2.default.any
    })),
    // //默认的图形的样式
    // defaultAttrs: PropTypes.shape({
    // 	line: PropTypes.object,
    // 	dot: PropTypes.object,
    // 	circle: PropTypes.object,
    // 	text: PropTypes.object
    // }),
    // //图形被选中时候的样式
    // selectedAttrs: PropTypes.shape({
    // 	line: PropTypes.object,
    // 	dot: PropTypes.object,
    // }),
    //选择模式,是多选还是单选
    selectMode: _propTypes2.default.oneOf((0, _keys2.default)(selectModeEnums)),
    //自定义绘制类型
    // customDefinedDrawing: PropTypes.object,
    // onDrawTypeChange: PropTypes.func,
    original: _propTypes2.default.shape({
        x: _propTypes2.default.number,
        y: _propTypes2.default.number
    }),
    coordinateType: _propTypes2.default.oneOf((0, _keys2.default)(coordinateTypeEnum)),
    mode: _propTypes2.default.oneOf((0, _keys2.default)(graphModeEnum)),
    playingOption: _propTypes2.default.shape({
        interval: _propTypes2.default.number
    }),
    renderToolbar: _propTypes2.default.func,
    scale: _propTypes2.default.number,
    interval: _propTypes2.default.number
};
D3Graph.defaultProps = {
    attrs: {
        width: 400,
        height: 300,
        viewBox: "0 0 400 300",
        style: {
            backgroundColor: "#cccccc"
        }
    },
    selectMode: selectModeEnums.single,
    actions: [],
    original: {
        x: 0,
        y: 0
    },
    coordinateType: coordinateTypeEnum.screen,
    mode: graphModeEnum.none,
    renderToolbar: function renderToolbar() {
        return null;
    },
    scale: 1,
    interval: 1
};
exports.default = D3Graph;