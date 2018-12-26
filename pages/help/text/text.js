var app = getApp();
Page({
  data: {
    html: '<p class="MsoNormal" style="margin-left:32.0pt;text-indent:-32.0pt;">	<b><span style="font-size:16.0pt;">文字查询要点介绍</span></b><span></span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;"> <span><span>1</span>、姓名精确查询<span>: </span><span><span><span>搜索框</span></span></span>输入准确姓名，系统返回详细的资料信息。<span></span></span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;">  <span><span>2</span>、姓名模糊查询<span>: </span><span><span>搜索框输入关键词</span></span>，返回包含该关键词所有学生的详细资料。<span>(</span>例如输入<span>"</span>三<span>"</span>、<span>"</span>丰<span>"</span>、<span>"</span>三丰<span>"</span>等均可查询<span>"</span>张三丰<span>"</span>的详细资料。<span>)</span></span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;"> <span><span>3</span>、其他各类方式查询：可依据学号、寝室、班级、短号、长号等查询<span>: </span>选择后直接在搜索框输入关键词，即可返回相关学生的详细资料。<span></span></span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;"> <span><span>4</span>、学生信息返回后，可以长按基本信息模块的相关信息进行反查。如长按某学生寝室“<span>14-205</span>”，则会返回该寝室的所有成员信息；长按某学生的班级“<span>17</span>信管”，则会返回该班级所有学生的详细信息。<span></span></span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;">  <span><span>5</span>、点击搜索输入框，会弹出最近查询的历史记录（系统最多记录<span>10</span>组记录），点击相应的记录可以快速重新查询。点击清空记录可以清楚查询记录。<span></span></span></p><p class="MsoNormal" style="margin-left:32.0pt;text-indent:-32.0pt;">	<b><span style="font-size:16.0pt;">文字查询图片演示：</span></b><span></span></p><img src="http://sxxy-1253202980.cossh.myqcloud.com/help/text.jpg" alt="" style="max-width:100%;height:auto;box-shadow: 4px 4px 7px #888888;border: 1px solid #DDDDDD;" /><br />  <p class="MsoNormal" style="margin-left:32.0pt;text-indent:-32.0pt;">	<b><span style="font-size:16.0pt;">文字查询视频演示：</span></b><span></span></p><br/>'
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