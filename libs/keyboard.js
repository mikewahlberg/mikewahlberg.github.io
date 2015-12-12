window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  A: 65,
  W: 87,
  D: 68,
  S: 83,
  H: 72,
  L: 76,
  J: 74,
  K: 75,
  U: 85,
  LEFT: 76,
  UP: 85,
  DOWN: 68,
  PAGEUP: 33,
  PAGEDOWN: 34,
  TAB: 75,
  ESCAPE: 65,
  SPACE: 32,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};
