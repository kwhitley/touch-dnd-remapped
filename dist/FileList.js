// This implementation currently can represent only empty FileLists.
// https://w3c.github.io/FileAPI/#filelist-section
"use strict";

exports.__esModule = true;
function FileList() {
  this.length = 0;
}

FileList.prototype.item = function () {
  return null;
};

exports["default"] = FileList;
module.exports = exports["default"];