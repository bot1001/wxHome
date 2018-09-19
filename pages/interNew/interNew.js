// pages/interNew/interNew.js
const app = getApp().globalData
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '投诉', value: '投诉'},
      { name: '建议',value: '建议'}
    ],
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var complaint = wx.getStorageSync('complaint');
    // console.log(complaint);
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
  bindFormSubmit: function(e) {
    var that = this;
    var content = e.detail.value.textarea;
    var str = content.replace(/(^\s*)|(\s*$)/g, '');
    var value = this.data.value;
    // var accountId = wx.getStorageSync('accountId');
    // var realestate_id = wx.getStorageSync('realestate_id');
    var accountId = app.account_id;
    var realestate_id = app.realestate_id;
    var name = app.userInfo.name;
    var phone = app.userInfo.phone;
    if (str == '' || str == undefined || str == null) {
      wx.showToast({
        title: '请输入有效内容',
        icon: 'none',
        duration: 2000
      })
    } else if (value == '' || value == undefined || value == null){
      wx.showToast({
        title: '请选择提交类型',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url:app.url+'ticket/create',
        method:'GET',
        // url: app.url+'ticket/create?realestate=' + realestate_id + '&taxonomy=' + value + '&detail=' + content + '&person=' + name + '&phone=' + phone + '&account=' + accountId,
        data:{
          realestate: realestate_id,
          taxonomy: value,
          detail: content,
          person: name,
          phone: phone,
          account: accountId
        },
        success:function(res){
          // console.log(res);
        }
      })
      wx.showToast({
        title: '回复成功',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  radioChange: function (e) {
    // console.log(e);
    var ind = 0;
    switch (e.detail.value) {
      case "建议":
        ind = 1;
        break;
      case "投诉":
        ind = 2;
        break;
    }

    this.setData({
      value: ind
    })
  }
})