var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node3 of mutation.addedNodes) {
        if (node3.tagName === "LINK" && node3.rel === "modulepreload")
          processPreload(node3);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$2 = Symbol.for("react.element"), n$3 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r$1 = Symbol.for("react.profiler"), t$1 = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e2) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e2 || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e2) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e2 || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e2) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e2;
  else if (1 < g) {
    for (var f = Array(g), m2 = 0; m2 < g; m2++) f[m2] = arguments[m2 + 2];
    c.children = f;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$2, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$2, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$2;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e2, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$2:
        case n$3:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e2 = "", null != a && (e2 = a.replace(P$1, "$&/") + "/"), R$1(c, b, e2, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e2 + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f = d + Q$1(k2, g);
    h += R$1(k2, b, e2, f, c);
  }
  else if (f = A$1(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f = d + Q$1(k2, g++), h += R$1(k2, b, e2, f, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e2) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e2, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
react_production_min.Children = { map: S$1, forEach: function(a, b, e2) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e2);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r$1;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.cloneElement = function(a, b, e2) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f in b) J.call(b, f) && !L$1.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
  }
  var f = arguments.length - 2;
  if (1 === f) d.children = e2;
  else if (1 < f) {
    g = Array(f);
    for (var m2 = 0; m2 < f; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$2, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t$1, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = function() {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e2) {
  return U$1.current.useImperativeHandle(a, b, e2);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e2) {
  return U$1.current.useReducer(a, b, e2);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e2) {
  return U$1.current.useSyncExternalStore(a, b, e2);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.2.0";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$1 = reactExports, k = Symbol.for("react.element"), l$1 = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n$2 = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e2 = null, h = null;
  void 0 !== g && (e2 = "" + g);
  void 0 !== a.key && (e2 = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e2, ref: h, props: d, _owner: n$2.current };
}
reactJsxRuntime_production_min.Fragment = l$1;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler$1 = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e2 = a[d];
      if (0 < g(e2, b)) a[d] = b, a[c] = e2, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e2 = a.length, w2 = e2 >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e2 && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e2 && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e2 = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e2 ? v2.callback = e2 : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e2 = -1;
        break;
      case 2:
        e2 = 250;
        break;
      case 5:
        e2 = 1073741823;
        break;
      case 4:
        e2 = 1e4;
        break;
      default:
        e2 = 5e3;
    }
    e2 = c + e2;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e2, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e2, f(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler$1.exports = scheduler_production_min;
}
var schedulerExports = scheduler$1.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e2, f, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e2;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e2 = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e2 ? 0 !== e2.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e2, d) && (c = null), d || null === e2 ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e2.mustUseProperty ? a[e2.propertyName] = null === c ? 3 === e2.type ? false : "" : c : (b = e2.attributeName, d = e2.attributeNamespace, null === c ? a.removeAttribute(b) : (e2 = e2.type, c = 3 === e2 || 4 === e2 && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e2 = l2.stack.split("\n"), f = d.stack.split("\n"), g = e2.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e2[g] !== f[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e2[g] !== f[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e2[g] !== f[h]) {
              var k2 = "\n" + e2[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e2 = c.get, f = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e2.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e2 = 0; e2 < c.length; e2++) b["$" + c[e2]] = true;
    for (c = 0; c < a.length; c++) e2 = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e2 && (a[c].selected = e2), e2 && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e2 = 0; e2 < a.length; e2++) {
      if (a[e2].value === c) {
        a[e2].selected = true;
        d && (a[e2].defaultSelected = true);
        return;
      }
      null !== b || a[e2].disabled || (b = a[e2]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e2) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e2);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e2 = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e2) : a[c] = e2;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e2, f, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e2, f, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e2, f, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e2 = c.return;
    if (null === e2) break;
    var f = e2.alternate;
    if (null === f) {
      d = e2.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e2.child === f.child) {
      for (f = e2.child; f; ) {
        if (f === c) return Xb(e2), a;
        if (f === d) return Xb(e2), b;
        f = f.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e2, d = f;
    else {
      for (var g = false, h = e2.child; h; ) {
        if (h === c) {
          g = true;
          c = e2;
          d = f;
          break;
        }
        if (h === d) {
          g = true;
          d = e2;
          c = f;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f.child; h; ) {
          if (h === c) {
            g = true;
            c = f;
            d = e2;
            break;
          }
          if (h === d) {
            g = true;
            d = f;
            c = e2;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e2 = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e2;
    0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
  } else g = c & ~e2, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e2) && (e2 = d & -d, f = b & -b, e2 >= f || 16 === e2 && 0 !== (f & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e2 = 1 << c, d |= a[c], b &= ~e2;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e2 = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
    var g = 31 - oc(f), h = 1 << g, k2 = e2[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e2[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e2 = 31 - oc(c), f = 1 << e2;
    b[e2] = 0;
    d[e2] = -1;
    a[e2] = -1;
    c &= ~f;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e2 = 1 << d;
    e2 & b | a[d] & b && (a[d] |= b);
    c &= ~e2;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e2, f) {
  if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e2] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e2 && -1 === b.indexOf(e2) && b.push(e2);
  return a;
}
function Uc(a, b, c, d, e2) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e2), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e2), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e2), true;
    case "pointerover":
      var f = e2.pointerId;
      Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e2));
      return true;
    case "gotpointercapture":
      return f = e2.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e2)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e2 = C, f = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e2, cd.transition = f;
  }
}
function gd(a, b, c, d) {
  var e2 = C, f = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e2, cd.transition = f;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e2 = Yc(a, b, c, d);
    if (null === e2) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e2, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e2; ) {
        var f = Cb(e2);
        null !== f && Ec(f);
        f = Yc(a, b, c, d);
        null === f && hd(a, b, d, id, c);
        if (f === e2) break;
        e2 = f;
      }
      null !== e2 && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e2 = "value" in kd ? kd.value : kd.textContent, f = e2.length;
  for (a = 0; a < c && b[a] === e2[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e2[f - d]; d++) ;
  return md = e2.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e2, f, g) {
    this._reactName = b2;
    this._targetInst = e2;
    this.type = d;
    this.nativeEvent = f;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
    this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e2 = c[d];
    if (!ja.call(b, e2) || !He(a[e2], b[e2])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e2 = c.textContent.length, f = Math.min(d.start, e2);
        d = void 0 === d.end ? f : Math.min(d.end, e2);
        !a.extend && f > d && (e2 = d, d = f, f = e2);
        e2 = Ke(c, f);
        var g = Ke(
          c,
          d
        );
        e2 && g && (1 !== a.rangeCount || a.anchorNode !== e2.node || a.anchorOffset !== e2.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e2.node, e2.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e2 = d.event;
    d = d.listeners;
    a: {
      var f = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f && e2.isPropagationStopped()) break a;
        nf(e2, h, l2);
        f = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f && e2.isPropagationStopped()) break a;
        nf(e2, h, l2);
        f = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e2 = ed;
      break;
    case 4:
      e2 = gd;
      break;
    default:
      e2 = fd;
  }
  c = e2.bind(null, b, c, a);
  e2 = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e2 = true);
  d ? void 0 !== e2 ? a.addEventListener(b, c, { capture: true, passive: e2 }) : a.addEventListener(b, c, true) : void 0 !== e2 ? a.addEventListener(b, c, { passive: e2 }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e2) {
  var f = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e2 || 8 === h.nodeType && h.parentNode === e2) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f, e3 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e3), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e3.window === e3 ? e3 : (h2 = e3.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e3);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e3) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e3);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e3);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e3);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e3), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c, e3), g2.push({ event: e3, listeners: d2 }), e3.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e2 = a, f = e2.stateNode;
    5 === e2.tag && null !== f && (e2 = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e2)), f = Kb(a, b), null != f && d.push(tf(a, f, e2)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e2) {
  for (var f = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e2 ? (k2 = Kb(c, f), null != k2 && g.unshift(tf(c, k2, h))) : e2 || (k2 = Kb(c, f), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e2 = c.nextSibling;
    a.removeChild(c);
    if (e2 && 8 === e2.nodeType) if (c = e2.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e2);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e2;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e2 = {}, f;
  for (f in c) e2[f] = b[f];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e2);
  return e2;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e2 in d) if (!(e2 in b)) throw Error(p(108, Ra(a) || "Unknown", e2));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e2) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e2;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e2 = 32 - oc(d) - 1;
  d &= ~(1 << e2);
  c += 1;
  var f = 32 - oc(b) + e2;
  if (30 < f) {
    var g = e2 - e2 % 5;
    f = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e2 -= g;
    rg = 1 << 32 - oc(b) + e2 | c << e2 | d;
    sg = f + a;
  } else rg = 1 << f | c << e2 | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
var Mg = Uf(null), Ng = null, Og = null, Pg = null;
function Qg() {
  Pg = Og = Ng = null;
}
function Rg(a) {
  var b = Mg.current;
  E(Mg);
  a._currentValue = b;
}
function Sg(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function Tg(a, b) {
  Ng = a;
  Pg = Og = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (Ug = true), a.firstContext = null);
}
function Vg(a) {
  var b = a._currentValue;
  if (Pg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Og) {
    if (null === Ng) throw Error(p(308));
    Og = a;
    Ng.dependencies = { lanes: 0, firstContext: a };
  } else Og = Og.next = a;
  return b;
}
var Wg = null;
function Xg(a) {
  null === Wg ? Wg = [a] : Wg.push(a);
}
function Yg(a, b, c, d) {
  var e2 = b.interleaved;
  null === e2 ? (c.next = c, Xg(b)) : (c.next = e2.next, e2.next = c);
  b.interleaved = c;
  return Zg(a, d);
}
function Zg(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var $g = false;
function ah(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function bh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function ch(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function dh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e2 = d.pending;
    null === e2 ? b.next = b : (b.next = e2.next, e2.next = b);
    d.pending = b;
    return Zg(a, c);
  }
  e2 = d.interleaved;
  null === e2 ? (b.next = b, Xg(d)) : (b.next = e2.next, e2.next = b);
  d.interleaved = b;
  return Zg(a, c);
}
function eh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function fh(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e2 = null, f = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f ? e2 = f = g : f = f.next = g;
        c = c.next;
      } while (null !== c);
      null === f ? e2 = f = b : f = f.next = b;
    } else e2 = f = b;
    c = { baseState: d.baseState, firstBaseUpdate: e2, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function gh(a, b, c, d) {
  var e2 = a.updateQueue;
  $g = false;
  var f = e2.firstBaseUpdate, g = e2.lastBaseUpdate, h = e2.shared.pending;
  if (null !== h) {
    e2.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f) {
    var q2 = e2.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              $g = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e2.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e2.baseState = k2;
    e2.firstBaseUpdate = l2;
    e2.lastBaseUpdate = m2;
    b = e2.shared.interleaved;
    if (null !== b) {
      e2 = b;
      do
        g |= e2.lane, e2 = e2.next;
      while (e2 !== b);
    } else null === f && (e2.shared.lanes = 0);
    hh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function ih(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e2 = d.callback;
    if (null !== e2) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e2) throw Error(p(191, e2));
      e2.call(d);
    }
  }
}
var jh = new aa.Component().refs;
function kh(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var nh = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = L(), e2 = lh(a), f = ch(d, e2);
  f.payload = b;
  void 0 !== c && null !== c && (f.callback = c);
  b = dh(a, f, e2);
  null !== b && (mh(b, a, e2, d), eh(b, a, e2));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = L(), e2 = lh(a), f = ch(d, e2);
  f.tag = 1;
  f.payload = b;
  void 0 !== c && null !== c && (f.callback = c);
  b = dh(a, f, e2);
  null !== b && (mh(b, a, e2, d), eh(b, a, e2));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = L(), d = lh(a), e2 = ch(c, d);
  e2.tag = 2;
  void 0 !== b && null !== b && (e2.callback = b);
  b = dh(a, e2, d);
  null !== b && (mh(b, a, d, c), eh(b, a, d));
} };
function oh(a, b, c, d, e2, f, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e2, f) : true;
}
function ph(a, b, c) {
  var d = false, e2 = Vf;
  var f = b.contextType;
  "object" === typeof f && null !== f ? f = Vg(f) : (e2 = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e2) : Vf);
  b = new b(c, f);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = nh;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e2, a.__reactInternalMemoizedMaskedChildContext = f);
  return b;
}
function qh(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && nh.enqueueReplaceState(b, b.state, null);
}
function rh(a, b, c, d) {
  var e2 = a.stateNode;
  e2.props = c;
  e2.state = a.memoizedState;
  e2.refs = jh;
  ah(a);
  var f = b.contextType;
  "object" === typeof f && null !== f ? e2.context = Vg(f) : (f = Zf(b) ? Xf : H.current, e2.context = Yf(a, f));
  e2.state = a.memoizedState;
  f = b.getDerivedStateFromProps;
  "function" === typeof f && (kh(a, b, f, c), e2.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b !== e2.state && nh.enqueueReplaceState(e2, e2.state, null), gh(a, c, e2, d), e2.state = a.memoizedState);
  "function" === typeof e2.componentDidMount && (a.flags |= 4194308);
}
function sh(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e2 = d, f = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
      b = function(a2) {
        var b2 = e2.refs;
        b2 === jh && (b2 = e2.refs = {});
        null === a2 ? delete b2[f] : b2[f] = a2;
      };
      b._stringRef = f;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function th(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function uh(a) {
  var b = a._init;
  return b(a._payload);
}
function vh(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e2(a2, b2) {
    a2 = wh(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = xh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e2(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f2 = c2.type;
    if (f2 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && uh(f2) === b2.type)) return d2 = e2(b2, c2.props), d2.ref = sh(a2, b2, c2), d2.return = a2, d2;
    d2 = yh(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = sh(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = zh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e2(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f2) {
    if (null === b2 || 7 !== b2.tag) return b2 = Ah(c2, a2.mode, d2, f2), b2.return = a2, b2;
    b2 = e2(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = xh("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = yh(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = sh(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = zh(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Ah(b2, a2.mode, c2, null), b2.return = a2, b2;
      th(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e3 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e3 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e3 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e3 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e3 = c2._init, r2(
            a2,
            b2,
            e3(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e3 ? null : m2(a2, b2, c2, d2, null);
      th(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e3) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e3);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e3);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e3);
        case Ha:
          var f2 = d2._init;
          return y2(a2, b2, c2, f2(d2._payload), e3);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e3, null);
      th(b2, d2);
    }
    return null;
  }
  function n2(e3, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e3, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e3, u2);
      g2 = f(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e3, u2), I && tg(e3, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e3, h2[w2], k3), null !== u2 && (g2 = f(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e3, w2);
      return l3;
    }
    for (u2 = d(e3, u2); w2 < h2.length; w2++) x2 = y2(u2, e3, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e3, a2);
    });
    I && tg(e3, w2);
    return l3;
  }
  function t2(e3, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e3, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e3, m3);
      g2 = f(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e3,
      m3
    ), I && tg(e3, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e3, n3.value, k3), null !== n3 && (g2 = f(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e3, w2);
      return l3;
    }
    for (m3 = d(e3, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e3, a2);
    });
    I && tg(e3, w2);
    return l3;
  }
  function J2(a2, d2, f2, h2) {
    "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
    if ("object" === typeof f2 && null !== f2) {
      switch (f2.$$typeof) {
        case va:
          a: {
            for (var k3 = f2.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f2.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e2(l3, f2.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && uh(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e2(l3, f2.props);
                  d2.ref = sh(a2, l3, f2);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f2.type === ya ? (d2 = Ah(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = yh(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = sh(a2, d2, f2), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f2.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                c(a2, d2.sibling);
                d2 = e2(d2, f2.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = zh(f2, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f2._init, J2(a2, d2, l3(f2._payload), h2);
      }
      if (eb(f2)) return n2(a2, d2, f2, h2);
      if (Ka(f2)) return t2(a2, d2, f2, h2);
      th(a2, f2);
    }
    return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e2(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = xh(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Bh = vh(true), Ch = vh(false), Dh = {}, Eh = Uf(Dh), Fh = Uf(Dh), Gh = Uf(Dh);
function Hh(a) {
  if (a === Dh) throw Error(p(174));
  return a;
}
function Ih(a, b) {
  G(Gh, b);
  G(Fh, a);
  G(Eh, Dh);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(Eh);
  G(Eh, b);
}
function Jh() {
  E(Eh);
  E(Fh);
  E(Gh);
}
function Kh(a) {
  Hh(Gh.current);
  var b = Hh(Eh.current);
  var c = lb(b, a.type);
  b !== c && (G(Fh, a), G(Eh, c));
}
function Lh(a) {
  Fh.current === a && (E(Eh), E(Fh));
}
var M = Uf(0);
function Mh(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Nh = [];
function Oh() {
  for (var a = 0; a < Nh.length; a++) Nh[a]._workInProgressVersionPrimary = null;
  Nh.length = 0;
}
var Ph = ua.ReactCurrentDispatcher, Qh = ua.ReactCurrentBatchConfig, Rh = 0, N = null, O = null, P = null, Sh = false, Th = false, Uh = 0, Vh = 0;
function Q() {
  throw Error(p(321));
}
function Wh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Xh(a, b, c, d, e2, f) {
  Rh = f;
  N = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Ph.current = null === a || null === a.memoizedState ? Yh : Zh;
  a = c(d, e2);
  if (Th) {
    f = 0;
    do {
      Th = false;
      Uh = 0;
      if (25 <= f) throw Error(p(301));
      f += 1;
      P = O = null;
      b.updateQueue = null;
      Ph.current = $h;
      a = c(d, e2);
    } while (Th);
  }
  Ph.current = ai;
  b = null !== O && null !== O.next;
  Rh = 0;
  P = O = N = null;
  Sh = false;
  if (b) throw Error(p(300));
  return a;
}
function bi() {
  var a = 0 !== Uh;
  Uh = 0;
  return a;
}
function ci() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === P ? N.memoizedState = P = a : P = P.next = a;
  return P;
}
function di() {
  if (null === O) {
    var a = N.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = O.next;
  var b = null === P ? N.memoizedState : P.next;
  if (null !== b) P = b, O = a;
  else {
    if (null === a) throw Error(p(310));
    O = a;
    a = { memoizedState: O.memoizedState, baseState: O.baseState, baseQueue: O.baseQueue, queue: O.queue, next: null };
    null === P ? N.memoizedState = P = a : P = P.next = a;
  }
  return P;
}
function ei(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function fi(a) {
  var b = di(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = O, e2 = d.baseQueue, f = c.pending;
  if (null !== f) {
    if (null !== e2) {
      var g = e2.next;
      e2.next = f.next;
      f.next = g;
    }
    d.baseQueue = e2 = f;
    c.pending = null;
  }
  if (null !== e2) {
    f = e2.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f;
    do {
      var m2 = l2.lane;
      if ((Rh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        N.lanes |= m2;
        hh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (Ug = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e2 = a;
    do
      f = e2.lane, N.lanes |= f, hh |= f, e2 = e2.next;
    while (e2 !== a);
  } else null === e2 && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function gi(a) {
  var b = di(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e2 = c.pending, f = b.memoizedState;
  if (null !== e2) {
    c.pending = null;
    var g = e2 = e2.next;
    do
      f = a(f, g.action), g = g.next;
    while (g !== e2);
    He(f, b.memoizedState) || (Ug = true);
    b.memoizedState = f;
    null === b.baseQueue && (b.baseState = f);
    c.lastRenderedState = f;
  }
  return [f, d];
}
function hi() {
}
function ii(a, b) {
  var c = N, d = di(), e2 = b(), f = !He(d.memoizedState, e2);
  f && (d.memoizedState = e2, Ug = true);
  d = d.queue;
  ji(ki.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f || null !== P && P.memoizedState.tag & 1) {
    c.flags |= 2048;
    li(9, mi.bind(null, c, d, e2, b), void 0, null);
    if (null === R) throw Error(p(349));
    0 !== (Rh & 30) || ni(c, b, e2);
  }
  return e2;
}
function ni(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = N.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function mi(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  oi(b) && pi(a);
}
function ki(a, b, c) {
  return c(function() {
    oi(b) && pi(a);
  });
}
function oi(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function pi(a) {
  var b = Zg(a, 1);
  null !== b && mh(b, a, 1, -1);
}
function qi(a) {
  var b = ci();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ei, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ri.bind(null, N, a);
  return [b.memoizedState, a];
}
function li(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = N.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function si() {
  return di().memoizedState;
}
function ti(a, b, c, d) {
  var e2 = ci();
  N.flags |= a;
  e2.memoizedState = li(1 | b, c, void 0, void 0 === d ? null : d);
}
function ui(a, b, c, d) {
  var e2 = di();
  d = void 0 === d ? null : d;
  var f = void 0;
  if (null !== O) {
    var g = O.memoizedState;
    f = g.destroy;
    if (null !== d && Wh(d, g.deps)) {
      e2.memoizedState = li(b, c, f, d);
      return;
    }
  }
  N.flags |= a;
  e2.memoizedState = li(1 | b, c, f, d);
}
function vi(a, b) {
  return ti(8390656, 8, a, b);
}
function ji(a, b) {
  return ui(2048, 8, a, b);
}
function wi(a, b) {
  return ui(4, 2, a, b);
}
function xi(a, b) {
  return ui(4, 4, a, b);
}
function yi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function zi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ui(4, 4, yi.bind(null, b, a), c);
}
function Ai() {
}
function Bi(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function Ci(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function Di(a, b, c) {
  if (0 === (Rh & 21)) return a.baseState && (a.baseState = false, Ug = true), a.memoizedState = c;
  He(c, b) || (c = yc(), N.lanes |= c, hh |= c, a.baseState = true);
  return b;
}
function Ei(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Qh.transition;
  Qh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Qh.transition = d;
  }
}
function Fi() {
  return di().memoizedState;
}
function Gi(a, b, c) {
  var d = lh(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a)) Ii(b, c);
  else if (c = Yg(a, b, c, d), null !== c) {
    var e2 = L();
    mh(c, a, d, e2);
    Ji(c, b, d);
  }
}
function ri(a, b, c) {
  var d = lh(a), e2 = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a)) Ii(b, e2);
  else {
    var f = a.alternate;
    if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
      var g = b.lastRenderedState, h = f(g, c);
      e2.hasEagerState = true;
      e2.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e2.next = e2, Xg(b)) : (e2.next = k2.next, k2.next = e2);
        b.interleaved = e2;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = Yg(a, b, e2, d);
    null !== c && (e2 = L(), mh(c, a, d, e2), Ji(c, b, d));
  }
}
function Hi(a) {
  var b = a.alternate;
  return a === N || null !== b && b === N;
}
function Ii(a, b) {
  Th = Sh = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Ji(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var ai = { readContext: Vg, useCallback: Q, useContext: Q, useEffect: Q, useImperativeHandle: Q, useInsertionEffect: Q, useLayoutEffect: Q, useMemo: Q, useReducer: Q, useRef: Q, useState: Q, useDebugValue: Q, useDeferredValue: Q, useTransition: Q, useMutableSource: Q, useSyncExternalStore: Q, useId: Q, unstable_isNewReconciler: false }, Yh = { readContext: Vg, useCallback: function(a, b) {
  ci().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: Vg, useEffect: vi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ti(
    4194308,
    4,
    yi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ti(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ti(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = ci();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = ci();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = Gi.bind(null, N, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = ci();
  a = { current: a };
  return b.memoizedState = a;
}, useState: qi, useDebugValue: Ai, useDeferredValue: function(a) {
  return ci().memoizedState = a;
}, useTransition: function() {
  var a = qi(false), b = a[0];
  a = Ei.bind(null, a[1]);
  ci().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = N, e2 = ci();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === R) throw Error(p(349));
    0 !== (Rh & 30) || ni(d, b, c);
  }
  e2.memoizedState = c;
  var f = { value: c, getSnapshot: b };
  e2.queue = f;
  vi(ki.bind(
    null,
    d,
    f,
    a
  ), [a]);
  d.flags |= 2048;
  li(9, mi.bind(null, d, f, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = ci(), b = R.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Uh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Vh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Zh = {
  readContext: Vg,
  useCallback: Bi,
  useContext: Vg,
  useEffect: ji,
  useImperativeHandle: zi,
  useInsertionEffect: wi,
  useLayoutEffect: xi,
  useMemo: Ci,
  useReducer: fi,
  useRef: si,
  useState: function() {
    return fi(ei);
  },
  useDebugValue: Ai,
  useDeferredValue: function(a) {
    var b = di();
    return Di(b, O.memoizedState, a);
  },
  useTransition: function() {
    var a = fi(ei)[0], b = di().memoizedState;
    return [a, b];
  },
  useMutableSource: hi,
  useSyncExternalStore: ii,
  useId: Fi,
  unstable_isNewReconciler: false
}, $h = { readContext: Vg, useCallback: Bi, useContext: Vg, useEffect: ji, useImperativeHandle: zi, useInsertionEffect: wi, useLayoutEffect: xi, useMemo: Ci, useReducer: gi, useRef: si, useState: function() {
  return gi(ei);
}, useDebugValue: Ai, useDeferredValue: function(a) {
  var b = di();
  return null === O ? b.memoizedState = a : Di(b, O.memoizedState, a);
}, useTransition: function() {
  var a = gi(ei)[0], b = di().memoizedState;
  return [a, b];
}, useMutableSource: hi, useSyncExternalStore: ii, useId: Fi, unstable_isNewReconciler: false };
function Ki(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e2 = c;
  } catch (f) {
    e2 = "\nError generating stack: " + f.message + "\n" + f.stack;
  }
  return { value: a, source: b, stack: e2, digest: null };
}
function Li(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Mi(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Ni = "function" === typeof WeakMap ? WeakMap : Map;
function Oi(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Pi || (Pi = true, Qi = d);
    Mi(a, b);
  };
  return c;
}
function Ri(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e2 = b.value;
    c.payload = function() {
      return d(e2);
    };
    c.callback = function() {
      Mi(a, b);
    };
  }
  var f = a.stateNode;
  null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
    Mi(a, b);
    "function" !== typeof d && (null === Si ? Si = /* @__PURE__ */ new Set([this]) : Si.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Ti(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Ni();
    var e2 = /* @__PURE__ */ new Set();
    d.set(b, e2);
  } else e2 = d.get(b), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d.set(b, e2));
  e2.has(c) || (e2.add(c), a = Ui.bind(null, a, b, c), b.then(a, a));
}
function Vi(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Wi(a, b, c, d, e2) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = ch(-1, 1), b.tag = 2, dh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e2;
  return a;
}
var Xi = ua.ReactCurrentOwner, Ug = false;
function Yi(a, b, c, d) {
  b.child = null === a ? Ch(b, null, c, d) : Bh(b, a.child, c, d);
}
function Zi(a, b, c, d, e2) {
  c = c.render;
  var f = b.ref;
  Tg(b, e2);
  d = Xh(a, b, c, d, f, e2);
  c = bi();
  if (null !== a && !Ug) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e2, $i(a, b, e2);
  I && c && vg(b);
  b.flags |= 1;
  Yi(a, b, d, e2);
  return b.child;
}
function aj(a, b, c, d, e2) {
  if (null === a) {
    var f = c.type;
    if ("function" === typeof f && !bj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, cj(a, b, f, d, e2);
    a = yh(c.type, null, d, b, b.mode, e2);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f = a.child;
  if (0 === (a.lanes & e2)) {
    var g = f.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return $i(a, b, e2);
  }
  b.flags |= 1;
  a = wh(f, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function cj(a, b, c, d, e2) {
  if (null !== a) {
    var f = a.memoizedProps;
    if (Ie(f, d) && a.ref === b.ref) if (Ug = false, b.pendingProps = d = f, 0 !== (a.lanes & e2)) 0 !== (a.flags & 131072) && (Ug = true);
    else return b.lanes = a.lanes, $i(a, b, e2);
  }
  return dj(a, b, c, d, e2);
}
function ej(a, b, c) {
  var d = b.pendingProps, e2 = d.children, f = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(fj, gj), gj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(fj, gj), gj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f ? f.baseLanes : c;
    G(fj, gj);
    gj |= d;
  }
  else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(fj, gj), gj |= d;
  Yi(a, b, e2, c);
  return b.child;
}
function hj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function dj(a, b, c, d, e2) {
  var f = Zf(c) ? Xf : H.current;
  f = Yf(b, f);
  Tg(b, e2);
  c = Xh(a, b, c, d, f, e2);
  d = bi();
  if (null !== a && !Ug) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e2, $i(a, b, e2);
  I && d && vg(b);
  b.flags |= 1;
  Yi(a, b, c, e2);
  return b.child;
}
function ij(a, b, c, d, e2) {
  if (Zf(c)) {
    var f = true;
    cg(b);
  } else f = false;
  Tg(b, e2);
  if (null === b.stateNode) jj(a, b), ph(b, c, d), rh(b, c, d, e2), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = Vg(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && qh(b, g, d, l2);
    $g = false;
    var r2 = b.memoizedState;
    g.state = r2;
    gh(b, d, g, e2);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || $g ? ("function" === typeof m2 && (kh(b, c, m2, d), k2 = b.memoizedState), (h = $g || oh(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    bh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Lg(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = Vg(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && qh(b, g, d, k2);
    $g = false;
    r2 = b.memoizedState;
    g.state = r2;
    gh(b, d, g, e2);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || $g ? ("function" === typeof y2 && (kh(b, c, y2, d), n2 = b.memoizedState), (l2 = $g || oh(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return kj(a, b, c, d, f, e2);
}
function kj(a, b, c, d, e2, f) {
  hj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e2 && dg(b, c, false), $i(a, b, f);
  d = b.stateNode;
  Xi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Bh(b, a.child, null, f), b.child = Bh(b, null, h, f)) : Yi(a, b, h, f);
  b.memoizedState = d.state;
  e2 && dg(b, c, true);
  return b.child;
}
function lj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  Ih(a, b.containerInfo);
}
function mj(a, b, c, d, e2) {
  Ig();
  Jg(e2);
  b.flags |= 256;
  Yi(a, b, c, d);
  return b.child;
}
var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
function oj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function pj(a, b, c) {
  var d = b.pendingProps, e2 = M.current, f = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e2 & 2));
  if (h) f = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e2 |= 1;
  G(M, e2 & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = qj(g, d, 0, null), a = Ah(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = oj(c), b.memoizedState = nj, a) : rj(b, g);
  }
  e2 = a.memoizedState;
  if (null !== e2 && (h = e2.dehydrated, null !== h)) return sj(a, b, g, d, h, e2, c);
  if (f) {
    f = d.fallback;
    g = b.mode;
    e2 = a.child;
    h = e2.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e2 ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = wh(e2, k2), d.subtreeFlags = e2.subtreeFlags & 14680064);
    null !== h ? f = wh(h, f) : (f = Ah(f, g, c, null), f.flags |= 2);
    f.return = b;
    d.return = b;
    d.sibling = f;
    b.child = d;
    d = f;
    f = b.child;
    g = a.child.memoizedState;
    g = null === g ? oj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f.memoizedState = g;
    f.childLanes = a.childLanes & ~c;
    b.memoizedState = nj;
    return d;
  }
  f = a.child;
  a = f.sibling;
  d = wh(f, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function rj(a, b) {
  b = qj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function tj(a, b, c, d) {
  null !== d && Jg(d);
  Bh(b, a.child, null, c);
  a = rj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function sj(a, b, c, d, e2, f, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Li(Error(p(422))), tj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f = d.fallback;
    e2 = b.mode;
    d = qj({ mode: "visible", children: d.children }, e2, 0, null);
    f = Ah(f, e2, g, null);
    f.flags |= 2;
    d.return = b;
    f.return = b;
    d.sibling = f;
    b.child = d;
    0 !== (b.mode & 1) && Bh(b, a.child, null, g);
    b.child.memoizedState = oj(g);
    b.memoizedState = nj;
    return f;
  }
  if (0 === (b.mode & 1)) return tj(a, b, g, null);
  if ("$!" === e2.data) {
    d = e2.nextSibling && e2.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f = Error(p(419));
    d = Li(f, d, void 0);
    return tj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (Ug || h) {
    d = R;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e2 = 2;
          break;
        case 16:
          e2 = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e2 = 32;
          break;
        case 536870912:
          e2 = 268435456;
          break;
        default:
          e2 = 0;
      }
      e2 = 0 !== (e2 & (d.suspendedLanes | g)) ? 0 : e2;
      0 !== e2 && e2 !== f.retryLane && (f.retryLane = e2, Zg(a, e2), mh(d, a, e2, -1));
    }
    uj();
    d = Li(Error(p(421)));
    return tj(a, b, g, d);
  }
  if ("$?" === e2.data) return b.flags |= 128, b.child = a.child, b = vj.bind(null, a), e2._reactRetry = b, null;
  a = f.treeContext;
  yg = Lf(e2.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = rj(b, d.children);
  b.flags |= 4096;
  return b;
}
function wj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  Sg(a.return, b, c);
}
function xj(a, b, c, d, e2) {
  var f = a.memoizedState;
  null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e2 } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e2);
}
function yj(a, b, c) {
  var d = b.pendingProps, e2 = d.revealOrder, f = d.tail;
  Yi(a, b, d.children, c);
  d = M.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && wj(a, c, b);
      else if (19 === a.tag) wj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(M, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e2) {
    case "forwards":
      c = b.child;
      for (e2 = null; null !== c; ) a = c.alternate, null !== a && null === Mh(a) && (e2 = c), c = c.sibling;
      c = e2;
      null === c ? (e2 = b.child, b.child = null) : (e2 = c.sibling, c.sibling = null);
      xj(b, false, e2, c, f);
      break;
    case "backwards":
      c = null;
      e2 = b.child;
      for (b.child = null; null !== e2; ) {
        a = e2.alternate;
        if (null !== a && null === Mh(a)) {
          b.child = e2;
          break;
        }
        a = e2.sibling;
        e2.sibling = c;
        c = e2;
        e2 = a;
      }
      xj(b, true, c, null, f);
      break;
    case "together":
      xj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function jj(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function $i(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  hh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = wh(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = wh(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function zj(a, b, c) {
  switch (b.tag) {
    case 3:
      lj(b);
      Ig();
      break;
    case 5:
      Kh(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      Ih(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e2 = b.memoizedProps.value;
      G(Mg, d._currentValue);
      d._currentValue = e2;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(M, M.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return pj(a, b, c);
        G(M, M.current & 1);
        a = $i(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(M, M.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return yj(a, b, c);
        b.flags |= 128;
      }
      e2 = b.memoizedState;
      null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
      G(M, M.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, ej(a, b, c);
  }
  return $i(a, b, c);
}
var Aj, Bj, Cj, Dj;
Aj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Bj = function() {
};
Cj = function(a, b, c, d) {
  var e2 = a.memoizedProps;
  if (e2 !== d) {
    a = b.stateNode;
    Hh(Eh.current);
    var f = null;
    switch (c) {
      case "input":
        e2 = Ya(a, e2);
        d = Ya(a, d);
        f = [];
        break;
      case "select":
        e2 = A({}, e2, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f = [];
        break;
      case "textarea":
        e2 = gb(a, e2);
        d = gb(a, d);
        f = [];
        break;
      default:
        "function" !== typeof e2.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e2) if (!d.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2]) if ("style" === l2) {
      var h = e2[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f || (f = []) : (f = f || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e2 ? e2[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f || (f = []), f.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f = f || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f = f || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f || h === k2 || (f = [])) : (f = f || []).push(l2, k2));
    }
    c && (f = f || []).push("style", c);
    var l2 = f;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Dj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Ej(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e2 = a.child; null !== e2; ) c |= e2.lanes | e2.childLanes, d |= e2.subtreeFlags & 14680064, d |= e2.flags & 14680064, e2.return = a, e2 = e2.sibling;
  else for (e2 = a.child; null !== e2; ) c |= e2.lanes | e2.childLanes, d |= e2.subtreeFlags, d |= e2.flags, e2.return = a, e2 = e2.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Fj(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      Jh();
      E(Wf);
      E(H);
      Oh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Gj(zg), zg = null));
      Bj(a, b);
      S(b);
      return null;
    case 5:
      Lh(b);
      var e2 = Hh(Gh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Cj(a, b, c, d, e2), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e2 = 0; e2 < lf.length; e2++) D(lf[e2], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f), D("invalid", d);
          }
          ub(c, f);
          e2 = null;
          for (var g in f) if (f.hasOwnProperty(g)) {
            var h = f[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e2 = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e2 = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f.onClick && (d.onclick = Bf);
          }
          d = e2;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e2.nodeType ? e2 : e2.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          Aj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e2 = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e2 = d;
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++) D(lf[e2], a);
                e2 = d;
                break;
              case "source":
                D("error", a);
                e2 = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e2 = d;
                break;
              case "details":
                D("toggle", a);
                e2 = d;
                break;
              case "input":
                Za(a, d);
                e2 = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e2 = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e2 = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e2 = gb(a, d);
                D("invalid", a);
                break;
              default:
                e2 = d;
            }
            ub(c, e2);
            h = e2;
            for (f in h) if (h.hasOwnProperty(f)) {
              var k2 = h[f];
              "style" === f ? sb(a, k2) : "dangerouslySetInnerHTML" === f ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k2 && "onScroll" === f && D("scroll", a) : null != k2 && ta(a, f, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f = d.value;
                null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e2.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Dj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = Hh(Gh.current);
        Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(M);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
        else if (f = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f) throw Error(p(318));
            f = b.memoizedState;
            f = null !== f ? f.dehydrated : null;
            if (!f) throw Error(p(317));
            f[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f = false;
        } else null !== zg && (Gj(zg), zg = null), f = true;
        if (!f) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (M.current & 1) ? 0 === T && (T = 3) : uj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return Jh(), Bj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return Rg(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(M);
      f = b.memoizedState;
      if (null === f) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f.rendering;
      if (null === g) if (d) Ej(f, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Mh(a);
          if (null !== g) {
            b.flags |= 128;
            Ej(f, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(M, M.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f.tail && B() > Hj && (b.flags |= 128, d = true, Ej(f, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Mh(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Ej(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f.renderingStartTime > Hj && 1073741824 !== c && (b.flags |= 128, d = true, Ej(f, false), b.lanes = 4194304);
        f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
      }
      if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = M.current, G(M, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Ij(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (gj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Jj(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return Jh(), E(Wf), E(H), Oh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Lh(b), null;
    case 13:
      E(M);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(M), null;
    case 4:
      return Jh(), null;
    case 10:
      return Rg(b.type._context), null;
    case 22:
    case 23:
      return Ij(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Kj = false, U = false, Lj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Mj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Nj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Oj = false;
function Pj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e2 = d.anchorOffset, f = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e2 && 3 !== q2.nodeType || (h = g + e2);
            q2 !== f || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e2 && (h = g);
            r2 === f && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Lg(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Oj;
  Oj = false;
  return n2;
}
function Qj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e2 = d = d.next;
    do {
      if ((e2.tag & a) === a) {
        var f = e2.destroy;
        e2.destroy = void 0;
        void 0 !== f && Nj(b, c, f);
      }
      e2 = e2.next;
    } while (e2 !== d);
  }
}
function Rj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Sj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Tj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Tj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Uj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Vj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Uj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
function Xj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Xj(a, b, c), a = a.sibling; null !== a; ) Xj(a, b, c), a = a.sibling;
}
var X = null, Yj = false;
function Zj(a, b, c) {
  for (c = c.child; null !== c; ) ak(a, b, c), c = c.sibling;
}
function ak(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Mj(c, b);
    case 6:
      var d = X, e2 = Yj;
      X = null;
      Zj(a, b, c);
      X = d;
      Yj = e2;
      null !== X && (Yj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Yj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e2 = Yj;
      X = c.stateNode.containerInfo;
      Yj = true;
      Zj(a, b, c);
      X = d;
      Yj = e2;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e2 = d = d.next;
        do {
          var f = e2, g = f.destroy;
          f = f.tag;
          void 0 !== g && (0 !== (f & 2) ? Nj(c, b, g) : 0 !== (f & 4) && Nj(c, b, g));
          e2 = e2.next;
        } while (e2 !== d);
      }
      Zj(a, b, c);
      break;
    case 1:
      if (!U && (Mj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Zj(a, b, c);
      break;
    case 21:
      Zj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Zj(a, b, c), U = d) : Zj(a, b, c);
      break;
    default:
      Zj(a, b, c);
  }
}
function bk(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Lj());
    b.forEach(function(b2) {
      var d = ck.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function dk(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e2 = c[d];
    try {
      var f = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Yj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Yj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Yj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      ak(f, g, e2);
      X = null;
      Yj = false;
      var k2 = e2.alternate;
      null !== k2 && (k2.return = null);
      e2.return = null;
    } catch (l2) {
      W(e2, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) ek(b, a), b = b.sibling;
}
function ek(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      dk(b, a);
      fk(a);
      if (d & 4) {
        try {
          Qj(3, a, a.return), Rj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Qj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      break;
    case 5:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      if (a.flags & 32) {
        var e2 = a.stateNode;
        try {
          ob(e2, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e2 = a.stateNode, null != e2)) {
        var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f.type && null != f.name && ab(e2, f);
          vb(h, g);
          var l2 = vb(h, f);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e2, f);
              break;
            case "textarea":
              ib(e2, f);
              break;
            case "select":
              var r2 = e2._wrapperState.wasMultiple;
              e2._wrapperState.wasMultiple = !!f.multiple;
              var y2 = f.value;
              null != y2 ? fb(e2, !!f.multiple, y2, false) : r2 !== !!f.multiple && (null != f.defaultValue ? fb(
                e2,
                !!f.multiple,
                f.defaultValue,
                true
              ) : fb(e2, !!f.multiple, f.multiple ? [] : "", false));
          }
          e2[Pf] = f;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      dk(b, a);
      fk(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e2 = a.stateNode;
        f = a.memoizedProps;
        try {
          e2.nodeValue = f;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      dk(b, a);
      fk(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      dk(b, a);
      fk(a);
      break;
    case 13:
      dk(b, a);
      fk(a);
      e2 = a.child;
      e2.flags & 8192 && (f = null !== e2.memoizedState, e2.stateNode.isHidden = f, !f || null !== e2.alternate && null !== e2.alternate.memoizedState || (gk = B()));
      d & 4 && bk(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, dk(b, a), U = l2) : dk(b, a);
      fk(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Qj(4, r2, r2.return);
                break;
              case 1:
                Mj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Mj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  hk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : hk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e2 = q2.stateNode, l2 ? (f = e2.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      dk(b, a);
      fk(a);
      d & 4 && bk(a);
      break;
    case 21:
      break;
    default:
      dk(
        b,
        a
      ), fk(a);
  }
}
function fk(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Uj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e2 = d.stateNode;
          d.flags & 32 && (ob(e2, ""), d.flags &= -33);
          var f = Vj(a);
          Xj(a, f, e2);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Vj(a);
          Wj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function ik(a, b, c) {
  V = a;
  jk(a);
}
function jk(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e2 = V, f = e2.child;
    if (22 === e2.tag && d) {
      var g = null !== e2.memoizedState || Kj;
      if (!g) {
        var h = e2.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Kj;
        var l2 = U;
        Kj = g;
        if ((U = k2) && !l2) for (V = e2; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? kk(e2) : null !== k2 ? (k2.return = g, V = k2) : kk(e2);
        for (; null !== f; ) V = f, jk(f), f = f.sibling;
        V = e2;
        Kj = h;
        U = l2;
      }
      lk(a);
    } else 0 !== (e2.subtreeFlags & 8772) && null !== f ? (f.return = e2, V = f) : lk(a);
  }
}
function lk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Rj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e2 = b.elementType === b.type ? c.memoizedProps : Lg(b.type, c.memoizedProps);
              d.componentDidUpdate(e2, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f = b.updateQueue;
            null !== f && ih(b, f, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              ih(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Sj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function hk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Rj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e2 = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e2, k2);
            }
          }
          var f = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W(b, f, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var mk = Math.ceil, nk = ua.ReactCurrentDispatcher, ok = ua.ReactCurrentOwner, pk = ua.ReactCurrentBatchConfig, K = 0, R = null, Y = null, Z = 0, gj = 0, fj = Uf(0), T = 0, qk = null, hh = 0, rk = 0, sk = 0, tk = null, uk = null, gk = 0, Hj = Infinity, vk = null, Pi = false, Qi = null, Si = null, wk = false, xk = null, yk = 0, zk = 0, Ak = null, Bk = -1, Ck = 0;
function L() {
  return 0 !== (K & 6) ? B() : -1 !== Bk ? Bk : Bk = B();
}
function lh(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Ck && (Ck = yc()), Ck;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function mh(a, b, c, d) {
  if (50 < zk) throw zk = 0, Ak = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== R) a === R && (0 === (K & 2) && (rk |= c), 4 === T && Dk(a, Z)), Ek(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Hj = B() + 500, fg && jg());
}
function Ek(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === R ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Fk.bind(null, a)) : hg(Fk.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Gk(c, Hk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Hk(a, b) {
  Bk = -1;
  Ck = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Ik() && a.callbackNode !== c) return null;
  var d = uc(a, a === R ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Jk(a, d);
  else {
    b = d;
    var e2 = K;
    K |= 2;
    var f = Kk();
    if (R !== a || Z !== b) vk = null, Hj = B() + 500, Lk(a, b);
    do
      try {
        Mk();
        break;
      } catch (h) {
        Nk(a, h);
      }
    while (1);
    Qg();
    nk.current = f;
    K = e2;
    null !== Y ? b = 0 : (R = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e2 = xc(a), 0 !== e2 && (d = e2, b = Ok(a, e2)));
    if (1 === b) throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B()), c;
    if (6 === b) Dk(a, d);
    else {
      e2 = a.current.alternate;
      if (0 === (d & 30) && !Pk(e2) && (b = Jk(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Ok(a, f))), 1 === b)) throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B()), c;
      a.finishedWork = e2;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Qk(a, uk, vk);
          break;
        case 3:
          Dk(a, d);
          if ((d & 130023424) === d && (b = gk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e2 = a.suspendedLanes;
            if ((e2 & d) !== d) {
              L();
              a.pingedLanes |= a.suspendedLanes & e2;
              break;
            }
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), b);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 4:
          Dk(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e2 = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f = 1 << g;
            g = b[g];
            g > e2 && (e2 = g);
            d &= ~f;
          }
          d = e2;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * mk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), d);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 5:
          Qk(a, uk, vk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Ek(a, B());
  return a.callbackNode === c ? Hk.bind(null, a) : null;
}
function Ok(a, b) {
  var c = tk;
  a.current.memoizedState.isDehydrated && (Lk(a, b).flags |= 256);
  a = Jk(a, b);
  2 !== a && (b = uk, uk = c, null !== b && Gj(b));
  return a;
}
function Gj(a) {
  null === uk ? uk = a : uk.push.apply(uk, a);
}
function Pk(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e2 = c[d], f = e2.getSnapshot;
        e2 = e2.value;
        try {
          if (!He(f(), e2)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Dk(a, b) {
  b &= ~sk;
  b &= ~rk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Fk(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Ik();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Ek(a, B()), null;
  var c = Jk(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Ok(a, d));
  }
  if (1 === c) throw c = qk, Lk(a, 0), Dk(a, b), Ek(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Qk(a, uk, vk);
  Ek(a, B());
  return null;
}
function Rk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Hj = B() + 500, fg && jg());
  }
}
function Sk(a) {
  null !== xk && 0 === xk.tag && 0 === (K & 6) && Ik();
  var b = K;
  K |= 1;
  var c = pk.transition, d = C;
  try {
    if (pk.transition = null, C = 1, a) return a();
  } finally {
    C = d, pk.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Ij() {
  gj = fj.current;
  E(fj);
}
function Lk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        Jh();
        E(Wf);
        E(H);
        Oh();
        break;
      case 5:
        Lh(d);
        break;
      case 4:
        Jh();
        break;
      case 13:
        E(M);
        break;
      case 19:
        E(M);
        break;
      case 10:
        Rg(d.type._context);
        break;
      case 22:
      case 23:
        Ij();
    }
    c = c.return;
  }
  R = a;
  Y = a = wh(a.current, null);
  Z = gj = b;
  T = 0;
  qk = null;
  sk = rk = hh = 0;
  uk = tk = null;
  if (null !== Wg) {
    for (b = 0; b < Wg.length; b++) if (c = Wg[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e2 = d.next, f = c.pending;
      if (null !== f) {
        var g = f.next;
        f.next = e2;
        d.next = g;
      }
      c.pending = d;
    }
    Wg = null;
  }
  return a;
}
function Nk(a, b) {
  do {
    var c = Y;
    try {
      Qg();
      Ph.current = ai;
      if (Sh) {
        for (var d = N.memoizedState; null !== d; ) {
          var e2 = d.queue;
          null !== e2 && (e2.pending = null);
          d = d.next;
        }
        Sh = false;
      }
      Rh = 0;
      P = O = N = null;
      Th = false;
      Uh = 0;
      ok.current = null;
      if (null === c || null === c.return) {
        T = 1;
        qk = b;
        Y = null;
        break;
      }
      a: {
        var f = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Vi(g);
          if (null !== y2) {
            y2.flags &= -257;
            Wi(y2, g, h, f, b);
            y2.mode & 1 && Ti(f, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Ti(f, l2, b);
              uj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Vi(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Wi(J2, g, h, f, b);
            Jg(Ki(k2, h));
            break a;
          }
        }
        f = k2 = Ki(k2, h);
        4 !== T && (T = 2);
        null === tk ? tk = [f] : tk.push(f);
        f = g;
        do {
          switch (f.tag) {
            case 3:
              f.flags |= 65536;
              b &= -b;
              f.lanes |= b;
              var x2 = Oi(f, k2, b);
              fh(f, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f.type, u2 = f.stateNode;
              if (0 === (f.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Si || !Si.has(u2)))) {
                f.flags |= 65536;
                b &= -b;
                f.lanes |= b;
                var F2 = Ri(f, h, b);
                fh(f, F2);
                break a;
              }
          }
          f = f.return;
        } while (null !== f);
      }
      Tk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Kk() {
  var a = nk.current;
  nk.current = ai;
  return null === a ? ai : a;
}
function uj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === R || 0 === (hh & 268435455) && 0 === (rk & 268435455) || Dk(R, Z);
}
function Jk(a, b) {
  var c = K;
  K |= 2;
  var d = Kk();
  if (R !== a || Z !== b) vk = null, Lk(a, b);
  do
    try {
      Uk();
      break;
    } catch (e2) {
      Nk(a, e2);
    }
  while (1);
  Qg();
  K = c;
  nk.current = d;
  if (null !== Y) throw Error(p(261));
  R = null;
  Z = 0;
  return T;
}
function Uk() {
  for (; null !== Y; ) Vk(Y);
}
function Mk() {
  for (; null !== Y && !cc(); ) Vk(Y);
}
function Vk(a) {
  var b = Wk(a.alternate, a, gj);
  a.memoizedProps = a.pendingProps;
  null === b ? Tk(a) : Y = b;
  ok.current = null;
}
function Tk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Fj(c, b, gj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Jj(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Qk(a, b, c) {
  var d = C, e2 = pk.transition;
  try {
    pk.transition = null, C = 1, Xk(a, b, c, d);
  } finally {
    pk.transition = e2, C = d;
  }
  return null;
}
function Xk(a, b, c, d) {
  do
    Ik();
  while (null !== xk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e2 = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f = c.lanes | c.childLanes;
  Bc(a, f);
  a === R && (Y = R = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || wk || (wk = true, Gk(hc, function() {
    Ik();
    return null;
  }));
  f = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f) {
    f = pk.transition;
    pk.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    ok.current = null;
    Pj(a, c);
    ek(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    ik(c);
    dc();
    K = h;
    C = g;
    pk.transition = f;
  } else a.current = c;
  wk && (wk = false, xk = a, yk = e2);
  f = a.pendingLanes;
  0 === f && (Si = null);
  mc(c.stateNode);
  Ek(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e2 = b[c], d(e2.value, { componentStack: e2.stack, digest: e2.digest });
  if (Pi) throw Pi = false, a = Qi, Qi = null, a;
  0 !== (yk & 1) && 0 !== a.tag && Ik();
  f = a.pendingLanes;
  0 !== (f & 1) ? a === Ak ? zk++ : (zk = 0, Ak = a) : zk = 0;
  jg();
  return null;
}
function Ik() {
  if (null !== xk) {
    var a = Dc(yk), b = pk.transition, c = C;
    try {
      pk.transition = null;
      C = 16 > a ? 16 : a;
      if (null === xk) var d = false;
      else {
        a = xk;
        xk = null;
        yk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e2 = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f = V, g = f.child;
          if (0 !== (V.flags & 16)) {
            var h = f.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(8, m2, f);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Tj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f;
            }
          }
          if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
          else b: for (; null !== V; ) {
            f = V;
            if (0 !== (f.flags & 2048)) switch (f.tag) {
              case 0:
              case 11:
              case 15:
                Qj(9, f, f.return);
            }
            var x2 = f.sibling;
            if (null !== x2) {
              x2.return = f.return;
              V = x2;
              break b;
            }
            V = f.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Rj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e2;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, pk.transition = b;
    }
  }
  return false;
}
function Yk(a, b, c) {
  b = Ki(c, b);
  b = Oi(a, b, 1);
  a = dh(a, b, 1);
  b = L();
  null !== a && (Ac(a, 1, b), Ek(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Yk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Yk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Si || !Si.has(d))) {
        a = Ki(c, a);
        a = Ri(b, a, 1);
        b = dh(b, a, 1);
        a = L();
        null !== b && (Ac(b, 1, a), Ek(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ui(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = L();
  a.pingedLanes |= a.suspendedLanes & c;
  R === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - gk ? Lk(a, 0) : sk |= c);
  Ek(a, b);
}
function Zk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = L();
  a = Zg(a, b);
  null !== a && (Ac(a, b, c), Ek(a, c));
}
function vj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Zk(a, c);
}
function ck(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e2 = a.memoizedState;
      null !== e2 && (c = e2.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Zk(a, c);
}
var Wk;
Wk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) Ug = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return Ug = false, zj(a, b, c);
    Ug = 0 !== (a.flags & 131072) ? true : false;
  }
  else Ug = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      jj(a, b);
      a = b.pendingProps;
      var e2 = Yf(b, H.current);
      Tg(b, c);
      e2 = Xh(null, b, d, a, e2, c);
      var f = bi();
      b.flags |= 1;
      "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, ah(b), e2.updater = nh, b.stateNode = e2, e2._reactInternals = b, rh(b, d, a, c), b = kj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Yi(null, b, e2, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        jj(a, b);
        a = b.pendingProps;
        e2 = d._init;
        d = e2(d._payload);
        b.type = d;
        e2 = b.tag = $k(d);
        a = Lg(d, a);
        switch (e2) {
          case 0:
            b = dj(null, b, d, a, c);
            break a;
          case 1:
            b = ij(null, b, d, a, c);
            break a;
          case 11:
            b = Zi(null, b, d, a, c);
            break a;
          case 14:
            b = aj(null, b, d, Lg(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), dj(a, b, d, e2, c);
    case 1:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), ij(a, b, d, e2, c);
    case 3:
      a: {
        lj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f = b.memoizedState;
        e2 = f.element;
        bh(a, b);
        gh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
          e2 = Ki(Error(p(423)), b);
          b = mj(a, b, d, c, e2);
          break a;
        } else if (d !== e2) {
          e2 = Ki(Error(p(424)), b);
          b = mj(a, b, d, c, e2);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Ch(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e2) {
            b = $i(a, b, c);
            break a;
          }
          Yi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Kh(b), null === a && Eg(b), d = b.type, e2 = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e2.children, Ef(d, e2) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), hj(a, b), Yi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return pj(a, b, c);
    case 4:
      return Ih(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Bh(b, null, d, c) : Yi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), Zi(a, b, d, e2, c);
    case 7:
      return Yi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e2 = b.pendingProps;
        f = b.memoizedProps;
        g = e2.value;
        G(Mg, d._currentValue);
        d._currentValue = g;
        if (null !== f) if (He(f.value, g)) {
          if (f.children === e2.children && !Wf.current) {
            b = $i(a, b, c);
            break a;
          }
        } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
          var h = f.dependencies;
          if (null !== h) {
            g = f.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f.tag) {
                  k2 = ch(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f.lanes |= c;
                k2 = f.alternate;
                null !== k2 && (k2.lanes |= c);
                Sg(
                  f.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
          else if (18 === f.tag) {
            g = f.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            Sg(g, c, b);
            g = f.sibling;
          } else g = f.child;
          if (null !== g) g.return = f;
          else for (g = f; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f = g.sibling;
            if (null !== f) {
              f.return = g.return;
              g = f;
              break;
            }
            g = g.return;
          }
          f = g;
        }
        Yi(a, b, e2.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e2 = b.type, d = b.pendingProps.children, Tg(b, c), e2 = Vg(e2), d = d(e2), b.flags |= 1, Yi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e2 = Lg(d, b.pendingProps), e2 = Lg(d.type, e2), aj(a, b, d, e2, c);
    case 15:
      return cj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e2 = b.pendingProps, e2 = b.elementType === d ? e2 : Lg(d, e2), jj(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, Tg(b, c), ph(b, d, e2), rh(b, d, e2, c), kj(null, b, d, true, a, c);
    case 19:
      return yj(a, b, c);
    case 22:
      return ej(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Gk(a, b) {
  return ac(a, b);
}
function al(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new al(a, b, c, d);
}
function bj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function $k(a) {
  if ("function" === typeof a) return bj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function wh(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function yh(a, b, c, d, e2, f) {
  var g = 2;
  d = a;
  if ("function" === typeof a) bj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Ah(c.children, e2, f, b);
    case za:
      g = 8;
      e2 |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e2 | 2), a.elementType = Aa, a.lanes = f, a;
    case Ea:
      return a = Bg(13, c, b, e2), a.elementType = Ea, a.lanes = f, a;
    case Fa:
      return a = Bg(19, c, b, e2), a.elementType = Fa, a.lanes = f, a;
    case Ia:
      return qj(c, e2, f, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e2);
  b.elementType = a;
  b.type = d;
  b.lanes = f;
  return b;
}
function Ah(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function qj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function xh(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function zh(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function bl(a, b, c, d, e2) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e2;
  this.mutableSourceEagerHydrationData = null;
}
function cl(a, b, c, d, e2, f, g, h, k2) {
  a = new bl(a, b, c, h, k2);
  1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
  f = Bg(3, null, null, b);
  a.current = f;
  f.stateNode = a;
  f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  ah(f);
  return a;
}
function dl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function el(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function fl(a, b, c, d, e2, f, g, h, k2) {
  a = cl(c, d, true, a, e2, f, g, h, k2);
  a.context = el(null);
  c = a.current;
  d = L();
  e2 = lh(c);
  f = ch(d, e2);
  f.callback = void 0 !== b && null !== b ? b : null;
  dh(c, f, e2);
  a.current.lanes = e2;
  Ac(a, e2, d);
  Ek(a, d);
  return a;
}
function gl(a, b, c, d) {
  var e2 = b.current, f = L(), g = lh(e2);
  c = el(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = ch(f, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = dh(e2, b, g);
  null !== a && (mh(a, e2, g, f), eh(a, e2, g));
  return g;
}
function hl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function il(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function jl(a, b) {
  il(a, b);
  (a = a.alternate) && il(a, b);
}
function kl() {
  return null;
}
var ll = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ml(a) {
  this._internalRoot = a;
}
nl.prototype.render = ml.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  gl(a, b, null, null);
};
nl.prototype.unmount = ml.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Sk(function() {
      gl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function nl(a) {
  this._internalRoot = a;
}
nl.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function pl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function ql() {
}
function rl(a, b, c, d, e2) {
  if (e2) {
    if ("function" === typeof d) {
      var f = d;
      d = function() {
        var a2 = hl(g);
        f.call(a2);
      };
    }
    var g = fl(b, d, a, 0, null, false, false, "", ql);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Sk();
    return g;
  }
  for (; e2 = a.lastChild; ) a.removeChild(e2);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = hl(k2);
      h.call(a2);
    };
  }
  var k2 = cl(a, 0, false, null, null, false, false, "", ql);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Sk(function() {
    gl(b, k2, c, d);
  });
  return k2;
}
function sl(a, b, c, d, e2) {
  var f = c._reactRootContainer;
  if (f) {
    var g = f;
    if ("function" === typeof e2) {
      var h = e2;
      e2 = function() {
        var a2 = hl(g);
        h.call(a2);
      };
    }
    gl(b, g, a, e2);
  } else g = rl(c, b, a, e2, d);
  return hl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Ek(b, B()), 0 === (K & 6) && (Hj = B() + 500, jg()));
      }
      break;
    case 13:
      Sk(function() {
        var b2 = Zg(a, 1);
        if (null !== b2) {
          var c2 = L();
          mh(b2, a, 1, c2);
        }
      }), jl(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = Zg(a, 134217728);
    if (null !== b) {
      var c = L();
      mh(b, a, 134217728, c);
    }
    jl(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = lh(a), c = Zg(a, b);
    if (null !== c) {
      var d = L();
      mh(c, a, b, d);
    }
    jl(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e2 = Db(d);
            if (!e2) throw Error(p(90));
            Wa(d);
            bb(d, e2);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Rk;
Hb = Sk;
var tl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Rk] }, ul = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" };
var vl = { bundleType: ul.bundleType, version: ul.version, rendererPackageName: ul.rendererPackageName, rendererConfig: ul.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: ul.findFiberByHostInstance || kl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!wl.isDisabled && wl.supportsFiber) try {
    kc = wl.inject(vl), lc = wl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!ol(b)) throw Error(p(200));
  return dl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!ol(a)) throw Error(p(299));
  var c = false, d = "", e2 = ll;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e2 = b.onRecoverableError));
  b = cl(a, 1, false, null, null, c, false, d, e2);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ml(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Sk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!pl(b)) throw Error(p(200));
  return sl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!ol(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e2 = false, f = "", g = ll;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e2 = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = fl(b, null, a, 1, null != c ? c : null, e2, false, f, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e2 = c._getVersion, e2 = e2(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e2] : b.mutableSourceEagerHydrationData.push(
    c,
    e2
  );
  return new nl(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!pl(b)) throw Error(p(200));
  return sl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!pl(a)) throw Error(p(40));
  return a._reactRootContainer ? (Sk(function() {
    sl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!pl(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return sl(a, b, c, false, d);
};
reactDom_production_min.version = "18.2.0-next-9e3b772b8-20220608";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const mapping = {
  default: "input",
  string: "input",
  array: "list",
  boolean: "checkbox",
  integer: "number",
  number: "inputNumber",
  object: "map",
  html: "html",
  card: "card",
  collapse: "collapse",
  lineTitle: "lineTitle",
  line: "line",
  subItem: "subItem",
  panel: "panel",
  "string:upload": "upload",
  "string:url": "urlInput",
  "string:dateTime": "datePicker",
  "string:date": "datePicker",
  "string:year": "datePicker",
  "string:month": "datePicker",
  "string:week": "datePicker",
  "string:quarter": "datePicker",
  "string:time": "timePicker",
  "string:textarea": "textArea",
  "string:color": "color",
  "string:image": "imageInput",
  "range:time": "timeRange",
  "range:dateTime": "dateRange",
  "range:date": "dateRange",
  "range:year": "dateRange",
  "range:month": "dateRange",
  "range:week": "dateRange",
  "range:quarter": "dateRange",
  "*?enum": "radio",
  "*?enum_long": "select",
  "array?enum": "checkboxes",
  "array?enum_long": "multiSelect",
  "*?readOnly": "html"
};
function getWidgetName(schema, _mapping = mapping) {
  const { type, format, readOnly } = schema;
  if (schema["ui:widget"] || schema.widget) {
    return schema["ui:widget"] || schema.widget;
  }
  const list = [];
  if (readOnly) {
    list.push(`${type}?readOnly`);
    list.push("*?readOnly");
  }
  const _widget = format;
  if (_widget) {
    list.push(`${type}:${_widget}`);
  }
  if (typeof type === "string") {
    list.push(type);
  }
  let widgetName = "";
  list.some((item) => {
    widgetName = _mapping[item];
    return !!widgetName;
  });
  return widgetName;
}
function capitalizeFirstLetter(str) {
  return !str ? str : str.charAt(0).toUpperCase() + str.slice(1);
}
const getWidget = (name, widgets2) => {
  let widget = widgets2[name];
  if (!widget) {
    widget = widgets2[capitalizeFirstLetter(name)];
  }
  if (!widget) {
    widget = widgets2["Html"] || null;
  }
  return widget;
};
class Container {
  constructor(hook) {
    this.hook = hook;
    this.subscribers = /* @__PURE__ */ new Set();
  }
  notify() {
    for (const subscriber of this.subscribers) {
      subscriber(this.data);
    }
  }
}
var shim$1 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is$1, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
{
  shim$1.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$1.exports;
function useDataFromContainer(container, depsFn) {
  var _a;
  const depsFnRef = reactExports.useRef(depsFn);
  depsFnRef.current = depsFn;
  const depsRef = reactExports.useRef(((_a = depsFnRef.current) === null || _a === void 0 ? void 0 : _a.call(depsFnRef, container.data)) || []);
  return shimExports.useSyncExternalStore((onStoreChange) => {
    function subscribe() {
      if (!depsFnRef.current) {
        onStoreChange();
      } else {
        const oldDeps = depsRef.current;
        const newDeps = depsFnRef.current(container.data);
        if (compare(oldDeps, newDeps)) {
          onStoreChange();
        }
        depsRef.current = newDeps;
      }
    }
    container.subscribers.add(subscribe);
    return () => {
      container.subscribers.delete(subscribe);
    };
  }, () => container.data);
}
function compare(oldDeps, newDeps) {
  if (oldDeps.length !== newDeps.length) {
    return true;
  }
  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return true;
    }
  }
  return false;
}
(function(s, e2) {
  var t2 = {};
  for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e2.indexOf(p2) < 0)
    t2[p2] = s[p2];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e2.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
        t2[p2[i]] = s[p2[i]];
    }
  return t2;
});
let globalExecutors = [];
const listeners = /* @__PURE__ */ new Set();
function registerGlobalExecutor(executor) {
  globalExecutors = [...globalExecutors, executor];
  listeners.forEach((listener) => listener());
}
const HoxRoot = (props) => {
  const executors = shimExports.useSyncExternalStore((onStoreChange) => {
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  }, () => {
    return globalExecutors;
  });
  return React$1.createElement(
    React$1.Fragment,
    null,
    executors.map((Executor, index) => React$1.createElement(Executor, { key: index })),
    props.children
  );
};
function createGlobalStore(hook) {
  let container = null;
  function getContainer() {
    if (!container) {
      throw new Error("Failed to retrieve data from global container. Please make sure you have rendered HoxRoot.");
    }
    return container;
  }
  const GlobalStoreExecutor = reactExports.memo(() => {
    const [innerContainer] = reactExports.useState(() => new Container(hook));
    container = innerContainer;
    innerContainer.data = hook();
    reactExports.useEffect(() => {
      innerContainer.notify();
    });
    return null;
  });
  registerGlobalExecutor(GlobalStoreExecutor);
  function useGlobalStore(depsFn) {
    return useDataFromContainer(getContainer(), depsFn);
  }
  function getGlobalStore() {
    return getContainer().data;
  }
  return [useGlobalStore, getGlobalStore];
}
reactExports.createContext(null);
const ConfigContext = reactExports.createContext(null);
const msgStore = (() => {
  class Store {
    constructor() {
      this._cache = [];
    }
    setCache(queue) {
      this._cache = queue;
    }
    getCache() {
      return this._cache;
    }
  }
  return new Store();
})();
var ReportStatus = /* @__PURE__ */ ((ReportStatus2) => {
  ReportStatus2["ADD"] = "ADD";
  ReportStatus2["UPDATE"] = "UPDATE";
  ReportStatus2["REMOVE"] = "REMOVE";
  return ReportStatus2;
})(ReportStatus || {});
var ResourceStatus = /* @__PURE__ */ ((ResourceStatus2) => {
  ResourceStatus2["NONE"] = "NONE";
  ResourceStatus2["LOADING"] = "LOADING";
  ResourceStatus2["LOADED"] = "LOADED";
  ResourceStatus2["ERROR"] = "ERROR";
  return ResourceStatus2;
})(ResourceStatus || {});
const isSameResource = (a, b) => {
  return a.componentId === b.componentId && a.pageId === b.pageId;
};
const useResourceHook = () => {
  const [resourceList, dispatch] = reactExports.useReducer(
    (preState = [], action) => {
      switch (action.type) {
        case "ADD":
          if (preState.find((item) => isSameResource(item, action.payload))) {
            return preState;
          } else {
            return [...preState, action.payload];
          }
        case "UPDATE":
          return preState.map((item) => {
            if (isSameResource(item, action.payload)) {
              return action.payload;
            }
            return item;
          });
        case "REMOVE":
          return preState.filter(
            (item) => !isSameResource(item, action.payload)
          );
      }
      console.error(`Unknown action: ${action.type}`);
    },
    []
  );
  return { resourceList: resourceList || [], dispatch };
};
const [useResourceStore] = createGlobalStore(useResourceHook);
const [useInstanceStore] = createGlobalStore(() => {
  const [instanceMap, setInstanceMap] = reactExports.useState({});
  const registerInstance = reactExports.useCallback(
    (id2, instance) => {
      setInstanceMap((old) => {
        if (old[id2] === instance) {
          return old;
        }
        return { ...old, [id2]: instance };
      });
    },
    [setInstanceMap]
  );
  const uninstallInstance = reactExports.useCallback(
    (id2) => {
      setInstanceMap((old) => {
        if (old[id2]) {
          delete old[id2];
        }
        return old;
      });
    },
    [setInstanceMap]
  );
  return {
    instanceMap,
    registerInstance,
    uninstallInstance
  };
});
const useConnect = (ids) => {
  return useInstanceStore((store) => ids.map((id2) => store.instanceMap[id2]));
};
const useReport = () => {
  const { resourceList, dispatch } = useResourceStore(() => []);
  return {
    resourceList,
    resourceReport: dispatch,
    ReportStatus,
    ResourceStatus
  };
};
const [useEventStore] = createGlobalStore(() => {
  const [msgQueue, setMsgQueue] = reactExports.useState([]);
  const [msgControllerList, setMsgControllerList] = reactExports.useState([]);
  const addMsg = reactExports.useCallback(
    ({ id: id2, msgName, msgDetail, msgType, pageId }, isSender = false) => {
      setMsgQueue((pre) => [
        ...pre,
        {
          id: id2,
          msgName,
          msgDetail,
          msgType,
          pageId,
          timeStamp: Date.now(),
          isSender
        }
      ]);
    },
    [setMsgQueue]
  );
  const copyLog = () => {
    return JSON.stringify(msgQueue);
  };
  const registerMsg = reactExports.useCallback(
    (id2, msgName, msgType, pageId) => ({
      // 通过各种交互事件会触发notice，接收端会同步notice的信令
      notice(msgDetail) {
        addMsg({ id: id2, msgName, msgType, msgDetail, pageId }, true);
      },
      // 注册组件对应接收到消息后的处理逻辑函数
      register(controller) {
        const cache2 = msgStore.getCache();
        const cacheInfo = cache2.find((item) => item.pageId === pageId && item.msgType === msgType && item.id === id2 && item.msgName === msgName);
        if (cacheInfo) {
          controller(cacheInfo.msgDetail);
        }
        setMsgControllerList((old) => [
          ...old,
          { id: id2, msgType, msgName, pageId, controller }
        ]);
      }
    }),
    [setMsgControllerList, addMsg]
  );
  return {
    copyLog,
    addMsg,
    msgQueue,
    msgControllerList,
    registerMsg,
    setMsgControllerList,
    setMsgQueue
  };
});
const useUpdateEffect = (effect, deps) => {
  const isMounted = reactExports.useRef(false);
  reactExports.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  reactExports.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};
const FieldWrapper = (props) => {
  const { Field, fieldProps, maxWidth, initialValue, ...otherProps } = props;
  const _style = maxWidth ? { maxWidth, ...fieldProps == null ? void 0 : fieldProps.style } : { ...fieldProps == null ? void 0 : fieldProps.style };
  useUpdateEffect(() => {
    otherProps == null ? void 0 : otherProps.onChange(initialValue);
  }, [JSON.stringify(initialValue)]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Field,
    {
      ...otherProps,
      ...fieldProps,
      style: _style
    }
  );
};
const isObject$7 = (data) => {
  const str = Object.prototype.toString.call(data);
  return str.indexOf("Object") > -1;
};
const isArray$1 = (data) => {
  const str = Object.prototype.toString.call(data);
  return str.indexOf("Array") > -1;
};
const isNumber$1 = (str) => !isNaN(Number(str));
const getPathObj = ({ rootPath = [], path: path3 }) => {
  const pathList = (path3 || "").split(".");
  const dataIndex = [];
  const schemaIndex = [];
  const dataPathList = [];
  rootPath.forEach((item, index) => {
    if (isNumber$1(item)) {
      dataIndex.push(item);
      return;
    }
    if (isNumber$1(rootPath[index + 1])) {
      schemaIndex.push(`${item}[]`);
    } else {
      schemaIndex.push(item);
    }
  });
  let list = [...rootPath];
  list.pop();
  list = [...list, ...pathList];
  list.forEach((item) => {
    dataPathList.push(isNumber$1(item) ? `[${item}]` : item);
  });
  const dataPath = dataPathList.join(".");
  const _path = isNumber$1(pathList[0]) ? pathList.slice(1) : pathList;
  const schemaPath = [...schemaIndex, _path].join(".");
  return {
    dataIndex,
    dataPath,
    schemaPath
  };
};
const getPath = (path3) => {
  if (!path3) {
    return null;
  }
  return isArray$1(path3) ? path3.join(".") : path3;
};
const getFieldProps = (schema, { widgets: widgets2, methods, path: path3, rootPath }, extra) => {
  const pathObj = getPathObj({ path: path3, rootPath });
  const fieldProps = {
    ...schema.props,
    ...extra,
    ...methods,
    addons: {
      ...extra,
      ...pathObj
    }
  };
  ["placeholder", "disabled", "format"].forEach((key) => {
    if (schema[key]) {
      fieldProps[key] = schema[key];
    }
  });
  Object.keys(schema).forEach((key) => {
    if (typeof key === "string" && key.toLowerCase().endsWith("props")) {
      fieldProps[key] = schema[key];
    }
  });
  if (isObject$7(fieldProps.addonAfter) && fieldProps.addonAfter.widget) {
    const AddonAfterWidget = widgets2[fieldProps.addonAfter.widget];
    fieldProps.addonAfter = /* @__PURE__ */ jsxRuntimeExports.jsx(AddonAfterWidget, { ...schema });
  }
  if (isObject$7(schema.methods)) {
    Object.keys(schema.methods).forEach((key) => {
      const name = schema.methods[key];
      fieldProps[key] = methods[name];
    });
  }
  fieldProps.schema = schema;
  if (extra.globalProps) {
    const globalProps = extra.globalProps;
    Object.keys(globalProps).forEach((key) => {
      if (typeof key === "string" && key.toLowerCase().endsWith("props")) {
        fieldProps[key] = globalProps[key];
      }
    });
  }
  return fieldProps;
};
const FieldItem = (props) => {
  const { schema, path: path3, children, rootPath, renderCore, activePageId, pageId } = props;
  const { widgets: widgets2, methods, globalProps, globalConfig } = reactExports.useContext(ConfigContext);
  const widgetName = getWidgetName(schema);
  if (schema == null ? void 0 : schema.hidden) {
    return null;
  }
  if (!widgetName) {
    const ErrorSchema = widgets2["errorSchema"] || widgets2["ErrorSchema"];
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorSchema, { schema });
  }
  const Widget = getWidget(widgetName, widgets2);
  const fieldProps = getFieldProps(schema, {
    widgets: widgets2,
    methods,
    path: getPath(path3),
    rootPath
  }, {
    id: schema.id || path3.join("-"),
    globalProps,
    globalConfig,
    renderCore,
    useEventStore,
    useConnect,
    useReport,
    activePageId,
    pageId
  });
  if (schema.type === "void") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Widget, { ...fieldProps });
  }
  if (children) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Widget, { ...fieldProps, children });
  }
  const initialValue = schema.default ?? schema.defaultValue;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FieldWrapper,
    {
      Field: Widget,
      fieldProps,
      initialValue
    }
  );
};
function withProvider(Element2, defaultWidgets) {
  return (props) => {
    const {
      widgets: widgets2,
      methods,
      globalProps = {},
      globalConfig = {},
      children,
      ...otherProps
    } = props;
    const configContext = {
      widgets: { ...defaultWidgets, ...widgets2 },
      methods,
      globalProps,
      globalConfig
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfigContext.Provider, { value: configContext, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Element2, { ...otherProps }),
      children
    ] });
  };
}
const sortProperties = (properties, orderKey = "order") => {
  const orderHash = /* @__PURE__ */ new Map();
  const unsortedList = [];
  const insert = (item) => {
    const [, value] = item;
    if (typeof value[orderKey] !== "number") {
      unsortedList.push(item);
      return;
    }
    if (orderHash.has(value[orderKey])) {
      orderHash.get(value[orderKey]).push(item);
    } else {
      orderHash.set(value[orderKey], [item]);
    }
  };
  properties.forEach((item) => insert(item));
  const sortedList = Array.from(orderHash.entries()).sort(([order1], [order2]) => order1 - order2).flatMap(([, items]) => items);
  return sortedList.concat(unsortedList);
};
const SHAPE_PATH_FORMULAS = {
  [
    "roundRect"
    /* ROUND_RECT */
  ]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 0.5],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height - radius} Q ${width} ${height} ${width - radius} ${height} L ${radius} ${height} Q 0 ${height} 0 ${height - radius} L 0 ${radius} Q 0 0 ${radius} 0 Z`;
    }
  },
  [
    "cutRectDiagonal"
    /* CUT_RECT_DIAGONAL */
  ]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.9],
    relative: "right",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${height - radius} L 0 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} L ${radius} ${height} Z`;
    }
  },
  [
    "cutRectSingle"
    /* CUT_RECT_SINGLE */
  ]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.9],
    relative: "right",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${height} L 0 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} Z`;
    }
  },
  [
    "cutRectSameSide"
    /* CUT_RECT_SAMESIDE */
  ]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.5],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${radius} L ${radius} 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} L 0 ${height} Z`;
    }
  },
  [
    "roundRectDiagonal"
    /* ROUND_RECT_DIAGONAL */
  ]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 1],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M ${radius} 0 L ${width} 0 L ${width} ${height - radius} Q ${width} ${height} ${width - radius} ${height} L 0 ${height} L 0 ${radius} Q 0 0 ${radius} 0 Z`;
    }
  },
  [
    "roundRectSingle"
    /* ROUND_RECT_SINGLE */
  ]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 1],
    relative: "right",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M 0 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height} L 0 ${height} L 0 0 Z`;
    }
  },
  [
    "roundRectSameSide"
    /* ROUND_RECT_SAMESIDE */
  ]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 0.5],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M 0 ${radius} Q 0 0 ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height} L 0 ${height} Z`;
    }
  },
  [
    "cutRoundRect"
    /* CUT_ROUND_RECT */
  ]: {
    editable: true,
    defaultValue: 0.125,
    range: [0, 0.5],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const radius = Math.min(width, height) * value;
      return `M ${radius} 0 L ${width - radius} 0 L ${width} ${radius} L ${width} ${height} L 0 ${height} L 0 ${radius} Q 0 0 ${radius} 0 Z`;
    }
  },
  [
    "message"
    /* MESSAGE */
  ]: {
    formula: (width, height) => {
      const arrowWidth = width * 0.2;
      const arrowheight = height * 0.2;
      return `M 0 0 L ${width} 0 L ${width} ${height - arrowheight} L ${width / 2} ${height - arrowheight} L ${width / 2 - arrowWidth} ${height} L ${width / 2 - arrowWidth} ${height - arrowheight} L 0 ${height - arrowheight} Z`;
    }
  },
  [
    "roundMessage"
    /* ROUND_MESSAGE */
  ]: {
    formula: (width, height) => {
      const radius = Math.min(width, height) * 0.125;
      const arrowWidth = width * 0.2;
      const arrowheight = height * 0.2;
      return `M 0 ${radius} Q 0 0 ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height - radius - arrowheight} Q ${width} ${height - arrowheight} ${width - radius} ${height - arrowheight} L ${width / 2} ${height - arrowheight} L ${width / 2 - arrowWidth} ${height} L ${width / 2 - arrowWidth} ${height - arrowheight} L ${radius} ${height - arrowheight} Q 0 ${height - arrowheight} 0 ${height - radius - arrowheight} L 0 ${radius} Z`;
    }
  },
  [
    "L"
    /* L */
  ]: {
    editable: true,
    defaultValue: 0.25,
    range: [0.1, 0.9],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const lineWidth = Math.min(width, height) * value;
      return `M 0 0 L 0 ${height} L ${width} ${height} L ${width} ${height - lineWidth} L ${lineWidth} ${height - lineWidth} L ${lineWidth} 0 Z`;
    }
  },
  [
    "ringRect"
    /* RING_RECT */
  ]: {
    editable: true,
    defaultValue: 0.25,
    range: [0.1, 0.45],
    relative: "left",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const lineWidth = Math.min(width, height) * value;
      return `M 0 0 ${width} 0 ${width} ${height} L 0 ${height} L 0 0 Z M ${lineWidth} ${lineWidth} L ${lineWidth} ${height - lineWidth} L ${width - lineWidth} ${height - lineWidth} L ${width - lineWidth} ${lineWidth} Z`;
    }
  },
  [
    "plus"
    /* PLUS */
  ]: {
    editable: true,
    defaultValue: 0.25,
    range: [0.1, 0.9],
    relative: "center",
    getBaseSize: (width, height) => Math.min(width, height),
    formula: (width, height, value) => {
      const lineWidth = Math.min(width, height) * value;
      return `M ${width / 2 - lineWidth / 2} 0 L ${width / 2 - lineWidth / 2} ${height / 2 - lineWidth / 2} L 0 ${height / 2 - lineWidth / 2} L 0 ${height / 2 + lineWidth / 2} L ${width / 2 - lineWidth / 2} ${height / 2 + lineWidth / 2} L ${width / 2 - lineWidth / 2} ${height} L ${width / 2 + lineWidth / 2} ${height} L ${width / 2 + lineWidth / 2} ${height / 2 + lineWidth / 2} L ${width} ${height / 2 + lineWidth / 2} L ${width} ${height / 2 - lineWidth / 2} L ${width / 2 + lineWidth / 2} ${height / 2 - lineWidth / 2} L ${width / 2 + lineWidth / 2} 0 Z`;
    }
  },
  [
    "triangle"
    /* TRIANGLE */
  ]: {
    editable: true,
    defaultValue: 0.5,
    range: [0, 1],
    relative: "left",
    getBaseSize: (width) => width,
    formula: (width, height, value) => {
      const vertex = width * value;
      return `M ${vertex} 0 L 0 ${height} L ${width} ${height} Z`;
    }
  },
  [
    "parallelogramLeft"
    /* PARALLELOGRAM_LEFT */
  ]: {
    editable: true,
    defaultValue: 0.25,
    range: [0, 0.9],
    relative: "left",
    getBaseSize: (width) => width,
    formula: (width, height, value) => {
      const point3 = width * value;
      return `M ${point3} 0 L ${width} 0 L ${width - point3} ${height} L 0 ${height} Z`;
    }
  },
  [
    "parallelogramRight"
    /* PARALLELOGRAM_RIGHT */
  ]: {
    editable: true,
    defaultValue: 0.25,
    range: [0, 0.9],
    relative: "right",
    getBaseSize: (width) => width,
    formula: (width, height, value) => {
      const point3 = width * value;
      return `M 0 0 L ${width - point3} 0 L ${width} ${height} L ${point3} ${height} Z`;
    }
  },
  [
    "trapezoid"
    /* TRAPEZOID */
  ]: {
    editable: true,
    defaultValue: 0.25,
    range: [0, 0.5],
    relative: "left",
    getBaseSize: (width) => width,
    formula: (width, height, value) => {
      const point3 = width * value;
      return `M ${point3} 0 L ${width - point3} 0 L ${width} ${height} L 0 ${height} Z`;
    }
  },
  [
    "bullet"
    /* BULLET */
  ]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 1],
    relative: "top",
    getBaseSize: (width, height) => height,
    formula: (width, height, value) => {
      const point3 = height * value;
      return `M ${width / 2} 0 L 0 ${point3} L 0 ${height} L ${width} ${height} L ${width} ${point3} Z`;
    }
  },
  [
    "indicator"
    /* INDICATOR */
  ]: {
    editable: true,
    defaultValue: 0.2,
    range: [0, 0.9],
    relative: "right",
    getBaseSize: (width) => width,
    formula: (width, height, value) => {
      const point3 = width * value;
      return `M ${width} ${height / 2} L ${width - point3} 0 L 0 0 L ${point3} ${height / 2} L 0 ${height} L ${width - point3} ${height} Z`;
    }
  }
};
const SHAPE_LIST = [
  {
    key: "RectangleShapes",
    type: "矩形",
    children: [
      {
        key: "rect",
        viewBox: [200, 200],
        path: "M 0 0 L 200 0 L 200 200 L 0 200 Z",
        pptxShapeType: "rect"
      },
      {
        key: "roundRect",
        viewBox: [200, 200],
        path: "M 50 0 L 150 0 Q 200 0 200 50 L 200 150 Q 200 200 150 200 L 50 200 Q 0 200 0 150 L 0 50 Q 0 0 50 0 Z",
        pathFormula: "roundRect",
        pptxShapeType: "roundRect"
      },
      {
        key: "snip1Rect",
        viewBox: [200, 200],
        path: "M 0 200 L 0 0 L 150 0 L 200 50 L 200 200 Z",
        pathFormula: "cutRectSingle",
        pptxShapeType: "snip1Rect"
      },
      {
        key: "snip2SameRect",
        viewBox: [200, 200],
        path: "M 0 50 L 50 0 L 150 0 L 200 50 L 200 200 L 0 200 Z",
        pathFormula: "cutRectSameSide",
        pptxShapeType: "snip2SameRect"
      },
      {
        key: "snip2DiagRect",
        viewBox: [200, 200],
        path: "M 0 150 L 0 0 L 150 0 L 200 50 L 200 200 L 50 200 Z",
        pathFormula: "cutRectDiagonal",
        pptxShapeType: "snip2DiagRect"
      },
      {
        key: "snipRoundRect",
        viewBox: [200, 200],
        path: "M 50 0 L 150 0 L 200 50 L 200 200 L 0 200 L 0 50 Q 0 0 50 0 Z",
        pathFormula: "cutRoundRect",
        pptxShapeType: "snipRoundRect"
      },
      {
        key: "round1Rect",
        viewBox: [200, 200],
        path: "M 0 0 L 150 0 Q 200 0 200 50 L 200 200 L 0 200 L 0 0 Z",
        pathFormula: "roundRectSingle",
        pptxShapeType: "round1Rect"
      },
      {
        key: "round2SameRect",
        viewBox: [200, 200],
        path: "M 0 50 Q 0 0 50 0 L 150 0 Q 200 0 200 50 L 200 200 L 0 200 Z",
        pathFormula: "roundRectSameSide",
        pptxShapeType: "round2SameRect"
      },
      {
        key: "round2DiagRect",
        viewBox: [200, 200],
        path: "M 50 0 L 200 0 L 200 150 Q 200 200 150 200 L 0 200 L 0 50 Q 0 0 50 0 Z",
        pathFormula: "roundRectDiagonal",
        pptxShapeType: "round2DiagRect"
      },
      {
        key: "arbitraryPolygon",
        viewBox: [200, 200],
        path: "M 0 80 L 60 0 L 100 40 L 180 20 L 200 120 L 160 200 L 0 200 L 60 140 Z",
        title: "任意多边形"
      }
    ]
  },
  {
    key: "CommonShapes",
    type: "常用形状",
    children: [
      {
        key: "ellipse",
        viewBox: [200, 200],
        path: "M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z",
        pptxShapeType: "ellipse"
      },
      {
        key: "triangle",
        viewBox: [200, 200],
        path: "M 100 0 L 0 200 L 200 200 L 100 0 Z",
        pathFormula: "triangle",
        pptxShapeType: "triangle"
      },
      {
        key: "rightTriangle",
        viewBox: [200, 200],
        path: "M 0 0 L 0 200 L 200 200 Z"
      },
      {
        key: "roundedTriangle",
        viewBox: [200, 200],
        path: "M 70 20 L 0 160 Q 0 200 40 200 L 160 200 Q 200 200 200 160 L 130 20 Q 100 -20 70 20 Z"
      },
      {
        key: "parallelogram",
        viewBox: [200, 200],
        path: "M 50 0 L 200 0 L 150 200 L 0 200 L 50 0 Z",
        pathFormula: "parallelogramLeft",
        pptxShapeType: "parallelogram"
      },
      {
        key: "parallelogram2",
        viewBox: [200, 200],
        path: "M 0 0 L 150 0 L 200 200 L 50 200 L 0 0 Z",
        pathFormula: "parallelogramRight"
        /* PARALLELOGRAM_RIGHT */
      },
      {
        key: "trapezoid",
        viewBox: [200, 200],
        path: "M 50 0 L 150 0 L 200 200 L 0 200 L 50 0 Z",
        pathFormula: "trapezoid",
        pptxShapeType: "trapezoid"
      },
      {
        key: "diamond",
        viewBox: [200, 200],
        path: "M 100 0 L 0 100 L 100 200 L 200 100 L 100 0 Z",
        pptxShapeType: "diamond"
      },
      {
        key: "bullet",
        viewBox: [200, 200],
        path: "M 100 0 L 0 50 L 0 200 L 200 200 L 200 50 L 100 0 Z",
        pathFormula: "bullet"
        /* BULLET */
      },
      {
        key: "indicator",
        viewBox: [200, 200],
        path: "M 200 100 L 150 0 L 0 0 L 50 100 L 0 200 L 150 200 L 200 100 Z",
        pathFormula: "indicator"
        /* INDICATOR */
      },
      {
        key: "arbitraryRectangle",
        viewBox: [200, 200],
        path: "M 0 0 C 80 20 120 20 200 0 C 180 80 180 120 200 200 C 80 180 120 180 0 200 C 20 120 20 80 0 0 Z"
      },
      {
        key: "arbitraryRectangle2",
        viewBox: [200, 200],
        path: "M 10 10 C 60 0 140 0 190 10 C 200 60 200 140 190 190 C 140 200 60 200 10 190 C 0 140 0 60 10 10 Z"
      },
      {
        key: "arbitraryCircle",
        viewBox: [200, 200],
        path: "M 0 200 A 50 100 0 1 1 200 200 L 0 200 Z"
      },
      {
        key: "arbitraryCircle2",
        viewBox: [200, 200],
        path: "M 40 20 A 100 100 0 1 0 200 100 L 100 100 L 40 20 Z"
      },
      {
        key: "pie",
        viewBox: [200, 200],
        path: "M 100 0 A 100 100 102 1 0 200 100 L 100 100 L 100 0 Z",
        pptxShapeType: "pie"
      },
      {
        key: "pie2",
        viewBox: [200, 200],
        path: "M 160 20 A 100 100 0 1 0 200 100 L 100 100 L 160 20 Z"
      },
      {
        key: "chord",
        viewBox: [200, 200],
        path: "M 100 0 A 100 100 102 1 0 200 100 L 100 0 Z",
        pptxShapeType: "chord"
      },
      {
        key: "teardrop",
        viewBox: [200, 200],
        path: "M 100 0 A 100 100 102 1 0 200 100 L 200 0 L 100 0 Z",
        pptxShapeType: "teardrop"
      },
      {
        key: "quarterSector",
        viewBox: [200, 200],
        path: "M 0 0 L 200 0 Q 200 200 0 200 L 0 0 Z"
      },
      {
        key: "pentagon",
        viewBox: [200, 200],
        path: "M 100 0 L 0 90 L 50 200 L 150 200 L 200 90 L 100 0 Z",
        pptxShapeType: "pentagon"
      },
      {
        key: "hexagon",
        viewBox: [200, 200],
        path: "M 40 0 L 160 0 L 200 100 L 160 200 L 40 200 L 0 100 Z",
        pptxShapeType: "hexagon"
      },
      {
        key: "honeycomb",
        viewBox: [200, 200],
        path: "M 100 0 L 0 60 L 0 140 L 100 200 L 200 140 L 200 60 L 100 0 Z"
      },
      {
        key: "octagon",
        viewBox: [200, 200],
        path: "M 60 0 L 140 0 L 200 60 L 200 140 L 140 200 L 60 200 L 0 140 L 0 60 L 60 0 Z",
        pptxShapeType: "octagon"
      },
      {
        key: "dodecagon",
        viewBox: [200, 200],
        path: "M 75 0 L 125 0 L 175 25 L 200 75 L 200 125 L 175 175 L 125 200 L 75 200 L 25 175 L 0 125 L 0 75 L 25 25 L 75 0 Z"
      },
      {
        key: "roundedRectangle",
        viewBox: [200, 200],
        path: "M 150 0 A 50 100 0 1 1 150 200 L 0 200 L 0 0 L 150 0 Z"
      },
      {
        key: "roundedRectangle2",
        viewBox: [200, 200],
        path: "M 50 0 A 25 50 0 1 0 50 200 L 150 200 A 25 50 0 1 0 150 0 L 50 0 Z"
      },
      {
        key: "roundedRectangle3",
        viewBox: [200, 200],
        path: "M 150 0 A 50 100 0 1 1 150 200 L 0 200 A 50 100 0 0 0 0 0 L 150 0 Z"
      },
      {
        key: "quadrilateral",
        viewBox: [200, 200],
        path: "M 200 0 L 200 200 L 0 200 L 0 100 L 200 0 Z"
      },
      {
        key: "quadrilateral2",
        viewBox: [200, 200],
        path: "M 0 0 L 200 100 L 200 200 L 0 200 L 0 0 Z"
      },
      {
        key: "quadrilateral3",
        viewBox: [200, 200],
        path: "M 200 0 L 100 0 L 0 100 L 0 200 L 200 0 Z"
      },
      {
        key: "cross",
        viewBox: [200, 200],
        path: "M 50 0 L 150 0 L 150 50 L 200 50 L 200 150 L 150 150 L 150 200 L 50 200 L 50 150 L 0 150 L 0 50 L 50 50 L 50 0 Z"
      },
      {
        key: "lShape",
        viewBox: [200, 200],
        path: "M 0 0 L 0 200 L 200 200 L 200 140 L 60 140 L 60 0 L 0 0 Z",
        pathFormula: "L"
        /* L */
      },
      {
        key: "ringRect",
        viewBox: [200, 200],
        path: "M0 0 L200 0 L200 200 L0 200 L0 0 Z M50 50 L50 150 L150 150 L150 50 Z",
        pathFormula: "ringRect"
        /* RING_RECT */
      },
      {
        key: "ringEllipse",
        viewBox: [200, 200],
        path: "M0 100 A100 100 0 1 1 0 101 Z M150 100 A50 50 0 1 0 150 101 Z"
      },
      {
        key: "plus",
        viewBox: [200, 200],
        path: "M 70 0 L 70 70 L 0 70 L 0 130 L 70 130 L 70 200 L 130 200 L 130 130 L 200 130 L 200 70 L 130 70 L 130 0 L 70 0 Z",
        pathFormula: "plus"
        /* PLUS */
      },
      {
        key: "multiply",
        viewBox: [200, 200],
        path: "M 40 0 L 0 40 L 60 100 L 0 160 L 40 200 L 100 140 L 160 200 L 200 160 L 140 100 L 200 40 L 160 0 L 100 60 L 40 0 Z"
      },
      {
        key: "message",
        viewBox: [200, 200],
        path: "M 0 0 L 200 0 L 200 160 L 100 160 L 60 200 L 60 160 L 0 160 Z"
        // pathFormula: ShapePathFormulasKeys.MESSAGE,
      },
      {
        key: "roundMessage",
        viewBox: [200, 200],
        path: "M 0 40 Q 0 0 40 0 L 160 0 Q 200 0 200 40 L 200 120 Q 200 160 160 160 L 100 160 L 60 200 L 60 160 L 40 160 Q 0 160 0 120 L 0 40 Z"
        // pathFormula: ShapePathFormulasKeys.ROUND_MESSAGE,
      },
      {
        key: "roundMessage2",
        viewBox: [200, 200],
        path: "M 180 160 A 100 100 0 1 0 100 200 L 200 200 L 200 160 L 180 160 Z"
      },
      {
        key: "hourglass",
        viewBox: [200, 200],
        path: "M 200 0 L 0 0 L 200 200 L 0 200 L 200 0 Z"
      },
      {
        key: "flag",
        viewBox: [200, 200],
        path: "M 0 20 C 60 60 140 -40 200 20 L 200 180 C 140 140 60 240 0 180 L 0 20 Z"
      },
      {
        key: "flag2",
        viewBox: [200, 200],
        path: "M 0 20 C 40 -40 60 60 100 20 C 140 -40 160 60 200 20 L 200 180 C 140 240 160 140 100 180 C 40 240 60 140 0 180 L 0 20 Z"
      },
      {
        key: "curvilinearTriangle",
        viewBox: [200, 200],
        path: "M 100 0 Q 0 50 0 175 Q 100 225 200 175 Q 200 50 100 0 Z"
      },
      {
        key: "Sector",
        viewBox: [200, 200],
        path: "M 0 100 A 50 50 0 1 1 200 100 L 100 200 L 0 100 Z"
      },
      {
        key: "star4",
        viewBox: [200, 200],
        path: "M 100 0 L 120 80 L 200 100 L 120 120 L 100 200 L 80 120 L 0 100 L 80 80 L 100 0 Z",
        pptxShapeType: "star4"
      },
      {
        key: "star5",
        viewBox: [1024, 1024],
        path: "M1018.67652554 400.05983681l-382.95318779-5.89158658L512 34.78141155 388.27666225 394.16825023l-382.95318779 5.89158658L311.68602415 629.83174977l-117.83174978 365.27842665 312.25413766-223.88032637 312.25413904 223.88032637-117.83175116-365.27842665 318.14572563-229.77191296z",
        pptxShapeType: "star5",
        special: true
      },
      {
        key: "star4-1",
        viewBox: [200, 200],
        path: "M 100 0 L 60 60 L 0 100 L 60 140 L 100 200 L 140 140 L 200 100 L 140 60 L 100 0 Z"
      },
      {
        key: "star6",
        viewBox: [200, 200],
        path: "M 100 0 L 140 60 L 200 60 L 160 100 L 200 140 L 140 140 L 100 200 L 60 140 L 0 140 L 40 100 L 0 60 L 60 60 L 100 0 Z",
        pptxShapeType: "star6"
      },
      {
        key: "star8",
        viewBox: [200, 200],
        path: "M 100 0 L 80 40 L 20 20 L 40 80 L 0 100 L 40 120 L 20 180 L 80 160 L 100 200 L 120 160 L 180 180 L 160 120 L 200 100 L 160 80 L 180 20 L 120 40 L 100 0 Z"
      },
      {
        key: "moon",
        viewBox: [200, 200],
        path: "M 200 0 C 80 40 80 160 200 200 C -60 200 -60 0 200 0 Z"
      }
    ]
  },
  {
    key: "ArrowShapes",
    type: "箭头",
    children: [
      {
        key: "upArrow",
        viewBox: [200, 200],
        path: "M 100 0 L 0 100 L 50 100 L 50 200 L 150 200 L 150 100 L 200 100 L 100 0 Z",
        pptxShapeType: "upArrow"
      },
      {
        key: "downArrow",
        viewBox: [200, 200],
        path: "M 100 200 L 200 100 L 150 100 L 150 0 L 50 0 L 50 100 L 0 100 L 100 200 Z",
        pptxShapeType: "downArrow"
      },
      {
        key: "leftArrow",
        viewBox: [200, 200],
        path: "M 0 100 L 100 0 L 100 50 L 200 50 L 200 150 L 100 150 L 100 200 L 0 100 Z",
        pptxShapeType: "leftArrow"
      },
      {
        key: "rightArrow",
        viewBox: [200, 200],
        path: "M 200 100 L 100 0 L 100 50 L 0 50 L 0 150 L 100 150 L 100 200 L 200 100 Z",
        pptxShapeType: "rightArrow"
      },
      {
        key: "upDownArrow",
        viewBox: [200, 200],
        path: "M 100 0 L 0 60 L 60 60 L 60 140 L 0 140 L 100 200 L 200 140 L 140 140 L 140 60 L 200 60 L 100 0 Z",
        pptxShapeType: "upDownArrow"
      },
      {
        key: "leftRightArrow",
        viewBox: [200, 200],
        path: "M 0 100 L 60 0 L 60 60 L 140 60 L 140 0 L 200 100 L 140 200 L 140 140 L 60 140 L 60 200 L 0 100 Z",
        pptxShapeType: "leftRightArrow"
      },
      {
        key: "quadArrow",
        viewBox: [200, 200],
        path: "M 100 0 L 60 40 L 80 40 L 80 80 L 40 80 L 40 60 L 0 100 L 40 140 L 40 120 L 80 120 L 80 160 L 60 160 L 100 200 L 140 160 L 120 160 L 120 120 L 160 120 L 160 140 L 200 100 L 160 60 L 160 80 L 120 80 L 120 40 L 140 40 L 100 0 Z"
      },
      {
        key: "notchedLeftArrow",
        viewBox: [200, 200],
        path: "M 0 100 L 100 0 L 100 50 L 200 50 L 150 100 L 200 150 L 100 150 L 100 200 L 0 100 Z"
      },
      {
        key: "notchedRightArrow",
        viewBox: [200, 200],
        path: "M 200 100 L 100 0 L 100 50 L 0 50 L 50 100 L 0 150 L 100 150 L 100 200 L 200 100 Z",
        pptxShapeType: "notchedRightArrow"
      },
      {
        key: "leftArrow2",
        viewBox: [200, 200],
        path: "M 0 100 L 80 20 L 80 80 L 120 80 L 120 0 L 200 0 L 200 200 L 120 200 L 120 120 L 80 120 L 80 180 L 0 100 Z"
      },
      {
        key: "rightArrow2",
        viewBox: [200, 200],
        path: "M 200 100 L 120 20 L 120 80 L 80 80 L 80 0 L 0 0 L 0 200 L 80 200 L 80 120 L 120 120 L 120 180 L 200 100 Z"
      },
      {
        key: "rightArrow3",
        viewBox: [200, 200],
        path: "M 0 0 L 120 0 L 200 100 L 120 200 L 0 200 L 80 100 L 0 0 Z",
        pptxShapeType: "chevron"
      },
      {
        key: "leftArrow3",
        viewBox: [200, 200],
        path: "M 80 0 L 200 0 L 120 100 L 200 200 L 80 200 L 0 100 L 80 0 Z"
      },
      {
        key: "rightArrow4",
        viewBox: [200, 200],
        path: "M 0 0 L 140 0 L 200 100 L 140 200 L 0 200 L 0 100 L 0 0 Z",
        pptxShapeType: "homePlate"
      },
      {
        key: "leftArrow4",
        viewBox: [200, 200],
        path: "M 60 0 L 200 0 L 200 100 L 200 200 L 60 200 L 0 100 L 60 0 Z"
      },
      {
        key: "rightArrow5",
        viewBox: [200, 200],
        path: "M 0 0 L 200 100 L 0 200 L 60 100 L 0 0 Z"
      },
      {
        key: "leftArrow5",
        viewBox: [200, 200],
        path: "M 200 0 L 0 100 L 200 200 L 140 100 L 200 0 Z"
      },
      {
        key: "rightArrow6",
        viewBox: [200, 200],
        path: "M 0 0 L 80 0 L 200 100 L 80 200 L 0 200 L 120 100 L 0 0 Z"
      },
      {
        key: "leftArrow6",
        viewBox: [200, 200],
        path: "M 200 0 L 120 0 L 0 100 L 120 200 L 200 200 L 80 100 L 200 0 Z"
      },
      {
        key: "rightTopArrow",
        viewBox: [200, 200],
        path: "M 0 200 L 180 200 L 180 40 L 200 40 L 160 0 L 120 40 L 140 40 L 140 160 L 0 160 L 0 200 Z"
      },
      {
        key: "topRightArrow",
        viewBox: [200, 200],
        path: "M 0 200 L 0 20 L 160 20 L 160 0 L 200 40 L 160 80 L 160 60 L 40 60 L 40 200 L 0 200 Z"
      },
      {
        key: "topLeftDoubleArrow",
        viewBox: [200, 200],
        path: "M 40 180 L 180 180 L 180 40 L 200 40 L 160 0 L 120 40 L 140 40 L 140 140 L 40 140 L 40 120 L 0 160 L 40 200 L 40 180 Z"
      },
      {
        key: "leftArrow7",
        viewBox: [1024, 1024],
        path: "M398.208 302.912V64L0 482.112l398.208 418.176V655.36c284.48 0 483.584 95.552 625.792 304.64-56.896-298.688-227.584-597.312-625.792-657.088z",
        special: true
      },
      {
        key: "rightArrow7",
        viewBox: [1024, 1024],
        path: "M625.792 302.912V64L1024 482.112l-398.208 418.176V655.36C341.312 655.36 142.208 750.912 0 960c56.896-298.688 227.584-597.312 625.792-657.088z",
        special: true
      }
    ]
  },
  {
    key: "OtherShapes",
    type: "其他形状",
    children: [
      {
        key: "heart",
        viewBox: [1024, 1024],
        path: "M995.336 243.4016c-15.7584-36.5736-38.3376-69.26639999-66.91440001-97.37280001-28.5768-27.98879999-61.73999999-49.8624-98.78399999-65.26799998-38.22-15.876-78.6744-23.8728-120.4224-23.87280001-57.97680001 0-114.5424 15.876-163.69919999 45.864-11.76 7.17360001-22.932 15.05279999-33.51600001 23.63760001-10.584-8.5848-21.75600001-16.46400001-33.51600001-23.63760001-49.1568-29.98799999-105.7224-45.86399999-163.69919999-45.864-41.74799999 0-82.2024 7.9968-120.4224 23.87280001-36.9264 15.28799999-70.2072 37.27919999-98.78399999 65.26799998-28.6944 28.10640001-51.156 60.79919999-66.91440001 97.37280001-16.34639999 37.9848-24.696 78.3216-24.696 119.83439999 0 39.1608 7.9968 79.96800001 23.8728 121.48080001 13.28880001 34.692 32.34000001 70.67760001 56.6832 107.016 38.57279999 57.5064 91.61040001 117.4824 157.4664 178.28160001 109.1328 100.78319999 217.2072 170.4024 221.79359999 173.22479998l27.87120001 17.8752c12.348 7.8792 28.224 7.8792 40.572 0l27.87119999-17.8752c4.58639999-2.94 112.54319999-72.44159999 221.79360001-173.22479998 65.85599999-60.79919999 118.89359999-120.7752 157.4664-178.28160001 24.3432-36.33839999 43.512-72.324 56.68319999-107.016 15.876-41.5128 23.8728-82.32 23.87280001-121.48080001 0.1176-41.5128-8.232-81.8496-24.5784-119.83439999z",
        special: true
      },
      {
        key: "star",
        viewBox: [1024, 1024],
        path: "M985.20746667 343.50079998l-303.32586667-44.08319999L546.28693333 24.5248c-3.70346666-7.5264-9.79626667-13.6192-17.32266665-17.32266668-18.87573334-9.3184-41.81333333-1.55306667-51.25120001 17.32266668L342.1184 299.41759999l-303.32586667 44.08319999c-8.36266667 1.19466667-16.00853333 5.13706667-21.8624 11.11040001-14.69440001 15.17226667-14.45546667 39.30453334 0.71679999 54.1184l219.46026668 213.9648-51.84853333 302.1312c-1.43359999 8.24320001-0.11946667 16.8448 3.82293333 24.25173333 9.79626667 18.6368 32.9728 25.92426667 51.6096 16.00853334L512 822.44266665l271.3088 142.64320001c7.40693333 3.9424 16.00853333 5.25653333 24.25173333 3.82293333 20.78719999-3.584 34.7648-23.296 31.1808-44.0832l-51.84853333-302.1312 219.46026668-213.9648c5.97333334-5.85386666 9.91573333-13.49973334 11.11039999-21.8624 3.2256-20.90666667-11.34933333-40.26026667-32.256-43.36640001z",
        special: true
      },
      {
        key: "cloud",
        viewBox: [1024, 1024],
        path: "M852.65066667 405.84533333C800.54044445 268.40177778 667.76177778 170.66666667 512.22755555 170.66666667S223.91466667 268.288 171.80444445 405.73155555C74.29688889 431.33155555 2.27555555 520.07822222 2.27555555 625.77777778c0 125.72444445 101.83111111 227.55555555 227.44177778 227.55555555h564.56533334C919.89333333 853.33333333 1021.72444445 751.50222222 1021.72444445 625.77777778c0-105.472-71.79377778-194.21866667-169.07377778-219.93244445z",
        special: true
      },
      {
        key: "lightning",
        viewBox: [1024, 1024],
        path: "M926.25224691 323.7371485H654.6457886L898.88200917 15.14388241c5.05486373-6.53433603 0.49315743-16.02761669-7.76722963-16.02761668H418.30008701c-3.45210206 0-6.78091476 1.84934039-8.50696579 4.93157436L90.35039154 555.76772251c-3.82197013 6.53433603 0.86302552 14.7947231 8.50696578 14.79472311h215.01664245l-110.22068713 440.88274851c-2.34249783 9.61657002 9.24670194 16.39748478 16.39748477 9.49328065L933.03316167 340.62779071c6.41104668-6.0411786 2.09591911-16.8906422-6.78091476-16.89064221z",
        special: true
      },
      {
        key: "flame",
        viewBox: [1024, 1024],
        path: "M878.47822222 463.30311111c-22.18666667-49.83466667-53.93066667-93.98044445-94.32177777-131.072l-33.10933334-30.37866666c-4.89244445-4.32355555-12.62933333-2.38933333-14.79111111 3.75466666l-14.79111111 42.43911111c-9.216 26.624-26.16888889 53.81688889-50.176 80.55466667-1.59288889 1.70666667-3.41333333 2.16177778-4.66488889 2.27555556-1.25155555 0.11377778-3.18577778-0.11377778-4.89244445-1.70666667-1.59288889-1.36533333-2.38933333-3.41333333-2.27555555-5.46133333 4.20977778-68.49422222-16.27022222-145.74933333-61.09866667-229.83111112C561.26577778 124.01777778 509.72444445 69.51822222 445.32622222 31.51644445l-46.99022222-27.648c-6.144-3.64088889-13.99466667 1.13777778-13.65333333 8.30577777l2.50311111 54.61333333c1.70666667 37.31911111-2.61688889 70.31466667-12.85688889 97.73511112-12.51555555 33.56444445-30.49244445 64.73955555-53.47555556 92.72888888-16.15644445 19.56977778-34.24711111 37.20533333-54.04444444 52.45155556-47.90044445 36.75022222-87.38133333 84.65066667-114.11911111 138.24C125.72444445 502.10133333 111.50222222 562.74488889 111.50222222 623.50222222c0 53.70311111 10.58133333 105.69955555 31.51644445 154.73777778 20.25244445 47.21777778 49.152 89.77066667 85.90222222 126.17955555 36.864 36.40888889 79.64444445 65.08088889 127.31733333 84.992C405.61777778 1010.11911111 457.95555555 1020.58666667 512 1020.58666667s106.38222222-10.46755555 155.76177778-31.06133334c47.67288889-19.91111111 90.56711111-48.46933333 127.31733333-84.992 36.864-36.40888889 65.76355555-78.96177778 85.90222222-126.17955555 20.93511111-49.03822222 31.51644445-101.03466667 31.51644445-154.73777778 0-55.52355555-11.37777778-109.45422222-34.01955556-160.31288889z",
        special: true
      },
      {
        key: "cloth",
        viewBox: [1024, 1024],
        path: "M968.20337778 20.11591112H705.44042667c-22.17301333 0-41.92483556 15.16430222-47.14951111 37.33731555C642.36202666 124.73685332 582.08711111 173.03324444 512 173.03324444s-130.36202666-48.29639112-146.29091556-115.58001777c-5.22467555-22.17301333-24.84906667-37.33731556-47.14951111-37.33731555H55.79662222c-30.96576 0-56.06968889 25.10392889-56.06968888 56.06968888v321.12639999c0 30.96576 25.10392889 56.06968889 56.06968888 56.06968889h95.57333334v494.43271112c0 30.96576 25.10392889 56.06968889 56.06968889 56.06968888h609.1207111c30.96576 0 56.06968889-25.10392889 56.06968889-56.06968888V453.38168888h95.57333334c30.96576 0 56.06968889-25.10392889 56.06968888-56.06968889V76.1856c0-30.96576-25.10392889-56.06968889-56.06968888-56.06968888z",
        special: true
      },
      {
        key: "folder",
        viewBox: [1024, 1024],
        path: "M980.94648889 239.80714666H523.46880001L373.99210666 96.82944c-1.91146667-1.78403556-4.46008889-2.80348444-7.00871111-2.80348445H43.05351111c-22.55530667 0-40.77795555 18.22264888-40.77795555 40.77795557v754.39217776c0 22.55530667 18.22264888 40.77795555 40.77795555 40.77795557h937.89297778c22.55530667 0 40.77795555-18.22264888 40.77795555-40.77795557V280.58510222c0-22.55530667-18.22264888-40.77795555-40.77795555-40.77795556z",
        special: true
      },
      {
        key: "telephone",
        viewBox: [1024, 1024],
        path: "M972.60904597 164.57058577L841.30587843 33.39070759c-18.86327195-18.86327195-44.1375906-29.34286748-70.64480282-29.3428675-26.75379095 0-51.90482023 10.47959553-70.76809219 29.3428675L558.60337778 174.68031322c-18.86327195 18.86327195-29.34286748 44.1375906-29.34286749 70.64480283 0 26.75379095 10.47959553 51.90482023 29.34286749 70.76809218l103.31648301 103.31648302c-24.28800376 53.50758189-57.69942011 101.59043198-99.24793416 143.13894603-41.42522469 41.67180341-89.63136414 75.08321976-143.13894603 99.61780223L316.21649759 558.84995649c-18.86327195-18.86327195-44.1375906-29.34286748-70.64480283-29.34286747-26.75379095 0-51.90482023 10.47959553-70.76809217 29.34286747L33.39070759 700.01627278c-18.86327195 18.86327195-29.34286748 44.1375906-29.3428675 70.76809217 0 26.75379095 10.47959553 51.90482023 29.3428675 70.76809219l131.05658883 131.05658883c30.08260365 30.205893 71.63111769 47.34311394 114.28923598 47.34311394 9.00012323 0 17.63037836-0.73973616 26.13734414-2.21920846 166.19405621-27.37023774 331.03192945-115.76870829 464.06114804-248.67463751C901.84095379 636.27567408 990.11613498 471.56109018 1017.85624079 304.87387654c8.38367642-50.91850535-8.50696579-103.31648302-45.24719482-140.30329077z",
        special: true
      },
      {
        key: "qq",
        viewBox: [1024, 1024],
        path: "M910.60451556 640.96028445c-20.38897778-65.49959112-43.83630221-120.54983112-79.89930667-210.64362666C836.31217778 193.67708444 737.93535999 2.27555556 511.36284444 2.27555556 282.24170667 2.27555556 186.03121778 197.50001778 192.14791111 430.31665779c-36.19043555 90.22122667-59.51032888 144.88917333-79.89930667 210.64362666-43.32657778 139.53706668-29.30915556 197.26336001-18.60494222 198.53767111 22.9376 2.80348444 89.32920888-105.00323556 89.32920889-105.00323556 0 62.44124445 32.11264001 143.86972444 101.69002667 202.61546667-33.64181333 10.32192-109.20846222 38.10190221-91.24067556 68.55793777 14.52714667 24.59420444 250.01984 15.67402668 317.94062222 8.02816 67.92078222 7.64586667 303.41347556 16.56604444 317.94062223-8.02816 17.96778667-30.32860444-57.72629333-58.23601779-91.24067555-68.55793777 69.57738667-58.87317334 101.69002667-140.30165333 101.69002667-202.61546667 0 0 66.39160889 107.80672 89.32920888 105.00323556 10.83164445-1.40174222 24.84906667-59.12803556-18.47751111-198.53767111z",
        special: true
      },
      {
        key: "twitter",
        viewBox: [1024, 1024],
        path: "M1016.86992592 199.24764445c-37.13706667 16.01991111-77.55093333 27.54939259-119.17842962 32.03982222 42.96248889-25.60758518 75.60912592-66.02145185 91.02222222-114.08118519-39.68568889 23.66577778-84.58998518 41.02068148-131.31472593 50.00154074C819.53374815 126.79395555 765.76995555 101.79318518 706.18074075 101.79318518c-114.688 0-206.92385185 92.96402963-206.92385186 207.04521482 0 16.01991111 1.94180741 32.03982222 5.09724444 47.45291852-171.72859259-8.98085925-324.88865185-91.02222222-426.71217778-216.63288889-17.96171852 30.82619259-28.15620741 66.02145185-28.1562074 104.49351112 0 71.84687408 36.53025185 135.19834075 92.23585185 172.45677036-33.98162963-1.33499259-66.02145185-10.92266667-93.57084445-26.33576296v2.54862222c0 100.6098963 71.1186963 183.98625185 165.90317037 203.1616-17.3549037 4.49042963-35.92343703 7.03905185-54.49197037 7.03905185-13.47128889 0-26.2144-1.33499259-39.07887407-3.15543704C146.69748148 681.90814815 223.03478518 741.49736297 313.93564445 743.43917037c-71.1186963 55.7056-160.19911111 88.4736-256.9253926 88.4736-17.3549037 0-33.37481482-0.60681482-50.00154074-2.54862222C98.75911111 888.22518518 207.62168889 922.20681482 324.85831111 922.20681482 705.45256297 922.20681482 913.71140741 606.90583703 913.71140741 333.23235555c0-8.98085925 0-17.96171852-0.60681482-26.94257777 40.2925037-29.4912 75.60912592-66.02145185 103.76533333-107.04213333z",
        special: true
      },
      {
        key: "funnel",
        viewBox: [1024, 1024],
        path: "M917.96720197 1.08889505H106.03279803C53.56084718 1.08889505 9.37393998 45.27580225 9.37393998 97.74775309v5.52336372c0 19.33177108 8.28504494 41.42522469 22.0934536 55.23363205l331.40179753 392.15879462v325.87843379c0 16.57008987 8.28504494 30.37849854 22.09345359 35.90186098l209.88780469 104.94390299 2.76168121 2.76168121c27.61681602 11.04672615 55.23363335-8.28504494 55.23363335-38.66354218V550.66354348l331.40179753-392.15879462c35.90186097-41.42522469 30.37849854-102.18222047-11.04672616-135.32240022-11.04672615-13.80840865-33.14017975-22.0934536-55.23363335-22.09345359z",
        special: true
      },
      {
        key: "crown",
        viewBox: [1024, 1024],
        path: "M491.70164031 97.48884502a25.89076502 25.89076502 0 0 1 40.59671938 0L745.66415762 367.01171317a25.89076502 25.89076502 0 0 0 30.49932208 7.72839349l208.00640948-89.14190458a25.89076502 25.89076502 0 0 1 35.56096592 29.06238339l-115.18801541 554.96855704A103.56306132 103.56306132 0 0 1 803.14165689 952.14301275H220.85834311a103.56306132 103.56306132 0 0 1-101.4011828-82.51387024l-115.18801541-554.96855704a25.89076502 25.89076502 0 0 1 35.54802012-29.06238339l208.01935528 89.14190458a25.89076502 25.89076502 0 0 0 30.49932208-7.72839349l213.36579793-269.52286815z",
        special: true
      },
      {
        key: "like",
        viewBox: [1024, 1024],
        path: "M643.02466884 387.7801525c19.85376751-88.69205333 33.718272-152.84087467 41.61900049-192.57389433C704.52292267 95.17283515 652.90057916 2.27555515 550.58614084 2.27555515c-92.26012484 0-138.59407685 45.84971417-165.91530666 137.49816969l-0.70087152 2.67605334c-16.40038399 74.13942085-41.47882668 131.61085116-74.6746315 172.73287031a189.06953915 189.06953915 0 0 1-143.04142182 70.44391902l-26.17434983 0.5606965C77.66380049 387.52529067 27.76177817 438.90551468 27.76177817 501.84374084V881.55022182c0 77.4144 62.25009818 140.17422182 139.05282766 140.17422303h492.82707951c101.23127467 0 191.59267516-63.995904 225.93535999-159.98976l102.37815468-286.22301868c26.04691951-72.82688-11.39234134-153.15945284-83.63303784-179.42300483a138.04612267 138.04612267 0 0 0-47.17499733-8.30850884H643.02466884z",
        special: true
      },
      {
        key: "user",
        viewBox: [1024, 1024],
        path: "M512 512c140.82958222 0 254.86222222-114.03264 254.86222222-254.86222222S652.82958222 2.27555555 512 2.27555555a254.78940445 254.78940445 0 0 0-254.86222222 254.86222223C257.13777778 397.96736 371.17041778 512 512 512z m0 72.81777778c-170.10232889 0-509.72444445 97.57582222-509.72444445 291.27111111v145.63555556h1019.4488889v-145.63555556c0-193.69528889-339.62211555-291.27111111-509.72444445-291.27111111z",
        special: true
      },
      {
        key: "fox",
        viewBox: [1024, 1024],
        path: "M1019.81297778 564.50161779l-138.89991111-472.51456c-8.66531556-25.99594668-29.43658667-43.45400889-57.21656889-43.45400891s-50.33528889 15.67402668-59.00060446 41.66997334l-92.00526221 274.48661334H351.69166222L259.6864 90.33045333c-8.66531556-25.99594668-31.22062222-41.66997333-59.00060444-41.66997332s-50.33528889 17.33063112-57.2165689 43.45400887L4.69674667 564.50161779c-5.22467555 17.33063112 1.78403556 36.44529778 15.67402667 46.89464887l491.11950221 368.27591113 492.77610666-368.27591113c13.76256-10.32192 20.77127111-29.43658667 15.54659557-46.89464887z",
        special: true
      },
      {
        key: "bird",
        viewBox: [1024, 1024],
        path: "M927.78951111 340.39277037c-12.01493333-47.81700741 12.01493333-124.03294815 89.08041481-150.97552592l-82.40545184-4.36906667s-31.19028148-109.22666667-174.27721483-118.9357037c-143.08693333-9.8304-236.65777778-3.64088889-236.65777777-3.6408889s106.07122963 67.47780741 63.5941926 187.74850371c-31.06891852 63.71555555-79.85682963 116.02299259-132.04290371 175.61220741-1.57771852 1.57771852-3.03407408 3.15543703-4.2477037 4.49042962C278.25493333 624.86755555 7.13007408 934.34311111 7.13007408 934.34311111c298.43152592 78.15774815 498.43768889-7.64586667 616.76657777-110.56165926 24.87940741-0.24272592 43.5693037-0.36408889 56.19105185-0.36408888 164.8109037 0 304.13558518-142.72284445 298.43152593-301.4656-3.88361482-109.1053037-38.71478518-133.74198518-50.72971852-181.5589926z",
        special: true
      },
      {
        key: "home",
        viewBox: [1024, 1024],
        path: "M997.8886764 504.17210418L537.2729208 43.89182982c-13.97838539-13.97838539-36.56745619-13.97838539-50.5458416 0L26.1113236 504.17210418c-13.41924998 13.41924998-21.02349164 31.64706454-21.02349163 50.65766867 0 39.47496036 32.09437288 71.56933323 71.56933324 71.56933323h48.53295408V954.83524937c0 19.79339373 15.99127289 35.78466661 35.78466663 35.78466662H440.43066677V740.12724968h125.24633315v250.49266631h297.34821416c19.79339373 0 35.78466661-15.99127289 35.78466663-35.78466662V626.39910608h48.53295408c19.01060414 0 37.23841869-7.49241457 50.65766869-21.02349163 27.84494371-27.95677079 27.84494371-73.24673948-0.11182708-101.20351027z",
        special: true
      },
      {
        key: "pin",
        viewBox: [1024, 1024],
        path: "M1009.13013121 349.27572283L674.72427717 14.86986879c-8.82158299-8.82158299-20.35749924-13.16451618-31.89341544-13.16451618s-23.07183245 4.34293316-31.89341547 13.16451618L392.29790453 233.6451272c-16.5574327-1.90003326-33.25058207-2.71433322-49.94373146-2.71433324-99.34459624 0-198.68919249 32.70771543-280.25490606 98.12314628-20.90036589 16.69314938-22.52896582 48.04369819-3.66434987 67.04403081l246.59717401 246.59717401-292.33368895 292.06225564c-3.52863319 3.52863319-5.83581644 8.27871636-6.24296642 13.30023282l-4.61436649 50.48659809c-1.22144996 12.75736619 8.95729967 23.6146991 21.57894918 23.6146991 0.6785833 0 1.35716662 0 2.03574992-0.13571666l50.48659809-4.61436649c5.02151649-0.40714999 9.77159962-2.71433322 13.30023282-6.24296643l292.33368896-292.33368896 246.59717402 246.59717401c8.82158299 8.82158299 20.35749924 13.16451618 31.89341544 13.16451618 13.16451618 0 26.19331567-5.70009979 35.15061536-16.82886604 76.40848044-95.40881307 108.16617924-214.83947521 95.27309638-330.33435417l218.63954175-218.63954173c17.50744934-17.37173267 17.50744934-45.8722316 0-63.51539759z",
        special: true
      },
      {
        key: "wrench",
        viewBox: [1024, 1024],
        path: "M976.62005979 160.47737905c-0.39452595-0.39452595-80.35178503 78.64217259-239.47725131 237.50462156l-111.6508437-111.65084369 237.89914752-237.89914752c-125.19623464-75.35445635-286.03131335-56.02268482-390.31767264 48.26367449-81.92988882 81.92988882-112.57140424 200.15616502-83.37648398 310.09739626l2.36715569 8.81107954-372.82702222 372.69551356c-8.15353628 8.15353628-8.15353628 21.56741857 0 29.72095487l185.95323084 185.95323084c8.15353628 8.15353628 21.56741857 8.15353628 29.72095485 0l372.56400493-372.56400493 8.81107953 2.3671557c110.07273989 29.32642892 228.29901608-1.18357785 310.36041356-83.24497533 104.41786795-104.2863593 123.74963948-265.12143802 49.97328693-390.05465535z",
        special: true
      },
      {
        key: "roundCheck",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m220.16 343.26755556l-239.616 332.23111111c-14.44977778 20.13866667-44.37333333 20.13866667-58.82311111 0L291.84 481.16622222c-4.32355555-6.03022222 0-14.44977778 7.39555555-14.44977777h53.36177778c11.60533333 0 22.64177778 5.57511111 29.46844445 15.13244444l81.00977777 112.41244444 178.85866667-248.03555555c6.82666667-9.44355555 17.74933333-15.13244445 29.46844445-15.13244445H724.76444445c7.39555555 0 11.71911111 8.41955555 7.39555555 14.44977778z",
        special: true
      },
      {
        key: "roundMinus",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m218.45333333 537.03111112c0 5.00622222-4.096 9.10222222-9.10222222 9.10222222H302.64888889c-5.00622222 0-9.10222222-4.096-9.10222222-9.10222222v-54.61333334c0-5.00622222 4.096-9.10222222 9.10222222-9.10222222h418.70222222c5.00622222 0 9.10222222 4.096 9.10222222 9.10222222v54.61333334z",
        special: true
      },
      {
        key: "roundMultiply",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m188.18844445 703.37422223l-75.09333334-0.34133333L512 570.48177778l-112.98133333 134.71288889-75.20711112 0.34133333c-5.00622222 0-9.10222222-3.98222222-9.10222222-9.10222222 0-2.16177778 0.79644445-4.20977778 2.16177778-5.91644445l148.02488889-176.35555555L316.87111111 337.92c-1.36533333-1.70666667-2.16177778-3.75466667-2.16177778-5.91644445 0-5.00622222 4.096-9.10222222 9.10222222-9.10222222l75.20711112 0.34133334L512 458.06933333l112.98133333-134.71288888 75.09333334-0.34133334c5.00622222 0 9.10222222 3.98222222 9.10222222 9.10222222 0 2.16177778-0.79644445 4.20977778-2.16177778 5.91644445L559.21777778 514.27555555l147.91111111 176.35555556c1.36533333 1.70666667 2.16177778 3.75466667 2.16177778 5.91644444 0 5.00622222-4.096 9.10222222-9.10222222 9.10222223z",
        special: true
      },
      {
        key: "roundPlus",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m218.45333333 537.03111112c0 5.00622222-4.096 9.10222222-9.10222222 9.10222222H548.40888889v172.94222222c0 5.00622222-4.096 9.10222222-9.10222222 9.10222222h-54.61333334c-5.00622222 0-9.10222222-4.096-9.10222222-9.10222222V548.40888889H302.64888889c-5.00622222 0-9.10222222-4.096-9.10222222-9.10222222v-54.61333334c0-5.00622222 4.096-9.10222222 9.10222222-9.10222222h172.94222222V302.64888889c0-5.00622222 4.096-9.10222222 9.10222222-9.10222222h54.61333334c5.00622222 0 9.10222222 4.096 9.10222222 9.10222222v172.94222222h172.94222222c5.00622222 0 9.10222222 4.096 9.10222222 9.10222222v54.61333334z",
        special: true
      },
      {
        key: "roundPlay",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m163.95377778 517.57511112L427.46311111 700.64355555c-1.59288889 1.13777778-3.41333333 1.70666667-5.34755556 1.70666667-5.00622222 0-9.10222222-4.096-9.10222222-9.10222222V331.88977778c0-1.93422222 0.56888889-3.75466667 1.70666667-5.34755556 2.95822222-4.096 8.64711111-5.00622222 12.74311111-2.048L675.95377778 505.17333333c0.79644445 0.56888889 1.47911111 1.25155555 2.048 2.048 2.95822222 3.98222222 2.048 9.67111111-2.048 12.62933334z",
        special: true
      },
      {
        key: "clock",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m200.81777778 666.39644445l-32.54044445 44.37333333c-2.95822222 4.096-8.64711111 4.89244445-12.74311111 1.93422222L479.34577778 577.76355555c-2.38933333-1.70666667-3.75466667-4.43733333-3.75466667-7.39555555V257.13777778c0-5.00622222 4.096-9.10222222 9.10222222-9.10222223h54.72711112c5.00622222 0 9.10222222 4.096 9.10222222 9.10222223v281.6l162.24711111 117.30488889c4.096 2.84444445 5.00622222 8.53333333 2.048 12.62933333z",
        special: true
      },
      {
        key: "unreadMessage",
        viewBox: [1024, 1024],
        path: "M981.10577778 314.48177778c-25.6-61.09866667-62.464-115.93955555-109.34044445-163.04355556-46.87644445-46.99022222-101.60355555-83.968-162.70222222-109.568C646.59911111 15.58755555 580.38044445 2.27555555 512 2.27555555h-2.27555555c-68.83555555 0.34133333-135.39555555 13.99466667-198.08711112 40.84622223-60.52977778 25.94133333-114.80177778 62.80533333-161.22311111 109.79555555-46.42133333 46.99022222-82.83022222 101.60355555-108.08888889 162.47466667C16.27022222 378.42488889 3.072 445.44 3.41333333 514.38933333c0.34133333 78.96177778 19.22844445 157.35466667 54.49955556 227.44177778v172.94222222c0 28.89955555 23.43822222 52.33777778 52.224 52.33777778h172.71466666c69.97333333 35.38488889 148.13866667 54.272 226.98666667 54.61333334h2.38933333c68.03911111 0 133.91644445-13.19822222 196.03911112-39.02577778 60.75733333-25.37244445 115.37066667-61.78133333 162.13333333-108.31644445 46.87644445-46.53511111 83.74044445-100.92088889 109.568-161.56444444 26.73777778-62.80533333 40.39111111-129.59288889 40.73244445-198.54222223 0.22755555-69.29066667-13.19822222-136.53333333-39.59466667-199.79377777zM284.89955555 566.61333333c-30.03733333 0-54.49955555-24.46222222-54.49955555-54.61333333s24.46222222-54.61333333 54.49955555-54.61333333 54.49955555 24.46222222 54.49955556 54.61333333-24.34844445 54.61333333-54.49955556 54.61333333z m227.10044445 0c-30.03733333 0-54.49955555-24.46222222-54.49955555-54.61333333s24.46222222-54.61333333 54.49955555-54.61333333 54.49955555 24.46222222 54.49955555 54.61333333-24.46222222 54.61333333-54.49955555 54.61333333z m227.10044445 0c-30.03733333 0-54.49955555-24.46222222-54.49955556-54.61333333s24.46222222-54.61333333 54.49955556-54.61333333 54.49955555 24.46222222 54.49955555 54.61333333-24.46222222 54.61333333-54.49955555 54.61333333z",
        special: true
      },
      {
        key: "rectCheck",
        viewBox: [1024, 1024],
        path: "M980.2224823 3.06251924H43.7775177c-22.52048353 0-40.71499847 18.19451494-40.71499846 40.71499846v936.4449646c0 22.52048353 18.19451494 40.71499847 40.71499846 40.71499846h936.4449646c22.52048353 0 40.71499847-18.19451494 40.71499846-40.71499846V43.7775177c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499846zM745.4750693 325.8561164l-267.95558363 371.52436096c-16.15876501 22.52048353-49.62140436 22.52048353-65.78016939 0L253.07805667 477.51948567c-4.83490607-6.74342161 0-16.15876501 8.27023406-16.15876499h59.67291961c12.97790576 0 25.31963967 6.23448413 32.95370188 16.92217123l90.59087157 125.70755774 200.01242995-277.37092701c7.63406221-10.56045272 19.84856175-16.92217125 32.95370189-16.92217124H737.20483524c8.27023407 0 13.10514012 9.41534338 8.27023406 16.158765z",
        special: true
      },
      {
        key: "rectMinus",
        viewBox: [1024, 1024],
        path: "M980.2224823 3.06251924H43.7775177c-22.52048353 0-40.71499847 18.19451494-40.71499846 40.71499846v936.4449646c0 22.52048353 18.19451494 40.71499847 40.71499846 40.71499846h936.4449646c22.52048353 0 40.71499847-18.19451494 40.71499846-40.71499846V43.7775177c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499846zM756.28999077 542.53624885c0 5.59831228-4.58043732 10.17874961-10.17874962 10.17874962H277.88875885c-5.59831228 0-10.17874961-4.58043732-10.17874962-10.17874962v-61.0724977c0-5.59831228 4.58043732-10.17874961 10.17874962-10.17874962h468.2224823c5.59831228 0 10.17874961 4.58043732 10.17874962 10.17874962v61.0724977z",
        special: true
      },
      {
        key: "rectMultiply",
        viewBox: [1024, 1024],
        path: "M980.2224823 3.06251924H43.7775177c-22.52048353 0-40.71499847 18.19451494-40.71499846 40.71499846v936.4449646c0 22.52048353 18.19451494 40.71499847 40.71499846 40.71499846h936.4449646c22.52048353 0 40.71499847-18.19451494 40.71499846-40.71499846V43.7775177c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499846zM720.79160148 697.63494611c5.59831228 6.61618726 0.8906406 16.6677025-7.76129658 16.66770249h-74.94104404c-5.98001539 0-11.70556205-2.67192177-15.64982754-7.25235911L512 575.36271635l-110.43943332 131.68757314c-3.81703111 4.58043732-9.54257777 7.25235911-15.64982754 7.25235911H310.9696951c-8.65193717 0-13.35960887-10.05151525-7.76129658-16.66770249L458.81603326 512 303.20839852 326.36505389c-5.59831228-6.61618726-0.8906406-16.6677025 7.76129658-16.66770249h74.94104404c5.98001539 0 11.70556205 2.67192177 15.64982754 7.25235911L512 448.63728365l110.43943332-131.68757314c3.81703111-4.58043732 9.54257777-7.25235911 15.64982754-7.25235911H713.0303049c8.65193717 0 13.35960887 10.05151525 7.76129658 16.66770249L565.18396674 512l155.60763474 185.63494611z",
        special: true
      },
      {
        key: "rectPlay",
        viewBox: [1024, 1024],
        path: "M980.2224823 3.06251924H43.7775177c-22.52048353 0-40.71499847 18.19451494-40.71499846 40.71499846v936.4449646c0 22.52048353 18.19451494 40.71499847 40.71499846 40.71499846h936.4449646c22.52048353 0 40.71499847-18.19451494 40.71499846-40.71499846V43.7775177c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499846zM677.02297814 523.19662459L423.31764398 722.70011704c-9.41534338 7.37959347-23.28388974 0.76340622-23.28388975-11.19662459V312.62374191c0-11.9600308 13.86854636-18.70345241 23.28388975-11.19662457l253.70533416 199.37625807c7.25235911 5.72554666 7.25235911 16.6677025 0 22.39324918z",
        special: true
      },
      {
        key: "rectPlus",
        viewBox: [1024, 1024],
        path: "M980.2224823 3.06251924H43.7775177c-22.52048353 0-40.71499847 18.19451494-40.71499846 40.71499846v936.4449646c0 22.52048353 18.19451494 40.71499847 40.71499846 40.71499846h936.4449646c22.52048353 0 40.71499847-18.19451494 40.71499846-40.71499846V43.7775177c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499846zM756.28999077 542.53624885c0 5.59831228-4.58043732 10.17874961-10.17874962 10.17874962H552.71499847v193.39624268c0 5.59831228-4.58043732 10.17874961-10.17874962 10.17874962h-61.0724977c-5.59831228 0-10.17874961-4.58043732-10.17874962-10.17874962V552.71499847H277.88875885c-5.59831228 0-10.17874961-4.58043732-10.17874962-10.17874962v-61.0724977c0-5.59831228 4.58043732-10.17874961 10.17874962-10.17874962h193.39624268V277.88875885c0-5.59831228 4.58043732-10.17874961 10.17874962-10.17874962h61.0724977c5.59831228 0 10.17874961 4.58043732 10.17874962 10.17874962v193.39624268h193.39624268c5.59831228 0 10.17874961 4.58043732 10.17874962 10.17874962v61.0724977z",
        special: true
      },
      {
        key: "tokenCheck",
        viewBox: [1024, 1024],
        path: "M902.67315697 135.41705551L528.62204754 7.94466448C524.10877635 6.40354749 518.05438818 5.63298899 512 5.63298899s-12.10877635 0.7705585-16.62204754 2.31167549L121.32684303 135.41705551c-9.13662215 3.08223399-16.62204754 13.64989334-16.62204753 23.33691443v531.02488283c0 9.68702108 6.27454775 22.45627614 13.87005291 28.51066431L498.0198673 1013.9638196c3.85279247 2.9721542 8.8063828 4.51327118 13.87005291 4.51327118s10.12734022-1.54111698 13.87005291-4.51327118l379.4450189-295.67430252c7.59550517-5.94430839 13.87005291-18.71356345 13.87005291-28.51066431V158.75396994c0.22015956-9.68702108-7.26526581-20.14460066-16.40188796-23.33691443zM712.89560763 323.43332829L478.86598471 645.63685899c-7.04510625 9.68702108-21.57563786 9.68702108-28.6207441 0l-139.14084824-191.5388259c-4.18303182-5.8342286 0-13.9801327 7.15518603-13.9801327h60.76404132c5.61406904 0 11.0079785 2.75199463 14.31037204 7.26526582l71.22162091 97.97100864 166.11039557-228.74579323c3.30239355-4.51327118 8.58622323-7.26526581 14.31037204-7.26526581H705.7404216c7.15518602 0.11007979 11.33821785 8.25598388 7.15518603 14.09021248z",
        special: true
      },
      {
        key: "trash",
        viewBox: [1024, 1024],
        path: "M959.86498307 186.28001231H797.00498922v-101.78749614c0-44.91373267-36.51626425-81.42999692-81.42999691-81.42999693H308.42500769c-44.91373267 0-81.42999692 36.51626425-81.42999691 81.42999693v101.78749614H64.13501693c-22.52048353 0-40.71499847 18.19451494-40.71499846 40.71499847v40.71499845c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874962h76.8495596l31.42688945 665.43575611c2.03574992 43.38692024 37.91584233 77.61296581 81.30276254 77.6129658h577.64404066c43.5141546 0 79.26701262-34.09881122 81.30276254-77.6129658l31.42688945-665.43575611H990.40123192c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874962v-40.71499845c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499847z m-254.46874039 0H318.60375732v-91.60874653h386.79248536v91.60874653z",
        special: true
      },
      {
        key: "waveFlag",
        viewBox: [1024, 1024],
        path: "M980.2224823 248.62485371H654.50249462V104.85001539c0-22.52048353-18.19451494-40.71499847-40.71499847-40.71499846H94.67126578v-50.89374808c0-5.59831228-4.58043732-10.17874961-10.17874961-10.17874961h-71.25124732c-5.59831228 0-10.17874961 4.58043732-10.17874961 10.17874961v997.5174623c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874961h71.25124732c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874961V674.85999383h315.54123807v143.77483833c0 22.52048353 18.19451494 40.71499847 40.71499846 40.71499846h529.29497999c22.52048353 0 40.71499847-18.19451494 40.71499846-40.71499846V289.33985217c0-22.52048353-18.19451494-40.71499847-40.71499846-40.71499846z",
        special: true
      },
      {
        key: "hourglass",
        viewBox: [1024, 1024],
        path: "M804.63905145 265.16532183V94.67126578h109.42155836c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874961v-71.25124732c0-5.59831228-4.58043732-10.17874961-10.17874961-10.17874961H109.93939019c-5.59831228 0-10.17874961 4.58043732-10.17874961 10.17874961v71.25124732c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874961h109.42155836v170.49405605c0 103.6960117 53.94737296 194.92305513 135.3773699 246.83467817-81.42999692 51.91162303-135.37736988 143.13866646-135.3773699 246.83467817v170.49405605h-109.42155836c-5.59831228 0-10.17874961 4.58043732-10.17874961 10.17874961v71.25124732c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874961h804.12121962c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874961v-71.25124732c0-5.59831228-4.58043732-10.17874961-10.17874961-10.17874961h-109.42155836V758.83467817c0-103.6960117-53.94737296-194.92305513-135.3773699-246.83467817 81.42999692-51.91162303 135.37736988-143.13866646 135.3773699-246.83467817z",
        special: true
      },
      {
        key: "label",
        viewBox: [1024, 1024],
        path: "M1020.928 448.44373333l-35.36213334-373.4528c-1.79200001-19.3536-17.2032-34.64533332-36.55679999-36.55679999L575.55626667 3.072h-0.47786666c-3.82293334 0-6.8096 1.19466667-9.07946669 3.46453333L6.53653333 565.99893332c-4.65919999 4.65919999-4.65919999 12.1856 0 16.84480001l434.61973334 434.61973334c2.26986667 2.26986667 5.25653333 3.46453333 8.48213333 3.46453333s6.21226667-1.19466667 8.48213333-3.46453333l559.46239999-559.46239999c2.38933332-2.5088 3.584-5.97333334 3.34506668-9.55733335zM735.40266668 362.66666667c-42.17173333 0-76.45866667-34.28693333-76.45866667-76.45866667s34.28693333-76.45866667 76.45866667-76.45866667 76.45866667 34.28693333 76.45866665 76.45866667-34.28693333 76.45866667-76.45866665 76.45866667z",
        special: true
      }
    ]
  },
  {
    key: "LineShapes",
    type: "线性",
    children: [
      {
        key: "percentLine",
        viewBox: [1024, 1024],
        path: "M1009.55537674 75.96950982l-61.38012212-61.38012214c-4.48769762-4.48769762-11.870684-4.48769762-16.3583816 0L14.44462326 931.67210859c-4.48769762 4.48769762-4.48769762 11.870684 0 16.35838159l61.38012212 61.38012214c4.48769762 4.48769762 11.870684 4.48769762 16.3583816 0L1009.41061232 92.18312698c4.63246205-4.34293316 4.63246205-11.72591956 0.14476442-16.21361716zM210.88996692 419.35075905c114.94296453 0 208.46079213-93.51782759 208.46079213-208.46079213s-93.51782759-208.46079213-208.46079213-208.4607921-208.46079213 93.51782759-208.4607921 208.4607921 93.51782759 208.46079213 208.4607921 208.46079213z m0-312.69118816c57.47148228 0 104.23039605 46.75891379 104.23039607 104.23039603s-46.75891379 104.23039605-104.23039607 104.23039607-104.23039605-46.75891379-104.23039603-104.23039607 46.75891379-104.23039605 104.23039603-104.23039603zM813.11003308 604.64924095c-114.94296453 0-208.46079213 93.51782759-208.46079213 208.46079213s93.51782759 208.46079213 208.46079213 208.4607921 208.46079213-93.51782759 208.4607921-208.4607921-93.51782759-208.46079213-208.4607921-208.46079213z m0 312.69118816c-57.47148228 0-104.23039605-46.75891379-104.23039607-104.23039603s46.75891379-104.23039605 104.23039607-104.23039607 104.23039605 46.75891379 104.23039603 104.23039607-46.75891379 104.23039605-104.23039603 104.23039603z",
        special: true,
        outlined: true
      },
      {
        key: "rightArrowLine",
        viewBox: [1024, 1024],
        path: "M1004.96017383 478.58365209L483.27851088 25.80594621c-4.00443838-3.45210207-9.11354943-5.3852792-14.49882864-5.38527921h-122.20441284c-10.21822208 0-14.91308089 12.70373557-7.18037228 19.33177152l483.57045622 419.77561022H14.8973037c-6.07569962 0-11.04672658 4.97102697-11.04672658 11.04672657v82.85044938c0 6.07569962 4.97102697 11.04672658 11.04672658 11.04672657h807.92996557L339.25681303 984.24756148c-7.7327086 6.76612003-3.0378498 19.33177153 7.18037229 19.33177152h126.34693531c2.62359757 0 5.24719513-0.96658859 7.18037228-2.76168164L1004.96017383 545.41634791c20.2983601-17.67476253 20.2983601-49.1579333 0-66.83269582z",
        special: true,
        outlined: true
      },
      {
        key: "topArrowLine",
        viewBox: [1024, 1024],
        path: "M1011.38217956 558.9924242L545.80649025 22.43713295c-17.81503843-20.62055629-49.79794206-20.62055629-67.75325638 0L12.61782044 558.9924242c-6.31241519 7.29434645-1.12220714 18.51641789 8.41655359 18.51641789h113.62347344c6.45269109 0 12.62483038-2.80551785 16.97338308-7.71517411L458.69516062 215.87758959V1005.77114384c0 6.1721393 5.04993216 11.22207145 11.22207144 11.22207145h84.16553588c6.1721393 0 11.22207145-5.04993216 11.22207144-11.22207145V215.87758959l307.06393007 353.91607839c4.20827679 4.90965626 10.38041608 7.71517413 16.97338308 7.71517411h113.62347344c9.53876074 0 14.72896878-11.22207145 8.41655359-18.51641789z",
        special: true,
        outlined: true
      },
      {
        key: "leftArrowLine",
        viewBox: [1024, 1024],
        path: "M1009.1026963 459.52804874H201.17273073l483.57045624-419.77561022c7.7327086-6.76612003 3.0378498-19.33177153-7.18037229-19.33177152h-122.20441283c-5.3852792 0-10.49439025 1.93317715-14.49882866 5.38527921L19.03982617 478.58365209c-20.2983601 17.67476253-20.2983601 49.1579333 0 66.69461175L543.89742302 1000.81765136c2.07126124 1.79509307 4.55677472 2.76168163 7.18037228 2.76168164h126.3469353c10.21822208 0 14.91308089-12.70373557 7.18037228-19.33177152L201.17273073 564.47195126H1009.1026963c6.07569962 0 11.04672658-4.97102697 11.04672658-11.04672657v-82.85044938c0-6.07569962-4.97102697-11.04672658-11.04672658-11.04672657z",
        special: true,
        outlined: true
      },
      {
        key: "downArrowLine",
        viewBox: [1024, 1024],
        path: "M1002.96562597 446.49115791h-113.62347344c-6.45269109 0-12.62483038 2.80551785-16.97338308 7.71517411L565.30483938 808.12241041V18.22885616c0-6.1721393-5.04993216-11.22207145-11.22207144-11.22207145h-84.16553588c-6.1721393 0-11.22207145 5.04993216-11.22207144 11.22207145v789.89355425L151.63123055 454.20633202c-4.20827679-4.90965626-10.38041608-7.71517413-16.97338308-7.71517411h-113.62347344c-9.53876074 0-14.72896878 11.36234735-8.41655359 18.51641789L478.19350975 1001.56286705c17.81503843 20.62055629 49.79794206 20.62055629 67.75325638 0L1011.38217956 465.0075758c6.31241519-7.29434645 1.12220714-18.51641789-8.41655359-18.51641789z",
        special: true,
        outlined: true
      },
      {
        key: "reactionArrowLine",
        viewBox: [1024, 1024],
        path: "M975.82443246 622.46726585H14.8973037c-6.07569962 0-11.04672658 4.97102697-11.04672658 11.04672658v82.85044937c0 6.07569962 4.97102697 11.04672658 11.04672658 11.04672659h835.6848661L651.32683905 980.10503902c-5.66144737 7.18037229-0.55233633 17.9509307 8.69929718 17.9509307h100.11095967c6.76612003 0 13.11798782-3.0378498 17.39859437-8.42312903l233.08593092-295.63802022c22.78387358-28.99765728 2.20934532-71.52755463-34.79718873-71.52755462zM1009.1026963 296.58883161H173.4178302l199.25533075-252.69387063c5.66144737-7.18037229 0.55233633-17.9509307-8.69929718-17.9509307h-100.11095967c-6.76612003 0-13.11798782 3.0378498-17.39859437 8.42312903L13.37837881 330.00517953c-22.78387358 28.99765728-2.20934532 71.52755463 34.65910466 71.52755462h961.06521283c6.07569962 0 11.04672658-4.97102697 11.04672658-11.04672658v-82.85044937c0-6.07569962-4.97102697-11.04672658-11.04672658-11.04672659z",
        special: true,
        outlined: true
      },
      {
        key: "tripleBarLine",
        viewBox: [1024, 1024],
        path: "M1010.75873115 64.13501693H13.24126885c-5.59831228 0-10.17874961 4.58043732-10.17874961 10.17874961v81.42999691c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874964h997.5174623c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874964v-81.42999691c0-5.59831228-4.58043732-10.17874961-10.17874961-10.17874961zM1010.75873115 858.07748691H13.24126885c-5.59831228 0-10.17874961 4.58043732-10.17874961 10.17874964v81.42999691c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874961h997.5174623c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874961v-81.42999691c0-5.59831228-4.58043732-10.17874961-10.17874961-10.17874964zM1010.75873115 461.10625194H13.24126885c-5.59831228 0-10.17874961 4.58043732-10.17874961 10.17874959v81.42999694c0 5.59831228 4.58043732 10.17874961 10.17874961 10.17874959h997.5174623c5.59831228 0 10.17874961-4.58043732 10.17874961-10.17874959v-81.42999694c0-5.59831228-4.58043732-10.17874961-10.17874961-10.17874959z",
        special: true,
        outlined: true
      },
      {
        key: "crossLine",
        viewBox: [1024, 1024],
        path: "M591.98717801 512l405.34042913-483.16579151c6.79427767-8.02960089 1.08090782-20.22841761-9.41933951-20.2284176h-123.22349044c-7.25752386 0-14.20621693 3.24272343-18.99309439 8.80167789L511.38233839 415.95362022 177.07299399 17.40746878c-4.63246205-5.55895447-11.58115512-8.80167789-18.99309439-8.80167789H34.85640916c-10.50024731 0-16.21361717 12.19881672-9.41933952 20.2284176L430.77749876 512 25.43706964 995.16579151c-6.79427767 8.02960089-1.08090782 20.22841761 9.41933952 20.2284176h123.22349044c7.25752386 0 14.20621693-3.24272343 18.99309439-8.80167789l334.3093444-398.54615144 334.30934441 398.54615144c4.63246205 5.55895447 11.58115512 8.80167789 18.99309439 8.80167789h123.22349044c10.50024731 0 16.21361717-12.19881672 9.41933951-20.2284176L591.98717801 512z",
        special: true,
        outlined: true
      },
      {
        key: "userLine",
        viewBox: [1024, 1024],
        path: "M953.5488 832.61667556c-24.08448-57.08913778-58.74574221-108.31644445-102.70947556-152.28017777-43.96373333-43.96373333-95.19104-78.49756444-152.28017777-102.70947558-0.50972445-0.25486222-1.01944888-0.38229333-1.52917334-0.63715555C776.41955556 519.64586667 828.02915556 426.23886221 828.02915556 320.85333332c0-174.58062221-141.44853334-316.02915556-316.02915556-316.02915554S195.97084444 146.27271111 195.97084444 320.85333332c0 105.38552889 51.6096 198.79253333 130.99918223 256.26396447-0.50972445 0.25486222-1.01944888 0.38229333-1.52917334 0.63715555-57.08913778 24.08448-108.31644445 58.61831112-152.28017777 102.70947554-43.96373333 43.96373333-78.49756444 95.19104-102.70947556 152.28017779C46.74901333 888.55893332 34.13333334 947.8144 32.85902222 1008.72647111c-0.12743111 5.7344 4.46008889 10.44935111 10.19448889 10.44935111h76.45866667c5.60696888 0 10.06705778-4.46008889 10.19448889-9.93962666 2.54862221-98.37681778 42.05226667-190.50951112 111.88451555-260.34176001 72.25344-72.25344 168.20906666-112.01194667 270.40881778-112.01194667s198.15537778 39.75850667 270.40881778 112.01194667C852.24106667 818.72668444 891.74471111 910.85937779 894.29333333 1009.23619556c0.12743111 5.60696888 4.58752 9.93962667 10.19448889 9.93962666h76.45866667c5.7344 0 10.32192-4.71495112 10.19448889-10.44935111-1.27431111-60.91207112-13.88999112-120.16753779-37.59217778-176.10979555zM512 540.03484444c-58.49088 0-113.54112-22.81016889-154.95623111-64.22527999S292.81848888 379.34421333 292.81848888 320.85333332c0-58.49088 22.81016889-113.54112 64.22528001-154.9562311S453.50912 101.67182221 512 101.67182221s113.54112 22.81016889 154.95623111 64.22528001S731.18151112 262.36245333 731.18151112 320.85333332c0 58.49088-22.81016889 113.54112-64.22528001 154.95623113S570.49088 540.03484444 512 540.03484444z",
        special: true,
        outlined: true
      },
      {
        key: "mailLine",
        viewBox: [1024, 1024],
        path: "M985.31555555 111.50222222H38.68444445c-20.13866667 0-36.40888889 16.27022222-36.4088889 36.40888889v728.17777778c0 20.13866667 16.27022222 36.40888889 36.4088889 36.40888889h946.6311111c20.13866667 0 36.40888889-16.27022222 36.4088889-36.40888889V147.91111111c0-20.13866667-16.27022222-36.40888889-36.4088889-36.40888889z m-45.5111111 126.06577778V830.57777778H84.19555555V237.568l-31.40266666-24.46222222 44.71466666-57.45777778 48.6968889 37.888h731.70488888l48.69688889-37.888 44.71466667 57.45777778-31.51644444 24.46222222z M877.90933333 193.42222222L512 477.86666667 146.09066667 193.42222222l-48.69688889-37.888-44.71466667 57.45777778 31.40266667 24.46222222 388.66488889 302.19377778c22.98311111 17.86311111 55.18222222 17.86311111 78.16533333 0L939.80444445 237.568l31.40266666-24.46222222-44.71466666-57.45777778-48.58311112 37.77422222z",
        special: true,
        outlined: true
      },
      {
        key: "screenLine",
        viewBox: [1024, 1024],
        path: "M985.31555555 88.74666667H38.68444445c-20.13866667 0-36.40888889 16.27022222-36.4088889 36.40888888v564.33777778c0 20.13866667 16.27022222 36.40888889 36.4088889 36.40888889h432.35555555v127.43111111H275.34222222c-10.01244445 0-18.20444445 8.192-18.20444444 18.20444445v54.61333333c0 5.00622222 4.096 9.10222222 9.10222222 9.10222222h491.52c5.00622222 0 9.10222222-4.096 9.10222222-9.10222222v-54.61333333c0-10.01244445-8.192-18.20444445-18.20444444-18.20444445H552.96V725.90222222h432.35555555c20.13866667 0 36.40888889-16.27022222 36.4088889-36.40888889V125.15555555c0-20.13866667-16.27022222-36.40888889-36.4088889-36.40888888z m-45.5111111 555.23555555H84.19555555V170.66666667h855.6088889v473.31555555z",
        special: true,
        outlined: true
      },
      {
        key: "NotAllowedLine",
        viewBox: [1024, 1024],
        path: "M512 2.27555555C230.51377778 2.27555555 2.27555555 230.51377778 2.27555555 512s228.23822222 509.72444445 509.72444445 509.72444445 509.72444445-228.23822222 509.72444445-509.72444445S793.48622222 2.27555555 512 2.27555555z m0 932.97777778c-233.69955555 0-423.25333333-189.55377778-423.25333333-423.25333333 0-101.26222222 35.61244445-194.33244445 95.00444444-267.15022222l595.39911111 595.39911111C706.33244445 899.64088889 613.26222222 935.25333333 512 935.25333333z m328.24888889-156.10311111L244.84977778 183.75111111C317.66755555 124.35911111 410.73777778 88.74666667 512 88.74666667c233.69955555 0 423.25333333 189.55377778 423.25333333 423.25333333 0 101.26222222-35.61244445 194.33244445-95.00444444 267.15022222z",
        special: true,
        outlined: true
      },
      {
        key: "fileLine",
        viewBox: [1024, 1024],
        path: "M901.80266667 257.82044445L656.95288889 12.97066667c-6.82666667-6.82666667-16.04266667-10.69511111-25.71377778-10.69511112H147.91111111c-20.13866667 0-36.40888889 16.27022222-36.40888889 36.4088889v946.6311111c0 20.13866667 16.27022222 36.40888889 36.40888889 36.4088889h728.17777778c20.13866667 0 36.40888889-16.27022222 36.40888889-36.4088889V283.648c0-9.67111111-3.86844445-19.00088889-10.69511111-25.82755555zM828.52977778 300.37333333H614.4V86.24355555L828.52977778 300.37333333z m2.048 639.43111112H193.42222222V84.19555555h343.60888889v245.76c0 26.39644445 21.39022222 47.78666667 47.78666667 47.78666667h245.76v562.06222223z",
        special: true,
        outlined: true
      },
      {
        key: "funnelLine",
        viewBox: [1024, 1024],
        path: "M981.07392 55.79662222H42.92608c-31.22062222 0-50.71758221 34.02410666-35.04355556 61.16693334L304.28728889 620.82616888V927.42542221c0 22.55530667 18.09521779 40.77795555 40.52309333 40.77795557h334.37923556c22.42787556 0 40.52309333-18.22264888 40.52309333-40.77795557V620.82616888L1016.24490667 116.96355556c15.54659555-27.14282666-3.95036444-61.16693333-35.17098667-61.16693334zM628.47203556 876.45297779H395.52796444V677.66044445h233.07150222v198.79253334z m12.23338666-301.50200891l-12.10595556 21.15356445h-233.19893332l-12.10595556-21.15356445L130.59868445 147.54702221h762.8026311L640.70542222 574.95096888z",
        special: true,
        outlined: true
      }
    ]
  }
];
const SHAPE_ARRAY = SHAPE_LIST.reduce((acc, cur) => {
  return acc.concat(cur.children);
}, []);
const ShapeComponent = (props) => {
  const {
    useConnect: useConnect2,
    id: id2,
    pageId,
    shapeKey,
    style,
    mode,
    treeNodeProps,
    setDefaultName,
    initStyleProps,
    // 预览端使用-初始样式
    styleMapProps
    // 预览端使用
  } = props;
  const {
    instanceMap,
    registerInstance,
    uninstallInstance
  } = useConnect2([]);
  const styleItem = styleMapProps && styleMapProps[id2] || {};
  reactExports.useEffect(() => {
    registerInstance(id2, {
      remove: () => {
        uninstallInstance(id2);
      },
      ...props
    });
    if (mode === "edit") {
      setDefaultName(instanceMap, props["x-component"]);
    }
  }, []);
  const { width, height } = style;
  const widthNumber = Number(width.replace("px", ""));
  const heightNumber = Number(height.replace("px", ""));
  const shape = SHAPE_ARRAY.find((item) => item.key === shapeKey);
  if (shape) {
    if (shape.pathFormula) {
      const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula];
      if ("editable" in pathFormula) {
        shape.viewBox = [widthNumber, heightNumber];
        shape.path = pathFormula.formula(widthNumber, heightNumber, pathFormula.defaultValue);
      } else {
        shape.path = pathFormula.formula(widthNumber, heightNumber);
      }
    }
  }
  const shapeStyle = {
    ...style,
    position: "absolute"
  };
  delete shapeStyle.borderStyle;
  const editRender = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shape-component", ...treeNodeProps, style: shapeStyle, children: shape && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: widthNumber, height: heightNumber, overflow: "visible", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "g",
      {
        transform: `scale(${widthNumber / shape.viewBox[0]}, ${heightNumber / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            vectorEffect: "non-scaling-stroke",
            strokeLinecap: "butt",
            strokeMiterlimit: "8",
            d: shape.path,
            fill: style.fill || "rgba(24,144,255,1)",
            stroke: style.borderStyle !== "none" ? style.borderColor || "rgba(0,0,255,1)" : "none",
            strokeWidth: style.borderWidth || 4,
            strokeDasharray: style.borderStyle === "dashed" ? "5,5" : style.borderStyle
          }
        )
      }
    ) }) });
  };
  const previewRender = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shape-component", "preview-id": id2, style: { ...shapeStyle, ...initStyleProps, ...styleItem }, children: shape && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: widthNumber, height: heightNumber, overflow: "visible", style: { pointerEvents: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "g",
      {
        transform: `scale(${widthNumber / shape.viewBox[0]}, ${heightNumber / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            vectorEffect: "non-scaling-stroke",
            strokeLinecap: "butt",
            strokeMiterlimit: "8",
            d: shape.path,
            fill: style.fill || "rgba(24,144,255,1)",
            stroke: style.borderStyle !== "none" ? style.borderColor || "rgba(0,0,255,1)" : "none",
            strokeWidth: style.borderWidth || 4,
            strokeDasharray: style.borderStyle === "dashed" ? "5,5" : style.borderStyle
          }
        )
      }
    ) }) });
  };
  return mode === "edit" ? editRender() : previewRender();
};
var classnames = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
(function(module) {
  (function() {
    var hasOwn = {}.hasOwnProperty;
    function classNames() {
      var classes = "";
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) {
          classes = appendClass(classes, parseValue(arg));
        }
      }
      return classes;
    }
    function parseValue(arg) {
      if (typeof arg === "string" || typeof arg === "number") {
        return arg;
      }
      if (typeof arg !== "object") {
        return "";
      }
      if (Array.isArray(arg)) {
        return classNames.apply(null, arg);
      }
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
        return arg.toString();
      }
      var classes = "";
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes = appendClass(classes, key);
        }
      }
      return classes;
    }
    function appendClass(value, newClass) {
      if (!newClass) {
        return value;
      }
      if (value) {
        return value + " " + newClass;
      }
      return value + newClass;
    }
    if (module.exports) {
      classNames.default = classNames;
      module.exports = classNames;
    } else {
      window.classNames = classNames;
    }
  })();
})(classnames);
var axios$3 = { exports: {} };
var bind$2 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
var bind$1 = bind$2;
var toString = Object.prototype.toString;
function isArray(val) {
  return toString.call(val) === "[object Array]";
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
}
function isArrayBuffer(val) {
  return toString.call(val) === "[object ArrayBuffer]";
}
function isFormData(val) {
  return typeof FormData !== "undefined" && val instanceof FormData;
}
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
function isObject$6(val) {
  return val !== null && typeof val === "object";
}
function isPlainObject$2(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
function isDate(val) {
  return toString.call(val) === "[object Date]";
}
function isFile(val) {
  return toString.call(val) === "[object File]";
}
function isBlob(val) {
  return toString.call(val) === "[object Blob]";
}
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}
function isStream(val) {
  return isObject$6(val) && isFunction(val.pipe);
}
function isURLSearchParams(val) {
  return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
}
function trim(str) {
  return str.replace(/^\s*/, "").replace(/\s*$/, "");
}
function isStandardBrowserEnv() {
  if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (var i = 0, l2 = obj.length; i < l2; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function merge() {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject$2(result[key]) && isPlainObject$2(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject$2(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }
  for (var i = 0, l2 = arguments.length; i < l2; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
function stripBOM(content) {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}
var utils$9 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isObject: isObject$6,
  isPlainObject: isPlainObject$2,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge,
  extend,
  trim,
  stripBOM
};
var utils$8 = utils$9;
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var buildURL$1 = function buildURL(url, params2, paramsSerializer) {
  if (!params2) {
    return url;
  }
  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params2);
  } else if (utils$8.isURLSearchParams(params2)) {
    serializedParams = params2.toString();
  } else {
    var parts = [];
    utils$8.forEach(params2, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (utils$8.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }
      utils$8.forEach(val, function parseValue(v2) {
        if (utils$8.isDate(v2)) {
          v2 = v2.toISOString();
        } else if (utils$8.isObject(v2)) {
          v2 = JSON.stringify(v2);
        }
        parts.push(encode(key) + "=" + encode(v2));
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    var hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
};
var utils$7 = utils$9;
function InterceptorManager$1() {
  this.handlers = [];
}
InterceptorManager$1.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected
  });
  return this.handlers.length - 1;
};
InterceptorManager$1.prototype.eject = function eject(id2) {
  if (this.handlers[id2]) {
    this.handlers[id2] = null;
  }
};
InterceptorManager$1.prototype.forEach = function forEach2(fn) {
  utils$7.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
var InterceptorManager_1 = InterceptorManager$1;
var utils$6 = utils$9;
var transformData$1 = function transformData(data, headers, fns) {
  utils$6.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });
  return data;
};
var isCancel$1;
var hasRequiredIsCancel;
function requireIsCancel() {
  if (hasRequiredIsCancel) return isCancel$1;
  hasRequiredIsCancel = 1;
  isCancel$1 = function isCancel2(value) {
    return !!(value && value.__CANCEL__);
  };
  return isCancel$1;
}
var utils$5 = utils$9;
var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$5.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
var enhanceError;
var hasRequiredEnhanceError;
function requireEnhanceError() {
  if (hasRequiredEnhanceError) return enhanceError;
  hasRequiredEnhanceError = 1;
  enhanceError = function enhanceError2(error, config2, code, request2, response) {
    error.config = config2;
    if (code) {
      error.code = code;
    }
    error.request = request2;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };
  return enhanceError;
}
var createError;
var hasRequiredCreateError;
function requireCreateError() {
  if (hasRequiredCreateError) return createError;
  hasRequiredCreateError = 1;
  var enhanceError2 = requireEnhanceError();
  createError = function createError2(message, config2, code, request2, response) {
    var error = new Error(message);
    return enhanceError2(error, config2, code, request2, response);
  };
  return createError;
}
var settle;
var hasRequiredSettle;
function requireSettle() {
  if (hasRequiredSettle) return settle;
  hasRequiredSettle = 1;
  var createError2 = requireCreateError();
  settle = function settle2(resolve, reject, response) {
    var validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(createError2(
        "Request failed with status code " + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };
  return settle;
}
var cookies;
var hasRequiredCookies;
function requireCookies() {
  if (hasRequiredCookies) return cookies;
  hasRequiredCookies = 1;
  var utils2 = utils$9;
  cookies = utils2.isStandardBrowserEnv() ? (
    // Standard browser envs support document.cookie
    /* @__PURE__ */ function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path3, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils2.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils2.isString(path3)) {
            cookie.push("path=" + path3);
          }
          if (utils2.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }()
  ) : (
    // Non standard browser env (web workers, react-native) lack needed support.
    /* @__PURE__ */ function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }()
  );
  return cookies;
}
var isAbsoluteURL;
var hasRequiredIsAbsoluteURL;
function requireIsAbsoluteURL() {
  if (hasRequiredIsAbsoluteURL) return isAbsoluteURL;
  hasRequiredIsAbsoluteURL = 1;
  isAbsoluteURL = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };
  return isAbsoluteURL;
}
var combineURLs;
var hasRequiredCombineURLs;
function requireCombineURLs() {
  if (hasRequiredCombineURLs) return combineURLs;
  hasRequiredCombineURLs = 1;
  combineURLs = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  return combineURLs;
}
var buildFullPath;
var hasRequiredBuildFullPath;
function requireBuildFullPath() {
  if (hasRequiredBuildFullPath) return buildFullPath;
  hasRequiredBuildFullPath = 1;
  var isAbsoluteURL2 = requireIsAbsoluteURL();
  var combineURLs2 = requireCombineURLs();
  buildFullPath = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL2(requestedURL)) {
      return combineURLs2(baseURL, requestedURL);
    }
    return requestedURL;
  };
  return buildFullPath;
}
var parseHeaders;
var hasRequiredParseHeaders;
function requireParseHeaders() {
  if (hasRequiredParseHeaders) return parseHeaders;
  hasRequiredParseHeaders = 1;
  var utils2 = utils$9;
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  parseHeaders = function parseHeaders2(headers) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers) {
      return parsed;
    }
    utils2.forEach(headers.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils2.trim(line.substr(0, i)).toLowerCase();
      val = utils2.trim(line.substr(i + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
  return parseHeaders;
}
var isURLSameOrigin;
var hasRequiredIsURLSameOrigin;
function requireIsURLSameOrigin() {
  if (hasRequiredIsURLSameOrigin) return isURLSameOrigin;
  hasRequiredIsURLSameOrigin = 1;
  var utils2 = utils$9;
  isURLSameOrigin = utils2.isStandardBrowserEnv() ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin2(requestURL) {
        var parsed = utils2.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    /* @__PURE__ */ function nonStandardBrowserEnv() {
      return function isURLSameOrigin2() {
        return true;
      };
    }()
  );
  return isURLSameOrigin;
}
var xhr;
var hasRequiredXhr;
function requireXhr() {
  if (hasRequiredXhr) return xhr;
  hasRequiredXhr = 1;
  var utils2 = utils$9;
  var settle2 = requireSettle();
  var cookies2 = requireCookies();
  var buildURL3 = buildURL$1;
  var buildFullPath2 = requireBuildFullPath();
  var parseHeaders2 = requireParseHeaders();
  var isURLSameOrigin2 = requireIsURLSameOrigin();
  var createError2 = requireCreateError();
  xhr = function xhrAdapter(config2) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config2.data;
      var requestHeaders = config2.headers;
      if (utils2.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      var request2 = new XMLHttpRequest();
      if (config2.auth) {
        var username = config2.auth.username || "";
        var password = config2.auth.password ? unescape(encodeURIComponent(config2.auth.password)) : "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath2(config2.baseURL, config2.url);
      request2.open(config2.method.toUpperCase(), buildURL3(fullPath, config2.params, config2.paramsSerializer), true);
      request2.timeout = config2.timeout;
      request2.onreadystatechange = function handleLoad() {
        if (!request2 || request2.readyState !== 4) {
          return;
        }
        if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
          return;
        }
        var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders2(request2.getAllResponseHeaders()) : null;
        var responseData = !config2.responseType || config2.responseType === "text" ? request2.responseText : request2.response;
        var response = {
          data: responseData,
          status: request2.status,
          statusText: request2.statusText,
          headers: responseHeaders,
          config: config2,
          request: request2
        };
        settle2(resolve, reject, response);
        request2 = null;
      };
      request2.onabort = function handleAbort() {
        if (!request2) {
          return;
        }
        reject(createError2("Request aborted", config2, "ECONNABORTED", request2));
        request2 = null;
      };
      request2.onerror = function handleError() {
        reject(createError2("Network Error", config2, null, request2));
        request2 = null;
      };
      request2.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = "timeout of " + config2.timeout + "ms exceeded";
        if (config2.timeoutErrorMessage) {
          timeoutErrorMessage = config2.timeoutErrorMessage;
        }
        reject(createError2(
          timeoutErrorMessage,
          config2,
          "ECONNABORTED",
          request2
        ));
        request2 = null;
      };
      if (utils2.isStandardBrowserEnv()) {
        var xsrfValue = (config2.withCredentials || isURLSameOrigin2(fullPath)) && config2.xsrfCookieName ? cookies2.read(config2.xsrfCookieName) : void 0;
        if (xsrfValue) {
          requestHeaders[config2.xsrfHeaderName] = xsrfValue;
        }
      }
      if ("setRequestHeader" in request2) {
        utils2.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
            delete requestHeaders[key];
          } else {
            request2.setRequestHeader(key, val);
          }
        });
      }
      if (!utils2.isUndefined(config2.withCredentials)) {
        request2.withCredentials = !!config2.withCredentials;
      }
      if (config2.responseType) {
        try {
          request2.responseType = config2.responseType;
        } catch (e2) {
          if (config2.responseType !== "json") {
            throw e2;
          }
        }
      }
      if (typeof config2.onDownloadProgress === "function") {
        request2.addEventListener("progress", config2.onDownloadProgress);
      }
      if (typeof config2.onUploadProgress === "function" && request2.upload) {
        request2.upload.addEventListener("progress", config2.onUploadProgress);
      }
      if (config2.cancelToken) {
        config2.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request2) {
            return;
          }
          request2.abort();
          reject(cancel);
          request2 = null;
        });
      }
      if (!requestData) {
        requestData = null;
      }
      request2.send(requestData);
    });
  };
  return xhr;
}
var utils$4 = utils$9;
var normalizeHeaderName2 = normalizeHeaderName$1;
var DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function setContentTypeIfUnset(headers, value) {
  if (!utils$4.isUndefined(headers) && utils$4.isUndefined(headers["Content-Type"])) {
    headers["Content-Type"] = value;
  }
}
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    adapter = requireXhr();
  } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
    adapter = requireXhr();
  }
  return adapter;
}
var defaults$2 = {
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName2(headers, "Accept");
    normalizeHeaderName2(headers, "Content-Type");
    if (utils$4.isFormData(data) || utils$4.isArrayBuffer(data) || utils$4.isBuffer(data) || utils$4.isStream(data) || utils$4.isFile(data) || utils$4.isBlob(data)) {
      return data;
    }
    if (utils$4.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$4.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
      return data.toString();
    }
    if (utils$4.isObject(data)) {
      setContentTypeIfUnset(headers, "application/json;charset=utf-8");
      return JSON.stringify(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e2) {
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
defaults$2.headers = {
  common: {
    "Accept": "application/json, text/plain, */*"
  }
};
utils$4.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults$2.headers[method] = {};
});
utils$4.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults$2.headers[method] = utils$4.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults$2;
var utils$3 = utils$9;
var transformData2 = transformData$1;
var isCancel = requireIsCancel();
var defaults$1 = defaults_1;
function throwIfCancellationRequested(config2) {
  if (config2.cancelToken) {
    config2.cancelToken.throwIfRequested();
  }
}
var dispatchRequest$1 = function dispatchRequest(config2) {
  throwIfCancellationRequested(config2);
  config2.headers = config2.headers || {};
  config2.data = transformData2(
    config2.data,
    config2.headers,
    config2.transformRequest
  );
  config2.headers = utils$3.merge(
    config2.headers.common || {},
    config2.headers[config2.method] || {},
    config2.headers
  );
  utils$3.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function cleanHeaderConfig(method) {
      delete config2.headers[method];
    }
  );
  var adapter = config2.adapter || defaults$1.adapter;
  return adapter(config2).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config2);
    response.data = transformData2(
      response.data,
      response.headers,
      config2.transformResponse
    );
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config2);
      if (reason && reason.response) {
        reason.response.data = transformData2(
          reason.response.data,
          reason.response.headers,
          config2.transformResponse
        );
      }
    }
    return Promise.reject(reason);
  });
};
var utils$2 = utils$9;
var mergeConfig$2 = function mergeConfig(config1, config2) {
  config2 = config2 || {};
  var config3 = {};
  var valueFromConfig2Keys = ["url", "method", "data"];
  var mergeDeepPropertiesKeys = ["headers", "auth", "proxy", "params"];
  var defaultToConfig2Keys = [
    "baseURL",
    "transformRequest",
    "transformResponse",
    "paramsSerializer",
    "timeout",
    "timeoutMessage",
    "withCredentials",
    "adapter",
    "responseType",
    "xsrfCookieName",
    "xsrfHeaderName",
    "onUploadProgress",
    "onDownloadProgress",
    "decompress",
    "maxContentLength",
    "maxBodyLength",
    "maxRedirects",
    "transport",
    "httpAgent",
    "httpsAgent",
    "cancelToken",
    "socketPath",
    "responseEncoding"
  ];
  var directMergeKeys = ["validateStatus"];
  function getMergedValue(target, source) {
    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
      return utils$2.merge(target, source);
    } else if (utils$2.isPlainObject(source)) {
      return utils$2.merge({}, source);
    } else if (utils$2.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      config3[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      config3[prop] = getMergedValue(void 0, config1[prop]);
    }
  }
  utils$2.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      config3[prop] = getMergedValue(void 0, config2[prop]);
    }
  });
  utils$2.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
  utils$2.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      config3[prop] = getMergedValue(void 0, config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      config3[prop] = getMergedValue(void 0, config1[prop]);
    }
  });
  utils$2.forEach(directMergeKeys, function merge2(prop) {
    if (prop in config2) {
      config3[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config3[prop] = getMergedValue(void 0, config1[prop]);
    }
  });
  var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
  var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
    return axiosKeys.indexOf(key) === -1;
  });
  utils$2.forEach(otherKeys, mergeDeepProperties);
  return config3;
};
var utils$1 = utils$9;
var buildURL2 = buildURL$1;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest2 = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios$1.prototype.request = function request(config2) {
  if (typeof config2 === "string") {
    config2 = arguments[1] || {};
    config2.url = arguments[0];
  } else {
    config2 = config2 || {};
  }
  config2 = mergeConfig$1(this.defaults, config2);
  if (config2.method) {
    config2.method = config2.method.toLowerCase();
  } else if (this.defaults.method) {
    config2.method = this.defaults.method.toLowerCase();
  } else {
    config2.method = "get";
  }
  var chain = [dispatchRequest2, void 0];
  var promise = Promise.resolve(config2);
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};
Axios$1.prototype.getUri = function getUri(config2) {
  config2 = mergeConfig$1(this.defaults, config2);
  return buildURL2(config2.url, config2.params, config2.paramsSerializer).replace(/^\?/, "");
};
utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios$1.prototype[method] = function(url, config2) {
    return this.request(mergeConfig$1(config2 || {}, {
      method,
      url,
      data: (config2 || {}).data
    }));
  };
});
utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  Axios$1.prototype[method] = function(url, data, config2) {
    return this.request(mergeConfig$1(config2 || {}, {
      method,
      url,
      data
    }));
  };
});
var Axios_1 = Axios$1;
var Cancel_1;
var hasRequiredCancel;
function requireCancel() {
  if (hasRequiredCancel) return Cancel_1;
  hasRequiredCancel = 1;
  function Cancel(message) {
    this.message = message;
  }
  Cancel.prototype.toString = function toString2() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel.prototype.__CANCEL__ = true;
  Cancel_1 = Cancel;
  return Cancel_1;
}
var CancelToken_1;
var hasRequiredCancelToken;
function requireCancelToken() {
  if (hasRequiredCancelToken) return CancelToken_1;
  hasRequiredCancelToken = 1;
  var Cancel = requireCancel();
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }
      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  };
  CancelToken_1 = CancelToken;
  return CancelToken_1;
}
var spread;
var hasRequiredSpread;
function requireSpread() {
  if (hasRequiredSpread) return spread;
  hasRequiredSpread = 1;
  spread = function spread2(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };
  return spread;
}
var utils = utils$9;
var bind2 = bind$2;
var Axios = Axios_1;
var mergeConfig2 = mergeConfig$2;
var defaults = defaults_1;
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind2(Axios.prototype.request, context);
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);
  return instance;
}
var axios$2 = createInstance(defaults);
axios$2.Axios = Axios;
axios$2.create = function create(instanceConfig) {
  return createInstance(mergeConfig2(axios$2.defaults, instanceConfig));
};
axios$2.Cancel = requireCancel();
axios$2.CancelToken = requireCancelToken();
axios$2.isCancel = requireIsCancel();
axios$2.all = function all(promises) {
  return Promise.all(promises);
};
axios$2.spread = requireSpread();
axios$3.exports = axios$2;
axios$3.exports.default = axios$2;
var axiosExports = axios$3.exports;
var axios = axiosExports;
const axios$1 = /* @__PURE__ */ getDefaultExportFromCjs(axios);
const getLocalUrl = (local, name, type) => {
  if (!local || !Array.isArray(local.pathConfigList)) return "";
  const pathItem = local.pathConfigList.find((item) => item.type === type);
  if (pathItem) {
    const path3 = pathItem.path;
    const rootPath = local.localRootPath;
    console.log("pathItem", pathItem, name, rootPath);
    const url = `${rootPath}${path3}/${name}`;
    return url;
  }
  return "";
};
const getRemoteUrl = (remote, name, type, fileItem, pathPropName = "cosFullPath") => {
  if (!remote) return [];
  if (!Array.isArray(remote.pathConfigList))
    return [remote.cdnPathList[0] + fileItem[pathPropName]];
  if (remote.pathConfigList && remote.pathConfigList.length > 0) {
    const pathItem = remote.pathConfigList.find((item) => item.type === type);
    if (pathItem) {
      const path3 = pathItem.path;
      const cdnPathList = remote.cdnPathList;
      if (!Array.isArray(cdnPathList)) return [];
      return cdnPathList.map((host) => `${host}${path3}/${name}`);
    }
  }
  return [];
};
const isRemoteResourceExist = async (url, options = {
  retryCount: 0,
  retryDelay: 0,
  timeout: 5e3
}) => {
  if (!url) return false;
  let { retryDelay, timeout } = options;
  if (!url.startsWith("http")) {
    options.retryCount = 0;
  }
  try {
    const { status } = await axios$1.head(url, { timeout });
    return status === 0 || status >= 200 && status < 300;
  } catch (error) {
    const retryCount = options.retryCount || 0;
    if (retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return await isRemoteResourceExist(url, {
        retryCount: retryCount - 1,
        retryDelay
      });
    } else {
      return false;
    }
  }
};
const getUrls = (resourceConfig, fileList, src, resourceType, filePropName = "ossFileName", pathPropName = "cosFullPath", fileType = "") => {
  const { local, remote } = resourceConfig;
  const list = fileList.filter((item) => item.resourceType === resourceType);
  if (list.length > 0) {
    const fileItem = list.find(
      (item) => item.fileMd5 === src
    );
    if (fileItem) {
      const { derivativeList } = fileItem;
      if (derivativeList && derivativeList.length > 0) {
        const derivativeItem = derivativeList.find(
          (item) => item.resourceType === resourceType
        );
        if (derivativeItem) {
          const name = derivativeItem[filePropName];
          const type = fileType || derivativeItem.resourceType;
          const urls = [
            getLocalUrl(local, name, type),
            ...getRemoteUrl(remote, name, type, derivativeItem, pathPropName)
          ].filter(Boolean);
          return urls;
        }
      } else {
        const name = fileItem[filePropName];
        const type = fileItem.resourceType;
        const urls = [
          getLocalUrl(local, name, type),
          ...getRemoteUrl(remote, name, type, fileItem, pathPropName)
        ].filter(Boolean);
        return urls;
      }
    }
  }
  return [];
};
const getVideoDuration = (resourceConfig, fileList, src, resourceType) => {
  const list = fileList.filter((item) => item.resourceType === resourceType);
  if (list.length > 0) {
    const fileItem = list.find(
      (item) => item.fileMd5 === src
    );
    if (fileItem) {
      const { derivativeList } = fileItem;
      if (derivativeList && derivativeList.length > 0) {
        const derivativeItem = derivativeList.find(
          (item) => item.resourceType === resourceType
        );
        if (derivativeItem) {
          return derivativeItem.durationSecond;
        }
      } else {
        return fileItem.durationSecond;
      }
    }
  }
};
const ImageComponent$1 = ({ onLoad, onError, urls, style, localUrl }) => {
  const [url, setUrl] = reactExports.useState("");
  const index = reactExports.useRef(-1);
  const getUrl = async (startPosition) => {
    for (let i = startPosition; i < urls.length; i++) {
      const tempUrl = urls[i];
      const isExist = await isRemoteResourceExist(tempUrl, { timeout: 2e3, retryCount: 3, retryDelay: 50 });
      if (isExist) {
        setUrl(() => tempUrl);
        index.current = i;
        return;
      }
    }
  };
  const errorHandler = (e2) => {
    if (index.current < urls.length - 1) {
      getUrl(index.current);
    } else {
      onError && onError(e2);
    }
  };
  reactExports.useEffect(() => {
    if (urls.length > 0) {
      getUrl(0);
    }
  }, [urls]);
  return (url || localUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      onLoad: onLoad(url),
      onError: errorHandler,
      src: url || localUrl,
      style
    }
  );
};
var LogName = /* @__PURE__ */ ((LogName2) => {
  LogName2["ChangePage"] = "change_page";
  LogName2["LoadResource"] = "load_resource";
  LogName2["VideoEvent"] = "video_event";
  LogName2["Message"] = "message";
  LogName2["AnimateEvent"] = "animate_event";
  return LogName2;
})(LogName || {});
var LogAct = /* @__PURE__ */ ((LogAct2) => {
  LogAct2["Play"] = "play";
  LogAct2["Pause"] = "pause";
  LogAct2["Error"] = "error";
  LogAct2["Start"] = "start";
  LogAct2["End"] = "end";
  LogAct2["Receive"] = "receive";
  LogAct2["Send"] = "send";
  return LogAct2;
})(LogAct || {});
var ResourceType = /* @__PURE__ */ ((ResourceType2) => {
  ResourceType2["Img"] = "img";
  ResourceType2["Video"] = "video";
  return ResourceType2;
})(ResourceType || {});
var LogState = /* @__PURE__ */ ((LogState2) => {
  LogState2["Success"] = "success";
  LogState2["Error"] = "error";
  return LogState2;
})(LogState || {});
const ImageComponent = reactExports.memo((props) => {
  const {
    useConnect: useConnect2,
    useReport: useReport2,
    id: id2,
    mode,
    style,
    treeNodeProps,
    setDefaultName,
    src,
    localUrl,
    children,
    initStyleProps,
    // 预览端使用-初始样式
    styleMapProps,
    info
    // 预览端使用
    // setComponentProps
  } = props;
  const { registerInstance, instanceMap, uninstallInstance } = useConnect2(
    []
  );
  const styleItem = styleMapProps && styleMapProps[id2] || {};
  const { resourceReport, ReportStatus: ReportStatus2, ResourceStatus: ResourceStatus2 } = useReport2();
  const [urls, setUrls] = reactExports.useState([]);
  reactExports.useEffect(() => {
    console.log("img registerInstance:");
    registerInstance(id2, {
      remove: () => {
        resourceReport({
          type: "REMOVE",
          payload: {
            componentId: id2,
            pageId: props.pageId,
            resourceId: src,
            resourceType: props["x-component"],
            resourceUrl: src,
            resourceStatus: ResourceStatus2.NONE
          }
        });
        uninstallInstance(id2);
      },
      ...props
    });
    if (mode === "edit") {
      setDefaultName(instanceMap, props["x-component"]);
    }
  }, [registerInstance, id2, uninstallInstance, ReportStatus2]);
  reactExports.useEffect(() => {
    const { resourceData } = props.globalConfig;
    const { fileList } = props.globalProps;
    if (src) {
      const urls2 = getUrls(resourceData, fileList, src, "pic");
      setUrls(urls2);
    }
  }, [props.globalProps.fileList, src]);
  reactExports.useEffect(() => {
    if (mode === "preview") {
      if (props.sendLog) {
        const sendLog = props.sendLog;
        sendLog({ name: LogName.LoadResource, act: LogAct.Start, id: id2, option: { resource_type: ResourceType.Img, md5: src } });
      }
    }
    resourceReport({
      type: ReportStatus2.UPDATE,
      payload: {
        componentId: id2,
        pageId: props.pageId,
        resourceId: src,
        resourceType: props["x-component"],
        resourceUrl: src,
        resourceStatus: ResourceStatus2.LOADING
      }
    });
  }, [src]);
  reactExports.useEffect(() => {
    resourceReport({
      type: ReportStatus2.ADD,
      payload: {
        componentId: id2,
        resourceId: src,
        pageId: props.pageId,
        resourceType: props["x-component"],
        resourceUrl: src,
        resourceStatus: ResourceStatus2.NONE
      }
    });
  }, []);
  const onError = () => {
    if (mode === "preview") {
      const sendLog = props.sendLog;
      sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id2, option: { resource_type: ResourceType.Img, md5: src, state: LogState.Error } });
    }
    resourceReport({
      type: ReportStatus2.UPDATE,
      payload: {
        componentId: id2,
        resourceId: src,
        pageId: props.pageId,
        resourceType: props["x-component"],
        resourceUrl: src,
        resourceStatus: ResourceStatus2.ERROR
      }
    });
  };
  const onLoad = (url) => {
    if (mode === "preview") {
      const sendLog = props.sendLog;
      sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id2, option: { resource_type: ResourceType.Img, md5: src, url, state: LogState.Success } });
    }
    if (!src) return;
    resourceReport({
      type: ReportStatus2.UPDATE,
      payload: {
        componentId: id2,
        resourceId: src,
        pageId: props.pageId,
        resourceType: props["x-component"],
        resourceUrl: src,
        resourceStatus: ResourceStatus2.LOADED
      }
    });
  };
  const handleImageClick = () => {
    const { jumpPage } = info;
    if (jumpPage === "next" && window.__MICRO_APP_ENVIRONMENT__) {
      window.microApp && window.microApp.dispatch({
        type: "setNextPageId"
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "img-component",
      ...treeNodeProps,
      "preview-id": id2,
      style: { ...style, position: "absolute", ...initStyleProps, ...styleItem },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", height: "100%", position: "relative" }, onClick: handleImageClick, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageComponent$1,
          {
            onLoad,
            onError,
            urls,
            localUrl,
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "inherit"
            }
          }
        ),
        children
      ] })
    }
  );
});
var freeGlobal$2 = typeof global == "object" && global && global.Object === Object && global;
var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
var root$3 = freeGlobal$2 || freeSelf$1 || Function("return this")();
var Symbol$4 = root$3.Symbol;
var objectProto$3 = Object.prototype;
var hasOwnProperty$1 = objectProto$3.hasOwnProperty;
var nativeObjectToString$3 = objectProto$3.toString;
var symToStringTag$3 = Symbol$4 ? Symbol$4.toStringTag : void 0;
function getRawTag$2(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$3), tag = value[symToStringTag$3];
  try {
    value[symToStringTag$3] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString$3.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$3] = tag;
    } else {
      delete value[symToStringTag$3];
    }
  }
  return result;
}
var objectProto$2 = Object.prototype;
var nativeObjectToString$2 = objectProto$2.toString;
function objectToString$2(value) {
  return nativeObjectToString$2.call(value);
}
var nullTag$1 = "[object Null]", undefinedTag$1 = "[object Undefined]";
var symToStringTag$2 = Symbol$4 ? Symbol$4.toStringTag : void 0;
function baseGetTag$2(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag$1 : nullTag$1;
  }
  return symToStringTag$2 && symToStringTag$2 in Object(value) ? getRawTag$2(value) : objectToString$2(value);
}
function isObjectLike$2(value) {
  return value != null && typeof value == "object";
}
var symbolTag$1 = "[object Symbol]";
function isSymbol$2(value) {
  return typeof value == "symbol" || isObjectLike$2(value) && baseGetTag$2(value) == symbolTag$1;
}
var reWhitespace$1 = /\s/;
function trimmedEndIndex$2(string3) {
  var index = string3.length;
  while (index-- && reWhitespace$1.test(string3.charAt(index))) {
  }
  return index;
}
var reTrimStart$1 = /^\s+/;
function baseTrim$2(string3) {
  return string3 ? string3.slice(0, trimmedEndIndex$2(string3) + 1).replace(reTrimStart$1, "") : string3;
}
function isObject$5(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN$1 = 0 / 0;
var reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary$1 = /^0b[01]+$/i;
var reIsOctal$1 = /^0o[0-7]+$/i;
var freeParseInt$1 = parseInt;
function toNumber$2(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol$2(value)) {
    return NAN$1;
  }
  if (isObject$5(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$5(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim$2(value);
  var isBinary = reIsBinary$1.test(value);
  return isBinary || reIsOctal$1.test(value) ? freeParseInt$1(value.slice(2), isBinary ? 2 : 8) : reIsBadHex$1.test(value) ? NAN$1 : +value;
}
var now$2 = function() {
  return root$3.Date.now();
};
var FUNC_ERROR_TEXT$3 = "Expected a function";
var nativeMax$1 = Math.max, nativeMin$1 = Math.min;
function debounce$3(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$3);
  }
  wait = toNumber$2(wait) || 0;
  if (isObject$5(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax$1(toNumber$2(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time2) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time2;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time2) {
    lastInvokeTime = time2;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time2) : result;
  }
  function remainingWait(time2) {
    var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time2) {
    var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time2 = now$2();
    if (shouldInvoke(time2)) {
      return trailingEdge(time2);
    }
    timerId = setTimeout(timerExpired, remainingWait(time2));
  }
  function trailingEdge(time2) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time2);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now$2());
  }
  function debounced() {
    var time2 = now$2(), isInvoking = shouldInvoke(time2);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time2;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var FUNC_ERROR_TEXT$2 = "Expected a function";
function throttle$2(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  if (isObject$5(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce$3(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
var playerMessageTypeCollection = /* @__PURE__ */ ((playerMessageTypeCollection2) => {
  playerMessageTypeCollection2["PLAYEREVENT"] = "playerEvent";
  playerMessageTypeCollection2["PLAYERSTATE"] = "playerState";
  return playerMessageTypeCollection2;
})(playerMessageTypeCollection || {});
var PlayerEventTypeCollection = /* @__PURE__ */ ((PlayerEventTypeCollection2) => {
  PlayerEventTypeCollection2["PLAY"] = "play";
  PlayerEventTypeCollection2["PAUSE"] = "pause";
  PlayerEventTypeCollection2["ENDED"] = "ended";
  PlayerEventTypeCollection2["ENTERFULLSCREEN"] = "enterfullscreen";
  PlayerEventTypeCollection2["EXITFULLSCREEN"] = "exitfullscreen";
  PlayerEventTypeCollection2["VOLUMECHANGE"] = "volumechange";
  PlayerEventTypeCollection2["SEEKED"] = "seeked";
  PlayerEventTypeCollection2["RATECHANGE"] = "ratechange";
  PlayerEventTypeCollection2["TIMEUPDATE"] = "timeupdate";
  return PlayerEventTypeCollection2;
})(PlayerEventTypeCollection || {});
const playerEvents = [
  "play",
  "pause",
  "ended",
  "enterfullscreen",
  "exitfullscreen",
  "volumechange",
  "seeked",
  "ratechange"
  /* RATECHANGE */
];
const defaultVideoSize = [1280, 960];
const searchParams = window.location.search;
const params = new URLSearchParams(searchParams);
const role = params.get("mode");
const VideoComponent = (props) => {
  var _a;
  const {
    useConnect: useConnect2,
    useReport: useReport2,
    useEventStore: useEventStore2,
    id: id2,
    mode,
    pageId,
    style,
    title,
    children,
    setDefaultName,
    src,
    treeNodeProps,
    info = {},
    // 预览端使用
    activePageId,
    sendLog
  } = props;
  const { registerMsg } = useEventStore2(() => []);
  const playerRef = React$1.useRef(null);
  const canPlay = reactExports.useRef(false);
  const registered = reactExports.useRef(false);
  const posterIndexRef = React$1.useRef(0);
  const sourceIndexRef = React$1.useRef(0);
  const { resourceData } = props.globalConfig;
  const { fileList } = props.globalProps;
  let introductoryLessonMode = false;
  if (window.__MICRO_APP_ENVIRONMENT__) {
    const globalData = (_a = window == null ? void 0 : window.microApp) == null ? void 0 : _a.getGlobalData();
    if (globalData.initParam) {
      const { introductoryLesson } = globalData.initParam;
      introductoryLessonMode = introductoryLesson;
    }
  }
  let autoPlay = (info.autoplay && role === "sender" || introductoryLessonMode) && role !== "preview";
  if (mode === "edit") autoPlay = false;
  reactExports.useEffect(() => {
    if (playerRef.current) {
      if (pageId !== activePageId) {
        if (playerRef.current.currentTime > 0) {
          playerRef.current.currentTime = 0;
        }
        playerRef.current.pause();
      } else {
        if (autoPlay) {
          playerRef.current.play();
        }
      }
    }
  }, [activePageId]);
  reactExports.useEffect(() => {
    const autoPlayHandle = () => {
      if (playerRef.current) {
        if (document.visibilityState === "visible" && introductoryLessonMode && pageId === activePageId) {
          playerRef.current.play();
        } else if (document.visibilityState === "hidden" && introductoryLessonMode) {
          playerRef.current.pause();
        }
      }
    };
    document.addEventListener("visibilitychange", autoPlayHandle);
    return () => {
      document.removeEventListener("visibilitychange", autoPlayHandle);
    };
  });
  const truncateToFirstDecimalPlace = (num) => {
    return Number(String(num).replace(/(\.\d)\d+/, "$1"));
  };
  const videoDuration = truncateToFirstDecimalPlace(Number(getVideoDuration(resourceData, fileList, src, "video"))) - 0.2;
  const sources = getUrls(resourceData, fileList, src, "video");
  const posters = getUrls(resourceData, fileList, src, "video", "videoScreenshotOssFileName", "videoScreenshotOssPath", "pic");
  const playStateTodo = reactExports.useRef(null);
  const checkPlayerCanPlayHandle = reactExports.useRef(null);
  function getPlayerState(type) {
    if (playerRef.current) {
      if (!playerRef.current) {
        return;
      }
      const state = {
        id: id2,
        type: "videoStateChanged",
        currentTime: playerRef.current.currentTime || 0,
        duration: playerRef.current.duration,
        muted: playerRef.current.muted,
        paused: playerRef.current.paused,
        volume: playerRef.current.volume,
        isFullscreen: false,
        changeType: type
      };
      console.log("player", type, state);
      return state;
    }
    return null;
  }
  function registerSender(playerEventNotice, playerStateNotice) {
    if (!playerRef.current) return;
    const syncTime = throttle$2(() => {
      const state = getPlayerState(PlayerEventTypeCollection.TIMEUPDATE);
      [playerStateNotice, playerEventNotice].forEach((notice, noticeIndex) => {
        notice({
          type: noticeIndex === 0 ? playerMessageTypeCollection.PLAYERSTATE : playerMessageTypeCollection.PLAYEREVENT,
          payload: {
            state,
            event: PlayerEventTypeCollection.TIMEUPDATE
          }
        });
        if (mode === "preview" && sendLog) {
          sendLog({ name: LogName.Message, act: LogAct.Send, id: id2, option: { event_type: "video", event_act: PlayerEventTypeCollection.TIMEUPDATE } });
        }
      });
    }, 5e3);
    playerRef.current.addEventListener(PlayerEventTypeCollection.TIMEUPDATE, syncTime);
    playerRef.current.addEventListener(PlayerEventTypeCollection.PAUSE, () => {
      if (document.visibilityState === "visible" && pageId === activePageId) {
        if (introductoryLessonMode && playerRef.current) {
          const diff = Math.abs(playerRef.current.currentTime - playerRef.current.duration);
          if (diff > 2) {
            playerRef.current.play();
          }
        }
      }
    });
    playerRef.current.addEventListener("stalled", () => {
      console.log("视频播放卡顿");
      playerRef.current.play();
    });
    playerEvents.forEach((event) => {
      var _a2;
      (_a2 = playerRef.current) == null ? void 0 : _a2.addEventListener(event, () => {
        const state = getPlayerState(event);
        console.log("state", state);
        [playerStateNotice, playerEventNotice].forEach((notice, noticeIndex) => {
          notice({
            type: noticeIndex === 0 ? playerMessageTypeCollection.PLAYERSTATE : playerMessageTypeCollection.PLAYEREVENT,
            payload: {
              state,
              event
            }
          });
          if (mode === "preview" && sendLog) {
            sendLog({ name: LogName.Message, act: LogAct.Send, id: id2, option: { event_type: "video", event_act: event } });
          }
        });
      });
    });
  }
  async function recoverPlayerState(videoState, reconnect = false, playType = playerMessageTypeCollection.PLAYEREVENT) {
    if (!playerRef.current) return;
    if (!reconnect && playType !== playerMessageTypeCollection.PLAYEREVENT) return;
    const {
      id: id22,
      type,
      currentTime,
      duration,
      muted,
      paused: remotePaused,
      volume,
      isFullscreen,
      changeType
    } = videoState;
    if (!canPlay.current) {
      playStateTodo.current = videoState;
      if (!checkPlayerCanPlayHandle.current) {
        checkPlayerCanPlayHandle.current = () => {
          if (canPlay) {
            recoverPlayerState(playStateTodo.current, reconnect);
            return;
          }
          checkPlayerCanPlayHandle.current && requestAnimationFrame(checkPlayerCanPlayHandle.current);
        };
        checkPlayerCanPlayHandle.current();
      }
      return;
    }
    playStateTodo.current = null;
    checkPlayerCanPlayHandle.current = null;
    if (playerRef.current && playerRef.current.duration && type === "videoStateChanged") {
      const localPaused = playerRef.current.paused;
      console.log(
        "videoStatechangeType",
        videoState,
        changeType,
        localPaused,
        remotePaused,
        canPlay,
        Date.now()
      );
      let isFirstPlay = false;
      if (localPaused !== remotePaused) {
        try {
          !remotePaused && (isFirstPlay = true);
          await playerRef.current[remotePaused ? PlayerEventTypeCollection.PAUSE : PlayerEventTypeCollection.PLAY]();
        } catch (error) {
        }
      }
      if (muted !== null) {
        playerRef.current.muted = muted;
      }
      if (volume !== null) {
        playerRef.current.volume = volume;
      }
      const setCurrentTime = (time2, diff, forceUpdate = false) => {
        if (!playerRef.current) return;
        if (!forceUpdate && diff < 2) return;
        if (time2 > Number(videoDuration)) {
          playerRef.current.currentTime = videoDuration;
        } else {
          playerRef.current.currentTime = time2;
        }
      };
      if (currentTime !== null && typeof currentTime === "number") {
        if (![
          PlayerEventTypeCollection.PLAY,
          PlayerEventTypeCollection.PAUSE,
          PlayerEventTypeCollection.TIMEUPDATE,
          PlayerEventTypeCollection.SEEKED
        ].includes(changeType)) return;
        if (mode === "preview" && sendLog) {
          sendLog({ name: LogName.VideoEvent, act: changeType, id: id22, option: { md5: src } });
        }
        const time2 = currentTime <= playerRef.current.duration ? currentTime : playerRef.current.duration;
        const diff = Math.abs(playerRef.current.currentTime - time2);
        console.log("设置时间", videoDuration, changeType, time2, currentTime, playerRef.current.duration, diff);
        if (changeType === PlayerEventTypeCollection.TIMEUPDATE) {
          if (reconnect || isFirstPlay) {
            setCurrentTime(time2, diff);
          }
        } else {
          setCurrentTime(time2, diff, true);
        }
        if (remotePaused === true && changeType === PlayerEventTypeCollection.TIMEUPDATE) {
          const el2 = document.querySelector(`[preview-id="${id22}"] .vjs-poster`);
          el2 && (el2.style.display = "none");
        }
      }
      if (changeType === PlayerEventTypeCollection.ENDED && currentTime !== null && typeof currentTime === "number") {
        const time2 = currentTime <= playerRef.current.duration ? currentTime : playerRef.current.duration;
        const diff = Math.abs(playerRef.current.currentTime - time2);
        setCurrentTime(time2, diff);
      }
      console.log("recoverPlayerState", type);
    }
  }
  function registerReceiver(playerEventRegister, playerStateRegister) {
    [playerEventRegister, playerStateRegister].forEach((register) => {
      console.log("register", register);
      register((msg2) => {
        console.log("playerStateRegister", msg2);
        const { event, state } = msg2.payload;
        const { reconnect, type } = msg2;
        recoverPlayerState(state, reconnect, type);
        if (mode === "preview" && sendLog && type === playerMessageTypeCollection.PLAYEREVENT) {
          sendLog({ name: LogName.Message, act: LogAct.Receive, id: id2, option: { event_type: "video", event_act: state.changeType } });
        }
      });
    });
  }
  const handlePlayerReady = () => {
    console.log("player ready", autoPlay);
    if (autoPlay && pageId === activePageId) {
      playerRef.current && playerRef.current.play();
      playerRef.current.currentTime = 0;
    }
    if (mode !== "edit" && registered.current === false) {
      const { notice: playerEventNotice, register: playerEventRegister } = registerMsg(id2, playerMessageTypeCollection.PLAYEREVENT, "event", pageId);
      const { notice: playerStateNotice, register: playerStateRegister } = registerMsg(id2, playerMessageTypeCollection.PLAYERSTATE, "state", pageId);
      registerSender(playerEventNotice, playerStateNotice);
      registerReceiver(playerEventRegister, playerStateRegister);
      registered.current = true;
    }
  };
  const setNewPoster = async () => {
    const url = posters[posterIndexRef.current];
    const exist = await isRemoteResourceExist(url, { timeout: 2e3, retryCount: 3, retryDelay: 50 });
    if (!exist) {
      posterIndexRef.current++;
      if (posterIndexRef.current >= posters.length) {
        posterIndexRef.current = 0;
        if (mode === "preview" && sendLog) {
          sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id2, option: { resource_type: ResourceType.Img, md5: src, state: LogState.Error } });
        }
        return;
      }
      setNewPoster();
      return;
    }
    if (mode === "preview" && sendLog) {
      sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id2, option: { resource_type: ResourceType.Img, md5: src, url, state: LogState.Success } });
    }
    playerRef.current && (playerRef.current.poster = url);
  };
  const setNewSource = async () => {
    const url = sources[sourceIndexRef.current];
    const exist = await isRemoteResourceExist(url);
    if (!exist) {
      sourceIndexRef.current++;
      if (sourceIndexRef.current >= sources.length) {
        if (mode === "preview" && sendLog) {
          sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id2, option: { resource_type: ResourceType.Video, md5: src, state: LogState.Error } });
        }
        return;
      }
      setNewSource();
      return;
    }
    console.log("player setNewSource", url);
    if (mode === "preview" && sendLog) {
      sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id2, option: { resource_type: ResourceType.Video, md5: src, url, state: LogState.Success } });
    }
    playerRef.current && (playerRef.current.src = url);
  };
  React$1.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.addEventListener("loadedmetadata", () => {
        canPlay.current = true;
        handlePlayerReady();
      });
      if (mode === "preview" && sendLog) {
        sendLog({ name: LogName.LoadResource, act: LogAct.Start, id: id2, option: { resource_type: ResourceType.Img, md5: src } });
      }
      setNewPoster();
      if (mode === "preview" && sendLog) {
        sendLog({ name: LogName.LoadResource, act: LogAct.Start, id: id2, option: { resource_type: ResourceType.Video, md5: src } });
      }
      setNewSource();
    }
  }, [playerRef]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "preview-id": id2,
      style: {
        width: `${defaultVideoSize[0]}px`,
        height: `${defaultVideoSize[1]}px`
      },
      ...treeNodeProps,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            className: "player",
            ref: playerRef,
            style: { width: "100%", height: "100%" },
            id: id2,
            preload: "auto",
            playsInline: true,
            controls: (role === "sender" || mode === "edit" || role === "preview") && !introductoryLessonMode,
            controlsList: "nodownload noplaybackrate",
            disablePictureInPicture: true
          }
        ),
        children
      ]
    }
  );
};
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObject$4(o2) {
  return Object.prototype.toString.call(o2) === "[object Object]";
}
function isPlainObject$1(o2) {
  var ctor, prot;
  if (isObject$4(o2) === false) return false;
  ctor = o2.constructor;
  if (ctor === void 0) return true;
  prot = ctor.prototype;
  if (isObject$4(prot) === false) return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
function die(error, ...args) {
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  var _a;
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a = value.constructor) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype)
    return true;
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  if (typeof Ctor !== "function")
    return false;
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === void 0) {
    ctorString = Function.toString.call(Ctor);
    cachedCtorStrings.set(Ctor, ctorString);
  }
  return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
  if (getArchtype(obj) === 0) {
    const keys = strict ? Reflect.ownKeys(obj) : Object.keys(obj);
    keys.forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
  const t2 = getArchtype(thing);
  if (t2 === 2)
    thing.set(propOrOldValue, value);
  else if (t2 === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x2, y2) {
  if (x2 === y2) {
    return x2 !== 0 || 1 / x2 === 1 / y2;
  } else {
    return x2 !== x2 && y2 !== y2;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze$1(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    Object.defineProperties(obj, {
      set: dontMutateMethodOverride,
      add: dontMutateMethodOverride,
      clear: dontMutateMethodOverride,
      delete: dontMutateMethodOverride
    });
  }
  Object.freeze(obj);
  if (deep)
    Object.values(obj).forEach((value) => freeze$1(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
var dontMutateMethodOverride = {
  value: dontMutateFrozenCollections
};
function isFrozen(obj) {
  if (obj === null || typeof obj !== "object")
    return true;
  return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_,
    immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path3) {
  if (isFrozen(value))
    return value;
  const useStrictIteration = rootScope.immer_.shouldUseStrictIteration();
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path3),
      useStrictIteration
    );
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    const result = state.copy_;
    let resultEach = result;
    let isSet2 = false;
    if (state.type_ === 3) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(
      resultEach,
      (key, childValue) => finalizeProperty(
        rootScope,
        state,
        result,
        key,
        childValue,
        path3,
        isSet2
      ),
      useStrictIteration
    );
    maybeFreeze(rootScope, result, false);
    if (path3 && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path3,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (childValue == null) {
    return;
  }
  if (typeof childValue !== "object" && !targetIsSet) {
    return;
  }
  const childIsFrozen = isFrozen(childValue);
  if (childIsFrozen && !targetIsSet) {
    return;
  }
  if (isDraft(childValue)) {
    const path3 = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize(rootScope, childValue, path3);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !childIsFrozen) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    if (parentState && parentState.base_ && parentState.base_[prop] === childValue && childIsFrozen) {
      return;
    }
    finalize(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && (isMap(targetObject) ? targetObject.has(prop) : Object.prototype.propertyIsEnumerable.call(targetObject, prop)))
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze$1(value, deep);
  }
}
function createProxyProxy(base, parent3) {
  const isArray2 = Array.isArray(base);
  const state = {
    type_: isArray2 ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent3 ? parent3.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent3,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  let target = state;
  let traps = objectTraps;
  if (isArray2) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc == null ? void 0 : desc.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function(state, prop) {
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  var _a;
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (_a = desc.get) == null ? void 0 : _a.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config2) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.useStrictIteration_ = true;
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self2 = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self2.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze$1(result, true);
        if (patchListener) {
          const p2 = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p2, ip);
          patchListener(p2, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p2, ip) => {
        patches = p2;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof (config2 == null ? void 0 : config2.autoFreeze) === "boolean")
      this.setAutoFreeze(config2.autoFreeze);
    if (typeof (config2 == null ? void 0 : config2.useStrictShallowCopy) === "boolean")
      this.setUseStrictShallowCopy(config2.useStrictShallowCopy);
    if (typeof (config2 == null ? void 0 : config2.useStrictIteration) === "boolean")
      this.setUseStrictIteration(config2.useStrictIteration);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(value) {
    this.useStrictIteration_ = value;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent3) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent3) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent3) : createProxyProxy(value, parent3);
  const scope = parent3 ? parent3.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  let strict = true;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    strict = state.scope_.immer_.shouldUseStrictIteration();
  } else {
    copy = shallowCopy(value, true);
  }
  each(
    copy,
    (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    },
    strict
  );
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
var immer = new Immer2();
var produce = immer.produce;
var createDraft = /* @__PURE__ */ immer.createDraft.bind(immer);
var finishDraft = /* @__PURE__ */ immer.finishDraft.bind(immer);
var PathRef = {
  transform(ref, op) {
    var {
      current: current2,
      affinity
    } = ref;
    if (current2 == null) {
      return;
    }
    var path3 = Path.transform(current2, op, {
      affinity
    });
    ref.current = path3;
    if (path3 == null) {
      ref.unref();
    }
  }
};
var PointRef = {
  transform(ref, op) {
    var {
      current: current2,
      affinity
    } = ref;
    if (current2 == null) {
      return;
    }
    var point3 = Point.transform(current2, op, {
      affinity
    });
    ref.current = point3;
    if (point3 == null) {
      ref.unref();
    }
  }
};
var RangeRef = {
  transform(ref, op) {
    var {
      current: current2,
      affinity
    } = ref;
    if (current2 == null) {
      return;
    }
    var path3 = Range.transform(current2, op, {
      affinity
    });
    ref.current = path3;
    if (path3 == null) {
      ref.unref();
    }
  }
};
var DIRTY_PATHS = /* @__PURE__ */ new WeakMap();
var DIRTY_PATH_KEYS = /* @__PURE__ */ new WeakMap();
var FLUSHING = /* @__PURE__ */ new WeakMap();
var NORMALIZING = /* @__PURE__ */ new WeakMap();
var PATH_REFS = /* @__PURE__ */ new WeakMap();
var POINT_REFS = /* @__PURE__ */ new WeakMap();
var RANGE_REFS = /* @__PURE__ */ new WeakMap();
var Path = {
  ancestors(path3) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var {
      reverse = false
    } = options;
    var paths = Path.levels(path3, options);
    if (reverse) {
      paths = paths.slice(1);
    } else {
      paths = paths.slice(0, -1);
    }
    return paths;
  },
  common(path3, another) {
    var common = [];
    for (var i = 0; i < path3.length && i < another.length; i++) {
      var av = path3[i];
      var bv = another[i];
      if (av !== bv) {
        break;
      }
      common.push(av);
    }
    return common;
  },
  compare(path3, another) {
    var min = Math.min(path3.length, another.length);
    for (var i = 0; i < min; i++) {
      if (path3[i] < another[i]) return -1;
      if (path3[i] > another[i]) return 1;
    }
    return 0;
  },
  endsAfter(path3, another) {
    var i = path3.length - 1;
    var as = path3.slice(0, i);
    var bs = another.slice(0, i);
    var av = path3[i];
    var bv = another[i];
    return Path.equals(as, bs) && av > bv;
  },
  endsAt(path3, another) {
    var i = path3.length;
    var as = path3.slice(0, i);
    var bs = another.slice(0, i);
    return Path.equals(as, bs);
  },
  endsBefore(path3, another) {
    var i = path3.length - 1;
    var as = path3.slice(0, i);
    var bs = another.slice(0, i);
    var av = path3[i];
    var bv = another[i];
    return Path.equals(as, bs) && av < bv;
  },
  equals(path3, another) {
    return path3.length === another.length && path3.every((n2, i) => n2 === another[i]);
  },
  hasPrevious(path3) {
    return path3[path3.length - 1] > 0;
  },
  isAfter(path3, another) {
    return Path.compare(path3, another) === 1;
  },
  isAncestor(path3, another) {
    return path3.length < another.length && Path.compare(path3, another) === 0;
  },
  isBefore(path3, another) {
    return Path.compare(path3, another) === -1;
  },
  isChild(path3, another) {
    return path3.length === another.length + 1 && Path.compare(path3, another) === 0;
  },
  isCommon(path3, another) {
    return path3.length <= another.length && Path.compare(path3, another) === 0;
  },
  isDescendant(path3, another) {
    return path3.length > another.length && Path.compare(path3, another) === 0;
  },
  isParent(path3, another) {
    return path3.length + 1 === another.length && Path.compare(path3, another) === 0;
  },
  isPath(value) {
    return Array.isArray(value) && (value.length === 0 || typeof value[0] === "number");
  },
  isSibling(path3, another) {
    if (path3.length !== another.length) {
      return false;
    }
    var as = path3.slice(0, -1);
    var bs = another.slice(0, -1);
    var al2 = path3[path3.length - 1];
    var bl2 = another[another.length - 1];
    return al2 !== bl2 && Path.equals(as, bs);
  },
  levels(path3) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var {
      reverse = false
    } = options;
    var list = [];
    for (var i = 0; i <= path3.length; i++) {
      list.push(path3.slice(0, i));
    }
    if (reverse) {
      list.reverse();
    }
    return list;
  },
  next(path3) {
    if (path3.length === 0) {
      throw new Error("Cannot get the next path of a root path [".concat(path3, "], because it has no next index."));
    }
    var last2 = path3[path3.length - 1];
    return path3.slice(0, -1).concat(last2 + 1);
  },
  operationCanTransformPath(operation) {
    switch (operation.type) {
      case "insert_node":
      case "remove_node":
      case "merge_node":
      case "split_node":
      case "move_node":
        return true;
      default:
        return false;
    }
  },
  parent(path3) {
    if (path3.length === 0) {
      throw new Error("Cannot get the parent path of the root path [".concat(path3, "]."));
    }
    return path3.slice(0, -1);
  },
  previous(path3) {
    if (path3.length === 0) {
      throw new Error("Cannot get the previous path of a root path [".concat(path3, "], because it has no previous index."));
    }
    var last2 = path3[path3.length - 1];
    if (last2 <= 0) {
      throw new Error("Cannot get the previous path of a first child path [".concat(path3, "] because it would result in a negative index."));
    }
    return path3.slice(0, -1).concat(last2 - 1);
  },
  relative(path3, ancestor) {
    if (!Path.isAncestor(ancestor, path3) && !Path.equals(path3, ancestor)) {
      throw new Error("Cannot get the relative path of [".concat(path3, "] inside ancestor [").concat(ancestor, "], because it is not above or equal to the path."));
    }
    return path3.slice(ancestor.length);
  },
  transform(path3, operation) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!path3) return null;
    var p2 = [...path3];
    var {
      affinity = "forward"
    } = options;
    if (path3.length === 0) {
      return p2;
    }
    switch (operation.type) {
      case "insert_node": {
        var {
          path: op
        } = operation;
        if (Path.equals(op, p2) || Path.endsBefore(op, p2) || Path.isAncestor(op, p2)) {
          p2[op.length - 1] += 1;
        }
        break;
      }
      case "remove_node": {
        var {
          path: _op
        } = operation;
        if (Path.equals(_op, p2) || Path.isAncestor(_op, p2)) {
          return null;
        } else if (Path.endsBefore(_op, p2)) {
          p2[_op.length - 1] -= 1;
        }
        break;
      }
      case "merge_node": {
        var {
          path: _op2,
          position
        } = operation;
        if (Path.equals(_op2, p2) || Path.endsBefore(_op2, p2)) {
          p2[_op2.length - 1] -= 1;
        } else if (Path.isAncestor(_op2, p2)) {
          p2[_op2.length - 1] -= 1;
          p2[_op2.length] += position;
        }
        break;
      }
      case "split_node": {
        var {
          path: _op3,
          position: _position
        } = operation;
        if (Path.equals(_op3, p2)) {
          if (affinity === "forward") {
            p2[p2.length - 1] += 1;
          } else if (affinity === "backward") ;
          else {
            return null;
          }
        } else if (Path.endsBefore(_op3, p2)) {
          p2[_op3.length - 1] += 1;
        } else if (Path.isAncestor(_op3, p2) && path3[_op3.length] >= _position) {
          p2[_op3.length - 1] += 1;
          p2[_op3.length] -= _position;
        }
        break;
      }
      case "move_node": {
        var {
          path: _op4,
          newPath: onp
        } = operation;
        if (Path.equals(_op4, onp)) {
          return p2;
        }
        if (Path.isAncestor(_op4, p2) || Path.equals(_op4, p2)) {
          var copy = onp.slice();
          if (Path.endsBefore(_op4, onp) && _op4.length < onp.length) {
            copy[_op4.length - 1] -= 1;
          }
          return copy.concat(p2.slice(_op4.length));
        } else if (Path.isSibling(_op4, onp) && (Path.isAncestor(onp, p2) || Path.equals(onp, p2))) {
          if (Path.endsBefore(_op4, p2)) {
            p2[_op4.length - 1] -= 1;
          } else {
            p2[_op4.length - 1] += 1;
          }
        } else if (Path.endsBefore(onp, p2) || Path.equals(onp, p2) || Path.isAncestor(onp, p2)) {
          if (Path.endsBefore(_op4, p2)) {
            p2[_op4.length - 1] -= 1;
          }
          p2[onp.length - 1] += 1;
        } else if (Path.endsBefore(_op4, p2)) {
          if (Path.equals(onp, p2)) {
            p2[onp.length - 1] += 1;
          }
          p2[_op4.length - 1] -= 1;
        }
        break;
      }
    }
    return p2;
  }
};
function _typeof$1(o2) {
  "@babel/helpers - typeof";
  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof$1(o2);
}
function _toPrimitive$1(input, hint) {
  if (_typeof$1(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof$1(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey$1(arg) {
  var key = _toPrimitive$1(arg, "string");
  return _typeof$1(key) === "symbol" ? key : String(key);
}
function _defineProperty$1(obj, key, value) {
  key = _toPropertyKey$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys$e(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$e(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$e(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$e(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var applyToDraft = (editor, selection, op) => {
  switch (op.type) {
    case "insert_node": {
      var {
        path: path3,
        node: node3
      } = op;
      var parent3 = Node.parent(editor, path3);
      var index = path3[path3.length - 1];
      if (index > parent3.children.length) {
        throw new Error('Cannot apply an "insert_node" operation at path ['.concat(path3, "] because the destination is past the end of the node."));
      }
      parent3.children.splice(index, 0, node3);
      if (selection) {
        for (var [point3, key] of Range.points(selection)) {
          selection[key] = Point.transform(point3, op);
        }
      }
      break;
    }
    case "insert_text": {
      var {
        path: _path,
        offset,
        text
      } = op;
      if (text.length === 0) break;
      var _node = Node.leaf(editor, _path);
      var before3 = _node.text.slice(0, offset);
      var after3 = _node.text.slice(offset);
      _node.text = before3 + text + after3;
      if (selection) {
        for (var [_point, _key] of Range.points(selection)) {
          selection[_key] = Point.transform(_point, op);
        }
      }
      break;
    }
    case "merge_node": {
      var {
        path: _path2
      } = op;
      var _node2 = Node.get(editor, _path2);
      var prevPath = Path.previous(_path2);
      var prev = Node.get(editor, prevPath);
      var _parent = Node.parent(editor, _path2);
      var _index = _path2[_path2.length - 1];
      if (Text$1.isText(_node2) && Text$1.isText(prev)) {
        prev.text += _node2.text;
      } else if (!Text$1.isText(_node2) && !Text$1.isText(prev)) {
        prev.children.push(..._node2.children);
      } else {
        throw new Error('Cannot apply a "merge_node" operation at path ['.concat(_path2, "] to nodes of different interfaces: ").concat(Scrubber.stringify(_node2), " ").concat(Scrubber.stringify(prev)));
      }
      _parent.children.splice(_index, 1);
      if (selection) {
        for (var [_point2, _key2] of Range.points(selection)) {
          selection[_key2] = Point.transform(_point2, op);
        }
      }
      break;
    }
    case "move_node": {
      var {
        path: _path3,
        newPath
      } = op;
      if (Path.isAncestor(_path3, newPath)) {
        throw new Error("Cannot move a path [".concat(_path3, "] to new path [").concat(newPath, "] because the destination is inside itself."));
      }
      var _node3 = Node.get(editor, _path3);
      var _parent2 = Node.parent(editor, _path3);
      var _index2 = _path3[_path3.length - 1];
      _parent2.children.splice(_index2, 1);
      var truePath = Path.transform(_path3, op);
      var newParent = Node.get(editor, Path.parent(truePath));
      var newIndex = truePath[truePath.length - 1];
      newParent.children.splice(newIndex, 0, _node3);
      if (selection) {
        for (var [_point3, _key3] of Range.points(selection)) {
          selection[_key3] = Point.transform(_point3, op);
        }
      }
      break;
    }
    case "remove_node": {
      var {
        path: _path4
      } = op;
      var _index3 = _path4[_path4.length - 1];
      var _parent3 = Node.parent(editor, _path4);
      _parent3.children.splice(_index3, 1);
      if (selection) {
        for (var [_point4, _key4] of Range.points(selection)) {
          var result = Point.transform(_point4, op);
          if (selection != null && result != null) {
            selection[_key4] = result;
          } else {
            var _prev = void 0;
            var next3 = void 0;
            for (var [n2, p2] of Node.texts(editor)) {
              if (Path.compare(p2, _path4) === -1) {
                _prev = [n2, p2];
              } else {
                next3 = [n2, p2];
                break;
              }
            }
            var preferNext = false;
            if (_prev && next3) {
              if (Path.equals(next3[1], _path4)) {
                preferNext = !Path.hasPrevious(next3[1]);
              } else {
                preferNext = Path.common(_prev[1], _path4).length < Path.common(next3[1], _path4).length;
              }
            }
            if (_prev && !preferNext) {
              _point4.path = _prev[1];
              _point4.offset = _prev[0].text.length;
            } else if (next3) {
              _point4.path = next3[1];
              _point4.offset = 0;
            } else {
              selection = null;
            }
          }
        }
      }
      break;
    }
    case "remove_text": {
      var {
        path: _path5,
        offset: _offset,
        text: _text
      } = op;
      if (_text.length === 0) break;
      var _node4 = Node.leaf(editor, _path5);
      var _before = _node4.text.slice(0, _offset);
      var _after = _node4.text.slice(_offset + _text.length);
      _node4.text = _before + _after;
      if (selection) {
        for (var [_point5, _key5] of Range.points(selection)) {
          selection[_key5] = Point.transform(_point5, op);
        }
      }
      break;
    }
    case "set_node": {
      var {
        path: _path6,
        properties,
        newProperties
      } = op;
      if (_path6.length === 0) {
        throw new Error("Cannot set properties on the root node!");
      }
      var _node5 = Node.get(editor, _path6);
      for (var _key6 in newProperties) {
        if (_key6 === "children" || _key6 === "text") {
          throw new Error('Cannot set the "'.concat(_key6, '" property of nodes!'));
        }
        var value = newProperties[_key6];
        if (value == null) {
          delete _node5[_key6];
        } else {
          _node5[_key6] = value;
        }
      }
      for (var _key7 in properties) {
        if (!newProperties.hasOwnProperty(_key7)) {
          delete _node5[_key7];
        }
      }
      break;
    }
    case "set_selection": {
      var {
        newProperties: _newProperties
      } = op;
      if (_newProperties == null) {
        selection = _newProperties;
      } else {
        if (selection == null) {
          if (!Range.isRange(_newProperties)) {
            throw new Error('Cannot apply an incomplete "set_selection" operation properties '.concat(Scrubber.stringify(_newProperties), " when there is no current selection."));
          }
          selection = _objectSpread$e({}, _newProperties);
        }
        for (var _key8 in _newProperties) {
          var _value = _newProperties[_key8];
          if (_value == null) {
            if (_key8 === "anchor" || _key8 === "focus") {
              throw new Error('Cannot remove the "'.concat(_key8, '" selection property'));
            }
            delete selection[_key8];
          } else {
            selection[_key8] = _value;
          }
        }
      }
      break;
    }
    case "split_node": {
      var {
        path: _path7,
        position,
        properties: _properties
      } = op;
      if (_path7.length === 0) {
        throw new Error('Cannot apply a "split_node" operation at path ['.concat(_path7, "] because the root node cannot be split."));
      }
      var _node6 = Node.get(editor, _path7);
      var _parent4 = Node.parent(editor, _path7);
      var _index4 = _path7[_path7.length - 1];
      var newNode;
      if (Text$1.isText(_node6)) {
        var _before2 = _node6.text.slice(0, position);
        var _after2 = _node6.text.slice(position);
        _node6.text = _before2;
        newNode = _objectSpread$e(_objectSpread$e({}, _properties), {}, {
          text: _after2
        });
      } else {
        var _before3 = _node6.children.slice(0, position);
        var _after3 = _node6.children.slice(position);
        _node6.children = _before3;
        newNode = _objectSpread$e(_objectSpread$e({}, _properties), {}, {
          children: _after3
        });
      }
      _parent4.children.splice(_index4 + 1, 0, newNode);
      if (selection) {
        for (var [_point6, _key9] of Range.points(selection)) {
          selection[_key9] = Point.transform(_point6, op);
        }
      }
      break;
    }
  }
  return selection;
};
var GeneralTransforms = {
  transform(editor, op) {
    editor.children = createDraft(editor.children);
    var selection = editor.selection && createDraft(editor.selection);
    try {
      selection = applyToDraft(editor, selection, op);
    } finally {
      editor.children = finishDraft(editor.children);
      if (selection) {
        editor.selection = isDraft(selection) ? finishDraft(selection) : selection;
      } else {
        editor.selection = null;
      }
    }
  }
};
var NodeTransforms = {
  insertNodes(editor, nodes2, options) {
    editor.insertNodes(nodes2, options);
  },
  liftNodes(editor, options) {
    editor.liftNodes(options);
  },
  mergeNodes(editor, options) {
    editor.mergeNodes(options);
  },
  moveNodes(editor, options) {
    editor.moveNodes(options);
  },
  removeNodes(editor, options) {
    editor.removeNodes(options);
  },
  setNodes(editor, props, options) {
    editor.setNodes(props, options);
  },
  splitNodes(editor, options) {
    editor.splitNodes(options);
  },
  unsetNodes(editor, props, options) {
    editor.unsetNodes(props, options);
  },
  unwrapNodes(editor, options) {
    editor.unwrapNodes(options);
  },
  wrapNodes(editor, element, options) {
    editor.wrapNodes(element, options);
  }
};
var SelectionTransforms = {
  collapse(editor, options) {
    editor.collapse(options);
  },
  deselect(editor) {
    editor.deselect();
  },
  move(editor, options) {
    editor.move(options);
  },
  select(editor, target) {
    editor.select(target);
  },
  setPoint(editor, props, options) {
    editor.setPoint(props, options);
  },
  setSelection(editor, props) {
    editor.setSelection(props);
  }
};
var isDeepEqual = (node3, another) => {
  for (var key in node3) {
    var a = node3[key];
    var b = another[key];
    if (isPlainObject$1(a) && isPlainObject$1(b)) {
      if (!isDeepEqual(a, b)) return false;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
    } else if (a !== b) {
      return false;
    }
  }
  for (var _key in another) {
    if (node3[_key] === void 0 && another[_key] !== void 0) {
      return false;
    }
  }
  return true;
};
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties$1(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$1(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
var _excluded$4 = ["anchor", "focus"];
function ownKeys$d(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$d(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$d(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$d(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Range = {
  edges(range2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var {
      reverse = false
    } = options;
    var {
      anchor,
      focus: focus2
    } = range2;
    return Range.isBackward(range2) === reverse ? [anchor, focus2] : [focus2, anchor];
  },
  end(range2) {
    var [, end2] = Range.edges(range2);
    return end2;
  },
  equals(range2, another) {
    return Point.equals(range2.anchor, another.anchor) && Point.equals(range2.focus, another.focus);
  },
  includes(range2, target) {
    if (Range.isRange(target)) {
      if (Range.includes(range2, target.anchor) || Range.includes(range2, target.focus)) {
        return true;
      }
      var [rs, re2] = Range.edges(range2);
      var [ts, te2] = Range.edges(target);
      return Point.isBefore(rs, ts) && Point.isAfter(re2, te2);
    }
    var [start2, end2] = Range.edges(range2);
    var isAfterStart = false;
    var isBeforeEnd = false;
    if (Point.isPoint(target)) {
      isAfterStart = Point.compare(target, start2) >= 0;
      isBeforeEnd = Point.compare(target, end2) <= 0;
    } else {
      isAfterStart = Path.compare(target, start2.path) >= 0;
      isBeforeEnd = Path.compare(target, end2.path) <= 0;
    }
    return isAfterStart && isBeforeEnd;
  },
  intersection(range2, another) {
    var rest = _objectWithoutProperties$1(range2, _excluded$4);
    var [s1, e1] = Range.edges(range2);
    var [s2, e2] = Range.edges(another);
    var start2 = Point.isBefore(s1, s2) ? s2 : s1;
    var end2 = Point.isBefore(e1, e2) ? e1 : e2;
    if (Point.isBefore(end2, start2)) {
      return null;
    } else {
      return _objectSpread$d({
        anchor: start2,
        focus: end2
      }, rest);
    }
  },
  isBackward(range2) {
    var {
      anchor,
      focus: focus2
    } = range2;
    return Point.isAfter(anchor, focus2);
  },
  isCollapsed(range2) {
    var {
      anchor,
      focus: focus2
    } = range2;
    return Point.equals(anchor, focus2);
  },
  isExpanded(range2) {
    return !Range.isCollapsed(range2);
  },
  isForward(range2) {
    return !Range.isBackward(range2);
  },
  isRange(value) {
    return isPlainObject$1(value) && Point.isPoint(value.anchor) && Point.isPoint(value.focus);
  },
  *points(range2) {
    yield [range2.anchor, "anchor"];
    yield [range2.focus, "focus"];
  },
  start(range2) {
    var [start2] = Range.edges(range2);
    return start2;
  },
  transform(range2, op) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return produce(range2, (r2) => {
      if (r2 === null) {
        return null;
      }
      var {
        affinity = "inward"
      } = options;
      var affinityAnchor;
      var affinityFocus;
      if (affinity === "inward") {
        var isCollapsed = Range.isCollapsed(r2);
        if (Range.isForward(r2)) {
          affinityAnchor = "forward";
          affinityFocus = isCollapsed ? affinityAnchor : "backward";
        } else {
          affinityAnchor = "backward";
          affinityFocus = isCollapsed ? affinityAnchor : "forward";
        }
      } else if (affinity === "outward") {
        if (Range.isForward(r2)) {
          affinityAnchor = "backward";
          affinityFocus = "forward";
        } else {
          affinityAnchor = "forward";
          affinityFocus = "backward";
        }
      } else {
        affinityAnchor = affinity;
        affinityFocus = affinity;
      }
      var anchor = Point.transform(r2.anchor, op, {
        affinity: affinityAnchor
      });
      var focus2 = Point.transform(r2.focus, op, {
        affinity: affinityFocus
      });
      if (!anchor || !focus2) {
        return null;
      }
      r2.anchor = anchor;
      r2.focus = focus2;
    });
  }
};
var isElement$1 = (value) => {
  return isPlainObject$1(value) && Node.isNodeList(value.children) && !Editor.isEditor(value);
};
var Element$2 = {
  isAncestor(value) {
    return isPlainObject$1(value) && Node.isNodeList(value.children);
  },
  isElement: isElement$1,
  isElementList(value) {
    return Array.isArray(value) && value.every((val) => Element$2.isElement(val));
  },
  isElementProps(props) {
    return props.children !== void 0;
  },
  isElementType: function isElementType(value, elementVal) {
    var elementKey = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "type";
    return isElement$1(value) && value[elementKey] === elementVal;
  },
  matches(element, props) {
    for (var key in props) {
      if (key === "children") {
        continue;
      }
      if (element[key] !== props[key]) {
        return false;
      }
    }
    return true;
  }
};
var _excluded$3$1 = ["children"], _excluded2$3 = ["text"];
var IS_NODE_LIST_CACHE = /* @__PURE__ */ new WeakMap();
var Node = {
  ancestor(root2, path3) {
    var node3 = Node.get(root2, path3);
    if (Text$1.isText(node3)) {
      throw new Error("Cannot get the ancestor node at path [".concat(path3, "] because it refers to a text node instead: ").concat(Scrubber.stringify(node3)));
    }
    return node3;
  },
  ancestors(root2, path3) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return function* () {
      for (var p2 of Path.ancestors(path3, options)) {
        var n2 = Node.ancestor(root2, p2);
        var entry = [n2, p2];
        yield entry;
      }
    }();
  },
  child(root2, index) {
    if (Text$1.isText(root2)) {
      throw new Error("Cannot get the child of a text node: ".concat(Scrubber.stringify(root2)));
    }
    var c = root2.children[index];
    if (c == null) {
      throw new Error("Cannot get child at index `".concat(index, "` in node: ").concat(Scrubber.stringify(root2)));
    }
    return c;
  },
  children(root2, path3) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return function* () {
      var {
        reverse = false
      } = options;
      var ancestor = Node.ancestor(root2, path3);
      var {
        children
      } = ancestor;
      var index = reverse ? children.length - 1 : 0;
      while (reverse ? index >= 0 : index < children.length) {
        var child = Node.child(ancestor, index);
        var childPath = path3.concat(index);
        yield [child, childPath];
        index = reverse ? index - 1 : index + 1;
      }
    }();
  },
  common(root2, path3, another) {
    var p2 = Path.common(path3, another);
    var n2 = Node.get(root2, p2);
    return [n2, p2];
  },
  descendant(root2, path3) {
    var node3 = Node.get(root2, path3);
    if (Editor.isEditor(node3)) {
      throw new Error("Cannot get the descendant node at path [".concat(path3, "] because it refers to the root editor node instead: ").concat(Scrubber.stringify(node3)));
    }
    return node3;
  },
  descendants(root2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return function* () {
      for (var [node3, path3] of Node.nodes(root2, options)) {
        if (path3.length !== 0) {
          yield [node3, path3];
        }
      }
    }();
  },
  elements(root2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return function* () {
      for (var [node3, path3] of Node.nodes(root2, options)) {
        if (Element$2.isElement(node3)) {
          yield [node3, path3];
        }
      }
    }();
  },
  extractProps(node3) {
    if (Element$2.isAncestor(node3)) {
      var properties = _objectWithoutProperties$1(node3, _excluded$3$1);
      return properties;
    } else {
      var properties = _objectWithoutProperties$1(node3, _excluded2$3);
      return properties;
    }
  },
  first(root2, path3) {
    var p2 = path3.slice();
    var n2 = Node.get(root2, p2);
    while (n2) {
      if (Text$1.isText(n2) || n2.children.length === 0) {
        break;
      } else {
        n2 = n2.children[0];
        p2.push(0);
      }
    }
    return [n2, p2];
  },
  fragment(root2, range2) {
    if (Text$1.isText(root2)) {
      throw new Error("Cannot get a fragment starting from a root text node: ".concat(Scrubber.stringify(root2)));
    }
    var newRoot = produce({
      children: root2.children
    }, (r2) => {
      var [start2, end2] = Range.edges(range2);
      var nodeEntries = Node.nodes(r2, {
        reverse: true,
        pass: (_ref) => {
          var [, path4] = _ref;
          return !Range.includes(range2, path4);
        }
      });
      for (var [, path3] of nodeEntries) {
        if (!Range.includes(range2, path3)) {
          var parent3 = Node.parent(r2, path3);
          var index = path3[path3.length - 1];
          parent3.children.splice(index, 1);
        }
        if (Path.equals(path3, end2.path)) {
          var leaf3 = Node.leaf(r2, path3);
          leaf3.text = leaf3.text.slice(0, end2.offset);
        }
        if (Path.equals(path3, start2.path)) {
          var _leaf = Node.leaf(r2, path3);
          _leaf.text = _leaf.text.slice(start2.offset);
        }
      }
      if (Editor.isEditor(r2)) {
        r2.selection = null;
      }
    });
    return newRoot.children;
  },
  get(root2, path3) {
    var node3 = root2;
    for (var i = 0; i < path3.length; i++) {
      var p2 = path3[i];
      if (Text$1.isText(node3) || !node3.children[p2]) {
        throw new Error("Cannot find a descendant at path [".concat(path3, "] in node: ").concat(Scrubber.stringify(root2)));
      }
      node3 = node3.children[p2];
    }
    return node3;
  },
  has(root2, path3) {
    var node3 = root2;
    for (var i = 0; i < path3.length; i++) {
      var p2 = path3[i];
      if (Text$1.isText(node3) || !node3.children[p2]) {
        return false;
      }
      node3 = node3.children[p2];
    }
    return true;
  },
  isNode(value) {
    return Text$1.isText(value) || Element$2.isElement(value) || Editor.isEditor(value);
  },
  isNodeList(value) {
    if (!Array.isArray(value)) {
      return false;
    }
    var cachedResult = IS_NODE_LIST_CACHE.get(value);
    if (cachedResult !== void 0) {
      return cachedResult;
    }
    var isNodeList = value.every((val) => Node.isNode(val));
    IS_NODE_LIST_CACHE.set(value, isNodeList);
    return isNodeList;
  },
  last(root2, path3) {
    var p2 = path3.slice();
    var n2 = Node.get(root2, p2);
    while (n2) {
      if (Text$1.isText(n2) || n2.children.length === 0) {
        break;
      } else {
        var i = n2.children.length - 1;
        n2 = n2.children[i];
        p2.push(i);
      }
    }
    return [n2, p2];
  },
  leaf(root2, path3) {
    var node3 = Node.get(root2, path3);
    if (!Text$1.isText(node3)) {
      throw new Error("Cannot get the leaf node at path [".concat(path3, "] because it refers to a non-leaf node: ").concat(Scrubber.stringify(node3)));
    }
    return node3;
  },
  levels(root2, path3) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return function* () {
      for (var p2 of Path.levels(path3, options)) {
        var n2 = Node.get(root2, p2);
        yield [n2, p2];
      }
    }();
  },
  matches(node3, props) {
    return Element$2.isElement(node3) && Element$2.isElementProps(props) && Element$2.matches(node3, props) || Text$1.isText(node3) && Text$1.isTextProps(props) && Text$1.matches(node3, props);
  },
  nodes(root2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return function* () {
      var {
        pass,
        reverse = false
      } = options;
      var {
        from = [],
        to
      } = options;
      var visited = /* @__PURE__ */ new Set();
      var p2 = [];
      var n2 = root2;
      while (true) {
        if (to && (reverse ? Path.isBefore(p2, to) : Path.isAfter(p2, to))) {
          break;
        }
        if (!visited.has(n2)) {
          yield [n2, p2];
        }
        if (!visited.has(n2) && !Text$1.isText(n2) && n2.children.length !== 0 && (pass == null || pass([n2, p2]) === false)) {
          visited.add(n2);
          var nextIndex = reverse ? n2.children.length - 1 : 0;
          if (Path.isAncestor(p2, from)) {
            nextIndex = from[p2.length];
          }
          p2 = p2.concat(nextIndex);
          n2 = Node.get(root2, p2);
          continue;
        }
        if (p2.length === 0) {
          break;
        }
        if (!reverse) {
          var newPath = Path.next(p2);
          if (Node.has(root2, newPath)) {
            p2 = newPath;
            n2 = Node.get(root2, p2);
            continue;
          }
        }
        if (reverse && p2[p2.length - 1] !== 0) {
          var _newPath = Path.previous(p2);
          p2 = _newPath;
          n2 = Node.get(root2, p2);
          continue;
        }
        p2 = Path.parent(p2);
        n2 = Node.get(root2, p2);
        visited.add(n2);
      }
    }();
  },
  parent(root2, path3) {
    var parentPath = Path.parent(path3);
    var p2 = Node.get(root2, parentPath);
    if (Text$1.isText(p2)) {
      throw new Error("Cannot get the parent of path [".concat(path3, "] because it does not exist in the root."));
    }
    return p2;
  },
  string(node3) {
    if (Text$1.isText(node3)) {
      return node3.text;
    } else {
      return node3.children.map(Node.string).join("");
    }
  },
  texts(root2) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return function* () {
      for (var [node3, path3] of Node.nodes(root2, options)) {
        if (Text$1.isText(node3)) {
          yield [node3, path3];
        }
      }
    }();
  }
};
function ownKeys$c(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$c(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$c(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$c(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Operation = {
  isNodeOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith("_node");
  },
  isOperation(value) {
    if (!isPlainObject$1(value)) {
      return false;
    }
    switch (value.type) {
      case "insert_node":
        return Path.isPath(value.path) && Node.isNode(value.node);
      case "insert_text":
        return typeof value.offset === "number" && typeof value.text === "string" && Path.isPath(value.path);
      case "merge_node":
        return typeof value.position === "number" && Path.isPath(value.path) && isPlainObject$1(value.properties);
      case "move_node":
        return Path.isPath(value.path) && Path.isPath(value.newPath);
      case "remove_node":
        return Path.isPath(value.path) && Node.isNode(value.node);
      case "remove_text":
        return typeof value.offset === "number" && typeof value.text === "string" && Path.isPath(value.path);
      case "set_node":
        return Path.isPath(value.path) && isPlainObject$1(value.properties) && isPlainObject$1(value.newProperties);
      case "set_selection":
        return value.properties === null && Range.isRange(value.newProperties) || value.newProperties === null && Range.isRange(value.properties) || isPlainObject$1(value.properties) && isPlainObject$1(value.newProperties);
      case "split_node":
        return Path.isPath(value.path) && typeof value.position === "number" && isPlainObject$1(value.properties);
      default:
        return false;
    }
  },
  isOperationList(value) {
    return Array.isArray(value) && value.every((val) => Operation.isOperation(val));
  },
  isSelectionOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith("_selection");
  },
  isTextOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith("_text");
  },
  inverse(op) {
    switch (op.type) {
      case "insert_node": {
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          type: "remove_node"
        });
      }
      case "insert_text": {
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          type: "remove_text"
        });
      }
      case "merge_node": {
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          type: "split_node",
          path: Path.previous(op.path)
        });
      }
      case "move_node": {
        var {
          newPath,
          path: path3
        } = op;
        if (Path.equals(newPath, path3)) {
          return op;
        }
        if (Path.isSibling(path3, newPath)) {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            path: newPath,
            newPath: path3
          });
        }
        var inversePath = Path.transform(path3, op);
        var inverseNewPath = Path.transform(Path.next(path3), op);
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          path: inversePath,
          newPath: inverseNewPath
        });
      }
      case "remove_node": {
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          type: "insert_node"
        });
      }
      case "remove_text": {
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          type: "insert_text"
        });
      }
      case "set_node": {
        var {
          properties,
          newProperties
        } = op;
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          properties: newProperties,
          newProperties: properties
        });
      }
      case "set_selection": {
        var {
          properties: _properties,
          newProperties: _newProperties
        } = op;
        if (_properties == null) {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            properties: _newProperties,
            newProperties: null
          });
        } else if (_newProperties == null) {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            properties: null,
            newProperties: _properties
          });
        } else {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            properties: _newProperties,
            newProperties: _properties
          });
        }
      }
      case "split_node": {
        return _objectSpread$c(_objectSpread$c({}, op), {}, {
          type: "merge_node",
          path: Path.next(op.path)
        });
      }
    }
  }
};
var IS_EDITOR_CACHE = /* @__PURE__ */ new WeakMap();
var isEditor = (value) => {
  var cachedIsEditor = IS_EDITOR_CACHE.get(value);
  if (cachedIsEditor !== void 0) {
    return cachedIsEditor;
  }
  if (!isPlainObject$1(value)) {
    return false;
  }
  var isEditor2 = typeof value.addMark === "function" && typeof value.apply === "function" && typeof value.deleteFragment === "function" && typeof value.insertBreak === "function" && typeof value.insertSoftBreak === "function" && typeof value.insertFragment === "function" && typeof value.insertNode === "function" && typeof value.insertText === "function" && typeof value.isElementReadOnly === "function" && typeof value.isInline === "function" && typeof value.isSelectable === "function" && typeof value.isVoid === "function" && typeof value.normalizeNode === "function" && typeof value.onChange === "function" && typeof value.removeMark === "function" && typeof value.getDirtyPaths === "function" && (value.marks === null || isPlainObject$1(value.marks)) && (value.selection === null || Range.isRange(value.selection)) && Node.isNodeList(value.children) && Operation.isOperationList(value.operations);
  IS_EDITOR_CACHE.set(value, isEditor2);
  return isEditor2;
};
var Editor = {
  above(editor, options) {
    return editor.above(options);
  },
  addMark(editor, key, value) {
    editor.addMark(key, value);
  },
  after(editor, at, options) {
    return editor.after(at, options);
  },
  before(editor, at, options) {
    return editor.before(at, options);
  },
  deleteBackward(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var {
      unit = "character"
    } = options;
    editor.deleteBackward(unit);
  },
  deleteForward(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var {
      unit = "character"
    } = options;
    editor.deleteForward(unit);
  },
  deleteFragment(editor, options) {
    editor.deleteFragment(options);
  },
  edges(editor, at) {
    return editor.edges(at);
  },
  elementReadOnly(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return editor.elementReadOnly(options);
  },
  end(editor, at) {
    return editor.end(at);
  },
  first(editor, at) {
    return editor.first(at);
  },
  fragment(editor, at) {
    return editor.fragment(at);
  },
  hasBlocks(editor, element) {
    return editor.hasBlocks(element);
  },
  hasInlines(editor, element) {
    return editor.hasInlines(element);
  },
  hasPath(editor, path3) {
    return editor.hasPath(path3);
  },
  hasTexts(editor, element) {
    return editor.hasTexts(element);
  },
  insertBreak(editor) {
    editor.insertBreak();
  },
  insertFragment(editor, fragment2, options) {
    editor.insertFragment(fragment2, options);
  },
  insertNode(editor, node3) {
    editor.insertNode(node3);
  },
  insertSoftBreak(editor) {
    editor.insertSoftBreak();
  },
  insertText(editor, text) {
    editor.insertText(text);
  },
  isBlock(editor, value) {
    return editor.isBlock(value);
  },
  isEdge(editor, point3, at) {
    return editor.isEdge(point3, at);
  },
  isEditor(value) {
    return isEditor(value);
  },
  isElementReadOnly(editor, element) {
    return editor.isElementReadOnly(element);
  },
  isEmpty(editor, element) {
    return editor.isEmpty(element);
  },
  isEnd(editor, point3, at) {
    return editor.isEnd(point3, at);
  },
  isInline(editor, value) {
    return editor.isInline(value);
  },
  isNormalizing(editor) {
    return editor.isNormalizing();
  },
  isSelectable(editor, value) {
    return editor.isSelectable(value);
  },
  isStart(editor, point3, at) {
    return editor.isStart(point3, at);
  },
  isVoid(editor, value) {
    return editor.isVoid(value);
  },
  last(editor, at) {
    return editor.last(at);
  },
  leaf(editor, at, options) {
    return editor.leaf(at, options);
  },
  levels(editor, options) {
    return editor.levels(options);
  },
  marks(editor) {
    return editor.getMarks();
  },
  next(editor, options) {
    return editor.next(options);
  },
  node(editor, at, options) {
    return editor.node(at, options);
  },
  nodes(editor, options) {
    return editor.nodes(options);
  },
  normalize(editor, options) {
    editor.normalize(options);
  },
  parent(editor, at, options) {
    return editor.parent(at, options);
  },
  path(editor, at, options) {
    return editor.path(at, options);
  },
  pathRef(editor, path3, options) {
    return editor.pathRef(path3, options);
  },
  pathRefs(editor) {
    return editor.pathRefs();
  },
  point(editor, at, options) {
    return editor.point(at, options);
  },
  pointRef(editor, point3, options) {
    return editor.pointRef(point3, options);
  },
  pointRefs(editor) {
    return editor.pointRefs();
  },
  positions(editor, options) {
    return editor.positions(options);
  },
  previous(editor, options) {
    return editor.previous(options);
  },
  range(editor, at, to) {
    return editor.range(at, to);
  },
  rangeRef(editor, range2, options) {
    return editor.rangeRef(range2, options);
  },
  rangeRefs(editor) {
    return editor.rangeRefs();
  },
  removeMark(editor, key) {
    editor.removeMark(key);
  },
  setNormalizing(editor, isNormalizing2) {
    editor.setNormalizing(isNormalizing2);
  },
  start(editor, at) {
    return editor.start(at);
  },
  string(editor, at, options) {
    return editor.string(at, options);
  },
  unhangRange(editor, range2, options) {
    return editor.unhangRange(range2, options);
  },
  void(editor, options) {
    return editor.void(options);
  },
  withoutNormalizing(editor, fn) {
    editor.withoutNormalizing(fn);
  }
};
var Span = {
  isSpan(value) {
    return Array.isArray(value) && value.length === 2 && value.every(Path.isPath);
  }
};
function ownKeys$b(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$b(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$b(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$b(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Point = {
  compare(point3, another) {
    var result = Path.compare(point3.path, another.path);
    if (result === 0) {
      if (point3.offset < another.offset) return -1;
      if (point3.offset > another.offset) return 1;
      return 0;
    }
    return result;
  },
  isAfter(point3, another) {
    return Point.compare(point3, another) === 1;
  },
  isBefore(point3, another) {
    return Point.compare(point3, another) === -1;
  },
  equals(point3, another) {
    return point3.offset === another.offset && Path.equals(point3.path, another.path);
  },
  isPoint(value) {
    return isPlainObject$1(value) && typeof value.offset === "number" && Path.isPath(value.path);
  },
  transform(point3, op) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return produce(point3, (p2) => {
      if (p2 === null) {
        return null;
      }
      var {
        affinity = "forward"
      } = options;
      var {
        path: path3,
        offset
      } = p2;
      switch (op.type) {
        case "insert_node":
        case "move_node": {
          p2.path = Path.transform(path3, op, options);
          break;
        }
        case "insert_text": {
          if (Path.equals(op.path, path3) && (op.offset < offset || op.offset === offset && affinity === "forward")) {
            p2.offset += op.text.length;
          }
          break;
        }
        case "merge_node": {
          if (Path.equals(op.path, path3)) {
            p2.offset += op.position;
          }
          p2.path = Path.transform(path3, op, options);
          break;
        }
        case "remove_text": {
          if (Path.equals(op.path, path3) && op.offset <= offset) {
            p2.offset -= Math.min(offset - op.offset, op.text.length);
          }
          break;
        }
        case "remove_node": {
          if (Path.equals(op.path, path3) || Path.isAncestor(op.path, path3)) {
            return null;
          }
          p2.path = Path.transform(path3, op, options);
          break;
        }
        case "split_node": {
          if (Path.equals(op.path, path3)) {
            if (op.position === offset && affinity == null) {
              return null;
            } else if (op.position < offset || op.position === offset && affinity === "forward") {
              p2.offset -= op.position;
              p2.path = Path.transform(path3, op, _objectSpread$b(_objectSpread$b({}, options), {}, {
                affinity: "forward"
              }));
            }
          } else {
            p2.path = Path.transform(path3, op, options);
          }
          break;
        }
      }
    });
  }
};
var _scrubber = void 0;
var Scrubber = {
  setScrubber(scrubber) {
    _scrubber = scrubber;
  },
  stringify(value) {
    return JSON.stringify(value, _scrubber);
  }
};
var _excluded$2$1 = ["text"], _excluded2$2 = ["anchor", "focus"];
function ownKeys$a(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$a(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$a(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$a(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Text$1 = {
  equals(text, another) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var {
      loose = false
    } = options;
    function omitText(obj) {
      var rest = _objectWithoutProperties$1(obj, _excluded$2$1);
      return rest;
    }
    return isDeepEqual(loose ? omitText(text) : text, loose ? omitText(another) : another);
  },
  isText(value) {
    return isPlainObject$1(value) && typeof value.text === "string";
  },
  isTextList(value) {
    return Array.isArray(value) && value.every((val) => Text$1.isText(val));
  },
  isTextProps(props) {
    return props.text !== void 0;
  },
  matches(text, props) {
    for (var key in props) {
      if (key === "text") {
        continue;
      }
      if (!text.hasOwnProperty(key) || text[key] !== props[key]) {
        return false;
      }
    }
    return true;
  },
  decorations(node3, decorations) {
    var leaves = [_objectSpread$a({}, node3)];
    for (var dec of decorations) {
      var rest = _objectWithoutProperties$1(dec, _excluded2$2);
      var [start2, end2] = Range.edges(dec);
      var next3 = [];
      var leafEnd = 0;
      var decorationStart = start2.offset;
      var decorationEnd = end2.offset;
      for (var leaf3 of leaves) {
        var {
          length
        } = leaf3.text;
        var leafStart = leafEnd;
        leafEnd += length;
        if (decorationStart <= leafStart && leafEnd <= decorationEnd) {
          Object.assign(leaf3, rest);
          next3.push(leaf3);
          continue;
        }
        if (decorationStart !== decorationEnd && (decorationStart === leafEnd || decorationEnd === leafStart) || decorationStart > leafEnd || decorationEnd < leafStart || decorationEnd === leafStart && leafStart !== 0) {
          next3.push(leaf3);
          continue;
        }
        var middle = leaf3;
        var before3 = void 0;
        var after3 = void 0;
        if (decorationEnd < leafEnd) {
          var off = decorationEnd - leafStart;
          after3 = _objectSpread$a(_objectSpread$a({}, middle), {}, {
            text: middle.text.slice(off)
          });
          middle = _objectSpread$a(_objectSpread$a({}, middle), {}, {
            text: middle.text.slice(0, off)
          });
        }
        if (decorationStart > leafStart) {
          var _off = decorationStart - leafStart;
          before3 = _objectSpread$a(_objectSpread$a({}, middle), {}, {
            text: middle.text.slice(0, _off)
          });
          middle = _objectSpread$a(_objectSpread$a({}, middle), {}, {
            text: middle.text.slice(_off)
          });
        }
        Object.assign(middle, rest);
        if (before3) {
          next3.push(before3);
        }
        next3.push(middle);
        if (after3) {
          next3.push(after3);
        }
      }
      leaves = next3;
    }
    return leaves;
  }
};
var getDefaultInsertLocation = (editor) => {
  if (editor.selection) {
    return editor.selection;
  } else if (editor.children.length > 0) {
    return Editor.end(editor, []);
  } else {
    return [0];
  }
};
var matchPath = (editor, path3) => {
  var [node3] = Editor.node(editor, path3);
  return (n2) => n2 === node3;
};
var getCharacterDistance = function getCharacterDistance2(str) {
  var isRTL = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var isLTR = !isRTL;
  var codepoints = isRTL ? codepointsIteratorRTL(str) : str;
  var left = CodepointType.None;
  var right = CodepointType.None;
  var distance = 0;
  var gb11 = null;
  var gb12Or13 = null;
  for (var char of codepoints) {
    var code = char.codePointAt(0);
    if (!code) break;
    var type = getCodepointType(char, code);
    [left, right] = isLTR ? [right, type] : [type, left];
    if (intersects(left, CodepointType.ZWJ) && intersects(right, CodepointType.ExtPict)) {
      if (isLTR) {
        gb11 = endsWithEmojiZWJ(str.substring(0, distance));
      } else {
        gb11 = endsWithEmojiZWJ(str.substring(0, str.length - distance));
      }
      if (!gb11) break;
    }
    if (intersects(left, CodepointType.RI) && intersects(right, CodepointType.RI)) {
      if (gb12Or13 !== null) {
        gb12Or13 = !gb12Or13;
      } else {
        if (isLTR) {
          gb12Or13 = true;
        } else {
          gb12Or13 = endsWithOddNumberOfRIs(str.substring(0, str.length - distance));
        }
      }
      if (!gb12Or13) break;
    }
    if (left !== CodepointType.None && right !== CodepointType.None && isBoundaryPair(left, right)) {
      break;
    }
    distance += char.length;
  }
  return distance || 1;
};
var SPACE = /\s/;
var PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
var CHAMELEON = /['\u2018\u2019]/;
var getWordDistance = function getWordDistance2(text) {
  var isRTL = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var dist = 0;
  var started = false;
  while (text.length > 0) {
    var charDist = getCharacterDistance(text, isRTL);
    var [char, remaining] = splitByCharacterDistance(text, charDist, isRTL);
    if (isWordCharacter(char, remaining, isRTL)) {
      started = true;
      dist += charDist;
    } else if (!started) {
      dist += charDist;
    } else {
      break;
    }
    text = remaining;
  }
  return dist;
};
var splitByCharacterDistance = (str, dist, isRTL) => {
  if (isRTL) {
    var at = str.length - dist;
    return [str.slice(at, str.length), str.slice(0, at)];
  }
  return [str.slice(0, dist), str.slice(dist)];
};
var isWordCharacter = function isWordCharacter2(char, remaining) {
  var isRTL = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  if (SPACE.test(char)) {
    return false;
  }
  if (CHAMELEON.test(char)) {
    var charDist = getCharacterDistance(remaining, isRTL);
    var [nextChar, nextRemaining] = splitByCharacterDistance(remaining, charDist, isRTL);
    if (isWordCharacter2(nextChar, nextRemaining, isRTL)) {
      return true;
    }
  }
  if (PUNCTUATION.test(char)) {
    return false;
  }
  return true;
};
var codepointsIteratorRTL = function* codepointsIteratorRTL2(str) {
  var end2 = str.length - 1;
  for (var i = 0; i < str.length; i++) {
    var char1 = str.charAt(end2 - i);
    if (isLowSurrogate(char1.charCodeAt(0))) {
      var char2 = str.charAt(end2 - i - 1);
      if (isHighSurrogate(char2.charCodeAt(0))) {
        yield char2 + char1;
        i++;
        continue;
      }
    }
    yield char1;
  }
};
var isHighSurrogate = (charCode) => {
  return charCode >= 55296 && charCode <= 56319;
};
var isLowSurrogate = (charCode) => {
  return charCode >= 56320 && charCode <= 57343;
};
var CodepointType;
(function(CodepointType2) {
  CodepointType2[CodepointType2["None"] = 0] = "None";
  CodepointType2[CodepointType2["Extend"] = 1] = "Extend";
  CodepointType2[CodepointType2["ZWJ"] = 2] = "ZWJ";
  CodepointType2[CodepointType2["RI"] = 4] = "RI";
  CodepointType2[CodepointType2["Prepend"] = 8] = "Prepend";
  CodepointType2[CodepointType2["SpacingMark"] = 16] = "SpacingMark";
  CodepointType2[CodepointType2["L"] = 32] = "L";
  CodepointType2[CodepointType2["V"] = 64] = "V";
  CodepointType2[CodepointType2["T"] = 128] = "T";
  CodepointType2[CodepointType2["LV"] = 256] = "LV";
  CodepointType2[CodepointType2["LVT"] = 512] = "LVT";
  CodepointType2[CodepointType2["ExtPict"] = 1024] = "ExtPict";
  CodepointType2[CodepointType2["Any"] = 2048] = "Any";
})(CodepointType || (CodepointType = {}));
var reExtend = /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/;
var rePrepend = /^(?:[\u0600-\u0605\u06DD\u070F\u0890\u0891\u08E2\u0D4E]|\uD804[\uDCBD\uDCCD\uDDC2\uDDC3]|\uD806[\uDD3F\uDD41\uDE3A\uDE84-\uDE89]|\uD807\uDD46)$/;
var reSpacingMark = /^(?:[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0\u0CC1\u0CC3\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0D02\u0D03\u0D3F\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82\u0D83\u0DD0\u0DD1\u0DD8-\u0DDE\u0DF2\u0DF3\u0E33\u0EB3\u0F3E\u0F3F\u0F7F\u1031\u103B\u103C\u1056\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB1\uDCB2\uDCB9\uDCBB\uDCBC\uDCBE\uDCC1\uDDB0\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD31-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD66\uDD6D])$/;
var reL = /^[\u1100-\u115F\uA960-\uA97C]$/;
var reV = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/;
var reT = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/;
var reLV = /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/;
var reLVT = /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/;
var reExtPict = /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])$/;
var getCodepointType = (char, code) => {
  var type = CodepointType.Any;
  if (char.search(reExtend) !== -1) {
    type |= CodepointType.Extend;
  }
  if (code === 8205) {
    type |= CodepointType.ZWJ;
  }
  if (code >= 127462 && code <= 127487) {
    type |= CodepointType.RI;
  }
  if (char.search(rePrepend) !== -1) {
    type |= CodepointType.Prepend;
  }
  if (char.search(reSpacingMark) !== -1) {
    type |= CodepointType.SpacingMark;
  }
  if (char.search(reL) !== -1) {
    type |= CodepointType.L;
  }
  if (char.search(reV) !== -1) {
    type |= CodepointType.V;
  }
  if (char.search(reT) !== -1) {
    type |= CodepointType.T;
  }
  if (char.search(reLV) !== -1) {
    type |= CodepointType.LV;
  }
  if (char.search(reLVT) !== -1) {
    type |= CodepointType.LVT;
  }
  if (char.search(reExtPict) !== -1) {
    type |= CodepointType.ExtPict;
  }
  return type;
};
function intersects(x2, y2) {
  return (x2 & y2) !== 0;
}
var NonBoundaryPairs = [
  // GB6
  [CodepointType.L, CodepointType.L | CodepointType.V | CodepointType.LV | CodepointType.LVT],
  // GB7
  [CodepointType.LV | CodepointType.V, CodepointType.V | CodepointType.T],
  // GB8
  [CodepointType.LVT | CodepointType.T, CodepointType.T],
  // GB9
  [CodepointType.Any, CodepointType.Extend | CodepointType.ZWJ],
  // GB9a
  [CodepointType.Any, CodepointType.SpacingMark],
  // GB9b
  [CodepointType.Prepend, CodepointType.Any],
  // GB11
  [CodepointType.ZWJ, CodepointType.ExtPict],
  // GB12 and GB13
  [CodepointType.RI, CodepointType.RI]
];
function isBoundaryPair(left, right) {
  return NonBoundaryPairs.findIndex((r2) => intersects(left, r2[0]) && intersects(right, r2[1])) === -1;
}
var endingEmojiZWJ = /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])*\u200D$/;
var endsWithEmojiZWJ = (str) => {
  return str.search(endingEmojiZWJ) !== -1;
};
var endingRIs = /(?:\uD83C[\uDDE6-\uDDFF])+$/g;
var endsWithOddNumberOfRIs = (str) => {
  var match = str.match(endingRIs);
  if (match === null) {
    return false;
  } else {
    var numRIs = match[0].length / 2;
    return numRIs % 2 === 1;
  }
};
var TextTransforms = {
  delete(editor, options) {
    editor.delete(options);
  },
  insertFragment(editor, fragment2, options) {
    editor.insertFragment(fragment2, options);
  },
  insertText(editor, text) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        voids = false
      } = options;
      var {
        at = getDefaultInsertLocation(editor)
      } = options;
      if (Path.isPath(at)) {
        at = Editor.range(editor, at);
      }
      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor;
        } else {
          var end2 = Range.end(at);
          if (!voids && Editor.void(editor, {
            at: end2
          })) {
            return;
          }
          var start2 = Range.start(at);
          var startRef = Editor.pointRef(editor, start2);
          var endRef = Editor.pointRef(editor, end2);
          Transforms.delete(editor, {
            at,
            voids
          });
          var startPoint = startRef.unref();
          var endPoint = endRef.unref();
          at = startPoint || endPoint;
          Transforms.setSelection(editor, {
            anchor: at,
            focus: at
          });
        }
      }
      if (!voids && Editor.void(editor, {
        at
      }) || Editor.elementReadOnly(editor, {
        at
      })) {
        return;
      }
      var {
        path: path3,
        offset
      } = at;
      if (text.length > 0) editor.apply({
        type: "insert_text",
        path: path3,
        offset,
        text
      });
    });
  }
};
function ownKeys$9(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$9(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$9(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$9(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Transforms = _objectSpread$9(_objectSpread$9(_objectSpread$9(_objectSpread$9({}, GeneralTransforms), NodeTransforms), SelectionTransforms), TextTransforms);
var apply = (editor, op) => {
  for (var ref of Editor.pathRefs(editor)) {
    PathRef.transform(ref, op);
  }
  for (var _ref of Editor.pointRefs(editor)) {
    PointRef.transform(_ref, op);
  }
  for (var _ref2 of Editor.rangeRefs(editor)) {
    RangeRef.transform(_ref2, op);
  }
  var oldDirtyPaths = DIRTY_PATHS.get(editor) || [];
  var oldDirtyPathKeys = DIRTY_PATH_KEYS.get(editor) || /* @__PURE__ */ new Set();
  var dirtyPaths;
  var dirtyPathKeys;
  var add = (path4) => {
    if (path4) {
      var key = path4.join(",");
      if (!dirtyPathKeys.has(key)) {
        dirtyPathKeys.add(key);
        dirtyPaths.push(path4);
      }
    }
  };
  if (Path.operationCanTransformPath(op)) {
    dirtyPaths = [];
    dirtyPathKeys = /* @__PURE__ */ new Set();
    for (var path3 of oldDirtyPaths) {
      var newPath = Path.transform(path3, op);
      add(newPath);
    }
  } else {
    dirtyPaths = oldDirtyPaths;
    dirtyPathKeys = oldDirtyPathKeys;
  }
  var newDirtyPaths = editor.getDirtyPaths(op);
  for (var _path of newDirtyPaths) {
    add(_path);
  }
  DIRTY_PATHS.set(editor, dirtyPaths);
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys);
  Transforms.transform(editor, op);
  editor.operations.push(op);
  Editor.normalize(editor, {
    operation: op
  });
  if (op.type === "set_selection") {
    editor.marks = null;
  }
  if (!FLUSHING.get(editor)) {
    FLUSHING.set(editor, true);
    Promise.resolve().then(() => {
      FLUSHING.set(editor, false);
      editor.onChange({
        operation: op
      });
      editor.operations = [];
    });
  }
};
var getDirtyPaths = (editor, op) => {
  switch (op.type) {
    case "insert_text":
    case "remove_text":
    case "set_node": {
      var {
        path: path3
      } = op;
      return Path.levels(path3);
    }
    case "insert_node": {
      var {
        node: node3,
        path: _path
      } = op;
      var levels2 = Path.levels(_path);
      var descendants = Text$1.isText(node3) ? [] : Array.from(Node.nodes(node3), (_ref) => {
        var [, p3] = _ref;
        return _path.concat(p3);
      });
      return [...levels2, ...descendants];
    }
    case "merge_node": {
      var {
        path: _path2
      } = op;
      var ancestors = Path.ancestors(_path2);
      var previousPath = Path.previous(_path2);
      return [...ancestors, previousPath];
    }
    case "move_node": {
      var {
        path: _path3,
        newPath
      } = op;
      if (Path.equals(_path3, newPath)) {
        return [];
      }
      var oldAncestors = [];
      var newAncestors = [];
      for (var ancestor of Path.ancestors(_path3)) {
        var p2 = Path.transform(ancestor, op);
        oldAncestors.push(p2);
      }
      for (var _ancestor of Path.ancestors(newPath)) {
        var _p = Path.transform(_ancestor, op);
        newAncestors.push(_p);
      }
      var newParent = newAncestors[newAncestors.length - 1];
      var newIndex = newPath[newPath.length - 1];
      var resultPath = newParent.concat(newIndex);
      return [...oldAncestors, ...newAncestors, resultPath];
    }
    case "remove_node": {
      var {
        path: _path4
      } = op;
      var _ancestors = Path.ancestors(_path4);
      return [..._ancestors];
    }
    case "split_node": {
      var {
        path: _path5
      } = op;
      var _levels = Path.levels(_path5);
      var nextPath = Path.next(_path5);
      return [..._levels, nextPath];
    }
    default: {
      return [];
    }
  }
};
var getFragment = (editor) => {
  var {
    selection
  } = editor;
  if (selection) {
    return Node.fragment(editor, selection);
  }
  return [];
};
var normalizeNode = (editor, entry) => {
  var [node3, path3] = entry;
  if (Text$1.isText(node3)) {
    return;
  }
  if (Element$2.isElement(node3) && node3.children.length === 0) {
    var child = {
      text: ""
    };
    Transforms.insertNodes(editor, child, {
      at: path3.concat(0),
      voids: true
    });
    return;
  }
  var shouldHaveInlines = Editor.isEditor(node3) ? false : Element$2.isElement(node3) && (editor.isInline(node3) || node3.children.length === 0 || Text$1.isText(node3.children[0]) || editor.isInline(node3.children[0]));
  var n2 = 0;
  for (var i = 0; i < node3.children.length; i++, n2++) {
    var currentNode = Node.get(editor, path3);
    if (Text$1.isText(currentNode)) continue;
    var _child = currentNode.children[n2];
    var prev = currentNode.children[n2 - 1];
    var isLast = i === node3.children.length - 1;
    var isInlineOrText = Text$1.isText(_child) || Element$2.isElement(_child) && editor.isInline(_child);
    if (isInlineOrText !== shouldHaveInlines) {
      Transforms.removeNodes(editor, {
        at: path3.concat(n2),
        voids: true
      });
      n2--;
    } else if (Element$2.isElement(_child)) {
      if (editor.isInline(_child)) {
        if (prev == null || !Text$1.isText(prev)) {
          var newChild = {
            text: ""
          };
          Transforms.insertNodes(editor, newChild, {
            at: path3.concat(n2),
            voids: true
          });
          n2++;
        } else if (isLast) {
          var _newChild = {
            text: ""
          };
          Transforms.insertNodes(editor, _newChild, {
            at: path3.concat(n2 + 1),
            voids: true
          });
          n2++;
        }
      }
    } else {
      if (prev != null && Text$1.isText(prev)) {
        if (Text$1.equals(_child, prev, {
          loose: true
        })) {
          Transforms.mergeNodes(editor, {
            at: path3.concat(n2),
            voids: true
          });
          n2--;
        } else if (prev.text === "") {
          Transforms.removeNodes(editor, {
            at: path3.concat(n2 - 1),
            voids: true
          });
          n2--;
        } else if (_child.text === "") {
          Transforms.removeNodes(editor, {
            at: path3.concat(n2),
            voids: true
          });
          n2--;
        }
      }
    }
  }
};
var shouldNormalize = (editor, _ref) => {
  var {
    iteration,
    initialDirtyPathsLength
  } = _ref;
  var maxIterations = initialDirtyPathsLength * 42;
  if (iteration > maxIterations) {
    throw new Error("Could not completely normalize the editor after ".concat(maxIterations, " iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state."));
  }
  return true;
};
var above = function above2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    voids = false,
    mode = "lowest",
    at = editor.selection,
    match
  } = options;
  if (!at) {
    return;
  }
  var path3 = Editor.path(editor, at);
  var reverse = mode === "lowest";
  for (var [n2, p2] of Editor.levels(editor, {
    at: path3,
    voids,
    match,
    reverse
  })) {
    if (Text$1.isText(n2)) continue;
    if (Range.isRange(at)) {
      if (Path.isAncestor(p2, at.anchor.path) && Path.isAncestor(p2, at.focus.path)) {
        return [n2, p2];
      }
    } else {
      if (!Path.equals(path3, p2)) {
        return [n2, p2];
      }
    }
  }
};
function ownKeys$8(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$8(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$8(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$8(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var addMark = (editor, key, value) => {
  var {
    selection
  } = editor;
  if (selection) {
    var match = (node3, path3) => {
      if (!Text$1.isText(node3)) {
        return false;
      }
      var [parentNode2, parentPath] = Editor.parent(editor, path3);
      return !editor.isVoid(parentNode2) || editor.markableVoid(parentNode2);
    };
    var expandedSelection = Range.isExpanded(selection);
    var markAcceptingVoidSelected = false;
    if (!expandedSelection) {
      var [selectedNode, selectedPath] = Editor.node(editor, selection);
      if (selectedNode && match(selectedNode, selectedPath)) {
        var [parentNode] = Editor.parent(editor, selectedPath);
        markAcceptingVoidSelected = parentNode && editor.markableVoid(parentNode);
      }
    }
    if (expandedSelection || markAcceptingVoidSelected) {
      Transforms.setNodes(editor, {
        [key]: value
      }, {
        match,
        split: true,
        voids: true
      });
    } else {
      var marks3 = _objectSpread$8(_objectSpread$8({}, Editor.marks(editor) || {}), {}, {
        [key]: value
      });
      editor.marks = marks3;
      if (!FLUSHING.get(editor)) {
        editor.onChange();
      }
    }
  }
};
function ownKeys$7(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$7(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$7(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$7(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var after = function after2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var anchor = Editor.point(editor, at, {
    edge: "end"
  });
  var focus2 = Editor.end(editor, []);
  var range2 = {
    anchor,
    focus: focus2
  };
  var {
    distance = 1
  } = options;
  var d = 0;
  var target;
  for (var p2 of Editor.positions(editor, _objectSpread$7(_objectSpread$7({}, options), {}, {
    at: range2
  }))) {
    if (d > distance) {
      break;
    }
    if (d !== 0) {
      target = p2;
    }
    d++;
  }
  return target;
};
function ownKeys$6$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$6$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$6$1(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$6$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var before = function before2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var anchor = Editor.start(editor, []);
  var focus2 = Editor.point(editor, at, {
    edge: "start"
  });
  var range2 = {
    anchor,
    focus: focus2
  };
  var {
    distance = 1
  } = options;
  var d = 0;
  var target;
  for (var p2 of Editor.positions(editor, _objectSpread$6$1(_objectSpread$6$1({}, options), {}, {
    at: range2,
    reverse: true
  }))) {
    if (d > distance) {
      break;
    }
    if (d !== 0) {
      target = p2;
    }
    d++;
  }
  return target;
};
var deleteBackward = (editor, unit) => {
  var {
    selection
  } = editor;
  if (selection && Range.isCollapsed(selection)) {
    Transforms.delete(editor, {
      unit,
      reverse: true
    });
  }
};
var deleteForward = (editor, unit) => {
  var {
    selection
  } = editor;
  if (selection && Range.isCollapsed(selection)) {
    Transforms.delete(editor, {
      unit
    });
  }
};
var deleteFragment = function deleteFragment2(editor) {
  var {
    direction: direction2 = "forward"
  } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    selection
  } = editor;
  if (selection && Range.isExpanded(selection)) {
    Transforms.delete(editor, {
      reverse: direction2 === "backward"
    });
  }
};
var edges = (editor, at) => {
  return [Editor.start(editor, at), Editor.end(editor, at)];
};
function ownKeys$5$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$5$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$5$1(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$5$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var elementReadOnly = function elementReadOnly2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return Editor.above(editor, _objectSpread$5$1(_objectSpread$5$1({}, options), {}, {
    match: (n2) => Element$2.isElement(n2) && Editor.isElementReadOnly(editor, n2)
  }));
};
var end = (editor, at) => {
  return Editor.point(editor, at, {
    edge: "end"
  });
};
var first = (editor, at) => {
  var path3 = Editor.path(editor, at, {
    edge: "start"
  });
  return Editor.node(editor, path3);
};
var fragment = (editor, at) => {
  var range2 = Editor.range(editor, at);
  return Node.fragment(editor, range2);
};
function ownKeys$4$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$4$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$4$1(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$4$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var getVoid = function getVoid2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return Editor.above(editor, _objectSpread$4$1(_objectSpread$4$1({}, options), {}, {
    match: (n2) => Element$2.isElement(n2) && Editor.isVoid(editor, n2)
  }));
};
var hasBlocks = (editor, element) => {
  return element.children.some((n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2));
};
var hasInlines = (editor, element) => {
  return element.children.some((n2) => Text$1.isText(n2) || Editor.isInline(editor, n2));
};
var hasPath = (editor, path3) => {
  return Node.has(editor, path3);
};
var hasTexts = (editor, element) => {
  return element.children.every((n2) => Text$1.isText(n2));
};
var insertBreak = (editor) => {
  Transforms.splitNodes(editor, {
    always: true
  });
};
var insertNode = (editor, node3, options) => {
  Transforms.insertNodes(editor, node3, options);
};
var insertSoftBreak = (editor) => {
  Transforms.splitNodes(editor, {
    always: true
  });
};
function ownKeys$3$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$3$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$3$1(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$3$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var insertText = function insertText2(editor, text) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    selection,
    marks: marks3
  } = editor;
  if (selection) {
    if (marks3) {
      var node3 = _objectSpread$3$1({
        text
      }, marks3);
      Transforms.insertNodes(editor, node3, {
        at: options.at,
        voids: options.voids
      });
    } else {
      Transforms.insertText(editor, text, options);
    }
    editor.marks = null;
  }
};
var isBlock = (editor, value) => {
  return !editor.isInline(value);
};
var isEdge = (editor, point3, at) => {
  return Editor.isStart(editor, point3, at) || Editor.isEnd(editor, point3, at);
};
var isEmpty = (editor, element) => {
  var {
    children
  } = element;
  var [first2] = children;
  return children.length === 0 || children.length === 1 && Text$1.isText(first2) && first2.text === "" && !editor.isVoid(element);
};
var isEnd = (editor, point3, at) => {
  var end2 = Editor.end(editor, at);
  return Point.equals(point3, end2);
};
var isNormalizing = (editor) => {
  var isNormalizing2 = NORMALIZING.get(editor);
  return isNormalizing2 === void 0 ? true : isNormalizing2;
};
var isStart = (editor, point3, at) => {
  if (point3.offset !== 0) {
    return false;
  }
  var start2 = Editor.start(editor, at);
  return Point.equals(point3, start2);
};
var last = (editor, at) => {
  var path3 = Editor.path(editor, at, {
    edge: "end"
  });
  return Editor.node(editor, path3);
};
var leaf = function leaf2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var path3 = Editor.path(editor, at, options);
  var node3 = Node.leaf(editor, path3);
  return [node3, path3];
};
function levels(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return function* () {
    var {
      at = editor.selection,
      reverse = false,
      voids = false
    } = options;
    var {
      match
    } = options;
    if (match == null) {
      match = () => true;
    }
    if (!at) {
      return;
    }
    var levels2 = [];
    var path3 = Editor.path(editor, at);
    for (var [n2, p2] of Node.levels(editor, path3)) {
      if (!match(n2, p2)) {
        continue;
      }
      levels2.push([n2, p2]);
      if (!voids && Element$2.isElement(n2) && Editor.isVoid(editor, n2)) {
        break;
      }
    }
    if (reverse) {
      levels2.reverse();
    }
    yield* levels2;
  }();
}
var _excluded$1$1 = ["text"], _excluded2$1$1 = ["text"];
var marks = function marks2(editor) {
  var {
    marks: marks3,
    selection
  } = editor;
  if (!selection) {
    return null;
  }
  if (marks3) {
    return marks3;
  }
  if (Range.isExpanded(selection)) {
    var [match] = Editor.nodes(editor, {
      match: Text$1.isText
    });
    if (match) {
      var [_node] = match;
      var _rest = _objectWithoutProperties$1(_node, _excluded$1$1);
      return _rest;
    } else {
      return {};
    }
  }
  var {
    anchor
  } = selection;
  var {
    path: path3
  } = anchor;
  var [node3] = Editor.leaf(editor, path3);
  if (anchor.offset === 0) {
    var prev = Editor.previous(editor, {
      at: path3,
      match: Text$1.isText
    });
    var markedVoid = Editor.above(editor, {
      match: (n2) => Element$2.isElement(n2) && Editor.isVoid(editor, n2) && editor.markableVoid(n2)
    });
    if (!markedVoid) {
      var block = Editor.above(editor, {
        match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)
      });
      if (prev && block) {
        var [prevNode, prevPath] = prev;
        var [, blockPath] = block;
        if (Path.isAncestor(blockPath, prevPath)) {
          node3 = prevNode;
        }
      }
    }
  }
  var rest = _objectWithoutProperties$1(node3, _excluded2$1$1);
  return rest;
};
var next = function next2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    mode = "lowest",
    voids = false
  } = options;
  var {
    match,
    at = editor.selection
  } = options;
  if (!at) {
    return;
  }
  var pointAfterLocation = Editor.after(editor, at, {
    voids
  });
  if (!pointAfterLocation) return;
  var [, to] = Editor.last(editor, []);
  var span = [pointAfterLocation.path, to];
  if (Path.isPath(at) && at.length === 0) {
    throw new Error("Cannot get the next node from the root node!");
  }
  if (match == null) {
    if (Path.isPath(at)) {
      var [parent3] = Editor.parent(editor, at);
      match = (n2) => parent3.children.includes(n2);
    } else {
      match = () => true;
    }
  }
  var [next3] = Editor.nodes(editor, {
    at: span,
    match,
    mode,
    voids
  });
  return next3;
};
var node = function node2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var path3 = Editor.path(editor, at, options);
  var node3 = Node.get(editor, path3);
  return [node3, path3];
};
function nodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return function* () {
    var {
      at = editor.selection,
      mode = "all",
      universal = false,
      reverse = false,
      voids = false,
      ignoreNonSelectable = false
    } = options;
    var {
      match
    } = options;
    if (!match) {
      match = () => true;
    }
    if (!at) {
      return;
    }
    var from;
    var to;
    if (Span.isSpan(at)) {
      from = at[0];
      to = at[1];
    } else {
      var first2 = Editor.path(editor, at, {
        edge: "start"
      });
      var last2 = Editor.path(editor, at, {
        edge: "end"
      });
      from = reverse ? last2 : first2;
      to = reverse ? first2 : last2;
    }
    var nodeEntries = Node.nodes(editor, {
      reverse,
      from,
      to,
      pass: (_ref) => {
        var [node4] = _ref;
        if (!Element$2.isElement(node4)) return false;
        if (!voids && (Editor.isVoid(editor, node4) || Editor.isElementReadOnly(editor, node4))) return true;
        if (ignoreNonSelectable && !Editor.isSelectable(editor, node4)) return true;
        return false;
      }
    });
    var matches = [];
    var hit;
    for (var [node3, path3] of nodeEntries) {
      if (ignoreNonSelectable && Element$2.isElement(node3) && !Editor.isSelectable(editor, node3)) {
        continue;
      }
      var isLower = hit && Path.compare(path3, hit[1]) === 0;
      if (mode === "highest" && isLower) {
        continue;
      }
      if (!match(node3, path3)) {
        if (universal && !isLower && Text$1.isText(node3)) {
          return;
        } else {
          continue;
        }
      }
      if (mode === "lowest" && isLower) {
        hit = [node3, path3];
        continue;
      }
      var emit = mode === "lowest" ? hit : [node3, path3];
      if (emit) {
        if (universal) {
          matches.push(emit);
        } else {
          yield emit;
        }
      }
      hit = [node3, path3];
    }
    if (mode === "lowest" && hit) {
      if (universal) {
        matches.push(hit);
      } else {
        yield hit;
      }
    }
    if (universal) {
      yield* matches;
    }
  }();
}
var normalize = function normalize2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    force = false,
    operation
  } = options;
  var getDirtyPaths2 = (editor2) => {
    return DIRTY_PATHS.get(editor2) || [];
  };
  var getDirtyPathKeys = (editor2) => {
    return DIRTY_PATH_KEYS.get(editor2) || /* @__PURE__ */ new Set();
  };
  var popDirtyPath = (editor2) => {
    var path3 = getDirtyPaths2(editor2).pop();
    var key = path3.join(",");
    getDirtyPathKeys(editor2).delete(key);
    return path3;
  };
  if (!Editor.isNormalizing(editor)) {
    return;
  }
  if (force) {
    var allPaths = Array.from(Node.nodes(editor), (_ref) => {
      var [, p2] = _ref;
      return p2;
    });
    var allPathKeys = new Set(allPaths.map((p2) => p2.join(",")));
    DIRTY_PATHS.set(editor, allPaths);
    DIRTY_PATH_KEYS.set(editor, allPathKeys);
  }
  if (getDirtyPaths2(editor).length === 0) {
    return;
  }
  Editor.withoutNormalizing(editor, () => {
    for (var dirtyPath of getDirtyPaths2(editor)) {
      if (Node.has(editor, dirtyPath)) {
        var entry = Editor.node(editor, dirtyPath);
        var [node3, _] = entry;
        if (Element$2.isElement(node3) && node3.children.length === 0) {
          editor.normalizeNode(entry, {
            operation
          });
        }
      }
    }
    var dirtyPaths = getDirtyPaths2(editor);
    var initialDirtyPathsLength = dirtyPaths.length;
    var iteration = 0;
    while (dirtyPaths.length !== 0) {
      if (!editor.shouldNormalize({
        dirtyPaths,
        iteration,
        initialDirtyPathsLength,
        operation
      })) {
        return;
      }
      var _dirtyPath = popDirtyPath(editor);
      if (Node.has(editor, _dirtyPath)) {
        var _entry = Editor.node(editor, _dirtyPath);
        editor.normalizeNode(_entry, {
          operation
        });
      }
      iteration++;
      dirtyPaths = getDirtyPaths2(editor);
    }
  });
};
var parent = function parent2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var path3 = Editor.path(editor, at, options);
  var parentPath = Path.parent(path3);
  var entry = Editor.node(editor, parentPath);
  return entry;
};
var pathRef = function pathRef2(editor, path3) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    affinity = "forward"
  } = options;
  var ref = {
    current: path3,
    affinity,
    unref() {
      var {
        current: current2
      } = ref;
      var pathRefs2 = Editor.pathRefs(editor);
      pathRefs2.delete(ref);
      ref.current = null;
      return current2;
    }
  };
  var refs = Editor.pathRefs(editor);
  refs.add(ref);
  return ref;
};
var pathRefs = (editor) => {
  var refs = PATH_REFS.get(editor);
  if (!refs) {
    refs = /* @__PURE__ */ new Set();
    PATH_REFS.set(editor, refs);
  }
  return refs;
};
var path = function path2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    depth,
    edge
  } = options;
  if (Path.isPath(at)) {
    if (edge === "start") {
      var [, firstPath] = Node.first(editor, at);
      at = firstPath;
    } else if (edge === "end") {
      var [, lastPath] = Node.last(editor, at);
      at = lastPath;
    }
  }
  if (Range.isRange(at)) {
    if (edge === "start") {
      at = Range.start(at);
    } else if (edge === "end") {
      at = Range.end(at);
    } else {
      at = Path.common(at.anchor.path, at.focus.path);
    }
  }
  if (Point.isPoint(at)) {
    at = at.path;
  }
  if (depth != null) {
    at = at.slice(0, depth);
  }
  return at;
};
var pointRef = function pointRef2(editor, point3) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    affinity = "forward"
  } = options;
  var ref = {
    current: point3,
    affinity,
    unref() {
      var {
        current: current2
      } = ref;
      var pointRefs2 = Editor.pointRefs(editor);
      pointRefs2.delete(ref);
      ref.current = null;
      return current2;
    }
  };
  var refs = Editor.pointRefs(editor);
  refs.add(ref);
  return ref;
};
var pointRefs = (editor) => {
  var refs = POINT_REFS.get(editor);
  if (!refs) {
    refs = /* @__PURE__ */ new Set();
    POINT_REFS.set(editor, refs);
  }
  return refs;
};
var point = function point2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    edge = "start"
  } = options;
  if (Path.isPath(at)) {
    var path3;
    if (edge === "end") {
      var [, lastPath] = Node.last(editor, at);
      path3 = lastPath;
    } else {
      var [, firstPath] = Node.first(editor, at);
      path3 = firstPath;
    }
    var node3 = Node.get(editor, path3);
    if (!Text$1.isText(node3)) {
      throw new Error("Cannot get the ".concat(edge, " point in the node at path [").concat(at, "] because it has no ").concat(edge, " text node."));
    }
    return {
      path: path3,
      offset: edge === "end" ? node3.text.length : 0
    };
  }
  if (Range.isRange(at)) {
    var [start2, end2] = Range.edges(at);
    return edge === "start" ? start2 : end2;
  }
  return at;
};
function positions(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return function* () {
    var {
      at = editor.selection,
      unit = "offset",
      reverse = false,
      voids = false,
      ignoreNonSelectable = false
    } = options;
    if (!at) {
      return;
    }
    var range2 = Editor.range(editor, at);
    var [start2, end2] = Range.edges(range2);
    var first2 = reverse ? end2 : start2;
    var isNewBlock = false;
    var blockText = "";
    var distance = 0;
    var leafTextRemaining = 0;
    var leafTextOffset = 0;
    for (var [node3, path3] of Editor.nodes(editor, {
      at,
      reverse,
      voids,
      ignoreNonSelectable
    })) {
      if (Element$2.isElement(node3)) {
        if (!voids && (editor.isVoid(node3) || editor.isElementReadOnly(node3))) {
          yield Editor.start(editor, path3);
          continue;
        }
        if (editor.isInline(node3)) continue;
        if (Editor.hasInlines(editor, node3)) {
          var e2 = Path.isAncestor(path3, end2.path) ? end2 : Editor.end(editor, path3);
          var s = Path.isAncestor(path3, start2.path) ? start2 : Editor.start(editor, path3);
          blockText = Editor.string(editor, {
            anchor: s,
            focus: e2
          }, {
            voids
          });
          isNewBlock = true;
        }
      }
      if (Text$1.isText(node3)) {
        var isFirst = Path.equals(path3, first2.path);
        if (isFirst) {
          leafTextRemaining = reverse ? first2.offset : node3.text.length - first2.offset;
          leafTextOffset = first2.offset;
        } else {
          leafTextRemaining = node3.text.length;
          leafTextOffset = reverse ? leafTextRemaining : 0;
        }
        if (isFirst || isNewBlock || unit === "offset") {
          yield {
            path: path3,
            offset: leafTextOffset
          };
          isNewBlock = false;
        }
        while (true) {
          if (distance === 0) {
            if (blockText === "") break;
            distance = calcDistance(blockText, unit, reverse);
            blockText = splitByCharacterDistance(blockText, distance, reverse)[1];
          }
          leafTextOffset = reverse ? leafTextOffset - distance : leafTextOffset + distance;
          leafTextRemaining = leafTextRemaining - distance;
          if (leafTextRemaining < 0) {
            distance = -leafTextRemaining;
            break;
          }
          distance = 0;
          yield {
            path: path3,
            offset: leafTextOffset
          };
        }
      }
    }
    function calcDistance(text, unit2, reverse2) {
      if (unit2 === "character") {
        return getCharacterDistance(text, reverse2);
      } else if (unit2 === "word") {
        return getWordDistance(text, reverse2);
      } else if (unit2 === "line" || unit2 === "block") {
        return text.length;
      }
      return 1;
    }
  }();
}
var previous = function previous2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    mode = "lowest",
    voids = false
  } = options;
  var {
    match,
    at = editor.selection
  } = options;
  if (!at) {
    return;
  }
  var pointBeforeLocation = Editor.before(editor, at, {
    voids
  });
  if (!pointBeforeLocation) {
    return;
  }
  var [, to] = Editor.first(editor, []);
  var span = [pointBeforeLocation.path, to];
  if (Path.isPath(at) && at.length === 0) {
    throw new Error("Cannot get the previous node from the root node!");
  }
  if (match == null) {
    if (Path.isPath(at)) {
      var [parent3] = Editor.parent(editor, at);
      match = (n2) => parent3.children.includes(n2);
    } else {
      match = () => true;
    }
  }
  var [previous3] = Editor.nodes(editor, {
    reverse: true,
    at: span,
    match,
    mode,
    voids
  });
  return previous3;
};
var rangeRef = function rangeRef2(editor, range2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    affinity = "forward"
  } = options;
  var ref = {
    current: range2,
    affinity,
    unref() {
      var {
        current: current2
      } = ref;
      var rangeRefs2 = Editor.rangeRefs(editor);
      rangeRefs2.delete(ref);
      ref.current = null;
      return current2;
    }
  };
  var refs = Editor.rangeRefs(editor);
  refs.add(ref);
  return ref;
};
var rangeRefs = (editor) => {
  var refs = RANGE_REFS.get(editor);
  if (!refs) {
    refs = /* @__PURE__ */ new Set();
    RANGE_REFS.set(editor, refs);
  }
  return refs;
};
var range = (editor, at, to) => {
  if (Range.isRange(at) && !to) {
    return at;
  }
  var start2 = Editor.start(editor, at);
  var end2 = Editor.end(editor, to || at);
  return {
    anchor: start2,
    focus: end2
  };
};
function ownKeys$2$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$2$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$2$1(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$2$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var removeMark = (editor, key) => {
  var {
    selection
  } = editor;
  if (selection) {
    var match = (node3, path3) => {
      if (!Text$1.isText(node3)) {
        return false;
      }
      var [parentNode2, parentPath] = Editor.parent(editor, path3);
      return !editor.isVoid(parentNode2) || editor.markableVoid(parentNode2);
    };
    var expandedSelection = Range.isExpanded(selection);
    var markAcceptingVoidSelected = false;
    if (!expandedSelection) {
      var [selectedNode, selectedPath] = Editor.node(editor, selection);
      if (selectedNode && match(selectedNode, selectedPath)) {
        var [parentNode] = Editor.parent(editor, selectedPath);
        markAcceptingVoidSelected = parentNode && editor.markableVoid(parentNode);
      }
    }
    if (expandedSelection || markAcceptingVoidSelected) {
      Transforms.unsetNodes(editor, key, {
        match,
        split: true,
        voids: true
      });
    } else {
      var marks3 = _objectSpread$2$1({}, Editor.marks(editor) || {});
      delete marks3[key];
      editor.marks = marks3;
      if (!FLUSHING.get(editor)) {
        editor.onChange();
      }
    }
  }
};
var setNormalizing = (editor, isNormalizing2) => {
  NORMALIZING.set(editor, isNormalizing2);
};
var start = (editor, at) => {
  return Editor.point(editor, at, {
    edge: "start"
  });
};
var string = function string2(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    voids = false
  } = options;
  var range2 = Editor.range(editor, at);
  var [start2, end2] = Range.edges(range2);
  var text = "";
  for (var [node3, path3] of Editor.nodes(editor, {
    at: range2,
    match: Text$1.isText,
    voids
  })) {
    var t2 = node3.text;
    if (Path.equals(path3, end2.path)) {
      t2 = t2.slice(0, end2.offset);
    }
    if (Path.equals(path3, start2.path)) {
      t2 = t2.slice(start2.offset);
    }
    text += t2;
  }
  return text;
};
var unhangRange = function unhangRange2(editor, range2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    voids = false
  } = options;
  var [start2, end2] = Range.edges(range2);
  if (start2.offset !== 0 || end2.offset !== 0 || Range.isCollapsed(range2) || Path.hasPrevious(end2.path)) {
    return range2;
  }
  var endBlock = Editor.above(editor, {
    at: end2,
    match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
    voids
  });
  var blockPath = endBlock ? endBlock[1] : [];
  var first2 = Editor.start(editor, start2);
  var before3 = {
    anchor: first2,
    focus: end2
  };
  var skip = true;
  for (var [node3, path3] of Editor.nodes(editor, {
    at: before3,
    match: Text$1.isText,
    reverse: true,
    voids
  })) {
    if (skip) {
      skip = false;
      continue;
    }
    if (node3.text !== "" || Path.isBefore(path3, blockPath)) {
      end2 = {
        path: path3,
        offset: node3.text.length
      };
      break;
    }
  }
  return {
    anchor: start2,
    focus: end2
  };
};
var withoutNormalizing = (editor, fn) => {
  var value = Editor.isNormalizing(editor);
  Editor.setNormalizing(editor, false);
  try {
    fn();
  } finally {
    Editor.setNormalizing(editor, value);
  }
  Editor.normalize(editor);
};
var deleteText = function deleteText2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var _Editor$void, _Editor$void2;
    var {
      reverse = false,
      unit = "character",
      distance = 1,
      voids = false
    } = options;
    var {
      at = editor.selection,
      hanging = false
    } = options;
    if (!at) {
      return;
    }
    var isCollapsed = false;
    if (Range.isRange(at) && Range.isCollapsed(at)) {
      isCollapsed = true;
      at = at.anchor;
    }
    if (Point.isPoint(at)) {
      var furthestVoid = Editor.void(editor, {
        at,
        mode: "highest"
      });
      if (!voids && furthestVoid) {
        var [, voidPath] = furthestVoid;
        at = voidPath;
      } else {
        var opts = {
          unit,
          distance
        };
        var target = reverse ? Editor.before(editor, at, opts) || Editor.start(editor, []) : Editor.after(editor, at, opts) || Editor.end(editor, []);
        at = {
          anchor: at,
          focus: target
        };
        hanging = true;
      }
    }
    if (Path.isPath(at)) {
      Transforms.removeNodes(editor, {
        at,
        voids
      });
      return;
    }
    if (Range.isCollapsed(at)) {
      return;
    }
    if (!hanging) {
      var [, _end] = Range.edges(at);
      var endOfDoc = Editor.end(editor, []);
      if (!Point.equals(_end, endOfDoc)) {
        at = Editor.unhangRange(editor, at, {
          voids
        });
      }
    }
    var [start2, end2] = Range.edges(at);
    var startBlock = Editor.above(editor, {
      match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
      at: start2,
      voids
    });
    var endBlock = Editor.above(editor, {
      match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
      at: end2,
      voids
    });
    var isAcrossBlocks = startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1]);
    var isSingleText = Path.equals(start2.path, end2.path);
    var startNonEditable = voids ? null : (_Editor$void = Editor.void(editor, {
      at: start2,
      mode: "highest"
    })) !== null && _Editor$void !== void 0 ? _Editor$void : Editor.elementReadOnly(editor, {
      at: start2,
      mode: "highest"
    });
    var endNonEditable = voids ? null : (_Editor$void2 = Editor.void(editor, {
      at: end2,
      mode: "highest"
    })) !== null && _Editor$void2 !== void 0 ? _Editor$void2 : Editor.elementReadOnly(editor, {
      at: end2,
      mode: "highest"
    });
    if (startNonEditable) {
      var before3 = Editor.before(editor, start2);
      if (before3 && startBlock && Path.isAncestor(startBlock[1], before3.path)) {
        start2 = before3;
      }
    }
    if (endNonEditable) {
      var after3 = Editor.after(editor, end2);
      if (after3 && endBlock && Path.isAncestor(endBlock[1], after3.path)) {
        end2 = after3;
      }
    }
    var matches = [];
    var lastPath;
    for (var entry of Editor.nodes(editor, {
      at,
      voids
    })) {
      var [node3, path3] = entry;
      if (lastPath && Path.compare(path3, lastPath) === 0) {
        continue;
      }
      if (!voids && Element$2.isElement(node3) && (Editor.isVoid(editor, node3) || Editor.isElementReadOnly(editor, node3)) || !Path.isCommon(path3, start2.path) && !Path.isCommon(path3, end2.path)) {
        matches.push(entry);
        lastPath = path3;
      }
    }
    var pathRefs2 = Array.from(matches, (_ref) => {
      var [, p2] = _ref;
      return Editor.pathRef(editor, p2);
    });
    var startRef = Editor.pointRef(editor, start2);
    var endRef = Editor.pointRef(editor, end2);
    var removedText = "";
    if (!isSingleText && !startNonEditable) {
      var _point = startRef.current;
      var [_node] = Editor.leaf(editor, _point);
      var {
        path: _path
      } = _point;
      var {
        offset
      } = start2;
      var text = _node.text.slice(offset);
      if (text.length > 0) {
        editor.apply({
          type: "remove_text",
          path: _path,
          offset,
          text
        });
        removedText = text;
      }
    }
    pathRefs2.reverse().map((r2) => r2.unref()).filter((r2) => r2 !== null).forEach((p2) => Transforms.removeNodes(editor, {
      at: p2,
      voids
    }));
    if (!endNonEditable) {
      var _point2 = endRef.current;
      var [_node2] = Editor.leaf(editor, _point2);
      var {
        path: _path2
      } = _point2;
      var _offset = isSingleText ? start2.offset : 0;
      var _text = _node2.text.slice(_offset, end2.offset);
      if (_text.length > 0) {
        editor.apply({
          type: "remove_text",
          path: _path2,
          offset: _offset,
          text: _text
        });
        removedText = _text;
      }
    }
    if (!isSingleText && isAcrossBlocks && endRef.current && startRef.current) {
      Transforms.mergeNodes(editor, {
        at: endRef.current,
        hanging: true,
        voids
      });
    }
    if (isCollapsed && reverse && unit === "character" && removedText.length > 1 && removedText.match(/[\u0E00-\u0E7F]+/)) {
      Transforms.insertText(editor, removedText.slice(0, removedText.length - distance));
    }
    var startUnref = startRef.unref();
    var endUnref = endRef.unref();
    var point3 = reverse ? startUnref || endUnref : endUnref || startUnref;
    if (options.at == null && point3) {
      Transforms.select(editor, point3);
    }
  });
};
var insertFragment = function insertFragment2(editor, fragment2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      hanging = false,
      voids = false
    } = options;
    var {
      at = getDefaultInsertLocation(editor)
    } = options;
    if (!fragment2.length) {
      return;
    }
    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, {
          voids
        });
      }
      if (Range.isCollapsed(at)) {
        at = at.anchor;
      } else {
        var [, end2] = Range.edges(at);
        if (!voids && Editor.void(editor, {
          at: end2
        })) {
          return;
        }
        var pointRef3 = Editor.pointRef(editor, end2);
        Transforms.delete(editor, {
          at
        });
        at = pointRef3.unref();
      }
    } else if (Path.isPath(at)) {
      at = Editor.start(editor, at);
    }
    if (!voids && Editor.void(editor, {
      at
    })) {
      return;
    }
    var inlineElementMatch = Editor.above(editor, {
      at,
      match: (n2) => Element$2.isElement(n2) && Editor.isInline(editor, n2),
      mode: "highest",
      voids
    });
    if (inlineElementMatch) {
      var [, _inlinePath] = inlineElementMatch;
      if (Editor.isEnd(editor, at, _inlinePath)) {
        var after3 = Editor.after(editor, _inlinePath);
        at = after3;
      } else if (Editor.isStart(editor, at, _inlinePath)) {
        var before3 = Editor.before(editor, _inlinePath);
        at = before3;
      }
    }
    var blockMatch = Editor.above(editor, {
      match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
      at,
      voids
    });
    var [, blockPath] = blockMatch;
    var isBlockStart = Editor.isStart(editor, at, blockPath);
    var isBlockEnd = Editor.isEnd(editor, at, blockPath);
    var isBlockEmpty = isBlockStart && isBlockEnd;
    var mergeStart = !isBlockStart || isBlockStart && isBlockEnd;
    var mergeEnd = !isBlockEnd;
    var [, firstPath] = Node.first({
      children: fragment2
    }, []);
    var [, lastPath] = Node.last({
      children: fragment2
    }, []);
    var matches = [];
    var matcher = (_ref) => {
      var [n2, p2] = _ref;
      var isRoot = p2.length === 0;
      if (isRoot) {
        return false;
      }
      if (isBlockEmpty) {
        return true;
      }
      if (mergeStart && Path.isAncestor(p2, firstPath) && Element$2.isElement(n2) && !editor.isVoid(n2) && !editor.isInline(n2)) {
        return false;
      }
      if (mergeEnd && Path.isAncestor(p2, lastPath) && Element$2.isElement(n2) && !editor.isVoid(n2) && !editor.isInline(n2)) {
        return false;
      }
      return true;
    };
    for (var entry of Node.nodes({
      children: fragment2
    }, {
      pass: matcher
    })) {
      if (matcher(entry)) {
        matches.push(entry);
      }
    }
    var starts = [];
    var middles = [];
    var ends = [];
    var starting = true;
    var hasBlocks2 = false;
    for (var [node3] of matches) {
      if (Element$2.isElement(node3) && !editor.isInline(node3)) {
        starting = false;
        hasBlocks2 = true;
        middles.push(node3);
      } else if (starting) {
        starts.push(node3);
      } else {
        ends.push(node3);
      }
    }
    var [inlineMatch] = Editor.nodes(editor, {
      at,
      match: (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2),
      mode: "highest",
      voids
    });
    var [, inlinePath] = inlineMatch;
    var isInlineStart = Editor.isStart(editor, at, inlinePath);
    var isInlineEnd = Editor.isEnd(editor, at, inlinePath);
    var middleRef = Editor.pathRef(editor, isBlockEnd && !ends.length ? Path.next(blockPath) : blockPath);
    var endRef = Editor.pathRef(editor, isInlineEnd ? Path.next(inlinePath) : inlinePath);
    Transforms.splitNodes(editor, {
      at,
      match: (n2) => hasBlocks2 ? Element$2.isElement(n2) && Editor.isBlock(editor, n2) : Text$1.isText(n2) || Editor.isInline(editor, n2),
      mode: hasBlocks2 ? "lowest" : "highest",
      always: hasBlocks2 && (!isBlockStart || starts.length > 0) && (!isBlockEnd || ends.length > 0),
      voids
    });
    var startRef = Editor.pathRef(editor, !isInlineStart || isInlineStart && isInlineEnd ? Path.next(inlinePath) : inlinePath);
    Transforms.insertNodes(editor, starts, {
      at: startRef.current,
      match: (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2),
      mode: "highest",
      voids
    });
    if (isBlockEmpty && !starts.length && middles.length && !ends.length) {
      Transforms.delete(editor, {
        at: blockPath,
        voids
      });
    }
    Transforms.insertNodes(editor, middles, {
      at: middleRef.current,
      match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
      mode: "lowest",
      voids
    });
    Transforms.insertNodes(editor, ends, {
      at: endRef.current,
      match: (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2),
      mode: "highest",
      voids
    });
    if (!options.at) {
      var path3;
      if (ends.length > 0 && endRef.current) {
        path3 = Path.previous(endRef.current);
      } else if (middles.length > 0 && middleRef.current) {
        path3 = Path.previous(middleRef.current);
      } else if (startRef.current) {
        path3 = Path.previous(startRef.current);
      }
      if (path3) {
        var _end = Editor.end(editor, path3);
        Transforms.select(editor, _end);
      }
    }
    startRef.unref();
    middleRef.unref();
    endRef.unref();
  });
};
var collapse = function collapse2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    edge = "anchor"
  } = options;
  var {
    selection
  } = editor;
  if (!selection) {
    return;
  } else if (edge === "anchor") {
    Transforms.select(editor, selection.anchor);
  } else if (edge === "focus") {
    Transforms.select(editor, selection.focus);
  } else if (edge === "start") {
    var [start2] = Range.edges(selection);
    Transforms.select(editor, start2);
  } else if (edge === "end") {
    var [, end2] = Range.edges(selection);
    Transforms.select(editor, end2);
  }
};
var deselect = (editor) => {
  var {
    selection
  } = editor;
  if (selection) {
    editor.apply({
      type: "set_selection",
      properties: selection,
      newProperties: null
    });
  }
};
var move = function move2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var {
    selection
  } = editor;
  var {
    distance = 1,
    unit = "character",
    reverse = false
  } = options;
  var {
    edge = null
  } = options;
  if (!selection) {
    return;
  }
  if (edge === "start") {
    edge = Range.isBackward(selection) ? "focus" : "anchor";
  }
  if (edge === "end") {
    edge = Range.isBackward(selection) ? "anchor" : "focus";
  }
  var {
    anchor,
    focus: focus2
  } = selection;
  var opts = {
    distance,
    unit,
    ignoreNonSelectable: true
  };
  var props = {};
  if (edge == null || edge === "anchor") {
    var point3 = reverse ? Editor.before(editor, anchor, opts) : Editor.after(editor, anchor, opts);
    if (point3) {
      props.anchor = point3;
    }
  }
  if (edge == null || edge === "focus") {
    var _point = reverse ? Editor.before(editor, focus2, opts) : Editor.after(editor, focus2, opts);
    if (_point) {
      props.focus = _point;
    }
  }
  Transforms.setSelection(editor, props);
};
var select = (editor, target) => {
  var {
    selection
  } = editor;
  target = Editor.range(editor, target);
  if (selection) {
    Transforms.setSelection(editor, target);
    return;
  }
  if (!Range.isRange(target)) {
    throw new Error("When setting the selection and the current selection is `null` you must provide at least an `anchor` and `focus`, but you passed: ".concat(Scrubber.stringify(target)));
  }
  editor.apply({
    type: "set_selection",
    properties: selection,
    newProperties: target
  });
};
function ownKeys$1$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$1$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$1$1(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var setPoint = function setPoint2(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var {
    selection
  } = editor;
  var {
    edge = "both"
  } = options;
  if (!selection) {
    return;
  }
  if (edge === "start") {
    edge = Range.isBackward(selection) ? "focus" : "anchor";
  }
  if (edge === "end") {
    edge = Range.isBackward(selection) ? "anchor" : "focus";
  }
  var {
    anchor,
    focus: focus2
  } = selection;
  var point3 = edge === "anchor" ? anchor : focus2;
  Transforms.setSelection(editor, {
    [edge === "anchor" ? "anchor" : "focus"]: _objectSpread$1$1(_objectSpread$1$1({}, point3), props)
  });
};
var setSelection = (editor, props) => {
  var {
    selection
  } = editor;
  var oldProps = {};
  var newProps = {};
  if (!selection) {
    return;
  }
  for (var k2 in props) {
    if (k2 === "anchor" && props.anchor != null && !Point.equals(props.anchor, selection.anchor) || k2 === "focus" && props.focus != null && !Point.equals(props.focus, selection.focus) || k2 !== "anchor" && k2 !== "focus" && props[k2] !== selection[k2]) {
      oldProps[k2] = selection[k2];
      newProps[k2] = props[k2];
    }
  }
  if (Object.keys(oldProps).length > 0) {
    editor.apply({
      type: "set_selection",
      properties: oldProps,
      newProperties: newProps
    });
  }
};
var insertNodes = function insertNodes2(editor, nodes2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      hanging = false,
      voids = false,
      mode = "lowest"
    } = options;
    var {
      at,
      match,
      select: select2
    } = options;
    if (Node.isNode(nodes2)) {
      nodes2 = [nodes2];
    }
    if (nodes2.length === 0) {
      return;
    }
    var [node3] = nodes2;
    if (!at) {
      at = getDefaultInsertLocation(editor);
      select2 = true;
    }
    if (select2 == null) {
      select2 = false;
    }
    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, {
          voids
        });
      }
      if (Range.isCollapsed(at)) {
        at = at.anchor;
      } else {
        var [, end2] = Range.edges(at);
        var pointRef3 = Editor.pointRef(editor, end2);
        Transforms.delete(editor, {
          at
        });
        at = pointRef3.unref();
      }
    }
    if (Point.isPoint(at)) {
      if (match == null) {
        if (Text$1.isText(node3)) {
          match = (n2) => Text$1.isText(n2);
        } else if (editor.isInline(node3)) {
          match = (n2) => Text$1.isText(n2) || Editor.isInline(editor, n2);
        } else {
          match = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
        }
      }
      var [entry] = Editor.nodes(editor, {
        at: at.path,
        match,
        mode,
        voids
      });
      if (entry) {
        var [, matchPath2] = entry;
        var pathRef3 = Editor.pathRef(editor, matchPath2);
        var isAtEnd = Editor.isEnd(editor, at, matchPath2);
        Transforms.splitNodes(editor, {
          at,
          match,
          mode,
          voids
        });
        var path3 = pathRef3.unref();
        at = isAtEnd ? Path.next(path3) : path3;
      } else {
        return;
      }
    }
    var parentPath = Path.parent(at);
    var index = at[at.length - 1];
    if (!voids && Editor.void(editor, {
      at: parentPath
    })) {
      return;
    }
    for (var _node of nodes2) {
      var _path = parentPath.concat(index);
      index++;
      editor.apply({
        type: "insert_node",
        path: _path,
        node: _node
      });
      at = Path.next(at);
    }
    at = Path.previous(at);
    if (select2) {
      var point3 = Editor.end(editor, at);
      if (point3) {
        Transforms.select(editor, point3);
      }
    }
  });
};
var liftNodes = function liftNodes2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      at = editor.selection,
      mode = "lowest",
      voids = false
    } = options;
    var {
      match
    } = options;
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
    }
    if (!at) {
      return;
    }
    var matches = Editor.nodes(editor, {
      at,
      match,
      mode,
      voids
    });
    var pathRefs2 = Array.from(matches, (_ref) => {
      var [, p2] = _ref;
      return Editor.pathRef(editor, p2);
    });
    for (var pathRef3 of pathRefs2) {
      var path3 = pathRef3.unref();
      if (path3.length < 2) {
        throw new Error("Cannot lift node at a path [".concat(path3, "] because it has a depth of less than `2`."));
      }
      var parentNodeEntry = Editor.node(editor, Path.parent(path3));
      var [parent3, parentPath] = parentNodeEntry;
      var index = path3[path3.length - 1];
      var {
        length
      } = parent3.children;
      if (length === 1) {
        var toPath = Path.next(parentPath);
        Transforms.moveNodes(editor, {
          at: path3,
          to: toPath,
          voids
        });
        Transforms.removeNodes(editor, {
          at: parentPath,
          voids
        });
      } else if (index === 0) {
        Transforms.moveNodes(editor, {
          at: path3,
          to: parentPath,
          voids
        });
      } else if (index === length - 1) {
        var _toPath = Path.next(parentPath);
        Transforms.moveNodes(editor, {
          at: path3,
          to: _toPath,
          voids
        });
      } else {
        var splitPath = Path.next(path3);
        var _toPath2 = Path.next(parentPath);
        Transforms.splitNodes(editor, {
          at: splitPath,
          voids
        });
        Transforms.moveNodes(editor, {
          at: path3,
          to: _toPath2,
          voids
        });
      }
    }
  });
};
var _excluded$5 = ["text"], _excluded2$4 = ["children"];
var hasSingleChildNest = (editor, node3) => {
  if (Element$2.isElement(node3)) {
    var element = node3;
    if (Editor.isVoid(editor, node3)) {
      return true;
    } else if (element.children.length === 1) {
      return hasSingleChildNest(editor, element.children[0]);
    } else {
      return false;
    }
  } else if (Editor.isEditor(node3)) {
    return false;
  } else {
    return true;
  }
};
var mergeNodes = function mergeNodes2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      match,
      at = editor.selection
    } = options;
    var {
      hanging = false,
      voids = false,
      mode = "lowest"
    } = options;
    if (!at) {
      return;
    }
    if (match == null) {
      if (Path.isPath(at)) {
        var [parent3] = Editor.parent(editor, at);
        match = (n2) => parent3.children.includes(n2);
      } else {
        match = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
      }
    }
    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, {
        voids
      });
    }
    if (Range.isRange(at)) {
      if (Range.isCollapsed(at)) {
        at = at.anchor;
      } else {
        var [, end2] = Range.edges(at);
        var pointRef3 = Editor.pointRef(editor, end2);
        Transforms.delete(editor, {
          at
        });
        at = pointRef3.unref();
        if (options.at == null) {
          Transforms.select(editor, at);
        }
      }
    }
    var [current2] = Editor.nodes(editor, {
      at,
      match,
      voids,
      mode
    });
    var prev = Editor.previous(editor, {
      at,
      match,
      voids,
      mode
    });
    if (!current2 || !prev) {
      return;
    }
    var [node3, path3] = current2;
    var [prevNode, prevPath] = prev;
    if (path3.length === 0 || prevPath.length === 0) {
      return;
    }
    var newPath = Path.next(prevPath);
    var commonPath = Path.common(path3, prevPath);
    var isPreviousSibling = Path.isSibling(path3, prevPath);
    var levels2 = Array.from(Editor.levels(editor, {
      at: path3
    }), (_ref) => {
      var [n2] = _ref;
      return n2;
    }).slice(commonPath.length).slice(0, -1);
    var emptyAncestor = Editor.above(editor, {
      at: path3,
      mode: "highest",
      match: (n2) => levels2.includes(n2) && hasSingleChildNest(editor, n2)
    });
    var emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1]);
    var properties;
    var position;
    if (Text$1.isText(node3) && Text$1.isText(prevNode)) {
      var rest = _objectWithoutProperties$1(node3, _excluded$5);
      position = prevNode.text.length;
      properties = rest;
    } else if (Element$2.isElement(node3) && Element$2.isElement(prevNode)) {
      var rest = _objectWithoutProperties$1(node3, _excluded2$4);
      position = prevNode.children.length;
      properties = rest;
    } else {
      throw new Error("Cannot merge the node at path [".concat(path3, "] with the previous sibling because it is not the same kind: ").concat(Scrubber.stringify(node3), " ").concat(Scrubber.stringify(prevNode)));
    }
    if (!isPreviousSibling) {
      Transforms.moveNodes(editor, {
        at: path3,
        to: newPath,
        voids
      });
    }
    if (emptyRef) {
      Transforms.removeNodes(editor, {
        at: emptyRef.current,
        voids
      });
    }
    if (Element$2.isElement(prevNode) && Editor.isEmpty(editor, prevNode) || Text$1.isText(prevNode) && prevNode.text === "" && prevPath[prevPath.length - 1] !== 0) {
      Transforms.removeNodes(editor, {
        at: prevPath,
        voids
      });
    } else {
      editor.apply({
        type: "merge_node",
        path: newPath,
        position,
        properties
      });
    }
    if (emptyRef) {
      emptyRef.unref();
    }
  });
};
var moveNodes = (editor, options) => {
  Editor.withoutNormalizing(editor, () => {
    var {
      to,
      at = editor.selection,
      mode = "lowest",
      voids = false
    } = options;
    var {
      match
    } = options;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
    }
    var toRef = Editor.pathRef(editor, to);
    var targets = Editor.nodes(editor, {
      at,
      match,
      mode,
      voids
    });
    var pathRefs2 = Array.from(targets, (_ref) => {
      var [, p2] = _ref;
      return Editor.pathRef(editor, p2);
    });
    for (var pathRef3 of pathRefs2) {
      var path3 = pathRef3.unref();
      var newPath = toRef.current;
      if (path3.length !== 0) {
        editor.apply({
          type: "move_node",
          path: path3,
          newPath
        });
      }
      if (toRef.current && Path.isSibling(newPath, path3) && Path.isAfter(newPath, path3)) {
        toRef.current = Path.next(toRef.current);
      }
    }
    toRef.unref();
  });
};
var removeNodes = function removeNodes2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      hanging = false,
      voids = false,
      mode = "lowest"
    } = options;
    var {
      at = editor.selection,
      match
    } = options;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
    }
    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, {
        voids
      });
    }
    var depths = Editor.nodes(editor, {
      at,
      match,
      mode,
      voids
    });
    var pathRefs2 = Array.from(depths, (_ref) => {
      var [, p2] = _ref;
      return Editor.pathRef(editor, p2);
    });
    for (var pathRef3 of pathRefs2) {
      var path3 = pathRef3.unref();
      if (path3) {
        var [node3] = Editor.node(editor, path3);
        editor.apply({
          type: "remove_node",
          path: path3,
          node: node3
        });
      }
    }
  });
};
var setNodes = function setNodes2(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      match,
      at = editor.selection,
      compare: compare2,
      merge: merge2
    } = options;
    var {
      hanging = false,
      mode = "lowest",
      split = false,
      voids = false
    } = options;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
    }
    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, {
        voids
      });
    }
    if (split && Range.isRange(at)) {
      if (Range.isCollapsed(at) && Editor.leaf(editor, at.anchor)[0].text.length > 0) {
        return;
      }
      var rangeRef3 = Editor.rangeRef(editor, at, {
        affinity: "inward"
      });
      var [start2, end2] = Range.edges(at);
      var splitMode = mode === "lowest" ? "lowest" : "highest";
      var endAtEndOfNode = Editor.isEnd(editor, end2, end2.path);
      Transforms.splitNodes(editor, {
        at: end2,
        match,
        mode: splitMode,
        voids,
        always: !endAtEndOfNode
      });
      var startAtStartOfNode = Editor.isStart(editor, start2, start2.path);
      Transforms.splitNodes(editor, {
        at: start2,
        match,
        mode: splitMode,
        voids,
        always: !startAtStartOfNode
      });
      at = rangeRef3.unref();
      if (options.at == null) {
        Transforms.select(editor, at);
      }
    }
    if (!compare2) {
      compare2 = (prop, nodeProp) => prop !== nodeProp;
    }
    for (var [node3, path3] of Editor.nodes(editor, {
      at,
      match,
      mode,
      voids
    })) {
      var properties = {};
      var newProperties = {};
      if (path3.length === 0) {
        continue;
      }
      var hasChanges = false;
      for (var k2 in props) {
        if (k2 === "children" || k2 === "text") {
          continue;
        }
        if (compare2(props[k2], node3[k2])) {
          hasChanges = true;
          if (node3.hasOwnProperty(k2)) properties[k2] = node3[k2];
          if (merge2) {
            if (props[k2] != null) newProperties[k2] = merge2(node3[k2], props[k2]);
          } else {
            if (props[k2] != null) newProperties[k2] = props[k2];
          }
        }
      }
      if (hasChanges) {
        editor.apply({
          type: "set_node",
          path: path3,
          properties,
          newProperties
        });
      }
    }
  });
};
var deleteRange = (editor, range2) => {
  if (Range.isCollapsed(range2)) {
    return range2.anchor;
  } else {
    var [, end2] = Range.edges(range2);
    var pointRef3 = Editor.pointRef(editor, end2);
    Transforms.delete(editor, {
      at: range2
    });
    return pointRef3.unref();
  }
};
var splitNodes = function splitNodes2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      mode = "lowest",
      voids = false
    } = options;
    var {
      match,
      at = editor.selection,
      height = 0,
      always = false
    } = options;
    if (match == null) {
      match = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
    }
    if (Range.isRange(at)) {
      at = deleteRange(editor, at);
    }
    if (Path.isPath(at)) {
      var path3 = at;
      var point3 = Editor.point(editor, path3);
      var [parent3] = Editor.parent(editor, path3);
      match = (n2) => n2 === parent3;
      height = point3.path.length - path3.length + 1;
      at = point3;
      always = true;
    }
    if (!at) {
      return;
    }
    var beforeRef = Editor.pointRef(editor, at, {
      affinity: "backward"
    });
    var afterRef;
    try {
      var [highest] = Editor.nodes(editor, {
        at,
        match,
        mode,
        voids
      });
      if (!highest) {
        return;
      }
      var voidMatch = Editor.void(editor, {
        at,
        mode: "highest"
      });
      var nudge = 0;
      if (!voids && voidMatch) {
        var [voidNode, voidPath] = voidMatch;
        if (Element$2.isElement(voidNode) && editor.isInline(voidNode)) {
          var after3 = Editor.after(editor, voidPath);
          if (!after3) {
            var text = {
              text: ""
            };
            var afterPath = Path.next(voidPath);
            Transforms.insertNodes(editor, text, {
              at: afterPath,
              voids
            });
            after3 = Editor.point(editor, afterPath);
          }
          at = after3;
          always = true;
        }
        var siblingHeight = at.path.length - voidPath.length;
        height = siblingHeight + 1;
        always = true;
      }
      afterRef = Editor.pointRef(editor, at);
      var depth = at.path.length - height;
      var [, highestPath] = highest;
      var lowestPath = at.path.slice(0, depth);
      var position = height === 0 ? at.offset : at.path[depth] + nudge;
      for (var [node3, _path] of Editor.levels(editor, {
        at: lowestPath,
        reverse: true,
        voids
      })) {
        var split = false;
        if (_path.length < highestPath.length || _path.length === 0 || !voids && Element$2.isElement(node3) && Editor.isVoid(editor, node3)) {
          break;
        }
        var _point = beforeRef.current;
        var isEnd2 = Editor.isEnd(editor, _point, _path);
        if (always || !beforeRef || !Editor.isEdge(editor, _point, _path)) {
          split = true;
          var properties = Node.extractProps(node3);
          editor.apply({
            type: "split_node",
            path: _path,
            position,
            properties
          });
        }
        position = _path[_path.length - 1] + (split || isEnd2 ? 1 : 0);
      }
      if (options.at == null) {
        var _point2 = afterRef.current || Editor.end(editor, []);
        Transforms.select(editor, _point2);
      }
    } finally {
      var _afterRef;
      beforeRef.unref();
      (_afterRef = afterRef) === null || _afterRef === void 0 || _afterRef.unref();
    }
  });
};
var unsetNodes = function unsetNodes2(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (!Array.isArray(props)) {
    props = [props];
  }
  var obj = {};
  for (var key of props) {
    obj[key] = null;
  }
  Transforms.setNodes(editor, obj, options);
};
var unwrapNodes = function unwrapNodes2(editor) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      mode = "lowest",
      split = false,
      voids = false
    } = options;
    var {
      at = editor.selection,
      match
    } = options;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
    }
    if (Path.isPath(at)) {
      at = Editor.range(editor, at);
    }
    var rangeRef3 = Range.isRange(at) ? Editor.rangeRef(editor, at) : null;
    var matches = Editor.nodes(editor, {
      at,
      match,
      mode,
      voids
    });
    var pathRefs2 = Array.from(
      matches,
      (_ref) => {
        var [, p2] = _ref;
        return Editor.pathRef(editor, p2);
      }
      // unwrapNode will call liftNode which does not support splitting the node when nested.
      // If we do not reverse the order and call it from top to the bottom, it will remove all blocks
      // that wrap target node. So we reverse the order.
    ).reverse();
    var _loop = function _loop2() {
      var path3 = pathRef3.unref();
      var [node3] = Editor.node(editor, path3);
      var range2 = Editor.range(editor, path3);
      if (split && rangeRef3) {
        range2 = Range.intersection(rangeRef3.current, range2);
      }
      Transforms.liftNodes(editor, {
        at: range2,
        match: (n2) => Element$2.isAncestor(node3) && node3.children.includes(n2),
        voids
      });
    };
    for (var pathRef3 of pathRefs2) {
      _loop();
    }
    if (rangeRef3) {
      rangeRef3.unref();
    }
  });
};
function ownKeys$f(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$f(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$f(Object(t2), true).forEach(function(r3) {
      _defineProperty$1(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$f(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var wrapNodes = function wrapNodes2(editor, element) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  Editor.withoutNormalizing(editor, () => {
    var {
      mode = "lowest",
      split = false,
      voids = false
    } = options;
    var {
      match,
      at = editor.selection
    } = options;
    if (!at) {
      return;
    }
    if (match == null) {
      if (Path.isPath(at)) {
        match = matchPath(editor, at);
      } else if (editor.isInline(element)) {
        match = (n2) => Element$2.isElement(n2) && Editor.isInline(editor, n2) || Text$1.isText(n2);
      } else {
        match = (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2);
      }
    }
    if (split && Range.isRange(at)) {
      var [start2, end2] = Range.edges(at);
      var rangeRef3 = Editor.rangeRef(editor, at, {
        affinity: "inward"
      });
      Transforms.splitNodes(editor, {
        at: end2,
        match,
        voids
      });
      Transforms.splitNodes(editor, {
        at: start2,
        match,
        voids
      });
      at = rangeRef3.unref();
      if (options.at == null) {
        Transforms.select(editor, at);
      }
    }
    var roots = Array.from(Editor.nodes(editor, {
      at,
      match: editor.isInline(element) ? (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2) : (n2) => Editor.isEditor(n2),
      mode: "lowest",
      voids
    }));
    var _loop = function _loop2() {
      var a = Range.isRange(at) ? Range.intersection(at, Editor.range(editor, rootPath)) : at;
      if (!a) {
        return 0;
      }
      var matches = Array.from(Editor.nodes(editor, {
        at: a,
        match,
        mode,
        voids
      }));
      if (matches.length > 0) {
        var [first2] = matches;
        var last2 = matches[matches.length - 1];
        var [, firstPath] = first2;
        var [, lastPath] = last2;
        if (firstPath.length === 0 && lastPath.length === 0) {
          return 0;
        }
        var commonPath = Path.equals(firstPath, lastPath) ? Path.parent(firstPath) : Path.common(firstPath, lastPath);
        var range2 = Editor.range(editor, firstPath, lastPath);
        var commonNodeEntry = Editor.node(editor, commonPath);
        var [commonNode] = commonNodeEntry;
        var depth = commonPath.length + 1;
        var wrapperPath = Path.next(lastPath.slice(0, depth));
        var wrapper = _objectSpread$f(_objectSpread$f({}, element), {}, {
          children: []
        });
        Transforms.insertNodes(editor, wrapper, {
          at: wrapperPath,
          voids
        });
        Transforms.moveNodes(editor, {
          at: range2,
          match: (n2) => Element$2.isAncestor(commonNode) && commonNode.children.includes(n2),
          to: wrapperPath.concat(0),
          voids
        });
      }
    }, _ret;
    for (var [, rootPath] of roots) {
      _ret = _loop();
      if (_ret === 0) continue;
    }
  });
};
var createEditor = () => {
  var editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isElementReadOnly: () => false,
    isInline: () => false,
    isSelectable: () => true,
    isVoid: () => false,
    markableVoid: () => false,
    onChange: () => {
    },
    // Core
    apply: function apply$1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return apply(editor, ...args);
    },
    // Editor
    addMark: function addMark$1() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return addMark(editor, ...args);
    },
    deleteBackward: function deleteBackward$1() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return deleteBackward(editor, ...args);
    },
    deleteForward: function deleteForward$1() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return deleteForward(editor, ...args);
    },
    deleteFragment: function deleteFragment$1() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return deleteFragment(editor, ...args);
    },
    getFragment: function getFragment$1() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      return getFragment(editor, ...args);
    },
    insertBreak: function insertBreak$1() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      return insertBreak(editor, ...args);
    },
    insertSoftBreak: function insertSoftBreak$1() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      return insertSoftBreak(editor, ...args);
    },
    insertFragment: function insertFragment$1() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      return insertFragment(editor, ...args);
    },
    insertNode: function insertNode$1() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }
      return insertNode(editor, ...args);
    },
    insertText: function insertText$1() {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }
      return insertText(editor, ...args);
    },
    normalizeNode: function normalizeNode$1() {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }
      return normalizeNode(editor, ...args);
    },
    removeMark: function removeMark$1() {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }
      return removeMark(editor, ...args);
    },
    getDirtyPaths: function getDirtyPaths$1() {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }
      return getDirtyPaths(editor, ...args);
    },
    shouldNormalize: function shouldNormalize$1() {
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }
      return shouldNormalize(editor, ...args);
    },
    // Editor interface
    above: function above$1() {
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }
      return above(editor, ...args);
    },
    after: function after$1() {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }
      return after(editor, ...args);
    },
    before: function before$1() {
      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
      }
      return before(editor, ...args);
    },
    collapse: function collapse$1() {
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }
      return collapse(editor, ...args);
    },
    delete: function _delete() {
      for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
        args[_key20] = arguments[_key20];
      }
      return deleteText(editor, ...args);
    },
    deselect: function deselect$1() {
      for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
        args[_key21] = arguments[_key21];
      }
      return deselect(editor, ...args);
    },
    edges: function edges$1() {
      for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        args[_key22] = arguments[_key22];
      }
      return edges(editor, ...args);
    },
    elementReadOnly: function elementReadOnly$1() {
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }
      return elementReadOnly(editor, ...args);
    },
    end: function end$1() {
      for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        args[_key24] = arguments[_key24];
      }
      return end(editor, ...args);
    },
    first: function first$1() {
      for (var _len25 = arguments.length, args = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
        args[_key25] = arguments[_key25];
      }
      return first(editor, ...args);
    },
    fragment: function fragment$1() {
      for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
        args[_key26] = arguments[_key26];
      }
      return fragment(editor, ...args);
    },
    getMarks: function getMarks() {
      for (var _len27 = arguments.length, args = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
        args[_key27] = arguments[_key27];
      }
      return marks(editor, ...args);
    },
    hasBlocks: function hasBlocks$1() {
      for (var _len28 = arguments.length, args = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
        args[_key28] = arguments[_key28];
      }
      return hasBlocks(editor, ...args);
    },
    hasInlines: function hasInlines$1() {
      for (var _len29 = arguments.length, args = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
        args[_key29] = arguments[_key29];
      }
      return hasInlines(editor, ...args);
    },
    hasPath: function hasPath$1() {
      for (var _len30 = arguments.length, args = new Array(_len30), _key30 = 0; _key30 < _len30; _key30++) {
        args[_key30] = arguments[_key30];
      }
      return hasPath(editor, ...args);
    },
    hasTexts: function hasTexts$1() {
      for (var _len31 = arguments.length, args = new Array(_len31), _key31 = 0; _key31 < _len31; _key31++) {
        args[_key31] = arguments[_key31];
      }
      return hasTexts(editor, ...args);
    },
    insertNodes: function insertNodes$1() {
      for (var _len32 = arguments.length, args = new Array(_len32), _key32 = 0; _key32 < _len32; _key32++) {
        args[_key32] = arguments[_key32];
      }
      return insertNodes(editor, ...args);
    },
    isBlock: function isBlock$1() {
      for (var _len33 = arguments.length, args = new Array(_len33), _key33 = 0; _key33 < _len33; _key33++) {
        args[_key33] = arguments[_key33];
      }
      return isBlock(editor, ...args);
    },
    isEdge: function isEdge$1() {
      for (var _len34 = arguments.length, args = new Array(_len34), _key34 = 0; _key34 < _len34; _key34++) {
        args[_key34] = arguments[_key34];
      }
      return isEdge(editor, ...args);
    },
    isEmpty: function isEmpty$1() {
      for (var _len35 = arguments.length, args = new Array(_len35), _key35 = 0; _key35 < _len35; _key35++) {
        args[_key35] = arguments[_key35];
      }
      return isEmpty(editor, ...args);
    },
    isEnd: function isEnd$1() {
      for (var _len36 = arguments.length, args = new Array(_len36), _key36 = 0; _key36 < _len36; _key36++) {
        args[_key36] = arguments[_key36];
      }
      return isEnd(editor, ...args);
    },
    isNormalizing: function isNormalizing$1() {
      for (var _len37 = arguments.length, args = new Array(_len37), _key37 = 0; _key37 < _len37; _key37++) {
        args[_key37] = arguments[_key37];
      }
      return isNormalizing(editor, ...args);
    },
    isStart: function isStart$1() {
      for (var _len38 = arguments.length, args = new Array(_len38), _key38 = 0; _key38 < _len38; _key38++) {
        args[_key38] = arguments[_key38];
      }
      return isStart(editor, ...args);
    },
    last: function last$1() {
      for (var _len39 = arguments.length, args = new Array(_len39), _key39 = 0; _key39 < _len39; _key39++) {
        args[_key39] = arguments[_key39];
      }
      return last(editor, ...args);
    },
    leaf: function leaf$1() {
      for (var _len40 = arguments.length, args = new Array(_len40), _key40 = 0; _key40 < _len40; _key40++) {
        args[_key40] = arguments[_key40];
      }
      return leaf(editor, ...args);
    },
    levels: function levels$1() {
      for (var _len41 = arguments.length, args = new Array(_len41), _key41 = 0; _key41 < _len41; _key41++) {
        args[_key41] = arguments[_key41];
      }
      return levels(editor, ...args);
    },
    liftNodes: function liftNodes$1() {
      for (var _len42 = arguments.length, args = new Array(_len42), _key42 = 0; _key42 < _len42; _key42++) {
        args[_key42] = arguments[_key42];
      }
      return liftNodes(editor, ...args);
    },
    mergeNodes: function mergeNodes$1() {
      for (var _len43 = arguments.length, args = new Array(_len43), _key43 = 0; _key43 < _len43; _key43++) {
        args[_key43] = arguments[_key43];
      }
      return mergeNodes(editor, ...args);
    },
    move: function move$1() {
      for (var _len44 = arguments.length, args = new Array(_len44), _key44 = 0; _key44 < _len44; _key44++) {
        args[_key44] = arguments[_key44];
      }
      return move(editor, ...args);
    },
    moveNodes: function moveNodes$1() {
      for (var _len45 = arguments.length, args = new Array(_len45), _key45 = 0; _key45 < _len45; _key45++) {
        args[_key45] = arguments[_key45];
      }
      return moveNodes(editor, ...args);
    },
    next: function next$1() {
      for (var _len46 = arguments.length, args = new Array(_len46), _key46 = 0; _key46 < _len46; _key46++) {
        args[_key46] = arguments[_key46];
      }
      return next(editor, ...args);
    },
    node: function node$1() {
      for (var _len47 = arguments.length, args = new Array(_len47), _key47 = 0; _key47 < _len47; _key47++) {
        args[_key47] = arguments[_key47];
      }
      return node(editor, ...args);
    },
    nodes: function nodes$1() {
      for (var _len48 = arguments.length, args = new Array(_len48), _key48 = 0; _key48 < _len48; _key48++) {
        args[_key48] = arguments[_key48];
      }
      return nodes(editor, ...args);
    },
    normalize: function normalize$1() {
      for (var _len49 = arguments.length, args = new Array(_len49), _key49 = 0; _key49 < _len49; _key49++) {
        args[_key49] = arguments[_key49];
      }
      return normalize(editor, ...args);
    },
    parent: function parent$1() {
      for (var _len50 = arguments.length, args = new Array(_len50), _key50 = 0; _key50 < _len50; _key50++) {
        args[_key50] = arguments[_key50];
      }
      return parent(editor, ...args);
    },
    path: function path$1() {
      for (var _len51 = arguments.length, args = new Array(_len51), _key51 = 0; _key51 < _len51; _key51++) {
        args[_key51] = arguments[_key51];
      }
      return path(editor, ...args);
    },
    pathRef: function pathRef$1() {
      for (var _len52 = arguments.length, args = new Array(_len52), _key52 = 0; _key52 < _len52; _key52++) {
        args[_key52] = arguments[_key52];
      }
      return pathRef(editor, ...args);
    },
    pathRefs: function pathRefs$1() {
      for (var _len53 = arguments.length, args = new Array(_len53), _key53 = 0; _key53 < _len53; _key53++) {
        args[_key53] = arguments[_key53];
      }
      return pathRefs(editor, ...args);
    },
    point: function point$1() {
      for (var _len54 = arguments.length, args = new Array(_len54), _key54 = 0; _key54 < _len54; _key54++) {
        args[_key54] = arguments[_key54];
      }
      return point(editor, ...args);
    },
    pointRef: function pointRef$1() {
      for (var _len55 = arguments.length, args = new Array(_len55), _key55 = 0; _key55 < _len55; _key55++) {
        args[_key55] = arguments[_key55];
      }
      return pointRef(editor, ...args);
    },
    pointRefs: function pointRefs$1() {
      for (var _len56 = arguments.length, args = new Array(_len56), _key56 = 0; _key56 < _len56; _key56++) {
        args[_key56] = arguments[_key56];
      }
      return pointRefs(editor, ...args);
    },
    positions: function positions$1() {
      for (var _len57 = arguments.length, args = new Array(_len57), _key57 = 0; _key57 < _len57; _key57++) {
        args[_key57] = arguments[_key57];
      }
      return positions(editor, ...args);
    },
    previous: function previous$1() {
      for (var _len58 = arguments.length, args = new Array(_len58), _key58 = 0; _key58 < _len58; _key58++) {
        args[_key58] = arguments[_key58];
      }
      return previous(editor, ...args);
    },
    range: function range$1() {
      for (var _len59 = arguments.length, args = new Array(_len59), _key59 = 0; _key59 < _len59; _key59++) {
        args[_key59] = arguments[_key59];
      }
      return range(editor, ...args);
    },
    rangeRef: function rangeRef$1() {
      for (var _len60 = arguments.length, args = new Array(_len60), _key60 = 0; _key60 < _len60; _key60++) {
        args[_key60] = arguments[_key60];
      }
      return rangeRef(editor, ...args);
    },
    rangeRefs: function rangeRefs$1() {
      for (var _len61 = arguments.length, args = new Array(_len61), _key61 = 0; _key61 < _len61; _key61++) {
        args[_key61] = arguments[_key61];
      }
      return rangeRefs(editor, ...args);
    },
    removeNodes: function removeNodes$1() {
      for (var _len62 = arguments.length, args = new Array(_len62), _key62 = 0; _key62 < _len62; _key62++) {
        args[_key62] = arguments[_key62];
      }
      return removeNodes(editor, ...args);
    },
    select: function select$1() {
      for (var _len63 = arguments.length, args = new Array(_len63), _key63 = 0; _key63 < _len63; _key63++) {
        args[_key63] = arguments[_key63];
      }
      return select(editor, ...args);
    },
    setNodes: function setNodes$1() {
      for (var _len64 = arguments.length, args = new Array(_len64), _key64 = 0; _key64 < _len64; _key64++) {
        args[_key64] = arguments[_key64];
      }
      return setNodes(editor, ...args);
    },
    setNormalizing: function setNormalizing$1() {
      for (var _len65 = arguments.length, args = new Array(_len65), _key65 = 0; _key65 < _len65; _key65++) {
        args[_key65] = arguments[_key65];
      }
      return setNormalizing(editor, ...args);
    },
    setPoint: function setPoint$1() {
      for (var _len66 = arguments.length, args = new Array(_len66), _key66 = 0; _key66 < _len66; _key66++) {
        args[_key66] = arguments[_key66];
      }
      return setPoint(editor, ...args);
    },
    setSelection: function setSelection$1() {
      for (var _len67 = arguments.length, args = new Array(_len67), _key67 = 0; _key67 < _len67; _key67++) {
        args[_key67] = arguments[_key67];
      }
      return setSelection(editor, ...args);
    },
    splitNodes: function splitNodes$1() {
      for (var _len68 = arguments.length, args = new Array(_len68), _key68 = 0; _key68 < _len68; _key68++) {
        args[_key68] = arguments[_key68];
      }
      return splitNodes(editor, ...args);
    },
    start: function start$1() {
      for (var _len69 = arguments.length, args = new Array(_len69), _key69 = 0; _key69 < _len69; _key69++) {
        args[_key69] = arguments[_key69];
      }
      return start(editor, ...args);
    },
    string: function string$1() {
      for (var _len70 = arguments.length, args = new Array(_len70), _key70 = 0; _key70 < _len70; _key70++) {
        args[_key70] = arguments[_key70];
      }
      return string(editor, ...args);
    },
    unhangRange: function unhangRange$1() {
      for (var _len71 = arguments.length, args = new Array(_len71), _key71 = 0; _key71 < _len71; _key71++) {
        args[_key71] = arguments[_key71];
      }
      return unhangRange(editor, ...args);
    },
    unsetNodes: function unsetNodes$1() {
      for (var _len72 = arguments.length, args = new Array(_len72), _key72 = 0; _key72 < _len72; _key72++) {
        args[_key72] = arguments[_key72];
      }
      return unsetNodes(editor, ...args);
    },
    unwrapNodes: function unwrapNodes$1() {
      for (var _len73 = arguments.length, args = new Array(_len73), _key73 = 0; _key73 < _len73; _key73++) {
        args[_key73] = arguments[_key73];
      }
      return unwrapNodes(editor, ...args);
    },
    void: function _void() {
      for (var _len74 = arguments.length, args = new Array(_len74), _key74 = 0; _key74 < _len74; _key74++) {
        args[_key74] = arguments[_key74];
      }
      return getVoid(editor, ...args);
    },
    withoutNormalizing: function withoutNormalizing$1() {
      for (var _len75 = arguments.length, args = new Array(_len75), _key75 = 0; _key75 < _len75; _key75++) {
        args[_key75] = arguments[_key75];
      }
      return withoutNormalizing(editor, ...args);
    },
    wrapNodes: function wrapNodes$1() {
      for (var _len76 = arguments.length, args = new Array(_len76), _key76 = 0; _key76 < _len76; _key76++) {
        args[_key76] = arguments[_key76];
      }
      return wrapNodes(editor, ...args);
    }
  };
  return editor;
};
const CustomEditor = {
  SetFontStyle(editor, style, rangeStyle) {
    const currentStyle = {};
    Object.keys(style).forEach((key) => {
      if (rangeStyle[key] !== style[key]) {
        currentStyle[key] = style[key];
      }
    });
    Object.keys(currentStyle).forEach((key) => {
      Editor.addMark(editor, key, currentStyle[key]);
    });
    CustomEditor.setFontSize(editor, editor.selection);
  },
  setFontSize(editor, selection) {
    selection = selection || {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, [])
    };
  },
  setMaxFontSize(paragraph) {
    let maxFontSize = "16px";
    for (const child of paragraph.children) {
      if (Text$1.isText(child) && child.fontSize) {
        const fontSize = parseFloat(child.fontSize);
        if (!isNaN(fontSize) && fontSize > parseFloat(maxFontSize)) {
          maxFontSize = `${fontSize}px`;
        }
      } else if (Node.isNode(child)) {
        const childMaxFontSize = CustomEditor.setMaxFontSize(child);
        if (parseFloat(childMaxFontSize) > parseFloat(maxFontSize)) {
          maxFontSize = childMaxFontSize;
        }
      }
    }
    return maxFontSize;
  },
  setMaxLineheight(paragraph) {
    let maxLineheight = "16px";
    for (const child of paragraph.children) {
      if (Text$1.isText(child) && child.lineHeight) {
        const lineHeight = parseFloat(child.lineHeight);
        if (!isNaN(lineHeight) && lineHeight > parseFloat(maxLineheight)) {
          maxLineheight = `${lineHeight}px`;
        }
      } else if (Node.isNode(child)) {
        const childMaxLineheight = CustomEditor.setMaxLineheight(child);
        if (parseFloat(childMaxLineheight) > parseFloat(maxLineheight)) {
          maxLineheight = childMaxLineheight;
        }
      }
    }
    return maxLineheight;
  }
  // SetFontWeightMark(editor, style) {
  //     Transforms.setNodes(
  //       editor,
  //       { fontWeight: style.fontWeight },
  //       { match: n => Text.isText(n), split: true }
  //     )
  // },
  // SetFontSizeMark(editor, style) {
  //     Transforms.setNodes(
  //       editor,
  //       { fontSize: style.fontSize },
  //       { match: n => Text.isText(n), split: true }
  //     )
  // },
  // SetDecorationMark(editor, style) {
  //     Transforms.setNodes(
  //       editor,
  //       { textDecoration: style.textDecoration },
  //       { match: n => Text.isText(n), split: true }
  //     )
  // },
  // SetFontStyleMark(editor, style) {
  //     Transforms.setNodes(
  //       editor,
  //       { fontStyle: style.fontStyle },
  //       { match: n => Text.isText(n), split: true }
  //     )
  // },
  // SetLineheightMark(editor, style) {
  //     Transforms.setNodes(
  //       editor,
  //       { lineHeight: style.lineHeight },
  //       { match: n => Text.isText(n), split: true }
  //     )
  // },
};
var direction_1 = direction;
var RTL = "֑-߿יִ-﷽ﹰ-ﻼ";
var LTR = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿";
var rtl = new RegExp("^[^" + LTR + "]*[" + RTL + "]");
var ltr = new RegExp("^[^" + RTL + "]*[" + LTR + "]");
function direction(value) {
  value = String(value || "");
  if (rtl.test(value)) {
    return "rtl";
  }
  if (ltr.test(value)) {
    return "ltr";
  }
  return "neutral";
}
const getDirection = /* @__PURE__ */ getDefaultExportFromCjs(direction_1);
function isObject$3(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$3;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$2 = freeGlobal || freeSelf || Function("return this")();
var _root = root$2;
var root$1 = _root;
var now$1 = function() {
  return root$1.Date.now();
};
var now_1 = now$1;
var reWhitespace = /\s/;
function trimmedEndIndex$1(string3) {
  var index = string3.length;
  while (index-- && reWhitespace.test(string3.charAt(index))) {
  }
  return index;
}
var _trimmedEndIndex = trimmedEndIndex$1;
var trimmedEndIndex = _trimmedEndIndex;
var reTrimStart = /^\s+/;
function baseTrim$1(string3) {
  return string3 ? string3.slice(0, trimmedEndIndex(string3) + 1).replace(reTrimStart, "") : string3;
}
var _baseTrim = baseTrim$1;
var root = _root;
var Symbol$3 = root.Symbol;
var _Symbol = Symbol$3;
var Symbol$2 = _Symbol;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;
var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag$1(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$1;
function isObjectLike$1(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$1;
var baseGetTag = _baseGetTag, isObjectLike = isObjectLike_1;
var symbolTag = "[object Symbol]";
function isSymbol$1(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var isSymbol_1 = isSymbol$1;
var baseTrim = _baseTrim, isObject$2 = isObject_1, isSymbol = isSymbol_1;
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$2(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$2(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_1 = toNumber$1;
var isObject$1 = isObject_1, now = now_1, toNumber = toNumber_1;
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce$1(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time2) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time2;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time2) {
    lastInvokeTime = time2;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time2) : result;
  }
  function remainingWait(time2) {
    var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time2) {
    var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time2 = now();
    if (shouldInvoke(time2)) {
      return trailingEdge(time2);
    }
    timerId = setTimeout(timerExpired, remainingWait(time2));
  }
  function trailingEdge(time2) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time2);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time2 = now(), isInvoking = shouldInvoke(time2);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time2;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var debounce_1 = debounce$1;
const debounce$2 = /* @__PURE__ */ getDefaultExportFromCjs(debounce_1);
var debounce = debounce_1, isObject = isObject_1;
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
var throttle_1 = throttle;
const throttle$1 = /* @__PURE__ */ getDefaultExportFromCjs(throttle_1);
const t = (t2) => "object" == typeof t2 && null != t2 && 1 === t2.nodeType, e$1 = (t2, e2) => (!e2 || "hidden" !== t2) && ("visible" !== t2 && "clip" !== t2), n$1 = (t2, n2) => {
  if (t2.clientHeight < t2.scrollHeight || t2.clientWidth < t2.scrollWidth) {
    const o2 = getComputedStyle(t2, null);
    return e$1(o2.overflowY, n2) || e$1(o2.overflowX, n2) || ((t3) => {
      const e2 = ((t4) => {
        if (!t4.ownerDocument || !t4.ownerDocument.defaultView) return null;
        try {
          return t4.ownerDocument.defaultView.frameElement;
        } catch (t5) {
          return null;
        }
      })(t3);
      return !!e2 && (e2.clientHeight < t3.scrollHeight || e2.clientWidth < t3.scrollWidth);
    })(t2);
  }
  return false;
}, o$1 = (t2, e2, n2, o2, l2, r2, i, s) => r2 < t2 && i > e2 || r2 > t2 && i < e2 ? 0 : r2 <= t2 && s <= n2 || i >= e2 && s >= n2 ? r2 - t2 - o2 : i > e2 && s < n2 || r2 < t2 && s > n2 ? i - e2 + l2 : 0, l = (t2) => {
  const e2 = t2.parentElement;
  return null == e2 ? t2.getRootNode().host || null : e2;
}, r = (e2, r2) => {
  var i, s, d, h;
  if ("undefined" == typeof document) return [];
  const { scrollMode: c, block: f, inline: u2, boundary: a, skipOverflowHiddenElements: g } = r2, p2 = "function" == typeof a ? a : (t2) => t2 !== a;
  if (!t(e2)) throw new TypeError("Invalid target");
  const m2 = document.scrollingElement || document.documentElement, w2 = [];
  let W2 = e2;
  for (; t(W2) && p2(W2); ) {
    if (W2 = l(W2), W2 === m2) {
      w2.push(W2);
      break;
    }
    null != W2 && W2 === document.body && n$1(W2) && !n$1(document.documentElement) || null != W2 && n$1(W2, g) && w2.push(W2);
  }
  const b = null != (s = null == (i = window.visualViewport) ? void 0 : i.width) ? s : innerWidth, H2 = null != (h = null == (d = window.visualViewport) ? void 0 : d.height) ? h : innerHeight, { scrollX: y2, scrollY: M2 } = window, { height: v2, width: E2, top: x2, right: C2, bottom: I2, left: R2 } = e2.getBoundingClientRect(), { top: T2, right: B2, bottom: F2, left: V2 } = ((t2) => {
    const e3 = window.getComputedStyle(t2);
    return { top: parseFloat(e3.scrollMarginTop) || 0, right: parseFloat(e3.scrollMarginRight) || 0, bottom: parseFloat(e3.scrollMarginBottom) || 0, left: parseFloat(e3.scrollMarginLeft) || 0 };
  })(e2);
  let k2 = "start" === f || "nearest" === f ? x2 - T2 : "end" === f ? I2 + F2 : x2 + v2 / 2 - T2 + F2, D2 = "center" === u2 ? R2 + E2 / 2 - V2 + B2 : "end" === u2 ? C2 + B2 : R2 - V2;
  const L2 = [];
  for (let t2 = 0; t2 < w2.length; t2++) {
    const e3 = w2[t2], { height: l2, width: r3, top: i2, right: s2, bottom: d2, left: h2 } = e3.getBoundingClientRect();
    if ("if-needed" === c && x2 >= 0 && R2 >= 0 && I2 <= H2 && C2 <= b && (e3 === m2 && !n$1(e3) || x2 >= i2 && I2 <= d2 && R2 >= h2 && C2 <= s2)) return L2;
    const a2 = getComputedStyle(e3), g2 = parseInt(a2.borderLeftWidth, 10), p3 = parseInt(a2.borderTopWidth, 10), W3 = parseInt(a2.borderRightWidth, 10), T3 = parseInt(a2.borderBottomWidth, 10);
    let B3 = 0, F3 = 0;
    const V3 = "offsetWidth" in e3 ? e3.offsetWidth - e3.clientWidth - g2 - W3 : 0, S2 = "offsetHeight" in e3 ? e3.offsetHeight - e3.clientHeight - p3 - T3 : 0, X2 = "offsetWidth" in e3 ? 0 === e3.offsetWidth ? 0 : r3 / e3.offsetWidth : 0, Y2 = "offsetHeight" in e3 ? 0 === e3.offsetHeight ? 0 : l2 / e3.offsetHeight : 0;
    if (m2 === e3) B3 = "start" === f ? k2 : "end" === f ? k2 - H2 : "nearest" === f ? o$1(M2, M2 + H2, H2, p3, T3, M2 + k2, M2 + k2 + v2, v2) : k2 - H2 / 2, F3 = "start" === u2 ? D2 : "center" === u2 ? D2 - b / 2 : "end" === u2 ? D2 - b : o$1(y2, y2 + b, b, g2, W3, y2 + D2, y2 + D2 + E2, E2), B3 = Math.max(0, B3 + M2), F3 = Math.max(0, F3 + y2);
    else {
      B3 = "start" === f ? k2 - i2 - p3 : "end" === f ? k2 - d2 + T3 + S2 : "nearest" === f ? o$1(i2, d2, l2, p3, T3 + S2, k2, k2 + v2, v2) : k2 - (i2 + l2 / 2) + S2 / 2, F3 = "start" === u2 ? D2 - h2 - g2 : "center" === u2 ? D2 - (h2 + r3 / 2) + V3 / 2 : "end" === u2 ? D2 - s2 + W3 + V3 : o$1(h2, s2, r3, g2, W3 + V3, D2, D2 + E2, E2);
      const { scrollLeft: t3, scrollTop: n2 } = e3;
      B3 = 0 === Y2 ? 0 : Math.max(0, Math.min(n2 + B3 / Y2, e3.scrollHeight - l2 / Y2 + S2)), F3 = 0 === X2 ? 0 : Math.max(0, Math.min(t3 + F3 / X2, e3.scrollWidth - r3 / X2 + V3)), k2 += n2 - B3, D2 += t3 - F3;
    }
    L2.push({ el: e3, top: B3, left: F3 });
  }
  return L2;
};
const o = (t2) => false === t2 ? { block: "end", inline: "nearest" } : ((t3) => t3 === Object(t3) && 0 !== Object.keys(t3).length)(t2) ? t2 : { block: "start", inline: "nearest" };
function e(e2, r$12) {
  if (!e2.isConnected || !((t2) => {
    let o2 = t2;
    for (; o2 && o2.parentNode; ) {
      if (o2.parentNode === document) return true;
      o2 = o2.parentNode instanceof ShadowRoot ? o2.parentNode.host : o2.parentNode;
    }
    return false;
  })(e2)) return;
  const n2 = ((t2) => {
    const o2 = window.getComputedStyle(t2);
    return { top: parseFloat(o2.scrollMarginTop) || 0, right: parseFloat(o2.scrollMarginRight) || 0, bottom: parseFloat(o2.scrollMarginBottom) || 0, left: parseFloat(o2.scrollMarginLeft) || 0 };
  })(e2);
  if (((t2) => "object" == typeof t2 && "function" == typeof t2.behavior)(r$12)) return r$12.behavior(r(e2, r$12));
  const l2 = "boolean" == typeof r$12 || null == r$12 ? void 0 : r$12.behavior;
  for (const { el: a, top: i, left: s } of r(e2, o(r$12))) {
    const t2 = i - n2.top + n2.bottom, o2 = s - n2.left + n2.right;
    a.scroll({ top: t2, left: o2, behavior: l2 });
  }
}
var resizeObservers = [];
var hasActiveObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.activeTargets.length > 0;
  });
};
var hasSkippedObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.skippedTargets.length > 0;
  });
};
var msg = "ResizeObserver loop completed with undelivered notifications.";
var deliverResizeLoopError = function() {
  var event;
  if (typeof ErrorEvent === "function") {
    event = new ErrorEvent("error", {
      message: msg
    });
  } else {
    event = document.createEvent("Event");
    event.initEvent("error", false, false);
    event.message = msg;
  }
  window.dispatchEvent(event);
};
var ResizeObserverBoxOptions;
(function(ResizeObserverBoxOptions2) {
  ResizeObserverBoxOptions2["BORDER_BOX"] = "border-box";
  ResizeObserverBoxOptions2["CONTENT_BOX"] = "content-box";
  ResizeObserverBoxOptions2["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));
var freeze = function(obj) {
  return Object.freeze(obj);
};
var ResizeObserverSize = /* @__PURE__ */ function() {
  function ResizeObserverSize2(inlineSize, blockSize) {
    this.inlineSize = inlineSize;
    this.blockSize = blockSize;
    freeze(this);
  }
  return ResizeObserverSize2;
}();
var DOMRectReadOnly = function() {
  function DOMRectReadOnly2(x2, y2, width, height) {
    this.x = x2;
    this.y = y2;
    this.width = width;
    this.height = height;
    this.top = this.y;
    this.left = this.x;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
    return freeze(this);
  }
  DOMRectReadOnly2.prototype.toJSON = function() {
    var _a = this, x2 = _a.x, y2 = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
    return { x: x2, y: y2, top, right, bottom, left, width, height };
  };
  DOMRectReadOnly2.fromRect = function(rectangle) {
    return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  };
  return DOMRectReadOnly2;
}();
var isSVG = function(target) {
  return target instanceof SVGElement && "getBBox" in target;
};
var isHidden = function(target) {
  if (isSVG(target)) {
    var _a = target.getBBox(), width = _a.width, height = _a.height;
    return !width && !height;
  }
  var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
  return !(offsetWidth || offsetHeight || target.getClientRects().length);
};
var isElement = function(obj) {
  var _a;
  if (obj instanceof Element) {
    return true;
  }
  var scope = (_a = obj === null || obj === void 0 ? void 0 : obj.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
  return !!(scope && obj instanceof scope.Element);
};
var isReplacedElement = function(target) {
  switch (target.tagName) {
    case "INPUT":
      if (target.type !== "image") {
        break;
      }
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return true;
  }
  return false;
};
var global$1 = typeof window !== "undefined" ? window : {};
var cache = /* @__PURE__ */ new WeakMap();
var scrollRegexp = /auto|scroll/;
var verticalRegexp = /^tb|vertical/;
var IE = /msie|trident/i.test(global$1.navigator && global$1.navigator.userAgent);
var parseDimension = function(pixel) {
  return parseFloat(pixel || "0");
};
var size = function(inlineSize, blockSize, switchSizes) {
  if (inlineSize === void 0) {
    inlineSize = 0;
  }
  if (blockSize === void 0) {
    blockSize = 0;
  }
  if (switchSizes === void 0) {
    switchSizes = false;
  }
  return new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
};
var zeroBoxes = freeze({
  devicePixelContentBoxSize: size(),
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
});
var calculateBoxSizes = function(target, forceRecalculation) {
  if (forceRecalculation === void 0) {
    forceRecalculation = false;
  }
  if (cache.has(target) && !forceRecalculation) {
    return cache.get(target);
  }
  if (isHidden(target)) {
    cache.set(target, zeroBoxes);
    return zeroBoxes;
  }
  var cs = getComputedStyle(target);
  var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
  var removePadding = !IE && cs.boxSizing === "border-box";
  var switchSizes = verticalRegexp.test(cs.writingMode || "");
  var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || "");
  var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || "");
  var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
  var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
  var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
  var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
  var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
  var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
  var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
  var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
  var horizontalPadding = paddingLeft + paddingRight;
  var verticalPadding = paddingTop + paddingBottom;
  var horizontalBorderArea = borderLeft + borderRight;
  var verticalBorderArea = borderTop + borderBottom;
  var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
  var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
  var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
  var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
  var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
  var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
  var boxes = freeze({
    devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
    borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size(contentWidth, contentHeight, switchSizes),
    contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });
  cache.set(target, boxes);
  return boxes;
};
var calculateBoxSize = function(target, observedBox, forceRecalculation) {
  var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
  switch (observedBox) {
    case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;
    case ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;
    default:
      return contentBoxSize;
  }
};
var ResizeObserverEntry = /* @__PURE__ */ function() {
  function ResizeObserverEntry2(target) {
    var boxes = calculateBoxSizes(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = freeze([boxes.borderBoxSize]);
    this.contentBoxSize = freeze([boxes.contentBoxSize]);
    this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
  }
  return ResizeObserverEntry2;
}();
var calculateDepthForNode = function(node3) {
  if (isHidden(node3)) {
    return Infinity;
  }
  var depth = 0;
  var parent3 = node3.parentNode;
  while (parent3) {
    depth += 1;
    parent3 = parent3.parentNode;
  }
  return depth;
};
var broadcastActiveObservations = function() {
  var shallowestDepth = Infinity;
  var callbacks2 = [];
  resizeObservers.forEach(function processObserver(ro) {
    if (ro.activeTargets.length === 0) {
      return;
    }
    var entries = [];
    ro.activeTargets.forEach(function processTarget(ot) {
      var entry = new ResizeObserverEntry(ot.target);
      var targetDepth = calculateDepthForNode(ot.target);
      entries.push(entry);
      ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    });
    callbacks2.push(function resizeObserverCallback() {
      ro.callback.call(ro.observer, entries, ro.observer);
    });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  });
  for (var _i = 0, callbacks_1 = callbacks2; _i < callbacks_1.length; _i++) {
    var callback = callbacks_1[_i];
    callback();
  }
  return shallowestDepth;
};
var gatherActiveObservationsAtDepth = function(depth) {
  resizeObservers.forEach(function processObserver(ro) {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot) {
      if (ot.isActive()) {
        if (calculateDepthForNode(ot.target) > depth) {
          ro.activeTargets.push(ot);
        } else {
          ro.skippedTargets.push(ot);
        }
      }
    });
  });
};
var process$1 = function() {
  var depth = 0;
  gatherActiveObservationsAtDepth(depth);
  while (hasActiveObservations()) {
    depth = broadcastActiveObservations();
    gatherActiveObservationsAtDepth(depth);
  }
  if (hasSkippedObservations()) {
    deliverResizeLoopError();
  }
  return depth > 0;
};
var trigger;
var callbacks = [];
var notify = function() {
  return callbacks.splice(0).forEach(function(cb2) {
    return cb2();
  });
};
var queueMicroTask = function(callback) {
  if (!trigger) {
    var toggle_1 = 0;
    var el_1 = document.createTextNode("");
    var config2 = { characterData: true };
    new MutationObserver(function() {
      return notify();
    }).observe(el_1, config2);
    trigger = function() {
      el_1.textContent = "".concat(toggle_1 ? toggle_1-- : toggle_1++);
    };
  }
  callbacks.push(callback);
  trigger();
};
var queueResizeObserver = function(cb2) {
  queueMicroTask(function ResizeObserver2() {
    requestAnimationFrame(cb2);
  });
};
var watching = 0;
var isWatching = function() {
  return !!watching;
};
var CATCH_PERIOD = 250;
var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
var events = [
  "resize",
  "load",
  "transitionend",
  "animationend",
  "animationstart",
  "animationiteration",
  "keyup",
  "keydown",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "blur",
  "focus"
];
var time = function(timeout) {
  if (timeout === void 0) {
    timeout = 0;
  }
  return Date.now() + timeout;
};
var scheduled = false;
var Scheduler = function() {
  function Scheduler2() {
    var _this = this;
    this.stopped = true;
    this.listener = function() {
      return _this.schedule();
    };
  }
  Scheduler2.prototype.run = function(timeout) {
    var _this = this;
    if (timeout === void 0) {
      timeout = CATCH_PERIOD;
    }
    if (scheduled) {
      return;
    }
    scheduled = true;
    var until = time(timeout);
    queueResizeObserver(function() {
      var elementsHaveResized = false;
      try {
        elementsHaveResized = process$1();
      } finally {
        scheduled = false;
        timeout = until - time();
        if (!isWatching()) {
          return;
        }
        if (elementsHaveResized) {
          _this.run(1e3);
        } else if (timeout > 0) {
          _this.run(timeout);
        } else {
          _this.start();
        }
      }
    });
  };
  Scheduler2.prototype.schedule = function() {
    this.stop();
    this.run();
  };
  Scheduler2.prototype.observe = function() {
    var _this = this;
    var cb2 = function() {
      return _this.observer && _this.observer.observe(document.body, observerConfig);
    };
    document.body ? cb2() : global$1.addEventListener("DOMContentLoaded", cb2);
  };
  Scheduler2.prototype.start = function() {
    var _this = this;
    if (this.stopped) {
      this.stopped = false;
      this.observer = new MutationObserver(this.listener);
      this.observe();
      events.forEach(function(name) {
        return global$1.addEventListener(name, _this.listener, true);
      });
    }
  };
  Scheduler2.prototype.stop = function() {
    var _this = this;
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach(function(name) {
        return global$1.removeEventListener(name, _this.listener, true);
      });
      this.stopped = true;
    }
  };
  return Scheduler2;
}();
var scheduler = new Scheduler();
var updateCount = function(n2) {
  !watching && n2 > 0 && scheduler.start();
  watching += n2;
  !watching && scheduler.stop();
};
var skipNotifyOnElement = function(target) {
  return !isSVG(target) && !isReplacedElement(target) && getComputedStyle(target).display === "inline";
};
var ResizeObservation = function() {
  function ResizeObservation2(target, observedBox) {
    this.target = target;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  ResizeObservation2.prototype.isActive = function() {
    var size2 = calculateBoxSize(this.target, this.observedBox, true);
    if (skipNotifyOnElement(this.target)) {
      this.lastReportedSize = size2;
    }
    if (this.lastReportedSize.inlineSize !== size2.inlineSize || this.lastReportedSize.blockSize !== size2.blockSize) {
      return true;
    }
    return false;
  };
  return ResizeObservation2;
}();
var ResizeObserverDetail = /* @__PURE__ */ function() {
  function ResizeObserverDetail2(resizeObserver, callback) {
    this.activeTargets = [];
    this.skippedTargets = [];
    this.observationTargets = [];
    this.observer = resizeObserver;
    this.callback = callback;
  }
  return ResizeObserverDetail2;
}();
var observerMap = /* @__PURE__ */ new WeakMap();
var getObservationIndex = function(observationTargets, target) {
  for (var i = 0; i < observationTargets.length; i += 1) {
    if (observationTargets[i].target === target) {
      return i;
    }
  }
  return -1;
};
var ResizeObserverController = function() {
  function ResizeObserverController2() {
  }
  ResizeObserverController2.connect = function(resizeObserver, callback) {
    var detail = new ResizeObserverDetail(resizeObserver, callback);
    observerMap.set(resizeObserver, detail);
  };
  ResizeObserverController2.observe = function(resizeObserver, target, options) {
    var detail = observerMap.get(resizeObserver);
    var firstObservation = detail.observationTargets.length === 0;
    if (getObservationIndex(detail.observationTargets, target) < 0) {
      firstObservation && resizeObservers.push(detail);
      detail.observationTargets.push(new ResizeObservation(target, options && options.box));
      updateCount(1);
      scheduler.schedule();
    }
  };
  ResizeObserverController2.unobserve = function(resizeObserver, target) {
    var detail = observerMap.get(resizeObserver);
    var index = getObservationIndex(detail.observationTargets, target);
    var lastObservation = detail.observationTargets.length === 1;
    if (index >= 0) {
      lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
      detail.observationTargets.splice(index, 1);
      updateCount(-1);
    }
  };
  ResizeObserverController2.disconnect = function(resizeObserver) {
    var _this = this;
    var detail = observerMap.get(resizeObserver);
    detail.observationTargets.slice().forEach(function(ot) {
      return _this.unobserve(resizeObserver, ot.target);
    });
    detail.activeTargets.splice(0, detail.activeTargets.length);
  };
  return ResizeObserverController2;
}();
var ResizeObserver = function() {
  function ResizeObserver2(callback) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (typeof callback !== "function") {
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    }
    ResizeObserverController.connect(this, callback);
  }
  ResizeObserver2.prototype.observe = function(target, options) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (!isElement(target)) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }
    ResizeObserverController.observe(this, target, options);
  };
  ResizeObserver2.prototype.unobserve = function(target) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (!isElement(target)) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }
    ResizeObserverController.unobserve(this, target);
  };
  ResizeObserver2.prototype.disconnect = function() {
    ResizeObserverController.disconnect(this);
  };
  ResizeObserver2.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  };
  return ResizeObserver2;
}();
var lib = {};
Object.defineProperty(lib, "__esModule", {
  value: true
});
var IS_MAC = typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
var MODIFIERS = {
  alt: "altKey",
  control: "ctrlKey",
  meta: "metaKey",
  shift: "shiftKey"
};
var ALIASES = {
  add: "+",
  break: "pause",
  cmd: "meta",
  command: "meta",
  ctl: "control",
  ctrl: "control",
  del: "delete",
  down: "arrowdown",
  esc: "escape",
  ins: "insert",
  left: "arrowleft",
  mod: IS_MAC ? "meta" : "control",
  opt: "alt",
  option: "alt",
  return: "enter",
  right: "arrowright",
  space: " ",
  spacebar: " ",
  up: "arrowup",
  win: "meta",
  windows: "meta"
};
var CODES = {
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  control: 17,
  alt: 18,
  pause: 19,
  capslock: 20,
  escape: 27,
  " ": 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  arrowleft: 37,
  arrowup: 38,
  arrowright: 39,
  arrowdown: 40,
  insert: 45,
  delete: 46,
  meta: 91,
  numlock: 144,
  scrolllock: 145,
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "`": 192,
  "[": 219,
  "\\": 220,
  "]": 221,
  "'": 222
};
for (var f = 1; f < 20; f++) {
  CODES["f" + f] = 111 + f;
}
function isHotkey(hotkey, options, event) {
  if (options && !("byKey" in options)) {
    event = options;
    options = null;
  }
  if (!Array.isArray(hotkey)) {
    hotkey = [hotkey];
  }
  var array = hotkey.map(function(string3) {
    return parseHotkey(string3, options);
  });
  var check = function check2(e2) {
    return array.some(function(object) {
      return compareHotkey(object, e2);
    });
  };
  var ret = event == null ? check : check(event);
  return ret;
}
function isCodeHotkey(hotkey, event) {
  return isHotkey(hotkey, event);
}
function isKeyHotkey(hotkey, event) {
  return isHotkey(hotkey, { byKey: true }, event);
}
function parseHotkey(hotkey, options) {
  var byKey = options && options.byKey;
  var ret = {};
  hotkey = hotkey.replace("++", "+add");
  var values = hotkey.split("+");
  var length = values.length;
  for (var k2 in MODIFIERS) {
    ret[MODIFIERS[k2]] = false;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = void 0;
  try {
    for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var value = _step.value;
      var optional = value.endsWith("?") && value.length > 1;
      if (optional) {
        value = value.slice(0, -1);
      }
      var name = toKeyName(value);
      var modifier = MODIFIERS[name];
      if (value.length > 1 && !modifier && !ALIASES[value] && !CODES[name]) {
        throw new TypeError('Unknown modifier: "' + value + '"');
      }
      if (length === 1 || !modifier) {
        if (byKey) {
          ret.key = name;
        } else {
          ret.which = toKeyCode(value);
        }
      }
      if (modifier) {
        ret[modifier] = optional ? null : true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
  return ret;
}
function compareHotkey(object, event) {
  for (var key in object) {
    var expected = object[key];
    var actual = void 0;
    if (expected == null) {
      continue;
    }
    if (key === "key" && event.key != null) {
      actual = event.key.toLowerCase();
    } else if (key === "which") {
      actual = expected === 91 && event.which === 93 ? 91 : event.which;
    } else {
      actual = event[key];
    }
    if (actual == null && expected === false) {
      continue;
    }
    if (actual !== expected) {
      return false;
    }
  }
  return true;
}
function toKeyCode(name) {
  name = toKeyName(name);
  var code = CODES[name] || name.toUpperCase().charCodeAt(0);
  return code;
}
function toKeyName(name) {
  name = name.toLowerCase();
  name = ALIASES[name] || name;
  return name;
}
lib.default = isHotkey;
var isHotkey_1 = lib.isHotkey = isHotkey;
lib.isCodeHotkey = isCodeHotkey;
lib.isKeyHotkey = isKeyHotkey;
lib.parseHotkey = parseHotkey;
lib.compareHotkey = compareHotkey;
lib.toKeyCode = toKeyCode;
lib.toKeyName = toKeyName;
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _typeof(o2) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof(o2);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var EditorContext = /* @__PURE__ */ reactExports.createContext(null);
var useSlateStatic = () => {
  var editor = reactExports.useContext(EditorContext);
  if (!editor) {
    throw new Error("The `useSlateStatic` hook must be used inside the <Slate> component's context.");
  }
  return editor;
};
var REACT_MAJOR_VERSION = parseInt(React$1.version.split(".")[0], 10);
var IS_IOS = typeof navigator !== "undefined" && typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var IS_APPLE = typeof navigator !== "undefined" && /Mac OS X/.test(navigator.userAgent);
var IS_ANDROID = typeof navigator !== "undefined" && /Android/.test(navigator.userAgent);
var IS_FIREFOX = typeof navigator !== "undefined" && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
var IS_WEBKIT = typeof navigator !== "undefined" && /AppleWebKit(?!.*Chrome)/i.test(navigator.userAgent);
var IS_EDGE_LEGACY = typeof navigator !== "undefined" && /Edge?\/(?:[0-6][0-9]|[0-7][0-8])(?:\.)/i.test(navigator.userAgent);
var IS_CHROME = typeof navigator !== "undefined" && /Chrome/i.test(navigator.userAgent);
var IS_CHROME_LEGACY = typeof navigator !== "undefined" && /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])(?:\.)/i.test(navigator.userAgent);
var IS_ANDROID_CHROME_LEGACY = IS_ANDROID && typeof navigator !== "undefined" && /Chrome?\/(?:[0-5]?\d)(?:\.)/i.test(navigator.userAgent);
var IS_FIREFOX_LEGACY = typeof navigator !== "undefined" && /^(?!.*Seamonkey)(?=.*Firefox\/(?:[0-7][0-9]|[0-8][0-6])(?:\.)).*/i.test(navigator.userAgent);
var IS_UC_MOBILE = typeof navigator !== "undefined" && /.*UCBrowser/.test(navigator.userAgent);
var IS_WECHATBROWSER = typeof navigator !== "undefined" && /.*Wechat/.test(navigator.userAgent) && !/.*MacWechat/.test(navigator.userAgent);
var CAN_USE_DOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var HAS_BEFORE_INPUT_SUPPORT = (!IS_CHROME_LEGACY || !IS_ANDROID_CHROME_LEGACY) && !IS_EDGE_LEGACY && // globalThis is undefined in older browsers
typeof globalThis !== "undefined" && globalThis.InputEvent && // @ts-ignore The `getTargetRanges` property isn't recognized.
typeof globalThis.InputEvent.prototype.getTargetRanges === "function";
var NODE_TO_INDEX = /* @__PURE__ */ new WeakMap();
var NODE_TO_PARENT = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_WINDOW = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_ELEMENT = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_PLACEHOLDER_ELEMENT = /* @__PURE__ */ new WeakMap();
var ELEMENT_TO_NODE = /* @__PURE__ */ new WeakMap();
var NODE_TO_ELEMENT = /* @__PURE__ */ new WeakMap();
var NODE_TO_KEY = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_KEY_TO_ELEMENT = /* @__PURE__ */ new WeakMap();
var IS_READ_ONLY = /* @__PURE__ */ new WeakMap();
var IS_FOCUSED = /* @__PURE__ */ new WeakMap();
var IS_COMPOSING = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_USER_SELECTION = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_ON_CHANGE = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_SCHEDULE_FLUSH = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_PENDING_INSERTION_MARKS = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_USER_MARKS = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_PENDING_DIFFS = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_PENDING_ACTION = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_PENDING_SELECTION = /* @__PURE__ */ new WeakMap();
var EDITOR_TO_FORCE_RENDER = /* @__PURE__ */ new WeakMap();
var PLACEHOLDER_SYMBOL = Symbol("placeholder");
var MARK_PLACEHOLDER_SYMBOL = Symbol("mark-placeholder");
var DOMText = globalThis.Text;
var getDefaultView = (value) => {
  return value && value.ownerDocument && value.ownerDocument.defaultView || null;
};
var isDOMComment = (value) => {
  return isDOMNode(value) && value.nodeType === 8;
};
var isDOMElement = (value) => {
  return isDOMNode(value) && value.nodeType === 1;
};
var isDOMNode = (value) => {
  var window2 = getDefaultView(value);
  return !!window2 && value instanceof window2.Node;
};
var isDOMSelection = (value) => {
  var window2 = value && value.anchorNode && getDefaultView(value.anchorNode);
  return !!window2 && value instanceof window2.Selection;
};
var isDOMText = (value) => {
  return isDOMNode(value) && value.nodeType === 3;
};
var isPlainTextOnlyPaste = (event) => {
  return event.clipboardData && event.clipboardData.getData("text/plain") !== "" && event.clipboardData.types.length === 1;
};
var normalizeDOMPoint = (domPoint) => {
  var [node3, offset] = domPoint;
  if (isDOMElement(node3) && node3.childNodes.length) {
    var isLast = offset === node3.childNodes.length;
    var index = isLast ? offset - 1 : offset;
    [node3, index] = getEditableChildAndIndex(node3, index, isLast ? "backward" : "forward");
    isLast = index < offset;
    while (isDOMElement(node3) && node3.childNodes.length) {
      var i = isLast ? node3.childNodes.length - 1 : 0;
      node3 = getEditableChild(node3, i, isLast ? "backward" : "forward");
    }
    offset = isLast && node3.textContent != null ? node3.textContent.length : 0;
  }
  return [node3, offset];
};
var hasShadowRoot = (node3) => {
  var parent3 = node3 && node3.parentNode;
  while (parent3) {
    if (parent3.toString() === "[object ShadowRoot]") {
      return true;
    }
    parent3 = parent3.parentNode;
  }
  return false;
};
var getEditableChildAndIndex = (parent3, index, direction2) => {
  var {
    childNodes
  } = parent3;
  var child = childNodes[index];
  var i = index;
  var triedForward = false;
  var triedBackward = false;
  while (isDOMComment(child) || isDOMElement(child) && child.childNodes.length === 0 || isDOMElement(child) && child.getAttribute("contenteditable") === "false") {
    if (triedForward && triedBackward) {
      break;
    }
    if (i >= childNodes.length) {
      triedForward = true;
      i = index - 1;
      direction2 = "backward";
      continue;
    }
    if (i < 0) {
      triedBackward = true;
      i = index + 1;
      direction2 = "forward";
      continue;
    }
    child = childNodes[i];
    index = i;
    i += direction2 === "forward" ? 1 : -1;
  }
  return [child, index];
};
var getEditableChild = (parent3, index, direction2) => {
  var [child] = getEditableChildAndIndex(parent3, index, direction2);
  return child;
};
var getPlainText = (domNode) => {
  var text = "";
  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue;
  }
  if (isDOMElement(domNode)) {
    for (var childNode of Array.from(domNode.childNodes)) {
      text += getPlainText(childNode);
    }
    var display = getComputedStyle(domNode).getPropertyValue("display");
    if (display === "block" || display === "list" || domNode.tagName === "BR") {
      text += "\n";
    }
  }
  return text;
};
var catchSlateFragment = /data-slate-fragment="(.+?)"/m;
var getSlateFragmentAttribute = (dataTransfer) => {
  var htmlData = dataTransfer.getData("text/html");
  var [, fragment2] = htmlData.match(catchSlateFragment) || [];
  return fragment2;
};
var isTrackedMutation = (editor, mutation, batch) => {
  var {
    target
  } = mutation;
  if (isDOMElement(target) && target.matches('[contentEditable="false"]')) {
    return false;
  }
  var {
    document: document2
  } = ReactEditor.getWindow(editor);
  if (document2.contains(target)) {
    return ReactEditor.hasDOMNode(editor, target, {
      editable: true
    });
  }
  var parentMutation = batch.find((_ref) => {
    var {
      addedNodes,
      removedNodes
    } = _ref;
    for (var node3 of addedNodes) {
      if (node3 === target || node3.contains(target)) {
        return true;
      }
    }
    for (var _node of removedNodes) {
      if (_node === target || _node.contains(target)) {
        return true;
      }
    }
  });
  if (!parentMutation || parentMutation === mutation) {
    return false;
  }
  return isTrackedMutation(editor, parentMutation, batch);
};
var n = 0;
class Key {
  constructor() {
    _defineProperty(this, "id", void 0);
    this.id = "".concat(n++);
  }
}
var ReactEditor = {
  androidPendingDiffs: (editor) => EDITOR_TO_PENDING_DIFFS.get(editor),
  androidScheduleFlush: (editor) => {
    var _EDITOR_TO_SCHEDULE_F;
    (_EDITOR_TO_SCHEDULE_F = EDITOR_TO_SCHEDULE_FLUSH.get(editor)) === null || _EDITOR_TO_SCHEDULE_F === void 0 || _EDITOR_TO_SCHEDULE_F();
  },
  blur: (editor) => {
    var el2 = ReactEditor.toDOMNode(editor, editor);
    var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
    IS_FOCUSED.set(editor, false);
    if (root2.activeElement === el2) {
      el2.blur();
    }
  },
  deselect: (editor) => {
    var {
      selection
    } = editor;
    var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
    var domSelection = root2.getSelection();
    if (domSelection && domSelection.rangeCount > 0) {
      domSelection.removeAllRanges();
    }
    if (selection) {
      Transforms.deselect(editor);
    }
  },
  findDocumentOrShadowRoot: (editor) => {
    var el2 = ReactEditor.toDOMNode(editor, editor);
    var root2 = el2.getRootNode();
    if ((root2 instanceof Document || root2 instanceof ShadowRoot) && root2.getSelection != null) {
      return root2;
    }
    return el2.ownerDocument;
  },
  findEventRange: (editor, event) => {
    if ("nativeEvent" in event) {
      event = event.nativeEvent;
    }
    var {
      clientX: x2,
      clientY: y2,
      target
    } = event;
    if (x2 == null || y2 == null) {
      throw new Error("Cannot resolve a Slate range from a DOM event: ".concat(event));
    }
    var node3 = ReactEditor.toSlateNode(editor, event.target);
    var path3 = ReactEditor.findPath(editor, node3);
    if (Element$2.isElement(node3) && Editor.isVoid(editor, node3)) {
      var rect = target.getBoundingClientRect();
      var isPrev = editor.isInline(node3) ? x2 - rect.left < rect.left + rect.width - x2 : y2 - rect.top < rect.top + rect.height - y2;
      var edge = Editor.point(editor, path3, {
        edge: isPrev ? "start" : "end"
      });
      var point3 = isPrev ? Editor.before(editor, edge) : Editor.after(editor, edge);
      if (point3) {
        var _range = Editor.range(editor, point3);
        return _range;
      }
    }
    var domRange;
    var {
      document: document2
    } = ReactEditor.getWindow(editor);
    if (document2.caretRangeFromPoint) {
      domRange = document2.caretRangeFromPoint(x2, y2);
    } else {
      var position = document2.caretPositionFromPoint(x2, y2);
      if (position) {
        domRange = document2.createRange();
        domRange.setStart(position.offsetNode, position.offset);
        domRange.setEnd(position.offsetNode, position.offset);
      }
    }
    if (!domRange) {
      throw new Error("Cannot resolve a Slate range from a DOM event: ".concat(event));
    }
    var range2 = ReactEditor.toSlateRange(editor, domRange, {
      exactMatch: false,
      suppressThrow: false
    });
    return range2;
  },
  findKey: (editor, node3) => {
    var key = NODE_TO_KEY.get(node3);
    if (!key) {
      key = new Key();
      NODE_TO_KEY.set(node3, key);
    }
    return key;
  },
  findPath: (editor, node3) => {
    var path3 = [];
    var child = node3;
    while (true) {
      var parent3 = NODE_TO_PARENT.get(child);
      if (parent3 == null) {
        if (Editor.isEditor(child)) {
          return path3;
        } else {
          break;
        }
      }
      var i = NODE_TO_INDEX.get(child);
      if (i == null) {
        break;
      }
      path3.unshift(i);
      child = parent3;
    }
    throw new Error("Unable to find the path for Slate node: ".concat(Scrubber.stringify(node3)));
  },
  focus: function focus(editor) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      retries: 5
    };
    if (IS_FOCUSED.get(editor)) {
      return;
    }
    if (options.retries <= 0) {
      throw new Error("Could not set focus, editor seems stuck with pending operations");
    }
    if (editor.operations.length > 0) {
      setTimeout(() => {
        ReactEditor.focus(editor, {
          retries: options.retries - 1
        });
      }, 10);
      return;
    }
    var el2 = ReactEditor.toDOMNode(editor, editor);
    var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
    if (root2.activeElement !== el2) {
      if (editor.selection && root2 instanceof Document) {
        var domSelection = root2.getSelection();
        var domRange = ReactEditor.toDOMRange(editor, editor.selection);
        domSelection === null || domSelection === void 0 || domSelection.removeAllRanges();
        domSelection === null || domSelection === void 0 || domSelection.addRange(domRange);
      }
      if (!editor.selection) {
        Transforms.select(editor, Editor.start(editor, []));
        editor.onChange();
      }
      IS_FOCUSED.set(editor, true);
      el2.focus({
        preventScroll: true
      });
    }
  },
  getWindow: (editor) => {
    var window2 = EDITOR_TO_WINDOW.get(editor);
    if (!window2) {
      throw new Error("Unable to find a host window element for this editor");
    }
    return window2;
  },
  hasDOMNode: function hasDOMNode(editor, target) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var {
      editable = false
    } = options;
    var editorEl = ReactEditor.toDOMNode(editor, editor);
    var targetEl;
    try {
      targetEl = isDOMElement(target) ? target : target.parentElement;
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Permission denied to access property "nodeType"')) {
        throw err;
      }
    }
    if (!targetEl) {
      return false;
    }
    return targetEl.closest("[data-slate-editor]") === editorEl && (!editable || targetEl.isContentEditable ? true : typeof targetEl.isContentEditable === "boolean" && // isContentEditable exists only on HTMLElement, and on other nodes it will be undefined
    // this is the core logic that lets you know you got the right editor.selection instead of null when editor is contenteditable="false"(readOnly)
    targetEl.closest('[contenteditable="false"]') === editorEl || !!targetEl.getAttribute("data-slate-zero-width"));
  },
  hasEditableTarget: (editor, target) => isDOMNode(target) && ReactEditor.hasDOMNode(editor, target, {
    editable: true
  }),
  hasRange: (editor, range2) => {
    var {
      anchor,
      focus: focus2
    } = range2;
    return Editor.hasPath(editor, anchor.path) && Editor.hasPath(editor, focus2.path);
  },
  hasSelectableTarget: (editor, target) => ReactEditor.hasEditableTarget(editor, target) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, target),
  hasTarget: (editor, target) => isDOMNode(target) && ReactEditor.hasDOMNode(editor, target),
  insertData: (editor, data) => {
    editor.insertData(data);
  },
  insertFragmentData: (editor, data) => editor.insertFragmentData(data),
  insertTextData: (editor, data) => editor.insertTextData(data),
  isComposing: (editor) => {
    return !!IS_COMPOSING.get(editor);
  },
  isFocused: (editor) => !!IS_FOCUSED.get(editor),
  isReadOnly: (editor) => !!IS_READ_ONLY.get(editor),
  isTargetInsideNonReadonlyVoid: (editor, target) => {
    if (IS_READ_ONLY.get(editor)) return false;
    var slateNode = ReactEditor.hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target);
    return Element$2.isElement(slateNode) && Editor.isVoid(editor, slateNode);
  },
  setFragmentData: (editor, data, originEvent) => editor.setFragmentData(data, originEvent),
  toDOMNode: (editor, node3) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    var domNode = Editor.isEditor(node3) ? EDITOR_TO_ELEMENT.get(editor) : KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 ? void 0 : KEY_TO_ELEMENT.get(ReactEditor.findKey(editor, node3));
    if (!domNode) {
      throw new Error("Cannot resolve a DOM node from Slate node: ".concat(Scrubber.stringify(node3)));
    }
    return domNode;
  },
  toDOMPoint: (editor, point3) => {
    var [node3] = Editor.node(editor, point3.path);
    var el2 = ReactEditor.toDOMNode(editor, node3);
    var domPoint;
    if (Editor.void(editor, {
      at: point3
    })) {
      point3 = {
        path: point3.path,
        offset: 0
      };
    }
    var selector = "[data-slate-string], [data-slate-zero-width]";
    var texts = Array.from(el2.querySelectorAll(selector));
    var start2 = 0;
    for (var i = 0; i < texts.length; i++) {
      var text = texts[i];
      var domNode = text.childNodes[0];
      if (domNode == null || domNode.textContent == null) {
        continue;
      }
      var {
        length
      } = domNode.textContent;
      var attr = text.getAttribute("data-slate-length");
      var trueLength = attr == null ? length : parseInt(attr, 10);
      var end2 = start2 + trueLength;
      var nextText = texts[i + 1];
      if (point3.offset === end2 && nextText !== null && nextText !== void 0 && nextText.hasAttribute("data-slate-mark-placeholder")) {
        var _nextText$textContent;
        var domText = nextText.childNodes[0];
        domPoint = [
          // COMPAT: If we don't explicity set the dom point to be on the actual
          // dom text element, chrome will put the selection behind the actual dom
          // text element, causing domRange.getBoundingClientRect() calls on a collapsed
          // selection to return incorrect zero values (https://bugs.chromium.org/p/chromium/issues/detail?id=435438)
          // which will cause issues when scrolling to it.
          domText instanceof DOMText ? domText : nextText,
          (_nextText$textContent = nextText.textContent) !== null && _nextText$textContent !== void 0 && _nextText$textContent.startsWith("\uFEFF") ? 1 : 0
        ];
        break;
      }
      if (point3.offset <= end2) {
        var offset = Math.min(length, Math.max(0, point3.offset - start2));
        domPoint = [domNode, offset];
        break;
      }
      start2 = end2;
    }
    if (!domPoint) {
      throw new Error("Cannot resolve a DOM point from Slate point: ".concat(Scrubber.stringify(point3)));
    }
    return domPoint;
  },
  toDOMRange: (editor, range2) => {
    var {
      anchor,
      focus: focus2
    } = range2;
    var isBackward = Range.isBackward(range2);
    var domAnchor = ReactEditor.toDOMPoint(editor, anchor);
    var domFocus = Range.isCollapsed(range2) ? domAnchor : ReactEditor.toDOMPoint(editor, focus2);
    var window2 = ReactEditor.getWindow(editor);
    var domRange = window2.document.createRange();
    var [startNode, startOffset] = isBackward ? domFocus : domAnchor;
    var [endNode, endOffset] = isBackward ? domAnchor : domFocus;
    var startEl = isDOMElement(startNode) ? startNode : startNode.parentElement;
    var isStartAtZeroWidth = !!startEl.getAttribute("data-slate-zero-width");
    var endEl = isDOMElement(endNode) ? endNode : endNode.parentElement;
    var isEndAtZeroWidth = !!endEl.getAttribute("data-slate-zero-width");
    domRange.setStart(startNode, isStartAtZeroWidth ? 1 : startOffset);
    domRange.setEnd(endNode, isEndAtZeroWidth ? 1 : endOffset);
    return domRange;
  },
  toSlateNode: (editor, domNode) => {
    var domEl = isDOMElement(domNode) ? domNode : domNode.parentElement;
    if (domEl && !domEl.hasAttribute("data-slate-node")) {
      domEl = domEl.closest("[data-slate-node]");
    }
    var node3 = domEl ? ELEMENT_TO_NODE.get(domEl) : null;
    if (!node3) {
      throw new Error("Cannot resolve a Slate node from DOM node: ".concat(domEl));
    }
    return node3;
  },
  toSlatePoint: (editor, domPoint, options) => {
    var {
      exactMatch,
      suppressThrow
    } = options;
    var [nearestNode, nearestOffset] = exactMatch ? domPoint : normalizeDOMPoint(domPoint);
    var parentNode = nearestNode.parentNode;
    var textNode = null;
    var offset = 0;
    if (parentNode) {
      var _domNode$textContent, _domNode$textContent2;
      var editorEl = ReactEditor.toDOMNode(editor, editor);
      var potentialVoidNode = parentNode.closest('[data-slate-void="true"]');
      var voidNode = potentialVoidNode && editorEl.contains(potentialVoidNode) ? potentialVoidNode : null;
      var leafNode = parentNode.closest("[data-slate-leaf]");
      var domNode = null;
      if (leafNode) {
        textNode = leafNode.closest('[data-slate-node="text"]');
        if (textNode) {
          var window2 = ReactEditor.getWindow(editor);
          var range2 = window2.document.createRange();
          range2.setStart(textNode, 0);
          range2.setEnd(nearestNode, nearestOffset);
          var contents = range2.cloneContents();
          var removals = [...Array.prototype.slice.call(contents.querySelectorAll("[data-slate-zero-width]")), ...Array.prototype.slice.call(contents.querySelectorAll("[contenteditable=false]"))];
          removals.forEach((el2) => {
            if (IS_ANDROID && !exactMatch && el2.hasAttribute("data-slate-zero-width") && el2.textContent.length > 0 && el2.textContext !== "\uFEFF") {
              if (el2.textContent.startsWith("\uFEFF")) {
                el2.textContent = el2.textContent.slice(1);
              }
              return;
            }
            el2.parentNode.removeChild(el2);
          });
          offset = contents.textContent.length;
          domNode = textNode;
        }
      } else if (voidNode) {
        var leafNodes = voidNode.querySelectorAll("[data-slate-leaf]");
        for (var index = 0; index < leafNodes.length; index++) {
          var current2 = leafNodes[index];
          if (ReactEditor.hasDOMNode(editor, current2)) {
            leafNode = current2;
            break;
          }
        }
        if (!leafNode) {
          offset = 1;
        } else {
          textNode = leafNode.closest('[data-slate-node="text"]');
          domNode = leafNode;
          offset = domNode.textContent.length;
          domNode.querySelectorAll("[data-slate-zero-width]").forEach((el2) => {
            offset -= el2.textContent.length;
          });
        }
      }
      if (domNode && offset === domNode.textContent.length && // COMPAT: Android IMEs might remove the zero width space while composing,
      // and we don't add it for line-breaks.
      IS_ANDROID && domNode.getAttribute("data-slate-zero-width") === "z" && (_domNode$textContent = domNode.textContent) !== null && _domNode$textContent !== void 0 && _domNode$textContent.startsWith("\uFEFF") && // COMPAT: If the parent node is a Slate zero-width space, editor is
      // because the text node should have no characters. However, during IME
      // composition the ASCII characters will be prepended to the zero-width
      // space, so subtract 1 from the offset to account for the zero-width
      // space character.
      (parentNode.hasAttribute("data-slate-zero-width") || // COMPAT: In Firefox, `range.cloneContents()` returns an extra trailing '\n'
      // when the document ends with a new-line character. This results in the offset
      // length being off by one, so we need to subtract one to account for this.
      IS_FIREFOX && (_domNode$textContent2 = domNode.textContent) !== null && _domNode$textContent2 !== void 0 && _domNode$textContent2.endsWith("\n\n"))) {
        offset--;
      }
    }
    if (IS_ANDROID && !textNode && !exactMatch) {
      var node3 = parentNode.hasAttribute("data-slate-node") ? parentNode : parentNode.closest("[data-slate-node]");
      if (node3 && ReactEditor.hasDOMNode(editor, node3, {
        editable: true
      })) {
        var _slateNode = ReactEditor.toSlateNode(editor, node3);
        var {
          path: _path,
          offset: _offset
        } = Editor.start(editor, ReactEditor.findPath(editor, _slateNode));
        if (!node3.querySelector("[data-slate-leaf]")) {
          _offset = nearestOffset;
        }
        return {
          path: _path,
          offset: _offset
        };
      }
    }
    if (!textNode) {
      if (suppressThrow) {
        return null;
      }
      throw new Error("Cannot resolve a Slate point from DOM point: ".concat(domPoint));
    }
    var slateNode = ReactEditor.toSlateNode(editor, textNode);
    var path3 = ReactEditor.findPath(editor, slateNode);
    return {
      path: path3,
      offset
    };
  },
  toSlateRange: (editor, domRange, options) => {
    var _focusNode$textConten;
    var {
      exactMatch,
      suppressThrow
    } = options;
    var el2 = isDOMSelection(domRange) ? domRange.anchorNode : domRange.startContainer;
    var anchorNode;
    var anchorOffset;
    var focusNode;
    var focusOffset;
    var isCollapsed;
    if (el2) {
      if (isDOMSelection(domRange)) {
        if (IS_FIREFOX && domRange.rangeCount > 1) {
          focusNode = domRange.focusNode;
          var firstRange = domRange.getRangeAt(0);
          var lastRange = domRange.getRangeAt(domRange.rangeCount - 1);
          if (focusNode instanceof HTMLTableRowElement && firstRange.startContainer instanceof HTMLTableRowElement && lastRange.startContainer instanceof HTMLTableRowElement) {
            let getLastChildren2 = function(element) {
              if (element.childElementCount > 0) {
                return getLastChildren2(element.children[0]);
              } else {
                return element;
              }
            };
            var getLastChildren = getLastChildren2;
            var firstNodeRow = firstRange.startContainer;
            var lastNodeRow = lastRange.startContainer;
            var firstNode = getLastChildren2(firstNodeRow.children[firstRange.startOffset]);
            var lastNode = getLastChildren2(lastNodeRow.children[lastRange.startOffset]);
            focusOffset = 0;
            if (lastNode.childNodes.length > 0) {
              anchorNode = lastNode.childNodes[0];
            } else {
              anchorNode = lastNode;
            }
            if (firstNode.childNodes.length > 0) {
              focusNode = firstNode.childNodes[0];
            } else {
              focusNode = firstNode;
            }
            if (lastNode instanceof HTMLElement) {
              anchorOffset = lastNode.innerHTML.length;
            } else {
              anchorOffset = 0;
            }
          } else {
            if (firstRange.startContainer === focusNode) {
              anchorNode = lastRange.endContainer;
              anchorOffset = lastRange.endOffset;
              focusOffset = firstRange.startOffset;
            } else {
              anchorNode = firstRange.startContainer;
              anchorOffset = firstRange.endOffset;
              focusOffset = lastRange.startOffset;
            }
          }
        } else {
          anchorNode = domRange.anchorNode;
          anchorOffset = domRange.anchorOffset;
          focusNode = domRange.focusNode;
          focusOffset = domRange.focusOffset;
        }
        if (IS_CHROME && hasShadowRoot(anchorNode) || IS_FIREFOX) {
          isCollapsed = domRange.anchorNode === domRange.focusNode && domRange.anchorOffset === domRange.focusOffset;
        } else {
          isCollapsed = domRange.isCollapsed;
        }
      } else {
        anchorNode = domRange.startContainer;
        anchorOffset = domRange.startOffset;
        focusNode = domRange.endContainer;
        focusOffset = domRange.endOffset;
        isCollapsed = domRange.collapsed;
      }
    }
    if (anchorNode == null || focusNode == null || anchorOffset == null || focusOffset == null) {
      throw new Error("Cannot resolve a Slate range from DOM range: ".concat(domRange));
    }
    if (IS_FIREFOX && (_focusNode$textConten = focusNode.textContent) !== null && _focusNode$textConten !== void 0 && _focusNode$textConten.endsWith("\n\n") && focusOffset === focusNode.textContent.length) {
      focusOffset--;
    }
    if ("getAttribute" in focusNode && focusNode.getAttribute("contenteditable") === "false" && focusNode.getAttribute("data-slate-void") !== "true") {
      var _anchorNode$textConte;
      focusNode = anchorNode;
      focusOffset = ((_anchorNode$textConte = anchorNode.textContent) === null || _anchorNode$textConte === void 0 ? void 0 : _anchorNode$textConte.length) || 0;
    }
    var anchor = ReactEditor.toSlatePoint(editor, [anchorNode, anchorOffset], {
      exactMatch,
      suppressThrow
    });
    if (!anchor) {
      return null;
    }
    var focus2 = isCollapsed ? anchor : ReactEditor.toSlatePoint(editor, [focusNode, focusOffset], {
      exactMatch,
      suppressThrow
    });
    if (!focus2) {
      return null;
    }
    var range2 = {
      anchor,
      focus: focus2
    };
    if (Range.isExpanded(range2) && Range.isForward(range2) && isDOMElement(focusNode) && Editor.void(editor, {
      at: range2.focus,
      mode: "highest"
    })) {
      range2 = Editor.unhangRange(editor, range2, {
        voids: true
      });
    }
    return range2;
  }
};
function verifyDiffState(editor, textDiff) {
  var {
    path: path3,
    diff
  } = textDiff;
  if (!Editor.hasPath(editor, path3)) {
    return false;
  }
  var node3 = Node.get(editor, path3);
  if (!Text$1.isText(node3)) {
    return false;
  }
  if (diff.start !== node3.text.length || diff.text.length === 0) {
    return node3.text.slice(diff.start, diff.start + diff.text.length) === diff.text;
  }
  var nextPath = Path.next(path3);
  if (!Editor.hasPath(editor, nextPath)) {
    return false;
  }
  var nextNode = Node.get(editor, nextPath);
  return Text$1.isText(nextNode) && nextNode.text.startsWith(diff.text);
}
function applyStringDiff(text) {
  for (var _len = arguments.length, diffs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    diffs[_key - 1] = arguments[_key];
  }
  return diffs.reduce((text2, diff) => text2.slice(0, diff.start) + diff.text + text2.slice(diff.end), text);
}
function longestCommonPrefixLength(str, another) {
  var length = Math.min(str.length, another.length);
  for (var i = 0; i < length; i++) {
    if (str.charAt(i) !== another.charAt(i)) {
      return i;
    }
  }
  return length;
}
function longestCommonSuffixLength(str, another, max) {
  var length = Math.min(str.length, another.length, max);
  for (var i = 0; i < length; i++) {
    if (str.charAt(str.length - i - 1) !== another.charAt(another.length - i - 1)) {
      return i;
    }
  }
  return length;
}
function normalizeStringDiff(targetText, diff) {
  var {
    start: start2,
    end: end2,
    text
  } = diff;
  var removedText = targetText.slice(start2, end2);
  var prefixLength = longestCommonPrefixLength(removedText, text);
  var max = Math.min(removedText.length - prefixLength, text.length - prefixLength);
  var suffixLength = longestCommonSuffixLength(removedText, text, max);
  var normalized = {
    start: start2 + prefixLength,
    end: end2 - suffixLength,
    text: text.slice(prefixLength, text.length - suffixLength)
  };
  if (normalized.start === normalized.end && normalized.text.length === 0) {
    return null;
  }
  return normalized;
}
function mergeStringDiffs(targetText, a, b) {
  var start2 = Math.min(a.start, b.start);
  var overlap = Math.max(0, Math.min(a.start + a.text.length, b.end) - b.start);
  var applied = applyStringDiff(targetText, a, b);
  var sliceEnd = Math.max(b.start + b.text.length, a.start + a.text.length + (a.start + a.text.length > b.start ? b.text.length : 0) - overlap);
  var text = applied.slice(start2, sliceEnd);
  var end2 = Math.max(a.end, b.end - a.text.length + (a.end - a.start));
  return normalizeStringDiff(targetText, {
    start: start2,
    end: end2,
    text
  });
}
function targetRange(textDiff) {
  var {
    path: path3,
    diff
  } = textDiff;
  return {
    anchor: {
      path: path3,
      offset: diff.start
    },
    focus: {
      path: path3,
      offset: diff.end
    }
  };
}
function normalizePoint(editor, point3) {
  var {
    path: path3,
    offset
  } = point3;
  if (!Editor.hasPath(editor, path3)) {
    return null;
  }
  var leaf3 = Node.get(editor, path3);
  if (!Text$1.isText(leaf3)) {
    return null;
  }
  var parentBlock = Editor.above(editor, {
    match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
    at: path3
  });
  if (!parentBlock) {
    return null;
  }
  while (offset > leaf3.text.length) {
    var entry = Editor.next(editor, {
      at: path3,
      match: Text$1.isText
    });
    if (!entry || !Path.isDescendant(entry[1], parentBlock[1])) {
      return null;
    }
    offset -= leaf3.text.length;
    leaf3 = entry[0];
    path3 = entry[1];
  }
  return {
    path: path3,
    offset
  };
}
function normalizeRange(editor, range2) {
  var anchor = normalizePoint(editor, range2.anchor);
  if (!anchor) {
    return null;
  }
  if (Range.isCollapsed(range2)) {
    return {
      anchor,
      focus: anchor
    };
  }
  var focus2 = normalizePoint(editor, range2.focus);
  if (!focus2) {
    return null;
  }
  return {
    anchor,
    focus: focus2
  };
}
function transformPendingPoint(editor, point3, op) {
  var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor);
  var textDiff = pendingDiffs === null || pendingDiffs === void 0 ? void 0 : pendingDiffs.find((_ref) => {
    var {
      path: path3
    } = _ref;
    return Path.equals(path3, point3.path);
  });
  if (!textDiff || point3.offset <= textDiff.diff.start) {
    return Point.transform(point3, op, {
      affinity: "backward"
    });
  }
  var {
    diff
  } = textDiff;
  if (point3.offset <= diff.start + diff.text.length) {
    var _anchor = {
      path: point3.path,
      offset: diff.start
    };
    var _transformed = Point.transform(_anchor, op, {
      affinity: "backward"
    });
    if (!_transformed) {
      return null;
    }
    return {
      path: _transformed.path,
      offset: _transformed.offset + point3.offset - diff.start
    };
  }
  var anchor = {
    path: point3.path,
    offset: point3.offset - diff.text.length + diff.end - diff.start
  };
  var transformed = Point.transform(anchor, op, {
    affinity: "backward"
  });
  if (!transformed) {
    return null;
  }
  if (op.type === "split_node" && Path.equals(op.path, point3.path) && anchor.offset < op.position && diff.start < op.position) {
    return transformed;
  }
  return {
    path: transformed.path,
    offset: transformed.offset + diff.text.length - diff.end + diff.start
  };
}
function transformPendingRange(editor, range2, op) {
  var anchor = transformPendingPoint(editor, range2.anchor, op);
  if (!anchor) {
    return null;
  }
  if (Range.isCollapsed(range2)) {
    return {
      anchor,
      focus: anchor
    };
  }
  var focus2 = transformPendingPoint(editor, range2.focus, op);
  if (!focus2) {
    return null;
  }
  return {
    anchor,
    focus: focus2
  };
}
function transformTextDiff(textDiff, op) {
  var {
    path: path3,
    diff,
    id: id2
  } = textDiff;
  switch (op.type) {
    case "insert_text": {
      if (!Path.equals(op.path, path3) || op.offset >= diff.end) {
        return textDiff;
      }
      if (op.offset <= diff.start) {
        return {
          diff: {
            start: op.text.length + diff.start,
            end: op.text.length + diff.end,
            text: diff.text
          },
          id: id2,
          path: path3
        };
      }
      return {
        diff: {
          start: diff.start,
          end: diff.end + op.text.length,
          text: diff.text
        },
        id: id2,
        path: path3
      };
    }
    case "remove_text": {
      if (!Path.equals(op.path, path3) || op.offset >= diff.end) {
        return textDiff;
      }
      if (op.offset + op.text.length <= diff.start) {
        return {
          diff: {
            start: diff.start - op.text.length,
            end: diff.end - op.text.length,
            text: diff.text
          },
          id: id2,
          path: path3
        };
      }
      return {
        diff: {
          start: diff.start,
          end: diff.end - op.text.length,
          text: diff.text
        },
        id: id2,
        path: path3
      };
    }
    case "split_node": {
      if (!Path.equals(op.path, path3) || op.position >= diff.end) {
        return {
          diff,
          id: id2,
          path: Path.transform(path3, op, {
            affinity: "backward"
          })
        };
      }
      if (op.position > diff.start) {
        return {
          diff: {
            start: diff.start,
            end: Math.min(op.position, diff.end),
            text: diff.text
          },
          id: id2,
          path: path3
        };
      }
      return {
        diff: {
          start: diff.start - op.position,
          end: diff.end - op.position,
          text: diff.text
        },
        id: id2,
        path: Path.transform(path3, op, {
          affinity: "forward"
        })
      };
    }
    case "merge_node": {
      if (!Path.equals(op.path, path3)) {
        return {
          diff,
          id: id2,
          path: Path.transform(path3, op)
        };
      }
      return {
        diff: {
          start: diff.start + op.position,
          end: diff.end + op.position,
          text: diff.text
        },
        id: id2,
        path: Path.transform(path3, op)
      };
    }
  }
  var newPath = Path.transform(path3, op);
  if (!newPath) {
    return null;
  }
  return {
    diff,
    path: newPath,
    id: id2
  };
}
function ownKeys$6(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$6(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$6(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$6(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var RESOLVE_DELAY = 25;
var FLUSH_DELAY = 200;
var debug = function debug2() {
};
var isDataTransfer = (value) => (value === null || value === void 0 ? void 0 : value.constructor.name) === "DataTransfer";
function createAndroidInputManager(_ref) {
  var {
    editor,
    scheduleOnDOMSelectionChange,
    onDOMSelectionChange
  } = _ref;
  var flushing = false;
  var compositionEndTimeoutId = null;
  var flushTimeoutId = null;
  var actionTimeoutId = null;
  var idCounter = 0;
  var insertPositionHint = false;
  var applyPendingSelection = () => {
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(editor);
    EDITOR_TO_PENDING_SELECTION.delete(editor);
    if (pendingSelection) {
      var {
        selection
      } = editor;
      var normalized = normalizeRange(editor, pendingSelection);
      if (normalized && (!selection || !Range.equals(normalized, selection))) {
        Transforms.select(editor, normalized);
      }
    }
  };
  var performAction = () => {
    var action = EDITOR_TO_PENDING_ACTION.get(editor);
    EDITOR_TO_PENDING_ACTION.delete(editor);
    if (!action) {
      return;
    }
    if (action.at) {
      var target = Point.isPoint(action.at) ? normalizePoint(editor, action.at) : normalizeRange(editor, action.at);
      if (!target) {
        return;
      }
      var _targetRange = Editor.range(editor, target);
      if (!editor.selection || !Range.equals(editor.selection, _targetRange)) {
        Transforms.select(editor, target);
      }
    }
    action.run();
  };
  var flush = () => {
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    if (actionTimeoutId) {
      clearTimeout(actionTimeoutId);
      actionTimeoutId = null;
    }
    if (!hasPendingDiffs() && !hasPendingAction()) {
      applyPendingSelection();
      return;
    }
    if (!flushing) {
      flushing = true;
      setTimeout(() => flushing = false);
    }
    if (hasPendingAction()) {
      flushing = "action";
    }
    var selectionRef = editor.selection && Editor.rangeRef(editor, editor.selection, {
      affinity: "forward"
    });
    EDITOR_TO_USER_MARKS.set(editor, editor.marks);
    debug("flush", EDITOR_TO_PENDING_ACTION.get(editor), EDITOR_TO_PENDING_DIFFS.get(editor));
    var scheduleSelectionChange = hasPendingDiffs();
    var diff;
    while (diff = (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI === void 0 ? void 0 : _EDITOR_TO_PENDING_DI[0]) {
      var _EDITOR_TO_PENDING_DI, _EDITOR_TO_PENDING_DI2;
      var pendingMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
      if (pendingMarks !== void 0) {
        EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
        editor.marks = pendingMarks;
      }
      if (pendingMarks && insertPositionHint === false) {
        insertPositionHint = null;
      }
      var range2 = targetRange(diff);
      if (!editor.selection || !Range.equals(editor.selection, range2)) {
        Transforms.select(editor, range2);
      }
      if (diff.diff.text) {
        Editor.insertText(editor, diff.diff.text);
      } else {
        Editor.deleteFragment(editor);
      }
      EDITOR_TO_PENDING_DIFFS.set(editor, (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI2 === void 0 ? void 0 : _EDITOR_TO_PENDING_DI2.filter((_ref2) => {
        var {
          id: id2
        } = _ref2;
        return id2 !== diff.id;
      }));
      if (!verifyDiffState(editor, diff)) {
        scheduleSelectionChange = false;
        EDITOR_TO_PENDING_ACTION.delete(editor);
        EDITOR_TO_USER_MARKS.delete(editor);
        flushing = "action";
        EDITOR_TO_PENDING_SELECTION.delete(editor);
        scheduleOnDOMSelectionChange.cancel();
        onDOMSelectionChange.cancel();
        selectionRef === null || selectionRef === void 0 || selectionRef.unref();
      }
    }
    var selection = selectionRef === null || selectionRef === void 0 ? void 0 : selectionRef.unref();
    if (selection && !EDITOR_TO_PENDING_SELECTION.get(editor) && (!editor.selection || !Range.equals(selection, editor.selection))) {
      Transforms.select(editor, selection);
    }
    if (hasPendingAction()) {
      performAction();
      return;
    }
    if (scheduleSelectionChange) {
      scheduleOnDOMSelectionChange();
    }
    scheduleOnDOMSelectionChange.flush();
    onDOMSelectionChange.flush();
    applyPendingSelection();
    var userMarks = EDITOR_TO_USER_MARKS.get(editor);
    EDITOR_TO_USER_MARKS.delete(editor);
    if (userMarks !== void 0) {
      editor.marks = userMarks;
      editor.onChange();
    }
  };
  var handleCompositionEnd = (_event) => {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId);
    }
    compositionEndTimeoutId = setTimeout(() => {
      IS_COMPOSING.set(editor, false);
      flush();
    }, RESOLVE_DELAY);
  };
  var handleCompositionStart = (_event) => {
    IS_COMPOSING.set(editor, true);
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId);
      compositionEndTimeoutId = null;
    }
  };
  var updatePlaceholderVisibility = function updatePlaceholderVisibility2() {
    var forceHide = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var placeholderElement = EDITOR_TO_PLACEHOLDER_ELEMENT.get(editor);
    if (!placeholderElement) {
      return;
    }
    if (hasPendingDiffs() || forceHide) {
      placeholderElement.style.display = "none";
      return;
    }
    placeholderElement.style.removeProperty("display");
  };
  var storeDiff = (path3, diff) => {
    var _EDITOR_TO_PENDING_DI3;
    var pendingDiffs = (_EDITOR_TO_PENDING_DI3 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI3 !== void 0 ? _EDITOR_TO_PENDING_DI3 : [];
    EDITOR_TO_PENDING_DIFFS.set(editor, pendingDiffs);
    var target = Node.leaf(editor, path3);
    var idx = pendingDiffs.findIndex((change) => Path.equals(change.path, path3));
    if (idx < 0) {
      var normalized = normalizeStringDiff(target.text, diff);
      if (normalized) {
        pendingDiffs.push({
          path: path3,
          diff,
          id: idCounter++
        });
      }
      updatePlaceholderVisibility();
      return;
    }
    var merged = mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff);
    if (!merged) {
      pendingDiffs.splice(idx, 1);
      updatePlaceholderVisibility();
      return;
    }
    pendingDiffs[idx] = _objectSpread$6(_objectSpread$6({}, pendingDiffs[idx]), {}, {
      diff: merged
    });
  };
  var scheduleAction = function scheduleAction2(run) {
    var {
      at
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    insertPositionHint = false;
    EDITOR_TO_PENDING_SELECTION.delete(editor);
    scheduleOnDOMSelectionChange.cancel();
    onDOMSelectionChange.cancel();
    if (hasPendingAction()) {
      flush();
    }
    EDITOR_TO_PENDING_ACTION.set(editor, {
      at,
      run
    });
    actionTimeoutId = setTimeout(flush);
  };
  var handleDOMBeforeInput = (event) => {
    var _targetRange2;
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    var {
      inputType: type
    } = event;
    var targetRange2 = null;
    var data = event.dataTransfer || event.data || void 0;
    if (insertPositionHint !== false && type !== "insertText" && type !== "insertCompositionText") {
      insertPositionHint = false;
    }
    var [nativeTargetRange] = event.getTargetRanges();
    if (nativeTargetRange) {
      targetRange2 = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true
      });
    }
    var window2 = ReactEditor.getWindow(editor);
    var domSelection = window2.getSelection();
    if (!targetRange2 && domSelection) {
      nativeTargetRange = domSelection;
      targetRange2 = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: true
      });
    }
    targetRange2 = (_targetRange2 = targetRange2) !== null && _targetRange2 !== void 0 ? _targetRange2 : editor.selection;
    if (!targetRange2) {
      return;
    }
    var canStoreDiff = true;
    if (type.startsWith("delete")) {
      if (Range.isExpanded(targetRange2)) {
        var [_start, _end] = Range.edges(targetRange2);
        var _leaf = Node.leaf(editor, _start.path);
        if (_leaf.text.length === _start.offset && _end.offset === 0) {
          var next3 = Editor.next(editor, {
            at: _start.path,
            match: Text$1.isText
          });
          if (next3 && Path.equals(next3[1], _end.path)) {
            targetRange2 = {
              anchor: _end,
              focus: _end
            };
          }
        }
      }
      var direction2 = type.endsWith("Backward") ? "backward" : "forward";
      var [start2, end2] = Range.edges(targetRange2);
      var [leaf3, path3] = Editor.leaf(editor, start2.path);
      var diff = {
        text: "",
        start: start2.offset,
        end: end2.offset
      };
      var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor);
      var relevantPendingDiffs = pendingDiffs === null || pendingDiffs === void 0 ? void 0 : pendingDiffs.find((change) => Path.equals(change.path, path3));
      var diffs = relevantPendingDiffs ? [relevantPendingDiffs.diff, diff] : [diff];
      var text = applyStringDiff(leaf3.text, ...diffs);
      if (text.length === 0) {
        canStoreDiff = false;
      }
      if (Range.isExpanded(targetRange2)) {
        if (canStoreDiff && Path.equals(targetRange2.anchor.path, targetRange2.focus.path)) {
          var point3 = {
            path: targetRange2.anchor.path,
            offset: start2.offset
          };
          var range2 = Editor.range(editor, point3, point3);
          handleUserSelect(range2);
          return storeDiff(targetRange2.anchor.path, {
            text: "",
            end: end2.offset,
            start: start2.offset
          });
        }
        return scheduleAction(() => Editor.deleteFragment(editor, {
          direction: direction2
        }), {
          at: targetRange2
        });
      }
    }
    switch (type) {
      case "deleteByComposition":
      case "deleteByCut":
      case "deleteByDrag": {
        return scheduleAction(() => Editor.deleteFragment(editor), {
          at: targetRange2
        });
      }
      case "deleteContent":
      case "deleteContentForward": {
        var {
          anchor
        } = targetRange2;
        if (canStoreDiff && Range.isCollapsed(targetRange2)) {
          var targetNode = Node.leaf(editor, anchor.path);
          if (anchor.offset < targetNode.text.length) {
            return storeDiff(anchor.path, {
              text: "",
              start: anchor.offset,
              end: anchor.offset + 1
            });
          }
        }
        return scheduleAction(() => Editor.deleteForward(editor), {
          at: targetRange2
        });
      }
      case "deleteContentBackward": {
        var _nativeTargetRange;
        var {
          anchor: _anchor
        } = targetRange2;
        var nativeCollapsed = isDOMSelection(nativeTargetRange) ? nativeTargetRange.isCollapsed : !!((_nativeTargetRange = nativeTargetRange) !== null && _nativeTargetRange !== void 0 && _nativeTargetRange.collapsed);
        if (canStoreDiff && nativeCollapsed && Range.isCollapsed(targetRange2) && _anchor.offset > 0) {
          return storeDiff(_anchor.path, {
            text: "",
            start: _anchor.offset - 1,
            end: _anchor.offset
          });
        }
        return scheduleAction(() => Editor.deleteBackward(editor), {
          at: targetRange2
        });
      }
      case "deleteEntireSoftLine": {
        return scheduleAction(() => {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          Editor.deleteForward(editor, {
            unit: "line"
          });
        }, {
          at: targetRange2
        });
      }
      case "deleteHardLineBackward": {
        return scheduleAction(() => Editor.deleteBackward(editor, {
          unit: "block"
        }), {
          at: targetRange2
        });
      }
      case "deleteSoftLineBackward": {
        return scheduleAction(() => Editor.deleteBackward(editor, {
          unit: "line"
        }), {
          at: targetRange2
        });
      }
      case "deleteHardLineForward": {
        return scheduleAction(() => Editor.deleteForward(editor, {
          unit: "block"
        }), {
          at: targetRange2
        });
      }
      case "deleteSoftLineForward": {
        return scheduleAction(() => Editor.deleteForward(editor, {
          unit: "line"
        }), {
          at: targetRange2
        });
      }
      case "deleteWordBackward": {
        return scheduleAction(() => Editor.deleteBackward(editor, {
          unit: "word"
        }), {
          at: targetRange2
        });
      }
      case "deleteWordForward": {
        return scheduleAction(() => Editor.deleteForward(editor, {
          unit: "word"
        }), {
          at: targetRange2
        });
      }
      case "insertLineBreak": {
        return scheduleAction(() => Editor.insertSoftBreak(editor), {
          at: targetRange2
        });
      }
      case "insertParagraph": {
        return scheduleAction(() => Editor.insertBreak(editor), {
          at: targetRange2
        });
      }
      case "insertCompositionText":
      case "deleteCompositionText":
      case "insertFromComposition":
      case "insertFromDrop":
      case "insertFromPaste":
      case "insertFromYank":
      case "insertReplacementText":
      case "insertText": {
        if (isDataTransfer(data)) {
          return scheduleAction(() => ReactEditor.insertData(editor, data), {
            at: targetRange2
          });
        }
        var _text = data !== null && data !== void 0 ? data : "";
        if (EDITOR_TO_PENDING_INSERTION_MARKS.get(editor)) {
          _text = _text.replace("\uFEFF", "");
        }
        if (type === "insertText" && /.*\n.*\n$/.test(_text)) {
          _text = _text.slice(0, -1);
        }
        if (_text.includes("\n")) {
          return scheduleAction(() => {
            var parts = _text.split("\n");
            parts.forEach((line, i) => {
              if (line) {
                Editor.insertText(editor, line);
              }
              if (i !== parts.length - 1) {
                Editor.insertSoftBreak(editor);
              }
            });
          }, {
            at: targetRange2
          });
        }
        if (Path.equals(targetRange2.anchor.path, targetRange2.focus.path)) {
          var [_start2, _end2] = Range.edges(targetRange2);
          var _diff = {
            start: _start2.offset,
            end: _end2.offset,
            text: _text
          };
          if (_text && insertPositionHint && type === "insertCompositionText") {
            var hintPosition = insertPositionHint.start + insertPositionHint.text.search(/\S|$/);
            var diffPosition = _diff.start + _diff.text.search(/\S|$/);
            if (diffPosition === hintPosition + 1 && _diff.end === insertPositionHint.start + insertPositionHint.text.length) {
              _diff.start -= 1;
              insertPositionHint = null;
              scheduleFlush();
            } else {
              insertPositionHint = false;
            }
          } else if (type === "insertText") {
            if (insertPositionHint === null) {
              insertPositionHint = _diff;
            } else if (insertPositionHint && Range.isCollapsed(targetRange2) && insertPositionHint.end + insertPositionHint.text.length === _start2.offset) {
              insertPositionHint = _objectSpread$6(_objectSpread$6({}, insertPositionHint), {}, {
                text: insertPositionHint.text + _text
              });
            } else {
              insertPositionHint = false;
            }
          } else {
            insertPositionHint = false;
          }
          if (canStoreDiff) {
            storeDiff(_start2.path, _diff);
            return;
          }
        }
        return scheduleAction(() => Editor.insertText(editor, _text), {
          at: targetRange2
        });
      }
    }
  };
  var hasPendingAction = () => {
    return !!EDITOR_TO_PENDING_ACTION.get(editor);
  };
  var hasPendingDiffs = () => {
    var _EDITOR_TO_PENDING_DI4;
    return !!((_EDITOR_TO_PENDING_DI4 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI4 !== void 0 && _EDITOR_TO_PENDING_DI4.length);
  };
  var hasPendingChanges = () => {
    return hasPendingAction() || hasPendingDiffs();
  };
  var isFlushing = () => {
    return flushing;
  };
  var handleUserSelect = (range2) => {
    EDITOR_TO_PENDING_SELECTION.set(editor, range2);
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    var {
      selection
    } = editor;
    if (!range2) {
      return;
    }
    var pathChanged = !selection || !Path.equals(selection.anchor.path, range2.anchor.path);
    var parentPathChanged = !selection || !Path.equals(selection.anchor.path.slice(0, -1), range2.anchor.path.slice(0, -1));
    if (pathChanged && insertPositionHint || parentPathChanged) {
      insertPositionHint = false;
    }
    if (pathChanged || hasPendingDiffs()) {
      flushTimeoutId = setTimeout(flush, FLUSH_DELAY);
    }
  };
  var handleInput = () => {
    if (hasPendingAction() || !hasPendingDiffs()) {
      flush();
    }
  };
  var handleKeyDown = (_) => {
    if (!hasPendingDiffs()) {
      updatePlaceholderVisibility(true);
      setTimeout(updatePlaceholderVisibility);
    }
  };
  var scheduleFlush = () => {
    if (!hasPendingAction()) {
      actionTimeoutId = setTimeout(flush);
    }
  };
  var handleDomMutations = (mutations) => {
    if (hasPendingDiffs() || hasPendingAction()) {
      return;
    }
    if (mutations.some((mutation) => isTrackedMutation(editor, mutation, mutations))) {
      var _EDITOR_TO_FORCE_REND;
      (_EDITOR_TO_FORCE_REND = EDITOR_TO_FORCE_RENDER.get(editor)) === null || _EDITOR_TO_FORCE_REND === void 0 || _EDITOR_TO_FORCE_REND();
    }
  };
  return {
    flush,
    scheduleFlush,
    hasPendingDiffs,
    hasPendingAction,
    hasPendingChanges,
    isFlushing,
    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,
    handleKeyDown,
    handleDomMutations,
    handleInput
  };
}
function useIsMounted() {
  var isMountedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef.current;
}
var useIsomorphicLayoutEffect = CAN_USE_DOM ? reactExports.useLayoutEffect : reactExports.useEffect;
function useMutationObserver(node3, callback, options) {
  var [mutationObserver] = reactExports.useState(() => new MutationObserver(callback));
  useIsomorphicLayoutEffect(() => {
    mutationObserver.takeRecords();
  });
  reactExports.useEffect(() => {
    if (!node3.current) {
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    }
    mutationObserver.observe(node3.current, options);
    return () => mutationObserver.disconnect();
  }, [mutationObserver, node3, options]);
}
var _excluded$3 = ["node"];
function ownKeys$5(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$5(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$5(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$5(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var MUTATION_OBSERVER_CONFIG$1 = {
  subtree: true,
  childList: true,
  characterData: true
};
var useAndroidInputManager = !IS_ANDROID ? () => null : (_ref) => {
  var {
    node: node3
  } = _ref, options = _objectWithoutProperties(_ref, _excluded$3);
  if (!IS_ANDROID) {
    return null;
  }
  var editor = useSlateStatic();
  var isMounted = useIsMounted();
  var [inputManager] = reactExports.useState(() => createAndroidInputManager(_objectSpread$5({
    editor
  }, options)));
  useMutationObserver(node3, inputManager.handleDomMutations, MUTATION_OBSERVER_CONFIG$1);
  EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.scheduleFlush);
  if (isMounted) {
    inputManager.flush();
  }
  return inputManager;
};
var _excluded$2 = ["anchor", "focus"], _excluded2$1 = ["anchor", "focus"];
var shallowCompare = (obj1, obj2) => Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
var isDecorationFlagsEqual = (range2, other) => {
  var rangeOwnProps = _objectWithoutProperties(range2, _excluded$2);
  var otherOwnProps = _objectWithoutProperties(other, _excluded2$1);
  return range2[PLACEHOLDER_SYMBOL] === other[PLACEHOLDER_SYMBOL] && shallowCompare(rangeOwnProps, otherOwnProps);
};
var isElementDecorationsEqual = (list, another) => {
  if (list.length !== another.length) {
    return false;
  }
  for (var i = 0; i < list.length; i++) {
    var range2 = list[i];
    var other = another[i];
    if (!Range.equals(range2, other) || !isDecorationFlagsEqual(range2, other)) {
      return false;
    }
  }
  return true;
};
var isTextDecorationsEqual = (list, another) => {
  if (list.length !== another.length) {
    return false;
  }
  for (var i = 0; i < list.length; i++) {
    var range2 = list[i];
    var other = another[i];
    if (range2.anchor.offset !== other.anchor.offset || range2.focus.offset !== other.focus.offset || !isDecorationFlagsEqual(range2, other)) {
      return false;
    }
  }
  return true;
};
function ownKeys$4(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$4(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$4(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$4(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var String$1 = (props) => {
  var {
    isLast,
    leaf: leaf3,
    parent: parent3,
    text
  } = props;
  var editor = useSlateStatic();
  var path3 = ReactEditor.findPath(editor, text);
  var parentPath = Path.parent(path3);
  var isMarkPlaceholder = Boolean(leaf3[MARK_PLACEHOLDER_SYMBOL]);
  if (editor.isVoid(parent3)) {
    return /* @__PURE__ */ React$1.createElement(ZeroWidthString, {
      length: Node.string(parent3).length
    });
  }
  if (leaf3.text === "" && parent3.children[parent3.children.length - 1] === text && !editor.isInline(parent3) && Editor.string(editor, parentPath) === "") {
    return /* @__PURE__ */ React$1.createElement(ZeroWidthString, {
      isLineBreak: true,
      isMarkPlaceholder
    });
  }
  if (leaf3.text === "") {
    return /* @__PURE__ */ React$1.createElement(ZeroWidthString, {
      isMarkPlaceholder
    });
  }
  if (isLast && leaf3.text.slice(-1) === "\n") {
    return /* @__PURE__ */ React$1.createElement(TextString, {
      isTrailing: true,
      text: leaf3.text
    });
  }
  return /* @__PURE__ */ React$1.createElement(TextString, {
    text: leaf3.text
  });
};
var TextString = (props) => {
  var {
    text,
    isTrailing = false
  } = props;
  var ref = reactExports.useRef(null);
  var getTextContent = () => {
    return "".concat(text !== null && text !== void 0 ? text : "").concat(isTrailing ? "\n" : "");
  };
  var [initialText] = reactExports.useState(getTextContent);
  useIsomorphicLayoutEffect(() => {
    var textWithTrailing = getTextContent();
    if (ref.current && ref.current.textContent !== textWithTrailing) {
      ref.current.textContent = textWithTrailing;
    }
  });
  return /* @__PURE__ */ React$1.createElement(MemoizedText$1, {
    ref
  }, initialText);
};
var MemoizedText$1 = /* @__PURE__ */ reactExports.memo(/* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  return /* @__PURE__ */ React$1.createElement("span", {
    "data-slate-string": true,
    ref
  }, props.children);
}));
var ZeroWidthString = (props) => {
  var {
    length = 0,
    isLineBreak = false,
    isMarkPlaceholder = false
  } = props;
  var attributes = {
    "data-slate-zero-width": isLineBreak ? "n" : "z",
    "data-slate-length": length
  };
  if (isMarkPlaceholder) {
    attributes["data-slate-mark-placeholder"] = true;
  }
  return /* @__PURE__ */ React$1.createElement("span", _objectSpread$4({}, attributes), !IS_ANDROID || !isLineBreak ? "\uFEFF" : null, isLineBreak ? /* @__PURE__ */ React$1.createElement("br", null) : null);
};
function ownKeys$3(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$3(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$3(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$3(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var PLACEHOLDER_DELAY = IS_ANDROID ? 300 : 0;
function disconnectPlaceholderResizeObserver(placeholderResizeObserver, releaseObserver) {
  if (placeholderResizeObserver.current) {
    placeholderResizeObserver.current.disconnect();
    if (releaseObserver) {
      placeholderResizeObserver.current = null;
    }
  }
}
function clearTimeoutRef(timeoutRef) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}
var Leaf = (props) => {
  var {
    leaf: leaf3,
    isLast,
    text,
    parent: parent3,
    renderPlaceholder,
    renderLeaf = (props2) => /* @__PURE__ */ React$1.createElement(DefaultLeaf, _objectSpread$3({}, props2))
  } = props;
  var editor = useSlateStatic();
  var placeholderResizeObserver = reactExports.useRef(null);
  var placeholderRef = reactExports.useRef(null);
  var [showPlaceholder, setShowPlaceholder] = reactExports.useState(false);
  var showPlaceholderTimeoutRef = reactExports.useRef(null);
  var callbackPlaceholderRef = reactExports.useCallback((placeholderEl) => {
    disconnectPlaceholderResizeObserver(placeholderResizeObserver, placeholderEl == null);
    if (placeholderEl == null) {
      var _leaf$onPlaceholderRe;
      EDITOR_TO_PLACEHOLDER_ELEMENT.delete(editor);
      (_leaf$onPlaceholderRe = leaf3.onPlaceholderResize) === null || _leaf$onPlaceholderRe === void 0 || _leaf$onPlaceholderRe.call(leaf3, null);
    } else {
      EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl);
      if (!placeholderResizeObserver.current) {
        var ResizeObserver$1 = window.ResizeObserver || ResizeObserver;
        placeholderResizeObserver.current = new ResizeObserver$1(() => {
          var _leaf$onPlaceholderRe2;
          (_leaf$onPlaceholderRe2 = leaf3.onPlaceholderResize) === null || _leaf$onPlaceholderRe2 === void 0 || _leaf$onPlaceholderRe2.call(leaf3, placeholderEl);
        });
      }
      placeholderResizeObserver.current.observe(placeholderEl);
      placeholderRef.current = placeholderEl;
    }
  }, [placeholderRef, leaf3, editor]);
  var children = /* @__PURE__ */ React$1.createElement(String$1, {
    isLast,
    leaf: leaf3,
    parent: parent3,
    text
  });
  var leafIsPlaceholder = Boolean(leaf3[PLACEHOLDER_SYMBOL]);
  reactExports.useEffect(() => {
    if (leafIsPlaceholder) {
      if (!showPlaceholderTimeoutRef.current) {
        showPlaceholderTimeoutRef.current = setTimeout(() => {
          setShowPlaceholder(true);
          showPlaceholderTimeoutRef.current = null;
        }, PLACEHOLDER_DELAY);
      }
    } else {
      clearTimeoutRef(showPlaceholderTimeoutRef);
      setShowPlaceholder(false);
    }
    return () => clearTimeoutRef(showPlaceholderTimeoutRef);
  }, [leafIsPlaceholder, setShowPlaceholder]);
  if (leafIsPlaceholder && showPlaceholder) {
    var placeholderProps = {
      children: leaf3.placeholder,
      attributes: {
        "data-slate-placeholder": true,
        style: {
          position: "absolute",
          top: 0,
          pointerEvents: "none",
          width: "100%",
          maxWidth: "100%",
          display: "block",
          opacity: "0.333",
          userSelect: "none",
          textDecoration: "none",
          // Fixes https://github.com/udecode/plate/issues/2315
          WebkitUserModify: IS_WEBKIT ? "inherit" : void 0
        },
        contentEditable: false,
        ref: callbackPlaceholderRef
      }
    };
    children = /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, renderPlaceholder(placeholderProps), children);
  }
  var attributes = {
    "data-slate-leaf": true
  };
  return renderLeaf({
    attributes,
    children,
    leaf: leaf3,
    text
  });
};
var MemoizedLeaf = /* @__PURE__ */ React$1.memo(Leaf, (prev, next3) => {
  return next3.parent === prev.parent && next3.isLast === prev.isLast && next3.renderLeaf === prev.renderLeaf && next3.renderPlaceholder === prev.renderPlaceholder && next3.text === prev.text && Text$1.equals(next3.leaf, prev.leaf) && next3.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL];
});
var DefaultLeaf = (props) => {
  var {
    attributes,
    children
  } = props;
  return /* @__PURE__ */ React$1.createElement("span", _objectSpread$3({}, attributes), children);
};
var Text = (props) => {
  var {
    decorations,
    isLast,
    parent: parent3,
    renderPlaceholder,
    renderLeaf,
    text
  } = props;
  var editor = useSlateStatic();
  var ref = reactExports.useRef(null);
  var leaves = Text$1.decorations(text, decorations);
  var key = ReactEditor.findKey(editor, text);
  var children = [];
  for (var i = 0; i < leaves.length; i++) {
    var leaf3 = leaves[i];
    children.push(/* @__PURE__ */ React$1.createElement(MemoizedLeaf, {
      isLast: isLast && i === leaves.length - 1,
      key: "".concat(key.id, "-").concat(i),
      renderPlaceholder,
      leaf: leaf3,
      text,
      parent: parent3,
      renderLeaf
    }));
  }
  var callbackRef = reactExports.useCallback((span) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    if (span) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.set(key, span);
      NODE_TO_ELEMENT.set(text, span);
      ELEMENT_TO_NODE.set(span, text);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.delete(key);
      NODE_TO_ELEMENT.delete(text);
      if (ref.current) {
        ELEMENT_TO_NODE.delete(ref.current);
      }
    }
    ref.current = span;
  }, [ref, editor, key, text]);
  return /* @__PURE__ */ React$1.createElement("span", {
    "data-slate-node": "text",
    ref: callbackRef
  }, children);
};
var MemoizedText = /* @__PURE__ */ React$1.memo(Text, (prev, next3) => {
  return next3.parent === prev.parent && next3.isLast === prev.isLast && next3.renderLeaf === prev.renderLeaf && next3.renderPlaceholder === prev.renderPlaceholder && next3.text === prev.text && isTextDecorationsEqual(next3.decorations, prev.decorations);
});
function ownKeys$2(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$2(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$2(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$2(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Element$1 = (props) => {
  var {
    decorations,
    element,
    renderElement = (p2) => /* @__PURE__ */ React$1.createElement(DefaultElement, _objectSpread$2({}, p2)),
    renderPlaceholder,
    renderLeaf,
    selection
  } = props;
  var editor = useSlateStatic();
  var readOnly = useReadOnly();
  var isInline = editor.isInline(element);
  var key = ReactEditor.findKey(editor, element);
  var ref = reactExports.useCallback((ref2) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    if (ref2) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.set(key, ref2);
      NODE_TO_ELEMENT.set(element, ref2);
      ELEMENT_TO_NODE.set(ref2, element);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.delete(key);
      NODE_TO_ELEMENT.delete(element);
    }
  }, [editor, key, element]);
  var children = useChildren({
    decorations,
    node: element,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection
  });
  var attributes = {
    "data-slate-node": "element",
    ref
  };
  if (isInline) {
    attributes["data-slate-inline"] = true;
  }
  if (!isInline && Editor.hasInlines(editor, element)) {
    var text = Node.string(element);
    var dir = getDirection(text);
    if (dir === "rtl") {
      attributes.dir = dir;
    }
  }
  if (Editor.isVoid(editor, element)) {
    attributes["data-slate-void"] = true;
    if (!readOnly && isInline) {
      attributes.contentEditable = false;
    }
    var Tag = isInline ? "span" : "div";
    var [[_text]] = Node.texts(element);
    children = /* @__PURE__ */ React$1.createElement(Tag, {
      "data-slate-spacer": true,
      style: {
        height: "0",
        color: "transparent",
        outline: "none",
        position: "absolute"
      }
    }, /* @__PURE__ */ React$1.createElement(MemoizedText, {
      renderPlaceholder,
      decorations: [],
      isLast: false,
      parent: element,
      text: _text
    }));
    NODE_TO_INDEX.set(_text, 0);
    NODE_TO_PARENT.set(_text, element);
  }
  return renderElement({
    attributes,
    children,
    element
  });
};
var MemoizedElement = /* @__PURE__ */ React$1.memo(Element$1, (prev, next3) => {
  return prev.element === next3.element && prev.renderElement === next3.renderElement && prev.renderLeaf === next3.renderLeaf && prev.renderPlaceholder === next3.renderPlaceholder && isElementDecorationsEqual(prev.decorations, next3.decorations) && (prev.selection === next3.selection || !!prev.selection && !!next3.selection && Range.equals(prev.selection, next3.selection));
});
var DefaultElement = (props) => {
  var {
    attributes,
    children,
    element
  } = props;
  var editor = useSlateStatic();
  var Tag = editor.isInline(element) ? "span" : "div";
  return /* @__PURE__ */ React$1.createElement(Tag, _objectSpread$2(_objectSpread$2({}, attributes), {}, {
    style: {
      position: "relative"
    }
  }), children);
};
var DecorateContext = /* @__PURE__ */ reactExports.createContext(() => []);
var useDecorate = () => {
  return reactExports.useContext(DecorateContext);
};
var SelectedContext = /* @__PURE__ */ reactExports.createContext(false);
var useChildren = (props) => {
  var {
    decorations,
    node: node3,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection
  } = props;
  var decorate = useDecorate();
  var editor = useSlateStatic();
  var path3 = ReactEditor.findPath(editor, node3);
  var children = [];
  var isLeafBlock = Element$2.isElement(node3) && !editor.isInline(node3) && Editor.hasInlines(editor, node3);
  for (var i = 0; i < node3.children.length; i++) {
    var p2 = path3.concat(i);
    var n2 = node3.children[i];
    var key = ReactEditor.findKey(editor, n2);
    var range2 = Editor.range(editor, p2);
    var sel = selection && Range.intersection(range2, selection);
    var ds = decorate([n2, p2]);
    for (var dec of decorations) {
      var d = Range.intersection(dec, range2);
      if (d) {
        ds.push(d);
      }
    }
    if (Element$2.isElement(n2)) {
      children.push(/* @__PURE__ */ React$1.createElement(SelectedContext.Provider, {
        key: "provider-".concat(key.id),
        value: !!sel
      }, /* @__PURE__ */ React$1.createElement(MemoizedElement, {
        decorations: ds,
        element: n2,
        key: key.id,
        renderElement,
        renderPlaceholder,
        renderLeaf,
        selection: sel
      })));
    } else {
      children.push(/* @__PURE__ */ React$1.createElement(MemoizedText, {
        decorations: ds,
        key: key.id,
        isLast: isLeafBlock && i === node3.children.length - 1,
        parent: node3,
        renderPlaceholder,
        renderLeaf,
        text: n2
      }));
    }
    NODE_TO_INDEX.set(n2, i);
    NODE_TO_PARENT.set(n2, node3);
  }
  return children;
};
var ReadOnlyContext = /* @__PURE__ */ reactExports.createContext(false);
var useReadOnly = () => {
  return reactExports.useContext(ReadOnlyContext);
};
var SlateContext = /* @__PURE__ */ reactExports.createContext(null);
var useSlate = () => {
  var context = reactExports.useContext(SlateContext);
  if (!context) {
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  }
  var {
    editor
  } = context;
  return editor;
};
function useTrackUserInput() {
  var editor = useSlateStatic();
  var receivedUserInput = reactExports.useRef(false);
  var animationFrameIdRef = reactExports.useRef(0);
  var onUserInput = reactExports.useCallback(() => {
    if (receivedUserInput.current) {
      return;
    }
    receivedUserInput.current = true;
    var window2 = ReactEditor.getWindow(editor);
    window2.cancelAnimationFrame(animationFrameIdRef.current);
    animationFrameIdRef.current = window2.requestAnimationFrame(() => {
      receivedUserInput.current = false;
    });
  }, [editor]);
  reactExports.useEffect(() => () => cancelAnimationFrame(animationFrameIdRef.current), []);
  return {
    receivedUserInput,
    onUserInput
  };
}
var TRIPLE_CLICK = 3;
var HOTKEYS = {
  bold: "mod+b",
  compose: ["down", "left", "right", "up", "backspace", "enter"],
  moveBackward: "left",
  moveForward: "right",
  moveWordBackward: "ctrl+left",
  moveWordForward: "ctrl+right",
  deleteBackward: "shift?+backspace",
  deleteForward: "shift?+delete",
  extendBackward: "shift+left",
  extendForward: "shift+right",
  italic: "mod+i",
  insertSoftBreak: "shift+enter",
  splitBlock: "enter",
  undo: "mod+z"
};
var APPLE_HOTKEYS = {
  moveLineBackward: "opt+up",
  moveLineForward: "opt+down",
  moveWordBackward: "opt+left",
  moveWordForward: "opt+right",
  deleteBackward: ["ctrl+backspace", "ctrl+h"],
  deleteForward: ["ctrl+delete", "ctrl+d"],
  deleteLineBackward: "cmd+shift?+backspace",
  deleteLineForward: ["cmd+shift?+delete", "ctrl+k"],
  deleteWordBackward: "opt+shift?+backspace",
  deleteWordForward: "opt+shift?+delete",
  extendLineBackward: "opt+shift+up",
  extendLineForward: "opt+shift+down",
  redo: "cmd+shift+z",
  transposeCharacter: "ctrl+t"
};
var WINDOWS_HOTKEYS = {
  deleteWordBackward: "ctrl+shift?+backspace",
  deleteWordForward: "ctrl+shift?+delete",
  redo: ["ctrl+y", "ctrl+shift+z"]
};
var create2 = (key) => {
  var generic = HOTKEYS[key];
  var apple = APPLE_HOTKEYS[key];
  var windows = WINDOWS_HOTKEYS[key];
  var isGeneric = generic && isHotkey_1(generic);
  var isApple = apple && isHotkey_1(apple);
  var isWindows = windows && isHotkey_1(windows);
  return (event) => {
    if (isGeneric && isGeneric(event)) return true;
    if (IS_APPLE && isApple && isApple(event)) return true;
    if (!IS_APPLE && isWindows && isWindows(event)) return true;
    return false;
  };
};
var Hotkeys = {
  isBold: create2("bold"),
  isCompose: create2("compose"),
  isMoveBackward: create2("moveBackward"),
  isMoveForward: create2("moveForward"),
  isDeleteBackward: create2("deleteBackward"),
  isDeleteForward: create2("deleteForward"),
  isDeleteLineBackward: create2("deleteLineBackward"),
  isDeleteLineForward: create2("deleteLineForward"),
  isDeleteWordBackward: create2("deleteWordBackward"),
  isDeleteWordForward: create2("deleteWordForward"),
  isExtendBackward: create2("extendBackward"),
  isExtendForward: create2("extendForward"),
  isExtendLineBackward: create2("extendLineBackward"),
  isExtendLineForward: create2("extendLineForward"),
  isItalic: create2("italic"),
  isMoveLineBackward: create2("moveLineBackward"),
  isMoveLineForward: create2("moveLineForward"),
  isMoveWordBackward: create2("moveWordBackward"),
  isMoveWordForward: create2("moveWordForward"),
  isRedo: create2("redo"),
  isSoftBreak: create2("insertSoftBreak"),
  isSplitBlock: create2("splitBlock"),
  isTransposeCharacter: create2("transposeCharacter"),
  isUndo: create2("undo")
};
var createRestoreDomManager = (editor, receivedUserInput) => {
  var bufferedMutations = [];
  var clear = () => {
    bufferedMutations = [];
  };
  var registerMutations = (mutations) => {
    if (!receivedUserInput.current) {
      return;
    }
    var trackedMutations = mutations.filter((mutation) => isTrackedMutation(editor, mutation, mutations));
    bufferedMutations.push(...trackedMutations);
  };
  function restoreDOM() {
    if (bufferedMutations.length > 0) {
      bufferedMutations.reverse().forEach((mutation) => {
        if (mutation.type === "characterData") {
          return;
        }
        mutation.removedNodes.forEach((node3) => {
          mutation.target.insertBefore(node3, mutation.nextSibling);
        });
        mutation.addedNodes.forEach((node3) => {
          mutation.target.removeChild(node3);
        });
      });
      clear();
    }
  }
  return {
    registerMutations,
    restoreDOM,
    clear
  };
};
var MUTATION_OBSERVER_CONFIG = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true
};
class RestoreDOMComponent extends reactExports.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "context", null);
    _defineProperty(this, "manager", null);
    _defineProperty(this, "mutationObserver", null);
  }
  observe() {
    var _this$mutationObserve;
    var {
      node: node3
    } = this.props;
    if (!node3.current) {
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    }
    (_this$mutationObserve = this.mutationObserver) === null || _this$mutationObserve === void 0 || _this$mutationObserve.observe(node3.current, MUTATION_OBSERVER_CONFIG);
  }
  componentDidMount() {
    var {
      receivedUserInput
    } = this.props;
    var editor = this.context;
    this.manager = createRestoreDomManager(editor, receivedUserInput);
    this.mutationObserver = new MutationObserver(this.manager.registerMutations);
    this.observe();
  }
  getSnapshotBeforeUpdate() {
    var _this$mutationObserve2, _this$mutationObserve3, _this$manager2;
    var pendingMutations = (_this$mutationObserve2 = this.mutationObserver) === null || _this$mutationObserve2 === void 0 ? void 0 : _this$mutationObserve2.takeRecords();
    if (pendingMutations !== null && pendingMutations !== void 0 && pendingMutations.length) {
      var _this$manager;
      (_this$manager = this.manager) === null || _this$manager === void 0 || _this$manager.registerMutations(pendingMutations);
    }
    (_this$mutationObserve3 = this.mutationObserver) === null || _this$mutationObserve3 === void 0 || _this$mutationObserve3.disconnect();
    (_this$manager2 = this.manager) === null || _this$manager2 === void 0 || _this$manager2.restoreDOM();
    return null;
  }
  componentDidUpdate() {
    var _this$manager3;
    (_this$manager3 = this.manager) === null || _this$manager3 === void 0 || _this$manager3.clear();
    this.observe();
  }
  componentWillUnmount() {
    var _this$mutationObserve4;
    (_this$mutationObserve4 = this.mutationObserver) === null || _this$mutationObserve4 === void 0 || _this$mutationObserve4.disconnect();
  }
  render() {
    return this.props.children;
  }
}
_defineProperty(RestoreDOMComponent, "contextType", EditorContext);
var RestoreDOM = IS_ANDROID ? RestoreDOMComponent : (_ref) => {
  var {
    children
  } = _ref;
  return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, children);
};
var _excluded$1 = ["autoFocus", "decorate", "onDOMBeforeInput", "placeholder", "readOnly", "renderElement", "renderLeaf", "renderPlaceholder", "scrollSelectionIntoView", "style", "as", "disableDefaultStyles"], _excluded2 = ["text"];
function ownKeys$1(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread$1(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$1(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var Children = (props) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, useChildren(props));
var Editable = (props) => {
  var defaultRenderPlaceholder = reactExports.useCallback((props2) => /* @__PURE__ */ React$1.createElement(DefaultPlaceholder, _objectSpread$1({}, props2)), []);
  var {
    autoFocus,
    decorate = defaultDecorate,
    onDOMBeforeInput: propsOnDOMBeforeInput,
    placeholder,
    readOnly = false,
    renderElement,
    renderLeaf,
    renderPlaceholder = defaultRenderPlaceholder,
    scrollSelectionIntoView = defaultScrollSelectionIntoView,
    style: userStyle = {},
    as: Component = "div",
    disableDefaultStyles = false
  } = props, attributes = _objectWithoutProperties(props, _excluded$1);
  var editor = useSlate();
  var [isComposing, setIsComposing] = reactExports.useState(false);
  var ref = reactExports.useRef(null);
  var deferredOperations = reactExports.useRef([]);
  var [placeholderHeight, setPlaceholderHeight] = reactExports.useState();
  var {
    onUserInput,
    receivedUserInput
  } = useTrackUserInput();
  var [, forceRender] = reactExports.useReducer((s) => s + 1, 0);
  EDITOR_TO_FORCE_RENDER.set(editor, forceRender);
  IS_READ_ONLY.set(editor, readOnly);
  var state = reactExports.useMemo(() => ({
    isDraggingInternally: false,
    isUpdatingSelection: false,
    latestElement: null,
    hasMarkPlaceholder: false
  }), []);
  reactExports.useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);
  var androidInputManagerRef = reactExports.useRef();
  var onDOMSelectionChange = reactExports.useMemo(() => throttle$1(() => {
    var androidInputManager = androidInputManagerRef.current;
    if ((IS_ANDROID || !ReactEditor.isComposing(editor)) && (!state.isUpdatingSelection || androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.isFlushing()) && !state.isDraggingInternally) {
      var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
      var {
        activeElement
      } = root2;
      var el2 = ReactEditor.toDOMNode(editor, editor);
      var domSelection = root2.getSelection();
      if (activeElement === el2) {
        state.latestElement = activeElement;
        IS_FOCUSED.set(editor, true);
      } else {
        IS_FOCUSED.delete(editor);
      }
      if (!domSelection) {
        return Transforms.deselect(editor);
      }
      var {
        anchorNode,
        focusNode
      } = domSelection;
      var anchorNodeSelectable = ReactEditor.hasEditableTarget(editor, anchorNode) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, anchorNode);
      var focusNodeSelectable = ReactEditor.hasEditableTarget(editor, focusNode) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, focusNode);
      if (anchorNodeSelectable && focusNodeSelectable) {
        var range2 = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: true
        });
        if (range2) {
          if (!ReactEditor.isComposing(editor) && !(androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.hasPendingChanges()) && !(androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.isFlushing())) {
            Transforms.select(editor, range2);
          } else {
            androidInputManager === null || androidInputManager === void 0 || androidInputManager.handleUserSelect(range2);
          }
        }
      }
      if (readOnly && (!anchorNodeSelectable || !focusNodeSelectable)) {
        Transforms.deselect(editor);
      }
    }
  }, 100), [editor, readOnly, state]);
  var scheduleOnDOMSelectionChange = reactExports.useMemo(() => debounce$2(onDOMSelectionChange, 0), [onDOMSelectionChange]);
  androidInputManagerRef.current = useAndroidInputManager({
    node: ref,
    onDOMSelectionChange,
    scheduleOnDOMSelectionChange
  });
  useIsomorphicLayoutEffect(() => {
    var _androidInputManagerR, _androidInputManagerR2;
    var window2;
    if (ref.current && (window2 = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window2);
      EDITOR_TO_ELEMENT.set(editor, ref.current);
      NODE_TO_ELEMENT.set(editor, ref.current);
      ELEMENT_TO_NODE.set(ref.current, editor);
    } else {
      NODE_TO_ELEMENT.delete(editor);
    }
    var {
      selection
    } = editor;
    var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
    var domSelection = root2.getSelection();
    if (!domSelection || !ReactEditor.isFocused(editor) || (_androidInputManagerR = androidInputManagerRef.current) !== null && _androidInputManagerR !== void 0 && _androidInputManagerR.hasPendingAction()) {
      return;
    }
    var setDomSelection = (forceChange) => {
      var hasDomSelection = domSelection.type !== "None";
      if (!selection && !hasDomSelection) {
        return;
      }
      var focusNode = domSelection.focusNode;
      var anchorNode;
      if (IS_FIREFOX && domSelection.rangeCount > 1) {
        var firstRange = domSelection.getRangeAt(0);
        var lastRange = domSelection.getRangeAt(domSelection.rangeCount - 1);
        if (firstRange.startContainer === focusNode) {
          anchorNode = lastRange.endContainer;
        } else {
          anchorNode = firstRange.startContainer;
        }
      } else {
        anchorNode = domSelection.anchorNode;
      }
      var editorElement = EDITOR_TO_ELEMENT.get(editor);
      var hasDomSelectionInEditor = false;
      if (editorElement.contains(anchorNode) && editorElement.contains(focusNode)) {
        hasDomSelectionInEditor = true;
      }
      if (hasDomSelection && hasDomSelectionInEditor && selection && !forceChange) {
        var slateRange = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: true,
          // domSelection is not necessarily a valid Slate range
          // (e.g. when clicking on contentEditable:false element)
          suppressThrow: true
        });
        if (slateRange && Range.equals(slateRange, selection)) {
          var _anchorNode;
          if (!state.hasMarkPlaceholder) {
            return;
          }
          if ((_anchorNode = anchorNode) !== null && _anchorNode !== void 0 && (_anchorNode = _anchorNode.parentElement) !== null && _anchorNode !== void 0 && _anchorNode.hasAttribute("data-slate-mark-placeholder")) {
            return;
          }
        }
      }
      if (selection && !ReactEditor.hasRange(editor, selection)) {
        editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: true
        });
        return;
      }
      state.isUpdatingSelection = true;
      var newDomRange = selection && ReactEditor.toDOMRange(editor, selection);
      if (newDomRange) {
        if (ReactEditor.isComposing(editor) && !IS_ANDROID) {
          domSelection.collapseToEnd();
        } else if (Range.isBackward(selection)) {
          domSelection.setBaseAndExtent(newDomRange.endContainer, newDomRange.endOffset, newDomRange.startContainer, newDomRange.startOffset);
        } else {
          domSelection.setBaseAndExtent(newDomRange.startContainer, newDomRange.startOffset, newDomRange.endContainer, newDomRange.endOffset);
        }
        scrollSelectionIntoView(editor, newDomRange);
      } else {
        domSelection.removeAllRanges();
      }
      return newDomRange;
    };
    if (domSelection.rangeCount <= 1) {
      setDomSelection();
    }
    var ensureSelection = ((_androidInputManagerR2 = androidInputManagerRef.current) === null || _androidInputManagerR2 === void 0 ? void 0 : _androidInputManagerR2.isFlushing()) === "action";
    if (!IS_ANDROID || !ensureSelection) {
      setTimeout(() => {
        state.isUpdatingSelection = false;
      });
      return;
    }
    var timeoutId = null;
    var animationFrameId = requestAnimationFrame(() => {
      if (ensureSelection) {
        var ensureDomSelection = (forceChange) => {
          try {
            var el2 = ReactEditor.toDOMNode(editor, editor);
            el2.focus();
            setDomSelection(forceChange);
          } catch (e2) {
          }
        };
        ensureDomSelection();
        timeoutId = setTimeout(() => {
          ensureDomSelection(true);
          state.isUpdatingSelection = false;
        });
      }
    });
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });
  var onDOMBeforeInput = reactExports.useCallback((event) => {
    onUserInput();
    if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
      var _EDITOR_TO_USER_SELEC;
      if (androidInputManagerRef.current) {
        return androidInputManagerRef.current.handleDOMBeforeInput(event);
      }
      scheduleOnDOMSelectionChange.flush();
      onDOMSelectionChange.flush();
      var {
        selection
      } = editor;
      var {
        inputType: type
      } = event;
      var data = event.dataTransfer || event.data || void 0;
      var isCompositionChange = type === "insertCompositionText" || type === "deleteCompositionText";
      if (isCompositionChange && ReactEditor.isComposing(editor)) {
        return;
      }
      var native = false;
      if (type === "insertText" && selection && Range.isCollapsed(selection) && // Only use native character insertion for single characters a-z or space for now.
      // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
      // causes duplicate inserts.
      event.data && event.data.length === 1 && /[a-z ]/i.test(event.data) && // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
      // When there is an inline element, e.g. a link, and you select
      // right after it (the start of the next node).
      selection.anchor.offset !== 0) {
        var _node$parentElement, _window$getComputedSt;
        native = true;
        if (editor.marks) {
          native = false;
        }
        var {
          anchor: anchor2
        } = selection;
        var [node3, offset] = ReactEditor.toDOMPoint(editor, anchor2);
        var anchorNode = (_node$parentElement = node3.parentElement) === null || _node$parentElement === void 0 ? void 0 : _node$parentElement.closest("a");
        var window2 = ReactEditor.getWindow(editor);
        if (native && anchorNode && ReactEditor.hasDOMNode(editor, anchorNode)) {
          var _lastText$textContent;
          var lastText = window2 === null || window2 === void 0 ? void 0 : window2.document.createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT).lastChild();
          if (lastText === node3 && ((_lastText$textContent = lastText.textContent) === null || _lastText$textContent === void 0 ? void 0 : _lastText$textContent.length) === offset) {
            native = false;
          }
        }
        if (native && node3.parentElement && (window2 === null || window2 === void 0 || (_window$getComputedSt = window2.getComputedStyle(node3.parentElement)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.whiteSpace) === "pre") {
          var block = Editor.above(editor, {
            at: anchor2.path,
            match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2)
          });
          if (block && Node.string(block[0]).includes("	")) {
            native = false;
          }
        }
      }
      if (!type.startsWith("delete") || type.startsWith("deleteBy")) {
        var [targetRange2] = event.getTargetRanges();
        if (targetRange2) {
          var range2 = ReactEditor.toSlateRange(editor, targetRange2, {
            exactMatch: false,
            suppressThrow: false
          });
          if (!selection || !Range.equals(selection, range2)) {
            native = false;
            var selectionRef = !isCompositionChange && editor.selection && Editor.rangeRef(editor, editor.selection);
            Transforms.select(editor, range2);
            if (selectionRef) {
              EDITOR_TO_USER_SELECTION.set(editor, selectionRef);
            }
          }
        }
      }
      if (isCompositionChange) {
        return;
      }
      if (!native) {
        event.preventDefault();
      }
      if (selection && Range.isExpanded(selection) && type.startsWith("delete")) {
        var direction2 = type.endsWith("Backward") ? "backward" : "forward";
        Editor.deleteFragment(editor, {
          direction: direction2
        });
        return;
      }
      switch (type) {
        case "deleteByComposition":
        case "deleteByCut":
        case "deleteByDrag": {
          Editor.deleteFragment(editor);
          break;
        }
        case "deleteContent":
        case "deleteContentForward": {
          Editor.deleteForward(editor);
          break;
        }
        case "deleteContentBackward": {
          Editor.deleteBackward(editor);
          break;
        }
        case "deleteEntireSoftLine": {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          Editor.deleteForward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteHardLineBackward": {
          Editor.deleteBackward(editor, {
            unit: "block"
          });
          break;
        }
        case "deleteSoftLineBackward": {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteHardLineForward": {
          Editor.deleteForward(editor, {
            unit: "block"
          });
          break;
        }
        case "deleteSoftLineForward": {
          Editor.deleteForward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteWordBackward": {
          Editor.deleteBackward(editor, {
            unit: "word"
          });
          break;
        }
        case "deleteWordForward": {
          Editor.deleteForward(editor, {
            unit: "word"
          });
          break;
        }
        case "insertLineBreak":
          Editor.insertSoftBreak(editor);
          break;
        case "insertParagraph": {
          Editor.insertBreak(editor);
          break;
        }
        case "insertFromComposition":
        case "insertFromDrop":
        case "insertFromPaste":
        case "insertFromYank":
        case "insertReplacementText":
        case "insertText": {
          if (type === "insertFromComposition") {
            if (ReactEditor.isComposing(editor)) {
              setIsComposing(false);
              IS_COMPOSING.set(editor, false);
            }
          }
          if ((data === null || data === void 0 ? void 0 : data.constructor.name) === "DataTransfer") {
            ReactEditor.insertData(editor, data);
          } else if (typeof data === "string") {
            if (native) {
              deferredOperations.current.push(() => Editor.insertText(editor, data));
            } else {
              Editor.insertText(editor, data);
            }
          }
          break;
        }
      }
      var toRestore = (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(editor)) === null || _EDITOR_TO_USER_SELEC === void 0 ? void 0 : _EDITOR_TO_USER_SELEC.unref();
      EDITOR_TO_USER_SELECTION.delete(editor);
      if (toRestore && (!editor.selection || !Range.equals(editor.selection, toRestore))) {
        Transforms.select(editor, toRestore);
      }
    }
  }, [editor, onDOMSelectionChange, onUserInput, propsOnDOMBeforeInput, readOnly, scheduleOnDOMSelectionChange]);
  var callbackRef = reactExports.useCallback((node3) => {
    if (node3 == null) {
      onDOMSelectionChange.cancel();
      scheduleOnDOMSelectionChange.cancel();
      EDITOR_TO_ELEMENT.delete(editor);
      NODE_TO_ELEMENT.delete(editor);
      if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
        ref.current.removeEventListener("beforeinput", onDOMBeforeInput);
      }
    } else {
      if (HAS_BEFORE_INPUT_SUPPORT) {
        node3.addEventListener("beforeinput", onDOMBeforeInput);
      }
    }
    ref.current = node3;
  }, [onDOMSelectionChange, scheduleOnDOMSelectionChange, editor, onDOMBeforeInput]);
  useIsomorphicLayoutEffect(() => {
    var window2 = ReactEditor.getWindow(editor);
    window2.document.addEventListener("selectionchange", scheduleOnDOMSelectionChange);
    return () => {
      window2.document.removeEventListener("selectionchange", scheduleOnDOMSelectionChange);
    };
  }, [scheduleOnDOMSelectionChange]);
  var decorations = decorate([editor, []]);
  var showPlaceholder = placeholder && editor.children.length === 1 && Array.from(Node.texts(editor)).length === 1 && Node.string(editor) === "" && !isComposing;
  var placeHolderResizeHandler = reactExports.useCallback((placeholderEl) => {
    if (placeholderEl && showPlaceholder) {
      var _placeholderEl$getBou;
      setPlaceholderHeight((_placeholderEl$getBou = placeholderEl.getBoundingClientRect()) === null || _placeholderEl$getBou === void 0 ? void 0 : _placeholderEl$getBou.height);
    } else {
      setPlaceholderHeight(void 0);
    }
  }, [showPlaceholder]);
  if (showPlaceholder) {
    var start2 = Editor.start(editor, []);
    decorations.push({
      [PLACEHOLDER_SYMBOL]: true,
      placeholder,
      onPlaceholderResize: placeHolderResizeHandler,
      anchor: start2,
      focus: start2
    });
  }
  var {
    marks: marks3
  } = editor;
  state.hasMarkPlaceholder = false;
  if (editor.selection && Range.isCollapsed(editor.selection) && marks3) {
    var {
      anchor
    } = editor.selection;
    var leaf3 = Node.leaf(editor, anchor.path);
    var rest = _objectWithoutProperties(leaf3, _excluded2);
    if (!Text$1.equals(leaf3, marks3, {
      loose: true
    })) {
      state.hasMarkPlaceholder = true;
      var unset = Object.fromEntries(Object.keys(rest).map((mark) => [mark, null]));
      decorations.push(_objectSpread$1(_objectSpread$1(_objectSpread$1({
        [MARK_PLACEHOLDER_SYMBOL]: true
      }, unset), marks3), {}, {
        anchor,
        focus: anchor
      }));
    }
  }
  reactExports.useEffect(() => {
    setTimeout(() => {
      var {
        selection
      } = editor;
      if (selection) {
        var {
          anchor: _anchor
        } = selection;
        var _text = Node.leaf(editor, _anchor.path);
        if (marks3 && !Text$1.equals(_text, marks3, {
          loose: true
        })) {
          EDITOR_TO_PENDING_INSERTION_MARKS.set(editor, marks3);
          return;
        }
      }
      EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
    });
  });
  return /* @__PURE__ */ React$1.createElement(ReadOnlyContext.Provider, {
    value: readOnly
  }, /* @__PURE__ */ React$1.createElement(DecorateContext.Provider, {
    value: decorate
  }, /* @__PURE__ */ React$1.createElement(RestoreDOM, {
    node: ref,
    receivedUserInput
  }, /* @__PURE__ */ React$1.createElement(Component, _objectSpread$1(_objectSpread$1({
    role: readOnly ? void 0 : "textbox",
    "aria-multiline": readOnly ? void 0 : true
  }, attributes), {}, {
    // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
    // have to use hacks to make these replacement-based features work.
    // For SSR situations HAS_BEFORE_INPUT_SUPPORT is false and results in prop
    // mismatch warning app moves to browser. Pass-through consumer props when
    // not CAN_USE_DOM (SSR) and default to falsy value
    spellCheck: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.spellCheck : false,
    autoCorrect: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCorrect : "false",
    autoCapitalize: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCapitalize : "false",
    "data-slate-editor": true,
    "data-slate-node": "value",
    // explicitly set this
    contentEditable: !readOnly,
    // in some cases, a decoration needs access to the range / selection to decorate a text node,
    // then you will select the whole text node when you select part the of text
    // this magic zIndex="-1" will fix it
    zindex: -1,
    suppressContentEditableWarning: true,
    ref: callbackRef,
    style: _objectSpread$1(_objectSpread$1({}, disableDefaultStyles ? {} : _objectSpread$1({
      // Allow positioning relative to the editable element.
      position: "relative",
      // Preserve adjacent whitespace and new lines.
      whiteSpace: "pre-wrap",
      // Allow words to break if they are too long.
      wordWrap: "break-word"
    }, placeholderHeight ? {
      minHeight: placeholderHeight
    } : {})), userStyle),
    onBeforeInput: reactExports.useCallback((event) => {
      if (!HAS_BEFORE_INPUT_SUPPORT && !readOnly && !isEventHandled(event, attributes.onBeforeInput) && ReactEditor.hasSelectableTarget(editor, event.target)) {
        event.preventDefault();
        if (!ReactEditor.isComposing(editor)) {
          var _text2 = event.data;
          Editor.insertText(editor, _text2);
        }
      }
    }, [attributes.onBeforeInput, editor, readOnly]),
    onInput: reactExports.useCallback((event) => {
      if (isEventHandled(event, attributes.onInput)) {
        return;
      }
      if (androidInputManagerRef.current) {
        androidInputManagerRef.current.handleInput();
        return;
      }
      for (var op of deferredOperations.current) {
        op();
      }
      deferredOperations.current = [];
    }, [attributes.onInput]),
    onBlur: reactExports.useCallback((event) => {
      if (readOnly || state.isUpdatingSelection || !ReactEditor.hasSelectableTarget(editor, event.target) || isEventHandled(event, attributes.onBlur)) {
        return;
      }
      var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
      if (state.latestElement === root2.activeElement) {
        return;
      }
      var {
        relatedTarget
      } = event;
      var el2 = ReactEditor.toDOMNode(editor, editor);
      if (relatedTarget === el2) {
        return;
      }
      if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute("data-slate-spacer")) {
        return;
      }
      if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
        var node3 = ReactEditor.toSlateNode(editor, relatedTarget);
        if (Element$2.isElement(node3) && !editor.isVoid(node3)) {
          return;
        }
      }
      if (IS_WEBKIT) {
        var domSelection = root2.getSelection();
        domSelection === null || domSelection === void 0 || domSelection.removeAllRanges();
      }
      IS_FOCUSED.delete(editor);
    }, [readOnly, state.isUpdatingSelection, state.latestElement, editor, attributes.onBlur]),
    onClick: reactExports.useCallback((event) => {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onClick) && isDOMNode(event.target)) {
        var node3 = ReactEditor.toSlateNode(editor, event.target);
        var path3 = ReactEditor.findPath(editor, node3);
        if (!Editor.hasPath(editor, path3) || Node.get(editor, path3) !== node3) {
          return;
        }
        if (event.detail === TRIPLE_CLICK && path3.length >= 1) {
          var blockPath = path3;
          if (!(Element$2.isElement(node3) && Editor.isBlock(editor, node3))) {
            var _block$;
            var block = Editor.above(editor, {
              match: (n2) => Element$2.isElement(n2) && Editor.isBlock(editor, n2),
              at: path3
            });
            blockPath = (_block$ = block === null || block === void 0 ? void 0 : block[1]) !== null && _block$ !== void 0 ? _block$ : path3.slice(0, 1);
          }
          var range2 = Editor.range(editor, blockPath);
          Transforms.select(editor, range2);
          return;
        }
        if (readOnly) {
          return;
        }
        var _start = Editor.start(editor, path3);
        var end2 = Editor.end(editor, path3);
        var startVoid = Editor.void(editor, {
          at: _start
        });
        var endVoid = Editor.void(editor, {
          at: end2
        });
        if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
          var _range = Editor.range(editor, _start);
          Transforms.select(editor, _range);
        }
      }
    }, [editor, attributes.onClick, readOnly]),
    onCompositionEnd: reactExports.useCallback((event) => {
      if (ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR3;
        if (ReactEditor.isComposing(editor)) {
          Promise.resolve().then(() => {
            setIsComposing(false);
            IS_COMPOSING.set(editor, false);
          });
        }
        (_androidInputManagerR3 = androidInputManagerRef.current) === null || _androidInputManagerR3 === void 0 || _androidInputManagerR3.handleCompositionEnd(event);
        if (isEventHandled(event, attributes.onCompositionEnd) || IS_ANDROID) {
          return;
        }
        if (!IS_WEBKIT && !IS_FIREFOX_LEGACY && !IS_IOS && !IS_WECHATBROWSER && !IS_UC_MOBILE && event.data) {
          var placeholderMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
          EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
          if (placeholderMarks !== void 0) {
            EDITOR_TO_USER_MARKS.set(editor, editor.marks);
            editor.marks = placeholderMarks;
          }
          Editor.insertText(editor, event.data);
          var userMarks = EDITOR_TO_USER_MARKS.get(editor);
          EDITOR_TO_USER_MARKS.delete(editor);
          if (userMarks !== void 0) {
            editor.marks = userMarks;
          }
        }
      }
    }, [attributes.onCompositionEnd, editor]),
    onCompositionUpdate: reactExports.useCallback((event) => {
      if (ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate)) {
        if (!ReactEditor.isComposing(editor)) {
          setIsComposing(true);
          IS_COMPOSING.set(editor, true);
        }
      }
    }, [attributes.onCompositionUpdate, editor]),
    onCompositionStart: reactExports.useCallback((event) => {
      if (ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR4;
        (_androidInputManagerR4 = androidInputManagerRef.current) === null || _androidInputManagerR4 === void 0 || _androidInputManagerR4.handleCompositionStart(event);
        if (isEventHandled(event, attributes.onCompositionStart) || IS_ANDROID) {
          return;
        }
        setIsComposing(true);
        var {
          selection
        } = editor;
        if (selection) {
          if (Range.isExpanded(selection)) {
            Editor.deleteFragment(editor);
            return;
          }
          var inline = Editor.above(editor, {
            match: (n2) => Element$2.isElement(n2) && Editor.isInline(editor, n2),
            mode: "highest"
          });
          if (inline) {
            var [, inlinePath] = inline;
            if (Editor.isEnd(editor, selection.anchor, inlinePath)) {
              var point3 = Editor.after(editor, inlinePath);
              Transforms.setSelection(editor, {
                anchor: point3,
                focus: point3
              });
            }
          }
        }
      }
    }, [attributes.onCompositionStart, editor]),
    onCopy: reactExports.useCallback((event) => {
      if (ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy) && !isDOMEventTargetInput(event)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, "copy");
      }
    }, [attributes.onCopy, editor]),
    onCut: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut) && !isDOMEventTargetInput(event)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, "cut");
        var {
          selection
        } = editor;
        if (selection) {
          if (Range.isExpanded(selection)) {
            Editor.deleteFragment(editor);
          } else {
            var node3 = Node.parent(editor, selection.anchor.path);
            if (Editor.isVoid(editor, node3)) {
              Transforms.delete(editor);
            }
          }
        }
      }
    }, [readOnly, editor, attributes.onCut]),
    onDragOver: reactExports.useCallback((event) => {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragOver)) {
        var node3 = ReactEditor.toSlateNode(editor, event.target);
        if (Element$2.isElement(node3) && Editor.isVoid(editor, node3)) {
          event.preventDefault();
        }
      }
    }, [attributes.onDragOver, editor]),
    onDragStart: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragStart)) {
        var node3 = ReactEditor.toSlateNode(editor, event.target);
        var path3 = ReactEditor.findPath(editor, node3);
        var voidMatch = Element$2.isElement(node3) && Editor.isVoid(editor, node3) || Editor.void(editor, {
          at: path3,
          voids: true
        });
        if (voidMatch) {
          var range2 = Editor.range(editor, path3);
          Transforms.select(editor, range2);
        }
        state.isDraggingInternally = true;
        ReactEditor.setFragmentData(editor, event.dataTransfer, "drag");
      }
    }, [readOnly, editor, attributes.onDragStart, state]),
    onDrop: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDrop)) {
        event.preventDefault();
        var draggedRange = editor.selection;
        var range2 = ReactEditor.findEventRange(editor, event);
        var data = event.dataTransfer;
        Transforms.select(editor, range2);
        if (state.isDraggingInternally) {
          if (draggedRange && !Range.equals(draggedRange, range2) && !Editor.void(editor, {
            at: range2,
            voids: true
          })) {
            Transforms.delete(editor, {
              at: draggedRange
            });
          }
        }
        ReactEditor.insertData(editor, data);
        if (!ReactEditor.isFocused(editor)) {
          ReactEditor.focus(editor);
        }
      }
      state.isDraggingInternally = false;
    }, [readOnly, editor, attributes.onDrop, state]),
    onDragEnd: reactExports.useCallback((event) => {
      if (!readOnly && state.isDraggingInternally && attributes.onDragEnd && ReactEditor.hasTarget(editor, event.target)) {
        attributes.onDragEnd(event);
      }
      state.isDraggingInternally = false;
    }, [readOnly, state, attributes, editor]),
    onFocus: reactExports.useCallback((event) => {
      if (!readOnly && !state.isUpdatingSelection && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onFocus)) {
        var el2 = ReactEditor.toDOMNode(editor, editor);
        var root2 = ReactEditor.findDocumentOrShadowRoot(editor);
        state.latestElement = root2.activeElement;
        if (IS_FIREFOX && event.target !== el2) {
          el2.focus();
          return;
        }
        IS_FOCUSED.set(editor, true);
      }
    }, [readOnly, state, editor, attributes.onFocus]),
    onKeyDown: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target)) {
        var _androidInputManagerR5;
        (_androidInputManagerR5 = androidInputManagerRef.current) === null || _androidInputManagerR5 === void 0 || _androidInputManagerR5.handleKeyDown(event);
        var {
          nativeEvent
        } = event;
        if (ReactEditor.isComposing(editor) && nativeEvent.isComposing === false) {
          IS_COMPOSING.set(editor, false);
          setIsComposing(false);
        }
        if (isEventHandled(event, attributes.onKeyDown) || ReactEditor.isComposing(editor)) {
          return;
        }
        var {
          selection
        } = editor;
        var element = editor.children[selection !== null ? selection.focus.path[0] : 0];
        var isRTL = getDirection(Node.string(element)) === "rtl";
        if (Hotkeys.isRedo(nativeEvent)) {
          event.preventDefault();
          var maybeHistoryEditor = editor;
          if (typeof maybeHistoryEditor.redo === "function") {
            maybeHistoryEditor.redo();
          }
          return;
        }
        if (Hotkeys.isUndo(nativeEvent)) {
          event.preventDefault();
          var _maybeHistoryEditor = editor;
          if (typeof _maybeHistoryEditor.undo === "function") {
            _maybeHistoryEditor.undo();
          }
          return;
        }
        if (Hotkeys.isMoveLineBackward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line",
            reverse: true
          });
          return;
        }
        if (Hotkeys.isMoveLineForward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line"
          });
          return;
        }
        if (Hotkeys.isExtendLineBackward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line",
            edge: "focus",
            reverse: true
          });
          return;
        }
        if (Hotkeys.isExtendLineForward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line",
            edge: "focus"
          });
          return;
        }
        if (Hotkeys.isMoveBackward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isCollapsed(selection)) {
            Transforms.move(editor, {
              reverse: !isRTL
            });
          } else {
            Transforms.collapse(editor, {
              edge: isRTL ? "end" : "start"
            });
          }
          return;
        }
        if (Hotkeys.isMoveForward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isCollapsed(selection)) {
            Transforms.move(editor, {
              reverse: isRTL
            });
          } else {
            Transforms.collapse(editor, {
              edge: isRTL ? "start" : "end"
            });
          }
          return;
        }
        if (Hotkeys.isMoveWordBackward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isExpanded(selection)) {
            Transforms.collapse(editor, {
              edge: "focus"
            });
          }
          Transforms.move(editor, {
            unit: "word",
            reverse: !isRTL
          });
          return;
        }
        if (Hotkeys.isMoveWordForward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isExpanded(selection)) {
            Transforms.collapse(editor, {
              edge: "focus"
            });
          }
          Transforms.move(editor, {
            unit: "word",
            reverse: isRTL
          });
          return;
        }
        if (!HAS_BEFORE_INPUT_SUPPORT) {
          if (Hotkeys.isBold(nativeEvent) || Hotkeys.isItalic(nativeEvent) || Hotkeys.isTransposeCharacter(nativeEvent)) {
            event.preventDefault();
            return;
          }
          if (Hotkeys.isSoftBreak(nativeEvent)) {
            event.preventDefault();
            Editor.insertSoftBreak(editor);
            return;
          }
          if (Hotkeys.isSplitBlock(nativeEvent)) {
            event.preventDefault();
            Editor.insertBreak(editor);
            return;
          }
          if (Hotkeys.isDeleteBackward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "backward"
              });
            } else {
              Editor.deleteBackward(editor);
            }
            return;
          }
          if (Hotkeys.isDeleteForward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "forward"
              });
            } else {
              Editor.deleteForward(editor);
            }
            return;
          }
          if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "backward"
              });
            } else {
              Editor.deleteBackward(editor, {
                unit: "line"
              });
            }
            return;
          }
          if (Hotkeys.isDeleteLineForward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "forward"
              });
            } else {
              Editor.deleteForward(editor, {
                unit: "line"
              });
            }
            return;
          }
          if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "backward"
              });
            } else {
              Editor.deleteBackward(editor, {
                unit: "word"
              });
            }
            return;
          }
          if (Hotkeys.isDeleteWordForward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "forward"
              });
            } else {
              Editor.deleteForward(editor, {
                unit: "word"
              });
            }
            return;
          }
        } else {
          if (IS_CHROME || IS_WEBKIT) {
            if (selection && (Hotkeys.isDeleteBackward(nativeEvent) || Hotkeys.isDeleteForward(nativeEvent)) && Range.isCollapsed(selection)) {
              var currentNode = Node.parent(editor, selection.anchor.path);
              if (Element$2.isElement(currentNode) && Editor.isVoid(editor, currentNode) && (Editor.isInline(editor, currentNode) || Editor.isBlock(editor, currentNode))) {
                event.preventDefault();
                Editor.deleteBackward(editor, {
                  unit: "block"
                });
                return;
              }
            }
          }
        }
      }
    }, [readOnly, editor, attributes.onKeyDown]),
    onPaste: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste)) {
        if (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event.nativeEvent) || IS_WEBKIT) {
          event.preventDefault();
          ReactEditor.insertData(editor, event.clipboardData);
        }
      }
    }, [readOnly, editor, attributes.onPaste])
  }), /* @__PURE__ */ React$1.createElement(Children, {
    decorations,
    node: editor,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    selection: editor.selection
  })))));
};
var DefaultPlaceholder = (_ref) => {
  var {
    attributes,
    children
  } = _ref;
  return (
    // COMPAT: Artificially add a line-break to the end on the placeholder element
    // to prevent Android IMEs to pick up its content in autocorrect and to auto-capitalize the first letter
    /* @__PURE__ */ React$1.createElement("span", _objectSpread$1({}, attributes), children, IS_ANDROID && /* @__PURE__ */ React$1.createElement("br", null))
  );
};
var defaultDecorate = () => [];
var defaultScrollSelectionIntoView = (editor, domRange) => {
  if (domRange.getBoundingClientRect && (!editor.selection || editor.selection && Range.isCollapsed(editor.selection))) {
    var leafEl = domRange.startContainer.parentElement;
    leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(domRange);
    e(leafEl, {
      scrollMode: "if-needed"
    });
    delete leafEl.getBoundingClientRect;
  }
};
var isEventHandled = (event, handler) => {
  if (!handler) {
    return false;
  }
  var shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.isDefaultPrevented() || event.isPropagationStopped();
};
var isDOMEventTargetInput = (event) => {
  return isDOMNode(event.target) && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement);
};
var isDOMEventHandled = (event, handler) => {
  if (!handler) {
    return false;
  }
  var shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.defaultPrevented;
};
var FocusedContext = /* @__PURE__ */ reactExports.createContext(false);
var SlateSelectorContext = /* @__PURE__ */ reactExports.createContext({});
function useSelectorContext(editor) {
  var eventListeners = reactExports.useRef([]).current;
  var slateRef = reactExports.useRef({
    editor
  }).current;
  var onChange = reactExports.useCallback((editor2) => {
    slateRef.editor = editor2;
    eventListeners.forEach((listener) => listener(editor2));
  }, [eventListeners, slateRef]);
  var selectorContext = reactExports.useMemo(() => {
    return {
      getSlate: () => slateRef.editor,
      addEventListener: (callback) => {
        eventListeners.push(callback);
        return () => {
          eventListeners.splice(eventListeners.indexOf(callback), 1);
        };
      }
    };
  }, [eventListeners, slateRef]);
  return {
    selectorContext,
    onChange
  };
}
var _excluded = ["editor", "children", "onChange", "onSelectionChange", "onValueChange", "initialValue"];
var Slate = (props) => {
  var {
    editor,
    children,
    onChange,
    onSelectionChange,
    onValueChange,
    initialValue
  } = props, rest = _objectWithoutProperties(props, _excluded);
  var [context, setContext] = React$1.useState(() => {
    if (!Node.isNodeList(initialValue)) {
      throw new Error("[Slate] initialValue is invalid! Expected a list of elements but got: ".concat(Scrubber.stringify(initialValue)));
    }
    if (!Editor.isEditor(editor)) {
      throw new Error("[Slate] editor is invalid! You passed: ".concat(Scrubber.stringify(editor)));
    }
    editor.children = initialValue;
    Object.assign(editor, rest);
    return {
      v: 0,
      editor
    };
  });
  var {
    selectorContext,
    onChange: handleSelectorChange
  } = useSelectorContext(editor);
  var onContextChange = reactExports.useCallback((options) => {
    var _options$operation;
    if (onChange) {
      onChange(editor.children);
    }
    switch (options === null || options === void 0 || (_options$operation = options.operation) === null || _options$operation === void 0 ? void 0 : _options$operation.type) {
      case "set_selection":
        onSelectionChange === null || onSelectionChange === void 0 || onSelectionChange(editor.selection);
        break;
      default:
        onValueChange === null || onValueChange === void 0 || onValueChange(editor.children);
    }
    setContext((prevContext) => ({
      v: prevContext.v + 1,
      editor
    }));
    handleSelectorChange(editor);
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange]);
  reactExports.useEffect(() => {
    EDITOR_TO_ON_CHANGE.set(editor, onContextChange);
    return () => {
      EDITOR_TO_ON_CHANGE.set(editor, () => {
      });
    };
  }, [editor, onContextChange]);
  var [isFocused, setIsFocused] = reactExports.useState(ReactEditor.isFocused(editor));
  reactExports.useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor));
  }, [editor]);
  useIsomorphicLayoutEffect(() => {
    var fn = () => setIsFocused(ReactEditor.isFocused(editor));
    if (REACT_MAJOR_VERSION >= 17) {
      document.addEventListener("focusin", fn);
      document.addEventListener("focusout", fn);
      return () => {
        document.removeEventListener("focusin", fn);
        document.removeEventListener("focusout", fn);
      };
    } else {
      document.addEventListener("focus", fn, true);
      document.addEventListener("blur", fn, true);
      return () => {
        document.removeEventListener("focus", fn, true);
        document.removeEventListener("blur", fn, true);
      };
    }
  }, []);
  return /* @__PURE__ */ React$1.createElement(SlateSelectorContext.Provider, {
    value: selectorContext
  }, /* @__PURE__ */ React$1.createElement(SlateContext.Provider, {
    value: context
  }, /* @__PURE__ */ React$1.createElement(EditorContext.Provider, {
    value: context.editor
  }, /* @__PURE__ */ React$1.createElement(FocusedContext.Provider, {
    value: isFocused
  }, children))));
};
var doRectsIntersect = (rect, compareRect) => {
  var middle = (compareRect.top + compareRect.bottom) / 2;
  return rect.top <= middle && rect.bottom >= middle;
};
var areRangesSameLine = (editor, range1, range2) => {
  var rect1 = ReactEditor.toDOMRange(editor, range1).getBoundingClientRect();
  var rect2 = ReactEditor.toDOMRange(editor, range2).getBoundingClientRect();
  return doRectsIntersect(rect1, rect2) && doRectsIntersect(rect2, rect1);
};
var findCurrentLineRange = (editor, parentRange) => {
  var parentRangeBoundary = Editor.range(editor, Range.end(parentRange));
  var positions2 = Array.from(Editor.positions(editor, {
    at: parentRange
  }));
  var left = 0;
  var right = positions2.length;
  var middle = Math.floor(right / 2);
  if (areRangesSameLine(editor, Editor.range(editor, positions2[left]), parentRangeBoundary)) {
    return Editor.range(editor, positions2[left], parentRangeBoundary);
  }
  if (positions2.length < 2) {
    return Editor.range(editor, positions2[positions2.length - 1], parentRangeBoundary);
  }
  while (middle !== positions2.length && middle !== left) {
    if (areRangesSameLine(editor, Editor.range(editor, positions2[middle]), parentRangeBoundary)) {
      right = middle;
    } else {
      left = middle;
    }
    middle = Math.floor((left + right) / 2);
  }
  return Editor.range(editor, positions2[right], parentRangeBoundary);
};
function ownKeys(e2, r2) {
  var t2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e2);
    r2 && (o2 = o2.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
    })), t2.push.apply(t2, o2);
  }
  return t2;
}
function _objectSpread(e2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r3) {
      _defineProperty(e2, r3, t2[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
      Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
    });
  }
  return e2;
}
var withReact = function withReact2(editor) {
  var clipboardFormatKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "x-slate-fragment";
  var e2 = editor;
  var {
    apply: apply2,
    onChange,
    deleteBackward: deleteBackward2,
    addMark: addMark2,
    removeMark: removeMark2
  } = e2;
  EDITOR_TO_KEY_TO_ELEMENT.set(e2, /* @__PURE__ */ new WeakMap());
  e2.addMark = (key, value) => {
    var _EDITOR_TO_SCHEDULE_F, _EDITOR_TO_PENDING_DI;
    (_EDITOR_TO_SCHEDULE_F = EDITOR_TO_SCHEDULE_FLUSH.get(e2)) === null || _EDITOR_TO_SCHEDULE_F === void 0 || _EDITOR_TO_SCHEDULE_F();
    if (!EDITOR_TO_PENDING_INSERTION_MARKS.get(e2) && (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(e2)) !== null && _EDITOR_TO_PENDING_DI !== void 0 && _EDITOR_TO_PENDING_DI.length) {
      EDITOR_TO_PENDING_INSERTION_MARKS.set(e2, null);
    }
    EDITOR_TO_USER_MARKS.delete(e2);
    addMark2(key, value);
  };
  e2.removeMark = (key) => {
    var _EDITOR_TO_PENDING_DI2;
    if (!EDITOR_TO_PENDING_INSERTION_MARKS.get(e2) && (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(e2)) !== null && _EDITOR_TO_PENDING_DI2 !== void 0 && _EDITOR_TO_PENDING_DI2.length) {
      EDITOR_TO_PENDING_INSERTION_MARKS.set(e2, null);
    }
    EDITOR_TO_USER_MARKS.delete(e2);
    removeMark2(key);
  };
  e2.deleteBackward = (unit) => {
    if (unit !== "line") {
      return deleteBackward2(unit);
    }
    if (e2.selection && Range.isCollapsed(e2.selection)) {
      var parentBlockEntry = Editor.above(e2, {
        match: (n2) => Element$2.isElement(n2) && Editor.isBlock(e2, n2),
        at: e2.selection
      });
      if (parentBlockEntry) {
        var [, parentBlockPath] = parentBlockEntry;
        var parentElementRange = Editor.range(e2, parentBlockPath, e2.selection.anchor);
        var currentLineRange = findCurrentLineRange(e2, parentElementRange);
        if (!Range.isCollapsed(currentLineRange)) {
          Transforms.delete(e2, {
            at: currentLineRange
          });
        }
      }
    }
  };
  e2.apply = (op) => {
    var matches = [];
    var pathRefMatches = [];
    var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(e2);
    if (pendingDiffs !== null && pendingDiffs !== void 0 && pendingDiffs.length) {
      var transformed = pendingDiffs.map((textDiff) => transformTextDiff(textDiff, op)).filter(Boolean);
      EDITOR_TO_PENDING_DIFFS.set(e2, transformed);
    }
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(e2);
    if (pendingSelection) {
      EDITOR_TO_PENDING_SELECTION.set(e2, transformPendingRange(e2, pendingSelection, op));
    }
    var pendingAction = EDITOR_TO_PENDING_ACTION.get(e2);
    if (pendingAction !== null && pendingAction !== void 0 && pendingAction.at) {
      var at = Point.isPoint(pendingAction === null || pendingAction === void 0 ? void 0 : pendingAction.at) ? transformPendingPoint(e2, pendingAction.at, op) : transformPendingRange(e2, pendingAction.at, op);
      EDITOR_TO_PENDING_ACTION.set(e2, at ? _objectSpread(_objectSpread({}, pendingAction), {}, {
        at
      }) : null);
    }
    switch (op.type) {
      case "insert_text":
      case "remove_text":
      case "set_node":
      case "split_node": {
        matches.push(...getMatches(e2, op.path));
        break;
      }
      case "set_selection": {
        var _EDITOR_TO_USER_SELEC;
        (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(e2)) === null || _EDITOR_TO_USER_SELEC === void 0 || _EDITOR_TO_USER_SELEC.unref();
        EDITOR_TO_USER_SELECTION.delete(e2);
        break;
      }
      case "insert_node":
      case "remove_node": {
        matches.push(...getMatches(e2, Path.parent(op.path)));
        break;
      }
      case "merge_node": {
        var prevPath = Path.previous(op.path);
        matches.push(...getMatches(e2, prevPath));
        break;
      }
      case "move_node": {
        var commonPath = Path.common(Path.parent(op.path), Path.parent(op.newPath));
        matches.push(...getMatches(e2, commonPath));
        var changedPath;
        if (Path.isBefore(op.path, op.newPath)) {
          matches.push(...getMatches(e2, Path.parent(op.path)));
          changedPath = op.newPath;
        } else {
          matches.push(...getMatches(e2, Path.parent(op.newPath)));
          changedPath = op.path;
        }
        var changedNode = Node.get(editor, Path.parent(changedPath));
        var changedNodeKey = ReactEditor.findKey(e2, changedNode);
        var changedPathRef = Editor.pathRef(e2, Path.parent(changedPath));
        pathRefMatches.push([changedPathRef, changedNodeKey]);
        break;
      }
    }
    apply2(op);
    for (var [path3, key] of matches) {
      var [node3] = Editor.node(e2, path3);
      NODE_TO_KEY.set(node3, key);
    }
    for (var [pathRef3, _key] of pathRefMatches) {
      if (pathRef3.current) {
        var [_node] = Editor.node(e2, pathRef3.current);
        NODE_TO_KEY.set(_node, _key);
      }
    }
  };
  e2.setFragmentData = (data) => {
    var {
      selection
    } = e2;
    if (!selection) {
      return;
    }
    var [start2, end2] = Range.edges(selection);
    var startVoid = Editor.void(e2, {
      at: start2.path
    });
    var endVoid = Editor.void(e2, {
      at: end2.path
    });
    if (Range.isCollapsed(selection) && !startVoid) {
      return;
    }
    var domRange = ReactEditor.toDOMRange(e2, selection);
    var contents = domRange.cloneContents();
    var attach = contents.childNodes[0];
    contents.childNodes.forEach((node3) => {
      if (node3.textContent && node3.textContent.trim() !== "") {
        attach = node3;
      }
    });
    if (endVoid) {
      var [voidNode] = endVoid;
      var r2 = domRange.cloneRange();
      var domNode = ReactEditor.toDOMNode(e2, voidNode);
      r2.setEndAfter(domNode);
      contents = r2.cloneContents();
    }
    if (startVoid) {
      attach = contents.querySelector("[data-slate-spacer]");
    }
    Array.from(contents.querySelectorAll("[data-slate-zero-width]")).forEach((zw) => {
      var isNewline = zw.getAttribute("data-slate-zero-width") === "n";
      zw.textContent = isNewline ? "\n" : "";
    });
    if (isDOMText(attach)) {
      var span = attach.ownerDocument.createElement("span");
      span.style.whiteSpace = "pre";
      span.appendChild(attach);
      contents.appendChild(span);
      attach = span;
    }
    var fragment2 = e2.getFragment();
    var string3 = JSON.stringify(fragment2);
    var encoded = window.btoa(encodeURIComponent(string3));
    attach.setAttribute("data-slate-fragment", encoded);
    data.setData("application/".concat(clipboardFormatKey), encoded);
    var div = contents.ownerDocument.createElement("div");
    div.appendChild(contents);
    div.setAttribute("hidden", "true");
    contents.ownerDocument.body.appendChild(div);
    data.setData("text/html", div.innerHTML);
    data.setData("text/plain", getPlainText(div));
    contents.ownerDocument.body.removeChild(div);
    return data;
  };
  e2.insertData = (data) => {
    if (!e2.insertFragmentData(data)) {
      e2.insertTextData(data);
    }
  };
  e2.insertFragmentData = (data) => {
    var fragment2 = data.getData("application/".concat(clipboardFormatKey)) || getSlateFragmentAttribute(data);
    if (fragment2) {
      var decoded = decodeURIComponent(window.atob(fragment2));
      var parsed = JSON.parse(decoded);
      e2.insertFragment(parsed);
      return true;
    }
    return false;
  };
  e2.insertTextData = (data) => {
    var text = data.getData("text/plain");
    if (text) {
      var lines = text.split(/\r\n|\r|\n/);
      var split = false;
      for (var line of lines) {
        if (split) {
          Transforms.splitNodes(e2, {
            always: true
          });
        }
        e2.insertText(line);
        split = true;
      }
      return true;
    }
    return false;
  };
  e2.onChange = (options) => {
    var maybeBatchUpdates = REACT_MAJOR_VERSION < 18 ? ReactDOM.unstable_batchedUpdates : (callback) => callback();
    maybeBatchUpdates(() => {
      var onContextChange = EDITOR_TO_ON_CHANGE.get(e2);
      if (onContextChange) {
        onContextChange(options);
      }
      onChange(options);
    });
  };
  return e2;
};
var getMatches = (e2, path3) => {
  var matches = [];
  for (var [n2, p2] of Editor.levels(e2, {
    at: path3
  })) {
    var key = ReactEditor.findKey(e2, n2);
    matches.push([p2, key]);
  }
  return matches;
};
const fontCache = {
  addEntry(value) {
    const cache2 = this.operateCache(value);
    cache2[value["text"]] = value;
  },
  getEntry(property) {
    const cache2 = this.operateCache(property);
    return cache2[property["text"]];
  },
  operateCache(style) {
    const { fontFamily, fontWeight, fontStyle, fontSize } = style;
    if (!this.fontCacheSession) {
      this.fontCacheSession = {};
    }
    const cache2 = this.fontCacheSession;
    const fontCache2 = cache2[fontFamily] = cache2[fontFamily] || {};
    const cacheKey = (fontWeight !== "normal" ? fontWeight : "normal") + (fontStyle !== "normal" ? fontStyle : "normal") + (fontSize ? fontSize : "60px");
    if (fontCache2[cacheKey]) {
      return fontCache2[cacheKey];
    } else {
      fontCache2[cacheKey] = {};
      return fontCache2[cacheKey];
    }
  },
  clearCache(style) {
  }
};
const KEY_CODE = {
  F1: "F1",
  Command: "Command",
  Meta: "Meta",
  Shift: "Shift",
  Ctrl: "Control",
  Alt: "Alt",
  CapsLock: "CapsLock",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown"
};
const KEY_CODE_EVENT = (event) => {
  return event.key;
};
const DEFAULT_FONT = {
  // 这个是关键 识别空格
  "white-space": "pre",
  fontFamily: "SimFZzhunyuan,SimSun",
  fontWeight: "normal",
  fontStyle: "normal",
  fontVariant: "normal",
  textDecoration: "normal",
  fontSize: "60px",
  lineHeight: "1.2",
  color: "rgba(35,35,35,1)"
};
const SPLIT_STATUS = {
  // 拆快状态
  CONCAT: "concat",
  // 合并状态
  NORMAL: "normal"
  // 正常状态
};
const KEYUP_TIME = 700;
const KEY_CODE_LIST = Object.values(KEY_CODE);
function areObjectsEqual(obj1, obj2) {
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (typeof value1 === "object" && typeof value2 === "object") {
      if (!areObjectsEqual(value1, value2)) {
        return false;
      }
    } else if (value1 !== value2) {
      return false;
    }
  }
  return true;
}
function deepClone(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}
const BASE_SCALE = 10;
class StandardTemplate {
  constructor() {
    this.splitGlobalText = (sections, collects, para) => {
      sections.forEach((paragraph, index) => {
        if (paragraph.children && Array.isArray(paragraph.children)) {
          collects = collects.concat(this.splitGlobalText(paragraph.children, [], paragraph));
        } else {
          collects.push({
            // ...DEFAULT_FONT,
            isSpill: para.isSpill,
            // fontSize: para.fontSize,
            // lineHeight: para.lineHeight,
            isStart: !index ? true : false,
            isEnd: index === sections.length - 1 ? true : false,
            text: paragraph.text.length ? paragraph.text.split("").map((textItem) => {
              return {
                ...DEFAULT_FONT,
                ...paragraph,
                text: textItem
              };
            }) : [{
              ...DEFAULT_FONT,
              ...paragraph,
              text: ""
            }]
          });
        }
      });
      return collects;
    };
    this.width = 0;
    this.lineBreakChars = ["\v", "\n", "\r"];
  }
  /**
   * @description: 合并数据 如font-style等同行合并
   * @param {*} info
   * @return {*}
   */
  mergeFontText(info) {
    const transformedData = [];
    let lastStartData = {};
    for (const item of info) {
      if (item.isStart) {
        const newData = { ...item, splitIndexList: [] };
        transformedData.push(newData);
        lastStartData = newData;
      } else {
        let splitIndex = lastStartData.textInfo.length;
        lastStartData.splitIndexList.push(splitIndex);
        lastStartData.textInfo = lastStartData.textInfo.concat(item.textInfo);
        lastStartData.width += item.width;
      }
    }
    return transformedData;
  }
  /**
   * @description: 数据按行拆分
   * @param {*} info 所有字区域详情
   * @param {*} width 编辑器区域宽度
   * @return {*}
   */
  composeLine(info, width) {
    let editAllValue = [];
    let resetFontInfo = this.mergeFontText(info);
    resetFontInfo.forEach((textItem) => {
      let lineWidth = width || 0;
      const editValue = this.composeLineBlock(textItem, lineWidth);
      editAllValue = editAllValue.concat(editValue);
    });
    return editAllValue;
  }
  /**
   * @description: 英文符号校验
   * @param {*} text
   * @param {*} isTrue
   * @return {*}
   */
  isSpecialText(text, isTrue) {
    if (isTrue) {
      return /^[A-Za-z]$/.test(text) || /^[.,;:?!'"()[\]{}\-/\\]$/.test(text);
    }
    return !/^[A-Za-z]$/.test(text) && !/^[.,;:?!'"()[\]{}\-/\\]$/.test(text);
  }
  /**
   * @description: 递归将数据拆分 当超过宽度是 将前一个到最前方的值形成一个数组 
   * @param {*} textItem
   * @param {*} lineWidth
   * @param {any} splitArr
   * @return {*}
   */
  composeLineBlock(textItem, lineWidth, splitArr = []) {
    let width = Number((lineWidth * BASE_SCALE).toFixed(2));
    const { textInfo } = textItem;
    for (let i = 0; i < textInfo.length; i++) {
      if (lineWidth !== 0) {
        width -= textInfo[i].width;
      }
      if (width < 0) {
        if (this.isSpecialText(textInfo[i].text, true)) {
          for (let j = i; j >= 0; j--) {
            if (this.isSpecialText(textInfo[j].text, false)) {
              i = j + 1;
              break;
            }
          }
        }
        let splitList = textItem.splitIndexList;
        const filteredSplitList = splitList.filter((item) => item <= i);
        let children = this.splitArrayByIndexes(textInfo.slice(0, i), filteredSplitList);
        splitArr.push({
          type: "paragraph",
          children,
          isSpill: textItem.isSpill || void 0,
          fontSize: textItem.fontSize,
          lineHeight: textItem.lineHeight
        });
        let resetTextInfo = textInfo.slice(i);
        let len = textInfo.length - resetTextInfo.length;
        let splitIndex = [];
        for (const item of textItem.splitIndexList) {
          if (item > len) {
            splitIndex.push(item - len);
          }
        }
        let composeTextItem = Object.assign({}, { ...textItem, splitIndexList: splitIndex }, { isSpill: true }, {
          textInfo: resetTextInfo
        });
        this.composeLineBlock(composeTextItem, lineWidth, splitArr);
        break;
      } else {
        if (i === textInfo.length - 1) {
          let splitList = textItem.splitIndexList;
          let children = this.splitArrayByIndexes(textInfo, splitList);
          splitArr.push({
            type: "paragraph",
            children,
            isSpill: textItem.isSpill || void 0,
            fontSize: textItem.fontSize,
            lineHeight: textItem.lineHeight
          });
        }
      }
    }
    return splitArr;
  }
  /**
   * @description: 根据拆分的索引重组数据
   * @param {*} arr
   * @param {*} indexes
   * @return {*}
   */
  splitArrayByIndexes(arr, indexes) {
    const result = [];
    let start2 = 0;
    for (const index of indexes) {
      const {
        fontFamily,
        fontSize,
        fontStyle,
        fontVariant,
        lineHeight,
        fontWeight,
        color,
        textDecoration
      } = arr.slice(start2, index)[0];
      let str = arr.slice(start2, index).map((item) => item.text).join("");
      result.push({
        text: str,
        fontFamily,
        fontSize,
        lineHeight,
        fontStyle,
        fontVariant,
        fontWeight,
        color,
        textDecoration
      });
      start2 = index;
    }
    if (arr.slice(start2).length) {
      const {
        fontFamily,
        fontSize,
        lineHeight,
        fontStyle,
        fontVariant,
        fontWeight,
        color,
        textDecoration
      } = arr.slice(start2)[0];
      result.push({
        text: arr.slice(start2).map((item) => item.text).join(""),
        fontFamily,
        fontSize,
        lineHeight,
        fontStyle,
        fontVariant,
        fontWeight,
        color,
        textDecoration
      });
    }
    return result;
  }
  /**
   * @description: 重组数据
   * @param {any} data
   * @return {*}
   */
  reorganizeData(data) {
    let fontMap = data.map((fontBlock) => {
      this.clearWidth();
      let text = fontBlock.text;
      fontBlock.text = [];
      return {
        ...fontBlock,
        textInfo: text.map((textInfo) => {
          let fontInfo = this.calcMetrics(textInfo, fontBlock);
          return {
            ...fontInfo
          };
        }),
        width: this.width
      };
    });
    return fontMap;
  }
  /**
   * @description: 获取字符fontStyle
   * @return {*}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  /**
   * @description: 初始化计算dom
   * @return {*}
   */
  initCalcDom() {
    if (this.caliper) {
      return;
    }
    this.parent = document.createElement("div");
    this.caliper = document.createElement("span");
    this.vernier = document.createElement("div");
    this.setAttr(this.parent, {
      position: "fixed",
      top: "0px",
      left: "0px",
      background: "grey",
      display: "block",
      "z-index": "-99",
      "transform-origin": "left top",
      transform: "scale(0.1)",
      "line-height": "normal",
      opacity: "0"
    });
    this.setAttr(this.vernier, {
      display: "inline-block",
      height: "1px",
      background: "red",
      "vertical-align": "baseline"
    });
    this.parent.appendChild(this.caliper);
    this.parent.appendChild(this.vernier);
    document.body.appendChild(this.parent);
  }
  /**
   * @description: 销毁计算宽度dom
   * @return {*}
   */
  removeDom() {
    var _a;
    if (!this.parent) {
      return;
    }
    (_a = this.parent) == null ? void 0 : _a.remove();
    this.caliper = null;
    this.vernier = null;
    this.parent = null;
  }
  clearWidth() {
    this.width = 0;
  }
  /**
   * @description: 计算
   * @param {*} str
   * @param {*} style
   * @return {*}
   */
  calcMetrics(strInfo, style) {
    let fontInfo = this.localMetrics(strInfo, style);
    this.width += Number(fontInfo.width) / BASE_SCALE;
    return fontInfo;
  }
  /**
   * @description: 插入字符 计算宽高
   * @return {*}
   */
  localMetrics(strInfo, style) {
    if (fontCache.getEntry({ ...strInfo })) {
      let info = fontCache.getEntry(strInfo);
      return {
        ...info,
        ...strInfo
      };
    }
    const { fontFamily, fontSize, fontStyle, fontVariant, fontWeight, textDecoration, lineHeight } = strInfo;
    this.caliper.innerText = strInfo.text;
    this.setAttr(this.caliper, {
      fontFamily,
      fontSize,
      lineHeight,
      fontStyle,
      fontVariant,
      fontWeight,
      textDecoration,
      "white-space": "pre"
    });
    let caliperTop = this.caliper.offsetTop;
    let vernierTop = this.vernier.offsetTop;
    let caliperWidth = this.caliper.offsetWidth;
    let caliperHeight = this.caliper.offsetHeight;
    let fontInfo = {
      ...strInfo,
      width: caliperWidth.toFixed(2),
      height: caliperHeight.toFixed(2),
      descent: (caliperHeight - (vernierTop - caliperTop)).toFixed(2),
      ascent: (vernierTop - caliperTop).toFixed(2)
    };
    fontCache.addEntry(fontInfo);
    return fontInfo;
  }
  /**
   * @description: 设置dom style
   * @param {HTMLElement} element 当前元素
   * @param {StyleObject} styleObj style 属性
   * @return {*}
   */
  setAttr(element, styleObj) {
    for (let prop in styleObj) {
      if (prop === "fontSize") {
        element.style.fontSize = parseInt(styleObj[prop], 10) * BASE_SCALE + "px";
      } else if (styleObj.hasOwnProperty(prop)) {
        element.style[prop] = styleObj[prop];
      }
    }
  }
  /**
  * @description: 数据合并 将经过拆分的 isSpill 合并回原数组
  * @param {*} data
  * @return {*}
  */
  concatLine(data) {
    let textData = deepClone(data);
    let resetTextData = [];
    textData.forEach((text) => {
      let lastIndex = resetTextData.length - 1;
      if (text.isSpill && resetTextData.length) {
        resetTextData[lastIndex].children.push(...text.children);
      } else {
        resetTextData.push(text);
      }
    });
    return resetTextData;
  }
}
const GET_TEXT_INFO = (editor) => {
  const cursorPositon = editor.selection;
  let index = -1;
  if (!cursorPositon) {
    return { index: 0, offset: 0 };
  }
  for (let i = 0; i < editor.children.length; i++) {
    index++;
    let textBlocks = editor.children[i].children;
    for (let j = 0; j < textBlocks.length; j++) {
      j !== 0 && index++;
      if (i === cursorPositon.focus.path[0] && j === cursorPositon.focus.path[1]) break;
    }
    if (i === cursorPositon.focus.path[0]) break;
  }
  return {
    index,
    offset: cursorPositon == null ? void 0 : cursorPositon.focus.offset
  };
};
const GET_CONCAT_CURSOR = (resetTextData, textInfo) => {
  const { index, offset } = textInfo;
  console.log(resetTextData);
  let path3 = [-1, -1];
  let currentIndex = -1;
  for (let i = 0; i < resetTextData.length; i++) {
    path3[0]++;
    const children = resetTextData[i].children;
    for (let j = 0; j < children.length; j++) {
      currentIndex++;
      if (currentIndex === index) {
        path3[1] = j;
        break;
      }
    }
    if (currentIndex === index) break;
  }
  return {
    path: path3,
    offset
  };
};
const GET_CURSOR_INDEX = (editor) => {
  var _a, _b;
  let index = 0;
  const [x2, y2] = (_a = editor.selection) == null ? void 0 : _a.anchor.path;
  for (let i = 0; i <= x2; i++) {
    const children = editor.children[i].children;
    for (let j = 0; j < children.length; j++) {
      if (j === y2 && i === x2) {
        break;
      }
      index += children[j]["text"].length;
    }
  }
  return index + ((_b = editor.selection) == null ? void 0 : _b.anchor.offset);
};
const GET_CURSOR_PATH = (data, index, editor) => {
  if (!editor.selection) return {
    anchor: {
      path: [0, 0],
      offset: 0
    },
    focus: {
      path: [0, 0],
      offset: 0
    }
  };
  console.log(Range.isCollapsed(editor.selection));
  if (!Range.isCollapsed(editor.selection)) {
    return editor.selection;
  }
  if (Editor.isStart(editor, editor.selection.anchor, [])) {
    return {
      anchor: {
        path: [0, 0],
        offset: 0
      },
      focus: {
        path: [0, 0],
        offset: 0
      }
    };
  }
  let textLen = 0;
  let pathX = 0, pathY = 0, offset = 0;
  for (let i = 0; i < data.length; i++) {
    let children = data[i].children;
    for (let childIndex = 0; childIndex < children.length; childIndex++) {
      textLen += children[childIndex].text.length;
      if (textLen >= index) {
        pathX = i;
        pathY = childIndex;
        offset = children[childIndex].text.length - (textLen - index);
        break;
      }
    }
    if (pathX || pathY || offset) break;
  }
  return {
    anchor: {
      path: [pathX, pathY],
      offset
    },
    focus: {
      path: [pathX, pathY],
      offset
    }
  };
};
var fontfaceobserver_standalone = { exports: {} };
(function(module) {
  (function() {
    function p2(a, c) {
      document.addEventListener ? a.addEventListener("scroll", c, false) : a.attachEvent("scroll", c);
    }
    function u2(a) {
      document.body ? a() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function b() {
        document.removeEventListener("DOMContentLoaded", b);
        a();
      }) : document.attachEvent("onreadystatechange", function g() {
        if ("interactive" == document.readyState || "complete" == document.readyState) document.detachEvent("onreadystatechange", g), a();
      });
    }
    function w2(a) {
      this.g = document.createElement("div");
      this.g.setAttribute("aria-hidden", "true");
      this.g.appendChild(document.createTextNode(a));
      this.h = document.createElement("span");
      this.i = document.createElement("span");
      this.m = document.createElement("span");
      this.j = document.createElement("span");
      this.l = -1;
      this.h.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
      this.i.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
      this.j.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
      this.m.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";
      this.h.appendChild(this.m);
      this.i.appendChild(this.j);
      this.g.appendChild(this.h);
      this.g.appendChild(this.i);
    }
    function x2(a, c) {
      a.g.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:" + c + ";";
    }
    function B2(a) {
      var c = a.g.offsetWidth, b = c + 100;
      a.j.style.width = b + "px";
      a.i.scrollLeft = b;
      a.h.scrollLeft = a.h.scrollWidth + 100;
      return a.l !== c ? (a.l = c, true) : false;
    }
    function C2(a, c) {
      function b() {
        var e2 = g;
        B2(e2) && null !== e2.g.parentNode && c(e2.l);
      }
      var g = a;
      p2(a.h, b);
      p2(a.i, b);
      B2(a);
    }
    function D2(a, c, b) {
      c = c || {};
      b = b || window;
      this.family = a;
      this.style = c.style || "normal";
      this.weight = c.weight || "normal";
      this.stretch = c.stretch || "normal";
      this.context = b;
    }
    var E2 = null, F2 = null, G2 = null, H2 = null;
    function I2(a) {
      null === F2 && (M2(a) && /Apple/.test(window.navigator.vendor) ? (a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent), F2 = !!a && 603 > parseInt(a[1], 10)) : F2 = false);
      return F2;
    }
    function M2(a) {
      null === H2 && (H2 = !!a.document.fonts);
      return H2;
    }
    function N2(a, c) {
      var b = a.style, g = a.weight;
      if (null === G2) {
        var e2 = document.createElement("div");
        try {
          e2.style.font = "condensed 100px sans-serif";
        } catch (q2) {
        }
        G2 = "" !== e2.style.font;
      }
      return [b, g, G2 ? a.stretch : "", "100px", c].join(" ");
    }
    D2.prototype.load = function(a, c) {
      var b = this, g = a || "BESbswy", e2 = 0, q2 = c || 3e3, J2 = (/* @__PURE__ */ new Date()).getTime();
      return new Promise(function(K2, L2) {
        if (M2(b.context) && !I2(b.context)) {
          var O2 = new Promise(function(r2, t2) {
            function h() {
              (/* @__PURE__ */ new Date()).getTime() - J2 >= q2 ? t2(Error("" + q2 + "ms timeout exceeded")) : b.context.document.fonts.load(N2(b, '"' + b.family + '"'), g).then(function(n2) {
                1 <= n2.length ? r2() : setTimeout(h, 25);
              }, t2);
            }
            h();
          }), P2 = new Promise(function(r2, t2) {
            e2 = setTimeout(function() {
              t2(Error("" + q2 + "ms timeout exceeded"));
            }, q2);
          });
          Promise.race([P2, O2]).then(function() {
            clearTimeout(e2);
            K2(b);
          }, L2);
        } else u2(function() {
          function r2() {
            var d;
            if (d = -1 != k2 && -1 != l2 || -1 != k2 && -1 != m2 || -1 != l2 && -1 != m2) (d = k2 != l2 && k2 != m2 && l2 != m2) || (null === E2 && (d = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), E2 = !!d && (536 > parseInt(d[1], 10) || 536 === parseInt(d[1], 10) && 11 >= parseInt(d[2], 10))), d = E2 && (k2 == y2 && l2 == y2 && m2 == y2 || k2 == z2 && l2 == z2 && m2 == z2 || k2 == A2 && l2 == A2 && m2 == A2)), d = !d;
            d && (null !== f.parentNode && f.parentNode.removeChild(f), clearTimeout(e2), K2(b));
          }
          function t2() {
            if ((/* @__PURE__ */ new Date()).getTime() - J2 >= q2) null !== f.parentNode && f.parentNode.removeChild(f), L2(Error("" + q2 + "ms timeout exceeded"));
            else {
              var d = b.context.document.hidden;
              if (true === d || void 0 === d) k2 = h.g.offsetWidth, l2 = n2.g.offsetWidth, m2 = v2.g.offsetWidth, r2();
              e2 = setTimeout(t2, 50);
            }
          }
          var h = new w2(g), n2 = new w2(g), v2 = new w2(g), k2 = -1, l2 = -1, m2 = -1, y2 = -1, z2 = -1, A2 = -1, f = document.createElement("div");
          f.dir = "ltr";
          x2(h, N2(b, "sans-serif"));
          x2(n2, N2(b, "serif"));
          x2(v2, N2(b, "monospace"));
          f.appendChild(h.g);
          f.appendChild(n2.g);
          f.appendChild(v2.g);
          b.context.document.body.appendChild(f);
          y2 = h.g.offsetWidth;
          z2 = n2.g.offsetWidth;
          A2 = v2.g.offsetWidth;
          t2();
          C2(h, function(d) {
            k2 = d;
            r2();
          });
          x2(h, N2(b, '"' + b.family + '",sans-serif'));
          C2(n2, function(d) {
            l2 = d;
            r2();
          });
          x2(n2, N2(b, '"' + b.family + '",serif'));
          C2(v2, function(d) {
            m2 = d;
            r2();
          });
          x2(v2, N2(b, '"' + b.family + '",monospace'));
        });
      });
    };
    module.exports = D2;
  })();
})(fontfaceobserver_standalone);
var fontfaceobserver_standaloneExports = fontfaceobserver_standalone.exports;
const FontFaceObserver = /* @__PURE__ */ getDefaultExportFromCjs(fontfaceobserver_standaloneExports);
const config = [
  {
    fontName: "宋体",
    version: "1.0",
    fileName: "simsun",
    fontFamily: "SimSun"
  },
  {
    fontName: "方正准圆简体",
    version: "1.0",
    fileName: "simFZzhunyuan",
    fontFamily: "SimFZzhunyuan",
    downgrade: ["SimSun"]
  },
  {
    fontName: "方正粗圆简体",
    version: "1.0",
    fileName: "simFZcuyuan",
    fontFamily: "SimFZcuyuan",
    downgrade: ["SimSun"]
  }
];
const fontConfigList = config;
let enterLen = 0;
let paste = false;
let deleteFlag = false;
let standardTemplate = null;
let timer = null;
const EditInput = (props) => {
  const { id: id2, setDefaultName, mode, isSelect, ...others } = props;
  const splitStatus = reactExports.useRef(SPLIT_STATUS.NORMAL);
  let isCommand = reactExports.useRef(false);
  let isNotCommand = reactExports.useRef(false);
  const isInputMethod = reactExports.useRef(false);
  const cursorIndex = reactExports.useRef(0);
  const textInfo = reactExports.useRef(null);
  const [isFocused, setIsFocused] = reactExports.useState(0);
  const isStyleChange = reactExports.useRef(true);
  let inLineHightlight = reactExports.useRef(null);
  let inlineRange = reactExports.useRef(null);
  let rangeCount = reactExports.useRef(0);
  let slateTextRef = reactExports.useRef(null);
  let rangeStyle = reactExports.useRef(null);
  const [fontLoad, setFontLoad] = reactExports.useState(false);
  const isMount = reactExports.useRef(false);
  const observers = [];
  fontConfigList.forEach((font) => {
    const obs = new FontFaceObserver(font.fontFamily);
    observers.push(obs.load());
  });
  !fontLoad && Promise.all(observers).then(function(fonts) {
    console.info("字体已加载完毕", fonts);
    setFontLoad(true);
  }).catch(function(err) {
    console.warn("Some critical font are not available:", err);
  });
  const [editor] = reactExports.useState(() => withReact(createEditor()));
  const [initialValue, setInitialValue] = reactExports.useState(props.data ? JSON.parse(props.data) : [
    // 初始化数据
    {
      type: "paragraph",
      children: [{ text: "" }]
    }
  ]);
  if (!standardTemplate) {
    standardTemplate = new StandardTemplate();
  }
  const { registerInstance, instanceMap, uninstallInstance } = props.useConnect([]);
  reactExports.useEffect(() => {
    registerInstance(id2, {
      remove: () => {
        uninstallInstance(id2);
      },
      ...props
    });
    if (mode === "edit") {
      setDefaultName(instanceMap, props["x-component"]);
    }
  }, [registerInstance, id2, uninstallInstance]);
  const mergeLetter = () => {
    if (splitStatus.current === SPLIT_STATUS.CONCAT) {
      return;
    }
    !textInfo.current && (textInfo.current = GET_TEXT_INFO(editor));
    splitStatus.current = SPLIT_STATUS.CONCAT;
    let data = standardTemplate.concatLine(editor.children);
    let cursorParams = GET_CONCAT_CURSOR(data, textInfo.current);
    insertNode2(data);
    Transforms.setSelection(editor, {
      anchor: cursorParams,
      focus: cursorParams
    });
  };
  reactExports.useEffect(() => {
    isMount.current && onKeyUpOver();
    isMount.current = true;
  }, [props.style.width]);
  const insertNode2 = (data) => {
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, [])
    });
    Editor.deleteFragment(editor);
    const newArray = data.map((element) => {
      return {
        ...element,
        children: element.children.map((item, index) => {
          return {
            ...item,
            // 复制原有的属性
            key: index
          };
        })
      };
    });
    Transforms.insertNodes(editor, newArray, { at: [0] });
    Transforms.splitNodes(editor);
    Transforms.removeNodes(editor, {
      at: Editor.end(editor, [])
    });
  };
  const onKeyUpOver = (isEnd2 = false) => {
    if (isInputMethod.current) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    if (!isEnd2) {
      mergeLetter();
    }
    timer = setTimeout(() => {
      splitStatus.current = SPLIT_STATUS.NORMAL;
      cursorIndex.current = GET_CURSOR_INDEX(editor);
      setInitialValue(editor.children);
    }, KEYUP_TIME);
  };
  reactExports.useEffect(() => {
    const compositionStart = () => {
      if (timer) {
        clearTimeout(timer);
      }
      isInputMethod.current = true;
      mergeLetter();
    };
    const compositionEnd = (event) => {
      isInputMethod.current = false;
      onKeyUpOver();
    };
    const updatePaste = () => {
      enterLen = 0;
      paste = true;
    };
    document.addEventListener("paste", updatePaste);
    document.addEventListener("compositionstart", compositionStart);
    document.addEventListener("compositionend", compositionEnd);
    return () => {
      document.removeEventListener("paste", updatePaste);
      document.removeEventListener("compositionstart", compositionStart);
      document.removeEventListener("compositionend", compositionEnd);
    };
  }, []);
  reactExports.useEffect(() => {
    console.log(isSelect, 456);
    if (!isSelect) {
      Transforms.setSelection(editor, {
        anchor: Editor.end(editor, []),
        focus: Editor.end(editor, [])
      });
      if (CSS && CSS.highlights) {
        CSS.highlights.clear();
      }
    }
  }, [isSelect]);
  reactExports.useEffect(() => {
    if (!editor.selection) return;
    if (!isStyleChange.current) {
      isStyleChange.current = true;
      return;
    }
    if (isSelect && !isFocused && Range.isCollapsed(editor.selection)) {
      Transforms.select(editor, {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, [])
      });
      return;
    }
    editor && CustomEditor.SetFontStyle(editor, props.style, rangeStyle.current);
  }, [props.style]);
  const calculateParagraph = () => {
    standardTemplate.initCalcDom();
    const arr = standardTemplate.splitGlobalText(editor.children, []);
    const info = standardTemplate.reorganizeData(arr);
    const width = props.style.width.replace("px", "");
    const data = standardTemplate.composeLine(info, Number(width));
    return data;
  };
  reactExports.useEffect(() => {
    if (splitStatus.current === SPLIT_STATUS.CONCAT || !fontLoad) return;
    const data = calculateParagraph();
    let position = GET_CURSOR_PATH(data, cursorIndex.current, editor);
    insertNode2(data);
    position = trackSelection(position);
    if (enterLen) {
      position = {
        anchor: {
          path: [enterLen, 0],
          offset: 0
        },
        focus: {
          path: [enterLen, 0],
          offset: 0
        }
      };
    }
    Transforms.setSelection(editor, position);
    textInfo.current = null;
    CustomEditor.setFontSize(editor);
  }, [initialValue, fontLoad]);
  const trackSelection = (position) => {
    if (!Range.isCollapsed(position)) {
      let x2, y2, path3, offset;
      let count = rangeCount.current;
      path3 = Range.isBackward(position) ? position.focus.path : position.anchor.path;
      offset = Range.isBackward(position) ? position.focus.offset : position.anchor.offset;
      for (let i = path3[0]; i < editor.children.length; i++) {
        const textChildren = editor.children[i].children;
        for (let j = i === path3[0] ? path3[1] : 0; j < textChildren.length; j++) {
          const textLen = textChildren[j].text.length;
          const baseLen = i === path3[0] && j === path3[1] ? offset : 0;
          if (baseLen + count <= textLen) {
            offset = baseLen + count;
            x2 = i;
            y2 = j;
            count = 0;
            break;
          } else {
            count = baseLen + count - textLen;
          }
        }
        if (!count) break;
      }
      position = {
        focus: Range.isBackward(position) ? position.focus : position.anchor,
        anchor: { path: [x2, y2], offset }
      };
      if (!Editor.isStart(editor, position.anchor, [])) {
        try {
          setTimeout(() => {
            inlineRange.current = ReactEditor.toDOMRange(editor, position);
            if (inlineRange.current) {
              inLineHightlight.current = new Highlight(inlineRange.current);
              CSS.highlights.set("range-selected", inLineHightlight.current);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    return position;
  };
  const renderElement = reactExports.useCallback((props2) => {
    switch (props2.element.type) {
      case "code":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CodeElement, { ...props2 });
      case "paragraph":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultElement2, { ...props2 });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unknown Element" });
    }
  }, []);
  const renderLeaf = reactExports.useCallback((props2) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf2, { ...props2 });
  }, []);
  const Leaf2 = (props2) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        ...props2.attributes,
        style: {
          color: props2.leaf.color,
          fontSize: props2.leaf.fontSize,
          fontWeight: props2.leaf.fontWeight,
          fontStyle: props2.leaf.fontStyle,
          lineHeight: props2.leaf.lineHeight,
          textDecoration: props2.leaf.textDecoration,
          fontFamily: props2.leaf.fontFamily || "SimFZzhunyuan,SimSun"
        },
        children: props2.children
      }
    );
  };
  const CodeElement = (props2) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { ...props2.attributes, children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: props2.children }) });
  };
  const DefaultElement2 = (elementProps) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        ...elementProps.attributes,
        children: elementProps.children
      }
    );
  };
  const getCurrentStyle = () => {
    const editorElement = slateTextRef.current;
    let propsHeight = props.style.height ? props.style.height.replace("px", "") : "0";
    let height = Number(propsHeight) > editorElement.clientHeight ? props.style.height : editorElement.clientHeight + "px";
    let style2 = Editor.marks(editor);
    style2 = {
      ...style2,
      height
    };
    props.getStyle(style2);
    rangeStyle.current = { ...style2 };
    isStyleChange.current = false;
  };
  const { treeNodeProps, style } = props;
  const onChange = (value) => {
    props.setData(JSON.stringify(editor.children));
    getCurrentStyle();
    rangeCount.current = Editor.string(editor, editor.selection).length;
    if (splitStatus.current === SPLIT_STATUS.CONCAT) {
      return;
    }
    splitStatus.current = SPLIT_STATUS.NORMAL;
    if (!areObjectsEqual(value, initialValue)) {
      if (paste || deleteFlag) {
        textInfo.current = GET_TEXT_INFO(editor);
        mergeLetter();
        cursorIndex.current = GET_CURSOR_INDEX(editor);
        splitStatus.current = SPLIT_STATUS.NORMAL;
        paste = false;
        deleteFlag = false;
        textInfo.current = null;
      }
      setInitialValue(value);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...treeNodeProps, style: { width: style.width, height: style.height || "auto", fontSize: "16px", transform: style.transform, position: "absolute", textAlign: style.textAlign }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: slateTextRef, className: "rich-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Slate, { editor, initialValue, onChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Editable,
    {
      "data-is-focused": isFocused,
      renderElement,
      placeholder: "请输入文字",
      renderLeaf,
      onDoubleClick: () => {
        ReactEditor.focus(editor);
        if (isFocused) return;
        Transforms.setSelection(editor, {
          anchor: Editor.end(editor, []),
          focus: Editor.end(editor, [])
        });
        setIsFocused(1);
      },
      onBlur: () => {
        if (!Range.isCollapsed(editor.selection)) {
          if (!Editor.isStart(editor, editor.selection.anchor, [])) {
            try {
              setTimeout(() => {
                inlineRange.current = ReactEditor.toDOMRange(editor, editor.selection);
                if (inlineRange.current) {
                  inLineHightlight.current = new Highlight(inlineRange.current);
                  CSS.highlights.set("range-selected", inLineHightlight.current);
                }
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
        setIsFocused(0);
      },
      onKeyUp: (event) => {
        if (event.metaKey || event.altKey || event.ctrlKey) {
          isCommand.current = true;
          return;
        }
        if (!isNotCommand.current) {
          return;
        }
        if (KEY_CODE_LIST.includes(KEY_CODE_EVENT(event))) {
          return;
        }
        onKeyUpOver(true);
      },
      onKeyDown: (event) => {
        enterLen = 0;
        if (event.metaKey || event.altKey || event.ctrlKey) {
          isCommand.current = true;
          isNotCommand.current = false;
          return;
        }
        isNotCommand.current = true;
        const { focus: focus2, anchor } = editor.selection;
        const isSelectionDiff = areObjectsEqual(focus2, anchor);
        !isSelectionDiff && (deleteFlag = true);
        if (event.key === "Enter") {
          enterLen = focus2.path[0] + 1;
        }
        if (!isSelectionDiff) {
          return;
        }
        if (!KEY_CODE_LIST.includes(KEY_CODE_EVENT(event))) {
          mergeLetter();
          return;
        }
      }
    }
  ) }) }) });
};
const ViewInput = (props) => {
  const {
    id: id2,
    setDefaultName,
    initStyleProps,
    // 预览端使用-初始样式
    styleMapProps
    // 预览端使用
  } = props;
  const styleItem = styleMapProps && styleMapProps[id2] || {};
  const { registerInstance, instanceMap, uninstallInstance } = props.useConnect([]);
  reactExports.useEffect(() => {
    registerInstance(id2, {
      remove: () => {
        uninstallInstance(id2);
      },
      ...props
    });
    props.mode === "edit" && setDefaultName(instanceMap, props["x-component"]);
  }, []);
  const supportedStyles = {
    "fontFamily": "font-family",
    "fontSize": "font-size",
    "fontStyle": "font-style",
    "fontVariant": "font-variant",
    "lineHeight": "line-height",
    "fontWeight": "font-weight",
    "color": "color",
    "textDecoration": "text-decoration"
  };
  const supportedTags = {
    "paragraph": "p"
  };
  const serialize = (node3) => {
    if (Array.isArray(node3)) {
      return node3.map((child) => serialize(child)).join("");
    }
    let style2 = 'style="';
    Object.keys(node3).forEach((key) => {
      if (supportedStyles[key]) style2 += `${supportedStyles[key]}: ${node3[key]};`;
    });
    style2 += '"';
    if (node3.children) {
      if (node3.children.length === 1 && !node3.children.text) {
        return `<${supportedTags[node3.type]} class="styled-span">${serialize(node3.children)}</${supportedTags[node3.type]}>`;
      }
      return `<${supportedTags[node3.type]}>${serialize(node3.children)}</${supportedTags[node3.type]}>`;
    }
    return `<span ${style2}>${node3.text}</span>`;
  };
  const { style } = props;
  const data = props.data ? JSON.parse(props.data) : [
    // 初始化数据
    {
      type: "paragraph",
      children: [{ text: "" }]
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "preview-id": id2,
      className: "rich-text",
      style: {
        width: style.width,
        height: style.height,
        transform: style.transform,
        position: "absolute",
        textAlign: style.textAlign,
        ...initStyleProps,
        ...styleItem
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%" }, dangerouslySetInnerHTML: { __html: serialize(data) } })
    }
  );
};
const RichTextComponent = (props) => {
  return props.mode === "edit" ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditInput, { ...props }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ViewInput, { ...props });
};
const Group = (props) => {
  const { id: id2, children, mode, setDefaultName, styleMapProps, style, treeNodeProps, initStyleProps, className } = props;
  const styleItem = styleMapProps && styleMapProps[id2] || {};
  const { registerInstance, instanceMap, uninstallInstance } = props.useConnect([]);
  reactExports.useEffect(() => {
    registerInstance(id2, {
      remove: () => {
        uninstallInstance(id2);
      },
      ...props
    });
    mode === "edit" && setDefaultName(instanceMap, props["x-component"]);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: mode === "edit" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...treeNodeProps, className, style: { position: "absolute", ...style }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%" }, children }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "preview-id": id2, style: { position: "absolute", ...style, ...initStyleProps, ...styleItem }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%" }, children }) }) });
};
const ErrorBoundaryContext = reactExports.createContext(null);
const initialState = {
  didCatch: false,
  error: null
};
let ErrorBoundary$1 = class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.state = initialState;
  }
  static getDerivedStateFromError(error) {
    return {
      didCatch: true,
      error
    };
  }
  resetErrorBoundary() {
    const {
      error
    } = this.state;
    if (error !== null) {
      var _this$props$onReset, _this$props;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_this$props$onReset = (_this$props = this.props).onReset) === null || _this$props$onReset === void 0 ? void 0 : _this$props$onReset.call(_this$props, {
        args,
        reason: "imperative-api"
      });
      this.setState(initialState);
    }
  }
  componentDidCatch(error, info) {
    var _this$props$onError, _this$props2;
    (_this$props$onError = (_this$props2 = this.props).onError) === null || _this$props$onError === void 0 ? void 0 : _this$props$onError.call(_this$props2, error, info);
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      didCatch
    } = this.state;
    const {
      resetKeys
    } = this.props;
    if (didCatch && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
      var _this$props$onReset2, _this$props3;
      (_this$props$onReset2 = (_this$props3 = this.props).onReset) === null || _this$props$onReset2 === void 0 ? void 0 : _this$props$onReset2.call(_this$props3, {
        next: resetKeys,
        prev: prevProps.resetKeys,
        reason: "keys"
      });
      this.setState(initialState);
    }
  }
  render() {
    const {
      children,
      fallbackRender,
      FallbackComponent,
      fallback
    } = this.props;
    const {
      didCatch,
      error
    } = this.state;
    let childToRender = children;
    if (didCatch) {
      const props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (typeof fallbackRender === "function") {
        childToRender = fallbackRender(props);
      } else if (FallbackComponent) {
        childToRender = reactExports.createElement(FallbackComponent, props);
      } else if (fallback !== void 0) {
        childToRender = fallback;
      } else {
        throw error;
      }
    }
    return reactExports.createElement(ErrorBoundaryContext.Provider, {
      value: {
        didCatch,
        error,
        resetErrorBoundary: this.resetErrorBoundary
      }
    }, childToRender);
  }
};
function hasArrayChanged() {
  let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}
function withErrorBoundary(component, errorBoundaryProps) {
  const Wrapped = reactExports.forwardRef((props, ref) => reactExports.createElement(ErrorBoundary$1, errorBoundaryProps, reactExports.createElement(component, {
    ...props,
    ref
  })));
  const name = component.displayName || component.name || "Unknown";
  Wrapped.displayName = "withErrorBoundary(".concat(name, ")");
  return Wrapped;
}
const widgets = {
  Group,
  Video: VideoComponent,
  RichText: RichTextComponent,
  Game: ({ gameUrl, gameId }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {});
  },
  Camera: () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {});
  },
  Shape: ShapeComponent,
  Img: ImageComponent
  // B: ({ useConnect, useReport, useEventStore, title, id }) => {
  //     const {
  //         instanceMap,
  //         registerInstance,
  //     } = useConnect(['aaa']);
  //     const {
  //         resourceList,
  //         resourceReport,
  //         ReportStatus,
  //         ResourceStatus
  //     } = useReport();
  //     // https://hox.js.org/zh/guide/performance 组件本身不响应状态更新，由外部信令通过 register 注册的逻辑来控制
  //     const { registerMsg } = useEventStore(() => [])
  //     // 组件中的指令注册
  //     const { notice, register } = registerMsg(id, 'pause', 'event')
  //     const { notice: notice2, register: register2 } = registerMsg(id, 'finished', 'state')
  //     useEffect(() => {
  //         register((msgInfo) => {
  //             console.log('file: index.tsx:42 ~ register ~ msgInfo: 状态展示', msgInfo)
  //             // 按照接收到的信息 执行【事件】或【状态变动】，还原组件事件 或 状态展示
  //         })
  //         register2((msgInfo) => {
  //             console.log('file: index.tsx:42 ~ register2 ~ msgInfo:', msgInfo)
  //             // 按照接收到的信息 执行【事件】或【状态变动】，还原组件事件 或 状态展示
  //         })
  //     }, [])
  //     window.setTimeout(() => {
  //         notice({"test":"这是一条测试数据111"})
  //     }, 1000)
  //     // notice 在特定【事件】或【状态变动】时调用
  //     // register 接收学生端接收到【事件】或【状态变动】 的处理函数 
  //     const [s, forceUpdate] = useReducer((preState) => {
  //         return preState + 1;
  //     }, 0);
  //     useEffect(() => {
  //         registerInstance(id, { forceUpdate });
  //     }, []);
  //     console.log('instanceMap: B');
  //     const handleClick = () => {
  //         notice2({ "test":"这是一条测试数据222" });
  //     }
  //     return (
  //         <b title={title} onClick={handleClick}>
  //             {id} {s}
  //         </b>
  //     );
  // },
  // I: ({ useConnect, useReport, title, content }) => {
  //     // 当 instanceMap 变动时会重新渲染
  //     const {
  //         instanceMap,
  //         registerInstance,
  //     } = useConnect(['bbb']);
  //     const {
  //         resourceList,
  //         resourceReport,
  //         ReportStatus,
  //         ResourceStatus
  //     } = useReport();
  //     // 这里是模拟组件执行过程中出错的情况
  //     // throw new Error('error');
  //     window.resourceReport = resourceReport;
  //     console.log('instanceMap: I');
  //     return <i title={title}>{content}</i>;
  // },
  // P: (props) => <p title={props.title}>{props.content}</p>,
  // Em: (props) => <em title={props.title}>{props.content}</em>,
  // H1: (props) => <h1 title={props.title}>{props.content}</h1>,
  // H2: (props) => <h2 title={props.title}>{props.content}</h2>,
  // H3: (props) => <h3 title={props.title}>{props.content}</h3>,
  // H4: (props) => <h4 title={props.title}>{props.content}</h4>,
  // H5: (props) => <h5 title={props.title}>{props.content}</h5>,
  // H6: (props) => <h6 title={props.title}>{props.content}</h6>,
  // Strong: (props) => <strong title={props.title}>{props.content}</strong>,
  // ErrorSchema: (props) => <strong>{props.content}</strong>,
};
const buildInWidgets = Object.keys(widgets).reduce((acc, key) => {
  acc[key] = withErrorBoundary(widgets[key], {
    FallbackComponent: ({ error, resetErrorBoundary }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "alert", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Something went wrong:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetErrorBoundary, children: "Try again" })
    ] }),
    onError: (error, info) => {
      console.log(error, info);
    }
  });
  return acc;
}, {});
const nodeSchemaToNode = (nodeSchema2) => {
  return {
    id: nodeSchema2.id,
    "ui:widget": nodeSchema2.componentName,
    sourceName: nodeSchema2.sourceName,
    props: nodeSchema2.props,
    hidden: nodeSchema2.hidden
  };
};
const nodeSchemaToSchema = (nodeSchema2) => {
  const schema2 = nodeSchemaToNode(nodeSchema2);
  if (nodeSchema2.children) {
    schema2.properties = {};
    nodeSchema2.children.forEach((child) => {
      schema2.properties[child.id] = nodeSchemaToSchema(child);
    });
  }
  return schema2;
};
const emptySchema = {
  "ui:widget": "Div",
  "props": {},
  "properties": {},
  "id": ""
};
class ErrorBoundary2 extends React$1.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error(error);
    console.error("In component:", info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "An error occurred loading ",
        this.props.name,
        ". Please refresh and try again."
      ] });
    }
    return this.props.children;
  }
}
const renderItem = (props) => {
  const { schema, key, path: path3, rootPath, activePageId, pageId } = props;
  let child = null;
  if ((schema == null ? void 0 : schema.properties) && (schema == null ? void 0 : schema.widgetType) !== "field") {
    child = RenderCore({ schema, parentPath: path3, rootPath });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FieldItem,
    {
      schema,
      path: path3,
      rootPath,
      children: child,
      renderCore: RenderCore,
      activePageId,
      pageId
    },
    key
  );
};
const RenderCore = (props) => {
  const { schema, parentPath = [], rootPath = [], activePageId, pageId } = props;
  if (!schema || Object.keys(schema).length === 0) {
    return null;
  }
  const properties = sortProperties(Object.entries(schema.properties || {}));
  return properties.map(([key, item]) => {
    const path3 = [...parentPath, key];
    return renderItem({ schema: item, path: path3, key, rootPath, activePageId, pageId });
  });
};
const RenderRoot = withProvider(RenderCore, buildInWidgets);
class Page {
  constructor() {
    __publicField(this, "id");
    __publicField(this, "pageInfo");
    __publicField(this, "pageType");
    __publicField(this, "resourceList", []);
    this.id = "";
    this.pageInfo = {};
    this.pageType = -1;
    this.resourceList = [];
  }
  init(page) {
    console.log("Page constructor");
    this.id = page.id;
    this.pageInfo = page.pageInfo;
    this.pageType = page.pageType;
    console.log("Page init");
    const imgComponents = this.getComponent("Img", page.pageInfo).map((item) => {
      item.loaded = false;
      return item;
    });
    this.resourceList.push(...imgComponents);
  }
  // 获取组件 type 
  getComponent(componentName, pageInfo) {
    const components = [];
    const children = pageInfo.children;
    if (pageInfo.componentName === componentName) {
      if (componentName === "Img" || componentName === "Video") {
        if (pageInfo.props.src && pageInfo.props.src.length > 0) {
          components.push(pageInfo);
        }
      } else {
        components.push(pageInfo);
      }
    }
    if (children && children.length > 0) {
      children.forEach((child) => {
        if (child.componentName === componentName) {
          components.push(...this.getComponent(componentName, child));
        }
      });
    }
    return components;
  }
  loadResource() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const needLoadList = this.resourceList.filter((item) => !item.loaded);
        if (needLoadList.length === 0) {
          console.log("资源加载完成");
          clearInterval(interval);
          resolve(true);
        } else {
          this.checkResource();
        }
      }, 1e3);
    });
  }
  checkResource() {
    for (let i = 0; i < this.resourceList.length; i++) {
      const element = this.resourceList[i];
      if (element.componentName === "Img" && !element.loaded) {
        const imgComponent = document.querySelector(`[preview-id="${element.id}"]`);
        if (imgComponent) {
          const img = imgComponent.querySelector("img");
          if (img) {
            if (img.complete) {
              console.log("图片已经加载完成");
              element.loaded = true;
            }
          } else {
            element.loaded = true;
          }
        }
      }
    }
  }
}
console.log("userAgent", navigator.userAgent);
const screenshot = async () => {
  console.log("status loaded");
  setTimeout(async () => {
    if (window.generateScreenShot) {
      await window.generateScreenShot();
    }
  }, 100);
};
const Resource = React$1.memo(function(props) {
  const { content } = props;
  const pageRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    async function loadResource() {
      try {
        if (Object.keys(content).length === 0) return;
        console.log("file: App.tsx:86 ~ Resource ~ content:", content);
        if (!pageRef.current) {
          pageRef.current = new Page();
        }
        pageRef.current.init(content);
        const isLoaded = await pageRef.current.loadResource();
        console.log("isLoaded", isLoaded);
        if (isLoaded) {
          const previewDom = document.querySelector("#preview");
          const backgroundImage = getComputedStyle(previewDom).getPropertyValue("background-image");
          if (backgroundImage.indexOf("url") > -1) {
            const url = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)[1];
            const image = new Image();
            image.src = url;
            image.onload = async function() {
              console.log("image loaded");
              await screenshot();
            };
          } else {
            await screenshot();
          }
        }
      } catch (error) {
        console.log("file: App.tsx:84 ~ loadResource ~ error:", error);
      }
    }
    loadResource();
  }, [content]);
  return null;
});
const App = function() {
  const path3 = "https://qiqi2-1329132138.cos.ap-beijing.myqcloud.com/";
  const cdnPathList = [path3];
  const [content, setContent] = reactExports.useState({});
  const fileList = reactExports.useRef([]);
  console.log(3);
  const [pageInfo, setPageInfo] = reactExports.useState(emptySchema);
  const globalConfig = {
    resourceData: {
      remote: {
        cdnPathList
      }
    }
  };
  reactExports.useEffect(() => {
    const loadData = () => {
      try {
        console.log("file: App.tsx:120 ~ loadData ~ window:", window.json);
        const jsonData = JSON.parse(window.json);
        console.log("file: App.tsx:119 ~ loadData ~ jsonData:", jsonData);
        const { fileResourceDtoList, mainContentStructure } = jsonData;
        fileList.current = fileResourceDtoList;
        const content2 = mainContentStructure;
        setContent(() => content2);
        const schema = nodeSchemaToSchema(content2.pageInfo);
        if (schema.props && schema.props.style && schema.props.style.backgroundImage) {
          const backgroundImage = schema.props.style.backgroundImage;
          const style = { backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" };
          const file = fileList.current.find((item) => item.fileMd5 === backgroundImage);
          if (file) {
            style.backgroundImage = `url(${cdnPathList[0] + file.cosFullPath})`;
            schema.props.style = { ...schema.props.style, ...style };
          }
        }
        setPageInfo(() => schema);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    loadData();
  }, []);
  const Game = (props) => {
    const { id: id2, cover } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "preview-id": id2, style: { transform: "translate(0px, 0px) rotate(0deg)", height: "100%", width: "100%", border: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { style: { width: "100%", height: "100%" }, src: cover, alt: "" }) });
  };
  const Video = (props) => {
    const { id: id2, src } = props;
    const list = fileList.current;
    if (list.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {});
    const item = list.find((item2) => item2.fileMd5 === src);
    if (!item) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {});
    const url = cdnPathList[0] + item.videoScreenshotOssPath;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "preview-id": id2, style: { transform: "translate(0px, 0px) rotate(0deg)", height: "100%", width: "100%", border: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { style: { width: "100%", height: "100%" }, src: url, alt: "" }) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "preview", style: { width: "1280px", height: "960px", ...pageInfo.props.style }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    RenderRoot,
    {
      schema: pageInfo,
      widgets: { Game, Video },
      methods: {},
      globalProps: { fileList: fileList.current },
      globalConfig,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Resource, { content })
    }
  ) });
};
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(HoxRoot, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
//# sourceMappingURL=index-rjDtUwAc.js.map
