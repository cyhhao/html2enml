# 使用方法
引入 `dest/js/html2enml.js`

```HTML
<script src="./dest/js/html2enml.js"></script>
```

然后实例化 html2enml类，并按照顺序调用成员方法。

```javascript
var h2e=new html2enml();
// 调用成员方法
h2e.xxx
```

## 一些需要二次处理的地方
### 1. 根节点还需处理
但由于浏览器环境所限，最终只能做到如下的格式：

```HTML
	<html>
		<en-note>
			...
		</en-note>
	</html>
```
需要你去除最外层的`<html>`和`</html>`，取出`<en-note></en-note>`中的内容，并按照ENML 的规范在头部加上如下声明：

```HTML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
```
具体可参考：
[印象笔记开发者文档-创建笔记](https://dev.yinxiang.com/doc/articles/creating_notes.php)
[印象笔记开发者文档-ENML 规范](https://dev.yinxiang.com/doc/articles/enml.php)

### 2. `<br>`和`<hr>`需做闭合处理

因为在浏览器环境中，无法做到闭合`<br>`和`<hr>`节点。所以需要进行二次处理，这里给出我写的 Python 的处理方式：

```python
# 正则匹配出 html 中的 tag 标签，在它">"前加入"/"闭合它。
def addClose(tag, html):
    # '(<br>)|(<br .*?[^/]>)'
    # '(<hr>)|(<hr .*?[^/]>)'
    re_str = '(<%s>)|(<%s .*?[^/]>)' % (tag, tag)
    br_re = re.compile(re_str)
    lists = br_re.findall(html)

    for li in lists:
        for part in li:
            if part:
                html = html.replace(part, part[:-1] + '/>')

    return html
```

创建笔记代码如下

```python
def makeNote(authToken, noteStore, noteTitle, noteBody, parentNotebook=None):
    # 闭合 br 和 hr 标签
    noteBody = addClose('br', noteBody)
    noteBody = addClose('hr', noteBody)

    # 为<en-note>补充头部声明
    nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
    nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">"
    nBody = '%s%s' % (nBody, noteBody)

    # 创建 Note 对象
    ourNote = Note()
    ourNote.title = noteTitle  # 设置标题
    ourNote.content = nBody    # 设置内容

    # 设置所属笔记本
    if parentNotebook and hasattr(parentNotebook, 'guid'):
        ourNote.notebookGuid = parentNotebook.guid

    try:
        # 创建笔记
        note = noteStore.createNote(authToken, ourNote)
    except EDAMUserException, edue:
        print "EDAMUserException:", edue
        return None
    except EDAMNotFoundException, ednfe:
        print "EDAMNotFoundException: Invalid parent notebook GUID"
        return None
    return note
```

# 转换过程
1. transCssByAllStyle()

	将页面中所有`<style>`标签所包含的 css 按照优先级转化为 HTML 标签的内联 style。
	
2. transId2Name()

	在页面中含有 id 的标签内加入前置的`<a>`标签,并设置`<a>` 标签的 name和 id 一致。**实现印象笔记中锚点链接的作用**
	
3. transCheck2Todo()

	将复选框转化成 `<en-todo>`标签。

4. clearAllClass()

	清除所有 class 属性。

5. clearAllUnAllow()

	清除所有不符合规则的标签及标签属性。

6. transBody()

	清除所有`<head>`、`<script>`、`<style>`，并将 `<body>` 转化为 `<en-note>`
	
7. transCanvas2Background()

	将页面中的 Canvas 转换为 img 标签，图像内容以 base64 的方式填入 src 中。
	
8. transCssByAllLink(callback)

	使用 ajax 将页面中所有 type 为 css 的 Link 标签的 css 内容获取，并转为元素的 inline-style。作用和`transCssByAllStyle()`类似。（如果 link 的源是跨域的，因为浏览器的同源策略限制，使用这个方法是无效的，所以尽量放到`<style>`标签里调用`transCssByAllStyle()`吧。）
	
9. transHtml2Canvas(selector,callback)

	将选中的 HTML 片段转换为 Canvas。selector 为选择器，callback 为转换完毕的回调函数。

	
# 源码说明
因为源代码用 ES6 写的，所以需要 gulp 做编译和构建。
1. 需要有 node 环境
2. 执行`npm install`安装构建工具和依赖
3. 安装完成后，执行 `gulp`
4. 主程序在`src/js/html2enml.js`,依赖在 `src/js/lib` 中

`/dest/js` 路径下文件说明：

- html2enml_only.js ：不含依赖的纯 html2enml 类，使用此js 需手动添加 lib 下的依赖。
- html2enml.js：包含依赖的 html2enml 类。
- app_only：不含依赖的 `src/js/app.js 打包。
- app.js：含依赖的 `src/js/app.js`打包。
- highlight.pack.js：高亮代码的一个js库

样例为 `alltest.html`文件，可在浏览器环境运行看结果。

# 转换过程顺序

一般而言，当HTML中的情况非常复杂，你需要按照一定顺序才能准确高效地完成转换。推荐转换顺序如下：

```
页面渲染完全结束->
transHtml2Canvas->
transCanvas2Background->
transCssByAllLink->
transCssByAllStyle->
transId2Name->transCheck2Todo->
transBody->
clearAllUnAllow


基本思路就是:

先把不兼容的部分转换为 canvas。
再把所有 canvas 转为 base64式的图片。
再把 css 转为 inline,转兼容的标签。
外层大body 转为 en-note。
最后总体过滤一遍所有不支持的标签和属性。

```



