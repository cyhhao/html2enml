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
        this.allowTags=["html","a","abbr","acronym","address","area","b","bdo","big","blockquote","br","caption","center","cite","code","col","colgroup","dd","del","dfn","div","dl","dt","em","font","h1","h2","h3","h4","h5","h6","hr","i","img","ins","kbd","li","map","ol","p","pre","q","s","samp","small","span","strike","strong","sub","sup","table","tbody","td","tfoot","th","thead","title","tr","tt","u","ul","var","xmp","en-media","en-todo","en-note"];
        this.allowAttrs=["style","name","href","src","alt"];
    }


    transCssByAllStyle() {
        let styles = $('style');
        let cssText = styles.text();
        this.transCssByString(cssText);
        styles.remove();
    }

    transCssByAllLink(finishCallback) {
        let that = this;
        let AllLink = $('link[type="text/css"]');
        let all_data = '';
        let count = 0;

        function callback(data) {
            all_data += '\n' + data;

            if (count + 1 === AllLink.length) {
                //console.log(all_data);
                that.transCssByString(all_data)
                finishCallback()
            }
            count++;

        }

        function next(i) {
            if (i === AllLink.length) {
                return callback;
            }
            let dom = AllLink[i];
            $(dom).remove();
            let url = dom.href;
            $.get(url, next(i + 1));
            return callback
        }

        next(0);
    }

    //transCanvas2Background() {
    //    let canvass = $('canvas');
    //    canvass.each(function(){
    //        //console.log(this);
    //        let data = this.toDataURL("image/png");
    //        let it = $(this);
    //        let img = $('<div/>');
    //        img.attr('style', it.attr('style'));
    //        img.attr('class', it.attr('class'));
    //        img.css('width', it.attr('width') + 'px');
    //        img.css('height', it.attr('height') + 'px');
    //        img.css('background', 'url(' + data + ')');
    //
    //        it.after(img);
    //        it.remove()
    //    })
    //}
    transCanvas2Background() {
        let canvass = $('canvas');
        canvass.each(function(){
            let data = this.toDataURL("image/png");
            let it = $(this);
            let img = $('<img/>');
            img.attr('style', it.attr('style'));
            img.attr('class', it.attr('class'));
            img.css('width', it.attr('width') + 'px');
            img.css('height', it.attr('height') + 'px');
            img.attr('src', data);

            it.after(img);
            it.remove()
        })
    }

    start() {
        let that = this;
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

    transCssByLink(dom) {
        let url = dom.href;
        let that = this;
        $.get(url, function (data) {
            that.transCssByString(data);
            $(dom).remove();
        })
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

        //console.log(123)
    }

    clearAllClass() {
        $('[class]').removeAttr('class');
    }

    clearAllUnAllow(tagWhiteList,attrWhiteList,replace) {
        let that=this;
        function dg(node){
            let thisNode=$(node);
            //console.log(node.tagName.toLowerCase());
            if(that.allowTags.indexOf(node.tagName.toLowerCase())>=0){
                //console.log('pass')
                for(let i=0;i<node.attributes.length;i++){
                    let attr=node.attributes[i];
                    if(that.allowAttrs.indexOf(attr.name.toLowerCase())>=0){

                    }
                    else{
                        thisNode.removeAttr(attr.name)
                    }
                }
                for(let child of thisNode.children()){
                    //console.log('child',child)
                    dg(child)
                }
            }
            else{
                if(replace){

                }
                else{
                    thisNode.remove()
                }
            }
        }
        dg($('html')[0]);
        console.log('clear ok')
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
            //console.log($t);
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

    transHtml2Canvas(selector,callback) {
        let selected=$(selector);
        let count=0;
        selected.each(function () {
            let it = $(this);

            html2canvas($(this)[0], {
                onrendered: function (canvas) {
                    // canvas is the final rendered <canvas> element
                    it.empty();
                    it.append(canvas);
                    count++;
                    if(count>=selected.length){
                        callback()
                    }
                }
            });
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

window.html2enml = html2enml;
export default html2enml