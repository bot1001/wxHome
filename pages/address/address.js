// pages/address/address.js
const app = getApp.grobalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addres: '',
    page: '1',
    address: '',
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置请求页面
    wx.request({
      url: "https://api.gxydwy.com/shopping-address/index",//app.url +'shopping-address/index',
      data:{
        account_id: "423cba753fd2c684c551d97f5f4f5673",//app.account_id,
        page: '1'
      },
      success: function(res){
        console.log(res.data);
      }
    })
  },

  //添加地址
  add: function(){
    // console.log('添加地址')
    var that = this;
    wx.chooseLocation({ //获取用户地址，打开地图并输入
      success: function(res) {
        that.setData({
          address: res.address+res.name,
          show: true
        })
      },
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