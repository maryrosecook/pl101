var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');

var peg = fs.readFileSync('my.peg', 'utf-8');
var parse = PEG.buildParser(peg).parse;

// atoms
assert.deepEqual(parse("a"), "a");
assert.deepEqual(parse("1"), "1");
assert.deepEqual(parse("aaaa"), "aaaa");

// atom lists
assert.deepEqual(parse("(a)"), ["a"]);
assert.deepEqual(parse("(a b)"), ["a", "b"]);
assert.deepEqual(parse("(a b c)"), ["a", "b", "c"]);

// expression lists
assert.deepEqual(parse("(+ 1 (f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]]);

// whitespace
assert.deepEqual(parse("(a    b   c)"), ["a", "b", "c"]); // more spaces
assert.deepEqual(parse("(a	b)"), ["a", "b"]); // tab
assert.deepEqual(parse("(a \n b)"), ["a", "b"]); // newline

// quotes
assert.deepEqual(parse("'x"), ["quote", "x"]);
assert.deepEqual(parse("'(a b c)"), ["quote", ["a", "b", "c"]]);

// comments
assert.deepEqual(parse("( a\n;; yeah woo\nb)"), ["a", "b"]);

console.log("Passed")