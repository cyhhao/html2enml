(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaHRtbDJlbm1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBOzs7SUFHTSxLO0FBQ0YscUJBQWM7QUFBQTs7QUFDVixhQUFLLElBQUwsR0FBWSxFQUFaO0FBQ0g7Ozs7NEJBRUcsSSxFQUFNLEssRUFBTztBQUNiLGdCQUFJLFFBQVEsS0FBSyxJQUFqQixFQUF1QjtBQUNuQixxQkFBSyxJQUFMLENBQVUsSUFBVixFQUFnQixJQUFoQixDQUFxQixLQUFyQjtBQUNILGFBRkQsTUFHSztBQUNELHFCQUFLLElBQUwsQ0FBVSxJQUFWLElBQWtCLENBQUMsS0FBRCxDQUFsQjtBQUNIO0FBQ0o7Ozs0QkFFRyxJLEVBQU07QUFDTixnQkFBSSxRQUFRLEtBQUssSUFBakIsRUFBdUI7QUFDbkIsdUJBQU8sS0FBSyxJQUFMLENBQVUsSUFBVixFQUFnQixDQUFoQixDQUFQO0FBQ0gsYUFGRCxNQUdLO0FBQ0QsdUJBQU8sSUFBUDtBQUNIO0FBQ0o7Ozs0QkFFRyxJLEVBQU07QUFDTixnQkFBSSxLQUFLLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBVDtBQUNBLGdCQUFJLEVBQUosRUFBUTtBQUNKLHFCQUFLLElBQUwsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCLENBQXVCLENBQXZCLEVBQTBCLENBQTFCO0FBQ0g7QUFDRCxtQkFBTyxFQUFQO0FBQ0g7Ozs7OztJQUdDLFM7QUFDRix5QkFBYztBQUFBOztBQUNWLGFBQUssTUFBTCxHQUFjLElBQUksS0FBSixFQUFkO0FBQ0g7Ozs7d0NBRWU7QUFDWixpQkFBSyxzQkFBTDtBQUNIOzs7NkNBR29CO0FBQ2pCLGdCQUFJLFNBQVMsRUFBRSxPQUFGLENBQWI7QUFDQSxnQkFBSSxVQUFVLE9BQU8sSUFBUCxFQUFkO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsT0FBdEI7QUFDQSxtQkFBTyxNQUFQO0FBQ0g7OztnQ0FJTztB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LE9BQU8sVUFBUCxDQUFrQixJQUFsQixDQUFWO0FBQ0EsZ0JBQUksU0FBSixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsSUFBSSxLQUE3QixFQUFvQyxJQUFJLE1BQXhDOztBQUVBLGdCQUFJLFVBQVUsT0FBTyxTQUFQLENBQWlCLFdBQWpCLENBQWQ7QUFDQSxtQkFBTyxPQUFQOztBQUVDO0FBQ0o7Ozs7OztrQkFLVSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBjeWggb24gMTYvNy8yOS5cbiAqL1xuY2xhc3MgR2RpY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRpY3QgPSB7fTtcbiAgICB9XG5cbiAgICBzZXQobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICB0aGlzLmRpY3RbbmFtZV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpY3RbbmFtZV0gPSBbdmFsdWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5kaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0W25hbWVdWzBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvcChuYW1lKSB7XG4gICAgICAgIGxldCByZSA9IHRoaXMuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAocmUpIHtcbiAgICAgICAgICAgIHRoaXMuZGljdFtuYW1lXS5zcGxpY2UoMCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlXG4gICAgfVxufVxuXG5jbGFzcyBodG1sMmVubWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBjc3NqcygpO1xuICAgIH1cblxuICAgIGhpZ2hsaWdodExvYWQoKSB7XG4gICAgICAgIGhsanMuaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpO1xuICAgIH1cblxuXG4gICAgdHJhbnNDc3NCeUFsbFN0eWxlKCkge1xuICAgICAgICBsZXQgc3R5bGVzID0gJCgnc3R5bGUnKTtcbiAgICAgICAgbGV0IGNzc1RleHQgPSBzdHlsZXMudGV4dCgpO1xuICAgICAgICB0aGlzLnRyYW5zQ3NzQnlTdHJpbmcoY3NzVGV4dCk7XG4gICAgICAgIHN0eWxlcy5yZW1vdmUoKTtcbiAgICB9XG5cblxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGxldCB0aGF0PXRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC50cmFuc0Nzc0J5QWxsU3R5bGUoKTtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJBbGxDbGFzcygpO1xuICAgICAgICAgICAgdGhhdC50cmFuc0lkMk5hbWUoKTtcbiAgICAgICAgICAgIHRoYXQudHJhbnNDaGVjazJUb2RvKCk7XG4gICAgICAgICAgICB0aGF0LmNsZWFyQWxsQ2xhc3MoKTtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJBbGxJbWcoKTtcbiAgICAgICAgICAgIHRoYXQudHJhbnNCb2R5KCk7XG5cbiAgICAgICAgfSwgMClcbiAgICB9XG5cbiAgICB0cmFuc0Nzc0J5U3RyaW5nKHN0cikge1xuXG4gICAgICAgIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uIChyZWFsbHlEbywgcmVwbGFjZVdpdGgsIGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIGlmICghUmVnRXhwLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKHJlYWxseURvKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UobmV3IFJlZ0V4cChyZWFsbHlEbywgKGlnbm9yZUNhc2UgPyBcImdpXCIgOiBcImdcIikpLCByZXBsYWNlV2l0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UocmVhbGx5RG8sIHJlcGxhY2VXaXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcGFyc2VkID0gdGhpcy5wYXJzZXIucGFyc2VDU1Moc3RyKTtcbiAgICAgICAgbGV0IHJ1bGVzX2RpY3QgPSBuZXcgR2RpY3QoKTtcbiAgICAgICAgbGV0IHJ1bGVzX2xpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJzZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBvYmogPSBwYXJzZWRbaV07XG4gICAgICAgICAgICBsZXQgc2VsZWN0b3IgPSBvYmouc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2VBbGwoJ1xcbicsICcgJyk7XG5cblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3Rvcik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHNlbGVjdG9yLnNwbGl0KCcsJykpKTtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZWN0b3Iuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGZvciAobGV0IHNsYyBvZiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gdGhpcy5fY2FsUG93ZXIoc2xjKVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5fY2FsUG93ZXIoc2xjKSk7XG4gICAgICAgICAgICAgICAgcnVsZXNfZGljdC5zZXQoY291bnQsIG9iaik7XG4gICAgICAgICAgICAgICAgcnVsZXNfbGlzdC5wdXNoKGNvdW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IG51bSBvZiBydWxlc19saXN0KSB7XG4gICAgICAgICAgICBsZXQgb2JqID0gcnVsZXNfZGljdC5wb3AobnVtKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cob2JqLnNlbGVjdG9yKVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBydWxlIG9mIG9iai5ydWxlcykge1xuICAgICAgICAgICAgICAgICAgICAkKG9iai5zZWxlY3RvcikuY3NzKHJ1bGUuZGlyZWN0aXZlLCBydWxlLnZhbHVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cob2JqLnNlbGVjdG9yLCBlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfY2FsUG93ZXIoc2xjKSB7XG4gICAgICAgIGxldCBsaXN0ID0gc2xjLnNwbGl0KCcgJyk7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IGxpIG9mIGxpc3QpIHtcbiAgICAgICAgICAgIGxldCBlbCA9IGxpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChlbCA9PT0gJycpY29udGludWU7XG4gICAgICAgICAgICBpZiAoZWwuc3RhcnRzV2l0aChcIiNcIikpIHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlbC5zdGFydHNXaXRoKFwiLlwiKSkge1xuICAgICAgICAgICAgICAgIGNvdW50ICs9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZWwuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgICAgICAgICAgY291bnQgPSAtMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHRyYW5zQ3NzQnlEb20oZG9tKSB7XG4gICAgICAgIGxldCBpdCA9ICQoZG9tKTtcbiAgICAgICAgdGhpcy50cmFuc0Nzc0J5U3RyaW5nKGl0LnRleHQoKSk7XG4gICAgICAgIGl0LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHRyYW5zQm9keSgpIHtcbiAgICAgICAgbGV0IGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgICAgIGxldCBoZWFkID0gJCgnaGVhZCcpO1xuICAgICAgICBsZXQgc2NyaXB0ID0gJCgnc2NyaXB0Jyk7XG4gICAgICAgIGxldCBub3RlID0gJCgnPGVuLW5vdGU+PC9lbi1ub3RlPicpO1xuICAgICAgICBzY3JpcHQucmVtb3ZlKCk7XG4gICAgICAgIG5vdGUuaHRtbChib2R5Lmh0bWwoKSk7XG4gICAgICAgIGhlYWQucmVtb3ZlKCk7XG4gICAgICAgIGJvZHkuYWZ0ZXIobm90ZSk7XG4gICAgICAgIGJvZHkucmVtb3ZlKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coMTIzKVxuICAgIH1cblxuICAgIGNsZWFyQWxsQ2xhc3MoKSB7XG4gICAgICAgICQoJ1tjbGFzc10nKS5yZW1vdmVBdHRyKCdjbGFzcycpO1xuICAgIH1cblxuICAgIGNsZWFyQWxsSW1nKCkge1xuICAgICAgICAkKCdpbWcnKS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB0cmFuc0lkMk5hbWUoKSB7XG4gICAgICAgICQoJ1tpZF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBhID0gJCgnPGEgc3R5bGU9XCJiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgY29sb3I6ICMxOTgwZTY7IHRleHQtZGVjb3JhdGlvbjogbm9uZTtcIi8+Jyk7XG4gICAgICAgICAgICBsZXQgJHQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgYS5hdHRyKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkdC5hdHRyKCdpZCcpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICR0LnJlbW92ZUF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAkdC5wcmVwZW5kKGEpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRyYW5zQnJIcigpIHtcbiAgICAgICAgJCgnaHInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCAkdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdC5hZnRlcihcIjxoci8+XCIpO1xuICAgICAgICAgICAgJHQucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdicicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0ICR0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0LmFmdGVyKFwiPGJyLz5cIik7XG4gICAgICAgICAgICAkdC5yZW1vdmUoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0cmFuc0NoZWNrMlRvZG8oKSB7XG4gICAgICAgICQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0ICR0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCR0KTtcbiAgICAgICAgICAgIGxldCB0b2RvID0gJCgnPGVuLXRvZG8vPicpO1xuXG4gICAgICAgICAgICAkdC5hZnRlcih0b2RvKTtcbiAgICAgICAgICAgIGlmICgkdC5wcm9wKFwiY2hlY2tlZFwiKSkge1xuICAgICAgICAgICAgICAgIHRvZG9bMF0uc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ3RydWUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9kb1swXS5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnZmFsc2UnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0QmFzZTY0SW1hZ2UoaW1nKSB7XG4gICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuXG4gICAgICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcblxuICAgICAgICBsZXQgZGF0YVVSTCA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XG4gICAgICAgIHJldHVybiBkYXRhVVJMO1xuXG4gICAgICAgICAvL3JldHVybiBkYXRhVVJMLnJlcGxhY2UoXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIsIFwiXCIpO1xuICAgIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGh0bWwyZW5tbCJdfQ==
