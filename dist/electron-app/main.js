/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/electron-app/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/electron-app/main.js":
/*!**********************************!*\
  !*** ./src/electron-app/main.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n// Modules to control application life and create native browser window\r\nconst { app, BrowserWindow } = __webpack_require__(/*! electron */ \"electron\");\r\nconst { resolve } = __webpack_require__(/*! path */ \"path\");\r\nconst { format } = __webpack_require__(/*! url */ \"url\");\r\n\r\n// Keep a global reference of the window object, if you don't, the window will\r\n// be closed automatically when the JavaScript object is garbage collected.\r\nlet mainWindow;\r\n\r\nfunction createWindow () {\r\n\t// Create the browser window.\r\n\tmainWindow = new BrowserWindow({\r\n\t\twidth: 800,\r\n\t\theight: 600,\r\n\t\ticon: resolve(__dirname, \"icon.png\"),\r\n\t\twebPreferences: {\r\n\t\t\tnodeIntegration: true\r\n\t\t}\r\n\t});\r\n\r\n\t// Remove menu from browser window.\r\n\tmainWindow.setMenu(null);\r\n\r\n\t// Load the index.html of the app.\r\n\tmainWindow.loadURL( true ? format({\r\n\t\thostname: \"localhost\",\r\n\t\tpathname: \"index.html\",\r\n\t\tprotocol: \"http\",\r\n\t\tslashes: true,\r\n\t\tport: 8080\r\n\t}) : undefined);\r\n\r\n\t// Open the DevTools.\r\n\tif(true) {\r\n\t\tmainWindow.webContents.openDevTools();\r\n\t\t__webpack_require__(/*! devtron */ \"devtron\").install();\r\n\t\t__webpack_require__(/*! vue-devtools */ \"vue-devtools\").install();\r\n\t}\r\n\r\n\t// Emitted when the window is closed.\r\n\tmainWindow.on(\"closed\", () => {\r\n\t\t// Dereference the window object, usually you would store windows\r\n\t\t// in an array if your app supports multi windows, this is the time\r\n\t\t// when you should delete the corresponding element.\r\n\t\tmainWindow = null;\r\n\t});\r\n}\r\n\r\n// This method will be called when Electron has finished\r\n// initialization and is ready to create browser windows.\r\n// Some APIs can only be used after this event occurs.\r\napp.on(\"ready\", () => {\r\n\tcreateWindow();\r\n});\r\n\r\n// Quit when all windows are closed.\r\napp.on(\"window-all-closed\", () => {\r\n\t// On macOS it is common for applications and their menu bar\r\n\t// to stay active until the user quits explicitly with Cmd + Q\r\n\tif(process.platform !== \"darwin\") {\r\n\t\tapp.quit();\r\n\t}\r\n});\r\n\r\napp.on(\"activate\", () => {\r\n\t// On macOS it's common to re-create a window in the app when the\r\n\t// dock icon is clicked and there are no other windows open.\r\n\tif(mainWindow === null) {\r\n\t\tcreateWindow();\r\n\t}\r\n});\r\n\r\n// In this file you can include the rest of your app's specific main process\r\n// code. You can also put them in separate files and require them here.\r\n\n\n//# sourceURL=webpack:///./src/electron-app/main.js?");

/***/ }),

/***/ "devtron":
/*!***************************************!*\
  !*** external "require(\"devtron\")" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"devtron\");\n\n//# sourceURL=webpack:///external_%22require(\\%22devtron\\%22)%22?");

/***/ }),

/***/ "electron":
/*!****************************************!*\
  !*** external "require(\"electron\")" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22require(\\%22electron\\%22)%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "url":
/*!***********************************!*\
  !*** external "require(\"url\")" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");\n\n//# sourceURL=webpack:///external_%22require(\\%22url\\%22)%22?");

/***/ }),

/***/ "vue-devtools":
/*!********************************************!*\
  !*** external "require(\"vue-devtools\")" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"vue-devtools\");\n\n//# sourceURL=webpack:///external_%22require(\\%22vue-devtools\\%22)%22?");

/***/ })

/******/ });