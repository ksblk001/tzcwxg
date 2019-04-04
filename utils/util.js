//获取应用实例
//var app = require('../app.js');

var Guid = require('./GUID.js');

var uuidSaved = '';
var url ='https://zhxg.tzc.edu.cn';
// 去前后空格 
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "")
}


//log接口封装
function log(obj) {
  console.log(obj)
}

//获取用户唯一标识，NLI接口中要上传用户唯一标识，这里获取：第一次登录时生成的uuid+微信号所在地+昵称
function getUserUnique(userInfo) {
  //从缓存中读取uuid
  if (typeof uuidSaved === 'undefined' || uuidSaved === '') {
    var tmpUuid = wx.getStorageSync('uuid');
    if (typeof tmpUuid === 'undefined' || tmpUuid === '') {
      uuidSaved = Guid.NewGuid();
      wx.setStorageSync('uuid', uuidSaved);
    } else {
      uuidSaved = tmpUuid;
    }
  }

  var unique = uuidSaved;
  if (userInfo != null) {
    unique += '_' + userInfo.province + '_' + userInfo.nickName;
  }
  log('getUserUnique() return:' + unique)
  return unique;
}


function requestStuInfo(method, keyword, self,app) {

  //隐藏中间帮助提示tips框
  typeof self !== 'undefined' && self.setData({
    showHelpTips: false
  })

  var skey = wx.getStorageSync('user[skey]');
  console.log(method + ',' + keyword);
  var urls = url + "/admin/pub/xcxapi.html";//查询数据的URL 
  wx.request({
    url: urls,
    data: { keyword: keyword, skey: skey, method: method },
    method: 'GET',
    success: function (res) {
      self.setData({ editImage: "../../image/edit.png", isEdit: false })
      var result = res.data;
      console.log(result);
      if (typeof (result.error_code) == "undefined") {
        var data = result.students;
        //var jsonData = JSON.stringify(data);
        //typeof cb == "function" && cb(true, jsonData)
        console.log(data);
        typeof self !== 'undefined' && self.setData({
          outputTxt: data
        })
        var query = wx.createSelectorQuery();
        typeof self !== 'undefined' && self.setData({
          scrolltop: 0
        })
        self.setData({ showTopTips: false, errorMsg: '' });
        wx.showToast({
          title: keyword + " OK！",
          icon: 'success',
          duration: 2000
        })
      } else {
        if (result.error_code == '002') {
          try {
            wx.removeStorageSync('user[skey]');
          } catch (e) {
            // Do something when catch error
          }
          checklogin(self,app);

        }
        self.setData({ hiddenData: true });
        self.setData({ showTopTips: true, errorMsg: result.error_message });
        wx.showToast({
          title: result.error_message,
          image: '../../image/ava_error.png',
          duration: 2000
        })
        return;
      }
    },
    fail: function (e) {
      var toastText = '获取数据失败' + JSON.stringify(e);
      self.setData({
        hiddenLoading: !self.data.hiddenLoading,
        hiddenData: true
      });
      wx.showToast({
        title: toastText,
        icon: '',
        duration: 2000
      })
    },
    complete: function () {
      // complete  
    }
  })
}


//修改学生信息数据
function editStuInfo(xh, method, keyword, oldkeyword, xydh, self,app) {

  var skey = wx.getStorageSync('user[skey]');
  var urls = url + "/admin/pub/xcxeditapi.html";//查询数据的URL 
  wx.request({
    url: urls,
    data: { xh: xh, keyword: keyword, oldkeyword: oldkeyword, skey: skey, method: method, xydh: xydh },
    method: 'GET',
    success: function (res) {
      var result = res.data;
      console.log(result);
      if (typeof (result.error_code) == "undefined") {
        self.setData({ showTopTips: false, errorMsg: '' });
        wx.showToast({
          title: result.message,
          icon: 'success',
          duration: 2000
        })
        requestStuInfo('xh', xh, self);
      } else {
        if (result.error_code == '002') {
          try {
            wx.removeStorageSync('user[skey]');
          } catch (e) {
            // Do something when catch error
          }
          checklogin(self,app);

        }
        self.setData({ hiddenData: true });
        self.setData({ showTopTips: true, errorMsg: result.error_message });
        wx.showToast({
          title: result.error_message,
          image: '../../image/ava_error.png',
          duration: 2000
        })
        return;
      }
    },
    fail: function (e) {
      var toastText = '获取数据失败' + JSON.stringify(e);
      self.setData({
        hiddenLoading: !self.data.hiddenLoading,
        hiddenData: true
      });
      wx.showToast({
        title: toastText,
        icon: '',
        duration: 2000
      })
    },
    complete: function () {
      // complete  
    }
  })
}

//检查登录状态
function checklogin(self,app) {
  var skey = wx.getStorageSync('user[skey]')
  var openid = wx.getStorageSync('user[openid]')
  var expired_time = wx.getStorageSync('user[expired_time]')
  var group = wx.getStorageSync('user[group]')
  var timestamp = (Date.parse(new Date())) / 1000;
  if (skey != '' && timestamp < expired_time) {
    if (group == "管理员" || group == "admin") {
      self.setData({ isAdmin: true })
    }
    return;
  }
  login(self,app);
}

//重新获取登录状态
function login(self,app) {
  var timeflag = Date.parse(new Date());
  wx.showLoading({
    title: '登录验证中',
    mask: true
  })
  // 因为我需要登录后的用户信息,但是app.getUserInfo和下面的request请求基本上是同时请求的所以获取不到  
  app.mycheck();
  // 在这里我设置了一个定时器循环多次去执行去判断上一步的函数执行完毕没有  
  // 但是也不能无限循环,所以要叫一个判断当执行超过多少秒后报一个网络错误  
  var times = setInterval(function () {
    // 因为一开始缓存当中指定的key为假当为真的时候就说明上一步成功了这时候就可以开始发送下一步的请求了  
    try {
      var skey = wx.getStorageSync('user[skey]')
    } catch (e) {

    }

    try {
      var openid = wx.getStorageSync('user[openid]')
    } catch (e) {

    }

    try {
      var expired_time = wx.getStorageSync('user[expired_time]')
    } catch (e) {

    }

    try {
      var group = wx.getStorageSync('user[group]')
    } catch (e) {

    }

    if (group == "管理员" || group == "admin") {
      self.setData({ isAdmin: true })
    }

    var timestamp = (Date.parse(new Date())) / 1000;
    console.log('开始判断成功没');
    if (skey != '' && timestamp < expired_time) {
      // 在这里停止加载的提示框  
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      // 这里必须要清除不然就等着循环死吧  
      clearTimeout(times);

      self.setData({ showTopTips: false, errorMsg: '' });

      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 1500
      })
    } else {
      if (Date.parse(new Date()) > (timeflag + 8000)) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        // 这里必须要清除不然就等着循环死吧  
        clearTimeout(times);
        wx.showToast({
          title: '登录验证失败',
          image: '../../image/ava_error.png',
          duration: 1500
        })
      }

    }
  }, 1000);
}


module.exports = {
  trim:trim,
  log: log,
  getUserUnique: getUserUnique,
  requestStuInfo: requestStuInfo,
  editStuInfo: editStuInfo,
  checklogin:checklogin,
  login:login
}
