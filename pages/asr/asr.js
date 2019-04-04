var app = getApp();
var util = require('../../utils/util.js');

//微信小程序新录音接口，录出来的是aac或者mp3，这里要录成mp3
const mp3Recorder = wx.getRecorderManager()
const mp3RecoderOptions = {
  duration: 60000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 48000,
  format: 'mp3',
  //frameSize: 50
}

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
    if (app.globalData.quitflag) {//如果flag为true，退出  
      wx.navigateBack({
        delta: 1
      })
    } else {
      
    }
    var that = this;

    //onLoad中为录音接口注册两个回调函数，主要是onStop，拿到录音mp3文件的文件名（不用在意文件后辍是.dat还是.mp3，后辍不决定音频格式）
    mp3Recorder.onStart(() => {
    })
    mp3Recorder.onStop((res) => {
      console.log('mp3Recorder.onStop() ' + res)
      const { tempFilePath } = res
      var urls = url + "/admin/pub/asrapi.html";
      console.log('提交');
      if(that.data.recoderflag){processFileUploadForAsr(urls, tempFilePath, this)}
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
      } else if (method=='xh'){
        wx.navigateTo({
          url: '../cjc/cjc?xh='+keyword
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




  /// 以下是调用新接口实现的录音，录出来的是 mp3
  touchdown: function (event) {
    var that = this;
    var currentY = event.touches[0].pageY
    that.setData({ startY: currentY, currentY: currentY})
    console.log('Y:' + currentY);

    mp3Recorder.start(mp3RecoderOptions);
    that.setData({recoderflag:true,showTopTips: true, errorMsg:"放开结束录音,上滑取消录音"})
    wx.showToast({
      title: "上滑取消录音",
      image: "../../image/recoder.gif",
      duration: 100000
    })
  },
  touchup: function (event) {
    var that = this;
    console.log('Y:' + that.data.currentY + ',差值：' + (that.data.startY - that.data.currentY));
    if((that.data.startY-that.data.currentY)>20){
      wx.hideToast();
      wx.showToast({
        title: "录音已经取消",
        image: "../../image/cancel.png",
        duration: 1500
      })
      that.setData({recoderflag:false});
      mp3Recorder.stop();
      that.setData({ showTopTips: false, errorMsg: "" })
    }else{
      mp3Recorder.stop();
      that.setData({ showTopTips: false, errorMsg: "" })
      wx.hideToast()
    }
  },

  //滑动移动事件
  touchmove: function (event) {
    var that=this;
    var currentY = event.touches[0].pageY
    that.setData({currentY: currentY })
    wx.showToast({
      title: "松开取消录音",
      image: "../../image/cancel.png",
      duration: 1500
    })
  }
})

//上传录音文件到 api.happycxz.com 接口，处理语音识别和语义，结果输出到界面
function processFileUploadForAsr(urls, filePath, self) {

  //隐藏中间帮助提示tips框
  typeof self !== 'undefined' && self.setData({
    showHelpTips: false
  })
  
  var skey = wx.getStorageSync('user[skey]');
  wx.uploadFile({
    url: urls,
    filePath: filePath,
    name: 'file',
    formData: { skey: skey, method: 'xm'},
    header: { 'content-type': 'multipart/form-data' },
    success: function (res) {
      self.setData({ editImage: "../../image/edit.png", isEdit: false })
      var result=res.data;
      if (!isJSON(result) && (typeof result == 'string')) { console.log('返回结果错误' + result); self.setData({ showTopTips: true, errorMsg: '服务器错误，请重试' });return; }
      var result =JSON.parse(result);
      console.log(result);
      if (typeof (result.error_code) == "undefined") {
        var data = result.students;
        //var jsonData = JSON.stringify(data);
        //typeof cb == "function" && cb(true, jsonData)
        typeof self !== 'undefined' && self.setData({
          outputTxt: data
        })
        var query = wx.createSelectorQuery();
        typeof self !== 'undefined' && self.setData({
          scrolltop: 0
        })
        self.setData({ showTopTips: false, errorMsg: '' });
        wx.showToast({
          title: "语音查询 OK！",
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
          util.checklogin(self.app);

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