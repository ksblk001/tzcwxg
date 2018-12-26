var app = getApp();

var url = app.globalData.url;

Page({
  data: {
    resultData:[],
    myitem: [],
    querylog: [],
    content: [],
    commits: [['学号', 'xh'], ['姓名', 'xm'], ['寝室', 'xsqs'], ['班级', 'bj'], ['短号', 'dh'], ['长号', 'ch'], ['民族', 'mz'], ['政治面貌', 'zzmm'], ['籍贯', 'jg'], ['性别', 'xb'], ['父亲姓名', 'fqxm'], ['父亲电话', 'fqdh'], ['母亲姓名', 'mqxm'], ['母亲电话', 'mqdh']],
    nzopen: false,
    nzshow: false,
    isfull: false,
    shownavindex: '',

    method: 'xm',
    commit: '姓名',

    showHelpTips: true,
    showTopTips: false,
    errorMsg: "",
    outputTxt: '',
    scrolltop: 0,

    barcode: "",
    hiddenLoading: true,
    hiddenData: true,
    hiddenDropdown: true,
    hiddenClear: true,
    demoData: '张权',
    Product: {},
  },
  onLoad: function (option) {
    wx.showShareMenu({
      withShareTicket: true
    })
    requestStuInfo('xh', option.xh, this);
    console.log(option.xh)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      isback_img: app.globalData.isback_img,
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth
    });
    
    checklogin(that);
  },

  onReachBottom: function () {
    console.log('index.onReachBottom')
  },

  //点击子列表展开收起
  mylistItemTap(e) {
    var Index = e.currentTarget.dataset.index;//点击的内层下标
    console.log(e.currentTarget.dataset.bindex);
    //myitem = this.data.resultData[e.target.dataset.bindex]['kclist'];
    var resultData = this.data.resultData
    var myitem = resultData[e.currentTarget.dataset.bindex]['kclist'];
    myitem[Index].show = !myitem[Index].show || false;//变换其打开、关闭的状态
    if (myitem[Index].show) {//如果是操作的打开状态，那么就让同级的其他列表变为关闭状态，保持始终只有一个打开
      for (let i = 0, len = myitem.length; i < len; i++) {
        if (i != Index) {
          myitem[i].show = false;
        }
      }
    }
    resultData[e.currentTarget.dataset.bindex]['kclist']=myitem;

    this.setData({ resultData: resultData });
  },

  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        nzshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.commits,
        nzopen: true,
        nzshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  hidebg: function (e) {

    this.setData({
      nzopen: false,
      nzshow: false,
      isfull: false,
      shownavindex: 0
    })
  },

  checkselect: function (e) {
    const method = e.target.dataset.method
    const commit = e.target.dataset.commit
    this.setData({
      method: method,
      commit: commit
    })
    this.setData({
      nzopen: false,
      nzshow: false,
      isfull: false,
      shownavindex: 0
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
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
      }

    } else {
      var method = e.target.dataset.method;
      var keyword = e.target.dataset.keyword;
      console.log(keyword);
      requestStuInfo(method, keyword, this);
      console.log("长按");
      wx.showToast({
        title: "加载：" + keyword,
        image: "../../image/0.gif",
        duration: 2000
      })
    }
  },
  bingLongTap: function (e) {
    //console.log("长按");
  },

  bindBarcodeInput: function (e) {
    this.setData({
      barcode: e.detail.value
    })
  },
  bindBarcodeFocus: function (e) {
    this.setData({
      querylog: wx.getStorageSync('querylog'),
      hiddenDropdown: false,
      hiddenClear: false
    })
  },
  bindBarcodeBlur: function (e) {
    this.setData({
      hiddenDropdown: true,
      hiddenClear: true
    })
  },
  setDemoData: function (e) {
    var method = e.target.dataset.method;
    var keyword = e.target.dataset.keyword;
    var commit = e.target.dataset.commit;
    this.setData({
      method: method,
      commit: commit,
      barcode: keyword
    });
  },
  clear: function (e) {
    wx.removeStorageSync('querylog');
    this.setData({
      barcode: "",
      hiddenData: true,
      querylog: ""
    });
  },
  query: function (e) {
    var that = this;
    if (that.data.barcode == undefined
      || that.data.barcode == null
      || that.data.barcode.length <= 0) {
      that.setData({ hiddenData: true });
      wx.showToast({
        title: '请输入关键词',
        image: '../../image/ava_error.png',
        duration: 2000
      });
      return;
    }
    var method = this.data.method;
    var keyword = that.data.barcode
    var commit = this.data.commit;
    requestStuInfo(method, keyword, this);
    var querytmp = [];
    if (wx.getStorageSync('querylog') != '') {
      querytmp = wx.getStorageSync('querylog')
    }
    querytmp.splice(9, 1);
    querytmp.splice(0, 0, [method, keyword, commit]);
    that.setData({ querylog: querytmp });
    wx.setStorageSync('querylog', querytmp);
    //console.log(that.data.querylog);

  },
})

function requestStuInfo(method, keyword, self) {
  self.setData({ showTopTips: true, errorMsg: '查询中...请稍等！' });
  //隐藏中间帮助提示tips框
  typeof self !== 'undefined' && self.setData({
    showHelpTips: false
  })

  var skey = wx.getStorageSync('user[skey]');
  console.log(method + ',' + keyword);
  var urls = url + "/admin/pub/cjcxapi.html";//查询数据的URL 
  wx.request({
    url: urls,
    data: { keyword: keyword, skey: skey, method: method },
    method: 'GET',
    success: function (res) {
      var result = res.data;
      console.log(result);
      self.setData({ resultData: result});
      if (typeof (result.error_code) == "undefined") {
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
          checklogin(self);

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
      console.log(toastText);
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
function checklogin(self) {
  var skey = wx.getStorageSync('user[skey]')
  var openid = wx.getStorageSync('user[openid]')
  var expired_time = wx.getStorageSync('user[expired_time]')
  var timestamp = (Date.parse(new Date())) / 1000;
  if (skey != '' && timestamp < expired_time) {
    return;
  }
  login(self);
}

//重新获取登录状态
function login(self) {
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
  },1000);
}