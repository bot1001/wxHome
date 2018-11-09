const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headData: '',
    content:'',
    page: '1',
    url: app.url +'community-fees/web?id=',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let community = '金座小区';//userInfo.community;

    wx.request({//设置访问请求
      url: app.url+'community-fees/index',
      data:{
        community: community,
        page: that.data.page,
      },
      success: function (res) {
        console.log(res.data);
        that.setData({ //实时赋值
          content: res.data
        })
      }
    
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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