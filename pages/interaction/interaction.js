// pages/interaction/interaction.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:'',
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var account_Id = app.account_id;
    var userInfo = app.userInfo;
    
      wx.showLoading({
        title: '加载中'
      })
    // console.log(userInfo);
    wx.request({
      url: app.url + 'ticket/index',
      data: {
        account_id: account_Id,
        page: app.page
      }, success: function (res) {
        var dataInfo = res.data;
        // console.log(dataInfo);
        if(dataInfo == ''){
          wx.hideLoading();
          return
        }else{
          for (var i = 0; i < dataInfo.length; i++) {
            // console.log(dataInfo[i]);
            switch (dataInfo[i].status) {
              case "1":
                dataInfo[i].stat = "待接单";
                dataInfo[i].bg = "#FFC8B4";
                dataInfo[i].fc = "#FF0000";
                break;
              case "2":
                dataInfo[i].stat = "已接单";
                dataInfo[i].bg = "#FFFF33";
                dataInfo[i].fc = "#32CD32";
                break;
              case "3":
                dataInfo[i].stat = "已完成";
                dataInfo[i].bg = "#DDDDDD";
                dataInfo[i].fc = "#000";
                break;
              case "4":
                dataInfo[i].stat = "返修";
                dataInfo[i].fc = "#4169E1";
                break;
              case "5":
                dataInfo[i].stat = "关闭";
                dataInfo[i].fc = "#000";
                break;
              case "6":
                dataInfo[i].stat = "处理中";
                dataInfo[i].bg = "#33FFFF";
                dataInfo[i].fc = "#00BFFF";
                break;
            }

            switch(dataInfo[i].type){
              case "1":
                dataInfo[i].ty = "建议";
                break;
              case "2":
                dataInfo[i].ty = "投诉";
                break;
            }
          }
          
          that.setData({
            dataInfo: dataInfo,
            userInfo: userInfo[app.signal]
          })
          wx.setStorageSync("dataInfo", dataInfo);
          wx.hideLoading();
          // console.log(that.data.dataInfo);
        }
      }
    })
    // console.log(that.data.dataInfo);
    // console.log(options);
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

  }
})