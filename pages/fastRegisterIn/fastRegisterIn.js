const app = getApp().globalData;
var userInfo = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curId: '',
    name: '',
    nick: '',
    gender: ['男', '女'],
    genderListIndex: '',
    time: '获取验证码',
    disabled: false,
    vcode: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'curId': options.curId,
      'name': options.name
    })
    // console.log(this.data.name);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //失去焦点获取手机号码和姓名，用于判断获取验证码
  bindphone: function(e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    // console.log(that.data.phone);
  },
  bindnick: function(e) {
    var that = this;
    that.setData({
      nick: e.detail.value
    })
    // console.log(that.data.nick);
  },
  sendMess: function() {
    var that = this;
    // console.log(messTime);
    setTimeout(function() {
      if (that.data.phone.split('').length != 11) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
      } else if (that.data.nick.replace(/(^\s*)|(\s*$)/g, '') == '') {
        wx.showToast({
          title: '请输入合法姓名',
          icon: 'none',
          duration: 2000
        })
      } else if (that.data.genderListIndex == '') {
        wx.showToast({
          title: '请选择性别',
          icon: 'none',
          duration: 2000
        })
      } else {
        var messTime = app.timeS;
        var phone = that.data.phone;
        wx.request({
          url: app.url + 'sms/send?time=' + messTime + '&phone=' + phone,
          success: function(res) {
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
                vcode: res.data,
                disabled: true
              })
            }
          }
        })
      }
    }, 500)
  },
  getCode: function(options) {
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
  formSubmit: function(e) {
    var that = this;
    var message = e.detail.value.message;
    if (e.detail.value.message || that.data.vcode.code == message.toString()) {
      wx.request({
        url: app.url + 'register/new',
        data: {
          realestate: that.data.curId,
          phone: that.data.phone,
          name: that.data.name,
          nick: that.data.nick,
          weixin_openid: app.openid,
          unionid: app.unionid,
          face: '',
          gender: parseInt(that.data.genderListIndex) + 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'GET',
        success: function(res) {
          // console.log(res);
          var u = res.data.user;
          var a = res.data.address[0];
          if (res && res.data != '') {
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
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              duration: 2000
            })

            setTimeout(function() {
              wx.reLaunch({
                url: '../../pages/index/index' //转跳到首页
              })
            }, 500)

          } else {
            wx.showToast({
              title: '验证失败，请核对验证信息',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },
  bindGenderChange: function(e) {
    var that = this;
    that.setData({
      // 'gen': e.detail.value+1, 
      genderListIndex: e.detail.value //1=>男,2=>女
    })
    // console.log(that.data.genderListIndex);
  }
})