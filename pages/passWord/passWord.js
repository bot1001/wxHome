const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: "获取验证码",
    phone: '',
    disabled: false,
    vcode: '',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = app.userInfo[app.signal].phone;
    this.setData({
      phone: phone
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
  bindphone: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    // console.log(that.data.phone);
  },
  sendMess: function () {
    var that = this;
    // console.log(messTime);
    setTimeout(function(){
      if (that.data.phone.split('').length != 11) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
      } else {
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
                vcode: res.data,
                disabled: true
              })
            }
          }
        })
      }
    })
  },
  getCode: function (options) {
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
      operation: '已发送',
      disabled: false
    })
  },
  //提交验证并修改密码
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.message && e.detail.value.passWord) {
      var message = (e.detail.value.message).toString();
      var passWord = e.detail.value.passWord;
      // console.log(message);
      // console.log(that.data.vcode);
      // console.log('form发生了submit事件，携带数据为：', e)
      if (that.data.vcode.code == message) {
        if (passWord.length<6){
          wx.showToast({
            title: '密码长度小于六位',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        wx.request({
          url: app.url + 'user/password',
          data:{
            account_id: app.account_id,
            password: passWord
          },success:function(res){
            let data = res.data;
            if(data == 1){
              wx.showToast({
                title: '更换成功',
                icon: 'none',
                duration: 2000
              })
              //更换密码成功跳转到我的页面
              wx.reLaunch({
                url: '../../pages/personal/personal'
              })
            }else{
              wx.showToast({
                title: '操作失败，请勿重复操作',
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
    } else {
      wx.showToast({
        title: '验证码或密码为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  }
})