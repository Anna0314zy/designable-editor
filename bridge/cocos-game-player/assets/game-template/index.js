System.register("chunks:///_virtual/ButtonSync3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './T2M.ts', './BaseSubUI.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, cclegacy, _decorator, Component, Node, v3, T2M, BaseSubUI;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Node = module.Node;
      v3 = module.v3;
    }, function (module) {
      T2M = module.T2M;
    }, function (module) {
      BaseSubUI = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2;

      cclegacy._RF.push({}, "58c6dMX6E9FKpk6WNyniFyv", "ButtonSync", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ButtonSync = exports('ButtonSync', (_dec = property({
        type: [Component.EventHandler]
      }), _dec2 = property({
        type: [Component.EventHandler]
      }), ccclass(_class = (_class2 = /*#__PURE__*/function (_BaseSubUI) {
        _inheritsLoose(ButtonSync, _BaseSubUI);

        function ButtonSync() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseSubUI.call.apply(_BaseSubUI, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "touchStartEvents", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchEndEvents", _descriptor2, _assertThisInitialized(_this));

          _this.tagId = void 0;
          return _this;
        }

        var _proto = ButtonSync.prototype;

        _proto.onLoad = function onLoad() {
          this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
          this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
          this.tagId = this.node.name + this.node.parent.name + this.node.getSiblingIndex();
          this.addEventByT2M();
        };

        _proto.addTouchEvent = function addTouchEvent(target, component, handlers) {
          this.touchStartEvents.push(new ButtonSync.EventHandler());
          this.touchStartEvents[0].target = target;
          this.touchStartEvents[0].component = component;
          this.touchStartEvents[0].handler = handlers[0];
          this.touchEndEvents.push(new ButtonSync.EventHandler());
          this.touchEndEvents[0].target = target;
          this.touchEndEvents[0].component = component;
          this.touchEndEvents[0].handler = handlers[1];
        };

        _proto.touchStart = function touchStart(event) {
          var type = 'touchStart' + this.tagId;
          T2M.dispatch(type, null);
        };

        _proto.touchEnd = function touchEnd(event) {
          var type = 'touchEnd' + this.tagId;
          T2M.dispatch(type, null);
        };

        _proto.addEventByT2M = function addEventByT2M() {
          T2M.addSyncEventListener('touchStart' + this.tagId, this.touchStartHandler.bind(this));
          T2M.addSyncEventListener('touchEnd' + this.tagId, this.touchEndHandler.bind(this));
        };

        _proto.touchStartHandler = function touchStartHandler(data) {
          this.node.scale = v3(1.2, 1.2, 1.2);

          for (var _iterator = _createForOfIteratorHelperLoose(this.touchStartEvents), _step; !(_step = _iterator()).done;) {
            var eventHandler = _step.value;
            eventHandler.emit([{
              target: this.node
            }]);
          }
        };

        _proto.touchEndHandler = function touchEndHandler(data) {
          this.node.scale = v3(1, 1, 1);

          for (var _iterator2 = _createForOfIteratorHelperLoose(this.touchEndEvents), _step2; !(_step2 = _iterator2()).done;) {
            var eventHandler = _step2.value;
            eventHandler.emit([{
              target: this.node
            }]);
          }
        };

        return ButtonSync;
      }(BaseSubUI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "touchStartEvents", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "touchEndEvents", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ConstValue3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseConstValue.ts'], function (exports) {
  var _inheritsLoose, cclegacy, BaseConstValue;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BaseConstValue = module.BaseConstValue;
    }],
    execute: function () {
      cclegacy._RF.push({}, "12e590BJHdP7pe9MxESRUsY", "ConstValue", undefined);

      var ConstValue = exports('ConstValue', /*#__PURE__*/function (_BaseConstValue) {
        _inheritsLoose(ConstValue, _BaseConstValue);

        function ConstValue() {
          return _BaseConstValue.apply(this, arguments) || this;
        }

        return ConstValue;
      }(BaseConstValue));
      /** --------------------------游戏通用配置---------------------------------- */

      ConstValue.SubGameVer = "1.0.0"; //子包的版本 每次打包自增

      ConstValue.CoursewareKey = 'game_template_cocos_SjnCfakD0McSZf123456'; //每个课件唯一的key 工程名+14位随机字符串。（脚本创建工程时自动生成）

      ConstValue.GameName = '游戏模板'; //游戏名中文描述，用于数据上报  （脚本创建工程时输入）

      /**--------------------------游戏业务逻辑通用配置------------------------------ */

      ConstValue.USE_COMMON_START_PANEL = true; //使用通用开始页
      //特殊的声音需求，如：背景音乐和音效分开控制 true为分开控制 false为统一控制  true的时候仅背景音乐绑定授权关系

      ConstValue.USE_SPECIAL_SOUND = false;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CustomSyncData3.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e0214mjgDpDA4+2kSSp90S6", "CustomSyncData", undefined);
      /**
       * 需要同步的自定义数据
       * 游戏业务层同步数据在这里添加
       */


      var CustomSyncData = exports('CustomSyncData', function CustomSyncData() {
        this.curLevel = 0;
      } // 当前关卡(第一关为0)
      );

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DragGroupSync3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './T2M.ts', './BaseSubUI.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, cclegacy, _decorator, Node, Component, UITransform, v3, T2M, BaseSubUI;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Component = module.Component;
      UITransform = module.UITransform;
      v3 = module.v3;
    }, function (module) {
      T2M = module.T2M;
    }, function (module) {
      BaseSubUI = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

      cclegacy._RF.push({}, "e8b4e2foFhF37xtMU7aSrN/", "DragGroupSync", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var DragGroupSync = exports('DragGroupSync', (_dec = property(Node), _dec2 = property({
        type: [Component.EventHandler]
      }), _dec3 = property({
        type: [Component.EventHandler]
      }), _dec4 = property({
        type: [Component.EventHandler]
      }), ccclass(_class = (_class2 = /*#__PURE__*/function (_BaseSubUI) {
        _inheritsLoose(DragGroupSync, _BaseSubUI);

        function DragGroupSync() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseSubUI.call.apply(_BaseSubUI, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "rootNode", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchStartEvents", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchMovingEvents", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchEndEvents", _descriptor4, _assertThisInitialized(_this));

          _this.tagId = void 0;
          _this.nodes = [];
          return _this;
        }

        var _proto = DragGroupSync.prototype;

        _proto.start = function start() {
          var _this2 = this;

          this.node.children.forEach(function (node, index) {
            _this2.nodes.push(node);

            node.setSiblingIndex(index);
            node.attr({
              id: index,
              initParent: _this2.node,
              initPos: {
                x: node.position.x,
                y: node.position.y
              },
              initSiblingIndex: index
            });
            node.on(Node.EventType.TOUCH_START, _this2.touchStart, _this2);
            node.on(Node.EventType.TOUCH_MOVE, _this2.touchMove, _this2);
            node.on(Node.EventType.TOUCH_END, _this2.touchEnd, _this2);
            node.on(Node.EventType.TOUCH_CANCEL, _this2.touchEnd, _this2);
          });
          this.tagId = this.node.name + this.node.parent.name + this.node.getSiblingIndex();
          this.addEventByT2M();
        };

        _proto.touchStart = function touchStart(event) {
          var node = event.target;
          var pos = this.rootNode.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
          var type = 'touchStart' + this.tagId + node.id;
          var data = {
            id: node.id,
            pos: {
              x: pos.x,
              y: pos.y
            }
          };
          T2M.dispatch(type, data);
        };

        _proto.touchMove = function touchMove(event) {
          var node = event.target;
          var pos = this.rootNode.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
          var type = 'touchMove' + this.tagId + node.id;
          var data = {
            id: node.id,
            pos: {
              x: pos.x,
              y: pos.y
            }
          };
          T2M.dispatch(type, data);
        };

        _proto.touchEnd = function touchEnd(event) {
          var node = event.target;
          var pos = this.rootNode.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
          var type = 'touchEnd' + this.tagId + node.id;
          var data = {
            id: node.id,
            pos: {
              x: pos.x,
              y: pos.y
            }
          };
          T2M.dispatch(type, data);
        };

        _proto.addEventByT2M = function addEventByT2M() {
          var _this3 = this;

          this.node.children.forEach(function (node, index) {
            //@ts-ignore
            T2M.addSyncEventListener('touchStart' + _this3.tagId + node.id, _this3.touchStartHandler.bind(_this3)); //@ts-ignore

            T2M.addSyncEventListener('touchMove' + _this3.tagId + node.id, _this3.touchMoveHandler.bind(_this3)); //@ts-ignore

            T2M.addSyncEventListener('touchEnd' + _this3.tagId + node.id, _this3.touchEndHandler.bind(_this3));
          });
        };

        _proto.touchStartHandler = function touchStartHandler(data) {
          //@ts-ignore
          var node = this.nodes.find(function (node) {
            return node.id == data.id;
          });
          node.parent = this.rootNode;
          node.setSiblingIndex(this.rootNode.children.length);
          node.position = v3(data.pos.x, data.pos.y);

          for (var _iterator = _createForOfIteratorHelperLoose(this.touchStartEvents), _step; !(_step = _iterator()).done;) {
            var eventHandler = _step.value;
            eventHandler.emit([{
              pos: data.pos,
              target: node
            }]);
          }
        };

        _proto.touchMoveHandler = function touchMoveHandler(data) {
          //@ts-ignore
          var node = this.nodes.find(function (node) {
            return node.id == data.id;
          });
          node.position = v3(data.pos.x, data.pos.y);

          for (var _iterator2 = _createForOfIteratorHelperLoose(this.touchMovingEvents), _step2; !(_step2 = _iterator2()).done;) {
            var eventHandler = _step2.value;
            eventHandler.emit([{
              pos: data.pos,
              target: node
            }]);
          }
        };

        _proto.touchEndHandler = function touchEndHandler(data) {
          //@ts-ignore
          var node = this.nodes.find(function (node) {
            return node.id == data.id;
          });
          node.position = v3(data.pos.x, data.pos.y);

          for (var _iterator3 = _createForOfIteratorHelperLoose(this.touchEndEvents), _step3; !(_step3 = _iterator3()).done;) {
            var eventHandler = _step3.value;
            eventHandler.emit([{
              pos: data.pos,
              target: node
            }]);
          }
        };

        return DragGroupSync;
      }(BaseSubUI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "rootNode", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "touchStartEvents", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "touchMovingEvents", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "touchEndEvents", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DragSync3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './T2M.ts', './BaseSubUI.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, cclegacy, _decorator, Node, Component, find, UITransform, v3, T2M, BaseSubUI;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Component = module.Component;
      find = module.find;
      UITransform = module.UITransform;
      v3 = module.v3;
    }, function (module) {
      T2M = module.T2M;
    }, function (module) {
      BaseSubUI = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

      cclegacy._RF.push({}, "65e3dj+DiNMupJUMnw0X4p7", "DragSync", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var DragSync = exports('DragSync', (_dec = property(Node), _dec2 = property({
        type: [Component.EventHandler]
      }), _dec3 = property({
        type: [Component.EventHandler]
      }), _dec4 = property({
        type: [Component.EventHandler]
      }), ccclass(_class = (_class2 = /*#__PURE__*/function (_BaseSubUI) {
        _inheritsLoose(DragSync, _BaseSubUI);

        function DragSync() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseSubUI.call.apply(_BaseSubUI, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "rootNode", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchStartEvents", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchMovingEvents", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "touchEndEvents", _descriptor4, _assertThisInitialized(_this));

          _this.tagId = void 0;
          return _this;
        }

        var _proto = DragSync.prototype;

        _proto.onLoad = function onLoad() {
          this.rootNode = find('Canvas/PublicModelPanel/GamePanel');
          var index = this.node.getSiblingIndex();
          this.node.attr({
            id: index,
            initParent: this.node.parent,
            initPos: {
              x: this.node.position.x,
              y: this.node.position.y
            },
            initSiblingIndex: index
          });
          this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
          this.tagId = this.node.name + this.node.parent.name + this.node.getSiblingIndex();
          this.addEventByT2M();
        };

        _proto.addTouchEvent = function addTouchEvent(target, component, handlers) {
          this.touchStartEvents.push(new DragSync.EventHandler());
          this.touchStartEvents[0].target = target;
          this.touchStartEvents[0].component = component;
          this.touchStartEvents[0].handler = handlers[0];
          this.touchMovingEvents.push(new DragSync.EventHandler());
          this.touchMovingEvents[0].target = target;
          this.touchMovingEvents[0].component = component;
          this.touchMovingEvents[0].handler = handlers[1];
          this.touchEndEvents.push(new DragSync.EventHandler());
          this.touchEndEvents[0].target = target;
          this.touchEndEvents[0].component = component;
          this.touchEndEvents[0].handler = handlers[2];
        };

        _proto.touchStart = function touchStart(event) {
          var pos = this.rootNode.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
          var type = 'touchStart' + this.tagId;
          var data = {
            pos: {
              x: pos.x,
              y: pos.y
            }
          };
          T2M.dispatch(type, data);
        };

        _proto.touchMove = function touchMove(event) {
          var pos = this.rootNode.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
          var type = 'touchMove' + this.tagId;
          var data = {
            pos: {
              x: pos.x,
              y: pos.y
            }
          };
          T2M.dispatch(type, data, true);
        };

        _proto.touchEnd = function touchEnd(event) {
          var pos = this.rootNode.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
          var type = 'touchEnd' + this.tagId;
          var data = {
            pos: {
              x: pos.x,
              y: pos.y
            }
          };
          T2M.dispatch(type, data);
        };

        _proto.addEventByT2M = function addEventByT2M() {
          T2M.addSyncEventListener('touchStart' + this.tagId, this.touchStartHandler.bind(this));
          T2M.addSyncEventListener('touchMove' + this.tagId, this.touchMoveHandler.bind(this));
          T2M.addSyncEventListener('touchEnd' + this.tagId, this.touchEndHandler.bind(this));
          console.log('addEventByT2M', this.tagId);
        };

        _proto.touchStartHandler = function touchStartHandler(data) {
          this.node.parent = this.rootNode;
          this.node.position = v3(data.pos.x, data.pos.y);

          for (var _iterator = _createForOfIteratorHelperLoose(this.touchStartEvents), _step; !(_step = _iterator()).done;) {
            var eventHandler = _step.value;
            eventHandler.emit([{
              pos: data.pos,
              target: this.node
            }]);
          }
        };

        _proto.touchMoveHandler = function touchMoveHandler(data) {
          this.node.position = v3(data.pos.x, data.pos.y);

          for (var _iterator2 = _createForOfIteratorHelperLoose(this.touchMovingEvents), _step2; !(_step2 = _iterator2()).done;) {
            var eventHandler = _step2.value;
            eventHandler.emit([{
              pos: data.pos,
              target: this.node
            }]);
          }
        };

        _proto.touchEndHandler = function touchEndHandler(data) {
          this.node.position = v3(data.pos.x, data.pos.y);

          for (var _iterator3 = _createForOfIteratorHelperLoose(this.touchEndEvents), _step3; !(_step3 = _iterator3()).done;) {
            var eventHandler = _step3.value;
            eventHandler.emit([{
              pos: data.pos,
              target: this.node
            }]);
          }
        };

        return DragSync;
      }(BaseSubUI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "rootNode", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "touchStartEvents", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "touchMovingEvents", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "touchEndEvents", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EditorData3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseEditorData.ts'], function (exports) {
  var _inheritsLoose, cclegacy, BaseEditorData;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BaseEditorData = module.BaseEditorData;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9a35agK+8FOKYApx8iUD3l1", "EditorData", undefined);

      var EditorData = exports('EditorData', /*#__PURE__*/function (_BaseEditorData) {
        _inheritsLoose(EditorData, _BaseEditorData);

        function EditorData() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseEditorData.call.apply(_BaseEditorData, [this].concat(args)) || this;
          _this.isStarCount = false; // 是否开启再玩一次

          _this.isReplay = true; // 是否自动播放题干语音

          _this.isPlayTitle = true; // 是否播放新手引导

          _this.isPlayGuide = true; // 是否播放背景音乐

          _this.isPlayBgm = true; // 可重玩次数

          _this.replayCount = 1; // 关卡总数

          _this.levelCount = 1; // 总步数

          _this.stepCount = 0;
          /** 上传文件的数据  */

          _this.upLoadFilesData = null;
          return _this;
        } // TODO 自定义数据


        return EditorData;
      }(BaseEditorData));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EventType3.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "69629YdQS9P4alEkGcBgiJA", "EventType", undefined);
      /**
       * 自定义事件类型
       */


      var EventType = exports('EventType', /*#__PURE__*/function (EventType) {
        EventType["ON_BUTTON_CLICKED"] = "ON_BUTTON_CLICKED";
        EventType["GAME_OVER"] = "GAME_OVER";
        return EventType;
      }({}));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game-template", ['./ButtonSync3.ts', './DragGroupSync3.ts', './DragSync3.ts', './UploadAudio3.ts', './UploadImg3.ts', './ConstValue3.ts', './CustomSyncData3.ts', './EditorData3.ts', './EventType3.ts', './GameData3.ts', './GameManager3.ts', './GamePanel3.ts', './TeacherPanel3.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/GameData3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseGameData.ts'], function (exports) {
  var _inheritsLoose, cclegacy, BaseGameData;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BaseGameData = module.BaseGameData;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8d93cHCqqFIaa6kDrRcI2p6", "GameData", undefined);

      var GameData = exports('GameData', /*#__PURE__*/function (_BaseGameData) {
        _inheritsLoose(GameData, _BaseGameData);

        function GameData() {
          return _BaseGameData.apply(this, arguments) || this;
        }

        return GameData;
      }(BaseGameData));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseGameManager.ts'], function (exports) {
  var _inheritsLoose, cclegacy, BaseGameManager;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BaseGameManager = module.BaseGameManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "eefcdQEBnRKAZAakRwlEmtG", "GameManager", undefined);

      var GameManagerClass = /*#__PURE__*/function (_BaseGameManager) {
        _inheritsLoose(GameManagerClass, _BaseGameManager);

        function GameManagerClass() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseGameManager.call.apply(_BaseGameManager, [this].concat(args)) || this;
          /** 编辑器数据 */

          _this.editorData = void 0;
          /** 自定义同步数据 */

          _this.customSyncData = void 0;
          /** 框架中的同步数据 */

          _this.frameSyncData = void 0;
          /** 自定义游戏数据 */

          _this.customGameData = void 0;
          return _this;
        }

        GameManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new GameManagerClass();
          }

          return this._instance;
        };

        return GameManagerClass;
      }(BaseGameManager);

      GameManagerClass._instance = null;
      var GameManager = exports('GameManager', GameManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GamePanel3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseGamePanel.ts', './CustomSyncData3.ts', './GameData3.ts', './ConstValue3.ts', './GameManager3.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, BaseGamePanel, CustomSyncData, GameData, ConstValue, GameManager;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      BaseGamePanel = module.default;
    }, function (module) {
      CustomSyncData = module.CustomSyncData;
    }, function (module) {
      GameData = module.GameData;
    }, function (module) {
      ConstValue = module.ConstValue;
    }, function (module) {
      GameManager = module.GameManager;
    }],
    execute: function () {
      var _dec, _class, _class2;

      cclegacy._RF.push({}, "69adedlRvJEpaoWW5egAwax", "GamePanel", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var GamePanel = exports('GamePanel', (_dec = ccclass('GamePanel'), _dec(_class = (_class2 = /*#__PURE__*/function (_BaseGamePanel) {
        _inheritsLoose(GamePanel, _BaseGamePanel);

        function GamePanel() {
          return _BaseGamePanel.apply(this, arguments) || this;
        }

        var _proto = GamePanel.prototype;
        /**
         * 初始化游戏数据
         * 子游戏请勿修改！！！
         * @param callBack 
         */

        _proto.initGameData = function initGameData(callBack) {
          var customSyncData = new CustomSyncData();
          var customGameData = new GameData();
          callBack(customSyncData, customGameData, ConstValue);
        }
        /**
         * 根据编辑器数据动态创建游戏节点
         * 此方法会在 start 之前执行
         * 方法中不能写异步函数，确保 start 执行前，此方法中的逻辑已经执行完毕
         */
        ;

        _proto.createGameNode = function createGameNode() {
          // 所有继承自 BaseSubUI 的组件都可以拿到这几个数据
          var editorData = this.editorData;
          var customSyncData = this.customSyncData;
          var frameSyncData = this.frameSyncData;
          var customGameData = this.customGameData; // 获取远程资源 
          // const remoteAsset = this.getRemoteAsset('fileKey');
          // const remoteAssetData = this.remoteAssetsList.get('fileKey');
          // const remoteAsset = remoteAssetData.asset;
          // const remoteAssetUrl = remoteAssetData.url;
          // 获取本地资源
          // const localAsset = this.subGameBundle?.get('res/xxx/xxx', SpriteFrame);
        }
        /**
         * 注意：游戏里的组件脚本（包括 GamePanel、TeacherPanel 及其他自定义组件脚本）不允许使用 onLoad 生命周期函数！
         * start 在 setPanel 之后执行
         */
        ;

        _proto.start = function start() {
          _BaseGamePanel.prototype.start.call(this);
        };

        _proto.onDestroy = function onDestroy() {
          _BaseGamePanel.prototype.onDestroy.call(this);
        }
        /**
         * 游戏入口
         * 这里已经拿到数据
         */
        ;

        _proto.showPanel = function showPanel() {
          _BaseGamePanel.prototype.showPanel.call(this);

          var editorData = this.editorData;
          var customSyncData = this.customSyncData;
          var frameSyncData = this.frameSyncData;
          var customGameData = this.customGameData;
          GameManager.initData(editorData, customSyncData, frameSyncData, customGameData); // TODO 业务逻辑
        };

        _proto.onGameStart = function onGameStart() {
          _BaseGamePanel.prototype.onGameStart.call(this);
        }
        /**
         * 心跳回调（当actionId不相等时才会触发）
         * @param recovery
         */
        ;

        _proto.onRecoveryData = function onRecoveryData(recovery) {
          _BaseGamePanel.prototype.onRecoveryData.call(this, recovery);
        }
        /**
         * 根据当前的同步数据重置游戏
         * 心跳的数据同步、再玩一次、重新玩，都会调用此方法；此时，同步数据已经更新过了，直接使用
         */
        ;

        _proto.setGameStatus = function setGameStatus() {
          _BaseGamePanel.prototype.setGameStatus.call(this); // TODO 业务逻辑

        }
        /**
         * 作答正确
         * 父类实现了数据上报
         * @param isCurLevelFinish 本关是否完成
         */
        ;

        _proto.answerRight = function answerRight(isCurLevelFinish) {
          _BaseGamePanel.prototype.answerRight.call(this, isCurLevelFinish);
        }
        /**
         * 作答错误
         * 父类实现了数据上报
         * @param isCurLevelFinish 本关是否完成
         */
        ;

        _proto.answerWrong = function answerWrong(isCurLevelFinish) {
          if (isCurLevelFinish === void 0) {
            isCurLevelFinish = false;
          }

          _BaseGamePanel.prototype.answerWrong.call(this, isCurLevelFinish);
        }
        /**
         * 游戏结束
         * 父类实现了结算界面（游戏结束或星级评判）的弹出
         */
        ;

        _proto.gameOver = function gameOver() {
          _BaseGamePanel.prototype.gameOver.call(this);
        }
        /**
         * 再玩一次
         */
        ;

        _proto.onReplay = function onReplay() {
          // 先初始化游戏数据并绑定到 publicModelPanel ，再调用父类方法
          var customSyncData = new CustomSyncData();
          var customGameData = new GameData();
          this.bindGameDataToPublicModelPanel(customSyncData, customGameData);

          _BaseGamePanel.prototype.onReplay.call(this);
        }
        /**
         * 重新玩
         */
        ;

        _proto.recRestart = function recRestart() {
          // 先初始化游戏数据并绑定到 publicModelPanel ，再调用父类方法
          var customSyncData = new CustomSyncData();
          var customGameData = new GameData();
          this.bindGameDataToPublicModelPanel(customSyncData, customGameData);

          _BaseGamePanel.prototype.recRestart.call(this);
        };

        _proto.update = function update(dt) {
          _BaseGamePanel.prototype.update.call(this, dt);
        };

        return GamePanel;
      }(BaseGamePanel), _class2.className = 'GamePanel', _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TeacherPanel3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseTeacherPanel.ts', './SubUIHelp.ts', './ReportManager.ts', './EditorData3.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, ToggleContainer, Node, BaseTeacherPanel, SubUIHelp, ReportManager, EditorData;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      ToggleContainer = module.ToggleContainer;
      Node = module.Node;
    }, function (module) {
      BaseTeacherPanel = module.default;
    }, function (module) {
      SubUIHelp = module.SubUIHelp;
    }, function (module) {
      ReportManager = module.ReportManager;
    }, function (module) {
      EditorData = module.EditorData;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3;

      cclegacy._RF.push({}, "a76e1BFB/9MtI+vL7aYOm4A", "TeacherPanel", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var TeacherPanel = exports('TeacherPanel', (_dec = ccclass('TeacherPanel'), _dec2 = property(ToggleContainer), _dec3 = property(ToggleContainer), _dec4 = property(ToggleContainer), _dec5 = property(ToggleContainer), _dec6 = property(ToggleContainer), _dec7 = property(Node), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_BaseTeacherPanel) {
        _inheritsLoose(TeacherPanel, _BaseTeacherPanel);

        function TeacherPanel() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseTeacherPanel.call.apply(_BaseTeacherPanel, [this].concat(args)) || this;
          /** 是否支持星级评判 */

          _initializerDefineProperty(_this, "toggle_stars", _descriptor, _assertThisInitialized(_this));
          /** 是否支持重玩 */


          _initializerDefineProperty(_this, "toggle_replay", _descriptor2, _assertThisInitialized(_this));
          /** 是否自动播放标题语音 */


          _initializerDefineProperty(_this, "toggle_titleAudio", _descriptor3, _assertThisInitialized(_this));
          /** 是否播放引导 */


          _initializerDefineProperty(_this, "toggle_playGuide", _descriptor4, _assertThisInitialized(_this));
          /** 是否播放背景音乐 */


          _initializerDefineProperty(_this, "toggle_playBgm", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "_layout_defOptions", _descriptor6, _assertThisInitialized(_this));

          _this._btn_save = null;
          _this._btn_view = null;
          return _this;
        }

        var _proto = TeacherPanel.prototype;
        /**
        * 初始化编辑器数据
        * 子游戏请勿修改！！！
        * @param callBack 
        */

        _proto.initEditorData = function initEditorData(callBack) {
          var editorData = new EditorData();
          callBack(editorData);
        }
        /**
         * 注意：start 在 setPanel 之后执行
         */
        ;

        _proto.start = function start() {
          _BaseTeacherPanel.prototype.start.call(this); // 可编辑的游戏，不展示保存按钮
          //  const isEdit = EditorManager.isSupportEdit();


          var isEdit = true;

          if (this._btn_save) {
            this._btn_save.active = !isEdit;
          }

          this._layout_defOptions.active = false;
        }
        /**
         * 设置界面（这里已经拿到了编辑器数据和远程资源） 
         */
        ;

        _proto.showPanel = function showPanel() {
          _BaseTeacherPanel.prototype.showPanel.call(this); // 所有继承自 BaseSubUI 的组件都可以拿到这几个数据


          var editorData = this.editorData;
          var customSyncData = this.customSyncData;
          var customGameData = this.customGameData; // 获取远程资源
          // const remoteAsset = this.getRemoteAsset(editorData.upLoadFilesData['xxxx']);
          // 获取本地资源
          // const localAsset = this.subGameBundle?.get('res/xxx/xxx', SpriteFrame);

          this._layout_defOptions.active = true;
          this.toggle_playGuide.node.parent.active = true;
          this.toggle_stars.node.parent.active = true;
          this.toggle_titleAudio.node.parent.active = true;
          this.toggle_playBgm.node.parent.active = true;
          this.toggle_replay.toggleItems[this.editorData.isReplay ? 0 : 1].isChecked = true;
          this.toggle_titleAudio.toggleItems[this.editorData.isPlayTitle ? 0 : 1].isChecked = true;
          this.toggle_playGuide.toggleItems[this.editorData.isPlayGuide ? 0 : 1].isChecked = true;
          this.toggle_playBgm.toggleItems[this.editorData.isPlayBgm ? 0 : 1].isChecked = true;
        } // 重玩开关
        ;

        _proto.onToggleReplay = function onToggleReplay(toggle) {
          var index = this.toggle_replay.toggleItems.indexOf(toggle);
          this.editorData.isReplay = 0 === index;
        } // 自动播放题干语音开关
        ;

        _proto.onToggleTitleAudio = function onToggleTitleAudio(toggle) {
          var index = this.toggle_titleAudio.toggleItems.indexOf(toggle);
          this.editorData.isPlayTitle = 0 === index;
        } // 自动播放新手引导开关
        ;

        _proto.onToggleGuideAudio = function onToggleGuideAudio(toggle) {
          var index = this.toggle_playGuide.toggleItems.indexOf(toggle);
          this.editorData.isPlayGuide = 0 === index;
        } // 是否播放bgm
        ;

        _proto.onTogglePlayBgm = function onTogglePlayBgm(toggle) {
          var index = this.toggle_playBgm.toggleItems.indexOf(toggle);
          this.editorData.isPlayBgm = 0 === index;
        } // 保存课件按钮
        ;

        _proto.onBtnSaveClicked = function onBtnSaveClicked() {
          var isEdit = this.editorData.isSupportEdit;

          if (!isEdit || ReportManager.isAllOver) {
            SubUIHelp.showSubmissionPanel();
          } else {
            SubUIHelp.showTip('请先完成一遍题目');
          }
        } // 预览课件按钮
        ;

        _proto.onBtnViewClicked = function onBtnViewClicked() {
          this.showGamePanel();
        };

        _proto.showGamePanel = function showGamePanel() {
          _BaseTeacherPanel.prototype.showGamePanel.call(this);
        };

        return TeacherPanel;
      }(BaseTeacherPanel), _class3.className = "TeacherPanel", _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "toggle_stars", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "toggle_replay", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "toggle_titleAudio", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "toggle_playGuide", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "toggle_playBgm", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_layout_defOptions", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UploadAudio3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './CosManager.ts', './FrameListenerManager.ts', './FrameMsgType.ts', './AudioEngine.ts', './OpenFile.ts', './BaseSubUI.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, CosManager, FrameListenerManager, FrameMsgType, AudioEngine, OpenFile, BaseSubUI;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
    }, function (module) {
      CosManager = module.CosManager;
    }, function (module) {
      FrameListenerManager = module.FrameListenerManager;
    }, function (module) {
      FrameMsgType = module.FrameMsgType;
    }, function (module) {
      AudioEngine = module.AudioEngine;
    }, function (module) {
      OpenFile = module.OpenFile;
    }, function (module) {
      BaseSubUI = module.default;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2;

      cclegacy._RF.push({}, "e0f801/GeFNMKp/fRPL0BRr", "UploadAudio", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UploadAudio = exports('UploadAudio', (_dec = property(Label), ccclass(_class = (_class2 = /*#__PURE__*/function (_BaseSubUI) {
        _inheritsLoose(UploadAudio, _BaseSubUI);

        function UploadAudio() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseSubUI.call.apply(_BaseSubUI, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "selfText", _descriptor, _assertThisInitialized(_this));
          /** 取文件时候需要用到的 对应upLoadFileMap的key */


          _initializerDefineProperty(_this, "fileKey", _descriptor2, _assertThisInitialized(_this));

          _this._selfAudio = null;
          return _this;
        }

        var _proto = UploadAudio.prototype;

        _proto.start = function start() {
          FrameListenerManager.on(FrameMsgType.REFRESH_EDITOR_DOWNLOAD_UI, this.refresh, this);
        };

        _proto.onCallBack = function onCallBack() {
          OpenFile.openAudioFile(this.uploadFile.bind(this));
        };

        _proto.setFileKey = function setFileKey(key) {
          this.fileKey = key;
        }
        /** 试听 */
        ;

        _proto.onPlayAudio = function onPlayAudio() {
          AudioEngine.stopAllEffects();
          this._selfAudio && AudioEngine.playEffect(this._selfAudio, false);
        }
        /** 刷新音效展示 */
        ;

        _proto.refresh = function refresh() {
          var fileData = this.remoteAssetsList.get(this.fileKey);
          if (!fileData) return;

          if (fileData.asset) {
            this._selfAudio = fileData.asset;
            this.selfText && (this.selfText.string = fileData.fileName);
          }
        }
        /**
         * 播放音频
         * @param strAudio DataUrl
         */
        ;

        _proto.uploadFile = function uploadFile(file) {
          var _this2 = this;

          var fileData = CosManager.getUploadFileData(file, this.fileKey);
          CosManager.uploadFile(fileData).then(function () {
            _this2.selfText && (_this2.selfText.string = file.name);
            _this2._selfAudio = _this2.getRemoteAsset(_this2.fileKey);
          });
        };

        _proto.delAudio = function delAudio() {
          this.selfText.string = "未上传";
          this._selfAudio = null;
          CosManager.delFileData(this.fileKey);
        };

        return UploadAudio;
      }(BaseSubUI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "selfText", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fileKey", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UploadImg3.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './CosManager.ts', './FrameMsgType.ts', './OpenFile.ts', './ListenerManager.ts', './BaseSubUI.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Sprite, CosManager, FrameMsgType, OpenFile, ListenerManager, BaseSubUI;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
    }, function (module) {
      CosManager = module.CosManager;
    }, function (module) {
      FrameMsgType = module.FrameMsgType;
    }, function (module) {
      OpenFile = module.OpenFile;
    }, function (module) {
      ListenerManager = module.ListenerManager;
    }, function (module) {
      BaseSubUI = module.default;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2;

      cclegacy._RF.push({}, "dc8acDBiVNOYY/Nqh6yWKT4", "UploadImg", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UploadImg = exports('UploadImg', (_dec = property(Sprite), ccclass(_class = (_class2 = /*#__PURE__*/function (_BaseSubUI) {
        _inheritsLoose(UploadImg, _BaseSubUI);

        function UploadImg() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseSubUI.call.apply(_BaseSubUI, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "selfImg", _descriptor, _assertThisInitialized(_this));
          /** 取文件时候需要用到的 对应upLoadFileMap的key */


          _initializerDefineProperty(_this, "fileKey", _descriptor2, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = UploadImg.prototype;

        _proto.start = function start() {
          ListenerManager.on(FrameMsgType.REFRESH_EDITOR_DOWNLOAD_UI, this.refresh, this);
        };

        _proto.refresh = function refresh() {
          var file = this.remoteAssetsList.get(this.fileKey);
          if (!file) return;

          if (file.asset) {
            this.selfImg.spriteFrame = file.asset;
          }
        };

        _proto.setFileKey = function setFileKey(key) {
          this.fileKey = key;
        };

        _proto.onCallBack = function onCallBack() {
          OpenFile.openImageFile(this.uploadFile.bind(this));
        }
        /**
         * 设置图片
         * @param strImg
         */
        ;

        _proto.uploadFile = function uploadFile(file) {
          var _this2 = this;

          var fileData = CosManager.getUploadFileData(file, this.fileKey);
          CosManager.uploadFile(fileData).then(function () {
            _this2.selfImg.spriteFrame = _this2.getRemoteAsset(_this2.fileKey);
          });
        };

        _proto.delImg = function delImg() {
          CosManager.delFileData(this.fileKey);
          this.selfImg.spriteFrame = null;
        };

        return UploadImg;
      }(BaseSubUI), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "selfImg", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fileKey", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/game-template', 'chunks:///_virtual/game-template'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});