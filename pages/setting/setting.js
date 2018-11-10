// pages/setting/setting.js
const app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind: false,
    url: app.url + "instruction/about?id=",
  },

  //清空本地缓存
  remove: function(){
    wx.vibrateLong();//震动提醒
    wx.showModal({
      title: '提示',
      content: '您确定要清空所有缓存吗？',
      success(res){
        if(res.confirm){//如果用的点击确定
          wx.clearStorage({
            success: function(){
              wx.showToast({
                title: '操作成功',
              })                
            }
          });
        }
      },
      fail:function(){
        wx.showModal({
          title: '操作失败',
          content: '请联系管理员',
        })
      }
    });    
  },
  
  /**
   * 点击版本弹出提醒信息
   */
  version: function () {
    wx.showModal({
      title: '版本提示',
      content: '新版本增加操作指南和收费标准功能',
      duration: 3000,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //拨打电话
  phone: function(e){
    var phone = e.currentTarget.id;//接收传参
    wx.vibrateShort; //震动提醒
    wx.makePhoneCall({//调用打电话组件
      phoneNumber: phone 
    })
  },

  //获取用手机号码
  getPhoneNumber(e) {
    var iv = e.detail.iv
    var encryptedData = e.detail.encryptedData
    wx.request({ //设置号码加密接口
      url: app.url+'/user/phone',
      data:{
        appid: app.appid,
        iv: iv,
        sessionKey: app.session_key,
        encryptedData: encryptedData
      },
      success: function(res){
        console.log(res.data);
      }
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

  }
})