# Moe2_player
高性能HTML5弹幕播放器 High performance HTML5 danmaku player

### 特点:
- 完全基于html5，移动设备友好，（iphone需要添加到桌面作为webapp方可观看弹幕）
- 性能强大，在多倍于B站最大弹幕覆盖量的情况下，仍然可以达到60fps，如果使用webgl渲染器性能更强
- 3D视角弹幕
- VR虚拟影院
- 非常简单的集成步骤
- 已实现了B站和A站的基本弹幕格式的解析
- 内部实现了弹幕发送和更新的相关方法（基于socket.io,不过暂时没有开放就没有完全集成）

### Demo:
##### https://yjhatfdu.github.io/Moe2_player/dist/
##### https://moe2.tv
##### https://jp.moe2.tv

###  使用入门:
- 引用dist目录下的script,style,images,fonts文件夹至工程目录
- 在网页用引用js以及css
``` html
<link rel="stylesheet" href="style/player.css">
<script src="script/player.min.js"></script>
```
- 建一个容器来存放播放器，容器本身的大小和响应式行为会影响播放器的大小
``` html
<div id='player-container'></div>
```
- 初始化播放器,
```html
<script>
var player=new Moe2.Player(document.querySelector('#player-container'),'可选的视频标题');
player.initVideo('视频的路径.mp4');
player.loadDanmaku('弹幕文件路径.xml','bilibili');
</script>
```
### 手动编译
```shell
npm install
npm run build
```

### 接口文档
- 待完善

###iPhone用户请注意
- 由于苹果的限制，只要在Safari中播放视频，必然会导致一个全屏的系统视频播放器覆盖掉整个页面，所以弹幕和VR都需要在webapp模式下观看。
- 在页面头部添加
```html
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" >
```
然后用户就可以在safari或者安卓的chrome的菜单中选择添加到主屏幕了，添加之后主屏幕会有一个网站的图标（可以自定义），然后通过webapp的图标进入访问网站可以实现inline视频播放以及网页全屏

### 许可
- 非商业用户可以在著名来源的情况下任意使用本项目，修改应遵守Apache2.0开源协议
- 商业用户请与作者联系
