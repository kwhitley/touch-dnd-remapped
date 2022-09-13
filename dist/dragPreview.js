'use strict';

exports.__esModule = true;
var ID = 'touchDndPreviewContainer';

function addDragPreview(preview) {
  var container = document.createElement('div');

  container.id = ID;
  container.appendChild(preview);
  document.body.appendChild(container);

  return container;
}

function removeDragPreview() {
  var container = document.getElementById(ID);
  if (container) {
    document.body.removeChild(container);
  }
}

function updateDragPreview(preview, x, y) {
  var container = document.getElementById(ID) || addDragPreview(preview);

  container.style.position = 'fixed';
  container.style.top = y + preview.dragPointOffsetY + window.scrollY + 'px';
  container.style.left = x + preview.dragPointOffsetX + window.scrollX + 'px';
  container.style.width = preview.width + 'px';
  container.style.height = preview.height + 'px';

  return container;
}

exports['default'] = {
  removeDragPreview: removeDragPreview,
  updateDragPreview: updateDragPreview
};
module.exports = exports['default'];
