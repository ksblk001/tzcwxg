// pages/settings/settings.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isback_img:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      isback_img: app.globalData.isback_img
    });
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  switch1back_img:function(e){
    var that = this;
    app.globalData.isback_img = e.detail.value;
    that.setData({
      isback_img: e.detail.value
    });
    wx.setStorage({
      key: "isback_img",
      data: e.detail.value
    })
  }
})