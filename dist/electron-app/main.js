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
eval("\n\n// Modules to control application life and create native browser window\nconst { app, BrowserWindow } = __webpack_require__(/*! electron */ \"electron\");\nconst { resolve } = __webpack_require__(/*! path */ \"path\");\nconst { format } = __webpack_require__(/*! url */ \"url\");\n\n// Keep a global reference of the window object, if you don't, the window will\n// be closed automatically when the JavaScript object is garbage collected.\nlet mainWindow;\n\nfunction createWindow () {\n\t// Create the browser window.\n\tmainWindow = new BrowserWindow({\n\t\twidth: 800,\n\t\theight: 600,\n\t\ticon: resolve(__dirname, \"icon.png\"),\n\t\twebPreferences: {\n\t\t\tnodeIntegration: true,\n\t\t\twebSecurity: false,\n\t\t}\n\t});\n\n\t// Remove menu from browser window.\n\tmainWindow.setMenu(null);\n\n\t// Load the index.html of the app.\n\tmainWindow.loadURL( true ? format({\n\t\thostname: \"localhost\",\n\t\tpathname: \"index.html\",\n\t\tprotocol: \"http\",\n\t\tslashes: true,\n\t\tport: 8080\n\t}) : undefined);\n\n\t// Open the DevTools.\n\tif(true) {\n\t\tmainWindow.webContents.openDevTools();\n\t\t__webpack_require__(/*! devtron */ \"devtron\").install();\n\t\t__webpack_require__(/*! vue-devtools */ \"vue-devtools\").install();\n\t}\n\n\t// Emitted when the window is closed.\n\tmainWindow.on(\"closed\", () => {\n\t\t// Dereference the window object, usually you would store windows\n\t\t// in an array if your app supports multi windows, this is the time\n\t\t// when you should delete the corresponding element.\n\t\tmainWindow = null;\n\t});\n}\n\n// This method will be called when Electron has finished\n// initialization and is ready to create browser windows.\n// Some APIs can only be used after this event occurs.\napp.on(\"ready\", () => {\n\tcreateWindow();\n});\n\n// Quit when all windows are closed.\napp.on(\"window-all-closed\", () => {\n\t// On macOS it is common for applications and their menu bar\n\t// to stay active until the user quits explicitly with Cmd + Q\n\tif(process.platform !== \"darwin\") {\n\t\tapp.quit();\n\t}\n});\n\napp.on(\"activate\", () => {\n\t// On macOS it's common to re-create a window in the app when the\n\t// dock icon is clicked and there are no other windows open.\n\tif(mainWindow === null) {\n\t\tcreateWindow();\n\t}\n});\n\n// In this file you can include the rest of your app's specific main process\n// code. You can also put them in separate files and require them here.\n\n\n//# sourceURL=webpack:///./src/electron-app/main.js?");

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