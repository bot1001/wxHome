// pages/message/message.js
const app = getApp().globalData;
var userInfo = {};
// var interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick:'',
    phone:'',
    code :'1',
    vcode: '',
    // currentTime: 61,
    time: '获取验证码',
    disabled: false,
    room:'',
    name:'',
    gender:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     'room':options.room,
     'name': options.name,
     'gender': options.gender
   })
    wx.showToast({
      title: '验证成功',
      icon: 'none',
      duration: 2000
    })
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
  sendMess:function(){
    var that = this;
    // console.log(messTime);
    setTimeout(function () {
    if (that.data.phone.split('').length != 11){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.nick.replace(/(^\s*)|(\s*$)/g, '') == ''){
      wx.showToast({
        title: '请输入合法姓名',
        icon: 'none',
        duration: 2000
      })
    }else{
      
        var messTime = app.timeS;
        var phone = that.data.phone;
        wx.request({
          url: app.url + 'sms/send?time=' + messTime + '&phone=' + phone,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res);
            if (res.data == "2") {
              wx.showToast({
                title: '请稍后再试',
                icon: 'none',
                duration: 2000
              })
            } else {
              //发送成功执行操作
              that.getCode();
              that.setData({
                code: '1',
                vcode: res.data,
                disabled: true
              })
            }
          }
        })
    }
    },500)
  },
  getCode: function (options){
  var that = this;
  // var currentTime = that.data.currentTime
  //   interval = setInterval(function () {
  //   currentTime--;
  //   that.setData({
  //     time: currentTime + '秒'
  //   })
  //   if (currentTime <= 0) {
  //     clearInterval(interval)
  //     that.setData({
  //       time: '重新发送',
  //       currentTime: 61,
  //       disabled: false
  //     })
  //   }
  // }, 1000)
    that.setData({
      time: '已发送',
      disabled: false
    })
},
  //提交验证并注册
  formSubmit:function(e){
    var that = this;
    if (e.detail.value.message){
      var message = (e.detail.value.message).toString();
      // console.log(message);
      // console.log(that.data.vcode);
      // console.log('form发生了submit事件，携带数据为：', e)
      if (that.data.code == '1' && that.data.vcode == message){
        wx.request({
          url: app.url+'register/new',
          data:{
            realestate: that.data.room,
            phone: that.data.phone,
            name: that.data.name,
            nick: that.data.nick,
            weixin_openid: app.openid,
            unionid: app.unionid,
            face:'',
            gender: that.data.gender
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: 'GET',
          success: function (res) {
            // console.log(res);
            var u = res.data.user;
            var a = res.data.address[0];
            if(res && res.data!=''){
              app.account_id = u.account_id;
              app.realestate_id = u.realestate_id;
              userInfo.community = a.community;
              userInfo.building = a.building;
              userInfo.unit = a.number;
              userInfo.room = a.room;
              userInfo.phone = u.mobile_phone;
              userInfo.name = u.nickname;
              app.userInfo = userInfo;
              //公告栏首页
              app.show = true;
              wx.reLaunch({
                url: '../../pages/index/index' //转跳到首页
              })
              
              wx.showToast({
                title: '注册成功',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '验证失败，请核对验证信息',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: '验证码错误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }else{
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },
  //当前时间戳
  timeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + '';
  },
  //失去焦点获取手机号码
  bindphone:function(e){
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    // console.log(that.data.phone);
  },
  bindnick: function (e) {
    var that = this;
    that.setData({
      nick: e.detail.value
    })
    // console.log(that.data.nick);
  },
  dateYM: function () {
    var t = {};
    var y = new Date().getFullYear().toString();
    var m = (new Date().getMonth() + 1).toString();
    if (m.split('').length == 1) {
      m = '0' + m;
    }
    t.y = y;
    t.m = m;
    return t
  }
})