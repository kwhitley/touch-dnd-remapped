'use strict';

exports.__esModule = true;
exports['default'] = setupTouchDNDCustomEvents;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dragPreview = require('./dragPreview');

var _DataTransfer = require('./DataTransfer');

var _DataTransfer2 = _interopRequireDefault(_DataTransfer);

var _simulateEvent = require('./simulateEvent');

var _simulateEvent2 = _interopRequireDefault(_simulateEvent);

var dragOverInterval = 300;

var touchDndCustomEvents = {
  'dataTransfer': null,
  'draggedItem': null,
  'lastDraggedOver': null,
  'dragOvers': null,
  'store': null
};

const getPreviewContainer = () => document.getElementById('touchDndPreviewContainer')

function handleTouchStart(event) {
  var target = event.target;
  if (target.hasAttribute("draggable")) {
    event.preventDefault();

    var x = event.changedTouches[0].clientX;
    var y = event.changedTouches[0].clientY;

    var store = {};
    var dataTransfer = new _DataTransfer2['default'](store);
    touchDndCustomEvents.store = store;
    touchDndCustomEvents.dataTransfer = dataTransfer;
    touchDndCustomEvents.draggedItem = target;

    const styles = window.getComputedStyle(target)

    let cssText = styles.cssText;

    if (!cssText) {
      cssText = Array.from(styles).reduce((str, property) => {
        return `${str}${property}:${styles.getPropertyValue(property)};`;
      }, '');
    }

    const preview = target.cloneNode(true)
    preview.width = target.clientWidth
    preview.height = target.clientHeight
    preview.style.cssText = cssText

    var rect = target.getBoundingClientRect();
    var x = event.targetTouches[0].pageX - rect.left;
    var y = event.targetTouches[0].pageY - rect.top;

    preview.dragPointOffsetX = -x
    preview.dragPointOffsetY = -y

    store.mode = 'readwrite';
    _simulateEvent2['default']('touchdragstart', event, dataTransfer, target);

    // hijack previous pattern
    store.dragPreviewElement = preview
    _dragPreview.updateDragPreview(preview, event.targetTouches[0].pageX, event.targetTouches[0].pageY);
  }
}

function handleTouchMove(event) {
  if (touchDndCustomEvents.draggedItem) {
    (function () {
      event.preventDefault();

      var x = event.changedTouches[0].clientX;
      var y = event.changedTouches[0].clientY;
      var dataTransfer = touchDndCustomEvents.dataTransfer;
      var draggedItem = touchDndCustomEvents.draggedItem;
      var dragPreview = touchDndCustomEvents.store.dragPreviewElement;
      var previewContainer = _dragPreview.updateDragPreview(dragPreview, x, y);

      touchDndCustomEvents.store.mode = 'readwrite';
      _simulateEvent2['default']('touchdrag', event, dataTransfer, draggedItem);

      // hide dragPreview so we can get the element underneath
      previewContainer.hidden = true;

      var draggedOver = document.elementFromPoint(x, y);

      // show dragPreview again
      previewContainer.hidden = false;

      var lastDraggedOver = touchDndCustomEvents.lastDraggedOver;
      if (lastDraggedOver !== draggedOver) {
        if (lastDraggedOver) {
          clearInterval(touchDndCustomEvents.dragOvers);
          _simulateEvent2['default']('touchdragleave', event, dataTransfer, lastDraggedOver);
        }

        _simulateEvent2['default']('touchdragenter', event, dataTransfer, draggedOver);

        touchDndCustomEvents.dragOvers = setInterval(function () {
          _simulateEvent2['default']('touchdragover', event, dataTransfer, draggedOver);
        }, dragOverInterval);

        touchDndCustomEvents.lastDraggedOver = draggedOver;
      }
    })();
  }
}

function handleTouchEnd(event) {
  if (touchDndCustomEvents.draggedItem) {
    event.preventDefault();

    // hide preview container & element before looking for intersection
    getPreviewContainer().hidden = true

    var x = event.changedTouches[0].clientX;
    var y = event.changedTouches[0].clientY;
    var target = document.elementFromPoint(x, y);

    var dataTransfer = touchDndCustomEvents.dataTransfer;

    // Ensure dragover event generation is terminated
    clearInterval(touchDndCustomEvents.dragOvers);

    touchDndCustomEvents.store.mode = 'readonly';
    _simulateEvent2['default']('touchdrop', event, dataTransfer, target);

    touchDndCustomEvents.store.mode = 'protected';
    _simulateEvent2['default']('touchdragend', event, dataTransfer, target);

    touchDndCustomEvents.store = null;
    touchDndCustomEvents.dataTransfer = null;
    touchDndCustomEvents.lastDraggedOver = null;
    touchDndCustomEvents.draggedItem = null;

    _dragPreview.removeDragPreview();
  }
}

function setupTouchDNDCustomEvents() {
  window.touchDndCustomEvents = touchDndCustomEvents;

  var options = {
    capture: true,
    passive: false // indicate that the listener *WILL* call preventDefault()
  };

  document.addEventListener('touchstart', handleTouchStart, options);
  document.addEventListener('touchend', handleTouchEnd, options);
  document.addEventListener('touchmove', handleTouchMove, options);
}

module.exports = exports['default'];
