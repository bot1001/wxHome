const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
   userInfo:'',
    configs: {},
    h:'',
    houseInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var configs = wx.getStorageSync("configs");
    // var userInfo = wx.getStorageSync('userInfo');
    var userInfo = app.userInfo;
    this.setData({ 
      configs: configs,
      userInfo: userInfo[app.signal],
      houseInfo: app.houseInfo
     });
    //  console.log(userInfo);
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
    this.onLoad();
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
  clearData:function(){
    wx.clearStorageSync();
    wx.showToast({
      title: '清理成功',
      icon: 'none',
      duration: 2000
    })
  },
  bindHouseChange:function(e){
    var that = this;
    var h = e.detail.value;
    // var nowuser = that.data.userInfo;
    // var befuser = nowuser.address;
    // nowuser.community = befuser[h].community;
    // nowuser.building = befuser[h].building;
    // nowuser.unit = befuser[h].number;
    // nowuser.room = befuser[h].room;
    // that.setData({
    //   userInfo: nowuser,
    //   houseIndex: h
    // })
    // app.userInfo = nowuser;
    app.signal = h;
    that.setData({
      userInfo: app.userInfo[h],
      h:h
    })
  }
})