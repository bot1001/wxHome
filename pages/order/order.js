// pages/order/order.js
const app = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:'',
    show: false
    // order_amount:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '加载中..'
    });
    var that = this;
    // var accountId = wx.getStorageSync("accountId");
    var accountId = app.account_id;
    //订单查询（批量）
    wx.request({
      // url: app.url+'invoice/orders',
      url: app.url+"order/orders",
      data:{
        account_id: accountId,
        page: app.page
      },
      success:function (res){
        var orderInfo = res.data;
        if (orderInfo == ''){
          that.setData({
            show: true
          })
        }else{         
          for (var i = 0; i < orderInfo.length; i++) {
            if (orderInfo[i].status == "2") {
              orderInfo[i].time = orderInfo[i].payment_time
            } else {
              orderInfo[i].time = orderInfo[i].create_time
            }

            switch (orderInfo[i].status) {
              case "1":
                orderInfo[i].sta = "未支付";
                break;
              case "2":
                orderInfo[i].sta = "已支付";
                break;
              case "3":
                orderInfo[i].sta = "已取消";
                break;
              case "4":
                orderInfo[i].sta = "送货中";
                break;
              case "5":
                orderInfo[i].sta = "已签收";
                break;
            }
          }
          // console.log(res.data);
          that.setData({
            orderInfo: res.data,
            // order_amount: order_amount
          })
          wx.setStorageSync('oc', res.data)
        }
      
      }
    })
    wx.setStorageSync('op', app.page);
    wx.hideNavigationBarLoading();//完成停止加载
    // 动态设置导航条标题
    wx.setNavigationBarTitle({
      title: '我的订单'
    });
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
    this.onLoad();
    wx.stopPullDownRefresh();//停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.setNavigationBarTitle({
      title: '加载中..'
    });
    wx.showNavigationBarLoading();
    var that = this;
    var op = wx.getStorageSync('op') +1;
    var oc = wx.getStorageSync('oc');
    // var accountId = wx.getStorageSync("accountId");
    var accountId = app.account_id;
    //订单查询（批量） 
    wx.request({
      // url: app.url+'invoice/orders',
      url: app.url + "order/orders",
      data: {
        account_id: accountId,
        page: op
      },
      success: function (res) {
        var orderInfo = res.data;
        if (orderInfo == '') {
          that.setData({
            text: '到底了..'
          })
          return;
        } else {
          for (var i = 0; i < orderInfo.length; i++) {
            if (orderInfo[i].status == "2") {
              orderInfo[i].time = orderInfo[i].payment_time
            } else {
              orderInfo[i].time = orderInfo[i].create_time
            }

            switch (orderInfo[i].status) {
              case "1":
                orderInfo[i].sta = "未支付";
                break;
              case "2":
                orderInfo[i].sta = "已支付";
                break;
              case "3":
                orderInfo[i].sta = "已取消";
                break;
              case "4":
                orderInfo[i].sta = "送货中";
                break;
              case "5":
                orderInfo[i].sta = "已签收";
                break;
            }
          }
          var sumoc = oc.concat(res.data);
          // console.log(res.data);
          that.setData({
            orderInfo: sumoc,
            // order_amount: order_amount
          })

          wx.setStorageSync('op', op);
          wx.setStorageSync('oc', sumoc);
        }

      }
    })
    wx.hideNavigationBarLoading();  //完成停止加载
    // 动态设置导航条标题
    wx.setNavigationBarTitle({
      title: '我的订单'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  fmtDate: function (timeStamp){
    var date = new Date();

    date.setTime(timeStamp * 1000);

    var y = date.getFullYear();

    var m = date.getMonth() + 1;

    m = m < 10 ? ('0' + m) : m;

    var d = date.getDate();

    d = d < 10 ? ('0' + d) : d;

    var h = date.getHours();

    h = h < 10 ? ('0' + h) : h;

    var minute = date.getMinutes();

    var second = date.getSeconds();

    minute = minute < 10 ? ('0' + minute) : minute;

    second = second < 10 ? ('0' + second) : second;

    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;    

  }
})