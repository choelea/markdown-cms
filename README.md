

Markdown-CMS 是一款可以在线编辑并解析Markdown内容称网页的nodejs app；借助于github， markdown可以快速搭建无需任何数据库的个人知识站点。其代码构建于Raneto的初始代码之上，主要修复/优化了以下：
- 对中文的支持
- 编辑器更换为 [simplemde-plus](https://github.com/choelea/simplemde-plus)
- markdown 解析更换为joe-marked (raneto和核心库raneto.js 很多都被joe-marked所取代)
- 图片上传
- 其他细节修复
- 增加github和集成，支持在线编辑后提交至github，同时本地编辑push后自动更新。

Markdown-CMS精简了一些个人认为无用的：
- rtl_layout  从右向左的排版 (少部分国家适用)

> Raneto代码已有几年未更新，Markdown-cms只做功能上的优化，以适用为目的。

# Mark文档编写约定
在线查阅请访问 [旧书 Tech. Docs 官网](http://tech.jiu-shu.com)
## 文档注意事项
- 文件名不要出现‘.’
- 尽量使用英文文件夹；尽量使用英文文件名；文件夹名称需要注意大小写（IT Technologies会引发错误，正确的写法是It Technologies）
- 文件夹和文件名避免使用空格，可以使用-作为连接符
- 文件的最前端定义的meta信息必须遵循如下格式

## 文档meta信息的格式
```
---
Title: Tech Docs
Description: Tech Docs collects all documents written by Joe.
ShowOnHome: false // 只用于根目录下面的文件，文件夹中的文件不能加这个属性。
...
```
# GIT相关问题应对
在linux上clone后，如果通过了chmod来修改文件夹及子目录的权限后，所有目录的文件git状态变成modified； 如果尝试用 `git diff` 查看会发现类似如下信息：

```shell
diff --git a/Dev-Ops/Centos-Common-Commands.md b/Dev-Ops/Centos-Common-Commands.md
old mode 100644
new mode 10075
```


以上是权限模型改变导致的，可以通过设置 `git config core.filemode false` 绕过这个问题：

# GITHUB Webhooks 使用
通过github的webhooks，可以对github的仓库在服务端的事件进行监听并且发送post请求。 可以在我们的web server端来接受post请求做出相应的操作。本repo设置了webhooks的请求，相应的push事件会触发[旧书 Tech. Docs 官网](http://tech.jiu-shu.com)上的文档的更新。
> webhooks最好使用了secret保护; 参考文档： https://developer.github.com/webhooks/securing/。
