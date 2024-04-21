var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res2) => function __init() {
  return fn && (res2 = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res2;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@aws-lite/client/src/error.js
var require_error = __commonJS({
  "node_modules/@aws-lite/client/src/error.js"(exports, module2) {
    module2.exports = function errorHandler(input) {
      if (input instanceof Error) {
        throw input;
      }
      let { statusCode, headers, error, metadata } = input;
      if (error?.Error)
        error = error.Error;
      let err = error instanceof Error ? error : Error();
      if (statusCode) {
        err.statusCode = statusCode;
      }
      if (headers) {
        err.headers = headers;
      }
      if (error && typeof error === "object") {
        Object.entries(error).forEach(([n, value]) => {
          const name2 = n.toLowerCase();
          if (name2 === "message")
            err[name2] = value;
          else if (name2 === "code")
            err[name2] = err.name = value;
          else
            err[n] = value;
        });
        if (err.__type && !err.code)
          err.code = err.name = err.__type;
      }
      if (typeof error === "string") {
        err.message = error;
      }
      Object.entries(metadata).forEach(([name2, value]) => {
        if (name2 !== "name" && value)
          err[name2] = value;
      });
      let { service: service2, name, property: property2 } = metadata;
      let msg = "@aws-lite/client: " + (property2 || service2);
      if (name)
        msg += `.${name}`;
      if (error?.message || err.message) {
        msg += `: ${error.message || err.message}`;
      } else
        msg += ": unknown error";
      err.message = msg;
      if (!err.time)
        err.time = (/* @__PURE__ */ new Date()).toISOString();
      throw err;
    };
  }
});

// node_modules/@aws-lite/client/src/lib/validate.js
var require_validate = __commonJS({
  "node_modules/@aws-lite/client/src/lib/validate.js"(exports, module2) {
    var errorHandler = require_error();
    var is = {
      array: (item) => Array.isArray(item),
      boolean: (item) => typeof item === "boolean",
      buffer: (item) => Buffer.isBuffer(item),
      number: (item) => Number.isInteger(item),
      object: (item) => item && typeof item === "object" && !Array.isArray(item),
      stream: (item) => item?.on && item?._read && item?._readableState,
      string: (item) => typeof item === "string"
      // TODO:
      // - ARN, partial arn
    };
    var payloadAliases = ["payload", "body", "data", "json"];
    function validateInput(valid, input, metadata) {
      let errors = [];
      let dupedPayloadAliases = [];
      Object.keys(input).forEach((p) => payloadAliases.includes(p) && dupedPayloadAliases.push(p));
      if (dupedPayloadAliases.length > 1) {
        errors.push(`- Found duplicate payload parameters: ${dupedPayloadAliases.join(", ")}`);
      }
      Object.entries(valid).forEach(([param, validations]) => {
        let canonicalParam = param === "payload" ? Object.keys(input).find((p) => payloadAliases.includes(p)) || param : param;
        if (validations === false) {
          if (input[canonicalParam]) {
            errors.push(`- Parameter '${canonicalParam}' must not be used`);
          }
          return;
        }
        let { type, required: required2 } = validations;
        if (typeof input[canonicalParam] === "undefined") {
          if (required2) {
            errors.push(`- Missing required parameter: ${canonicalParam}`);
          }
          return;
        }
        if (!type) {
          errors.push(`- Validator is missing required 'type' property: ${canonicalParam}`);
          return;
        }
        if (!is.string(type) && !is.array(type)) {
          errors.push(`- Validator 'type' property must be a string or array: ${param}`);
          return;
        }
        let types = is.array(type) ? type : [type];
        types = types.map((t) => t?.toLowerCase?.(t) || t);
        let foundInvalid = false;
        types.forEach((t) => {
          if (!is[t]) {
            errors.push(`- Invalid type found: ${canonicalParam} (${t})`);
            foundInvalid = true;
          }
        });
        if (foundInvalid)
          return;
        let plural = types.length > 1 ? " one of" : "";
        if (!types.some((t) => is[t](input[canonicalParam]))) {
          errors.push(`- Parameter '${canonicalParam}' must be${plural}: ${types.join(", ")}`);
        }
      });
      if (errors.length) {
        let message = `validation error${errors.length > 1 ? "s" : ""}
` + errors.join("\n");
        errorHandler({ error: { message }, metadata });
      }
    }
    module2.exports = { validateInput, is };
  }
});

// node_modules/@aws-lite/client/src/_vendor/aws.js
var require_aws = __commonJS({
  "node_modules/@aws-lite/client/src/_vendor/aws.js"(exports, module2) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __esm2 = (fn, res2) => function __init() {
      return fn && (res2 = (0, fn[__getOwnPropNames2(fn)[0]])(fn = 0)), res2;
    };
    var __commonJS2 = (cb, mod) => function __require() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var tslib_es6_exports = {};
    __export2(tslib_es6_exports, {
      __addDisposableResource: () => __addDisposableResource,
      __assign: () => __assign,
      __asyncDelegator: () => __asyncDelegator,
      __asyncGenerator: () => __asyncGenerator,
      __asyncValues: () => __asyncValues,
      __await: () => __await,
      __awaiter: () => __awaiter,
      __classPrivateFieldGet: () => __classPrivateFieldGet,
      __classPrivateFieldIn: () => __classPrivateFieldIn,
      __classPrivateFieldSet: () => __classPrivateFieldSet,
      __createBinding: () => __createBinding,
      __decorate: () => __decorate,
      __disposeResources: () => __disposeResources,
      __esDecorate: () => __esDecorate,
      __exportStar: () => __exportStar,
      __extends: () => __extends,
      __generator: () => __generator,
      __importDefault: () => __importDefault,
      __importStar: () => __importStar,
      __makeTemplateObject: () => __makeTemplateObject,
      __metadata: () => __metadata,
      __param: () => __param,
      __propKey: () => __propKey,
      __read: () => __read,
      __rest: () => __rest,
      __runInitializers: () => __runInitializers,
      __setFunctionName: () => __setFunctionName,
      __spread: () => __spread,
      __spreadArray: () => __spreadArray,
      __spreadArrays: () => __spreadArrays,
      __values: () => __values,
      default: () => tslib_es6_default
    });
    function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __rest(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    }
    function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
      else
        for (var i = decorators.length - 1; i >= 0; i--)
          if (d = decorators[i])
            r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    }
    function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
      function accept(f) {
        if (f !== void 0 && typeof f !== "function")
          throw new TypeError("Function expected");
        return f;
      }
      var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
      var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
      var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
      var _2, done = false;
      for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
          context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
          context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
          if (done)
            throw new TypeError("Cannot add initializers after decoration has completed");
          extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
          if (result === void 0)
            continue;
          if (result === null || typeof result !== "object")
            throw new TypeError("Object expected");
          if (_2 = accept(result.get))
            descriptor.get = _2;
          if (_2 = accept(result.set))
            descriptor.set = _2;
          if (_2 = accept(result.init))
            initializers.unshift(_2);
        } else if (_2 = accept(result)) {
          if (kind === "field")
            initializers.unshift(_2);
          else
            descriptor[key] = _2;
        }
      }
      if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
      done = true;
    }
    function __runInitializers(thisArg, initializers, value) {
      var useValue = arguments.length > 2;
      for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
      }
      return useValue ? value : void 0;
    }
    function __propKey(x) {
      return typeof x === "symbol" ? x : "".concat(x);
    }
    function __setFunctionName(f, name, prefix) {
      if (typeof name === "symbol")
        name = name.description ? "[".concat(name.description, "]") : "";
      return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    }
    function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _2 = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_2 = 0)), _2)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _2.label++;
                return { value: op[1], done: false };
              case 5:
                _2.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _2.ops.pop();
                _2.trys.pop();
                continue;
              default:
                if (!(t = _2.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _2 = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _2.label = op[1];
                  break;
                }
                if (op[0] === 6 && _2.label < t[1]) {
                  _2.label = t[1];
                  t = op;
                  break;
                }
                if (t && _2.label < t[2]) {
                  _2.label = t[2];
                  _2.ops.push(op);
                  break;
                }
                if (t[2])
                  _2.ops.pop();
                _2.trys.pop();
                continue;
            }
            op = body.call(thisArg, _2);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    }
    function __exportStar(m, o) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
          __createBinding(o, m, p);
    }
    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m)
        return m.call(o);
      if (o && typeof o.length === "number")
        return {
          next: function() {
            if (o && i >= o.length)
              o = void 0;
            return { value: o && o[i++], done: !o };
          }
        };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    }
    function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
      return ar;
    }
    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    }
    function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i;
      function verb(n) {
        if (g[n])
          i[n] = function(v) {
            return new Promise(function(a, b) {
              q.push([n, v, a, b]) > 1 || resume(n, v);
            });
          };
      }
      function resume(n, v) {
        try {
          step(g[n](v));
        } catch (e) {
          settle(q[0][3], e);
        }
      }
      function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
      }
      function fulfill(value) {
        resume("next", value);
      }
      function reject(value) {
        resume("throw", value);
      }
      function settle(f, v) {
        if (f(v), q.shift(), q.length)
          resume(q[0][0], q[0][1]);
      }
    }
    function __asyncDelegator(o) {
      var i, p;
      return i = {}, verb("next"), verb("throw", function(e) {
        throw e;
      }), verb("return"), i[Symbol.iterator] = function() {
        return this;
      }, i;
      function verb(n, f) {
        i[n] = o[n] ? function(v) {
          return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
        } : f;
      }
    }
    function __asyncValues(o) {
      if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i);
      function verb(n) {
        i[n] = o[n] && function(v) {
          return new Promise(function(resolve, reject) {
            v = o[n](v), settle(resolve, reject, v.done, v.value);
          });
        };
      }
      function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v2) {
          resolve({ value: v2, done: d });
        }, reject);
      }
    }
    function __makeTemplateObject(cooked, raw) {
      if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", { value: raw });
      } else {
        cooked.raw = raw;
      }
      return cooked;
    }
    function __importStar(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    }
    function __importDefault(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    }
    function __classPrivateFieldIn(state, receiver) {
      if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function")
        throw new TypeError("Cannot use 'in' operator on non-object");
      return typeof state === "function" ? receiver === state : state.has(receiver);
    }
    function __addDisposableResource(env, value, async) {
      if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function")
          throw new TypeError("Object expected.");
        var dispose;
        if (async) {
          if (!Symbol.asyncDispose)
            throw new TypeError("Symbol.asyncDispose is not defined.");
          dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
          if (!Symbol.dispose)
            throw new TypeError("Symbol.dispose is not defined.");
          dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function")
          throw new TypeError("Object not disposable.");
        env.stack.push({ value, dispose, async });
      } else if (async) {
        env.stack.push({ async: true });
      }
      return value;
    }
    function __disposeResources(env) {
      function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
      }
      function next() {
        while (env.stack.length) {
          var rec = env.stack.pop();
          try {
            var result = rec.dispose && rec.dispose.call(rec.value);
            if (rec.async)
              return Promise.resolve(result).then(next, function(e) {
                fail(e);
                return next();
              });
          } catch (e) {
            fail(e);
          }
        }
        if (env.hasError)
          throw env.error;
      }
      return next();
    }
    var extendStatics;
    var __assign;
    var __createBinding;
    var __setModuleDefault;
    var _SuppressedError;
    var tslib_es6_default;
    var init_tslib_es6 = __esm2({
      "node_modules/tslib/tslib.es6.mjs"() {
        extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2)
              if (Object.prototype.hasOwnProperty.call(b2, p))
                d2[p] = b2[p];
          };
          return extendStatics(d, b);
        };
        __assign = function() {
          __assign = Object.assign || function __assign2(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
            }
            return t;
          };
          return __assign.apply(this, arguments);
        };
        __createBinding = Object.create ? function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          var desc = Object.getOwnPropertyDescriptor(m, k);
          if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() {
              return m[k];
            } };
          }
          Object.defineProperty(o, k2, desc);
        } : function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          o[k2] = m[k];
        };
        __setModuleDefault = Object.create ? function(o, v) {
          Object.defineProperty(o, "default", { enumerable: true, value: v });
        } : function(o, v) {
          o["default"] = v;
        };
        _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
          var e = new Error(message);
          return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
        };
        tslib_es6_default = {
          __extends,
          __assign,
          __rest,
          __decorate,
          __param,
          __metadata,
          __awaiter,
          __generator,
          __createBinding,
          __exportStar,
          __values,
          __read,
          __spread,
          __spreadArrays,
          __spreadArray,
          __await,
          __asyncGenerator,
          __asyncDelegator,
          __asyncValues,
          __makeTemplateObject,
          __importStar,
          __importDefault,
          __classPrivateFieldGet,
          __classPrivateFieldSet,
          __classPrivateFieldIn,
          __addDisposableResource,
          __disposeResources
        };
      }
    });
    var require_convertToAttr = __commonJS2({
      "node_modules/@aws-sdk/util-dynamodb/dist-cjs/convertToAttr.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.convertToAttr = void 0;
        var convertToAttr2 = (data, options) => {
          var _a, _b, _c, _d, _e, _f;
          if (data === void 0) {
            throw new Error(`Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.`);
          } else if (data === null && typeof data === "object") {
            return convertToNullAttr();
          } else if (Array.isArray(data)) {
            return convertToListAttr(data, options);
          } else if (((_a = data === null || data === void 0 ? void 0 : data.constructor) === null || _a === void 0 ? void 0 : _a.name) === "Set") {
            return convertToSetAttr(data, options);
          } else if (((_b = data === null || data === void 0 ? void 0 : data.constructor) === null || _b === void 0 ? void 0 : _b.name) === "Map") {
            return convertToMapAttrFromIterable(data, options);
          } else if (((_c = data === null || data === void 0 ? void 0 : data.constructor) === null || _c === void 0 ? void 0 : _c.name) === "Object" || !data.constructor && typeof data === "object") {
            return convertToMapAttrFromEnumerableProps(data, options);
          } else if (isBinary(data)) {
            if (data.length === 0 && (options === null || options === void 0 ? void 0 : options.convertEmptyValues)) {
              return convertToNullAttr();
            }
            return convertToBinaryAttr(data);
          } else if (typeof data === "boolean" || ((_d = data === null || data === void 0 ? void 0 : data.constructor) === null || _d === void 0 ? void 0 : _d.name) === "Boolean") {
            return { BOOL: data.valueOf() };
          } else if (typeof data === "number" || ((_e = data === null || data === void 0 ? void 0 : data.constructor) === null || _e === void 0 ? void 0 : _e.name) === "Number") {
            return convertToNumberAttr(data);
          } else if (typeof data === "bigint") {
            return convertToBigIntAttr(data);
          } else if (typeof data === "string" || ((_f = data === null || data === void 0 ? void 0 : data.constructor) === null || _f === void 0 ? void 0 : _f.name) === "String") {
            if (data.length === 0 && (options === null || options === void 0 ? void 0 : options.convertEmptyValues)) {
              return convertToNullAttr();
            }
            return convertToStringAttr(data);
          } else if ((options === null || options === void 0 ? void 0 : options.convertClassInstanceToMap) && typeof data === "object") {
            return convertToMapAttrFromEnumerableProps(data, options);
          }
          throw new Error(`Unsupported type passed: ${data}. Pass options.convertClassInstanceToMap=true to marshall typeof object as map attribute.`);
        };
        exports2.convertToAttr = convertToAttr2;
        var convertToListAttr = (data, options) => ({
          L: data.filter((item) => !(options === null || options === void 0 ? void 0 : options.removeUndefinedValues) || (options === null || options === void 0 ? void 0 : options.removeUndefinedValues) && item !== void 0).map((item) => (0, exports2.convertToAttr)(item, options))
        });
        var convertToSetAttr = (set, options) => {
          const setToOperate = (options === null || options === void 0 ? void 0 : options.removeUndefinedValues) ? new Set([...set].filter((value) => value !== void 0)) : set;
          if (!(options === null || options === void 0 ? void 0 : options.removeUndefinedValues) && setToOperate.has(void 0)) {
            throw new Error(`Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.`);
          }
          if (setToOperate.size === 0) {
            if (options === null || options === void 0 ? void 0 : options.convertEmptyValues) {
              return convertToNullAttr();
            }
            throw new Error(`Pass a non-empty set, or options.convertEmptyValues=true.`);
          }
          const item = setToOperate.values().next().value;
          if (typeof item === "number") {
            return {
              NS: Array.from(setToOperate).map(convertToNumberAttr).map((item2) => item2.N)
            };
          } else if (typeof item === "bigint") {
            return {
              NS: Array.from(setToOperate).map(convertToBigIntAttr).map((item2) => item2.N)
            };
          } else if (typeof item === "string") {
            return {
              SS: Array.from(setToOperate).map(convertToStringAttr).map((item2) => item2.S)
            };
          } else if (isBinary(item)) {
            return {
              BS: Array.from(setToOperate).map(convertToBinaryAttr).map((item2) => item2.B)
            };
          } else {
            throw new Error(`Only Number Set (NS), Binary Set (BS) or String Set (SS) are allowed.`);
          }
        };
        var convertToMapAttrFromIterable = (data, options) => ({
          M: ((data2) => {
            const map = {};
            for (const [key, value] of data2) {
              if (typeof value !== "function" && (value !== void 0 || !(options === null || options === void 0 ? void 0 : options.removeUndefinedValues))) {
                map[key] = (0, exports2.convertToAttr)(value, options);
              }
            }
            return map;
          })(data)
        });
        var convertToMapAttrFromEnumerableProps = (data, options) => ({
          M: ((data2) => {
            const map = {};
            for (const key in data2) {
              const value = data2[key];
              if (typeof value !== "function" && (value !== void 0 || !(options === null || options === void 0 ? void 0 : options.removeUndefinedValues))) {
                map[key] = (0, exports2.convertToAttr)(value, options);
              }
            }
            return map;
          })(data)
        });
        var convertToNullAttr = () => ({ NULL: true });
        var convertToBinaryAttr = (data) => ({ B: data });
        var convertToStringAttr = (data) => ({ S: data.toString() });
        var convertToBigIntAttr = (data) => ({ N: data.toString() });
        var validateBigIntAndThrow = (errorPrefix) => {
          throw new Error(`${errorPrefix} ${typeof BigInt === "function" ? "Use BigInt." : "Pass string value instead."} `);
        };
        var convertToNumberAttr = (num2) => {
          if ([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].map((val2) => val2.toString()).includes(num2.toString())) {
            throw new Error(`Special numeric value ${num2.toString()} is not allowed`);
          } else if (num2 > Number.MAX_SAFE_INTEGER) {
            validateBigIntAndThrow(`Number ${num2.toString()} is greater than Number.MAX_SAFE_INTEGER.`);
          } else if (num2 < Number.MIN_SAFE_INTEGER) {
            validateBigIntAndThrow(`Number ${num2.toString()} is lesser than Number.MIN_SAFE_INTEGER.`);
          }
          return { N: num2.toString() };
        };
        var isBinary = (data) => {
          const binaryTypes = [
            "ArrayBuffer",
            "Blob",
            "Buffer",
            "DataView",
            "File",
            "Int8Array",
            "Uint8Array",
            "Uint8ClampedArray",
            "Int16Array",
            "Uint16Array",
            "Int32Array",
            "Uint32Array",
            "Float32Array",
            "Float64Array",
            "BigInt64Array",
            "BigUint64Array"
          ];
          if (data === null || data === void 0 ? void 0 : data.constructor) {
            return binaryTypes.includes(data.constructor.name);
          }
          return false;
        };
      }
    });
    var require_convertToNative = __commonJS2({
      "node_modules/@aws-sdk/util-dynamodb/dist-cjs/convertToNative.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.convertToNative = void 0;
        var convertToNative2 = (data, options) => {
          for (const [key, value] of Object.entries(data)) {
            if (value !== void 0) {
              switch (key) {
                case "NULL":
                  return null;
                case "BOOL":
                  return Boolean(value);
                case "N":
                  return convertNumber(value, options);
                case "B":
                  return convertBinary(value);
                case "S":
                  return convertString(value);
                case "L":
                  return convertList(value, options);
                case "M":
                  return convertMap(value, options);
                case "NS":
                  return new Set(value.map((item) => convertNumber(item, options)));
                case "BS":
                  return new Set(value.map(convertBinary));
                case "SS":
                  return new Set(value.map(convertString));
                default:
                  throw new Error(`Unsupported type passed: ${key}`);
              }
            }
          }
          throw new Error(`No value defined: ${JSON.stringify(data)}`);
        };
        exports2.convertToNative = convertToNative2;
        var convertNumber = (numString, options) => {
          if (options === null || options === void 0 ? void 0 : options.wrapNumbers) {
            return { value: numString };
          }
          const num2 = Number(numString);
          const infinityValues = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
          if ((num2 > Number.MAX_SAFE_INTEGER || num2 < Number.MIN_SAFE_INTEGER) && !infinityValues.includes(num2)) {
            if (typeof BigInt === "function") {
              try {
                return BigInt(numString);
              } catch (error) {
                throw new Error(`${numString} can't be converted to BigInt. Set options.wrapNumbers to get string value.`);
              }
            } else {
              throw new Error(`${numString} is outside SAFE_INTEGER bounds. Set options.wrapNumbers to get string value.`);
            }
          }
          return num2;
        };
        var convertString = (stringValue) => stringValue;
        var convertBinary = (binaryValue) => binaryValue;
        var convertList = (list, options) => list.map((item) => (0, exports2.convertToNative)(item, options));
        var convertMap = (map, options) => Object.entries(map).reduce((acc, [key, value]) => (acc[key] = (0, exports2.convertToNative)(value, options), acc), {});
      }
    });
    var require_marshall = __commonJS2({
      "node_modules/@aws-sdk/util-dynamodb/dist-cjs/marshall.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.marshall = void 0;
        var convertToAttr_1 = require_convertToAttr();
        function marshall2(data, options) {
          const attributeValue = (0, convertToAttr_1.convertToAttr)(data, options);
          const [key, value] = Object.entries(attributeValue)[0];
          switch (key) {
            case "M":
            case "L":
              return (options === null || options === void 0 ? void 0 : options.convertTopLevelContainer) ? attributeValue : value;
            case "SS":
            case "NS":
            case "BS":
            case "S":
            case "N":
            case "B":
            case "NULL":
            case "BOOL":
            case "$unknown":
            default:
              return attributeValue;
          }
        }
        exports2.marshall = marshall2;
      }
    });
    var require_models = __commonJS2({
      "node_modules/@aws-sdk/util-dynamodb/dist-cjs/models.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
      }
    });
    var require_unmarshall = __commonJS2({
      "node_modules/@aws-sdk/util-dynamodb/dist-cjs/unmarshall.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.unmarshall = void 0;
        var convertToNative_1 = require_convertToNative();
        var unmarshall2 = (data, options) => {
          if (options === null || options === void 0 ? void 0 : options.convertWithoutMapWrapper) {
            return (0, convertToNative_1.convertToNative)(data, options);
          }
          return (0, convertToNative_1.convertToNative)({ M: data }, options);
        };
        exports2.unmarshall = unmarshall2;
      }
    });
    var require_dist_cjs = __commonJS2({
      "node_modules/@aws-sdk/util-dynamodb/dist-cjs/index.js"(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
        tslib_1.__exportStar(require_convertToAttr(), exports2);
        tslib_1.__exportStar(require_convertToNative(), exports2);
        tslib_1.__exportStar(require_marshall(), exports2);
        tslib_1.__exportStar(require_models(), exports2);
        tslib_1.__exportStar(require_unmarshall(), exports2);
      }
    });
    var vendor_aws_json_entry_exports = {};
    __export2(vendor_aws_json_entry_exports, {
      convertToAttr: () => import_util_dynamodb.convertToAttr,
      convertToNative: () => import_util_dynamodb.convertToNative,
      marshall: () => import_util_dynamodb.marshall,
      unmarshall: () => import_util_dynamodb.unmarshall
    });
    module2.exports = __toCommonJS(vendor_aws_json_entry_exports);
    var import_util_dynamodb = __toESM2(require_dist_cjs(), 1);
  }
});

// node_modules/ini/lib/ini.js
var require_ini = __commonJS({
  "node_modules/ini/lib/ini.js"(exports, module2) {
    var { hasOwnProperty } = Object.prototype;
    var encode = (obj2, opt = {}) => {
      if (typeof opt === "string") {
        opt = { section: opt };
      }
      opt.align = opt.align === true;
      opt.newline = opt.newline === true;
      opt.sort = opt.sort === true;
      opt.whitespace = opt.whitespace === true || opt.align === true;
      opt.platform = opt.platform || typeof process !== "undefined" && process.platform;
      opt.bracketedArray = opt.bracketedArray !== false;
      const eol = opt.platform === "win32" ? "\r\n" : "\n";
      const separator = opt.whitespace ? " = " : "=";
      const children = [];
      const keys = opt.sort ? Object.keys(obj2).sort() : Object.keys(obj2);
      let padToChars = 0;
      if (opt.align) {
        padToChars = safe(
          keys.filter((k) => obj2[k] === null || Array.isArray(obj2[k]) || typeof obj2[k] !== "object").map((k) => Array.isArray(obj2[k]) ? `${k}[]` : k).concat([""]).reduce((a, b) => safe(a).length >= safe(b).length ? a : b)
        ).length;
      }
      let out = "";
      const arraySuffix = opt.bracketedArray ? "[]" : "";
      for (const k of keys) {
        const val2 = obj2[k];
        if (val2 && Array.isArray(val2)) {
          for (const item of val2) {
            out += safe(`${k}${arraySuffix}`).padEnd(padToChars, " ") + separator + safe(item) + eol;
          }
        } else if (val2 && typeof val2 === "object") {
          children.push(k);
        } else {
          out += safe(k).padEnd(padToChars, " ") + separator + safe(val2) + eol;
        }
      }
      if (opt.section && out.length) {
        out = "[" + safe(opt.section) + "]" + (opt.newline ? eol + eol : eol) + out;
      }
      for (const k of children) {
        const nk = splitSections(k, ".").join("\\.");
        const section = (opt.section ? opt.section + "." : "") + nk;
        const child = encode(obj2[k], {
          ...opt,
          section
        });
        if (out.length && child.length) {
          out += eol;
        }
        out += child;
      }
      return out;
    };
    function splitSections(str2, separator) {
      var lastMatchIndex = 0;
      var lastSeparatorIndex = 0;
      var nextIndex = 0;
      var sections = [];
      do {
        nextIndex = str2.indexOf(separator, lastMatchIndex);
        if (nextIndex !== -1) {
          lastMatchIndex = nextIndex + separator.length;
          if (nextIndex > 0 && str2[nextIndex - 1] === "\\") {
            continue;
          }
          sections.push(str2.slice(lastSeparatorIndex, nextIndex));
          lastSeparatorIndex = nextIndex + separator.length;
        }
      } while (nextIndex !== -1);
      sections.push(str2.slice(lastSeparatorIndex));
      return sections;
    }
    var decode = (str2, opt = {}) => {
      opt.bracketedArray = opt.bracketedArray !== false;
      const out = /* @__PURE__ */ Object.create(null);
      let p = out;
      let section = null;
      const re = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i;
      const lines = str2.split(/[\r\n]+/g);
      const duplicates = {};
      for (const line of lines) {
        if (!line || line.match(/^\s*[;#]/) || line.match(/^\s*$/)) {
          continue;
        }
        const match = line.match(re);
        if (!match) {
          continue;
        }
        if (match[1] !== void 0) {
          section = unsafe(match[1]);
          if (section === "__proto__") {
            p = /* @__PURE__ */ Object.create(null);
            continue;
          }
          p = out[section] = out[section] || /* @__PURE__ */ Object.create(null);
          continue;
        }
        const keyRaw = unsafe(match[2]);
        let isArray;
        if (opt.bracketedArray) {
          isArray = keyRaw.length > 2 && keyRaw.slice(-2) === "[]";
        } else {
          duplicates[keyRaw] = (duplicates?.[keyRaw] || 0) + 1;
          isArray = duplicates[keyRaw] > 1;
        }
        const key = isArray ? keyRaw.slice(0, -2) : keyRaw;
        if (key === "__proto__") {
          continue;
        }
        const valueRaw = match[3] ? unsafe(match[4]) : true;
        const value = valueRaw === "true" || valueRaw === "false" || valueRaw === "null" ? JSON.parse(valueRaw) : valueRaw;
        if (isArray) {
          if (!hasOwnProperty.call(p, key)) {
            p[key] = [];
          } else if (!Array.isArray(p[key])) {
            p[key] = [p[key]];
          }
        }
        if (Array.isArray(p[key])) {
          p[key].push(value);
        } else {
          p[key] = value;
        }
      }
      const remove = [];
      for (const k of Object.keys(out)) {
        if (!hasOwnProperty.call(out, k) || typeof out[k] !== "object" || Array.isArray(out[k])) {
          continue;
        }
        const parts = splitSections(k, ".");
        p = out;
        const l = parts.pop();
        const nl = l.replace(/\\\./g, ".");
        for (const part of parts) {
          if (part === "__proto__") {
            continue;
          }
          if (!hasOwnProperty.call(p, part) || typeof p[part] !== "object") {
            p[part] = /* @__PURE__ */ Object.create(null);
          }
          p = p[part];
        }
        if (p === out && nl === l) {
          continue;
        }
        p[nl] = out[k];
        remove.push(k);
      }
      for (const del of remove) {
        delete out[del];
      }
      return out;
    };
    var isQuoted = (val2) => {
      return val2.startsWith('"') && val2.endsWith('"') || val2.startsWith("'") && val2.endsWith("'");
    };
    var safe = (val2) => {
      if (typeof val2 !== "string" || val2.match(/[=\r\n]/) || val2.match(/^\[/) || val2.length > 1 && isQuoted(val2) || val2 !== val2.trim()) {
        return JSON.stringify(val2);
      }
      return val2.split(";").join("\\;").split("#").join("\\#");
    };
    var unsafe = (val2) => {
      val2 = (val2 || "").trim();
      if (isQuoted(val2)) {
        if (val2.charAt(0) === "'") {
          val2 = val2.slice(1, -1);
        }
        try {
          val2 = JSON.parse(val2);
        } catch {
        }
      } else {
        let esc = false;
        let unesc = "";
        for (let i = 0, l = val2.length; i < l; i++) {
          const c = val2.charAt(i);
          if (esc) {
            if ("\\;#".indexOf(c) !== -1) {
              unesc += c;
            } else {
              unesc += "\\" + c;
            }
            esc = false;
          } else if (";#".indexOf(c) !== -1) {
            break;
          } else if (c === "\\") {
            esc = true;
          } else {
            unesc += c;
          }
        }
        if (esc) {
          unesc += "\\";
        }
        return unesc.trim();
      }
      return val2;
    };
    module2.exports = {
      parse: decode,
      decode,
      stringify: encode,
      encode,
      safe,
      unsafe
    };
  }
});

// node_modules/@aws-lite/client/src/_vendor/xml.js
var require_xml = __commonJS({
  "node_modules/@aws-lite/client/src/_vendor/xml.js"(exports, module2) {
    var b = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
    var I = b((E) => {
      "use strict";
      var B = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ge = B + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040", q = "[" + B + "][" + ge + "]*", pe = new RegExp("^" + q + "$"), Ne = function(e, t) {
        let s = [], i = t.exec(e);
        for (; i; ) {
          let n = [];
          n.startIndex = t.lastIndex - i[0].length;
          let r = i.length;
          for (let f = 0; f < r; f++)
            n.push(i[f]);
          s.push(n), i = t.exec(e);
        }
        return s;
      }, be = function(e) {
        let t = pe.exec(e);
        return !(t === null || typeof t > "u");
      };
      E.isExist = function(e) {
        return typeof e < "u";
      };
      E.isEmptyObject = function(e) {
        return Object.keys(e).length === 0;
      };
      E.merge = function(e, t, s) {
        if (t) {
          let i = Object.keys(t), n = i.length;
          for (let r = 0; r < n; r++)
            s === "strict" ? e[i[r]] = [t[i[r]]] : e[i[r]] = t[i[r]];
        }
      };
      E.getValue = function(e) {
        return E.isExist(e) ? e : "";
      };
      E.isName = be;
      E.getAllMatches = Ne;
      E.nameRegexp = q;
    });
    var x = b((G) => {
      "use strict";
      var C = I(), Ee = { allowBooleanAttributes: false, unpairedTags: [] };
      G.validate = function(e, t) {
        t = Object.assign({}, Ee, t);
        let s = [], i = false, n = false;
        e[0] === "\uFEFF" && (e = e.substr(1));
        for (let r = 0; r < e.length; r++)
          if (e[r] === "<" && e[r + 1] === "?") {
            if (r += 2, r = k(e, r), r.err)
              return r;
          } else if (e[r] === "<") {
            let f = r;
            if (r++, e[r] === "!") {
              r = R(e, r);
              continue;
            } else {
              let u = false;
              e[r] === "/" && (u = true, r++);
              let o = "";
              for (; r < e.length && e[r] !== ">" && e[r] !== " " && e[r] !== "	" && e[r] !== `
` && e[r] !== "\r"; r++)
                o += e[r];
              if (o = o.trim(), o[o.length - 1] === "/" && (o = o.substring(0, o.length - 1), r--), !Ie(o)) {
                let d;
                return o.trim().length === 0 ? d = "Invalid space after '<'." : d = "Tag '" + o + "' is an invalid name.", h("InvalidTag", d, p(e, r));
              }
              let l = me(e, r);
              if (l === false)
                return h("InvalidAttr", "Attributes for '" + o + "' have open quote.", p(e, r));
              let a = l.value;
              if (r = l.index, a[a.length - 1] === "/") {
                let d = r - a.length;
                a = a.substring(0, a.length - 1);
                let g = X(a, t);
                if (g === true)
                  i = true;
                else
                  return h(g.err.code, g.err.msg, p(e, d + g.err.line));
              } else if (u)
                if (l.tagClosed) {
                  if (a.trim().length > 0)
                    return h("InvalidTag", "Closing tag '" + o + "' can't have attributes or invalid starting.", p(e, f));
                  {
                    let d = s.pop();
                    if (o !== d.tagName) {
                      let g = p(e, d.tagStartPos);
                      return h("InvalidTag", "Expected closing tag '" + d.tagName + "' (opened in line " + g.line + ", col " + g.col + ") instead of closing tag '" + o + "'.", p(e, f));
                    }
                    s.length == 0 && (n = true);
                  }
                } else
                  return h("InvalidTag", "Closing tag '" + o + "' doesn't have proper closing.", p(e, r));
              else {
                let d = X(a, t);
                if (d !== true)
                  return h(d.err.code, d.err.msg, p(e, r - a.length + d.err.line));
                if (n === true)
                  return h("InvalidXml", "Multiple possible root nodes found.", p(e, r));
                t.unpairedTags.indexOf(o) !== -1 || s.push({ tagName: o, tagStartPos: f }), i = true;
              }
              for (r++; r < e.length; r++)
                if (e[r] === "<")
                  if (e[r + 1] === "!") {
                    r++, r = R(e, r);
                    continue;
                  } else if (e[r + 1] === "?") {
                    if (r = k(e, ++r), r.err)
                      return r;
                  } else
                    break;
                else if (e[r] === "&") {
                  let d = Pe(e, r);
                  if (d == -1)
                    return h("InvalidChar", "char '&' is not expected.", p(e, r));
                  r = d;
                } else if (n === true && !M(e[r]))
                  return h("InvalidXml", "Extra text at the end", p(e, r));
              e[r] === "<" && r--;
            }
          } else {
            if (M(e[r]))
              continue;
            return h("InvalidChar", "char '" + e[r] + "' is not expected.", p(e, r));
          }
        if (i) {
          if (s.length == 1)
            return h("InvalidTag", "Unclosed tag '" + s[0].tagName + "'.", p(e, s[0].tagStartPos));
          if (s.length > 0)
            return h("InvalidXml", "Invalid '" + JSON.stringify(s.map((r) => r.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
        } else
          return h("InvalidXml", "Start tag expected.", 1);
        return true;
      };
      function M(e) {
        return e === " " || e === "	" || e === `
` || e === "\r";
      }
      function k(e, t) {
        let s = t;
        for (; t < e.length; t++)
          if (e[t] == "?" || e[t] == " ") {
            let i = e.substr(s, t - s);
            if (t > 5 && i === "xml")
              return h("InvalidXml", "XML declaration allowed only at the start of the document.", p(e, t));
            if (e[t] == "?" && e[t + 1] == ">") {
              t++;
              break;
            } else
              continue;
          }
        return t;
      }
      function R(e, t) {
        if (e.length > t + 5 && e[t + 1] === "-" && e[t + 2] === "-") {
          for (t += 3; t < e.length; t++)
            if (e[t] === "-" && e[t + 1] === "-" && e[t + 2] === ">") {
              t += 2;
              break;
            }
        } else if (e.length > t + 8 && e[t + 1] === "D" && e[t + 2] === "O" && e[t + 3] === "C" && e[t + 4] === "T" && e[t + 5] === "Y" && e[t + 6] === "P" && e[t + 7] === "E") {
          let s = 1;
          for (t += 8; t < e.length; t++)
            if (e[t] === "<")
              s++;
            else if (e[t] === ">" && (s--, s === 0))
              break;
        } else if (e.length > t + 9 && e[t + 1] === "[" && e[t + 2] === "C" && e[t + 3] === "D" && e[t + 4] === "A" && e[t + 5] === "T" && e[t + 6] === "A" && e[t + 7] === "[") {
          for (t += 8; t < e.length; t++)
            if (e[t] === "]" && e[t + 1] === "]" && e[t + 2] === ">") {
              t += 2;
              break;
            }
        }
        return t;
      }
      var Te = '"', ye = "'";
      function me(e, t) {
        let s = "", i = "", n = false;
        for (; t < e.length; t++) {
          if (e[t] === Te || e[t] === ye)
            i === "" ? i = e[t] : i !== e[t] || (i = "");
          else if (e[t] === ">" && i === "") {
            n = true;
            break;
          }
          s += e[t];
        }
        return i !== "" ? false : { value: s, index: t, tagClosed: n };
      }
      var Ae = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
      function X(e, t) {
        let s = C.getAllMatches(e, Ae), i = {};
        for (let n = 0; n < s.length; n++) {
          if (s[n][1].length === 0)
            return h("InvalidAttr", "Attribute '" + s[n][2] + "' has no space in starting.", w(s[n]));
          if (s[n][3] !== void 0 && s[n][4] === void 0)
            return h("InvalidAttr", "Attribute '" + s[n][2] + "' is without value.", w(s[n]));
          if (s[n][3] === void 0 && !t.allowBooleanAttributes)
            return h("InvalidAttr", "boolean attribute '" + s[n][2] + "' is not allowed.", w(s[n]));
          let r = s[n][2];
          if (!Oe(r))
            return h("InvalidAttr", "Attribute '" + r + "' is an invalid name.", w(s[n]));
          if (!i.hasOwnProperty(r))
            i[r] = 1;
          else
            return h("InvalidAttr", "Attribute '" + r + "' is repeated.", w(s[n]));
        }
        return true;
      }
      function we(e, t) {
        let s = /\d/;
        for (e[t] === "x" && (t++, s = /[\da-fA-F]/); t < e.length; t++) {
          if (e[t] === ";")
            return t;
          if (!e[t].match(s))
            break;
        }
        return -1;
      }
      function Pe(e, t) {
        if (t++, e[t] === ";")
          return -1;
        if (e[t] === "#")
          return t++, we(e, t);
        let s = 0;
        for (; t < e.length; t++, s++)
          if (!(e[t].match(/\w/) && s < 20)) {
            if (e[t] === ";")
              break;
            return -1;
          }
        return t;
      }
      function h(e, t, s) {
        return { err: { code: e, msg: t, line: s.line || s, col: s.col } };
      }
      function Oe(e) {
        return C.isName(e);
      }
      function Ie(e) {
        return C.isName(e);
      }
      function p(e, t) {
        let s = e.substring(0, t).split(/\r?\n/);
        return { line: s.length, col: s[s.length - 1].length + 1 };
      }
      function w(e) {
        return e.startIndex + e[1].length;
      }
    });
    var U = b((V) => {
      var Z = { preserveOrder: false, attributeNamePrefix: "@_", attributesGroupName: false, textNodeName: "#text", ignoreAttributes: true, removeNSPrefix: false, allowBooleanAttributes: false, parseTagValue: true, parseAttributeValue: false, trimValues: true, cdataPropName: false, numberParseOptions: { hex: true, leadingZeros: true, eNotation: true }, tagValueProcessor: function(e, t) {
        return t;
      }, attributeValueProcessor: function(e, t) {
        return t;
      }, stopNodes: [], alwaysCreateTextNode: false, isArray: () => false, commentPropName: false, unpairedTags: [], processEntities: true, htmlEntities: false, ignoreDeclaration: false, ignorePiTags: false, transformTagName: false, transformAttributeName: false, updateTag: function(e, t, s) {
        return e;
      } }, Ce = function(e) {
        return Object.assign({}, Z, e);
      };
      V.buildOptions = Ce;
      V.defaultOptions = Z;
    });
    var J = b((vt, Y) => {
      "use strict";
      var v = class {
        constructor(t) {
          this.tagname = t, this.child = [], this[":@"] = {};
        }
        add(t, s) {
          t === "__proto__" && (t = "#__proto__"), this.child.push({ [t]: s });
        }
        addChild(t) {
          t.tagname === "__proto__" && (t.tagname = "#__proto__"), t[":@"] && Object.keys(t[":@"]).length > 0 ? this.child.push({ [t.tagname]: t.child, ":@": t[":@"] }) : this.child.push({ [t.tagname]: t.child });
        }
      };
      Y.exports = v;
    });
    var K = b((Ft, W) => {
      var xe = I();
      function Ve(e, t) {
        let s = {};
        if (e[t + 3] === "O" && e[t + 4] === "C" && e[t + 5] === "T" && e[t + 6] === "Y" && e[t + 7] === "P" && e[t + 8] === "E") {
          t = t + 9;
          let i = 1, n = false, r = false, f = "";
          for (; t < e.length; t++)
            if (e[t] === "<" && !r) {
              if (n && Se(e, t))
                t += 7, [entityName, val, t] = ve(e, t + 1), val.indexOf("&") === -1 && (s[Be(entityName)] = { regx: RegExp(`&${entityName};`, "g"), val });
              else if (n && $e(e, t))
                t += 8;
              else if (n && _e(e, t))
                t += 8;
              else if (n && Le(e, t))
                t += 9;
              else if (Fe)
                r = true;
              else
                throw new Error("Invalid DOCTYPE");
              i++, f = "";
            } else if (e[t] === ">") {
              if (r ? e[t - 1] === "-" && e[t - 2] === "-" && (r = false, i--) : i--, i === 0)
                break;
            } else
              e[t] === "[" ? n = true : f += e[t];
          if (i !== 0)
            throw new Error("Unclosed DOCTYPE");
        } else
          throw new Error("Invalid Tag instead of DOCTYPE");
        return { entities: s, i: t };
      }
      function ve(e, t) {
        let s = "";
        for (; t < e.length && e[t] !== "'" && e[t] !== '"'; t++)
          s += e[t];
        if (s = s.trim(), s.indexOf(" ") !== -1)
          throw new Error("External entites are not supported");
        let i = e[t++], n = "";
        for (; t < e.length && e[t] !== i; t++)
          n += e[t];
        return [s, n, t];
      }
      function Fe(e, t) {
        return e[t + 1] === "!" && e[t + 2] === "-" && e[t + 3] === "-";
      }
      function Se(e, t) {
        return e[t + 1] === "!" && e[t + 2] === "E" && e[t + 3] === "N" && e[t + 4] === "T" && e[t + 5] === "I" && e[t + 6] === "T" && e[t + 7] === "Y";
      }
      function $e(e, t) {
        return e[t + 1] === "!" && e[t + 2] === "E" && e[t + 3] === "L" && e[t + 4] === "E" && e[t + 5] === "M" && e[t + 6] === "E" && e[t + 7] === "N" && e[t + 8] === "T";
      }
      function _e(e, t) {
        return e[t + 1] === "!" && e[t + 2] === "A" && e[t + 3] === "T" && e[t + 4] === "T" && e[t + 5] === "L" && e[t + 6] === "I" && e[t + 7] === "S" && e[t + 8] === "T";
      }
      function Le(e, t) {
        return e[t + 1] === "!" && e[t + 2] === "N" && e[t + 3] === "O" && e[t + 4] === "T" && e[t + 5] === "A" && e[t + 6] === "T" && e[t + 7] === "I" && e[t + 8] === "O" && e[t + 9] === "N";
      }
      function Be(e) {
        if (xe.isName(e))
          return e;
        throw new Error(`Invalid entity name ${e}`);
      }
      W.exports = Ve;
    });
    var z = b((St, Q) => {
      var qe = /^[-+]?0x[a-fA-F0-9]+$/, Me = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
      !Number.parseInt && window.parseInt && (Number.parseInt = window.parseInt);
      !Number.parseFloat && window.parseFloat && (Number.parseFloat = window.parseFloat);
      var ke = { hex: true, leadingZeros: true, decimalPoint: ".", eNotation: true };
      function Re(e, t = {}) {
        if (t = Object.assign({}, ke, t), !e || typeof e != "string")
          return e;
        let s = e.trim();
        if (t.skipLike !== void 0 && t.skipLike.test(s))
          return e;
        if (t.hex && qe.test(s))
          return Number.parseInt(s, 16);
        {
          let i = Me.exec(s);
          if (i) {
            let n = i[1], r = i[2], f = Xe(i[3]), u = i[4] || i[6];
            if (!t.leadingZeros && r.length > 0 && n && s[2] !== ".")
              return e;
            if (!t.leadingZeros && r.length > 0 && !n && s[1] !== ".")
              return e;
            {
              let o = Number(s), l = "" + o;
              return l.search(/[eE]/) !== -1 || u ? t.eNotation ? o : e : s.indexOf(".") !== -1 ? l === "0" && f === "" || l === f || n && l === "-" + f ? o : e : r ? f === l || n + f === l ? o : e : s === l || s === n + l ? o : e;
            }
          } else
            return e;
        }
      }
      function Xe(e) {
        return e && e.indexOf(".") !== -1 && (e = e.replace(/0+$/, ""), e === "." ? e = "0" : e[0] === "." ? e = "0" + e : e[e.length - 1] === "." && (e = e.substr(0, e.length - 1))), e;
      }
      Q.exports = Re;
    });
    var j = b((_t, H) => {
      "use strict";
      var _2 = I(), P = J(), Ge = K(), Ze = z(), $t = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, _2.nameRegexp), F = class {
        constructor(t) {
          this.options = t, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = { apos: { regex: /&(apos|#39|#x27);/g, val: "'" }, gt: { regex: /&(gt|#62|#x3E);/g, val: ">" }, lt: { regex: /&(lt|#60|#x3C);/g, val: "<" }, quot: { regex: /&(quot|#34|#x22);/g, val: '"' } }, this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" }, this.htmlEntities = { space: { regex: /&(nbsp|#160);/g, val: " " }, cent: { regex: /&(cent|#162);/g, val: "\xA2" }, pound: { regex: /&(pound|#163);/g, val: "\xA3" }, yen: { regex: /&(yen|#165);/g, val: "\xA5" }, euro: { regex: /&(euro|#8364);/g, val: "\u20AC" }, copyright: { regex: /&(copy|#169);/g, val: "\xA9" }, reg: { regex: /&(reg|#174);/g, val: "\xAE" }, inr: { regex: /&(inr|#8377);/g, val: "\u20B9" } }, this.addExternalEntities = Ue, this.parseXml = Qe, this.parseTextData = Ye, this.resolveNameSpace = Je, this.buildAttributesMap = Ke, this.isItStopNode = De, this.replaceEntitiesValue = He, this.readStopNodeData = tt, this.saveTextToParentTag = je, this.addChild = ze;
        }
      };
      function Ue(e) {
        let t = Object.keys(e);
        for (let s = 0; s < t.length; s++) {
          let i = t[s];
          this.lastEntities[i] = { regex: new RegExp("&" + i + ";", "g"), val: e[i] };
        }
      }
      function Ye(e, t, s, i, n, r, f) {
        if (e !== void 0 && (this.options.trimValues && !i && (e = e.trim()), e.length > 0)) {
          f || (e = this.replaceEntitiesValue(e));
          let u = this.options.tagValueProcessor(t, e, s, n, r);
          return u == null ? e : typeof u != typeof e || u !== e ? u : this.options.trimValues ? $(e, this.options.parseTagValue, this.options.numberParseOptions) : e.trim() === e ? $(e, this.options.parseTagValue, this.options.numberParseOptions) : e;
        }
      }
      function Je(e) {
        if (this.options.removeNSPrefix) {
          let t = e.split(":"), s = e.charAt(0) === "/" ? "/" : "";
          if (t[0] === "xmlns")
            return "";
          t.length === 2 && (e = s + t[1]);
        }
        return e;
      }
      var We = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
      function Ke(e, t, s) {
        if (!this.options.ignoreAttributes && typeof e == "string") {
          let i = _2.getAllMatches(e, We), n = i.length, r = {};
          for (let f = 0; f < n; f++) {
            let u = this.resolveNameSpace(i[f][1]), o = i[f][4], l = this.options.attributeNamePrefix + u;
            if (u.length)
              if (this.options.transformAttributeName && (l = this.options.transformAttributeName(l)), l === "__proto__" && (l = "#__proto__"), o !== void 0) {
                this.options.trimValues && (o = o.trim()), o = this.replaceEntitiesValue(o);
                let a = this.options.attributeValueProcessor(u, o, t);
                a == null ? r[l] = o : typeof a != typeof o || a !== o ? r[l] = a : r[l] = $(o, this.options.parseAttributeValue, this.options.numberParseOptions);
              } else
                this.options.allowBooleanAttributes && (r[l] = true);
          }
          if (!Object.keys(r).length)
            return;
          if (this.options.attributesGroupName) {
            let f = {};
            return f[this.options.attributesGroupName] = r, f;
          }
          return r;
        }
      }
      var Qe = function(e) {
        e = e.replace(/\r\n?/g, `
`);
        let t = new P("!xml"), s = t, i = "", n = "";
        for (let r = 0; r < e.length; r++)
          if (e[r] === "<")
            if (e[r + 1] === "/") {
              let u = m(e, ">", r, "Closing Tag is not closed."), o = e.substring(r + 2, u).trim();
              if (this.options.removeNSPrefix) {
                let d = o.indexOf(":");
                d !== -1 && (o = o.substr(d + 1));
              }
              this.options.transformTagName && (o = this.options.transformTagName(o)), s && (i = this.saveTextToParentTag(i, s, n));
              let l = n.substring(n.lastIndexOf(".") + 1);
              if (o && this.options.unpairedTags.indexOf(o) !== -1)
                throw new Error(`Unpaired tag can not be used as closing tag: </${o}>`);
              let a = 0;
              l && this.options.unpairedTags.indexOf(l) !== -1 ? (a = n.lastIndexOf(".", n.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : a = n.lastIndexOf("."), n = n.substring(0, a), s = this.tagsNodeStack.pop(), i = "", r = u;
            } else if (e[r + 1] === "?") {
              let u = S(e, r, false, "?>");
              if (!u)
                throw new Error("Pi Tag is not closed.");
              if (i = this.saveTextToParentTag(i, s, n), !(this.options.ignoreDeclaration && u.tagName === "?xml" || this.options.ignorePiTags)) {
                let o = new P(u.tagName);
                o.add(this.options.textNodeName, ""), u.tagName !== u.tagExp && u.attrExpPresent && (o[":@"] = this.buildAttributesMap(u.tagExp, n, u.tagName)), this.addChild(s, o, n);
              }
              r = u.closeIndex + 1;
            } else if (e.substr(r + 1, 3) === "!--") {
              let u = m(e, "-->", r + 4, "Comment is not closed.");
              if (this.options.commentPropName) {
                let o = e.substring(r + 4, u - 2);
                i = this.saveTextToParentTag(i, s, n), s.add(this.options.commentPropName, [{ [this.options.textNodeName]: o }]);
              }
              r = u;
            } else if (e.substr(r + 1, 2) === "!D") {
              let u = Ge(e, r);
              this.docTypeEntities = u.entities, r = u.i;
            } else if (e.substr(r + 1, 2) === "![") {
              let u = m(e, "]]>", r, "CDATA is not closed.") - 2, o = e.substring(r + 9, u);
              if (i = this.saveTextToParentTag(i, s, n), this.options.cdataPropName)
                s.add(this.options.cdataPropName, [{ [this.options.textNodeName]: o }]);
              else {
                let l = this.parseTextData(o, s.tagname, n, true, false, true);
                l == null && (l = ""), s.add(this.options.textNodeName, l);
              }
              r = u + 2;
            } else {
              let u = S(e, r, this.options.removeNSPrefix), o = u.tagName, l = u.rawTagName, a = u.tagExp, d = u.attrExpPresent, g = u.closeIndex;
              this.options.transformTagName && (o = this.options.transformTagName(o)), s && i && s.tagname !== "!xml" && (i = this.saveTextToParentTag(i, s, n, false));
              let N = s;
              if (N && this.options.unpairedTags.indexOf(N.tagname) !== -1 && (s = this.tagsNodeStack.pop(), n = n.substring(0, n.lastIndexOf("."))), o !== t.tagname && (n += n ? "." + o : o), this.isItStopNode(this.options.stopNodes, n, o)) {
                let c = "";
                if (a.length > 0 && a.lastIndexOf("/") === a.length - 1)
                  r = u.closeIndex;
                else if (this.options.unpairedTags.indexOf(o) !== -1)
                  r = u.closeIndex;
                else {
                  let T = this.readStopNodeData(e, l, g + 1);
                  if (!T)
                    throw new Error(`Unexpected end of ${l}`);
                  r = T.i, c = T.tagContent;
                }
                let A = new P(o);
                o !== a && d && (A[":@"] = this.buildAttributesMap(a, n, o)), c && (c = this.parseTextData(c, o, n, true, d, true, true)), n = n.substr(0, n.lastIndexOf(".")), A.add(this.options.textNodeName, c), this.addChild(s, A, n);
              } else {
                if (a.length > 0 && a.lastIndexOf("/") === a.length - 1) {
                  o[o.length - 1] === "/" ? (o = o.substr(0, o.length - 1), n = n.substr(0, n.length - 1), a = o) : a = a.substr(0, a.length - 1), this.options.transformTagName && (o = this.options.transformTagName(o));
                  let c = new P(o);
                  o !== a && d && (c[":@"] = this.buildAttributesMap(a, n, o)), this.addChild(s, c, n), n = n.substr(0, n.lastIndexOf("."));
                } else {
                  let c = new P(o);
                  this.tagsNodeStack.push(s), o !== a && d && (c[":@"] = this.buildAttributesMap(a, n, o)), this.addChild(s, c, n), s = c;
                }
                i = "", r = g;
              }
            }
          else
            i += e[r];
        return t.child;
      };
      function ze(e, t, s) {
        let i = this.options.updateTag(t.tagname, s, t[":@"]);
        i === false || (typeof i == "string" && (t.tagname = i), e.addChild(t));
      }
      var He = function(e) {
        if (this.options.processEntities) {
          for (let t in this.docTypeEntities) {
            let s = this.docTypeEntities[t];
            e = e.replace(s.regx, s.val);
          }
          for (let t in this.lastEntities) {
            let s = this.lastEntities[t];
            e = e.replace(s.regex, s.val);
          }
          if (this.options.htmlEntities)
            for (let t in this.htmlEntities) {
              let s = this.htmlEntities[t];
              e = e.replace(s.regex, s.val);
            }
          e = e.replace(this.ampEntity.regex, this.ampEntity.val);
        }
        return e;
      };
      function je(e, t, s, i) {
        return e && (i === void 0 && (i = Object.keys(t.child).length === 0), e = this.parseTextData(e, t.tagname, s, false, t[":@"] ? Object.keys(t[":@"]).length !== 0 : false, i), e !== void 0 && e !== "" && t.add(this.options.textNodeName, e), e = ""), e;
      }
      function De(e, t, s) {
        let i = "*." + s;
        for (let n in e) {
          let r = e[n];
          if (i === r || t === r)
            return true;
        }
        return false;
      }
      function et(e, t, s = ">") {
        let i, n = "";
        for (let r = t; r < e.length; r++) {
          let f = e[r];
          if (i)
            f === i && (i = "");
          else if (f === '"' || f === "'")
            i = f;
          else if (f === s[0])
            if (s[1]) {
              if (e[r + 1] === s[1])
                return { data: n, index: r };
            } else
              return { data: n, index: r };
          else
            f === "	" && (f = " ");
          n += f;
        }
      }
      function m(e, t, s, i) {
        let n = e.indexOf(t, s);
        if (n === -1)
          throw new Error(i);
        return n + t.length - 1;
      }
      function S(e, t, s, i = ">") {
        let n = et(e, t + 1, i);
        if (!n)
          return;
        let r = n.data, f = n.index, u = r.search(/\s/), o = r, l = true;
        u !== -1 && (o = r.substr(0, u).replace(/\s\s*$/, ""), r = r.substr(u + 1));
        let a = o;
        if (s) {
          let d = o.indexOf(":");
          d !== -1 && (o = o.substr(d + 1), l = o !== n.data.substr(d + 1));
        }
        return { tagName: o, tagExp: r, closeIndex: f, attrExpPresent: l, rawTagName: a };
      }
      function tt(e, t, s) {
        let i = s, n = 1;
        for (; s < e.length; s++)
          if (e[s] === "<")
            if (e[s + 1] === "/") {
              let r = m(e, ">", s, `${t} is not closed`);
              if (e.substring(s + 2, r).trim() === t && (n--, n === 0))
                return { tagContent: e.substring(i, s), i: r };
              s = r;
            } else if (e[s + 1] === "?")
              s = m(e, "?>", s + 1, "StopNode is not closed.");
            else if (e.substr(s + 1, 3) === "!--")
              s = m(e, "-->", s + 3, "StopNode is not closed.");
            else if (e.substr(s + 1, 2) === "![")
              s = m(e, "]]>", s, "StopNode is not closed.") - 2;
            else {
              let r = S(e, s, ">");
              r && ((r && r.tagName) === t && r.tagExp[r.tagExp.length - 1] !== "/" && n++, s = r.closeIndex);
            }
      }
      function $(e, t, s) {
        if (t && typeof e == "string") {
          let i = e.trim();
          return i === "true" ? true : i === "false" ? false : Ze(e, s);
        } else
          return _2.isExist(e) ? e : "";
      }
      H.exports = F;
    });
    var te = b((ee) => {
      "use strict";
      function st(e, t) {
        return D(e, t);
      }
      function D(e, t, s) {
        let i, n = {};
        for (let r = 0; r < e.length; r++) {
          let f = e[r], u = nt(f), o = "";
          if (s === void 0 ? o = u : o = s + "." + u, u === t.textNodeName)
            i === void 0 ? i = f[u] : i += "" + f[u];
          else {
            if (u === void 0)
              continue;
            if (f[u]) {
              let l = D(f[u], t, o), a = it(l, t);
              f[":@"] ? rt(l, f[":@"], o, t) : Object.keys(l).length === 1 && l[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode ? l = l[t.textNodeName] : Object.keys(l).length === 0 && (t.alwaysCreateTextNode ? l[t.textNodeName] = "" : l = ""), n[u] !== void 0 && n.hasOwnProperty(u) ? (Array.isArray(n[u]) || (n[u] = [n[u]]), n[u].push(l)) : t.isArray(u, o, a) ? n[u] = [l] : n[u] = l;
            }
          }
        }
        return typeof i == "string" ? i.length > 0 && (n[t.textNodeName] = i) : i !== void 0 && (n[t.textNodeName] = i), n;
      }
      function nt(e) {
        let t = Object.keys(e);
        for (let s = 0; s < t.length; s++) {
          let i = t[s];
          if (i !== ":@")
            return i;
        }
      }
      function rt(e, t, s, i) {
        if (t) {
          let n = Object.keys(t), r = n.length;
          for (let f = 0; f < r; f++) {
            let u = n[f];
            i.isArray(u, s + "." + u, true, true) ? e[u] = [t[u]] : e[u] = t[u];
          }
        }
      }
      function it(e, t) {
        let { textNodeName: s } = t, i = Object.keys(e).length;
        return !!(i === 0 || i === 1 && (e[s] || typeof e[s] == "boolean" || e[s] === 0));
      }
      ee.prettify = st;
    });
    var ne = b((Bt, se) => {
      var { buildOptions: ot } = U(), ut = j(), { prettify: ft } = te(), lt = x(), L = class {
        constructor(t) {
          this.externalEntities = {}, this.options = ot(t);
        }
        parse(t, s) {
          if (typeof t != "string")
            if (t.toString)
              t = t.toString();
            else
              throw new Error("XML data is accepted in String or Bytes[] form.");
          if (s) {
            s === true && (s = {});
            let r = lt.validate(t, s);
            if (r !== true)
              throw Error(`${r.err.msg}:${r.err.line}:${r.err.col}`);
          }
          let i = new ut(this.options);
          i.addExternalEntities(this.externalEntities);
          let n = i.parseXml(t);
          return this.options.preserveOrder || n === void 0 ? n : ft(n, this.options);
        }
        addEntity(t, s) {
          if (s.indexOf("&") !== -1)
            throw new Error("Entity value can't have '&'");
          if (t.indexOf("&") !== -1 || t.indexOf(";") !== -1)
            throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
          if (s === "&")
            throw new Error("An entity with value '&' is not permitted");
          this.externalEntities[t] = s;
        }
      };
      se.exports = L;
    });
    var fe = b((qt, ue) => {
      var at = `
`;
      function dt(e, t) {
        let s = "";
        return t.format && t.indentBy.length > 0 && (s = at), ie(e, t, "", s);
      }
      function ie(e, t, s, i) {
        let n = "", r = false;
        for (let f = 0; f < e.length; f++) {
          let u = e[f], o = ct(u);
          if (o === void 0)
            continue;
          let l = "";
          if (s.length === 0 ? l = o : l = `${s}.${o}`, o === t.textNodeName) {
            let c = u[o];
            ht(l, t) || (c = t.tagValueProcessor(o, c), c = oe(c, t)), r && (n += i), n += c, r = false;
            continue;
          } else if (o === t.cdataPropName) {
            r && (n += i), n += `<![CDATA[${u[o][0][t.textNodeName]}]]>`, r = false;
            continue;
          } else if (o === t.commentPropName) {
            n += i + `<!--${u[o][0][t.textNodeName]}-->`, r = true;
            continue;
          } else if (o[0] === "?") {
            let c = re(u[":@"], t), A = o === "?xml" ? "" : i, T = u[o][0][t.textNodeName];
            T = T.length !== 0 ? " " + T : "", n += A + `<${o}${T}${c}?>`, r = true;
            continue;
          }
          let a = i;
          a !== "" && (a += t.indentBy);
          let d = re(u[":@"], t), g = i + `<${o}${d}`, N = ie(u[o], t, l, a);
          t.unpairedTags.indexOf(o) !== -1 ? t.suppressUnpairedNode ? n += g + ">" : n += g + "/>" : (!N || N.length === 0) && t.suppressEmptyNode ? n += g + "/>" : N && N.endsWith(">") ? n += g + `>${N}${i}</${o}>` : (n += g + ">", N && i !== "" && (N.includes("/>") || N.includes("</")) ? n += i + t.indentBy + N + i : n += N, n += `</${o}>`), r = true;
        }
        return n;
      }
      function ct(e) {
        let t = Object.keys(e);
        for (let s = 0; s < t.length; s++) {
          let i = t[s];
          if (e.hasOwnProperty(i) && i !== ":@")
            return i;
        }
      }
      function re(e, t) {
        let s = "";
        if (e && !t.ignoreAttributes)
          for (let i in e) {
            if (!e.hasOwnProperty(i))
              continue;
            let n = t.attributeValueProcessor(i, e[i]);
            n = oe(n, t), n === true && t.suppressBooleanAttributes ? s += ` ${i.substr(t.attributeNamePrefix.length)}` : s += ` ${i.substr(t.attributeNamePrefix.length)}="${n}"`;
          }
        return s;
      }
      function ht(e, t) {
        e = e.substr(0, e.length - t.textNodeName.length - 1);
        let s = e.substr(e.lastIndexOf(".") + 1);
        for (let i in t.stopNodes)
          if (t.stopNodes[i] === e || t.stopNodes[i] === "*." + s)
            return true;
        return false;
      }
      function oe(e, t) {
        if (e && e.length > 0 && t.processEntities)
          for (let s = 0; s < t.entities.length; s++) {
            let i = t.entities[s];
            e = e.replace(i.regex, i.val);
          }
        return e;
      }
      ue.exports = dt;
    });
    var ae = b((Mt, le) => {
      "use strict";
      var gt = fe(), pt = { attributeNamePrefix: "@_", attributesGroupName: false, textNodeName: "#text", ignoreAttributes: true, cdataPropName: false, format: false, indentBy: "  ", suppressEmptyNode: false, suppressUnpairedNode: true, suppressBooleanAttributes: true, tagValueProcessor: function(e, t) {
        return t;
      }, attributeValueProcessor: function(e, t) {
        return t;
      }, preserveOrder: false, commentPropName: false, unpairedTags: [], entities: [{ regex: new RegExp("&", "g"), val: "&amp;" }, { regex: new RegExp(">", "g"), val: "&gt;" }, { regex: new RegExp("<", "g"), val: "&lt;" }, { regex: new RegExp("'", "g"), val: "&apos;" }, { regex: new RegExp('"', "g"), val: "&quot;" }], processEntities: true, stopNodes: [], oneListGroup: false };
      function y(e) {
        this.options = Object.assign({}, pt, e), this.options.ignoreAttributes || this.options.attributesGroupName ? this.isAttribute = function() {
          return false;
        } : (this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = Et), this.processTextOrObjNode = Nt, this.options.format ? (this.indentate = bt, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
          return "";
        }, this.tagEndChar = ">", this.newLine = "");
      }
      y.prototype.build = function(e) {
        return this.options.preserveOrder ? gt(e, this.options) : (Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = { [this.options.arrayNodeName]: e }), this.j2x(e, 0).val);
      };
      y.prototype.j2x = function(e, t) {
        let s = "", i = "";
        for (let n in e)
          if (Object.prototype.hasOwnProperty.call(e, n))
            if (typeof e[n] > "u")
              this.isAttribute(n) && (i += "");
            else if (e[n] === null)
              this.isAttribute(n) ? i += "" : n[0] === "?" ? i += this.indentate(t) + "<" + n + "?" + this.tagEndChar : i += this.indentate(t) + "<" + n + "/" + this.tagEndChar;
            else if (e[n] instanceof Date)
              i += this.buildTextValNode(e[n], n, "", t);
            else if (typeof e[n] != "object") {
              let r = this.isAttribute(n);
              if (r)
                s += this.buildAttrPairStr(r, "" + e[n]);
              else if (n === this.options.textNodeName) {
                let f = this.options.tagValueProcessor(n, "" + e[n]);
                i += this.replaceEntitiesValue(f);
              } else
                i += this.buildTextValNode(e[n], n, "", t);
            } else if (Array.isArray(e[n])) {
              let r = e[n].length, f = "";
              for (let u = 0; u < r; u++) {
                let o = e[n][u];
                typeof o > "u" || (o === null ? n[0] === "?" ? i += this.indentate(t) + "<" + n + "?" + this.tagEndChar : i += this.indentate(t) + "<" + n + "/" + this.tagEndChar : typeof o == "object" ? this.options.oneListGroup ? f += this.j2x(o, t + 1).val : f += this.processTextOrObjNode(o, n, t) : f += this.buildTextValNode(o, n, "", t));
              }
              this.options.oneListGroup && (f = this.buildObjectNode(f, n, "", t)), i += f;
            } else if (this.options.attributesGroupName && n === this.options.attributesGroupName) {
              let r = Object.keys(e[n]), f = r.length;
              for (let u = 0; u < f; u++)
                s += this.buildAttrPairStr(r[u], "" + e[n][r[u]]);
            } else
              i += this.processTextOrObjNode(e[n], n, t);
        return { attrStr: s, val: i };
      };
      y.prototype.buildAttrPairStr = function(e, t) {
        return t = this.options.attributeValueProcessor(e, "" + t), t = this.replaceEntitiesValue(t), this.options.suppressBooleanAttributes && t === "true" ? " " + e : " " + e + '="' + t + '"';
      };
      function Nt(e, t, s) {
        let i = this.j2x(e, s + 1);
        return e[this.options.textNodeName] !== void 0 && Object.keys(e).length === 1 ? this.buildTextValNode(e[this.options.textNodeName], t, i.attrStr, s) : this.buildObjectNode(i.val, t, i.attrStr, s);
      }
      y.prototype.buildObjectNode = function(e, t, s, i) {
        if (e === "")
          return t[0] === "?" ? this.indentate(i) + "<" + t + s + "?" + this.tagEndChar : this.indentate(i) + "<" + t + s + this.closeTag(t) + this.tagEndChar;
        {
          let n = "</" + t + this.tagEndChar, r = "";
          return t[0] === "?" && (r = "?", n = ""), (s || s === "") && e.indexOf("<") === -1 ? this.indentate(i) + "<" + t + s + r + ">" + e + n : this.options.commentPropName !== false && t === this.options.commentPropName && r.length === 0 ? this.indentate(i) + `<!--${e}-->` + this.newLine : this.indentate(i) + "<" + t + s + r + this.tagEndChar + e + this.indentate(i) + n;
        }
      };
      y.prototype.closeTag = function(e) {
        let t = "";
        return this.options.unpairedTags.indexOf(e) !== -1 ? this.options.suppressUnpairedNode || (t = "/") : this.options.suppressEmptyNode ? t = "/" : t = `></${e}`, t;
      };
      y.prototype.buildTextValNode = function(e, t, s, i) {
        if (this.options.cdataPropName !== false && t === this.options.cdataPropName)
          return this.indentate(i) + `<![CDATA[${e}]]>` + this.newLine;
        if (this.options.commentPropName !== false && t === this.options.commentPropName)
          return this.indentate(i) + `<!--${e}-->` + this.newLine;
        if (t[0] === "?")
          return this.indentate(i) + "<" + t + s + "?" + this.tagEndChar;
        {
          let n = this.options.tagValueProcessor(t, e);
          return n = this.replaceEntitiesValue(n), n === "" ? this.indentate(i) + "<" + t + s + this.closeTag(t) + this.tagEndChar : this.indentate(i) + "<" + t + s + ">" + n + "</" + t + this.tagEndChar;
        }
      };
      y.prototype.replaceEntitiesValue = function(e) {
        if (e && e.length > 0 && this.options.processEntities)
          for (let t = 0; t < this.options.entities.length; t++) {
            let s = this.options.entities[t];
            e = e.replace(s.regex, s.val);
          }
        return e;
      };
      function bt(e) {
        return this.options.indentBy.repeat(e);
      }
      function Et(e) {
        return e.startsWith(this.options.attributeNamePrefix) && e !== this.options.textNodeName ? e.substr(this.attrPrefixLen) : false;
      }
      le.exports = y;
    });
    var ce = b((kt, de) => {
      "use strict";
      var Tt = x(), yt = ne(), mt = ae();
      de.exports = { XMLParser: yt, XMLValidator: Tt, XMLBuilder: mt };
    });
    var he = b((O) => {
      "use strict";
      Object.defineProperty(O, "__esModule", { value: true });
      O.getValueFromTextNode = void 0;
      var At = (e) => {
        let t = "#text";
        for (let s in e)
          e.hasOwnProperty(s) && e[s][t] !== void 0 ? e[s] = e[s][t] : typeof e[s] == "object" && e[s] !== null && (e[s] = (0, O.getValueFromTextNode)(e[s]));
        return e;
      };
      O.getValueFromTextNode = At;
    });
    var { XMLParser: wt, XMLBuilder: Pt } = ce();
    var { getValueFromTextNode: Ot } = he();
    module2.exports = { XMLParser: wt, XMLBuilder: Pt, getValueFromTextNode: Ot };
  }
});

// node_modules/@aws-lite/client/src/lib/index.js
var require_lib = __commonJS({
  "node_modules/@aws-lite/client/src/lib/index.js"(exports, module2) {
    var aws;
    var ini;
    var xml;
    function marshaller(method, obj2, awsjsonSetting, config) {
      if (!aws) {
        aws = require_aws();
      }
      let { awsjsonMarshall, awsjsonUnmarshall } = config;
      let marshallOptions = method === "marshall" ? awsjsonMarshall : awsjsonUnmarshall;
      if (marshallOptions) {
        let { is } = require_validate();
        if (!is.object(marshallOptions))
          throw ReferenceError("AWS JSON marshall/unmarshall options must be an object");
      }
      if (Array.isArray(awsjsonSetting)) {
        return Object.entries(obj2).reduce((acc, [k, v]) => {
          if (awsjsonSetting.includes(k))
            acc[k] = aws[method](v, marshallOptions);
          else
            acc[k] = v;
          return acc;
        }, {});
      }
      return aws[method](obj2, marshallOptions);
    }
    var awsjson = {
      marshall: marshaller.bind({}, "marshall"),
      unmarshall: marshaller.bind({}, "unmarshall")
    };
    async function exists(file) {
      let { stat } = require("node:fs/promises");
      try {
        await stat(file);
        return true;
      } catch {
        return false;
      }
    }
    function tidyPathPrefix(pathPrefix) {
      if (pathPrefix === "/") {
        return void 0;
      }
      if (!pathPrefix.startsWith("/")) {
        pathPrefix = "/" + pathPrefix;
      }
      if (pathPrefix.endsWith("/")) {
        pathPrefix = pathPrefix.substring(0, pathPrefix.length - 1);
      }
      return pathPrefix;
    }
    var tidyObj = (obj2) => Object.keys(obj2).forEach((k) => !obj2[k] && delete obj2[k]);
    function getEndpointParams(input) {
      if (input.endpoint || input.url) {
        try {
          let url = new URL(input.endpoint || input.url);
          let pathPrefix2 = tidyPathPrefix(url.pathname);
          let host2 = url.hostname;
          let port2 = Number(url.port);
          let protocol2 = url.protocol;
          let params2 = { pathPrefix: pathPrefix2, host: host2, port: port2, protocol: protocol2 };
          tidyObj(params2);
          return params2;
        } catch {
          return { host: input.endpoint || input.url };
        }
      }
      let { pathPrefix, host, hostname, port, protocol } = input;
      try {
        let url = new URL(host || hostname);
        host = url.hostname;
      } catch {
      }
      if (pathPrefix)
        pathPrefix = tidyPathPrefix(pathPrefix);
      if (port)
        port = Number(port);
      if (typeof protocol === "string" && !protocol.endsWith(":")) {
        protocol += ":";
      }
      validateProtocol(protocol);
      let params = { pathPrefix, host: host || hostname, port, protocol };
      tidyObj(params);
      return params;
    }
    async function loadAwsConfig(params) {
      let { awsConfigFile } = params;
      let { AWS_SDK_LOAD_CONFIG, AWS_CONFIG_FILE } = process.env;
      if (!AWS_SDK_LOAD_CONFIG && !awsConfigFile)
        return;
      let { join } = require("node:path");
      let os = require("node:os");
      let home = os.homedir();
      let configFile = AWS_CONFIG_FILE || join(home, ".aws", "config");
      if (typeof awsConfigFile === "string")
        configFile = awsConfigFile;
      return await readConfig(configFile);
    }
    var cache = {};
    async function readConfig(file) {
      if (cache[file])
        return cache[file];
      if (!await exists(file))
        return;
      let { readFile } = require("node:fs/promises");
      if (!ini)
        ini = require_ini();
      let data = await readFile(file);
      let result = ini.parse(data.toString());
      cache[file] = result;
      return result;
    }
    function tidyQuery(obj2) {
      let qs = require("node:querystring");
      let tidied = {};
      Object.entries(obj2).forEach(([k, v]) => {
        if (v || v === false)
          tidied[k] = v;
      });
      if (Object.keys(tidied).length)
        return qs.stringify(tidied);
    }
    var nonLocalEnvs = ["staging", "production"];
    function useAWS() {
      let { ARC_ENV, ARC_LOCAL, ARC_SANDBOX } = process.env;
      if (ARC_ENV === "testing")
        return false;
      if (nonLocalEnvs.includes(ARC_ENV) && ARC_SANDBOX && !ARC_LOCAL)
        return false;
      return true;
    }
    var textNodeName = "#text";
    function maybeConvertString(str2) {
      if (str2 === "true")
        return true;
      else if (str2 === "false")
        return false;
      else if (str2 === "null")
        return null;
      else if (str2 === "")
        return str2;
      else if (str2?.match(/^[ ]+$/))
        return str2;
      else if (!isNaN(Number(str2))) {
        return Number(str2);
      }
      try {
        if (new Date(Date.parse(str2)).toISOString() === str2) {
          return new Date(str2);
        }
      } catch {
      }
      return str2;
    }
    function coerceXMLValues(obj2) {
      Object.keys(obj2).forEach((k) => {
        if (typeof obj2[k] === "string") {
          obj2[k] = maybeConvertString(obj2[k]);
        } else if (Array.isArray(obj2[k])) {
          obj2[k] = obj2[k].map((i) => {
            if (typeof i === "object" && !Array.isArray(i)) {
              return coerceXMLValues(i);
            }
            return maybeConvertString(i);
          });
        } else if (typeof obj2[k] === "object") {
          coerceXMLValues(obj2[k]);
        }
      });
      return obj2;
    }
    function instantiateXml() {
      if (xml)
        return;
      let vendor = require_xml();
      xml = {
        parser: new vendor.XMLParser({
          attributeNamePrefix: "",
          htmlEntities: true,
          ignoreAttributes: false,
          ignoreDeclaration: true,
          parseTagValue: false,
          trimValues: false,
          tagValueProcessor: (_2, val2) => val2.trim() === "" && val2.includes("\n") ? "" : void 0
        }),
        builder: new vendor.XMLBuilder()
      };
      xml.parser.addEntity("#xD", "\r");
      xml.parser.addEntity("#10", "\n");
      xml.parser.getValueFromTextNode = vendor.getValueFromTextNode;
    }
    function buildXML(obj2, params) {
      instantiateXml();
      let payload = xml.builder.build(obj2);
      if (params?.xmlns) {
        let parent = Object.keys(obj2)[0];
        payload = payload.replace(
          `<${parent}>`,
          `<${parent} xmlns="${params.xmlns}">`
        );
      }
      return payload;
    }
    function parseXML(body) {
      instantiateXml();
      let parsed = xml.parser.parse(body);
      let key = Object.keys(parsed)[0];
      let payloadToReturn = parsed[key];
      if (payloadToReturn[textNodeName]) {
        payloadToReturn[key] = payloadToReturn[textNodeName];
        delete payloadToReturn[textNodeName];
      }
      return coerceXMLValues(xml.parser.getValueFromTextNode(payloadToReturn));
    }
    function validateProtocol(protocol) {
      if (protocol && !["https:", "http:"].includes(protocol)) {
        throw ReferenceError("Protocol must be `https:` or `http:`");
      }
    }
    var JSONregex = /application\/json/;
    var JSONContentType = (ct) => ct.match(JSONregex);
    var AwsJSONregex = /application\/x-amz-json/;
    var AwsJSONContentType = (ct) => ct.match(AwsJSONregex);
    var XMLregex = /(application|text)\/xml/;
    var XMLContentType = (ct) => ct.match(XMLregex);
    module2.exports = {
      awsjson,
      exists,
      getEndpointParams,
      loadAwsConfig,
      readConfig,
      tidyQuery,
      useAWS,
      buildXML,
      parseXML,
      validateProtocol,
      // Content types
      JSONContentType,
      AwsJSONContentType,
      XMLContentType
    };
  }
});

// node_modules/@aws-lite/client/src/config/get-plugins.js
var require_get_plugins = __commonJS({
  "node_modules/@aws-lite/client/src/config/get-plugins.js"(exports, module2) {
    module2.exports = async function getPlugin(config) {
      let { autoloadPlugins = false, plugins = [] } = config;
      if (!Array.isArray(plugins)) {
        throw TypeError("Plugins must be an array");
      }
      if (!autoloadPlugins && !plugins.length)
        return [];
      if (plugins.length) {
        let { is } = require_validate();
        let resolved = [];
        for (let item of plugins) {
          if (item?.then && typeof item.then === "function") {
            let plugin = await item;
            plugin = plugin.default ? plugin.default : plugin;
            resolved.push(plugin);
            continue;
          } else if (is.object(item)) {
            let plugin = item.default ? item.default : item;
            resolved.push(plugin);
            continue;
          }
          throw TypeError("Plugins must be an imported / required module or an import statement");
        }
        return resolved;
      }
      if (autoloadPlugins) {
        let { exists } = require_lib();
        let { join } = require("node:path");
        let dedupe = (arr2) => [...new Set(arr2)];
        let processDir = process.cwd();
        let packageJsonFile = join(processDir, "package.json");
        let processNodeModulesDir = join(process.cwd(), "node_modules");
        let relativeNodeModulesDir;
        try {
          relativeNodeModulesDir = require.resolve("@aws-lite/client").split(awsLite10)[0];
        } catch {
        }
        let pluginsToLoad = [];
        if (await exists(processNodeModulesDir)) {
          let found = await scanNodeModulesDir(processNodeModulesDir);
          if (found.length)
            pluginsToLoad.push(...dedupe(plugins.concat(found)));
        } else if (relativeNodeModulesDir && await exists(relativeNodeModulesDir)) {
          let found = await scanNodeModulesDir(relativeNodeModulesDir);
          if (found.length)
            pluginsToLoad.push(...dedupe(plugins.concat(found)));
        } else if (await exists(packageJsonFile)) {
          let { readFile } = require("node:fs/promises");
          let packageJson = JSON.parse(await readFile(packageJsonFile));
          let { dependencies: deps } = packageJson;
          if (deps) {
            let found = Object.keys(deps).filter((m) => m.startsWith("@aws-lite/") || m.startsWith("aws-lite-plugin-")).filter(tidy);
            if (found.length)
              pluginsToLoad.push(...dedupe(plugins.concat(found)));
          }
        }
        if (pluginsToLoad.length) {
          for (let pluginName of pluginsToLoad) {
            let plugin;
            try {
              plugin = require(pluginName);
              plugins.push(plugin);
            } catch (err) {
              if (hasEsmError(err)) {
                let path = pluginName;
                if (process.platform.startsWith("win")) {
                  try {
                    path = "file://" + require.resolve(path);
                  } catch {
                    path = "file://" + pluginName;
                  }
                }
                let mod = await import(path);
                plugin = mod.default ? mod.default : mod;
                plugins.push(plugin);
              } else {
                throw err;
              }
            }
          }
        }
        return plugins;
      }
    };
    var awsLite10 = "@aws-lite";
    var ignored = ["@aws-lite/client", "@aws-lite/arc"];
    var tidy = (p) => !ignored.includes(p) && !p.endsWith("-types");
    async function scanNodeModulesDir(dir) {
      let found = [];
      let { join } = require("node:path");
      let { readdir } = require("node:fs/promises");
      let mods = await readdir(dir);
      if (mods.includes(awsLite10)) {
        let knownPlugins = await readdir(join(dir, awsLite10));
        found.push(...knownPlugins.map((p) => `@aws-lite/${p}`));
      }
      mods.forEach((p) => p.startsWith("aws-lite-plugin-") && found.push(p));
      return found.filter(tidy);
    }
    var esmErrors = [
      "Cannot use import statement outside a module",
      `Unexpected token 'export'`,
      "require() of ES Module",
      "Must use import to load ES Module"
    ];
    var hasEsmError = (err) => esmErrors.some((msg) => err.message.includes(msg));
  }
});

// node_modules/@aws-lite/client/src/config/get-endpoint.js
var require_get_endpoint = __commonJS({
  "node_modules/@aws-lite/client/src/config/get-endpoint.js"(exports, module2) {
    var { getEndpointParams, loadAwsConfig } = require_lib();
    module2.exports = async function getEndpoint(config) {
      let endpointOrHost = config.endpoint || config.url || config.host || config.hostname;
      if (endpointOrHost)
        return getEndpointParams(config);
      let { AWS_ENDPOINT_URL } = process.env;
      if (AWS_ENDPOINT_URL)
        return getEndpointParams({ endpoint: AWS_ENDPOINT_URL });
      let awsConfig = await loadAwsConfig(config);
      if (awsConfig) {
        let { profile } = config;
        let profileName = profile === "default" ? profile : `profile ${profile}`;
        let url = awsConfig?.[profileName]?.endpoint_url;
        if (url)
          return getEndpointParams({ endpoint: url });
      }
    };
  }
});

// node_modules/@aws-lite/client/src/config/get-creds.js
var require_get_creds = __commonJS({
  "node_modules/@aws-lite/client/src/config/get-creds.js"(exports, module2) {
    module2.exports = async function getCreds(params) {
      let paramsCreds = validate(params);
      if (paramsCreds)
        return paramsCreds;
      let envCreds = getCredsFromEnv();
      if (envCreds)
        return envCreds;
      let isInLambda = process.env.AWS_LAMBDA_FUNCTION_NAME;
      if (!isInLambda) {
        let credsFileCreds = await getCredsFromFile(params);
        if (credsFileCreds)
          return credsFileCreds;
      }
      throw ReferenceError("You must supply AWS credentials via params, environment variables, or credentials file");
    };
    function getCredsFromEnv() {
      let env = process.env;
      let accessKeyId = env.AWS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY;
      let secretAccessKey = env.AWS_SECRET_ACCESS_KEY || env.AWS_SECRET_KEY;
      let sessionToken = env.AWS_SESSION_TOKEN;
      return validate({ accessKeyId, secretAccessKey, sessionToken });
    }
    async function getCredsFromFile(params) {
      let { profile } = params;
      let { AWS_SHARED_CREDENTIALS_FILE } = process.env;
      let { join } = require("path");
      let os = require("os");
      let { readConfig } = require_lib();
      let home = os.homedir();
      let credsFile = AWS_SHARED_CREDENTIALS_FILE || join(home, ".aws", "credentials");
      let creds = await readConfig(credsFile);
      if (creds) {
        if (!creds[profile]) {
          throw TypeError(`Profile not found: ${profile}`);
        }
        let accessKeyId;
        let secretAccessKey;
        let sessionToken;
        if (creds[profile].credential_process) {
          let { execSync } = require("child_process");
          let result = execSync(creds[profile].credential_process, { encoding: "utf8" });
          ({
            AccessKeyId: accessKeyId,
            SecretAccessKey: secretAccessKey,
            SessionToken: sessionToken
          } = JSON.parse(result));
        } else {
          ({
            aws_access_key_id: accessKeyId,
            aws_secret_access_key: secretAccessKey,
            aws_session_token: sessionToken
          } = creds[profile]);
        }
        return validate({ accessKeyId, secretAccessKey, sessionToken });
      }
    }
    function validate({ accessKeyId, secretAccessKey, sessionToken }) {
      if (accessKeyId && typeof accessKeyId !== "string") {
        throw TypeError("Access key must be a string");
      }
      if (secretAccessKey && typeof secretAccessKey !== "string") {
        throw TypeError("Secret access key must be a string");
      }
      if (sessionToken && typeof sessionToken !== "string") {
        throw TypeError("Session token must be a string");
      }
      if (accessKeyId && !secretAccessKey || !accessKeyId && secretAccessKey) {
        let msg = "You must supply both an access key ID & secret access key";
        throw ReferenceError(msg);
      }
      if (!accessKeyId && !secretAccessKey) {
        return false;
      }
      return { accessKeyId, secretAccessKey, sessionToken };
    }
  }
});

// node_modules/@aws-lite/client/src/config/regions.json
var require_regions = __commonJS({
  "node_modules/@aws-lite/client/src/config/regions.json"(exports, module2) {
    module2.exports = ["us-west-2", "us-west-1", "us-gov-west-1", "us-gov-east-1", "us-east-2", "us-east-1", "sa-east-1", "me-south-1", "me-central-1", "il-central-1", "eu-west-3", "eu-west-2", "eu-west-1", "eu-south-2", "eu-south-1", "eu-north-1", "eu-central-2", "eu-central-1", "cn-northwest-1", "cn-north-1", "ca-central-1", "ap-southeast-4", "ap-southeast-3", "ap-southeast-2", "ap-southeast-1", "ap-south-2", "ap-south-1", "ap-northeast-3", "ap-northeast-2", "ap-northeast-1", "ap-east-1", "af-south-1"];
  }
});

// node_modules/@aws-lite/client/src/config/get-region.js
var require_get_region = __commonJS({
  "node_modules/@aws-lite/client/src/config/get-region.js"(exports, module2) {
    var regions = require_regions();
    module2.exports = async function getRegion(params) {
      let paramsRegion = validateRegion(params, params.region);
      if (paramsRegion)
        return paramsRegion;
      let envRegion = getRegionFromEnv(params);
      if (envRegion)
        return envRegion;
      let isInLambda = process.env.AWS_LAMBDA_FUNCTION_NAME;
      if (!isInLambda) {
        let configRegion = await getRegionFromConfig(params);
        if (configRegion)
          return configRegion;
      }
      throw ReferenceError("You must supply an AWS region via params, environment variables, or config file");
    };
    function getRegionFromEnv(params) {
      let { AWS_REGION, AWS_DEFAULT_REGION, AMAZON_REGION } = process.env;
      let region = AWS_REGION || AWS_DEFAULT_REGION || AMAZON_REGION;
      return validateRegion(params, region);
    }
    async function getRegionFromConfig(params) {
      let { loadAwsConfig } = require_lib();
      let awsConfig = await loadAwsConfig(params);
      if (awsConfig) {
        let { profile } = params;
        let profileName = profile === "default" ? profile : `profile ${profile}`;
        if (!awsConfig[profileName]) {
          throw TypeError(`Profile not found: ${profile}`);
        }
        let { region } = awsConfig[profileName];
        return validateRegion(params, region);
      }
    }
    function validateRegion(params, region) {
      if (region) {
        if (typeof region !== "string") {
          throw TypeError("Region must be a string");
        }
        if (!params.host && !regions.includes(region)) {
          throw ReferenceError(`Invalid region specified: ${region}`);
        }
        return region;
      }
      return false;
    }
  }
});

// node_modules/@aws-lite/client/src/lib/services.js
var require_services = __commonJS({
  "node_modules/@aws-lite/client/src/lib/services.js"(exports, module2) {
    var services = ["access-analyzer", "access-analyzer-fips", "acm", "acm-fips", "acm-pca", "acm-pca-fips", "amplify", "amplifybackend", "amplifyuibuilder", "aos", "api-fips.sagemaker", "api.detective", "api.detective-fips", "api.ecr", "api.sagemaker", "api.tunneling.iot", "api.tunneling.iot-fips", "apigateway", "apigateway-fips", "appconfig", "appconfigdata", "appflow", "applicationinsights", "appmesh", "appmesh-fips", "appsync", "appwizard", "arc-zonal-shift", "athena", "athena-fips", "auditmanager", "autoscaling", "autoscaling-plans", "backup", "backup-fips", "batch", "braket", "budgets", "cassandra", "cloud9", "cloudcontrolapi", "cloudcontrolapi-fips", "cloudformation", "cloudformation-fips", "cloudfront", "cloudfront-fips", "cloudhsmv2", "cloudsearch", "cloudshell", "cloudtrail", "cloudtrail-fips", "codebuild", "codebuild-fips", "codecommit", "codecommit-fips", "codedeploy", "codedeploy-fips", "codepipeline", "codepipeline-fips", "codestar", "codestar-connections", "codestar-notifications", "cognito-identity", "cognito-identity-fips", "cognito-idp", "cognito-idp-fips", "compute-optimizer", "config", "config-fips", "data-ats.iot", "data.iot-fips", "databrew", "databrew-fips", "dataexchange", "datasync", "datasync-fips", "dax", "devops-guru", "devops-guru-fips", "directconnect", "directconnect-fips", "dkr.ecr-fips", "dlm", "dms", "dms-fips", "drs", "ds", "ds-fips", "dynamodb", "dynamodb-fips", "ebs", "ebs-fips", "ec2", "ec2-fips", "ec2-instance-connect", "ecr", "ecr-fips", "ecs", "ecs-fips", "eks", "elasticache", "elasticache-fips", "elasticbeanstalk", "elasticfilesystem", "elasticfilesystem-fips", "elasticmapreduce", "elasticmapreduce-fips", "elastictranscoder", "email", "es", "es-fips", "events", "events-fips", "execute-api", "fips.batch", "fips.eks", "fips.transcribe", "firehose", "firehose-fips", "fis", "fms", "fms-fips", "fsx", "fsx-fips", "gamelift", "glacier", "glacier-fips", "globalaccelerator", "glue", "glue-fips", "guardduty", "guardduty-fips", "iam", "iam-fips", "identitystore", "imagebuilder", "inspector", "inspector-fips", "inspector2", "inspector2-fips", "internetmonitor", "internetmonitor-fips", "iot", "iot-fips", "kafka", "kafka-fips", "kafkaconnect", "kinesis", "kinesis-fips", "kinesisanalytics", "kms", "kms-fips", "lakeformation", "lakeformation-fips", "lambda", "lambda-fips", "license-manager", "license-manager-fips", "logs", "logs-fips", "m2", "m2-fips", "macie2", "macie2-fips", "mediaconnect", "mediaconvert", "mediapackage", "mediapackage-vod", "mediapackagev2", "memory-db", "memory-db-fips", "metering.marketplace", "mgn", "mgn-fips", "monitoring", "monitoring-fips", "mq", "mq-fips", "network-firewall", "network-firewall-fips", "oam", "opsworks", "opsworks-cm", "organizations", "osis", "outposts", "outposts-fips", "pi", "pi-fips", "pipes", "polly", "polly-fips", "prefix.jobs.iot", "quicksight", "ram", "ram-fips", "rbin", "rbin-fips", "rds", "rds-data", "rds-fips", "redshift", "redshift-data", "redshift-fips", "redshift-serverless", "rekognition", "rekognition-fips", "resiliencehub", "resource-groups", "resource-groups-fips", "rolesanywhere", "route53", "route53-recovery-control-config", "route53-recovery-readiness", "route53resolver", "runtime.sagemaker", "s3", "s3-fips", "s3-outposts", "s3-outposts-fips", "s3.dualstack", "savingsplans", "scheduler", "schemas", "sdb", "secretsmanager", "secretsmanager-fips", "securityhub", "securityhub-fips", "securitylake", "serverlessrepo", "servicecatalog", "servicecatalog-fips", "servicediscovery", "servicediscovery-fips", "servicequotas", "shield", "shield-fips", "signer", "signer-fips", "snowball", "snowball-fips", "sns", "sqlworkbench", "sqs", "sqs-fips", "ssm", "ssm-fips", "ssm-incidents", "ssm-incidents-fips", "ssm-sap", "ssm-sap-fips", "sso", "stacksets", "states", "states-fips", "storagegateway", "storagegateway-fips", "streams.dynamodb", "sts", "sts-fips", "swf", "swf-fips", "sync-states", "sync-states-fips", "synthetics", "synthetics-fips", "tagging", "textract", "textract-fips", "transcribe", "transfer", "transfer-fips", "translate", "verifiedpermissions", "waf", "waf-fips", "waf-regional", "waf-regional-fips", "wafv2", "wafv2-fips", "wellarchitected", "xray", "xray-fips"];
    var globalServices = [
      // Global services that are no longer strictly global, and may or may not have global and regional endpoints (see: semi-global below). Just let aws4 figure it out:
      "s3",
      "sdb",
      // Known global services:
      "cloudfront",
      "globalaccelerator",
      "route53",
      "iam",
      "sts",
      "waf",
      "waf-fips",
      // Mentioned in aws4 as global but not found Service Endpoints and Quotas
      "ls",
      "importexport"
    ];
    var semiGlobalServices = ["s3", "sdb", "sts"];
    module2.exports = { services, globalServices, semiGlobalServices };
  }
});

// node_modules/aws4/lru.js
var require_lru = __commonJS({
  "node_modules/aws4/lru.js"(exports, module2) {
    module2.exports = function(size) {
      return new LruCache(size);
    };
    function LruCache(size) {
      this.capacity = size | 0;
      this.map = /* @__PURE__ */ Object.create(null);
      this.list = new DoublyLinkedList();
    }
    LruCache.prototype.get = function(key) {
      var node = this.map[key];
      if (node == null)
        return void 0;
      this.used(node);
      return node.val;
    };
    LruCache.prototype.set = function(key, val2) {
      var node = this.map[key];
      if (node != null) {
        node.val = val2;
      } else {
        if (!this.capacity)
          this.prune();
        if (!this.capacity)
          return false;
        node = new DoublyLinkedNode(key, val2);
        this.map[key] = node;
        this.capacity--;
      }
      this.used(node);
      return true;
    };
    LruCache.prototype.used = function(node) {
      this.list.moveToFront(node);
    };
    LruCache.prototype.prune = function() {
      var node = this.list.pop();
      if (node != null) {
        delete this.map[node.key];
        this.capacity++;
      }
    };
    function DoublyLinkedList() {
      this.firstNode = null;
      this.lastNode = null;
    }
    DoublyLinkedList.prototype.moveToFront = function(node) {
      if (this.firstNode == node)
        return;
      this.remove(node);
      if (this.firstNode == null) {
        this.firstNode = node;
        this.lastNode = node;
        node.prev = null;
        node.next = null;
      } else {
        node.prev = null;
        node.next = this.firstNode;
        node.next.prev = node;
        this.firstNode = node;
      }
    };
    DoublyLinkedList.prototype.pop = function() {
      var lastNode = this.lastNode;
      if (lastNode != null) {
        this.remove(lastNode);
      }
      return lastNode;
    };
    DoublyLinkedList.prototype.remove = function(node) {
      if (this.firstNode == node) {
        this.firstNode = node.next;
      } else if (node.prev != null) {
        node.prev.next = node.next;
      }
      if (this.lastNode == node) {
        this.lastNode = node.prev;
      } else if (node.next != null) {
        node.next.prev = node.prev;
      }
    };
    function DoublyLinkedNode(key, val2) {
      this.key = key;
      this.val = val2;
      this.prev = null;
      this.next = null;
    }
  }
});

// node_modules/aws4/aws4.js
var require_aws4 = __commonJS({
  "node_modules/aws4/aws4.js"(exports) {
    var aws4 = exports;
    var url = require("url");
    var querystring = require("querystring");
    var crypto = require("crypto");
    var lru = require_lru();
    var credentialsCache = lru(1e3);
    function hmac(key, string, encoding) {
      return crypto.createHmac("sha256", key).update(string, "utf8").digest(encoding);
    }
    function hash(string, encoding) {
      return crypto.createHash("sha256").update(string, "utf8").digest(encoding);
    }
    function encodeRfc3986(urlEncodedString) {
      return urlEncodedString.replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    function encodeRfc3986Full(str2) {
      return encodeRfc3986(encodeURIComponent(str2));
    }
    var HEADERS_TO_IGNORE = {
      "authorization": true,
      "connection": true,
      "x-amzn-trace-id": true,
      "user-agent": true,
      "expect": true,
      "presigned-expires": true,
      "range": true
    };
    function RequestSigner(request, credentials) {
      if (typeof request === "string")
        request = url.parse(request);
      var headers = request.headers = request.headers || {}, hostParts = (!this.service || !this.region) && this.matchHost(request.hostname || request.host || headers.Host || headers.host);
      this.request = request;
      this.credentials = credentials || this.defaultCredentials();
      this.service = request.service || hostParts[0] || "";
      this.region = request.region || hostParts[1] || "us-east-1";
      if (this.service === "email")
        this.service = "ses";
      if (!request.method && request.body)
        request.method = "POST";
      if (!headers.Host && !headers.host) {
        headers.Host = request.hostname || request.host || this.createHost();
        if (request.port)
          headers.Host += ":" + request.port;
      }
      if (!request.hostname && !request.host)
        request.hostname = headers.Host || headers.host;
      this.isCodeCommitGit = this.service === "codecommit" && request.method === "GIT";
      this.extraHeadersToIgnore = request.extraHeadersToIgnore || /* @__PURE__ */ Object.create(null);
      this.extraHeadersToInclude = request.extraHeadersToInclude || /* @__PURE__ */ Object.create(null);
    }
    RequestSigner.prototype.matchHost = function(host) {
      var match = (host || "").match(/([^\.]+)\.(?:([^\.]*)\.)?amazonaws\.com(\.cn)?$/);
      var hostParts = (match || []).slice(1, 3);
      if (hostParts[1] === "es" || hostParts[1] === "aoss")
        hostParts = hostParts.reverse();
      if (hostParts[1] == "s3") {
        hostParts[0] = "s3";
        hostParts[1] = "us-east-1";
      } else {
        for (var i = 0; i < 2; i++) {
          if (/^s3-/.test(hostParts[i])) {
            hostParts[1] = hostParts[i].slice(3);
            hostParts[0] = "s3";
            break;
          }
        }
      }
      return hostParts;
    };
    RequestSigner.prototype.isSingleRegion = function() {
      if (["s3", "sdb"].indexOf(this.service) >= 0 && this.region === "us-east-1")
        return true;
      return ["cloudfront", "ls", "route53", "iam", "importexport", "sts"].indexOf(this.service) >= 0;
    };
    RequestSigner.prototype.createHost = function() {
      var region = this.isSingleRegion() ? "" : "." + this.region, subdomain = this.service === "ses" ? "email" : this.service;
      return subdomain + region + ".amazonaws.com";
    };
    RequestSigner.prototype.prepareRequest = function() {
      this.parsePath();
      var request = this.request, headers = request.headers, query;
      if (request.signQuery) {
        this.parsedPath.query = query = this.parsedPath.query || {};
        if (this.credentials.sessionToken)
          query["X-Amz-Security-Token"] = this.credentials.sessionToken;
        if (this.service === "s3" && !query["X-Amz-Expires"])
          query["X-Amz-Expires"] = 86400;
        if (query["X-Amz-Date"])
          this.datetime = query["X-Amz-Date"];
        else
          query["X-Amz-Date"] = this.getDateTime();
        query["X-Amz-Algorithm"] = "AWS4-HMAC-SHA256";
        query["X-Amz-Credential"] = this.credentials.accessKeyId + "/" + this.credentialString();
        query["X-Amz-SignedHeaders"] = this.signedHeaders();
      } else {
        if (!request.doNotModifyHeaders && !this.isCodeCommitGit) {
          if (request.body && !headers["Content-Type"] && !headers["content-type"])
            headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
          if (request.body && !headers["Content-Length"] && !headers["content-length"])
            headers["Content-Length"] = Buffer.byteLength(request.body);
          if (this.credentials.sessionToken && !headers["X-Amz-Security-Token"] && !headers["x-amz-security-token"])
            headers["X-Amz-Security-Token"] = this.credentials.sessionToken;
          if (this.service === "s3" && !headers["X-Amz-Content-Sha256"] && !headers["x-amz-content-sha256"])
            headers["X-Amz-Content-Sha256"] = hash(this.request.body || "", "hex");
          if (headers["X-Amz-Date"] || headers["x-amz-date"])
            this.datetime = headers["X-Amz-Date"] || headers["x-amz-date"];
          else
            headers["X-Amz-Date"] = this.getDateTime();
        }
        delete headers.Authorization;
        delete headers.authorization;
      }
    };
    RequestSigner.prototype.sign = function() {
      if (!this.parsedPath)
        this.prepareRequest();
      if (this.request.signQuery) {
        this.parsedPath.query["X-Amz-Signature"] = this.signature();
      } else {
        this.request.headers.Authorization = this.authHeader();
      }
      this.request.path = this.formatPath();
      return this.request;
    };
    RequestSigner.prototype.getDateTime = function() {
      if (!this.datetime) {
        var headers = this.request.headers, date = new Date(headers.Date || headers.date || /* @__PURE__ */ new Date());
        this.datetime = date.toISOString().replace(/[:\-]|\.\d{3}/g, "");
        if (this.isCodeCommitGit)
          this.datetime = this.datetime.slice(0, -1);
      }
      return this.datetime;
    };
    RequestSigner.prototype.getDate = function() {
      return this.getDateTime().substr(0, 8);
    };
    RequestSigner.prototype.authHeader = function() {
      return [
        "AWS4-HMAC-SHA256 Credential=" + this.credentials.accessKeyId + "/" + this.credentialString(),
        "SignedHeaders=" + this.signedHeaders(),
        "Signature=" + this.signature()
      ].join(", ");
    };
    RequestSigner.prototype.signature = function() {
      var date = this.getDate(), cacheKey = [this.credentials.secretAccessKey, date, this.region, this.service].join(), kDate, kRegion, kService, kCredentials = credentialsCache.get(cacheKey);
      if (!kCredentials) {
        kDate = hmac("AWS4" + this.credentials.secretAccessKey, date);
        kRegion = hmac(kDate, this.region);
        kService = hmac(kRegion, this.service);
        kCredentials = hmac(kService, "aws4_request");
        credentialsCache.set(cacheKey, kCredentials);
      }
      return hmac(kCredentials, this.stringToSign(), "hex");
    };
    RequestSigner.prototype.stringToSign = function() {
      return [
        "AWS4-HMAC-SHA256",
        this.getDateTime(),
        this.credentialString(),
        hash(this.canonicalString(), "hex")
      ].join("\n");
    };
    RequestSigner.prototype.canonicalString = function() {
      if (!this.parsedPath)
        this.prepareRequest();
      var pathStr = this.parsedPath.path, query = this.parsedPath.query, headers = this.request.headers, queryStr = "", normalizePath = this.service !== "s3", decodePath = this.service === "s3" || this.request.doNotEncodePath, decodeSlashesInPath = this.service === "s3", firstValOnly = this.service === "s3", bodyHash;
      if (this.service === "s3" && this.request.signQuery) {
        bodyHash = "UNSIGNED-PAYLOAD";
      } else if (this.isCodeCommitGit) {
        bodyHash = "";
      } else {
        bodyHash = headers["X-Amz-Content-Sha256"] || headers["x-amz-content-sha256"] || hash(this.request.body || "", "hex");
      }
      if (query) {
        var reducedQuery = Object.keys(query).reduce(function(obj2, key) {
          if (!key)
            return obj2;
          obj2[encodeRfc3986Full(key)] = !Array.isArray(query[key]) ? query[key] : firstValOnly ? query[key][0] : query[key];
          return obj2;
        }, {});
        var encodedQueryPieces = [];
        Object.keys(reducedQuery).sort().forEach(function(key) {
          if (!Array.isArray(reducedQuery[key])) {
            encodedQueryPieces.push(key + "=" + encodeRfc3986Full(reducedQuery[key]));
          } else {
            reducedQuery[key].map(encodeRfc3986Full).sort().forEach(function(val2) {
              encodedQueryPieces.push(key + "=" + val2);
            });
          }
        });
        queryStr = encodedQueryPieces.join("&");
      }
      if (pathStr !== "/") {
        if (normalizePath)
          pathStr = pathStr.replace(/\/{2,}/g, "/");
        pathStr = pathStr.split("/").reduce(function(path, piece) {
          if (normalizePath && piece === "..") {
            path.pop();
          } else if (!normalizePath || piece !== ".") {
            if (decodePath)
              piece = decodeURIComponent(piece.replace(/\+/g, " "));
            path.push(encodeRfc3986Full(piece));
          }
          return path;
        }, []).join("/");
        if (pathStr[0] !== "/")
          pathStr = "/" + pathStr;
        if (decodeSlashesInPath)
          pathStr = pathStr.replace(/%2F/g, "/");
      }
      return [
        this.request.method || "GET",
        pathStr,
        queryStr,
        this.canonicalHeaders() + "\n",
        this.signedHeaders(),
        bodyHash
      ].join("\n");
    };
    RequestSigner.prototype.canonicalHeaders = function() {
      var headers = this.request.headers;
      function trimAll(header) {
        return header.toString().trim().replace(/\s+/g, " ");
      }
      return Object.keys(headers).filter(function(key) {
        return HEADERS_TO_IGNORE[key.toLowerCase()] == null;
      }).sort(function(a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      }).map(function(key) {
        return key.toLowerCase() + ":" + trimAll(headers[key]);
      }).join("\n");
    };
    RequestSigner.prototype.signedHeaders = function() {
      var extraHeadersToInclude = this.extraHeadersToInclude, extraHeadersToIgnore = this.extraHeadersToIgnore;
      return Object.keys(this.request.headers).map(function(key) {
        return key.toLowerCase();
      }).filter(function(key) {
        return extraHeadersToInclude[key] || HEADERS_TO_IGNORE[key] == null && !extraHeadersToIgnore[key];
      }).sort().join(";");
    };
    RequestSigner.prototype.credentialString = function() {
      return [
        this.getDate(),
        this.region,
        this.service,
        "aws4_request"
      ].join("/");
    };
    RequestSigner.prototype.defaultCredentials = function() {
      var env = process.env;
      return {
        accessKeyId: env.AWS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY || env.AWS_SECRET_KEY,
        sessionToken: env.AWS_SESSION_TOKEN
      };
    };
    RequestSigner.prototype.parsePath = function() {
      var path = this.request.path || "/";
      if (/[^0-9A-Za-z;,/?:@&=+$\-_.!~*'()#%]/.test(path)) {
        path = encodeURI(decodeURI(path));
      }
      var queryIx = path.indexOf("?"), query = null;
      if (queryIx >= 0) {
        query = querystring.parse(path.slice(queryIx + 1));
        path = path.slice(0, queryIx);
      }
      this.parsedPath = {
        path,
        query
      };
    };
    RequestSigner.prototype.formatPath = function() {
      var path = this.parsedPath.path, query = this.parsedPath.query;
      if (!query)
        return path;
      if (query[""] != null)
        delete query[""];
      return path + "?" + encodeRfc3986(querystring.stringify(query));
    };
    aws4.RequestSigner = RequestSigner;
    aws4.sign = function(request, credentials) {
      return new RequestSigner(request, credentials).sign();
    };
  }
});

// node_modules/@aws-lite/client/src/request/request.js
var require_request = __commonJS({
  "node_modules/@aws-lite/client/src/request/request.js"(exports, module2) {
    var aws4 = require_aws4();
    var { awsjson, parseXML, useAWS, JSONContentType, AwsJSONContentType, XMLContentType } = require_lib();
    var agentCache = {
      http: { keepAliveEnabled: null, keepAliveDisabled: null },
      https: { keepAliveEnabled: null, keepAliveDisabled: null }
    };
    function getAgent(client, isHTTPS, config) {
      let http = isHTTPS ? "https" : "http";
      let keepAlive = config.keepAlive ?? useAWS();
      let agent = keepAlive ? "keepAliveEnabled" : "keepAliveDisabled";
      if (!agentCache[http][agent]) {
        agentCache[http][agent] = new client.Agent({ keepAlive });
      }
      return agentCache[http][agent];
    }
    module2.exports = async function request(params, args) {
      let { config, metadata } = args;
      let { debug, maxAttempts, retries } = config;
      retries = maxAttempts ?? retries ?? 5;
      if (isNaN(retries)) {
        throw ReferenceError("retries property must a number");
      }
      for (let i = 0; i <= retries; i++) {
        let retrying = i > 0;
        try {
          let result = await call(params, args, retrying);
          if (i === retries || reqCompleted(result.statusCode)) {
            if (isOk(result.statusCode))
              return result;
            let { statusCode, headers, payload } = result;
            throw { statusCode, headers, error: payload, metadata, passthrough: true };
          }
          await retryDelay(i, `status code ${result.statusCode}`, debug);
        } catch (error) {
          if (i < retries && retryableTimeoutErrorCodes.includes(error?.error?.code)) {
            await retryDelay(i, `connection error: ${error.error.code}`, debug);
          } else {
            if (!error.error)
              throw error;
            if (error.passthrough) {
              delete error.passthrough;
              throw error;
            }
            error.error = error.error.message || /* istanbul ignore next */
            error.error.code;
            throw error;
          }
        }
      }
    };
    function call(params, args, retrying) {
      let { creds, config, metadata, signing, stream } = args;
      let { rawResponsePayload } = params;
      let { debug } = config;
      let { protocol } = signing;
      return new Promise((resolve, reject) => {
        let options = aws4.sign(signing, creds);
        options.host = options.host || options.hostname;
        if (options.hostname)
          delete options.hostname;
        let isHTTPS = options.host?.includes(".amazonaws.com") || protocol === "https:";
        if (!options.protocol) {
          options.protocol = isHTTPS ? "https:" : "http:";
        }
        let http = isHTTPS ? require("node:https") : require("node:http");
        options.port = params.port || config.port;
        options.agent = getAgent(http, isHTTPS, config);
        let { body } = params;
        let isBuffer = body instanceof Buffer;
        if (debug && !retrying) {
          let { method = "GET", protocol: protocol2, host, port, path, headers, service: service2 } = options;
          let truncatedBody;
          if (isBuffer)
            truncatedBody = `<body buffer of ${body.length}b>`;
          else if (stream)
            truncatedBody = `<readable stream>`;
          else
            truncatedBody = body?.length > 1e3 ? body?.substring(0, 1e3) + "..." : body;
          let { accessKeyId, secretAccessKey } = creds;
          let Authorization = headers.Authorization.replace(accessKeyId, accessKeyId.substring(0, 8) + "...").replace(secretAccessKey, "[redacted]");
          let sigRe = /(Signature=)[^,]*/;
          let fullSig = Authorization.match(sigRe);
          if (fullSig) {
            let redactedSig = "Signature=" + fullSig[0].split("Signature=")[1].substring(0, 8) + "...";
            Authorization = Authorization.replace(sigRe, redactedSig);
          }
          console.error("[aws-lite] Request:", {
            time: (/* @__PURE__ */ new Date()).toISOString(),
            service: service2,
            method,
            url: `${protocol2}//${host}${port ? ":" + port : ""}${path}`,
            headers: { ...headers, Authorization },
            body: truncatedBody || "<no body>"
          }, "\n");
        }
        let req = http.request(options, (res2) => {
          let data = [];
          let { headers = {}, statusCode } = res2;
          let ok = isOk(statusCode);
          res2.on("data", (chunk) => data.push(chunk));
          res2.on("end", () => {
            let body2 = Buffer.concat(data), payload, rawString;
            let contentType = config.responseContentType || headers["content-type"] || headers["Content-Type"] || "";
            if (rawResponsePayload) {
              payload = body2;
              if (debug)
                rawString = body2.toString();
            } else {
              if (body2.length && (JSONContentType(contentType) || AwsJSONContentType(contentType))) {
                payload = JSON.parse(body2);
                if (debug)
                  rawString = body2.toString();
                if (AwsJSONContentType(contentType)) {
                  try {
                    payload = awsjson.unmarshall(payload, null, config);
                  } catch {
                  }
                }
              }
              if (body2.length && XMLContentType(contentType)) {
                payload = parseXML(body2);
                if (payload.xmlns)
                  delete payload.xmlns;
                if (debug)
                  rawString = body2.toString();
              }
              if (body2.length && !ok && !contentType) {
                try {
                  payload = JSON.parse(body2);
                } catch {
                  try {
                    payload = parseXML(body2);
                  } catch {
                    payload = body2.toString();
                  }
                }
              }
            }
            payload = payload || (body2.length ? body2 : null);
            if (debug) {
              let truncatedBody;
              if (payload instanceof Buffer)
                truncatedBody = body2.length ? `<body buffer of ${body2.length}b>` : "";
              else if (rawString)
                truncatedBody = rawString?.length > 250 ? rawString?.substring(0, 250) + "..." : rawString;
              console.error("[aws-lite] Response:", {
                time: (/* @__PURE__ */ new Date()).toISOString(),
                statusCode,
                headers,
                body: truncatedBody || "<no body>"
              }, "\n");
            }
            resolve({ statusCode, headers, payload });
          });
        });
        req.on("error", (error) => {
          if (debug) {
            console.error("[aws-lite] HTTP error:", error);
          }
          reject({
            error,
            metadata: {
              ...metadata,
              rawStack: error.stack,
              service: params.service,
              host: options.host,
              protocol: options.protocol.replace(":", ""),
              port: options.port
            }
          });
        });
        if (stream) {
          stream.pipe(req);
          if (debug) {
            let bytes = 0;
            stream.on("data", (chunk) => {
              bytes += chunk.length;
              console.error(`Bytes streamed: ${bytes}`);
            });
          }
        } else
          req.end(options.body || "");
      });
    }
    var isOk = (statusCode) => statusCode >= 200 && statusCode < 303;
    var reqCompleted = (statusCode) => statusCode < 500 && statusCode !== 429;
    var awsTimeoutErrorCodes = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];
    var aws4TimeoutErrorCodes = ["EADDRINFO", "ESOCKETTIMEDOUT", "ENOTFOUND", "EMFILE"];
    var retryableTimeoutErrorCodes = awsTimeoutErrorCodes.concat(aws4TimeoutErrorCodes);
    var maxRetryBackoff = 20 * 1e3;
    async function retryDelay(i, reason, debug) {
      let rando = Math.floor(Math.random() * 50 * Math.pow(2, i));
      let delay = Math.min(rando, maxRetryBackoff);
      if (debug) {
        console.error(`[aws-lite] Request failed (${reason}), retrying in ${delay} ms`);
      }
      await new Promise((res2) => setTimeout(res2, delay));
    }
  }
});

// node_modules/@aws-lite/client/src/request/index.js
var require_request2 = __commonJS({
  "node_modules/@aws-lite/client/src/request/index.js"(exports, module2) {
    var { awsjson, buildXML, getEndpointParams, tidyQuery, validateProtocol, AwsJSONContentType, XMLContentType } = require_lib();
    var { globalServices, semiGlobalServices } = require_services();
    var { is } = require_validate();
    var request = require_request();
    var copy = (obj2) => JSON.parse(JSON.stringify(obj2));
    module2.exports = async function _request(params, creds, region, config, metadata) {
      if (params.paginator?.default === "enabled" && params.paginate !== false || params.paginator && params.paginate) {
        return await paginator(params, creds, region, config, metadata);
      }
      return await makeRequest(params, creds, region, config, metadata);
    };
    async function makeRequest(params, creds, region, config, metadata) {
      let overrides = getEndpointParams(params);
      let protocol = overrides.protocol || config.protocol;
      let host = overrides.host || config.host;
      let port = overrides.port || config.port;
      let pathPrefix = overrides.pathPrefix || config.pathPrefix;
      let path = params.path || "";
      validateProtocol(protocol);
      if (params.endpoint)
        delete params.endpoint;
      if (params.hostname)
        delete params.hostname;
      if (path && !path.startsWith("/")) {
        path = "/" + path;
      }
      if (pathPrefix) {
        path = pathPrefix + path;
      }
      path = (path || "/").replace(/[\/]{2,}/g, "/");
      if (params.query) {
        if (!is.object(params.query)) {
          throw ReferenceError("Query property must be an object");
        }
        let query = tidyQuery(params.query);
        if (query) {
          path += "?" + query;
        }
      }
      let headers = params.headers || {};
      let contentType = headers["content-type"] || headers["Content-Type"] || "";
      if (headers["Content-Type"])
        delete headers["Content-Type"];
      let body = params.payload || params.body || params.data;
      let isBuffer = body instanceof Buffer;
      let isStream = is.stream(body);
      if (typeof body === "object" && !isBuffer && !isStream) {
        if (!contentType)
          contentType = "application/json";
        if (XMLContentType(contentType)) {
          params.body = buildXML(body, params);
        } else {
          let awsjsonEncode = params.awsjson || AwsJSONContentType(contentType) && params.awsjson !== false;
          if (awsjsonEncode) {
            if (!AwsJSONContentType(contentType)) {
              contentType = "application/x-amz-json-1.0";
            }
            body = awsjson.marshall(body, params.awsjson, config);
          }
          params.body = JSON.stringify(body);
        }
      } else {
        params.body = isStream ? void 0 : body;
      }
      if (contentType) {
        headers["content-type"] = contentType;
      } else if (params.body) {
        headers["content-type"] = "application/octet-stream";
      }
      params.headers = headers;
      let signing = { region, ...params, protocol, host, port, pathPrefix, path };
      if (globalServices.includes(params.service)) {
        let isSemiGlobal = semiGlobalServices.includes(params.service);
        if (!isSemiGlobal || isSemiGlobal && region === "us-east-1") {
          delete signing.region;
        }
      }
      let stream = isStream ? body : void 0;
      return await request(params, { creds, config, metadata, signing, stream });
    }
    var validPaginationTypes = ["payload", "query"];
    async function paginator(params, creds, region, config, metadata) {
      let { debug } = config;
      let { type = "payload", cursor, token, accumulator } = params.paginator;
      let nestedAccumulator = accumulator.split(".").length > 1;
      if (!cursor || !is.string(cursor) && !is.array(cursor)) {
        throw ReferenceError(`aws-lite paginator requires a cursor property name (string) or cursor property array`);
      }
      if (!token || !is.string(token) && !is.array(token)) {
        throw ReferenceError(`aws-lite paginator requires a token property name (string) or token property array`);
      }
      if (typeof cursor !== typeof token) {
        throw ReferenceError(`aws-lite paginator requires a token and cursor properties to both be a string or array`);
      }
      if (!accumulator || typeof accumulator !== "string") {
        throw ReferenceError(`aws-lite paginator requires an accumulator property name (string)`);
      }
      if (type && !validPaginationTypes.includes(type)) {
        throw ReferenceError(`aws-lite paginator type must be one of: ${validPaginationTypes.join(", ")}`);
      }
      let originalHeaders = copy(params.headers || {});
      let page = 1;
      let items = [];
      let statusCode, headers;
      async function get() {
        let result = await makeRequest(
          { ...params, headers: copy(originalHeaders) },
          creds,
          region,
          config,
          metadata
        );
        if (!result.payload) {
          throw ReferenceError("Pagination error: missing API response");
        }
        if (typeof result.payload !== "object") {
          throw ReferenceError("Pagination error: response must be valid JSON or XML");
        }
        let accumulated = nestedAccumulator ? accumulator.split(".").reduce((parent, child) => parent?.[child], result.payload) : result.payload[accumulator] || [];
        if (accumulated && !Array.isArray(accumulated)) {
          accumulated = [accumulated];
        }
        statusCode = result.statusCode;
        headers = result.headers;
        if (!accumulated.length) {
          return;
        }
        if (is.string(cursor) && is.string(token)) {
          cursor = [cursor];
          token = [token];
        }
        if (cursor.length !== token.length) {
          throw ReferenceError(`aws-lite paginator requires an equal number of cursor and token properties`);
        }
        let checkPageEquality = (t, i) => result.payload[t] && result.payload[t] === params[type][cursor[i]];
        if (token.every(checkPageEquality)) {
          return;
        }
        items.push(...accumulated);
        if (token.every((t) => result.payload[t])) {
          if (type === "payload" || !type) {
            token.forEach((t, i) => params.payload[cursor[i]] = result.payload[t]);
          }
          if (type === "query") {
            params.query = params.query || {};
            token.forEach((t, i) => params.query[cursor[i]] = result.payload[t]);
          }
          page++;
          if (debug)
            console.error(`[aws-lite] Paginator: getting page ${page}`);
          await get();
        }
      }
      await get();
      if (nestedAccumulator) {
        return { statusCode, headers, payload: reNestAccumulated(accumulator, items) };
      }
      return { statusCode, headers, payload: { [accumulator]: items } };
    }
    function reNestAccumulated(acc, items) {
      acc = Array.isArray(acc) ? acc : acc.split(".");
      if (!acc.length)
        return items;
      return { [acc.shift()]: reNestAccumulated(acc, items) };
    }
  }
});

// node_modules/@aws-lite/client/src/testing.js
var require_testing = __commonJS({
  "node_modules/@aws-lite/client/src/testing.js"(exports, module2) {
    var debug = (params = {}) => {
      let { print: print2 } = params;
      if (print2) {
        console.error("[aws-lite] Testing debug:");
        console.dir(methods.data, { depth: null });
      }
      return methods.data;
    };
    function disable() {
      reset();
      methods.data.enabled = false;
      methods.data.usePluginResponseMethod = false;
    }
    function enable(params = {}) {
      let { usePluginResponseMethod } = params;
      reset();
      methods.data.enabled = true;
      methods.data.usePluginResponseMethod = usePluginResponseMethod || false;
    }
    function getAllRequests(target) {
      if (!target)
        return methods.data.allRequests;
      let { service: service2, method } = getMethod(target);
      return methods.data?.[service2]?.[method]?.requests;
    }
    function getAllResponses(target) {
      if (!target)
        return methods.data.allResponses;
      let { service: service2, method } = getMethod(target);
      return methods.data?.[service2]?.[method]?.responses;
    }
    function getLastRequest(target) {
      if (!target)
        return lastItem(methods.data.allRequests);
      let { service: service2, method } = getMethod(target);
      return lastItem(methods.data?.[service2]?.[method]?.requests);
    }
    function getLastResponse(target) {
      if (!target)
        return lastItem(methods.data.allResponses);
      let { service: service2, method } = getMethod(target);
      return lastItem(methods.data?.[service2]?.[method]?.responses);
    }
    var isEnabled = () => methods.data.enabled;
    function mock(target, mock2) {
      let { service: service2, method } = getMethod(target);
      initMethod(service2, method);
      methods.data[service2][method].mocks = Array.isArray(mock2) ? mock2 : [mock2];
    }
    function reset() {
      let { enabled, usePluginResponseMethod } = methods.data || {};
      methods.data = {
        enabled,
        usePluginResponseMethod,
        allRequests: [],
        allResponses: []
      };
    }
    var methods = {
      debug,
      disable,
      enable,
      getAllRequests,
      getAllResponses,
      getLastRequest,
      getLastResponse,
      isEnabled,
      mock,
      reset
    };
    disable();
    module2.exports = methods;
    function getMethod(target) {
      if (target === "client")
        return {
          service: "aws-lite",
          method: "client"
        };
      let bits = target.split(".");
      if (bits.length !== 2) {
        throw ReferenceError(`Invalid test method: ${target}`);
      }
      return {
        service: bits[0],
        method: bits[1]
      };
    }
    function initMethod(service2, method) {
      if (!methods.data?.[service2]) {
        methods.data[service2] = {};
      }
      if (!methods.data?.[service2]?.[method]) {
        methods.data[service2][method] = { requests: [], responses: [], mocks: [] };
      }
    }
    var lastItem = (arr2) => arr2[arr2.length - 1];
  }
});

// node_modules/@aws-lite/client/src/client-factory.js
var require_client_factory = __commonJS({
  "node_modules/@aws-lite/client/src/client-factory.js"(exports, module2) {
    var request = require_request2();
    var { services } = require_services();
    var testing = require_testing();
    var { awsjson, buildXML } = require_lib();
    var { validateInput } = require_validate();
    var errorHandler = require_error();
    var aws;
    var enumerable = false;
    var credentialProps = ["accessKeyId", "secretAccessKey", "sessionToken"];
    var copy = (obj2) => JSON.parse(JSON.stringify(obj2));
    module2.exports = async function clientFactory(config, creds, region) {
      let configuration = copy(config);
      credentialProps.forEach((p) => delete configuration[p]);
      let credentials = copy(creds);
      Object.defineProperty(credentials, "secretAccessKey", { enumerable });
      Object.defineProperty(credentials, "sessionToken", { enumerable });
      async function client(params = {}) {
        let selectedRegion = params.region || region;
        let verifyService = params.verifyService ?? config.verifyService ?? true;
        validateService(params.service, verifyService);
        let metadata = { service: params.service };
        try {
          let mock = await getMock("aws-lite", "client", params, metadata);
          if (mock)
            return mock;
          return await request(params, creds, selectedRegion, config, metadata);
        } catch (err) {
          errorHandler(err);
        }
      }
      client.config = { ...configuration, region };
      client.credentials = credentials;
      if (config.debug) {
        console.error("[aws-lite] Client instantiated with this config:", client.config);
        console.error("[aws-lite] Client instantiated with these creds:", {
          ...credentials,
          secretAccessKey: credentials.secretAccessKey ? "[found / redacted]" : void 0,
          sessionToken: credentials.sessionToken ? "[found / redacted]" : void 0
        });
      }
      let { plugins } = config;
      if (plugins.length) {
        if (config.debug) {
          console.error("[aws-lite] Loading plugins", plugins.map(({ name, service: service2 }) => name || service2), "\n");
        }
        for (let plugin of plugins) {
          try {
            let { service: service2, methods, property: property2 } = plugin;
            validateService(service2, config.verifyService);
            if (!methods || (typeof methods !== "object" || Array.isArray(methods))) {
              throw TypeError("Plugin must export a methods object");
            }
            Object.values(methods).forEach((method) => {
              if (method.request && typeof method.request !== "function") {
                throw ReferenceError(`All plugin request methods must be a function: ${service2}`);
              }
              if (method.response && typeof method.response !== "function") {
                throw ReferenceError(`All plugin response methods must be a function: ${service2}`);
              }
              if (method.error && typeof method.error !== "function") {
                throw ReferenceError(`All plugin error methods must be a function: ${service2}`);
              }
            });
            if (!aws) {
              aws = require_aws();
            }
            let pluginUtils = {
              awsjsonMarshall: aws.marshall,
              awsjsonUnmarshall: aws.unmarshall,
              config: configuration,
              credentials,
              buildXML
            };
            let clientMethods = {};
            Object.entries(methods).forEach(([name, method]) => {
              if (!method || method.disabled)
                return;
              clientMethods[name] = Object.defineProperty(async (input) => {
                input = input || {};
                let selectedRegion = input?.region || region;
                let metadata = { service: service2, name, property: property2 };
                if (method.awsDoc) {
                  metadata.awsDoc = method.awsDoc;
                }
                if (plugin?.name?.startsWith("@aws-lite/")) {
                  metadata.readme = `https://aws-lite.org/services/${service2}#${name.toLowerCase()}`;
                } else if (method.readme) {
                  metadata.readme = method.readme;
                }
                if (method.validate) {
                  validateInput(method.validate, input, metadata);
                }
                if (method.request) {
                  try {
                    var req = await method.request(input, { ...pluginUtils, region: selectedRegion });
                    req = req || {};
                  } catch (methodError) {
                    errorHandler({ error: methodError, metadata });
                  }
                }
                let params = { ...input, ...req };
                if (method.validate) {
                  validateInput(method.validate, params, metadata);
                }
                try {
                  let response;
                  let mock = await getMock(property2, name, params, metadata);
                  if (mock && !testing.data.usePluginResponseMethod) {
                    return mock;
                  } else if (mock) {
                    response = mock;
                  } else {
                    response = await request({ ...params, service: service2 }, creds, selectedRegion, config, metadata);
                  }
                  if (method.response) {
                    try {
                      var pluginRes = await method.response(response, { ...pluginUtils, region: selectedRegion });
                    } catch (methodError) {
                      errorHandler({ error: methodError, metadata });
                    }
                    if (pluginRes !== void 0) {
                      let unmarshalling = pluginRes?.awsjson;
                      if (unmarshalling) {
                        delete pluginRes.awsjson;
                        let unmarshalled = awsjson.unmarshall(pluginRes.payload || pluginRes, unmarshalling, config);
                        response = pluginRes.payload ? { ...pluginRes, payload: unmarshalled } : unmarshalled;
                      } else
                        response = pluginRes;
                    }
                  }
                  return response;
                } catch (err) {
                  if (err?.metadata?.mock && !testing.data.usePluginResponseMethod) {
                    errorHandler(err);
                  }
                  let updatedError;
                  if (method.error && !(err instanceof Error)) {
                    try {
                      updatedError = await method.error(err, { ...pluginUtils, region: selectedRegion });
                    } catch (methodError) {
                      errorHandler({ error: methodError, metadata: { service: service2, name, property: property2 } });
                    }
                    updatedError = updatedError || err;
                    updatedError.metadata = { ...updatedError.metadata, ...metadata };
                    errorHandler(updatedError);
                  }
                  errorHandler(err);
                }
              }, "name", { value: name });
            });
            let serviceName = property2 || service2;
            client[serviceName] = clientMethods;
            let propLow = serviceName.toLowerCase();
            if (serviceName !== propLow) {
              client[propLow] = clientMethods;
              Object.defineProperty(client, propLow, { enumerable });
            }
          } catch (err) {
            let name = plugin.name ? `: ${plugin.name}` : "";
            console.error(`Plugin error${name}`);
            throw err;
          }
        }
      }
      return client;
    };
    function validateService(service2, verify = true) {
      if (!service2) {
        throw ReferenceError("No AWS service specified");
      }
      if (verify && !services.includes(service2)) {
        throw ReferenceError(`Invalid AWS service specified: ${service2}`);
      }
    }
    async function getMock(property2, name, params, metadata) {
      if (testing.data.enabled) {
        if (!testing.data?.[property2]?.[name]?.mocks?.length) {
          throw ReferenceError(`Mock response not found: ${property2}.${name}`);
        }
        let clientResponse = property2 === "aws-lite" && name === "client";
        let response;
        let item = {
          method: `${property2}.${name}`,
          time: (/* @__PURE__ */ new Date()).toISOString()
        };
        let req = { ...item, request: params };
        testing.data.allRequests.push(req);
        testing.data[property2][name].requests.push(req);
        if (testing.data[property2][name].mocks.length === 1) {
          response = testing.data[property2][name].mocks[0];
        } else {
          response = testing.data[property2][name].mocks.shift();
        }
        if (typeof response === "function") {
          response = response.constructor.name === "AsyncFunction" ? response(params) : await response(params);
        }
        if (clientResponse || testing.data.usePluginResponseMethod) {
          if (!response.statusCode) {
            let method = clientResponse ? "client" : `${property2}.${name}`;
            throw ReferenceError(`Mock response must include statusCode property (${method})`);
          }
          if (!response.headers)
            response.headers = {};
          if (!response.error)
            response.payload = response.payload ?? "";
        }
        let res2 = { ...item, response };
        testing.data.allResponses.push(res2);
        testing.data[property2][name].responses.push(res2);
        if (response.error)
          throw {
            ...response,
            metadata: { ...metadata, mock: true }
          };
        return response;
      }
    }
  }
});

// node_modules/@aws-lite/client/src/index.js
var require_src = __commonJS({
  "node_modules/@aws-lite/client/src/index.js"(exports, module2) {
    var getPlugins = require_get_plugins();
    var getEndpoint = require_get_endpoint();
    var getCreds = require_get_creds();
    var getRegion = require_get_region();
    var clientFactory = require_client_factory();
    var testing = require_testing();
    async function awsLite10(config = {}) {
      config.profile = config.profile || process.env.AWS_PROFILE || "default";
      config.debug = config.debug || process.env.AWS_LITE_DEBUG;
      config.plugins = await getPlugins(config);
      config = { ...config, ...await getEndpoint(config) };
      let creds = await getCreds(config);
      let region = await getRegion(config);
      return await clientFactory(config, creds, region);
    }
    awsLite10.testing = testing;
    module2.exports = awsLite10;
  }
});

// node_modules/@aws-lite/cloudformation/src/incomplete.mjs
var disabled, docRoot, incomplete_default;
var init_incomplete = __esm({
  "node_modules/@aws-lite/cloudformation/src/incomplete.mjs"() {
    disabled = true;
    docRoot = "https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/";
    incomplete_default = {
      ActivateOrganizationsAccess: { disabled, awsDoc: docRoot + "API_ActivateOrganizationsAccess.html" },
      ActivateType: { disabled, awsDoc: docRoot + "API_ActivateType.html" },
      BatchDescribeTypeConfigurations: { disabled, awsDoc: docRoot + "API_BatchDescribeTypeConfigurations.html" },
      CancelUpdateStack: { disabled, awsDoc: docRoot + "API_CancelUpdateStack.html" },
      ContinueUpdateRollback: { disabled, awsDoc: docRoot + "API_ContinueUpdateRollback.html" },
      CreateChangeSet: { disabled, awsDoc: docRoot + "API_CreateChangeSet.html" },
      CreateStackInstances: { disabled, awsDoc: docRoot + "API_CreateStackInstances.html" },
      CreateStackSet: { disabled, awsDoc: docRoot + "API_CreateStackSet.html" },
      DeactivateOrganizationsAccess: { disabled, awsDoc: docRoot + "API_DeactivateOrganizationsAccess.html" },
      DeactivateType: { disabled, awsDoc: docRoot + "API_DeactivateType.html" },
      DeleteChangeSet: { disabled, awsDoc: docRoot + "API_DeleteChangeSet.html" },
      DeleteStackInstances: { disabled, awsDoc: docRoot + "API_DeleteStackInstances.html" },
      DeleteStackSet: { disabled, awsDoc: docRoot + "API_DeleteStackSet.html" },
      DeregisterType: { disabled, awsDoc: docRoot + "API_DeregisterType.html" },
      DescribeAccountLimits: { disabled, awsDoc: docRoot + "API_DescribeAccountLimits.html" },
      DescribeChangeSet: { disabled, awsDoc: docRoot + "API_DescribeChangeSet.html" },
      DescribeChangeSetHooks: { disabled, awsDoc: docRoot + "API_DescribeChangeSetHooks.html" },
      DescribeOrganizationsAccess: { disabled, awsDoc: docRoot + "API_DescribeOrganizationsAccess.html" },
      DescribePublisher: { disabled, awsDoc: docRoot + "API_DescribePublisher.html" },
      DescribeStackDriftDetectionStatus: { disabled, awsDoc: docRoot + "API_DescribeStackDriftDetectionStatus.html" },
      DescribeStackEvents: { disabled, awsDoc: docRoot + "API_DescribeStackEvents.html" },
      DescribeStackInstance: { disabled, awsDoc: docRoot + "API_DescribeStackInstance.html" },
      DescribeStackResource: { disabled, awsDoc: docRoot + "API_DescribeStackResource.html" },
      DescribeStackResourceDrifts: { disabled, awsDoc: docRoot + "API_DescribeStackResourceDrifts.html" },
      DescribeStackSet: { disabled, awsDoc: docRoot + "API_DescribeStackSet.html" },
      DescribeStackSetOperation: { disabled, awsDoc: docRoot + "API_DescribeStackSetOperation.html" },
      DescribeType: { disabled, awsDoc: docRoot + "API_DescribeType.html" },
      DescribeTypeRegistration: { disabled, awsDoc: docRoot + "API_DescribeTypeRegistration.html" },
      DetectStackDrift: { disabled, awsDoc: docRoot + "API_DetectStackDrift.html" },
      DetectStackResourceDrift: { disabled, awsDoc: docRoot + "API_DetectStackResourceDrift.html" },
      DetectStackSetDrift: { disabled, awsDoc: docRoot + "API_DetectStackSetDrift.html" },
      EstimateTemplateCost: { disabled, awsDoc: docRoot + "API_EstimateTemplateCost.html" },
      ExecuteChangeSet: { disabled, awsDoc: docRoot + "API_ExecuteChangeSet.html" },
      GetStackPolicy: { disabled, awsDoc: docRoot + "API_GetStackPolicy.html" },
      GetTemplate: { disabled, awsDoc: docRoot + "API_GetTemplate.html" },
      GetTemplateSummary: { disabled, awsDoc: docRoot + "API_GetTemplateSummary.html" },
      ImportStacksToStackSet: { disabled, awsDoc: docRoot + "API_ImportStacksToStackSet.html" },
      ListChangeSets: { disabled, awsDoc: docRoot + "API_ListChangeSets.html" },
      ListExports: { disabled, awsDoc: docRoot + "API_ListExports.html" },
      ListImports: { disabled, awsDoc: docRoot + "API_ListImports.html" },
      ListStackInstanceResourceDrifts: { disabled, awsDoc: docRoot + "API_ListStackInstanceResourceDrifts.html" },
      ListStackInstances: { disabled, awsDoc: docRoot + "API_ListStackInstances.html" },
      ListStacks: { disabled, awsDoc: docRoot + "API_ListStacks.html" },
      ListStackSetOperationResults: { disabled, awsDoc: docRoot + "API_ListStackSetOperationResults.html" },
      ListStackSetOperations: { disabled, awsDoc: docRoot + "API_ListStackSetOperations.html" },
      ListStackSets: { disabled, awsDoc: docRoot + "API_ListStackSets.html" },
      ListTypeRegistrations: { disabled, awsDoc: docRoot + "API_ListTypeRegistrations.html" },
      ListTypes: { disabled, awsDoc: docRoot + "API_ListTypes.html" },
      ListTypeVersions: { disabled, awsDoc: docRoot + "API_ListTypeVersions.html" },
      PublishType: { disabled, awsDoc: docRoot + "API_PublishType.html" },
      RecordHandlerProgress: { disabled, awsDoc: docRoot + "API_RecordHandlerProgress.html" },
      RegisterPublisher: { disabled, awsDoc: docRoot + "API_RegisterPublisher.html" },
      RegisterType: { disabled, awsDoc: docRoot + "API_RegisterType.html" },
      RollbackStack: { disabled, awsDoc: docRoot + "API_RollbackStack.html" },
      SetStackPolicy: { disabled, awsDoc: docRoot + "API_SetStackPolicy.html" },
      SetTypeConfiguration: { disabled, awsDoc: docRoot + "API_SetTypeConfiguration.html" },
      SetTypeDefaultVersion: { disabled, awsDoc: docRoot + "API_SetTypeDefaultVersion.html" },
      SignalResource: { disabled, awsDoc: docRoot + "API_SignalResource.html" },
      StopStackSetOperation: { disabled, awsDoc: docRoot + "API_StopStackSetOperation.html" },
      TestType: { disabled, awsDoc: docRoot + "API_TestType.html" },
      UpdateStackInstances: { disabled, awsDoc: docRoot + "API_UpdateStackInstances.html" },
      UpdateStackSet: { disabled, awsDoc: docRoot + "API_UpdateStackSet.html" },
      UpdateTerminationProtection: { disabled, awsDoc: docRoot + "API_UpdateTerminationProtection.html" },
      ValidateTemplate: { disabled, awsDoc: docRoot + "API_ValidateTemplate.html" }
    };
  }
});

// node_modules/@aws-lite/cloudformation/src/lib.mjs
function querystringifyParams(obj2) {
  const raw = {};
  function walk(item, propName) {
    if (isLiteral(item)) {
      raw[propName] = item;
    } else if (isArr(item)) {
      item.forEach((item2, index) => {
        walk(item2, `${propName}.member.${index += 1}`);
      });
    } else if (isObj(item)) {
      Object.entries(item).forEach(([key, value]) => {
        walk(value, `${propName}.${key}`);
      });
    }
  }
  Object.entries(obj2).forEach(([key, value]) => walk(value, key));
  const query = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => typeof v !== "undefined").sort(([kA], [kB]) => kA > kB ? 1 : -1)
  );
  return query;
}
var isString, isBool, isNum, isLiteral, isArr, isObj;
var init_lib = __esm({
  "node_modules/@aws-lite/cloudformation/src/lib.mjs"() {
    isString = (i) => typeof i === "string";
    isBool = (i) => typeof i === "boolean";
    isNum = (i) => Number.isInteger(i);
    isLiteral = (i) => isString(i) || isBool(i) || isNum(i);
    isArr = (i) => Array.isArray(i);
    isObj = (i) => typeof i === "object" && Object.keys(i).length;
  }
});

// node_modules/@aws-lite/cloudformation/src/index.mjs
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
var service, property, required, docRoot2, userGuide, arr, bool, obj, str, num, Capabilities, ClientRequestToken, DisableRollback, EnableTerminationProtection, NotificationARNs, OnFailure, Parameters, ResourceTypes, RetainExceptOnCreate, RoleARN, RollbackConfiguration, StackPolicyBody, StackPolicyURL, Tags, TemplateBody, TemplateURL, TimeoutInMinutes, StackName, NextToken, valPaginate, defaultError, deMemberify, CreateStack, DeleteStack, DescribeStackResources, DescribeStacks, ListStackResources, UpdateStack, src_default;
var init_src = __esm({
  "node_modules/@aws-lite/cloudformation/src/index.mjs"() {
    init_incomplete();
    init_lib();
    service = "cloudformation";
    property = "CloudFormation";
    required = true;
    docRoot2 = "https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/";
    userGuide = "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/";
    arr = { type: "array" };
    bool = { type: "boolean" };
    obj = { type: "object" };
    str = { type: "string" };
    num = { type: "number" };
    Capabilities = { ...arr, comment: "Array of CloudFormation capabilities necessary for stack creation; can be any of: `CAPABILITY_IAM`, `CAPABILITY_NAMED_IAM`, `CAPABILITY_AUTO_EXPAND`" };
    ClientRequestToken = { ...str, comment: "Unique identifier for this request; from 1 - 128b matching `[a-zA-Z0-9][-a-zA-Z0-9]*`" };
    DisableRollback = { ...bool, comment: "Set to true to disable rollback of the stack if stack creation failed" };
    EnableTerminationProtection = { ...bool, comment: "Enable protection against stack deletion", ref: userGuide + "using-cfn-protect-stacks.html" };
    NotificationARNs = { ...arr, comment: "Array of SNS topic ARNs to publish stack related events" };
    OnFailure = { ...str, comment: "Action to be taken if stack creation failes; can be one of: `DO_NOTHING`, `ROLLBACK`, `DELETE`" };
    Parameters = { ...arr, comment: "Array of objects specifying stack input parameters", ref: docRoot2 + "API_Parameter.html" };
    ResourceTypes = { ...arr, comment: "Array of CloudFormation template resource types with permissions for this create stack action", ref: userGuide + "using-iam-template.html" };
    RetainExceptOnCreate = { ...bool, comment: "Set to true to ensure newly created resources are deleted if the operation rolls back, even if marked with a deletion policy of `Retain`" };
    RoleARN = { ...str, comment: "IAM role ARN CloudFormation assumes to create the stack" };
    RollbackConfiguration = { ...obj, comment: "Rollback triggers to be monitored during creation and updating", ref: docRoot2 + "API_RollbackConfiguration.html" };
    StackPolicyBody = { type: ["string", "object"], comment: "Stack policy document; an object will be automatically serialized to JSON, or supply pre-serialized JSON", ref: userGuide + "protect-stack-resources.html" };
    StackPolicyURL = { ...str, comment: "Stack policy url" };
    Tags = { ...arr, comment: "Array of tag objects to associate with the stack", ref: docRoot2 + "API_Tag.html" };
    TemplateBody = { type: ["string", "object"], comment: "CloudFormation template object (which will be automatically serialized to JSON for you), or pre-serialized JSON or YAML; can be up to 51,200 b" };
    TemplateURL = { ...str, comment: "S3 location of CloudFormation template; can be up to 460,800 b" };
    TimeoutInMinutes = { ...num, comment: "Amount of time before the stack status becomes `CREATE_FAILED`" };
    StackName = { ...str, required, comment: "Stack name or ID" };
    NextToken = { ...str, comment: "Pagination cursor token to be used if `NextToken` was returned in a previous response" };
    valPaginate = { type: "boolean", comment: "Enable automatic result pagination; use this instead of making your own individual pagination requests" };
    defaultError = ({ statusCode, error }) => ({ statusCode, error });
    deMemberify = (prop) => {
      let result = [];
      if (Array.isArray(prop.member) && prop.member.length)
        result = prop.member;
      else if (prop.member)
        result = [prop.member];
      return result;
    };
    CreateStack = {
      awsDoc: docRoot2 + "API_CreateStack.html",
      validate: {
        StackName,
        Capabilities,
        ClientRequestToken,
        DisableRollback,
        EnableTerminationProtection,
        NotificationARNs,
        OnFailure,
        Parameters,
        ResourceTypes,
        RetainExceptOnCreate,
        RoleARN,
        RollbackConfiguration,
        StackPolicyBody,
        StackPolicyURL,
        Tags,
        TemplateBody,
        TemplateURL,
        TimeoutInMinutes
      },
      request: (params) => {
        let { StackPolicyBody: StackPolicyBody2, TemplateBody: TemplateBody2 } = params;
        if (TemplateBody2 && typeof params.TemplateBody === "object") {
          params.TemplateBody = JSON.stringify(TemplateBody2);
        }
        if (StackPolicyBody2 && typeof params.StackPolicyBody === "object") {
          params.StackPolicyBody = JSON.stringify(StackPolicyBody2);
        }
        const query = querystringifyParams(params);
        return {
          query: {
            Action: "CreateStack",
            Version: "2010-05-15",
            ...query
          }
        };
      },
      response: ({ payload }) => ({ StackId: payload.CreateStackResult.StackId })
    };
    DeleteStack = {
      awsDoc: docRoot2 + "API_DeleteStack.html",
      validate: {
        StackName,
        ClientRequestToken,
        RetainResources: { ...arr, comment: "List of logical resource IDs to retain after stack deletion" },
        RoleARN: { ...str, comment: "IAM role ARN to assume during deletion" }
      },
      request: (params) => {
        return {
          query: {
            Action: "DeleteStack",
            ...params
          }
        };
      },
      response: () => ({}),
      error: defaultError
    };
    DescribeStackResources = {
      awsDoc: docRoot2 + "API_DescribeStackResources.html",
      validate: {
        StackName: { ...StackName, required: false },
        LogicalResourceId: { ...str, comment: "Logical name of a resource" },
        PhysicalResourceId: { ...str, comment: "Physical name or ID of a resource; if you do not specify `PhysicalResourceId`, you must specify `StackName`" }
      },
      request: async (params) => {
        return {
          query: {
            Action: "DescribeStackResources",
            ...params
          }
        };
      },
      response: ({ payload }) => {
        const { StackResources, NextToken: NextToken2 } = payload.DescribeStackResourcesResult;
        const result = { StackResources: deMemberify(StackResources) };
        if (NextToken2)
          result.NextToken = NextToken2;
        return result;
      },
      error: defaultError
    };
    DescribeStacks = {
      awsDoc: docRoot2 + "API_DescribeStacks.html",
      validate: {
        StackName: { ...StackName, required: false },
        NextToken,
        paginate: valPaginate
      },
      request: async (params) => {
        return {
          query: {
            Action: "DescribeStacks",
            ...params
          },
          paginator: {
            cursor: "NextToken",
            token: "NextToken",
            accumulator: "DescribeStacksResult.Stacks.member",
            type: "query"
          }
        };
      },
      response: ({ payload }) => {
        const { Stacks, NextToken: NextToken2 } = payload.DescribeStacksResult;
        const result = { Stacks: deMemberify(Stacks) };
        if (result.Stacks.length) {
          result.Stacks = result.Stacks.map((stack) => {
            if (stack.Outputs)
              stack.Outputs = deMemberify(stack.Outputs);
            if (stack.Capabilities)
              stack.Capabilities = deMemberify(stack.Capabilities);
            return stack;
          });
        }
        if (NextToken2)
          result.NextToken = NextToken2;
        return result;
      },
      error: defaultError
    };
    ListStackResources = {
      awsDoc: docRoot2 + "API_ListStackResources.html",
      validate: {
        StackName,
        NextToken,
        paginate: valPaginate
      },
      request: async (params) => {
        return {
          query: {
            Action: "ListStackResources",
            ...params
          },
          paginator: {
            cursor: "NextToken",
            token: "NextToken",
            accumulator: "ListStackResourcesResult.StackResourceSummaries.member",
            type: "query"
          }
        };
      },
      response: ({ payload }) => {
        const { StackResourceSummaries, NextToken: NextToken2 } = payload.ListStackResourcesResult;
        const result = { StackResourceSummaries: deMemberify(StackResourceSummaries) };
        if (NextToken2)
          result.NextToken = NextToken2;
        return result;
      },
      error: defaultError
    };
    UpdateStack = {
      awsDoc: docRoot2 + "API_UpdateStack.html",
      validate: {
        StackName,
        Capabilities,
        ClientRequestToken,
        DisableRollback,
        NotificationARNs,
        Parameters,
        ResourceTypes,
        RetainExceptOnCreate,
        RoleARN,
        RollbackConfiguration,
        StackPolicyBody,
        // StackPolicyDuringUpdateBody,
        // StackPolicyDuringUpdateURL,
        StackPolicyURL,
        Tags,
        TemplateBody,
        TemplateURL
        // UsePreviousTemplate
      },
      request: (params) => {
        let { StackPolicyBody: StackPolicyBody2, TemplateBody: TemplateBody2 } = params;
        if (TemplateBody2 && typeof params.TemplateBody === "object") {
          params.TemplateBody = JSON.stringify(TemplateBody2);
        }
        if (StackPolicyBody2 && typeof params.StackPolicyBody === "object") {
          params.StackPolicyBody = JSON.stringify(StackPolicyBody2);
        }
        const query = querystringifyParams(params);
        return {
          query: {
            Action: "UpdateStack",
            Version: "2010-05-15",
            ...query
          }
        };
      },
      response: ({ payload }) => ({ StackId: payload.UpdateStackResult.StackId })
    };
    src_default = {
      name: "@aws-lite/cloudformation",
      service,
      property,
      methods: { CreateStack, DeleteStack, DescribeStackResources, DescribeStacks, ListStackResources, UpdateStack, ...incomplete_default }
    };
  }
});

// node_modules/readdir-glob/node_modules/minimatch/lib/path.js
var require_path = __commonJS({
  "node_modules/readdir-glob/node_modules/minimatch/lib/path.js"(exports, module2) {
    var isWindows = typeof process === "object" && process && process.platform === "win32";
    module2.exports = isWindows ? { sep: "\\" } : { sep: "/" };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str2) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str2);
      if (b instanceof RegExp)
        b = maybeMatch(b, str2);
      var r = range(a, b, str2);
      return r && {
        start: r[0],
        end: r[1],
        pre: str2.slice(0, r[0]),
        body: str2.slice(r[0] + a.length, r[1]),
        post: str2.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str2) {
      var m = str2.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str2) {
      var begs, beg, left, right, result;
      var ai = str2.indexOf(a);
      var bi = str2.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str2.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str2.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str2.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/readdir-glob/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/readdir-glob/node_modules/brace-expansion/index.js"(exports, module2) {
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str2) {
      return parseInt(str2, 10) == str2 ? parseInt(str2, 10) : str2.charCodeAt(0);
    }
    function escapeBraces(str2) {
      return str2.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str2) {
      return str2.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str2) {
      if (!str2)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str2);
      if (!m)
        return str2.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str2) {
      if (!str2)
        return [];
      if (str2.substr(0, 2) === "{}") {
        str2 = "\\{\\}" + str2.substr(2);
      }
      return expand(escapeBraces(str2), true).map(unescapeBraces);
    }
    function embrace(str2) {
      return "{" + str2 + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str2, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str2);
      if (!m)
        return [str2];
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      if (/\$$/.test(m.pre)) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + "{" + m.body + "}" + post[k];
          expansions.push(expansion);
        }
      } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(",") >= 0;
        if (!isSequence && !isOptions) {
          if (m.post.match(/,.*\}/)) {
            str2 = m.pre + "{" + m.body + escClose + m.post;
            return expand(str2);
          }
          return [str2];
        }
        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            n = expand(n[0], false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }
        var N;
        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);
          N = [];
          for (var i = x; test(i, y); i += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i);
              if (c === "\\")
                c = "";
            } else {
              c = String(i);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join("0");
                  if (i < 0)
                    c = "-" + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];
          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand(n[j], false));
          }
        }
        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
      }
      return expansions;
    }
  }
});

// node_modules/readdir-glob/node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/readdir-glob/node_modules/minimatch/minimatch.js"(exports, module2) {
    var minimatch = module2.exports = (p, pattern, options = {}) => {
      assertValidPattern(pattern);
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    };
    module2.exports = minimatch;
    var path = require_path();
    minimatch.sep = path.sep;
    var GLOBSTAR = Symbol("globstar **");
    minimatch.GLOBSTAR = GLOBSTAR;
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var charSet = (s) => s.split("").reduce((set, c) => {
      set[c] = true;
      return set;
    }, {});
    var reSpecials = charSet("().*{}+?[]^$\\!");
    var addPatternStartSet = charSet("[.(");
    var slashSplit = /\/+/;
    minimatch.filter = (pattern, options = {}) => (p, i, list) => minimatch(p, pattern, options);
    var ext = (a, b = {}) => {
      const t = {};
      Object.keys(a).forEach((k) => t[k] = a[k]);
      Object.keys(b).forEach((k) => t[k] = b[k]);
      return t;
    };
    minimatch.defaults = (def) => {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      const orig = minimatch;
      const m = (p, pattern, options) => orig(p, pattern, ext(def, options));
      m.Minimatch = class Minimatch extends orig.Minimatch {
        constructor(pattern, options) {
          super(pattern, ext(def, options));
        }
      };
      m.Minimatch.defaults = (options) => orig.defaults(ext(def, options)).Minimatch;
      m.filter = (pattern, options) => orig.filter(pattern, ext(def, options));
      m.defaults = (options) => orig.defaults(ext(def, options));
      m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options));
      m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options));
      m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options));
      return m;
    };
    minimatch.braceExpand = (pattern, options) => braceExpand(pattern, options);
    var braceExpand = (pattern, options = {}) => {
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    };
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = (pattern) => {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    var SUBPARSE = Symbol("subparse");
    minimatch.makeRe = (pattern, options) => new Minimatch(pattern, options || {}).makeRe();
    minimatch.match = (list, pattern, options = {}) => {
      const mm = new Minimatch(pattern, options);
      list = list.filter((f) => mm.match(f));
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    var globUnescape = (s) => s.replace(/\\(.)/g, "$1");
    var charUnescape = (s) => s.replace(/\\([^-\]])/g, "$1");
    var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var braExpEscape = (s) => s.replace(/[[\]\\]/g, "\\$&");
    var Minimatch = class {
      constructor(pattern, options) {
        assertValidPattern(pattern);
        if (!options)
          options = {};
        this.options = options;
        this.set = [];
        this.pattern = pattern;
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          this.pattern = this.pattern.replace(/\\/g, "/");
        }
        this.regexp = null;
        this.negate = false;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.make();
      }
      debug() {
      }
      make() {
        const pattern = this.pattern;
        const options = this.options;
        if (!options.nocomment && pattern.charAt(0) === "#") {
          this.comment = true;
          return;
        }
        if (!pattern) {
          this.empty = true;
          return;
        }
        this.parseNegate();
        let set = this.globSet = this.braceExpand();
        if (options.debug)
          this.debug = (...args) => console.error(...args);
        this.debug(this.pattern, set);
        set = this.globParts = set.map((s) => s.split(slashSplit));
        this.debug(this.pattern, set);
        set = set.map((s, si, set2) => s.map(this.parse, this));
        this.debug(this.pattern, set);
        set = set.filter((s) => s.indexOf(false) === -1);
        this.debug(this.pattern, set);
        this.set = set;
      }
      parseNegate() {
        if (this.options.nonegate)
          return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
          negate = !negate;
          negateOffset++;
        }
        if (negateOffset)
          this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
      }
      // set partial to true to test if, for example,
      // "/a/b" matches the start of "/*/b/*/d"
      // Partial means, if you run out of file before you run
      // out of pattern, then that's fine, as long as all
      // the parts match.
      matchOne(file, pattern, partial) {
        var options = this.options;
        this.debug(
          "matchOne",
          { "this": this, file, pattern }
        );
        this.debug("matchOne", file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
          this.debug("matchOne loop");
          var p = pattern[pi];
          var f = file[fi];
          this.debug(pattern, p, f);
          if (p === false)
            return false;
          if (p === GLOBSTAR) {
            this.debug("GLOBSTAR", [pattern, p, f]);
            var fr = fi;
            var pr = pi + 1;
            if (pr === pl) {
              this.debug("** at the end");
              for (; fi < fl; fi++) {
                if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                  return false;
              }
              return true;
            }
            while (fr < fl) {
              var swallowee = file[fr];
              this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
              if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                this.debug("globstar found match!", fr, fl, swallowee);
                return true;
              } else {
                if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                  this.debug("dot detected!", file, fr, pattern, pr);
                  break;
                }
                this.debug("globstar swallow a segment, and continue");
                fr++;
              }
            }
            if (partial) {
              this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
              if (fr === fl)
                return true;
            }
            return false;
          }
          var hit;
          if (typeof p === "string") {
            hit = f === p;
            this.debug("string match", p, f, hit);
          } else {
            hit = f.match(p);
            this.debug("pattern match", p, f, hit);
          }
          if (!hit)
            return false;
        }
        if (fi === fl && pi === pl) {
          return true;
        } else if (fi === fl) {
          return partial;
        } else if (pi === pl) {
          return fi === fl - 1 && file[fi] === "";
        }
        throw new Error("wtf?");
      }
      braceExpand() {
        return braceExpand(this.pattern, this.options);
      }
      parse(pattern, isSub) {
        assertValidPattern(pattern);
        const options = this.options;
        if (pattern === "**") {
          if (!options.noglobstar)
            return GLOBSTAR;
          else
            pattern = "*";
        }
        if (pattern === "")
          return "";
        let re = "";
        let hasMagic = false;
        let escaping = false;
        const patternListStack = [];
        const negativeLists = [];
        let stateChar;
        let inClass = false;
        let reClassStart = -1;
        let classStart = -1;
        let cs;
        let pl;
        let sp;
        let dotTravAllowed = pattern.charAt(0) === ".";
        let dotFileAllowed = options.dot || dotTravAllowed;
        const patternStart = () => dotTravAllowed ? "" : dotFileAllowed ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
        const subPatternStart = (p) => p.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
        const clearStateChar = () => {
          if (stateChar) {
            switch (stateChar) {
              case "*":
                re += star;
                hasMagic = true;
                break;
              case "?":
                re += qmark;
                hasMagic = true;
                break;
              default:
                re += "\\" + stateChar;
                break;
            }
            this.debug("clearStateChar %j %j", stateChar, re);
            stateChar = false;
          }
        };
        for (let i = 0, c; i < pattern.length && (c = pattern.charAt(i)); i++) {
          this.debug("%s	%s %s %j", pattern, i, re, c);
          if (escaping) {
            if (c === "/") {
              return false;
            }
            if (reSpecials[c]) {
              re += "\\";
            }
            re += c;
            escaping = false;
            continue;
          }
          switch (c) {
            case "/": {
              return false;
            }
            case "\\":
              if (inClass && pattern.charAt(i + 1) === "-") {
                re += c;
                continue;
              }
              clearStateChar();
              escaping = true;
              continue;
            case "?":
            case "*":
            case "+":
            case "@":
            case "!":
              this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
              if (inClass) {
                this.debug("  in class");
                if (c === "!" && i === classStart + 1)
                  c = "^";
                re += c;
                continue;
              }
              this.debug("call clearStateChar %j", stateChar);
              clearStateChar();
              stateChar = c;
              if (options.noext)
                clearStateChar();
              continue;
            case "(": {
              if (inClass) {
                re += "(";
                continue;
              }
              if (!stateChar) {
                re += "\\(";
                continue;
              }
              const plEntry = {
                type: stateChar,
                start: i - 1,
                reStart: re.length,
                open: plTypes[stateChar].open,
                close: plTypes[stateChar].close
              };
              this.debug(this.pattern, "	", plEntry);
              patternListStack.push(plEntry);
              re += plEntry.open;
              if (plEntry.start === 0 && plEntry.type !== "!") {
                dotTravAllowed = true;
                re += subPatternStart(pattern.slice(i + 1));
              }
              this.debug("plType %j %j", stateChar, re);
              stateChar = false;
              continue;
            }
            case ")": {
              const plEntry = patternListStack[patternListStack.length - 1];
              if (inClass || !plEntry) {
                re += "\\)";
                continue;
              }
              patternListStack.pop();
              clearStateChar();
              hasMagic = true;
              pl = plEntry;
              re += pl.close;
              if (pl.type === "!") {
                negativeLists.push(Object.assign(pl, { reEnd: re.length }));
              }
              continue;
            }
            case "|": {
              const plEntry = patternListStack[patternListStack.length - 1];
              if (inClass || !plEntry) {
                re += "\\|";
                continue;
              }
              clearStateChar();
              re += "|";
              if (plEntry.start === 0 && plEntry.type !== "!") {
                dotTravAllowed = true;
                re += subPatternStart(pattern.slice(i + 1));
              }
              continue;
            }
            case "[":
              clearStateChar();
              if (inClass) {
                re += "\\" + c;
                continue;
              }
              inClass = true;
              classStart = i;
              reClassStart = re.length;
              re += c;
              continue;
            case "]":
              if (i === classStart + 1 || !inClass) {
                re += "\\" + c;
                continue;
              }
              cs = pattern.substring(classStart + 1, i);
              try {
                RegExp("[" + braExpEscape(charUnescape(cs)) + "]");
                re += c;
              } catch (er) {
                re = re.substring(0, reClassStart) + "(?:$.)";
              }
              hasMagic = true;
              inClass = false;
              continue;
            default:
              clearStateChar();
              if (reSpecials[c] && !(c === "^" && inClass)) {
                re += "\\";
              }
              re += c;
              break;
          }
        }
        if (inClass) {
          cs = pattern.slice(classStart + 1);
          sp = this.parse(cs, SUBPARSE);
          re = re.substring(0, reClassStart) + "\\[" + sp[0];
          hasMagic = hasMagic || sp[1];
        }
        for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
          let tail;
          tail = re.slice(pl.reStart + pl.open.length);
          this.debug("setting tail", re, pl);
          tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_2, $1, $2) => {
            if (!$2) {
              $2 = "\\";
            }
            return $1 + $1 + $2 + "|";
          });
          this.debug("tail=%j\n   %s", tail, tail, pl, re);
          const t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
          hasMagic = true;
          re = re.slice(0, pl.reStart) + t + "\\(" + tail;
        }
        clearStateChar();
        if (escaping) {
          re += "\\\\";
        }
        const addPatternStart = addPatternStartSet[re.charAt(0)];
        for (let n = negativeLists.length - 1; n > -1; n--) {
          const nl = negativeLists[n];
          const nlBefore = re.slice(0, nl.reStart);
          const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
          let nlAfter = re.slice(nl.reEnd);
          const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
          const closeParensBefore = nlBefore.split(")").length;
          const openParensBefore = nlBefore.split("(").length - closeParensBefore;
          let cleanAfter = nlAfter;
          for (let i = 0; i < openParensBefore; i++) {
            cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
          }
          nlAfter = cleanAfter;
          const dollar = nlAfter === "" && isSub !== SUBPARSE ? "(?:$|\\/)" : "";
          re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        }
        if (re !== "" && hasMagic) {
          re = "(?=.)" + re;
        }
        if (addPatternStart) {
          re = patternStart() + re;
        }
        if (isSub === SUBPARSE) {
          return [re, hasMagic];
        }
        if (options.nocase && !hasMagic) {
          hasMagic = pattern.toUpperCase() !== pattern.toLowerCase();
        }
        if (!hasMagic) {
          return globUnescape(pattern);
        }
        const flags2 = options.nocase ? "i" : "";
        try {
          return Object.assign(new RegExp("^" + re + "$", flags2), {
            _glob: pattern,
            _src: re
          });
        } catch (er) {
          return new RegExp("$.");
        }
      }
      makeRe() {
        if (this.regexp || this.regexp === false)
          return this.regexp;
        const set = this.set;
        if (!set.length) {
          this.regexp = false;
          return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
        const flags2 = options.nocase ? "i" : "";
        let re = set.map((pattern) => {
          pattern = pattern.map(
            (p) => typeof p === "string" ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src
          ).reduce((set2, p) => {
            if (!(set2[set2.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
              set2.push(p);
            }
            return set2;
          }, []);
          pattern.forEach((p, i) => {
            if (p !== GLOBSTAR || pattern[i - 1] === GLOBSTAR) {
              return;
            }
            if (i === 0) {
              if (pattern.length > 1) {
                pattern[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + pattern[i + 1];
              } else {
                pattern[i] = twoStar;
              }
            } else if (i === pattern.length - 1) {
              pattern[i - 1] += "(?:\\/|" + twoStar + ")?";
            } else {
              pattern[i - 1] += "(?:\\/|\\/" + twoStar + "\\/)" + pattern[i + 1];
              pattern[i + 1] = GLOBSTAR;
            }
          });
          return pattern.filter((p) => p !== GLOBSTAR).join("/");
        }).join("|");
        re = "^(?:" + re + ")$";
        if (this.negate)
          re = "^(?!" + re + ").*$";
        try {
          this.regexp = new RegExp(re, flags2);
        } catch (ex) {
          this.regexp = false;
        }
        return this.regexp;
      }
      match(f, partial = this.partial) {
        this.debug("match", f, this.pattern);
        if (this.comment)
          return false;
        if (this.empty)
          return f === "";
        if (f === "/" && partial)
          return true;
        const options = this.options;
        if (path.sep !== "/") {
          f = f.split(path.sep).join("/");
        }
        f = f.split(slashSplit);
        this.debug(this.pattern, "split", f);
        const set = this.set;
        this.debug(this.pattern, "set", set);
        let filename;
        for (let i = f.length - 1; i >= 0; i--) {
          filename = f[i];
          if (filename)
            break;
        }
        for (let i = 0; i < set.length; i++) {
          const pattern = set[i];
          let file = f;
          if (options.matchBase && pattern.length === 1) {
            file = [filename];
          }
          const hit = this.matchOne(file, pattern, partial);
          if (hit) {
            if (options.flipNegate)
              return true;
            return !this.negate;
          }
        }
        if (options.flipNegate)
          return false;
        return this.negate;
      }
      static defaults(def) {
        return minimatch.defaults(def).Minimatch;
      }
    };
    minimatch.Minimatch = Minimatch;
  }
});

// node_modules/readdir-glob/index.js
var require_readdir_glob = __commonJS({
  "node_modules/readdir-glob/index.js"(exports, module2) {
    module2.exports = readdirGlob;
    var fs = require("fs");
    var { EventEmitter } = require("events");
    var { Minimatch } = require_minimatch();
    var { resolve } = require("path");
    function readdir(dir, strict) {
      return new Promise((resolve2, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
          if (err) {
            switch (err.code) {
              case "ENOTDIR":
                if (strict) {
                  reject(err);
                } else {
                  resolve2([]);
                }
                break;
              case "ENOTSUP":
              case "ENOENT":
              case "ENAMETOOLONG":
              case "UNKNOWN":
                resolve2([]);
                break;
              case "ELOOP":
              default:
                reject(err);
                break;
            }
          } else {
            resolve2(files);
          }
        });
      });
    }
    function stat(file, followSymlinks) {
      return new Promise((resolve2, reject) => {
        const statFunc = followSymlinks ? fs.stat : fs.lstat;
        statFunc(file, (err, stats) => {
          if (err) {
            switch (err.code) {
              case "ENOENT":
                if (followSymlinks) {
                  resolve2(stat(file, false));
                } else {
                  resolve2(null);
                }
                break;
              default:
                resolve2(null);
                break;
            }
          } else {
            resolve2(stats);
          }
        });
      });
    }
    async function* exploreWalkAsync(dir, path, followSymlinks, useStat, shouldSkip, strict) {
      let files = await readdir(path + dir, strict);
      for (const file of files) {
        let name = file.name;
        if (name === void 0) {
          name = file;
          useStat = true;
        }
        const filename = dir + "/" + name;
        const relative = filename.slice(1);
        const absolute = path + "/" + relative;
        let stats = null;
        if (useStat || followSymlinks) {
          stats = await stat(absolute, followSymlinks);
        }
        if (!stats && file.name !== void 0) {
          stats = file;
        }
        if (stats === null) {
          stats = { isDirectory: () => false };
        }
        if (stats.isDirectory()) {
          if (!shouldSkip(relative)) {
            yield { relative, absolute, stats };
            yield* exploreWalkAsync(filename, path, followSymlinks, useStat, shouldSkip, false);
          }
        } else {
          yield { relative, absolute, stats };
        }
      }
    }
    async function* explore(path, followSymlinks, useStat, shouldSkip) {
      yield* exploreWalkAsync("", path, followSymlinks, useStat, shouldSkip, true);
    }
    function readOptions(options) {
      return {
        pattern: options.pattern,
        dot: !!options.dot,
        noglobstar: !!options.noglobstar,
        matchBase: !!options.matchBase,
        nocase: !!options.nocase,
        ignore: options.ignore,
        skip: options.skip,
        follow: !!options.follow,
        stat: !!options.stat,
        nodir: !!options.nodir,
        mark: !!options.mark,
        silent: !!options.silent,
        absolute: !!options.absolute
      };
    }
    var ReaddirGlob = class extends EventEmitter {
      constructor(cwd, options, cb) {
        super();
        if (typeof options === "function") {
          cb = options;
          options = null;
        }
        this.options = readOptions(options || {});
        this.matchers = [];
        if (this.options.pattern) {
          const matchers = Array.isArray(this.options.pattern) ? this.options.pattern : [this.options.pattern];
          this.matchers = matchers.map(
            (m) => new Minimatch(m, {
              dot: this.options.dot,
              noglobstar: this.options.noglobstar,
              matchBase: this.options.matchBase,
              nocase: this.options.nocase
            })
          );
        }
        this.ignoreMatchers = [];
        if (this.options.ignore) {
          const ignorePatterns = Array.isArray(this.options.ignore) ? this.options.ignore : [this.options.ignore];
          this.ignoreMatchers = ignorePatterns.map(
            (ignore) => new Minimatch(ignore, { dot: true })
          );
        }
        this.skipMatchers = [];
        if (this.options.skip) {
          const skipPatterns = Array.isArray(this.options.skip) ? this.options.skip : [this.options.skip];
          this.skipMatchers = skipPatterns.map(
            (skip) => new Minimatch(skip, { dot: true })
          );
        }
        this.iterator = explore(resolve(cwd || "."), this.options.follow, this.options.stat, this._shouldSkipDirectory.bind(this));
        this.paused = false;
        this.inactive = false;
        this.aborted = false;
        if (cb) {
          this._matches = [];
          this.on("match", (match) => this._matches.push(this.options.absolute ? match.absolute : match.relative));
          this.on("error", (err) => cb(err));
          this.on("end", () => cb(null, this._matches));
        }
        setTimeout(() => this._next(), 0);
      }
      _shouldSkipDirectory(relative) {
        return this.skipMatchers.some((m) => m.match(relative));
      }
      _fileMatches(relative, isDirectory) {
        const file = relative + (isDirectory ? "/" : "");
        return (this.matchers.length === 0 || this.matchers.some((m) => m.match(file))) && !this.ignoreMatchers.some((m) => m.match(file)) && (!this.options.nodir || !isDirectory);
      }
      _next() {
        if (!this.paused && !this.aborted) {
          this.iterator.next().then((obj2) => {
            if (!obj2.done) {
              const isDirectory = obj2.value.stats.isDirectory();
              if (this._fileMatches(obj2.value.relative, isDirectory)) {
                let relative = obj2.value.relative;
                let absolute = obj2.value.absolute;
                if (this.options.mark && isDirectory) {
                  relative += "/";
                  absolute += "/";
                }
                if (this.options.stat) {
                  this.emit("match", { relative, absolute, stat: obj2.value.stats });
                } else {
                  this.emit("match", { relative, absolute });
                }
              }
              this._next(this.iterator);
            } else {
              this.emit("end");
            }
          }).catch((err) => {
            this.abort();
            this.emit("error", err);
            if (!err.code && !this.options.silent) {
              console.error(err);
            }
          });
        } else {
          this.inactive = true;
        }
      }
      abort() {
        this.aborted = true;
      }
      pause() {
        this.paused = true;
      }
      resume() {
        this.paused = false;
        if (this.inactive) {
          this.inactive = false;
          this._next();
        }
      }
    };
    function readdirGlob(pattern, options, cb) {
      return new ReaddirGlob(pattern, options, cb);
    }
    readdirGlob.ReaddirGlob = ReaddirGlob;
  }
});

// node_modules/async/dist/async.js
var require_async = __commonJS({
  "node_modules/async/dist/async.js"(exports, module2) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.async = {}));
    })(exports, function(exports2) {
      "use strict";
      function apply(fn, ...args) {
        return (...callArgs) => fn(...args, ...callArgs);
      }
      function initialParams(fn) {
        return function(...args) {
          var callback = args.pop();
          return fn.call(this, args, callback);
        };
      }
      var hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
      var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
      var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
      function fallback(fn) {
        setTimeout(fn, 0);
      }
      function wrap(defer) {
        return (fn, ...args) => defer(() => fn(...args));
      }
      var _defer$1;
      if (hasQueueMicrotask) {
        _defer$1 = queueMicrotask;
      } else if (hasSetImmediate) {
        _defer$1 = setImmediate;
      } else if (hasNextTick) {
        _defer$1 = process.nextTick;
      } else {
        _defer$1 = fallback;
      }
      var setImmediate$1 = wrap(_defer$1);
      function asyncify(func) {
        if (isAsync(func)) {
          return function(...args) {
            const callback = args.pop();
            const promise = func.apply(this, args);
            return handlePromise(promise, callback);
          };
        }
        return initialParams(function(args, callback) {
          var result;
          try {
            result = func.apply(this, args);
          } catch (e) {
            return callback(e);
          }
          if (result && typeof result.then === "function") {
            return handlePromise(result, callback);
          } else {
            callback(null, result);
          }
        });
      }
      function handlePromise(promise, callback) {
        return promise.then((value) => {
          invokeCallback(callback, null, value);
        }, (err) => {
          invokeCallback(callback, err && (err instanceof Error || err.message) ? err : new Error(err));
        });
      }
      function invokeCallback(callback, error, value) {
        try {
          callback(error, value);
        } catch (err) {
          setImmediate$1((e) => {
            throw e;
          }, err);
        }
      }
      function isAsync(fn) {
        return fn[Symbol.toStringTag] === "AsyncFunction";
      }
      function isAsyncGenerator(fn) {
        return fn[Symbol.toStringTag] === "AsyncGenerator";
      }
      function isAsyncIterable(obj2) {
        return typeof obj2[Symbol.asyncIterator] === "function";
      }
      function wrapAsync(asyncFn) {
        if (typeof asyncFn !== "function")
          throw new Error("expected a function");
        return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
      }
      function awaitify(asyncFn, arity) {
        if (!arity)
          arity = asyncFn.length;
        if (!arity)
          throw new Error("arity is undefined");
        function awaitable(...args) {
          if (typeof args[arity - 1] === "function") {
            return asyncFn.apply(this, args);
          }
          return new Promise((resolve, reject2) => {
            args[arity - 1] = (err, ...cbArgs) => {
              if (err)
                return reject2(err);
              resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
            };
            asyncFn.apply(this, args);
          });
        }
        return awaitable;
      }
      function applyEach$1(eachfn) {
        return function applyEach2(fns, ...callArgs) {
          const go = awaitify(function(callback) {
            var that = this;
            return eachfn(fns, (fn, cb) => {
              wrapAsync(fn).apply(that, callArgs.concat(cb));
            }, callback);
          });
          return go;
        };
      }
      function _asyncMap(eachfn, arr2, iteratee, callback) {
        arr2 = arr2 || [];
        var results = [];
        var counter = 0;
        var _iteratee = wrapAsync(iteratee);
        return eachfn(arr2, (value, _2, iterCb) => {
          var index2 = counter++;
          _iteratee(value, (err, v) => {
            results[index2] = v;
            iterCb(err);
          });
        }, (err) => {
          callback(err, results);
        });
      }
      function isArrayLike(value) {
        return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
      }
      const breakLoop = {};
      var breakLoop$1 = breakLoop;
      function once(fn) {
        function wrapper(...args) {
          if (fn === null)
            return;
          var callFn = fn;
          fn = null;
          callFn.apply(this, args);
        }
        Object.assign(wrapper, fn);
        return wrapper;
      }
      function getIterator(coll) {
        return coll[Symbol.iterator] && coll[Symbol.iterator]();
      }
      function createArrayIterator(coll) {
        var i = -1;
        var len = coll.length;
        return function next() {
          return ++i < len ? { value: coll[i], key: i } : null;
        };
      }
      function createES2015Iterator(iterator) {
        var i = -1;
        return function next() {
          var item = iterator.next();
          if (item.done)
            return null;
          i++;
          return { value: item.value, key: i };
        };
      }
      function createObjectIterator(obj2) {
        var okeys = obj2 ? Object.keys(obj2) : [];
        var i = -1;
        var len = okeys.length;
        return function next() {
          var key = okeys[++i];
          if (key === "__proto__") {
            return next();
          }
          return i < len ? { value: obj2[key], key } : null;
        };
      }
      function createIterator(coll) {
        if (isArrayLike(coll)) {
          return createArrayIterator(coll);
        }
        var iterator = getIterator(coll);
        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
      }
      function onlyOnce(fn) {
        return function(...args) {
          if (fn === null)
            throw new Error("Callback was already called.");
          var callFn = fn;
          fn = null;
          callFn.apply(this, args);
        };
      }
      function asyncEachOfLimit(generator, limit, iteratee, callback) {
        let done = false;
        let canceled = false;
        let awaiting = false;
        let running = 0;
        let idx = 0;
        function replenish() {
          if (running >= limit || awaiting || done)
            return;
          awaiting = true;
          generator.next().then(({ value, done: iterDone }) => {
            if (canceled || done)
              return;
            awaiting = false;
            if (iterDone) {
              done = true;
              if (running <= 0) {
                callback(null);
              }
              return;
            }
            running++;
            iteratee(value, idx, iterateeCallback);
            idx++;
            replenish();
          }).catch(handleError);
        }
        function iterateeCallback(err, result) {
          running -= 1;
          if (canceled)
            return;
          if (err)
            return handleError(err);
          if (err === false) {
            done = true;
            canceled = true;
            return;
          }
          if (result === breakLoop$1 || done && running <= 0) {
            done = true;
            return callback(null);
          }
          replenish();
        }
        function handleError(err) {
          if (canceled)
            return;
          awaiting = false;
          done = true;
          callback(err);
        }
        replenish();
      }
      var eachOfLimit$2 = (limit) => {
        return (obj2, iteratee, callback) => {
          callback = once(callback);
          if (limit <= 0) {
            throw new RangeError("concurrency limit cannot be less than 1");
          }
          if (!obj2) {
            return callback(null);
          }
          if (isAsyncGenerator(obj2)) {
            return asyncEachOfLimit(obj2, limit, iteratee, callback);
          }
          if (isAsyncIterable(obj2)) {
            return asyncEachOfLimit(obj2[Symbol.asyncIterator](), limit, iteratee, callback);
          }
          var nextElem = createIterator(obj2);
          var done = false;
          var canceled = false;
          var running = 0;
          var looping = false;
          function iterateeCallback(err, value) {
            if (canceled)
              return;
            running -= 1;
            if (err) {
              done = true;
              callback(err);
            } else if (err === false) {
              done = true;
              canceled = true;
            } else if (value === breakLoop$1 || done && running <= 0) {
              done = true;
              return callback(null);
            } else if (!looping) {
              replenish();
            }
          }
          function replenish() {
            looping = true;
            while (running < limit && !done) {
              var elem = nextElem();
              if (elem === null) {
                done = true;
                if (running <= 0) {
                  callback(null);
                }
                return;
              }
              running += 1;
              iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
            looping = false;
          }
          replenish();
        };
      };
      function eachOfLimit(coll, limit, iteratee, callback) {
        return eachOfLimit$2(limit)(coll, wrapAsync(iteratee), callback);
      }
      var eachOfLimit$1 = awaitify(eachOfLimit, 4);
      function eachOfArrayLike(coll, iteratee, callback) {
        callback = once(callback);
        var index2 = 0, completed = 0, { length } = coll, canceled = false;
        if (length === 0) {
          callback(null);
        }
        function iteratorCallback(err, value) {
          if (err === false) {
            canceled = true;
          }
          if (canceled === true)
            return;
          if (err) {
            callback(err);
          } else if (++completed === length || value === breakLoop$1) {
            callback(null);
          }
        }
        for (; index2 < length; index2++) {
          iteratee(coll[index2], index2, onlyOnce(iteratorCallback));
        }
      }
      function eachOfGeneric(coll, iteratee, callback) {
        return eachOfLimit$1(coll, Infinity, iteratee, callback);
      }
      function eachOf(coll, iteratee, callback) {
        var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
        return eachOfImplementation(coll, wrapAsync(iteratee), callback);
      }
      var eachOf$1 = awaitify(eachOf, 3);
      function map(coll, iteratee, callback) {
        return _asyncMap(eachOf$1, coll, iteratee, callback);
      }
      var map$1 = awaitify(map, 3);
      var applyEach = applyEach$1(map$1);
      function eachOfSeries(coll, iteratee, callback) {
        return eachOfLimit$1(coll, 1, iteratee, callback);
      }
      var eachOfSeries$1 = awaitify(eachOfSeries, 3);
      function mapSeries(coll, iteratee, callback) {
        return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
      }
      var mapSeries$1 = awaitify(mapSeries, 3);
      var applyEachSeries = applyEach$1(mapSeries$1);
      const PROMISE_SYMBOL = Symbol("promiseCallback");
      function promiseCallback() {
        let resolve, reject2;
        function callback(err, ...args) {
          if (err)
            return reject2(err);
          resolve(args.length > 1 ? args : args[0]);
        }
        callback[PROMISE_SYMBOL] = new Promise((res2, rej) => {
          resolve = res2, reject2 = rej;
        });
        return callback;
      }
      function auto(tasks, concurrency, callback) {
        if (typeof concurrency !== "number") {
          callback = concurrency;
          concurrency = null;
        }
        callback = once(callback || promiseCallback());
        var numTasks = Object.keys(tasks).length;
        if (!numTasks) {
          return callback(null);
        }
        if (!concurrency) {
          concurrency = numTasks;
        }
        var results = {};
        var runningTasks = 0;
        var canceled = false;
        var hasError = false;
        var listeners = /* @__PURE__ */ Object.create(null);
        var readyTasks = [];
        var readyToCheck = [];
        var uncheckedDependencies = {};
        Object.keys(tasks).forEach((key) => {
          var task = tasks[key];
          if (!Array.isArray(task)) {
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
          }
          var dependencies = task.slice(0, task.length - 1);
          var remainingDependencies = dependencies.length;
          if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
          }
          uncheckedDependencies[key] = remainingDependencies;
          dependencies.forEach((dependencyName) => {
            if (!tasks[dependencyName]) {
              throw new Error("async.auto task `" + key + "` has a non-existent dependency `" + dependencyName + "` in " + dependencies.join(", "));
            }
            addListener(dependencyName, () => {
              remainingDependencies--;
              if (remainingDependencies === 0) {
                enqueueTask(key, task);
              }
            });
          });
        });
        checkForDeadlocks();
        processQueue();
        function enqueueTask(key, task) {
          readyTasks.push(() => runTask(key, task));
        }
        function processQueue() {
          if (canceled)
            return;
          if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
          }
          while (readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
          }
        }
        function addListener(taskName, fn) {
          var taskListeners = listeners[taskName];
          if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
          }
          taskListeners.push(fn);
        }
        function taskComplete(taskName) {
          var taskListeners = listeners[taskName] || [];
          taskListeners.forEach((fn) => fn());
          processQueue();
        }
        function runTask(key, task) {
          if (hasError)
            return;
          var taskCallback = onlyOnce((err, ...result) => {
            runningTasks--;
            if (err === false) {
              canceled = true;
              return;
            }
            if (result.length < 2) {
              [result] = result;
            }
            if (err) {
              var safeResults = {};
              Object.keys(results).forEach((rkey) => {
                safeResults[rkey] = results[rkey];
              });
              safeResults[key] = result;
              hasError = true;
              listeners = /* @__PURE__ */ Object.create(null);
              if (canceled)
                return;
              callback(err, safeResults);
            } else {
              results[key] = result;
              taskComplete(key);
            }
          });
          runningTasks++;
          var taskFn = wrapAsync(task[task.length - 1]);
          if (task.length > 1) {
            taskFn(results, taskCallback);
          } else {
            taskFn(taskCallback);
          }
        }
        function checkForDeadlocks() {
          var currentTask;
          var counter = 0;
          while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            getDependents(currentTask).forEach((dependent) => {
              if (--uncheckedDependencies[dependent] === 0) {
                readyToCheck.push(dependent);
              }
            });
          }
          if (counter !== numTasks) {
            throw new Error(
              "async.auto cannot execute tasks due to a recursive dependency"
            );
          }
        }
        function getDependents(taskName) {
          var result = [];
          Object.keys(tasks).forEach((key) => {
            const task = tasks[key];
            if (Array.isArray(task) && task.indexOf(taskName) >= 0) {
              result.push(key);
            }
          });
          return result;
        }
        return callback[PROMISE_SYMBOL];
      }
      var FN_ARGS = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;
      var ARROW_FN_ARGS = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;
      var FN_ARG_SPLIT = /,/;
      var FN_ARG = /(=.+)?(\s*)$/;
      function stripComments(string) {
        let stripped = "";
        let index2 = 0;
        let endBlockComment = string.indexOf("*/");
        while (index2 < string.length) {
          if (string[index2] === "/" && string[index2 + 1] === "/") {
            let endIndex = string.indexOf("\n", index2);
            index2 = endIndex === -1 ? string.length : endIndex;
          } else if (endBlockComment !== -1 && string[index2] === "/" && string[index2 + 1] === "*") {
            let endIndex = string.indexOf("*/", index2);
            if (endIndex !== -1) {
              index2 = endIndex + 2;
              endBlockComment = string.indexOf("*/", index2);
            } else {
              stripped += string[index2];
              index2++;
            }
          } else {
            stripped += string[index2];
            index2++;
          }
        }
        return stripped;
      }
      function parseParams(func) {
        const src = stripComments(func.toString());
        let match = src.match(FN_ARGS);
        if (!match) {
          match = src.match(ARROW_FN_ARGS);
        }
        if (!match)
          throw new Error("could not parse args in autoInject\nSource:\n" + src);
        let [, args] = match;
        return args.replace(/\s/g, "").split(FN_ARG_SPLIT).map((arg) => arg.replace(FN_ARG, "").trim());
      }
      function autoInject(tasks, callback) {
        var newTasks = {};
        Object.keys(tasks).forEach((key) => {
          var taskFn = tasks[key];
          var params;
          var fnIsAsync = isAsync(taskFn);
          var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;
          if (Array.isArray(taskFn)) {
            params = [...taskFn];
            taskFn = params.pop();
            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
          } else if (hasNoDeps) {
            newTasks[key] = taskFn;
          } else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
              throw new Error("autoInject task functions require explicit parameters.");
            }
            if (!fnIsAsync)
              params.pop();
            newTasks[key] = params.concat(newTask);
          }
          function newTask(results, taskCb) {
            var newArgs = params.map((name) => results[name]);
            newArgs.push(taskCb);
            wrapAsync(taskFn)(...newArgs);
          }
        });
        return auto(newTasks, callback);
      }
      class DLL {
        constructor() {
          this.head = this.tail = null;
          this.length = 0;
        }
        removeLink(node) {
          if (node.prev)
            node.prev.next = node.next;
          else
            this.head = node.next;
          if (node.next)
            node.next.prev = node.prev;
          else
            this.tail = node.prev;
          node.prev = node.next = null;
          this.length -= 1;
          return node;
        }
        empty() {
          while (this.head)
            this.shift();
          return this;
        }
        insertAfter(node, newNode) {
          newNode.prev = node;
          newNode.next = node.next;
          if (node.next)
            node.next.prev = newNode;
          else
            this.tail = newNode;
          node.next = newNode;
          this.length += 1;
        }
        insertBefore(node, newNode) {
          newNode.prev = node.prev;
          newNode.next = node;
          if (node.prev)
            node.prev.next = newNode;
          else
            this.head = newNode;
          node.prev = newNode;
          this.length += 1;
        }
        unshift(node) {
          if (this.head)
            this.insertBefore(this.head, node);
          else
            setInitial(this, node);
        }
        push(node) {
          if (this.tail)
            this.insertAfter(this.tail, node);
          else
            setInitial(this, node);
        }
        shift() {
          return this.head && this.removeLink(this.head);
        }
        pop() {
          return this.tail && this.removeLink(this.tail);
        }
        toArray() {
          return [...this];
        }
        *[Symbol.iterator]() {
          var cur = this.head;
          while (cur) {
            yield cur.data;
            cur = cur.next;
          }
        }
        remove(testFn) {
          var curr = this.head;
          while (curr) {
            var { next } = curr;
            if (testFn(curr)) {
              this.removeLink(curr);
            }
            curr = next;
          }
          return this;
        }
      }
      function setInitial(dll, node) {
        dll.length = 1;
        dll.head = dll.tail = node;
      }
      function queue$1(worker, concurrency, payload) {
        if (concurrency == null) {
          concurrency = 1;
        } else if (concurrency === 0) {
          throw new RangeError("Concurrency must not be zero");
        }
        var _worker = wrapAsync(worker);
        var numRunning = 0;
        var workersList = [];
        const events = {
          error: [],
          drain: [],
          saturated: [],
          unsaturated: [],
          empty: []
        };
        function on(event, handler) {
          events[event].push(handler);
        }
        function once2(event, handler) {
          const handleAndRemove = (...args) => {
            off(event, handleAndRemove);
            handler(...args);
          };
          events[event].push(handleAndRemove);
        }
        function off(event, handler) {
          if (!event)
            return Object.keys(events).forEach((ev) => events[ev] = []);
          if (!handler)
            return events[event] = [];
          events[event] = events[event].filter((ev) => ev !== handler);
        }
        function trigger(event, ...args) {
          events[event].forEach((handler) => handler(...args));
        }
        var processingScheduled = false;
        function _insert(data, insertAtFront, rejectOnError, callback) {
          if (callback != null && typeof callback !== "function") {
            throw new Error("task callback must be a function");
          }
          q.started = true;
          var res2, rej;
          function promiseCallback2(err, ...args) {
            if (err)
              return rejectOnError ? rej(err) : res2();
            if (args.length <= 1)
              return res2(args[0]);
            res2(args);
          }
          var item = q._createTaskItem(
            data,
            rejectOnError ? promiseCallback2 : callback || promiseCallback2
          );
          if (insertAtFront) {
            q._tasks.unshift(item);
          } else {
            q._tasks.push(item);
          }
          if (!processingScheduled) {
            processingScheduled = true;
            setImmediate$1(() => {
              processingScheduled = false;
              q.process();
            });
          }
          if (rejectOnError || !callback) {
            return new Promise((resolve, reject2) => {
              res2 = resolve;
              rej = reject2;
            });
          }
        }
        function _createCB(tasks) {
          return function(err, ...args) {
            numRunning -= 1;
            for (var i = 0, l = tasks.length; i < l; i++) {
              var task = tasks[i];
              var index2 = workersList.indexOf(task);
              if (index2 === 0) {
                workersList.shift();
              } else if (index2 > 0) {
                workersList.splice(index2, 1);
              }
              task.callback(err, ...args);
              if (err != null) {
                trigger("error", err, task.data);
              }
            }
            if (numRunning <= q.concurrency - q.buffer) {
              trigger("unsaturated");
            }
            if (q.idle()) {
              trigger("drain");
            }
            q.process();
          };
        }
        function _maybeDrain(data) {
          if (data.length === 0 && q.idle()) {
            setImmediate$1(() => trigger("drain"));
            return true;
          }
          return false;
        }
        const eventMethod = (name) => (handler) => {
          if (!handler) {
            return new Promise((resolve, reject2) => {
              once2(name, (err, data) => {
                if (err)
                  return reject2(err);
                resolve(data);
              });
            });
          }
          off(name);
          on(name, handler);
        };
        var isProcessing = false;
        var q = {
          _tasks: new DLL(),
          _createTaskItem(data, callback) {
            return {
              data,
              callback
            };
          },
          *[Symbol.iterator]() {
            yield* q._tasks[Symbol.iterator]();
          },
          concurrency,
          payload,
          buffer: concurrency / 4,
          started: false,
          paused: false,
          push(data, callback) {
            if (Array.isArray(data)) {
              if (_maybeDrain(data))
                return;
              return data.map((datum) => _insert(datum, false, false, callback));
            }
            return _insert(data, false, false, callback);
          },
          pushAsync(data, callback) {
            if (Array.isArray(data)) {
              if (_maybeDrain(data))
                return;
              return data.map((datum) => _insert(datum, false, true, callback));
            }
            return _insert(data, false, true, callback);
          },
          kill() {
            off();
            q._tasks.empty();
          },
          unshift(data, callback) {
            if (Array.isArray(data)) {
              if (_maybeDrain(data))
                return;
              return data.map((datum) => _insert(datum, true, false, callback));
            }
            return _insert(data, true, false, callback);
          },
          unshiftAsync(data, callback) {
            if (Array.isArray(data)) {
              if (_maybeDrain(data))
                return;
              return data.map((datum) => _insert(datum, true, true, callback));
            }
            return _insert(data, true, true, callback);
          },
          remove(testFn) {
            q._tasks.remove(testFn);
          },
          process() {
            if (isProcessing) {
              return;
            }
            isProcessing = true;
            while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
              var tasks = [], data = [];
              var l = q._tasks.length;
              if (q.payload)
                l = Math.min(l, q.payload);
              for (var i = 0; i < l; i++) {
                var node = q._tasks.shift();
                tasks.push(node);
                workersList.push(node);
                data.push(node.data);
              }
              numRunning += 1;
              if (q._tasks.length === 0) {
                trigger("empty");
              }
              if (numRunning === q.concurrency) {
                trigger("saturated");
              }
              var cb = onlyOnce(_createCB(tasks));
              _worker(data, cb);
            }
            isProcessing = false;
          },
          length() {
            return q._tasks.length;
          },
          running() {
            return numRunning;
          },
          workersList() {
            return workersList;
          },
          idle() {
            return q._tasks.length + numRunning === 0;
          },
          pause() {
            q.paused = true;
          },
          resume() {
            if (q.paused === false) {
              return;
            }
            q.paused = false;
            setImmediate$1(q.process);
          }
        };
        Object.defineProperties(q, {
          saturated: {
            writable: false,
            value: eventMethod("saturated")
          },
          unsaturated: {
            writable: false,
            value: eventMethod("unsaturated")
          },
          empty: {
            writable: false,
            value: eventMethod("empty")
          },
          drain: {
            writable: false,
            value: eventMethod("drain")
          },
          error: {
            writable: false,
            value: eventMethod("error")
          }
        });
        return q;
      }
      function cargo$1(worker, payload) {
        return queue$1(worker, 1, payload);
      }
      function cargo(worker, concurrency, payload) {
        return queue$1(worker, concurrency, payload);
      }
      function reduce(coll, memo, iteratee, callback) {
        callback = once(callback);
        var _iteratee = wrapAsync(iteratee);
        return eachOfSeries$1(coll, (x, i, iterCb) => {
          _iteratee(memo, x, (err, v) => {
            memo = v;
            iterCb(err);
          });
        }, (err) => callback(err, memo));
      }
      var reduce$1 = awaitify(reduce, 4);
      function seq(...functions) {
        var _functions = functions.map(wrapAsync);
        return function(...args) {
          var that = this;
          var cb = args[args.length - 1];
          if (typeof cb == "function") {
            args.pop();
          } else {
            cb = promiseCallback();
          }
          reduce$1(
            _functions,
            args,
            (newargs, fn, iterCb) => {
              fn.apply(that, newargs.concat((err, ...nextargs) => {
                iterCb(err, nextargs);
              }));
            },
            (err, results) => cb(err, ...results)
          );
          return cb[PROMISE_SYMBOL];
        };
      }
      function compose(...args) {
        return seq(...args.reverse());
      }
      function mapLimit(coll, limit, iteratee, callback) {
        return _asyncMap(eachOfLimit$2(limit), coll, iteratee, callback);
      }
      var mapLimit$1 = awaitify(mapLimit, 4);
      function concatLimit(coll, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return mapLimit$1(coll, limit, (val2, iterCb) => {
          _iteratee(val2, (err, ...args) => {
            if (err)
              return iterCb(err);
            return iterCb(err, args);
          });
        }, (err, mapResults) => {
          var result = [];
          for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
              result = result.concat(...mapResults[i]);
            }
          }
          return callback(err, result);
        });
      }
      var concatLimit$1 = awaitify(concatLimit, 4);
      function concat(coll, iteratee, callback) {
        return concatLimit$1(coll, Infinity, iteratee, callback);
      }
      var concat$1 = awaitify(concat, 3);
      function concatSeries(coll, iteratee, callback) {
        return concatLimit$1(coll, 1, iteratee, callback);
      }
      var concatSeries$1 = awaitify(concatSeries, 3);
      function constant$1(...args) {
        return function(...ignoredArgs) {
          var callback = ignoredArgs.pop();
          return callback(null, ...args);
        };
      }
      function _createTester(check, getResult) {
        return (eachfn, arr2, _iteratee, cb) => {
          var testPassed = false;
          var testResult;
          const iteratee = wrapAsync(_iteratee);
          eachfn(arr2, (value, _2, callback) => {
            iteratee(value, (err, result) => {
              if (err || err === false)
                return callback(err);
              if (check(result) && !testResult) {
                testPassed = true;
                testResult = getResult(true, value);
                return callback(null, breakLoop$1);
              }
              callback();
            });
          }, (err) => {
            if (err)
              return cb(err);
            cb(null, testPassed ? testResult : getResult(false));
          });
        };
      }
      function detect(coll, iteratee, callback) {
        return _createTester((bool2) => bool2, (res2, item) => item)(eachOf$1, coll, iteratee, callback);
      }
      var detect$1 = awaitify(detect, 3);
      function detectLimit(coll, limit, iteratee, callback) {
        return _createTester((bool2) => bool2, (res2, item) => item)(eachOfLimit$2(limit), coll, iteratee, callback);
      }
      var detectLimit$1 = awaitify(detectLimit, 4);
      function detectSeries(coll, iteratee, callback) {
        return _createTester((bool2) => bool2, (res2, item) => item)(eachOfLimit$2(1), coll, iteratee, callback);
      }
      var detectSeries$1 = awaitify(detectSeries, 3);
      function consoleFunc(name) {
        return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
          if (typeof console === "object") {
            if (err) {
              if (console.error) {
                console.error(err);
              }
            } else if (console[name]) {
              resultArgs.forEach((x) => console[name](x));
            }
          }
        });
      }
      var dir = consoleFunc("dir");
      function doWhilst(iteratee, test, callback) {
        callback = onlyOnce(callback);
        var _fn = wrapAsync(iteratee);
        var _test = wrapAsync(test);
        var results;
        function next(err, ...args) {
          if (err)
            return callback(err);
          if (err === false)
            return;
          results = args;
          _test(...args, check);
        }
        function check(err, truth) {
          if (err)
            return callback(err);
          if (err === false)
            return;
          if (!truth)
            return callback(null, ...results);
          _fn(next);
        }
        return check(null, true);
      }
      var doWhilst$1 = awaitify(doWhilst, 3);
      function doUntil(iteratee, test, callback) {
        const _test = wrapAsync(test);
        return doWhilst$1(iteratee, (...args) => {
          const cb = args.pop();
          _test(...args, (err, truth) => cb(err, !truth));
        }, callback);
      }
      function _withoutIndex(iteratee) {
        return (value, index2, callback) => iteratee(value, callback);
      }
      function eachLimit$2(coll, iteratee, callback) {
        return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
      }
      var each = awaitify(eachLimit$2, 3);
      function eachLimit(coll, limit, iteratee, callback) {
        return eachOfLimit$2(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
      }
      var eachLimit$1 = awaitify(eachLimit, 4);
      function eachSeries(coll, iteratee, callback) {
        return eachLimit$1(coll, 1, iteratee, callback);
      }
      var eachSeries$1 = awaitify(eachSeries, 3);
      function ensureAsync(fn) {
        if (isAsync(fn))
          return fn;
        return function(...args) {
          var callback = args.pop();
          var sync = true;
          args.push((...innerArgs) => {
            if (sync) {
              setImmediate$1(() => callback(...innerArgs));
            } else {
              callback(...innerArgs);
            }
          });
          fn.apply(this, args);
          sync = false;
        };
      }
      function every(coll, iteratee, callback) {
        return _createTester((bool2) => !bool2, (res2) => !res2)(eachOf$1, coll, iteratee, callback);
      }
      var every$1 = awaitify(every, 3);
      function everyLimit(coll, limit, iteratee, callback) {
        return _createTester((bool2) => !bool2, (res2) => !res2)(eachOfLimit$2(limit), coll, iteratee, callback);
      }
      var everyLimit$1 = awaitify(everyLimit, 4);
      function everySeries(coll, iteratee, callback) {
        return _createTester((bool2) => !bool2, (res2) => !res2)(eachOfSeries$1, coll, iteratee, callback);
      }
      var everySeries$1 = awaitify(everySeries, 3);
      function filterArray(eachfn, arr2, iteratee, callback) {
        var truthValues = new Array(arr2.length);
        eachfn(arr2, (x, index2, iterCb) => {
          iteratee(x, (err, v) => {
            truthValues[index2] = !!v;
            iterCb(err);
          });
        }, (err) => {
          if (err)
            return callback(err);
          var results = [];
          for (var i = 0; i < arr2.length; i++) {
            if (truthValues[i])
              results.push(arr2[i]);
          }
          callback(null, results);
        });
      }
      function filterGeneric(eachfn, coll, iteratee, callback) {
        var results = [];
        eachfn(coll, (x, index2, iterCb) => {
          iteratee(x, (err, v) => {
            if (err)
              return iterCb(err);
            if (v) {
              results.push({ index: index2, value: x });
            }
            iterCb(err);
          });
        }, (err) => {
          if (err)
            return callback(err);
          callback(null, results.sort((a, b) => a.index - b.index).map((v) => v.value));
        });
      }
      function _filter(eachfn, coll, iteratee, callback) {
        var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
        return filter2(eachfn, coll, wrapAsync(iteratee), callback);
      }
      function filter(coll, iteratee, callback) {
        return _filter(eachOf$1, coll, iteratee, callback);
      }
      var filter$1 = awaitify(filter, 3);
      function filterLimit(coll, limit, iteratee, callback) {
        return _filter(eachOfLimit$2(limit), coll, iteratee, callback);
      }
      var filterLimit$1 = awaitify(filterLimit, 4);
      function filterSeries(coll, iteratee, callback) {
        return _filter(eachOfSeries$1, coll, iteratee, callback);
      }
      var filterSeries$1 = awaitify(filterSeries, 3);
      function forever(fn, errback) {
        var done = onlyOnce(errback);
        var task = wrapAsync(ensureAsync(fn));
        function next(err) {
          if (err)
            return done(err);
          if (err === false)
            return;
          task(next);
        }
        return next();
      }
      var forever$1 = awaitify(forever, 2);
      function groupByLimit(coll, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return mapLimit$1(coll, limit, (val2, iterCb) => {
          _iteratee(val2, (err, key) => {
            if (err)
              return iterCb(err);
            return iterCb(err, { key, val: val2 });
          });
        }, (err, mapResults) => {
          var result = {};
          var { hasOwnProperty } = Object.prototype;
          for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
              var { key } = mapResults[i];
              var { val: val2 } = mapResults[i];
              if (hasOwnProperty.call(result, key)) {
                result[key].push(val2);
              } else {
                result[key] = [val2];
              }
            }
          }
          return callback(err, result);
        });
      }
      var groupByLimit$1 = awaitify(groupByLimit, 4);
      function groupBy(coll, iteratee, callback) {
        return groupByLimit$1(coll, Infinity, iteratee, callback);
      }
      function groupBySeries(coll, iteratee, callback) {
        return groupByLimit$1(coll, 1, iteratee, callback);
      }
      var log = consoleFunc("log");
      function mapValuesLimit(obj2, limit, iteratee, callback) {
        callback = once(callback);
        var newObj = {};
        var _iteratee = wrapAsync(iteratee);
        return eachOfLimit$2(limit)(obj2, (val2, key, next) => {
          _iteratee(val2, key, (err, result) => {
            if (err)
              return next(err);
            newObj[key] = result;
            next(err);
          });
        }, (err) => callback(err, newObj));
      }
      var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);
      function mapValues(obj2, iteratee, callback) {
        return mapValuesLimit$1(obj2, Infinity, iteratee, callback);
      }
      function mapValuesSeries(obj2, iteratee, callback) {
        return mapValuesLimit$1(obj2, 1, iteratee, callback);
      }
      function memoize(fn, hasher = (v) => v) {
        var memo = /* @__PURE__ */ Object.create(null);
        var queues = /* @__PURE__ */ Object.create(null);
        var _fn = wrapAsync(fn);
        var memoized = initialParams((args, callback) => {
          var key = hasher(...args);
          if (key in memo) {
            setImmediate$1(() => callback(null, ...memo[key]));
          } else if (key in queues) {
            queues[key].push(callback);
          } else {
            queues[key] = [callback];
            _fn(...args, (err, ...resultArgs) => {
              if (!err) {
                memo[key] = resultArgs;
              }
              var q = queues[key];
              delete queues[key];
              for (var i = 0, l = q.length; i < l; i++) {
                q[i](err, ...resultArgs);
              }
            });
          }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
      }
      var _defer;
      if (hasNextTick) {
        _defer = process.nextTick;
      } else if (hasSetImmediate) {
        _defer = setImmediate;
      } else {
        _defer = fallback;
      }
      var nextTick = wrap(_defer);
      var _parallel = awaitify((eachfn, tasks, callback) => {
        var results = isArrayLike(tasks) ? [] : {};
        eachfn(tasks, (task, key, taskCb) => {
          wrapAsync(task)((err, ...result) => {
            if (result.length < 2) {
              [result] = result;
            }
            results[key] = result;
            taskCb(err);
          });
        }, (err) => callback(err, results));
      }, 3);
      function parallel(tasks, callback) {
        return _parallel(eachOf$1, tasks, callback);
      }
      function parallelLimit(tasks, limit, callback) {
        return _parallel(eachOfLimit$2(limit), tasks, callback);
      }
      function queue(worker, concurrency) {
        var _worker = wrapAsync(worker);
        return queue$1((items, cb) => {
          _worker(items[0], cb);
        }, concurrency, 1);
      }
      class Heap {
        constructor() {
          this.heap = [];
          this.pushCount = Number.MIN_SAFE_INTEGER;
        }
        get length() {
          return this.heap.length;
        }
        empty() {
          this.heap = [];
          return this;
        }
        percUp(index2) {
          let p;
          while (index2 > 0 && smaller(this.heap[index2], this.heap[p = parent(index2)])) {
            let t = this.heap[index2];
            this.heap[index2] = this.heap[p];
            this.heap[p] = t;
            index2 = p;
          }
        }
        percDown(index2) {
          let l;
          while ((l = leftChi(index2)) < this.heap.length) {
            if (l + 1 < this.heap.length && smaller(this.heap[l + 1], this.heap[l])) {
              l = l + 1;
            }
            if (smaller(this.heap[index2], this.heap[l])) {
              break;
            }
            let t = this.heap[index2];
            this.heap[index2] = this.heap[l];
            this.heap[l] = t;
            index2 = l;
          }
        }
        push(node) {
          node.pushCount = ++this.pushCount;
          this.heap.push(node);
          this.percUp(this.heap.length - 1);
        }
        unshift(node) {
          return this.heap.push(node);
        }
        shift() {
          let [top] = this.heap;
          this.heap[0] = this.heap[this.heap.length - 1];
          this.heap.pop();
          this.percDown(0);
          return top;
        }
        toArray() {
          return [...this];
        }
        *[Symbol.iterator]() {
          for (let i = 0; i < this.heap.length; i++) {
            yield this.heap[i].data;
          }
        }
        remove(testFn) {
          let j = 0;
          for (let i = 0; i < this.heap.length; i++) {
            if (!testFn(this.heap[i])) {
              this.heap[j] = this.heap[i];
              j++;
            }
          }
          this.heap.splice(j);
          for (let i = parent(this.heap.length - 1); i >= 0; i--) {
            this.percDown(i);
          }
          return this;
        }
      }
      function leftChi(i) {
        return (i << 1) + 1;
      }
      function parent(i) {
        return (i + 1 >> 1) - 1;
      }
      function smaller(x, y) {
        if (x.priority !== y.priority) {
          return x.priority < y.priority;
        } else {
          return x.pushCount < y.pushCount;
        }
      }
      function priorityQueue(worker, concurrency) {
        var q = queue(worker, concurrency);
        var {
          push,
          pushAsync
        } = q;
        q._tasks = new Heap();
        q._createTaskItem = ({ data, priority }, callback) => {
          return {
            data,
            priority,
            callback
          };
        };
        function createDataItems(tasks, priority) {
          if (!Array.isArray(tasks)) {
            return { data: tasks, priority };
          }
          return tasks.map((data) => {
            return { data, priority };
          });
        }
        q.push = function(data, priority = 0, callback) {
          return push(createDataItems(data, priority), callback);
        };
        q.pushAsync = function(data, priority = 0, callback) {
          return pushAsync(createDataItems(data, priority), callback);
        };
        delete q.unshift;
        delete q.unshiftAsync;
        return q;
      }
      function race(tasks, callback) {
        callback = once(callback);
        if (!Array.isArray(tasks))
          return callback(new TypeError("First argument to race must be an array of functions"));
        if (!tasks.length)
          return callback();
        for (var i = 0, l = tasks.length; i < l; i++) {
          wrapAsync(tasks[i])(callback);
        }
      }
      var race$1 = awaitify(race, 2);
      function reduceRight(array, memo, iteratee, callback) {
        var reversed = [...array].reverse();
        return reduce$1(reversed, memo, iteratee, callback);
      }
      function reflect(fn) {
        var _fn = wrapAsync(fn);
        return initialParams(function reflectOn(args, reflectCallback) {
          args.push((error, ...cbArgs) => {
            let retVal = {};
            if (error) {
              retVal.error = error;
            }
            if (cbArgs.length > 0) {
              var value = cbArgs;
              if (cbArgs.length <= 1) {
                [value] = cbArgs;
              }
              retVal.value = value;
            }
            reflectCallback(null, retVal);
          });
          return _fn.apply(this, args);
        });
      }
      function reflectAll(tasks) {
        var results;
        if (Array.isArray(tasks)) {
          results = tasks.map(reflect);
        } else {
          results = {};
          Object.keys(tasks).forEach((key) => {
            results[key] = reflect.call(this, tasks[key]);
          });
        }
        return results;
      }
      function reject$2(eachfn, arr2, _iteratee, callback) {
        const iteratee = wrapAsync(_iteratee);
        return _filter(eachfn, arr2, (value, cb) => {
          iteratee(value, (err, v) => {
            cb(err, !v);
          });
        }, callback);
      }
      function reject(coll, iteratee, callback) {
        return reject$2(eachOf$1, coll, iteratee, callback);
      }
      var reject$1 = awaitify(reject, 3);
      function rejectLimit(coll, limit, iteratee, callback) {
        return reject$2(eachOfLimit$2(limit), coll, iteratee, callback);
      }
      var rejectLimit$1 = awaitify(rejectLimit, 4);
      function rejectSeries(coll, iteratee, callback) {
        return reject$2(eachOfSeries$1, coll, iteratee, callback);
      }
      var rejectSeries$1 = awaitify(rejectSeries, 3);
      function constant(value) {
        return function() {
          return value;
        };
      }
      const DEFAULT_TIMES = 5;
      const DEFAULT_INTERVAL = 0;
      function retry(opts, task, callback) {
        var options = {
          times: DEFAULT_TIMES,
          intervalFunc: constant(DEFAULT_INTERVAL)
        };
        if (arguments.length < 3 && typeof opts === "function") {
          callback = task || promiseCallback();
          task = opts;
        } else {
          parseTimes(options, opts);
          callback = callback || promiseCallback();
        }
        if (typeof task !== "function") {
          throw new Error("Invalid arguments for async.retry");
        }
        var _task = wrapAsync(task);
        var attempt = 1;
        function retryAttempt() {
          _task((err, ...args) => {
            if (err === false)
              return;
            if (err && attempt++ < options.times && (typeof options.errorFilter != "function" || options.errorFilter(err))) {
              setTimeout(retryAttempt, options.intervalFunc(attempt - 1));
            } else {
              callback(err, ...args);
            }
          });
        }
        retryAttempt();
        return callback[PROMISE_SYMBOL];
      }
      function parseTimes(acc, t) {
        if (typeof t === "object") {
          acc.times = +t.times || DEFAULT_TIMES;
          acc.intervalFunc = typeof t.interval === "function" ? t.interval : constant(+t.interval || DEFAULT_INTERVAL);
          acc.errorFilter = t.errorFilter;
        } else if (typeof t === "number" || typeof t === "string") {
          acc.times = +t || DEFAULT_TIMES;
        } else {
          throw new Error("Invalid arguments for async.retry");
        }
      }
      function retryable(opts, task) {
        if (!task) {
          task = opts;
          opts = null;
        }
        let arity = opts && opts.arity || task.length;
        if (isAsync(task)) {
          arity += 1;
        }
        var _task = wrapAsync(task);
        return initialParams((args, callback) => {
          if (args.length < arity - 1 || callback == null) {
            args.push(callback);
            callback = promiseCallback();
          }
          function taskFn(cb) {
            _task(...args, cb);
          }
          if (opts)
            retry(opts, taskFn, callback);
          else
            retry(taskFn, callback);
          return callback[PROMISE_SYMBOL];
        });
      }
      function series(tasks, callback) {
        return _parallel(eachOfSeries$1, tasks, callback);
      }
      function some(coll, iteratee, callback) {
        return _createTester(Boolean, (res2) => res2)(eachOf$1, coll, iteratee, callback);
      }
      var some$1 = awaitify(some, 3);
      function someLimit(coll, limit, iteratee, callback) {
        return _createTester(Boolean, (res2) => res2)(eachOfLimit$2(limit), coll, iteratee, callback);
      }
      var someLimit$1 = awaitify(someLimit, 4);
      function someSeries(coll, iteratee, callback) {
        return _createTester(Boolean, (res2) => res2)(eachOfSeries$1, coll, iteratee, callback);
      }
      var someSeries$1 = awaitify(someSeries, 3);
      function sortBy(coll, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return map$1(coll, (x, iterCb) => {
          _iteratee(x, (err, criteria) => {
            if (err)
              return iterCb(err);
            iterCb(err, { value: x, criteria });
          });
        }, (err, results) => {
          if (err)
            return callback(err);
          callback(null, results.sort(comparator).map((v) => v.value));
        });
        function comparator(left, right) {
          var a = left.criteria, b = right.criteria;
          return a < b ? -1 : a > b ? 1 : 0;
        }
      }
      var sortBy$1 = awaitify(sortBy, 3);
      function timeout(asyncFn, milliseconds, info) {
        var fn = wrapAsync(asyncFn);
        return initialParams((args, callback) => {
          var timedOut = false;
          var timer;
          function timeoutCallback() {
            var name = asyncFn.name || "anonymous";
            var error = new Error('Callback function "' + name + '" timed out.');
            error.code = "ETIMEDOUT";
            if (info) {
              error.info = info;
            }
            timedOut = true;
            callback(error);
          }
          args.push((...cbArgs) => {
            if (!timedOut) {
              callback(...cbArgs);
              clearTimeout(timer);
            }
          });
          timer = setTimeout(timeoutCallback, milliseconds);
          fn(...args);
        });
      }
      function range(size) {
        var result = Array(size);
        while (size--) {
          result[size] = size;
        }
        return result;
      }
      function timesLimit(count, limit, iteratee, callback) {
        var _iteratee = wrapAsync(iteratee);
        return mapLimit$1(range(count), limit, _iteratee, callback);
      }
      function times(n, iteratee, callback) {
        return timesLimit(n, Infinity, iteratee, callback);
      }
      function timesSeries(n, iteratee, callback) {
        return timesLimit(n, 1, iteratee, callback);
      }
      function transform(coll, accumulator, iteratee, callback) {
        if (arguments.length <= 3 && typeof accumulator === "function") {
          callback = iteratee;
          iteratee = accumulator;
          accumulator = Array.isArray(coll) ? [] : {};
        }
        callback = once(callback || promiseCallback());
        var _iteratee = wrapAsync(iteratee);
        eachOf$1(coll, (v, k, cb) => {
          _iteratee(accumulator, v, k, cb);
        }, (err) => callback(err, accumulator));
        return callback[PROMISE_SYMBOL];
      }
      function tryEach(tasks, callback) {
        var error = null;
        var result;
        return eachSeries$1(tasks, (task, taskCb) => {
          wrapAsync(task)((err, ...args) => {
            if (err === false)
              return taskCb(err);
            if (args.length < 2) {
              [result] = args;
            } else {
              result = args;
            }
            error = err;
            taskCb(err ? null : {});
          });
        }, () => callback(error, result));
      }
      var tryEach$1 = awaitify(tryEach);
      function unmemoize(fn) {
        return (...args) => {
          return (fn.unmemoized || fn)(...args);
        };
      }
      function whilst(test, iteratee, callback) {
        callback = onlyOnce(callback);
        var _fn = wrapAsync(iteratee);
        var _test = wrapAsync(test);
        var results = [];
        function next(err, ...rest) {
          if (err)
            return callback(err);
          results = rest;
          if (err === false)
            return;
          _test(check);
        }
        function check(err, truth) {
          if (err)
            return callback(err);
          if (err === false)
            return;
          if (!truth)
            return callback(null, ...results);
          _fn(next);
        }
        return _test(check);
      }
      var whilst$1 = awaitify(whilst, 3);
      function until(test, iteratee, callback) {
        const _test = wrapAsync(test);
        return whilst$1((cb) => _test((err, truth) => cb(err, !truth)), iteratee, callback);
      }
      function waterfall(tasks, callback) {
        callback = once(callback);
        if (!Array.isArray(tasks))
          return callback(new Error("First argument to waterfall must be an array of functions"));
        if (!tasks.length)
          return callback();
        var taskIndex = 0;
        function nextTask(args) {
          var task = wrapAsync(tasks[taskIndex++]);
          task(...args, onlyOnce(next));
        }
        function next(err, ...args) {
          if (err === false)
            return;
          if (err || taskIndex === tasks.length) {
            return callback(err, ...args);
          }
          nextTask(args);
        }
        nextTask([]);
      }
      var waterfall$1 = awaitify(waterfall);
      var index = {
        apply,
        applyEach,
        applyEachSeries,
        asyncify,
        auto,
        autoInject,
        cargo: cargo$1,
        cargoQueue: cargo,
        compose,
        concat: concat$1,
        concatLimit: concatLimit$1,
        concatSeries: concatSeries$1,
        constant: constant$1,
        detect: detect$1,
        detectLimit: detectLimit$1,
        detectSeries: detectSeries$1,
        dir,
        doUntil,
        doWhilst: doWhilst$1,
        each,
        eachLimit: eachLimit$1,
        eachOf: eachOf$1,
        eachOfLimit: eachOfLimit$1,
        eachOfSeries: eachOfSeries$1,
        eachSeries: eachSeries$1,
        ensureAsync,
        every: every$1,
        everyLimit: everyLimit$1,
        everySeries: everySeries$1,
        filter: filter$1,
        filterLimit: filterLimit$1,
        filterSeries: filterSeries$1,
        forever: forever$1,
        groupBy,
        groupByLimit: groupByLimit$1,
        groupBySeries,
        log,
        map: map$1,
        mapLimit: mapLimit$1,
        mapSeries: mapSeries$1,
        mapValues,
        mapValuesLimit: mapValuesLimit$1,
        mapValuesSeries,
        memoize,
        nextTick,
        parallel,
        parallelLimit,
        priorityQueue,
        queue,
        race: race$1,
        reduce: reduce$1,
        reduceRight,
        reflect,
        reflectAll,
        reject: reject$1,
        rejectLimit: rejectLimit$1,
        rejectSeries: rejectSeries$1,
        retry,
        retryable,
        seq,
        series,
        setImmediate: setImmediate$1,
        some: some$1,
        someLimit: someLimit$1,
        someSeries: someSeries$1,
        sortBy: sortBy$1,
        timeout,
        times,
        timesLimit,
        timesSeries,
        transform,
        tryEach: tryEach$1,
        unmemoize,
        until,
        waterfall: waterfall$1,
        whilst: whilst$1,
        // aliases
        all: every$1,
        allLimit: everyLimit$1,
        allSeries: everySeries$1,
        any: some$1,
        anyLimit: someLimit$1,
        anySeries: someSeries$1,
        find: detect$1,
        findLimit: detectLimit$1,
        findSeries: detectSeries$1,
        flatMap: concat$1,
        flatMapLimit: concatLimit$1,
        flatMapSeries: concatSeries$1,
        forEach: each,
        forEachSeries: eachSeries$1,
        forEachLimit: eachLimit$1,
        forEachOf: eachOf$1,
        forEachOfSeries: eachOfSeries$1,
        forEachOfLimit: eachOfLimit$1,
        inject: reduce$1,
        foldl: reduce$1,
        foldr: reduceRight,
        select: filter$1,
        selectLimit: filterLimit$1,
        selectSeries: filterSeries$1,
        wrapSync: asyncify,
        during: whilst$1,
        doDuring: doWhilst$1
      };
      exports2.all = every$1;
      exports2.allLimit = everyLimit$1;
      exports2.allSeries = everySeries$1;
      exports2.any = some$1;
      exports2.anyLimit = someLimit$1;
      exports2.anySeries = someSeries$1;
      exports2.apply = apply;
      exports2.applyEach = applyEach;
      exports2.applyEachSeries = applyEachSeries;
      exports2.asyncify = asyncify;
      exports2.auto = auto;
      exports2.autoInject = autoInject;
      exports2.cargo = cargo$1;
      exports2.cargoQueue = cargo;
      exports2.compose = compose;
      exports2.concat = concat$1;
      exports2.concatLimit = concatLimit$1;
      exports2.concatSeries = concatSeries$1;
      exports2.constant = constant$1;
      exports2.default = index;
      exports2.detect = detect$1;
      exports2.detectLimit = detectLimit$1;
      exports2.detectSeries = detectSeries$1;
      exports2.dir = dir;
      exports2.doDuring = doWhilst$1;
      exports2.doUntil = doUntil;
      exports2.doWhilst = doWhilst$1;
      exports2.during = whilst$1;
      exports2.each = each;
      exports2.eachLimit = eachLimit$1;
      exports2.eachOf = eachOf$1;
      exports2.eachOfLimit = eachOfLimit$1;
      exports2.eachOfSeries = eachOfSeries$1;
      exports2.eachSeries = eachSeries$1;
      exports2.ensureAsync = ensureAsync;
      exports2.every = every$1;
      exports2.everyLimit = everyLimit$1;
      exports2.everySeries = everySeries$1;
      exports2.filter = filter$1;
      exports2.filterLimit = filterLimit$1;
      exports2.filterSeries = filterSeries$1;
      exports2.find = detect$1;
      exports2.findLimit = detectLimit$1;
      exports2.findSeries = detectSeries$1;
      exports2.flatMap = concat$1;
      exports2.flatMapLimit = concatLimit$1;
      exports2.flatMapSeries = concatSeries$1;
      exports2.foldl = reduce$1;
      exports2.foldr = reduceRight;
      exports2.forEach = each;
      exports2.forEachLimit = eachLimit$1;
      exports2.forEachOf = eachOf$1;
      exports2.forEachOfLimit = eachOfLimit$1;
      exports2.forEachOfSeries = eachOfSeries$1;
      exports2.forEachSeries = eachSeries$1;
      exports2.forever = forever$1;
      exports2.groupBy = groupBy;
      exports2.groupByLimit = groupByLimit$1;
      exports2.groupBySeries = groupBySeries;
      exports2.inject = reduce$1;
      exports2.log = log;
      exports2.map = map$1;
      exports2.mapLimit = mapLimit$1;
      exports2.mapSeries = mapSeries$1;
      exports2.mapValues = mapValues;
      exports2.mapValuesLimit = mapValuesLimit$1;
      exports2.mapValuesSeries = mapValuesSeries;
      exports2.memoize = memoize;
      exports2.nextTick = nextTick;
      exports2.parallel = parallel;
      exports2.parallelLimit = parallelLimit;
      exports2.priorityQueue = priorityQueue;
      exports2.queue = queue;
      exports2.race = race$1;
      exports2.reduce = reduce$1;
      exports2.reduceRight = reduceRight;
      exports2.reflect = reflect;
      exports2.reflectAll = reflectAll;
      exports2.reject = reject$1;
      exports2.rejectLimit = rejectLimit$1;
      exports2.rejectSeries = rejectSeries$1;
      exports2.retry = retry;
      exports2.retryable = retryable;
      exports2.select = filter$1;
      exports2.selectLimit = filterLimit$1;
      exports2.selectSeries = filterSeries$1;
      exports2.seq = seq;
      exports2.series = series;
      exports2.setImmediate = setImmediate$1;
      exports2.some = some$1;
      exports2.someLimit = someLimit$1;
      exports2.someSeries = someSeries$1;
      exports2.sortBy = sortBy$1;
      exports2.timeout = timeout;
      exports2.times = times;
      exports2.timesLimit = timesLimit;
      exports2.timesSeries = timesSeries;
      exports2.transform = transform;
      exports2.tryEach = tryEach$1;
      exports2.unmemoize = unmemoize;
      exports2.until = until;
      exports2.waterfall = waterfall$1;
      exports2.whilst = whilst$1;
      exports2.wrapSync = asyncify;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs);
      }
      if (!fs.lutimes) {
        patchLutimes(fs);
      }
      fs.chown = chownFix(fs.chown);
      fs.fchown = chownFix(fs.fchown);
      fs.lchown = chownFix(fs.lchown);
      fs.chmod = chmodFix(fs.chmod);
      fs.fchmod = chmodFix(fs.fchmod);
      fs.lchmod = chmodFix(fs.lchmod);
      fs.chownSync = chownFixSync(fs.chownSync);
      fs.fchownSync = chownFixSync(fs.fchownSync);
      fs.lchownSync = chownFixSync(fs.lchownSync);
      fs.chmodSync = chmodFixSync(fs.chmodSync);
      fs.fchmodSync = chmodFixSync(fs.fchmodSync);
      fs.lchmodSync = chmodFixSync(fs.lchmodSync);
      fs.stat = statFix(fs.stat);
      fs.fstat = statFix(fs.fstat);
      fs.lstat = statFix(fs.lstat);
      fs.statSync = statFixSync(fs.statSync);
      fs.fstatSync = statFixSync(fs.fstatSync);
      fs.lstatSync = statFixSync(fs.lstatSync);
      if (fs.chmod && !fs.lchmod) {
        fs.lchmod = function(path, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs.lchmodSync = function() {
        };
      }
      if (fs.chown && !fs.lchown) {
        fs.lchown = function(path, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs.rename = typeof fs.rename !== "function" ? fs.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          }
          if (Object.setPrototypeOf)
            Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs.rename);
      }
      fs.read = typeof fs.read !== "function" ? fs.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _2, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs.read);
      fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs.readSync);
      function patchLchmod(fs2) {
        fs2.lchmod = function(path, mode, callback) {
          fs2.open(
            path,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback)
                  callback(err);
                return;
              }
              fs2.fchmod(fd, mode, function(err2) {
                fs2.close(fd, function(err22) {
                  if (callback)
                    callback(err2 || err22);
                });
              });
            }
          );
        };
        fs2.lchmodSync = function(path, mode) {
          var fd = fs2.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs2.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs2.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs2.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs2) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs2.futimes) {
          fs2.lutimes = function(path, at, mt, cb) {
            fs2.open(path, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs2.futimes(fd, at, mt, function(er2) {
                fs2.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs2.lutimesSync = function(path, at, mt) {
            var fd = fs2.openSync(path, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs2.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs2.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs2.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs2.futimes) {
          fs2.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs2.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path, options) {
        if (!(this instanceof ReadStream))
          return new ReadStream(path, options);
        Stream.call(this);
        var self2 = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream(path, options) {
        if (!(this instanceof WriteStream))
          return new WriteStream(path, options);
        Stream.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj2) {
      return obj2.__proto__;
    };
    function clone(obj2) {
      if (obj2 === null || typeof obj2 !== "object")
        return obj2;
      if (obj2 instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj2) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj2).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj2, key));
      });
      return copy;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports, module2) {
    var fs = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs, queue);
      fs.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs.close);
      fs.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs[gracefulQueue]);
          require("assert").equal(fs[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs[gracefulQueue]);
    }
    module2.exports = patch(clone(fs));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
      module2.exports = patch(fs);
      fs.__patched = true;
    }
    function patch(fs2) {
      polyfills(fs2);
      fs2.gracefulify = patch;
      fs2.createReadStream = createReadStream;
      fs2.createWriteStream = createWriteStream;
      var fs$readFile = fs2.readFile;
      fs2.readFile = readFile;
      function readFile(path, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path, options, cb);
        function go$readFile(path2, options2, cb2, startTime) {
          return fs$readFile(path2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs2.writeFile;
      fs2.writeFile = writeFile;
      function writeFile(path, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path, data, options, cb);
        function go$writeFile(path2, data2, options2, cb2, startTime) {
          return fs$writeFile(path2, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path2, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs2.appendFile;
      if (fs$appendFile)
        fs2.appendFile = appendFile;
      function appendFile(path, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path, data, options, cb);
        function go$appendFile(path2, data2, options2, cb2, startTime) {
          return fs$appendFile(path2, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path2, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs2.copyFile;
      if (fs$copyFile)
        fs2.copyFile = copyFile;
      function copyFile(src, dest, flags2, cb) {
        if (typeof flags2 === "function") {
          cb = flags2;
          flags2 = 0;
        }
        return go$copyFile(src, dest, flags2, cb);
        function go$copyFile(src2, dest2, flags3, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags3, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags3, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs2.readdir;
      fs2.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path2, options2, cb2, startTime) {
          return fs$readdir(path2, fs$readdirCallback(
            path2,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path2, options2, cb2, startTime) {
          return fs$readdir(path2, options2, fs$readdirCallback(
            path2,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path, options, cb);
        function fs$readdirCallback(path2, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path2, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs2);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs2.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs2.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs2, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val2) {
          ReadStream = val2;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs2, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val2) {
          WriteStream = val2;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs2, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val2) {
          FileReadStream = val2;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs2, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val2) {
          FileWriteStream = val2;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path, options) {
        return new fs2.ReadStream(path, options);
      }
      function createWriteStream(path, options) {
        return new fs2.WriteStream(path, options);
      }
      var fs$open = fs2.open;
      fs2.open = open;
      function open(path, flags2, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path, flags2, mode, cb);
        function go$open(path2, flags3, mode2, cb2, startTime) {
          return fs$open(path2, flags3, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path2, flags3, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs2;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs[gracefulQueue].length; ++i) {
        if (fs[gracefulQueue][i].length > 2) {
          fs[gracefulQueue][i][3] = now;
          fs[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs[gracefulQueue].length === 0)
        return;
      var elem = fs[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "node_modules/process-nextick-args/index.js"(exports, module2) {
    "use strict";
    if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
      module2.exports = { nextTick };
    } else {
      module2.exports = process;
    }
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn !== "function") {
        throw new TypeError('"callback" argument must be a function');
      }
      var len = arguments.length;
      var args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) {
            args[i++] = arguments[i];
          }
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/isarray/index.js"(exports, module2) {
    var toString = {}.toString;
    module2.exports = Array.isArray || function(arr2) {
      return toString.call(arr2) == "[object Array]";
    };
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module2) {
    module2.exports = require("stream");
  }
});

// node_modules/lazystream/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/lazystream/node_modules/safe-buffer/index.js"(exports, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/core-util-is/lib/util.js
var require_util = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString2(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString2;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports, module2) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer().Buffer;
    var util = require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module2.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0)
          this.tail.next = entry;
        else
          this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0)
          this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0)
          return;
        var ret = this.head.data;
        if (this.length === 1)
          this.head = this.tail = null;
        else
          this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear2() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (this.length === 0)
          return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) {
          ret += s + p.data;
        }
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0)
          return Buffer2.alloc(0);
        var ret = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    }();
    if (util && util.inspect && util.inspect.custom) {
      module2.exports.prototype[util.inspect.custom] = function() {
        var obj2 = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj2;
      };
    }
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            pna.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            pna.nextTick(emitErrorNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, _this, err2);
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports, module2) {
    module2.exports = require("util").deprecate;
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/_stream_writable.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0)
        this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0))
        this.highWaterMark = writableHwm;
      else
        this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_2) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ended)
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending)
        endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          pna.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/_stream_duplex.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj2) {
      var keys2 = [];
      for (var key in obj2) {
        keys2.push(key);
      }
      return keys2;
    };
    module2.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method])
          Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false)
        this.readable = false;
      if (options && options.writable === false)
        this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended)
        return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// node_modules/lazystream/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/lazystream/node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed)
        return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0)
        return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/_stream_readable.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList();
    var destroyImpl = require_destroy();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0)
        this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0))
        this.highWaterMark = readableHwm;
      else
        this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable))
        return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              stream.emit("error", new Error("stream.unshift() after end event"));
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync)
          pna.nextTick(emitReadable_, stream);
        else
          emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted)
        pna.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, { hasUnpiped: false });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res2 = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res2;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0)
        return null;
      var ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.head.data;
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret;
      if (n < list.head.data.length) {
        ret = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret = list.shift();
      } else {
        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str2 = p.data;
        var nb = n > str2.length ? str2.length : n;
        if (nb === str2.length)
          ret += str2;
        else
          ret += str2.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str2.length) {
            ++c;
            if (p.next)
              list.head = p.next;
            else
              list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str2.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function copyFromBuffer(n, list) {
      var ret = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next)
              list.head = p.next;
            else
              list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0)
        throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/_stream_transform.js"(exports, module2) {
    "use strict";
    module2.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming)
        throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/lazystream/node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/lazystream/node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/readable.js"(exports, module2) {
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream;
      exports = module2.exports = Stream.Readable;
      exports.Readable = Stream.Readable;
      exports.Writable = Stream.Writable;
      exports.Duplex = Stream.Duplex;
      exports.Transform = Stream.Transform;
      exports.PassThrough = Stream.PassThrough;
      exports.Stream = Stream;
    } else {
      exports = module2.exports = require_stream_readable();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable();
      exports.Duplex = require_stream_duplex();
      exports.Transform = require_stream_transform();
      exports.PassThrough = require_stream_passthrough();
    }
  }
});

// node_modules/lazystream/node_modules/readable-stream/passthrough.js
var require_passthrough = __commonJS({
  "node_modules/lazystream/node_modules/readable-stream/passthrough.js"(exports, module2) {
    module2.exports = require_readable().PassThrough;
  }
});

// node_modules/lazystream/lib/lazystream.js
var require_lazystream = __commonJS({
  "node_modules/lazystream/lib/lazystream.js"(exports, module2) {
    var util = require("util");
    var PassThrough = require_passthrough();
    module2.exports = {
      Readable,
      Writable
    };
    util.inherits(Readable, PassThrough);
    util.inherits(Writable, PassThrough);
    function beforeFirstCall(instance, method, callback) {
      instance[method] = function() {
        delete instance[method];
        callback.apply(this, arguments);
        return this[method].apply(this, arguments);
      };
    }
    function Readable(fn, options) {
      if (!(this instanceof Readable))
        return new Readable(fn, options);
      PassThrough.call(this, options);
      beforeFirstCall(this, "_read", function() {
        var source = fn.call(this, options);
        var emit = this.emit.bind(this, "error");
        source.on("error", emit);
        source.pipe(this);
      });
      this.emit("readable");
    }
    function Writable(fn, options) {
      if (!(this instanceof Writable))
        return new Writable(fn, options);
      PassThrough.call(this, options);
      beforeFirstCall(this, "_write", function() {
        var destination = fn.call(this, options);
        var emit = this.emit.bind(this, "error");
        destination.on("error", emit);
        this.pipe(destination);
      });
      this.emit("writable");
    }
  }
});

// node_modules/normalize-path/index.js
var require_normalize_path = __commonJS({
  "node_modules/normalize-path/index.js"(exports, module2) {
    module2.exports = function(path, stripTrailing) {
      if (typeof path !== "string") {
        throw new TypeError("expected path to be a string");
      }
      if (path === "\\" || path === "/")
        return "/";
      var len = path.length;
      if (len <= 1)
        return path;
      var prefix = "";
      if (len > 4 && path[3] === "\\") {
        var ch = path[2];
        if ((ch === "?" || ch === ".") && path.slice(0, 2) === "\\\\") {
          path = path.slice(2);
          prefix = "//";
        }
      }
      var segs = path.split(/[/\\]+/);
      if (stripTrailing !== false && segs[segs.length - 1] === "") {
        segs.pop();
      }
      return prefix + segs.join("/");
    };
  }
});

// node_modules/lodash.defaults/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.defaults/index.js"(exports, module2) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeMax = Math.max;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignInDefaults(objValue, srcValue, key, object) {
      if (objValue === void 0 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
        return srcValue;
      }
      return objValue;
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        object[key] = value;
      }
    }
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseRest(func, start) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }
    function copyObject(source, props, object, customizer) {
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        assignValue(object, key, newValue === void 0 ? source[key] : newValue);
      }
      return object;
    }
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });
    var defaults = baseRest(function(args) {
      args.push(void 0, assignInDefaults);
      return apply(assignInWith, void 0, args);
    });
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    module2.exports = defaults;
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module2) {
    module2.exports = require("stream");
  }
});

// node_modules/archiver-utils/node_modules/safe-buffer/index.js
var require_safe_buffer2 = __commonJS({
  "node_modules/archiver-utils/node_modules/safe-buffer/index.js"(exports, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports, module2) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer2().Buffer;
    var util = require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module2.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0)
          this.tail.next = entry;
        else
          this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0)
          this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0)
          return;
        var ret = this.head.data;
        if (this.length === 1)
          this.head = this.tail = null;
        else
          this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear2() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (this.length === 0)
          return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) {
          ret += s + p.data;
        }
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0)
          return Buffer2.alloc(0);
        var ret = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    }();
    if (util && util.inspect && util.inspect.custom) {
      module2.exports.prototype[util.inspect.custom] = function() {
        var obj2 = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj2;
      };
    }
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            pna.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            pna.nextTick(emitErrorNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, _this, err2);
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_writable.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream2();
    var Buffer2 = require_safe_buffer2().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy2();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex2();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0)
        this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0))
        this.highWaterMark = writableHwm;
      else
        this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_2) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex2();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ended)
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending)
        endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          pna.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_duplex.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj2) {
      var keys2 = [];
      for (var key in obj2) {
        keys2.push(key);
      }
      return keys2;
    };
    module2.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable = require_stream_readable2();
    var Writable = require_stream_writable2();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method])
          Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false)
        this.readable = false;
      if (options && options.writable === false)
        this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended)
        return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// node_modules/archiver-utils/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder2 = __commonJS({
  "node_modules/archiver-utils/node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer2().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed)
        return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0)
        return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_readable.js"(exports, module2) {
    "use strict";
    var pna = require_process_nextick_args();
    module2.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream2();
    var Buffer2 = require_safe_buffer2().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList2();
    var destroyImpl = require_destroy2();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex2();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0)
        this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0))
        this.highWaterMark = readableHwm;
      else
        this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder2().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex2();
      if (!(this instanceof Readable))
        return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              stream.emit("error", new Error("stream.unshift() after end event"));
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder2().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync)
          pna.nextTick(emitReadable_, stream);
        else
          emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted)
        pna.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, { hasUnpiped: false });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res2 = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res2;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0)
        return null;
      var ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.head.data;
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret;
      if (n < list.head.data.length) {
        ret = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret = list.shift();
      } else {
        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str2 = p.data;
        var nb = n > str2.length ? str2.length : n;
        if (nb === str2.length)
          ret += str2;
        else
          ret += str2.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str2.length) {
            ++c;
            if (p.next)
              list.head = p.next;
            else
              list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str2.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function copyFromBuffer(n, list) {
      var ret = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next)
              list.head = p.next;
            else
              list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0)
        throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_transform.js"(exports, module2) {
    "use strict";
    module2.exports = Transform;
    var Duplex = require_stream_duplex2();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming)
        throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform2();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/archiver-utils/node_modules/readable-stream/readable.js
var require_readable2 = __commonJS({
  "node_modules/archiver-utils/node_modules/readable-stream/readable.js"(exports, module2) {
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream;
      exports = module2.exports = Stream.Readable;
      exports.Readable = Stream.Readable;
      exports.Writable = Stream.Writable;
      exports.Duplex = Stream.Duplex;
      exports.Transform = Stream.Transform;
      exports.PassThrough = Stream.PassThrough;
      exports.Stream = Stream;
    } else {
      exports = module2.exports = require_stream_readable2();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable2();
      exports.Duplex = require_stream_duplex2();
      exports.Transform = require_stream_transform2();
      exports.PassThrough = require_stream_passthrough2();
    }
  }
});

// node_modules/lodash.flatten/index.js
var require_lodash2 = __commonJS({
  "node_modules/lodash.flatten/index.js"(exports, module2) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var Symbol2 = root.Symbol;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    function flatten(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, 1) : [];
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    module2.exports = flatten;
  }
});

// node_modules/lodash.difference/index.js
var require_lodash3 = __commonJS({
  "node_modules/lodash.difference/index.js"(exports, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayIncludes(array, value) {
      var length = array ? array.length : 0;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function arrayMap(array, iteratee) {
      var index = -1, length = array ? array.length : 0, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Symbol2 = root.Symbol;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    var nativeMax = Math.max;
    var Map = getNative(root, "Map");
    var nativeCreate = getNative(Object, "create");
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      } else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
      return result;
    }
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseRest(func, start) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
    });
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    module2.exports = difference;
  }
});

// node_modules/lodash.union/index.js
var require_lodash4 = __commonJS({
  "node_modules/lodash.union/index.js"(exports, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayIncludes(array, value) {
      var length = array ? array.length : 0;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array ? array.length : 0;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Symbol2 = root.Symbol;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    var nativeMax = Math.max;
    var Map = getNative(root, "Map");
    var Set2 = getNative(root, "Set");
    var nativeCreate = getNative(Object, "create");
    function Hash(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries ? entries.length : 0;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseRest(func, start) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function noop() {
    }
    module2.exports = union;
  }
});

// node_modules/lodash.isplainobject/index.js
var require_lodash5 = __commonJS({
  "node_modules/lodash.isplainobject/index.js"(exports, module2) {
    var objectTag = "[object Object]";
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    var objectToString = objectProto.toString;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module2.exports = isPlainObject;
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs.statSync(base);
            linkTarget = fs.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs = require("fs");
    var origRealpath = fs.realpath;
    var origRealpathSync = fs.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs.realpath = realpath;
      fs.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs.realpath = origRealpath;
      fs.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports, module2) {
    module2.exports = function(xs, fn) {
      var res2 = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res2.push.apply(res2, x);
        else
          res2.push(x);
      }
      return res2;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion2 = __commonJS({
  "node_modules/brace-expansion/index.js"(exports, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str2) {
      return parseInt(str2, 10) == str2 ? parseInt(str2, 10) : str2.charCodeAt(0);
    }
    function escapeBraces(str2) {
      return str2.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str2) {
      return str2.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str2) {
      if (!str2)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str2);
      if (!m)
        return str2.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str2) {
      if (!str2)
        return [];
      if (str2.substr(0, 2) === "{}") {
        str2 = "\\{\\}" + str2.substr(2);
      }
      return expand(escapeBraces(str2), true).map(unescapeBraces);
    }
    function embrace(str2) {
      return "{" + str2 + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str2, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str2);
      if (!m || /\$$/.test(m.pre))
        return [str2];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str2 = m.pre + "{" + m.body + escClose + m.post;
          return expand(str2);
        }
        return [str2];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch2 = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path = function() {
      try {
        return require("path");
      } catch (e) {
      }
    }() || {
      sep: "/"
    };
    minimatch.sep = path.sep;
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion2();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      b = b || {};
      var t = {};
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options) {
        return orig(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      m.Minimatch.defaults = function defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      };
      m.filter = function filter2(pattern, options) {
        return orig.filter(pattern, ext(def, options));
      };
      m.defaults = function defaults(options) {
        return orig.defaults(ext(def, options));
      };
      m.makeRe = function makeRe2(pattern, options) {
        return orig.makeRe(pattern, ext(def, options));
      };
      m.braceExpand = function braceExpand2(pattern, options) {
        return orig.braceExpand(pattern, ext(def, options));
      };
      m.match = function(list, pattern, options) {
        return orig.match(list, pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      assertValidPattern(pattern);
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      assertValidPattern(pattern);
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (!options.allowWindowsEscape && path.sep !== "/") {
        pattern = pattern.split(path.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.partial = !!options.partial;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = function debug() {
          console.error.apply(console, arguments);
        };
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    }
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = function(pattern) {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    Minimatch.prototype.parse = parse;
    var SUBPARSE = {};
    function parse(pattern, isSub) {
      assertValidPattern(pattern);
      var options = this.options;
      if (pattern === "**") {
        if (!options.noglobstar)
          return GLOBSTAR;
        else
          pattern = "*";
      }
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self2 = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self2.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/": {
            return false;
          }
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self2.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_2, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case "[":
        case ".":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags2 = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags2);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags2 = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags2);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = function match(f, partial) {
      if (typeof partial === "undefined")
        partial = this.partial;
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path.sep !== "/") {
        f = f.split(path.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    };
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug(
        "matchOne",
        { "this": this, file, pattern }
      );
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          hit = f === p;
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        return fi === fl - 1 && file[fi] === "";
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports, module2) {
    "use strict";
    function posix(path) {
      return path.charAt(0) === "/";
    }
    function win32(path) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/glob/common.js"(exports) {
    exports.setopts = setopts;
    exports.ownProp = ownProp;
    exports.makeAbs = makeAbs;
    exports.finish = finish;
    exports.mark = mark;
    exports.isIgnored = isIgnored;
    exports.childrenIgnored = childrenIgnored;
    function ownProp(obj2, field) {
      return Object.prototype.hasOwnProperty.call(obj2, field);
    }
    var fs = require("fs");
    var path = require("path");
    var minimatch = require_minimatch2();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self2, options) {
      self2.ignore = options.ignore || [];
      if (!Array.isArray(self2.ignore))
        self2.ignore = [self2.ignore];
      if (self2.ignore.length) {
        self2.ignore = self2.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self2, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self2.silent = !!options.silent;
      self2.pattern = pattern;
      self2.strict = options.strict !== false;
      self2.realpath = !!options.realpath;
      self2.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self2.follow = !!options.follow;
      self2.dot = !!options.dot;
      self2.mark = !!options.mark;
      self2.nodir = !!options.nodir;
      if (self2.nodir)
        self2.mark = true;
      self2.sync = !!options.sync;
      self2.nounique = !!options.nounique;
      self2.nonull = !!options.nonull;
      self2.nosort = !!options.nosort;
      self2.nocase = !!options.nocase;
      self2.stat = !!options.stat;
      self2.noprocess = !!options.noprocess;
      self2.absolute = !!options.absolute;
      self2.fs = options.fs || fs;
      self2.maxLength = options.maxLength || Infinity;
      self2.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self2.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self2.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self2, options);
      self2.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self2.cwd = cwd;
      else {
        self2.cwd = path.resolve(options.cwd);
        self2.changedCwd = self2.cwd !== cwd;
      }
      self2.root = options.root || path.resolve(self2.cwd, "/");
      self2.root = path.resolve(self2.root);
      if (process.platform === "win32")
        self2.root = self2.root.replace(/\\/g, "/");
      self2.cwdAbs = isAbsolute(self2.cwd) ? self2.cwd : makeAbs(self2, self2.cwd);
      if (process.platform === "win32")
        self2.cwdAbs = self2.cwdAbs.replace(/\\/g, "/");
      self2.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = false;
      self2.minimatch = new Minimatch(pattern, options);
      self2.options = self2.minimatch.options;
    }
    function finish(self2) {
      var nou = self2.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i = 0, l = self2.matches.length; i < l; i++) {
        var matches = self2.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self2.nonull) {
            var literal = self2.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self2.nosort)
        all = all.sort(alphasort);
      if (self2.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self2._mark(all[i]);
        }
        if (self2.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self2.cache[e] || self2.cache[makeAbs(self2, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self2.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self2, m2);
        });
      self2.found = all;
    }
    function mark(self2, p) {
      var abs = makeAbs(self2, p);
      var c = self2.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self2, m);
          self2.statCache[mabs] = self2.statCache[abs];
          self2.cache[mabs] = self2.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self2, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path.join(self2.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self2.changedCwd) {
        abs = path.resolve(self2.cwd, f);
      } else {
        abs = path.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self2, path2) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return item.matcher.match(path2) || !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
    function childrenIgnored(self2, path2) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
  }
});

// node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/glob/sync.js"(exports, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch2();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = require("util");
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self2 = this;
        this.matches.forEach(function(matchset, index) {
          var set = self2.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self2._makeAbs(p);
              var real = rp.realpathSync(p, self2.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self2._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports, module2) {
    var wrappy = require_wrappy();
    var reqs = /* @__PURE__ */ Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/glob/glob.js"(exports, module2) {
    module2.exports = glob;
    var rp = require_fs();
    var minimatch = require_minimatch2();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self2 = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self2._processing;
        if (self2._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self2._finish();
            });
          } else {
            self2._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self2 = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self2._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self2 = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i) {
        p = self2._makeAbs(p);
        rp.realpath(p, self2.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self2.emit("error", er);
          if (--n === 0) {
            self2.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self2._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self2 = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self2.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self2.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self2.cache[abs] = "FILE";
          cb();
        } else
          self2._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self2 = this;
      self2.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self2, abs, cb) {
      return function(er, entries) {
        if (er)
          self2._readdirError(abs, er, cb);
        else
          self2._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self2._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self2 = this;
      this._stat(prefix, function(er, exists) {
        self2._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self2 = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self2.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self2.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self2._stat2(f, abs, null, lstat, cb);
            else
              self2._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self2._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/archiver-utils/file.js
var require_file = __commonJS({
  "node_modules/archiver-utils/file.js"(exports, module2) {
    var fs = require_graceful_fs();
    var path = require("path");
    var flatten = require_lodash2();
    var difference = require_lodash3();
    var union = require_lodash4();
    var isPlainObject = require_lodash5();
    var glob = require_glob();
    var file = module2.exports = {};
    var pathSeparatorRe = /[\/\\]/g;
    var processPatterns = function(patterns, fn) {
      var result = [];
      flatten(patterns).forEach(function(pattern) {
        var exclusion = pattern.indexOf("!") === 0;
        if (exclusion) {
          pattern = pattern.slice(1);
        }
        var matches = fn(pattern);
        if (exclusion) {
          result = difference(result, matches);
        } else {
          result = union(result, matches);
        }
      });
      return result;
    };
    file.exists = function() {
      var filepath = path.join.apply(path, arguments);
      return fs.existsSync(filepath);
    };
    file.expand = function(...args) {
      var options = isPlainObject(args[0]) ? args.shift() : {};
      var patterns = Array.isArray(args[0]) ? args[0] : args;
      if (patterns.length === 0) {
        return [];
      }
      var matches = processPatterns(patterns, function(pattern) {
        return glob.sync(pattern, options);
      });
      if (options.filter) {
        matches = matches.filter(function(filepath) {
          filepath = path.join(options.cwd || "", filepath);
          try {
            if (typeof options.filter === "function") {
              return options.filter(filepath);
            } else {
              return fs.statSync(filepath)[options.filter]();
            }
          } catch (e) {
            return false;
          }
        });
      }
      return matches;
    };
    file.expandMapping = function(patterns, destBase, options) {
      options = Object.assign({
        rename: function(destBase2, destPath) {
          return path.join(destBase2 || "", destPath);
        }
      }, options);
      var files = [];
      var fileByDest = {};
      file.expand(options, patterns).forEach(function(src) {
        var destPath = src;
        if (options.flatten) {
          destPath = path.basename(destPath);
        }
        if (options.ext) {
          destPath = destPath.replace(/(\.[^\/]*)?$/, options.ext);
        }
        var dest = options.rename(destBase, destPath, options);
        if (options.cwd) {
          src = path.join(options.cwd, src);
        }
        dest = dest.replace(pathSeparatorRe, "/");
        src = src.replace(pathSeparatorRe, "/");
        if (fileByDest[dest]) {
          fileByDest[dest].src.push(src);
        } else {
          files.push({
            src: [src],
            dest
          });
          fileByDest[dest] = files[files.length - 1];
        }
      });
      return files;
    };
    file.normalizeFilesArray = function(data) {
      var files = [];
      data.forEach(function(obj2) {
        var prop;
        if ("src" in obj2 || "dest" in obj2) {
          files.push(obj2);
        }
      });
      if (files.length === 0) {
        return [];
      }
      files = _(files).chain().forEach(function(obj2) {
        if (!("src" in obj2) || !obj2.src) {
          return;
        }
        if (Array.isArray(obj2.src)) {
          obj2.src = flatten(obj2.src);
        } else {
          obj2.src = [obj2.src];
        }
      }).map(function(obj2) {
        var expandOptions = Object.assign({}, obj2);
        delete expandOptions.src;
        delete expandOptions.dest;
        if (obj2.expand) {
          return file.expandMapping(obj2.src, obj2.dest, expandOptions).map(function(mapObj) {
            var result2 = Object.assign({}, obj2);
            result2.orig = Object.assign({}, obj2);
            result2.src = mapObj.src;
            result2.dest = mapObj.dest;
            ["expand", "cwd", "flatten", "rename", "ext"].forEach(function(prop) {
              delete result2[prop];
            });
            return result2;
          });
        }
        var result = Object.assign({}, obj2);
        result.orig = Object.assign({}, obj2);
        if ("src" in result) {
          Object.defineProperty(result, "src", {
            enumerable: true,
            get: function fn() {
              var src;
              if (!("result" in fn)) {
                src = obj2.src;
                src = Array.isArray(src) ? flatten(src) : [src];
                fn.result = file.expand(expandOptions, src);
              }
              return fn.result;
            }
          });
        }
        if ("dest" in result) {
          result.dest = obj2.dest;
        }
        return result;
      }).flatten().value();
      return files;
    };
  }
});

// node_modules/archiver-utils/index.js
var require_archiver_utils = __commonJS({
  "node_modules/archiver-utils/index.js"(exports, module2) {
    var fs = require_graceful_fs();
    var path = require("path");
    var nutil = require("util");
    var lazystream = require_lazystream();
    var normalizePath = require_normalize_path();
    var defaults = require_lodash();
    var Stream = require("stream").Stream;
    var PassThrough = require_readable2().PassThrough;
    var utils = module2.exports = {};
    utils.file = require_file();
    utils.collectStream = function(source, callback) {
      var collection = [];
      var size = 0;
      source.on("error", callback);
      source.on("data", function(chunk) {
        collection.push(chunk);
        size += chunk.length;
      });
      source.on("end", function() {
        var buf = new Buffer(size);
        var offset = 0;
        collection.forEach(function(data) {
          data.copy(buf, offset);
          offset += data.length;
        });
        callback(null, buf);
      });
    };
    utils.dateify = function(dateish) {
      dateish = dateish || /* @__PURE__ */ new Date();
      if (dateish instanceof Date) {
        dateish = dateish;
      } else if (typeof dateish === "string") {
        dateish = new Date(dateish);
      } else {
        dateish = /* @__PURE__ */ new Date();
      }
      return dateish;
    };
    utils.defaults = function(object, source, guard) {
      var args = arguments;
      args[0] = args[0] || {};
      return defaults(...args);
    };
    utils.isStream = function(source) {
      return source instanceof Stream;
    };
    utils.lazyReadStream = function(filepath) {
      return new lazystream.Readable(function() {
        return fs.createReadStream(filepath);
      });
    };
    utils.normalizeInputSource = function(source) {
      if (source === null) {
        return new Buffer(0);
      } else if (typeof source === "string") {
        return new Buffer(source);
      } else if (utils.isStream(source) && !source._readableState) {
        var normalized = new PassThrough();
        source.pipe(normalized);
        return normalized;
      }
      return source;
    };
    utils.sanitizePath = function(filepath) {
      return normalizePath(filepath, false).replace(/^\w+:/, "").replace(/^(\.\.\/|\/)+/, "");
    };
    utils.trailingSlashIt = function(str2) {
      return str2.slice(-1) !== "/" ? str2 + "/" : str2;
    };
    utils.unixifyPath = function(filepath) {
      return normalizePath(filepath, false).replace(/^\w+:/, "");
    };
    utils.walkdir = function(dirpath, base, callback) {
      var results = [];
      if (typeof base === "function") {
        callback = base;
        base = dirpath;
      }
      fs.readdir(dirpath, function(err, list) {
        var i = 0;
        var file;
        var filepath;
        if (err) {
          return callback(err);
        }
        (function next() {
          file = list[i++];
          if (!file) {
            return callback(null, results);
          }
          filepath = path.join(dirpath, file);
          fs.stat(filepath, function(err2, stats) {
            results.push({
              path: filepath,
              relative: path.relative(base, filepath).replace(/\\/g, "/"),
              stats
            });
            if (stats && stats.isDirectory()) {
              utils.walkdir(filepath, base, function(err3, res2) {
                res2.forEach(function(dirEntry) {
                  results.push(dirEntry);
                });
                next();
              });
            } else {
              next();
            }
          });
        })();
      });
    };
  }
});

// node_modules/archiver/lib/error.js
var require_error2 = __commonJS({
  "node_modules/archiver/lib/error.js"(exports, module2) {
    var util = require("util");
    var ERROR_CODES = {
      "ABORTED": "archive was aborted",
      "DIRECTORYDIRPATHREQUIRED": "diretory dirpath argument must be a non-empty string value",
      "DIRECTORYFUNCTIONINVALIDDATA": "invalid data returned by directory custom data function",
      "ENTRYNAMEREQUIRED": "entry name must be a non-empty string value",
      "FILEFILEPATHREQUIRED": "file filepath argument must be a non-empty string value",
      "FINALIZING": "archive already finalizing",
      "QUEUECLOSED": "queue closed",
      "NOENDMETHOD": "no suitable finalize/end method defined by module",
      "DIRECTORYNOTSUPPORTED": "support for directory entries not defined by module",
      "FORMATSET": "archive format already set",
      "INPUTSTEAMBUFFERREQUIRED": "input source must be valid Stream or Buffer instance",
      "MODULESET": "module already set",
      "SYMLINKNOTSUPPORTED": "support for symlink entries not defined by module",
      "SYMLINKFILEPATHREQUIRED": "symlink filepath argument must be a non-empty string value",
      "SYMLINKTARGETREQUIRED": "symlink target argument must be a non-empty string value",
      "ENTRYNOTSUPPORTED": "entry not supported"
    };
    function ArchiverError(code, data) {
      Error.captureStackTrace(this, this.constructor);
      this.message = ERROR_CODES[code] || code;
      this.code = code;
      this.data = data;
    }
    util.inherits(ArchiverError, Error);
    exports = module2.exports = ArchiverError;
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream3 = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module2) {
    module2.exports = require("stream");
  }
});

// node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module2) {
    "use strict";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj2, key, value) {
      key = _toPropertyKey(key);
      if (key in obj2) {
        Object.defineProperty(obj2, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj2[key] = value;
      }
      return obj2;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res2 = prim.call(input, hint || "default");
        if (typeof res2 !== "object")
          return res2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var _require = require("buffer");
    var Buffer2 = _require.Buffer;
    var _require2 = require("util");
    var inspect = _require2.inspect;
    var custom = inspect && inspect.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer2.prototype.copy.call(src, target, offset);
    }
    module2.exports = /* @__PURE__ */ function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0)
            this.tail.next = entry;
          else
            this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0)
            this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0)
            return;
          var ret = this.head.data;
          if (this.length === 1)
            this.head = this.tail = null;
          else
            this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear2() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join(s) {
          if (this.length === 0)
            return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next)
            ret += s + p.data;
          return ret;
        }
      }, {
        key: "concat",
        value: function concat(n) {
          if (this.length === 0)
            return Buffer2.alloc(0);
          var ret = Buffer2.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
        // Consumes a specified amount of bytes or characters from the buffered data.
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
        // Consumes a specified amount of characters from the buffered data.
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str2 = p.data;
            var nb = n > str2.length ? str2.length : n;
            if (nb === str2.length)
              ret += str2;
            else
              ret += str2.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str2.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str2.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Consumes a specified amount of bytes from the buffered data.
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer2.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Make sure the linked list only shows the minimal necessary information.
      }, {
        key: custom,
        value: function value(_2, options) {
          return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
            // Only inspect one level.
            depth: 0,
            // It should not recurse.
            customInspect: false
          }));
        }
      }]);
      return BufferList;
    }();
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy3 = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module2) {
    "use strict";
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            process.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            process.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          process.nextTick(emitCloseNT, _this);
          cb(err2);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose)
        return;
      if (self2._readableState && !self2._readableState.emitClose)
        return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    function errorOrDestroy(stream, err) {
      var rState = stream._readableState;
      var wState = stream._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy)
        stream.destroy(err);
      else
        stream.emit("error", err);
    }
    module2.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// node_modules/readable-stream/errors.js
var require_errors = __commonJS({
  "node_modules/readable-stream/errors.js"(exports, module2) {
    "use strict";
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      class NodeError extends Base {
        constructor(arg1, arg2, arg3) {
          super(getMessage(arg1, arg2, arg3));
        }
      }
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        const len = expected.length;
        expected = expected.map((i) => String(i));
        if (len > 2) {
          return `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` + expected[len - 1];
        } else if (len === 2) {
          return `one of ${thing} ${expected[0]} or ${expected[1]}`;
        } else {
          return `of ${thing} ${expected[0]}`;
        }
      } else {
        return `of ${thing} ${String(expected)}`;
      }
    }
    function startsWith(str2, search, pos) {
      return str2.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str2, search, this_len) {
      if (this_len === void 0 || this_len > str2.length) {
        this_len = str2.length;
      }
      return str2.substring(this_len - search.length, this_len) === search;
    }
    function includes(str2, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str2.length) {
        return false;
      } else {
        return str2.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      let determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      let msg;
      if (endsWith(name, " argument")) {
        msg = `The ${name} ${determiner} ${oneOf(expected, "type")}`;
      } else {
        const type = includes(name, ".") ? "property" : "argument";
        msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, "type")}`;
      }
      msg += `. Received type ${typeof actual}`;
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
      return "The " + name + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name) {
      return "Cannot call " + name + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
      return "Unknown encoding: " + arg;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module2.exports.codes = codes;
  }
});

// node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/state.js"(exports, module2) {
    "use strict";
    var ERR_INVALID_OPT_VALUE = require_errors().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module2.exports = {
      getHighWaterMark
    };
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable3 = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports, module2) {
    "use strict";
    module2.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex;
    Writable.WritableState = WritableState;
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream3();
    var Buffer2 = require("buffer").Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy3();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits()(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex3();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_2) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function value(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex3();
      var isDuplex = this instanceof Duplex;
      if (!isDuplex && !realHasInstance.call(Writable, this))
        return new Writable(options);
      this._writableState = new WritableState(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd(stream, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream, er);
      process.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ending)
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed)
        state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        process.nextTick(cb, er);
        process.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function")
        throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state) || stream.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          process.nextTick(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending)
        endWritable(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          errorOrDestroy(stream, err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          process.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
          if (state.autoDestroy) {
            var rState = stream._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex3 = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports, module2) {
    "use strict";
    var objectKeys = Object.keys || function(obj2) {
      var keys2 = [];
      for (var key in obj2)
        keys2.push(key);
      return keys2;
    };
    module2.exports = Duplex;
    var Readable = require_stream_readable3();
    var Writable = require_stream_writable3();
    require_inherits()(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method])
          Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false)
          this.readable = false;
        if (options.writable === false)
          this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend);
        }
      }
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend() {
      if (this._writableState.ended)
        return;
      process.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer3 = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder3 = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer3().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed)
        return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0)
        return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module2) {
    "use strict";
    var ERR_STREAM_PREMATURE_CLOSE = require_errors().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop() {
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function eos(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once(callback || noop);
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream.writable)
          onfinish();
      };
      var writableEnded = stream._writableState && stream._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable)
          callback.call(stream);
      };
      var readableEnded = stream._readableState && stream._readableState.endEmitted;
      var onend = function onend2() {
        readable = false;
        readableEnded = true;
        if (!writable)
          callback.call(stream);
      };
      var onerror = function onerror2(err) {
        callback.call(stream, err);
      };
      var onclose = function onclose2() {
        var err;
        if (readable && !readableEnded) {
          if (!stream._readableState || !stream._readableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
        if (writable && !writableEnded) {
          if (!stream._writableState || !stream._writableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
      };
      var onrequest = function onrequest2() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !stream._writableState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    }
    module2.exports = eos;
  }
});

// node_modules/readable-stream/lib/internal/streams/async_iterator.js
var require_async_iterator = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports, module2) {
    "use strict";
    var _Object$setPrototypeO;
    function _defineProperty(obj2, key, value) {
      key = _toPropertyKey(key);
      if (key in obj2) {
        Object.defineProperty(obj2, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj2[key] = value;
      }
      return obj2;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res2 = prim.call(input, hint || "default");
        if (typeof res2 !== "object")
          return res2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var finished = require_end_of_stream();
    var kLastResolve = Symbol("lastResolve");
    var kLastReject = Symbol("lastReject");
    var kError = Symbol("error");
    var kEnded = Symbol("ended");
    var kLastPromise = Symbol("lastPromise");
    var kHandlePromise = Symbol("handlePromise");
    var kStream = Symbol("stream");
    function createIterResult(value, done) {
      return {
        value,
        done
      };
    }
    function readAndResolve(iter) {
      var resolve = iter[kLastResolve];
      if (resolve !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      process.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve, reject) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve, reject);
        }, reject);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve, reject) {
            process.nextTick(function() {
              if (_this[kError]) {
                reject(_this[kError]);
              } else {
                resolve(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve, reject) {
        _this2[kStream].destroy(null, function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
      var _Object$create;
      var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
        value: stream,
        writable: true
      }), _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kError, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kEnded, {
        value: stream._readableState.endEmitted,
        writable: true
      }), _defineProperty(_Object$create, kHandlePromise, {
        value: function value(resolve, reject) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve;
            iterator[kLastReject] = reject;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream, function(err) {
        if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject = iterator[kLastReject];
          if (reject !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject(err);
          }
          iterator[kError] = err;
          return;
        }
        var resolve = iterator[kLastResolve];
        if (resolve !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module2.exports = createReadableStreamAsyncIterator;
  }
});

// node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/from.js"(exports, module2) {
    "use strict";
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self2, args);
          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj2, key, value) {
      key = _toPropertyKey(key);
      if (key in obj2) {
        Object.defineProperty(obj2, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj2[key] = value;
      }
      return obj2;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null)
        return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res2 = prim.call(input, hint || "default");
        if (typeof res2 !== "object")
          return res2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var ERR_INVALID_ARG_TYPE = require_errors().codes.ERR_INVALID_ARG_TYPE;
    function from(Readable, iterable, opts) {
      var iterator;
      if (iterable && typeof iterable.next === "function") {
        iterator = iterable;
      } else if (iterable && iterable[Symbol.asyncIterator])
        iterator = iterable[Symbol.asyncIterator]();
      else if (iterable && iterable[Symbol.iterator])
        iterator = iterable[Symbol.iterator]();
      else
        throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
      var readable = new Readable(_objectSpread({
        objectMode: true
      }, opts));
      var reading = false;
      readable._read = function() {
        if (!reading) {
          reading = true;
          next();
        }
      };
      function next() {
        return _next2.apply(this, arguments);
      }
      function _next2() {
        _next2 = _asyncToGenerator(function* () {
          try {
            var _yield$iterator$next = yield iterator.next(), value = _yield$iterator$next.value, done = _yield$iterator$next.done;
            if (done) {
              readable.push(null);
            } else if (readable.push(yield value)) {
              next();
            } else {
              reading = false;
            }
          } catch (err) {
            readable.destroy(err);
          }
        });
        return _next2.apply(this, arguments);
      }
      return readable;
    }
    module2.exports = from;
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable3 = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports, module2) {
    "use strict";
    module2.exports = Readable;
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream3();
    var Buffer2 = require("buffer").Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj2) {
      return Buffer2.isBuffer(obj2) || obj2 instanceof OurUint8Array;
    }
    var debugUtil = require("util");
    var debug;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function debug2() {
      };
    }
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy3();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder;
    var createReadableStreamAsyncIterator;
    var from;
    require_inherits()(Readable, Stream);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex3();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder3().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex3();
      if (!(this instanceof Readable))
        return new Readable(options);
      var isDuplex = this instanceof Duplex;
      this._readableState = new ReadableState(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      debug("readableAddChunk", chunk);
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid(state, chunk);
        if (er) {
          errorOrDestroy(stream, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore(stream, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder3().StringDecoder;
      var decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "")
        this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      debug("onEofChunk");
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        process.nextTick(emitReadable_, stream);
      }
    }
    function emitReadable_(stream) {
      var state = stream._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          errorOrDestroy(dest, er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++)
          dests[i].emit("unpipe", this, {
            hasUnpiped: false
          });
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res2 = Stream.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            process.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res2;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.removeListener = function(ev, fn) {
      var res2 = Stream.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process.nextTick(updateReadableListening, this);
      }
      return res2;
    };
    Readable.prototype.removeAllListeners = function(ev) {
      var res2 = Stream.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process.nextTick(updateReadableListening, this);
      }
      return res2;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null)
        ;
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable.prototype, "readableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable.prototype, "readableFlowing", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable._fromList = fromList;
    Object.defineProperty(Readable.prototype, "readableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList(n, state) {
      if (state.length === 0)
        return null;
      var ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.first();
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
        if (state.autoDestroy) {
          var wState = stream._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable.from = function(iterable, opts) {
        if (from === void 0) {
          from = require_from();
        }
        return from(Readable, iterable, opts);
      };
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform3 = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports, module2) {
    "use strict";
    module2.exports = Transform;
    var _require$codes = require_errors().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex = require_stream_duplex3();
    require_inherits()(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
      });
    };
    function done(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream._transformState.transforming)
        throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough3 = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform = require_stream_transform3();
    require_inherits()(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module2) {
    "use strict";
    var eos;
    function once(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop(err) {
      if (err)
        throw err;
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function destroyer(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      if (eos === void 0)
        eos = require_end_of_stream();
      eos(stream, {
        readable: reading,
        writable: writing
      }, function(err) {
        if (err)
          return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed)
          return;
        if (destroyed)
          return;
        destroyed = true;
        if (isRequest(stream))
          return stream.abort();
        if (typeof stream.destroy === "function")
          return stream.destroy();
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from, to) {
      return from.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length)
        return noop;
      if (typeof streams[streams.length - 1] !== "function")
        return noop;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0]))
        streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error)
            error = err;
          if (err)
            destroys.forEach(call);
          if (reading)
            return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module2.exports = pipeline;
  }
});

// node_modules/readable-stream/readable.js
var require_readable3 = __commonJS({
  "node_modules/readable-stream/readable.js"(exports, module2) {
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream.Readable;
      Object.assign(module2.exports, Stream);
      module2.exports.Stream = Stream;
    } else {
      exports = module2.exports = require_stream_readable3();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable3();
      exports.Duplex = require_stream_duplex3();
      exports.Transform = require_stream_transform3();
      exports.PassThrough = require_stream_passthrough3();
      exports.finished = require_end_of_stream();
      exports.pipeline = require_pipeline();
    }
  }
});

// node_modules/archiver/lib/core.js
var require_core = __commonJS({
  "node_modules/archiver/lib/core.js"(exports, module2) {
    var fs = require("fs");
    var glob = require_readdir_glob();
    var async = require_async();
    var path = require("path");
    var util = require_archiver_utils();
    var inherits = require("util").inherits;
    var ArchiverError = require_error2();
    var Transform = require_readable3().Transform;
    var win32 = process.platform === "win32";
    var Archiver = function(format, options) {
      if (!(this instanceof Archiver)) {
        return new Archiver(format, options);
      }
      if (typeof format !== "string") {
        options = format;
        format = "zip";
      }
      options = this.options = util.defaults(options, {
        highWaterMark: 1024 * 1024,
        statConcurrency: 4
      });
      Transform.call(this, options);
      this._format = false;
      this._module = false;
      this._pending = 0;
      this._pointer = 0;
      this._entriesCount = 0;
      this._entriesProcessedCount = 0;
      this._fsEntriesTotalBytes = 0;
      this._fsEntriesProcessedBytes = 0;
      this._queue = async.queue(this._onQueueTask.bind(this), 1);
      this._queue.drain(this._onQueueDrain.bind(this));
      this._statQueue = async.queue(this._onStatQueueTask.bind(this), options.statConcurrency);
      this._statQueue.drain(this._onQueueDrain.bind(this));
      this._state = {
        aborted: false,
        finalize: false,
        finalizing: false,
        finalized: false,
        modulePiped: false
      };
      this._streams = [];
    };
    inherits(Archiver, Transform);
    Archiver.prototype._abort = function() {
      this._state.aborted = true;
      this._queue.kill();
      this._statQueue.kill();
      if (this._queue.idle()) {
        this._shutdown();
      }
    };
    Archiver.prototype._append = function(filepath, data) {
      data = data || {};
      var task = {
        source: null,
        filepath
      };
      if (!data.name) {
        data.name = filepath;
      }
      data.sourcePath = filepath;
      task.data = data;
      this._entriesCount++;
      if (data.stats && data.stats instanceof fs.Stats) {
        task = this._updateQueueTaskWithStats(task, data.stats);
        if (task) {
          if (data.stats.size) {
            this._fsEntriesTotalBytes += data.stats.size;
          }
          this._queue.push(task);
        }
      } else {
        this._statQueue.push(task);
      }
    };
    Archiver.prototype._finalize = function() {
      if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        return;
      }
      this._state.finalizing = true;
      this._moduleFinalize();
      this._state.finalizing = false;
      this._state.finalized = true;
    };
    Archiver.prototype._maybeFinalize = function() {
      if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        return false;
      }
      if (this._state.finalize && this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
        this._finalize();
        return true;
      }
      return false;
    };
    Archiver.prototype._moduleAppend = function(source, data, callback) {
      if (this._state.aborted) {
        callback();
        return;
      }
      this._module.append(source, data, function(err) {
        this._task = null;
        if (this._state.aborted) {
          this._shutdown();
          return;
        }
        if (err) {
          this.emit("error", err);
          setImmediate(callback);
          return;
        }
        this.emit("entry", data);
        this._entriesProcessedCount++;
        if (data.stats && data.stats.size) {
          this._fsEntriesProcessedBytes += data.stats.size;
        }
        this.emit("progress", {
          entries: {
            total: this._entriesCount,
            processed: this._entriesProcessedCount
          },
          fs: {
            totalBytes: this._fsEntriesTotalBytes,
            processedBytes: this._fsEntriesProcessedBytes
          }
        });
        setImmediate(callback);
      }.bind(this));
    };
    Archiver.prototype._moduleFinalize = function() {
      if (typeof this._module.finalize === "function") {
        this._module.finalize();
      } else if (typeof this._module.end === "function") {
        this._module.end();
      } else {
        this.emit("error", new ArchiverError("NOENDMETHOD"));
      }
    };
    Archiver.prototype._modulePipe = function() {
      this._module.on("error", this._onModuleError.bind(this));
      this._module.pipe(this);
      this._state.modulePiped = true;
    };
    Archiver.prototype._moduleSupports = function(key) {
      if (!this._module.supports || !this._module.supports[key]) {
        return false;
      }
      return this._module.supports[key];
    };
    Archiver.prototype._moduleUnpipe = function() {
      this._module.unpipe(this);
      this._state.modulePiped = false;
    };
    Archiver.prototype._normalizeEntryData = function(data, stats) {
      data = util.defaults(data, {
        type: "file",
        name: null,
        date: null,
        mode: null,
        prefix: null,
        sourcePath: null,
        stats: false
      });
      if (stats && data.stats === false) {
        data.stats = stats;
      }
      var isDir = data.type === "directory";
      if (data.name) {
        if (typeof data.prefix === "string" && "" !== data.prefix) {
          data.name = data.prefix + "/" + data.name;
          data.prefix = null;
        }
        data.name = util.sanitizePath(data.name);
        if (data.type !== "symlink" && data.name.slice(-1) === "/") {
          isDir = true;
          data.type = "directory";
        } else if (isDir) {
          data.name += "/";
        }
      }
      if (typeof data.mode === "number") {
        if (win32) {
          data.mode &= 511;
        } else {
          data.mode &= 4095;
        }
      } else if (data.stats && data.mode === null) {
        if (win32) {
          data.mode = data.stats.mode & 511;
        } else {
          data.mode = data.stats.mode & 4095;
        }
        if (win32 && isDir) {
          data.mode = 493;
        }
      } else if (data.mode === null) {
        data.mode = isDir ? 493 : 420;
      }
      if (data.stats && data.date === null) {
        data.date = data.stats.mtime;
      } else {
        data.date = util.dateify(data.date);
      }
      return data;
    };
    Archiver.prototype._onModuleError = function(err) {
      this.emit("error", err);
    };
    Archiver.prototype._onQueueDrain = function() {
      if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        return;
      }
      if (this._state.finalize && this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
        this._finalize();
      }
    };
    Archiver.prototype._onQueueTask = function(task, callback) {
      var fullCallback = () => {
        if (task.data.callback) {
          task.data.callback();
        }
        callback();
      };
      if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        fullCallback();
        return;
      }
      this._task = task;
      this._moduleAppend(task.source, task.data, fullCallback);
    };
    Archiver.prototype._onStatQueueTask = function(task, callback) {
      if (this._state.finalizing || this._state.finalized || this._state.aborted) {
        callback();
        return;
      }
      fs.lstat(task.filepath, function(err, stats) {
        if (this._state.aborted) {
          setImmediate(callback);
          return;
        }
        if (err) {
          this._entriesCount--;
          this.emit("warning", err);
          setImmediate(callback);
          return;
        }
        task = this._updateQueueTaskWithStats(task, stats);
        if (task) {
          if (stats.size) {
            this._fsEntriesTotalBytes += stats.size;
          }
          this._queue.push(task);
        }
        setImmediate(callback);
      }.bind(this));
    };
    Archiver.prototype._shutdown = function() {
      this._moduleUnpipe();
      this.end();
    };
    Archiver.prototype._transform = function(chunk, encoding, callback) {
      if (chunk) {
        this._pointer += chunk.length;
      }
      callback(null, chunk);
    };
    Archiver.prototype._updateQueueTaskWithStats = function(task, stats) {
      if (stats.isFile()) {
        task.data.type = "file";
        task.data.sourceType = "stream";
        task.source = util.lazyReadStream(task.filepath);
      } else if (stats.isDirectory() && this._moduleSupports("directory")) {
        task.data.name = util.trailingSlashIt(task.data.name);
        task.data.type = "directory";
        task.data.sourcePath = util.trailingSlashIt(task.filepath);
        task.data.sourceType = "buffer";
        task.source = Buffer.concat([]);
      } else if (stats.isSymbolicLink() && this._moduleSupports("symlink")) {
        var linkPath = fs.readlinkSync(task.filepath);
        var dirName = path.dirname(task.filepath);
        task.data.type = "symlink";
        task.data.linkname = path.relative(dirName, path.resolve(dirName, linkPath));
        task.data.sourceType = "buffer";
        task.source = Buffer.concat([]);
      } else {
        if (stats.isDirectory()) {
          this.emit("warning", new ArchiverError("DIRECTORYNOTSUPPORTED", task.data));
        } else if (stats.isSymbolicLink()) {
          this.emit("warning", new ArchiverError("SYMLINKNOTSUPPORTED", task.data));
        } else {
          this.emit("warning", new ArchiverError("ENTRYNOTSUPPORTED", task.data));
        }
        return null;
      }
      task.data = this._normalizeEntryData(task.data, stats);
      return task;
    };
    Archiver.prototype.abort = function() {
      if (this._state.aborted || this._state.finalized) {
        return this;
      }
      this._abort();
      return this;
    };
    Archiver.prototype.append = function(source, data) {
      if (this._state.finalize || this._state.aborted) {
        this.emit("error", new ArchiverError("QUEUECLOSED"));
        return this;
      }
      data = this._normalizeEntryData(data);
      if (typeof data.name !== "string" || data.name.length === 0) {
        this.emit("error", new ArchiverError("ENTRYNAMEREQUIRED"));
        return this;
      }
      if (data.type === "directory" && !this._moduleSupports("directory")) {
        this.emit("error", new ArchiverError("DIRECTORYNOTSUPPORTED", { name: data.name }));
        return this;
      }
      source = util.normalizeInputSource(source);
      if (Buffer.isBuffer(source)) {
        data.sourceType = "buffer";
      } else if (util.isStream(source)) {
        data.sourceType = "stream";
      } else {
        this.emit("error", new ArchiverError("INPUTSTEAMBUFFERREQUIRED", { name: data.name }));
        return this;
      }
      this._entriesCount++;
      this._queue.push({
        data,
        source
      });
      return this;
    };
    Archiver.prototype.directory = function(dirpath, destpath, data) {
      if (this._state.finalize || this._state.aborted) {
        this.emit("error", new ArchiverError("QUEUECLOSED"));
        return this;
      }
      if (typeof dirpath !== "string" || dirpath.length === 0) {
        this.emit("error", new ArchiverError("DIRECTORYDIRPATHREQUIRED"));
        return this;
      }
      this._pending++;
      if (destpath === false) {
        destpath = "";
      } else if (typeof destpath !== "string") {
        destpath = dirpath;
      }
      var dataFunction = false;
      if (typeof data === "function") {
        dataFunction = data;
        data = {};
      } else if (typeof data !== "object") {
        data = {};
      }
      var globOptions = {
        stat: true,
        dot: true
      };
      function onGlobEnd() {
        this._pending--;
        this._maybeFinalize();
      }
      function onGlobError(err) {
        this.emit("error", err);
      }
      function onGlobMatch(match) {
        globber.pause();
        var ignoreMatch = false;
        var entryData = Object.assign({}, data);
        entryData.name = match.relative;
        entryData.prefix = destpath;
        entryData.stats = match.stat;
        entryData.callback = globber.resume.bind(globber);
        try {
          if (dataFunction) {
            entryData = dataFunction(entryData);
            if (entryData === false) {
              ignoreMatch = true;
            } else if (typeof entryData !== "object") {
              throw new ArchiverError("DIRECTORYFUNCTIONINVALIDDATA", { dirpath });
            }
          }
        } catch (e) {
          this.emit("error", e);
          return;
        }
        if (ignoreMatch) {
          globber.resume();
          return;
        }
        this._append(match.absolute, entryData);
      }
      var globber = glob(dirpath, globOptions);
      globber.on("error", onGlobError.bind(this));
      globber.on("match", onGlobMatch.bind(this));
      globber.on("end", onGlobEnd.bind(this));
      return this;
    };
    Archiver.prototype.file = function(filepath, data) {
      if (this._state.finalize || this._state.aborted) {
        this.emit("error", new ArchiverError("QUEUECLOSED"));
        return this;
      }
      if (typeof filepath !== "string" || filepath.length === 0) {
        this.emit("error", new ArchiverError("FILEFILEPATHREQUIRED"));
        return this;
      }
      this._append(filepath, data);
      return this;
    };
    Archiver.prototype.glob = function(pattern, options, data) {
      this._pending++;
      options = util.defaults(options, {
        stat: true,
        pattern
      });
      function onGlobEnd() {
        this._pending--;
        this._maybeFinalize();
      }
      function onGlobError(err) {
        this.emit("error", err);
      }
      function onGlobMatch(match) {
        globber.pause();
        var entryData = Object.assign({}, data);
        entryData.callback = globber.resume.bind(globber);
        entryData.stats = match.stat;
        entryData.name = match.relative;
        this._append(match.absolute, entryData);
      }
      var globber = glob(options.cwd || ".", options);
      globber.on("error", onGlobError.bind(this));
      globber.on("match", onGlobMatch.bind(this));
      globber.on("end", onGlobEnd.bind(this));
      return this;
    };
    Archiver.prototype.finalize = function() {
      if (this._state.aborted) {
        var abortedError = new ArchiverError("ABORTED");
        this.emit("error", abortedError);
        return Promise.reject(abortedError);
      }
      if (this._state.finalize) {
        var finalizingError = new ArchiverError("FINALIZING");
        this.emit("error", finalizingError);
        return Promise.reject(finalizingError);
      }
      this._state.finalize = true;
      if (this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
        this._finalize();
      }
      var self2 = this;
      return new Promise(function(resolve, reject) {
        var errored;
        self2._module.on("end", function() {
          if (!errored) {
            resolve();
          }
        });
        self2._module.on("error", function(err) {
          errored = true;
          reject(err);
        });
      });
    };
    Archiver.prototype.setFormat = function(format) {
      if (this._format) {
        this.emit("error", new ArchiverError("FORMATSET"));
        return this;
      }
      this._format = format;
      return this;
    };
    Archiver.prototype.setModule = function(module3) {
      if (this._state.aborted) {
        this.emit("error", new ArchiverError("ABORTED"));
        return this;
      }
      if (this._state.module) {
        this.emit("error", new ArchiverError("MODULESET"));
        return this;
      }
      this._module = module3;
      this._modulePipe();
      return this;
    };
    Archiver.prototype.symlink = function(filepath, target, mode) {
      if (this._state.finalize || this._state.aborted) {
        this.emit("error", new ArchiverError("QUEUECLOSED"));
        return this;
      }
      if (typeof filepath !== "string" || filepath.length === 0) {
        this.emit("error", new ArchiverError("SYMLINKFILEPATHREQUIRED"));
        return this;
      }
      if (typeof target !== "string" || target.length === 0) {
        this.emit("error", new ArchiverError("SYMLINKTARGETREQUIRED", { filepath }));
        return this;
      }
      if (!this._moduleSupports("symlink")) {
        this.emit("error", new ArchiverError("SYMLINKNOTSUPPORTED", { filepath }));
        return this;
      }
      var data = {};
      data.type = "symlink";
      data.name = filepath.replace(/\\/g, "/");
      data.linkname = target.replace(/\\/g, "/");
      data.sourceType = "buffer";
      if (typeof mode === "number") {
        data.mode = mode;
      }
      this._entriesCount++;
      this._queue.push({
        data,
        source: Buffer.concat([])
      });
      return this;
    };
    Archiver.prototype.pointer = function() {
      return this._pointer;
    };
    Archiver.prototype.use = function(plugin) {
      this._streams.push(plugin);
      return this;
    };
    module2.exports = Archiver;
  }
});

// node_modules/compress-commons/lib/archivers/archive-entry.js
var require_archive_entry = __commonJS({
  "node_modules/compress-commons/lib/archivers/archive-entry.js"(exports, module2) {
    var ArchiveEntry = module2.exports = function() {
    };
    ArchiveEntry.prototype.getName = function() {
    };
    ArchiveEntry.prototype.getSize = function() {
    };
    ArchiveEntry.prototype.getLastModifiedDate = function() {
    };
    ArchiveEntry.prototype.isDirectory = function() {
    };
  }
});

// node_modules/compress-commons/lib/archivers/zip/util.js
var require_util2 = __commonJS({
  "node_modules/compress-commons/lib/archivers/zip/util.js"(exports, module2) {
    var util = module2.exports = {};
    util.dateToDos = function(d, forceLocalTime) {
      forceLocalTime = forceLocalTime || false;
      var year = forceLocalTime ? d.getFullYear() : d.getUTCFullYear();
      if (year < 1980) {
        return 2162688;
      } else if (year >= 2044) {
        return 2141175677;
      }
      var val2 = {
        year,
        month: forceLocalTime ? d.getMonth() : d.getUTCMonth(),
        date: forceLocalTime ? d.getDate() : d.getUTCDate(),
        hours: forceLocalTime ? d.getHours() : d.getUTCHours(),
        minutes: forceLocalTime ? d.getMinutes() : d.getUTCMinutes(),
        seconds: forceLocalTime ? d.getSeconds() : d.getUTCSeconds()
      };
      return val2.year - 1980 << 25 | val2.month + 1 << 21 | val2.date << 16 | val2.hours << 11 | val2.minutes << 5 | val2.seconds / 2;
    };
    util.dosToDate = function(dos) {
      return new Date((dos >> 25 & 127) + 1980, (dos >> 21 & 15) - 1, dos >> 16 & 31, dos >> 11 & 31, dos >> 5 & 63, (dos & 31) << 1);
    };
    util.fromDosTime = function(buf) {
      return util.dosToDate(buf.readUInt32LE(0));
    };
    util.getEightBytes = function(v) {
      var buf = Buffer.alloc(8);
      buf.writeUInt32LE(v % 4294967296, 0);
      buf.writeUInt32LE(v / 4294967296 | 0, 4);
      return buf;
    };
    util.getShortBytes = function(v) {
      var buf = Buffer.alloc(2);
      buf.writeUInt16LE((v & 65535) >>> 0, 0);
      return buf;
    };
    util.getShortBytesValue = function(buf, offset) {
      return buf.readUInt16LE(offset);
    };
    util.getLongBytes = function(v) {
      var buf = Buffer.alloc(4);
      buf.writeUInt32LE((v & 4294967295) >>> 0, 0);
      return buf;
    };
    util.getLongBytesValue = function(buf, offset) {
      return buf.readUInt32LE(offset);
    };
    util.toDosTime = function(d) {
      return util.getLongBytes(util.dateToDos(d));
    };
  }
});

// node_modules/compress-commons/lib/archivers/zip/general-purpose-bit.js
var require_general_purpose_bit = __commonJS({
  "node_modules/compress-commons/lib/archivers/zip/general-purpose-bit.js"(exports, module2) {
    var zipUtil = require_util2();
    var DATA_DESCRIPTOR_FLAG = 1 << 3;
    var ENCRYPTION_FLAG = 1 << 0;
    var NUMBER_OF_SHANNON_FANO_TREES_FLAG = 1 << 2;
    var SLIDING_DICTIONARY_SIZE_FLAG = 1 << 1;
    var STRONG_ENCRYPTION_FLAG = 1 << 6;
    var UFT8_NAMES_FLAG = 1 << 11;
    var GeneralPurposeBit = module2.exports = function() {
      if (!(this instanceof GeneralPurposeBit)) {
        return new GeneralPurposeBit();
      }
      this.descriptor = false;
      this.encryption = false;
      this.utf8 = false;
      this.numberOfShannonFanoTrees = 0;
      this.strongEncryption = false;
      this.slidingDictionarySize = 0;
      return this;
    };
    GeneralPurposeBit.prototype.encode = function() {
      return zipUtil.getShortBytes(
        (this.descriptor ? DATA_DESCRIPTOR_FLAG : 0) | (this.utf8 ? UFT8_NAMES_FLAG : 0) | (this.encryption ? ENCRYPTION_FLAG : 0) | (this.strongEncryption ? STRONG_ENCRYPTION_FLAG : 0)
      );
    };
    GeneralPurposeBit.prototype.parse = function(buf, offset) {
      var flag = zipUtil.getShortBytesValue(buf, offset);
      var gbp = new GeneralPurposeBit();
      gbp.useDataDescriptor((flag & DATA_DESCRIPTOR_FLAG) !== 0);
      gbp.useUTF8ForNames((flag & UFT8_NAMES_FLAG) !== 0);
      gbp.useStrongEncryption((flag & STRONG_ENCRYPTION_FLAG) !== 0);
      gbp.useEncryption((flag & ENCRYPTION_FLAG) !== 0);
      gbp.setSlidingDictionarySize((flag & SLIDING_DICTIONARY_SIZE_FLAG) !== 0 ? 8192 : 4096);
      gbp.setNumberOfShannonFanoTrees((flag & NUMBER_OF_SHANNON_FANO_TREES_FLAG) !== 0 ? 3 : 2);
      return gbp;
    };
    GeneralPurposeBit.prototype.setNumberOfShannonFanoTrees = function(n) {
      this.numberOfShannonFanoTrees = n;
    };
    GeneralPurposeBit.prototype.getNumberOfShannonFanoTrees = function() {
      return this.numberOfShannonFanoTrees;
    };
    GeneralPurposeBit.prototype.setSlidingDictionarySize = function(n) {
      this.slidingDictionarySize = n;
    };
    GeneralPurposeBit.prototype.getSlidingDictionarySize = function() {
      return this.slidingDictionarySize;
    };
    GeneralPurposeBit.prototype.useDataDescriptor = function(b) {
      this.descriptor = b;
    };
    GeneralPurposeBit.prototype.usesDataDescriptor = function() {
      return this.descriptor;
    };
    GeneralPurposeBit.prototype.useEncryption = function(b) {
      this.encryption = b;
    };
    GeneralPurposeBit.prototype.usesEncryption = function() {
      return this.encryption;
    };
    GeneralPurposeBit.prototype.useStrongEncryption = function(b) {
      this.strongEncryption = b;
    };
    GeneralPurposeBit.prototype.usesStrongEncryption = function() {
      return this.strongEncryption;
    };
    GeneralPurposeBit.prototype.useUTF8ForNames = function(b) {
      this.utf8 = b;
    };
    GeneralPurposeBit.prototype.usesUTF8ForNames = function() {
      return this.utf8;
    };
  }
});

// node_modules/compress-commons/lib/archivers/zip/unix-stat.js
var require_unix_stat = __commonJS({
  "node_modules/compress-commons/lib/archivers/zip/unix-stat.js"(exports, module2) {
    module2.exports = {
      /**
       * Bits used for permissions (and sticky bit)
       */
      PERM_MASK: 4095,
      // 07777
      /**
       * Bits used to indicate the filesystem object type.
       */
      FILE_TYPE_FLAG: 61440,
      // 0170000
      /**
       * Indicates symbolic links.
       */
      LINK_FLAG: 40960,
      // 0120000
      /**
       * Indicates plain files.
       */
      FILE_FLAG: 32768,
      // 0100000
      /**
       * Indicates directories.
       */
      DIR_FLAG: 16384,
      // 040000
      // ----------------------------------------------------------
      // somewhat arbitrary choices that are quite common for shared
      // installations
      // -----------------------------------------------------------
      /**
       * Default permissions for symbolic links.
       */
      DEFAULT_LINK_PERM: 511,
      // 0777
      /**
       * Default permissions for directories.
       */
      DEFAULT_DIR_PERM: 493,
      // 0755
      /**
       * Default permissions for plain files.
       */
      DEFAULT_FILE_PERM: 420
      // 0644
    };
  }
});

// node_modules/compress-commons/lib/archivers/zip/constants.js
var require_constants = __commonJS({
  "node_modules/compress-commons/lib/archivers/zip/constants.js"(exports, module2) {
    module2.exports = {
      WORD: 4,
      DWORD: 8,
      EMPTY: Buffer.alloc(0),
      SHORT: 2,
      SHORT_MASK: 65535,
      SHORT_SHIFT: 16,
      SHORT_ZERO: Buffer.from(Array(2)),
      LONG: 4,
      LONG_ZERO: Buffer.from(Array(4)),
      MIN_VERSION_INITIAL: 10,
      MIN_VERSION_DATA_DESCRIPTOR: 20,
      MIN_VERSION_ZIP64: 45,
      VERSION_MADEBY: 45,
      METHOD_STORED: 0,
      METHOD_DEFLATED: 8,
      PLATFORM_UNIX: 3,
      PLATFORM_FAT: 0,
      SIG_LFH: 67324752,
      SIG_DD: 134695760,
      SIG_CFH: 33639248,
      SIG_EOCD: 101010256,
      SIG_ZIP64_EOCD: 101075792,
      SIG_ZIP64_EOCD_LOC: 117853008,
      ZIP64_MAGIC_SHORT: 65535,
      ZIP64_MAGIC: 4294967295,
      ZIP64_EXTRA_ID: 1,
      ZLIB_NO_COMPRESSION: 0,
      ZLIB_BEST_SPEED: 1,
      ZLIB_BEST_COMPRESSION: 9,
      ZLIB_DEFAULT_COMPRESSION: -1,
      MODE_MASK: 4095,
      DEFAULT_FILE_MODE: 33188,
      // 010644 = -rw-r--r-- = S_IFREG | S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH
      DEFAULT_DIR_MODE: 16877,
      // 040755 = drwxr-xr-x = S_IFDIR | S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH
      EXT_FILE_ATTR_DIR: 1106051088,
      // 010173200020 = drwxr-xr-x = (((S_IFDIR | 0755) << 16) | S_DOS_D)
      EXT_FILE_ATTR_FILE: 2175008800,
      // 020151000040 = -rw-r--r-- = (((S_IFREG | 0644) << 16) | S_DOS_A) >>> 0
      // Unix file types
      S_IFMT: 61440,
      // 0170000 type of file mask
      S_IFIFO: 4096,
      // 010000 named pipe (fifo)
      S_IFCHR: 8192,
      // 020000 character special
      S_IFDIR: 16384,
      // 040000 directory
      S_IFBLK: 24576,
      // 060000 block special
      S_IFREG: 32768,
      // 0100000 regular
      S_IFLNK: 40960,
      // 0120000 symbolic link
      S_IFSOCK: 49152,
      // 0140000 socket
      // DOS file type flags
      S_DOS_A: 32,
      // 040 Archive
      S_DOS_D: 16,
      // 020 Directory
      S_DOS_V: 8,
      // 010 Volume
      S_DOS_S: 4,
      // 04 System
      S_DOS_H: 2,
      // 02 Hidden
      S_DOS_R: 1
      // 01 Read Only
    };
  }
});

// node_modules/compress-commons/lib/archivers/zip/zip-archive-entry.js
var require_zip_archive_entry = __commonJS({
  "node_modules/compress-commons/lib/archivers/zip/zip-archive-entry.js"(exports, module2) {
    var inherits = require("util").inherits;
    var normalizePath = require_normalize_path();
    var ArchiveEntry = require_archive_entry();
    var GeneralPurposeBit = require_general_purpose_bit();
    var UnixStat = require_unix_stat();
    var constants = require_constants();
    var zipUtil = require_util2();
    var ZipArchiveEntry = module2.exports = function(name) {
      if (!(this instanceof ZipArchiveEntry)) {
        return new ZipArchiveEntry(name);
      }
      ArchiveEntry.call(this);
      this.platform = constants.PLATFORM_FAT;
      this.method = -1;
      this.name = null;
      this.size = 0;
      this.csize = 0;
      this.gpb = new GeneralPurposeBit();
      this.crc = 0;
      this.time = -1;
      this.minver = constants.MIN_VERSION_INITIAL;
      this.mode = -1;
      this.extra = null;
      this.exattr = 0;
      this.inattr = 0;
      this.comment = null;
      if (name) {
        this.setName(name);
      }
    };
    inherits(ZipArchiveEntry, ArchiveEntry);
    ZipArchiveEntry.prototype.getCentralDirectoryExtra = function() {
      return this.getExtra();
    };
    ZipArchiveEntry.prototype.getComment = function() {
      return this.comment !== null ? this.comment : "";
    };
    ZipArchiveEntry.prototype.getCompressedSize = function() {
      return this.csize;
    };
    ZipArchiveEntry.prototype.getCrc = function() {
      return this.crc;
    };
    ZipArchiveEntry.prototype.getExternalAttributes = function() {
      return this.exattr;
    };
    ZipArchiveEntry.prototype.getExtra = function() {
      return this.extra !== null ? this.extra : constants.EMPTY;
    };
    ZipArchiveEntry.prototype.getGeneralPurposeBit = function() {
      return this.gpb;
    };
    ZipArchiveEntry.prototype.getInternalAttributes = function() {
      return this.inattr;
    };
    ZipArchiveEntry.prototype.getLastModifiedDate = function() {
      return this.getTime();
    };
    ZipArchiveEntry.prototype.getLocalFileDataExtra = function() {
      return this.getExtra();
    };
    ZipArchiveEntry.prototype.getMethod = function() {
      return this.method;
    };
    ZipArchiveEntry.prototype.getName = function() {
      return this.name;
    };
    ZipArchiveEntry.prototype.getPlatform = function() {
      return this.platform;
    };
    ZipArchiveEntry.prototype.getSize = function() {
      return this.size;
    };
    ZipArchiveEntry.prototype.getTime = function() {
      return this.time !== -1 ? zipUtil.dosToDate(this.time) : -1;
    };
    ZipArchiveEntry.prototype.getTimeDos = function() {
      return this.time !== -1 ? this.time : 0;
    };
    ZipArchiveEntry.prototype.getUnixMode = function() {
      return this.platform !== constants.PLATFORM_UNIX ? 0 : this.getExternalAttributes() >> constants.SHORT_SHIFT & constants.SHORT_MASK;
    };
    ZipArchiveEntry.prototype.getVersionNeededToExtract = function() {
      return this.minver;
    };
    ZipArchiveEntry.prototype.setComment = function(comment) {
      if (Buffer.byteLength(comment) !== comment.length) {
        this.getGeneralPurposeBit().useUTF8ForNames(true);
      }
      this.comment = comment;
    };
    ZipArchiveEntry.prototype.setCompressedSize = function(size) {
      if (size < 0) {
        throw new Error("invalid entry compressed size");
      }
      this.csize = size;
    };
    ZipArchiveEntry.prototype.setCrc = function(crc) {
      if (crc < 0) {
        throw new Error("invalid entry crc32");
      }
      this.crc = crc;
    };
    ZipArchiveEntry.prototype.setExternalAttributes = function(attr) {
      this.exattr = attr >>> 0;
    };
    ZipArchiveEntry.prototype.setExtra = function(extra) {
      this.extra = extra;
    };
    ZipArchiveEntry.prototype.setGeneralPurposeBit = function(gpb) {
      if (!(gpb instanceof GeneralPurposeBit)) {
        throw new Error("invalid entry GeneralPurposeBit");
      }
      this.gpb = gpb;
    };
    ZipArchiveEntry.prototype.setInternalAttributes = function(attr) {
      this.inattr = attr;
    };
    ZipArchiveEntry.prototype.setMethod = function(method) {
      if (method < 0) {
        throw new Error("invalid entry compression method");
      }
      this.method = method;
    };
    ZipArchiveEntry.prototype.setName = function(name, prependSlash = false) {
      name = normalizePath(name, false).replace(/^\w+:/, "").replace(/^(\.\.\/|\/)+/, "");
      if (prependSlash) {
        name = `/${name}`;
      }
      if (Buffer.byteLength(name) !== name.length) {
        this.getGeneralPurposeBit().useUTF8ForNames(true);
      }
      this.name = name;
    };
    ZipArchiveEntry.prototype.setPlatform = function(platform) {
      this.platform = platform;
    };
    ZipArchiveEntry.prototype.setSize = function(size) {
      if (size < 0) {
        throw new Error("invalid entry size");
      }
      this.size = size;
    };
    ZipArchiveEntry.prototype.setTime = function(time, forceLocalTime) {
      if (!(time instanceof Date)) {
        throw new Error("invalid entry time");
      }
      this.time = zipUtil.dateToDos(time, forceLocalTime);
    };
    ZipArchiveEntry.prototype.setUnixMode = function(mode) {
      mode |= this.isDirectory() ? constants.S_IFDIR : constants.S_IFREG;
      var extattr = 0;
      extattr |= mode << constants.SHORT_SHIFT | (this.isDirectory() ? constants.S_DOS_D : constants.S_DOS_A);
      this.setExternalAttributes(extattr);
      this.mode = mode & constants.MODE_MASK;
      this.platform = constants.PLATFORM_UNIX;
    };
    ZipArchiveEntry.prototype.setVersionNeededToExtract = function(minver) {
      this.minver = minver;
    };
    ZipArchiveEntry.prototype.isDirectory = function() {
      return this.getName().slice(-1) === "/";
    };
    ZipArchiveEntry.prototype.isUnixSymlink = function() {
      return (this.getUnixMode() & UnixStat.FILE_TYPE_FLAG) === UnixStat.LINK_FLAG;
    };
    ZipArchiveEntry.prototype.isZip64 = function() {
      return this.csize > constants.ZIP64_MAGIC || this.size > constants.ZIP64_MAGIC;
    };
  }
});

// node_modules/compress-commons/lib/util/index.js
var require_util3 = __commonJS({
  "node_modules/compress-commons/lib/util/index.js"(exports, module2) {
    var Stream = require("stream").Stream;
    var PassThrough = require_readable3().PassThrough;
    var util = module2.exports = {};
    util.isStream = function(source) {
      return source instanceof Stream;
    };
    util.normalizeInputSource = function(source) {
      if (source === null) {
        return Buffer.alloc(0);
      } else if (typeof source === "string") {
        return Buffer.from(source);
      } else if (util.isStream(source) && !source._readableState) {
        var normalized = new PassThrough();
        source.pipe(normalized);
        return normalized;
      }
      return source;
    };
  }
});

// node_modules/compress-commons/lib/archivers/archive-output-stream.js
var require_archive_output_stream = __commonJS({
  "node_modules/compress-commons/lib/archivers/archive-output-stream.js"(exports, module2) {
    var inherits = require("util").inherits;
    var Transform = require_readable3().Transform;
    var ArchiveEntry = require_archive_entry();
    var util = require_util3();
    var ArchiveOutputStream = module2.exports = function(options) {
      if (!(this instanceof ArchiveOutputStream)) {
        return new ArchiveOutputStream(options);
      }
      Transform.call(this, options);
      this.offset = 0;
      this._archive = {
        finish: false,
        finished: false,
        processing: false
      };
    };
    inherits(ArchiveOutputStream, Transform);
    ArchiveOutputStream.prototype._appendBuffer = function(zae, source, callback) {
    };
    ArchiveOutputStream.prototype._appendStream = function(zae, source, callback) {
    };
    ArchiveOutputStream.prototype._emitErrorCallback = function(err) {
      if (err) {
        this.emit("error", err);
      }
    };
    ArchiveOutputStream.prototype._finish = function(ae) {
    };
    ArchiveOutputStream.prototype._normalizeEntry = function(ae) {
    };
    ArchiveOutputStream.prototype._transform = function(chunk, encoding, callback) {
      callback(null, chunk);
    };
    ArchiveOutputStream.prototype.entry = function(ae, source, callback) {
      source = source || null;
      if (typeof callback !== "function") {
        callback = this._emitErrorCallback.bind(this);
      }
      if (!(ae instanceof ArchiveEntry)) {
        callback(new Error("not a valid instance of ArchiveEntry"));
        return;
      }
      if (this._archive.finish || this._archive.finished) {
        callback(new Error("unacceptable entry after finish"));
        return;
      }
      if (this._archive.processing) {
        callback(new Error("already processing an entry"));
        return;
      }
      this._archive.processing = true;
      this._normalizeEntry(ae);
      this._entry = ae;
      source = util.normalizeInputSource(source);
      if (Buffer.isBuffer(source)) {
        this._appendBuffer(ae, source, callback);
      } else if (util.isStream(source)) {
        this._appendStream(ae, source, callback);
      } else {
        this._archive.processing = false;
        callback(new Error("input source must be valid Stream or Buffer instance"));
        return;
      }
      return this;
    };
    ArchiveOutputStream.prototype.finish = function() {
      if (this._archive.processing) {
        this._archive.finish = true;
        return;
      }
      this._finish();
    };
    ArchiveOutputStream.prototype.getBytesWritten = function() {
      return this.offset;
    };
    ArchiveOutputStream.prototype.write = function(chunk, cb) {
      if (chunk) {
        this.offset += chunk.length;
      }
      return Transform.prototype.write.call(this, chunk, cb);
    };
  }
});

// node_modules/buffer-crc32/index.js
var require_buffer_crc32 = __commonJS({
  "node_modules/buffer-crc32/index.js"(exports, module2) {
    var Buffer2 = require("buffer").Buffer;
    var CRC_TABLE = [
      0,
      1996959894,
      3993919788,
      2567524794,
      124634137,
      1886057615,
      3915621685,
      2657392035,
      249268274,
      2044508324,
      3772115230,
      2547177864,
      162941995,
      2125561021,
      3887607047,
      2428444049,
      498536548,
      1789927666,
      4089016648,
      2227061214,
      450548861,
      1843258603,
      4107580753,
      2211677639,
      325883990,
      1684777152,
      4251122042,
      2321926636,
      335633487,
      1661365465,
      4195302755,
      2366115317,
      997073096,
      1281953886,
      3579855332,
      2724688242,
      1006888145,
      1258607687,
      3524101629,
      2768942443,
      901097722,
      1119000684,
      3686517206,
      2898065728,
      853044451,
      1172266101,
      3705015759,
      2882616665,
      651767980,
      1373503546,
      3369554304,
      3218104598,
      565507253,
      1454621731,
      3485111705,
      3099436303,
      671266974,
      1594198024,
      3322730930,
      2970347812,
      795835527,
      1483230225,
      3244367275,
      3060149565,
      1994146192,
      31158534,
      2563907772,
      4023717930,
      1907459465,
      112637215,
      2680153253,
      3904427059,
      2013776290,
      251722036,
      2517215374,
      3775830040,
      2137656763,
      141376813,
      2439277719,
      3865271297,
      1802195444,
      476864866,
      2238001368,
      4066508878,
      1812370925,
      453092731,
      2181625025,
      4111451223,
      1706088902,
      314042704,
      2344532202,
      4240017532,
      1658658271,
      366619977,
      2362670323,
      4224994405,
      1303535960,
      984961486,
      2747007092,
      3569037538,
      1256170817,
      1037604311,
      2765210733,
      3554079995,
      1131014506,
      879679996,
      2909243462,
      3663771856,
      1141124467,
      855842277,
      2852801631,
      3708648649,
      1342533948,
      654459306,
      3188396048,
      3373015174,
      1466479909,
      544179635,
      3110523913,
      3462522015,
      1591671054,
      702138776,
      2966460450,
      3352799412,
      1504918807,
      783551873,
      3082640443,
      3233442989,
      3988292384,
      2596254646,
      62317068,
      1957810842,
      3939845945,
      2647816111,
      81470997,
      1943803523,
      3814918930,
      2489596804,
      225274430,
      2053790376,
      3826175755,
      2466906013,
      167816743,
      2097651377,
      4027552580,
      2265490386,
      503444072,
      1762050814,
      4150417245,
      2154129355,
      426522225,
      1852507879,
      4275313526,
      2312317920,
      282753626,
      1742555852,
      4189708143,
      2394877945,
      397917763,
      1622183637,
      3604390888,
      2714866558,
      953729732,
      1340076626,
      3518719985,
      2797360999,
      1068828381,
      1219638859,
      3624741850,
      2936675148,
      906185462,
      1090812512,
      3747672003,
      2825379669,
      829329135,
      1181335161,
      3412177804,
      3160834842,
      628085408,
      1382605366,
      3423369109,
      3138078467,
      570562233,
      1426400815,
      3317316542,
      2998733608,
      733239954,
      1555261956,
      3268935591,
      3050360625,
      752459403,
      1541320221,
      2607071920,
      3965973030,
      1969922972,
      40735498,
      2617837225,
      3943577151,
      1913087877,
      83908371,
      2512341634,
      3803740692,
      2075208622,
      213261112,
      2463272603,
      3855990285,
      2094854071,
      198958881,
      2262029012,
      4057260610,
      1759359992,
      534414190,
      2176718541,
      4139329115,
      1873836001,
      414664567,
      2282248934,
      4279200368,
      1711684554,
      285281116,
      2405801727,
      4167216745,
      1634467795,
      376229701,
      2685067896,
      3608007406,
      1308918612,
      956543938,
      2808555105,
      3495958263,
      1231636301,
      1047427035,
      2932959818,
      3654703836,
      1088359270,
      936918e3,
      2847714899,
      3736837829,
      1202900863,
      817233897,
      3183342108,
      3401237130,
      1404277552,
      615818150,
      3134207493,
      3453421203,
      1423857449,
      601450431,
      3009837614,
      3294710456,
      1567103746,
      711928724,
      3020668471,
      3272380065,
      1510334235,
      755167117
    ];
    if (typeof Int32Array !== "undefined") {
      CRC_TABLE = new Int32Array(CRC_TABLE);
    }
    function ensureBuffer(input) {
      if (Buffer2.isBuffer(input)) {
        return input;
      }
      var hasNewBufferAPI = typeof Buffer2.alloc === "function" && typeof Buffer2.from === "function";
      if (typeof input === "number") {
        return hasNewBufferAPI ? Buffer2.alloc(input) : new Buffer2(input);
      } else if (typeof input === "string") {
        return hasNewBufferAPI ? Buffer2.from(input) : new Buffer2(input);
      } else {
        throw new Error("input must be buffer, number, or string, received " + typeof input);
      }
    }
    function bufferizeInt(num2) {
      var tmp = ensureBuffer(4);
      tmp.writeInt32BE(num2, 0);
      return tmp;
    }
    function _crc32(buf, previous) {
      buf = ensureBuffer(buf);
      if (Buffer2.isBuffer(previous)) {
        previous = previous.readUInt32BE(0);
      }
      var crc = ~~previous ^ -1;
      for (var n = 0; n < buf.length; n++) {
        crc = CRC_TABLE[(crc ^ buf[n]) & 255] ^ crc >>> 8;
      }
      return crc ^ -1;
    }
    function crc32() {
      return bufferizeInt(_crc32.apply(null, arguments));
    }
    crc32.signed = function() {
      return _crc32.apply(null, arguments);
    };
    crc32.unsigned = function() {
      return _crc32.apply(null, arguments) >>> 0;
    };
    module2.exports = crc32;
  }
});

// node_modules/crc-32/crc32.js
var require_crc32 = __commonJS({
  "node_modules/crc-32/crc32.js"(exports) {
    var CRC32;
    (function(factory) {
      if (typeof DO_NOT_EXPORT_CRC === "undefined") {
        if ("object" === typeof exports) {
          factory(exports);
        } else if ("function" === typeof define && define.amd) {
          define(function() {
            var module3 = {};
            factory(module3);
            return module3;
          });
        } else {
          factory(CRC32 = {});
        }
      } else {
        factory(CRC32 = {});
      }
    })(function(CRC322) {
      CRC322.version = "1.2.2";
      function signed_crc_table() {
        var c = 0, table = new Array(256);
        for (var n = 0; n != 256; ++n) {
          c = n;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
          table[n] = c;
        }
        return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
      }
      var T0 = signed_crc_table();
      function slice_by_16_tables(T) {
        var c = 0, v = 0, n = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
        for (n = 0; n != 256; ++n)
          table[n] = T[n];
        for (n = 0; n != 256; ++n) {
          v = T[n];
          for (c = 256 + n; c < 4096; c += 256)
            v = table[c] = v >>> 8 ^ T[v & 255];
        }
        var out = [];
        for (n = 1; n != 16; ++n)
          out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
        return out;
      }
      var TT = slice_by_16_tables(T0);
      var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
      var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
      var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
      function crc32_bstr(bstr, seed) {
        var C = seed ^ -1;
        for (var i = 0, L = bstr.length; i < L; )
          C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
        return ~C;
      }
      function crc32_buf(B, seed) {
        var C = seed ^ -1, L = B.length - 15, i = 0;
        for (; i < L; )
          C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
        L += 15;
        while (i < L)
          C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
        return ~C;
      }
      function crc32_str(str2, seed) {
        var C = seed ^ -1;
        for (var i = 0, L = str2.length, c = 0, d = 0; i < L; ) {
          c = str2.charCodeAt(i++);
          if (c < 128) {
            C = C >>> 8 ^ T0[(C ^ c) & 255];
          } else if (c < 2048) {
            C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
          } else if (c >= 55296 && c < 57344) {
            c = (c & 1023) + 64;
            d = str2.charCodeAt(i++) & 1023;
            C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
          } else {
            C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
            C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
          }
        }
        return ~C;
      }
      CRC322.table = T0;
      CRC322.bstr = crc32_bstr;
      CRC322.buf = crc32_buf;
      CRC322.str = crc32_str;
    });
  }
});

// node_modules/crc32-stream/lib/crc32-stream.js
var require_crc32_stream = __commonJS({
  "node_modules/crc32-stream/lib/crc32-stream.js"(exports, module2) {
    "use strict";
    var { Transform } = require_readable3();
    var crc32 = require_crc32();
    var CRC32Stream = class extends Transform {
      constructor(options) {
        super(options);
        this.checksum = Buffer.allocUnsafe(4);
        this.checksum.writeInt32BE(0, 0);
        this.rawSize = 0;
      }
      _transform(chunk, encoding, callback) {
        if (chunk) {
          this.checksum = crc32.buf(chunk, this.checksum) >>> 0;
          this.rawSize += chunk.length;
        }
        callback(null, chunk);
      }
      digest(encoding) {
        const checksum = Buffer.allocUnsafe(4);
        checksum.writeUInt32BE(this.checksum >>> 0, 0);
        return encoding ? checksum.toString(encoding) : checksum;
      }
      hex() {
        return this.digest("hex").toUpperCase();
      }
      size() {
        return this.rawSize;
      }
    };
    module2.exports = CRC32Stream;
  }
});

// node_modules/crc32-stream/lib/deflate-crc32-stream.js
var require_deflate_crc32_stream = __commonJS({
  "node_modules/crc32-stream/lib/deflate-crc32-stream.js"(exports, module2) {
    "use strict";
    var { DeflateRaw } = require("zlib");
    var crc32 = require_crc32();
    var DeflateCRC32Stream = class extends DeflateRaw {
      constructor(options) {
        super(options);
        this.checksum = Buffer.allocUnsafe(4);
        this.checksum.writeInt32BE(0, 0);
        this.rawSize = 0;
        this.compressedSize = 0;
      }
      push(chunk, encoding) {
        if (chunk) {
          this.compressedSize += chunk.length;
        }
        return super.push(chunk, encoding);
      }
      _transform(chunk, encoding, callback) {
        if (chunk) {
          this.checksum = crc32.buf(chunk, this.checksum) >>> 0;
          this.rawSize += chunk.length;
        }
        super._transform(chunk, encoding, callback);
      }
      digest(encoding) {
        const checksum = Buffer.allocUnsafe(4);
        checksum.writeUInt32BE(this.checksum >>> 0, 0);
        return encoding ? checksum.toString(encoding) : checksum;
      }
      hex() {
        return this.digest("hex").toUpperCase();
      }
      size(compressed = false) {
        if (compressed) {
          return this.compressedSize;
        } else {
          return this.rawSize;
        }
      }
    };
    module2.exports = DeflateCRC32Stream;
  }
});

// node_modules/crc32-stream/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/crc32-stream/lib/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      CRC32Stream: require_crc32_stream(),
      DeflateCRC32Stream: require_deflate_crc32_stream()
    };
  }
});

// node_modules/compress-commons/lib/archivers/zip/zip-archive-output-stream.js
var require_zip_archive_output_stream = __commonJS({
  "node_modules/compress-commons/lib/archivers/zip/zip-archive-output-stream.js"(exports, module2) {
    var inherits = require("util").inherits;
    var crc32 = require_buffer_crc32();
    var { CRC32Stream } = require_lib2();
    var { DeflateCRC32Stream } = require_lib2();
    var ArchiveOutputStream = require_archive_output_stream();
    var ZipArchiveEntry = require_zip_archive_entry();
    var GeneralPurposeBit = require_general_purpose_bit();
    var constants = require_constants();
    var util = require_util3();
    var zipUtil = require_util2();
    var ZipArchiveOutputStream = module2.exports = function(options) {
      if (!(this instanceof ZipArchiveOutputStream)) {
        return new ZipArchiveOutputStream(options);
      }
      options = this.options = this._defaults(options);
      ArchiveOutputStream.call(this, options);
      this._entry = null;
      this._entries = [];
      this._archive = {
        centralLength: 0,
        centralOffset: 0,
        comment: "",
        finish: false,
        finished: false,
        processing: false,
        forceZip64: options.forceZip64,
        forceLocalTime: options.forceLocalTime
      };
    };
    inherits(ZipArchiveOutputStream, ArchiveOutputStream);
    ZipArchiveOutputStream.prototype._afterAppend = function(ae) {
      this._entries.push(ae);
      if (ae.getGeneralPurposeBit().usesDataDescriptor()) {
        this._writeDataDescriptor(ae);
      }
      this._archive.processing = false;
      this._entry = null;
      if (this._archive.finish && !this._archive.finished) {
        this._finish();
      }
    };
    ZipArchiveOutputStream.prototype._appendBuffer = function(ae, source, callback) {
      if (source.length === 0) {
        ae.setMethod(constants.METHOD_STORED);
      }
      var method = ae.getMethod();
      if (method === constants.METHOD_STORED) {
        ae.setSize(source.length);
        ae.setCompressedSize(source.length);
        ae.setCrc(crc32.unsigned(source));
      }
      this._writeLocalFileHeader(ae);
      if (method === constants.METHOD_STORED) {
        this.write(source);
        this._afterAppend(ae);
        callback(null, ae);
        return;
      } else if (method === constants.METHOD_DEFLATED) {
        this._smartStream(ae, callback).end(source);
        return;
      } else {
        callback(new Error("compression method " + method + " not implemented"));
        return;
      }
    };
    ZipArchiveOutputStream.prototype._appendStream = function(ae, source, callback) {
      ae.getGeneralPurposeBit().useDataDescriptor(true);
      ae.setVersionNeededToExtract(constants.MIN_VERSION_DATA_DESCRIPTOR);
      this._writeLocalFileHeader(ae);
      var smart = this._smartStream(ae, callback);
      source.once("error", function(err) {
        smart.emit("error", err);
        smart.end();
      });
      source.pipe(smart);
    };
    ZipArchiveOutputStream.prototype._defaults = function(o) {
      if (typeof o !== "object") {
        o = {};
      }
      if (typeof o.zlib !== "object") {
        o.zlib = {};
      }
      if (typeof o.zlib.level !== "number") {
        o.zlib.level = constants.ZLIB_BEST_SPEED;
      }
      o.forceZip64 = !!o.forceZip64;
      o.forceLocalTime = !!o.forceLocalTime;
      return o;
    };
    ZipArchiveOutputStream.prototype._finish = function() {
      this._archive.centralOffset = this.offset;
      this._entries.forEach(function(ae) {
        this._writeCentralFileHeader(ae);
      }.bind(this));
      this._archive.centralLength = this.offset - this._archive.centralOffset;
      if (this.isZip64()) {
        this._writeCentralDirectoryZip64();
      }
      this._writeCentralDirectoryEnd();
      this._archive.processing = false;
      this._archive.finish = true;
      this._archive.finished = true;
      this.end();
    };
    ZipArchiveOutputStream.prototype._normalizeEntry = function(ae) {
      if (ae.getMethod() === -1) {
        ae.setMethod(constants.METHOD_DEFLATED);
      }
      if (ae.getMethod() === constants.METHOD_DEFLATED) {
        ae.getGeneralPurposeBit().useDataDescriptor(true);
        ae.setVersionNeededToExtract(constants.MIN_VERSION_DATA_DESCRIPTOR);
      }
      if (ae.getTime() === -1) {
        ae.setTime(/* @__PURE__ */ new Date(), this._archive.forceLocalTime);
      }
      ae._offsets = {
        file: 0,
        data: 0,
        contents: 0
      };
    };
    ZipArchiveOutputStream.prototype._smartStream = function(ae, callback) {
      var deflate = ae.getMethod() === constants.METHOD_DEFLATED;
      var process3 = deflate ? new DeflateCRC32Stream(this.options.zlib) : new CRC32Stream();
      var error = null;
      function handleStuff() {
        var digest = process3.digest().readUInt32BE(0);
        ae.setCrc(digest);
        ae.setSize(process3.size());
        ae.setCompressedSize(process3.size(true));
        this._afterAppend(ae);
        callback(error, ae);
      }
      process3.once("end", handleStuff.bind(this));
      process3.once("error", function(err) {
        error = err;
      });
      process3.pipe(this, { end: false });
      return process3;
    };
    ZipArchiveOutputStream.prototype._writeCentralDirectoryEnd = function() {
      var records = this._entries.length;
      var size = this._archive.centralLength;
      var offset = this._archive.centralOffset;
      if (this.isZip64()) {
        records = constants.ZIP64_MAGIC_SHORT;
        size = constants.ZIP64_MAGIC;
        offset = constants.ZIP64_MAGIC;
      }
      this.write(zipUtil.getLongBytes(constants.SIG_EOCD));
      this.write(constants.SHORT_ZERO);
      this.write(constants.SHORT_ZERO);
      this.write(zipUtil.getShortBytes(records));
      this.write(zipUtil.getShortBytes(records));
      this.write(zipUtil.getLongBytes(size));
      this.write(zipUtil.getLongBytes(offset));
      var comment = this.getComment();
      var commentLength = Buffer.byteLength(comment);
      this.write(zipUtil.getShortBytes(commentLength));
      this.write(comment);
    };
    ZipArchiveOutputStream.prototype._writeCentralDirectoryZip64 = function() {
      this.write(zipUtil.getLongBytes(constants.SIG_ZIP64_EOCD));
      this.write(zipUtil.getEightBytes(44));
      this.write(zipUtil.getShortBytes(constants.MIN_VERSION_ZIP64));
      this.write(zipUtil.getShortBytes(constants.MIN_VERSION_ZIP64));
      this.write(constants.LONG_ZERO);
      this.write(constants.LONG_ZERO);
      this.write(zipUtil.getEightBytes(this._entries.length));
      this.write(zipUtil.getEightBytes(this._entries.length));
      this.write(zipUtil.getEightBytes(this._archive.centralLength));
      this.write(zipUtil.getEightBytes(this._archive.centralOffset));
      this.write(zipUtil.getLongBytes(constants.SIG_ZIP64_EOCD_LOC));
      this.write(constants.LONG_ZERO);
      this.write(zipUtil.getEightBytes(this._archive.centralOffset + this._archive.centralLength));
      this.write(zipUtil.getLongBytes(1));
    };
    ZipArchiveOutputStream.prototype._writeCentralFileHeader = function(ae) {
      var gpb = ae.getGeneralPurposeBit();
      var method = ae.getMethod();
      var offsets = ae._offsets;
      var size = ae.getSize();
      var compressedSize = ae.getCompressedSize();
      if (ae.isZip64() || offsets.file > constants.ZIP64_MAGIC) {
        size = constants.ZIP64_MAGIC;
        compressedSize = constants.ZIP64_MAGIC;
        ae.setVersionNeededToExtract(constants.MIN_VERSION_ZIP64);
        var extraBuf = Buffer.concat([
          zipUtil.getShortBytes(constants.ZIP64_EXTRA_ID),
          zipUtil.getShortBytes(24),
          zipUtil.getEightBytes(ae.getSize()),
          zipUtil.getEightBytes(ae.getCompressedSize()),
          zipUtil.getEightBytes(offsets.file)
        ], 28);
        ae.setExtra(extraBuf);
      }
      this.write(zipUtil.getLongBytes(constants.SIG_CFH));
      this.write(zipUtil.getShortBytes(ae.getPlatform() << 8 | constants.VERSION_MADEBY));
      this.write(zipUtil.getShortBytes(ae.getVersionNeededToExtract()));
      this.write(gpb.encode());
      this.write(zipUtil.getShortBytes(method));
      this.write(zipUtil.getLongBytes(ae.getTimeDos()));
      this.write(zipUtil.getLongBytes(ae.getCrc()));
      this.write(zipUtil.getLongBytes(compressedSize));
      this.write(zipUtil.getLongBytes(size));
      var name = ae.getName();
      var comment = ae.getComment();
      var extra = ae.getCentralDirectoryExtra();
      if (gpb.usesUTF8ForNames()) {
        name = Buffer.from(name);
        comment = Buffer.from(comment);
      }
      this.write(zipUtil.getShortBytes(name.length));
      this.write(zipUtil.getShortBytes(extra.length));
      this.write(zipUtil.getShortBytes(comment.length));
      this.write(constants.SHORT_ZERO);
      this.write(zipUtil.getShortBytes(ae.getInternalAttributes()));
      this.write(zipUtil.getLongBytes(ae.getExternalAttributes()));
      if (offsets.file > constants.ZIP64_MAGIC) {
        this.write(zipUtil.getLongBytes(constants.ZIP64_MAGIC));
      } else {
        this.write(zipUtil.getLongBytes(offsets.file));
      }
      this.write(name);
      this.write(extra);
      this.write(comment);
    };
    ZipArchiveOutputStream.prototype._writeDataDescriptor = function(ae) {
      this.write(zipUtil.getLongBytes(constants.SIG_DD));
      this.write(zipUtil.getLongBytes(ae.getCrc()));
      if (ae.isZip64()) {
        this.write(zipUtil.getEightBytes(ae.getCompressedSize()));
        this.write(zipUtil.getEightBytes(ae.getSize()));
      } else {
        this.write(zipUtil.getLongBytes(ae.getCompressedSize()));
        this.write(zipUtil.getLongBytes(ae.getSize()));
      }
    };
    ZipArchiveOutputStream.prototype._writeLocalFileHeader = function(ae) {
      var gpb = ae.getGeneralPurposeBit();
      var method = ae.getMethod();
      var name = ae.getName();
      var extra = ae.getLocalFileDataExtra();
      if (ae.isZip64()) {
        gpb.useDataDescriptor(true);
        ae.setVersionNeededToExtract(constants.MIN_VERSION_ZIP64);
      }
      if (gpb.usesUTF8ForNames()) {
        name = Buffer.from(name);
      }
      ae._offsets.file = this.offset;
      this.write(zipUtil.getLongBytes(constants.SIG_LFH));
      this.write(zipUtil.getShortBytes(ae.getVersionNeededToExtract()));
      this.write(gpb.encode());
      this.write(zipUtil.getShortBytes(method));
      this.write(zipUtil.getLongBytes(ae.getTimeDos()));
      ae._offsets.data = this.offset;
      if (gpb.usesDataDescriptor()) {
        this.write(constants.LONG_ZERO);
        this.write(constants.LONG_ZERO);
        this.write(constants.LONG_ZERO);
      } else {
        this.write(zipUtil.getLongBytes(ae.getCrc()));
        this.write(zipUtil.getLongBytes(ae.getCompressedSize()));
        this.write(zipUtil.getLongBytes(ae.getSize()));
      }
      this.write(zipUtil.getShortBytes(name.length));
      this.write(zipUtil.getShortBytes(extra.length));
      this.write(name);
      this.write(extra);
      ae._offsets.contents = this.offset;
    };
    ZipArchiveOutputStream.prototype.getComment = function(comment) {
      return this._archive.comment !== null ? this._archive.comment : "";
    };
    ZipArchiveOutputStream.prototype.isZip64 = function() {
      return this._archive.forceZip64 || this._entries.length > constants.ZIP64_MAGIC_SHORT || this._archive.centralLength > constants.ZIP64_MAGIC || this._archive.centralOffset > constants.ZIP64_MAGIC;
    };
    ZipArchiveOutputStream.prototype.setComment = function(comment) {
      this._archive.comment = comment;
    };
  }
});

// node_modules/compress-commons/lib/compress-commons.js
var require_compress_commons = __commonJS({
  "node_modules/compress-commons/lib/compress-commons.js"(exports, module2) {
    module2.exports = {
      ArchiveEntry: require_archive_entry(),
      ZipArchiveEntry: require_zip_archive_entry(),
      ArchiveOutputStream: require_archive_output_stream(),
      ZipArchiveOutputStream: require_zip_archive_output_stream()
    };
  }
});

// node_modules/zip-stream/node_modules/archiver-utils/file.js
var require_file2 = __commonJS({
  "node_modules/zip-stream/node_modules/archiver-utils/file.js"(exports, module2) {
    var fs = require_graceful_fs();
    var path = require("path");
    var flatten = require_lodash2();
    var difference = require_lodash3();
    var union = require_lodash4();
    var isPlainObject = require_lodash5();
    var glob = require_glob();
    var file = module2.exports = {};
    var pathSeparatorRe = /[\/\\]/g;
    var processPatterns = function(patterns, fn) {
      var result = [];
      flatten(patterns).forEach(function(pattern) {
        var exclusion = pattern.indexOf("!") === 0;
        if (exclusion) {
          pattern = pattern.slice(1);
        }
        var matches = fn(pattern);
        if (exclusion) {
          result = difference(result, matches);
        } else {
          result = union(result, matches);
        }
      });
      return result;
    };
    file.exists = function() {
      var filepath = path.join.apply(path, arguments);
      return fs.existsSync(filepath);
    };
    file.expand = function(...args) {
      var options = isPlainObject(args[0]) ? args.shift() : {};
      var patterns = Array.isArray(args[0]) ? args[0] : args;
      if (patterns.length === 0) {
        return [];
      }
      var matches = processPatterns(patterns, function(pattern) {
        return glob.sync(pattern, options);
      });
      if (options.filter) {
        matches = matches.filter(function(filepath) {
          filepath = path.join(options.cwd || "", filepath);
          try {
            if (typeof options.filter === "function") {
              return options.filter(filepath);
            } else {
              return fs.statSync(filepath)[options.filter]();
            }
          } catch (e) {
            return false;
          }
        });
      }
      return matches;
    };
    file.expandMapping = function(patterns, destBase, options) {
      options = Object.assign({
        rename: function(destBase2, destPath) {
          return path.join(destBase2 || "", destPath);
        }
      }, options);
      var files = [];
      var fileByDest = {};
      file.expand(options, patterns).forEach(function(src) {
        var destPath = src;
        if (options.flatten) {
          destPath = path.basename(destPath);
        }
        if (options.ext) {
          destPath = destPath.replace(/(\.[^\/]*)?$/, options.ext);
        }
        var dest = options.rename(destBase, destPath, options);
        if (options.cwd) {
          src = path.join(options.cwd, src);
        }
        dest = dest.replace(pathSeparatorRe, "/");
        src = src.replace(pathSeparatorRe, "/");
        if (fileByDest[dest]) {
          fileByDest[dest].src.push(src);
        } else {
          files.push({
            src: [src],
            dest
          });
          fileByDest[dest] = files[files.length - 1];
        }
      });
      return files;
    };
    file.normalizeFilesArray = function(data) {
      var files = [];
      data.forEach(function(obj2) {
        var prop;
        if ("src" in obj2 || "dest" in obj2) {
          files.push(obj2);
        }
      });
      if (files.length === 0) {
        return [];
      }
      files = _(files).chain().forEach(function(obj2) {
        if (!("src" in obj2) || !obj2.src) {
          return;
        }
        if (Array.isArray(obj2.src)) {
          obj2.src = flatten(obj2.src);
        } else {
          obj2.src = [obj2.src];
        }
      }).map(function(obj2) {
        var expandOptions = Object.assign({}, obj2);
        delete expandOptions.src;
        delete expandOptions.dest;
        if (obj2.expand) {
          return file.expandMapping(obj2.src, obj2.dest, expandOptions).map(function(mapObj) {
            var result2 = Object.assign({}, obj2);
            result2.orig = Object.assign({}, obj2);
            result2.src = mapObj.src;
            result2.dest = mapObj.dest;
            ["expand", "cwd", "flatten", "rename", "ext"].forEach(function(prop) {
              delete result2[prop];
            });
            return result2;
          });
        }
        var result = Object.assign({}, obj2);
        result.orig = Object.assign({}, obj2);
        if ("src" in result) {
          Object.defineProperty(result, "src", {
            enumerable: true,
            get: function fn() {
              var src;
              if (!("result" in fn)) {
                src = obj2.src;
                src = Array.isArray(src) ? flatten(src) : [src];
                fn.result = file.expand(expandOptions, src);
              }
              return fn.result;
            }
          });
        }
        if ("dest" in result) {
          result.dest = obj2.dest;
        }
        return result;
      }).flatten().value();
      return files;
    };
  }
});

// node_modules/zip-stream/node_modules/archiver-utils/index.js
var require_archiver_utils2 = __commonJS({
  "node_modules/zip-stream/node_modules/archiver-utils/index.js"(exports, module2) {
    var fs = require_graceful_fs();
    var path = require("path");
    var lazystream = require_lazystream();
    var normalizePath = require_normalize_path();
    var defaults = require_lodash();
    var Stream = require("stream").Stream;
    var PassThrough = require_readable3().PassThrough;
    var utils = module2.exports = {};
    utils.file = require_file2();
    utils.collectStream = function(source, callback) {
      var collection = [];
      var size = 0;
      source.on("error", callback);
      source.on("data", function(chunk) {
        collection.push(chunk);
        size += chunk.length;
      });
      source.on("end", function() {
        var buf = Buffer.alloc(size);
        var offset = 0;
        collection.forEach(function(data) {
          data.copy(buf, offset);
          offset += data.length;
        });
        callback(null, buf);
      });
    };
    utils.dateify = function(dateish) {
      dateish = dateish || /* @__PURE__ */ new Date();
      if (dateish instanceof Date) {
        dateish = dateish;
      } else if (typeof dateish === "string") {
        dateish = new Date(dateish);
      } else {
        dateish = /* @__PURE__ */ new Date();
      }
      return dateish;
    };
    utils.defaults = function(object, source, guard) {
      var args = arguments;
      args[0] = args[0] || {};
      return defaults(...args);
    };
    utils.isStream = function(source) {
      return source instanceof Stream;
    };
    utils.lazyReadStream = function(filepath) {
      return new lazystream.Readable(function() {
        return fs.createReadStream(filepath);
      });
    };
    utils.normalizeInputSource = function(source) {
      if (source === null) {
        return Buffer.alloc(0);
      } else if (typeof source === "string") {
        return Buffer.from(source);
      } else if (utils.isStream(source)) {
        return source.pipe(new PassThrough());
      }
      return source;
    };
    utils.sanitizePath = function(filepath) {
      return normalizePath(filepath, false).replace(/^\w+:/, "").replace(/^(\.\.\/|\/)+/, "");
    };
    utils.trailingSlashIt = function(str2) {
      return str2.slice(-1) !== "/" ? str2 + "/" : str2;
    };
    utils.unixifyPath = function(filepath) {
      return normalizePath(filepath, false).replace(/^\w+:/, "");
    };
    utils.walkdir = function(dirpath, base, callback) {
      var results = [];
      if (typeof base === "function") {
        callback = base;
        base = dirpath;
      }
      fs.readdir(dirpath, function(err, list) {
        var i = 0;
        var file;
        var filepath;
        if (err) {
          return callback(err);
        }
        (function next() {
          file = list[i++];
          if (!file) {
            return callback(null, results);
          }
          filepath = path.join(dirpath, file);
          fs.stat(filepath, function(err2, stats) {
            results.push({
              path: filepath,
              relative: path.relative(base, filepath).replace(/\\/g, "/"),
              stats
            });
            if (stats && stats.isDirectory()) {
              utils.walkdir(filepath, base, function(err3, res2) {
                res2.forEach(function(dirEntry) {
                  results.push(dirEntry);
                });
                next();
              });
            } else {
              next();
            }
          });
        })();
      });
    };
  }
});

// node_modules/zip-stream/index.js
var require_zip_stream = __commonJS({
  "node_modules/zip-stream/index.js"(exports, module2) {
    var inherits = require("util").inherits;
    var ZipArchiveOutputStream = require_compress_commons().ZipArchiveOutputStream;
    var ZipArchiveEntry = require_compress_commons().ZipArchiveEntry;
    var util = require_archiver_utils2();
    var ZipStream = module2.exports = function(options) {
      if (!(this instanceof ZipStream)) {
        return new ZipStream(options);
      }
      options = this.options = options || {};
      options.zlib = options.zlib || {};
      ZipArchiveOutputStream.call(this, options);
      if (typeof options.level === "number" && options.level >= 0) {
        options.zlib.level = options.level;
        delete options.level;
      }
      if (!options.forceZip64 && typeof options.zlib.level === "number" && options.zlib.level === 0) {
        options.store = true;
      }
      options.namePrependSlash = options.namePrependSlash || false;
      if (options.comment && options.comment.length > 0) {
        this.setComment(options.comment);
      }
    };
    inherits(ZipStream, ZipArchiveOutputStream);
    ZipStream.prototype._normalizeFileData = function(data) {
      data = util.defaults(data, {
        type: "file",
        name: null,
        namePrependSlash: this.options.namePrependSlash,
        linkname: null,
        date: null,
        mode: null,
        store: this.options.store,
        comment: ""
      });
      var isDir = data.type === "directory";
      var isSymlink = data.type === "symlink";
      if (data.name) {
        data.name = util.sanitizePath(data.name);
        if (!isSymlink && data.name.slice(-1) === "/") {
          isDir = true;
          data.type = "directory";
        } else if (isDir) {
          data.name += "/";
        }
      }
      if (isDir || isSymlink) {
        data.store = true;
      }
      data.date = util.dateify(data.date);
      return data;
    };
    ZipStream.prototype.entry = function(source, data, callback) {
      if (typeof callback !== "function") {
        callback = this._emitErrorCallback.bind(this);
      }
      data = this._normalizeFileData(data);
      if (data.type !== "file" && data.type !== "directory" && data.type !== "symlink") {
        callback(new Error(data.type + " entries not currently supported"));
        return;
      }
      if (typeof data.name !== "string" || data.name.length === 0) {
        callback(new Error("entry name must be a non-empty string value"));
        return;
      }
      if (data.type === "symlink" && typeof data.linkname !== "string") {
        callback(new Error("entry linkname must be a non-empty string value when type equals symlink"));
        return;
      }
      var entry = new ZipArchiveEntry(data.name);
      entry.setTime(data.date, this.options.forceLocalTime);
      if (data.namePrependSlash) {
        entry.setName(data.name, true);
      }
      if (data.store) {
        entry.setMethod(0);
      }
      if (data.comment.length > 0) {
        entry.setComment(data.comment);
      }
      if (data.type === "symlink" && typeof data.mode !== "number") {
        data.mode = 40960;
      }
      if (typeof data.mode === "number") {
        if (data.type === "symlink") {
          data.mode |= 40960;
        }
        entry.setUnixMode(data.mode);
      }
      if (data.type === "symlink" && typeof data.linkname === "string") {
        source = Buffer.from(data.linkname);
      }
      return ZipArchiveOutputStream.prototype.entry.call(this, entry, source, callback);
    };
    ZipStream.prototype.finalize = function() {
      this.finish();
    };
  }
});

// node_modules/archiver/lib/plugins/zip.js
var require_zip = __commonJS({
  "node_modules/archiver/lib/plugins/zip.js"(exports, module2) {
    var engine = require_zip_stream();
    var util = require_archiver_utils();
    var Zip = function(options) {
      if (!(this instanceof Zip)) {
        return new Zip(options);
      }
      options = this.options = util.defaults(options, {
        comment: "",
        forceUTC: false,
        namePrependSlash: false,
        store: false
      });
      this.supports = {
        directory: true,
        symlink: true
      };
      this.engine = new engine(options);
    };
    Zip.prototype.append = function(source, data, callback) {
      this.engine.entry(source, data, callback);
    };
    Zip.prototype.finalize = function() {
      this.engine.finalize();
    };
    Zip.prototype.on = function() {
      return this.engine.on.apply(this.engine, arguments);
    };
    Zip.prototype.pipe = function() {
      return this.engine.pipe.apply(this.engine, arguments);
    };
    Zip.prototype.unpipe = function() {
      return this.engine.unpipe.apply(this.engine, arguments);
    };
    module2.exports = Zip;
  }
});

// node_modules/bl/BufferList.js
var require_BufferList3 = __commonJS({
  "node_modules/bl/BufferList.js"(exports, module2) {
    "use strict";
    var { Buffer: Buffer2 } = require("buffer");
    var symbol = Symbol.for("BufferList");
    function BufferList(buf) {
      if (!(this instanceof BufferList)) {
        return new BufferList(buf);
      }
      BufferList._init.call(this, buf);
    }
    BufferList._init = function _init(buf) {
      Object.defineProperty(this, symbol, { value: true });
      this._bufs = [];
      this.length = 0;
      if (buf) {
        this.append(buf);
      }
    };
    BufferList.prototype._new = function _new(buf) {
      return new BufferList(buf);
    };
    BufferList.prototype._offset = function _offset(offset) {
      if (offset === 0) {
        return [0, 0];
      }
      let tot = 0;
      for (let i = 0; i < this._bufs.length; i++) {
        const _t = tot + this._bufs[i].length;
        if (offset < _t || i === this._bufs.length - 1) {
          return [i, offset - tot];
        }
        tot = _t;
      }
    };
    BufferList.prototype._reverseOffset = function(blOffset) {
      const bufferId = blOffset[0];
      let offset = blOffset[1];
      for (let i = 0; i < bufferId; i++) {
        offset += this._bufs[i].length;
      }
      return offset;
    };
    BufferList.prototype.get = function get(index) {
      if (index > this.length || index < 0) {
        return void 0;
      }
      const offset = this._offset(index);
      return this._bufs[offset[0]][offset[1]];
    };
    BufferList.prototype.slice = function slice(start, end) {
      if (typeof start === "number" && start < 0) {
        start += this.length;
      }
      if (typeof end === "number" && end < 0) {
        end += this.length;
      }
      return this.copy(null, 0, start, end);
    };
    BufferList.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
      if (typeof srcStart !== "number" || srcStart < 0) {
        srcStart = 0;
      }
      if (typeof srcEnd !== "number" || srcEnd > this.length) {
        srcEnd = this.length;
      }
      if (srcStart >= this.length) {
        return dst || Buffer2.alloc(0);
      }
      if (srcEnd <= 0) {
        return dst || Buffer2.alloc(0);
      }
      const copy2 = !!dst;
      const off = this._offset(srcStart);
      const len = srcEnd - srcStart;
      let bytes = len;
      let bufoff = copy2 && dstStart || 0;
      let start = off[1];
      if (srcStart === 0 && srcEnd === this.length) {
        if (!copy2) {
          return this._bufs.length === 1 ? this._bufs[0] : Buffer2.concat(this._bufs, this.length);
        }
        for (let i = 0; i < this._bufs.length; i++) {
          this._bufs[i].copy(dst, bufoff);
          bufoff += this._bufs[i].length;
        }
        return dst;
      }
      if (bytes <= this._bufs[off[0]].length - start) {
        return copy2 ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes) : this._bufs[off[0]].slice(start, start + bytes);
      }
      if (!copy2) {
        dst = Buffer2.allocUnsafe(len);
      }
      for (let i = off[0]; i < this._bufs.length; i++) {
        const l = this._bufs[i].length - start;
        if (bytes > l) {
          this._bufs[i].copy(dst, bufoff, start);
          bufoff += l;
        } else {
          this._bufs[i].copy(dst, bufoff, start, start + bytes);
          bufoff += l;
          break;
        }
        bytes -= l;
        if (start) {
          start = 0;
        }
      }
      if (dst.length > bufoff)
        return dst.slice(0, bufoff);
      return dst;
    };
    BufferList.prototype.shallowSlice = function shallowSlice(start, end) {
      start = start || 0;
      end = typeof end !== "number" ? this.length : end;
      if (start < 0) {
        start += this.length;
      }
      if (end < 0) {
        end += this.length;
      }
      if (start === end) {
        return this._new();
      }
      const startOffset = this._offset(start);
      const endOffset = this._offset(end);
      const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1);
      if (endOffset[1] === 0) {
        buffers.pop();
      } else {
        buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1]);
      }
      if (startOffset[1] !== 0) {
        buffers[0] = buffers[0].slice(startOffset[1]);
      }
      return this._new(buffers);
    };
    BufferList.prototype.toString = function toString(encoding, start, end) {
      return this.slice(start, end).toString(encoding);
    };
    BufferList.prototype.consume = function consume(bytes) {
      bytes = Math.trunc(bytes);
      if (Number.isNaN(bytes) || bytes <= 0)
        return this;
      while (this._bufs.length) {
        if (bytes >= this._bufs[0].length) {
          bytes -= this._bufs[0].length;
          this.length -= this._bufs[0].length;
          this._bufs.shift();
        } else {
          this._bufs[0] = this._bufs[0].slice(bytes);
          this.length -= bytes;
          break;
        }
      }
      return this;
    };
    BufferList.prototype.duplicate = function duplicate() {
      const copy = this._new();
      for (let i = 0; i < this._bufs.length; i++) {
        copy.append(this._bufs[i]);
      }
      return copy;
    };
    BufferList.prototype.append = function append(buf) {
      if (buf == null) {
        return this;
      }
      if (buf.buffer) {
        this._appendBuffer(Buffer2.from(buf.buffer, buf.byteOffset, buf.byteLength));
      } else if (Array.isArray(buf)) {
        for (let i = 0; i < buf.length; i++) {
          this.append(buf[i]);
        }
      } else if (this._isBufferList(buf)) {
        for (let i = 0; i < buf._bufs.length; i++) {
          this.append(buf._bufs[i]);
        }
      } else {
        if (typeof buf === "number") {
          buf = buf.toString();
        }
        this._appendBuffer(Buffer2.from(buf));
      }
      return this;
    };
    BufferList.prototype._appendBuffer = function appendBuffer(buf) {
      this._bufs.push(buf);
      this.length += buf.length;
    };
    BufferList.prototype.indexOf = function(search, offset, encoding) {
      if (encoding === void 0 && typeof offset === "string") {
        encoding = offset;
        offset = void 0;
      }
      if (typeof search === "function" || Array.isArray(search)) {
        throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
      } else if (typeof search === "number") {
        search = Buffer2.from([search]);
      } else if (typeof search === "string") {
        search = Buffer2.from(search, encoding);
      } else if (this._isBufferList(search)) {
        search = search.slice();
      } else if (Array.isArray(search.buffer)) {
        search = Buffer2.from(search.buffer, search.byteOffset, search.byteLength);
      } else if (!Buffer2.isBuffer(search)) {
        search = Buffer2.from(search);
      }
      offset = Number(offset || 0);
      if (isNaN(offset)) {
        offset = 0;
      }
      if (offset < 0) {
        offset = this.length + offset;
      }
      if (offset < 0) {
        offset = 0;
      }
      if (search.length === 0) {
        return offset > this.length ? this.length : offset;
      }
      const blOffset = this._offset(offset);
      let blIndex = blOffset[0];
      let buffOffset = blOffset[1];
      for (; blIndex < this._bufs.length; blIndex++) {
        const buff = this._bufs[blIndex];
        while (buffOffset < buff.length) {
          const availableWindow = buff.length - buffOffset;
          if (availableWindow >= search.length) {
            const nativeSearchResult = buff.indexOf(search, buffOffset);
            if (nativeSearchResult !== -1) {
              return this._reverseOffset([blIndex, nativeSearchResult]);
            }
            buffOffset = buff.length - search.length + 1;
          } else {
            const revOffset = this._reverseOffset([blIndex, buffOffset]);
            if (this._match(revOffset, search)) {
              return revOffset;
            }
            buffOffset++;
          }
        }
        buffOffset = 0;
      }
      return -1;
    };
    BufferList.prototype._match = function(offset, search) {
      if (this.length - offset < search.length) {
        return false;
      }
      for (let searchOffset = 0; searchOffset < search.length; searchOffset++) {
        if (this.get(offset + searchOffset) !== search[searchOffset]) {
          return false;
        }
      }
      return true;
    };
    (function() {
      const methods = {
        readDoubleBE: 8,
        readDoubleLE: 8,
        readFloatBE: 4,
        readFloatLE: 4,
        readInt32BE: 4,
        readInt32LE: 4,
        readUInt32BE: 4,
        readUInt32LE: 4,
        readInt16BE: 2,
        readInt16LE: 2,
        readUInt16BE: 2,
        readUInt16LE: 2,
        readInt8: 1,
        readUInt8: 1,
        readIntBE: null,
        readIntLE: null,
        readUIntBE: null,
        readUIntLE: null
      };
      for (const m in methods) {
        (function(m2) {
          if (methods[m2] === null) {
            BufferList.prototype[m2] = function(offset, byteLength) {
              return this.slice(offset, offset + byteLength)[m2](0, byteLength);
            };
          } else {
            BufferList.prototype[m2] = function(offset = 0) {
              return this.slice(offset, offset + methods[m2])[m2](0);
            };
          }
        })(m);
      }
    })();
    BufferList.prototype._isBufferList = function _isBufferList(b) {
      return b instanceof BufferList || BufferList.isBufferList(b);
    };
    BufferList.isBufferList = function isBufferList(b) {
      return b != null && b[symbol];
    };
    module2.exports = BufferList;
  }
});

// node_modules/bl/bl.js
var require_bl = __commonJS({
  "node_modules/bl/bl.js"(exports, module2) {
    "use strict";
    var DuplexStream = require_readable3().Duplex;
    var inherits = require_inherits();
    var BufferList = require_BufferList3();
    function BufferListStream(callback) {
      if (!(this instanceof BufferListStream)) {
        return new BufferListStream(callback);
      }
      if (typeof callback === "function") {
        this._callback = callback;
        const piper = function piper2(err) {
          if (this._callback) {
            this._callback(err);
            this._callback = null;
          }
        }.bind(this);
        this.on("pipe", function onPipe(src) {
          src.on("error", piper);
        });
        this.on("unpipe", function onUnpipe(src) {
          src.removeListener("error", piper);
        });
        callback = null;
      }
      BufferList._init.call(this, callback);
      DuplexStream.call(this);
    }
    inherits(BufferListStream, DuplexStream);
    Object.assign(BufferListStream.prototype, BufferList.prototype);
    BufferListStream.prototype._new = function _new(callback) {
      return new BufferListStream(callback);
    };
    BufferListStream.prototype._write = function _write(buf, encoding, callback) {
      this._appendBuffer(buf);
      if (typeof callback === "function") {
        callback();
      }
    };
    BufferListStream.prototype._read = function _read(size) {
      if (!this.length) {
        return this.push(null);
      }
      size = Math.min(size, this.length);
      this.push(this.slice(0, size));
      this.consume(size);
    };
    BufferListStream.prototype.end = function end(chunk) {
      DuplexStream.prototype.end.call(this, chunk);
      if (this._callback) {
        this._callback(null, this.slice());
        this._callback = null;
      }
    };
    BufferListStream.prototype._destroy = function _destroy(err, cb) {
      this._bufs.length = 0;
      this.length = 0;
      cb(err);
    };
    BufferListStream.prototype._isBufferList = function _isBufferList(b) {
      return b instanceof BufferListStream || b instanceof BufferList || BufferListStream.isBufferList(b);
    };
    BufferListStream.isBufferList = BufferList.isBufferList;
    module2.exports = BufferListStream;
    module2.exports.BufferListStream = BufferListStream;
    module2.exports.BufferList = BufferList;
  }
});

// node_modules/tar-stream/headers.js
var require_headers = __commonJS({
  "node_modules/tar-stream/headers.js"(exports) {
    var alloc = Buffer.alloc;
    var ZEROS = "0000000000000000000";
    var SEVENS = "7777777777777777777";
    var ZERO_OFFSET = "0".charCodeAt(0);
    var USTAR_MAGIC = Buffer.from("ustar\0", "binary");
    var USTAR_VER = Buffer.from("00", "binary");
    var GNU_MAGIC = Buffer.from("ustar ", "binary");
    var GNU_VER = Buffer.from(" \0", "binary");
    var MASK = parseInt("7777", 8);
    var MAGIC_OFFSET = 257;
    var VERSION_OFFSET = 263;
    var clamp = function(index, len, defaultValue) {
      if (typeof index !== "number")
        return defaultValue;
      index = ~~index;
      if (index >= len)
        return len;
      if (index >= 0)
        return index;
      index += len;
      if (index >= 0)
        return index;
      return 0;
    };
    var toType = function(flag) {
      switch (flag) {
        case 0:
          return "file";
        case 1:
          return "link";
        case 2:
          return "symlink";
        case 3:
          return "character-device";
        case 4:
          return "block-device";
        case 5:
          return "directory";
        case 6:
          return "fifo";
        case 7:
          return "contiguous-file";
        case 72:
          return "pax-header";
        case 55:
          return "pax-global-header";
        case 27:
          return "gnu-long-link-path";
        case 28:
        case 30:
          return "gnu-long-path";
      }
      return null;
    };
    var toTypeflag = function(flag) {
      switch (flag) {
        case "file":
          return 0;
        case "link":
          return 1;
        case "symlink":
          return 2;
        case "character-device":
          return 3;
        case "block-device":
          return 4;
        case "directory":
          return 5;
        case "fifo":
          return 6;
        case "contiguous-file":
          return 7;
        case "pax-header":
          return 72;
      }
      return 0;
    };
    var indexOf = function(block, num2, offset, end) {
      for (; offset < end; offset++) {
        if (block[offset] === num2)
          return offset;
      }
      return end;
    };
    var cksum = function(block) {
      var sum = 8 * 32;
      for (var i = 0; i < 148; i++)
        sum += block[i];
      for (var j = 156; j < 512; j++)
        sum += block[j];
      return sum;
    };
    var encodeOct = function(val2, n) {
      val2 = val2.toString(8);
      if (val2.length > n)
        return SEVENS.slice(0, n) + " ";
      else
        return ZEROS.slice(0, n - val2.length) + val2 + " ";
    };
    function parse256(buf) {
      var positive;
      if (buf[0] === 128)
        positive = true;
      else if (buf[0] === 255)
        positive = false;
      else
        return null;
      var tuple = [];
      for (var i = buf.length - 1; i > 0; i--) {
        var byte = buf[i];
        if (positive)
          tuple.push(byte);
        else
          tuple.push(255 - byte);
      }
      var sum = 0;
      var l = tuple.length;
      for (i = 0; i < l; i++) {
        sum += tuple[i] * Math.pow(256, i);
      }
      return positive ? sum : -1 * sum;
    }
    var decodeOct = function(val2, offset, length) {
      val2 = val2.slice(offset, offset + length);
      offset = 0;
      if (val2[offset] & 128) {
        return parse256(val2);
      } else {
        while (offset < val2.length && val2[offset] === 32)
          offset++;
        var end = clamp(indexOf(val2, 32, offset, val2.length), val2.length, val2.length);
        while (offset < end && val2[offset] === 0)
          offset++;
        if (end === offset)
          return 0;
        return parseInt(val2.slice(offset, end).toString(), 8);
      }
    };
    var decodeStr = function(val2, offset, length, encoding) {
      return val2.slice(offset, indexOf(val2, 0, offset, offset + length)).toString(encoding);
    };
    var addLength = function(str2) {
      var len = Buffer.byteLength(str2);
      var digits = Math.floor(Math.log(len) / Math.log(10)) + 1;
      if (len + digits >= Math.pow(10, digits))
        digits++;
      return len + digits + str2;
    };
    exports.decodeLongPath = function(buf, encoding) {
      return decodeStr(buf, 0, buf.length, encoding);
    };
    exports.encodePax = function(opts) {
      var result = "";
      if (opts.name)
        result += addLength(" path=" + opts.name + "\n");
      if (opts.linkname)
        result += addLength(" linkpath=" + opts.linkname + "\n");
      var pax = opts.pax;
      if (pax) {
        for (var key in pax) {
          result += addLength(" " + key + "=" + pax[key] + "\n");
        }
      }
      return Buffer.from(result);
    };
    exports.decodePax = function(buf) {
      var result = {};
      while (buf.length) {
        var i = 0;
        while (i < buf.length && buf[i] !== 32)
          i++;
        var len = parseInt(buf.slice(0, i).toString(), 10);
        if (!len)
          return result;
        var b = buf.slice(i + 1, len - 1).toString();
        var keyIndex = b.indexOf("=");
        if (keyIndex === -1)
          return result;
        result[b.slice(0, keyIndex)] = b.slice(keyIndex + 1);
        buf = buf.slice(len);
      }
      return result;
    };
    exports.encode = function(opts) {
      var buf = alloc(512);
      var name = opts.name;
      var prefix = "";
      if (opts.typeflag === 5 && name[name.length - 1] !== "/")
        name += "/";
      if (Buffer.byteLength(name) !== name.length)
        return null;
      while (Buffer.byteLength(name) > 100) {
        var i = name.indexOf("/");
        if (i === -1)
          return null;
        prefix += prefix ? "/" + name.slice(0, i) : name.slice(0, i);
        name = name.slice(i + 1);
      }
      if (Buffer.byteLength(name) > 100 || Buffer.byteLength(prefix) > 155)
        return null;
      if (opts.linkname && Buffer.byteLength(opts.linkname) > 100)
        return null;
      buf.write(name);
      buf.write(encodeOct(opts.mode & MASK, 6), 100);
      buf.write(encodeOct(opts.uid, 6), 108);
      buf.write(encodeOct(opts.gid, 6), 116);
      buf.write(encodeOct(opts.size, 11), 124);
      buf.write(encodeOct(opts.mtime.getTime() / 1e3 | 0, 11), 136);
      buf[156] = ZERO_OFFSET + toTypeflag(opts.type);
      if (opts.linkname)
        buf.write(opts.linkname, 157);
      USTAR_MAGIC.copy(buf, MAGIC_OFFSET);
      USTAR_VER.copy(buf, VERSION_OFFSET);
      if (opts.uname)
        buf.write(opts.uname, 265);
      if (opts.gname)
        buf.write(opts.gname, 297);
      buf.write(encodeOct(opts.devmajor || 0, 6), 329);
      buf.write(encodeOct(opts.devminor || 0, 6), 337);
      if (prefix)
        buf.write(prefix, 345);
      buf.write(encodeOct(cksum(buf), 6), 148);
      return buf;
    };
    exports.decode = function(buf, filenameEncoding, allowUnknownFormat) {
      var typeflag = buf[156] === 0 ? 0 : buf[156] - ZERO_OFFSET;
      var name = decodeStr(buf, 0, 100, filenameEncoding);
      var mode = decodeOct(buf, 100, 8);
      var uid = decodeOct(buf, 108, 8);
      var gid = decodeOct(buf, 116, 8);
      var size = decodeOct(buf, 124, 12);
      var mtime = decodeOct(buf, 136, 12);
      var type = toType(typeflag);
      var linkname = buf[157] === 0 ? null : decodeStr(buf, 157, 100, filenameEncoding);
      var uname = decodeStr(buf, 265, 32);
      var gname = decodeStr(buf, 297, 32);
      var devmajor = decodeOct(buf, 329, 8);
      var devminor = decodeOct(buf, 337, 8);
      var c = cksum(buf);
      if (c === 8 * 32)
        return null;
      if (c !== decodeOct(buf, 148, 8))
        throw new Error("Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?");
      if (USTAR_MAGIC.compare(buf, MAGIC_OFFSET, MAGIC_OFFSET + 6) === 0) {
        if (buf[345])
          name = decodeStr(buf, 345, 155, filenameEncoding) + "/" + name;
      } else if (GNU_MAGIC.compare(buf, MAGIC_OFFSET, MAGIC_OFFSET + 6) === 0 && GNU_VER.compare(buf, VERSION_OFFSET, VERSION_OFFSET + 2) === 0) {
      } else {
        if (!allowUnknownFormat) {
          throw new Error("Invalid tar header: unknown format.");
        }
      }
      if (typeflag === 0 && name && name[name.length - 1] === "/")
        typeflag = 5;
      return {
        name,
        mode,
        uid,
        gid,
        size,
        mtime: new Date(1e3 * mtime),
        type,
        linkname,
        uname,
        gname,
        devmajor,
        devminor
      };
    };
  }
});

// node_modules/tar-stream/extract.js
var require_extract = __commonJS({
  "node_modules/tar-stream/extract.js"(exports, module2) {
    var util = require("util");
    var bl = require_bl();
    var headers = require_headers();
    var Writable = require_readable3().Writable;
    var PassThrough = require_readable3().PassThrough;
    var noop = function() {
    };
    var overflow = function(size) {
      size &= 511;
      return size && 512 - size;
    };
    var emptyStream = function(self2, offset) {
      var s = new Source(self2, offset);
      s.end();
      return s;
    };
    var mixinPax = function(header, pax) {
      if (pax.path)
        header.name = pax.path;
      if (pax.linkpath)
        header.linkname = pax.linkpath;
      if (pax.size)
        header.size = parseInt(pax.size, 10);
      header.pax = pax;
      return header;
    };
    var Source = function(self2, offset) {
      this._parent = self2;
      this.offset = offset;
      PassThrough.call(this, { autoDestroy: false });
    };
    util.inherits(Source, PassThrough);
    Source.prototype.destroy = function(err) {
      this._parent.destroy(err);
    };
    var Extract = function(opts) {
      if (!(this instanceof Extract))
        return new Extract(opts);
      Writable.call(this, opts);
      opts = opts || {};
      this._offset = 0;
      this._buffer = bl();
      this._missing = 0;
      this._partial = false;
      this._onparse = noop;
      this._header = null;
      this._stream = null;
      this._overflow = null;
      this._cb = null;
      this._locked = false;
      this._destroyed = false;
      this._pax = null;
      this._paxGlobal = null;
      this._gnuLongPath = null;
      this._gnuLongLinkPath = null;
      var self2 = this;
      var b = self2._buffer;
      var oncontinue = function() {
        self2._continue();
      };
      var onunlock = function(err) {
        self2._locked = false;
        if (err)
          return self2.destroy(err);
        if (!self2._stream)
          oncontinue();
      };
      var onstreamend = function() {
        self2._stream = null;
        var drain = overflow(self2._header.size);
        if (drain)
          self2._parse(drain, ondrain);
        else
          self2._parse(512, onheader);
        if (!self2._locked)
          oncontinue();
      };
      var ondrain = function() {
        self2._buffer.consume(overflow(self2._header.size));
        self2._parse(512, onheader);
        oncontinue();
      };
      var onpaxglobalheader = function() {
        var size = self2._header.size;
        self2._paxGlobal = headers.decodePax(b.slice(0, size));
        b.consume(size);
        onstreamend();
      };
      var onpaxheader = function() {
        var size = self2._header.size;
        self2._pax = headers.decodePax(b.slice(0, size));
        if (self2._paxGlobal)
          self2._pax = Object.assign({}, self2._paxGlobal, self2._pax);
        b.consume(size);
        onstreamend();
      };
      var ongnulongpath = function() {
        var size = self2._header.size;
        this._gnuLongPath = headers.decodeLongPath(b.slice(0, size), opts.filenameEncoding);
        b.consume(size);
        onstreamend();
      };
      var ongnulonglinkpath = function() {
        var size = self2._header.size;
        this._gnuLongLinkPath = headers.decodeLongPath(b.slice(0, size), opts.filenameEncoding);
        b.consume(size);
        onstreamend();
      };
      var onheader = function() {
        var offset = self2._offset;
        var header;
        try {
          header = self2._header = headers.decode(b.slice(0, 512), opts.filenameEncoding, opts.allowUnknownFormat);
        } catch (err) {
          self2.emit("error", err);
        }
        b.consume(512);
        if (!header) {
          self2._parse(512, onheader);
          oncontinue();
          return;
        }
        if (header.type === "gnu-long-path") {
          self2._parse(header.size, ongnulongpath);
          oncontinue();
          return;
        }
        if (header.type === "gnu-long-link-path") {
          self2._parse(header.size, ongnulonglinkpath);
          oncontinue();
          return;
        }
        if (header.type === "pax-global-header") {
          self2._parse(header.size, onpaxglobalheader);
          oncontinue();
          return;
        }
        if (header.type === "pax-header") {
          self2._parse(header.size, onpaxheader);
          oncontinue();
          return;
        }
        if (self2._gnuLongPath) {
          header.name = self2._gnuLongPath;
          self2._gnuLongPath = null;
        }
        if (self2._gnuLongLinkPath) {
          header.linkname = self2._gnuLongLinkPath;
          self2._gnuLongLinkPath = null;
        }
        if (self2._pax) {
          self2._header = header = mixinPax(header, self2._pax);
          self2._pax = null;
        }
        self2._locked = true;
        if (!header.size || header.type === "directory") {
          self2._parse(512, onheader);
          self2.emit("entry", header, emptyStream(self2, offset), onunlock);
          return;
        }
        self2._stream = new Source(self2, offset);
        self2.emit("entry", header, self2._stream, onunlock);
        self2._parse(header.size, onstreamend);
        oncontinue();
      };
      this._onheader = onheader;
      this._parse(512, onheader);
    };
    util.inherits(Extract, Writable);
    Extract.prototype.destroy = function(err) {
      if (this._destroyed)
        return;
      this._destroyed = true;
      if (err)
        this.emit("error", err);
      this.emit("close");
      if (this._stream)
        this._stream.emit("close");
    };
    Extract.prototype._parse = function(size, onparse) {
      if (this._destroyed)
        return;
      this._offset += size;
      this._missing = size;
      if (onparse === this._onheader)
        this._partial = false;
      this._onparse = onparse;
    };
    Extract.prototype._continue = function() {
      if (this._destroyed)
        return;
      var cb = this._cb;
      this._cb = noop;
      if (this._overflow)
        this._write(this._overflow, void 0, cb);
      else
        cb();
    };
    Extract.prototype._write = function(data, enc, cb) {
      if (this._destroyed)
        return;
      var s = this._stream;
      var b = this._buffer;
      var missing = this._missing;
      if (data.length)
        this._partial = true;
      if (data.length < missing) {
        this._missing -= data.length;
        this._overflow = null;
        if (s)
          return s.write(data, cb);
        b.append(data);
        return cb();
      }
      this._cb = cb;
      this._missing = 0;
      var overflow2 = null;
      if (data.length > missing) {
        overflow2 = data.slice(missing);
        data = data.slice(0, missing);
      }
      if (s)
        s.end(data);
      else
        b.append(data);
      this._overflow = overflow2;
      this._onparse();
    };
    Extract.prototype._final = function(cb) {
      if (this._partial)
        return this.destroy(new Error("Unexpected end of data"));
      cb();
    };
    module2.exports = Extract;
  }
});

// node_modules/fs-constants/index.js
var require_fs_constants = __commonJS({
  "node_modules/fs-constants/index.js"(exports, module2) {
    module2.exports = require("fs").constants || require("constants");
  }
});

// node_modules/end-of-stream/index.js
var require_end_of_stream2 = __commonJS({
  "node_modules/end-of-stream/index.js"(exports, module2) {
    var once = require_once();
    var noop = function() {
    };
    var isRequest = function(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    };
    var isChildProcess = function(stream) {
      return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
    };
    var eos = function(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once(callback || noop);
      var ws = stream._writableState;
      var rs = stream._readableState;
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var cancelled = false;
      var onlegacyfinish = function() {
        if (!stream.writable)
          onfinish();
      };
      var onfinish = function() {
        writable = false;
        if (!readable)
          callback.call(stream);
      };
      var onend = function() {
        readable = false;
        if (!writable)
          callback.call(stream);
      };
      var onexit = function(exitCode) {
        callback.call(stream, exitCode ? new Error("exited with error code: " + exitCode) : null);
      };
      var onerror = function(err) {
        callback.call(stream, err);
      };
      var onclose = function() {
        process.nextTick(onclosenexttick);
      };
      var onclosenexttick = function() {
        if (cancelled)
          return;
        if (readable && !(rs && (rs.ended && !rs.destroyed)))
          return callback.call(stream, new Error("premature close"));
        if (writable && !(ws && (ws.ended && !ws.destroyed)))
          return callback.call(stream, new Error("premature close"));
      };
      var onrequest = function() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !ws) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      if (isChildProcess(stream))
        stream.on("exit", onexit);
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        cancelled = true;
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("exit", onexit);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    };
    module2.exports = eos;
  }
});

// node_modules/tar-stream/pack.js
var require_pack = __commonJS({
  "node_modules/tar-stream/pack.js"(exports, module2) {
    var constants = require_fs_constants();
    var eos = require_end_of_stream2();
    var inherits = require_inherits();
    var alloc = Buffer.alloc;
    var Readable = require_readable3().Readable;
    var Writable = require_readable3().Writable;
    var StringDecoder = require("string_decoder").StringDecoder;
    var headers = require_headers();
    var DMODE = parseInt("755", 8);
    var FMODE = parseInt("644", 8);
    var END_OF_TAR = alloc(1024);
    var noop = function() {
    };
    var overflow = function(self2, size) {
      size &= 511;
      if (size)
        self2.push(END_OF_TAR.slice(0, 512 - size));
    };
    function modeToType(mode) {
      switch (mode & constants.S_IFMT) {
        case constants.S_IFBLK:
          return "block-device";
        case constants.S_IFCHR:
          return "character-device";
        case constants.S_IFDIR:
          return "directory";
        case constants.S_IFIFO:
          return "fifo";
        case constants.S_IFLNK:
          return "symlink";
      }
      return "file";
    }
    var Sink = function(to) {
      Writable.call(this);
      this.written = 0;
      this._to = to;
      this._destroyed = false;
    };
    inherits(Sink, Writable);
    Sink.prototype._write = function(data, enc, cb) {
      this.written += data.length;
      if (this._to.push(data))
        return cb();
      this._to._drain = cb;
    };
    Sink.prototype.destroy = function() {
      if (this._destroyed)
        return;
      this._destroyed = true;
      this.emit("close");
    };
    var LinkSink = function() {
      Writable.call(this);
      this.linkname = "";
      this._decoder = new StringDecoder("utf-8");
      this._destroyed = false;
    };
    inherits(LinkSink, Writable);
    LinkSink.prototype._write = function(data, enc, cb) {
      this.linkname += this._decoder.write(data);
      cb();
    };
    LinkSink.prototype.destroy = function() {
      if (this._destroyed)
        return;
      this._destroyed = true;
      this.emit("close");
    };
    var Void = function() {
      Writable.call(this);
      this._destroyed = false;
    };
    inherits(Void, Writable);
    Void.prototype._write = function(data, enc, cb) {
      cb(new Error("No body allowed for this entry"));
    };
    Void.prototype.destroy = function() {
      if (this._destroyed)
        return;
      this._destroyed = true;
      this.emit("close");
    };
    var Pack = function(opts) {
      if (!(this instanceof Pack))
        return new Pack(opts);
      Readable.call(this, opts);
      this._drain = noop;
      this._finalized = false;
      this._finalizing = false;
      this._destroyed = false;
      this._stream = null;
    };
    inherits(Pack, Readable);
    Pack.prototype.entry = function(header, buffer, callback) {
      if (this._stream)
        throw new Error("already piping an entry");
      if (this._finalized || this._destroyed)
        return;
      if (typeof buffer === "function") {
        callback = buffer;
        buffer = null;
      }
      if (!callback)
        callback = noop;
      var self2 = this;
      if (!header.size || header.type === "symlink")
        header.size = 0;
      if (!header.type)
        header.type = modeToType(header.mode);
      if (!header.mode)
        header.mode = header.type === "directory" ? DMODE : FMODE;
      if (!header.uid)
        header.uid = 0;
      if (!header.gid)
        header.gid = 0;
      if (!header.mtime)
        header.mtime = /* @__PURE__ */ new Date();
      if (typeof buffer === "string")
        buffer = Buffer.from(buffer);
      if (Buffer.isBuffer(buffer)) {
        header.size = buffer.length;
        this._encode(header);
        var ok = this.push(buffer);
        overflow(self2, header.size);
        if (ok)
          process.nextTick(callback);
        else
          this._drain = callback;
        return new Void();
      }
      if (header.type === "symlink" && !header.linkname) {
        var linkSink = new LinkSink();
        eos(linkSink, function(err) {
          if (err) {
            self2.destroy();
            return callback(err);
          }
          header.linkname = linkSink.linkname;
          self2._encode(header);
          callback();
        });
        return linkSink;
      }
      this._encode(header);
      if (header.type !== "file" && header.type !== "contiguous-file") {
        process.nextTick(callback);
        return new Void();
      }
      var sink = new Sink(this);
      this._stream = sink;
      eos(sink, function(err) {
        self2._stream = null;
        if (err) {
          self2.destroy();
          return callback(err);
        }
        if (sink.written !== header.size) {
          self2.destroy();
          return callback(new Error("size mismatch"));
        }
        overflow(self2, header.size);
        if (self2._finalizing)
          self2.finalize();
        callback();
      });
      return sink;
    };
    Pack.prototype.finalize = function() {
      if (this._stream) {
        this._finalizing = true;
        return;
      }
      if (this._finalized)
        return;
      this._finalized = true;
      this.push(END_OF_TAR);
      this.push(null);
    };
    Pack.prototype.destroy = function(err) {
      if (this._destroyed)
        return;
      this._destroyed = true;
      if (err)
        this.emit("error", err);
      this.emit("close");
      if (this._stream && this._stream.destroy)
        this._stream.destroy();
    };
    Pack.prototype._encode = function(header) {
      if (!header.pax) {
        var buf = headers.encode(header);
        if (buf) {
          this.push(buf);
          return;
        }
      }
      this._encodePax(header);
    };
    Pack.prototype._encodePax = function(header) {
      var paxHeader = headers.encodePax({
        name: header.name,
        linkname: header.linkname,
        pax: header.pax
      });
      var newHeader = {
        name: "PaxHeader",
        mode: header.mode,
        uid: header.uid,
        gid: header.gid,
        size: paxHeader.length,
        mtime: header.mtime,
        type: "pax-header",
        linkname: header.linkname && "PaxHeader",
        uname: header.uname,
        gname: header.gname,
        devmajor: header.devmajor,
        devminor: header.devminor
      };
      this.push(headers.encode(newHeader));
      this.push(paxHeader);
      overflow(this, paxHeader.length);
      newHeader.size = header.size;
      newHeader.type = header.type;
      this.push(headers.encode(newHeader));
    };
    Pack.prototype._read = function(n) {
      var drain = this._drain;
      this._drain = noop;
      drain();
    };
    module2.exports = Pack;
  }
});

// node_modules/tar-stream/index.js
var require_tar_stream = __commonJS({
  "node_modules/tar-stream/index.js"(exports) {
    exports.extract = require_extract();
    exports.pack = require_pack();
  }
});

// node_modules/archiver/lib/plugins/tar.js
var require_tar = __commonJS({
  "node_modules/archiver/lib/plugins/tar.js"(exports, module2) {
    var zlib = require("zlib");
    var engine = require_tar_stream();
    var util = require_archiver_utils();
    var Tar = function(options) {
      if (!(this instanceof Tar)) {
        return new Tar(options);
      }
      options = this.options = util.defaults(options, {
        gzip: false
      });
      if (typeof options.gzipOptions !== "object") {
        options.gzipOptions = {};
      }
      this.supports = {
        directory: true,
        symlink: true
      };
      this.engine = engine.pack(options);
      this.compressor = false;
      if (options.gzip) {
        this.compressor = zlib.createGzip(options.gzipOptions);
        this.compressor.on("error", this._onCompressorError.bind(this));
      }
    };
    Tar.prototype._onCompressorError = function(err) {
      this.engine.emit("error", err);
    };
    Tar.prototype.append = function(source, data, callback) {
      var self2 = this;
      data.mtime = data.date;
      function append(err, sourceBuffer) {
        if (err) {
          callback(err);
          return;
        }
        self2.engine.entry(data, sourceBuffer, function(err2) {
          callback(err2, data);
        });
      }
      if (data.sourceType === "buffer") {
        append(null, source);
      } else if (data.sourceType === "stream" && data.stats) {
        data.size = data.stats.size;
        var entry = self2.engine.entry(data, function(err) {
          callback(err, data);
        });
        source.pipe(entry);
      } else if (data.sourceType === "stream") {
        util.collectStream(source, append);
      }
    };
    Tar.prototype.finalize = function() {
      this.engine.finalize();
    };
    Tar.prototype.on = function() {
      return this.engine.on.apply(this.engine, arguments);
    };
    Tar.prototype.pipe = function(destination, options) {
      if (this.compressor) {
        return this.engine.pipe.apply(this.engine, [this.compressor]).pipe(destination, options);
      } else {
        return this.engine.pipe.apply(this.engine, arguments);
      }
    };
    Tar.prototype.unpipe = function() {
      if (this.compressor) {
        return this.compressor.unpipe.apply(this.compressor, arguments);
      } else {
        return this.engine.unpipe.apply(this.engine, arguments);
      }
    };
    module2.exports = Tar;
  }
});

// node_modules/archiver/lib/plugins/json.js
var require_json = __commonJS({
  "node_modules/archiver/lib/plugins/json.js"(exports, module2) {
    var inherits = require("util").inherits;
    var Transform = require_readable3().Transform;
    var crc32 = require_buffer_crc32();
    var util = require_archiver_utils();
    var Json = function(options) {
      if (!(this instanceof Json)) {
        return new Json(options);
      }
      options = this.options = util.defaults(options, {});
      Transform.call(this, options);
      this.supports = {
        directory: true,
        symlink: true
      };
      this.files = [];
    };
    inherits(Json, Transform);
    Json.prototype._transform = function(chunk, encoding, callback) {
      callback(null, chunk);
    };
    Json.prototype._writeStringified = function() {
      var fileString = JSON.stringify(this.files);
      this.write(fileString);
    };
    Json.prototype.append = function(source, data, callback) {
      var self2 = this;
      data.crc32 = 0;
      function onend(err, sourceBuffer) {
        if (err) {
          callback(err);
          return;
        }
        data.size = sourceBuffer.length || 0;
        data.crc32 = crc32.unsigned(sourceBuffer);
        self2.files.push(data);
        callback(null, data);
      }
      if (data.sourceType === "buffer") {
        onend(null, source);
      } else if (data.sourceType === "stream") {
        util.collectStream(source, onend);
      }
    };
    Json.prototype.finalize = function() {
      this._writeStringified();
      this.end();
    };
    module2.exports = Json;
  }
});

// node_modules/archiver/index.js
var require_archiver = __commonJS({
  "node_modules/archiver/index.js"(exports, module2) {
    var Archiver = require_core();
    var formats = {};
    var vending = function(format, options) {
      return vending.create(format, options);
    };
    vending.create = function(format, options) {
      if (formats[format]) {
        var instance = new Archiver(format, options);
        instance.setFormat(format);
        instance.setModule(new formats[format](options));
        return instance;
      } else {
        throw new Error("create(" + format + "): format not registered");
      }
    };
    vending.registerFormat = function(format, module3) {
      if (formats[format]) {
        throw new Error("register(" + format + "): format already registered");
      }
      if (typeof module3 !== "function") {
        throw new Error("register(" + format + "): format module invalid");
      }
      if (typeof module3.prototype.append !== "function" || typeof module3.prototype.finalize !== "function") {
        throw new Error("register(" + format + "): format module missing methods");
      }
      formats[format] = module3;
    };
    vending.isRegisteredFormat = function(format) {
      if (formats[format]) {
        return true;
      }
      return false;
    };
    vending.registerFormat("zip", require_zip());
    vending.registerFormat("tar", require_tar());
    vending.registerFormat("json", require_json());
    module2.exports = vending;
  }
});

// foundation_cli/index.mjs
var import_node_process = __toESM(require("node:process"), 1);
var ANSI_PREFIX = "\x1B[";
var HIDE_CURSOR = ANSI_PREFIX + "?25l";
var SHOW_CURSOR = ANSI_PREFIX + "?25h";
var MOVE_CURSOR_TO_NEXT_LINE = ANSI_PREFIX + "1G";
var GREEN_TEXT = ANSI_PREFIX + "32m";
var BLUE_TEXT = ANSI_PREFIX + "34m";
var AQUA_TEXT = ANSI_PREFIX + "36m";
var WHITE_TEXT = ANSI_PREFIX + "37m";
var RED_TEXT = ANSI_PREFIX + "31m";
var DIM_TEXT = ANSI_PREFIX + "2m";
var BRIGHT_TEXT = ANSI_PREFIX + "0m";
function print(text) {
  console.log(text);
}
function makeGreenText(text) {
  return `${GREEN_TEXT}${text}${WHITE_TEXT}`;
}
function makeBlueText(text) {
  return `${BLUE_TEXT}${text}${WHITE_TEXT}`;
}
function makeRedText(text) {
  return `${RED_TEXT}${text}${WHITE_TEXT}`;
}
function makeDimText(text) {
  return `${DIM_TEXT}${text}${BRIGHT_TEXT}`;
}
function setTextWidth(text, length) {
  return text.padEnd(length, " ");
}
function printSuccessMessage(text) {
  print(makeGreenText(text));
}
function printErrorMessage(text) {
  print(makeRedText(text));
}
function clear() {
  console.clear();
}
function hideCursor() {
  print(HIDE_CURSOR);
}
function showCursor() {
  print(SHOW_CURSOR);
}
var loadingInterval;
function startLoadingMessage(text) {
  if (!import_node_process.default.stdout.isTTY) {
    console.log(text);
    return;
  }
  const std = import_node_process.default.stdout;
  const dots = ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
  const spinnerFrames = dots;
  let index = 0;
  const log = () => {
    let line = spinnerFrames[index];
    if (!line) {
      index = 0;
      line = spinnerFrames[index];
    }
    import_node_process.default.stdout.clearLine();
    import_node_process.default.stdout.cursorTo(0);
    std.write(AQUA_TEXT + line + WHITE_TEXT + " " + text);
    index = index >= spinnerFrames.length ? 0 : index + 1;
  };
  clearInterval(loadingInterval);
  log();
  loadingInterval = setInterval(log, 100);
}
function endLoadingMessage() {
  clearInterval(loadingInterval);
}
function command(fn) {
  return async () => {
    hideCursor();
    clear();
    try {
      await fn();
      showCursor();
    } catch (e) {
      console.log(e);
      throw new Error(e);
      printErrorMessage(e.message);
      showCursor();
    }
  };
}
var program = {};
function addCommand(config) {
  program[config.command] = command(config.action);
}

// foundation_aws/account_getKeyword.mjs
var import_client = __toESM(require_src(), 1);

// foundation_aws/cfn_deployStack.mjs
var import_client2 = __toESM(require_src(), 1);
async function createStack(props) {
  const aws = await (0, import_client2.default)({
    region: props.region || process.env.AWS_REGION || "us-east-1",
    plugins: [Promise.resolve().then(() => (init_src(), src_exports))]
  });
  const input = {
    StackName: props.name,
    Capabilities: [
      "CAPABILITY_IAM",
      "CAPABILITY_AUTO_EXPAND",
      "CAPABILITY_NAMED_IAM"
    ],
    TemplateBody: props.template
  };
  return await aws.CloudFormation.CreateStack(input);
}
async function updateStack(props) {
  const aws = await (0, import_client2.default)({
    region: props.region || process.env.AWS_REGION || "us-east-1",
    plugins: [Promise.resolve().then(() => (init_src(), src_exports))]
  });
  const input = {
    StackName: props.name,
    Capabilities: [
      "CAPABILITY_IAM",
      "CAPABILITY_AUTO_EXPAND",
      "CAPABILITY_NAMED_IAM"
    ],
    TemplateBody: props.template
  };
  return await aws.CloudFormation.UpdateStack(input);
}
async function deployStack(props) {
  try {
    const res2 = await updateStack({
      region: props.region,
      name: props.name,
      template: props.template
    });
    return {
      status: "updating",
      id: res2.StackId
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("does not exist")) {
        const res2 = await createStack({
          region: props.region,
          name: props.name,
          template: props.template
        });
        return {
          status: "creating",
          id: res2.StackId
        };
      }
      if (e.message.includes("No updates are to be performed.")) {
        return {
          status: "nothing"
        };
      }
      if (e.message.includes("CREATE_IN_PROGRESS")) {
        return {
          status: "createinprogress"
        };
      }
      if (e.message.includes("UPDATE_IN_PROGRESS")) {
        return {
          status: "updateinprogress"
        };
      }
      if (e.message.includes("DELETE_IN_PROGRESS")) {
        return {
          status: "deleteinprogress"
        };
      }
      throw new Error(e.message);
    }
  }
}

// foundation_aws/cfn_getDeployStatus.mjs
var import_client3 = __toESM(require_src(), 1);
var ResultStatus = {
  success: "success",
  fail: "fail",
  rollback: "rollback",
  inprogress: "inprogress"
};
var stackStateMap = {
  // create
  CREATE_IN_PROGRESS: ResultStatus.inprogress,
  CREATE_FAILED: ResultStatus.fail,
  CREATE_COMPLETE: ResultStatus.success,
  // rollback
  ROLLBACK_IN_PROGRESS: ResultStatus.inprogress,
  ROLLBACK_FAILED: ResultStatus.fail,
  ROLLBACK_COMPLETE: ResultStatus.rollback,
  // delete
  DELETE_IN_PROGRESS: ResultStatus.inprogress,
  DELETE_FAILED: ResultStatus.fail,
  DELETE_COMPLETE: ResultStatus.success,
  // update
  UPDATE_IN_PROGRESS: ResultStatus.inprogress,
  UPDATE_COMPLETE_CLEANUP_IN_PROGRESS: ResultStatus.inprogress,
  UPDATE_COMPLETE: ResultStatus.success,
  UPDATE_FAILED: ResultStatus.fail,
  // update rollback
  UPDATE_ROLLBACK_IN_PROGRESS: ResultStatus.inprogress,
  UPDATE_ROLLBACK_FAILED: ResultStatus.fail,
  UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS: ResultStatus.inprogress,
  UPDATE_ROLLBACK_COMPLETE: ResultStatus.rollback,
  // review
  REVIEW_IN_PROGRESS: ResultStatus.inprogress,
  // import
  IMPORT_IN_PROGRESS: ResultStatus.inprogress,
  IMPORT_COMPLETE: ResultStatus.success,
  IMPORT_ROLLBACK_IN_PROGRESS: ResultStatus.inprogress,
  IMPORT_ROLLBACK_FAILED: ResultStatus.fail,
  IMPORT_ROLLBACK_COMPLETE: ResultStatus.rollback
};
var getStackInfo = (region) => async (name) => {
  const aws = await (0, import_client3.default)({
    region,
    plugins: [Promise.resolve().then(() => (init_src(), src_exports))]
  });
  const input = {
    StackName: name
  };
  try {
    const result = await aws.CloudFormation.DescribeStacks(input);
    if (!result.Stacks || result.Stacks.length === 0) {
      throw new Error("No stacks found with the name " + name);
    }
    return result.Stacks[0];
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something unexpected has gone wrong";
    throw new Error(message);
  }
};
var getStackResourceStatus = (region) => async (name) => {
  const aws = await (0, import_client3.default)({
    region,
    plugins: [Promise.resolve().then(() => (init_src(), src_exports))]
  });
  const input = {
    StackName: name
  };
  try {
    const result = await aws.CloudFormation.DescribeStackResources(input);
    if (!result.StackResources) {
      throw new Error("No stack resources found");
    }
    return result.StackResources;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something unexpected has gone wrong";
    throw new Error(message);
  }
};
async function getCloudFormationStackInfo(getInfo, name) {
  const data = await getInfo(name);
  const status = data.StackStatus;
  const message = data.StackStatusReason || "unknown";
  const outputs2 = data.Outputs || [];
  const stackInfoStatus = stackStateMap[status] || ResultStatus.fail;
  return {
    status: stackInfoStatus,
    message,
    outputs: outputs2.map((o) => {
      if (!o.OutputKey) {
        throw new Error("Output does not have a key");
      }
      if (!o.OutputValue) {
        throw new Error("Output does not have a key");
      }
      return {
        key: o.OutputKey,
        value: o.OutputValue
      };
    })
  };
}
async function checkAgainState(io, config, timer, times) {
  const wait = (time) => new Promise((r) => setTimeout(() => r(), time));
  await wait(timer);
  const resourceProgress = await io.getResources(config.stackName);
  const resources = resourceProgress.map((x) => ({
    id: x.LogicalResourceId,
    status: x.ResourceStatus,
    type: x.ResourceType
  }));
  config.onCheck(resources, times);
  const increasedTimer = timer * config.backoffRate;
  const newTimer = increasedTimer > config.maxRetryInterval ? config.maxRetryInterval : increasedTimer;
  return await recursiveCheck(io, config, times + 1, newTimer);
}
function stillInProgressState() {
  return {
    status: ResultStatus.inprogress,
    message: "Cloudformation is still deploying...",
    outputs: {}
  };
}
function failState(message) {
  return {
    status: ResultStatus.fail,
    message,
    outputs: {}
  };
}
function completeState(stackInfo) {
  if (stackInfo.status === ResultStatus.rollback) {
    return {
      status: ResultStatus.rollback,
      message: "Rollback Complete",
      outputs: stackInfo.outputs.reduce((acc, x) => {
        acc[x.key] = x.value;
        return acc;
      }, {})
    };
  }
  return {
    status: ResultStatus.success,
    message: "Deployment Successful",
    outputs: stackInfo.outputs.reduce((acc, x) => {
      acc[x.key] = x.value;
      return acc;
    }, {})
  };
}
function unknownState() {
  return {
    status: "fail",
    message: "Cloudformation is in an unknown state",
    outputs: {}
  };
}
async function recursiveCheck(io, config, times, timer) {
  const stackInfo = await getCloudFormationStackInfo(
    io.getInfo,
    config.stackName
  );
  if (times === config.maxRetries) {
    return stillInProgressState();
  }
  if (stackInfo.status.includes(ResultStatus.inprogress)) {
    return await checkAgainState(io, config, timer, times);
  }
  if ([ResultStatus.fail, ResultStatus.rollback].includes(stackInfo.status)) {
    return failState(stackInfo.message);
  }
  if (stackInfo.status.includes(ResultStatus.success)) {
    return completeState(stackInfo);
  }
  return unknownState();
}
async function getDeployStatus(props) {
  const region = props.region || process.env.AWS_REGION || "us-east-1";
  return recursiveCheck(
    {
      getInfo: getStackInfo(region),
      getResources: getStackResourceStatus(region)
    },
    props.config,
    1,
    props.config.minRetryInterval
  );
}

// foundation_aws/cfn_getOutputs.mjs
var import_client4 = __toESM(require_src(), 1);
async function getOutputs(props) {
  const aws = await (0, import_client4.default)({
    region: "us-east-1",
    plugins: [Promise.resolve().then(() => (init_src(), src_exports))]
  });
  function getOutput(outputs2, value) {
    const v = outputs2.find((x) => x.OutputKey === value);
    return v ? v.OutputValue : false;
  }
  const input = {
    StackName: props.stack
  };
  try {
    const x = await aws.CloudFormation.DescribeStacks(input);
    if (!x.Stacks || x.Stacks.length === 0) {
      throw new Error("No stacks found with the name " + props.stack);
    }
    const details = x.Stacks[0];
    if (!details.Outputs) {
      return {};
    }
    const res2 = {};
    const outputs2 = details.Outputs;
    for (const o of props.outputs) {
      res2[o] = getOutput(outputs2, o);
    }
    return res2;
  } catch (e) {
    throw new Error(e);
  }
}

// foundation_aws/cfn_removeStack.mjs
var import_client5 = __toESM(require_src(), 1);
async function removeStack(props) {
  const aws = await (0, import_client5.default)({
    region: props.region || process.env.AWS_REGION || "us-east-1",
    plugins: [Promise.resolve().then(() => (init_src(), src_exports))]
  });
  const input = {
    StackName: props.name
  };
  return await aws.CloudFormation.DeleteStack(input);
}

// foundation_aws/lambda_updateLambdaCode.mjs
var import_client6 = __toESM(require_src(), 1);

// foundation_aws/s3_removeFile.mjs
var import_client7 = __toESM(require_src(), 1);

// foundation_aws/s3_uploadFile.mjs
var import_client8 = __toESM(require_src(), 1);

// foundation_aws/s3_emptyBucket.mjs
var import_client9 = __toESM(require_src(), 1);

// foundation_aws/index.mjs
var cloudformation = {
  deployStack,
  getDeployStatus,
  getOutputs,
  removeStack
};

// deploy_infra/print.mjs
function makeCheckmarkIcon() {
  return makeGreenText("\u2714");
}
function makeInProgressIcon() {
  return makeBlueText("\u2022");
}
function makeErrorIcon() {
  return makeRedText("\u2022");
}
function makeStatusText(text) {
  return makeDimText(text);
}
function makeName(text, cellLength) {
  return setTextWidth(text, cellLength);
}
function makeSuccessMessage(name, length, status) {
  return `${makeCheckmarkIcon()} ${makeName(name, length)} ${makeStatusText(
    status
  )}`;
}
function makeInProgressMessage(name, length, status) {
  return `${makeInProgressIcon()} ${makeName(name, length)} ${makeStatusText(
    status
  )}`;
}
function makeErrorMessage(name, length, status) {
  return `${makeErrorIcon()} ${makeName(name, length)} ${makeStatusText(
    status
  )}`;
}
function printResourceStatus(nameLength, resource) {
  const name = resource.id;
  const status = resource.status;
  if (resource.status.includes("COMPLETE")) {
    return makeSuccessMessage(name, nameLength, status);
  }
  if (resource.status.includes("FAILED") || resource.status.includes("ROLLBACK")) {
    return makeErrorMessage(name, nameLength, status);
  }
  return makeInProgressMessage(name, nameLength, status);
}
function getLongestResourceName(resources) {
  return resources.reduce((acc, r) => {
    return r.id.length > acc ? r.id.length : acc;
  }, 0);
}
function formatCloudformationStatus(resources) {
  let text = "";
  const nameLength = getLongestResourceName(resources);
  resources.forEach((resource) => {
    const msg = printResourceStatus(nameLength, resource);
    text = text + msg + "\n";
  });
  return text;
}

// deploy_infra/index.mjs
var deployInfraAction = (io) => async ({ name, region, stage, template: template2, outputs: outputs2 }) => {
  try {
    await io.aws.deployStack({
      name: name + stage,
      region,
      template: template2
    });
    io.cli.clear();
    io.cli.endLoadingMessage();
    io.cli.startLoadingMessage("Deploying CloudFormation Template");
    const res2 = await io.aws.getDeployStatus({
      region,
      config: {
        stackName: name + stage,
        minRetryInterval: 5e3,
        maxRetryInterval: 1e4,
        backoffRate: 1.1,
        maxRetries: 200,
        onCheck: (resources) => {
          io.cli.clear();
          const cfStatus = formatCloudformationStatus(resources);
          io.cli.print(cfStatus);
          io.cli.endLoadingMessage();
          io.cli.startLoadingMessage(
            "Deploying CloudFormation Template"
          );
        }
      }
    });
    io.cli.endLoadingMessage();
    if (res2.status === "fail") {
      throw new Error("CloudFormation deployment has failed");
    }
    if (res2.status === "rollback") {
      throw new Error("Deployment has been rolled back");
    }
    if (res2.status === "inprogress") {
      throw new Error("Deployment is still in progress");
    }
    if (outputs2.length === 0) {
      return {
        status: "ok",
        message: "Template deployed successfully",
        outputs: {}
      };
    }
    const outputsResult = await io.aws.getOutputs({
      stack: name + stage,
      region,
      outputs: outputs2
    });
    io.cli.clear();
    io.cli.printSuccessMessage("Deployment Complete");
    return {
      status: "ok",
      message: "Template deployed successfully",
      outputs: outputsResult
    };
  } catch (e) {
    let message = e instanceof Error ? e.message : "Something unexpected has occurred";
    return {
      status: "error",
      message
    };
  }
};
async function deployInfra({ name, region, stage, template: template2, outputs: outputs2 }) {
  const io = {
    aws: {
      deployStack: cloudformation.deployStack,
      getDeployStatus: cloudformation.getDeployStatus,
      getOutputs: cloudformation.getOutputs
    },
    cli: {
      clear,
      print,
      endLoadingMessage,
      startLoadingMessage,
      printSuccessMessage
    }
  };
  return await deployInfraAction(io)({
    name,
    region,
    stage,
    template: template2,
    outputs: outputs2
  });
}

// foundation_fs/index.mjs
var import_archiver = __toESM(require_archiver(), 1);
function getJsFile(input) {
  const path = input.projectRoot + input.path;
  return import(path);
}

// rise_pipeline/cfn/bucket.mjs
function makeArtifactBucket() {
  return {
    Resources: {
      CodePipelineArtifactStoreBucket: {
        Type: "AWS::S3::Bucket",
        DeletionPolicy: "Retain",
        UpdateReplacePolicy: "Retain",
        Properties: {
          VersioningConfiguration: {
            Status: "Enabled"
          },
          BucketEncryption: {
            ServerSideEncryptionConfiguration: [
              {
                ServerSideEncryptionByDefault: {
                  SSEAlgorithm: "AES256"
                }
              }
            ]
          }
        }
      },
      CodePipelineArtifactStoreBucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          Bucket: {
            Ref: "CodePipelineArtifactStoreBucket"
          },
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "DenyUnEncryptedObjectUploads",
                Effect: "Deny",
                Principal: "*",
                Action: "s3:PutObject",
                Resource: {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "CodePipelineArtifactStoreBucket",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                },
                Condition: {
                  StringNotEquals: {
                    "s3:x-amz-server-side-encryption": "aws:kms"
                  }
                }
              },
              {
                Sid: "DenyInsecureConnections",
                Effect: "Deny",
                Principal: "*",
                Action: "s3:*",
                Resource: {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "CodePipelineArtifactStoreBucket",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                },
                Condition: {
                  Bool: {
                    "aws:SecureTransport": false
                  }
                }
              }
            ]
          }
        }
      }
    }
  };
}

// rise_pipeline/cfn/build.mjs
function makeBuildProject(props) {
  return {
    Resources: {
      ["CodeBuild" + props.name]: {
        Type: "AWS::CodeBuild::Project",
        Properties: {
          Artifacts: {
            Type: "CODEPIPELINE"
          },
          Environment: {
            Type: "LINUX_CONTAINER",
            ComputeType: "BUILD_GENERAL1_SMALL",
            Image: "aws/codebuild/standard:5.0",
            PrivilegedMode: true
          },
          ServiceRole: {
            "Fn::GetAtt": ["CodeBuildServiceRole", "Arn"]
          },
          Name: props.name,
          QueuedTimeoutInMinutes: 5,
          Source: {
            Type: "CODEPIPELINE",
            BuildSpec: props.buildSpec
          }
        }
      },
      CodeBuildServiceRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Principal: {
                  Service: ["codebuild.amazonaws.com"]
                }
              }
            ]
          },
          Path: "/",
          Policies: [
            {
              PolicyName: "CodeBuildLogs",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents"
                    ],
                    Resource: ["*"]
                  }
                ]
              }
            },
            {
              PolicyName: "CodeBuildArtifactsBucket",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "s3:GetObject",
                      "s3:GetObjectVersion",
                      "s3:PutObject"
                    ],
                    Resource: [
                      {
                        "Fn::Sub": "arn:aws:s3:::${CodePipelineArtifactStoreBucket}/*"
                      },
                      "*"
                    ]
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "kms:Decrypt",
                      "kms:Encrypt",
                      "kms:GenerateDataKey"
                    ],
                    Resource: ["*"]
                  }
                ]
              }
            },
            {
              PolicyName: "CodeBuildParameterStore",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: "ssm:GetParameters",
                    Resource: "*"
                  }
                ]
              }
            },
            {
              PolicyName: "CodeConnection",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "codestar-connections:CreateConnection",
                      "codestar-connections:DeleteConnection",
                      "codestar-connections:UseConnection",
                      "codestar-connections:GetConnection",
                      "codestar-connections:ListConnections",
                      "codestar-connections:TagResource",
                      "codestar-connections:ListTagsForResource",
                      "codestar-connections:UntagResource"
                    ],
                    Resource: "*"
                  }
                ]
              }
            },
            {
              PolicyName: "CodeBuildDeploy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "cloudformation:CreateStack",
                      "cloudformation:DescribeStacks",
                      "cloudformation:DeleteStack",
                      "cloudformation:UpdateStack",
                      "cloudformation:CreateChangeSet",
                      "cloudformation:ExecuteChangeSet",
                      "cloudformation:DeleteChangeSet",
                      "cloudformation:DescribeChangeSet",
                      "cloudformation:SetStackPolicy",
                      "cloudformation:SetStackPolicy",
                      "cloudformation:ValidateTemplate"
                    ],
                    Resource: ["*"]
                  },
                  {
                    Effect: "Allow",
                    Action: "*",
                    Resource: "*"
                  }
                ]
              }
            }
          ]
        }
      }
    }
  };
}

// rise_pipeline/cfn/connection.mjs
function makeGithubConnection(name) {
  return {
    Resources: {
      CodeStarConnection: {
        Type: "AWS::CodeStarConnections::Connection",
        Properties: {
          ConnectionName: name,
          ProviderType: "GitHub"
        }
      }
    },
    Outputs: {}
  };
}

// rise_pipeline/cfn/pipeline.mjs
var makeSourceAction = (config) => {
  if (config.platform && config.platform == "code-commit") {
    return {
      OutputArtifacts: [
        {
          Name: config.outputArtifact
        }
      ],
      InputArtifacts: [],
      Name: "source",
      Configuration: {
        RepositoryName: config.repo,
        BranchName: "main",
        PollForSourceChanges: "false"
      },
      ActionTypeId: {
        Version: "1",
        Provider: "CodeCommit",
        Category: "Source",
        Owner: "AWS"
      }
    };
  }
  if (!config.owner) {
    throw new Error("Github Source needs to have an owner defined");
  }
  return {
    Name: config.name,
    ActionTypeId: {
      Category: "Source",
      Owner: "AWS",
      Provider: "CodeStarSourceConnection",
      Version: "1"
    },
    Configuration: {
      ConnectionArn: {
        Ref: "CodeStarConnection"
      },
      FullRepositoryId: `${config.owner}/${config.repo}`,
      BranchName: "main"
    },
    OutputArtifacts: [
      {
        Name: config.outputArtifact
      }
    ]
  };
};
var makeBuildAction = (config) => {
  const envVariables = Object.keys(config.env).map((k) => {
    let v = config.env[k];
    let type = "PLAINTEXT";
    if (v.startsWith("@ssm.")) {
      v = v.split("@ssm.").slice(1).join();
      type = "PARAMETER_STORE";
    }
    if (v.startsWith("@secret.")) {
      v = v.split("@secret.").slice(1).join();
      type = "SECRETS_MANAGER";
    }
    return {
      name: k,
      value: v,
      type
    };
  });
  return {
    Name: config.name,
    ActionTypeId: {
      Category: "Build",
      Owner: "AWS",
      Provider: "CodeBuild",
      Version: "1"
    },
    Configuration: {
      ProjectName: config.projectCFName,
      EnvironmentVariables: JSON.stringify(envVariables)
    },
    InputArtifacts: [
      {
        Name: config.inputArtifact
      }
    ],
    OutputArtifacts: [
      {
        Name: config.outputArtifact
      }
    ]
  };
};
var makeInvokeAction = (config) => {
  return {
    Name: config.name,
    ActionTypeId: {
      Category: "Invoke",
      Owner: "AWS",
      Provider: "Lambda",
      Version: "1"
    },
    Configuration: {
      FunctionName: config.functionName
    },
    OutputArtifacts: [],
    InputArtifacts: [],
    Region: config.region
  };
};
var makeApprovalAction = (config) => {
  return {
    Name: config.name,
    ActionTypeId: {
      Category: "Approval",
      Owner: "AWS",
      Provider: "Manual",
      Version: "1"
    }
  };
};
var makeDeployAction = (config) => {
  return {
    Name: config.name,
    ActionTypeId: {
      Category: "Deploy",
      Owner: "AWS",
      Provider: "CloudFormation",
      Version: "1"
    },
    Configuration: {
      ActionMode: "CREATE_UPDATE",
      Capabilities: "CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND",
      ParameterOverrides: JSON.stringify(config.parameters),
      RoleArn: {
        "Fn::GetAtt": ["CodePipelineServiceRole", "Arn"]
      },
      StackName: config.stackName,
      TemplatePath: `${config.inputArtifact}::${config.template}`
    },
    OutputArtifacts: [],
    InputArtifacts: [
      {
        Name: config.inputArtifact
      }
    ]
  };
};
var makeStage = (config) => {
  const actions = config.actions.map((x) => {
    if (x.type === "SOURCE")
      return makeSourceAction(x);
    if (x.type === "BUILD")
      return makeBuildAction(x);
    if (x.type === "INVOKE")
      return makeInvokeAction(x);
    if (x.type === "APPROVAL")
      return makeApprovalAction(x);
    if (x.type === "DEPLOY")
      return makeDeployAction(x);
    throw new Error("Not a valid action");
  });
  return {
    Name: config.name,
    Actions: actions.map((x, i) => {
      return {
        ...x,
        RunOrder: i + 1
      };
    })
  };
};
function makePipeline(config) {
  const stages = config.stages.map(makeStage);
  return {
    Resources: {
      AppPipeline: {
        Type: "AWS::CodePipeline::Pipeline",
        Properties: {
          Name: config.pipelineName,
          RoleArn: {
            "Fn::GetAtt": ["CodePipelineServiceRole", "Arn"]
          },
          ArtifactStore: {
            Type: "S3",
            Location: {
              Ref: "CodePipelineArtifactStoreBucket"
            }
          },
          Stages: stages
        }
      },
      CodePipelineServiceRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["codepipeline.amazonaws.com"]
                },
                Action: "sts:AssumeRole"
              }
            ]
          },
          Path: "/",
          Policies: [
            {
              PolicyName: "AWS-CodePipeline-Service-3",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "codecommit:CancelUploadArchive",
                      "codecommit:GetBranch",
                      "codecommit:GetCommit",
                      "codecommit:GetUploadArchiveStatus",
                      "codecommit:UploadArchive"
                    ],
                    Resource: "*"
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "codedeploy:CreateDeployment",
                      "codedeploy:GetApplicationRevision",
                      "codedeploy:GetDeployment",
                      "codedeploy:GetDeploymentConfig",
                      "codedeploy:RegisterApplicationRevision"
                    ],
                    Resource: "*"
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "codebuild:BatchGetBuilds",
                      "codebuild:StartBuild"
                    ],
                    Resource: "*"
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "lambda:InvokeFunction",
                      "lambda:ListFunctions"
                    ],
                    Resource: "*"
                  },
                  {
                    Effect: "Allow",
                    Action: ["iam:PassRole"],
                    Resource: "*"
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "elasticbeanstalk:*",
                      "ec2:*",
                      "elasticloadbalancing:*",
                      "autoscaling:*",
                      "cloudwatch:*",
                      "s3:*",
                      "sns:*",
                      "cloudformation:*",
                      "rds:*",
                      "sqs:*",
                      "ecs:*"
                    ],
                    Resource: "*"
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "codestar-connections:UseConnection"
                    ],
                    Resource: [
                      {
                        Ref: "CodeStarConnection"
                      },
                      "*"
                    ]
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "s3:GetObject",
                      "s3:GetObjectVersion",
                      "s3:PutObject"
                    ],
                    Resource: ["*"]
                  },
                  {
                    Effect: "Allow",
                    Action: ["*"],
                    Resource: ["*"]
                  }
                ]
              }
            }
          ]
        }
      }
    }
  };
}

// rise_pipeline/cfn/index.mjs
function makeScript(commands2) {
  let script = `version: 0.2
phases:
    install:
        runtime-versions:
            nodejs: 20

    build:
        commands:`;
  commands2.forEach((c) => {
    script = script + `
            - ` + c;
  });
  return script;
}
var commands = [
  "cd ./app",
  `npm config set '//registry.npmjs.org/:_authToken' "\${NPM_TOKEN}"`,
  `npm i`,
  `npm publish`
];
var res = makeScript(commands);
console.log(res);
function makeCfn(def) {
  let template2 = {
    Resources: {
      ...makeGithubConnection(def.name).Resources,
      ...makeArtifactBucket(def.name).Resources
    },
    Outputs: {}
  };
  let pipelineStages = [];
  for (const s of def.stages) {
    let actions = [];
    for (const x of s.actions) {
      const valid = ["BUILD", "SOURCE", "INVOKE", "APPROVAL", "DEPLOY"];
      if (!valid.includes(x.type)) {
        throw new Error(x.type + " is not a valid action");
      }
      if (x.type === "BUILD") {
        const name = (def.name + x.name).replace(/[^a-zA-Z ]/g, "");
        const build = makeBuildProject({
          name,
          buildSpec: makeScript(x.script),
          env: {}
        });
        template2 = {
          Resources: {
            ...template2.Resources,
            ...build.Resources
          },
          Outputs: {
            ...template2.Outputs,
            ...build.Outputs
          }
        };
        actions.push({
          ...x,
          env: x.env || {},
          projectCFName: name,
          inputArtifact: x.inputArtifact || "sourceZip",
          outputArtifact: x.outputArtifact || x.name + "Zip"
        });
      } else {
        if (x.type === "SOURCE") {
          x.outputArtifact = x.outputArtifact || "sourceZip";
        } else {
          x.inputArtifact = x.inputArtifact || "sourceZip";
          x.outputArtifact = x.outputArtifact || x.name + "Zip";
        }
        actions.push(x);
      }
    }
    pipelineStages.push({
      name: s.name,
      actions
    });
  }
  const pipe = makePipeline({
    pipelineName: def.name,
    stages: pipelineStages
  });
  template2 = {
    Resources: {
      ...template2.Resources,
      ...pipe.Resources
    },
    Outputs: {
      ...template2.Outputs,
      ...pipe.Outputs
    }
  };
  return template2;
}

// rise_pipeline/index.mjs
addCommand({
  command: "deploy",
  action: async () => {
    console.time("\u2705 Deployed Successfully \x1B[2mDeploy Time");
    hideCursor();
    const config = await getJsFile({
      path: "/pipeline.mjs",
      projectRoot: process.cwd()
    });
    const template2 = makeCfn(config);
    startLoadingMessage("Deploying Pipeline");
    const result = await deployInfra({
      name: config.default.name,
      stage: "",
      // flags.stage,
      region: flags.region,
      template: template2,
      outputs: []
    });
    if (result.status === "error") {
      showCursor();
      throw new Error(result.message);
    }
    endLoadingMessage();
    clear();
    console.timeEnd("\u2705 Deployed Successfully \x1B[2mDeploy Time");
    showCursor();
  }
});
/*! Bundled license information:

normalize-path/index.js:
  (*!
   * normalize-path <https://github.com/jonschlinkert/normalize-path>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)

archiver/lib/error.js:
  (**
   * Archiver Core
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

archiver/lib/core.js:
  (**
   * Archiver Core
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   *)

crc-32/crc32.js:
  (*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com *)

zip-stream/index.js:
  (**
   * ZipStream
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-zip-stream/blob/master/LICENSE}
   * @copyright (c) 2014 Chris Talkington, contributors.
   *)

archiver/lib/plugins/zip.js:
  (**
   * ZIP Format Plugin
   *
   * @module plugins/zip
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   *)

archiver/lib/plugins/tar.js:
  (**
   * TAR Format Plugin
   *
   * @module plugins/tar
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   *)

archiver/lib/plugins/json.js:
  (**
   * JSON Format Plugin
   *
   * @module plugins/json
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   *)

archiver/index.js:
  (**
   * Archiver Vending
   *
   * @ignore
   * @license [MIT]{@link https://github.com/archiverjs/node-archiver/blob/master/LICENSE}
   * @copyright (c) 2012-2014 Chris Talkington, contributors.
   *)
*/
