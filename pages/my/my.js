var app=getApp();
Page({
  data: {
    list: [
      {
        id: 'settings',
        name: '我的设置',
        open: false,
        pages: []
      }, 
      {
        id: 'help',
        name: '帮助说明',
        open: false,
        pages: []
      },
      {
        id: 'clear',
        name: '清除数据',
        open: false,
        pages: []
      },
      {
        id: 'quit',
        name: '退出小程序',
        open: false,
        pages: []
      }
    ]
  },
  onLoad:function(){
    var that=this;
    that.setData({
      isback_img: app.globalData.isback_img
    })
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id;
    if(id=='quit'){
      app.globalData.quitflag = true;
      wx.reLaunch({
        url: '../asr/asr',
      })
    }else if(id=='clear'){
      try {
        wx.clearStorageSync()
      } catch (e) {
        wx.showToast({
          title: '清除失败',
          image: '../../image/ava_error.png',
          duration: 2000
        })
        return;
      }
      wx.showToast({
        title: '清除成功',
        icon: 'success',
        duration: 2000
      })
    }
  }
})

