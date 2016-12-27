"use strict";

var setCol = function setCol(min, max, n, prefix) {
  var cLength = max - min + 1;
  var candidates = Array.from({ length: cLength }, function (_, i) {
    return i + min;
  });
  Array.from({ length: n }).forEach(function (_, i) {
    var idx = Math.floor(Math.random() * candidates.length);
    var v = candidates[idx];
    candidates.splice(idx, 1);
    document.getElementById('js-cell-label-' + prefix + i).textContent = v;
  });
};

setCol(1, 15, 5, 'B');
setCol(16, 30, 5, 'I');
setCol(31, 45, 4, 'N');
setCol(46, 60, 5, 'G');
setCol(61, 75, 5, 'O');
document.getElementById('js-cell-label-Nfree').textContent = 'Free';

require('./index.scss');
