var app=getApp();
Page({
  data: {
    html: '<p class="MsoNormal">	<span><span><span><span><b><span style="font-size:16.0pt;">注册绑定流程<span></span></span></b></span></span></span></span></p><p class="MsoNormal" style="margin-left:52.5pt;text-indent:-52.5pt;">	<span><span><span><span><span><span><strong>Setp 1</strong></span>、输入用户名、密码、手机号码（均为管理员提供给您的信息）<span></span></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:52.5pt;text-indent:-52.5pt;">	<span><span><span><span><span><span><strong>Setp 2</strong></span>、点击提交，等待服务器返回结果<span></span></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:52.5pt;text-indent:-52.5pt;">	<span><span><span><span><span><span><strong>Setp 3</strong></span>、服务器提示注册成功，进入使用指南<span></span></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:52.5pt;text-indent:-52.5pt;">	<span><span><span><span><span><span><strong>Step 4</strong></span>、完成啦。开始享受便捷的服务吧！<span></span></span></span></span></span></span></p><p class="MsoNormal">	<span><span><span><span><span><span>&nbsp;</span></span></span></span></span></span></p><br/><p class="MsoNormal">	<span><span><span><span><span><b><span style="font-size:16.0pt;">重新进入小程序的方法<span></span></span></b></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span><span><span><span><span><span>1</span>、在微信主界面下拉，界面顶端会出现最近使用过的小程序<span></span></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span><span><span><span><span><span>2</span>、通过本学院公众号的菜单链接进入（如果有的话）<span></span></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span><span><span><span><span><span>3</span>、微信“发现”页里的“小程序”，找到本小程序<span></span></span></span></span></span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span><span><span><span><span><span>4</span>、再次扫描小程序二维码进入</span></span></span></span></span><span></span></p>'
  },
  onShow: function () {
    var that = this;
    that.setData({
      //isback_img: app.globalData.isback_img,
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth
    });
  }
})