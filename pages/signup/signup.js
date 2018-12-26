var util = require('../../utils/util.js');
var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    showTopTips: false,
    errorMsg: "",
    xybm: { 'xym': ['人文学院', '商学院', '外国语学院', '电信学院', '生命学院', '医化学院', '艺术与设计学院', '教室教育学院', '航空工程学院', '建筑工程学院', '医学院'], 'xydh': ['rwxy', 'sxy', 'wgyxy', 'dxxy', 'smxy', 'yhxy', 'ysxy', 'jsjyxy', 'hkgcxy', 'jzgcxy', 'yxy']},
    zcxybm:'',

    barcode: "",
    hiddenLoading: true,
    hiddenData: true,
    hiddenDropdown: true,
    hiddenClear: true,
    demoData: '张权',
    Product: {},
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.xybm.xym[e.detail.value])
    this.setData({
      index: e.detail.value,
      zcxybm: this.data.xybm.xydh[e.detail.value]
    })
  },
  onLoad: function () {
    var that = this;
    that.setData({
      isback_img: app.globalData.isback_img,
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth
    });
    console.log(app.globalData.windowHeight);
  },
  bindBarcodeInput: function (e) {
    this.setData({
      barcode: e.detail.value
    })
  },


  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用  
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var phonenumber = e.detail.value.phonenumber;
    var that = this;
    var openid = wx.getStorageSync('openid');
    console.log('否为空');
    util.clearError(that);
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == util.trim(account)) {
      util.isError("账号不能为空", that);
      return;
    }

    // 判断密码是否为空  
    if ("" == util.trim(password)) {
      util.isError("密码不能为空", that);
      return;
    } else {
      util.clearError(that);
    }
    // 判断手机号码是否为空  
    if ("" == util.trim(phonenumber)) {
      util.isError("手机号码不能为空", that);
      return;
    } else {
      util.clearError(that);
    }

    wx.login({
      success: function (res) {
        // 登录成功  
        if (res.code) {
          var code = res.code;
          // 验证都通过了执行注册方法  
          util.req(url+'/admin/pub/register', {
            "code": code,
            "zcxybm": that.data.zcxybm,
            "account": account,
            "password": password,
            "phonenumber": phonenumber
          }, function (res) {
            console.log(res);
            var datamsg = res.data.error;

            switch (datamsg) {
              case 'existname':
                util.isError(res.data.msg, that);
                break;
              case 'errorname':
                util.isError("用户名、密码、手机号码不匹配，请联系管理员！", that);
                break;
              case 'success':
                wx.showModal({
                  title: '注册状态',
                  content: '注册成功，请点击确定登录吧',
                  success: function (res) {
                    if (res.confirm) {
                      // 点击确定后跳转登录页面并关闭当前页面  
                      wx.redirectTo({
                        url: '../help/help'
                      })
                    }
                  }
                })
                break;
              default:
                util.isError("注册失败：未知错误，请联系管理员！", that);
                wx.showToast({
                  title: '注册失败',
                  image: '../../image/ava_error.png',
                  duration: 2000
                })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败！' + res.errMsg
          })
        }
      }
    })
  }
})