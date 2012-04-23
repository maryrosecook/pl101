var endTime = function (time, expr) {
  if(expr.tag === 'note' || expr.tag === 'rest') {
    return time + expr.dur;
  }
  else if(expr.tag === 'seq') {
    return endTime(time, expr.left) + endTime(time, expr.right);
  }
  else if(expr.tag === 'par') {
    return Math.max(endTime(time, expr.left), endTime(time, expr.right));
  }
  else if(expr.tag === 'repeat') {
    return time + (endTime(0, expr.section) * expr.count);
  }
};

var compileRunning = function(expr, time) {
  if(expr.tag === 'note' || expr.tag === 'rest') {
    return [{
      tag: expr.tag, pitch: expr.pitch, dur: expr.dur,
      start: time
    }];
  }
  else if(expr.tag === 'seq') {
    return compileRunning(expr.left,
                          time)
      .concat(
        compileRunning(expr.right,
                       endTime(time, expr.left)));
  }
  else if(expr.tag === 'par') {
    return compileRunning(expr.left, time)
      .concat(
        compileRunning(expr.right, time));

  }
  else if(expr.tag === 'repeat') {
    var ret = [];
    for(var i = 0; i < expr.count; i++) {
      ret = ret.concat(compileRunning(expr.section, time));
      time += endTime(0, expr.section);
    }

    return ret;
  }
};

var compile = function (musexpr) {
  return compileRunning(musexpr, 0);
};


var melody_mus = {
  tag: 'seq',
  left: {
    tag: 'repeat', count: 2,
    section: {
      tag: 'seq',
      left: {
        tag: 'repeat', count: 2,
        section: {
          tag: 'note', pitch: 'a4', dur: 250
        }
      },
      right: { tag: 'note', pitch: 'b4', dur: 250 }
    }
  },
  right: {
    tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 500 },
    right: { tag: 'note', pitch: 'd4', dur: 500 }
  }
};

console.log(melody_mus);
console.log(compile(melody_mus));