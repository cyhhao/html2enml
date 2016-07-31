(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _html2enml = require('./html2enml');

var _html2enml2 = _interopRequireDefault(_html2enml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
    var obj = new _html2enml2.default();
    //obj.highlightLoad();
    obj.start();
}); /**
     * Created by cyh on 16/7/29.
     */

},{"./html2enml":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by cyh on 16/7/29.
 */
var Gdict = function () {
    function Gdict() {
        _classCallCheck(this, Gdict);

        this.dict = {};
    }

    _createClass(Gdict, [{
        key: "set",
        value: function set(name, value) {
            if (name in this.dict) {
                this.dict[name].push(value);
            } else {
                this.dict[name] = [value];
            }
        }
    }, {
        key: "get",
        value: function get(name) {
            if (name in this.dict) {
                return this.dict[name][0];
            } else {
                return null;
            }
        }
    }, {
        key: "pop",
        value: function pop(name) {
            var re = this.get(name);
            if (re) {
                this.dict[name].splice(0, 1);
            }
            return re;
        }
    }]);

    return Gdict;
}();

var html2enml = function () {
    function html2enml() {
        _classCallCheck(this, html2enml);

        this.parser = new cssjs();
    }

    _createClass(html2enml, [{
        key: "highlightLoad",
        value: function highlightLoad() {
            hljs.initHighlightingOnLoad();
        }
    }, {
        key: "transCssByAllStyle",
        value: function transCssByAllStyle() {
            var styles = $('style');
            var cssText = styles.text();
            this.transCssByString(cssText);
            styles.remove();
        }
    }, {
        key: "start",
        value: function start() {
            var that = this;
            setTimeout(function () {
                that.transCssByAllStyle();
                that.clearAllClass();
                that.transId2Name();
                that.transCheck2Todo();
                that.clearAllClass();
                that.clearAllImg();
                that.transBody();
            }, 0);
        }
    }, {
        key: "transCssByString",
        value: function transCssByString(str) {

            String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
                if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                    return this.replace(new RegExp(reallyDo, ignoreCase ? "gi" : "g"), replaceWith);
                } else {
                    return this.replace(reallyDo, replaceWith);
                }
            };

            var parsed = this.parser.parseCSS(str);
            var rules_dict = new Gdict();
            var rules_list = [];
            for (var i = 0; i < parsed.length; i++) {
                var obj = parsed[i];
                var selector = obj.selector;
                selector = selector.replaceAll('\n', ' ');

                //console.log(selector);
                //console.log(JSON.stringify(selector.split(',')));
                var list = selector.split(',');
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var slc = _step.value;

                        var count = this._calPower(slc);
                        //console.log(this._calPower(slc));
                        rules_dict.set(count, obj);
                        rules_list.push(count);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = rules_list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var num = _step2.value;

                    var _obj = rules_dict.pop(num);
                    //console.log(obj.selector)
                    try {
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _obj.rules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var rule = _step3.value;

                                $(_obj.selector).css(rule.directive, rule.value);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    } catch (e) {
                        console.log(_obj.selector, e);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "_calPower",
        value: function _calPower(slc) {
            var list = slc.split(' ');
            var count = 0;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = list[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var li = _step4.value;

                    var el = li.trim();
                    if (el === '') continue;
                    if (el.startsWith("#")) {
                        count += 100;
                    } else if (el.startsWith(".")) {
                        count += 10;
                    } else if (el.startsWith('@')) {
                        count = -1;
                        break;
                    } else {
                        count += 1;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return count;
        }
    }, {
        key: "transCssByDom",
        value: function transCssByDom(dom) {
            var it = $(dom);
            this.transCssByString(it.text());
            it.remove();
        }
    }, {
        key: "transBody",
        value: function transBody() {
            var body = $('body');
            var head = $('head');
            var script = $('script');
            var note = $('<en-note></en-note>');
            script.remove();
            note.html(body.html());
            head.remove();
            body.after(note);
            body.remove();

            console.log(123);
        }
    }, {
        key: "clearAllClass",
        value: function clearAllClass() {
            $('[class]').removeAttr('class');
        }
    }, {
        key: "clearAllImg",
        value: function clearAllImg() {
            $('img').remove();
        }
    }, {
        key: "transId2Name",
        value: function transId2Name() {
            $('[id]').each(function () {
                var a = $('<a style="background: transparent; color: #1980e6; text-decoration: none;"/>');
                var $t = $(this);
                a.attr({
                    name: $t.attr('id')
                });
                $t.removeAttr('id');
                $t.prepend(a);
            });
        }
    }, {
        key: "transBrHr",
        value: function transBrHr() {
            $('hr').each(function () {
                var $t = $(this);
                $t.after("<hr/>");
                $t.remove();
            });
            $('br').each(function () {
                var $t = $(this);
                $t.after("<br/>");
                $t.remove();
            });
        }
    }, {
        key: "transCheck2Todo",
        value: function transCheck2Todo() {
            $('input[type="checkbox"]').each(function () {
                var $t = $(this);
                console.log($t);
                var todo = $('<en-todo/>');

                $t.after(todo);
                if ($t.prop("checked")) {
                    todo[0].setAttribute('checked', 'true');
                } else {
                    todo[0].setAttribute('checked', 'false');
                }

                $t.remove();
            });
        }
    }, {
        key: "getBase64Image",
        value: function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var dataURL = canvas.toDataURL("image/png");
            return dataURL;

            //return dataURL.replace("data:image/png;base64,", "");
        }
    }]);

    return html2enml;
}();

exports.default = html2enml;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2h0bWwyZW5tbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7OztBQUVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUMxQixRQUFJLE1BQU0seUJBQVY7QUFDQTtBQUNBLFFBQUksS0FBSjtBQUVILENBTEQsRSxDQUxBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7O0lBR00sSztBQUNGLHFCQUFjO0FBQUE7O0FBQ1YsYUFBSyxJQUFMLEdBQVksRUFBWjtBQUNIOzs7OzRCQUVHLEksRUFBTSxLLEVBQU87QUFDYixnQkFBSSxRQUFRLEtBQUssSUFBakIsRUFBdUI7QUFDbkIscUJBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsSUFBaEIsQ0FBcUIsS0FBckI7QUFDSCxhQUZELE1BR0s7QUFDRCxxQkFBSyxJQUFMLENBQVUsSUFBVixJQUFrQixDQUFDLEtBQUQsQ0FBbEI7QUFDSDtBQUNKOzs7NEJBRUcsSSxFQUFNO0FBQ04sZ0JBQUksUUFBUSxLQUFLLElBQWpCLEVBQXVCO0FBQ25CLHVCQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsQ0FBaEIsQ0FBUDtBQUNILGFBRkQsTUFHSztBQUNELHVCQUFPLElBQVA7QUFDSDtBQUNKOzs7NEJBRUcsSSxFQUFNO0FBQ04sZ0JBQUksS0FBSyxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQVQ7QUFDQSxnQkFBSSxFQUFKLEVBQVE7QUFDSixxQkFBSyxJQUFMLENBQVUsSUFBVixFQUFnQixNQUFoQixDQUF1QixDQUF2QixFQUEwQixDQUExQjtBQUNIO0FBQ0QsbUJBQU8sRUFBUDtBQUNIOzs7Ozs7SUFHQyxTO0FBQ0YseUJBQWM7QUFBQTs7QUFDVixhQUFLLE1BQUwsR0FBYyxJQUFJLEtBQUosRUFBZDtBQUNIOzs7O3dDQUVlO0FBQ1osaUJBQUssc0JBQUw7QUFDSDs7OzZD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SztBQUNoQixnQkFBSSxTQUFTLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQ0EsbUJBQU8sS0FBUCxHQUFlLElBQUksS0FBbkI7QUFDQSxtQkFBTyxNQUFQLEdBQWdCLElBQUksTUFBcEI7O0FBRUEsZ0JBQUksTUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBVjtBQUNBLGdCQUFJLFNBQUosQ0FBYyxHQUFkLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLElBQUksS0FBN0IsRUFBb0MsSUFBSSxNQUF4Qzs7QUFFQSxnQkFBSSxVQUFVLE9BQU8sU0FBUCxDQUFpQixXQUFqQixDQUFkO0FBQ0EsbUJBQU8sT0FBUDs7QUFFQztBQUNKOzs7Ozs7a0JBS1UsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgY3loIG9uIDE2LzcvMjkuXG4gKi9cbmltcG9ydCBodG1sMmVubWwgZnJvbSAnLi9odG1sMmVubWwnXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgb2JqID0gbmV3IGh0bWwyZW5tbCgpO1xuICAgIC8vb2JqLmhpZ2hsaWdodExvYWQoKTtcbiAgICBvYmouc3RhcnQoKVxuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgY3loIG9uIDE2LzcvMjkuXG4gKi9cbmNsYXNzIEdkaWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kaWN0ID0ge307XG4gICAgfVxuXG4gICAgc2V0KG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGlmIChuYW1lIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgdGhpcy5kaWN0W25hbWVdLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaWN0W25hbWVdID0gW3ZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldChuYW1lKSB7XG4gICAgICAgIGlmIChuYW1lIGluIHRoaXMuZGljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdFtuYW1lXVswXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwb3AobmFtZSkge1xuICAgICAgICBsZXQgcmUgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKHJlKSB7XG4gICAgICAgICAgICB0aGlzLmRpY3RbbmFtZV0uc3BsaWNlKDAsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZVxuICAgIH1cbn1cblxuY2xhc3MgaHRtbDJlbm1sIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgY3NzanMoKTtcbiAgICB9XG5cbiAgICBoaWdobGlnaHRMb2FkKCkge1xuICAgICAgICBobGpzLmluaXRIaWdobGlnaHRpbmdPbkxvYWQoKTtcbiAgICB9XG5cblxuICAgIHRyYW5zQ3NzQnlBbGxTdHlsZSgpIHtcbiAgICAgICAgbGV0IHN0eWxlcyA9ICQoJ3N0eWxlJyk7XG4gICAgICAgIGxldCBjc3NUZXh0ID0gc3R5bGVzLnRleHQoKTtcbiAgICAgICAgdGhpcy50cmFuc0Nzc0J5U3RyaW5nKGNzc1RleHQpO1xuICAgICAgICBzdHlsZXMucmVtb3ZlKCk7XG4gICAgfVxuXG5cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICBsZXQgdGhhdD10aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQudHJhbnNDc3NCeUFsbFN0eWxlKCk7XG4gICAgICAgICAgICB0aGF0LmNsZWFyQWxsQ2xhc3MoKTtcbiAgICAgICAgICAgIHRoYXQudHJhbnNJZDJOYW1lKCk7XG4gICAgICAgICAgICB0aGF0LnRyYW5zQ2hlY2syVG9kbygpO1xuICAgICAgICAgICAgdGhhdC5jbGVhckFsbENsYXNzKCk7XG4gICAgICAgICAgICB0aGF0LmNsZWFyQWxsSW1nKCk7XG4gICAgICAgICAgICB0aGF0LnRyYW5zQm9keSgpO1xuXG4gICAgICAgIH0sIDApXG4gICAgfVxuXG4gICAgdHJhbnNDc3NCeVN0cmluZyhzdHIpIHtcblxuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAocmVhbGx5RG8sIHJlcGxhY2VXaXRoLCBpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBpZiAoIVJlZ0V4cC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihyZWFsbHlEbykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAocmVhbGx5RG8sIChpZ25vcmVDYXNlID8gXCJnaVwiIDogXCJnXCIpKSwgcmVwbGFjZVdpdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKHJlYWxseURvLCByZXBsYWNlV2l0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHBhcnNlZCA9IHRoaXMucGFyc2VyLnBhcnNlQ1NTKHN0cik7XG4gICAgICAgIGxldCBydWxlc19kaWN0ID0gbmV3IEdkaWN0KCk7XG4gICAgICAgIGxldCBydWxlc19saXN0ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgb2JqID0gcGFyc2VkW2ldO1xuICAgICAgICAgICAgbGV0IHNlbGVjdG9yID0gb2JqLnNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlQWxsKCdcXG4nLCAnICcpO1xuXG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3IpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShzZWxlY3Rvci5zcGxpdCgnLCcpKSk7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHNlbGVjdG9yLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IgKGxldCBzbGMgb2YgbGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IHRoaXMuX2NhbFBvd2VyKHNsYylcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuX2NhbFBvd2VyKHNsYykpO1xuICAgICAgICAgICAgICAgIHJ1bGVzX2RpY3Quc2V0KGNvdW50LCBvYmopO1xuICAgICAgICAgICAgICAgIHJ1bGVzX2xpc3QucHVzaChjb3VudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBudW0gb2YgcnVsZXNfbGlzdCkge1xuICAgICAgICAgICAgbGV0IG9iaiA9IHJ1bGVzX2RpY3QucG9wKG51bSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9iai5zZWxlY3RvcilcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcnVsZSBvZiBvYmoucnVsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJChvYmouc2VsZWN0b3IpLmNzcyhydWxlLmRpcmVjdGl2ZSwgcnVsZS52YWx1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9iai5zZWxlY3RvciwgZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2NhbFBvd2VyKHNsYykge1xuICAgICAgICBsZXQgbGlzdCA9IHNsYy5zcGxpdCgnICcpO1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBsaSBvZiBsaXN0KSB7XG4gICAgICAgICAgICBsZXQgZWwgPSBsaS50cmltKCk7XG4gICAgICAgICAgICBpZiAoZWwgPT09ICcnKWNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKGVsLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgY291bnQgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZWwuc3RhcnRzV2l0aChcIi5cIikpIHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGVsLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICAgICAgICAgIGNvdW50ID0gLTE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICB0cmFuc0Nzc0J5RG9tKGRvbSkge1xuICAgICAgICBsZXQgaXQgPSAkKGRvbSk7XG4gICAgICAgIHRoaXMudHJhbnNDc3NCeVN0cmluZyhpdC50ZXh0KCkpO1xuICAgICAgICBpdC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB0cmFuc0JvZHkoKSB7XG4gICAgICAgIGxldCBib2R5ID0gJCgnYm9keScpO1xuICAgICAgICBsZXQgaGVhZCA9ICQoJ2hlYWQnKTtcbiAgICAgICAgbGV0IHNjcmlwdCA9ICQoJ3NjcmlwdCcpO1xuICAgICAgICBsZXQgbm90ZSA9ICQoJzxlbi1ub3RlPjwvZW4tbm90ZT4nKTtcbiAgICAgICAgc2NyaXB0LnJlbW92ZSgpO1xuICAgICAgICBub3RlLmh0bWwoYm9keS5odG1sKCkpO1xuICAgICAgICBoZWFkLnJlbW92ZSgpO1xuICAgICAgICBib2R5LmFmdGVyKG5vdGUpO1xuICAgICAgICBib2R5LnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKDEyMylcbiAgICB9XG5cbiAgICBjbGVhckFsbENsYXNzKCkge1xuICAgICAgICAkKCdbY2xhc3NdJykucmVtb3ZlQXR0cignY2xhc3MnKTtcbiAgICB9XG5cbiAgICBjbGVhckFsbEltZygpIHtcbiAgICAgICAgJCgnaW1nJykucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdHJhbnNJZDJOYW1lKCkge1xuICAgICAgICAkKCdbaWRdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgYSA9ICQoJzxhIHN0eWxlPVwiYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGNvbG9yOiAjMTk4MGU2OyB0ZXh0LWRlY29yYXRpb246IG5vbmU7XCIvPicpO1xuICAgICAgICAgICAgbGV0ICR0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGEuYXR0cih7XG4gICAgICAgICAgICAgICAgbmFtZTogJHQuYXR0cignaWQnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkdC5yZW1vdmVBdHRyKCdpZCcpO1xuICAgICAgICAgICAgJHQucHJlcGVuZChhKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0cmFuc0JySHIoKSB7XG4gICAgICAgICQoJ2hyJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgJHQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHQuYWZ0ZXIoXCI8aHIvPlwiKTtcbiAgICAgICAgICAgICR0LnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnYnInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCAkdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdC5hZnRlcihcIjxici8+XCIpO1xuICAgICAgICAgICAgJHQucmVtb3ZlKCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdHJhbnNDaGVjazJUb2RvKCkge1xuICAgICAgICAkKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCAkdCA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkdCk7XG4gICAgICAgICAgICBsZXQgdG9kbyA9ICQoJzxlbi10b2RvLz4nKTtcblxuICAgICAgICAgICAgJHQuYWZ0ZXIodG9kbyk7XG4gICAgICAgICAgICBpZiAoJHQucHJvcChcImNoZWNrZWRcIikpIHtcbiAgICAgICAgICAgICAgICB0b2RvWzBdLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvZG9bMF0uc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2ZhbHNlJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHQucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEJhc2U2NEltYWdlKGltZykge1xuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcblxuICAgICAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG5cbiAgICAgICAgbGV0IGRhdGFVUkwgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xuICAgICAgICByZXR1cm4gZGF0YVVSTDtcblxuICAgICAgICAgLy9yZXR1cm4gZGF0YVVSTC5yZXBsYWNlKFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiLCBcIlwiKTtcbiAgICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBodG1sMmVubWwiXX0=
