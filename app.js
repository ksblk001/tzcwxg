//app.js

const corpusList = require('./config').corpus
var UTIL = require('./utils/util.js');

App({
  onShow: function () {
    var that=this;
    try {
      var isback_img = wx.getStorageSync('isback_img')
      if (typeof isback_img=='undefined') {
        that.globalData.isback_img=false;
      }else{
        that.globalData.isback_img=isback_img;
      }
    } catch (e) {
      // Do something when catch error
    }
    console.log(that.globalData.isback_img);
    UTIL.log('App Show')
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.windowWidth = res.windowWidth;
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });
    console.log(that.globalData.windowHeight + ',' + that.globalData.windowWidth);
  },
  onHide: function () {
    UTIL.log('App Hide')
  },
  onLaunch: function () {
    UTIL.log('App Launch')
  },

//
  mycheck:function(cb){
    var that = this
      // 调用登录接口  
      wx.login({
        success: function (res) {
          var code=res.code;
                // 请求自己的服务器  
                wx.request({
                  // 自己的服务接口地址  
                  url: that.globalData.url + '/admin/pub/getsession_key.html',
                  method: 'GET',
                  data: { code: code },
                  success: function (res) {
                    console.log(res);
                    if(res.data.error){
                      console.log('error跳转')
                      wx.navigateTo({
                        url: '../signup/signup'
                      })

                    }else{ 
                      console.log(res.data.skey !== '');
                      if (res.data.skey!='') {
                        wx.setStorageSync('user[skey]', res.data.skey)
                        wx.setStorageSync('user[openid]', res.data.openid)
                        wx.setStorageSync('user[expired_time]', res.data.expired_time)
                        wx.setStorageSync('user[group]', res.data.group)
                      } else {
                        console.log('skey注册');
                        wx.showLoading({
                          title: '验证失败，请注册',
                          mask: true
                        })
                        wx.switchTab({
                          url: '../signup/signup'
                        })
                    }
                    }
                  },
                  fail: function (res) {
                    wx.showLoading({
                      title: '服务器网络错误',
                      mask: true
                    })
                  }
                })
            }
      }) 
  },
//检查登录状态
  checksession:function(){
    var that = this;
    let skey = wx.getStorageSync('skey');
    console.log(skey);
    let expired_time = wx.getStorageSync('expired_time');
    console.log(expired_time);
    var timestamp = (Date.parse(new Date())) / 1000;
    if (skey != '' && timestamp < expired_time) {
      console.log('登录状态有效');
      return true;
    }
    getSessionKey(that.globalData.code);
    if(getSessionKey(that.globalData.code)){return true}
    
    //调用登录接口
    wx.login({
      success: function (user) {
        that.globalData.code = user.code;
        console.log('微信登录');
        var mysession=getSessionKey(user.code)
        console.log('函数结果2：',mysession);
        if (mysession==false){
          return false;
        }else{
          that.globalData.openid = mysession.openid;
          console.log(that.globalData.openid); 
        }
      },
      fail: function () {
        UTIL.log('登录WX失败了！')
      }
    })
  
  },

  getUserInfo:function(cb){
    var that = this
    let skey = wx.getStorageSync('skey');
    let expired_time = wx.getStorageSync('expired_time')
    var timestamp = (Date.parse(new Date()))/1000;
    if(skey!=''&& timestamp<expired_time){
      console.log('登录状态有效');
      //typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (user) {
          that.globalData.code=user.code;
          //that.globalData.openid=getSessionKey(user.code).openid;
          console.log(that.globalData.openid);
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo
              that.globalData.custId = UTIL.getUserUnique(that.globalData.userInfo);
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail:function(res){
              console.log(res);
            }
          })
        },
        fail: function () {
          UTIL.log('登录WX失败了！')
        }
      })
    }
  },



  clearUserInfo: function() {
    var that = this
    that.globalData.userInfo = null;
    that.globalData.hasLogin = false;
  },

  globalData:{
    url: 'https://zhxg.tzc.edu.cn',
    quitflag:false,
    isback_img:false,
    windowHeight: 0,
    windowWidth: 0,
    userInfo:null,
    corpus: corpusList,
    custId: '',
    latitude: 0.0,
    longitude: 0.0,
    speed: 0,
    openid:'',
  }
})

function getSessionKey(code,session) {
  var sessionresult;
  wx.request({
    url: that.globalData.url + '/admin/pub/getsession_key.html',//requestUrl,
    data: {
      code: code,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: function (result) {
      if(result.data.errcode==null){
        wx.setStorageSync('skey', result.data.skey);
        wx.setStorageSync('openid', result.data.openid);
        wx.setStorageSync('expired_time', result.data.expired_time);
        wx.setStorageSync('group', result.data.group);
        console.log('成功的结果：',result.data);
        sessionresult=result.data;
      }else{
        console.log('错误');
        sessionresult=false;
      }
    },
    fail: function ({ errMsg }) {
      console.log('错误'+code);
      sessionresult=false;
    }
  })
  console.log('函数的结果',sessionresult);
  return sessionresult;
}