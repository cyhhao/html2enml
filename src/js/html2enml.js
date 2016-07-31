/**
 * Created by cyh on 16/7/29.
 */
class Gdict {
    constructor() {
        this.dict = {};
    }

    set(name, value) {
        if (name in this.dict) {
            this.dict[name].push(value);
        }
        else {
            this.dict[name] = [value];
        }
    }

    get(name) {
        if (name in this.dict) {
            return this.dict[name][0];
        }
        else {
            return null
        }
    }

    pop(name) {
        let re = this.get(name);
        if (re) {
            this.dict[name].splice(0, 1);
        }
        return re
    }
}

class html2enml {
    constructor() {
        this.parser = new cssjs();
    }

    highlightLoad() {
        hljs.initHighlightingOnLoad();
    }


    transCssByAllStyle() {
        let styles = $('style');
        let cssText = styles.text();
        this.transCssByString(cssText);
        styles.remove();
    }



    start() {
        let that=this;
        setTimeout(function () {
            that.transCssByAllStyle();
            that.clearAllClass();
            that.transId2Name();
            that.transCheck2Todo();
            that.clearAllClass();
            that.clearAllImg();
            that.transBody();

        }, 0)
    }

    transCssByString(str) {

        String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
            if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
            } else {
                return this.replace(reallyDo, replaceWith);
            }
        };

        let parsed = this.parser.parseCSS(str);
        let rules_dict = new Gdict();
        let rules_list = [];
        for (let i = 0; i < parsed.length; i++) {
            let obj = parsed[i];
            let selector = obj.selector;
            selector = selector.replaceAll('\n', ' ');


            //console.log(selector);
            //console.log(JSON.stringify(selector.split(',')));
            let list = selector.split(',');
            for (let slc of list) {
                let count = this._calPower(slc)
                //console.log(this._calPower(slc));
                rules_dict.set(count, obj);
                rules_list.push(count);
            }

        }
        for (let num of rules_list) {
            let obj = rules_dict.pop(num);
            //console.log(obj.selector)
            try {
                for (let rule of obj.rules) {
                    $(obj.selector).css(rule.directive, rule.value)
                }
            }
            catch (e) {
                console.log(obj.selector, e)
            }
        }

    }

    _calPower(slc) {
        let list = slc.split(' ');
        let count = 0;
        for (let li of list) {
            let el = li.trim();
            if (el === '')continue;
            if (el.startsWith("#")) {
                count += 100;
            }
            else if (el.startsWith(".")) {
                count += 10;
            }
            else if (el.startsWith('@')) {
                count = -1;
                break;
            }
            else {
                count += 1;
            }
        }
        return count;
    }

    transCssByDom(dom) {
        let it = $(dom);
        this.transCssByString(it.text());
        it.remove();
    }

    transBody() {
        let body = $('body');
        let head = $('head');
        let script = $('script');
        let note = $('<en-note></en-note>');
        script.remove();
        note.html(body.html());
        head.remove();
        body.after(note);
        body.remove();

        console.log(123)
    }

    clearAllClass() {
        $('[class]').removeAttr('class');
    }

    clearAllImg() {
        $('img').remove();
    }

    transId2Name() {
        $('[id]').each(function () {
            let a = $('<a style="background: transparent; color: #1980e6; text-decoration: none;"/>');
            let $t = $(this);
            a.attr({
                name: $t.attr('id')
            });
            $t.removeAttr('id');
            $t.prepend(a)
        });
    }

    transBrHr() {
        $('hr').each(function () {
            let $t = $(this);
            $t.after("<hr/>");
            $t.remove();
        });
        $('br').each(function () {
            let $t = $(this);
            $t.after("<br/>");
            $t.remove();
        })
    }

    transCheck2Todo() {
        $('input[type="checkbox"]').each(function () {
            let $t = $(this);
            console.log($t);
            let todo = $('<en-todo/>');

            $t.after(todo);
            if ($t.prop("checked")) {
                todo[0].setAttribute('checked', 'true')
            }
            else {
                todo[0].setAttribute('checked', 'false')
            }

            $t.remove();
        });
    }

    getBase64Image(img) {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        let dataURL = canvas.toDataURL("image/png");
        return dataURL;

         //return dataURL.replace("data:image/png;base64,", "");
    }

}


export default html2enml