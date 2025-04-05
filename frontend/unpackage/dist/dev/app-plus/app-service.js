var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => {
  return (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
  var resume = (k, v, yes, no) => {
    try {
      var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
      Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
    } catch (e) {
      no(e);
    }
  };
  var method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no));
  var it = {};
  return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it;
};
var __yieldStar = (value) => {
  var obj = value[__knownSymbol("asyncIterator")];
  var isAwait = false;
  var method;
  var it = {};
  if (obj == null) {
    obj = value[__knownSymbol("iterator")]();
    method = (k) => it[k] = (x) => obj[k](x);
  } else {
    obj = obj.call(value);
    method = (k) => it[k] = (v) => {
      if (isAwait) {
        isAwait = false;
        if (k === "throw")
          throw v;
        return v;
      }
      isAwait = true;
      return {
        done: false,
        value: new __await(new Promise((resolve) => {
          var x = obj[k](v);
          if (!(x instanceof Object))
            throw TypeError("Object expected");
          resolve(x);
        }), 1)
      };
    };
  }
  return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
    throw x;
  }, "return" in obj && method("return"), it;
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);
if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  const UNI_STORAGE_LOCALE = "UNI_LOCALE";
  const I18N_JSON_DELIMITERS = ["%", "%"];
  const SCHEME_RE = /^([a-z-]+:)?\/\//i;
  const DATA_RE = /^data:.*,.*/;
  function hasLeadingSlash(str) {
    return str.indexOf("/") === 0;
  }
  function addLeadingSlash(str) {
    return hasLeadingSlash(str) ? str : "/" + str;
  }
  function once(fn, ctx = null) {
    let res;
    return (...args) => {
      if (fn) {
        res = fn.apply(ctx, args);
        fn = null;
      }
      return res;
    };
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const _imports_0$2 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$t = {
    data() {
      return {
        title: "会议系统",
        platformInfo: "检测中...",
        isMobile: false
      };
    },
    onLoad() {
      this.checkPlatformAndRedirect();
    },
    methods: {
      checkPlatformAndRedirect() {
        let platform2 = "未知平台";
        platform2 = "APP移动端";
        formatAppLog("log", "at pages/index/index.vue:47", "当前平台: APP端，将跳转到用户登录页面");
        this.platformInfo = platform2;
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/user/login"
          });
        }, 100);
      }
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("image", {
        class: "logo",
        src: _imports_0$2
      }),
      vue.createElementVNode("view", { class: "text-area" }, [
        vue.createElementVNode(
          "text",
          { class: "title" },
          vue.toDisplayString($data.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "platform-info" }, [
          vue.createElementVNode(
            "text",
            null,
            "当前平台: " + vue.toDisplayString($data.platformInfo),
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$t], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/index/index.vue"]]);
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject$2 = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject$2(val) && isFunction(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined")
      return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null)
      return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray = (thing) => {
    if (!thing)
      return null;
    if (isArray(thing))
      return thing;
    let i = thing.length;
    if (!isNumber(i))
      return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty$1 = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value))
        return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject$2(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject$2(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject: isObject$2,
    isPlainObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty: hasOwnProperty$1,
    hasOwnProp: hasOwnProperty$1,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap
  };
  function AxiosError(message, code, config2, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config2 && (this.config = config2);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
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
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config2, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config2, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path)
      return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value))
        return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = __spreadValues(__spreadValues({}, utils), platform$1);
  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__")
        return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
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
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const defaults$1 = defaults;
  const ignoreDuplicateOf = utils$1.toObjectSet([
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
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value))
      return;
    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isHeaders(header)) {
        for (const [key, value] of header.entries()) {
          setHeader(value, key, rewrite);
        }
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  }
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders);
  const AxiosHeaders$1 = AxiosHeaders;
  function transformData(fns, response) {
    const config2 = this || defaults$1;
    const context = response || config2;
    const headers = AxiosHeaders$1.from(context.headers);
    let data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config2, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError(message, config2, request) {
    AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config2, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError(
        "Request failed with status code " + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(null, args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? __spreadValues({}, thing) : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config3 = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
    });
    return config3;
  }
  const resolveConfig = (config2) => {
    const newConfig = mergeConfig({}, config2);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config2.params, config2.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    let contentType;
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if ((contentType = headers.getContentType()) !== false) {
        const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
        headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config2) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config2);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config2,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config2, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config2, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config2,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config2, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config2));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const composeSignals$1 = composeSignals;
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = function(iterable, chunkSize) {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(readStream(iterable)), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const chunk = temp.value;
          yield* __yieldStar(streamChunk(chunk, chunkSize));
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
    });
  };
  const readStream = function(stream) {
    return __asyncGenerator(this, null, function* () {
      if (stream[Symbol.asyncIterator]) {
        yield* __yieldStar(stream);
        return;
      }
      const reader = stream.getReader();
      try {
        for (; ; ) {
          const { done, value } = yield new __await(reader.read());
          if (done) {
            break;
          }
          yield value;
        }
      } finally {
        yield new __await(reader.cancel());
      }
    });
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      pull(controller) {
        return __async(this, null, function* () {
          try {
            const { done: done2, value } = yield iterator.next();
            if (done2) {
              _onFinish();
              controller.close();
              return;
            }
            let len = value.byteLength;
            if (onProgress) {
              let loadedBytes = bytes += len;
              onProgress(loadedBytes);
            }
            controller.enqueue(new Uint8Array(value));
          } catch (err) {
            _onFinish(err);
            throw err;
          }
        });
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
  const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
  const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : (str) => __async(this, null, function* () {
    return new Uint8Array(yield new Response(str).arrayBuffer());
  }));
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  const supportsRequestStream = isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const supportsResponseStream = isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config2) => {
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config2);
      });
    });
  })(new Response());
  const getBodyLength = (body) => __async(this, null, function* () {
    if (body == null) {
      return 0;
    }
    if (utils$1.isBlob(body)) {
      return body.size;
    }
    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (yield _request.arrayBuffer()).byteLength;
    }
    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$1.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$1.isString(body)) {
      return (yield encodeText(body)).byteLength;
    }
  });
  const resolveBodyLength = (headers, body) => __async(this, null, function* () {
    const length = utils$1.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  });
  const fetchAdapter = isFetchSupported && ((config2) => __async(this, null, function* () {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig(config2);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = yield resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = "credentials" in Request.prototype;
      request = new Request(url, __spreadProps(__spreadValues({}, fetchOptions), {
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      }));
      let response = yield fetch(request);
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = yield resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config2);
      !isStreamResponse && unsubscribe && unsubscribe();
      return yield new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config: config2,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError("Network Error", AxiosError.ERR_NETWORK, config2, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError.from(err, err && err.code, config2, request);
    }
  }));
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: fetchAdapter
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters2[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config2) {
    if (config2.cancelToken) {
      config2.cancelToken.throwIfRequested();
    }
    if (config2.signal && config2.signal.aborted) {
      throw new CanceledError(null, config2);
    }
  }
  function dispatchRequest(config2) {
    throwIfCancellationRequested(config2);
    config2.headers = AxiosHeaders$1.from(config2.headers);
    config2.data = transformData.call(
      config2,
      config2.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config2.method) !== -1) {
      config2.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config2.adapter || defaults$1.adapter);
    return adapter(config2).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config2);
      response.data = transformData.call(
        config2,
        config2.transformResponse,
        response
      );
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config2);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config2,
            config2.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION = "1.8.4";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        formatAppLog(
          "warn",
          "at node_modules/axios/lib/helpers/validator.js:43",
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      formatAppLog("warn", "at node_modules/axios/lib/helpers/validator.js:58", `${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    request(configOrUrl, config2) {
      return __async(this, null, function* () {
        try {
          return yield this._request(configOrUrl, config2);
        } catch (err) {
          if (err instanceof Error) {
            let dummy = {};
            Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
            const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
            try {
              if (!err.stack) {
                err.stack = stack;
              } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
                err.stack += "\n" + stack;
              }
            } catch (e) {
            }
          }
          throw err;
        }
      });
    }
    _request(configOrUrl, config2) {
      if (typeof configOrUrl === "string") {
        config2 = config2 || {};
        config2.url = configOrUrl;
      } else {
        config2 = configOrUrl || {};
      }
      config2 = mergeConfig(this.defaults, config2);
      const { transitional, paramsSerializer, headers } = config2;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config2.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config2.allowAbsoluteUrls !== void 0)
        ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config2.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config2.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config2, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config2.method = (config2.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config2.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config2.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config2);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config2;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config2) {
      config2 = mergeConfig(this.defaults, config2);
      const fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
      return buildURL(fullPath, config2.params, config2.paramsSerializer);
    }
  }
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config2) {
      return this.request(mergeConfig(config2 || {}, {
        method,
        url,
        data: (config2 || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config2) {
        return this.request(mergeConfig(config2 || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  const Axios$1 = Axios;
  class CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners)
          return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config2, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message, config2, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  }
  const CancelToken$1 = CancelToken;
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  const HttpStatusCode$1 = HttpStatusCode;
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance2 = bind(Axios$1.prototype.request, context);
    utils$1.extend(instance2, Axios$1.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance2, context, null, { allOwnKeys: true });
    instance2.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance2;
  }
  const axios = createInstance(defaults$1);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData;
  axios.AxiosError = AxiosError;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const config = {
    // 应用名称
    appName: "RPA会议系统",
    // API基础URL - 设置后端API地址
    apiBaseUrl: "http://182.92.115.169:8080",
    // 是否开启调试模式
    debug: {
      // 总开关，是否开启调试模式
      enabled: true,
      // 是否显示页面路径日志
      showPageLog: false,
      // 是否显示页面栈信息
      showPageStack: false,
      // 是否显示网络请求日志
      showNetworkLog: false,
      // 是否显示控制台警告信息
      showWarnings: false
    },
    // 默认页面路径
    defaultPage: "/pages/user/schedule",
    // 登录页面路径
    loginPage: "/pages/user/login",
    // 管理员登录页面路径
    adminLoginPage: "/pages/admin/login",
    // 上传文件配置
    upload: {
      // 文件大小限制（单位MB）
      maxSize: 10,
      // 允许上传的文件类型
      acceptFileTypes: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "jpg", "jpeg", "png", "txt"]
    },
    // 会议配置
    meeting: {
      // 预约会议的最小提前时间（单位分钟）
      minAdvanceTime: 30,
      // 会议最小时长（单位分钟）
      minDuration: 15,
      // 会议最大时长（单位分钟）
      maxDuration: 240
    },
    // 应用版本
    version: "1.0.0",
    // 请求超时设置（毫秒）
    requestTimeout: 3e4,
    // 网络配置
    network: {
      // 重试次数
      retryCount: 3,
      // 重试间隔（毫秒）
      retryDelay: 1e3,
      // 是否显示网络错误提示
      showErrorToast: true
    }
  };
  class ResultObject {
    constructor(code = 0, msg = "", data = null) {
      this.code = code;
      this.msg = msg;
      this.data = data;
    }
  }
  class Result {
    constructor(code = 0, msg = "", data = null) {
      this.code = code;
      this.msg = msg;
      this.data = data;
    }
  }
  class ResultString extends Result {
    constructor(code = 0, msg = "", data = "") {
      super(code, msg, data);
    }
  }
  class ResultVoid extends Result {
    constructor(code = 0, msg = "") {
      super(code, msg, null);
    }
  }
  class User {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.username = data.username || "";
      this.avatarUrl = data.avatarUrl || "";
      this.isActive = data.isActive || 0;
      this.createTime = data.createTime || "";
      this.updateTime = data.updateTime || "";
    }
  }
  class Role {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.roleCode = data.roleCode || "";
      this.name = data.name || "";
      this.description = data.description || "";
    }
  }
  class LoginUser {
    constructor(data = {}) {
      this.token = data.token || "";
      this.expireTime = data.expireTime || 0;
      this.loginTime = data.loginTime || 0;
      this.user = data.user ? new User(data.user) : new User();
      this.username = data.username || "";
      this.id = data.id || 0;
      this.roles = (data.roles || []).map((role) => new Role(role));
    }
  }
  class ResultLoginUser extends Result {
    constructor(code = 0, msg = "", data = {}) {
      super(code, msg, new LoginUser(data));
    }
  }
  class LoginBody {
    constructor(username = "", password = "", code = "", uuid = "") {
      this.username = username;
      this.password = password;
      this.code = code;
      this.uuid = uuid;
    }
  }
  class RegisterBody {
    constructor(username = "", password = "", code = "", uuid = "") {
      this.username = username;
      this.password = password;
      this.code = code;
      this.uuid = uuid;
    }
  }
  class MeetingRoom {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.name = data.name || "";
      this.location = data.location || "";
      this.capacity = data.capacity || 0;
      this.equipment = data.equipment || "";
      this.userId = data.userId || 0;
      this.createTime = data.createTime || "";
    }
  }
  class MeetingRoomBody {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.name = data.name || "";
      this.location = data.location || "";
      this.capacity = data.capacity || 0;
      this.equipment = data.equipment || "";
    }
  }
  class ReservationDTO {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.topic = data.topic || "";
      this.description = data.description || "";
      this.booker = data.booker || "";
      this.room = data.room || "";
      this.startTime = data.startTime || "";
      this.endTime = data.endTime || "";
      this.status = data.status || "";
      this.reserveDate = data.reserveDate || "";
    }
  }
  class ReservationBody {
    constructor(data = {}) {
      this.topic = data.topic || "";
      this.participants = data.participants || [];
      this.description = data.description || "";
      this.roomId = data.roomId || 0;
      this.startTime = data.startTime || "";
      this.endTime = data.endTime || "";
      this.reserveDate = data.reserveDate || "";
    }
  }
  class NotificationDTO {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.notifyType = data.notifyType || 0;
      this.title = data.title || "";
    }
  }
  class NotificationDetailsDTO {
    constructor(data = {}) {
      this.id = data.id || 0;
      this.notifyType = data.notifyType || 0;
      this.title = data.title || "";
      this.content = data.content || "";
      this.sender = data.sender || "";
      this.createTime = data.createTime || "";
    }
  }
  class ParticipantDTO {
    constructor(data = {}) {
      this.username = data.username || "";
      this.avatarUrl = data.avatarUrl || "";
      this.status = data.status || 0;
    }
  }
  class ResultListParticipantDTO extends Result {
    constructor(code = 0, msg = "", data = []) {
      super(code, msg, (data || []).map((item) => new ParticipantDTO(item)));
    }
  }
  class SubtopicsBody {
    constructor(data = {}) {
      this.reservationId = data.reservationId || 0;
      this.subtopics = data.subtopics || "";
      this.description = data.description || "";
    }
  }
  class SubtopicsUpdateBody {
    constructor(data = {}) {
      this.reservationId = data.reservationId || 0;
      this.subtopics = data.subtopics || "";
      this.description = data.description || "";
      this.id = data.id || 0;
    }
  }
  class PageDTO {
    constructor(total = 0, pages = 0, list = []) {
      this.total = total;
      this.pages = pages;
      this.list = list;
    }
  }
  class PageDTOReservationDTO extends PageDTO {
    constructor(data = {}) {
      super(
        data.total || 0,
        data.pages || 0,
        (data.list || []).map((item) => new ReservationDTO(item))
      );
    }
  }
  class ResultPageDTOReservationDTO extends Result {
    constructor(code = 0, msg = "", data = {}) {
      super(code, msg, new PageDTOReservationDTO(data));
    }
  }
  class PageDTONotificationDTO extends PageDTO {
    constructor(data = {}) {
      super(
        data.total || 0,
        data.pages || 0,
        (data.list || []).map((item) => new NotificationDTO(item))
      );
    }
  }
  class ResultPageDTONotificationDTO extends Result {
    constructor(code = 0, msg = "", data = {}) {
      super(code, msg, new PageDTONotificationDTO(data));
    }
  }
  class PageDTOMeetingRoom extends PageDTO {
    constructor(data = {}) {
      super(
        data.total || 0,
        data.pages || 0,
        (data.list || []).map((item) => new MeetingRoom(item))
      );
    }
  }
  class ResultPageDTOMeetingRoom extends Result {
    constructor(code = 0, msg = "", data = {}) {
      super(code, msg, new PageDTOMeetingRoom(data));
    }
  }
  class ResultNotificationDetailsDTO extends Result {
    constructor(code = 0, msg = "", data = {}) {
      super(code, msg, new NotificationDetailsDTO(data));
    }
  }
  const backend_models = {
    ResultObject,
    Result,
    ResultString,
    ResultVoid,
    User,
    Role,
    LoginUser,
    ResultLoginUser,
    LoginBody,
    RegisterBody,
    MeetingRoom,
    MeetingRoomBody,
    ReservationDTO,
    ReservationBody,
    NotificationDTO,
    NotificationDetailsDTO,
    ParticipantDTO,
    ResultListParticipantDTO,
    SubtopicsBody,
    SubtopicsUpdateBody,
    PageDTO,
    PageDTOReservationDTO,
    ResultPageDTOReservationDTO,
    PageDTONotificationDTO,
    ResultPageDTONotificationDTO,
    PageDTOMeetingRoom,
    ResultPageDTOMeetingRoom,
    ResultNotificationDetailsDTO
  };
  const Models = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    LoginBody,
    LoginUser,
    MeetingRoom,
    MeetingRoomBody,
    NotificationDTO,
    NotificationDetailsDTO,
    PageDTO,
    PageDTOMeetingRoom,
    PageDTONotificationDTO,
    PageDTOReservationDTO,
    ParticipantDTO,
    RegisterBody,
    ReservationBody,
    ReservationDTO,
    Result,
    ResultListParticipantDTO,
    ResultLoginUser,
    ResultNotificationDetailsDTO,
    ResultObject,
    ResultPageDTOMeetingRoom,
    ResultPageDTONotificationDTO,
    ResultPageDTOReservationDTO,
    ResultString,
    ResultVoid,
    Role,
    SubtopicsBody,
    SubtopicsUpdateBody,
    User,
    default: backend_models
  }, Symbol.toStringTag, { value: "Module" }));
  const uniAppAdapter = (config2) => {
    return new Promise((resolve, reject) => {
      let fullUrl = config2.url;
      if (!fullUrl.startsWith("http")) {
        fullUrl = (config2.baseURL || "") + fullUrl;
      }
      if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
        fullUrl = "http://" + fullUrl.replace(/^\/+/, "");
      }
      const requestConfig = {
        url: fullUrl,
        method: config2.method.toLowerCase(),
        data: config2.data,
        header: config2.headers,
        timeout: config2.timeout,
        dataType: "json",
        responseType: config2.responseType || "text",
        success: (res) => {
          resolve({
            data: res.data,
            status: res.statusCode,
            headers: res.header,
            config: config2
          });
        },
        fail: (err) => {
          formatAppLog("log", "at api/api.js:38", "uni.request失败:", err, "请求配置:", requestConfig);
          reject(err);
        },
        complete: () => {
        }
      };
      if (config2.params) {
        const queryParts = [];
        for (const key in config2.params) {
          if (config2.params[key] !== void 0 && config2.params[key] !== null) {
            const value = config2.params[key];
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(value);
            queryParts.push(`${encodedKey}=${encodedValue}`);
          }
        }
        const queryString = queryParts.join("&");
        if (queryString) {
          requestConfig.url += (requestConfig.url.includes("?") ? "&" : "?") + queryString;
        }
      }
      uni.request(requestConfig);
    });
  };
  const selectAdapter = () => {
    return uniAppAdapter;
  };
  const instance = axios.create({
    baseURL: config.apiBaseUrl || "",
    timeout: 1e4,
    headers: {
      "Content-Type": "application/json"
    },
    adapter: selectAdapter()
    // 使用适合当前平台的适配器
  });
  instance.interceptors.request.use(
    (config2) => {
      const token = uni.getStorageSync("token");
      if (token) {
        config2.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      }
      formatAppLog("log", "at api/api.js:100", "【API请求】", {
        url: config2.baseURL + config2.url,
        method: config2.method.toUpperCase(),
        data: config2.data,
        params: config2.params,
        headers: config2.headers
      });
      return config2;
    },
    (error) => {
      formatAppLog("log", "at api/api.js:111", "【API请求错误】", error);
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      if (response.data.code === 401) {
        uni.removeStorageSync("token");
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/user/login"
          });
        }, 500);
      }
      formatAppLog("log", "at api/api.js:132", "【API响应】", {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
      return response.data;
    },
    (error) => {
      formatAppLog("log", "at api/api.js:143", "【API响应错误】", {
        url: error.config ? error.config.url : "未知",
        status: error.response ? error.response.status : "未知",
        data: error.response ? error.response.data : error.message
      });
      if (error.response && error.response.status === 401) {
        uni.removeStorageSync("token");
        formatAppLog("log", "at api/api.js:155", "认证失败(401)，需要重新登录");
        return Promise.reject({
          message: "登录状态已过期，请重新登录",
          code: 401,
          data: error.response.data
        });
      }
      return Promise.reject(error);
    }
  );
  const getCaptcha = () => {
    return instance.get("/user/captchaImage");
  };
  const login = (username, password, code, uuid) => {
    const loginBody = { username, password, code, uuid };
    return instance.post("/user/login", loginBody);
  };
  const register = (username, password, code, uuid) => {
    const registerBody = { username, password, code, uuid };
    return instance.post("/user/register", registerBody);
  };
  const getUserInfo = () => {
    return instance.get("/user/info");
  };
  const logout = () => {
    return instance.post("/user/logout");
  };
  const updatePassword = (passwordData) => {
    return instance.put("/user/password", passwordData);
  };
  const getNotifications = (pageNo = 1, pageSize = 5, isAsc = true, sortBy = "id") => {
    return instance.get("/notify", {
      params: { pageNo, pageSize, isAsc, sortBy }
    });
  };
  const getNotificationById = (id) => {
    return instance.get(`/notify/${id}`);
  };
  const adminRemind = (id) => {
    return instance.post(`/notify/${id}`);
  };
  const adminGetNotification = (id) => {
    return instance.get(`/notify/admin/${id}`);
  };
  const createRoom = (roomData) => {
    return instance.post("/room/create", roomData);
  };
  const getRooms = (pageNo = 1, pageSize = 5, isAsc = true, sortBy = "id") => {
    return instance.get("/room", {
      params: { pageNo, pageSize, isAsc, sortBy }
    });
  };
  const updateRoom = (roomData) => {
    return instance.put("/room/update", roomData);
  };
  const deleteRoom = (id) => {
    return instance.delete(`/room/${id}`);
  };
  const getReservations = (params = {}) => {
    return instance.get("/reservation", {
      params: {
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 5,
        isAsc: params.isAsc !== void 0 ? params.isAsc : true,
        sortBy: params.sortBy,
        startTime: params.startTime,
        endTime: params.endTime,
        reserveDate: params.reserveDate
      }
    });
  };
  const approveReservation = (id, isAllowed) => {
    return instance.put("/reservation/approve", null, {
      params: { id, isAllowed }
    });
  };
  const cancelReservation = (id) => {
    return instance.put(`/reservation/${id}`);
  };
  const adminCancelReservation = (id) => {
    return instance.put(`/reservation/admin/${id}`);
  };
  const bookReservation = (reservationData) => {
    return instance.post("/reservation/book", reservationData);
  };
  const confirmParticipation = (id, join) => {
    return instance.put("/participants/join", null, {
      params: { id, join }
    });
  };
  const getParticipants = (id) => {
    return instance.get(`/participants/${id}`);
  };
  const createSubtopic = (subtopicData) => {
    return instance.post("/sub", subtopicData);
  };
  const updateSubtopic = (subtopicData) => {
    return instance.put("/sub", subtopicData);
  };
  const uploadSubtopicFile = (subId, fileKey, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post(`/sub/upload/file/${subId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      params: { fileKey, fileName: file.name }
    });
  };
  const deleteSubtopic = (subId) => {
    return instance.delete(`/sub/${subId}`);
  };
  const deleteSubtopicFile = (subFileId) => {
    return instance.delete(`/sub/file/${subFileId}`);
  };
  const getSubtopicFileList = (subId) => {
    return instance.get(`/sub/${subId}/file/list`);
  };
  const getSubtopicsByReservationId = (reservationId) => {
    return instance.get(`/sub/${reservationId}`);
  };
  const getFileUrl = (fileKey) => {
    return instance.get("/file/url", {
      params: { fileKey }
    });
  };
  const downloadFile = (fileKey) => {
    return instance.get("/file/download", {
      params: { fileKey },
      responseType: "blob"
    });
  };
  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  };
  const uploadAudioAndGenerateSummary = (reservationId, fileUrl, file) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    return instance.post(`/meeting/audio/${reservationId}?fileUrl=${encodeURIComponent(fileUrl)}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  };
  const getMeetingSummary = (reservationId) => {
    return instance.get(`/reservation/${reservationId}/summary`);
  };
  const updateMeetingSummary = (summaryData) => {
    return instance.put("/reservation/summary", summaryData);
  };
  const uploadRpaFile = (url, name, topped) => {
    return instance.post(`/rpa?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}&topped=${topped}`);
  };
  const getRpaFiles = (pageNo = 1, pageSize = 20, isAsc = true, sortBy = "id") => {
    return instance.get("/rpa", {
      params: { pageNo, pageSize, isAsc, sortBy }
    });
  };
  const deleteRpaFile = (id) => {
    return instance.delete(`/rpa/${id}`);
  };
  const testApi = () => {
    return instance.post("/test/test");
  };
  const testUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post("/test/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  };
  const getPresignedUrl = () => {
    return instance.post("/test/getUrl");
  };
  const testDownloadFile = () => {
    return instance.get("/test/downLoadFile", {
      responseType: "blob"
    });
  };
  const getUsers = (pageNo = 1, pageSize = 20, isAsc = true, sortBy = "id", userName = "") => {
    return instance.get("/user", {
      params: {
        pageNo,
        pageSize,
        isAsc,
        sortBy,
        userName
      }
    });
  };
  const apiRequest = {
    getCaptcha,
    login,
    register,
    getUserInfo,
    logout,
    updatePassword,
    getNotifications,
    getNotificationById,
    adminRemind,
    adminGetNotification,
    createRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    getReservations,
    approveReservation,
    cancelReservation,
    adminCancelReservation,
    bookReservation,
    confirmParticipation,
    getParticipants,
    createSubtopic,
    updateSubtopic,
    uploadSubtopicFile,
    deleteSubtopic,
    deleteSubtopicFile,
    getSubtopicFileList,
    getSubtopicsByReservationId,
    getFileUrl,
    downloadFile,
    uploadFile,
    uploadAudioAndGenerateSummary,
    getMeetingSummary,
    updateMeetingSummary,
    uploadRpaFile,
    getRpaFiles,
    deleteRpaFile,
    // 测试API
    testApi,
    testUpload,
    getPresignedUrl,
    testDownloadFile,
    getUsers,
    // 数据模型
    Models
  };
  const api = {
    // 用户相关业务
    user: {
      // 登录
      login(data) {
        return login(data.username, data.password, data.code, data.uuid);
      },
      // 获取验证码
      getCaptcha() {
        return getCaptcha();
      },
      // 带验证码的登录流程
      loginWithCaptcha(username, password) {
        return getCaptcha().then((res) => {
          if (res.code === 200 && res.data) {
            return login(
              username,
              password,
              res.data.code,
              res.data.uuid
            );
          } else {
            return Promise.reject(new Error("获取验证码失败"));
          }
        });
      },
      // 注册
      register(data) {
        return register(data.username, data.password, data.code, data.uuid);
      },
      // 获取用户信息
      getUserInfo() {
        return getUserInfo();
      },
      // 获取用户列表
      getUserList(params) {
        return getUsers(
          params == null ? void 0 : params.pageNo,
          params == null ? void 0 : params.pageSize,
          params == null ? void 0 : params.isAsc,
          params == null ? void 0 : params.sortBy,
          params == null ? void 0 : params.userName
        );
      },
      // 登录并获取用户信息（一次完成）
      loginAndGetUserInfo(loginData) {
        return login(
          loginData.username,
          loginData.password,
          loginData.code,
          loginData.uuid
        ).then((res) => {
          if (res.code === 200 && res.data && res.data.token) {
            uni.setStorageSync("token", res.data.token);
            return getUserInfo().then((userInfoRes) => {
              if (userInfoRes.code === 200 && userInfoRes.data) {
                return {
                  code: 200,
                  data: {
                    token: res.data.token,
                    userInfo: userInfoRes.data
                  },
                  message: "登录成功"
                };
              } else {
                return res;
              }
            }).catch(() => {
              return res;
            });
          } else {
            return res;
          }
        });
      },
      // 退出登录
      logout() {
        return logout().then((res) => {
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          return res;
        }).catch((err) => {
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          return Promise.reject(err);
        });
      },
      // 更新用户信息
      updateUserInfo(data) {
        return getUserInfo().then((res) => {
          if (res.code === 200 && res.data) {
            return login(
              data.username || res.data.username,
              data.password || "******",
              null,
              null
            ).then((loginRes) => {
              if (loginRes.code === 200) {
                return {
                  code: 200,
                  data: __spreadValues(__spreadValues({}, res.data), data),
                  message: "用户信息更新成功"
                };
              }
              return loginRes;
            });
          }
          return res;
        });
      },
      // 更新用户密码
      updatePassword(data) {
        const passwordData = {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.newPassword
        };
        return updatePassword(passwordData);
      },
      // 兼容性别名 - getInfo => getUserInfo
      getInfo() {
        return this.getUserInfo();
      }
    },
    // 会议相关业务
    meeting: {
      // 模拟会议数据 - 当后端API不可用时使用
      _mockMeetingData: [
        {
          id: 1,
          topic: "项目进度评审会议",
          description: "讨论项目当前进度和问题",
          status: "approved",
          roomId: 1,
          room: { id: 1, name: "第一会议室" },
          reserveDate: "2025-04-01",
          startTime: "09:00:00",
          endTime: "11:00:00",
          participants: [1, 2, 3],
          booker: { id: 1, name: "张三" },
          createTime: "2025-03-30 15:30:00"
        },
        {
          id: 2,
          topic: "需求讨论会",
          description: "讨论新功能需求和设计方案",
          status: "pending",
          roomId: 2,
          room: { id: 2, name: "第二会议室" },
          reserveDate: "2025-04-02",
          startTime: "14:00:00",
          endTime: "16:00:00",
          participants: [1, 3, 4],
          booker: { id: 1, name: "张三" },
          createTime: "2025-03-30 16:20:00"
        },
        {
          id: 3,
          topic: "周例会",
          description: "每周例行团队会议",
          status: "approved",
          roomId: 3,
          room: { id: 3, name: "大会议室" },
          reserveDate: "2025-04-03",
          startTime: "10:00:00",
          endTime: "11:30:00",
          participants: [1, 2, 3, 4, 5],
          booker: { id: 2, name: "李四" },
          createTime: "2025-03-30 09:15:00"
        }
      ],
      // 获取会议统计数据
      getMeetingStats() {
        return getReservations().then((res) => {
          if (res.code === 200 && res.data) {
            let total = 0;
            let approved = 0;
            let pending = 0;
            const meetings = res.data.list || res.data || [];
            if (Array.isArray(meetings)) {
              total = meetings.length;
              meetings.forEach((meeting2) => {
                if (meeting2.status === "approved") {
                  approved++;
                } else if (meeting2.status === "pending") {
                  pending++;
                }
              });
            }
            const result = {
              code: 200,
              data: {
                total,
                approved,
                pending
              },
              message: "获取会议统计成功"
            };
            return result;
          }
          return res;
        });
      },
      // 获取会议列表
      getMeetings(params) {
        const apiParams = __spreadValues({}, params);
        if (params.startDate) {
          apiParams.startDate = params.startDate;
        }
        if (params.endDate) {
          apiParams.endDate = params.endDate;
        }
        if (params.status) {
          apiParams.status = params.status;
        }
        if (params.roomId) {
          apiParams.roomId = params.roomId;
        }
        formatAppLog("log", "at api/index.js:271", "会议列表查询参数:", apiParams);
        return getReservations(__spreadProps(__spreadValues({}, apiParams), {
          pageNo: params.pageNo || 1,
          pageSize: params.pageSize || 10
        })).then((res) => {
          if (res.code === 200 && res.data) {
            const meetings = res.data.list || res.data || [];
            const result = {
              code: 200,
              data: meetings,
              message: res.message || "获取会议列表成功"
            };
            return result;
          } else if (res.code === 400 || res.status === 400) {
            formatAppLog("log", "at api/index.js:291", "后端API返回400错误，使用模拟数据");
            return {
              code: 200,
              data: this._mockMeetingData,
              message: "使用模拟数据获取会议列表"
            };
          }
          return res;
        }).catch((error) => {
          formatAppLog("error", "at api/index.js:301", "获取会议列表失败，使用模拟数据", error);
          return {
            code: 200,
            data: this._mockMeetingData,
            message: "使用模拟数据获取会议列表"
          };
        });
      },
      // 获取会议列表
      getMeetingList(params) {
        const apiParams = __spreadValues({}, params);
        if (params.startDate) {
          apiParams.startDate = params.startDate;
        }
        if (params.endDate) {
          apiParams.endDate = params.endDate;
        }
        if (params.status) {
          apiParams.status = params.status;
        }
        if (params.roomId) {
          apiParams.roomId = params.roomId;
        }
        formatAppLog("log", "at api/index.js:334", "会议列表查询参数:", apiParams);
        return getReservations(__spreadProps(__spreadValues({}, apiParams), {
          pageNo: params.pageNo || 1,
          pageSize: params.pageSize || 10
        })).then((res) => {
          if (res.code === 200 && res.data && res.data.list) {
            let currentUsername = null;
            try {
              const userInfoStr = uni.getStorageSync("userInfo");
              const userInfo = typeof userInfoStr === "string" ? JSON.parse(userInfoStr) : userInfoStr;
              formatAppLog("log", "at api/index.js:349", "尝试获取用户信息:", userInfo);
              if (userInfo) {
                currentUsername = userInfo.username;
                formatAppLog("log", "at api/index.js:353", "当前用户ID:", currentUsername, "userInfo:", JSON.stringify(userInfo));
              } else {
                formatAppLog("warn", "at api/index.js:355", "获取到的userInfo不包含有效的id字段:", userInfo);
              }
            } catch (e) {
              formatAppLog("error", "at api/index.js:358", "获取用户信息失败:", e);
            }
            let filteredList = res.data.list;
            if (params && params.type && currentUsername) {
              if (params.type === "initiated") {
                formatAppLog("log", "at api/index.js:367", "筛选我发起的会议", res.data.list);
                filteredList = res.data.list.filter((meeting2) => {
                  const booker = meeting2.booker;
                  return booker === currentUsername;
                });
                formatAppLog("log", "at api/index.js:374", `筛选后的会议数量: ${filteredList.length} / ${res.data.list.length}`);
              } else if (params.type === "participated") {
                formatAppLog("log", "at api/index.js:377", "筛选我参与的会议");
                filteredList = res.data.list.filter((meeting2) => {
                  const creatorId = meeting2.booker;
                  if (creatorId === currentUsername) {
                    return false;
                  }
                  if (meeting2.participants && Array.isArray(meeting2.participants)) {
                    return meeting2.participants.some((p) => {
                      const participantId = typeof p === "object" ? p.id : parseInt(p);
                      return participantId === currentUsername;
                    });
                  }
                  return false;
                });
                formatAppLog("log", "at api/index.js:399", `筛选后的会议数量: ${filteredList.length} / ${res.data.list.length}`);
              }
            }
            const formattedList = filteredList.map((meeting2) => this.formatMeetingData(meeting2));
            return {
              code: 200,
              data: __spreadProps(__spreadValues({}, res.data), {
                list: formattedList,
                total: res.data.total
                // 使用后端返回的总数
              }),
              message: res.message
            };
          } else if (res.code === 400 || res.status === 400) {
            formatAppLog("log", "at api/index.js:417", "后端API返回400错误，使用模拟数据");
            let currentUsername = null;
            try {
              const userInfoStr = uni.getStorageSync("userInfo");
              const userInfo = typeof userInfoStr === "string" ? JSON.parse(userInfoStr) : userInfoStr;
              if (userInfo && userInfo.id) {
                currentUsername = parseInt(userInfo.id);
              }
            } catch (e) {
              formatAppLog("error", "at api/index.js:429", "获取用户信息失败:", e);
            }
            let filteredList = [...this._mockMeetingData];
            if (params && params.type && currentUsername) {
              if (params.type === "initiated") {
                filteredList = filteredList.filter((meeting2) => {
                  const creatorId = meeting2.booker && meeting2.booker.id || null;
                  return creatorId === currentUsername;
                });
              } else if (params.type === "participated") {
                filteredList = filteredList.filter((meeting2) => {
                  const creatorId = meeting2.booker && meeting2.booker.id || null;
                  if (creatorId === currentUsername) {
                    return false;
                  }
                  if (meeting2.participants && Array.isArray(meeting2.participants)) {
                    return meeting2.participants.includes(currentUsername);
                  }
                  return false;
                });
              }
            }
            const formattedList = filteredList.map((meeting2) => this.formatMeetingData(meeting2));
            return {
              code: 200,
              data: {
                list: formattedList,
                total: formattedList.length
              },
              message: "使用模拟数据获取会议列表"
            };
          }
          return res;
        }).catch((error) => {
          formatAppLog("error", "at api/index.js:478", "获取会议列表失败，使用模拟数据", error);
          const formattedList = this._mockMeetingData.map(
            (meeting2) => this.formatMeetingData(meeting2)
          );
          return {
            code: 200,
            data: {
              list: formattedList,
              total: formattedList.length
            },
            message: "使用模拟数据获取会议列表"
          };
        });
      },
      // 获取会议详情
      getMeetingDetail(id) {
        formatAppLog("log", "at api/index.js:498", "获取会议详情API调用, 传入ID:", id, "类型:", typeof id);
        if (id === void 0 || id === null) {
          formatAppLog("error", "at api/index.js:502", "getMeetingDetail: 无效的会议ID");
          return Promise.resolve({
            code: 400,
            message: "无效的会议ID",
            data: null
          });
        }
        return getReservations({ id }).then((res) => {
          if (res.code === 200 && res.data && res.data.list && res.data.list.length > 0) {
            const meeting2 = res.data.list[0];
            formatAppLog("log", "at api/index.js:518", "找到会议数据:", JSON.stringify(meeting2));
            const formattedMeeting = this.formatMeetingData(meeting2);
            formatAppLog("log", "at api/index.js:522", "格式化后的会议数据:", JSON.stringify(formattedMeeting));
            return {
              code: 200,
              message: "获取成功",
              data: formattedMeeting
            };
          } else {
            formatAppLog("error", "at api/index.js:532", "未找到会议详情, ID:", id);
            return {
              code: 404,
              message: "未找到会议",
              data: null
            };
          }
        }).catch((error) => {
          formatAppLog("error", "at api/index.js:542", "获取会议详情失败:", error);
          return {
            code: 500,
            message: error.message || "获取会议详情失败",
            data: null
          };
        });
      },
      // 获取完整会议详情（包含参与者信息）
      getCompleteMeetingDetail(id) {
        formatAppLog("log", "at api/index.js:553", "【API请求】", { method: "getCompleteMeetingDetail", id });
        return Promise.all([
          getReservations({ id }),
          getParticipants(id).catch((err) => {
            return { code: 404, data: [], message: "获取参会人员失败" };
          })
        ]).then(([meetingRes, participantsRes]) => {
          let meetingData = null;
          if (meetingRes.code === 200) {
            if (meetingRes.data && meetingRes.data.list && meetingRes.data.list.length > 0) {
              meetingData = meetingRes.data.list[0];
            } else if (meetingRes.data && typeof meetingRes.data === "object" && !Array.isArray(meetingRes.data)) {
              meetingData = meetingRes.data;
            }
          }
          if (meetingData) {
            const formattedMeeting = this.formatMeetingData(meetingData);
            if (participantsRes.code === 200 && participantsRes.data && Array.isArray(participantsRes.data)) {
              const participants = participantsRes.data.map((p) => ({
                id: p.id || p.userId || p.username || "",
                name: p.name || p.username || p.userName || "未知用户",
                username: p.username || p.userName || p.name || "",
                avatar: p.avatar || p.avatarUrl || "",
                status: p.status || "pending",
                email: p.email || "",
                phone: p.phone || ""
              }));
              formattedMeeting.participants = this._mergeParticipants(
                formattedMeeting.participants || [],
                participants
              );
            }
            return {
              code: 200,
              data: formattedMeeting,
              message: "获取会议详情成功"
            };
          }
          return {
            code: meetingRes.code || 404,
            message: meetingRes.message || "未找到会议详情",
            data: null
          };
        }).catch((err) => {
          return {
            code: 500,
            message: "获取会议详情失败",
            data: null
          };
        });
      },
      // 辅助方法 - 合并参会人员，避免重复
      _mergeParticipants(existingParticipants, newParticipants) {
        const merged = [...existingParticipants];
        const existingIds = new Set(existingParticipants.map((p) => p.id));
        newParticipants.forEach((participant) => {
          if (!existingIds.has(participant.id)) {
            merged.push(participant);
          }
        });
        return merged;
      },
      // 创建会议
      createMeeting(data) {
        const reservationData = {
          topic: data.title || data.topic || "",
          // 允许使用title或topic字段
          // 将participants转换为整数ID数组
          participants: Array.isArray(data.participants) ? data.participants.map((p) => typeof p === "object" ? p.id : parseInt(p)) : [],
          description: data.description || "",
          roomId: parseInt(data.roomId) || 0,
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          reserveDate: data.reserveDate || data.date || ""
          // 允许使用reserveDate或date字段
        };
        if (reservationData.startTime && !reservationData.startTime.includes(":")) {
          reservationData.startTime += ":00";
        } else if (reservationData.startTime && reservationData.startTime.split(":").length === 2) {
          reservationData.startTime += ":00";
        }
        if (reservationData.endTime && !reservationData.endTime.includes(":")) {
          reservationData.endTime += ":00";
        } else if (reservationData.endTime && reservationData.endTime.split(":").length === 2) {
          reservationData.endTime += ":00";
        }
        const hasAgenda = data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0;
        const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
        if (hasAgenda || hasFiles) {
          return this.createMeetingWithFiles(data, data.attachments || [], data.agenda || []);
        }
        return bookReservation(reservationData).then((res) => {
          if (res && res.code === 200 && res.data) {
            return res;
          } else {
            let errorMsg = "创建会议失败";
            if (res && res.message) {
              errorMsg = res.message;
            } else if (res && typeof res === "object") {
              errorMsg = JSON.stringify(res);
            }
            return res || { code: 500, message: errorMsg };
          }
        }).catch((err) => {
          return { code: 500, message: "创建会议时发生异常", error: err };
        });
      },
      // 创建会议并上传文件和议程
      createMeetingWithFiles(meetingData, files = [], agendaItems = []) {
        const reservationData = {
          topic: (meetingData.title || meetingData.topic || "").trim(),
          participants: Array.isArray(meetingData.participants) ? meetingData.participants.map((p) => {
            if (typeof p === "object")
              return parseInt(p.id);
            return parseInt(p);
          }).filter((id) => !isNaN(id)) : [],
          description: (meetingData.description || "").trim(),
          roomId: parseInt(meetingData.roomId) || 0,
          startTime: meetingData.startTime || "",
          endTime: meetingData.endTime || "",
          reserveDate: meetingData.reserveDate || meetingData.date || ""
        };
        if (reservationData.startTime && !reservationData.startTime.includes(":")) {
          reservationData.startTime += ":00";
        } else if (reservationData.startTime && reservationData.startTime.split(":").length === 2) {
          reservationData.startTime += ":00";
        }
        if (reservationData.endTime && !reservationData.endTime.includes(":")) {
          reservationData.endTime += ":00";
        } else if (reservationData.endTime && reservationData.endTime.split(":").length === 2) {
          reservationData.endTime += ":00";
        }
        if (!reservationData.topic) {
          formatAppLog("error", "at api/index.js:723", "会议创建失败: 缺少会议主题");
          return Promise.resolve({ code: 400, message: "缺少会议主题" });
        }
        if (!reservationData.roomId) {
          formatAppLog("error", "at api/index.js:728", "会议创建失败: 缺少会议室ID");
          return Promise.resolve({ code: 400, message: "缺少会议室ID" });
        }
        if (!reservationData.reserveDate) {
          formatAppLog("error", "at api/index.js:733", "会议创建失败: 缺少会议日期");
          return Promise.resolve({ code: 400, message: "缺少会议日期" });
        }
        if (!reservationData.startTime || !reservationData.endTime) {
          formatAppLog("error", "at api/index.js:738", "会议创建失败: 缺少开始或结束时间");
          return Promise.resolve({ code: 400, message: "缺少开始或结束时间" });
        }
        if (reservationData.participants.length === 0) {
          formatAppLog("warn", "at api/index.js:744", "警告: 参会人员列表为空");
        }
        return bookReservation(reservationData).then((res) => {
          if (res && res.code === 200 && res.data) {
            const meetingId = res.data.id;
            const promises = [];
            if (files && files.length > 0) {
              const filePromises = files.map((file) => {
                let uploadPromise;
                if (file.file) {
                  uploadPromise = uploadFile(file.file);
                } else if (file.path) {
                  uploadPromise = new Promise((resolve, reject) => {
                    uni.uploadFile({
                      url: `${getBaseUrl()}/file/upload`,
                      filePath: file.path,
                      name: "file",
                      header: getHeaders(),
                      success: (uploadRes) => {
                        try {
                          const data = typeof uploadRes.data === "string" ? JSON.parse(uploadRes.data) : uploadRes.data;
                          resolve(data);
                        } catch (e) {
                          reject(e);
                        }
                      },
                      fail: (err) => {
                        reject(err);
                      }
                    });
                  });
                } else {
                  uploadPromise = uploadFile(file);
                }
                return uploadPromise.then((uploadRes) => {
                  if (uploadRes.code === 200 && uploadRes.data) {
                    return createSubtopic({
                      reservationId: meetingId,
                      title: file.name || "会议资料",
                      fileKey: uploadRes.data.fileKey
                    });
                  }
                  return uploadRes;
                }).catch((error) => {
                  return { code: 500, message: "文件上传失败", error };
                });
              });
              promises.push(...filePromises);
            }
            if (agendaItems && agendaItems.length > 0) {
              const agendaPromises = agendaItems.map((item, index) => {
                const agendaTitle = item.time ? `${item.time} - ${item.content || "议程项" + (index + 1)}` : item.content || "议程项" + (index + 1);
                const agendaDescription = item.speaker ? `发言人: ${item.speaker}
${item.description || ""}` : item.description || "";
                return createSubtopic({
                  reservationId: meetingId,
                  title: agendaTitle,
                  content: agendaDescription
                }).then((result) => {
                  return result;
                }).catch((error) => {
                  return { code: 500, message: "议程创建失败", error };
                });
              });
              promises.push(...agendaPromises);
            }
            return Promise.all(promises).then((results) => {
              return res;
            }).catch((err) => {
              return res;
            });
          } else {
            let errorMsg = "创建会议失败";
            if (res && res.message) {
              errorMsg = res.message;
            } else if (res && typeof res === "object") {
              errorMsg = JSON.stringify(res);
            }
            return res || { code: 500, message: errorMsg };
          }
        }).catch((err) => {
          return { code: 500, message: "创建会议时发生异常", error: err };
        });
      },
      // 更新会议信息
      updateMeeting(id, data) {
        return getReservations({ id }).then((res) => {
          if (res.code === 200 && res.data && res.data.list && res.data.list.length > 0) {
            return cancelReservation(id).then(() => {
              const originalData = res.data.list[0];
              let originalParticipants = [];
              if (originalData.participants) {
                if (Array.isArray(originalData.participants)) {
                  originalParticipants = originalData.participants.map(
                    (p) => typeof p === "object" ? p.id || p : parseInt(p)
                  );
                } else {
                  originalParticipants = [parseInt(originalData.participants)];
                }
              }
              let newParticipants = [];
              if (data.participants) {
                if (Array.isArray(data.participants)) {
                  newParticipants = data.participants.map(
                    (p) => typeof p === "object" ? p.id || p : parseInt(p)
                  );
                } else {
                  newParticipants = [parseInt(data.participants)];
                }
              }
              const reservationData = {
                topic: data.title || data.topic || originalData.topic || "",
                participants: newParticipants.length > 0 ? newParticipants : originalParticipants,
                description: data.description || originalData.description || "",
                roomId: parseInt(data.roomId) || parseInt(originalData.roomId) || 0,
                startTime: data.startTime || originalData.startTime || "",
                endTime: data.endTime || originalData.endTime || "",
                reserveDate: data.reserveDate || data.date || originalData.reserveDate || ""
              };
              if (reservationData.startTime && !reservationData.startTime.includes(":")) {
                reservationData.startTime += ":00";
              } else if (reservationData.startTime && reservationData.startTime.split(":").length === 2) {
                reservationData.startTime += ":00";
              }
              if (reservationData.endTime && !reservationData.endTime.includes(":")) {
                reservationData.endTime += ":00";
              } else if (reservationData.endTime && reservationData.endTime.split(":").length === 2) {
                reservationData.endTime += ":00";
              }
              formatAppLog("log", "at api/index.js:933", "更新会议请求数据:", JSON.stringify(reservationData));
              const hasAgenda = data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0;
              const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
              return bookReservation(reservationData).then((bookRes) => {
                if (bookRes.code === 200 && bookRes.data) {
                  const meetingId = bookRes.data.id;
                  const promises = [];
                  if (hasFiles) {
                    const filePromises = data.attachments.map(
                      (file) => uploadFile(file).then((uploadRes) => {
                        if (uploadRes.code === 200 && uploadRes.data) {
                          return createSubtopic({
                            reservationId: meetingId,
                            title: file.name || "会议资料",
                            fileKey: uploadRes.data.fileKey
                          });
                        }
                        return uploadRes;
                      })
                    );
                    promises.push(...filePromises);
                  }
                  if (hasAgenda) {
                    const agendaPromises = data.agenda.map((item, index) => {
                      const agendaTitle = item.time ? `${item.time} - ${item.content || "议程项" + (index + 1)}` : item.content || "议程项" + (index + 1);
                      const agendaDescription = item.speaker ? `发言人: ${item.speaker}
${item.description || ""}` : item.description || "";
                      return createSubtopic({
                        reservationId: meetingId,
                        title: agendaTitle,
                        content: agendaDescription
                      });
                    });
                    promises.push(...agendaPromises);
                  }
                  if (promises.length > 0) {
                    return Promise.all(promises).then(() => bookRes).catch((err) => {
                      formatAppLog("error", "at api/index.js:995", "文件或议程处理失败:", err);
                      return bookRes;
                    });
                  }
                  return bookRes;
                }
                return bookRes;
              });
            }).catch(() => {
              const reservationData = {
                topic: data.title || data.topic || "",
                participants: Array.isArray(data.participants) ? data.participants.map((p) => typeof p === "object" ? p.id : parseInt(p)) : [],
                description: data.description || "",
                roomId: parseInt(data.roomId) || 0,
                startTime: data.startTime || "",
                endTime: data.endTime || "",
                reserveDate: data.reserveDate || data.date || ""
              };
              if (reservationData.startTime && !reservationData.startTime.includes(":")) {
                reservationData.startTime += ":00";
              } else if (reservationData.startTime && reservationData.startTime.split(":").length === 2) {
                reservationData.startTime += ":00";
              }
              if (reservationData.endTime && !reservationData.endTime.includes(":")) {
                reservationData.endTime += ":00";
              } else if (reservationData.endTime && reservationData.endTime.split(":").length === 2) {
                reservationData.endTime += ":00";
              }
              const hasAgenda = data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0;
              const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
              if (hasAgenda || hasFiles) {
                return this.createMeetingWithFiles(data, data.attachments || [], data.agenda || []);
              }
              return bookReservation(reservationData);
            });
          } else {
            return {
              code: 404,
              message: "会议不存在，无法更新"
            };
          }
        });
      },
      // 取消会议
      cancelMeeting(id) {
        if (!id) {
          formatAppLog("error", "at api/index.js:1059", "cancelMeeting: 无效的会议ID");
          return Promise.reject(new Error("无效的会议ID"));
        }
        formatAppLog("log", "at api/index.js:1063", "业务层取消会议:", id);
        return cancelReservation(id);
      },
      // 管理员取消会议
      adminCancelMeeting(id) {
        return adminCancelReservation(id);
      },
      // 审批会议
      approveReservation(id, isAllowed) {
        return approveReservation(id, isAllowed);
      },
      // 拒绝参会
      rejectParticipation(id) {
        return confirmParticipation(id, false);
      },
      // 确认参会
      confirmParticipation(id) {
        return confirmParticipation(id, true);
      },
      // 上传会议音频并生成摘要
      uploadAudioAndGetSummary(meetingId, audioFile) {
        return uploadAudioAndGenerateSummary(meetingId, audioFile);
      },
      // 获取会议日程
      getMeetingSchedule(params = {}) {
        const apiParams = {
          pageSize: params.pageSize || 100,
          // 获取更多数据用于日程展示
          pageNo: params.pageNo || 1,
          isAsc: params.isAsc !== void 0 ? params.isAsc : true,
          sortBy: params.sortBy || "id"
        };
        if (params.reserveDate) {
          apiParams.reserveDate = params.reserveDate;
        } else if (params.date) {
          apiParams.reserveDate = params.date;
        }
        if (params.startTime) {
          apiParams.startTime = params.startTime;
        }
        if (params.endTime) {
          apiParams.endTime = params.endTime;
        }
        return getReservations(apiParams).then((res) => {
          if (res.code === 200 && res.data) {
            let meetings = [];
            if (Array.isArray(res.data)) {
              meetings = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              meetings = res.data.list;
            } else if (typeof res.data === "object" && !Array.isArray(res.data)) {
              meetings = [res.data];
            }
            const scheduleItems = meetings.map((meeting2) => {
              return {
                id: meeting2.id,
                title: meeting2.topic || meeting2.title || "未命名会议",
                start: meeting2.startTime || "",
                end: meeting2.endTime || "",
                date: meeting2.reserveDate || "",
                status: meeting2.status || "pending",
                room: meeting2.roomName || (meeting2.room ? meeting2.room.name : ""),
                color: this._getStatusColor(meeting2.status),
                allDay: false
              };
            });
            return {
              code: 200,
              data: scheduleItems,
              message: "获取会议日程成功"
            };
          }
          return res;
        });
      },
      // 辅助函数 - 根据状态获取颜色
      _getStatusColor(status) {
        switch (status) {
          case "approved":
            return "#52c41a";
          case "pending":
            return "#faad14";
          case "rejected":
            return "#f5222d";
          case "cancelled":
            return "#d9d9d9";
          default:
            return "#1890ff";
        }
      },
      // 格式化会议数据
      formatMeetingData(meeting2) {
        if (!meeting2)
          return null;
        const formatTime = (timeStr) => {
          if (!timeStr)
            return "";
          if (timeStr.includes(" ")) {
            return timeStr.split(" ")[1];
          }
          return timeStr;
        };
        const reserveDate = meeting2.reserveDate || (meeting2.startTime && meeting2.startTime.includes(" ") ? meeting2.startTime.split(" ")[0] : "") || meeting2.date || "";
        const topic = meeting2.topic || meeting2.title || "未命名会议";
        let status = meeting2.status || "待审核";
        if (typeof status === "number" || /^\d+$/.test(status)) {
          const numStatus = parseInt(status);
          switch (numStatus) {
            case 0:
              status = "待审核";
              break;
            case 1:
              status = "已通过";
              break;
            case 2:
              status = "进行中";
              break;
            case 3:
              status = "已完成";
              break;
            case 4:
              status = "已取消";
              break;
            case 5:
              status = "已拒绝";
              break;
            default:
              status = "待审核";
          }
        } else if (typeof status === "string") {
          status = status.toLowerCase();
          if (status === "pending" || status.includes("pend") || status.includes("waiting")) {
            status = "待审核";
          } else if (status === "approved" || status.includes("approv") || status.includes("accept")) {
            status = "已通过";
          } else if (status === "in-progress" || status.includes("progress") || status.includes("ongoing")) {
            status = "进行中";
          } else if (status === "completed" || status.includes("complet") || status.includes("finish")) {
            status = "已完成";
          } else if (status === "rejected" || status.includes("reject") || status.includes("deny")) {
            status = "已拒绝";
          } else if (status === "cancelled" || status === "canceled" || status.includes("cancel")) {
            status = "已取消";
          }
        }
        let booker = meeting2.booker || meeting2.user || meeting2.booker || "未知用户";
        if (typeof booker === "object") {
          booker = booker.name || booker.username || "未知用户";
        }
        let room = meeting2.room || "未指定";
        if (typeof room === "object") {
          room = room.name || "未指定";
        }
        return {
          id: meeting2.id,
          topic,
          description: meeting2.description || "",
          booker,
          room,
          startTime: meeting2.startTime ? formatTime(meeting2.startTime) : "",
          endTime: meeting2.endTime ? formatTime(meeting2.endTime) : "",
          status,
          reserveDate,
          // 额外提供字段用于前端组件使用
          title: topic,
          date: reserveDate,
          roomName: room,
          user: booker,
          // 保留参会人员信息
          participants: meeting2.participants || [],
          // 保留原始数据以备不时之需
          rawMeeting: meeting2
        };
      },
      // 兼容性别名 - getSchedule => getMeetingSchedule
      getSchedule(params = {}) {
        return this.getMeetingSchedule(params);
      },
      // 获取状态文本
      getStatusText(status) {
        if (typeof status === "string") {
          if (["待审核", "已通过", "进行中", "已完成", "已拒绝", "已取消"].includes(status)) {
            return status;
          }
        }
        const normalizedStatus = this.normalizeStatus(status);
        switch (normalizedStatus) {
          case "pending":
            return "待审核";
          case "approved":
            return "已通过";
          case "in-progress":
            return "进行中";
          case "completed":
            return "已完成";
          case "rejected":
            return "已拒绝";
          case "cancelled":
          case "canceled":
            return "已取消";
          default:
            return "未知状态";
        }
      },
      // 标准化状态（将各种状态格式转为标准格式）
      normalizeStatus(status) {
        if (typeof status === "number") {
          switch (status) {
            case 0:
              return "pending";
            case 1:
              return "approved";
            case 2:
              return "in-progress";
            case 3:
              return "completed";
            case 4:
              return "cancelled";
            case 5:
              return "rejected";
            default:
              return "pending";
          }
        } else if (typeof status === "string") {
          status = status.toLowerCase();
          if (status === "待审核" || status === "待审批") {
            return "pending";
          } else if (status === "已通过" || status === "已审批") {
            return "approved";
          } else if (status === "进行中") {
            return "in-progress";
          } else if (status === "已完成") {
            return "completed";
          } else if (status === "已拒绝") {
            return "rejected";
          } else if (status === "已取消") {
            return "cancelled";
          }
          if (status.includes("pend") || status.includes("wait")) {
            return "pending";
          } else if (status.includes("approv") || status.includes("accept")) {
            return "approved";
          } else if (status.includes("progress") || status.includes("ongoing")) {
            return "in-progress";
          } else if (status.includes("complet") || status.includes("finish")) {
            return "completed";
          } else if (status.includes("reject") || status.includes("deny")) {
            return "rejected";
          } else if (status.includes("cancel")) {
            return "cancelled";
          }
        }
        return "pending";
      }
    },
    // 会议室相关业务
    room: {
      // 获取会议室列表
      getRooms(params) {
        formatAppLog("log", "at api/index.js:1351", "【API请求】", { method: "getRooms", params });
        const { pageNo = 1, pageSize = 100, isAsc = true, sortBy = "id" } = params || {};
        return getRooms(pageNo, pageSize, isAsc, sortBy).then((res) => {
          if (res.code === 200 && res.data) {
            const rooms = res.data.list || res.data || [];
            const result = {
              code: 200,
              data: rooms,
              message: res.message || "获取会议室列表成功"
            };
            return result;
          }
          return res;
        });
      },
      // 获取会议室详情
      getRoomDetail(id) {
        formatAppLog("log", "at api/index.js:1373", "【API请求】", { method: "getRoomDetail", id });
        return getRooms(1, 100, true, "id").then((res) => {
          if (res.code === 200 && res.data) {
            let rooms = [];
            if (res.data.list) {
              rooms = res.data.list;
            } else if (Array.isArray(res.data)) {
              rooms = res.data;
            }
            const room = rooms.find((r) => r.id == id);
            if (room) {
              return {
                code: 200,
                data: room,
                message: "获取会议室详情成功"
              };
            } else {
              return {
                code: 404,
                message: "未找到指定会议室",
                data: null
              };
            }
          }
          return res;
        });
      },
      // 创建会议室
      createRoom(roomData) {
        return createRoom(roomData);
      },
      // 更新会议室
      updateRoom(roomData) {
        return updateRoom(roomData);
      },
      // 删除会议室
      deleteRoom(id) {
        return deleteRoom(id);
      },
      // 获取会议室可用时间
      getRoomAvailableTime(id, date) {
        return getReservations({
          roomId: id,
          reserveDate: date,
          pageSize: 100
        }).then((res) => {
          if (res.code === 200) {
            const workHours = [
              { startTime: "09:00", endTime: "12:00", available: true },
              { startTime: "14:00", endTime: "18:00", available: true }
            ];
            if (!res.data || !res.data.list || res.data.list.length === 0) {
              return {
                code: 200,
                data: workHours,
                message: "获取会议室可用时间成功"
              };
            }
            const bookedTimes = [];
            res.data.list.forEach((meeting2) => {
              if (meeting2.status === "approved" && meeting2.startTime && meeting2.endTime) {
                bookedTimes.push({
                  startTime: meeting2.startTime.split(" ")[1] || meeting2.startTime,
                  endTime: meeting2.endTime.split(" ")[1] || meeting2.endTime,
                  available: false
                });
              }
            });
            const allTimeSlots = [...workHours, ...bookedTimes].sort((a, b) => {
              return a.startTime.localeCompare(b.startTime);
            });
            return {
              code: 200,
              data: allTimeSlots,
              message: "获取会议室可用时间成功"
            };
          }
          return res;
        });
      },
      // 兼容性别名 - getAvailableTime => getRoomAvailableTime
      getAvailableTime(id, date) {
        return this.getRoomAvailableTime(id, date);
      },
      // 获取所有可用的会议室（特定日期时间段）
      getAvailableRooms(date, startTime, endTime) {
        return getRooms({ pageSize: 100 }).then((res) => {
          if (res.code === 200 && res.data && res.data.list) {
            const rooms = res.data.list;
            if (!date || !startTime || !endTime) {
              return {
                code: 200,
                data: rooms,
                message: "获取可用会议室成功"
              };
            }
            const checkPromises = rooms.map(
              (room) => this.getRoomAvailableTime(room.id, date).then((availRes) => {
                if (availRes.code === 200 && availRes.data) {
                  const isAvailable = this.checkTimeSlotAvailable(
                    availRes.data,
                    startTime,
                    endTime
                  );
                  return __spreadProps(__spreadValues({}, room), {
                    isAvailable
                  });
                }
                return __spreadProps(__spreadValues({}, room), { isAvailable: false });
              }).catch(() => __spreadProps(__spreadValues({}, room), { isAvailable: false }))
            );
            return Promise.all(checkPromises).then((roomsWithAvailability) => {
              const availableRooms = roomsWithAvailability.filter((room) => room.isAvailable);
              return {
                code: 200,
                data: availableRooms,
                message: "获取可用会议室成功"
              };
            });
          }
          return res;
        });
      },
      // 检查时间段是否可用
      checkTimeSlotAvailable(availableTimes, startTime, endTime) {
        if (!availableTimes || !Array.isArray(availableTimes)) {
          return false;
        }
        const convertToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };
        const requestStart = convertToMinutes(startTime);
        const requestEnd = convertToMinutes(endTime);
        for (const slot of availableTimes) {
          if (!slot.available) {
            const slotStart = convertToMinutes(slot.startTime);
            const slotEnd = convertToMinutes(slot.endTime);
            if (!(requestEnd <= slotStart || requestStart >= slotEnd)) {
              return false;
            }
          }
        }
        return true;
      }
    },
    // 通知相关业务
    notification: {
      // 获取通知列表
      getNotificationList(params) {
        return getNotifications(
          params == null ? void 0 : params.pageNo,
          params == null ? void 0 : params.pageSize,
          params == null ? void 0 : params.isAsc,
          params == null ? void 0 : params.sortBy
        );
      },
      // 获取通知详情
      getNotificationDetail(id) {
        return getNotificationById(id);
      },
      // 管理员查看通知
      adminGetNotification(id) {
        return adminGetNotification(id);
      },
      // 管理员发送会前提醒
      adminRemind(id) {
        return adminRemind(id);
      },
      // 获取未读通知数量
      getUnreadCount() {
        return getNotifications(1, 1, false, "id").then((res) => {
          if (res.code === 200 && res.data) {
            return {
              code: 200,
              data: {
                count: res.data.total || 0
              },
              message: "获取未读通知数量成功"
            };
          }
          return {
            code: res.code || 500,
            data: { count: 0 },
            message: res.message || "获取未读通知数量失败"
          };
        }).catch(() => {
          return {
            code: 500,
            data: { count: 0 },
            message: "获取未读通知数量失败"
          };
        });
      },
      // 通知页面所需接口
      getList(page, size) {
        return this.getNotificationList({ pageNo: page, pageSize: size });
      },
      getById(id) {
        formatAppLog("log", "at api/index.js:1628", "API层通知详情请求，ID:", id);
        if (!id) {
          formatAppLog("error", "at api/index.js:1631", "API层：通知ID为空");
          return Promise.resolve({
            code: 400,
            message: "无效的通知ID",
            data: null
          });
        }
        return this.getNotificationDetail(id).then((res) => {
          formatAppLog("log", "at api/index.js:1641", "API层通知详情响应:", res);
          if (res.code !== 200 || !res.data) {
            return {
              code: res.code || 404,
              message: res.message || "获取通知详情失败",
              data: null
            };
          }
          return res;
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1655", "API层通知详情请求失败:", err);
          return {
            code: 500,
            message: "请求通知详情失败",
            data: null
          };
        });
      }
    },
    // 子议题相关业务
    subtopic: {
      // 创建子议题
      createSubtopic(data) {
        return createSubtopic(data);
      },
      // 更新子议题
      updateSubtopic(data) {
        return updateSubtopic(data);
      },
      // 上传子议题文件
      uploadSubtopicFile(subId, fileKey, file) {
        return uploadSubtopicFile(subId, fileKey, file);
      },
      // 根据会议ID获取所有子议题
      getSubtopicsByReservationId(reservationId) {
        return getSubtopicsByReservationId(reservationId).then((res) => {
          formatAppLog("log", "at api/index.js:1686", "获取子议题响应:", res);
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || "未找到子议题",
            data: []
          };
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1698", "获取子议题异常:", err);
          return {
            code: 500,
            message: "获取子议题失败",
            data: []
          };
        });
      },
      // 获取子议题文件
      getSubtopicFileList(subId) {
        return getSubtopicFileList(subId).then((res) => {
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || "未找到文件",
            data: []
          };
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1721", "获取子议题文件异常:", err);
          return {
            code: 500,
            message: "获取子议题文件失败",
            data: []
          };
        });
      }
    },
    // 参会人员相关业务
    participant: {
      // 获取参会人员列表
      getParticipantList(meetingId) {
        if (!meetingId) {
          formatAppLog("error", "at api/index.js:1736", "获取参会人员：缺少会议ID");
          return Promise.resolve({
            code: 400,
            message: "缺少会议ID",
            data: []
          });
        }
        return getParticipants(meetingId).then((res) => {
          formatAppLog("log", "at api/index.js:1746", "获取参会人员响应:", res);
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || "未找到参会人员",
            data: []
          };
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1758", "获取参会人员异常:", err);
          return {
            code: 500,
            message: "获取参会人员失败",
            data: []
          };
        });
      },
      // 确认参会
      confirmParticipation(id) {
        return confirmParticipation(id, true).then((res) => {
          if (res.code === 200) {
            return {
              code: 200,
              message: "已确认参加会议",
              data: { confirmed: true }
            };
          }
          return res;
        });
      },
      // 拒绝参会
      rejectParticipation(id) {
        return confirmParticipation(id, false).then((res) => {
          if (res.code === 200) {
            return {
              code: 200,
              message: "已拒绝参加会议",
              data: { confirmed: false }
            };
          }
          return res;
        });
      }
    },
    // 文件相关业务
    file: {
      // 获取文件URL
      getFileUrl(fileKey) {
        if (!fileKey) {
          return Promise.resolve({
            code: 400,
            message: "文件标识符不能为空",
            data: null
          });
        }
        return getFileUrl(fileKey).then((res) => {
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || "获取文件地址失败",
            data: null
          };
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1822", "获取文件地址异常:", err);
          return {
            code: 500,
            message: "获取文件地址失败",
            data: null
          };
        });
      },
      // 上传文件
      uploadFile(file) {
        if (!file) {
          return Promise.resolve({
            code: 400,
            message: "文件不能为空",
            data: null
          });
        }
        return uploadFile(file).then((res) => {
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 500,
            message: res.message || "上传文件失败",
            data: null
          };
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1853", "上传文件异常:", err);
          return {
            code: 500,
            message: "上传文件失败",
            data: null
          };
        });
      },
      // 下载文件
      downloadFile(fileKey) {
        if (!fileKey) {
          return Promise.resolve({
            code: 400,
            message: "文件标识符不能为空",
            data: null
          });
        }
        return downloadFile(fileKey).then((res) => {
          return res;
        }).catch((err) => {
          formatAppLog("error", "at api/index.js:1877", "下载文件异常:", err);
          return {
            code: 500,
            message: "下载文件失败",
            data: null
          };
        });
      }
    },
    // 通知相关业务
    notify: {
      // 管理员获取用户通知
      adminGetNotification(id) {
        return adminGetNotification(id);
      }
    }
  };
  function getBaseUrl() {
    const defaultBaseUrl = "http://182.92.115.169:8080";
    try {
      const apiConfig = uni.getStorageSync("apiConfig");
      if (apiConfig && apiConfig.baseUrl) {
        return apiConfig.baseUrl;
      }
    } catch (e) {
      formatAppLog("error", "at api/index.js:1908", "获取API配置失败:", e);
    }
    return defaultBaseUrl;
  }
  function getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    try {
      const token = uni.getStorageSync("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        print(token);
      }
    } catch (e) {
      formatAppLog("error", "at api/index.js:1929", "获取token失败:", e);
    }
    return headers;
  }
  const _sfc_main$s = {
    data() {
      return {
        isLoginMode: true,
        loginForm: {
          username: "",
          password: "",
          code: "",
          uuid: ""
        },
        registerForm: {
          username: "",
          password: "",
          confirmPassword: "",
          code: "",
          uuid: ""
        },
        rememberMe: false,
        showPassword: false,
        captchaImageUrl: "",
        isMockMode: false
      };
    },
    onLoad() {
      try {
        const loginInfo = uni.getStorageSync("loginInfo");
        if (loginInfo) {
          const info = JSON.parse(loginInfo);
          this.loginForm.username = info.username || "";
          this.loginForm.password = info.password || "";
          this.rememberMe = true;
        }
      } catch (e) {
        uni.removeStorageSync("loginInfo");
      }
      this.refreshCaptcha();
    },
    methods: {
      switchToLogin() {
        this.isLoginMode = true;
        this.refreshCaptcha();
      },
      switchToRegister() {
        this.isLoginMode = false;
        this.registerForm.code = this.loginForm.code;
        this.registerForm.uuid = this.loginForm.uuid;
      },
      refreshCaptcha() {
        uni.showLoading({
          title: "获取验证码..."
        });
        api.user.getCaptcha().then((res) => {
          uni.hideLoading();
          if (res.code === 200 && res.data) {
            this.captchaImageUrl = res.data.imageUrl || "data:image/png;base64," + res.data.img;
            this.loginForm.uuid = res.data.uuid;
            this.loginForm.code = "";
          } else {
            uni.showToast({
              title: "获取验证码失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: "获取验证码失败，请稍后重试",
            icon: "none"
          });
        });
      },
      handleLogin() {
        if (!this.loginForm.username.trim()) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return;
        }
        if (!this.loginForm.password.trim()) {
          uni.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return;
        }
        if (!this.loginForm.code.trim()) {
          uni.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "登录中..."
        });
        let loginTimeout = false;
        const timeoutTimer = setTimeout(() => {
          loginTimeout = true;
          uni.hideLoading();
          uni.showModal({
            title: "登录超时",
            content: "服务器响应超时，请检查网络连接后重试",
            showCancel: false
          });
        }, 15e3);
        api.user.login({
          username: this.loginForm.username,
          password: this.loginForm.password,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }).then((res) => {
          var _a2;
          clearTimeout(timeoutTimer);
          uni.hideLoading();
          if (loginTimeout)
            return;
          if (res.code === 200 && res.data && res.data.token) {
            const userData = res.data;
            const isActive = ((_a2 = userData.user) == null ? void 0 : _a2.isActive) || userData.isActive;
            if (isActive === 0) {
              uni.showToast({
                title: "您的账号已被禁用，请联系管理员",
                icon: "none",
                duration: 3e3
              });
              this.refreshCaptcha();
              return;
            }
            const token = res.data.token;
            uni.setStorageSync("token", token);
            api.user.getUserInfo().then((userInfoRes) => {
              if (userInfoRes.code === 200 && userInfoRes.data) {
                uni.setStorageSync("userInfo", JSON.stringify(userInfoRes.data));
                formatAppLog("log", "at pages/user/login.vue:273", "已保存用户信息:", userInfoRes.data);
              } else {
                formatAppLog("log", "at pages/user/login.vue:275", "获取用户信息失败:", userInfoRes);
              }
            }).catch((err) => {
              formatAppLog("error", "at pages/user/login.vue:279", "获取用户信息出错:", err);
            });
            if (this.rememberMe) {
              uni.setStorageSync("loginInfo", JSON.stringify({
                username: this.loginForm.username,
                password: this.loginForm.password
              }));
            } else {
              uni.removeStorageSync("loginInfo");
            }
            uni.showToast({
              title: "登录成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/user/schedule"
                  });
                }, 1e3);
              }
            });
          } else {
            uni.showToast({
              title: res.message || "登录失败，请检查用户名和密码",
              icon: "none"
            });
            this.refreshCaptcha();
          }
        }).catch((err) => {
          clearTimeout(timeoutTimer);
          uni.hideLoading();
          if (loginTimeout)
            return;
          uni.showToast({
            title: "登录失败，请稍后重试",
            icon: "none"
          });
          this.refreshCaptcha();
        });
      },
      handleRegister() {
        if (!this.registerForm.username.trim()) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return;
        }
        if (!this.registerForm.password.trim()) {
          uni.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return;
        }
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return;
        }
        if (!this.registerForm.code.trim()) {
          uni.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "注册中..."
        });
        api.user.register({
          username: this.registerForm.username,
          password: this.registerForm.password,
          code: this.registerForm.code,
          uuid: this.registerForm.uuid
        }).then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({
              title: "注册成功",
              icon: "success"
            });
            this.loginForm.username = this.registerForm.username;
            this.loginForm.password = this.registerForm.password;
            this.switchToLogin();
            this.registerForm = {
              username: "",
              password: "",
              confirmPassword: "",
              code: "",
              uuid: ""
            };
          } else {
            uni.showToast({
              title: res.message || "注册失败",
              icon: "none"
            });
            this.refreshCaptcha();
          }
        }).catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: "注册失败，请稍后重试",
            icon: "none"
          });
          this.refreshCaptcha();
        });
      },
      rememberChange(e) {
        this.rememberMe = e.detail.value.length > 0;
      },
      navigateToForgetPassword() {
        uni.showToast({
          title: "该功能暂未开放",
          icon: "none"
        });
      },
      navigateToAdminLogin() {
        uni.navigateTo({
          url: "/pages/admin/login"
        });
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createElementVNode("view", { class: "logo-area" }, [
        vue.createElementVNode("image", {
          class: "logo-image",
          src: _imports_0$2,
          mode: "aspectFit"
        }),
        vue.createElementVNode("text", { class: "app-name" }, "会议室预约系统")
      ]),
      vue.createElementVNode("view", { class: "form-tabs" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", $data.isLoginMode ? "active" : ""]),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.switchToLogin && $options.switchToLogin(...args))
          },
          "登录",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", !$data.isLoginMode ? "active" : ""]),
            onClick: _cache[1] || (_cache[1] = (...args) => $options.switchToRegister && $options.switchToRegister(...args))
          },
          "注册",
          2
          /* CLASS */
        )
      ]),
      vue.createElementVNode("view", { class: "login-form" }, [
        vue.createCommentVNode(" 登录表单 "),
        $data.isLoginMode ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "用户名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-field",
                type: "text",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.loginForm.username = $event),
                placeholder: "请输入用户名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.loginForm.username]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-field",
                type: "password",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.loginForm.password = $event),
                placeholder: "请输入密码",
                password: ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.loginForm.password]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-group captcha-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "验证码"),
            vue.createElementVNode("view", { class: "captcha-container" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-field captcha-input",
                  type: "text",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.loginForm.code = $event),
                  placeholder: "请输入验证码"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.loginForm.code]
              ]),
              vue.createElementVNode("view", {
                class: "captcha-wrapper",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "captcha-image",
                  src: $data.captchaImageUrl
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "refresh-icon" }, [
                  vue.createElementVNode("text", { class: "refresh-text" }, "刷新")
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "remember-row" }, [
            vue.createElementVNode(
              "checkbox-group",
              {
                onChange: _cache[6] || (_cache[6] = (...args) => $options.rememberChange && $options.rememberChange(...args))
              },
              [
                vue.createElementVNode("label", { class: "remember-label" }, [
                  vue.createElementVNode("checkbox", { checked: $data.rememberMe }, null, 8, ["checked"]),
                  vue.createElementVNode("text", null, "记住密码")
                ])
              ],
              32
              /* NEED_HYDRATION */
            ),
            vue.createElementVNode("text", {
              class: "forget-password",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.navigateToForgetPassword && $options.navigateToForgetPassword(...args))
            }, "忘记密码?")
          ]),
          vue.createElementVNode("button", {
            class: "login-button",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.handleLogin && $options.handleLogin(...args))
          }, "登 录")
        ])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            vue.createCommentVNode(" 注册表单 "),
            vue.createElementVNode("view", null, [
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "用户名"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    type: "text",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.registerForm.username = $event),
                    placeholder: "请输入用户名"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.registerForm.username]
                ])
              ]),
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    type: "password",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.registerForm.password = $event),
                    placeholder: "请输入密码",
                    password: ""
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.registerForm.password]
                ])
              ]),
              vue.createElementVNode("view", { class: "input-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "确认密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input-field",
                    type: "password",
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.registerForm.confirmPassword = $event),
                    placeholder: "请再次输入密码",
                    password: ""
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.registerForm.confirmPassword]
                ])
              ]),
              vue.createElementVNode("view", { class: "input-group captcha-group" }, [
                vue.createElementVNode("text", { class: "input-label" }, "验证码"),
                vue.createElementVNode("view", { class: "captcha-container" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "input-field captcha-input",
                      type: "text",
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.registerForm.code = $event),
                      placeholder: "请输入验证码"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.registerForm.code]
                  ]),
                  vue.createElementVNode("view", {
                    class: "captcha-wrapper",
                    onClick: _cache[13] || (_cache[13] = (...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args))
                  }, [
                    vue.createElementVNode("image", {
                      class: "captcha-image",
                      src: $data.captchaImageUrl
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "refresh-icon" }, [
                      vue.createElementVNode("text", { class: "refresh-text" }, "刷新")
                    ])
                  ])
                ])
              ]),
              vue.createElementVNode("button", {
                class: "login-button",
                onClick: _cache[14] || (_cache[14] = (...args) => $options.handleRegister && $options.handleRegister(...args))
              }, "注 册")
            ])
          ],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )),
        vue.createElementVNode("view", { class: "quick-actions" }, [
          $data.isLoginMode ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            [
              vue.createElementVNode("text", {
                class: "quick-action-text",
                onClick: _cache[15] || (_cache[15] = (...args) => $options.switchToRegister && $options.switchToRegister(...args))
              }, "注册账号"),
              vue.createElementVNode("text", { class: "divider" }, "|"),
              vue.createElementVNode("text", {
                class: "quick-action-text",
                onClick: _cache[16] || (_cache[16] = (...args) => $options.navigateToAdminLogin && $options.navigateToAdminLogin(...args))
              }, "管理员登录")
            ],
            64
            /* STABLE_FRAGMENT */
          )) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "quick-action-text",
            onClick: _cache[17] || (_cache[17] = (...args) => $options.switchToLogin && $options.switchToLogin(...args))
          }, "返回登录"))
        ])
      ]),
      vue.createElementVNode("view", { class: "support-info" }, [
        vue.createElementVNode("text", { class: "support-text" }, "技术支持: example@company.com"),
        vue.createElementVNode("text", { class: "version-text" }, "版本 1.0.0")
      ])
    ]);
  }
  const PagesUserLogin = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$s], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/login.vue"]]);
  /*!
    * vue-router v4.3.0
    * (c) 2024 Eduardo San Martin Morote
    * @license MIT
    */
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  var NavigationFailureType;
  (function(NavigationFailureType2) {
    NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
    NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
    NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
  })(NavigationFailureType || (NavigationFailureType = {}));
  const routeLocationKey = Symbol("route location");
  function useRoute() {
    return vue.inject(routeLocationKey);
  }
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages && messages[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages && Object.keys(messages).length > 0) {
      locales = Object.keys(messages);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n2) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n2.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n2.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages,
        locale
      ];
      locale = options[0];
      messages = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n2 = new I18n({
      locale,
      fallbackLocale,
      messages,
      watcher
    });
    let t = (key, values) => {
      if (typeof getApp !== "function") {
        t = function(key2, values2) {
          return i18n2.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n2);
            }
          }
          return i18n2.t(key2, values2);
        };
      }
      return t(key, values);
    };
    return {
      i18n: i18n2,
      f(message, values, delimiters) {
        return i18n2.f(message, values, delimiters);
      },
      t(key, values) {
        return t(key, values);
      },
      add(locale2, message, override = true) {
        return i18n2.add(locale2, message, override);
      },
      watch(fn) {
        return i18n2.watchLocale(fn);
      },
      getLocale() {
        return i18n2.getLocale();
      },
      setLocale(newLocale) {
        return i18n2.setLocale(newLocale);
      }
    };
  }
  function isI18nStr(value, delimiters) {
    return value.indexOf(delimiters[0]) > -1;
  }
  const isEnableLocale = /* @__PURE__ */ once(
    () => typeof __uniConfig !== "undefined" && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length
  );
  let i18n;
  function getLocaleMessage() {
    const locale = uni.getLocale();
    const locales = __uniConfig.locales;
    return locales[locale] || locales[__uniConfig.fallbackLocale] || locales.en || {};
  }
  function formatI18n(message) {
    if (isI18nStr(message, I18N_JSON_DELIMITERS)) {
      return useI18n().f(message, getLocaleMessage(), I18N_JSON_DELIMITERS);
    }
    return message;
  }
  function resolveJsonObj(jsonObj, names) {
    if (names.length === 1) {
      if (jsonObj) {
        const _isI18nStr = (value2) => shared.isString(value2) && isI18nStr(value2, I18N_JSON_DELIMITERS);
        const _name = names[0];
        let filterJsonObj = [];
        if (shared.isArray(jsonObj) && (filterJsonObj = jsonObj.filter((item) => _isI18nStr(item[_name]))).length) {
          return filterJsonObj;
        }
        const value = jsonObj[names[0]];
        if (_isI18nStr(value)) {
          return jsonObj;
        }
      }
      return;
    }
    const name = names.shift();
    return resolveJsonObj(jsonObj && jsonObj[name], names);
  }
  function defineI18nProperty(obj, names) {
    const jsonObj = resolveJsonObj(obj, names);
    if (!jsonObj) {
      return false;
    }
    const prop = names[names.length - 1];
    if (shared.isArray(jsonObj)) {
      jsonObj.forEach((item) => defineI18nProperty(item, [prop]));
    } else {
      let value = jsonObj[prop];
      Object.defineProperty(jsonObj, prop, {
        get() {
          return formatI18n(value);
        },
        set(v2) {
          value = v2;
        }
      });
    }
    return true;
  }
  function useI18n() {
    if (!i18n) {
      let locale;
      {
        {
          locale = navigator.cookieEnabled && window.localStorage && localStorage[UNI_STORAGE_LOCALE] || __uniConfig.locale || navigator.language;
        }
      }
      i18n = initVueI18n(locale);
      if (isEnableLocale()) {
        const localeKeys = Object.keys(__uniConfig.locales || {});
        if (localeKeys.length) {
          localeKeys.forEach(
            (locale2) => i18n.add(locale2, __uniConfig.locales[locale2])
          );
        }
        i18n.setLocale(locale);
      }
    }
    return i18n;
  }
  function initTabBarI18n(tabBar2) {
    if (isEnableLocale() && tabBar2.list) {
      tabBar2.list.forEach((item) => {
        defineI18nProperty(item, ["text"]);
      });
    }
    return tabBar2;
  }
  function getRealRoute(fromRoute, toRoute) {
    if (toRoute.indexOf("/") === 0) {
      return toRoute;
    }
    if (toRoute.indexOf("./") === 0) {
      return getRealRoute(fromRoute, toRoute.slice(2));
    }
    const toRouteArray = toRoute.split("/");
    const toRouteLength = toRouteArray.length;
    let i = 0;
    for (; i < toRouteLength && toRouteArray[i] === ".."; i++) {
    }
    toRouteArray.splice(0, i);
    toRoute = toRouteArray.join("/");
    const fromRouteArray = fromRoute.length > 0 ? fromRoute.split("/") : [];
    fromRouteArray.splice(fromRouteArray.length - i - 1, i + 1);
    return addLeadingSlash(fromRouteArray.concat(toRouteArray).join("/"));
  }
  let tabBar;
  function useTabBar() {
    if (!tabBar) {
      tabBar = __uniConfig.tabBar && vue.reactive(initTabBarI18n(__uniConfig.tabBar));
    }
    return tabBar;
  }
  const currentPagesMap = /* @__PURE__ */ new Map();
  function getPage$BasePage(page) {
    return page.$page;
  }
  function getCurrentBasePages() {
    const curPages = [];
    const pages = currentPagesMap.values();
    for (const page of pages) {
      if (page.$.__isTabBar) {
        if (page.$.__isActive) {
          curPages.push(page);
        }
      } else {
        curPages.push(page);
      }
    }
    return curPages;
  }
  function addBase(filePath) {
    const { base: baseUrl } = __uniConfig.router;
    if (addLeadingSlash(filePath).indexOf(baseUrl) === 0) {
      return addLeadingSlash(filePath);
    }
    return baseUrl + filePath;
  }
  function getRealPath(filePath) {
    const { base, assets } = __uniConfig.router;
    if (base === "./") {
      if (filePath.indexOf("./") === 0 && (filePath.includes("/static/") || filePath.indexOf("./" + (assets || "assets") + "/") === 0)) {
        filePath = filePath.slice(1);
      }
    }
    if (filePath.indexOf("/") === 0) {
      if (filePath.indexOf("//") === 0) {
        filePath = "https:" + filePath;
      } else {
        return addBase(filePath.slice(1));
      }
    }
    if (SCHEME_RE.test(filePath) || DATA_RE.test(filePath) || filePath.indexOf("blob:") === 0) {
      return filePath;
    }
    const pages = getCurrentBasePages();
    if (pages.length) {
      return addBase(
        getRealRoute(
          getPage$BasePage(pages[pages.length - 1]).route,
          filePath
        ).slice(1)
      );
    }
    return filePath;
  }
  const _sfc_main$r = {
    name: "CustomTabBar",
    props: {
      selected: {
        type: Number,
        default: 0
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      direction: {
        type: String,
        default: "horizontal"
      }
    },
    setup(props, { emit }) {
      const tabBar2 = useTabBar();
      const route = useRoute();
      const hasTabBar = vue.computed(() => tabBar2.list && tabBar2.list.length);
      const selectedIndex = vue.ref(props.selected);
      vue.watch(() => props.selected, (value) => selectedIndex.value = value);
      vue.watch(() => selectedIndex.value, (value) => tabBar2.selectedIndex = value);
      vue.watch(() => {
        const meta = route.meta;
        return [meta.isTabBar, meta.route];
      }, ([isTabBar, pagePath]) => {
        if (isTabBar) {
          const index = tabBar2.list.findIndex((item) => pagePath === item.pagePath);
          if (index > -1) {
            selectedIndex.value = index;
          }
        }
      });
      function switchTab(item, index) {
        selectedIndex.value = index;
        const detail = {
          index,
          text: item.text,
          pagePath: item.pagePath
        };
        emit("onTabItemTap", detail);
      }
      return {
        tabBar: tabBar2,
        getRealPath,
        selectedIndex,
        hasTabBar,
        showTabBar: true,
        switchTab
      };
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_tabbar = vue.resolveComponent("uni-tabbar");
    return $setup.hasTabBar ? vue.withDirectives((vue.openBlock(), vue.createBlock(
      _component_uni_tabbar,
      { key: 0 },
      {
        default: vue.withCtx(() => [
          vue.createElementVNode(
            "div",
            {
              style: vue.normalizeStyle({
                "flex-direction": $props.direction === "vertical" ? "column" : "row",
                backgroundColor: $setup.tabBar.backgroundColor
              }),
              class: "uni-tabbar"
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.tabBar.list, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    {
                      key: item.pagePath
                    },
                    [
                      item.visible !== false ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 0,
                        class: "uni-tabbar__item",
                        onClick: ($event) => $setup.switchTab(item, index)
                      }, [
                        vue.createElementVNode("div", { class: "uni-tabbar__bd" }, [
                          $props.showIcon && item.iconPath ? (vue.openBlock(), vue.createElementBlock(
                            "div",
                            {
                              key: 0,
                              class: vue.normalizeClass([{ "uni-tabbar__icon__diff": !item.text }, "uni-tabbar__icon"])
                            },
                            [
                              vue.createElementVNode("img", {
                                src: $setup.getRealPath(
                                  $setup.selectedIndex === index ? item.selectedIconPath : item.iconPath
                                )
                              }, null, 8, ["src"]),
                              item.redDot ? (vue.openBlock(), vue.createElementBlock(
                                "div",
                                {
                                  key: 0,
                                  class: vue.normalizeClass([{ "uni-tabbar__badge": !!item.badge }, "uni-tabbar__reddot"])
                                },
                                vue.toDisplayString(item.badge),
                                3
                                /* TEXT, CLASS */
                              )) : vue.createCommentVNode("v-if", true)
                            ],
                            2
                            /* CLASS */
                          )) : vue.createCommentVNode("v-if", true),
                          item.text ? (vue.openBlock(), vue.createElementBlock(
                            "div",
                            {
                              key: 1,
                              style: vue.normalizeStyle({
                                color: $setup.selectedIndex === index ? $setup.tabBar.selectedColor : $setup.tabBar.color,
                                fontSize: $props.showIcon && item.iconPath ? "10px" : "14px"
                              }),
                              class: "uni-tabbar__label"
                            },
                            [
                              vue.createTextVNode(
                                vue.toDisplayString(item.text) + " ",
                                1
                                /* TEXT */
                              ),
                              item.redDot && (!$props.showIcon || !item.iconPath) ? (vue.openBlock(), vue.createElementBlock(
                                "div",
                                {
                                  key: 0,
                                  class: vue.normalizeClass([{ "uni-tabbar__badge": !!item.badge }, "uni-tabbar__reddot"])
                                },
                                vue.toDisplayString(item.badge),
                                3
                                /* TEXT, CLASS */
                              )) : vue.createCommentVNode("v-if", true)
                            ],
                            4
                            /* STYLE */
                          )) : vue.createCommentVNode("v-if", true)
                        ])
                      ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            4
            /* STYLE */
          )
        ]),
        _: 1
        /* STABLE */
      },
      512
      /* NEED_PATCH */
    )), [
      [vue.vShow, $setup.showTabBar]
    ]) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$r], ["__file", "C:/Users/25867/Downloads/HBuilderX.4.55.2025030718/HBuilderX/plugins/uniapp-cli-vite/node_modules/@dcloudio/uni-components/lib/custom-tab-bar/custom-tab-bar.vue"]]);
  const _sfc_main$q = {
    name: "CustomTabBar",
    data() {
      return {
        currentTab: "schedule"
      };
    },
    created() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route || currentPage.$page.route;
      if (route.includes("/user/schedule")) {
        this.currentTab = "schedule";
      } else if (route.includes("/user/meeting/list")) {
        this.currentTab = "meeting";
      } else if (route.includes("/user/notification")) {
        this.currentTab = "notification";
      } else if (route.includes("/user/profile")) {
        this.currentTab = "profile";
      }
    },
    methods: {
      switchTab(tab) {
        if (this.currentTab === tab)
          return;
        this.currentTab = tab;
        let url = "";
        switch (tab) {
          case "schedule":
            url = "/pages/user/schedule";
            break;
          case "meeting":
            url = "/pages/user/meeting/list";
            break;
          case "notification":
            url = "/pages/user/notification";
            break;
          case "profile":
            url = "/pages/user/profile";
            break;
        }
        uni.reLaunch({
          url
        });
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "custom-tab-bar" }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["tab-item", { active: $data.currentTab === "schedule" }]),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.switchTab("schedule"))
        },
        [
          vue.createElementVNode("text", { class: "emoji-icon" }, "📅"),
          vue.createElementVNode("text", { class: "tab-text" }, "日程")
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["tab-item", { active: $data.currentTab === "meeting" }]),
          onClick: _cache[1] || (_cache[1] = ($event) => $options.switchTab("meeting"))
        },
        [
          vue.createElementVNode("text", { class: "emoji-icon" }, "🏢"),
          vue.createElementVNode("text", { class: "tab-text" }, "会议")
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["tab-item", { active: $data.currentTab === "notification" }]),
          onClick: _cache[2] || (_cache[2] = ($event) => $options.switchTab("notification"))
        },
        [
          vue.createElementVNode("text", { class: "emoji-icon" }, "🔔"),
          vue.createElementVNode("text", { class: "tab-text" }, "通知")
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["tab-item", { active: $data.currentTab === "profile" }]),
          onClick: _cache[3] || (_cache[3] = ($event) => $options.switchTab("profile"))
        },
        [
          vue.createElementVNode("text", { class: "emoji-icon" }, "👤"),
          vue.createElementVNode("text", { class: "tab-text" }, "我的")
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const CustomTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q], ["__scopeId", "data-v-416b8ca7"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/components/common/CustomTabBar.vue"]]);
  const _imports_0$1 = "/static/icons/calendar-empty.png";
  const _sfc_main$p = {
    components: {
      CustomTabBar
    },
    data() {
      return {
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        currentDate: /* @__PURE__ */ new Date(),
        currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
        currentMonth: (/* @__PURE__ */ new Date()).getMonth() + 1,
        selectedDate: "",
        events: [],
        currentEvents: [],
        loading: false,
        allEvents: [],
        userId: null,
        // 当前用户ID
        todayEvents: []
      };
    },
    created() {
      this.selectedDate = this.formatDateString(/* @__PURE__ */ new Date());
      try {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo && userInfo.id) {
          this.userId = userInfo.id.toString();
          formatAppLog("log", "at pages/user/schedule.vue:104", "日程页面获取到用户ID:", this.userId);
        } else {
          formatAppLog("warn", "at pages/user/schedule.vue:106", "未能从存储获取用户信息");
        }
      } catch (e) {
        formatAppLog("error", "at pages/user/schedule.vue:109", "获取用户信息失败:", e);
      }
    },
    computed: {
      // 计算日历网格中的所有日期
      calendarDays() {
        const year = this.currentYear;
        const month = this.currentMonth - 1;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const days = [];
        const prevMonth = month === 0 ? 12 : month;
        const prevYear = month === 0 ? year - 1 : year;
        for (let i = 0; i < firstDayOfWeek; i++) {
          const day = prevMonthLastDay - firstDayOfWeek + i + 1;
          const date = `${prevYear}-${this.padZero(prevMonth)}-${this.padZero(day)}`;
          days.push({
            day,
            date,
            isCurrentMonth: false,
            isToday: false,
            hasEvent: this.checkHasEvent(date)
          });
        }
        const today = /* @__PURE__ */ new Date();
        const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() === month;
        for (let i = 1; i <= daysInMonth; i++) {
          const date = `${year}-${this.padZero(month + 1)}-${this.padZero(i)}`;
          days.push({
            day: i,
            date,
            isCurrentMonth: true,
            isToday: isCurrentYearMonth && today.getDate() === i,
            hasEvent: this.checkHasEvent(date)
          });
        }
        const nextMonthDays = 42 - days.length;
        const nextMonth = month === 11 ? 1 : month + 2;
        const nextYear = month === 11 ? year + 1 : year;
        for (let i = 1; i <= nextMonthDays; i++) {
          const date = `${nextYear}-${this.padZero(nextMonth)}-${this.padZero(i)}`;
          days.push({
            day: i,
            date,
            isCurrentMonth: false,
            isToday: false,
            hasEvent: this.checkHasEvent(date)
          });
        }
        return days;
      },
      // 格式化显示选中的日期
      formatSelectedDate() {
        if (!this.selectedDate)
          return "";
        const dateParts = this.selectedDate.split("-");
        return `${dateParts[0]}年${dateParts[1]}月${dateParts[2]}日`;
      },
      // 获取选中日期的所有事件
      eventsOnSelectedDate() {
        const filteredEvents = this.events.filter((event) => {
          const match = event.reserveDate === this.selectedDate;
          return match;
        });
        return filteredEvents;
      }
    },
    onLoad() {
      const today = /* @__PURE__ */ new Date();
      const todayStr = today.getFullYear() + "-" + this.padZero(today.getMonth() + 1) + "-" + this.padZero(today.getDate());
      this.selectedDate = todayStr;
      this.fetchSchedules();
    },
    onPullDownRefresh() {
      this.fetchSchedules();
    },
    methods: {
      // 获取日程数据
      fetchSchedules() {
        this.loading = true;
        api.meeting.getSchedule({
          reserveDate: null,
          // 不限制日期，获取所有数据
          startTime: null,
          endTime: null,
          pageSize: 100,
          pageNo: 1
        }).then((res) => {
          if (res.code === 200) {
            formatAppLog("log", "at pages/user/schedule.vue:233", "原始返回数据:", res.data);
            let rawData = [];
            if (res.data && Array.isArray(res.data)) {
              rawData = res.data;
            } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
              rawData = res.data.list;
            }
            if (rawData.length > 0) {
              rawData.forEach((meeting2, index) => {
                formatAppLog("log", "at pages/user/schedule.vue:246", `会议${index + 1}:`, meeting2);
              });
            }
            let scheduleItems = [];
            try {
              scheduleItems = rawData.map((item) => this.formatScheduleItem(item));
              if (scheduleItems.length > 0) {
                formatAppLog("log", "at pages/user/schedule.vue:258", "格式化后的事件数组:", scheduleItems);
              }
            } catch (err) {
              formatAppLog("error", "at pages/user/schedule.vue:262", "格式化日程数据出错:", err);
              scheduleItems = [];
            }
            this.events = scheduleItems;
            this.allEvents = scheduleItems;
            this.filterEventsByDate(this.selectedDate);
          } else {
            uni.showToast({
              title: res.message || "获取日程失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.showToast({
            title: "获取日程失败",
            icon: "none"
          });
        }).finally(() => {
          this.loading = false;
          uni.stopPullDownRefresh();
        });
      },
      // 获取当前月的开始日期（格式：YYYY-MM-DD）
      getMonthStartDate() {
        const date = new Date(this.currentYear, this.currentMonth - 1, 1);
        return this.formatDateString(date);
      },
      // 获取当前月的结束日期（格式：YYYY-MM-DD）
      getMonthEndDate() {
        const date = new Date(this.currentYear, this.currentMonth, 0);
        return this.formatDateString(date);
      },
      // 获取状态文本
      getStatusText(status) {
        if (!status)
          return "未知";
        if (typeof status === "string") {
          if (["待审核", "已通过", "进行中", "已完成", "已拒绝", "已取消"].includes(status)) {
            return status;
          }
          const statusMap = {
            "pending": "待审核",
            "approved": "已通过",
            "in-progress": "进行中",
            "completed": "已完成",
            "rejected": "已拒绝",
            "cancelled": "已取消",
            "canceled": "已取消"
          };
          status = status.toLowerCase();
          if (statusMap[status]) {
            return statusMap[status];
          }
          if (status.includes("pend") || status.includes("wait") || status.includes("审核")) {
            return "待审核";
          } else if (status.includes("approv") || status.includes("通过")) {
            return "已通过";
          } else if (status.includes("progress") || status.includes("进行")) {
            return "进行中";
          } else if (status.includes("complet") || status.includes("finish") || status.includes("完成")) {
            return "已完成";
          } else if (status.includes("cancel") || status.includes("取消")) {
            return "已取消";
          } else if (status.includes("reject") || status.includes("拒绝")) {
            return "已拒绝";
          }
        }
        if (typeof status === "number" || /^\d+$/.test(status)) {
          const numStatus = parseInt(status);
          switch (numStatus) {
            case 0:
              return "待审核";
            case 1:
              return "已通过";
            case 2:
              return "进行中";
            case 3:
              return "已完成";
            case 4:
              return "已取消";
            case 5:
              return "已拒绝";
            default:
              return "未知";
          }
        }
        return "未知";
      },
      // 格式化日期为YYYY-MM-DD字符串
      formatDateString(date) {
        if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return date;
        }
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          const today = /* @__PURE__ */ new Date();
          return `${today.getFullYear()}-${this.padZero(today.getMonth() + 1)}-${this.padZero(today.getDate())}`;
        }
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        return `${year}-${month}-${day}`;
      },
      // 格式化时间为HH:MM字符串
      formatTimeString(date) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return "00:00";
        }
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        return `${hours}:${minutes}`;
      },
      // 数字补零
      padZero(num) {
        return num < 10 ? "0" + num : num;
      },
      // 切换月份
      changeMonth(delta) {
        let newMonth = this.currentMonth + delta;
        let newYear = this.currentYear;
        if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        } else if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
        this.currentMonth = newMonth;
        this.currentYear = newYear;
        this.initScheduleData();
        this.selectedDate = "";
        this.currentEvents = [];
      },
      // 检查日期是否有事件
      checkHasEvent(date) {
        if (!this.events || !this.events.length)
          return false;
        const dateStr = this.formatDateString(date);
        const hasEvent = this.events.some((event) => {
          const match = event.reserveDate === dateStr;
          return match;
        });
        return hasEvent;
      },
      // 根据日期筛选事件
      filterEventsByDate(date) {
        if (!date) {
          return this.allEvents;
        }
        const dateStr = this.formatDateString(date);
        const filtered = this.allEvents.filter((event) => event.reserveDate === dateStr);
        formatAppLog("log", "at pages/user/schedule.vue:444", `筛选日期 ${dateStr} 的事件:`, filtered);
        return filtered;
      },
      // 选择日期
      selectDate(date) {
        formatAppLog("log", "at pages/user/schedule.vue:450", "选择日期:", date);
        this.selectedDate = "";
        this.$nextTick(() => {
          const dateStr = this.formatDateString(date);
          this.selectedDate = dateStr;
          this.currentEvents = this.filterEventsByDate(dateStr);
          formatAppLog("log", "at pages/user/schedule.vue:463", `日期 ${dateStr} 的事件数量:`, this.currentEvents.length);
        });
      },
      // 获取事件状态样式类
      getStatusClass(status) {
        return {
          "status-approved": status === "approved",
          "status-pending": status === "pending",
          "status-in-progress": status === "in-progress",
          "status-completed": status === "completed",
          "status-rejected": status === "rejected",
          "status-canceled": status === "cancelled" || status === "canceled"
        };
      },
      // 跳转到创建会议页面
      navigateToCreateMeeting() {
        uni.navigateTo({
          url: "/pages/user/meeting/create"
        });
      },
      // 查看日程项详情
      viewEvent(event) {
        formatAppLog("log", "at pages/user/schedule.vue:485", "查看日程项:", JSON.stringify(event));
        if (!event || !event.id) {
          uni.showToast({
            title: "无效的日程项",
            icon: "none"
          });
          return;
        }
        const originalEvent = this.allEvents.find(
          (item) => item.id && item.id.toString() === event.id.toString()
        );
        formatAppLog("log", "at pages/user/schedule.vue:500", "找到的原始会议数据:", originalEvent);
        if (originalEvent) {
          const meetingData = {
            id: event.id,
            topic: event.title || "未命名会议",
            description: event.description || "",
            booker: event.booker || "",
            room: event.location || "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            status: event.status || "pending",
            reserveDate: event.reserveDate || event.date || "",
            // 额外提供字段用于前端组件使用
            roomName: typeof event.room === "object" ? event.room.name : event.roomName || event.room || event.location || "",
            roomId: event.roomId || (typeof event.room === "object" ? event.room.id : null) || 0,
            participants: event.participants || [],
            title: event.title || "未命名会议",
            date: event.reserveDate || event.date || ""
          };
          const meetingInfo = encodeURIComponent(JSON.stringify(meetingData));
          const url = `/pages/user/meeting/detail?id=${event.id}&from=schedule&meetingInfo=${meetingInfo}`;
          formatAppLog("log", "at pages/user/schedule.vue:528", "导航到会议详情页:", url);
          uni.navigateTo({
            url,
            fail: (err) => {
              formatAppLog("error", "at pages/user/schedule.vue:533", "导航到会议详情页失败:", err);
              uni.showToast({
                title: "打开详情失败",
                icon: "none"
              });
            }
          });
        } else {
          uni.showToast({
            title: "未找到会议详情",
            icon: "none"
          });
        }
      },
      // 格式化日程项
      formatScheduleItem(item) {
        if (!item)
          return null;
        formatAppLog("log", "at pages/user/schedule.vue:553", "格式化会议项，原始数据:", JSON.stringify(item));
        return {
          id: item.id || "",
          topic: item.title || item.topic || "",
          startTime: item.start || item.startTime || "",
          endTime: item.end || item.endTime || "",
          status: item.status || "",
          statusText: item.status || "",
          reserveDate: item.date || item.reserveDate || "",
          title: item.title || item.topic || "",
          location: item.room || "",
          date: item.date || item.reserveDate || ""
        };
      },
      // 根据状态获取颜色
      getStatusColor(status) {
        if (!status)
          return "#1890ff";
        status = String(status).toLowerCase();
        switch (status) {
          case "approved":
          case "1":
            return "#52c41a";
          case "pending":
          case "0":
            return "#faad14";
          case "rejected":
          case "5":
            return "#f5222d";
          case "canceled":
          case "cancelled":
          case "4":
            return "#d9d9d9";
          case "in-progress":
          case "2":
            return "#1890ff";
          case "completed":
          case "3":
            return "#722ed1";
          default:
            return "#1890ff";
        }
      },
      // 初始化日程数据
      initScheduleData() {
        api.meeting.getSchedule({
          pageNo: 1,
          pageSize: 50,
          startTime: this.getMonthStartDate(),
          endTime: this.getMonthEndDate()
        }).then((res) => {
          if (res.code === 200 && res.data && res.data.list) {
            const userInfo = uni.getStorageSync("userInfo");
            const currentUsername = (userInfo == null ? void 0 : userInfo.username) || "";
            formatAppLog("log", "at pages/user/schedule.vue:612", "当前用户名:", currentUsername);
            const scheduleItems = res.data.list.map(this.formatScheduleItem);
            const userMeetings = scheduleItems.filter((item) => {
              return item.booker === currentUsername || item.participants && item.participants.some((p) => p.username === currentUsername);
            });
            formatAppLog("log", "at pages/user/schedule.vue:623", "筛选后的用户会议:", userMeetings);
            this.events = userMeetings;
            this.allEvents = userMeetings;
            this.currentEvents = this.filterEventsByDate(this.selectedDate);
          }
        }).catch((err) => {
          uni.showToast({
            title: "获取日程失败",
            icon: "none"
          });
        });
      },
      // 获取今天的会议日程
      fetchTodaySchedules() {
        this.loading = true;
        const today = /* @__PURE__ */ new Date();
        const todayStr = today.getFullYear() + "-" + this.padZero(today.getMonth() + 1) + "-" + this.padZero(today.getDate());
        this.selectedDate = todayStr;
        api.meeting.getSchedule({
          reserveDate: todayStr,
          startTime: "00:00:00",
          // 这是查询参数，不是会议时间
          endTime: "23:59:59",
          // 这是查询参数，不是会议时间
          pageSize: 100,
          pageNo: 1
        }).then((res) => {
          if (res.code === 200) {
            let scheduleItems = [];
            try {
              if (res.data && Array.isArray(res.data)) {
                scheduleItems = res.data.map((item) => this.formatScheduleItem(item));
              } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
                scheduleItems = res.data.list.map((item) => this.formatScheduleItem(item));
              } else {
                scheduleItems = [];
              }
            } catch (err) {
              scheduleItems = [];
            }
            this.todayEvents = scheduleItems;
            if (this.selectedDate === todayStr) {
              this.filterEventsByDate(todayStr);
            }
          } else {
            uni.showToast({
              title: res.message || "获取今日日程失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.showToast({
            title: "获取今日日程失败",
            icon: "none"
          });
        }).finally(() => {
          this.loading = false;
        });
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_tab_bar = resolveEasycom(vue.resolveDynamicComponent("custom-tab-bar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "schedule-container" }, [
          vue.createCommentVNode(" 日历组件 "),
          vue.createElementVNode("view", { class: "calendar-wrapper" }, [
            vue.createElementVNode("view", { class: "calendar-header" }, [
              vue.createElementVNode("view", { class: "month-selector" }, [
                vue.createElementVNode("text", {
                  class: "month-arrow",
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.changeMonth(-1))
                }, "◀"),
                vue.createElementVNode(
                  "text",
                  { class: "current-month" },
                  vue.toDisplayString($data.currentYear) + "年" + vue.toDisplayString($data.currentMonth) + "月",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", {
                  class: "month-arrow",
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.changeMonth(1))
                }, "▶")
              ])
            ]),
            vue.createCommentVNode(" 星期头部 "),
            vue.createElementVNode("view", { class: "weekdays" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.weekdays, (day, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      class: "weekday",
                      key: index
                    },
                    vue.toDisplayString(day),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 日期网格 "),
            vue.createElementVNode("view", { class: "days-grid" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.calendarDays, (day, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["day-cell", {
                      "other-month": !day.isCurrentMonth,
                      "today": day.isToday,
                      "has-event": day.hasEvent,
                      "selected": day.date === $data.selectedDate
                    }]),
                    key: index,
                    onClick: ($event) => $options.selectDate(day.date)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "day-number" },
                      vue.toDisplayString(day.day),
                      1
                      /* TEXT */
                    ),
                    day.hasEvent ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "event-indicator"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 当日日程列表 "),
          vue.createElementVNode("view", { class: "events-container" }, [
            vue.createElementVNode("view", { class: "events-header" }, [
              vue.createElementVNode(
                "text",
                { class: "events-title" },
                vue.toDisplayString($options.formatSelectedDate) + " 日程",
                1
                /* TEXT */
              ),
              vue.createElementVNode("button", {
                class: "add-event-btn",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToCreateMeeting && $options.navigateToCreateMeeting(...args))
              }, "添加会议")
            ]),
            $options.eventsOnSelectedDate.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "events-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.eventsOnSelectedDate, (event, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["event-card", $options.getStatusClass(event.status)]),
                    key: index,
                    onClick: ($event) => $options.viewEvent(event)
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "event-time" },
                      vue.toDisplayString(event.startTime) + " - " + vue.toDisplayString(event.endTime),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "event-title" },
                      vue.toDisplayString(event.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "event-location" },
                      vue.toDisplayString(event.location),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "event-status" },
                      vue.toDisplayString(event.statusText),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "empty-state"
            }, [
              vue.createElementVNode("image", {
                class: "empty-icon",
                src: _imports_0$1,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "empty-text" }, "当天暂无日程安排"),
              vue.createElementVNode("text", { class: "empty-hint" }, '点击"添加会议"按钮预约会议')
            ]))
          ])
        ]),
        vue.createCommentVNode(" 添加自定义底部导航 "),
        vue.createVNode(_component_custom_tab_bar)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserSchedule = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/schedule.vue"]]);
  const _imports_0 = "/static/icons/empty-notification.png";
  const _sfc_main$o = {
    components: {
      CustomTabBar
    },
    data() {
      return {
        notifications: [],
        isLoading: false,
        isRefreshing: false,
        page: 1,
        pageSize: 10,
        hasMore: false
      };
    },
    onLoad() {
      this.fetchNotifications();
    },
    methods: {
      fetchNotifications(isRefresh = false) {
        if (isRefresh) {
          this.page = 1;
        }
        this.isLoading = true;
        api.notification.getList().then((res) => {
          if (res.code === 200 && res.data) {
            const notificationData = Array.isArray(res.data) ? res.data : res.data.list ? res.data.list : [];
            formatAppLog("log", "at pages/user/notification.vue:100", "API返回的通知数据:", res.data);
            formatAppLog("log", "at pages/user/notification.vue:101", "处理后的通知数据:", notificationData);
            const processedData = notificationData.map((notification) => {
              if (!notification.id && notification.notifyId) {
                notification.id = notification.notifyId;
              } else if (!notification.id) {
                notification.id = notification.title ? notification.title.trim() : Date.now().toString();
              }
              return notification;
            });
            if (isRefresh) {
              this.notifications = processedData;
            } else {
              this.notifications = [...this.notifications, ...processedData];
            }
            this.hasMore = notificationData.length >= this.pageSize;
          } else {
            uni.showToast({
              title: res.message || "获取通知失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/notification.vue:130", "获取通知失败:", err);
          uni.showToast({
            title: "获取通知失败",
            icon: "none"
          });
        }).finally(() => {
          this.isLoading = false;
          if (isRefresh) {
            this.isRefreshing = false;
          }
        });
      },
      formatTime(dateTime) {
        if (!dateTime)
          return "";
        const now = /* @__PURE__ */ new Date();
        const diff = Math.floor((now - dateTime) / 1e3);
        if (diff < 60) {
          return "刚刚";
        } else if (diff < 3600) {
          return Math.floor(diff / 60) + "分钟前";
        } else if (diff < 86400) {
          return Math.floor(diff / 3600) + "小时前";
        } else if (diff < 604800) {
          return Math.floor(diff / 86400) + "天前";
        } else {
          const year = dateTime.getFullYear();
          const month = dateTime.getMonth() + 1;
          const day = dateTime.getDate();
          return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        }
      },
      getIconClass(type) {
        switch (type) {
          case "approve":
            return "icon-approve";
          case "reject":
            return "icon-reject";
          case "reminder":
            return "icon-reminder";
          case "cancel":
            return "icon-cancel";
          case "system":
            return "icon-system";
          default:
            return "icon-default";
        }
      },
      handleNotificationClick(notification) {
        formatAppLog("log", "at pages/user/notification.vue:182", "点击了通知:", notification);
        formatAppLog("log", "at pages/user/notification.vue:183", "通知ID:", notification.id);
        if (!notification.id) {
          formatAppLog("error", "at pages/user/notification.vue:186", "通知没有ID，无法跳转");
          uni.showToast({
            title: "无法查看通知详情",
            icon: "none"
          });
          return;
        }
        try {
          uni.navigateTo({
            url: `/pages/user/notification/detail?id=${notification.id}`,
            fail: (err) => {
              formatAppLog("error", "at pages/user/notification.vue:199", "导航到通知详情页失败:", err);
              uni.showToast({
                title: "打开详情页失败",
                icon: "none"
              });
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/user/notification.vue:207", "导航异常:", error);
          uni.showToast({
            title: "系统错误",
            icon: "none"
          });
        }
      },
      deleteNotification(id) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条通知吗？",
          success: (res) => {
            if (res.confirm) {
              const index = this.notifications.findIndex((item) => item.id === id);
              if (index !== -1) {
                this.notifications.splice(index, 1);
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            }
          }
        });
      },
      clearAll() {
        if (this.notifications.length === 0) {
          uni.showToast({
            title: "没有可清空的消息",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "确认操作",
          content: "确定要清空所有消息吗？",
          success: (res) => {
            if (res.confirm) {
              this.notifications = [];
              uni.showToast({
                title: "清空成功",
                icon: "success"
              });
            }
          }
        });
      },
      loadMore() {
        if (!this.hasMore || this.isLoading)
          return;
        this.page++;
        this.fetchNotifications();
      },
      onRefresh() {
        this.isRefreshing = true;
        this.fetchNotifications(true);
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_tab_bar = resolveEasycom(vue.resolveDynamicComponent("custom-tab-bar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "notification-container" }, [
      vue.createElementVNode("view", { class: "notification-header" }, [
        vue.createElementVNode("text", { class: "title" }, "通知消息"),
        vue.createElementVNode("view", { class: "actions" }, [
          vue.createElementVNode("text", {
            class: "action-btn clear-all",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.clearAll && $options.clearAll(...args))
          }, "清空")
        ])
      ]),
      vue.createElementVNode("view", { class: "tab-wrapper" }, [
        vue.createElementVNode("view", { class: "tab-content" }, [
          vue.createElementVNode("scroll-view", {
            "scroll-y": "",
            class: "notification-list",
            onScrolltolower: _cache[2] || (_cache[2] = (...args) => $options.loadMore && $options.loadMore(...args)),
            "refresher-enabled": "",
            "refresher-triggered": $data.isRefreshing,
            onRefresherrefresh: _cache[3] || (_cache[3] = (...args) => $options.onRefresh && $options.onRefresh(...args))
          }, [
            $data.notifications.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.notifications, (notification, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "notification-item",
                    key: index,
                    onClick: ($event) => $options.handleNotificationClick(notification)
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["notification-type-indicator", $options.getIconClass(notification.type)])
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode("view", { class: "notification-content" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "notification-title" },
                        vue.toDisplayString(notification.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "notification-body" },
                        vue.toDisplayString(notification.content),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "notification-meta" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "notification-time" },
                          vue.toDisplayString($options.formatTime(notification.createdAt)),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", {
                          class: "notification-delete",
                          onClick: vue.withModifiers(($event) => $options.deleteNotification(notification.id), ["stop"])
                        }, " 删除 ", 8, ["onClick"])
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "load-more"
              }, [
                $data.isLoading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "加载中...")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.loadMore && $options.loadMore(...args))
                }, "加载更多"))
              ])) : vue.createCommentVNode("v-if", true)
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "empty-view"
            }, [
              vue.createElementVNode("image", {
                class: "empty-icon",
                src: _imports_0,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "empty-text" }, "暂无通知消息")
            ]))
          ], 40, ["refresher-triggered"])
        ])
      ]),
      vue.createCommentVNode(" 添加自定义底部导航 "),
      vue.createVNode(_component_custom_tab_bar)
    ]);
  }
  const PagesUserNotification = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/notification.vue"]]);
  const _sfc_main$n = {
    data() {
      return {
        id: null,
        notificationDetail: null,
        isLoading: true,
        errorMessage: "",
        // 添加本地模拟数据
        mockData: {
          5: {
            id: 5,
            notifyType: 4,
            title: "[会前提醒]测试",
            content: "您的会议即将在15分钟后开始，请做好准备。",
            sender: "系统",
            createTime: (/* @__PURE__ */ new Date()).toISOString()
          },
          6: {
            id: 6,
            notifyType: 4,
            title: "[会前提醒]测试",
            content: "您的会议即将在15分钟后开始，请做好准备。",
            sender: "系统",
            createTime: (/* @__PURE__ */ new Date()).toISOString()
          }
        }
      };
    },
    onLoad(options) {
      formatAppLog("log", "at pages/user/notification/detail.vue:90", "通知详情页接收到的参数:", options);
      if (options.id) {
        this.id = options.id;
        formatAppLog("log", "at pages/user/notification/detail.vue:94", "将要获取的通知ID:", this.id);
        this.fetchNotificationDetail();
      } else {
        this.isLoading = false;
        this.errorMessage = "参数错误，未指定通知ID";
      }
    },
    methods: {
      fetchNotificationDetail() {
        this.isLoading = true;
        formatAppLog("log", "at pages/user/notification/detail.vue:105", "开始调用通知详情API, ID:", this.id);
        if (!this.id) {
          this.isLoading = false;
          this.errorMessage = "无效的通知ID";
          formatAppLog("error", "at pages/user/notification/detail.vue:110", "通知ID无效:", this.id);
          return;
        }
        api.notification.getById(this.id).then((res) => {
          formatAppLog("log", "at pages/user/notification/detail.vue:117", "通知详情API返回:", res);
          if (res.code === 200 && res.data) {
            const notificationData = res.data;
            this.notificationDetail = __spreadValues({
              title: notificationData.title || "未命名通知",
              content: notificationData.content || "无内容",
              sender: notificationData.sender || "系统",
              createTime: notificationData.createTime || (/* @__PURE__ */ new Date()).toISOString(),
              notifyType: notificationData.notifyType || 0,
              relatedId: notificationData.relatedId || null
            }, notificationData);
            formatAppLog("log", "at pages/user/notification/detail.vue:134", "设置通知详情数据:", this.notificationDetail);
          } else {
            if (this.mockData[this.id]) {
              formatAppLog("log", "at pages/user/notification/detail.vue:138", "使用本地模拟数据:", this.mockData[this.id]);
              this.notificationDetail = this.mockData[this.id];
              uni.showToast({
                title: "使用本地缓存数据",
                icon: "none",
                duration: 2e3
              });
            } else {
              this.errorMessage = res.message || "获取通知详情失败";
              formatAppLog("error", "at pages/user/notification/detail.vue:149", "获取通知详情失败:", res.message);
            }
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/notification/detail.vue:154", "获取通知详情失败:", err);
          if (this.mockData[this.id]) {
            formatAppLog("log", "at pages/user/notification/detail.vue:158", "使用本地模拟数据:", this.mockData[this.id]);
            this.notificationDetail = this.mockData[this.id];
            uni.showToast({
              title: "使用本地缓存数据",
              icon: "none",
              duration: 2e3
            });
          } else {
            this.errorMessage = "获取通知详情失败";
          }
        }).finally(() => {
          this.isLoading = false;
        });
      },
      formatTime(timestamp) {
        if (!timestamp)
          return "";
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      getNotifyTypeText(type) {
        const typeMap = {
          0: "系统通知",
          1: "会议通知",
          2: "审批通知",
          3: "提醒",
          4: "取消通知"
        };
        return typeMap[type] || "其他通知";
      },
      navigateToRelated() {
        if (!this.notificationDetail.relatedId)
          return;
        switch (this.notificationDetail.notifyType) {
          case 1:
            uni.navigateTo({
              url: `/pages/user/meeting/detail?id=${this.notificationDetail.relatedId}`
            });
            break;
          case 2:
            uni.navigateTo({
              url: `/pages/user/approval/detail?id=${this.notificationDetail.relatedId}`
            });
            break;
          default:
            uni.showToast({
              title: "无法跳转相关内容",
              icon: "none"
            });
        }
      },
      goBack() {
        uni.navigateBack();
      },
      navigateToNotification() {
        uni.navigateBack({
          delta: 1
        });
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "notification-detail-container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: "back-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("text", { class: "iconfont icon-back" }, "")
        ]),
        vue.createElementVNode("view", { class: "title" }, "通知详情"),
        vue.createElementVNode("view", { class: "right-placeholder" })
      ]),
      vue.createElementVNode("view", { class: "breadcrumb" }, [
        vue.createElementVNode("text", {
          class: "breadcrumb-item",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToNotification && $options.navigateToNotification(...args))
        }, [
          vue.createElementVNode("text", { class: "iconfont icon-notification" }, ""),
          vue.createTextVNode(" 通知消息 ")
        ]),
        vue.createElementVNode("text", { class: "breadcrumb-separator" }, "/"),
        vue.createElementVNode("text", { class: "breadcrumb-item active" }, "通知详情")
      ]),
      $data.notificationDetail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "content-wrapper"
      }, [
        vue.createElementVNode("view", { class: "notification-header" }, [
          vue.createElementVNode(
            "text",
            { class: "notification-title" },
            vue.toDisplayString($data.notificationDetail.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "notification-time" },
            vue.toDisplayString($options.formatTime($data.notificationDetail.createTime)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "notification-meta" }, [
          vue.createElementVNode("view", { class: "meta-item" }, [
            vue.createElementVNode("text", { class: "meta-label" }, "发送者："),
            vue.createElementVNode(
              "text",
              { class: "meta-value" },
              vue.toDisplayString($data.notificationDetail.sender || "系统"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "meta-item" }, [
            vue.createElementVNode("text", { class: "meta-label" }, "类型："),
            vue.createElementVNode(
              "text",
              { class: "meta-value" },
              vue.toDisplayString($options.getNotifyTypeText($data.notificationDetail.notifyType)),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "divider" }),
        vue.createElementVNode("view", { class: "notification-content" }, [
          vue.createElementVNode(
            "text",
            { class: "content-text" },
            vue.toDisplayString($data.notificationDetail.content),
            1
            /* TEXT */
          )
        ]),
        $data.notificationDetail.relatedId ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "actions"
        }, [
          vue.createElementVNode("button", {
            class: "action-button",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToRelated && $options.navigateToRelated(...args))
          }, "查看相关内容")
        ])) : vue.createCommentVNode("v-if", true)
      ])) : $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "loading"
      }, [
        vue.createElementVNode("text", null, "加载中...")
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "error-view"
      }, [
        vue.createElementVNode(
          "text",
          { class: "error-text" },
          vue.toDisplayString($data.errorMessage || "通知信息不存在"),
          1
          /* TEXT */
        ),
        vue.createElementVNode("button", {
          class: "action-button",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.goBack && $options.goBack(...args))
        }, "返回")
      ]))
    ]);
  }
  const PagesUserNotificationDetail = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/notification/detail.vue"]]);
  const _sfc_main$m = {
    components: {
      CustomTabBar
    },
    data() {
      return {
        userInfo: {
          id: "",
          name: "",
          username: "",
          phone: "",
          email: "",
          position: "",
          avatar: ""
        },
        loading: false,
        // 密码相关数据
        passwordForm: {
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        },
        showPasswordForm: false
      };
    },
    mounted() {
      this.fetchUserInfo();
    },
    methods: {
      fetchUserInfo() {
        var _a2, _b2, _c2, _d2, _e2, _f2;
        uni.showLoading({
          title: "加载中..."
        });
        this.loading = true;
        try {
          const userInfoStr = uni.getStorageSync("userInfo");
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            formatAppLog("log", "at pages/user/profile.vue:147", "本地存储的用户信息:", userInfo);
            this.userInfo = {
              id: userInfo.id || ((_a2 = userInfo.user) == null ? void 0 : _a2.id) || "",
              name: userInfo.username || ((_b2 = userInfo.user) == null ? void 0 : _b2.username) || "",
              username: userInfo.username || ((_c2 = userInfo.user) == null ? void 0 : _c2.username) || "",
              avatar: ((_d2 = userInfo.user) == null ? void 0 : _d2.avatarUrl) || "",
              // 保留其他字段为空，因为API响应中没有这些数据
              phone: "",
              email: "",
              position: ((_f2 = (_e2 = userInfo.roles) == null ? void 0 : _e2[0]) == null ? void 0 : _f2.name) || ""
            };
            formatAppLog("log", "at pages/user/profile.vue:160", "解析后的用户信息:", this.userInfo);
          }
        } catch (e) {
          formatAppLog("error", "at pages/user/profile.vue:163", "从本地存储获取用户信息失败:", e);
        }
        api.user.getInfo().then((res) => {
          var _a3, _b3, _c3, _d3, _e3, _f3;
          if (res.code === 200 && res.data) {
            formatAppLog("log", "at pages/user/profile.vue:170", "API返回的用户信息:", res.data);
            const apiData = res.data;
            this.userInfo = {
              id: apiData.id || ((_a3 = apiData.user) == null ? void 0 : _a3.id) || "",
              name: apiData.username || ((_b3 = apiData.user) == null ? void 0 : _b3.username) || "",
              username: apiData.username || ((_c3 = apiData.user) == null ? void 0 : _c3.username) || "",
              avatar: ((_d3 = apiData.user) == null ? void 0 : _d3.avatarUrl) || apiData.avatarUrl || "",
              phone: apiData.phone || "",
              email: apiData.email || "",
              position: ((_f3 = (_e3 = apiData.roles) == null ? void 0 : _e3[0]) == null ? void 0 : _f3.name) || ""
            };
            formatAppLog("log", "at pages/user/profile.vue:184", "解析后的用户信息:", this.userInfo);
          } else {
            uni.showToast({
              title: res.message || "获取用户信息失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/profile.vue:193", "获取用户信息失败:", err);
          uni.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
          this.loading = false;
        });
      },
      chooseAvatar() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            this.userInfo.avatar = tempFilePath;
          }
        });
      },
      showChangePassword() {
        this.passwordForm = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        };
        this.$refs.passwordPopup.open();
      },
      hideChangePassword() {
        this.$refs.passwordPopup.close();
      },
      validatePasswordForm() {
        if (!this.passwordForm.oldPassword) {
          uni.showToast({
            title: "请输入原密码",
            icon: "none"
          });
          return false;
        }
        if (!this.passwordForm.newPassword) {
          uni.showToast({
            title: "请输入新密码",
            icon: "none"
          });
          return false;
        }
        if (this.passwordForm.newPassword.length < 6) {
          uni.showToast({
            title: "新密码长度至少6位",
            icon: "none"
          });
          return false;
        }
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      submitChangePassword() {
        if (!this.validatePasswordForm()) {
          return;
        }
        uni.showLoading({
          title: "提交中..."
        });
        const passwordData = {
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
          confirmPassword: this.passwordForm.confirmPassword
        };
        api.user.updatePassword(passwordData).then((res) => {
          if (res.code === 200) {
            uni.showToast({
              title: "密码修改成功",
              icon: "success"
            });
            this.hideChangePassword();
          } else {
            uni.showToast({
              title: res.msg || "密码修改失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/profile.vue:324", "修改密码失败:", err);
          uni.showToast({
            title: "密码修改失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
        });
      },
      validateForm() {
        if (!this.userInfo.name) {
          uni.showToast({
            title: "请输入姓名",
            icon: "none"
          });
          return false;
        }
        if (!this.userInfo.phone) {
          uni.showToast({
            title: "请输入手机号",
            icon: "none"
          });
          return false;
        }
        if (!/^1\d{10}$/.test(this.userInfo.phone)) {
          uni.showToast({
            title: "手机号格式不正确",
            icon: "none"
          });
          return false;
        }
        if (!this.userInfo.email) {
          uni.showToast({
            title: "请输入邮箱",
            icon: "none"
          });
          return false;
        }
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.userInfo.email)) {
          uni.showToast({
            title: "邮箱格式不正确",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      saveProfile() {
        if (!this.validateForm()) {
          return;
        }
        uni.showLoading({
          title: "保存中..."
        });
        api.user.updateInfo(this.userInfo).then((res) => {
          if (res.code === 200) {
            uni.showToast({
              title: "保存成功",
              icon: "success"
            });
          } else {
            uni.showToast({
              title: res.message || "保存失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/profile.vue:404", "更新用户信息失败:", err);
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
        });
      },
      handleLogout() {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("token");
              uni.removeStorageSync("userInfo");
              uni.reLaunch({
                url: "/pages/user/login"
              });
            }
          }
        });
      },
      navigateToUserInfo() {
        uni.navigateTo({
          url: "/pages/user/userInfo"
        });
      },
      navigateToSettings() {
        uni.showToast({
          title: "系统设置功能开发中",
          icon: "none"
        });
      },
      navigateToHelp() {
        uni.showToast({
          title: "帮助中心功能开发中",
          icon: "none"
        });
      },
      navigateToAbout() {
        uni.showToast({
          title: "关于我们功能开发中",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup = vue.resolveComponent("uni-popup");
    const _component_custom_tab_bar = resolveEasycom(vue.resolveDynamicComponent("custom-tab-bar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "profile-container" }, [
      vue.createCommentVNode(" 个人信息卡片 "),
      vue.createElementVNode("view", { class: "profile-header" }, [
        vue.createElementVNode("view", { class: "avatar-section" }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $data.userInfo.avatar || "/static/logo.png",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.chooseAvatar && $options.chooseAvatar(...args))
          }, null, 8, ["src"]),
          vue.createElementVNode(
            "text",
            { class: "user-name" },
            vue.toDisplayString($data.userInfo.name || "用户名"),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 用户信息项 "),
      vue.createElementVNode("view", { class: "menu-section" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToUserInfo && $options.navigateToUserInfo(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-left" }, [
            vue.createElementVNode("text", { class: "menu-label" }, "个人资料")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.showChangePassword && $options.showChangePassword(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-left" }, [
            vue.createElementVNode("text", { class: "menu-label" }, "修改密码")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToSettings && $options.navigateToSettings(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-left" }, [
            vue.createElementVNode("text", { class: "menu-label" }, "系统设置")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.navigateToHelp && $options.navigateToHelp(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-left" }, [
            vue.createElementVNode("text", { class: "menu-label" }, "帮助中心")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, ">")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.navigateToAbout && $options.navigateToAbout(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-left" }, [
            vue.createElementVNode("text", { class: "menu-label" }, "关于我们")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, ">")
        ])
      ]),
      vue.createCommentVNode(" 密码修改弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "passwordPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "password-form" }, [
              vue.createElementVNode("view", { class: "password-form-title" }, "修改密码"),
              vue.createElementVNode("view", { class: "password-form-item" }, [
                vue.createElementVNode("text", { class: "password-label" }, "原密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "password-input",
                    type: "password",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.passwordForm.oldPassword = $event),
                    placeholder: "请输入原密码"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.passwordForm.oldPassword]
                ])
              ]),
              vue.createElementVNode("view", { class: "password-form-item" }, [
                vue.createElementVNode("text", { class: "password-label" }, "新密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "password-input",
                    type: "password",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.passwordForm.newPassword = $event),
                    placeholder: "请输入新密码"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.passwordForm.newPassword]
                ])
              ]),
              vue.createElementVNode("view", { class: "password-form-item" }, [
                vue.createElementVNode("text", { class: "password-label" }, "确认密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "password-input",
                    type: "password",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.passwordForm.confirmPassword = $event),
                    placeholder: "请再次输入新密码"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.passwordForm.confirmPassword]
                ])
              ]),
              vue.createElementVNode("view", { class: "password-form-actions" }, [
                vue.createElementVNode("button", {
                  class: "cancel-btn",
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.hideChangePassword && $options.hideChangePassword(...args))
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "confirm-btn",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.submitChangePassword && $options.submitChangePassword(...args))
                }, "确认")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 底部按钮 "),
      vue.createElementVNode("view", { class: "button-group" }, [
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[11] || (_cache[11] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, "退出登录")
      ]),
      vue.createCommentVNode(" 底部导航栏 "),
      vue.createVNode(_component_custom_tab_bar)
    ]);
  }
  const PagesUserProfile = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/profile.vue"]]);
  const _sfc_main$l = {
    data() {
      return {
        userInfo: {
          id: "",
          name: "",
          username: "",
          phone: "",
          email: "",
          position: "",
          avatarUrl: "",
          isActive: 0
        },
        loading: false
      };
    },
    mounted() {
      this.fetchUserInfo();
    },
    methods: {
      fetchUserInfo() {
        uni.showLoading({
          title: "加载中..."
        });
        this.loading = true;
        api.user.getInfo().then((res) => {
          if (res.code === 200 && res.data) {
            formatAppLog("log", "at pages/user/userInfo.vue:97", "API返回的用户信息:", res.data);
            const apiData = res.data;
            this.userInfo = {
              id: apiData.id || 0,
              name: apiData.username || "",
              username: apiData.username || "",
              avatarUrl: apiData.avatarUrl || "",
              phone: apiData.phone || "",
              email: apiData.email || "",
              position: apiData.roles && apiData.roles.length > 0 ? apiData.roles[0].name : "",
              isActive: apiData.isActive || 0
            };
            formatAppLog("log", "at pages/user/userInfo.vue:112", "解析后的用户信息:", this.userInfo);
          } else {
            uni.showToast({
              title: res.message || "获取用户信息失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/userInfo.vue:121", "获取用户信息失败:", err);
          uni.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
          this.loading = false;
        });
      },
      navigateBack() {
        uni.navigateBack();
      },
      showUnavailableMessage() {
        uni.showToast({
          title: "功能暂未开发，敬请期待",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "user-info-container" }, [
      vue.createCommentVNode(" 面包屑导航 "),
      vue.createElementVNode("view", { class: "breadcrumb" }, [
        vue.createElementVNode("text", {
          class: "breadcrumb-item",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateBack && $options.navigateBack(...args))
        }, "我的"),
        vue.createElementVNode("text", { class: "breadcrumb-separator" }, "/"),
        vue.createElementVNode("text", { class: "breadcrumb-item current" }, "个人资料")
      ]),
      vue.createCommentVNode(" 用户信息表单 "),
      vue.createElementVNode("view", { class: "form-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "基本信息"),
        vue.createElementVNode("view", { class: "feature-unavailable" }, [
          vue.createElementVNode("text", { class: "unavailable-text" }, "个人资料修改功能暂未开发，敬请期待")
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "头像"),
          vue.createElementVNode("view", { class: "avatar-wrapper" }, [
            vue.createElementVNode("image", {
              class: "avatar",
              src: $data.userInfo.avatarUrl || "/static/logo.png"
            }, null, 8, ["src"])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "姓名"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "form-input",
              type: "text",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.userInfo.name = $event),
              placeholder: "请输入姓名",
              disabled: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.name]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "用户名"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "form-input",
              type: "text",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.userInfo.username = $event),
              placeholder: "请输入用户名",
              disabled: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "手机号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "form-input",
              type: "number",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.userInfo.phone = $event),
              placeholder: "请输入手机号",
              disabled: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "邮箱"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "form-input",
              type: "text",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.userInfo.email = $event),
              placeholder: "请输入邮箱",
              disabled: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.email]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "职位"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "form-input",
              type: "text",
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.userInfo.position = $event),
              placeholder: "请输入职位",
              disabled: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.position]
          ])
        ])
      ]),
      vue.createCommentVNode(" 安全信息区域 "),
      vue.createElementVNode("view", { class: "form-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "安全设置"),
        vue.createCommentVNode(" 移除密码相关内容 ")
      ]),
      vue.createElementVNode("button", {
        class: "save-btn disabled",
        disabled: "",
        onClick: _cache[6] || (_cache[6] = (...args) => $options.showUnavailableMessage && $options.showUnavailableMessage(...args))
      }, "保存"),
      vue.createCommentVNode(" 移除修改密码弹窗 ")
    ]);
  }
  const PagesUserUserInfo = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/userInfo.vue"]]);
  const _sfc_main$k = {
    data() {
      return {
        searchText: "",
        contacts: [],
        selectedContacts: [],
        filteredContacts: [],
        isLoading: false,
        preSelectedIds: [],
        currentUserId: null
      };
    },
    onLoad(options) {
      try {
        formatAppLog("log", "at pages/user/contact-selector.vue:83", "联系人选择器页面加载");
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel) {
          eventChannel.on("initParams", (data) => {
            formatAppLog("log", "at pages/user/contact-selector.vue:89", "通过事件通道收到参数:", data);
            if (data) {
              if (data.preSelectedIds && Array.isArray(data.preSelectedIds)) {
                this.preSelectedIds = data.preSelectedIds.map((id) => parseInt(id));
                formatAppLog("log", "at pages/user/contact-selector.vue:95", "通过事件通道设置预选联系人:", this.preSelectedIds);
              }
              if (data.currentUserId) {
                this.currentUserId = parseInt(data.currentUserId);
                formatAppLog("log", "at pages/user/contact-selector.vue:101", "通过事件通道设置当前用户:", this.currentUserId);
              }
            }
            this.loadContacts();
          });
          formatAppLog("log", "at pages/user/contact-selector.vue:109", "已注册事件监听器");
        } else {
          formatAppLog("warn", "at pages/user/contact-selector.vue:111", "无法获取事件通道，尝试从URL参数获取");
          this.processUrlParams(options);
        }
        setTimeout(() => {
          if (!this.processedParams) {
            formatAppLog("log", "at pages/user/contact-selector.vue:118", "未通过事件通道收到参数，从URL或当前状态加载");
            this.processUrlParams(options);
            this.loadContacts();
          }
        }, 500);
      } catch (error) {
        formatAppLog("error", "at pages/user/contact-selector.vue:124", "联系人选择器初始化失败:", error);
        this.loadContacts();
      }
    },
    methods: {
      // 加载联系人数据
      loadContacts() {
        this.isLoading = true;
        uni.showLoading({ title: "加载联系人..." });
        this.contacts = [];
        this.selectedContacts = [];
        this.filteredContacts = [];
        api.user.getUserList({
          pageNo: 1,
          pageSize: 100,
          // 获取较大的数量以确保获取所有用户
          isAsc: true,
          sortBy: "id"
        }).then((res) => {
          if (res.code === 200 && res.data && res.data.list) {
            this.contacts = res.data.list.map((user2) => ({
              id: parseInt(user2.id),
              name: user2.name || user2.username,
              avatar: user2.avatar || user2.avatarUrl || "/static/default-avatar.png"
            }));
            formatAppLog("log", "at pages/user/contact-selector.vue:156", "获取到的所有联系人:", this.contacts.length);
            this.filterContacts();
            this.initPreSelectedContacts();
          } else {
            uni.showToast({
              title: res.message || "获取联系人失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/contact-selector.vue:171", "获取联系人失败:", err);
          uni.showToast({
            title: "获取联系人失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
          this.isLoading = false;
        });
      },
      // 初始化预选联系人
      initPreSelectedContacts() {
        formatAppLog("log", "at pages/user/contact-selector.vue:185", "初始化预选联系人...");
        formatAppLog("log", "at pages/user/contact-selector.vue:186", "预选ID列表:", this.preSelectedIds);
        formatAppLog("log", "at pages/user/contact-selector.vue:187", "当前用户ID:", this.currentUserId);
        if (this.contacts.length === 0) {
          formatAppLog("warn", "at pages/user/contact-selector.vue:190", "联系人列表为空，无法初始化预选联系人");
          return;
        }
        this.selectedContacts = [];
        if (this.currentUserId) {
          const currentUser = this.contacts.find(
            (contact) => parseInt(contact.id) === parseInt(this.currentUserId)
          );
          if (currentUser) {
            this.selectedContacts.push(currentUser);
            formatAppLog("log", "at pages/user/contact-selector.vue:205", "已添加当前用户到选中列表:", currentUser);
          } else {
            formatAppLog("warn", "at pages/user/contact-selector.vue:207", "在联系人列表中未找到当前用户:", this.currentUserId);
          }
        }
        if (this.preSelectedIds && this.preSelectedIds.length > 0) {
          const preselected = this.contacts.filter((contact) => {
            const contactId = parseInt(contact.id);
            const isPreselected = this.preSelectedIds.includes(contactId);
            const isCurrentUser = this.currentUserId && contactId === parseInt(this.currentUserId);
            return isPreselected && !isCurrentUser;
          });
          if (preselected.length > 0) {
            preselected.forEach((contact) => {
              if (!this.isSelected(contact.id)) {
                this.selectedContacts.push(contact);
              }
            });
            formatAppLog("log", "at pages/user/contact-selector.vue:231", "预选联系人完成, 总选中数量:", this.selectedContacts.length);
          }
        }
        this.filterContacts();
      },
      // 过滤联系人
      filterContacts() {
        if (!this.searchText) {
          this.filteredContacts = [...this.contacts];
          return;
        }
        const searchText = this.searchText.toLowerCase();
        this.filteredContacts = this.contacts.filter(
          (contact) => contact.name.toLowerCase().includes(searchText)
        );
      },
      // 处理搜索
      handleSearch() {
        this.filterContacts();
      },
      // 处理选择变更
      handleGroupChange(e) {
        const selectedIds = e.detail.value.map((id) => parseInt(id));
        this.contacts.forEach((contact) => {
          const contactId = parseInt(contact.id);
          const isInSelection = selectedIds.includes(contactId);
          const isAlreadySelected = this.isSelected(contactId);
          if (isInSelection && !isAlreadySelected) {
            this.selectedContacts.push(contact);
          } else if (!isInSelection && isAlreadySelected) {
            if (contactId !== this.currentUserId) {
              this.removeContact(contactId);
            } else {
              formatAppLog("log", "at pages/user/contact-selector.vue:275", "尝试取消选择当前用户，将阻止此操作");
            }
          }
        });
      },
      // 检查联系人是否已经被选择
      isSelected(contactId) {
        return this.selectedContacts.some((contact) => contact.id === contactId);
      },
      // 移除联系人
      removeContact(contactId) {
        if (parseInt(contactId) === this.currentUserId) {
          uni.showToast({
            title: "无法取消选择自己",
            icon: "none"
          });
          return;
        }
        const index = this.selectedContacts.findIndex((contact) => contact.id === contactId);
        if (index !== -1) {
          this.selectedContacts.splice(index, 1);
        }
      },
      // 处理取消按钮
      handleCancel() {
        uni.navigateBack();
      },
      // 处理确认按钮
      handleConfirm() {
        formatAppLog("log", "at pages/user/contact-selector.vue:312", "确认选择，当前选中联系人数:", this.selectedContacts.length);
        const selectedContactIds = this.selectedContacts.map((contact) => parseInt(contact.id));
        formatAppLog("log", "at pages/user/contact-selector.vue:316", "返回的选中联系人ID列表:", selectedContactIds);
        if (this.currentUserId && !selectedContactIds.includes(parseInt(this.currentUserId))) {
          formatAppLog("warn", "at pages/user/contact-selector.vue:320", "当前用户未在选择列表中，尝试添加");
          const currentUser = this.contacts.find(
            (contact) => parseInt(contact.id) === parseInt(this.currentUserId)
          );
          if (currentUser) {
            this.selectedContacts.push(currentUser);
            selectedContactIds.push(parseInt(this.currentUserId));
            formatAppLog("log", "at pages/user/contact-selector.vue:329", "已确保当前用户在返回列表中:", this.currentUserId);
          }
        }
        try {
          uni.navigateBack({
            delta: 1,
            success: () => {
              const eventChannel = this.getOpenerEventChannel();
              if (eventChannel) {
                formatAppLog("log", "at pages/user/contact-selector.vue:341", "传递选中联系人到前一页:", this.selectedContacts);
                eventChannel.emit("updateSelectedAttendees", {
                  selectedIds: selectedContactIds,
                  selectedContacts: this.selectedContacts
                });
              } else {
                formatAppLog("error", "at pages/user/contact-selector.vue:349", "无法获取事件通道");
              }
            },
            fail: (err) => {
              formatAppLog("error", "at pages/user/contact-selector.vue:353", "返回上一页失败:", err);
              uni.showToast({
                title: "返回失败",
                icon: "none"
              });
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/user/contact-selector.vue:361", "确认选择时出错:", error);
          uni.showToast({
            title: "操作失败",
            icon: "none"
          });
        }
      },
      // 处理URL参数
      processUrlParams(options) {
        formatAppLog("log", "at pages/user/contact-selector.vue:370", "处理URL参数:", options);
        this.processedParams = true;
        try {
          if (options.selected) {
            try {
              const selected = JSON.parse(decodeURIComponent(options.selected));
              if (Array.isArray(selected)) {
                this.preSelectedIds = selected.map((id) => parseInt(id));
                formatAppLog("log", "at pages/user/contact-selector.vue:380", "从URL参数设置预选联系人:", this.preSelectedIds);
              }
            } catch (e) {
              formatAppLog("error", "at pages/user/contact-selector.vue:383", "解析预选联系人参数失败:", e);
            }
          }
          if (options.currentUserId) {
            this.currentUserId = parseInt(options.currentUserId);
            formatAppLog("log", "at pages/user/contact-selector.vue:390", "从URL参数设置当前用户ID:", this.currentUserId);
          }
          if (!this.currentUserId) {
            const userInfo = uni.getStorageSync("userInfo");
            if (userInfo && userInfo.id) {
              this.currentUserId = parseInt(userInfo.id);
              formatAppLog("log", "at pages/user/contact-selector.vue:398", "从存储设置当前用户ID:", this.currentUserId);
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/contact-selector.vue:402", "处理URL参数失败:", error);
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contact-selector-container" }, [
      vue.createElementVNode("view", { class: "search-bar" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "search-input",
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchText = $event),
            placeholder: "搜索联系人...",
            onInput: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vue.vModelText, $data.searchText]
        ]),
        vue.createElementVNode("view", { class: "search-icon" }, [
          vue.createElementVNode("text", { class: "iconfont icon-search" })
        ])
      ]),
      vue.createElementVNode("view", { class: "contact-list" }, [
        vue.createElementVNode(
          "checkbox-group",
          {
            onChange: _cache[2] || (_cache[2] = (...args) => $options.handleGroupChange && $options.handleGroupChange(...args))
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.filteredContacts, (contact) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "contact-item",
                  key: contact.id
                }, [
                  vue.createElementVNode("view", { class: "contact-info" }, [
                    vue.createElementVNode("view", { class: "contact-avatar" }, [
                      vue.createElementVNode("image", {
                        src: contact.avatar || "/static/default-avatar.png",
                        mode: "aspectFill"
                      }, null, 8, ["src"])
                    ]),
                    vue.createElementVNode("view", { class: "contact-details" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "contact-name" },
                        vue.toDisplayString(contact.name),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("checkbox", {
                    value: contact.id,
                    checked: $options.isSelected(contact.id)
                  }, null, 8, ["value", "checked"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          32
          /* NEED_HYDRATION */
        ),
        $data.filteredContacts.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-notice"
        }, [
          vue.createElementVNode("text", null, "没有找到匹配的联系人")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      $data.selectedContacts.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "selected-bar"
      }, [
        vue.createElementVNode(
          "view",
          { class: "selected-count" },
          "已选择 " + vue.toDisplayString($data.selectedContacts.length) + " 人",
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "selected-contacts-scroll" }, [
          vue.createElementVNode("scroll-view", { "scroll-x": "" }, [
            vue.createElementVNode("view", { class: "selected-contacts" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.selectedContacts, (contact) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "selected-contact",
                    key: contact.id
                  }, [
                    vue.createElementVNode("image", {
                      src: contact.avatar || "/static/default-avatar.png",
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "view",
                      { class: "contact-name" },
                      vue.toDisplayString(contact.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", {
                      class: "remove-btn",
                      onClick: ($event) => $options.removeContact(contact.id)
                    }, "×", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "action-bar" }, [
        vue.createElementVNode("button", {
          class: "cancel-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleCancel && $options.handleCancel(...args))
        }, "取消"),
        vue.createElementVNode("button", {
          class: "confirm-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleConfirm && $options.handleConfirm(...args))
        }, "确定")
      ])
    ]);
  }
  const PagesUserContactSelector = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/contact-selector.vue"]]);
  const _sfc_main$j = {
    components: {
      CustomTabBar
    },
    data() {
      return {
        activeTab: "initiated",
        meetings: [],
        loading: false,
        currentPage: 1,
        pageSize: 10,
        hasMore: true,
        total: 0,
        filterOptions: {
          status: "",
          date: "",
          time: ""
        },
        userId: null,
        // 当前用户ID
        statusOptions: ["全部状态", "待审批", "已通过", "进行中", "已完成", "已拒绝", "已取消"],
        statusIndex: 0,
        startDate: "",
        endDate: "",
        roomOptions: [],
        // 改为空数组，将从后端获取
        roomIndex: 0,
        showFilter: false,
        // 控制筛选弹窗显示
        // 会议列表数据
        initiatedMeetings: [],
        participatedMeetings: [],
        // 筛选后的临时变量
        tempStartDate: "",
        tempEndDate: "",
        tempRoomIndex: 0
      };
    },
    created() {
      try {
        const userInfoStr = uni.getStorageSync("userInfo");
        const userInfo = typeof userInfoStr === "string" ? JSON.parse(userInfoStr) : userInfoStr;
        if (userInfo && userInfo.id) {
          this.userId = userInfo.id.toString();
          formatAppLog("log", "at pages/user/meeting/list.vue:192", "会议列表页获取到用户ID:", this.userId);
          this.fetchMeetingList();
        } else {
          formatAppLog("warn", "at pages/user/meeting/list.vue:196", "未能从存储获取用户信息");
          api.user.getUserInfo().then((res) => {
            if (res.code === 200 && res.data) {
              const newUserInfo = res.data;
              uni.setStorageSync("userInfo", JSON.stringify(newUserInfo));
              if (newUserInfo.id) {
                this.userId = newUserInfo.id.toString();
                formatAppLog("log", "at pages/user/meeting/list.vue:206", "重新获取用户ID成功:", this.userId);
                this.fetchMeetingList();
              }
            }
          }).catch((err) => {
            formatAppLog("error", "at pages/user/meeting/list.vue:213", "获取用户信息失败:", err);
          });
        }
      } catch (err) {
        formatAppLog("error", "at pages/user/meeting/list.vue:217", "处理用户信息时出错:", err);
      }
    },
    onLoad() {
      return __async(this, null, function* () {
        yield this.fetchMeetingList();
      });
    },
    computed: {
      // 根据当前选项卡和筛选条件获取会议列表
      filteredMeetings() {
        const meetings = this.activeTab === "initiated" ? this.initiatedMeetings : this.participatedMeetings;
        return meetings.filter((meeting2) => {
          if (this.statusIndex !== 0) {
            const normalizedStatus = this.normalizeStatus(meeting2.status);
            const statusMap = {
              1: "pending",
              2: "approved",
              3: "in-progress",
              4: "completed",
              5: "rejected",
              6: ["canceled", "cancelled"]
            };
            if (this.statusIndex === 6) {
              if (normalizedStatus !== "canceled" && normalizedStatus !== "cancelled") {
                return false;
              }
            } else if (normalizedStatus !== statusMap[this.statusIndex]) {
              return false;
            }
          }
          if (this.startDate || this.endDate) {
            const meetingDate = new Date(meeting2.date);
            meetingDate.setHours(0, 0, 0, 0);
            if (this.startDate) {
              const startDate = new Date(this.startDate);
              startDate.setHours(0, 0, 0, 0);
              if (meetingDate < startDate) {
                return false;
              }
            }
            if (this.endDate) {
              const endDate = new Date(this.endDate);
              endDate.setHours(23, 59, 59, 999);
              if (meetingDate > endDate) {
                return false;
              }
            }
          }
          if (this.roomIndex !== 0) {
            const selectedRoom = this.roomOptions[this.roomIndex];
            if (meeting2.room !== selectedRoom) {
              return false;
            }
          }
          return true;
        });
      }
    },
    watch: {
      activeTab: {
        handler(newVal) {
          formatAppLog("log", "at pages/user/meeting/list.vue:287", "activeTab changed to:", newVal);
          this.fetchMeetingList();
        },
        immediate: false
      }
    },
    methods: {
      // 获取会议列表数据
      fetchMeetingList() {
        return __async(this, null, function* () {
          this.loading = true;
          try {
            const res = yield api.meeting.getMeetingList({
              pageNo: 1,
              pageSize: 1e3
            });
            if (res.code === 200 && res.data) {
              let meetingList = res.data.list || [];
              formatAppLog("log", "at pages/user/meeting/list.vue:307", "获取到的会议列表:", meetingList);
              const formattedMeetings = yield Promise.all(
                meetingList.map((meeting2) => this.formatMeeting(meeting2))
              );
              const userInfoStr = uni.getStorageSync("userInfo");
              const userInfo = typeof userInfoStr === "string" ? JSON.parse(userInfoStr) : userInfoStr;
              const currentUsername = userInfo == null ? void 0 : userInfo.username;
              formatAppLog("log", "at pages/user/meeting/list.vue:318", "当前用户名:", currentUsername);
              if (this.activeTab === "initiated") {
                this.initiatedMeetings = formattedMeetings.filter((meeting2) => {
                  const isCreator = meeting2.booker === currentUsername;
                  formatAppLog("log", "at pages/user/meeting/list.vue:325", "会议:", meeting2.id, "状态:", meeting2.status, "创建者:", meeting2.booker, "当前用户:", currentUsername, "是否创建者:", isCreator);
                  return isCreator;
                });
                formatAppLog("log", "at pages/user/meeting/list.vue:328", "我发起的会议:", this.initiatedMeetings);
              } else {
                this.participatedMeetings = formattedMeetings.filter((meeting2) => {
                  const isParticipant = meeting2.booker !== currentUsername && meeting2.participants.some((p) => p.username === currentUsername);
                  formatAppLog("log", "at pages/user/meeting/list.vue:334", "会议:", meeting2.id, "状态:", meeting2.status, "是否参与者:", isParticipant);
                  return isParticipant;
                });
                formatAppLog("log", "at pages/user/meeting/list.vue:337", "我参与的会议:", this.participatedMeetings);
              }
            } else {
              uni.showToast({
                title: res.message || "获取会议列表失败",
                icon: "none"
              });
            }
          } catch (err) {
            formatAppLog("error", "at pages/user/meeting/list.vue:346", "获取会议列表失败:", err);
            uni.showToast({
              title: "获取会议列表失败，请稍后重试",
              icon: "none"
            });
          } finally {
            this.loading = false;
            uni.stopPullDownRefresh();
          }
        });
      },
      // 查看会议详情
      viewMeetingDetail(meeting2) {
        if (!meeting2 || !meeting2.id) {
          uni.showToast({
            title: "无效的会议记录",
            icon: "none"
          });
          return;
        }
        formatAppLog("log", "at pages/user/meeting/list.vue:367", "查看会议详情:", JSON.stringify(meeting2));
        const meetingData = {
          id: meeting2.id,
          topic: meeting2.topic || meeting2.title || "未命名会议",
          description: meeting2.description || "",
          booker: meeting2.booker,
          // 直接使用原始booker，不做处理
          room: meeting2.room || "",
          startTime: meeting2.startTime || "",
          endTime: meeting2.endTime || "",
          status: meeting2.status || "pending",
          reserveDate: meeting2.reserveDate || meeting2.date || "",
          // 额外提供字段用于前端组件使用
          roomName: typeof meeting2.room === "object" ? meeting2.room.name : meeting2.roomName || meeting2.room || "",
          roomId: meeting2.roomId || (typeof meeting2.room === "object" ? meeting2.room.id : null) || 0,
          participants: meeting2.participants || [],
          location: typeof meeting2.room === "object" ? meeting2.room.name : meeting2.roomName || meeting2.room || ""
        };
        const meetingInfo = encodeURIComponent(JSON.stringify(meetingData));
        const url = `/pages/user/meeting/detail?id=${meeting2.id}&meetingInfo=${meetingInfo}`;
        formatAppLog("log", "at pages/user/meeting/list.vue:394", "导航到会议详情页:", url);
        uni.navigateTo({
          url,
          fail: (err) => {
            formatAppLog("error", "at pages/user/meeting/list.vue:399", "导航到会议详情页失败:", err);
            uni.showToast({
              title: "打开详情失败",
              icon: "none"
            });
          }
        });
      },
      // 取消会议
      cancelMeeting(meeting2) {
        uni.showModal({
          title: "取消会议",
          content: "确定要取消该会议吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ title: "处理中..." });
              if (!meeting2 || !meeting2.id) {
                uni.hideLoading();
                uni.showToast({
                  title: "无效的会议记录",
                  icon: "none"
                });
                return;
              }
              formatAppLog("log", "at pages/user/meeting/list.vue:427", "正在取消会议:", meeting2.id);
              api.meeting.cancelMeeting(meeting2.id).then((res2) => {
                if (res2.code === 200) {
                  uni.showToast({
                    title: "会议已取消",
                    icon: "success"
                  });
                  const index = this.initiatedMeetings.findIndex((item) => item.id === meeting2.id);
                  if (index !== -1) {
                    this.initiatedMeetings[index].status = "canceled";
                  }
                } else {
                  uni.showToast({
                    title: res2.message || "取消会议失败",
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/user/meeting/list.vue:450", "取消会议失败:", err);
                uni.showToast({
                  title: "取消会议失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      // 标准化状态值
      normalizeStatus(status) {
        if (!status)
          return "pending";
        if (typeof status === "object" && status !== null) {
          status = status.status || "pending";
        }
        status = status.toLowerCase();
        const statusMap = {
          "pending": "pending",
          "approved": "approved",
          "in-progress": "in-progress",
          "completed": "completed",
          "rejected": "rejected",
          "canceled": "canceled",
          "cancelled": "canceled",
          "待审核": "pending",
          "已通过": "approved",
          "进行中": "in-progress",
          "已完成": "completed",
          "已拒绝": "rejected",
          "已取消": "canceled"
        };
        return statusMap[status] || "pending";
      },
      // 获取状态文本
      getStatusText(status) {
        if (typeof status === "object" && status !== null) {
          status = status.status || "pending";
        }
        const normalizedStatus = this.normalizeStatus(status);
        const statusMap = {
          "pending": "待审核",
          "approved": "已通过",
          "in-progress": "进行中",
          "completed": "已完成",
          "rejected": "已拒绝",
          "canceled": "已取消"
        };
        return statusMap[normalizedStatus] || "待审核";
      },
      // 获取状态样式类
      getStatusClass(status) {
        if (typeof status === "object" && status !== null) {
          status = status.status || "pending";
        }
        let normalizedStatus = this.normalizeStatus(status);
        const classMap = {
          "pending": "status-pending",
          "approved": "status-approved",
          "in-progress": "status-in-progress",
          "completed": "status-completed",
          "rejected": "status-rejected",
          "canceled": "status-canceled",
          "cancelled": "status-canceled"
        };
        return classMap[normalizedStatus] || "";
      },
      // 判断会议是否可以取消
      canCancel(meeting2) {
        return meeting2.status === "pending" || meeting2.status === "approved";
      },
      // 判断会议是否可以拒绝参与
      canReject(meeting2) {
        return meeting2.status === "pending" || meeting2.status === "approved";
      },
      // 处理状态筛选变更
      handleStatusChange(e) {
        this.statusIndex = e.detail.value;
      },
      // 显示筛选弹窗
      showFilterModal() {
        this.tempStartDate = this.startDate;
        this.tempEndDate = this.endDate;
        this.tempRoomIndex = this.roomIndex;
        this.showFilter = true;
      },
      // 关闭筛选弹窗
      closeFilterModal() {
        this.showFilter = false;
      },
      // 重置筛选条件
      resetFilters() {
        this.tempStartDate = "";
        this.tempEndDate = "";
        this.tempRoomIndex = 0;
      },
      // 应用筛选条件
      applyFilters() {
        formatAppLog("log", "at pages/user/meeting/list.vue:579", "应用筛选条件前:", {
          startDate: this.startDate,
          endDate: this.endDate,
          roomIndex: this.roomIndex
        });
        this.startDate = this.tempStartDate;
        this.endDate = this.tempEndDate;
        this.roomIndex = this.tempRoomIndex;
        formatAppLog("log", "at pages/user/meeting/list.vue:589", "应用筛选条件后:", {
          startDate: this.startDate,
          endDate: this.endDate,
          roomIndex: this.roomIndex
        });
        this.showFilter = false;
        this.fetchMeetingList();
      },
      // 处理开始日期变更
      onStartDateChange(e) {
        this.tempStartDate = e.detail.value;
        formatAppLog("log", "at pages/user/meeting/list.vue:605", "开始日期变更:", this.tempStartDate);
      },
      // 处理结束日期变更
      onEndDateChange(e) {
        this.tempEndDate = e.detail.value;
        formatAppLog("log", "at pages/user/meeting/list.vue:611", "结束日期变更:", this.tempEndDate);
      },
      // 处理会议室选择变更
      onRoomChange(e) {
        this.tempRoomIndex = e.detail.value;
      },
      // 返回会议时间
      getMeetingTime(meeting2) {
        if (meeting2.startTime && meeting2.endTime) {
          return `${meeting2.startTime} - ${meeting2.endTime}`;
        } else if (meeting2.startTime) {
          return meeting2.startTime;
        } else {
          return "未设置时间";
        }
      },
      // 处理日期筛选
      handleDateFilter(date, isStart = true) {
        if (!date) {
          if (isStart) {
            this.startDate = "";
          } else {
            this.endDate = "";
          }
          return;
        }
        const localDate = new Date(date);
        const formattedDate = localDate.toISOString().split("T")[0];
        if (isStart) {
          this.startDate = formattedDate;
        } else {
          this.endDate = formattedDate;
        }
      },
      // 格式化会议数据
      formatMeeting(meeting2) {
        return __async(this, null, function* () {
          if (!meeting2)
            return null;
          formatAppLog("log", "at pages/user/meeting/list.vue:656", "原始会议数据:", meeting2);
          const formattedMeeting = {
            id: meeting2.id || "",
            topic: meeting2.topic || meeting2.title || "未命名会议",
            description: meeting2.description || "",
            booker: meeting2.bookerName || meeting2.userName || meeting2.booker || meeting2.user || "",
            room: meeting2.room || "",
            startTime: meeting2.startTime || "",
            endTime: meeting2.endTime || "",
            status: this.normalizeStatus(meeting2.status),
            // 使用normalizeStatus方法标准化状态
            reserveDate: meeting2.reserveDate || meeting2.date || "",
            // 前端显示需要的额外字段
            title: meeting2.topic || meeting2.title || "未命名会议",
            date: meeting2.reserveDate || meeting2.date || "",
            roomName: typeof meeting2.room === "object" ? meeting2.room.name : meeting2.roomName || meeting2.room || "",
            user: meeting2.bookerName || meeting2.userName || meeting2.booker || meeting2.user || "",
            participants: []
          };
          formatAppLog("log", "at pages/user/meeting/list.vue:678", "格式化后的会议数据:", formattedMeeting);
          try {
            const res = yield api.participant.getParticipantList(meeting2.id);
            if (res.code === 200 && res.data) {
              const participants = Array.isArray(res.data) ? res.data : [];
              formattedMeeting.participants = participants.map((p) => ({
                id: p.id || p.userId || "",
                name: p.name || p.username || p.userName || "未知用户",
                username: p.username || p.userName || p.name || "",
                avatar: p.avatar || p.avatarUrl || "",
                status: p.status || "pending"
              }));
            }
          } catch (err) {
            formatAppLog("error", "at pages/user/meeting/list.vue:694", "获取参会人员失败:", err);
          }
          return formattedMeeting;
        });
      },
      // 进入会议聊天室
      enterMeetingRoom(meetingId) {
        formatAppLog("log", "at pages/user/meeting/list.vue:702", "进入会议:", meetingId);
        const currentMeetings = this.activeTab === "initiated" ? this.initiatedMeetings : this.participatedMeetings;
        formatAppLog("log", "at pages/user/meeting/list.vue:706", "当前会议列表数据源:", this.activeTab, "会议数量:", currentMeetings.length);
        const meeting2 = currentMeetings.find((m) => m.id === meetingId);
        if (meeting2) {
          formatAppLog("log", "at pages/user/meeting/list.vue:711", "找到完整会议信息:", meeting2);
          const meetingData = {
            id: meeting2.id,
            topic: meeting2.topic || meeting2.title || "未命名会议",
            description: meeting2.description || "",
            booker: meeting2.booker || "",
            room: meeting2.room || "",
            startTime: meeting2.startTime || "",
            endTime: meeting2.endTime || "",
            status: meeting2.status || "pending",
            reserveDate: meeting2.reserveDate || meeting2.date || "",
            // 额外提供字段用于前端组件使用
            roomName: typeof meeting2.room === "object" ? meeting2.room.name : meeting2.roomName || meeting2.room || "",
            roomId: meeting2.roomId || (typeof meeting2.room === "object" ? meeting2.room.id : null) || 0,
            participants: meeting2.participants || [],
            user: meeting2.user || meeting2.booker || "",
            // 确保有用户信息
            location: meeting2.roomName || (typeof meeting2.room === "object" ? meeting2.room.name : meeting2.room) || ""
          };
          try {
            const meetingJson = JSON.stringify(meetingData);
            formatAppLog("log", "at pages/user/meeting/list.vue:735", "会议信息JSON:", meetingJson);
            const meetingInfo = encodeURIComponent(meetingJson);
            formatAppLog("log", "at pages/user/meeting/list.vue:738", "编码后会议信息:", meetingInfo);
            const url = `/pages/user/meeting/room?id=${meetingId}&meetingInfo=${meetingInfo}`;
            formatAppLog("log", "at pages/user/meeting/list.vue:741", "导航URL:", url);
            uni.navigateTo({
              url,
              success: () => formatAppLog("log", "at pages/user/meeting/list.vue:745", "导航成功"),
              fail: (err) => {
                formatAppLog("error", "at pages/user/meeting/list.vue:747", "导航失败:", err);
                uni.showToast({
                  title: "进入会议室失败",
                  icon: "none"
                });
              }
            });
          } catch (err) {
            formatAppLog("error", "at pages/user/meeting/list.vue:755", "处理会议信息出错:", err);
            uni.showToast({
              title: "处理会议信息出错",
              icon: "none"
            });
          }
        } else {
          formatAppLog("warn", "at pages/user/meeting/list.vue:762", "未找到会议信息");
          uni.showToast({
            title: "未找到会议信息",
            icon: "none"
          });
        }
      },
      // 判断是否是会议创建者
      isCreator(meeting2) {
        const userInfo = uni.getStorageSync("userInfo");
        const user2 = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
        return meeting2.booker === user2.username;
      },
      // 处理会议列表项点击
      handleMeetingItemClick(meeting2, event) {
        if (event.target.className.includes("enter-btn") || event.target.className.includes("cancel-btn")) {
          return;
        }
        this.viewMeetingDetail(meeting2);
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_tab_bar = resolveEasycom(vue.resolveDynamicComponent("custom-tab-bar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "我的会议")
      ]),
      vue.createElementVNode("view", { class: "tabs" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab", { active: $data.activeTab === "initiated" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $data.activeTab = "initiated")
          },
          " 我发起的 ",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab", { active: $data.activeTab === "participated" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $data.activeTab = "participated")
          },
          " 我参与的 ",
          2
          /* CLASS */
        )
      ]),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("picker", {
          class: "filter-picker",
          value: $data.statusIndex,
          range: $data.statusOptions,
          onChange: _cache[2] || (_cache[2] = (...args) => $options.handleStatusChange && $options.handleStatusChange(...args))
        }, [
          vue.createElementVNode("view", { class: "filter-value" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.statusOptions[$data.statusIndex]),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "icon-down" })
          ])
        ], 40, ["value", "range"]),
        vue.createElementVNode("button", {
          class: "filter-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.showFilterModal && $options.showFilterModal(...args))
        }, [
          vue.createElementVNode("text", { class: "icon-filter" })
        ])
      ]),
      $options.filteredMeetings.length > 0 ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
        key: 0,
        "scroll-y": "",
        class: "meeting-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($options.filteredMeetings, (meeting2) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "meeting-item",
              key: meeting2.id,
              onClick: ($event) => $options.handleMeetingItemClick(meeting2, $event)
            }, [
              vue.createElementVNode("view", { class: "meeting-header" }, [
                vue.createElementVNode(
                  "view",
                  { class: "meeting-title" },
                  vue.toDisplayString(meeting2.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["meeting-status", $options.getStatusClass(meeting2.status)])
                  },
                  vue.toDisplayString($options.getStatusText(meeting2.status)),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "meeting-info" }, [
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "iconfont icon-time" }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(meeting2.date) + " " + vue.toDisplayString(meeting2.startTime) + " - " + vue.toDisplayString(meeting2.endTime),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "iconfont icon-location" }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(meeting2.roomName || meeting2.room || "未指定"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "iconfont icon-user" }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(meeting2.user || meeting2.booker || "未知用户"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "meeting-footer" }, [
                vue.createElementVNode(
                  "view",
                  { class: "attendee-count" },
                  vue.toDisplayString(meeting2.participants && meeting2.participants.length ? meeting2.participants.length : meeting2.attendees && meeting2.attendees.length ? meeting2.attendees.length : 0) + "人参会 ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "meeting-actions" }, [
                  meeting2.status === "approved" ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 0,
                    onClick: vue.withModifiers(($event) => $options.enterMeetingRoom(meeting2.id), ["stop"]),
                    class: "enter-btn"
                  }, "进入会议", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("button", {
                    onClick: vue.withModifiers(($event) => $options.viewMeetingDetail(meeting2), ["stop"]),
                    class: "detail-btn"
                  }, "查看详情", 8, ["onClick"]),
                  meeting2.status === "pending" && $options.isCreator(meeting2) ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 1,
                    onClick: vue.withModifiers(($event) => $options.cancelMeeting(meeting2), ["stop"]),
                    class: "cancel-btn"
                  }, "取消", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ])
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("image", {
          class: "empty-image",
          src: _imports_0$2
        }),
        vue.createElementVNode("text", { class: "empty-text" }, "暂无会议")
      ])),
      vue.createCommentVNode(" 筛选弹窗 "),
      $data.showFilter ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "filter-modal"
      }, [
        vue.createElementVNode("view", {
          class: "filter-overlay",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.closeFilterModal && $options.closeFilterModal(...args))
        }),
        vue.createElementVNode("view", { class: "filter-popup" }, [
          vue.createElementVNode("view", { class: "filter-header" }, [
            vue.createElementVNode("text", { class: "filter-title" }, "筛选条件"),
            vue.createElementVNode("text", {
              class: "filter-close",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.closeFilterModal && $options.closeFilterModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "filter-body" }, [
            vue.createElementVNode("view", { class: "filter-item" }, [
              vue.createElementVNode("text", { class: "filter-label" }, "日期范围"),
              vue.createElementVNode("view", { class: "date-range" }, [
                vue.createElementVNode("picker", {
                  mode: "date",
                  value: $data.tempStartDate,
                  onChange: _cache[6] || (_cache[6] = (...args) => $options.onStartDateChange && $options.onStartDateChange(...args))
                }, [
                  vue.createElementVNode("view", { class: "date-picker" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.tempStartDate || "开始日期"),
                      1
                      /* TEXT */
                    )
                  ])
                ], 40, ["value"]),
                vue.createElementVNode("text", { class: "date-separator" }, "至"),
                vue.createElementVNode("picker", {
                  mode: "date",
                  value: $data.tempEndDate,
                  onChange: _cache[7] || (_cache[7] = (...args) => $options.onEndDateChange && $options.onEndDateChange(...args))
                }, [
                  vue.createElementVNode("view", { class: "date-picker" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.tempEndDate || "结束日期"),
                      1
                      /* TEXT */
                    )
                  ])
                ], 40, ["value"])
              ])
            ]),
            vue.createElementVNode("view", { class: "filter-item" }, [
              vue.createElementVNode("text", { class: "filter-label" }, "会议室"),
              vue.createElementVNode("picker", {
                range: $data.roomOptions,
                value: $data.tempRoomIndex,
                onChange: _cache[8] || (_cache[8] = (...args) => $options.onRoomChange && $options.onRoomChange(...args))
              }, [
                vue.createElementVNode("view", { class: "room-picker" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.roomOptions[$data.tempRoomIndex]),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "icon-down" })
                ])
              ], 40, ["range", "value"])
            ])
          ]),
          vue.createElementVNode("view", { class: "filter-footer" }, [
            vue.createElementVNode("button", {
              class: "filter-reset",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.resetFilters && $options.resetFilters(...args))
            }, "重置"),
            vue.createElementVNode("button", {
              class: "filter-apply",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.applyFilters && $options.applyFilters(...args))
            }, "应用")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 添加自定义底部导航 "),
      vue.createVNode(_component_custom_tab_bar)
    ]);
  }
  const PagesUserMeetingList = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/meeting/list.vue"]]);
  const _sfc_main$i = {
    data() {
      return {
        isEdit: false,
        meetingId: null,
        meetingTypes: ["普通会议", "项目评审", "团队周会", "培训会议", "客户会议"],
        typeIndex: 0,
        priorityOptions: ["普通", "重要", "紧急"],
        priorityIndex: 0,
        repeatOptions: ["不重复", "每天", "每周", "每两周", "每月"],
        repeatIndex: 0,
        equipmentOptions: ["投影仪", "白板", "视频会议设备", "话筒", "电视"],
        availableRooms: [],
        isLoading: false,
        isSubmitting: false,
        form: {
          title: "",
          type: "普通会议",
          priority: "普通",
          // 会议优先级
          date: "",
          startTime: "",
          endTime: "",
          repeat: "不重复",
          roomId: "",
          attendees: [],
          equipment: [],
          description: "",
          attachments: [],
          agenda: [
            {
              time: "",
              content: "",
              speaker: "",
              files: []
            }
          ]
        }
      };
    },
    onLoad(options) {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      this.form.date = `${year}-${month}-${day}`;
      const hour = (today.getHours() + 1).toString().padStart(2, "0");
      this.form.startTime = `${hour}:00`;
      this.form.endTime = `${(today.getHours() + 2).toString().padStart(2, "0")}:00`;
      if (options.date) {
        this.form.date = options.date;
      }
      this.form.attendees = [];
      try {
        const app = getApp();
        let userInfo = null;
        if (app && app.globalData && app.globalData.userInfo) {
          userInfo = app.globalData.userInfo;
          formatAppLog("log", "at pages/user/meeting/create.vue:356", "从全局状态获取到用户信息:", userInfo);
        } else {
          userInfo = uni.getStorageSync("userInfo");
          formatAppLog("log", "at pages/user/meeting/create.vue:360", "从本地存储获取到用户信息:", userInfo);
        }
        if (userInfo && userInfo.id) {
          const userId = parseInt(userInfo.id);
          const userName = userInfo.username || userInfo.name || "我";
          if (!isNaN(userId) && userId > 0) {
            this.form.attendees.push({
              id: userId,
              name: userName,
              avatar: userInfo.avatarUrl || ""
            });
            formatAppLog("log", "at pages/user/meeting/create.vue:377", "初始化参会人员列表:", JSON.stringify(this.form.attendees));
          } else {
            formatAppLog("error", "at pages/user/meeting/create.vue:379", "获取到的用户ID无效:", userInfo.id);
          }
        } else {
          formatAppLog("warn", "at pages/user/meeting/create.vue:383", "本地未找到用户信息，尝试通过API获取");
          api.user.getUserInfo().then((res) => {
            if (res.code === 200 && res.data) {
              const apiUserInfo = res.data;
              const userId = parseInt(apiUserInfo.id);
              if (!isNaN(userId) && userId > 0) {
                this.form.attendees.push({
                  id: userId,
                  name: apiUserInfo.username || apiUserInfo.name || "我",
                  avatar: apiUserInfo.avatarUrl || ""
                });
                formatAppLog("log", "at pages/user/meeting/create.vue:396", "从API获取并添加用户到参会列表:", this.form.attendees);
              }
            } else {
              formatAppLog("error", "at pages/user/meeting/create.vue:399", "API获取用户信息失败:", res);
            }
          }).catch((err) => {
            formatAppLog("error", "at pages/user/meeting/create.vue:403", "获取用户信息API异常:", err);
          });
        }
      } catch (error) {
        formatAppLog("error", "at pages/user/meeting/create.vue:407", "处理用户信息时出错:", error);
      }
      if (options.id) {
        this.isEdit = true;
        this.meetingId = options.id;
        this.loadMeetingDetail();
      } else {
        this.loadAvailableRooms();
      }
    },
    onReady() {
      uni.$on("updateSelectedAttendees", (selectedContacts) => {
        formatAppLog("log", "at pages/user/meeting/create.vue:422", "接收到联系人选择器返回的参会人员:", selectedContacts);
        if (selectedContacts && Array.isArray(selectedContacts)) {
          this.handleSelectedAttendees(selectedContacts);
        }
      });
    },
    onUnload() {
      uni.$off("updateSelectedAttendees");
    },
    methods: {
      navigateToList() {
        uni.navigateTo({
          url: "/pages/user/meeting/list",
          fail: () => {
            uni.showToast({
              title: "导航失败",
              icon: "none"
            });
          }
        });
      },
      // 加载会议详情
      loadMeetingDetail() {
        uni.showLoading({ title: "加载中..." });
        api.meeting.getDetail(this.meetingId).then((res) => {
          if (res.code === 200 && res.data) {
            const meeting2 = res.data;
            this.form.title = meeting2.title;
            this.form.date = meeting2.date;
            if (meeting2.time) {
              const timeParts = meeting2.time.split(" - ");
              this.form.startTime = timeParts[0];
              this.form.endTime = timeParts[1];
            }
            const typeIndex = this.meetingTypes.findIndex((type) => type === meeting2.type);
            this.typeIndex = typeIndex !== -1 ? typeIndex : 0;
            this.form.type = this.meetingTypes[this.typeIndex];
            this.form.attendees = meeting2.participants || [];
            this.form.equipment = meeting2.equipment || [];
            this.form.description = meeting2.description || "";
            this.form.agenda = meeting2.agenda || [];
            if (!this.form.agenda.length && meeting2.description) {
              this.tryExtractAgendaFromDescription(meeting2.description);
            }
            this.form.attachments = meeting2.attachments || [];
          } else {
            uni.showToast({
              title: res.message || "获取会议详情失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/create.vue:495", "获取会议详情失败:", err);
          uni.showToast({
            title: "获取会议详情失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
        });
      },
      // 加载可用会议室
      loadAvailableRooms() {
        if (!this.form.date || !this.form.startTime || !this.form.endTime) {
          formatAppLog("log", "at pages/user/meeting/create.vue:509", "缺少必要的参数:", {
            date: this.form.date,
            startTime: this.form.startTime,
            endTime: this.form.endTime
          });
          return;
        }
        this.isLoading = true;
        uni.showLoading({ title: "加载会议室..." });
        const formatTimeWithSeconds = (time) => {
          if (!time)
            return "";
          if (time.split(":").length === 3)
            return time;
          return `${time}:00`;
        };
        const params = {
          pageNo: 1,
          pageSize: 100,
          isAsc: true,
          sortBy: "id"
        };
        params.date = this.form.date;
        params.startTime = formatTimeWithSeconds(this.form.startTime);
        params.endTime = formatTimeWithSeconds(this.form.endTime);
        formatAppLog("log", "at pages/user/meeting/create.vue:542", "请求会议室参数:", params);
        api.room.getRooms(params).then((res) => {
          if (res.code === 200 && res.data) {
            let roomList = [];
            if (Array.isArray(res.data)) {
              roomList = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              roomList = res.data.list;
            } else if (res.data.records && Array.isArray(res.data.records)) {
              roomList = res.data.records;
            }
            this.availableRooms = roomList.map((room) => ({
              id: room.id,
              name: room.name || "未命名会议室",
              capacity: room.capacity || 0,
              equipment: room.equipment || [],
              location: room.location || "未知位置",
              available: room.status !== "unavailable"
              // 根据状态判断可用性
            }));
            formatAppLog("log", "at pages/user/meeting/create.vue:570", "可用会议室:", this.availableRooms);
            if (this.form.roomId) {
              const isCurrentRoomAvailable = this.availableRooms.some((room) => room.id.toString() === this.form.roomId.toString());
              if (!isCurrentRoomAvailable) {
                this.form.roomId = "";
                uni.showToast({
                  title: "之前选择的会议室已不可用，请重新选择",
                  icon: "none"
                });
              }
            }
            if (this.availableRooms.length === 0) {
              uni.showToast({
                title: "当前时间段没有可用会议室",
                icon: "none"
              });
            }
          } else {
            formatAppLog("error", "at pages/user/meeting/create.vue:592", "获取会议室失败:", res);
            uni.showToast({
              title: res.message || "获取会议室失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/create.vue:600", "获取会议室失败:", err);
          uni.showToast({
            title: "获取会议室失败",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
          this.isLoading = false;
        });
      },
      // 处理会议类型变更
      handleTypeChange(e) {
        this.typeIndex = e.detail.value;
        this.form.type = this.meetingTypes[this.typeIndex];
      },
      // 获取状态对应的CSS类名
      getStatusClass(status) {
        const statusClasses = {
          0: "status-pending",
          1: "status-approved",
          2: "status-rejected",
          3: "status-cancelled"
        };
        return statusClasses[status] || "status-unknown";
      },
      // 处理日期变更
      handleDateChange(e) {
        this.form.date = e.detail.value;
        if (this.form.startTime && this.form.endTime) {
          this.loadAvailableRooms();
        }
      },
      // 处理开始时间变更
      handleStartTimeChange(e) {
        const newStartTime = e.detail.value;
        this.form.startTime = newStartTime;
        if (this.form.endTime && this.form.endTime <= newStartTime) {
          const [hours, minutes] = newStartTime.split(":").map(Number);
          const newHour = (hours + 1) % 24;
          this.form.endTime = `${newHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
          uni.showToast({
            title: "结束时间已自动调整",
            icon: "none"
          });
        }
        if (this.form.date && this.form.endTime) {
          this.loadAvailableRooms();
        }
      },
      // 处理结束时间变更
      handleEndTimeChange(e) {
        const newEndTime = e.detail.value;
        if (this.form.startTime && newEndTime <= this.form.startTime) {
          uni.showToast({
            title: "结束时间必须晚于开始时间",
            icon: "none"
          });
          return;
        }
        this.form.endTime = newEndTime;
        if (this.form.date && this.form.startTime) {
          this.loadAvailableRooms();
        }
      },
      // 处理重复选项变更
      handleRepeatChange(e) {
        this.repeatIndex = e.detail.value;
        this.form.repeat = this.repeatOptions[this.repeatIndex];
      },
      // 处理会议室选择变更
      handleRoomChange(e) {
        this.form.roomId = e.detail.value;
      },
      // 显示参会人员选择器
      showAttendeeSelector() {
        try {
          const selectedAttendeeIds = Array.isArray(this.form.attendees) ? this.form.attendees.map((a) => parseInt(a.id)).filter((id) => !isNaN(id)) : [];
          const currentUserId = this.getCurrentUserId();
          formatAppLog("log", "at pages/user/meeting/create.vue:698", "当前选中参会人:", selectedAttendeeIds);
          formatAppLog("log", "at pages/user/meeting/create.vue:699", "当前用户ID:", currentUserId);
          uni.navigateTo({
            url: "/pages/user/contact-selector",
            events: {
              // 定义事件，用于接收选择结果
              updateSelectedAttendees: (data) => {
                formatAppLog("log", "at pages/user/meeting/create.vue:707", "通过事件通道收到联系人选择结果:", data);
                this.handleSelectedAttendees(data);
              }
            },
            success: (res) => {
              res.eventChannel.emit("initParams", {
                preSelectedIds: selectedAttendeeIds,
                currentUserId
              });
              formatAppLog("log", "at pages/user/meeting/create.vue:717", "成功打开联系人选择器并传递参数");
            },
            fail: (err) => {
              formatAppLog("error", "at pages/user/meeting/create.vue:720", "打开联系人选择器失败:", err);
              uni.showToast({
                title: "打开联系人选择器失败",
                icon: "none"
              });
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/create.vue:728", "打开联系人选择器出错:", error);
          uni.showToast({
            title: "操作失败",
            icon: "none"
          });
        }
      },
      // 处理选中的联系人
      handleSelectedAttendees(selectedData) {
        try {
          formatAppLog("log", "at pages/user/meeting/create.vue:738", "收到选中的联系人数据:", selectedData);
          if (!selectedData) {
            formatAppLog("warn", "at pages/user/meeting/create.vue:742", "没有收到联系人数据");
            return;
          }
          let newAttendees = [];
          if (selectedData.selectedContacts && Array.isArray(selectedData.selectedContacts)) {
            formatAppLog("log", "at pages/user/meeting/create.vue:750", "使用通道传递的完整联系人数据");
            newAttendees = selectedData.selectedContacts.map((contact) => ({
              id: parseInt(contact.id),
              name: contact.name || "",
              avatar: contact.avatar || "/static/default-avatar.png"
            }));
          } else if (Array.isArray(selectedData)) {
            formatAppLog("log", "at pages/user/meeting/create.vue:759", "使用全局事件传递的联系人数据");
            newAttendees = selectedData.map((contact) => ({
              id: parseInt(contact.id),
              name: contact.name || "",
              avatar: contact.avatar || "/static/default-avatar.png"
            }));
          } else if (selectedData.selectedIds && Array.isArray(selectedData.selectedIds)) {
            formatAppLog("log", "at pages/user/meeting/create.vue:768", "只收到联系人ID列表，需要查找对应联系人信息");
            newAttendees = selectedData.selectedIds.map((id) => ({
              id: parseInt(id),
              name: "用户" + id,
              // 临时名称，实际应用中应该查询真实名称
              avatar: "/static/default-avatar.png"
            }));
          }
          if (newAttendees.length === 0) {
            formatAppLog("warn", "at pages/user/meeting/create.vue:780", "未能解析有效的联系人数据");
            return;
          }
          formatAppLog("log", "at pages/user/meeting/create.vue:784", "解析后的新联系人列表:", newAttendees);
          const currentUserId = this.getCurrentUserId();
          formatAppLog("log", "at pages/user/meeting/create.vue:788", "当前用户ID:", currentUserId);
          if (this.form.attendees && Array.isArray(this.form.attendees)) {
            const existingMap = /* @__PURE__ */ new Map();
            this.form.attendees.forEach((attendee) => {
              existingMap.set(parseInt(attendee.id), attendee);
            });
            newAttendees.forEach((attendee) => {
              existingMap.set(parseInt(attendee.id), attendee);
            });
            this.form.attendees = Array.from(existingMap.values());
            formatAppLog("log", "at pages/user/meeting/create.vue:807", "更新后的联系人列表:", this.form.attendees);
          } else {
            this.form.attendees = newAttendees;
            formatAppLog("log", "at pages/user/meeting/create.vue:811", "设置新的联系人列表:", this.form.attendees);
          }
          if (currentUserId) {
            const hasCurrentUser = this.form.attendees.some(
              (attendee) => parseInt(attendee.id) === parseInt(currentUserId)
            );
            if (!hasCurrentUser) {
              formatAppLog("log", "at pages/user/meeting/create.vue:821", "当前用户不在联系人列表中，尝试添加");
              const userInfo = this.getUserInfo();
              if (userInfo && userInfo.id) {
                this.form.attendees.push({
                  id: parseInt(userInfo.id),
                  name: userInfo.name || userInfo.username || "当前用户",
                  avatar: userInfo.avatar || userInfo.avatarUrl || "/static/default-avatar.png"
                });
                formatAppLog("log", "at pages/user/meeting/create.vue:831", "已添加当前用户到联系人列表");
              } else {
                formatAppLog("warn", "at pages/user/meeting/create.vue:833", "无法获取当前用户信息，无法添加到联系人列表");
              }
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/create.vue:838", "处理选中联系人时出错:", error);
          uni.showToast({
            title: "处理联系人数据失败",
            icon: "none"
          });
        }
      },
      // 移除参会人员
      removeAttendee(index) {
        try {
          const userInfo = uni.getStorageSync("userInfo");
          const currentUserId = userInfo && userInfo.id ? parseInt(userInfo.id) : 0;
          if (currentUserId > 0) {
            const attendeeToRemove = this.form.attendees[index];
            const attendeeId = typeof attendeeToRemove === "object" ? parseInt(attendeeToRemove.id) : parseInt(attendeeToRemove);
            if (!isNaN(attendeeId) && attendeeId === currentUserId) {
              uni.showToast({
                title: "无法移除自己",
                icon: "none"
              });
              return;
            }
          }
          this.form.attendees.splice(index, 1);
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/create.vue:872", "移除参会人员时出错:", error);
          if (index >= 0 && index < this.form.attendees.length) {
            this.form.attendees.splice(index, 1);
          }
        }
      },
      // 处理设备需求变更
      handleEquipmentChange(e) {
        this.form.equipment = e.detail.value;
      },
      // 选择文件作为附件
      chooseFile() {
        plus.nativeUI.actionSheet({
          title: "选择文件来源",
          cancel: "取消",
          buttons: [
            { title: "拍照" },
            { title: "从相册选择" },
            { title: "从文件选择" }
          ]
        }, (e) => {
          switch (e.index) {
            case 1:
              this.captureImage();
              break;
            case 2:
              this.chooseFromAlbum();
              break;
            case 3:
              this.chooseFromFiles();
              break;
          }
        });
      },
      // 拍照获取图片（APP环境）
      captureImage() {
        const camera = plus.camera.getCamera();
        camera.captureImage(
          (path) => {
            plus.io.resolveLocalFileSystemURL(path, (entry) => {
              entry.file((file) => {
                const fileName = path.substring(path.lastIndexOf("/") + 1);
                this.form.attachments.push({
                  name: fileName,
                  size: this.formatFileSize(file.size || 0),
                  type: "jpg",
                  path
                });
              });
            });
          },
          (error) => {
            formatAppLog("error", "at pages/user/meeting/create.vue:1011", "拍照失败: " + error.message);
          },
          { filename: "_doc/camera/" }
        );
      },
      // 从相册选择（APP环境）
      chooseFromAlbum() {
        plus.gallery.pick(
          (paths) => {
            const path = paths.files[0];
            plus.io.resolveLocalFileSystemURL(path, (entry) => {
              entry.file((file) => {
                const fileName = path.substring(path.lastIndexOf("/") + 1);
                let fileExtension = "jpg";
                if (fileName.includes(".")) {
                  fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                }
                this.form.attachments.push({
                  name: fileName,
                  size: this.formatFileSize(file.size || 0),
                  type: fileExtension,
                  path
                });
              });
            });
          },
          (error) => {
            formatAppLog("error", "at pages/user/meeting/create.vue:1041", "选择图片失败: " + error.message);
          },
          { filter: "image", maximum: 1, system: false, onmaxed: () => {
            uni.showToast({ title: "最多只能选择1个文件", icon: "none" });
          } }
        );
      },
      // 从文件选择（APP环境）
      chooseFromFiles() {
        if (plus.os.name.toLowerCase() === "android") {
          try {
            const Intent = plus.android.importClass("android.content.Intent");
            const intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            const main = plus.android.runtimeMainActivity();
            main.startActivityForResult(intent, 1);
            main.onActivityResult = (requestCode, resultCode, data) => {
              if (requestCode === 1) {
                const uri = data.getData();
                if (uri) {
                  const path = plus.android.invoke(uri, "getPath");
                  const fileName = path.substring(path.lastIndexOf("/") + 1);
                  const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                  const size = "未知大小";
                  this.form.attachments.push({
                    name: fileName,
                    size,
                    type: fileExtension,
                    path
                  });
                }
              }
            };
          } catch (e) {
            formatAppLog("error", "at pages/user/meeting/create.vue:1086", "文件选择错误:", e);
            uni.showToast({
              title: "暂不支持该操作，请选择其他方式",
              icon: "none"
            });
          }
        } else if (plus.os.name.toLowerCase() === "ios") {
          uni.showToast({
            title: "暂不支持iOS文件选择，请选择其他方式",
            icon: "none"
          });
        }
      },
      // 移除附件
      removeAttachment(index) {
        this.form.attachments.splice(index, 1);
      },
      // 获取文件图标CSS类
      getFileIconClass(type) {
        switch (type) {
          case "doc":
          case "docx":
            return "doc-icon";
          case "xls":
          case "xlsx":
            return "excel-icon";
          case "ppt":
          case "pptx":
            return "ppt-icon";
          case "pdf":
            return "pdf-icon";
          case "jpg":
          case "jpeg":
          case "png":
          case "gif":
            return "image-icon";
          default:
            return "file-icon";
        }
      },
      // 获取文件图标
      getFileIcon(type) {
        switch (type) {
          case "doc":
          case "docx":
            return "icon-doc";
          case "xls":
          case "xlsx":
            return "icon-excel";
          case "ppt":
          case "pptx":
            return "icon-ppt";
          case "pdf":
            return "icon-pdf";
          case "jpg":
          case "jpeg":
          case "png":
          case "gif":
            return "icon-image";
          default:
            return "icon-file";
        }
      },
      // 格式化文件大小
      formatFileSize(size) {
        if (size < 1024) {
          return size + "B";
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      },
      // 验证表单
      validateForm() {
        if (!this.form.title || this.form.title.trim() === "") {
          uni.showToast({
            title: "请输入会议主题",
            icon: "none"
          });
          return false;
        }
        if (this.form.title.length > 5) {
          uni.showToast({
            title: "会议主题不能超过5个字符",
            icon: "none"
          });
          return false;
        }
        if (!this.form.date) {
          uni.showToast({
            title: "请选择会议日期",
            icon: "none"
          });
          return false;
        }
        if (!this.form.startTime) {
          uni.showToast({
            title: "请选择开始时间",
            icon: "none"
          });
          return false;
        }
        if (!this.form.endTime) {
          uni.showToast({
            title: "请选择结束时间",
            icon: "none"
          });
          return false;
        }
        if (this.form.startTime >= this.form.endTime) {
          uni.showToast({
            title: "结束时间必须晚于开始时间",
            icon: "none"
          });
          return false;
        }
        if (!this.form.roomId) {
          uni.showToast({
            title: "请选择会议室",
            icon: "none"
          });
          return false;
        }
        if (this.form.attendees.length === 0) {
          uni.showToast({
            title: "请添加至少一位参会人员",
            icon: "none"
          });
          return false;
        }
        if (this.form.agenda.length > 0) {
          const hasInvalidAgenda = this.form.agenda.some((item) => !item.time || !item.content);
          if (hasInvalidAgenda) {
            uni.showToast({
              title: "请完善议程内容",
              icon: "none"
            });
            return false;
          }
        }
        return true;
      },
      // 处理表单提交
      handleSubmit() {
        formatAppLog("log", "at pages/user/meeting/create.vue:1244", "提交表单");
        if (!this.form.title) {
          uni.showToast({
            title: "请输入会议名称",
            icon: "none"
          });
          return;
        }
        if (!this.form.date) {
          uni.showToast({
            title: "请选择会议日期",
            icon: "none"
          });
          return;
        }
        if (!this.form.startTime) {
          uni.showToast({
            title: "请选择开始时间",
            icon: "none"
          });
          return;
        }
        if (!this.form.endTime) {
          uni.showToast({
            title: "请选择结束时间",
            icon: "none"
          });
          return;
        }
        if (!this.form.roomId) {
          uni.showToast({
            title: "请选择会议室",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "创建中...",
          mask: true
        });
        const meetingData = {
          title: this.form.title,
          room: this.form.roomId,
          description: this.form.description,
          date: this.form.date,
          startTime: this.form.startTime,
          endTime: this.form.endTime
        };
        if (this.form.attendees && this.form.attendees.length > 0) {
          meetingData.participants = this.form.attendees.map((p) => p.id);
        }
        formatAppLog("log", "at pages/user/meeting/create.vue:1307", "提交会议数据:", meetingData);
        try {
          api.bookReservation(meetingData).then((res) => __async(this, null, function* () {
            if (res.code === 200) {
              formatAppLog("log", "at pages/user/meeting/create.vue:1314", "会议创建成功:", res);
              const reservationId = res.data;
              yield this.processAgendaItems(reservationId);
              uni.hideLoading();
              uni.showToast({
                title: "会议创建成功",
                icon: "success",
                duration: 2e3
              });
              setTimeout(() => {
                uni.redirectTo({
                  url: `/pages/user/meeting/detail?id=${reservationId}&from=create`
                });
              }, 2e3);
            } else {
              formatAppLog("error", "at pages/user/meeting/create.vue:1334", "会议创建失败:", res);
              uni.hideLoading();
              uni.showToast({
                title: res.msg || "会议创建失败",
                icon: "none"
              });
            }
          })).catch((err) => {
            formatAppLog("error", "at pages/user/meeting/create.vue:1343", "会议创建请求失败:", err);
            uni.hideLoading();
            uni.showToast({
              title: "创建请求失败",
              icon: "none"
            });
          });
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/create.vue:1351", "会议创建异常:", error);
          uni.hideLoading();
          uni.showToast({
            title: "创建发生异常",
            icon: "none"
          });
        }
      },
      // 添加处理议程项目和文件上传的方法
      processAgendaItems(reservationId) {
        return __async(this, null, function* () {
          if (!this.form.agenda || this.form.agenda.length === 0) {
            return;
          }
          const subtopicPromises = [];
          for (const agendaItem of this.form.agenda) {
            if (!agendaItem.content || !agendaItem.content.trim()) {
              continue;
            }
            const subtopicData = {
              reservationId,
              subtopics: agendaItem.content,
              description: agendaItem.time ? `时间: ${agendaItem.time}` : ""
            };
            if (agendaItem.speaker) {
              subtopicData.description += subtopicData.description ? `, 负责人: ${agendaItem.speaker}` : `负责人: ${agendaItem.speaker}`;
            }
            const subtopicPromise = api.createSubtopic(subtopicData).then((response) => __async(this, null, function* () {
              if (response.code === 200) {
                formatAppLog("log", "at pages/user/meeting/create.vue:1392", "议程创建成功:", response);
                const subtopicId = response.data;
                if (agendaItem.files && agendaItem.files.length > 0) {
                  yield this.uploadAgendaFiles(subtopicId, agendaItem.files);
                }
                return response;
              } else {
                formatAppLog("error", "at pages/user/meeting/create.vue:1405", "议程创建失败:", response);
                throw new Error(response.msg || "议程创建失败");
              }
            }));
            subtopicPromises.push(subtopicPromise);
          }
          return Promise.all(subtopicPromises).catch((error) => {
            formatAppLog("error", "at pages/user/meeting/create.vue:1415", "处理议程时出错:", error);
          });
        });
      },
      // 添加处理议程文件上传的方法
      uploadAgendaFiles(subtopicId, files) {
        return __async(this, null, function* () {
          if (!files || files.length === 0)
            return;
          const fileUploadPromises = [];
          for (const file of files) {
            formatAppLog("log", "at pages/user/meeting/create.vue:1426", "准备上传文件:", file);
            const uploadPromise = new Promise((resolve, reject) => {
              const uploadFileToServer = (tempFilePath, fileName) => {
                uni.uploadFile({
                  url: "/file/upload",
                  // 根据实际接口调整
                  filePath: tempFilePath,
                  name: "file",
                  formData: {
                    "fileName": fileName
                  },
                  success: (uploadRes) => {
                    try {
                      const data = typeof uploadRes.data === "string" ? JSON.parse(uploadRes.data) : uploadRes.data;
                      if (data.code === 200 && data.data) {
                        const fileUrl = data.data;
                        api.uploadSubtopicFile(subtopicId, fileName, fileUrl).then((linkRes) => {
                          formatAppLog("log", "at pages/user/meeting/create.vue:1452", "议题文件关联成功:", linkRes);
                          resolve(linkRes);
                        }).catch((err) => {
                          formatAppLog("error", "at pages/user/meeting/create.vue:1456", "议题文件关联失败:", err);
                          reject(err);
                        });
                      } else {
                        formatAppLog("error", "at pages/user/meeting/create.vue:1460", "文件上传失败:", data);
                        reject(new Error(data.msg || "文件上传失败"));
                      }
                    } catch (e) {
                      formatAppLog("error", "at pages/user/meeting/create.vue:1464", "解析上传响应失败:", e, uploadRes);
                      reject(e);
                    }
                  },
                  fail: (err) => {
                    formatAppLog("error", "at pages/user/meeting/create.vue:1469", "上传文件请求失败:", err);
                    reject(err);
                  }
                });
                return;
              };
              if (file.path) {
                uploadFileToServer(file.path, file.name);
              } else if (file.file) {
                const formData = new FormData();
                formData.append("file", file.file);
                formData.append("fileName", file.name);
                uni.request({
                  url: "/file/upload",
                  method: "POST",
                  data: formData,
                  success: (res) => {
                    if (res.statusCode === 200 && res.data) {
                      const data = res.data;
                      if (data.code === 200 && data.data) {
                        const fileUrl = data.data;
                        api.uploadSubtopicFile(subtopicId, file.name, fileUrl).then((linkRes) => {
                          formatAppLog("log", "at pages/user/meeting/create.vue:1500", "议题文件关联成功:", linkRes);
                          resolve(linkRes);
                        }).catch((err) => {
                          formatAppLog("error", "at pages/user/meeting/create.vue:1504", "议题文件关联失败:", err);
                          reject(err);
                        });
                      } else {
                        formatAppLog("error", "at pages/user/meeting/create.vue:1508", "文件上传失败:", data);
                        reject(new Error(data.msg || "文件上传失败"));
                      }
                    } else {
                      reject(new Error("上传失败: " + res.statusCode));
                    }
                  },
                  fail: (err) => {
                    formatAppLog("error", "at pages/user/meeting/create.vue:1516", "请求失败:", err);
                    reject(err);
                  }
                });
              } else {
                formatAppLog("warn", "at pages/user/meeting/create.vue:1522", "没有有效的文件:", file);
                resolve({
                  code: 200,
                  msg: "无文件内容",
                  data: null
                });
              }
            });
            fileUploadPromises.push(uploadPromise);
          }
          return Promise.all(fileUploadPromises).catch((error) => {
            formatAppLog("error", "at pages/user/meeting/create.vue:1536", "上传议程文件时出错:", error);
            uni.showToast({
              title: "部分文件上传失败",
              icon: "none"
            });
          });
        });
      },
      // 添加议程项
      addAgendaItem() {
        this.form.agenda.push({
          time: "",
          content: "",
          speaker: "",
          files: []
        });
      },
      // 移除议程项
      removeAgendaItem(index) {
        this.form.agenda.splice(index, 1);
      },
      // 移动议程项
      moveAgendaItem(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.form.agenda.length)
          return;
        const item = this.form.agenda[index];
        this.form.agenda.splice(index, 1);
        this.form.agenda.splice(newIndex, 0, item);
      },
      // 尝试从描述中提取议程
      tryExtractAgendaFromDescription(description) {
        const lines = description.split("\n");
        const agendaItems = [];
        lines.forEach((line) => {
          const timeMatch = line.match(/^(\d{1,2}:\d{2}(?:-\d{1,2}:\d{2})?)[:：](.*)/);
          if (timeMatch) {
            agendaItems.push({
              time: timeMatch[1],
              content: timeMatch[2].trim(),
              speaker: ""
            });
          }
        });
        if (agendaItems.length > 0) {
          this.form.agenda = agendaItems;
        }
      },
      // 处理优先级变更
      handlePriorityChange(e) {
        this.priorityIndex = e.detail.value;
        this.form.priority = this.priorityOptions[this.priorityIndex];
      },
      // 获取优先级对应的CSS类名
      getPriorityClass(priority) {
        const priorityClasses = {
          0: "priority-normal",
          1: "priority-important",
          2: "priority-urgent"
        };
        return priorityClasses[priority] || "priority-normal";
      },
      // 添加缺失的checkTimeConflicts方法
      checkTimeConflicts() {
        if (!this.form.date || !this.form.startTime || !this.form.endTime) {
          return;
        }
        if (this.availableRooms && this.availableRooms.length === 0) {
          uni.showModal({
            title: "提示",
            content: "当前时间段可能已被预订，建议选择其他时间",
            showCancel: false
          });
        }
      },
      // 获取当前用户ID
      getCurrentUserId() {
        try {
          const app = getApp();
          if (app && app.globalData && app.globalData.userInfo) {
            const id = parseInt(app.globalData.userInfo.id);
            if (id > 0)
              return id;
          }
          const userInfo = uni.getStorageSync("userInfo");
          if (userInfo && userInfo.id) {
            const id = parseInt(userInfo.id);
            if (id > 0)
              return id;
          }
          if (this.currentUser && this.currentUser.id) {
            const id = parseInt(this.currentUser.id);
            if (id > 0)
              return id;
          }
          formatAppLog("warn", "at pages/user/meeting/create.vue:1646", "无法找到有效的当前用户ID");
          return 0;
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/create.vue:1649", "获取当前用户ID出错:", error);
          return 0;
        }
      },
      // 获取用户信息
      getUserInfo() {
        try {
          const app = getApp();
          if (app && app.globalData && app.globalData.userInfo) {
            return app.globalData.userInfo;
          }
          const userInfo = uni.getStorageSync("userInfo");
          if (userInfo) {
            return userInfo;
          }
          if (this.currentUser) {
            return this.currentUser;
          }
          formatAppLog("warn", "at pages/user/meeting/create.vue:1673", "无法找到有效的用户信息");
          return null;
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/create.vue:1676", "获取用户信息出错:", error);
          return null;
        }
      },
      // 添加新的方法: 选择议程文件
      selectAgendaFile(agendaIndex) {
        plus.nativeUI.actionSheet({
          title: "选择PDF文件",
          cancel: "取消",
          buttons: [
            { title: "文件管理器" }
          ]
        }, (e) => {
          if (e.index === 1) {
            plus.io.pickDocument({
              success: (uri) => {
                formatAppLog("log", "at pages/user/meeting/create.vue:1743", "文件选择成功:", uri);
                plus.io.resolveLocalFileSystemURL(uri, (entry) => {
                  entry.file((file) => {
                    let fileName = entry.name || "";
                    if (!fileName.toLowerCase().endsWith(".pdf")) {
                      uni.showToast({
                        title: "只支持PDF文件",
                        icon: "none"
                      });
                      return;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      uni.showToast({
                        title: "文件大小不能超过10MB",
                        icon: "none"
                      });
                      return;
                    }
                    if (!this.form.agenda[agendaIndex].files) {
                      this.form.agenda[agendaIndex].files = [];
                    }
                    this.form.agenda[agendaIndex].files.push({
                      name: fileName,
                      size: this.formatFileSize(file.size || 0),
                      type: "pdf",
                      file,
                      path: uri
                    });
                    uni.showToast({
                      title: "文件已添加",
                      icon: "success"
                    });
                  }, (error) => {
                    formatAppLog("error", "at pages/user/meeting/create.vue:1785", "获取文件对象失败:", error);
                    uni.showToast({
                      title: "获取文件信息失败",
                      icon: "none"
                    });
                  });
                }, (error) => {
                  formatAppLog("error", "at pages/user/meeting/create.vue:1792", "解析文件URL失败:", error);
                  uni.showToast({
                    title: "选择文件失败",
                    icon: "none"
                  });
                });
              },
              error: (error) => {
                formatAppLog("error", "at pages/user/meeting/create.vue:1800", "选择文件失败:", error);
                uni.showToast({
                  title: "选择文件失败",
                  icon: "none"
                });
              }
            });
          }
        });
      },
      // 添加新的方法: 移除议程文件
      removeAgendaFile(agendaIndex, fileIndex) {
        this.form.agenda[agendaIndex].files.splice(fileIndex, 1);
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "create-meeting-container" }, [
      vue.createCommentVNode(" 添加面包屑导航 "),
      vue.createElementVNode("view", { class: "breadcrumb" }, [
        vue.createElementVNode("view", {
          class: "breadcrumb-item",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToList && $options.navigateToList(...args))
        }, "会议列表"),
        vue.createElementVNode("text", { class: "breadcrumb-separator" }, "/"),
        vue.createElementVNode(
          "view",
          { class: "breadcrumb-item" },
          vue.toDisplayString($data.isEdit ? "编辑会议" : "创建会议"),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode(
        "form",
        {
          onSubmit: _cache[16] || (_cache[16] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
        },
        [
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "基本信息"),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "会议名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  type: "text",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.title = $event),
                  placeholder: "请输入会议名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.title]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "会议日期"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.form.date,
                onChange: _cache[2] || (_cache[2] = (...args) => $options.handleDateChange && $options.handleDateChange(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.form.date || "请选择日期"),
                  1
                  /* TEXT */
                )
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "开始时间"),
              vue.createElementVNode("picker", {
                mode: "time",
                value: $data.form.startTime,
                onChange: _cache[3] || (_cache[3] = (...args) => $options.handleStartTimeChange && $options.handleStartTimeChange(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.form.startTime || "请选择开始时间"),
                  1
                  /* TEXT */
                )
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "结束时间"),
              vue.createElementVNode("picker", {
                mode: "time",
                value: $data.form.endTime,
                onChange: _cache[4] || (_cache[4] = (...args) => $options.handleEndTimeChange && $options.handleEndTimeChange(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.form.endTime || "请选择结束时间"),
                  1
                  /* TEXT */
                )
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "会议类型"),
              vue.createElementVNode("picker", {
                class: "form-picker",
                range: $data.meetingTypes,
                value: $data.typeIndex,
                onChange: _cache[5] || (_cache[5] = (...args) => $options.handleTypeChange && $options.handleTypeChange(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.meetingTypes[$data.typeIndex]),
                  1
                  /* TEXT */
                )
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "优先级"),
              vue.createElementVNode("picker", {
                class: "form-picker",
                range: $data.priorityOptions,
                value: $data.priorityIndex,
                onChange: _cache[6] || (_cache[6] = (...args) => $options.handlePriorityChange && $options.handlePriorityChange(...args))
              }, [
                vue.createElementVNode("view", { class: "picker-value" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["priority-indicator", $options.getPriorityClass($data.form.priority)])
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createTextVNode(
                    " " + vue.toDisplayString($data.priorityOptions[$data.priorityIndex]),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "重复"),
              vue.createElementVNode("picker", {
                class: "form-picker",
                range: $data.repeatOptions,
                value: $data.repeatIndex,
                onChange: _cache[7] || (_cache[7] = (...args) => $options.handleRepeatChange && $options.handleRepeatChange(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.repeatOptions[$data.repeatIndex]),
                  1
                  /* TEXT */
                )
              ], 40, ["range", "value"])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "会议室"),
            $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "room-selection"
            }, [
              vue.createElementVNode("text", { class: "loading-text" }, "加载可用会议室...")
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "room-selection"
            }, [
              vue.createElementVNode("scroll-view", {
                class: "room-list",
                "scroll-y": ""
              }, [
                vue.createElementVNode(
                  "radio-group",
                  {
                    onChange: _cache[8] || (_cache[8] = (...args) => $options.handleRoomChange && $options.handleRoomChange(...args))
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.availableRooms, (room, index) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "label",
                          {
                            class: vue.normalizeClass(["room-item", { "selected": $data.form.roomId === room.id }]),
                            key: room.id
                          },
                          [
                            vue.createElementVNode("view", { class: "room-info" }, [
                              vue.createElementVNode(
                                "view",
                                { class: "room-name" },
                                vue.toDisplayString(room.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("view", { class: "room-detail" }, [
                                vue.createElementVNode(
                                  "text",
                                  { class: "room-capacity" },
                                  "容量：" + vue.toDisplayString(room.capacity) + "人",
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode(
                                  "text",
                                  { class: "room-location" },
                                  vue.toDisplayString(room.location),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            vue.createElementVNode("radio", {
                              value: room.id.toString(),
                              checked: $data.form.roomId === room.id
                            }, null, 8, ["value", "checked"])
                          ],
                          2
                          /* CLASS */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ])
            ]))
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "参会人员"),
            vue.createElementVNode("view", { class: "attendees-selection" }, [
              $data.form.attendees.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "selected-attendees"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.form.attendees, (attendee, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "attendee-tag",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "attendee-name" },
                        vue.toDisplayString(attendee.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", {
                        class: "remove-btn",
                        onClick: ($event) => $options.removeAttendee(index)
                      }, "×", 8, ["onClick"])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", {
                class: "add-attendee",
                onClick: _cache[9] || (_cache[9] = (...args) => $options.showAttendeeSelector && $options.showAttendeeSelector(...args))
              }, [
                vue.createElementVNode("text", { class: "add-icon" }, "+"),
                vue.createElementVNode("text", null, "添加参会人员")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "设备需求"),
            vue.createElementVNode("view", { class: "equipment-list" }, [
              vue.createElementVNode(
                "checkbox-group",
                {
                  onChange: _cache[10] || (_cache[10] = (...args) => $options.handleEquipmentChange && $options.handleEquipmentChange(...args))
                },
                [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.equipmentOptions, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("label", {
                        class: "equipment-item",
                        key: index
                      }, [
                        vue.createElementVNode("checkbox", {
                          value: item,
                          checked: $data.form.equipment.includes(item)
                        }, null, 8, ["value", "checked"]),
                        vue.createElementVNode(
                          "text",
                          { class: "equipment-name" },
                          vue.toDisplayString(item),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                32
                /* NEED_HYDRATION */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "会议议程"),
            vue.createElementVNode("view", { class: "agenda-list" }, [
              vue.createElementVNode("view", { class: "agenda-items" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.form.agenda, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "agenda-item",
                      key: index
                    }, [
                      vue.createElementVNode("view", { class: "agenda-header" }, [
                        vue.createElementVNode("view", { class: "agenda-time" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "time-input",
                            type: "text",
                            "onUpdate:modelValue": ($event) => item.time = $event,
                            placeholder: "时间点"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, item.time]
                          ])
                        ]),
                        vue.createElementVNode("view", { class: "agenda-actions" }, [
                          index > 0 ? (vue.openBlock(), vue.createElementBlock("text", {
                            key: 0,
                            class: "move-up-btn",
                            onClick: ($event) => $options.moveAgendaItem(index, -1)
                          }, "↑", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                          index < $data.form.agenda.length - 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                            key: 1,
                            class: "move-down-btn",
                            onClick: ($event) => $options.moveAgendaItem(index, 1)
                          }, "↓", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                          vue.createElementVNode("text", {
                            class: "delete-btn",
                            onClick: ($event) => $options.removeAgendaItem(index)
                          }, "×", 8, ["onClick"])
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "agenda-content" }, [
                        vue.withDirectives(vue.createElementVNode("textarea", {
                          class: "content-input",
                          "onUpdate:modelValue": ($event) => item.content = $event,
                          placeholder: "议程内容",
                          "auto-height": ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, item.content]
                        ])
                      ]),
                      $data.form.type !== "普通会议" ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "agenda-speaker"
                      }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "speaker-input",
                          type: "text",
                          "onUpdate:modelValue": ($event) => item.speaker = $event,
                          placeholder: "负责人/发言人"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, item.speaker]
                        ])
                      ])) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode("view", { class: "agenda-files" }, [
                        item.files && item.files.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "files-list"
                        }, [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(item.files, (file, fileIndex) => {
                              return vue.openBlock(), vue.createElementBlock("view", {
                                key: fileIndex,
                                class: "file-item"
                              }, [
                                vue.createElementVNode(
                                  "text",
                                  { class: "file-name" },
                                  vue.toDisplayString(file.name),
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode(
                                  "text",
                                  { class: "file-size" },
                                  vue.toDisplayString(file.size),
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode("text", {
                                  class: "delete-btn",
                                  onClick: ($event) => $options.removeAgendaFile(index, fileIndex)
                                }, "×", 8, ["onClick"])
                              ]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])) : vue.createCommentVNode("v-if", true),
                        vue.createElementVNode("view", {
                          class: "add-file-btn",
                          onClick: ($event) => $options.selectAgendaFile(index)
                        }, [
                          vue.createElementVNode("text", { class: "add-icon" }, "+"),
                          vue.createElementVNode("text", null, "添加议程文件")
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", {
                class: "add-agenda",
                onClick: _cache[11] || (_cache[11] = (...args) => $options.addAgendaItem && $options.addAgendaItem(...args))
              }, [
                vue.createElementVNode("text", { class: "add-icon" }, "+"),
                vue.createElementVNode("text", null, "添加议程项")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "会议说明"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "form-textarea",
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.form.description = $event),
                placeholder: "请输入会议说明等补充信息",
                "auto-height": ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.description]
            ])
          ]),
          vue.createCommentVNode(" 添加会议附件上传部分 "),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-title" }, "会议附件"),
            vue.createElementVNode("view", { class: "attachments-area" }, [
              $data.form.attachments.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "attachment-list"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.form.attachments, (file, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "attachment-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["file-icon", $options.getFileIconClass(file.type)])
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            {
                              class: vue.normalizeClass(["iconfont", $options.getFileIcon(file.type)])
                            },
                            null,
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode("view", { class: "file-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "file-name" },
                          vue.toDisplayString(file.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "file-size" },
                          vue.toDisplayString(file.size),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("text", {
                        class: "remove-btn",
                        onClick: ($event) => $options.removeAttachment(index)
                      }, "×", 8, ["onClick"])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", {
                class: "add-attachment",
                onClick: _cache[13] || (_cache[13] = (...args) => $options.chooseFile && $options.chooseFile(...args))
              }, [
                vue.createElementVNode("text", { class: "add-icon" }, "+"),
                vue.createElementVNode("text", null, "添加附件")
              ]),
              vue.createElementVNode("view", { class: "attachment-hint" }, [
                vue.createElementVNode("text", null, "支持文档、图片、PDF等格式，单个文件不超过10MB")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "submit-section" }, [
            vue.createElementVNode("button", {
              class: "submit-btn",
              disabled: $data.isSubmitting,
              loading: $data.isSubmitting,
              onClick: _cache[14] || (_cache[14] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
            }, vue.toDisplayString($data.isEdit ? "保存修改" : "提交申请"), 9, ["disabled", "loading"]),
            vue.createElementVNode("button", {
              class: "cancel-btn",
              type: "default",
              onClick: _cache[15] || (_cache[15] = (...args) => _ctx.handleCancel && _ctx.handleCancel(...args))
            }, "取消")
          ])
        ],
        32
        /* NEED_HYDRATION */
      )
    ]);
  }
  const PagesUserMeetingCreate = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/meeting/create.vue"]]);
  const _sfc_main$h = {
    data() {
      return {
        id: "",
        meeting: {
          id: "",
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          reserveDate: "",
          room: "",
          status: "pending",
          booker: "",
          participants: [],
          subtopics: [],
          attachments: [],
          equipment: []
        },
        isLoading: true,
        userId: null,
        files: [],
        loading: {
          participants: false,
          subtopics: false,
          files: false
        },
        fromPage: "list",
        // 默认来源是会议列表
        originalMeetingData: null,
        source: null
      };
    },
    created() {
      try {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo && userInfo.id) {
          this.userId = userInfo.id.toString();
        } else {
          formatAppLog("warn", "at pages/user/meeting/detail.vue:283", "未能从存储获取用户信息，使用默认ID");
        }
      } catch (e) {
        formatAppLog("error", "at pages/user/meeting/detail.vue:286", "获取用户信息失败:", e);
      }
    },
    computed: {
      canOperate() {
        return this.isOrganizer || this.meeting.participants.some((participant) => participant.id === this.userId);
      },
      isOrganizer() {
        return this.meeting.organizer && this.meeting.organizer.id === this.userId;
      },
      isMeetingStarted() {
        const now = /* @__PURE__ */ new Date();
        const startTime = new Date(this.meeting.startTime);
        return now >= startTime;
      }
    },
    onLoad(options) {
      formatAppLog("log", "at pages/user/meeting/detail.vue:305", "Entering Detail Page with:", options);
      if (options.id) {
        this.id = options.id;
        formatAppLog("log", "at pages/user/meeting/detail.vue:310", "会议ID:", this.id);
        if (options.from) {
          this.source = options.from;
          formatAppLog("log", "at pages/user/meeting/detail.vue:315", "来源页面:", this.source);
        }
        if (options.meetingInfo) {
          try {
            const meetingInfo = JSON.parse(decodeURIComponent(options.meetingInfo));
            formatAppLog("log", "at pages/user/meeting/detail.vue:322", "收到预加载的会议信息:", meetingInfo);
            this.originalMeetingData = meetingInfo;
            const meetingId = options.id || meetingInfo.id;
            this.id = meetingId;
            this.meeting = __spreadProps(__spreadValues(__spreadValues({}, this.meeting), meetingInfo), {
              // 添加传递的数据
              id: meetingId
              // 确保ID一致
            });
            formatAppLog("log", "at pages/user/meeting/detail.vue:338", "使用传递的会议信息初始化了详情页:", JSON.stringify(this.meeting));
            if (this.meeting.startTime && this.meeting.startTime.includes(" ")) {
              this.meeting.startTime = this.meeting.startTime.split(" ")[1];
            }
            if (this.meeting.endTime && this.meeting.endTime.includes(" ")) {
              this.meeting.endTime = this.meeting.endTime.split(" ")[1];
            }
            this.isLoading = false;
            this.fetchParticipants();
          } catch (e) {
            formatAppLog("error", "at pages/user/meeting/detail.vue:355", "解析传递的会议信息失败:", e);
            uni.showToast({
              title: "解析会议信息失败",
              icon: "none"
            });
          }
        } else {
          this.fetchMeetingDetail();
        }
      } else {
        formatAppLog("error", "at pages/user/meeting/detail.vue:366", "未提供会议ID");
        uni.showToast({
          title: "无效的会议",
          icon: "none"
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    methods: {
      fetchMeetingDetail() {
        this.isLoading = true;
        formatAppLog("log", "at pages/user/meeting/detail.vue:381", "开始获取会议详情，ID:", this.id);
        Promise.all([
          api.meeting.getMeetingDetail(this.id),
          api.participant.getParticipantList(this.id)
        ]).then(([meetingRes, participantsRes]) => {
          if (meetingRes.code === 200 && meetingRes.data) {
            formatAppLog("log", "at pages/user/meeting/detail.vue:391", "API返回的会议详情:", meetingRes.data);
            const originalBooker = this.meeting.booker;
            this.meeting = __spreadProps(__spreadValues({}, meetingRes.data), {
              booker: originalBooker || meetingRes.data.booker
              // 优先使用原始预约人信息
            });
            if (this.meeting.startTime && this.meeting.startTime.includes(" ")) {
              this.meeting.startTime = this.meeting.startTime.split(" ")[1];
            }
            if (this.meeting.endTime && this.meeting.endTime.includes(" ")) {
              this.meeting.endTime = this.meeting.endTime.split(" ")[1];
            }
          }
          if (participantsRes.code === 200 && participantsRes.data) {
            const participants = Array.isArray(participantsRes.data) ? participantsRes.data : [];
            this.meeting.participants = participants.map((p) => ({
              id: p.id || p.userId || "",
              name: p.name || p.username || p.userName || "未知用户",
              username: p.username || p.userName || p.name || "",
              avatar: p.avatar || p.avatarUrl || "",
              status: p.status || "pending"
            }));
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/detail.vue:427", "获取会议详情或参会人员异常:", err);
          if (this.originalMeetingData) {
            formatAppLog("log", "at pages/user/meeting/detail.vue:431", "API调用异常，使用预加载的会议信息");
            uni.showToast({
              title: "使用缓存数据显示",
              icon: "none"
            });
          } else {
            uni.showToast({
              title: "获取会议详情失败，请稍后重试",
              icon: "none"
            });
          }
        }).finally(() => {
          this.isLoading = false;
        });
      },
      // 获取参会人员
      fetchParticipants() {
        this.loading.participants = true;
        return api.participant.getParticipantList(this.id).then((res) => {
          if (res.code === 200 && res.data) {
            const participants = Array.isArray(res.data) ? res.data : [];
            const formattedParticipants = participants.map((p) => ({
              id: p.id || p.userId || "",
              name: p.name || p.username || p.userName || "未知用户",
              username: p.username || p.userName || p.name || "",
              avatar: p.avatar || p.avatarUrl || "",
              status: p.status || "pending"
            }));
            this.meeting.attendees = formattedParticipants;
            return res;
          }
          return res;
        }).catch((err) => {
          return { code: 500, message: "获取参会人员失败", data: [] };
        }).finally(() => {
          this.loading.participants = false;
        });
      },
      // 获取会议子议题/议程
      fetchSubtopics() {
        this.loading.subtopics = true;
        return api.subtopic.getSubtopicsByReservationId(this.id).then((res) => {
          if (res.code === 200 && res.data) {
            const subtopics = Array.isArray(res.data) ? res.data : [];
            this.meeting.subtopics = subtopics;
            const attachments = [];
            subtopics.forEach((topic) => {
              if (topic.files && Array.isArray(topic.files)) {
                topic.files.forEach((file) => {
                  attachments.push({
                    id: file.id || file.fileId,
                    name: file.name || file.fileName || "未命名文件",
                    type: this.getFileType(file.name || file.fileName),
                    size: file.size || 0,
                    fileKey: file.fileKey,
                    subtopicId: topic.id
                  });
                });
              }
            });
            this.meeting.attachments = attachments;
            return res;
          }
          return res;
        }).catch((err) => {
          return { code: 500, message: "获取会议子议题失败", data: [] };
        }).finally(() => {
          this.loading.subtopics = false;
        });
      },
      // 获取文件类型
      getFileType(fileName) {
        if (!fileName)
          return "unknown";
        const extension = fileName.split(".").pop().toLowerCase();
        return extension;
      },
      // 下载文件
      downloadFile(fileKey) {
        if (!fileKey) {
          uni.showToast({
            title: "文件标识符无效",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "正在获取文件..."
        });
        api.file.getFileUrl(fileKey).then((res) => {
          if (res.code === 200 && res.data && res.data.url) {
            const url = res.data.url;
            uni.showLoading({
              title: "正在打开文件..."
            });
            uni.setClipboardData({
              data: url,
              success: () => {
                uni.hideLoading();
                uni.showModal({
                  title: "文件链接已复制",
                  content: "文件链接已复制到剪贴板，您可以在浏览器中打开查看",
                  showCancel: false
                });
              },
              fail: () => {
                uni.hideLoading();
                uni.showToast({
                  title: "复制链接失败",
                  icon: "none"
                });
              }
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: "获取文件地址失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: "获取文件地址失败",
            icon: "none"
          });
        });
      },
      // 打开附件
      openAttachment(attachment) {
        if (attachment && attachment.fileKey) {
          this.downloadFile(attachment.fileKey);
        } else {
          uni.showToast({
            title: "无效的附件",
            icon: "none"
          });
        }
      },
      // 获取附件信息
      fetchAttachments() {
        this.loading.files = true;
        const files = this.meeting.files;
        if (!files || !Array.isArray(files) || files.length === 0) {
          this.loading.files = false;
          return;
        }
        this.files = files.map((file) => {
          return __spreadProps(__spreadValues({}, file), {
            name: file.name || file.fileName || "未命名文件",
            url: file.url || "",
            type: file.type || this.getFileType(file.name || file.fileName || "")
          });
        });
        this.loading.files = false;
      },
      startMeeting() {
        uni.showLoading({
          title: "处理中"
        });
        setTimeout(() => {
          const success = Math.random() > 0.2;
          if (success) {
            uni.hideLoading();
            uni.showToast({
              title: "会议已开始",
              icon: "success"
            });
            this.meeting.status = "in-progress";
            setTimeout(() => {
              this.enterMeetingRoom();
            }, 1e3);
          } else {
            uni.hideLoading();
            uni.showToast({
              title: "开始会议失败，请稍后重试",
              icon: "none"
            });
          }
        }, 1500);
      },
      viewMeetingMinutes() {
        uni.navigateTo({
          url: `/pages/user/meeting/minutes?id=${this.id}`
        });
      },
      handleBack() {
        uni.navigateBack({
          fail: () => {
            uni.navigateTo({
              url: "/pages/user/meeting/list"
            });
          }
        });
      },
      navigateBack() {
        if (this.source === "schedule") {
          uni.navigateTo({
            url: "/pages/user/schedule"
          });
        } else if (this.source === "list") {
          uni.navigateTo({
            url: "/pages/user/meeting/list"
          });
        } else {
          uni.navigateBack();
        }
      },
      cancelMeeting() {
        uni.showModal({
          title: "确认取消",
          content: "确定要取消该会议吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "处理中"
              });
              api.meeting.cancelMeeting(this.meeting.id).then((res2) => {
                if (res2.code === 200) {
                  uni.showToast({
                    title: "会议已取消",
                    icon: "success"
                  });
                  setTimeout(() => {
                    this.fetchMeetingDetail();
                  }, 1500);
                } else {
                  uni.showToast({
                    title: res2.message || "取消会议失败",
                    icon: "none"
                  });
                }
              }).catch((err) => {
                uni.showToast({
                  title: "取消会议失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      editMeeting() {
        uni.navigateTo({
          url: `/pages/user/meeting/create?id=${this.id}`
        });
      },
      enterMeetingRoom() {
        formatAppLog("log", "at pages/user/meeting/detail.vue:743", "从详情页进入会议室，传递完整会议信息:", this.meeting);
        const meetingInfo = encodeURIComponent(JSON.stringify(this.meeting));
        uni.navigateTo({
          url: `/pages/user/meeting/room?id=${this.meeting.id}&meetingInfo=${meetingInfo}`
        });
      },
      getStatusClass(status) {
        if (!status)
          return "";
        const statusMap = {
          "pending": "status-pending",
          "approved": "status-approved",
          "in-progress": "status-in-progress",
          "completed": "status-completed",
          "rejected": "status-rejected",
          "cancelled": "status-canceled",
          "canceled": "status-canceled",
          // 中文状态映射
          "待审核": "status-pending",
          "已通过": "status-approved",
          "进行中": "status-in-progress",
          "已完成": "status-completed",
          "已拒绝": "status-rejected",
          "已取消": "status-canceled"
        };
        return statusMap[status] || "";
      },
      getStatusText(status) {
        let normalizedStatus = this.normalizeStatus(status);
        const statusMap = {
          "pending": "待审批",
          "approved": "已通过",
          "in-progress": "进行中",
          "completed": "已完成",
          "rejected": "已拒绝",
          "cancelled": "已取消"
        };
        return statusMap[normalizedStatus] || "未知状态";
      },
      normalizeStatus(status) {
        if (typeof status === "object" && status !== null) {
          status = status.status || "pending";
        }
        if (typeof status === "number" || /^\d+$/.test(status)) {
          const numStatus = parseInt(status);
          switch (numStatus) {
            case 0:
              return "pending";
            case 1:
              return "approved";
            case 2:
              return "in-progress";
            case 3:
              return "completed";
            case 4:
              return "cancelled";
            case 5:
              return "rejected";
            default:
              return "pending";
          }
        } else if (typeof status === "string") {
          status = status.toLowerCase();
          if (status === "待审核" || status === "待审批") {
            return "pending";
          } else if (status === "已通过" || status === "已审批") {
            return "approved";
          } else if (status === "进行中") {
            return "in-progress";
          } else if (status === "已完成") {
            return "completed";
          } else if (status === "已拒绝") {
            return "rejected";
          } else if (status === "已取消") {
            return "cancelled";
          }
          if (status === "canceled" || status === "cancelled") {
            return "cancelled";
          }
          if (status.includes("pend") || status.includes("wait") || status.includes("creat")) {
            return "pending";
          } else if (status.includes("progress") || status.includes("ongo") || status.includes("start")) {
            return "in-progress";
          } else if (status.includes("complet") || status.includes("finish") || status.includes("end")) {
            return "completed";
          } else if (status.includes("cancel")) {
            return "cancelled";
          } else if (status.includes("reject") || status.includes("deny")) {
            return "rejected";
          } else if (status.includes("approv") || status.includes("accept")) {
            return "approved";
          }
        }
        return "pending";
      },
      getAttendeeStatus(status) {
        switch (status) {
          case "accepted":
            return "已接受";
          case "pending":
            return "待回复";
          case "rejected":
            return "已拒绝";
          default:
            return "未知";
        }
      },
      getEquipmentIcon(type) {
        switch (type) {
          case "投影仪":
            return "📽️";
          case "白板":
            return "🖌️";
          case "视频设备":
            return "📹";
          case "音响":
            return "🔊";
          case "麦克风":
            return "🎤";
          default:
            return "🔌";
        }
      },
      getFileIcon(type) {
        switch (type) {
          case "doc":
          case "docx":
            return "📄";
          case "xls":
          case "xlsx":
            return "📊";
          case "ppt":
          case "pptx":
            return "📑";
          case "pdf":
            return "📕";
          case "jpg":
          case "jpeg":
          case "png":
          case "gif":
            return "🖼️";
          default:
            return "📎";
        }
      },
      formatFileSize(size) {
        if (!size)
          return "未知大小";
        if (typeof size === "string" && (size.includes("KB") || size.includes("MB") || size.includes("GB"))) {
          return size;
        }
        const fileSize = typeof size === "string" ? parseInt(size) : size;
        if (fileSize < 1024) {
          return fileSize + "B";
        } else if (fileSize < 1024 * 1024) {
          return (fileSize / 1024).toFixed(1) + "KB";
        } else if (fileSize < 1024 * 1024 * 1024) {
          return (fileSize / (1024 * 1024)).toFixed(1) + "MB";
        } else {
          return (fileSize / (1024 * 1024 * 1024)).toFixed(1) + "GB";
        }
      },
      formatAgendaTime(item) {
        if (!item || !item.title)
          return "";
        const timeMatch = item.title.match(/^(\d{1,2}:\d{2})\s*-\s*/);
        if (timeMatch) {
          return timeMatch[1];
        }
        if (item.startTime) {
          return item.startTime;
        }
        return "";
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "meeting-detail-container" }, [
      vue.createCommentVNode(" 面包屑导航 "),
      vue.createElementVNode("view", { class: "breadcrumb" }, [
        vue.createElementVNode(
          "view",
          {
            class: "breadcrumb-item",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateBack && $options.navigateBack(...args))
          },
          vue.toDisplayString($data.fromPage === "schedule" ? "日程" : "会议列表"),
          1
          /* TEXT */
        ),
        vue.createElementVNode("text", { class: "breadcrumb-separator" }, "/"),
        vue.createElementVNode("view", { class: "breadcrumb-item" }, "会议详情")
      ]),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["status-bar", $options.getStatusClass($data.meeting.status)])
        },
        [
          vue.createElementVNode(
            "text",
            { class: "status-text" },
            vue.toDisplayString($options.getStatusText($data.meeting.status)),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode("view", { class: "meeting-header" }, [
        vue.createElementVNode(
          "view",
          { class: "meeting-title" },
          vue.toDisplayString($data.meeting.title),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "card-title" }, "会议信息"),
        vue.createElementVNode("view", { class: "info-section" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-icon" }, "📋"),
            vue.createElementVNode("view", { class: "info-content" }, [
              vue.createElementVNode("text", { class: "info-label" }, "主题"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($data.meeting.topic || "未填写主题"),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-icon" }, "👤"),
            vue.createElementVNode("view", { class: "info-content" }, [
              vue.createElementVNode("text", { class: "info-label" }, "预约人"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($data.meeting.booker || "未知"),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-icon" }, "🕒"),
            vue.createElementVNode("view", { class: "info-content" }, [
              vue.createElementVNode("text", { class: "info-label" }, "时间"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($data.meeting.reserveDate ? $data.meeting.reserveDate + " " + $data.meeting.startTime + "-" + $data.meeting.endTime : "未知时间"),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-icon" }, "📍"),
            vue.createElementVNode("view", { class: "info-content" }, [
              vue.createElementVNode("text", { class: "info-label" }, "地点"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($data.meeting.room || "未指定地点"),
                1
                /* TEXT */
              )
            ])
          ]),
          $data.meeting.description ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "info-item"
          }, [
            vue.createElementVNode("text", { class: "info-icon" }, "📝"),
            vue.createElementVNode("view", { class: "info-content" }, [
              vue.createElementVNode("text", { class: "info-label" }, "描述"),
              vue.createElementVNode(
                "text",
                { class: "info-value description-text" },
                vue.toDisplayString($data.meeting.description),
                1
                /* TEXT */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-icon" }, "🔄"),
            vue.createElementVNode("view", { class: "info-content" }, [
              vue.createElementVNode("text", { class: "info-label" }, "状态"),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["info-value status-text", $options.getStatusClass($data.meeting.status)])
                },
                vue.toDisplayString($data.meeting.status),
                3
                /* TEXT, CLASS */
              )
            ])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "card-title" }, "会议说明"),
        vue.createElementVNode(
          "view",
          { class: "description" },
          vue.toDisplayString($data.meeting.description || "暂无会议说明"),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "attendees-list" }, [
        vue.createElementVNode("view", { class: "section-title" }, "参会人员"),
        $data.meeting.attendees && $data.meeting.attendees.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "attendees-container"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.meeting.attendees, (attendee, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "attendee-item",
                key: attendee.id || index
              }, [
                vue.createElementVNode("image", {
                  src: attendee.avatar || "/static/avatar/default-user.svg",
                  mode: "aspectFill",
                  class: "attendee-avatar"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "attendee-info" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "attendee-name" },
                    vue.toDisplayString(attendee.name || "未知用户"),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : $data.meeting.participants && $data.meeting.participants.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "attendees-container"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.meeting.participants, (participant, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "attendee-item",
                key: participant.id || index
              }, [
                vue.createElementVNode("image", {
                  src: participant.avatar || "/static/avatar/default-user.svg",
                  mode: "aspectFill",
                  class: "attendee-avatar"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "attendee-info" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "attendee-name" },
                    vue.toDisplayString(participant.name || (participant.username || "未知用户")),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "empty-attendees"
        }, [
          vue.createElementVNode("text", null, "暂无参会人员")
        ]))
      ]),
      $data.meeting.equipment && $data.meeting.equipment.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "info-card"
      }, [
        vue.createElementVNode("view", { class: "card-title" }, "设备需求"),
        vue.createElementVNode("view", { class: "equipment-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.meeting.equipment, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "equipment-item",
                key: index
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "equipment-icon" },
                  vue.toDisplayString($options.getEquipmentIcon(item)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "equipment-name" },
                  vue.toDisplayString(item),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 议程列表 "),
      $data.meeting.subtopics && $data.meeting.subtopics.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "info-card"
      }, [
        vue.createElementVNode("view", { class: "card-title" }, "会议议程"),
        vue.createElementVNode("view", { class: "agenda-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.meeting.subtopics, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "agenda-item",
                key: item.id || index
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "agenda-time" },
                  vue.toDisplayString($options.formatAgendaTime(item)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "agenda-content" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "agenda-title" },
                    vue.toDisplayString(item.title || "未命名议程"),
                    1
                    /* TEXT */
                  ),
                  item.content ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "agenda-description"
                    },
                    vue.toDisplayString(item.content),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createCommentVNode(" 议程项的文件列表 "),
                  item.files && item.files.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "agenda-files"
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(item.files, (file, fileIndex) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: "file-item",
                          key: file.id || fileIndex,
                          onClick: ($event) => $options.openAttachment(file)
                        }, [
                          vue.createElementVNode(
                            "text",
                            { class: "file-icon" },
                            vue.toDisplayString($options.getFileIcon($options.getFileType(file.name || file.fileName))),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode("view", { class: "file-info" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "file-name" },
                              vue.toDisplayString(file.name || file.fileName || "未命名文件"),
                              1
                              /* TEXT */
                            ),
                            file.size ? (vue.openBlock(), vue.createElementBlock(
                              "text",
                              {
                                key: 0,
                                class: "file-size"
                              },
                              vue.toDisplayString($options.formatFileSize(file.size)),
                              1
                              /* TEXT */
                            )) : vue.createCommentVNode("v-if", true)
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true)
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.meeting.attachments && $data.meeting.attachments.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "info-card"
      }, [
        vue.createElementVNode("view", { class: "card-title" }, "会议附件"),
        vue.createElementVNode("view", { class: "attachment-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.meeting.attachments, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "attachment-item",
                key: index,
                onClick: ($event) => $options.openAttachment(item)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "attachment-icon" },
                  vue.toDisplayString($options.getFileIcon(item.type)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "attachment-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "attachment-name" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "attachment-size" },
                    vue.toDisplayString($options.formatFileSize(item.size)),
                    1
                    /* TEXT */
                  )
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.meeting.status === "rejected" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "info-card"
      }, [
        vue.createElementVNode("view", { class: "card-title" }, "拒绝原因"),
        vue.createElementVNode(
          "view",
          { class: "reject-reason" },
          vue.toDisplayString($data.meeting.rejectReason || "无"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 审批信息 "),
      $data.meeting.approveInfo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "info-card"
      }, [
        vue.createElementVNode("view", { class: "card-title" }, "审批信息"),
        vue.createElementVNode("view", { class: "approval-info" }, [
          vue.createElementVNode("view", { class: "approval-item" }, [
            vue.createElementVNode("text", { class: "approval-label" }, "审批人："),
            vue.createElementVNode(
              "text",
              { class: "approval-value" },
              vue.toDisplayString($data.meeting.approveInfo.approver),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "approval-item" }, [
            vue.createElementVNode("text", { class: "approval-label" }, "审批时间："),
            vue.createElementVNode(
              "text",
              { class: "approval-value" },
              vue.toDisplayString($data.meeting.approveInfo.time),
              1
              /* TEXT */
            )
          ]),
          $data.meeting.approveInfo.remark ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "approval-item"
          }, [
            vue.createElementVNode("text", { class: "approval-label" }, "备注："),
            vue.createElementVNode(
              "text",
              { class: "approval-value" },
              vue.toDisplayString($data.meeting.approveInfo.remark),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $options.canOperate ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 5,
        class: "action-bar"
      }, [
        vue.createCommentVNode(" 会议组织者且会议未开始时可取消会议 "),
        ($data.meeting.status === "pending" || $data.meeting.status === "approved") && $options.isOrganizer ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "action-btn cancel-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.cancelMeeting && $options.cancelMeeting(...args))
        }, " 取消会议 ")) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 会议组织者且会议已通过审批但未开始时可编辑会议 "),
        $data.meeting.status === "approved" && $options.isOrganizer ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "action-btn primary-btn",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.editMeeting && $options.editMeeting(...args))
        }, " 编辑会议 ")) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 会议组织者且会议已通过审批但未开始时可开始会议 "),
        $data.meeting.status === "approved" && $options.isOrganizer ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: "action-btn start-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.startMeeting && $options.startMeeting(...args))
        }, " 开始会议 ")) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 已通过且已开始的会议可以进入会议室 "),
        $data.meeting.status === "approved" ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 3,
          class: "action-btn enter-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.enterMeetingRoom && $options.enterMeetingRoom(...args))
        }, " 进入会议 ")) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 会议已完成时可查看会议纪要 "),
        $data.meeting.status === "completed" ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 4,
          class: "action-btn minutes-btn",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.viewMeetingMinutes && $options.viewMeetingMinutes(...args))
        }, " 查看纪要 ")) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUserMeetingDetail = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/meeting/detail.vue"]]);
  const _sfc_main$g = {
    data() {
      return {
        // 会议信息
        meetingId: "",
        meeting: {
          title: "加载中...",
          status: "pending",
          startTime: "",
          endTime: "",
          organizer: {}
        },
        // 页面状态
        currentTab: "agenda",
        tabs: [
          { id: "agenda", name: "议题" },
          { id: "file", name: "文件" },
          { id: "recording", name: "录音" }
        ],
        // 用户状态
        currentUser: "张三",
        isCreator: false,
        isMeetingActive: false,
        meetingStatusText: "未开始",
        meetingStatusClass: "status-pending",
        // 会议议题
        agendaItems: [],
        // 会议文件
        fileItems: [],
        showUploadFileModal: false,
        uploadForm: {
          fileName: "",
          fileType: "doc",
          filePath: "",
          selectedFileName: "",
          agendaId: ""
        },
        uploadFileOptions: [
          { value: "doc", label: "文档" },
          { value: "ppt", label: "演示文稿" },
          { value: "pdf", label: "PDF" },
          { value: "xls", label: "表格" },
          { value: "img", label: "图片" },
          { value: "other", label: "其他" }
        ],
        // 会议录音
        recordingItems: [],
        isRecording: false,
        recordingStartTime: null,
        recordingDuration: "00:00",
        recordingTimer: null,
        uploadRecordingModal: false,
        recordingForm: {
          name: "",
          filePath: "",
          fileName: "",
          description: ""
        },
        showAddAgendaModal: false
      };
    },
    // 页面加载
    onLoad(options) {
      formatAppLog("log", "at pages/user/meeting/room.vue:361", "会议室页面加载，参数:", options);
      if (options.id) {
        this.meetingId = options.id;
        formatAppLog("log", "at pages/user/meeting/room.vue:366", "获取到会议ID:", this.meetingId);
      }
      if (options.meetingInfo) {
        try {
          formatAppLog("log", "at pages/user/meeting/room.vue:372", "接收到会议信息参数:", options.meetingInfo);
          const decodedInfo = decodeURIComponent(options.meetingInfo);
          formatAppLog("log", "at pages/user/meeting/room.vue:374", "解码后的会议信息:", decodedInfo);
          const meetingInfo = JSON.parse(decodedInfo);
          formatAppLog("log", "at pages/user/meeting/room.vue:377", "解析后的会议信息对象:", meetingInfo);
          this.meeting = {
            id: meetingInfo.id,
            title: meetingInfo.topic || meetingInfo.title || "未命名会议",
            description: meetingInfo.description || "",
            startTime: meetingInfo.startTime || "",
            endTime: meetingInfo.endTime || "",
            status: this.normalizeStatus(meetingInfo.status),
            booker: meetingInfo.booker || meetingInfo.user || "",
            roomName: meetingInfo.roomName || "",
            date: meetingInfo.reserveDate || meetingInfo.date || "",
            participants: meetingInfo.participants || [],
            room: meetingInfo.room || "",
            topic: meetingInfo.topic || meetingInfo.title || "未命名会议",
            reserveDate: meetingInfo.reserveDate || meetingInfo.date || ""
          };
          formatAppLog("log", "at pages/user/meeting/room.vue:396", "会议信息设置完成:", this.meeting);
          this.updateMeetingStatus();
          this.initData();
        } catch (error) {
          formatAppLog("error", "at pages/user/meeting/room.vue:404", "解析会议信息出错:", error);
          this.getMeetingDetail();
        }
      } else {
        formatAppLog("log", "at pages/user/meeting/room.vue:410", "没有接收到会议信息，将通过API获取");
        this.getMeetingDetail();
      }
    },
    // 在mounted生命周期中初始化其他数据
    mounted() {
      return __async(this, null, function* () {
        try {
          if (this.meeting && (this.meeting.id || this.meeting.title !== "加载中...")) {
            formatAppLog("log", "at pages/user/meeting/room.vue:420", "会议信息已在onLoad中初始化，跳过mounted中的初始化");
            return;
          }
          if (this.meetingId) {
            formatAppLog("log", "at pages/user/meeting/room.vue:426", "使用ID初始化会议信息:", this.meetingId);
            this.meetingTitle = "会议详情";
            this.meeting = {
              id: this.meetingId,
              title: this.meetingTitle,
              status: "approved"
            };
            this.updateMeetingStatus();
            this.checkIsCreator();
            this.loadMeetingRelatedData();
          } else {
            formatAppLog("error", "at pages/user/meeting/room.vue:441", "会议ID不能为空");
            uni.showToast({
              title: "会议ID不能为空",
              icon: "none"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        } catch (err) {
          formatAppLog("error", "at pages/user/meeting/room.vue:452", "初始化会议失败:", err);
          uni.showToast({
            title: "初始化会议失败，请稍后重试",
            icon: "none"
          });
        }
      });
    },
    methods: {
      // 加载会议相关数据
      loadMeetingRelatedData() {
        Promise.all([
          this.loadAgendaItems(),
          this.loadFileItems(),
          this.loadRecordingItems()
        ]).then(() => {
          formatAppLog("log", "at pages/user/meeting/room.vue:469", "所有数据加载完成");
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/room.vue:472", "加载会议数据失败:", err);
        });
      },
      // 更新会议状态
      updateMeetingStatus() {
        if (!this.meeting)
          return;
        formatAppLog("log", "at pages/user/meeting/room.vue:480", "更新会议状态，原始状态:", this.meeting.status);
        formatAppLog("log", "at pages/user/meeting/room.vue:481", "会议日期:", this.meeting.reserveDate);
        formatAppLog("log", "at pages/user/meeting/room.vue:482", "会议开始时间:", this.meeting.startTime);
        formatAppLog("log", "at pages/user/meeting/room.vue:483", "会议结束时间:", this.meeting.endTime);
        let normalizedStatus = this.normalizeStatus(this.meeting.status);
        formatAppLog("log", "at pages/user/meeting/room.vue:487", "标准化后的状态:", normalizedStatus);
        const now = /* @__PURE__ */ new Date();
        formatAppLog("log", "at pages/user/meeting/room.vue:490", "当前时间:", now);
        let startDateTime = null;
        let endDateTime = null;
        if (this.meeting.reserveDate) {
          const reserveDate = this.meeting.reserveDate;
          if (this.meeting.startTime) {
            try {
              const [startHour, startMinute] = this.meeting.startTime.split(":").map(Number);
              startDateTime = new Date(reserveDate);
              startDateTime.setHours(startHour, startMinute, 0);
              formatAppLog("log", "at pages/user/meeting/room.vue:506", "计算后的会议开始时间:", startDateTime);
            } catch (e) {
              formatAppLog("error", "at pages/user/meeting/room.vue:508", "解析开始时间出错:", e);
            }
          }
          if (this.meeting.endTime) {
            try {
              const [endHour, endMinute] = this.meeting.endTime.split(":").map(Number);
              endDateTime = new Date(reserveDate);
              endDateTime.setHours(endHour, endMinute, 0);
              formatAppLog("log", "at pages/user/meeting/room.vue:518", "计算后的会议结束时间:", endDateTime);
            } catch (e) {
              formatAppLog("error", "at pages/user/meeting/room.vue:520", "解析结束时间出错:", e);
            }
          }
        } else {
          try {
            startDateTime = this.meeting.startTime ? new Date(this.meeting.startTime) : null;
          } catch (e) {
            formatAppLog("error", "at pages/user/meeting/room.vue:528", "解析开始时间出错:", e);
          }
          try {
            endDateTime = this.meeting.endTime ? new Date(this.meeting.endTime) : null;
          } catch (e) {
            formatAppLog("error", "at pages/user/meeting/room.vue:534", "解析结束时间出错:", e);
          }
        }
        if (normalizedStatus === "canceled" || normalizedStatus === "cancelled") {
          this.meetingStatusText = "已取消";
          this.meetingStatusClass = "status-canceled";
          this.isMeetingActive = false;
        } else if (normalizedStatus === "rejected") {
          this.meetingStatusText = "已拒绝";
          this.meetingStatusClass = "status-canceled";
          this.isMeetingActive = false;
        } else if (normalizedStatus === "completed") {
          this.meetingStatusText = "已结束";
          this.meetingStatusClass = "status-completed";
          this.isMeetingActive = false;
        } else if (normalizedStatus === "pending") {
          this.meetingStatusText = "待审批";
          this.meetingStatusClass = "status-pending";
          this.isMeetingActive = false;
        } else if (startDateTime && endDateTime) {
          if (now < startDateTime) {
            this.meetingStatusText = "未开始";
            this.meetingStatusClass = "status-pending";
            this.isMeetingActive = false;
          } else if (now > endDateTime) {
            this.meetingStatusText = "已结束";
            this.meetingStatusClass = "status-completed";
            this.isMeetingActive = false;
          } else {
            this.meetingStatusText = "进行中";
            this.meetingStatusClass = "status-in-progress";
            this.isMeetingActive = true;
          }
        } else if (startDateTime && !endDateTime) {
          if (now < startDateTime) {
            this.meetingStatusText = "未开始";
            this.meetingStatusClass = "status-pending";
            this.isMeetingActive = false;
          } else {
            this.meetingStatusText = "进行中";
            this.meetingStatusClass = "status-in-progress";
            this.isMeetingActive = true;
          }
        } else if (normalizedStatus === "approved" || normalizedStatus === "in-progress") {
          this.meetingStatusText = "进行中";
          this.meetingStatusClass = "status-in-progress";
          this.isMeetingActive = true;
        } else {
          this.meetingStatusText = "未开始";
          this.meetingStatusClass = "status-pending";
          this.isMeetingActive = false;
        }
        formatAppLog("log", "at pages/user/meeting/room.vue:593", "最终会议状态:", this.meetingStatusText, this.meetingStatusClass, "活动状态:", this.isMeetingActive);
      },
      // 标准化状态值
      normalizeStatus(status) {
        if (!status)
          return "pending";
        if (typeof status === "object" && status !== null) {
          status = status.status || status.value || "pending";
        }
        if (typeof status === "number" || /^\d+$/.test(status)) {
          const numStatus = parseInt(status);
          switch (numStatus) {
            case 0:
              return "pending";
            case 1:
              return "approved";
            case 2:
              return "in-progress";
            case 3:
              return "completed";
            case 4:
              return "cancelled";
            case 5:
              return "rejected";
            default:
              return "pending";
          }
        }
        if (typeof status === "string") {
          status = status.toLowerCase().trim();
          if (status === "待审核" || status === "待审批") {
            return "pending";
          } else if (status === "已通过" || status === "已审批" || status === "通过") {
            return "approved";
          } else if (status === "进行中") {
            return "in-progress";
          } else if (status === "已完成" || status === "完成") {
            return "completed";
          } else if (status === "已拒绝" || status === "拒绝") {
            return "rejected";
          } else if (status === "已取消" || status === "取消") {
            return "cancelled";
          }
          if (status === "canceled" || status === "cancelled") {
            return "cancelled";
          }
          if (status.includes("pend") || status.includes("wait")) {
            return "pending";
          } else if (status.includes("approv") || status.includes("accept")) {
            return "approved";
          } else if (status.includes("progress") || status.includes("ongoing") || status.includes("active")) {
            return "in-progress";
          } else if (status.includes("complet") || status.includes("finish") || status.includes("done") || status.includes("end")) {
            return "completed";
          } else if (status.includes("cancel")) {
            return "cancelled";
          } else if (status.includes("reject") || status.includes("deny") || status.includes("declin")) {
            return "rejected";
          }
        }
        return "pending";
      },
      // 检查当前用户是否是会议创建者
      checkIsCreator() {
        if (!this.meeting || !this.meeting.organizer) {
          this.isCreator = false;
          return;
        }
        this.isCreator = this.meeting.organizer.name === this.currentUser;
      },
      // 加载会议议题
      loadAgendaItems() {
        return getSubtopicsByReservationId(this.meetingId).then((res) => {
          if (res.code === 200 && res.data) {
            this.agendaItems = res.data.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              status: item.status || "pending",
              createTime: item.createTime || (/* @__PURE__ */ new Date()).toISOString()
            }));
          } else {
            this.agendaItems = [];
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/room.vue:689", "加载议题失败:", err);
          this.agendaItems = [];
        });
      },
      // 加载议题文件
      loadFileItems() {
        formatAppLog("log", "at pages/user/meeting/room.vue:696", "加载文件列表");
        if (arguments.length > 0 && arguments[0]) {
          const subId = arguments[0];
          formatAppLog("log", "at pages/user/meeting/room.vue:701", "加载议题文件, 议题ID:", subId);
          return getSubtopicFileList(subId).then((res) => {
            formatAppLog("log", "at pages/user/meeting/room.vue:704", "获取议题文件响应:", res);
            if (res.code === 200 && res.data) {
              const files = res.data.map((file) => ({
                id: file.id,
                name: file.fileName,
                url: file.fileUrl,
                createTime: file.createTime
              }));
              const agendaItem = this.agendaItems.find((item) => item.id === subId);
              if (agendaItem) {
                agendaItem.files = files;
                this.agendaItems = [...this.agendaItems];
              }
              return files;
            }
            return [];
          }).catch((err) => {
            formatAppLog("error", "at pages/user/meeting/room.vue:727", "加载议题文件失败:", err);
            return [];
          });
        }
        formatAppLog("log", "at pages/user/meeting/room.vue:733", "加载会议所有文件");
        this.fileItems = [];
        return Promise.resolve([]);
      },
      // 加载会议录音
      loadRecordingItems() {
        return getMeetingSummary(this.meetingId).then((res) => {
          if (res.code === 200 && res.data) {
            formatAppLog("log", "at pages/user/meeting/room.vue:743", "获取会议摘要成功:", res.data);
            if (Array.isArray(res.data)) {
              this.recordingItems = res.data.map((item) => this.formatRecordingItem(item));
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.recordingItems = res.data.list.map((item) => this.formatRecordingItem(item));
            } else if (res.data.summary) {
              this.recordingItems = [{
                id: res.data.id || Date.now().toString(),
                name: res.data.title || "会议摘要",
                summary: res.data.summary,
                createTime: res.data.createTime || (/* @__PURE__ */ new Date()).toISOString(),
                url: res.data.audioUrl || ""
              }];
            } else {
              this.recordingItems = [];
            }
          } else {
            this.recordingItems = [];
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/room.vue:767", "加载会议录音失败:", err);
          this.recordingItems = [];
        });
      },
      // 格式化录音项目数据
      formatRecordingItem(item) {
        return {
          id: item.id || Date.now().toString(),
          name: item.title || item.name || "会议录音",
          summary: item.summary || item.content || "",
          createTime: item.createTime || (/* @__PURE__ */ new Date()).toISOString(),
          url: item.audioUrl || item.url || "",
          duration: item.duration || ""
        };
      },
      // 确认结束会议
      confirmEndMeeting() {
        uni.showModal({
          title: "结束会议",
          content: "确定要结束会议吗？",
          success: (res) => {
            if (res.confirm) {
              this.endMeeting();
            }
          }
        });
      },
      // 结束会议
      endMeeting() {
        uni.showLoading({
          title: "处理中"
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "会议已结束",
            icon: "success"
          });
          this.meeting.status = "completed";
          this.updateMeetingStatus();
          this.addSystemMessage("会议已结束");
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1e3);
      },
      // 播放录音
      playRecording(recording) {
        uni.showToast({
          title: "播放录音: " + recording.name,
          icon: "none"
        });
      },
      // 下载录音
      downloadRecording(recording) {
        uni.showToast({
          title: "开始下载录音: " + recording.name,
          icon: "none"
        });
        uni.showLoading({
          title: "下载中"
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "下载完成",
            icon: "success"
          });
        }, 2e3);
      },
      // 切换录音状态
      toggleRecording() {
        if (this.isRecording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      },
      // 开始录音
      startRecording() {
        if (this.isRecording)
          return;
        this.isRecording = true;
        uni.showToast({
          title: "开始录音",
          icon: "none"
        });
      },
      // 停止录音
      stopRecording() {
        if (!this.isRecording)
          return;
        this.isRecording = false;
        uni.showToast({
          title: "录音已停止",
          icon: "success"
        });
      },
      // 显示上传文件模态框
      showUploadFileModal(agendaId) {
        formatAppLog("log", "at pages/user/meeting/room.vue:884", "显示上传文件模态框", agendaId);
        this.uploadForm = {
          fileName: "",
          fileType: "doc",
          filePath: "",
          selectedFileName: "",
          agendaId: agendaId || ""
        };
        this.showUploadFileModal = true;
      },
      // 选择文件
      chooseFile() {
        formatAppLog("log", "at pages/user/meeting/room.vue:897", "选择文件");
        uni.chooseImage({
          count: 1,
          success: (res) => {
            formatAppLog("log", "at pages/user/meeting/room.vue:924", "选择文件成功APP/MP:", res);
            const file = res.tempFiles[0] || {
              path: res.tempFilePaths[0],
              name: "文件" + (/* @__PURE__ */ new Date()).getTime()
            };
            this.uploadForm.selectedFileName = file.name || "已选择1个文件";
            this.uploadForm.filePath = file.path;
            this.uploadForm.fileName = file.name || "文件" + (/* @__PURE__ */ new Date()).getTime();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/user/meeting/room.vue:934", "选择文件失败APP/MP:", err);
            uni.showToast({
              title: "选择文件失败",
              icon: "none"
            });
          }
        });
      },
      // 重置上传表单
      resetUploadForm() {
        this.uploadForm = {
          fileName: "",
          fileType: "doc",
          filePath: "",
          selectedFileName: "",
          agendaId: ""
        };
      },
      // 上传文件处理
      handleFileUpload() {
        formatAppLog("log", "at pages/user/meeting/room.vue:957", "开始处理文件上传", this.uploadForm);
        if (!this.uploadForm.selectedFileName) {
          uni.showToast({
            title: "请选择文件",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "上传中..."
        });
        const fileData = {
          fileKey: Date.now().toString(),
          file: {
            name: this.uploadForm.fileName,
            path: this.uploadForm.filePath
          }
        };
        formatAppLog("log", "at pages/user/meeting/room.vue:979", "准备上传文件", fileData, "议题ID:", this.uploadForm.agendaId);
        if (this.uploadForm.agendaId) {
          uploadSubtopicFile(this.uploadForm.agendaId, fileData.fileKey, fileData.file).then((res) => {
            formatAppLog("log", "at pages/user/meeting/room.vue:985", "上传文件响应:", res);
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({
                title: "上传成功",
                icon: "success"
              });
              this.loadAgendaItems();
            } else {
              uni.showToast({
                title: res.msg || "上传失败",
                icon: "none"
              });
            }
          }).catch((err) => {
            formatAppLog("error", "at pages/user/meeting/room.vue:1001", "上传文件失败:", err);
            uni.hideLoading();
            uni.showToast({
              title: "上传失败，请稍后重试",
              icon: "none"
            });
          }).finally(() => {
            this.showUploadFileModal = false;
            this.resetUploadForm();
          });
        } else {
          uploadFile(fileData.file).then((res) => {
            formatAppLog("log", "at pages/user/meeting/room.vue:1016", "上传文件响应:", res);
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({
                title: "上传成功",
                icon: "success"
              });
              this.loadFileItems();
            } else {
              uni.showToast({
                title: res.msg || "上传失败",
                icon: "none"
              });
            }
          }).catch((err) => {
            formatAppLog("error", "at pages/user/meeting/room.vue:1032", "上传文件失败:", err);
            uni.hideLoading();
            uni.showToast({
              title: "上传失败，请稍后重试",
              icon: "none"
            });
          }).finally(() => {
            this.showUploadFileModal = false;
            this.resetUploadForm();
          });
        }
      },
      // 显示上传录音模态框
      showUploadRecordingModal() {
        formatAppLog("log", "at pages/user/meeting/room.vue:1048", "显示上传录音模态框");
        this.resetRecordingForm();
        this.uploadRecordingModal = true;
      },
      // 上传录音文件
      uploadRecordingFile() {
        formatAppLog("log", "at pages/user/meeting/room.vue:1055", "上传录音文件", this.recordingForm);
        if (!this.recordingForm.fileName) {
          uni.showToast({
            title: "请选择录音文件",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "上传中..."
        });
        const fileData = {
          url: Date.now().toString(),
          // 临时URL
          file: {
            name: this.recordingForm.fileName,
            path: this.recordingForm.filePath
          }
        };
        uploadAudioAndGenerateSummary(this.meetingId, fileData.url, fileData.file).then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({
              title: "上传成功",
              icon: "success"
            });
            this.loadRecordingItems();
          } else {
            uni.showToast({
              title: res.msg || "上传失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/user/meeting/room.vue:1095", "上传录音失败:", err);
          uni.hideLoading();
          uni.showToast({
            title: "上传失败，请稍后重试",
            icon: "none"
          });
        }).finally(() => {
          this.uploadRecordingModal = false;
          this.resetRecordingForm();
        });
      },
      // 删除录音
      deleteRecording(recordingId) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个录音吗？此操作不可撤销。",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "删除中..."
              });
              setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                this.recordingItems = this.recordingItems.filter((item) => item.id !== recordingId);
              }, 1e3);
            }
          }
        });
      },
      // 选择录音文件
      chooseRecordingFile() {
        plus.io.resolveLocalFileSystemURL("_www/", (entry) => {
          entry.getDirectory("_doc/", {
            create: true
          }, (dir) => {
            uni.chooseFile({
              count: 1,
              success: (res) => {
                const file = res.tempFiles[0] || {
                  path: res.tempFilePaths[0],
                  name: "录音" + (/* @__PURE__ */ new Date()).getTime() + ".mp3"
                };
                this.recordingForm.fileName = file.name || "录音.mp3";
                this.recordingForm.filePath = file.path;
                if (!this.recordingForm.name) {
                  this.recordingForm.name = (file.name || "录音").split(".")[0];
                }
              },
              fail: (err) => {
                formatAppLog("error", "at pages/user/meeting/room.vue:1174", "选择录音文件失败:", err);
                uni.showToast({
                  title: "选择录音文件失败",
                  icon: "none"
                });
              }
            });
          });
        });
      },
      // 重置录音表单
      resetRecordingForm() {
        this.recordingForm = {
          name: "",
          filePath: "",
          fileName: "",
          description: ""
        };
      },
      // 获取文件图标
      getFileIcon(type) {
        const typeMap = {
          "doc": "icon-doc",
          "docx": "icon-doc",
          "ppt": "icon-ppt",
          "pptx": "icon-ppt",
          "xls": "icon-xls",
          "xlsx": "icon-xls",
          "pdf": "icon-pdf",
          "img": "icon-img",
          "jpg": "icon-img",
          "png": "icon-img",
          "zip": "icon-zip"
        };
        return typeMap[type] || "icon-file";
      },
      // 格式化文件大小
      formatFileSize(size) {
        if (!size)
          return "未知大小";
        if (size < 1024) {
          return size + " B";
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + " KB";
        } else if (size < 1024 * 1024 * 1024) {
          return (size / 1024 / 1024).toFixed(1) + " MB";
        } else {
          return (size / 1024 / 1024 / 1024).toFixed(1) + " GB";
        }
      },
      // 确认删除议题
      confirmDeleteAgenda(agendaId) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个议题吗？此操作将同时删除相关的文件。",
          success: (res) => {
            if (res.confirm) {
              this.deleteAgendaItem(agendaId);
            }
          }
        });
      },
      // 删除议题
      deleteAgendaItem(agendaId) {
        uni.showLoading({
          title: "删除中..."
        });
        deleteSubtopic(agendaId).then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({
              title: "删除成功",
              icon: "success"
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || "删除失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          formatAppLog("error", "at pages/user/meeting/room.vue:1265", "删除议题失败:", err);
          uni.showToast({
            title: "删除失败，请稍后重试",
            icon: "none"
          });
        });
      },
      // 编辑议题
      editAgendaItem(item) {
        uni.showToast({
          title: "编辑功能即将上线",
          icon: "none"
        });
      },
      // 确认删除文件
      confirmDeleteFile(fileId) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个文件吗？此操作不可撤销。",
          success: (res) => {
            if (res.confirm) {
              this.deleteFile(fileId);
            }
          }
        });
      },
      // 删除文件
      deleteFile(fileId) {
        uni.showLoading({
          title: "删除中..."
        });
        deleteSubtopicFile(fileId).then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({
              title: "删除成功",
              icon: "success"
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || "删除失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          formatAppLog("error", "at pages/user/meeting/room.vue:1319", "删除文件失败:", err);
          uni.showToast({
            title: "删除失败，请稍后重试",
            icon: "none"
          });
        });
      },
      // 导航到首页
      navigateToHome() {
        uni.switchTab({
          url: "/pages/index/index"
        });
      },
      // 导航到会议列表
      navigateToMeetingList() {
        uni.navigateTo({
          url: "/pages/user/meeting/list"
        });
      },
      // 初始化数据
      initData() {
        formatAppLog("log", "at pages/user/meeting/room.vue:1343", "初始化会议室数据");
        this.meetingTitle = this.meeting.topic || this.meeting.title || "会议详情";
        this.checkIsCreator();
        this.loadMeetingRelatedData();
        if (this.isMeetingActive && this.meetingId) {
          this.connectChat();
        }
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    var _a2;
    return vue.openBlock(), vue.createElementBlock("div", { class: "room-wrapper" }, [
      vue.createCommentVNode(" 面包屑导航 "),
      vue.createElementVNode("div", { class: "breadcrumb" }, [
        vue.createElementVNode("span", {
          class: "breadcrumb-item",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToHome && $options.navigateToHome(...args))
        }, "首页"),
        vue.createElementVNode("span", { class: "breadcrumb-separator" }, ">"),
        vue.createElementVNode("span", {
          class: "breadcrumb-item",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToMeetingList && $options.navigateToMeetingList(...args))
        }, "我的会议"),
        vue.createElementVNode("span", { class: "breadcrumb-separator" }, ">"),
        vue.createElementVNode("span", { class: "breadcrumb-item active" }, "会议聊天室")
      ]),
      vue.createElementVNode("div", { class: "meeting-container" }, [
        vue.createCommentVNode(" 会议头部区域 "),
        vue.createElementVNode("div", { class: "meeting-header" }, [
          vue.createElementVNode("div", { class: "meeting-title" }, [
            vue.createElementVNode(
              "h2",
              null,
              vue.toDisplayString($data.meeting.title),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "span",
              {
                class: vue.normalizeClass(["meeting-status", $data.meetingStatusClass])
              },
              vue.toDisplayString($data.meetingStatusText),
              3
              /* TEXT, CLASS */
            )
          ]),
          vue.createElementVNode("div", { class: "meeting-info" }, [
            vue.createElementVNode("div", { class: "info-row" }, [
              vue.createElementVNode("span", { class: "info-label" }, "时间:"),
              vue.createElementVNode(
                "span",
                { class: "meeting-time" },
                vue.toDisplayString($data.meeting.startTime) + " ~ " + vue.toDisplayString($data.meeting.endTime || "进行中"),
                1
                /* TEXT */
              )
            ]),
            $data.meeting.location ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "info-row"
            }, [
              vue.createElementVNode("span", { class: "info-label" }, "地点:"),
              vue.createElementVNode(
                "span",
                { class: "meeting-location" },
                vue.toDisplayString($data.meeting.location),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $data.meeting.booker || $data.meeting.organizer ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: "info-row"
            }, [
              vue.createElementVNode("span", { class: "info-label" }, "召集人:"),
              vue.createElementVNode(
                "span",
                { class: "meeting-organizer" },
                vue.toDisplayString(((_a2 = $data.meeting.organizer) == null ? void 0 : _a2.name) || $data.meeting.booker || "未知"),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $data.meeting.department ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 2,
              class: "info-row"
            }, [
              vue.createElementVNode("span", { class: "info-label" }, "部门:"),
              vue.createElementVNode(
                "span",
                { class: "meeting-department" },
                vue.toDisplayString($data.meeting.department),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $data.meeting.type ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 3,
              class: "info-row"
            }, [
              vue.createElementVNode("span", { class: "info-label" }, "类型:"),
              vue.createElementVNode(
                "span",
                { class: "meeting-type" },
                vue.toDisplayString($data.meeting.type),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $data.meeting.description ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 4,
              class: "info-row"
            }, [
              vue.createElementVNode("span", { class: "info-label" }, "描述:"),
              vue.createElementVNode(
                "span",
                { class: "meeting-description" },
                vue.toDisplayString($data.meeting.description),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $data.meeting.participants && $data.meeting.participants.length ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 5,
              class: "info-row"
            }, [
              vue.createElementVNode("span", { class: "info-label" }, "参会人员:"),
              vue.createElementVNode("div", { class: "meeting-participants" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.meeting.participants, (participant, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "span",
                      {
                        key: participant.id || index,
                        class: "participant-item"
                      },
                      vue.toDisplayString(participant.name || participant.username) + vue.toDisplayString(index < $data.meeting.participants.length - 1 ? "，" : ""),
                      1
                      /* TEXT */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 会议操作按钮区域 "),
          $data.isCreator && $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "meeting-actions"
          }, [
            vue.createElementVNode("button", {
              onClick: _cache[2] || (_cache[2] = (...args) => $options.confirmEndMeeting && $options.confirmEndMeeting(...args)),
              class: "end-meeting-btn"
            }, "结束会议")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 会议状态提示 "),
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["meeting-status-notice", `status-notice-${$data.meetingStatusClass.replace("status-", "")}`])
            },
            [
              vue.createElementVNode(
                "p",
                null,
                "会议状态：" + vue.toDisplayString($data.meetingStatusText),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ]),
        vue.createCommentVNode(" 会议内容区域 "),
        vue.createElementVNode("div", { class: "meeting-content" }, [
          vue.createElementVNode("div", { class: "tabs-container" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.tabs, (tab) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: tab.id,
                  class: vue.normalizeClass(["tab-item", { active: $data.currentTab === tab.id }]),
                  onClick: ($event) => $data.currentTab = tab.id
                }, vue.toDisplayString(tab.name), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("div", { class: "tab-content" }, [
            vue.createCommentVNode(" 议题面板 "),
            $data.currentTab === "agenda" ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "meeting-panel"
            }, [
              vue.createElementVNode("div", { class: "panel-header" }, [
                vue.createElementVNode("h3", null, "会议议题"),
                $data.isCreator && $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.showAddAgendaModal = true),
                  class: "add-btn"
                }, "添加议题")) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("div", { class: "agenda-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.agendaItems, (item) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: item.id,
                      class: "agenda-item"
                    }, [
                      vue.createElementVNode("div", { class: "agenda-header" }, [
                        vue.createElementVNode(
                          "h4",
                          null,
                          vue.toDisplayString(item.title),
                          1
                          /* TEXT */
                        ),
                        $data.isCreator && $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("div", {
                          key: 0,
                          class: "agenda-actions"
                        }, [
                          vue.createElementVNode("button", {
                            onClick: ($event) => $options.editAgendaItem(item),
                            class: "edit-btn"
                          }, "编辑", 8, ["onClick"]),
                          vue.createElementVNode("button", {
                            onClick: ($event) => $options.confirmDeleteAgenda(item.id),
                            class: "delete-btn"
                          }, "删除", 8, ["onClick"])
                        ])) : vue.createCommentVNode("v-if", true)
                      ]),
                      vue.createElementVNode("div", { class: "agenda-info" }, [
                        vue.createElementVNode(
                          "p",
                          null,
                          vue.toDisplayString(item.description),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("div", { class: "agenda-details" }, [
                          vue.createElementVNode(
                            "span",
                            null,
                            "创建时间: " + vue.toDisplayString(item.createTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createCommentVNode(" 议题文件列表 "),
                      item.files && item.files.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 0,
                        class: "agenda-files"
                      }, [
                        vue.createElementVNode("h5", null, "相关文件"),
                        vue.createElementVNode("div", { class: "file-list" }, [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(item.files, (file) => {
                              return vue.openBlock(), vue.createElementBlock("div", {
                                key: file.id,
                                class: "file-item"
                              }, [
                                vue.createElementVNode("div", { class: "file-info" }, [
                                  vue.createElementVNode(
                                    "div",
                                    { class: "file-name" },
                                    vue.toDisplayString(file.name),
                                    1
                                    /* TEXT */
                                  ),
                                  vue.createElementVNode("div", { class: "file-meta" }, [
                                    vue.createElementVNode(
                                      "span",
                                      null,
                                      "上传时间: " + vue.toDisplayString(file.createTime),
                                      1
                                      /* TEXT */
                                    )
                                  ])
                                ]),
                                vue.createElementVNode("div", { class: "file-actions" }, [
                                  vue.createElementVNode("a", {
                                    href: file.url,
                                    target: "_blank",
                                    class: "download-btn"
                                  }, "下载", 8, ["href"]),
                                  $data.isCreator && $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("button", {
                                    key: 0,
                                    onClick: ($event) => $options.confirmDeleteFile(file.id),
                                    class: "delete-btn"
                                  }, "删除", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                                ])
                              ]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])
                      ])) : vue.createCommentVNode("v-if", true),
                      vue.createCommentVNode(" 上传文件按钮 "),
                      $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 1,
                        class: "upload-file"
                      }, [
                        vue.createElementVNode("button", {
                          onClick: ($event) => $options.showUploadFileModal(item.id),
                          class: "upload-btn"
                        }, " 上传文件 ", 8, ["onClick"])
                      ])) : vue.createCommentVNode("v-if", true)
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $data.agendaItems.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "empty-notice"
                }, [
                  vue.createElementVNode("p", null, "暂无议题")
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 文件面板 "),
            $data.currentTab === "file" ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: "meeting-panel"
            }, [
              vue.createElementVNode("div", { class: "panel-header" }, [
                vue.createElementVNode("h3", null, "会议文件"),
                $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.showUploadFileModal = true),
                  class: "add-btn"
                }, "上传文件")) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("div", { class: "file-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.fileItems, (file) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: file.id,
                      class: "file-item"
                    }, [
                      vue.createElementVNode("div", { class: "file-icon" }, [
                        vue.createElementVNode(
                          "i",
                          {
                            class: vue.normalizeClass($options.getFileIcon(file.type))
                          },
                          null,
                          2
                          /* CLASS */
                        )
                      ]),
                      vue.createElementVNode("div", { class: "file-info" }, [
                        vue.createElementVNode(
                          "div",
                          { class: "file-name" },
                          vue.toDisplayString(file.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("div", { class: "file-meta" }, [
                          vue.createElementVNode(
                            "span",
                            null,
                            vue.toDisplayString($options.formatFileSize(file.size)),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "span",
                            null,
                            "上传时间: " + vue.toDisplayString(file.uploadTime),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "span",
                            null,
                            "上传者: " + vue.toDisplayString(file.uploader),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("div", { class: "file-actions" }, [
                        vue.createElementVNode("button", {
                          onClick: ($event) => _ctx.downloadFile(file)
                        }, "下载", 8, ["onClick"]),
                        $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("button", {
                          key: 0,
                          onClick: ($event) => $options.confirmDeleteFile(file.id),
                          class: "delete-btn"
                        }, "删除", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $data.fileItems.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "empty-notice"
                }, [
                  vue.createElementVNode("p", null, "暂无文件")
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 录音面板 "),
            $data.currentTab === "recording" ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 2,
              class: "meeting-panel"
            }, [
              vue.createElementVNode("div", { class: "panel-header" }, [
                vue.createElementVNode("h3", null, "会议录音与摘要"),
                vue.createElementVNode("div", { class: "recording-actions" }, [
                  $data.isMeetingActive ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 0,
                    onClick: _cache[5] || (_cache[5] = (...args) => $options.showUploadRecordingModal && $options.showUploadRecordingModal(...args)),
                    class: "upload-btn"
                  }, " 上传录音 ")) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              vue.createElementVNode("div", { class: "recording-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.recordingItems, (recording) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: recording.id,
                      class: "recording-item"
                    }, [
                      vue.createElementVNode("div", { class: "recording-info" }, [
                        vue.createElementVNode(
                          "div",
                          { class: "recording-name" },
                          vue.toDisplayString(recording.name || recording.title || "会议录音"),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("div", { class: "recording-meta" }, [
                          vue.createElementVNode(
                            "span",
                            null,
                            "创建时间: " + vue.toDisplayString(recording.createTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("div", { class: "recording-actions" }, [
                        vue.createElementVNode("a", {
                          href: recording.url,
                          target: "_blank",
                          class: "download-btn"
                        }, "下载", 8, ["href"])
                      ]),
                      vue.createCommentVNode(" 添加摘要显示 "),
                      recording.summary ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 0,
                        class: "recording-summary"
                      }, [
                        vue.createElementVNode("h5", null, "会议摘要"),
                        vue.createElementVNode(
                          "div",
                          { class: "summary-content" },
                          vue.toDisplayString(recording.summary),
                          1
                          /* TEXT */
                        )
                      ])) : vue.createCommentVNode("v-if", true)
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $data.recordingItems.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "empty-notice"
                }, [
                  vue.createElementVNode("p", null, "暂无录音")
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ]),
      vue.createCommentVNode(" 上传文件模态框 "),
      $options.showUploadFileModal ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "modal-mask"
      }, [
        vue.createElementVNode("div", { class: "modal-container" }, [
          vue.createElementVNode("div", { class: "modal-header" }, [
            vue.createElementVNode("h3", null, "上传文件"),
            vue.createElementVNode("button", {
              onClick: _cache[6] || (_cache[6] = ($event) => $options.showUploadFileModal = false),
              class: "close-btn"
            }, "×")
          ]),
          vue.createElementVNode("div", { class: "modal-body" }, [
            vue.createElementVNode("div", { class: "form-item" }, [
              vue.createElementVNode("label", null, "文件类型"),
              vue.withDirectives(vue.createElementVNode(
                "select",
                {
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.uploadForm.fileType = $event)
                },
                [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.uploadFileOptions, (option) => {
                      return vue.openBlock(), vue.createElementBlock("option", {
                        key: option.value,
                        value: option.value
                      }, vue.toDisplayString(option.label), 9, ["value"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelSelect, $data.uploadForm.fileType]
              ])
            ]),
            vue.createElementVNode("div", { class: "form-item" }, [
              vue.createElementVNode("label", null, "文件名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.uploadForm.fileName = $event),
                  placeholder: "请输入文件名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.uploadForm.fileName]
              ])
            ]),
            vue.createElementVNode("div", { class: "form-item" }, [
              vue.createElementVNode("label", null, "选择文件"),
              vue.createElementVNode("div", { class: "file-select" }, [
                vue.createElementVNode("button", {
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.chooseFile && $options.chooseFile(...args)),
                  class: "select-file-btn"
                }, "选择文件"),
                vue.createElementVNode(
                  "span",
                  { class: "selected-file" },
                  vue.toDisplayString($data.uploadForm.selectedFileName || "未选择文件"),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("div", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              onClick: _cache[10] || (_cache[10] = ($event) => $options.showUploadFileModal = false),
              class: "cancel-btn"
            }, "取消"),
            vue.createElementVNode("button", {
              onClick: _cache[11] || (_cache[11] = (...args) => $options.handleFileUpload && $options.handleFileUpload(...args)),
              class: "confirm-btn"
            }, "上传")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 上传录音模态框 "),
      $data.uploadRecordingModal ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "modal-mask"
      }, [
        vue.createElementVNode("div", { class: "modal-container" }, [
          vue.createElementVNode("div", { class: "modal-header" }, [
            vue.createElementVNode("h3", null, "上传录音"),
            vue.createElementVNode("button", {
              onClick: _cache[12] || (_cache[12] = ($event) => $data.uploadRecordingModal = false),
              class: "close-btn"
            }, "×")
          ]),
          vue.createElementVNode("div", { class: "modal-body" }, [
            vue.createElementVNode("div", { class: "form-item" }, [
              vue.createElementVNode("label", null, "录音名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.recordingForm.name = $event),
                  placeholder: "请输入录音名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.recordingForm.name]
              ])
            ]),
            vue.createElementVNode("div", { class: "form-item" }, [
              vue.createElementVNode("label", null, "录音描述"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.recordingForm.description = $event),
                  placeholder: "请输入录音描述"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.recordingForm.description]
              ])
            ]),
            vue.createElementVNode("div", { class: "form-item" }, [
              vue.createElementVNode("label", null, "选择录音文件"),
              vue.createElementVNode("div", { class: "file-select" }, [
                vue.createElementVNode("button", {
                  onClick: _cache[15] || (_cache[15] = (...args) => $options.chooseRecordingFile && $options.chooseRecordingFile(...args)),
                  class: "select-file-btn"
                }, "选择文件"),
                vue.createElementVNode(
                  "span",
                  { class: "selected-file" },
                  vue.toDisplayString($data.recordingForm.fileName || "未选择文件"),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("div", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              onClick: _cache[16] || (_cache[16] = ($event) => $data.uploadRecordingModal = false),
              class: "cancel-btn"
            }, "取消"),
            vue.createElementVNode("button", {
              onClick: _cache[17] || (_cache[17] = (...args) => $options.uploadRecordingFile && $options.uploadRecordingFile(...args)),
              class: "confirm-btn"
            }, "上传")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUserMeetingRoom = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/user/meeting/room.vue"]]);
  const _sfc_main$f = {
    data() {
      return {
        username: "",
        password: "",
        rememberMe: false,
        showPassword: false,
        isSubmitting: false,
        loading: false
      };
    },
    created() {
      const savedUsername = localStorage.getItem("adminUsername");
      const savedRememberMe = localStorage.getItem("adminRememberMe") === "true";
      if (savedUsername && savedRememberMe) {
        this.username = savedUsername;
        this.rememberMe = true;
      }
    },
    mounted() {
      formatAppLog("log", "at pages/admin/login.vue:103", "检测到移动端平台访问管理员页面，将重定向到用户登录");
      setTimeout(() => {
        uni.reLaunch({
          url: "/pages/user/login"
        });
      }, 100);
      this.handleKeyDown = (e) => {
        if (e.key === "Enter") {
          this.handleLogin();
        }
      };
      document.addEventListener("keydown", this.handleKeyDown);
    },
    methods: {
      handleLogin() {
        if (!this.username) {
          this.showToast("请输入用户名");
          return;
        }
        if (!this.password) {
          this.showToast("请输入密码");
          return;
        }
        if (this.isSubmitting) {
          return;
        }
        this.isSubmitting = true;
        uni.showLoading({
          title: "登录中..."
        });
        api.user.login({
          username: this.username,
          password: this.password,
          role: "admin"
        }).then((res) => {
          var _a2;
          uni.hideLoading();
          if (res.code === 200 && res.data) {
            const userData = res.data;
            const isActive = ((_a2 = userData.user) == null ? void 0 : _a2.isActive) || userData.isActive;
            if (isActive === 0) {
              this.isSubmitting = false;
              this.showToast("您的账号已被禁用，请联系超级管理员", "none", 3e3);
              return;
            }
            uni.setStorageSync("token", res.data.token);
            uni.setStorageSync("userInfo", res.data.userInfo || {
              id: res.data.id,
              username: res.data.username,
              name: res.data.name,
              role: "admin"
            });
            if (this.rememberMe) {
              localStorage.setItem("adminUsername", this.username);
              localStorage.setItem("adminRememberMe", "true");
            } else {
              localStorage.removeItem("adminUsername");
              localStorage.removeItem("adminRememberMe");
            }
            this.showToast("登录成功", "success");
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/admin/home"
              });
            }, 1e3);
          } else {
            this.isSubmitting = false;
            this.showToast(res.message || "用户名或密码错误");
          }
        }).catch((err) => {
          uni.hideLoading();
          this.isSubmitting = false;
          this.showToast("登录失败，请稍后重试");
        });
      },
      showToast(title, icon = "none", duration = 2e3) {
        uni.showToast({
          title,
          icon,
          duration
        });
      },
      handleRememberMe() {
        this.rememberMe = !this.rememberMe;
      },
      quickLogin() {
        this.username = "testJJ01";
        this.password = "testJJ01";
        this.handleLogin();
      }
    },
    beforeDestroy() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "login-container" }, [
      vue.createElementVNode("div", { class: "login-card" }, [
        vue.createElementVNode("div", { class: "login-header" }, [
          vue.createElementVNode("div", { class: "login-logo" }, [
            vue.createElementVNode("img", {
              src: _imports_0$2,
              alt: "Logo"
            })
          ]),
          vue.createElementVNode("div", { class: "login-title" }, [
            vue.createElementVNode("h1", null, "会议室预约系统"),
            vue.createElementVNode("p", null, "管理员登录")
          ])
        ]),
        vue.createElementVNode("div", { class: "login-form" }, [
          vue.createElementVNode("div", { class: "input-group" }, [
            vue.createElementVNode("div", { class: "input-icon" }, [
              vue.createElementVNode("text", { class: "iconfont icon-user" })
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                class: "input-field",
                placeholder: "用户名",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
                onKeyup: _cache[1] || (_cache[1] = vue.withKeys((...args) => $options.handleLogin && $options.handleLogin(...args), ["enter"]))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.username]
            ])
          ]),
          vue.createElementVNode("div", { class: "input-group" }, [
            vue.createElementVNode("div", { class: "input-icon" }, [
              vue.createElementVNode("text", { class: "iconfont icon-password" })
            ]),
            vue.withDirectives(vue.createElementVNode("input", {
              type: $data.showPassword ? "text" : "password",
              class: "input-field",
              placeholder: "密码",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.password = $event),
              onKeyup: _cache[3] || (_cache[3] = vue.withKeys((...args) => $options.handleLogin && $options.handleLogin(...args), ["enter"]))
            }, null, 40, ["type"]), [
              [vue.vModelDynamic, $data.password]
            ]),
            vue.createElementVNode("div", {
              class: "password-toggle",
              onClick: _cache[4] || (_cache[4] = ($event) => $data.showPassword = !$data.showPassword)
            }, [
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["iconfont", $data.showPassword ? "icon-view" : "icon-close"])
                },
                null,
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("div", { class: "login-options" }, [
            vue.createElementVNode("label", { class: "remember-me" }, [
              vue.createElementVNode("input", {
                type: "checkbox",
                checked: $data.rememberMe,
                onClick: _cache[5] || (_cache[5] = (...args) => $options.handleRememberMe && $options.handleRememberMe(...args))
              }, null, 8, ["checked"]),
              vue.createElementVNode("span", null, "记住我")
            ]),
            vue.createElementVNode("a", {
              href: "#",
              class: "forgot-password"
            }, "忘记密码?")
          ]),
          vue.createElementVNode("button", {
            class: "login-button",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.handleLogin && $options.handleLogin(...args)),
            disabled: $data.loading
          }, vue.toDisplayString($data.loading ? "登录中..." : "登录"), 9, ["disabled"]),
          vue.createElementVNode("div", { class: "quick-login-section" }, [
            vue.createElementVNode("div", { class: "divider" }, [
              vue.createElementVNode("span", null, "或")
            ]),
            vue.createElementVNode("button", {
              class: "quick-login-button",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.quickLogin && $options.quickLogin(...args)),
              disabled: $data.loading
            }, " 一键登录 ", 8, ["disabled"])
          ])
        ])
      ]),
      vue.createElementVNode("div", { class: "login-footer" }, [
        vue.createElementVNode("p", null, "© 2023 会议室预约系统 - 版权所有")
      ]),
      $data.loading ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "login-overlay"
      }, [
        vue.createElementVNode("div", { class: "login-spinner" })
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminLogin = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__scopeId", "data-v-3190821f"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/login.vue"]]);
  const logPagePath = (options = {}) => {
    const { path, title, type = "onShow", query = {} } = options;
    let currentPages = [];
    try {
      currentPages = getCurrentPages() || [];
    } catch (e) {
      formatAppLog("error", "at utils/page-logger.js:33", "获取页面栈失败:", e);
      try {
        const href = window.location.href;
        const pathname = window.location.pathname;
        formatAppLog("log", "at utils/page-logger.js:38", "[页面] 从location获取路径:", pathname);
        formatAppLog("log", "at utils/page-logger.js:39", "[页面] 完整URL:", href);
        return {
          path: pathname || "未知页面",
          query,
          title: title || "未知标题",
          pageStack: []
        };
      } catch (err) {
        formatAppLog("error", "at utils/page-logger.js:48", "获取location失败:", err);
      }
    }
    const currentPath = path || (currentPages.length > 0 ? currentPages[currentPages.length - 1].route : "未知页面");
    let pageTitle = "";
    if (query && Object.keys(query).length > 0) {
      "?" + Object.entries(query).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
    }
    if (title) {
      pageTitle = title;
    } else if (currentPages.length > 0 && currentPages[currentPages.length - 1].$page) {
      pageTitle = currentPages[currentPages.length - 1].$page.fullPath || "无标题";
    }
    if (config && config.debug && config.debug.enabled && config.debug.showPageLog)
      ;
    if (currentPages.length > 0 && config && config.debug && config.debug.enabled && config.debug.showPageStack) {
      currentPages.map((page, index) => {
        return `${index}: ${page.route || "未知"}`;
      }).join(" -> ");
    }
    return {
      path: currentPath,
      query,
      title: pageTitle,
      pageStack: currentPages.map((page) => page.route)
    };
  };
  const logCurrentUrl = () => {
    try {
      if (typeof window !== "undefined" && window.location) {
        const url = window.location.href;
        const path = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;
        return { url, path, search, hash };
      }
    } catch (e) {
      formatAppLog("error", "at utils/page-logger.js:122", "获取URL信息失败:", e);
    }
    return null;
  };
  const pageLoggerMixin = {
    onLoad(query) {
      logPagePath({
        query,
        type: "onLoad"
      });
    },
    onShow() {
      logPagePath({
        type: "onShow"
      });
    },
    onHide() {
      logPagePath({
        type: "onHide"
      });
    },
    onUnload() {
      logPagePath({
        type: "onUnload"
      });
    }
  };
  const debugPageState = () => {
    formatAppLog("log", "at utils/helper.js:29", "%c[页面状态调试]", "color: #ff6b81; font-weight: bold; font-size: 14px;");
    const urlInfo = logCurrentUrl();
    const pageInfo = logPagePath({
      title: "状态调试",
      type: "debug"
    });
    try {
      const token = uni.getStorageSync("token");
      const adminToken = uni.getStorageSync("adminToken");
      const userInfo = uni.getStorageSync("userInfo");
      const adminInfo = uni.getStorageSync("adminInfo");
      formatAppLog("log", "at utils/helper.js:47", "[存储信息]");
      formatAppLog("log", "at utils/helper.js:48", "token:", token || "未设置");
      formatAppLog("log", "at utils/helper.js:49", "adminToken:", adminToken || "未设置");
      formatAppLog("log", "at utils/helper.js:50", "userInfo:", userInfo || "未设置");
      formatAppLog("log", "at utils/helper.js:51", "adminInfo:", adminInfo || "未设置");
    } catch (e) {
      formatAppLog("error", "at utils/helper.js:53", "读取存储信息失败:", e);
    }
    try {
      const systemInfo = uni.getSystemInfoSync();
      formatAppLog("log", "at utils/helper.js:59", "[系统信息]", systemInfo);
    } catch (e) {
      formatAppLog("error", "at utils/helper.js:61", "获取系统信息失败:", e);
    }
    return {
      urlInfo,
      pageInfo
    };
  };
  const safeNavigateTo = (url, useRedirect = false) => {
    const existingPages = [
      "/pages/admin/home",
      "/pages/admin/meeting/list",
      "/pages/admin/meeting/detail",
      "/pages/admin/room/list",
      "/pages/admin/room/edit",
      "/pages/admin/user/list",
      "/pages/admin/user/edit",
      "/pages/admin/statistics/index",
      "/pages/admin/rpa/index",
      "/pages/admin/notification/index",
      "/pages/admin/login",
      "/pages/user/login",
      "/pages/user/schedule"
    ];
    const upcomingPages = {
      "/pages/admin/meeting/calendar": "会议日历",
      "/pages/admin/meeting/approval": "会议审批",
      "/pages/admin/room/reservation": "会议室预约管理",
      "/pages/admin/user/add": "添加用户",
      "/pages/admin/settings/index": "系统设置",
      "/pages/admin/profile": "管理员个人信息"
    };
    if (!existingPages.some((page) => url.startsWith(page))) {
      let pageName = "此功能";
      for (const [path, name] of Object.entries(upcomingPages)) {
        if (url.startsWith(path)) {
          pageName = name;
          break;
        }
      }
      return new Promise((resolve, reject) => {
        uni.showToast({
          title: `${pageName}正在开发中`,
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          resolve({ cancelled: true });
        }, 2e3);
      });
    }
    return new Promise((resolve, reject) => {
      const navMethod = useRedirect ? uni.redirectTo : uni.navigateTo;
      navMethod({
        url,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          formatAppLog("error", "at utils/helper.js:213", "导航错误:", err);
          uni.showToast({
            title: "页面跳转失败",
            icon: "none",
            duration: 2e3
          });
          reject(err);
        }
      });
    });
  };
  const _sfc_main$e = {
    name: "AdminSidebar",
    props: {
      // 当前激活的路径
      activePath: {
        type: String,
        default: ""
      },
      // 是否折叠
      isCollapsed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 由于props来指定折叠状态，不再需要本地状态
        submenuVisible: {
          meeting: true,
          room: false
        }
      };
    },
    methods: {
      navigateTo(url) {
        if (this.activePath === url) {
          return;
        }
        const pages = getCurrentPages();
        const useRedirect = pages && pages.length > 1;
        safeNavigateTo(url, useRedirect).catch((err) => {
          formatAppLog("error", "at components/admin/AdminSidebar.vue:143", "导航错误:", err);
        });
      },
      toggleCollapse() {
        this.$emit("update:isCollapsed", !this.isCollapsed);
        try {
          uni.setStorageSync("adminSidebarCollapsed", !this.isCollapsed);
        } catch (e) {
          formatAppLog("error", "at components/admin/AdminSidebar.vue:155", "存储侧边栏状态失败", e);
        }
      },
      toggleSubmenu(key) {
        if (!this.isCollapsed) {
          this.submenuVisible[key] = !this.submenuVisible[key];
        } else if (key === "meeting") {
          this.navigateTo("/pages/admin/meeting/list");
        } else if (key === "room") {
          this.navigateTo("/pages/admin/room/list");
        }
      }
    },
    mounted() {
      if (this.activePath.includes("/pages/admin/meeting")) {
        this.submenuVisible.meeting = true;
      } else if (this.activePath.includes("/pages/admin/room")) {
        this.submenuVisible.room = true;
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "div",
      {
        class: vue.normalizeClass(["admin-sidebar", { "sidebar-collapsed": $props.isCollapsed }])
      },
      [
        vue.createElementVNode("div", { class: "sidebar-header" }, [
          vue.createElementVNode("div", {
            class: "logo-container",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.navigateTo("/pages/admin/home"))
          }, [
            vue.createElementVNode("div", { class: "logo" }, [
              vue.createElementVNode("img", {
                src: _imports_0$2,
                alt: "Logo"
              })
            ]),
            !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "system-name"
            }, "会议系统")) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("div", {
            class: "collapse-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleCollapse && $options.toggleCollapse(...args))
          }, [
            vue.createElementVNode(
              "span",
              {
                class: vue.normalizeClass(["iconfont", $props.isCollapsed ? "icon-menu-unfold" : "icon-menu-fold"])
              },
              null,
              2
              /* CLASS */
            )
          ])
        ]),
        vue.createElementVNode("div", { class: "sidebar-menu" }, [
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["menu-item", { active: $props.activePath === "/pages/admin/home" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.navigateTo("/pages/admin/home"))
            },
            [
              vue.createElementVNode("span", { class: "iconfont icon-home" }),
              !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "menu-text"
              }, "控制台")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("div", { class: "menu-group" }, [
            vue.createElementVNode(
              "div",
              {
                class: vue.normalizeClass(["menu-group-title", { "collapsed": !$data.submenuVisible.meeting }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $options.toggleSubmenu("meeting"))
              },
              [
                vue.createElementVNode("div", { class: "menu-group-header" }, [
                  vue.createElementVNode("span", { class: "iconfont icon-meeting" }),
                  !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: "menu-text"
                  }, "会议管理")) : vue.createCommentVNode("v-if", true)
                ]),
                !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: "iconfont icon-arrow-down submenu-arrow"
                })) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            ),
            $data.submenuVisible.meeting && !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "submenu"
            }, [
              vue.createElementVNode(
                "div",
                {
                  class: vue.normalizeClass(["submenu-item", { active: $props.activePath === "/pages/admin/meeting/list" }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.navigateTo("/pages/admin/meeting/list"))
                },
                [
                  vue.createElementVNode("span", { class: "submenu-dot" }),
                  vue.createElementVNode("span", null, "会议列表")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "div",
                {
                  class: vue.normalizeClass(["submenu-item", { active: $props.activePath === "/pages/admin/meeting/calendar" }]),
                  onClick: _cache[5] || (_cache[5] = ($event) => $options.navigateTo("/pages/admin/meeting/calendar"))
                },
                [
                  vue.createElementVNode("span", { class: "submenu-dot" }),
                  vue.createElementVNode("span", null, "会议日历")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "div",
                {
                  class: vue.normalizeClass(["submenu-item", { active: $props.activePath === "/pages/admin/meeting/approval" }]),
                  onClick: _cache[6] || (_cache[6] = ($event) => $options.navigateTo("/pages/admin/meeting/approval"))
                },
                [
                  vue.createElementVNode("span", { class: "submenu-dot" }),
                  vue.createElementVNode("span", null, "会议审批")
                ],
                2
                /* CLASS */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("div", { class: "menu-group" }, [
            vue.createElementVNode(
              "div",
              {
                class: vue.normalizeClass(["menu-group-title", { "collapsed": !$data.submenuVisible.room }]),
                onClick: _cache[7] || (_cache[7] = ($event) => $options.toggleSubmenu("room"))
              },
              [
                vue.createElementVNode("div", { class: "menu-group-header" }, [
                  vue.createElementVNode("span", { class: "iconfont icon-room" }),
                  !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: "menu-text"
                  }, "会议室管理")) : vue.createCommentVNode("v-if", true)
                ]),
                !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: "iconfont icon-arrow-down submenu-arrow"
                })) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            ),
            $data.submenuVisible.room && !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "submenu"
            }, [
              vue.createElementVNode(
                "div",
                {
                  class: vue.normalizeClass(["submenu-item", { active: $props.activePath === "/pages/admin/room/list" }]),
                  onClick: _cache[8] || (_cache[8] = ($event) => $options.navigateTo("/pages/admin/room/list"))
                },
                [
                  vue.createElementVNode("span", { class: "submenu-dot" }),
                  vue.createElementVNode("span", null, "会议室列表")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "div",
                {
                  class: vue.normalizeClass(["submenu-item", { active: $props.activePath === "/pages/admin/room/reservation" }]),
                  onClick: _cache[9] || (_cache[9] = ($event) => $options.navigateTo("/pages/admin/room/reservation"))
                },
                [
                  vue.createElementVNode("span", { class: "submenu-dot" }),
                  vue.createElementVNode("span", null, "预约管理")
                ],
                2
                /* CLASS */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["menu-item", { active: $props.activePath.includes("/pages/admin/user") }]),
              onClick: _cache[10] || (_cache[10] = ($event) => $options.navigateTo("/pages/admin/user/list"))
            },
            [
              vue.createElementVNode("span", { class: "iconfont icon-user" }),
              !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "menu-text"
              }, "用户管理")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["menu-item", { active: $props.activePath.includes("/pages/admin/statistics") }]),
              onClick: _cache[11] || (_cache[11] = ($event) => $options.navigateTo("/pages/admin/statistics/index"))
            },
            [
              vue.createElementVNode("span", { class: "iconfont icon-chart" }),
              !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "menu-text"
              }, "数据报表")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["menu-item", { active: $props.activePath.includes("/pages/admin/rpa") }]),
              onClick: _cache[12] || (_cache[12] = ($event) => $options.navigateTo("/pages/admin/rpa/index"))
            },
            [
              vue.createElementVNode("span", { class: "iconfont icon-rpa" }),
              !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "menu-text"
              }, "RPA管理")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("div", { class: "menu-divider" }),
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["menu-item", { active: $props.activePath.includes("/pages/admin/settings") }]),
              onClick: _cache[13] || (_cache[13] = ($event) => $options.navigateTo("/pages/admin/settings/index"))
            },
            [
              vue.createElementVNode("span", { class: "iconfont icon-setting" }),
              !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "menu-text"
              }, "系统设置")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "div",
            {
              class: vue.normalizeClass(["menu-item", { active: $props.activePath.includes("/pages/admin/notification") }]),
              onClick: _cache[14] || (_cache[14] = ($event) => $options.navigateTo("/pages/admin/notification/index"))
            },
            [
              vue.createElementVNode("span", { class: "iconfont icon-notification" }),
              !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "menu-text"
              }, "通知中心")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          )
        ]),
        !$props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "sidebar-footer"
        }, [
          vue.createElementVNode("div", { class: "version" }, "版本 v1.0.0"),
          vue.createElementVNode("div", { class: "copyright" }, "© 2023 RPA会议系统")
        ])) : vue.createCommentVNode("v-if", true),
        $props.isCollapsed ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "sidebar-footer collapsed-footer"
        }, [
          vue.createElementVNode("div", {
            class: "version-icon",
            title: "版本 v1.0.0"
          }, "v1")
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const AdminSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-a8044c57"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/components/admin/AdminSidebar.vue"]]);
  const _sfc_main$d = {
    name: "AdminLayout",
    components: {
      AdminSidebar
    },
    props: {
      // 页面标题
      title: {
        type: String,
        default: "管理员控制台"
      },
      // 页面简介
      description: {
        type: String,
        default: ""
      },
      // 当前激活的路径
      activePath: {
        type: String,
        default: ""
      },
      // 父级路径
      parentPath: {
        type: String,
        default: ""
      },
      // 父级标题
      parentTitle: {
        type: String,
        default: ""
      },
      // 是否隐藏顶部标题栏
      hideHeader: {
        type: Boolean,
        default: false
      },
      // 面包屑导航配置
      breadcrumb: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        currentDate: "",
        currentTime: "",
        timer: null,
        avatarUrl: "",
        // 默认空字符串表示没有头像
        showUserDropdown: false,
        isSidebarCollapsed: false
        // 添加侧边栏折叠状态
      };
    },
    computed: {
      // 获取用户名的第一个字符
      usernameFirstChar() {
        return "管".charAt(0);
      }
    },
    mounted() {
      this.updateDateTime();
      this.timer = setInterval(this.updateDateTime, 1e3);
      document.addEventListener("click", this.handleOutsideClick);
      window.addEventListener("storage", this.checkSidebarState);
      this.checkSidebarState();
      try {
        const collapsedState = uni.getStorageSync("adminSidebarCollapsed");
        if (collapsedState !== "") {
          this.isSidebarCollapsed = collapsedState === "true" || collapsedState === true;
        }
      } catch (e) {
        formatAppLog("error", "at components/admin/AdminLayout.vue:162", "读取侧边栏状态失败:", e);
      }
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      document.removeEventListener("click", this.handleOutsideClick);
      window.removeEventListener("storage", this.checkSidebarState);
    },
    methods: {
      // 更新日期时间
      updateDateTime() {
        const now = /* @__PURE__ */ new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        this.currentDate = `${year}年${month}月${day}日`;
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        this.currentTime = `${hours}:${minutes}:${seconds}`;
      },
      handleLogout() {
        uni.showModal({
          title: "确认退出",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("adminToken");
              uni.removeStorageSync("adminInfo");
              uni.reLaunch({
                url: "/pages/admin/login"
              });
            }
          }
        });
      },
      toggleUserDropdown(event) {
        event.stopPropagation();
        this.showUserDropdown = !this.showUserDropdown;
      },
      handleOutsideClick(event) {
        if (!this.$el)
          return;
        const userInfoElem = this.$el.querySelector(".user-info");
        if (this.showUserDropdown && userInfoElem && !userInfoElem.contains(event.target)) {
          this.showUserDropdown = false;
        }
      },
      navigateToHome() {
        uni.reLaunch({
          url: "/pages/admin/home"
        });
      },
      navigateToParent() {
        if (this.parentPath) {
          uni.navigateTo({
            url: this.parentPath
          });
        }
      },
      navigateTo(url) {
        if (url) {
          uni.navigateTo({ url });
        }
      },
      // 添加检查侧边栏状态的方法
      checkSidebarState() {
        try {
          const savedState = uni.getStorageSync("adminSidebarCollapsed");
          if (savedState !== "") {
            this.isSidebarCollapsed = savedState;
          }
        } catch (e) {
          formatAppLog("error", "at components/admin/AdminLayout.vue:248", "读取侧边栏状态失败:", e);
        }
      },
      // 更新侧边栏状态
      updateSidebarState(value) {
        this.isSidebarCollapsed = value;
        try {
          uni.setStorageSync("adminSidebarCollapsed", value);
        } catch (e) {
          formatAppLog("error", "at components/admin/AdminLayout.vue:257", "存储侧边栏状态失败:", e);
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_sidebar = vue.resolveComponent("admin-sidebar");
    return vue.openBlock(), vue.createElementBlock(
      "div",
      {
        class: vue.normalizeClass(["admin-layout", { "collapsed": $data.isSidebarCollapsed }])
      },
      [
        vue.createCommentVNode(" 顶部导航 "),
        !$props.hideHeader ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "admin-header"
        }, [
          vue.createElementVNode("div", {
            class: "header-left",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToHome && $options.navigateToHome(...args))
          }, [
            vue.createElementVNode("img", {
              class: "header-logo",
              src: _imports_0$2,
              alt: "Logo"
            }),
            vue.createElementVNode("div", { class: "header-title-wrapper" }, [
              vue.createElementVNode(
                "span",
                { class: "header-title" },
                vue.toDisplayString($props.title),
                1
                /* TEXT */
              ),
              $props.description ? (vue.openBlock(), vue.createElementBlock(
                "span",
                {
                  key: 0,
                  class: "header-description"
                },
                vue.toDisplayString($props.description),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode("div", { class: "header-actions" }, [
            vue.createElementVNode("div", { class: "header-datetime" }, [
              vue.createElementVNode(
                "span",
                { class: "header-date" },
                vue.toDisplayString($data.currentDate),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "span",
                { class: "header-time" },
                vue.toDisplayString($data.currentTime),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("div", { class: "header-user" }, [
              $data.avatarUrl ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "user-avatar"
              }, [
                vue.createElementVNode("img", {
                  src: $data.avatarUrl,
                  alt: "管理员头像"
                }, null, 8, ["src"])
              ])) : (vue.openBlock(), vue.createElementBlock(
                "div",
                {
                  key: 1,
                  class: "user-avatar avatar-text"
                },
                vue.toDisplayString($options.usernameFirstChar),
                1
                /* TEXT */
              )),
              vue.createElementVNode("div", {
                class: "user-info",
                onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.toggleUserDropdown && $options.toggleUserDropdown(...args), ["stop"]))
              }, [
                vue.createElementVNode("span", { class: "header-username" }, "管理员"),
                vue.withDirectives(vue.createElementVNode(
                  "div",
                  { class: "user-dropdown" },
                  [
                    vue.createElementVNode("div", { class: "dropdown-item" }, [
                      vue.createElementVNode("span", { class: "iconfont icon-user" }),
                      vue.createTextVNode(" 个人资料")
                    ]),
                    vue.createElementVNode("div", { class: "dropdown-item" }, [
                      vue.createElementVNode("span", { class: "iconfont icon-setting" }),
                      vue.createTextVNode(" 系统设置")
                    ]),
                    vue.createElementVNode("div", { class: "dropdown-divider" }),
                    vue.createElementVNode("div", {
                      class: "dropdown-item",
                      onClick: _cache[1] || (_cache[1] = (...args) => $options.handleLogout && $options.handleLogout(...args))
                    }, [
                      vue.createElementVNode("span", { class: "iconfont icon-logout" }),
                      vue.createTextVNode(" 退出登录")
                    ])
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $data.showUserDropdown]
                ])
              ])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 侧边导航栏 "),
        vue.createVNode(_component_admin_sidebar, {
          "active-path": $props.activePath,
          "is-collapsed": $data.isSidebarCollapsed,
          "onUpdate:isCollapsed": $options.updateSidebarState
        }, null, 8, ["active-path", "is-collapsed", "onUpdate:isCollapsed"]),
        vue.createCommentVNode(" 主内容区域 "),
        vue.createElementVNode("div", { class: "admin-main" }, [
          vue.createCommentVNode(" 面包屑导航 "),
          $props.breadcrumb && $props.breadcrumb.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "breadcrumb"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($props.breadcrumb, (item, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: index },
                  [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(["breadcrumb-item", { "active": index === $props.breadcrumb.length - 1 }]),
                      onClick: ($event) => item.path ? $options.navigateTo(item.path) : null
                    }, [
                      index === 0 ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        class: "iconfont icon-home"
                      })) : vue.createCommentVNode("v-if", true),
                      vue.createTextVNode(
                        " " + vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]),
                    index < $props.breadcrumb.length - 1 ? (vue.openBlock(), vue.createElementBlock("span", {
                      key: 0,
                      class: "breadcrumb-separator"
                    }, "/")) : vue.createCommentVNode("v-if", true)
                  ],
                  64
                  /* STABLE_FRAGMENT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: "breadcrumb"
          }, [
            vue.createElementVNode("span", {
              class: "breadcrumb-item",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToHome && $options.navigateToHome(...args))
            }, [
              vue.createElementVNode("span", { class: "iconfont icon-home" }),
              vue.createTextVNode(" 首页 ")
            ]),
            vue.createElementVNode("span", { class: "breadcrumb-separator" }, "/"),
            $props.parentPath && $props.parentTitle ? (vue.openBlock(), vue.createElementBlock(
              "span",
              {
                key: 0,
                class: "breadcrumb-item",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.navigateToParent && $options.navigateToParent(...args))
              },
              vue.toDisplayString($props.parentTitle),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            $props.parentPath && $props.parentTitle ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 1,
              class: "breadcrumb-separator"
            }, "/")) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "span",
              { class: "breadcrumb-item active" },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            )
          ])),
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ],
      2
      /* CLASS */
    );
  }
  const AdminLayout = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__scopeId", "data-v-96359fb7"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/components/admin/AdminLayout.vue"]]);
  const _sfc_main$c = {
    components: {
      AdminLayout
    },
    data() {
      return {
        statistics: {
          meetings: 0,
          approved: 0,
          pending: 0,
          rooms: 0
        },
        upcomingMeetings: [],
        pendingApprovals: [],
        currentPage: 1,
        pageSize: 5,
        total: 0,
        totalPages: 0,
        loading: false
      };
    },
    created() {
      this.fetchDashboardData();
    },
    onShow() {
      this.fetchDashboardData();
    },
    onPullDownRefresh() {
      this.currentPage = 1;
      this.fetchDashboardData();
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1e3);
    },
    methods: {
      fetchDashboardData() {
        this.loading = true;
        uni.showLoading({
          title: "加载中"
        });
        const today = /* @__PURE__ */ new Date();
        const todayStr = today.toISOString().split("T")[0];
        api.meeting.getMeetingStats().then((res) => {
          formatAppLog("log", "at pages/admin/home.vue:202", "会议统计响应数据:", res);
          if (res && res.code === 200 && res.data) {
            if (res.data.hasOwnProperty("approved") && res.data.hasOwnProperty("pending")) {
              this.statistics.approved = res.data.approved || 0;
              this.statistics.pending = res.data.pending || 0;
              formatAppLog("log", "at pages/admin/home.vue:208", "会议统计API直接返回的审批/待审批数据:", this.statistics);
            } else {
              this.statistics.approved = 0;
              this.statistics.pending = 0;
            }
          } else {
            formatAppLog("warn", "at pages/admin/home.vue:215", "会议统计数据格式不正确:", res);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:218", "获取会议统计失败:", err);
        });
        api.meeting.getMeetings({
          status: "已通过",
          reserveDate: todayStr,
          // 添加今日日期筛选
          pageSize: 100,
          pageNo: 1
        }).then((res) => {
          if (res && res.code === 200 && res.data) {
            if (res.data.hasOwnProperty("total")) {
              this.statistics.approved = res.data.total || 0;
            } else if (Array.isArray(res.data)) {
              this.statistics.approved = res.data.length;
            }
            formatAppLog("log", "at pages/admin/home.vue:237", "今日已审批会议数量更新为:", this.statistics.approved);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:240", "获取今日已审批会议数量失败:", err);
        });
        api.meeting.getMeetings({
          status: "待审核",
          reserveDate: todayStr,
          // 添加今日日期筛选
          pageSize: 100,
          pageNo: 1
        }).then((res) => {
          if (res && res.code === 200 && res.data) {
            if (res.data.hasOwnProperty("total")) {
              this.statistics.pending = res.data.total || 0;
            } else if (Array.isArray(res.data)) {
              this.statistics.pending = res.data.length;
            }
            formatAppLog("log", "at pages/admin/home.vue:259", "今日待审核会议数量更新为:", this.statistics.pending);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:262", "获取今日待审核会议数量失败:", err);
        });
        api.meeting.getMeetings({
          reserveDate: todayStr,
          // 使用今天的日期作为查询参数
          pageSize: 100
          // 设置较大的页面大小以获取所有今日会议
        }).then((res) => {
          if (res && res.code === 200 && res.data) {
            if (res.data.list) {
              this.statistics.meetings = res.data.list.length;
            } else if (Array.isArray(res.data)) {
              this.statistics.meetings = res.data.length;
            } else {
              this.statistics.meetings = 0;
            }
            formatAppLog("log", "at pages/admin/home.vue:281", "今日会议数量更新为:", this.statistics.meetings);
          } else {
            formatAppLog("warn", "at pages/admin/home.vue:283", "获取今日会议数据失败:", res);
            this.statistics.meetings = 0;
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:287", "获取今日会议数量失败:", err);
          this.statistics.meetings = 0;
        });
        api.room.getRooms().then((res) => {
          formatAppLog("log", "at pages/admin/home.vue:293", "会议室响应数据:", res);
          if (res && res.code === 200 && res.data) {
            const roomData = Array.isArray(res.data) ? res.data : res.data.list || [];
            this.statistics.rooms = roomData.length;
            formatAppLog("log", "at pages/admin/home.vue:298", "会议室数量更新后:", this.statistics.rooms);
          } else {
            formatAppLog("warn", "at pages/admin/home.vue:300", "会议室数据格式不正确:", res);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:303", "获取会议室数量失败:", err);
        });
        api.meeting.getMeetings({
          reserveDate: todayStr,
          status: "已通过"
          // 使用正确的状态值
        }).then((res) => {
          if (res && res.code === 200 && res.data) {
            let meetingData = Array.isArray(res.data) ? res.data : [];
            const currentTime = /* @__PURE__ */ new Date();
            meetingData = meetingData.filter((meeting2) => {
              const meetingTime = /* @__PURE__ */ new Date(`${meeting2.reserveDate} ${meeting2.startTime}`);
              return meetingTime > currentTime;
            });
            this.upcomingMeetings = meetingData.map((meeting2) => {
              return {
                id: meeting2.id,
                title: meeting2.topic,
                reserveDate: meeting2.reserveDate,
                time: `${meeting2.reserveDate}  ${meeting2.startTime || ""} - ${meeting2.endTime || ""}`,
                room: meeting2.room || "未知会议室",
                status: meeting2.status,
                statusText: this.getStatusText(meeting2.status)
              };
            });
            formatAppLog("log", "at pages/admin/home.vue:334", "即将到来的会议更新后:", this.upcomingMeetings);
          } else {
            formatAppLog("warn", "at pages/admin/home.vue:336", "即将到来的会议数据格式不正确:", res);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:339", "获取即将到来的会议失败:", err);
        });
        api.meeting.getMeetings({
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          status: "待审核",
          // 明确指定状态参数
          reserveDate: todayStr
          // 添加今日日期筛选
        }).then((res) => {
          if (res && res.code === 200 && res.data) {
            if (res.data.list) {
              const pendingData = res.data.list || [];
              this.total = res.data.total || 0;
              this.totalPages = res.data.pages || Math.ceil(this.total / this.pageSize) || 1;
              this.pendingApprovals = pendingData.map((meeting2) => {
                return {
                  id: meeting2.id,
                  title: meeting2.topic,
                  date: `${meeting2.reserveDate}  ${meeting2.startTime || ""} - ${meeting2.endTime || ""}`,
                  room: meeting2.room || "未知会议室",
                  organizer: meeting2.booker || "未知预约人"
                };
              });
            } else {
              const pendingData = Array.isArray(res.data) ? res.data : [];
              const filteredData = pendingData.filter((meeting2) => meeting2.status === "待审核");
              this.total = filteredData.length;
              this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
              filteredData.sort((a, b) => {
                const dateA = /* @__PURE__ */ new Date(`${a.reserveDate} ${a.startTime}`);
                const dateB = /* @__PURE__ */ new Date(`${b.reserveDate} ${b.startTime}`);
                return dateA - dateB;
              });
              this.pendingApprovals = filteredData.slice(0, this.pageSize).map((meeting2) => {
                return {
                  id: meeting2.id,
                  title: meeting2.topic,
                  date: `${meeting2.reserveDate}  ${meeting2.startTime || ""} - ${meeting2.endTime || ""}`,
                  room: meeting2.room || "未知会议室",
                  organizer: meeting2.booker || "未知预约人"
                };
              });
            }
            formatAppLog("log", "at pages/admin/home.vue:390", "待审批会议更新后:", this.pendingApprovals);
            formatAppLog("log", "at pages/admin/home.vue:391", "分页信息:", { 当前页: this.currentPage, 总页数: this.totalPages, 总记录数: this.total });
          } else {
            formatAppLog("warn", "at pages/admin/home.vue:393", "待审批会议数据格式不正确:", res);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/home.vue:396", "获取待审批会议失败:", err);
        }).finally(() => {
          uni.hideLoading();
          this.loading = false;
        });
      },
      navigateToMeetingList() {
        uni.navigateTo({
          url: "/pages/admin/meeting/list"
        });
      },
      navigateToApprovedMeetings() {
        uni.navigateTo({
          url: "/pages/admin/meeting/list?status=approved"
        });
      },
      navigateToPendingMeetings() {
        uni.navigateTo({
          url: "/pages/admin/meeting/list?status=pending"
        });
      },
      navigateToRoomList() {
        uni.navigateTo({
          url: "/pages/admin/room/list"
        });
      },
      navigateToMeetingDetail(id) {
        uni.navigateTo({
          url: `/pages/admin/meeting/detail?id=${id}`
        });
      },
      getStatusText(status) {
        const statusTextMap = {
          "已通过": "已通过",
          "待审核": "待审核",
          "已拒绝": "已拒绝"
        };
        return statusTextMap[status] || status;
      },
      getStatusClass(status) {
        const statusMap = {
          "已通过": "badge-success",
          "待审核": "badge-warning",
          "已拒绝": "badge-danger"
        };
        return statusMap[status] || "badge-secondary";
      },
      handleApprove(id) {
        uni.showModal({
          title: "确认审批",
          content: "确定批准该会议申请吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ title: "处理中..." });
              api.meeting.approveReservation(id, true).then((res2) => {
                if (res2 && res2.code === 200) {
                  uni.showToast({
                    title: "已批准",
                    icon: "success"
                  });
                  this.fetchDashboardData();
                } else {
                  uni.showToast({
                    title: res2.message || "操作失败",
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/admin/home.vue:468", "审批失败:", err);
                uni.showToast({
                  title: "审批失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      handleReject(id) {
        uni.showModal({
          title: "确认拒绝",
          content: "确定拒绝该会议申请吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ title: "处理中..." });
              api.meeting.approveReservation(id, false).then((res2) => {
                if (res2 && res2.code === 200) {
                  uni.showToast({
                    title: "已拒绝",
                    icon: "success"
                  });
                  this.fetchDashboardData();
                } else {
                  uni.showToast({
                    title: res2.message || "操作失败",
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/admin/home.vue:507", "拒绝失败:", err);
                uni.showToast({
                  title: "拒绝失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      handlePageChange(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
          return;
        }
        this.currentPage = page;
        this.fetchDashboardData();
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.handlePageChange(this.currentPage - 1);
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.handlePageChange(this.currentPage + 1);
        }
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "管理员控制台",
      description: "会议系统管理后台的核心功能与数据概览",
      "active-path": "/pages/admin/home"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("div", { class: "dashboard-content" }, [
          vue.createCommentVNode(" 顶部统计卡片 "),
          vue.createElementVNode("div", { class: "statistics-cards" }, [
            vue.createElementVNode("div", {
              class: "stat-card",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToMeetingList && $options.navigateToMeetingList(...args))
            }, [
              vue.createElementVNode("div", { class: "stat-icon" }, [
                vue.createElementVNode("i", { class: "icon-meetings" })
              ]),
              vue.createElementVNode("div", { class: "stat-info" }, [
                vue.createElementVNode(
                  "div",
                  { class: "stat-value" },
                  vue.toDisplayString($data.statistics.meetings),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("div", { class: "stat-label" }, "今日会议")
              ])
            ]),
            vue.createElementVNode("div", {
              class: "stat-card",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToApprovedMeetings && $options.navigateToApprovedMeetings(...args))
            }, [
              vue.createElementVNode("div", { class: "stat-icon approved" }, [
                vue.createElementVNode("i", { class: "icon-approved" })
              ]),
              vue.createElementVNode("div", { class: "stat-info" }, [
                vue.createElementVNode(
                  "div",
                  { class: "stat-value approved" },
                  vue.toDisplayString($data.statistics.approved),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("div", { class: "stat-label" }, "今日已通过")
              ])
            ]),
            vue.createElementVNode("div", {
              class: "stat-card",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToPendingMeetings && $options.navigateToPendingMeetings(...args))
            }, [
              vue.createElementVNode("div", { class: "stat-icon pending" }, [
                vue.createElementVNode("i", { class: "icon-pending" })
              ]),
              vue.createElementVNode("div", { class: "stat-info" }, [
                vue.createElementVNode(
                  "div",
                  { class: "stat-value pending" },
                  vue.toDisplayString($data.statistics.pending),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("div", { class: "stat-label" }, "今日待审批")
              ])
            ]),
            vue.createElementVNode("div", {
              class: "stat-card",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToRoomList && $options.navigateToRoomList(...args))
            }, [
              vue.createElementVNode("div", { class: "stat-icon rooms" }, [
                vue.createElementVNode("i", { class: "icon-rooms" })
              ]),
              vue.createElementVNode("div", { class: "stat-info" }, [
                vue.createElementVNode(
                  "div",
                  { class: "stat-value rooms" },
                  vue.toDisplayString($data.statistics.rooms),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("div", { class: "stat-label" }, "会议室数量")
              ])
            ])
          ]),
          vue.createElementVNode("div", { class: "dashboard-row" }, [
            vue.createCommentVNode(" 即将开始的会议 "),
            vue.createElementVNode("div", { class: "dashboard-card upcoming-meetings" }, [
              vue.createElementVNode("div", { class: "card-header" }, [
                vue.createElementVNode("h3", { class: "card-title" }, "即将开始的会议"),
                vue.createElementVNode("a", {
                  href: "javascript:;",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.navigateToMeetingList && $options.navigateToMeetingList(...args)),
                  class: "card-more"
                }, "查看全部")
              ]),
              vue.createElementVNode("div", { class: "meeting-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.upcomingMeetings, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      class: "meeting-item",
                      key: index
                    }, [
                      vue.createElementVNode("div", {
                        class: "meeting-content",
                        onClick: ($event) => $options.navigateToMeetingDetail(item.id)
                      }, [
                        vue.createElementVNode(
                          "div",
                          { class: "meeting-title" },
                          vue.toDisplayString(item.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("div", { class: "meeting-info" }, [
                          vue.createElementVNode("span", { class: "meeting-time" }, [
                            vue.createElementVNode("i", { class: "icon-time" }),
                            vue.createTextVNode(
                              " " + vue.toDisplayString(item.time),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("span", { class: "meeting-room" }, [
                            vue.createElementVNode("i", { class: "icon-room" }),
                            vue.createTextVNode(
                              " " + vue.toDisplayString(item.room),
                              1
                              /* TEXT */
                            )
                          ])
                        ])
                      ], 8, ["onClick"]),
                      vue.createElementVNode("div", { class: "meeting-status" }, [
                        vue.createElementVNode(
                          "span",
                          {
                            class: vue.normalizeClass(["badge", $options.getStatusClass(item.status)])
                          },
                          vue.toDisplayString(item.statusText),
                          3
                          /* TEXT, CLASS */
                        ),
                        vue.createElementVNode("button", {
                          class: "btn-detail",
                          onClick: vue.withModifiers(($event) => $options.navigateToMeetingDetail(item.id), ["stop"])
                        }, [
                          vue.createElementVNode("i", { class: "icon-detail" }),
                          vue.createTextVNode("详情 ")
                        ], 8, ["onClick"])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $data.upcomingMeetings.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "no-data"
                }, [
                  vue.createElementVNode("div", { class: "no-data-icon" }, [
                    vue.createElementVNode("i", { class: "icon-empty" })
                  ]),
                  vue.createElementVNode("div", { class: "no-data-text" }, "暂无即将开始的会议")
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ]),
            vue.createCommentVNode(" 待审批会议 "),
            vue.createElementVNode("div", { class: "dashboard-card pending-approvals" }, [
              vue.createElementVNode("div", { class: "card-header" }, [
                vue.createElementVNode("h3", { class: "card-title" }, "今日待审批会议"),
                vue.createElementVNode("a", {
                  href: "javascript:;",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.navigateToPendingMeetings && $options.navigateToPendingMeetings(...args)),
                  class: "card-more"
                }, "查看全部")
              ]),
              vue.createElementVNode("div", { class: "approval-list" }, [
                vue.createCommentVNode(" 加载中显示加载指示器 "),
                $data.loading ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "loading-container"
                }, [
                  vue.createElementVNode("div", { class: "loading-spinner" }),
                  vue.createElementVNode("div", { class: "loading-text" }, "加载中...")
                ])) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    vue.createCommentVNode(" 有数据时显示列表 "),
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.pendingApprovals, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("div", {
                          class: "approval-item",
                          key: index
                        }, [
                          vue.createElementVNode("div", {
                            class: "approval-content",
                            onClick: ($event) => $options.navigateToMeetingDetail(item.id)
                          }, [
                            vue.createElementVNode(
                              "div",
                              { class: "approval-title" },
                              vue.toDisplayString(item.title),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode("div", { class: "approval-info" }, [
                              vue.createElementVNode("span", { class: "approval-applicant" }, [
                                vue.createElementVNode("i", { class: "icon-user" }),
                                vue.createTextVNode(
                                  " " + vue.toDisplayString(item.organizer),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              vue.createElementVNode("span", { class: "approval-time" }, [
                                vue.createElementVNode("i", { class: "icon-calendar" }),
                                vue.createTextVNode(
                                  " " + vue.toDisplayString(item.date),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ])
                          ], 8, ["onClick"]),
                          vue.createElementVNode("div", { class: "approval-actions" }, [
                            vue.createElementVNode("button", {
                              class: "btn-detail",
                              onClick: vue.withModifiers(($event) => $options.navigateToMeetingDetail(item.id), ["stop"])
                            }, [
                              vue.createElementVNode("i", { class: "icon-detail" }),
                              vue.createTextVNode("详情 ")
                            ], 8, ["onClick"]),
                            vue.createElementVNode("button", {
                              class: "btn-approve",
                              onClick: vue.withModifiers(($event) => $options.handleApprove(item.id), ["stop"])
                            }, "批准", 8, ["onClick"]),
                            vue.createElementVNode("button", {
                              class: "btn-reject",
                              onClick: vue.withModifiers(($event) => $options.handleReject(item.id), ["stop"])
                            }, "拒绝", 8, ["onClick"])
                          ])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    vue.createCommentVNode(" 无数据时显示提示 "),
                    $data.pendingApprovals.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: "no-data"
                    }, [
                      vue.createElementVNode("div", { class: "no-data-icon" }, [
                        vue.createElementVNode("i", { class: "icon-empty" })
                      ]),
                      vue.createElementVNode("div", { class: "no-data-text" }, "暂无待审批会议")
                    ])) : vue.createCommentVNode("v-if", true)
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )),
                vue.createCommentVNode(" 分页控制器 "),
                vue.withDirectives(vue.createElementVNode(
                  "div",
                  { class: "pagination" },
                  [
                    vue.createElementVNode("button", {
                      class: "pagination-btn",
                      disabled: $data.currentPage === 1,
                      onClick: _cache[6] || (_cache[6] = (...args) => $options.prevPage && $options.prevPage(...args))
                    }, " 上一页 ", 8, ["disabled"]),
                    vue.createElementVNode("div", { class: "pagination-info" }, [
                      vue.createElementVNode(
                        "span",
                        null,
                        "第 " + vue.toDisplayString($data.currentPage) + " 页/共 " + vue.toDisplayString($data.totalPages || 1) + " 页",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "span",
                        { class: "pagination-total" },
                        "总计 " + vue.toDisplayString($data.total) + " 条记录",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("button", {
                      class: "pagination-btn",
                      disabled: $data.currentPage === $data.totalPages || $data.totalPages === 0,
                      onClick: _cache[7] || (_cache[7] = (...args) => $options.nextPage && $options.nextPage(...args))
                    }, " 下一页 ", 8, ["disabled"])
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, !$data.loading && $data.total > 0]
                ])
              ])
            ])
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminHome = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-b5384573"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/home.vue"]]);
  const _sfc_main$b = {
    components: {
      AdminLayout
    },
    data() {
      return {
        loading: false,
        searchQuery: "",
        notifications: [],
        // 所有通知数据
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        showDetailModal: false,
        currentNotification: {}
      };
    },
    computed: {
      // 过滤后的通知
      filteredNotifications() {
        return this.notifications || [];
      },
      // 分页后的通知
      paginatedNotifications() {
        return this.filteredNotifications;
      },
      // 总页数
      totalPages() {
        return Math.ceil(this.totalCount / this.pageSize);
      },
      // 总条目数
      totalItems() {
        return this.totalCount;
      },
      // 显示的页码数组
      displayedPages() {
        const pages = [];
        const maxVisiblePages = 5;
        if (this.totalPages <= maxVisiblePages) {
          for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          if (this.currentPage <= 3) {
            for (let i = 1; i <= Math.min(maxVisiblePages, this.totalPages); i++) {
              pages.push(i);
            }
          } else if (this.currentPage >= this.totalPages - 2) {
            for (let i = this.totalPages - maxVisiblePages + 1; i <= this.totalPages; i++) {
              pages.push(i);
            }
          } else {
            for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
              pages.push(i);
            }
          }
        }
        return pages;
      }
    },
    created() {
      this.fetchNotifications();
    },
    methods: {
      // 获取通知数据
      fetchNotifications() {
        return __async(this, null, function* () {
          this.loading = true;
          try {
            let pageNo = this.currentPage;
            let pageSize = this.pageSize;
            let isAsc = false;
            let sortBy = "id";
            const response = yield apiRequest.getNotifications(pageNo, pageSize, isAsc, sortBy);
            if (response.code === 200 && response.data) {
              formatAppLog("log", "at pages/admin/notification/index.vue:201", "获取通知成功:", response.data);
              let notificationList = response.data.list || [];
              this.notifications = notificationList.map((item) => ({
                id: item.id,
                title: item.title || "系统通知",
                message: item.content || item.message || "",
                time: item.createTime || item.time || "",
                icon: this.getIconByType(item.type || "system")
              }));
              this.totalCount = response.data.total || 0;
            } else {
              uni.showToast({
                title: response.message || "获取通知失败",
                icon: "none"
              });
              this.notifications = [];
              this.totalCount = 0;
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/notification/index.vue:225", "获取通知失败:", error);
            uni.showToast({
              title: "获取通知失败",
              icon: "none"
            });
            this.notifications = [];
            this.totalCount = 0;
          } finally {
            this.loading = false;
          }
        });
      },
      // 根据通知类型获取图标
      getIconByType(type) {
        const iconMap = {
          "system": "icon-notification",
          "meeting": "icon-meeting",
          "security": "icon-security",
          "user": "icon-user",
          "default": "icon-notification"
        };
        return iconMap[type] || iconMap.default;
      },
      confirmClearAll() {
        return __async(this, null, function* () {
          try {
            yield uni.showModal({
              title: "确认清空",
              content: "确定要清空所有通知吗？此操作不可恢复。"
            });
            uni.showToast({
              title: "清空通知功能暂未实现",
              icon: "none"
            });
          } catch (error) {
            if (error.errMsg !== "showModal:fail cancel") {
              uni.showToast({
                title: "操作失败",
                icon: "none"
              });
            }
          }
        });
      },
      deleteNotification(notification) {
        return __async(this, null, function* () {
          try {
            yield uni.showModal({
              title: "确认删除",
              content: "确定要删除这条通知吗？"
            });
            uni.showToast({
              title: "删除通知功能暂未实现",
              icon: "none"
            });
          } catch (error) {
            if (error.errMsg !== "showModal:fail cancel") {
              uni.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        });
      },
      showNotificationDetail(notification) {
        return __async(this, null, function* () {
          try {
            uni.showLoading({
              title: "加载中..."
            });
            const response = yield apiRequest.adminGetNotification(notification.id);
            if (response && response.code === 200 && response.data) {
              this.currentNotification = {
                id: response.data.id,
                title: response.data.title || notification.title || "系统通知",
                message: response.data.content || response.data.message || notification.message || "",
                time: response.data.createTime || response.data.time || notification.time || "",
                icon: this.getIconByType(response.data.type || notification.type || "system")
              };
              this.showDetailModal = true;
            } else {
              this.currentNotification = __spreadValues({}, notification);
              this.showDetailModal = true;
              uni.showToast({
                title: "获取详情失败，显示简略信息",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/notification/index.vue:322", "获取通知详情失败:", error);
            this.currentNotification = __spreadValues({}, notification);
            this.showDetailModal = true;
            uni.showToast({
              title: "获取详情失败，显示简略信息",
              icon: "none"
            });
          } finally {
            uni.hideLoading();
          }
        });
      },
      closeDetailModal() {
        this.showDetailModal = false;
      },
      handleNotificationClick(notification) {
        this.showNotificationDetail(notification);
      },
      goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
          return;
        }
        this.currentPage = page;
        this.fetchNotifications();
      },
      getIconClass(icon) {
        const classMap = {
          "icon-notification": "icon-blue",
          "icon-meeting": "icon-green",
          "icon-security": "icon-red",
          "icon-user": "icon-purple"
        };
        return classMap[icon] || "icon-default";
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "通知中心",
      "active-path": "/pages/admin/notification/index"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("div", { class: "notification-page" }, [
          vue.createCommentVNode(" 通知列表区域 "),
          $options.paginatedNotifications.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "notification-list-section"
          }, [
            vue.createElementVNode("div", { class: "notification-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.paginatedNotifications, (notification, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    class: "notification-item",
                    key: notification.id,
                    onClick: ($event) => $options.showNotificationDetail(notification)
                  }, [
                    vue.createElementVNode(
                      "div",
                      {
                        class: vue.normalizeClass(["notification-icon", $options.getIconClass(notification.icon)])
                      },
                      [
                        vue.createElementVNode(
                          "span",
                          {
                            class: vue.normalizeClass(["iconfont", notification.icon])
                          },
                          null,
                          2
                          /* CLASS */
                        )
                      ],
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode("div", { class: "notification-content" }, [
                      vue.createElementVNode("div", { class: "notification-header" }, [
                        vue.createElementVNode(
                          "div",
                          { class: "notification-title" },
                          vue.toDisplayString(notification.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "div",
                          { class: "notification-time" },
                          vue.toDisplayString(notification.time),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "div",
                        { class: "notification-message" },
                        vue.toDisplayString(notification.message),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("div", { class: "notification-actions" }, [
                        vue.createElementVNode("span", {
                          class: "action-link",
                          onClick: vue.withModifiers(($event) => $options.deleteNotification(notification), ["stop"])
                        }, "删除", 8, ["onClick"])
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 分页控制 "),
            $options.totalPages > 1 ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "pagination"
            }, [
              vue.createElementVNode(
                "div",
                { class: "pagination-info" },
                "共 " + vue.toDisplayString($options.totalItems) + " 条通知，第 " + vue.toDisplayString($data.currentPage) + "/" + vue.toDisplayString($options.totalPages) + " 页",
                1
                /* TEXT */
              ),
              vue.createElementVNode("div", { class: "pagination-controls" }, [
                vue.createElementVNode("button", {
                  class: vue.normalizeClass(["pagination-btn", { "disabled": $data.currentPage === 1 }]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.goToPage($data.currentPage - 1)),
                  disabled: $data.currentPage === 1
                }, " 上一页 ", 10, ["disabled"]),
                vue.createElementVNode("div", { class: "page-numbers" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($options.displayedPages, (page) => {
                      return vue.openBlock(), vue.createElementBlock("div", {
                        key: page,
                        class: vue.normalizeClass(["page-number", { "active": $data.currentPage === page }]),
                        onClick: ($event) => $options.goToPage(page)
                      }, vue.toDisplayString(page), 11, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode("button", {
                  class: vue.normalizeClass(["pagination-btn", { "disabled": $data.currentPage === $options.totalPages }]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.goToPage($data.currentPage + 1)),
                  disabled: $data.currentPage === $options.totalPages
                }, " 下一页 ", 10, ["disabled"])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])) : $data.loading ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 加载中状态 "),
              vue.createElementVNode("div", { class: "loading-state" }, [
                vue.createElementVNode("span", { class: "iconfont icon-loading loading-icon" }),
                vue.createElementVNode("span", { class: "loading-text" }, "加载中...")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 2 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("div", { class: "empty-state" }, [
                vue.createElementVNode("span", { class: "iconfont icon-empty" }),
                vue.createElementVNode("span", { class: "empty-text" }, "暂无通知")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )),
          vue.createCommentVNode(" 通知详情弹窗 "),
          $data.showDetailModal ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 3,
            class: "notification-detail-modal"
          }, [
            vue.createElementVNode("div", {
              class: "modal-overlay",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.closeDetailModal && $options.closeDetailModal(...args))
            }),
            vue.createElementVNode("div", { class: "modal-content" }, [
              vue.createElementVNode("div", { class: "modal-header" }, [
                vue.createElementVNode("div", { class: "modal-title" }, "通知详情"),
                vue.createElementVNode("div", {
                  class: "modal-close",
                  onClick: _cache[3] || (_cache[3] = (...args) => $options.closeDetailModal && $options.closeDetailModal(...args))
                }, "×")
              ]),
              vue.createElementVNode("div", { class: "modal-body" }, [
                vue.createElementVNode("div", { class: "detail-item" }, [
                  vue.createElementVNode("div", { class: "detail-label" }, "标题"),
                  vue.createElementVNode(
                    "div",
                    { class: "detail-value" },
                    vue.toDisplayString($data.currentNotification.title),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("div", { class: "detail-item" }, [
                  vue.createElementVNode("div", { class: "detail-label" }, "内容"),
                  vue.createElementVNode(
                    "div",
                    { class: "detail-value detail-message" },
                    vue.toDisplayString($data.currentNotification.message),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("div", { class: "detail-item" }, [
                  vue.createElementVNode("div", { class: "detail-label" }, "时间"),
                  vue.createElementVNode(
                    "div",
                    { class: "detail-value" },
                    vue.toDisplayString($data.currentNotification.time),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("div", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  class: "modal-btn close-btn",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.closeDetailModal && $options.closeDetailModal(...args))
                }, "关闭")
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminNotificationIndex = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-90b505b7"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/notification/index.vue"]]);
  const _sfc_main$a = {
    components: {
      AdminLayout
    },
    data() {
      return {
        userId: "",
        username: "",
        notifications: [],
        unreadCount: 0,
        currentPage: 1,
        pageSize: 10,
        hasMore: true,
        loading: false,
        sourcePath: "/pages/admin/user/list",
        sourceTitle: "用户管理",
        showPagination: true
      };
    },
    onLoad(options) {
      if (options.id) {
        this.userId = options.id;
        if (options.from === "notification") {
          this.sourcePath = "/pages/admin/notification/index";
          this.sourceTitle = "通知中心";
        } else {
          this.sourcePath = "/pages/admin/user/list";
          this.sourceTitle = "用户管理";
        }
        this.loadNotifications();
      } else {
        uni.showToast({
          title: "参数错误",
          icon: "none"
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    methods: {
      navigateTo(url) {
        uni.navigateTo({ url });
      },
      loadNotifications() {
        return __async(this, null, function* () {
          var _a2, _b2, _c2, _d2;
          this.loading = true;
          try {
            const res = yield api.notify.getNotifyList({
              pageNo: this.currentPage,
              pageSize: this.pageSize,
              userId: this.userId
            });
            formatAppLog("log", "at pages/admin/notification/detail.vue:135", this.userId);
            if (((_a2 = res.data) == null ? void 0 : _a2.code) === 200 && Array.isArray((_c2 = (_b2 = res.data) == null ? void 0 : _b2.data) == null ? void 0 : _c2.records)) {
              this.notifications = res.data.data.records.map((notifyData) => ({
                id: notifyData.id,
                title: notifyData.title || "系统通知",
                message: notifyData.content,
                time: notifyData.createTime,
                read: notifyData.status === "read",
                icon: this.getNotificationIcon(notifyData.notifyType),
                sender: notifyData.sender,
                type: notifyData.notifyType
              }));
              this.unreadCount = this.notifications.filter((item) => !item.read).length;
              this.hasMore = this.notifications.length === this.pageSize;
              this.showPagination = true;
            } else {
              this.notifications = [];
              this.unreadCount = 0;
              this.hasMore = false;
              this.showPagination = false;
              uni.showToast({
                title: ((_d2 = res.data) == null ? void 0 : _d2.msg) || "获取通知失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/notification/detail.vue:167", "获取通知失败:", error);
            this.notifications = [];
            this.unreadCount = 0;
            this.hasMore = false;
            this.showPagination = false;
            uni.showToast({
              title: "获取通知失败",
              icon: "none"
            });
          } finally {
            this.loading = false;
          }
        });
      },
      // 根据通知类型获取对应的图标
      getNotificationIcon(type) {
        const iconMap = {
          1: "icon-calendar",
          // 会议通知
          2: "icon-system",
          // 系统通知
          3: "icon-user",
          // 用户通知
          4: "icon-room"
          // 会议室通知
        };
        return iconMap[type] || "icon-notification";
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.loadNotifications();
      },
      handleReadNotification(notification) {
        return __async(this, null, function* () {
          var _a2, _b2;
          if (notification.read)
            return;
          try {
            const res = yield api.notify.markAsRead(notification.id);
            if (((_a2 = res.data) == null ? void 0 : _a2.code) === 200) {
              notification.read = true;
              this.unreadCount = Math.max(0, this.unreadCount - 1);
            } else {
              uni.showToast({
                title: ((_b2 = res.data) == null ? void 0 : _b2.msg) || "标记已读失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/notification/detail.vue:209", "标记已读失败:", error);
            uni.showToast({
              title: "标记已读失败",
              icon: "none"
            });
          }
        });
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "通知详情",
      description: "查看用户通知详情",
      "active-path": "/pages/admin/notification/index",
      breadcrumb: [
        { title: "首页", path: "/pages/admin/home" },
        { title: $data.sourceTitle, path: $data.sourcePath },
        { title: "通知详情" }
      ]
    }, {
      default: vue.withCtx(() => [
        vue.createCommentVNode(" 通知详情内容 "),
        vue.createElementVNode("view", { class: "notification-detail" }, [
          vue.createElementVNode("view", { class: "detail-header" }, [
            vue.createElementVNode("view", { class: "user-info" }, [
              vue.createElementVNode("text", { class: "label" }, "用户："),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($data.username),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "notification-count" }, [
              vue.createElementVNode("text", { class: "label" }, "未读通知："),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($data.unreadCount),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "notification-list" }, [
            $data.notifications.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-notification"
            }, " 暂无通知 ")) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "notification-items"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.notifications, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["notification-item", { "unread": !item.read }]),
                    onClick: ($event) => $options.handleReadNotification(item)
                  }, [
                    vue.createElementVNode("view", { class: "notification-icon" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["iconfont", item.icon || "icon-notification"])
                        },
                        null,
                        2
                        /* CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "notification-content" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "notification-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "notification-message" },
                        vue.toDisplayString(item.message),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "notification-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "notification-status" }, [
                      !item.read ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "unread-badge"
                      }, "未读")) : vue.createCommentVNode("v-if", true)
                    ])
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]))
          ]),
          vue.createCommentVNode(" 分页 "),
          $data.showPagination ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "pagination"
          }, [
            vue.createElementVNode("button", {
              class: "btn-page",
              disabled: $data.currentPage === 1,
              onClick: _cache[0] || (_cache[0] = ($event) => $options.handlePageChange($data.currentPage - 1))
            }, [
              vue.createElementVNode("text", { class: "iconfont icon-arrow-left" }),
              vue.createTextVNode(" 上一页 ")
            ], 8, ["disabled"]),
            vue.createElementVNode(
              "text",
              { class: "page-info" },
              "第 " + vue.toDisplayString($data.currentPage) + " 页",
              1
              /* TEXT */
            ),
            vue.createElementVNode("button", {
              class: "btn-page",
              disabled: !$data.hasMore,
              onClick: _cache[1] || (_cache[1] = ($event) => $options.handlePageChange($data.currentPage + 1))
            }, [
              vue.createTextVNode(" 下一页 "),
              vue.createElementVNode("text", { class: "iconfont icon-arrow-right" })
            ], 8, ["disabled"])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["breadcrumb"]);
  }
  const PagesAdminNotificationDetail = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/notification/detail.vue"]]);
  const _sfc_main$9 = {
    components: {
      AdminLayout
    },
    data() {
      return {
        searchText: "",
        allRooms: [],
        // 存储所有会议室数据
        rooms: [],
        // 存储过滤后的会议室数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: false
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.pageSize);
      },
      // 计算过滤后的会议室列表
      filteredRooms() {
        if (!this.searchText) {
          return this.allRooms;
        }
        const searchLower = this.searchText.toLowerCase();
        return this.allRooms.filter(
          (room) => room.name.toLowerCase().includes(searchLower) || room.equipment.toLowerCase().includes(searchLower) || room.description.toLowerCase().includes(searchLower)
        );
      },
      // 计算当前页的会议室列表
      paginatedRooms() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredRooms.slice(start, end);
      }
    },
    watch: {
      // 监听搜索文本变化，实时过滤
      searchText: {
        handler(newVal) {
          this.currentPage = 1;
          this.updateRoomsList();
        }
      },
      // 监听分页变化
      currentPage: {
        handler() {
          this.updateRoomsList();
        }
      }
    },
    onLoad() {
      this.fetchRoomList();
    },
    onPullDownRefresh() {
      this.fetchRoomList();
    },
    methods: {
      // 更新显示的会议室列表
      updateRoomsList() {
        this.rooms = this.paginatedRooms;
        this.total = this.filteredRooms.length;
      },
      fetchRoomList() {
        this.loading = true;
        uni.showLoading({
          title: "加载中..."
        });
        api.room.getRooms(1, 1e3, true, "id").then((res) => {
          if (res && res.code === 200 && res.data) {
            if (res.data.list) {
              this.allRooms = res.data.list.map(this.formatRoom);
            } else if (Array.isArray(res.data)) {
              this.allRooms = res.data.map(this.formatRoom);
            } else {
              this.allRooms = [];
            }
            this.updateRoomsList();
            formatAppLog("log", "at pages/admin/room/list.vue:166", "获取到的会议室列表:", this.rooms);
          } else {
            formatAppLog("warn", "at pages/admin/room/list.vue:168", "获取会议室列表失败:", res);
            this.allRooms = [];
            this.updateRoomsList();
            uni.showToast({
              title: (res == null ? void 0 : res.message) || "获取会议室列表失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/room/list.vue:178", "获取会议室列表异常:", err);
          this.allRooms = [];
          this.updateRoomsList();
          uni.showToast({
            title: "获取会议室列表失败，请稍后重试",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.loading = false;
        });
      },
      // 格式化会议室数据
      formatRoom(room) {
        let status = room.status || "available";
        let statusText = this.getStatusText(status);
        return {
          id: room.id,
          name: room.name || "未命名会议室",
          capacity: room.capacity || 0,
          equipment: room.equipment || "无",
          status,
          statusText,
          description: room.description || ""
        };
      },
      // 获取状态文本
      getStatusText(status) {
        const statusMap = {
          "available": "可用",
          "maintenance": "维护中",
          "busy": "使用中",
          "reserved": "已预约"
        };
        return statusMap[status] || status;
      },
      handleSearch() {
        this.currentPage = 1;
      },
      navigateToEdit(id) {
        if (id) {
          uni.navigateTo({
            url: `/pages/admin/room/edit?id=${id}`
          });
        } else {
          uni.navigateTo({
            url: "/pages/admin/room/edit"
          });
        }
      },
      handleDeleteRoom(room) {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除 "${room.name}" 吗？`,
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "删除中..."
              });
              api.room.deleteRoom(room.id).then((res2) => {
                if (res2 && res2.code === 200) {
                  uni.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                  this.fetchRoomList();
                } else {
                  uni.showToast({
                    title: (res2 == null ? void 0 : res2.message) || "删除失败",
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/admin/room/list.vue:263", "删除会议室失败:", err);
                uni.showToast({
                  title: "删除失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      handlePageChange(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
          return;
        }
        this.currentPage = page;
        this.fetchRoomList();
      },
      getStatusClass(status) {
        const statusMap = {
          "available": "badge-success",
          "maintenance": "badge-warning",
          "unavailable": "badge-danger"
        };
        return statusMap[status] || "badge-secondary";
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "会议室管理",
      "active-path": "/pages/admin/room/list"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "room-list-container" }, [
          vue.createCommentVNode(" 搜索和添加按钮区域 "),
          vue.createElementVNode("view", { class: "action-bar" }, [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  class: "search-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchText = $event),
                  placeholder: "搜索会议室...",
                  onConfirm: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.searchText]
              ])
            ]),
            vue.createElementVNode("button", {
              class: "add-btn",
              onClick: _cache[2] || (_cache[2] = ($event) => $options.navigateToEdit())
            }, " 添加会议室 ")
          ]),
          vue.createCommentVNode(" 会议室列表 "),
          $data.rooms.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "room-list"
          }, [
            vue.createElementVNode("view", { class: "table" }, [
              vue.createElementVNode("view", { class: "table-header" }, [
                vue.createElementVNode("text", { class: "th th-id" }, "ID"),
                vue.createElementVNode("text", { class: "th th-name" }, "会议室名称"),
                vue.createElementVNode("text", { class: "th th-capacity" }, "容量"),
                vue.createElementVNode("text", { class: "th th-equipment" }, "设备"),
                vue.createElementVNode("text", { class: "th th-status" }, "状态"),
                vue.createElementVNode("text", { class: "th th-action" }, "操作")
              ]),
              vue.createElementVNode("view", { class: "table-body" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.rooms, (room, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "table-row",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "td td-id" },
                        vue.toDisplayString(room.id),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-name" },
                        vue.toDisplayString(room.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-capacity" },
                        vue.toDisplayString(room.capacity) + "人",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-equipment" },
                        vue.toDisplayString(room.equipment),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "td td-status" }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass(["badge", $options.getStatusClass(room.status)])
                          },
                          vue.toDisplayString(room.statusText),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "td td-action" }, [
                        vue.createElementVNode("view", { class: "action-buttons" }, [
                          vue.createElementVNode("button", {
                            class: "btn btn-edit",
                            onClick: ($event) => $options.navigateToEdit(room.id)
                          }, [
                            vue.createElementVNode("text", { class: "btn-text" }, "编辑")
                          ], 8, ["onClick"]),
                          vue.createElementVNode("button", {
                            class: "btn btn-delete",
                            onClick: ($event) => $options.handleDeleteRoom(room)
                          }, [
                            vue.createElementVNode("text", { class: "btn-text" }, "删除")
                          ], 8, ["onClick"])
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createCommentVNode(" 分页 "),
            vue.createElementVNode("view", { class: "pagination" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["page-btn", { disabled: $data.currentPage === 1 }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => $options.handlePageChange($data.currentPage - 1))
                },
                [
                  vue.createElementVNode("text", { class: "iconfont icon-left" }),
                  vue.createTextVNode(" 上一页 ")
                ],
                2
                /* CLASS */
              ),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.totalPages, (page) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["page-number", { active: $data.currentPage === page }]),
                    key: page,
                    onClick: ($event) => $options.handlePageChange(page)
                  }, vue.toDisplayString(page), 11, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["page-btn", { disabled: $data.currentPage === $options.totalPages }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.handlePageChange($data.currentPage + 1))
                },
                [
                  vue.createElementVNode("text", { class: "iconfont icon-right" }),
                  vue.createTextVNode(" 下一页 ")
                ],
                2
                /* CLASS */
              )
            ])
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 无数据状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("text", { class: "iconfont icon-empty" }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无会议室数据"),
                vue.createElementVNode("button", {
                  class: "add-btn",
                  onClick: _cache[5] || (_cache[5] = ($event) => $options.navigateToEdit())
                }, "添加会议室")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminRoomList = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-400ef07b"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/room/list.vue"]]);
  const _sfc_main$8 = {
    components: {
      "admin-layout": AdminLayout
    },
    data() {
      return {
        isEdit: false,
        roomId: null,
        roomForm: {
          name: "",
          capacity: "",
          location: "",
          equipment: [],
          status: "available",
          description: ""
        },
        equipmentOptions: [
          { label: "投影仪", value: "projector" },
          { label: "白板", value: "whiteboard" },
          { label: "视频会议系统", value: "video" },
          { label: "电子白板", value: "eboard" },
          { label: "HDMI接口", value: "hdmi" }
        ],
        statusOptions: [
          { label: "可用", value: "available" },
          { label: "维护中", value: "maintenance" },
          { label: "不可用", value: "unavailable" }
        ]
      };
    },
    computed: {
      statusIndex() {
        return this.statusOptions.findIndex((item) => item.value === this.roomForm.status);
      }
    },
    onLoad(options) {
      if (options.id) {
        this.isEdit = true;
        this.roomId = options.id;
        this.fetchRoomDetail();
      }
    },
    methods: {
      fetchRoomDetail() {
        uni.showLoading({
          title: "加载中..."
        });
        api.room.getRoomDetail(this.roomId).then((res) => {
          if (res && res.code === 200 && res.data) {
            const room = res.data;
            this.roomForm = {
              name: room.name || "",
              capacity: room.capacity ? room.capacity.toString() : "",
              location: room.location || "",
              equipment: this.parseEquipment(room.equipment || ""),
              status: room.status || "available",
              description: room.description || ""
            };
            formatAppLog("log", "at pages/admin/room/edit.vue:129", "获取到的会议室详情:", this.roomForm);
          } else {
            uni.showToast({
              title: (res == null ? void 0 : res.message) || "获取会议室信息失败",
              icon: "none"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/room/edit.vue:141", "获取会议室详情失败:", err);
          uni.showToast({
            title: "获取会议室信息失败",
            icon: "none"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }).finally(() => {
          uni.hideLoading();
        });
      },
      // 解析设备字符串为数组
      parseEquipment(equipmentStr) {
        if (!equipmentStr)
          return [];
        if (Array.isArray(equipmentStr))
          return equipmentStr;
        return equipmentStr.split(",").map((item) => item.trim()).filter(Boolean);
      },
      // 将设备数组格式化为字符串
      formatEquipment() {
        return this.roomForm.equipment.join(", ");
      },
      toggleEquipment(value) {
        const index = this.roomForm.equipment.indexOf(value);
        if (index === -1) {
          this.roomForm.equipment.push(value);
        } else {
          this.roomForm.equipment.splice(index, 1);
        }
      },
      statusChange(e) {
        const index = e.detail.value;
        this.roomForm.status = this.statusOptions[index].value;
      },
      validateForm() {
        if (!this.roomForm.name) {
          uni.showToast({
            title: "请输入会议室名称",
            icon: "none"
          });
          return false;
        }
        if (!this.roomForm.capacity) {
          uni.showToast({
            title: "请输入会议室容量",
            icon: "none"
          });
          return false;
        }
        if (!this.roomForm.location) {
          uni.showToast({
            title: "请输入会议室位置",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      handleSave() {
        if (!this.validateForm()) {
          return;
        }
        const roomData = {
          name: this.roomForm.name,
          capacity: parseInt(this.roomForm.capacity),
          location: this.roomForm.location,
          equipment: this.formatEquipment(),
          status: this.roomForm.status,
          description: this.roomForm.description
        };
        if (this.isEdit) {
          roomData.id = this.roomId;
        }
        uni.showLoading({
          title: "保存中..."
        });
        const apiCall = this.isEdit ? api.room.updateRoom(roomData) : api.room.createRoom(roomData);
        apiCall.then((res) => {
          if (res && res.code === 200) {
            uni.showToast({
              title: this.isEdit ? "编辑成功" : "添加成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              }
            });
          } else {
            uni.showToast({
              title: (res == null ? void 0 : res.message) || "保存失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/room/edit.vue:259", "保存会议室失败:", err);
          uni.showToast({
            title: "保存失败，请稍后重试",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
        });
      },
      handleCancel() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: $data.isEdit ? "编辑会议室" : "添加会议室",
      "active-path": "/pages/admin/room/list",
      "parent-path": "/pages/admin/room/list",
      "parent-title": "会议室管理"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "room-edit-container" }, [
          vue.createElementVNode("view", { class: "edit-card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode(
                "text",
                { class: "header-title" },
                vue.toDisplayString($data.isEdit ? "编辑会议室" : "添加会议室"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "card-body" }, [
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "会议室名称"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "text",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.roomForm.name = $event),
                    placeholder: "请输入会议室名称"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.roomForm.name]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "容量（人数）"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.roomForm.capacity = $event),
                    placeholder: "请输入会议室容量"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.roomForm.capacity]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "位置"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "text",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.roomForm.location = $event),
                    placeholder: "请输入会议室位置"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.roomForm.location]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "设备"),
                vue.createElementVNode("view", { class: "checkbox-group" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.equipmentOptions, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "checkbox-item",
                        key: index
                      }, [
                        vue.createElementVNode("checkbox", {
                          checked: $data.roomForm.equipment.includes(item.value),
                          onClick: ($event) => $options.toggleEquipment(item.value)
                        }, null, 8, ["checked", "onClick"]),
                        vue.createElementVNode(
                          "text",
                          { class: "checkbox-label" },
                          vue.toDisplayString(item.label),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "状态"),
                vue.createElementVNode("picker", {
                  onChange: _cache[3] || (_cache[3] = (...args) => $options.statusChange && $options.statusChange(...args)),
                  value: $options.statusIndex,
                  range: $data.statusOptions,
                  "range-key": "label",
                  class: "form-picker"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-value" },
                    vue.toDisplayString($data.statusOptions[$options.statusIndex].label),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "描述"),
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    class: "form-textarea",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.roomForm.description = $event),
                    placeholder: "请输入会议室描述信息"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.roomForm.description]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-actions" }, [
                vue.createElementVNode("button", {
                  class: "btn-save",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.handleSave && $options.handleSave(...args))
                }, "保存"),
                vue.createElementVNode("button", {
                  class: "btn-cancel",
                  onClick: _cache[6] || (_cache[6] = (...args) => $options.handleCancel && $options.handleCancel(...args))
                }, "取消")
              ])
            ])
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["title"]);
  }
  const PagesAdminRoomEdit = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/room/edit.vue"]]);
  const _sfc_main$7 = {
    components: {
      AdminLayout
    },
    data() {
      return {
        filterDate: "",
        timeRangeIndex: 0,
        statusIndex: 0,
        timeRangeOptions: [
          { label: "全部时间", value: "", startValue: "00:00:00", endValue: "23:59:59" },
          { label: "上午 (0:00:00-12:00:00)", value: "morning", startValue: "00:00:00", endValue: "12:00:00" },
          { label: "下午 (13:00:00-18:00:00)", value: "afternoon", startValue: "13:00:00", endValue: "18:00:00" },
          { label: "晚上 (18:00:00-24:00:00)", value: "evening", startValue: "18:00:00", endValue: "23:59:59" }
        ],
        statusOptions: [
          { label: "全部状态", value: "" },
          { label: "待审核", value: "待审核" },
          { label: "已通过", value: "已通过" },
          { label: "已拒绝", value: "拒绝" },
          { label: "已取消", value: "取消" }
        ],
        meetings: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: false
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.pageSize);
      }
    },
    onLoad(options) {
      if (options && options.status) {
        const statusIndex = this.statusOptions.findIndex((item) => item.value === options.status);
        if (statusIndex !== -1) {
          this.statusIndex = statusIndex;
        }
      }
      this.fetchMeetingList();
    },
    onPullDownRefresh() {
      this.fetchMeetingList();
    },
    methods: {
      fetchMeetingList() {
        this.loading = true;
        uni.showLoading({
          title: "加载中..."
        });
        const params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize
        };
        api.meeting.getMeetings(params).then((res) => {
          if (res && res.code === 200 && res.data) {
            if (res.data) {
              const filteredMeetings = res.data.filter((meeting2) => {
                if (this.filterDate) {
                  const meetingDate = new Date(meeting2.reserveDate);
                  const filterDate = new Date(this.filterDate);
                  if (meetingDate.toDateString() !== filterDate.toDateString()) {
                    return false;
                  }
                }
                if (this.timeRangeIndex > 0) {
                  const meetingTime = /* @__PURE__ */ new Date(`${meeting2.reserveDate} ${meeting2.startTime}`);
                  const timeRange = this.timeRangeOptions[this.timeRangeIndex];
                  const startTime = /* @__PURE__ */ new Date(`${meeting2.reserveDate} ${timeRange.startValue}`);
                  const endTime = /* @__PURE__ */ new Date(`${meeting2.reserveDate} ${timeRange.endValue}`);
                  if (meetingTime < startTime || meetingTime > endTime) {
                    return false;
                  }
                }
                if (this.statusOptions[this.statusIndex].value) {
                  if (meeting2.status !== this.statusOptions[this.statusIndex].value) {
                    return false;
                  }
                }
                return true;
              });
              const currentFilter = {
                date: this.filterDate,
                timeRange: this.timeRangeOptions[this.timeRangeIndex].value,
                status: this.statusOptions[this.statusIndex].value
              };
              formatAppLog("log", "at pages/admin/meeting/list.vue:217", "当前筛选条件:", currentFilter);
              this.meetings = filteredMeetings.map(this.formatMeeting);
              this.total = filteredMeetings.length;
            }
            formatAppLog("log", "at pages/admin/meeting/list.vue:223", "获取到的会议列表:", this.meetings);
          } else {
            formatAppLog("warn", "at pages/admin/meeting/list.vue:225", "获取会议列表失败:", res);
            this.meetings = [];
            this.total = 0;
            uni.showToast({
              title: (res == null ? void 0 : res.message) || "获取会议列表失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/meeting/list.vue:235", "获取会议列表异常:", err);
          this.meetings = [];
          this.total = 0;
          uni.showToast({
            title: "获取会议列表失败，请稍后重试",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.loading = false;
        });
      },
      // 格式化会议数据
      formatMeeting(meeting2) {
        return {
          id: meeting2.id,
          title: meeting2.topic || "未命名会议",
          room: meeting2.room || "未知会议室",
          time: `${meeting2.reserveDate || ""} ${meeting2.startTime || ""} - ${meeting2.endTime || ""}`,
          user: meeting2.booker || meeting2.creator || "未知预约人",
          status: meeting2.status,
          statusText: this.getStatusText(meeting2.status)
        };
      },
      // 获取状态文本
      getStatusText(status) {
        const statusTextMap = {
          "待审核": "待审核",
          "已通过": "已通过",
          "已拒绝": "已拒绝",
          "已取消": "已取消"
        };
        return statusTextMap[status] || status;
      },
      dateChange(e) {
        this.filterDate = e.detail.value;
        this.fetchMeetingList();
      },
      timeRangeChange(e) {
        this.timeRangeIndex = e.detail.value;
        this.fetchMeetingList();
      },
      statusChange(e) {
        this.statusIndex = e.detail.value;
        this.fetchMeetingList();
      },
      navigateToDetail(id) {
        uni.navigateTo({
          url: `/pages/admin/meeting/detail?id=${id}`
        });
      },
      handleApprove(meeting2) {
        uni.showModal({
          title: "确认通过",
          content: `确定要通过"${meeting2.title}"的会议申请吗？`,
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "处理中..."
              });
              api.meeting.approveReservation(meeting2.id, true).then((res2) => {
                if (res2 && res2.code === 200) {
                  uni.showToast({
                    title: "已通过审批",
                    icon: "success"
                  });
                  this.fetchMeetingList();
                } else {
                  uni.showToast({
                    title: res2 == null ? void 0 : res2.msg,
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/admin/meeting/list.vue:318", "审批失败:", err);
                uni.showToast({
                  title: "审批失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      handleReject(meeting2) {
        uni.showModal({
          title: "确认拒绝",
          content: `确定要拒绝"${meeting2.title}"的会议申请吗？`,
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "处理中..."
              });
              api.meeting.approveReservation(meeting2.id, false).then((res2) => {
                if (res2 && res2.code === 200) {
                  uni.showToast({
                    title: "已拒绝申请",
                    icon: "success"
                  });
                  this.fetchMeetingList();
                } else {
                  uni.showToast({
                    title: res2 == null ? void 0 : res2.msg,
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/admin/meeting/list.vue:359", "拒绝失败:", err);
                uni.showToast({
                  title: "拒绝失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      handleCancel(meeting2) {
        uni.showModal({
          title: "确认取消",
          content: `确定要取消"${meeting2.title}"的会议吗？`,
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "处理中..."
              });
              api.meeting.adminCancelMeeting(meeting2.id).then((res2) => {
                if (res2 && res2.code === 200) {
                  uni.showToast({
                    title: "已取消会议",
                    icon: "success"
                  });
                  this.fetchMeetingList();
                } else {
                  uni.showToast({
                    title: res2 == null ? void 0 : res2.msg,
                    icon: "none"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/admin/meeting/list.vue:400", "取消失败:", err);
                uni.showToast({
                  title: "取消失败，请稍后重试",
                  icon: "none"
                });
              }).finally(() => {
                uni.hideLoading();
              });
            }
          }
        });
      },
      handlePageChange(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
          return;
        }
        this.currentPage = page;
        this.fetchMeetingList();
      },
      getStatusClass(status) {
        const statusMap = {
          "待审核": "badge-warning",
          "已通过": "badge-success",
          "已拒绝": "badge-danger",
          "已取消": "badge-secondary"
        };
        return statusMap[status] || "badge-secondary";
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "会议管理",
      description: "查看和管理所有会议预约，可进行审批和取消操作",
      "active-path": "/pages/admin/meeting/list"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "meeting-list-container" }, [
          vue.createCommentVNode(" 过滤条件 "),
          vue.createElementVNode("view", { class: "filter-bar" }, [
            vue.createElementVNode("view", { class: "filter-item" }, [
              vue.createElementVNode("text", { class: "filter-label" }, "日期"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.filterDate,
                onChange: _cache[0] || (_cache[0] = (...args) => $options.dateChange && $options.dateChange(...args)),
                class: "filter-picker"
              }, [
                vue.createElementVNode("view", { class: "picker-value" }, [
                  $data.filterDate ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    { key: 0 },
                    vue.toDisplayString($data.filterDate),
                    1
                    /* TEXT */
                  )) : (vue.openBlock(), vue.createElementBlock("text", {
                    key: 1,
                    class: "placeholder"
                  }, "选择日期"))
                ])
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "filter-item" }, [
              vue.createElementVNode("text", { class: "filter-label" }, "时间段"),
              vue.createElementVNode("picker", {
                value: $data.timeRangeIndex,
                range: $data.timeRangeOptions,
                "range-key": "label",
                onChange: _cache[1] || (_cache[1] = (...args) => $options.timeRangeChange && $options.timeRangeChange(...args)),
                class: "filter-picker"
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.timeRangeOptions[$data.timeRangeIndex].label),
                  1
                  /* TEXT */
                )
              ], 40, ["value", "range"])
            ]),
            vue.createElementVNode("view", { class: "filter-item" }, [
              vue.createElementVNode("text", { class: "filter-label" }, "状态"),
              vue.createElementVNode("picker", {
                value: $data.statusIndex,
                range: $data.statusOptions,
                "range-key": "label",
                onChange: _cache[2] || (_cache[2] = (...args) => $options.statusChange && $options.statusChange(...args)),
                class: "filter-picker"
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.statusOptions[$data.statusIndex].label),
                  1
                  /* TEXT */
                )
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createCommentVNode(" 会议列表 "),
          $data.meetings.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "meeting-list"
          }, [
            vue.createElementVNode("view", { class: "table" }, [
              vue.createElementVNode("view", { class: "table-header" }, [
                vue.createElementVNode("text", { class: "th th-id" }, "ID"),
                vue.createElementVNode("text", { class: "th th-title" }, "会议名称"),
                vue.createElementVNode("text", { class: "th th-room" }, "会议室"),
                vue.createElementVNode("text", { class: "th th-time" }, "时间"),
                vue.createElementVNode("text", { class: "th th-user" }, "预约人"),
                vue.createElementVNode("text", { class: "th th-status" }, "状态"),
                vue.createElementVNode("text", { class: "th th-action" }, "操作")
              ]),
              vue.createElementVNode("view", { class: "table-body" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.meetings, (meeting2, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "table-row",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "td td-id" },
                        vue.toDisplayString(meeting2.id),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-title" },
                        vue.toDisplayString(meeting2.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-room" },
                        vue.toDisplayString(meeting2.room),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-time" },
                        vue.toDisplayString(meeting2.time),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "td td-user" },
                        vue.toDisplayString(meeting2.user),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "td td-status" }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass(["badge", $options.getStatusClass(meeting2.status)])
                          },
                          vue.toDisplayString(meeting2.statusText),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "td td-action" }, [
                        vue.createElementVNode("view", { class: "action-buttons" }, [
                          vue.createElementVNode("button", {
                            class: "btn btn-view",
                            onClick: ($event) => $options.navigateToDetail(meeting2.id)
                          }, [
                            vue.createElementVNode("text", { class: "btn-text" }, "查看")
                          ], 8, ["onClick"]),
                          meeting2.status === "待审核" ? (vue.openBlock(), vue.createElementBlock("button", {
                            key: 0,
                            class: "btn btn-approve",
                            onClick: ($event) => $options.handleApprove(meeting2)
                          }, [
                            vue.createElementVNode("text", { class: "btn-text" }, "通过")
                          ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                          meeting2.status === "待审核" ? (vue.openBlock(), vue.createElementBlock("button", {
                            key: 1,
                            class: "btn btn-reject",
                            onClick: ($event) => $options.handleReject(meeting2)
                          }, [
                            vue.createElementVNode("text", { class: "btn-text" }, "拒绝")
                          ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                          meeting2.status === "已通过" ? (vue.openBlock(), vue.createElementBlock("button", {
                            key: 2,
                            class: "btn btn-cancel",
                            onClick: ($event) => $options.handleCancel(meeting2)
                          }, [
                            vue.createElementVNode("text", { class: "btn-text" }, "取消")
                          ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createCommentVNode(" 分页 "),
            vue.createElementVNode("view", { class: "pagination" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["page-btn", { disabled: $data.currentPage === 1 }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => $options.handlePageChange($data.currentPage - 1))
                },
                [
                  vue.createElementVNode("text", { class: "iconfont icon-left" }),
                  vue.createTextVNode(" 上一页 ")
                ],
                2
                /* CLASS */
              ),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.totalPages, (page) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["page-number", { active: $data.currentPage === page }]),
                    key: page,
                    onClick: ($event) => $options.handlePageChange(page)
                  }, vue.toDisplayString(page), 11, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["page-btn", { disabled: $data.currentPage === $options.totalPages }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.handlePageChange($data.currentPage + 1))
                },
                [
                  vue.createElementVNode("text", { class: "iconfont icon-right" }),
                  vue.createTextVNode(" 下一页 ")
                ],
                2
                /* CLASS */
              )
            ])
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 无数据状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("text", { class: "iconfont icon-empty" }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无会议数据")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminMeetingList = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-7f544613"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/meeting/list.vue"]]);
  const _sfc_main$6 = {
    components: {
      AdminLayout
    },
    data() {
      return {
        id: null,
        loading: false,
        meeting: {
          id: "",
          title: "",
          date: "",
          time: "",
          room: "",
          user: "",
          department: "",
          purpose: "",
          status: "",
          statusText: "",
          attendees: [],
          equipment: [],
          remark: "",
          approvalInfo: null
        }
      };
    },
    onLoad(options) {
      if (options.id) {
        this.id = options.id;
        this.fetchMeetingDetail();
      } else {
        uni.showToast({
          title: "缺少会议ID",
          icon: "none"
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    methods: {
      fetchMeetingDetail() {
        return __async(this, null, function* () {
          this.loading = true;
          uni.showLoading({
            title: "加载中..."
          });
          try {
            const targetId = Number(this.id);
            formatAppLog("log", "at pages/admin/meeting/detail.vue:165", "正在查找ID为", targetId, "的会议");
            const response = yield apiRequest.getReservations({
              pageSize: 100,
              // 设置较大的页码，提高找到目标会议的概率
              sortBy: "id"
            });
            if (response.code === 200 && response.data && response.data.list) {
              const meetingList = response.data.list;
              formatAppLog("log", "at pages/admin/meeting/detail.vue:176", "获取到", meetingList.length, "个会议，开始查找ID:", targetId);
              const targetMeeting = meetingList.find(
                (m) => m.id === targetId || m.id === this.id || String(m.id) === this.id
              );
              if (targetMeeting) {
                formatAppLog("log", "at pages/admin/meeting/detail.vue:184", "找到匹配的会议:", targetMeeting);
                let participants = [];
                try {
                  const participantsResponse = yield apiRequest.getParticipants(this.id);
                  if (participantsResponse.code === 200 && participantsResponse.data) {
                    participants = participantsResponse.data;
                  }
                } catch (err) {
                  formatAppLog("error", "at pages/admin/meeting/detail.vue:194", "获取参会人员失败:", err);
                }
                this.meeting = {
                  id: targetMeeting.id,
                  title: targetMeeting.topic || targetMeeting.title || "无标题会议",
                  date: targetMeeting.reserveDate || targetMeeting.date || "",
                  time: `${targetMeeting.startTime || ""} - ${targetMeeting.endTime || ""}`,
                  room: targetMeeting.roomName || targetMeeting.room || "",
                  user: targetMeeting.booker || targetMeeting.reservationUser || targetMeeting.username || "",
                  department: targetMeeting.department || "",
                  purpose: targetMeeting.description || targetMeeting.purpose || "",
                  status: this.getStatusFromMeeting(targetMeeting),
                  attendees: participants.map((p) => ({
                    name: p.name || p.username || "",
                    department: p.department || "",
                    role: p.role || ""
                  })),
                  equipment: targetMeeting.equipment || [],
                  remark: targetMeeting.remark || "",
                  approvalInfo: targetMeeting.approvalInfo || null
                };
              } else {
                formatAppLog("error", "at pages/admin/meeting/detail.vue:218", "未找到ID为", targetId, "的会议");
                uni.showToast({
                  title: "未找到会议",
                  icon: "none"
                });
              }
            } else {
              uni.showToast({
                title: response.message || "获取会议列表失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/meeting/detail.vue:231", "获取会议详情失败:", error);
            uni.showToast({
              title: "获取会议详情失败",
              icon: "none"
            });
          } finally {
            this.loading = false;
            uni.hideLoading();
          }
        });
      },
      // 从会议数据中获取状态
      getStatusFromMeeting(meeting2) {
        formatAppLog("log", "at pages/admin/meeting/detail.vue:244", "会议完整状态数据:", {
          status: meeting2.status,
          isActive: meeting2.isActive
        });
        if (typeof meeting2.status === "string" && meeting2.status) {
          return meeting2.status;
        }
        if (meeting2.isActive !== void 0 && meeting2.isActive !== null) {
          if (meeting2.isActive === 0)
            return "已通过";
          if (meeting2.isActive === 1)
            return "待审核";
          if (meeting2.isActive === 2)
            return "已拒绝";
          if (meeting2.isActive === 3)
            return "已取消";
          if (typeof meeting2.isActive === "number") {
            const statusMap = {
              0: "已通过",
              1: "待审核",
              2: "已拒绝",
              3: "已取消"
            };
            return statusMap[meeting2.isActive] || "待审核";
          }
        }
        if (typeof meeting2.status === "number") {
          const statusMap = {
            0: "待审核",
            1: "已通过",
            2: "已拒绝",
            3: "已取消"
          };
          return statusMap[meeting2.status] || "待审核";
        }
        return "待审核";
      },
      getStatusClass(status) {
        const statusMap = {
          "待审核": "badge-warning",
          "已通过": "badge-success",
          "已拒绝": "badge-danger",
          "已取消": "badge-secondary",
          "进行中": "badge-info",
          "已完成": "badge-primary"
        };
        return statusMap[status] || "badge-secondary";
      },
      handleApprove() {
        return __async(this, null, function* () {
          try {
            yield uni.showModal({
              title: "确认通过",
              content: `确定要通过"${this.meeting.title}"的会议申请吗？`
            });
            uni.showLoading({
              title: "处理中..."
            });
            const response = yield apiRequest.approveReservation(this.id, true);
            if (response.code === 200) {
              uni.showToast({
                title: "已通过申请",
                icon: "success"
              });
              setTimeout(() => {
                this.fetchMeetingDetail();
              }, 500);
            } else {
              uni.showToast({
                title: response.msg,
                icon: "none"
              });
            }
          } catch (error) {
            if (error.errMsg !== "showModal:fail cancel") {
              uni.showToast({
                title: "操作失败",
                icon: "none"
              });
              formatAppLog("error", "at pages/admin/meeting/detail.vue:332", "审批失败:", error);
            }
          } finally {
            uni.hideLoading();
          }
        });
      },
      handleReject() {
        return __async(this, null, function* () {
          try {
            yield uni.showModal({
              title: "确认拒绝",
              content: `确定要拒绝"${this.meeting.title}"的会议申请吗？`
            });
            uni.showLoading({
              title: "处理中..."
            });
            const response = yield apiRequest.approveReservation(this.id, false);
            if (response.code === 200) {
              uni.showToast({
                title: "已拒绝申请",
                icon: "success"
              });
              setTimeout(() => {
                this.fetchMeetingDetail();
              }, 500);
            } else {
              uni.showToast({
                title: response.msg,
                icon: "none"
              });
            }
          } catch (error) {
            if (error.errMsg !== "showModal:fail cancel") {
              uni.showToast({
                title: "操作失败",
                icon: "none"
              });
              formatAppLog("error", "at pages/admin/meeting/detail.vue:372", "拒绝失败:", error);
            }
          } finally {
            uni.hideLoading();
          }
        });
      },
      handleCancel() {
        return __async(this, null, function* () {
          try {
            yield uni.showModal({
              title: "确认取消",
              content: `确定要取消"${this.meeting.title}"的会议吗？`
            });
            uni.showLoading({
              title: "处理中..."
            });
            const response = yield apiRequest.cancelReservation(this.id);
            if (response.code === 200) {
              uni.showToast({
                title: "已取消会议",
                icon: "success"
              });
              setTimeout(() => {
                this.fetchMeetingDetail();
              }, 500);
            } else {
              uni.showToast({
                title: response.msg || "操作失败",
                icon: "none"
              });
            }
          } catch (error) {
            if (error.errMsg !== "showModal:fail cancel") {
              uni.showToast({
                title: "操作失败",
                icon: "none"
              });
              formatAppLog("error", "at pages/admin/meeting/detail.vue:412", "取消失败:", error);
            }
          } finally {
            uni.hideLoading();
          }
        });
      },
      handleBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "会议详情",
      "active-path": "/pages/admin/meeting/list",
      "parent-path": "/pages/admin/meeting/list",
      "parent-title": "会议列表"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "meeting-detail-container" }, [
          vue.createElementVNode("view", { class: "detail-card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode("text", { class: "card-header-title" }, "会议详情"),
              vue.createElementVNode("view", { class: "header-actions" }, [
                vue.createElementVNode("button", {
                  class: "btn-back",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
                }, "返回列表"),
                vue.createElementVNode("view", { class: "header-status" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["badge", $options.getStatusClass($data.meeting.status)])
                    },
                    vue.toDisplayString($data.meeting.status),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ])
            ]),
            vue.createCommentVNode(" 会议基本信息 "),
            vue.createElementVNode("view", { class: "card-body" }, [
              vue.createElementVNode("view", { class: "detail-title" }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($data.meeting.title),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-group" }, [
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "会议时间"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.date) + " " + vue.toDisplayString($data.meeting.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "会议室"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.room),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "预约人"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.user),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "参会人数"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.attendees.length) + "人",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item full-width" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "会议目的"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.purpose),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createCommentVNode(" 参会人员信息 "),
              vue.createElementVNode("view", { class: "section-title" }, "参会人员"),
              vue.createElementVNode("view", { class: "attendees-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.meeting.attendees, (attendee, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "attendee-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "attendee-name" },
                        vue.toDisplayString(attendee.name),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createCommentVNode(" 会议设备需求 "),
              vue.createElementVNode("view", { class: "section-title" }, "设备需求"),
              vue.createElementVNode("view", { class: "equipment-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.meeting.equipment, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "equipment-item",
                      key: index
                    }, [
                      vue.createElementVNode("text", { class: "iconfont icon-check equipment-icon" }),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $data.meeting.equipment.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "no-data"
                }, [
                  vue.createElementVNode("text", null, "无特殊设备需求")
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createCommentVNode(" 备注信息 "),
              vue.createElementVNode("view", { class: "section-title" }, "备注信息"),
              vue.createElementVNode("view", { class: "remark-content" }, [
                $data.meeting.remark ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  vue.toDisplayString($data.meeting.remark),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "no-data"
                }, "无备注信息"))
              ]),
              vue.createCommentVNode(" 审批状态信息 "),
              $data.meeting.approvalInfo ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "approval-info"
              }, [
                vue.createElementVNode("view", { class: "section-title" }, "审批信息"),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "审批人"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.approvalInfo.approver),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-item" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "审批时间"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.approvalInfo.time),
                    1
                    /* TEXT */
                  )
                ]),
                $data.meeting.approvalInfo.comment ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "info-item full-width"
                }, [
                  vue.createElementVNode("text", { class: "info-label" }, "审批备注"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($data.meeting.approvalInfo.comment),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createCommentVNode(" 操作按钮 "),
            $data.meeting.status === "待审核" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "card-footer"
            }, [
              vue.createElementVNode("button", {
                class: "btn-approve",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleApprove && $options.handleApprove(...args))
              }, "通过申请"),
              vue.createElementVNode("button", {
                class: "btn-reject",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleReject && $options.handleReject(...args))
              }, "拒绝申请")
            ])) : vue.createCommentVNode("v-if", true),
            $data.meeting.status === "已通过" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "card-footer"
            }, [
              vue.createElementVNode("button", {
                class: "btn-cancel",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.handleCancel && $options.handleCancel(...args))
              }, "取消会议")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminMeetingDetail = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/meeting/detail.vue"]]);
  const _sfc_main$5 = {
    components: {
      AdminLayout
    },
    data() {
      return {
        users: [],
        currentPage: 1,
        pageSize: 10,
        hasMore: true,
        searchQuery: "",
        loading: false
      };
    },
    onLoad() {
      this.loadUsers();
    },
    methods: {
      loadUsers() {
        return __async(this, null, function* () {
          this.loading = true;
          try {
            const res = yield api.user.getUserList({
              pageNo: this.currentPage,
              pageSize: this.pageSize,
              userName: this.searchQuery
            });
            if (res.code === 200 && res.data) {
              this.users = res.data.list || [];
              this.hasMore = res.data.list && res.data.list.length === this.pageSize;
            } else {
              this.users = [];
              this.hasMore = false;
              uni.showToast({
                title: res.message || "获取用户列表失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/user/list.vue:125", "获取用户列表失败:", error);
            this.users = [];
            this.hasMore = false;
            uni.showToast({
              title: "获取用户列表失败",
              icon: "none"
            });
          } finally {
            this.loading = false;
          }
        });
      },
      handleSearch() {
        this.currentPage = 1;
        this.loadUsers();
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.loadUsers();
      },
      handleAdd() {
        uni.navigateTo({
          url: "/pages/admin/user/edit"
        });
      },
      handleToggleStatus(user2) {
        return __async(this, null, function* () {
          try {
            const res = yield api.user.updateUserStatus(user2.id, user2.status === 1 ? 0 : 1);
            if (res.code === 200) {
              uni.showToast({
                title: "操作成功",
                icon: "success"
              });
              this.loadUsers();
            } else {
              uni.showToast({
                title: res.message || "操作失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/admin/user/list.vue:165", "更新用户状态失败:", error);
            uni.showToast({
              title: "操作失败",
              icon: "none"
            });
          }
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "用户管理",
      description: "管理系统用户，可添加、编辑和禁用用户",
      "active-path": "/pages/admin/user/list"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "user-list-container" }, [
          vue.createCommentVNode(" 操作栏 "),
          vue.createElementVNode("view", { class: "action-bar" }, [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.createElementVNode("text", { class: "iconfont icon-search" }),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchQuery = $event),
                  placeholder: "搜索用户",
                  onInput: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.searchQuery]
              ])
            ]),
            vue.createElementVNode("view", { class: "button-group" }, [
              vue.createElementVNode("button", {
                class: "btn-primary",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleAdd && $options.handleAdd(...args))
              }, [
                vue.createElementVNode("text", { class: "iconfont icon-add" }),
                vue.createTextVNode(" 添加用户 ")
              ])
            ])
          ]),
          vue.createCommentVNode(" 用户表格 "),
          vue.createElementVNode("view", { class: "table-container" }, [
            vue.createElementVNode("view", { class: "table" }, [
              vue.createElementVNode("view", { class: "table-header" }, [
                vue.createElementVNode("view", { class: "th" }, "用户名"),
                vue.createElementVNode("view", { class: "th" }, "姓名"),
                vue.createElementVNode("view", { class: "th" }, "邮箱"),
                vue.createElementVNode("view", { class: "th" }, "状态"),
                vue.createElementVNode("view", { class: "th" }, "操作")
              ]),
              vue.createElementVNode("view", { class: "table-body" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.users, (user2) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "tr",
                      key: user2.id
                    }, [
                      vue.createElementVNode(
                        "view",
                        { class: "td" },
                        vue.toDisplayString(user2.username),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "td" },
                        vue.toDisplayString(user2.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "td" },
                        vue.toDisplayString(user2.email),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "td" }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass(["status-tag", user2.status === 1 ? "active" : "inactive"])
                          },
                          vue.toDisplayString("启用"),
                          2
                          /* CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "td" }, [
                        vue.createElementVNode("view", { class: "action-buttons" }, [
                          vue.createElementVNode("button", {
                            class: "btn-small",
                            onClick: ($event) => $options.handleToggleStatus(user2)
                          }, vue.toDisplayString("禁用"), 8, ["onClick"])
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createCommentVNode(" 分页 "),
          vue.createElementVNode("view", { class: "pagination" }, [
            vue.createElementVNode("button", {
              class: "btn-page",
              disabled: $data.currentPage === 1,
              onClick: _cache[3] || (_cache[3] = ($event) => $options.handlePageChange($data.currentPage - 1))
            }, [
              vue.createElementVNode("text", { class: "iconfont icon-arrow-left" }),
              vue.createTextVNode(" 上一页 ")
            ], 8, ["disabled"]),
            vue.createElementVNode(
              "text",
              { class: "page-info" },
              "第 " + vue.toDisplayString($data.currentPage) + " 页",
              1
              /* TEXT */
            ),
            vue.createElementVNode("button", {
              class: "btn-page",
              disabled: !$data.hasMore,
              onClick: _cache[4] || (_cache[4] = ($event) => $options.handlePageChange($data.currentPage + 1))
            }, [
              vue.createTextVNode(" 下一页 "),
              vue.createElementVNode("text", { class: "iconfont icon-arrow-right" })
            ], 8, ["disabled"])
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminUserList = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-3ebb457e"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/user/list.vue"]]);
  const _sfc_main$4 = {
    components: {
      "admin-layout": AdminLayout
    },
    data() {
      return {
        isEdit: false,
        userId: null,
        userForm: {
          name: "",
          username: "",
          password: "",
          confirmPassword: "",
          phone: "",
          email: "",
          department: "dev",
          role: "user",
          status: "active",
          remark: ""
        },
        departmentOptions: [
          { label: "研发部", value: "dev" },
          { label: "产品部", value: "product" },
          { label: "设计部", value: "design" },
          { label: "测试部", value: "qa" },
          { label: "市场部", value: "market" },
          { label: "人事部", value: "hr" }
        ],
        roleOptions: [
          { label: "普通用户", value: "user" },
          { label: "部门管理员", value: "dept_admin" },
          { label: "系统管理员", value: "sys_admin" }
        ],
        statusOptions: [
          { label: "正常", value: "active" },
          { label: "禁用", value: "disabled" }
        ]
      };
    },
    computed: {
      departmentIndex() {
        return this.departmentOptions.findIndex((item) => item.value === this.userForm.department);
      },
      roleIndex() {
        return this.roleOptions.findIndex((item) => item.value === this.userForm.role);
      },
      statusIndex() {
        return this.statusOptions.findIndex((item) => item.value === this.userForm.status);
      }
    },
    onLoad(options) {
      if (options.id) {
        this.isEdit = true;
        this.userId = options.id;
        this.fetchUserDetail();
      }
    },
    methods: {
      fetchUserDetail() {
        uni.showLoading({
          title: "加载中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          const userMap = {
            "1": {
              name: "张三",
              username: "zhangsan",
              phone: "13800138001",
              email: "zhangsan@example.com",
              department: "dev",
              role: "dept_admin",
              status: "active",
              remark: "研发部门管理员"
            },
            "2": {
              name: "李四",
              username: "lisi",
              phone: "13800138002",
              email: "lisi@example.com",
              department: "dev",
              role: "user",
              status: "active",
              remark: "前端开发工程师"
            },
            "3": {
              name: "王五",
              username: "wangwu",
              phone: "13800138003",
              email: "wangwu@example.com",
              department: "product",
              role: "dept_admin",
              status: "active",
              remark: "产品部门管理员"
            },
            "4": {
              name: "赵六",
              username: "zhaoliu",
              phone: "13800138004",
              email: "zhaoliu@example.com",
              department: "design",
              role: "dept_admin",
              status: "active",
              remark: "设计部门管理员"
            },
            "5": {
              name: "钱七",
              username: "qianqi",
              phone: "13800138005",
              email: "qianqi@example.com",
              department: "qa",
              role: "user",
              status: "disabled",
              remark: "测试工程师"
            }
          };
          if (userMap[this.userId]) {
            this.userForm = __spreadValues({}, userMap[this.userId]);
          } else {
            uni.showToast({
              title: "用户不存在",
              icon: "none"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        }, 500);
      },
      departmentChange(e) {
        const index = e.detail.value;
        this.userForm.department = this.departmentOptions[index].value;
      },
      roleChange(e) {
        const index = e.detail.value;
        this.userForm.role = this.roleOptions[index].value;
      },
      statusChange(e) {
        const index = e.detail.value;
        this.userForm.status = this.statusOptions[index].value;
      },
      validateForm() {
        if (!this.userForm.name) {
          uni.showToast({
            title: "请输入姓名",
            icon: "none"
          });
          return false;
        }
        if (!this.userForm.username) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return false;
        }
        if (!this.isEdit) {
          if (!this.userForm.password) {
            uni.showToast({
              title: "请输入密码",
              icon: "none"
            });
            return false;
          }
          if (this.userForm.password !== this.userForm.confirmPassword) {
            uni.showToast({
              title: "两次密码输入不一致",
              icon: "none"
            });
            return false;
          }
        }
        if (this.userForm.phone && !/^1\d{10}$/.test(this.userForm.phone)) {
          uni.showToast({
            title: "手机号码格式不正确",
            icon: "none"
          });
          return false;
        }
        if (this.userForm.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.userForm.email)) {
          uni.showToast({
            title: "邮箱格式不正确",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      handleSave() {
        if (!this.validateForm()) {
          return;
        }
        uni.showLoading({
          title: "保存中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: this.isEdit ? "编辑成功" : "添加成功",
            icon: "success",
            success: () => {
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            }
          });
        }, 800);
      },
      handleCancel() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: $data.isEdit ? "编辑用户" : "添加用户",
      "active-path": "/pages/admin/user/list",
      "parent-path": "/pages/admin/user/list",
      "parent-title": "用户管理"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "user-edit-container" }, [
          vue.createElementVNode("view", { class: "edit-card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode(
                "text",
                { class: "header-title" },
                vue.toDisplayString($data.isEdit ? "编辑用户" : "添加用户"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "card-body" }, [
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "姓名"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "text",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.userForm.name = $event),
                    placeholder: "请输入姓名"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.userForm.name]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "用户名"),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "form-input",
                  type: "text",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.userForm.username = $event),
                  placeholder: "请输入用户名",
                  disabled: $data.isEdit
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.userForm.username]
                ]),
                $data.isEdit ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "form-tips"
                }, "用户名不可修改")) : vue.createCommentVNode("v-if", true)
              ]),
              !$data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "form-group"
              }, [
                vue.createElementVNode("text", { class: "form-label" }, "密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "password",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.userForm.password = $event),
                    placeholder: "请输入密码",
                    password: ""
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.userForm.password]
                ])
              ])) : vue.createCommentVNode("v-if", true),
              !$data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "form-group"
              }, [
                vue.createElementVNode("text", { class: "form-label" }, "确认密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "password",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.userForm.confirmPassword = $event),
                    placeholder: "请再次输入密码",
                    password: ""
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.userForm.confirmPassword]
                ])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "手机号码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.userForm.phone = $event),
                    placeholder: "请输入手机号码",
                    maxlength: "11"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.userForm.phone]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "邮箱"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "text",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.userForm.email = $event),
                    placeholder: "请输入邮箱地址"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.userForm.email]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "部门"),
                vue.createElementVNode("picker", {
                  onChange: _cache[6] || (_cache[6] = (...args) => $options.departmentChange && $options.departmentChange(...args)),
                  value: $options.departmentIndex,
                  range: $data.departmentOptions,
                  "range-key": "label",
                  class: "form-picker"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-value" },
                    vue.toDisplayString($data.departmentOptions[$options.departmentIndex].label),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "角色"),
                vue.createElementVNode("picker", {
                  onChange: _cache[7] || (_cache[7] = (...args) => $options.roleChange && $options.roleChange(...args)),
                  value: $options.roleIndex,
                  range: $data.roleOptions,
                  "range-key": "label",
                  class: "form-picker"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-value" },
                    vue.toDisplayString($data.roleOptions[$options.roleIndex].label),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "状态"),
                vue.createElementVNode("picker", {
                  onChange: _cache[8] || (_cache[8] = (...args) => $options.statusChange && $options.statusChange(...args)),
                  value: $options.statusIndex,
                  range: $data.statusOptions,
                  "range-key": "label",
                  class: "form-picker"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-value" },
                    vue.toDisplayString($data.statusOptions[$options.statusIndex].label),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "备注"),
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    class: "form-textarea",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.userForm.remark = $event),
                    placeholder: "请输入备注信息"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.userForm.remark]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-actions" }, [
                vue.createElementVNode("button", {
                  class: "btn-save",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.handleSave && $options.handleSave(...args))
                }, "保存"),
                vue.createElementVNode("button", {
                  class: "btn-cancel",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.handleCancel && $options.handleCancel(...args))
                }, "取消")
              ])
            ])
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    }, 8, ["title"]);
  }
  const PagesAdminUserEdit = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/user/edit.vue"]]);
  const _sfc_main$3 = {
    components: {
      AdminLayout
    },
    data() {
      return {
        timeRangeIndex: 0,
        timeRangeOptions: [
          { label: "本周", value: "week" },
          { label: "本月", value: "month" },
          { label: "上月", value: "last_month" },
          { label: "本季度", value: "quarter" },
          { label: "本年", value: "year" },
          { label: "自定义", value: "custom" }
        ],
        startDate: "",
        endDate: "",
        statistics: {
          totalMeetings: 0,
          approvalRate: 0,
          avgMeetingLength: 0,
          totalRooms: 0
        },
        statusData: [
          { name: "已通过", value: 0, percentage: 0, color: "#2ecc71" },
          { name: "已拒绝", value: 0, percentage: 0, color: "#e74c3c" },
          { name: "待审批", value: 0, percentage: 0, color: "#f39c12" }
        ],
        topRooms: [],
        topUsers: [],
        dailyMeetings: [],
        dailyYAxisValues: [0, 1, 2, 3, 4],
        roomYAxisValues: [0, 1, 2, 3, 4],
        maxDailyCount: 0,
        maxRoomMeetings: 0,
        userYAxisValues: [0, 1, 2, 3, 4],
        maxUserMeetings: 0
      };
    },
    onLoad() {
      this.fetchStatisticsData();
    },
    methods: {
      fetchStatisticsData() {
        uni.showLoading({
          title: "加载中..."
        });
        const today = /* @__PURE__ */ new Date();
        const todayStr = today.toISOString().split("T")[0];
        const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
        let startDate = todayStr;
        let endDate = todayStr;
        if (timeRange === "week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          startDate = weekStart.toISOString().split("T")[0];
        } else if (timeRange === "month") {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate = monthStart.toISOString().split("T")[0];
        } else if (timeRange === "last_month") {
          const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
          startDate = lastMonthStart.toISOString().split("T")[0];
          endDate = lastMonthEnd.toISOString().split("T")[0];
        } else if (timeRange === "quarter") {
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          startDate = quarterStart.toISOString().split("T")[0];
        } else if (timeRange === "year") {
          const yearStart = new Date(today.getFullYear(), 0, 1);
          startDate = yearStart.toISOString().split("T")[0];
        } else if (timeRange === "custom" && this.startDate && this.endDate) {
          startDate = this.startDate;
          endDate = this.endDate;
        }
        getReservations({
          pageSize: 1e3,
          // 获取足够多的数据
          pageNo: 1
        }).then((res) => {
          if (res && res.code === 200 && res.data) {
            const meetings = Array.isArray(res.data) ? res.data : res.data.list || [];
            const filteredMeetings = meetings.filter((meeting2) => {
              const meetingDate = meeting2.reserveDate;
              return meetingDate >= startDate && meetingDate <= endDate;
            });
            const totalMeetings = filteredMeetings.length;
            const approvedMeetings = filteredMeetings.filter((m) => m.status === "已通过" || m.status === "approved").length;
            const rejectedMeetings = filteredMeetings.filter((m) => m.status === "已拒绝" || m.status === "rejected").length;
            const pendingMeetings = filteredMeetings.filter((m) => m.status === "待审核" || m.status === "pending").length;
            formatAppLog("log", "at pages/admin/statistics/index.vue:315", "会议状态统计:", {
              total: totalMeetings,
              approved: approvedMeetings,
              rejected: rejectedMeetings,
              pending: pendingMeetings
            });
            let totalDuration = 0;
            let meetingsWithDuration = 0;
            filteredMeetings.forEach((meeting2) => {
              if (meeting2.startTime && meeting2.endTime) {
                const start = /* @__PURE__ */ new Date(`${meeting2.reserveDate} ${meeting2.startTime}`);
                const end = /* @__PURE__ */ new Date(`${meeting2.reserveDate} ${meeting2.endTime}`);
                const duration = (end - start) / (1e3 * 60 * 60);
                if (!isNaN(duration) && duration > 0) {
                  totalDuration += duration;
                  meetingsWithDuration++;
                }
              }
            });
            const avgMeetingLength = meetingsWithDuration > 0 ? (totalDuration / meetingsWithDuration).toFixed(1) : 0;
            this.statistics = {
              totalMeetings,
              approvalRate: totalMeetings > 0 ? Math.round(approvedMeetings / totalMeetings * 100) : 0,
              avgMeetingLength,
              totalRooms: 0
              // 需要单独获取会议室数量
            };
            this.statusData = [
              {
                name: "已通过",
                value: approvedMeetings,
                percentage: totalMeetings > 0 ? Math.round(approvedMeetings / totalMeetings * 100) : 0,
                color: "#2ecc71"
              },
              {
                name: "已拒绝",
                value: rejectedMeetings,
                percentage: totalMeetings > 0 ? Math.round(rejectedMeetings / totalMeetings * 100) : 0,
                color: "#e74c3c"
              },
              {
                name: "待审批",
                value: pendingMeetings,
                percentage: totalMeetings > 0 ? Math.round(pendingMeetings / totalMeetings * 100) : 0,
                color: "#f39c12"
              }
            ];
            this.calculateDailyMeetings(filteredMeetings);
            this.fetchRoomUsageStats(filteredMeetings);
            this.fetchUserStats(filteredMeetings);
            this.fetchTotalRooms();
          } else {
            uni.showToast({
              title: (res == null ? void 0 : res.message) || "获取预约数据失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/statistics/index.vue:388", "获取预约数据失败:", err);
          uni.showToast({
            title: "获取预约数据失败，请稍后重试",
            icon: "none"
          });
        }).finally(() => {
          uni.hideLoading();
        });
      },
      // 获取会议室使用统计
      fetchRoomUsageStats(meetings) {
        const roomUsageMap = {};
        meetings.forEach((meeting2) => {
          if (meeting2.room) {
            if (!roomUsageMap[meeting2.room]) {
              roomUsageMap[meeting2.room] = {
                name: meeting2.room || "未知会议室",
                meetings: 0
              };
            }
            roomUsageMap[meeting2.room].meetings++;
          }
        });
        this.topRooms = Object.values(roomUsageMap).sort((a, b) => b.meetings - a.meetings).slice(0, 5);
        this.maxRoomMeetings = Math.max(...this.topRooms.map((room) => room.meetings), 1);
        this.roomYAxisValues = this.generateYAxisValues(this.maxRoomMeetings);
        this.statistics.totalRooms = Object.keys(roomUsageMap).length;
      },
      // 获取用户预约统计
      fetchUserStats(meetings) {
        const userStatsMap = {};
        meetings.forEach((meeting2) => {
          if (meeting2.booker) {
            if (!userStatsMap[meeting2.booker]) {
              userStatsMap[meeting2.booker] = {
                id: meeting2.booker,
                name: meeting2.booker || "未知用户",
                department: meeting2.bookerDepartment || "未知部门",
                meetings: 0
              };
            }
            userStatsMap[meeting2.booker].meetings++;
          }
        });
        this.topUsers = Object.values(userStatsMap).sort((a, b) => b.meetings - a.meetings).slice(0, 5);
        this.maxUserMeetings = Math.max(...this.topUsers.map((user2) => user2.meetings), 1);
        this.userYAxisValues = this.generateYAxisValues(this.maxUserMeetings);
      },
      // 获取会议室总数
      fetchTotalRooms() {
        getRooms().then((res) => {
          if (res && res.code === 200 && res.data) {
            const rooms = Array.isArray(res.data) ? res.data : res.data.list || [];
            this.statistics.totalRooms = rooms.length;
          }
        }).catch((err) => {
          formatAppLog("error", "at pages/admin/statistics/index.vue:470", "获取会议室总数失败:", err);
        });
      },
      // 计算两个日期之间的天数
      calculateDaysBetweenDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1e3 * 60 * 60 * 24)) + 1;
      },
      // 获取当前选择的时间范围的开始日期
      getStartDate() {
        const today = /* @__PURE__ */ new Date();
        const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
        if (timeRange === "week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return weekStart.toISOString().split("T")[0];
        } else if (timeRange === "month") {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          return monthStart.toISOString().split("T")[0];
        } else if (timeRange === "last_month") {
          const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          return lastMonthStart.toISOString().split("T")[0];
        } else if (timeRange === "quarter") {
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          return quarterStart.toISOString().split("T")[0];
        } else if (timeRange === "year") {
          const yearStart = new Date(today.getFullYear(), 0, 1);
          return yearStart.toISOString().split("T")[0];
        } else {
          return today.toISOString().split("T")[0];
        }
      },
      // 获取当前选择的时间范围的结束日期
      getEndDate() {
        const today = /* @__PURE__ */ new Date();
        const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
        if (timeRange === "last_month") {
          const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
          return lastMonthEnd.toISOString().split("T")[0];
        } else {
          return today.toISOString().split("T")[0];
        }
      },
      timeRangeChange(e) {
        this.timeRangeIndex = e.detail.value;
        this.fetchStatisticsData();
      },
      startDateChange(e) {
        this.startDate = e.detail.value;
        if (this.endDate) {
          this.fetchStatisticsData();
        }
      },
      endDateChange(e) {
        this.endDate = e.detail.value;
        if (this.startDate) {
          this.fetchStatisticsData();
        }
      },
      // 获取饼图旋转角度
      getRotation(index) {
        let rotation = 0;
        for (let i = 0; i < index; i++) {
          rotation += this.statusData[i].percentage / 100 * 360;
        }
        return rotation;
      },
      // 获取饼图文字旋转角度
      getLabelRotation(index) {
        let totalPercentage = 0;
        for (let i = 0; i < index; i++) {
          totalPercentage += this.statusData[i].percentage;
        }
        const centerAngle = totalPercentage + this.statusData[index].percentage / 2;
        return -(centerAngle / 100) * 360 + 180;
      },
      // 获取饼图文字位置
      getLabelPosition(index) {
        let totalPercentage = 0;
        for (let i = 0; i < index; i++) {
          totalPercentage += this.statusData[i].percentage;
        }
        const centerAngle = totalPercentage + this.statusData[index].percentage / 2;
        const radian = centerAngle * Math.PI / 180;
        const x = 50 + 35 * Math.cos(radian);
        const y = 50 + 35 * Math.sin(radian);
        return `${x}% ${y}%`;
      },
      // 获取饼图结束点
      getEndPoint(index) {
        let totalPercentage = 0;
        for (let i = 0; i <= index; i++) {
          totalPercentage += this.statusData[i].percentage;
        }
        const angle = totalPercentage / 100 * 360;
        const radian = angle * Math.PI / 180;
        const x = 50 + 50 * Math.cos(radian);
        const y = 50 + 50 * Math.sin(radian);
        return `${x}% ${y}%`;
      },
      // 获取饼图文字颜色
      getLabelColor(backgroundColor) {
        const hex = backgroundColor.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
        return brightness > 128 ? "#000000" : "#ffffff";
      },
      // 获取柱状图颜色
      getBarColor(index) {
        const colors = ["#3498db", "#2ecc71", "#f39c12", "#e74c3c", "#9b59b6"];
        return colors[index % colors.length];
      },
      // 计算每日会议数量
      calculateDailyMeetings(meetings) {
        const meetingsByDate = {};
        meetings.forEach((meeting2) => {
          const date = meeting2.reserveDate;
          if (!meetingsByDate[date]) {
            meetingsByDate[date] = 0;
          }
          meetingsByDate[date]++;
        });
        this.dailyMeetings = Object.keys(meetingsByDate).map((date) => ({
          date: date.split("-").slice(1).join("/"),
          // 只显示月/日
          count: meetingsByDate[date]
        })).sort((a, b) => a.date.localeCompare(b.date));
        this.maxDailyCount = Math.max(...this.dailyMeetings.map((item) => item.count), 1);
        this.dailyYAxisValues = this.generateYAxisValues(this.maxDailyCount);
      },
      // 生成更合适的Y轴刻度值
      generateYAxisValues(maxValue) {
        if (maxValue <= 5) {
          const values2 = [];
          for (let i = maxValue; i >= 0; i--) {
            values2.push(i);
          }
          return values2;
        }
        const idealNumberOfSteps = 5;
        let step = Math.ceil(maxValue / (idealNumberOfSteps - 1));
        if (step > 10) {
          step = Math.ceil(step / 5) * 5;
        } else if (step > 2) {
          step = Math.ceil(step / 2) * 2;
        }
        const values = [];
        const maxStepValue = Math.ceil(maxValue / step) * step;
        for (let i = maxStepValue; i >= 0; i -= step) {
          values.push(i);
        }
        return values;
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "统计分析",
      "active-path": "/pages/admin/statistics/index"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "statistics-container" }, [
          vue.createElementVNode("view", { class: "filter-bar" }, [
            vue.createElementVNode("view", { class: "filter-item" }, [
              vue.createElementVNode("text", { class: "filter-label" }, "时间范围"),
              vue.createElementVNode("picker", {
                value: $data.timeRangeIndex,
                range: $data.timeRangeOptions,
                "range-key": "label",
                onChange: _cache[0] || (_cache[0] = (...args) => $options.timeRangeChange && $options.timeRangeChange(...args)),
                class: "filter-picker"
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($data.timeRangeOptions[$data.timeRangeIndex].label),
                  1
                  /* TEXT */
                )
              ], 40, ["value", "range"])
            ]),
            $data.timeRangeOptions[$data.timeRangeIndex].value === "custom" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "filter-item date-range"
            }, [
              vue.createElementVNode("view", { class: "date-picker" }, [
                vue.createElementVNode("text", { class: "date-label" }, "开始日期"),
                vue.createElementVNode("picker", {
                  mode: "date",
                  value: $data.startDate,
                  onChange: _cache[1] || (_cache[1] = (...args) => $options.startDateChange && $options.startDateChange(...args)),
                  class: "filter-picker"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-value" },
                    vue.toDisplayString($data.startDate || "请选择"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value"])
              ]),
              vue.createElementVNode("view", { class: "date-picker" }, [
                vue.createElementVNode("text", { class: "date-label" }, "结束日期"),
                vue.createElementVNode("picker", {
                  mode: "date",
                  value: $data.endDate,
                  onChange: _cache[2] || (_cache[2] = (...args) => $options.endDateChange && $options.endDateChange(...args)),
                  class: "filter-picker"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-value" },
                    vue.toDisplayString($data.endDate || "请选择"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value"])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 总体统计卡片 "),
          vue.createElementVNode("view", { class: "statistics-cards" }, [
            vue.createElementVNode("view", { class: "stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.statistics.totalMeetings),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "会议总数")
            ]),
            vue.createElementVNode("view", { class: "stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.statistics.approvalRate) + "%",
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "审批通过率")
            ]),
            vue.createElementVNode("view", { class: "stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.statistics.avgMeetingLength),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "平均时长(小时)")
            ]),
            vue.createElementVNode("view", { class: "stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.statistics.totalRooms),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "会议室数量")
            ])
          ]),
          vue.createCommentVNode(" 会议状态分布 "),
          vue.createElementVNode("view", { class: "chart-card" }, [
            vue.createElementVNode("view", { class: "chart-header" }, [
              vue.createElementVNode("text", { class: "chart-title" }, "会议状态分布")
            ]),
            vue.createElementVNode("view", { class: "chart-content" }, [
              vue.createElementVNode("view", { class: "pie-chart" }, [
                vue.createElementVNode("view", { class: "pie-legend" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.statusData, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "legend-item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: "legend-color",
                            style: vue.normalizeStyle({ backgroundColor: item.color })
                          },
                          null,
                          4
                          /* STYLE */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "legend-text" },
                          vue.toDisplayString(item.name) + ": " + vue.toDisplayString(item.value) + "次 (" + vue.toDisplayString(item.percentage) + "%)",
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode("view", { class: "pie-chart-container" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.statusData, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          class: "pie-slice",
                          key: index,
                          style: vue.normalizeStyle({
                            backgroundColor: item.color,
                            transform: `rotate(${$options.getRotation(index)}deg)`,
                            transformOrigin: "50% 50%",
                            clipPath: `polygon(50% 50%, 50% 0%, ${$options.getEndPoint(index)} 0%, ${$options.getEndPoint(index)} 50%)`,
                            zIndex: $data.statusData.length - index
                          })
                        },
                        [
                          vue.createElementVNode(
                            "view",
                            {
                              class: "pie-label",
                              style: vue.normalizeStyle({
                                transform: `rotate(${$options.getLabelRotation(index)}deg)`,
                                transformOrigin: "50% 50%",
                                left: $options.getLabelPosition(index)
                              })
                            },
                            [
                              vue.createElementVNode(
                                "text",
                                {
                                  class: "label-text",
                                  style: vue.normalizeStyle({ color: $options.getLabelColor(item.color) })
                                },
                                vue.toDisplayString(item.percentage) + "%",
                                5
                                /* TEXT, STYLE */
                              )
                            ],
                            4
                            /* STYLE */
                          )
                        ],
                        4
                        /* STYLE */
                      );
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode("view", { class: "pie-center" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "pie-center-text" },
                      vue.toDisplayString($data.statistics.totalMeetings),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "pie-center-label" }, "总会议数")
                  ])
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 每日会议数量趋势 "),
          vue.createElementVNode("view", { class: "chart-card" }, [
            vue.createElementVNode("view", { class: "chart-header" }, [
              vue.createElementVNode("text", { class: "chart-title" }, "每日会议数量趋势")
            ]),
            vue.createElementVNode("view", { class: "chart-content" }, [
              vue.createElementVNode("view", { class: "bar-chart" }, [
                vue.createElementVNode("view", { class: "bar-chart-container" }, [
                  vue.createElementVNode("view", { class: "bar-chart-y-axis" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.dailyYAxisValues, (value, index) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            class: "y-axis-label",
                            key: index
                          },
                          vue.toDisplayString(value),
                          1
                          /* TEXT */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  vue.createElementVNode("view", { class: "bar-chart-main" }, [
                    vue.createElementVNode("view", { class: "bar-chart-grid" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.dailyYAxisValues.length, (_, index) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "grid-line",
                            key: index
                          });
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "bar-chart-data" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.dailyMeetings, (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              class: "bar",
                              key: index,
                              style: vue.normalizeStyle({
                                height: `${item.count / $data.maxDailyCount * 100}%`,
                                backgroundColor: $options.getBarColor(index)
                              })
                            },
                            [
                              vue.createElementVNode(
                                "view",
                                { class: "bar-tooltip" },
                                vue.toDisplayString(item.date) + ": " + vue.toDisplayString(item.count) + "次",
                                1
                                /* TEXT */
                              )
                            ],
                            4
                            /* STYLE */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "bar-chart-x-axis" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.dailyMeetings, (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              class: "x-axis-label",
                              key: index
                            },
                            vue.toDisplayString(item.date),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 会议室使用次数 "),
          vue.createElementVNode("view", { class: "chart-card" }, [
            vue.createElementVNode("view", { class: "chart-header" }, [
              vue.createElementVNode("text", { class: "chart-title" }, "会议室使用次数")
            ]),
            vue.createElementVNode("view", { class: "chart-content" }, [
              vue.createElementVNode("view", { class: "bar-chart" }, [
                vue.createElementVNode("view", { class: "bar-chart-container" }, [
                  vue.createElementVNode("view", { class: "bar-chart-y-axis" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.roomYAxisValues, (value, index) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            class: "y-axis-label",
                            key: index
                          },
                          vue.toDisplayString(value),
                          1
                          /* TEXT */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  vue.createElementVNode("view", { class: "bar-chart-main" }, [
                    vue.createElementVNode("view", { class: "bar-chart-grid" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.roomYAxisValues.length, (_, index) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "grid-line",
                            key: index
                          });
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "bar-chart-data" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.topRooms, (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "view",
                            {
                              class: "bar",
                              key: index,
                              style: vue.normalizeStyle({
                                height: `${item.meetings / $data.maxRoomMeetings * 100}%`,
                                backgroundColor: $options.getBarColor(index)
                              })
                            },
                            [
                              vue.createElementVNode(
                                "view",
                                { class: "bar-tooltip" },
                                vue.toDisplayString(item.name) + ": " + vue.toDisplayString(item.meetings) + "次",
                                1
                                /* TEXT */
                              )
                            ],
                            4
                            /* STYLE */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "bar-chart-x-axis" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.topRooms, (item, index) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              class: "x-axis-label",
                              key: index
                            },
                            vue.toDisplayString(item.name),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 高频会议室TOP5 "),
          vue.createElementVNode("view", { class: "data-card" }, [
            vue.createElementVNode("view", { class: "data-header" }, [
              vue.createElementVNode("text", { class: "data-title" }, "高频使用会议室TOP5")
            ]),
            vue.createElementVNode("view", { class: "data-content" }, [
              vue.createElementVNode("view", { class: "data-table" }, [
                vue.createElementVNode("view", { class: "data-table-header" }, [
                  vue.createElementVNode("text", { class: "data-th" }, "排名"),
                  vue.createElementVNode("text", { class: "data-th" }, "会议室"),
                  vue.createElementVNode("text", { class: "data-th" }, "使用次数")
                ]),
                vue.createElementVNode("view", { class: "data-table-body" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.topRooms, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "data-table-row",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "data-td" },
                          vue.toDisplayString(index + 1),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "data-td" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "data-td" },
                          vue.toDisplayString(item.meetings),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 预约频率最高的用户TOP5 表格 "),
          vue.createElementVNode("view", { class: "data-card" }, [
            vue.createElementVNode("view", { class: "data-header" }, [
              vue.createElementVNode("text", { class: "data-title" }, "预约频率最高的用户TOP5")
            ]),
            vue.createElementVNode("view", { class: "data-content" }, [
              vue.createElementVNode("view", { class: "data-table" }, [
                vue.createElementVNode("view", { class: "data-table-header" }, [
                  vue.createElementVNode("text", { class: "data-th" }, "排名"),
                  vue.createElementVNode("text", { class: "data-th" }, "用户"),
                  vue.createElementVNode("text", { class: "data-th" }, "预约次数")
                ]),
                vue.createElementVNode("view", { class: "data-table-body" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.topUsers, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "data-table-row",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "data-td" },
                          vue.toDisplayString(index + 1),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "data-td" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "data-td" },
                          vue.toDisplayString(item.meetings),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminStatisticsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-78fd8ec6"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/statistics/index.vue"]]);
  const _sfc_main$2 = {
    components: {
      AdminLayout
    },
    data() {
      return {
        rpaStatus: "stopped",
        // 'running' 或 'stopped'
        rpaInfo: {
          lastStartTime: "2023-07-20 09:00:00",
          runningTime: "0小时",
          processedTasks: 0,
          version: "1.0.0"
        },
        config: {
          interval: 15,
          startTime: "08:00",
          endTime: "18:00",
          maxRetries: 3,
          timeout: 30,
          emailNotification: false,
          notificationEmail: ""
        },
        tasks: [
          { id: 1, name: "会议室自动预订", enabled: true },
          { id: 2, name: "会议提醒", enabled: true },
          { id: 3, name: "会议结束提醒", enabled: true },
          { id: 4, name: "会议记录整理", enabled: false },
          { id: 5, name: "会议室使用数据收集", enabled: true }
        ],
        logs: [
          {
            time: "2023-07-20 09:15:00",
            status: "success",
            statusText: "成功",
            title: "会议室自动预订",
            message: "已成功为产品部预订明天10:00的会议室B"
          },
          {
            time: "2023-07-20 09:45:00",
            status: "warning",
            statusText: "警告",
            title: "会议室自动预订",
            message: "预订会议室失败：所选时间段会议室已被占用"
          },
          {
            time: "2023-07-20 10:00:00",
            status: "error",
            statusText: "错误",
            title: "会议提醒",
            message: "发送会议提醒失败：无法连接到邮件服务器"
          }
        ]
      };
    },
    onLoad() {
      this.checkRpaStatus();
      this.loadConfig();
    },
    methods: {
      checkRpaStatus() {
        uni.showLoading({
          title: "获取状态中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          this.rpaStatus = "stopped";
          if (this.rpaStatus === "running") {
            this.startRpaTimer();
          }
        }, 500);
      },
      loadConfig() {
        uni.showLoading({
          title: "加载配置中..."
        });
        setTimeout(() => {
          uni.hideLoading();
        }, 500);
      },
      handleStartRpa() {
        uni.showModal({
          title: "确认启动",
          content: "确定要启动RPA服务吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "启动中..."
              });
              setTimeout(() => {
                uni.hideLoading();
                this.rpaStatus = "running";
                this.rpaInfo.lastStartTime = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false });
                this.rpaInfo.runningTime = "0小时";
                this.rpaInfo.processedTasks = 0;
                this.startRpaTimer();
                uni.showToast({
                  title: "RPA服务已启动",
                  icon: "success"
                });
                this.logs.unshift({
                  time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }),
                  status: "success",
                  statusText: "成功",
                  title: "RPA服务",
                  message: "RPA服务已成功启动"
                });
              }, 1500);
            }
          }
        });
      },
      handleStopRpa() {
        uni.showModal({
          title: "确认停止",
          content: "确定要停止RPA服务吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "停止中..."
              });
              setTimeout(() => {
                uni.hideLoading();
                this.rpaStatus = "stopped";
                if (this.rpaTimer) {
                  clearInterval(this.rpaTimer);
                  this.rpaTimer = null;
                }
                uni.showToast({
                  title: "RPA服务已停止",
                  icon: "success"
                });
                this.logs.unshift({
                  time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }),
                  status: "warning",
                  statusText: "警告",
                  title: "RPA服务",
                  message: "RPA服务已停止"
                });
              }, 1500);
            }
          }
        });
      },
      handleRestartRpa() {
        uni.showModal({
          title: "确认重启",
          content: "确定要重启RPA服务吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "重启中..."
              });
              setTimeout(() => {
                this.rpaStatus = "stopped";
                if (this.rpaTimer) {
                  clearInterval(this.rpaTimer);
                  this.rpaTimer = null;
                }
                setTimeout(() => {
                  uni.hideLoading();
                  this.rpaStatus = "running";
                  this.rpaInfo.lastStartTime = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false });
                  this.rpaInfo.runningTime = "0小时";
                  this.startRpaTimer();
                  uni.showToast({
                    title: "RPA服务已重启",
                    icon: "success"
                  });
                  this.logs.unshift({
                    time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }),
                    status: "success",
                    statusText: "成功",
                    title: "RPA服务",
                    message: "RPA服务已成功重启"
                  });
                }, 1e3);
              }, 1500);
            }
          }
        });
      },
      startRpaTimer() {
        this.rpaStartTime = /* @__PURE__ */ new Date();
        this.rpaTimer = setInterval(() => {
          const now = /* @__PURE__ */ new Date();
          const diff = Math.floor((now - this.rpaStartTime) / (1e3 * 60 * 60));
          this.rpaInfo.runningTime = `${diff}小时`;
          if (Math.random() > 0.7) {
            this.rpaInfo.processedTasks += 1;
            const tasks = ["会议室自动预订", "会议提醒", "会议结束提醒", "会议记录整理"];
            const taskIndex = Math.floor(Math.random() * tasks.length);
            const statusTypes = ["success", "warning", "error"];
            const statusTexts = ["成功", "警告", "错误"];
            const statusIndex = Math.floor(Math.random() * statusTypes.length);
            let message = "";
            if (statusTypes[statusIndex] === "success") {
              message = `成功执行${tasks[taskIndex]}任务`;
            } else if (statusTypes[statusIndex] === "warning") {
              message = `${tasks[taskIndex]}任务执行有警告`;
            } else {
              message = `${tasks[taskIndex]}任务执行失败`;
            }
            this.logs.unshift({
              time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }),
              status: statusTypes[statusIndex],
              statusText: statusTexts[statusIndex],
              title: tasks[taskIndex],
              message
            });
          }
        }, 6e4);
      },
      intervalChange(e) {
        this.config.interval = e.detail.value;
      },
      startTimeChange(e) {
        this.config.startTime = e.detail.value;
      },
      endTimeChange(e) {
        this.config.endTime = e.detail.value;
      },
      toggleTask(index) {
        this.tasks[index].enabled = !this.tasks[index].enabled;
      },
      toggleEmailNotification(e) {
        this.config.emailNotification = e.detail.value;
      },
      saveConfig() {
        uni.showLoading({
          title: "保存中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "配置已保存",
            icon: "success"
          });
          this.logs.unshift({
            time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }),
            status: "success",
            statusText: "成功",
            title: "RPA配置",
            message: "RPA配置已成功更新"
          });
        }, 800);
      },
      resetConfig() {
        uni.showModal({
          title: "确认重置",
          content: "确定要重置所有配置为默认值吗？",
          success: (res) => {
            if (res.confirm) {
              this.config = {
                interval: 15,
                startTime: "08:00",
                endTime: "18:00",
                maxRetries: 3,
                timeout: 30,
                emailNotification: false,
                notificationEmail: ""
              };
              this.tasks.forEach((task) => {
                task.enabled = true;
              });
              uni.showToast({
                title: "配置已重置",
                icon: "success"
              });
            }
          }
        });
      },
      refreshLogs() {
        uni.showLoading({
          title: "刷新中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "日志已刷新",
            icon: "success"
          });
        }, 500);
      },
      clearLogs() {
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有日志记录吗？",
          success: (res) => {
            if (res.confirm) {
              this.logs = [];
              uni.showToast({
                title: "日志已清空",
                icon: "success"
              });
            }
          }
        });
      },
      getStatusClass(status) {
        const statusMap = {
          "success": "status-success",
          "warning": "status-warning",
          "error": "status-error"
        };
        return statusMap[status] || "";
      }
    },
    onUnload() {
      if (this.rpaTimer) {
        clearInterval(this.rpaTimer);
        this.rpaTimer = null;
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_admin_layout = vue.resolveComponent("admin-layout");
    return vue.openBlock(), vue.createBlock(_component_admin_layout, {
      title: "RPA管理",
      "active-path": "/pages/admin/rpa/index"
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "rpa-container" }, [
          vue.createElementVNode("view", { class: "status-card" }, [
            vue.createElementVNode("view", { class: "status-header" }, [
              vue.createElementVNode("text", { class: "status-title" }, "RPA 服务状态"),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["status-indicator", $data.rpaStatus === "running" ? "status-running" : "status-stopped"])
                },
                [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($data.rpaStatus === "running" ? "运行中" : "已停止"),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "status-actions" }, [
              $data.rpaStatus !== "running" ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "btn-action start",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleStartRpa && $options.handleStartRpa(...args))
              }, "启动服务")) : (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                class: "btn-action stop",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleStopRpa && $options.handleStopRpa(...args))
              }, "停止服务")),
              vue.createElementVNode("button", {
                class: "btn-action restart",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleRestartRpa && $options.handleRestartRpa(...args))
              }, "重启服务")
            ]),
            vue.createElementVNode("view", { class: "status-info" }, [
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "上次启动时间:"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.rpaInfo.lastStartTime),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "运行时长:"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.rpaInfo.runningTime),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "处理任务数:"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.rpaInfo.processedTasks),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "RPA版本:"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.rpaInfo.version),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createCommentVNode(" 任务配置卡片 "),
          vue.createElementVNode("view", { class: "config-card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode("text", { class: "card-title" }, "任务配置")
            ]),
            vue.createElementVNode("view", { class: "card-body" }, [
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "执行间隔 (分钟)"),
                vue.createElementVNode("view", { class: "input-row" }, [
                  vue.createElementVNode("slider", {
                    value: $data.config.interval,
                    min: 1,
                    max: 60,
                    step: 1,
                    "show-value": "",
                    onChange: _cache[3] || (_cache[3] = (...args) => $options.intervalChange && $options.intervalChange(...args))
                  }, null, 40, ["value"]),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "number",
                      class: "form-input narrow",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.config.interval = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.config.interval]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "每日执行时间范围"),
                vue.createElementVNode("view", { class: "time-range" }, [
                  vue.createElementVNode("view", { class: "time-picker" }, [
                    vue.createElementVNode("picker", {
                      mode: "time",
                      value: $data.config.startTime,
                      onChange: _cache[5] || (_cache[5] = (...args) => $options.startTimeChange && $options.startTimeChange(...args)),
                      class: "form-picker"
                    }, [
                      vue.createElementVNode(
                        "view",
                        { class: "picker-value" },
                        vue.toDisplayString($data.config.startTime),
                        1
                        /* TEXT */
                      )
                    ], 40, ["value"])
                  ]),
                  vue.createElementVNode("text", { class: "time-separator" }, "至"),
                  vue.createElementVNode("view", { class: "time-picker" }, [
                    vue.createElementVNode("picker", {
                      mode: "time",
                      value: $data.config.endTime,
                      onChange: _cache[6] || (_cache[6] = (...args) => $options.endTimeChange && $options.endTimeChange(...args)),
                      class: "form-picker"
                    }, [
                      vue.createElementVNode(
                        "view",
                        { class: "picker-value" },
                        vue.toDisplayString($data.config.endTime),
                        1
                        /* TEXT */
                      )
                    ], 40, ["value"])
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "最大重试次数"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    class: "form-input",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.config.maxRetries = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.config.maxRetries]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "超时时间 (秒)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    class: "form-input",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.config.timeout = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.config.timeout]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "要执行的任务"),
                vue.createElementVNode("view", { class: "checkbox-group" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.tasks, (task, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "checkbox-item",
                        key: index
                      }, [
                        vue.createElementVNode("checkbox", {
                          checked: task.enabled,
                          onClick: ($event) => $options.toggleTask(index)
                        }, null, 8, ["checked", "onClick"]),
                        vue.createElementVNode(
                          "text",
                          { class: "checkbox-label" },
                          vue.toDisplayString(task.name),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "邮件通知"),
                vue.createElementVNode("switch", {
                  checked: $data.config.emailNotification,
                  onChange: _cache[9] || (_cache[9] = (...args) => $options.toggleEmailNotification && $options.toggleEmailNotification(...args))
                }, null, 40, ["checked"])
              ]),
              $data.config.emailNotification ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "form-group"
              }, [
                vue.createElementVNode("text", { class: "form-label" }, "通知邮箱"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    class: "form-input",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.config.notificationEmail = $event),
                    placeholder: "输入接收通知的邮箱"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.config.notificationEmail]
                ])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "form-actions" }, [
                vue.createElementVNode("button", {
                  class: "btn-save",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.saveConfig && $options.saveConfig(...args))
                }, "保存配置"),
                vue.createElementVNode("button", {
                  class: "btn-reset",
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.resetConfig && $options.resetConfig(...args))
                }, "重置")
              ])
            ])
          ]),
          vue.createCommentVNode(" 任务记录 "),
          vue.createElementVNode("view", { class: "log-card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode("text", { class: "card-title" }, "任务记录"),
              vue.createElementVNode("view", { class: "header-actions" }, [
                vue.createElementVNode("button", {
                  class: "btn-small",
                  onClick: _cache[13] || (_cache[13] = (...args) => $options.refreshLogs && $options.refreshLogs(...args))
                }, "刷新"),
                vue.createElementVNode("button", {
                  class: "btn-small",
                  onClick: _cache[14] || (_cache[14] = (...args) => $options.clearLogs && $options.clearLogs(...args))
                }, "清空")
              ])
            ]),
            vue.createElementVNode("view", { class: "card-body" }, [
              $data.logs.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "logs-list"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.logs, (log, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "log-item",
                      key: index
                    }, [
                      vue.createElementVNode("view", { class: "log-header" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "log-time" },
                          vue.toDisplayString(log.time),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass(["log-status", $options.getStatusClass(log.status)])
                          },
                          vue.toDisplayString(log.statusText),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "log-content" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "log-title" },
                          vue.toDisplayString(log.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "log-message" },
                          vue.toDisplayString(log.message),
                          1
                          /* TEXT */
                        )
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "no-logs"
              }, [
                vue.createElementVNode("text", null, "暂无任务记录")
              ]))
            ])
          ])
        ])
      ]),
      _: 1
      /* STABLE */
    });
  }
  const PagesAdminRpaIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/pages/admin/rpa/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/user/login", PagesUserLogin);
  __definePage("pages/user/schedule", PagesUserSchedule);
  __definePage("pages/user/notification", PagesUserNotification);
  __definePage("pages/user/notification/detail", PagesUserNotificationDetail);
  __definePage("pages/user/profile", PagesUserProfile);
  __definePage("pages/user/userInfo", PagesUserUserInfo);
  __definePage("pages/user/contact-selector", PagesUserContactSelector);
  __definePage("pages/user/meeting/list", PagesUserMeetingList);
  __definePage("pages/user/meeting/create", PagesUserMeetingCreate);
  __definePage("pages/user/meeting/detail", PagesUserMeetingDetail);
  __definePage("pages/user/meeting/room", PagesUserMeetingRoom);
  __definePage("pages/admin/login", PagesAdminLogin);
  __definePage("pages/admin/home", PagesAdminHome);
  __definePage("pages/admin/notification/index", PagesAdminNotificationIndex);
  __definePage("pages/admin/notification/detail", PagesAdminNotificationDetail);
  __definePage("pages/admin/room/list", PagesAdminRoomList);
  __definePage("pages/admin/room/edit", PagesAdminRoomEdit);
  __definePage("pages/admin/meeting/list", PagesAdminMeetingList);
  __definePage("pages/admin/meeting/detail", PagesAdminMeetingDetail);
  __definePage("pages/admin/user/list", PagesAdminUserList);
  __definePage("pages/admin/user/edit", PagesAdminUserEdit);
  __definePage("pages/admin/statistics/index", PagesAdminStatisticsIndex);
  __definePage("pages/admin/rpa/index", PagesAdminRpaIndex);
  const _sfc_main$1 = {
    name: "App",
    mixins: [pageLoggerMixin],
    setup() {
      if (typeof window !== "undefined") {
        window.addEventListener("error", (event) => {
          formatAppLog("error", "at App.vue:20", "[错误]", event.error);
        });
        window.addEventListener("unhandledrejection", (event) => {
          formatAppLog("error", "at App.vue:24", "[Promise错误]", event.reason);
        });
        window.debugPageState = debugPageState;
      }
      return {};
    },
    data() {
      return {
        networkStatus: "unknown",
        lastNetworkCheck: null
      };
    },
    onLaunch() {
      this.checkNetworkStatus();
    },
    mounted() {
      this.setupPageMonitor();
      this.setupNetworkMonitor();
    },
    methods: {
      // 设置全局页面监控
      setupPageMonitor() {
        try {
          uni.addInterceptor("navigateTo", {
            invoke(params) {
              return params;
            }
          });
          uni.addInterceptor("redirectTo", {
            invoke(params) {
              return params;
            }
          });
          uni.addInterceptor("reLaunch", {
            invoke(params) {
              return params;
            }
          });
          uni.addInterceptor("switchTab", {
            invoke(params) {
              return params;
            }
          });
          uni.addInterceptor("navigateBack", {
            invoke(params) {
              return params;
            }
          });
        } catch (e) {
          formatAppLog("error", "at App.vue:86", "页面监控初始化失败:", e);
        }
      },
      // 设置网络状态监控
      setupNetworkMonitor() {
        try {
          uni.onNetworkStatusChange((res) => {
            this.networkStatus = res.networkType;
            this.lastNetworkCheck = (/* @__PURE__ */ new Date()).toISOString();
            if (!res.isConnected) {
              uni.showToast({
                title: "网络连接已断开",
                icon: "none",
                duration: 2e3
              });
            } else if (this.lastNetworkType === "none" && res.isConnected) {
              uni.showToast({
                title: "网络已恢复",
                icon: "success",
                duration: 2e3
              });
            }
            this.lastNetworkType = res.networkType;
          });
        } catch (e) {
          formatAppLog("error", "at App.vue:115", "网络监控初始化失败:", e);
        }
      },
      // 检查网络状态
      checkNetworkStatus() {
        try {
          uni.getNetworkType({
            success: (res) => {
              this.networkStatus = res.networkType;
              this.lastNetworkCheck = (/* @__PURE__ */ new Date()).toISOString();
              this.lastNetworkType = res.networkType;
              if (res.networkType === "none") {
                uni.showToast({
                  title: "当前无网络连接",
                  icon: "none",
                  duration: 2e3
                });
              }
            }
          });
        } catch (e) {
          formatAppLog("error", "at App.vue:138", "获取网络状态失败:", e);
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.createCommentVNode(" 移除 router-view，uni-app会自动处理页面切换 ");
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/App.vue"]]);
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = __spreadValues({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        }
      };
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    setRealTarget(target) {
      return __async(this, null, function* () {
        this.target = target;
        for (const item of this.onQueue) {
          this.target.on[item.method](...item.args);
        }
        for (const item of this.targetQueue) {
          item.resolve(yield this.target[item.method](...item.args));
        }
      });
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && pluginDescriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(pluginDescriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * vuex v4.1.0
   * (c) 2022 Evan You
   * @license MIT
   */
  var storeKey = "store";
  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function(key) {
      return fn(obj[key], key);
    });
  }
  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }
  function isPromise(val) {
    return val && typeof val.then === "function";
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }
  function partial(fn, arg) {
    return function() {
      return fn(arg);
    };
  }
  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }
    return function() {
      var i = subs.indexOf(fn);
      if (i > -1) {
        subs.splice(i, 1);
      }
    };
  }
  function resetStore(store2, hot) {
    store2._actions = /* @__PURE__ */ Object.create(null);
    store2._mutations = /* @__PURE__ */ Object.create(null);
    store2._wrappedGetters = /* @__PURE__ */ Object.create(null);
    store2._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    var state = store2.state;
    installModule(store2, state, [], store2._modules.root, true);
    resetStoreState(store2, state, hot);
  }
  function resetStoreState(store2, state, hot) {
    var oldState = store2._state;
    var oldScope = store2._scope;
    store2.getters = {};
    store2._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    var wrappedGetters = store2._wrappedGetters;
    var computedObj = {};
    var computedCache = {};
    var scope = vue.effectScope(true);
    scope.run(function() {
      forEachValue(wrappedGetters, function(fn, key) {
        computedObj[key] = partial(fn, store2);
        computedCache[key] = vue.computed(function() {
          return computedObj[key]();
        });
        Object.defineProperty(store2.getters, key, {
          get: function() {
            return computedCache[key].value;
          },
          enumerable: true
          // for local getters
        });
      });
    });
    store2._state = vue.reactive({
      data: state
    });
    store2._scope = scope;
    if (store2.strict) {
      enableStrictMode(store2);
    }
    if (oldState) {
      if (hot) {
        store2._withCommit(function() {
          oldState.data = null;
        });
      }
    }
    if (oldScope) {
      oldScope.stop();
    }
  }
  function installModule(store2, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store2._modules.getNamespace(path);
    if (module.namespaced) {
      if (store2._modulesNamespaceMap[namespace] && true) {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
      }
      store2._modulesNamespaceMap[namespace] = module;
    }
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store2._withCommit(function() {
        {
          if (moduleName in parentState) {
            console.warn(
              '[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"'
            );
          }
        }
        parentState[moduleName] = module.state;
      });
    }
    var local = module.context = makeLocalContext(store2, namespace, path);
    module.forEachMutation(function(mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store2, namespacedType, mutation, local);
    });
    module.forEachAction(function(action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store2, type, handler, local);
    });
    module.forEachGetter(function(getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store2, namespacedType, getter, local);
    });
    module.forEachChild(function(child, key) {
      installModule(store2, rootState, path.concat(key), child, hot);
    });
  }
  function makeLocalContext(store2, namespace, path) {
    var noNamespace = namespace === "";
    var local = {
      dispatch: noNamespace ? store2.dispatch : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }
        return store2.dispatch(type, payload);
      },
      commit: noNamespace ? store2.commit : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }
        store2.commit(type, payload, options);
      }
    };
    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function() {
          return store2.getters;
        } : function() {
          return makeLocalGetters(store2, namespace);
        }
      },
      state: {
        get: function() {
          return getNestedState(store2.state, path);
        }
      }
    });
    return local;
  }
  function makeLocalGetters(store2, namespace) {
    if (!store2._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store2.getters).forEach(function(type) {
        if (type.slice(0, splitPos) !== namespace) {
          return;
        }
        var localType = type.slice(splitPos);
        Object.defineProperty(gettersProxy, localType, {
          get: function() {
            return store2.getters[type];
          },
          enumerable: true
        });
      });
      store2._makeLocalGettersCache[namespace] = gettersProxy;
    }
    return store2._makeLocalGettersCache[namespace];
  }
  function registerMutation(store2, type, handler, local) {
    var entry = store2._mutations[type] || (store2._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store2, local.state, payload);
    });
  }
  function registerAction(store2, type, handler, local) {
    var entry = store2._actions[type] || (store2._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store2, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store2.getters,
        rootState: store2.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store2._devtoolHook) {
        return res.catch(function(err) {
          store2._devtoolHook.emit("vuex:error", err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }
  function registerGetter(store2, type, rawGetter, local) {
    if (store2._wrappedGetters[type]) {
      {
        console.error("[vuex] duplicate getter key: " + type);
      }
      return;
    }
    store2._wrappedGetters[type] = function wrappedGetter(store22) {
      return rawGetter(
        local.state,
        // local state
        local.getters,
        // local getters
        store22.state,
        // root state
        store22.getters
        // root getters
      );
    };
  }
  function enableStrictMode(store2) {
    vue.watch(function() {
      return store2._state.data;
    }, function() {
      {
        assert(store2._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, flush: "sync" });
  }
  function getNestedState(state, path) {
    return path.reduce(function(state2, key) {
      return state2[key];
    }, state);
  }
  function unifyObjectStyle(type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    {
      assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
    }
    return { type, payload, options };
  }
  var LABEL_VUEX_BINDINGS = "vuex bindings";
  var MUTATIONS_LAYER_ID = "vuex:mutations";
  var ACTIONS_LAYER_ID = "vuex:actions";
  var INSPECTOR_ID = "vuex";
  var actionId = 0;
  function addDevtools(app, store2) {
    setupDevtoolsPlugin(
      {
        id: "org.vuejs.vuex",
        app,
        label: "Vuex",
        homepage: "https://next.vuex.vuejs.org/",
        logo: "https://vuejs.org/images/icons/favicon-96x96.png",
        packageName: "vuex",
        componentStateTypes: [LABEL_VUEX_BINDINGS]
      },
      function(api2) {
        api2.addTimelineLayer({
          id: MUTATIONS_LAYER_ID,
          label: "Vuex Mutations",
          color: COLOR_LIME_500
        });
        api2.addTimelineLayer({
          id: ACTIONS_LAYER_ID,
          label: "Vuex Actions",
          color: COLOR_LIME_500
        });
        api2.addInspector({
          id: INSPECTOR_ID,
          label: "Vuex",
          icon: "storage",
          treeFilterPlaceholder: "Filter stores..."
        });
        api2.on.getInspectorTree(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            if (payload.filter) {
              var nodes = [];
              flattenStoreForInspectorTree(nodes, store2._modules.root, payload.filter, "");
              payload.rootNodes = nodes;
            } else {
              payload.rootNodes = [
                formatStoreForInspectorTree(store2._modules.root, "")
              ];
            }
          }
        });
        api2.on.getInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            makeLocalGetters(store2, modulePath);
            payload.state = formatStoreForInspectorState(
              getStoreModule(store2._modules, modulePath),
              modulePath === "root" ? store2.getters : store2._makeLocalGettersCache,
              modulePath
            );
          }
        });
        api2.on.editInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            var path = payload.path;
            if (modulePath !== "root") {
              path = modulePath.split("/").filter(Boolean).concat(path);
            }
            store2._withCommit(function() {
              payload.set(store2._state.data, path, payload.state.value);
            });
          }
        });
        store2.subscribe(function(mutation, state) {
          var data = {};
          if (mutation.payload) {
            data.payload = mutation.payload;
          }
          data.state = state;
          api2.notifyComponentUpdate();
          api2.sendInspectorTree(INSPECTOR_ID);
          api2.sendInspectorState(INSPECTOR_ID);
          api2.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: mutation.type,
              data
            }
          });
        });
        store2.subscribeAction({
          before: function(action, state) {
            var data = {};
            if (action.payload) {
              data.payload = action.payload;
            }
            action._id = actionId++;
            action._time = Date.now();
            data.state = state;
            api2.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: action._time,
                title: action.type,
                groupId: action._id,
                subtitle: "start",
                data
              }
            });
          },
          after: function(action, state) {
            var data = {};
            var duration = Date.now() - action._time;
            data.duration = {
              _custom: {
                type: "duration",
                display: duration + "ms",
                tooltip: "Action duration",
                value: duration
              }
            };
            if (action.payload) {
              data.payload = action.payload;
            }
            data.state = state;
            api2.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: Date.now(),
                title: action.type,
                groupId: action._id,
                subtitle: "end",
                data
              }
            });
          }
        });
      }
    );
  }
  var COLOR_LIME_500 = 8702998;
  var COLOR_DARK = 6710886;
  var COLOR_WHITE = 16777215;
  var TAG_NAMESPACED = {
    label: "namespaced",
    textColor: COLOR_WHITE,
    backgroundColor: COLOR_DARK
  };
  function extractNameFromPath(path) {
    return path && path !== "root" ? path.split("/").slice(-2, -1)[0] : "Root";
  }
  function formatStoreForInspectorTree(module, path) {
    return {
      id: path || "root",
      // all modules end with a `/`, we want the last segment only
      // cart/ -> cart
      // nested/cart/ -> cart
      label: extractNameFromPath(path),
      tags: module.namespaced ? [TAG_NAMESPACED] : [],
      children: Object.keys(module._children).map(
        function(moduleName) {
          return formatStoreForInspectorTree(
            module._children[moduleName],
            path + moduleName + "/"
          );
        }
      )
    };
  }
  function flattenStoreForInspectorTree(result, module, filter, path) {
    if (path.includes(filter)) {
      result.push({
        id: path || "root",
        label: path.endsWith("/") ? path.slice(0, path.length - 1) : path || "Root",
        tags: module.namespaced ? [TAG_NAMESPACED] : []
      });
    }
    Object.keys(module._children).forEach(function(moduleName) {
      flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + "/");
    });
  }
  function formatStoreForInspectorState(module, getters, path) {
    getters = path === "root" ? getters : getters[path];
    var gettersKeys = Object.keys(getters);
    var storeState = {
      state: Object.keys(module.state).map(function(key) {
        return {
          key,
          editable: true,
          value: module.state[key]
        };
      })
    };
    if (gettersKeys.length) {
      var tree = transformPathsToObjectTree(getters);
      storeState.getters = Object.keys(tree).map(function(key) {
        return {
          key: key.endsWith("/") ? extractNameFromPath(key) : key,
          editable: false,
          value: canThrow(function() {
            return tree[key];
          })
        };
      });
    }
    return storeState;
  }
  function transformPathsToObjectTree(getters) {
    var result = {};
    Object.keys(getters).forEach(function(key) {
      var path = key.split("/");
      if (path.length > 1) {
        var target = result;
        var leafKey = path.pop();
        path.forEach(function(p) {
          if (!target[p]) {
            target[p] = {
              _custom: {
                value: {},
                display: p,
                tooltip: "Module",
                abstract: true
              }
            };
          }
          target = target[p]._custom.value;
        });
        target[leafKey] = canThrow(function() {
          return getters[key];
        });
      } else {
        result[key] = canThrow(function() {
          return getters[key];
        });
      }
    });
    return result;
  }
  function getStoreModule(moduleMap, path) {
    var names = path.split("/").filter(function(n) {
      return n;
    });
    return names.reduce(
      function(module, moduleName, i) {
        var child = module[moduleName];
        if (!child) {
          throw new Error('Missing module "' + moduleName + '" for path "' + path + '".');
        }
        return i === names.length - 1 ? child : child._children;
      },
      path === "root" ? moduleMap : moduleMap.root._children
    );
  }
  function canThrow(cb) {
    try {
      return cb();
    } catch (e) {
      return e;
    }
  }
  var Module = function Module2(rawModule, runtime) {
    this.runtime = runtime;
    this._children = /* @__PURE__ */ Object.create(null);
    this._rawModule = rawModule;
    var rawState = rawModule.state;
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  };
  var prototypeAccessors$1 = { namespaced: { configurable: true } };
  prototypeAccessors$1.namespaced.get = function() {
    return !!this._rawModule.namespaced;
  };
  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };
  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };
  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };
  Module.prototype.hasChild = function hasChild(key) {
    return key in this._children;
  };
  Module.prototype.update = function update(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };
  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };
  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };
  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };
  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };
  Object.defineProperties(Module.prototype, prototypeAccessors$1);
  var ModuleCollection = function ModuleCollection2(rawRootModule) {
    this.register([], rawRootModule, false);
  };
  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function(module, key) {
      return module.getChild(key);
    }, this.root);
  };
  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function(namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + "/" : "");
    }, "");
  };
  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update2([], this.root, rawRootModule);
  };
  ModuleCollection.prototype.register = function register2(path, rawModule, runtime) {
    var this$1$1 = this;
    if (runtime === void 0)
      runtime = true;
    {
      assertRawModule(path, rawModule);
    }
    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function(rawChildModule, key) {
        this$1$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };
  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);
    if (!child) {
      {
        console.warn(
          "[vuex] trying to unregister module '" + key + "', which is not registered"
        );
      }
      return;
    }
    if (!child.runtime) {
      return;
    }
    parent.removeChild(key);
  };
  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    if (parent) {
      return parent.hasChild(key);
    }
    return false;
  };
  function update2(path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }
    targetModule.update(newModule);
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn(
              "[vuex] trying to add a new module '" + key + "' on hot reloading, manual reload is needed"
            );
          }
          return;
        }
        update2(
          path.concat(key),
          targetModule.getChild(key),
          newModule.modules[key]
        );
      }
    }
  }
  var functionAssert = {
    assert: function(value) {
      return typeof value === "function";
    },
    expected: "function"
  };
  var objectAssert = {
    assert: function(value) {
      return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
    },
    expected: 'function or object with "handler" function'
  };
  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };
  function assertRawModule(path, rawModule) {
    Object.keys(assertTypes).forEach(function(key) {
      if (!rawModule[key]) {
        return;
      }
      var assertOptions2 = assertTypes[key];
      forEachValue(rawModule[key], function(value, type) {
        assert(
          assertOptions2.assert(value),
          makeAssertionMessage(path, key, type, value, assertOptions2.expected)
        );
      });
    });
  }
  function makeAssertionMessage(path, key, type, value, expected) {
    var buf = key + " should be " + expected + ' but "' + key + "." + type + '"';
    if (path.length > 0) {
      buf += ' in module "' + path.join(".") + '"';
    }
    buf += " is " + JSON.stringify(value) + ".";
    return buf;
  }
  function createStore(options) {
    return new Store(options);
  }
  var Store = function Store2(options) {
    var this$1$1 = this;
    if (options === void 0)
      options = {};
    {
      assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store2, "store must be called with the new operator.");
    }
    var plugins = options.plugins;
    if (plugins === void 0)
      plugins = [];
    var strict = options.strict;
    if (strict === void 0)
      strict = false;
    var devtools = options.devtools;
    this._committing = false;
    this._actions = /* @__PURE__ */ Object.create(null);
    this._actionSubscribers = [];
    this._mutations = /* @__PURE__ */ Object.create(null);
    this._wrappedGetters = /* @__PURE__ */ Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    this._scope = null;
    this._devtools = devtools;
    var store2 = this;
    var ref = this;
    var dispatch2 = ref.dispatch;
    var commit2 = ref.commit;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch2.call(store2, type, payload);
    };
    this.commit = function boundCommit(type, payload, options2) {
      return commit2.call(store2, type, payload, options2);
    };
    this.strict = strict;
    var state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
    resetStoreState(this, state);
    plugins.forEach(function(plugin) {
      return plugin(this$1$1);
    });
  };
  var prototypeAccessors = { state: { configurable: true } };
  Store.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
    var useDevtools = this._devtools !== void 0 ? this._devtools : true;
    if (useDevtools) {
      addDevtools(app, this);
    }
  };
  prototypeAccessors.state.get = function() {
    return this._state.data;
  };
  prototypeAccessors.state.set = function(v) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };
  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;
    var mutation = { type, payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error("[vuex] unknown mutation type: " + type);
      }
      return;
    }
    this._withCommit(function() {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
    this._subscribers.slice().forEach(function(sub) {
      return sub(mutation, this$1$1.state);
    });
    if (options && options.silent) {
      console.warn(
        "[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools"
      );
    }
  };
  Store.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = { type, payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error("[vuex] unknown action type: " + type);
      }
      return;
    }
    try {
      this._actionSubscribers.slice().filter(function(sub) {
        return sub.before;
      }).forEach(function(sub) {
        return sub.before(action, this$1$1.state);
      });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }
    var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function(resolve, reject) {
      result.then(function(res) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.after;
          }).forEach(function(sub) {
            return sub.after(action, this$1$1.state);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }
        resolve(res);
      }, function(error) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.error;
          }).forEach(function(sub) {
            return sub.error(action, this$1$1.state, error);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }
        reject(error);
      });
    });
  };
  Store.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };
  Store.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };
  Store.prototype.watch = function watch$1(getter, cb, options) {
    var this$1$1 = this;
    {
      assert(typeof getter === "function", "store.watch only accepts a function.");
    }
    return vue.watch(function() {
      return getter(this$1$1.state, this$1$1.getters);
    }, cb, Object.assign({}, options));
  };
  Store.prototype.replaceState = function replaceState(state) {
    var this$1$1 = this;
    this._withCommit(function() {
      this$1$1._state.data = state;
    });
  };
  Store.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0)
      options = {};
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, "cannot register the root module by using registerModule.");
    }
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    resetStoreState(this, this.state);
  };
  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1$1 = this;
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    this._modules.unregister(path);
    this._withCommit(function() {
      var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    resetStore(this);
  };
  Store.prototype.hasModule = function hasModule(path) {
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    return this._modules.isRegistered(path);
  };
  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };
  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };
  Object.defineProperties(Store.prototype, prototypeAccessors);
  const user = {
    namespaced: true,
    state: {
      token: uni.getStorageSync("token") || "",
      userInfo: uni.getStorageSync("userInfo") || null,
      isLoggedIn: !!uni.getStorageSync("token")
    },
    mutations: {
      SET_TOKEN(state, token) {
        state.token = token;
        uni.setStorageSync("token", token);
      },
      SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo;
        uni.setStorageSync("userInfo", userInfo);
      },
      SET_LOGIN_STATE(state, isLoggedIn) {
        state.isLoggedIn = isLoggedIn;
      },
      LOGOUT(state) {
        state.token = "";
        state.userInfo = null;
        state.isLoggedIn = false;
        uni.removeStorageSync("token");
        uni.removeStorageSync("userInfo");
      }
    },
    actions: {
      // 登录
      login({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
          api.user.login(userInfo).then((res) => {
            if (res.code === 200 && res.data) {
              commit("SET_TOKEN", res.data.token);
              commit("SET_USER_INFO", res.data.userInfo);
              commit("SET_LOGIN_STATE", true);
              resolve(res);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      },
      // 登出
      logout({ commit }) {
        return new Promise((resolve) => {
          commit("LOGOUT");
          resolve();
        });
      },
      // 获取用户信息
      getUserInfo({ commit }) {
        return new Promise((resolve, reject) => {
          api.user.getUserInfo().then((res) => {
            if (res.code === 200 && res.data) {
              commit("SET_USER_INFO", res.data);
              resolve(res.data);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      }
    },
    getters: {
      token: (state) => state.token,
      userInfo: (state) => state.userInfo,
      isLoggedIn: (state) => state.isLoggedIn,
      userName: (state) => state.userInfo ? state.userInfo.name : "",
      userRole: (state) => state.userInfo ? state.userInfo.role : ""
    }
  };
  const meeting = {
    namespaced: true,
    state: {
      meetingList: [],
      currentMeeting: null,
      meetingRooms: [],
      meetingForm: {
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        roomId: "",
        description: "",
        attendees: []
      }
    },
    mutations: {
      SET_MEETING_LIST(state, list) {
        state.meetingList = list;
      },
      SET_CURRENT_MEETING(state, meeting2) {
        state.currentMeeting = meeting2;
      },
      SET_MEETING_ROOMS(state, rooms) {
        state.meetingRooms = rooms;
      },
      SET_MEETING_FORM(state, form) {
        state.meetingForm = form;
      },
      RESET_MEETING_FORM(state) {
        state.meetingForm = {
          title: "",
          date: "",
          startTime: "",
          endTime: "",
          roomId: "",
          description: "",
          attendees: []
        };
      }
    },
    actions: {
      // 获取会议列表
      getMeetingList({ commit }, params) {
        return new Promise((resolve, reject) => {
          api.meeting.getMeetingList(params).then((res) => {
            if (res.code === 200) {
              commit("SET_MEETING_LIST", res.data.list || []);
              resolve(res.data);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      },
      // 获取会议详情
      getMeetingDetail({ commit }, id) {
        return new Promise((resolve, reject) => {
          api.meeting.getMeetingDetail(id).then((res) => {
            if (res.code === 200) {
              commit("SET_CURRENT_MEETING", res.data);
              resolve(res.data);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      },
      // 创建会议
      createMeeting({ commit }, meetingData) {
        return new Promise((resolve, reject) => {
          api.meeting.createMeeting(meetingData).then((res) => {
            if (res.code === 200) {
              commit("RESET_MEETING_FORM");
              resolve(res.data);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      },
      // 更新会议
      updateMeeting({ commit }, { id, data }) {
        return new Promise((resolve, reject) => {
          api.meeting.updateMeeting(id, data).then((res) => {
            if (res.code === 200) {
              resolve(res.data);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      },
      // 获取会议室列表
      getMeetingRooms({ commit }) {
        return new Promise((resolve, reject) => {
          api.room.getRoomList().then((res) => {
            if (res.code === 200) {
              commit("SET_MEETING_ROOMS", res.data);
              resolve(res.data);
            } else {
              reject(res);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      }
    },
    getters: {
      meetingList: (state) => state.meetingList,
      currentMeeting: (state) => state.currentMeeting,
      meetingRooms: (state) => state.meetingRooms,
      meetingForm: (state) => state.meetingForm,
      pendingMeetings: (state) => state.meetingList.filter((m) => m.status === "pending"),
      approvedMeetings: (state) => state.meetingList.filter((m) => m.status === "approved"),
      completedMeetings: (state) => state.meetingList.filter((m) => m.status === "completed")
    }
  };
  const store = createStore({
    state: {
      // 全局状态
      loading: false,
      appVersion: "1.0.0"
    },
    mutations: {
      // 修改loading状态
      SET_LOADING(state, isLoading) {
        state.loading = isLoading;
      }
    },
    actions: {
      // 异步操作
      toggleLoading({ commit }, isLoading) {
        commit("SET_LOADING", isLoading);
      }
    },
    getters: {
      // 全局计算属性
      isLoading: (state) => state.loading,
      appVersion: (state) => state.appVersion
    },
    // 模块
    modules: {
      user,
      meeting
    }
  });
  formatAppLog("log", "at uni.promisify.adaptor.js:8", "[uni适配器] Promise适配器已加载");
  const _sfc_main = {
    name: "UniPopup",
    props: {
      show: {
        type: Boolean,
        default: false
      },
      position: {
        type: String,
        default: "center"
        // center, top, bottom, left, right
      },
      maskClick: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showPopup: false
      };
    },
    computed: {
      positionClass() {
        return `uni-popup-${this.position}`;
      }
    },
    watch: {
      show(val) {
        if (val) {
          this.open();
        } else {
          this.close();
        }
      }
    },
    methods: {
      open() {
        this.showPopup = true;
        this.$emit("open");
      },
      close() {
        this.showPopup = false;
        this.$emit("close");
      },
      handleMaskClick() {
        if (this.maskClick) {
          this.close();
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.showPopup ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: "uni-popup"
    }, [
      vue.createElementVNode("div", {
        class: "uni-popup-mask",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleMaskClick && $options.handleMaskClick(...args))
      }),
      vue.createElementVNode(
        "div",
        {
          class: vue.normalizeClass(["uni-popup-content", $options.positionClass])
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        2
        /* CLASS */
      )
    ])) : vue.createCommentVNode("v-if", true);
  }
  const uniPopup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c307477a"], ["__file", "C:/Users/25867/Desktop/rpa_meeting/frontend/components/uni/popup.vue"]]);
  App.mpType = "app";
  function createApp() {
    const app = vue.createVueApp(App);
    app.config.globalProperties.$config = config;
    app.use(store);
    app.mixin(pageLoggerMixin);
    app.component("uni-popup", uniPopup);
    app.config.errorHandler = (err, instance2, info) => {
      formatAppLog("error", "at main.js:39", "[全局错误]", err);
      formatAppLog("error", "at main.js:40", "错误信息:", info);
    };
    return {
      app
      // 移除router导出
      // router
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
