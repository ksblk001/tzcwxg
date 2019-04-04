var app = getApp();
var util = require('../../utils/util.js');
var url = app.globalData.url;

Page({
  data: {
    showHelpTips:true,
    outputTxt:'',
    showTopTips:false,
    errorMsg:'',
    recoderflag:false,
    startY:0,
    currentY:0,
    isAdmin: false,
    isEdit: false,
    editImage: "../../image/edit.png",
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShow(){
    var that=this;
    that.setData({
      isback_img: app.globalData.isback_img,
      windowHeight:app.globalData.windowHeight, 
      windowWidth:app.globalData.windowWidth
      });
    util.checklogin(that,app);

  },


  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },

//修改，完成按钮
  changeEdit: function (e) {
    this.setData({ isEdit: !this.data.isEdit });
    if (this.data.isEdit) {
      this.setData({ editImage: "../../image/done.png" })
      this.setData({ showTopTips: true, errorMsg: '修改模式，点击内容修改，结束点击完成' });
    } else {
      this.setData({ editImage: "../../image/edit.png" })
      this.setData({ showTopTips: false, errorMsg: '修改完成' });
    }
    console.log(this.data.isEdit);

  },
  //修改后点击其他位置触发
  dataEdit: function (e) {
    if (!(e.target.dataset.keyword == e.detail.value)) {
      util.editStuInfo(e.target.dataset.xh, e.target.dataset.method, e.detail.value, e.target.dataset.keyword, e.target.dataset.xydh, this)
      console.log(e.target.dataset.xh);
    }
    //console.log(e.target.dataset.xh);

  },


  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function (e) {
    if (this.endTime - this.startTime < 350) {
      var method = e.target.dataset.method;
      var keyword = e.target.dataset.keyword;
      if (['dh', 'ch', 'fqdh', 'mqdh', 'jtdh'].indexOf(method) != -1) {
        wx.makePhoneCall({
          phoneNumber: keyword, //此号码并非真实电话号码，仅用于测试  
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
      } else if (method == 'xh') {
        wx.navigateTo({
          url: '../cjc/cjc?xh=' + keyword
        })
      }

    } else {
      var method = e.target.dataset.method;
      var keyword = e.target.dataset.keyword;
      console.log(keyword);
      util.requestStuInfo(method, keyword, this);
      console.log("长按");
      wx.showToast({
        title: "加载：" + keyword,
        image: "../../image/0.gif",
        duration: 2000
      })
    }
  },

  touchdown: function (e) {
    this.facestartTime = e.timeStamp;
  },
  touchup: function (e) {
    this.faceendTime = e.timeStamp;
  },
  facetap: function (e) {
    var that=this;

    if (this.faceendTime - this.facestartTime < 350) {
      console.log('短按');
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          processFileUploadForFace(url + '/admin/pub/faceapi.html', tempFilePaths[0], that);
        }
      })
    } else {
      console.log('长按');
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          processFileUploadForFace(url + '/admin/pub/faceapi.html',tempFilePaths[0],that);
        }
      })
    }
  },


})

//上传图像文件接口，处理语音识别和语义，结果输出到界面
function processFileUploadForFace(urls, filePath, self) {
  //隐藏中间帮助提示tips框
  console.log(typeof self);
  typeof self !== 'undefined' && self.setData({
    showHelpTips: false
  })
  
  var skey = wx.getStorageSync('user[skey]');
  wx.uploadFile({
    url: urls,
    filePath: filePath,
    name: 'file',
    formData: { skey: skey, method: 'xh'},
    header: { 'content-type': 'multipart/form-data' },
    success: function (res) {
      self.setData({ editImage: "../../image/edit.png", isEdit: false })
      var result=res.data;
      if (!isJSON(result) && (typeof result == 'string')) { console.log('返回结果错误'+result); return; }
      var result =JSON.parse(result);
      console.log(result);
      if (typeof (result.error_code) == "undefined") {
        var data = result.students;
        //var jsonData = JSON.stringify(data);
        //typeof cb == "function" && cb(true, jsonData)
        typeof self !== 'undefined' && self.setData({
          outputTxt: data,
          showTopTips: true, 
          errorMsg: '相似度值：' + result.confidence + '，结论：' + result.confidenctext
        })
        var query = wx.createSelectorQuery();
        typeof self !== 'undefined' && self.setData({
          scrolltop: 0
        })
        //self.setData({ showTopTips: false, errorMsg: '' });
        wx.showToast({
          title: '人脸识别' + " OK！",
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
          util.checklogin(self,app);

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
    fail: function (res) {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: "网络请求失败，请确保网络是否正常",
        showCancel: false,
        success: function (res) {
        }
      });
      wx.hideToast();
    }
  });
}

//判断反悔结果是否JSON字符串
function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (str.indexOf('{') > -1) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
}