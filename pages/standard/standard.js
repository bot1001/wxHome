const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headData: '',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userInfo = app.userInfo[app.signal];
    let community = userInfo.community;
    // wx.request({
    //   url: 'http://192.168.172.84/community-fees/index?community=' + community,
    //   success:function(res){
    //     var data = res.data;
    //     that.setData({
    //       headData: data[0]
    //     })
    //     if(data){
    //       wx.request({
    //         url: 'http://192.168.172.84/community-fees/one?id=' + data[0].id,
    //         success:function(res){
    //           // console.log(res.data);
    //           that.setData({
    //             content: res.data
    //           })
    //         }
    //       })
    //     }else{
    //       return
    //     }
        
    //   }
    // })  
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