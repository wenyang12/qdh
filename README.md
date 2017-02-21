# 保龄球随机安排球道

## 安装依赖
    npm install

## 启动调试
    npm run dev

## nw.js窗口外观常用属性包括：

- title : 字符串，设置默认 title。
- width/height : 主窗口的大小。
- toolbar : bool 值。是否显示导航栏。
- icon : 窗口的 icon。
- position :字符串。窗口打开时的位置，可以设置为“null”、“center”或者“mouse”。
- min_width/min_height : 窗口的最小值。
- max_width/max_height : 窗口显示的最大值。
- resizable : bool 值。是否允许调整窗口大小。
- always-on-top : bool 值。窗口置顶。
- fullscreen : bool 值。是否全屏显示。
- show_in_taskbar : 是否在任务栏显示图标。
- frame : bool 值。如果设置为 false，程序将无边框显示。

## PS
>以上安装依赖是为了把页面生成桌面程序

要想打包成安装程序需要下载 [innosetup](http://www.jrsoftware.org/isdl.php)