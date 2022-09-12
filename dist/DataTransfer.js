'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _FileList = require('./FileList');

var _FileList2 = _interopRequireDefault(_FileList);

var _parseTextUriList = require('./parseTextUriList');

var _parseTextUriList2 = _interopRequireDefault(_parseTextUriList);

// DataTransfer objects expose the drag data store
// https://html.spec.whatwg.org/multipage/interaction.html#datatransferitem
function DataTransfer(store) {
  this.store = store;
  this.typeTable = {};
  this.effectAllowed = "uninitialized";
  this.types = [];
  this.files = new _FileList2['default']();
}

// DataTransfer.prototype.setDragImage = function (element, x, y) {
//   if (!this.store) {
//     return;
//   }
//   if (this.store.mode !== "readwrite") {
//     return;
//   }

//   var preview = element.cloneNode(true);
//   preview.width = element.clientWidth;
//   preview.height = element.clientHeight;
//   preview.dragPointOffsetX = -x;
//   preview.dragPointOffsetY = -y;

//   this.store.dragPreviewElement = preview;
// };

DataTransfer.prototype.getData = function (format) {
  if (this.store.mode === "protected") {
    return "";
  }

  format = format.toLowerCase();

  var convertToUrl = false;
  if (format === "text") {
    format = "text/plain";
  } else if (format === "url") {
    format = "text/uri-list";
    convertToUrl = true;
  }

  if (!(format in this.typeTable)) {
    return "";
  }

  var result = this.typeTable[format];
  if (convertToUrl) {
    // set result to the first URL from the list,;
    // if any, or the empty string otherwise. [RFC2483];
    result = _parseTextUriList2['default'](result)[0] || "";
  }

  return result;
};

DataTransfer.prototype.setData = function (format, data) {
  if (!this.store) {
    return;
  }
  if (this.store.mode !== "readwrite") {
    return;
  }

  format = format.toLowerCase();

  if (format === "text") {
    format = "text/plain";
  } else if (format === "url") {
    format = "text/uri-list";
  }

  this.typeTable[format] = data;
  this.types = Object.keys(this.typeTable);
};

DataTransfer.prototype.clearData = function (format) {
  var self = this;

  if (!this.store) {
    return;
  }
  if (this.store.mode !== "readwrite") {
    return;
  }

  if (typeof format === "undefined") {
    // Clear all formats (except "Files");
    this.types.filter(function (type) {
      return type !== "Files";
    }).forEach(function (type) {
      return self.clearData(type);
    });

    return;
  }

  format = format.toLowerCase();

  if (format === "text") {
    format = "text/plain";
  } else if (format === "url") {
    format = "text/uri-list";
  }

  delete this.typeTable[format];
  this.types = Object.keys(this.typeTable);
};

exports['default'] = DataTransfer;
module.exports = exports['default'];
