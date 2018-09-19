// pages/noticeList/noticeList.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:'',
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中..',
    })
    var that = this;
    // var userInfo = wx.getStorageSync('userInfo');
   var userInfo = app.userInfo;
    wx.request({
      url: app.url+'news/home',
      data:{
        community: userInfo.community,
        // community: '金碧天誉',
        page: that.data.page
      },success:function(res){
        wx.hideLoading();
        var ee = res;
        if(ee.data){
          if (ee[0]) {
            for (var i = 0; i < ee.length; i++) {
              if (ee[i].data.status == 1) {
                ee[i].data.color = '#FFFFBB';
              } else {
                ee[i].data.color = '#E8E8E8';
              }
            }
            that.setData({
              noticeList: ee
            })
            wx.hideLoading();
          } else {
            if (ee.data.status == 1) {
              ee.data.color = '#FFFFBB';
            } else {
              ee.data.color = '#E8E8E8';
            }
            let gg = [];
            gg.push(ee);
            // console.log(gg);
            that.setData({
              noticeList: gg
            })
          }  
        }else{
        return;
        }
       
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