App({
  onLaunch: function () {
    wx.clearStorageSync();
    var that = this;
    // wx.login({
    //   success: function (res) {
    //     // console.log(res);
    //     if ( res.code ) {
    //       //发起网络请求
    //       wx.request({
    //         url: that.globalData.url + 'login/openid',
    //         data: {
    //           appid: 'wx5b66383c1027250a',
    //           secret: 'c5856f2376be3bc281cc0b893f86355e',
    //           js_code: res.code,
    //           grant_type: 'authorization_code'
    //         },
    //         header: {
    //           'content-type': 'application/json' // 默认值
    //         },
    //         success: function (res) {
    //           //获取用户各种ID
    //           that.globalData.openId = res.data.openid;
    //           that.globalData.unionId = res.data.unionid;
    //           // that.globalData.unionId = 'oHq83uPL9OP0e-Hy5-DVSdp_YZr9';
    //           // console.log(app.openId);
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // });
  },
  globalData: {
    appid: 'wx5b66383c1027250a', //应用秘钥
    secret: 'c5856f2376be3bc281cc0b893f86355e', //应用秘钥
    page: 1,
    url: "https://api.gxydwy.com/",
    // url: "http://192.168.172.84/",
    show: false,
    userInfo:'',
    account_id:'',
    community: '',
    building: '',
    number: '',
    realestate_id:'',
    timeS:'',
    registerInfo:'',
    registerNeed:{},
    sum: {},
    openid:'',
    unionid:'',
    signal :0,
    realestateArr:'',
    houseInfo:'',
    fastRegist: 0,
    session_key:''
  },
  onLoad: function () {
    
  }
})
