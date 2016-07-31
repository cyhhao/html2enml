# 使用方法
直接引入 `dest/js/app.js`至页面 HTML 中即可。

```HTML
<script src="./dest/js/app.js"></script>
```

会自动在 document ready 之后对页面中的 DOM 进行转换使之变成 ENML 的格式。

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
1. transCssByAllStyle
	将页面中所有`<style>`标签所包含的 css 按照优先级转化为 HTML 标签的内联 style。
2. transId2Name
	在页面中含有 id 的标签内加入前置的`<a>`标签,并设置`<a>` 标签的 name和 id 一致。**实现印象笔记中锚点链接的作用**
	
3. transCheck2Todo
	将复选框转化成 `<en-todo>`标签。

4. clearAllClass
	清除所有 class 属性。

5. clearAllImg
	清除所有`<img>`。（未来可能会提供 `<img>` 转 `<en-media>` 功能）

6. transBody
	清除所有`<head>`、`<script>`、`<style>`，并将 `<body>` 转化为 `<en-note>`
	
# 源码说明
因为源代码用 ES6 写的，所以需要 gulp 做编译和构建。
1. 需要有 node 环境
2. 执行`npm install`安装构建工具和依赖
3. 安装完成后，执行 `gulp`
4. 主程序在`src/js/html2enml.js`,依赖在 `src/js/lib` 中
5. 若想使用`html2enml`类可参考 app.js ，执行`gulp app`即可打包 app.js。

`/dest/js` 路径下文件说明：

- html2enml_only.js ：不含依赖的纯 html2enml 类，使用此js 需手动添加 lib 下的依赖。
- html2enml.js：包含依赖的 html2enml 类。
- app_only：不含依赖的 `src/js/app.js 打包。
- app.js：含依赖的 `src/js/app.js`打包。
- highlight.pack.js：高亮代码的一个js库

样例为 `test.html`文件，可在浏览器环境运行看结果。

