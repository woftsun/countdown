# 摸鱼提醒小插件

晚上闲来无事写了个小插件

## 使用方法
[点击安装](http://assets.woftsun.cn/countdown.zip)

1. 下载后解压，解压后文件夹内还有一个`countdown`文件夹，使用时用里面这个
2. 以chrome浏览器为例，打开浏览器，点击右上角的三个点，选择更多工具，选择扩展程序（别的六拉你去也一样找到扩展程序即可）
3. 在扩展程序页面右上角打开开发者模式，然后点击左上角加载已解压的扩展程序，选择刚才解压的`countdown`文件夹，就可以了
   ![应用图片1](https://photo.woftsun.cn/images/2023/09/03/QQ20230903232924.md.png)
    ![应用图片2](https://photo.woftsun.cn/images/2023/09/03/image.md.png)
4. 点击右上角的插件图标，输入你想要的时间，点击开始倒计时，就可以了
   ![应用图片3](https://photo.woftsun.cn/image/1ZQ)

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/workflows#submit-your-extension) and you should be on your way for automated submission!
