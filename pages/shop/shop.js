const app = getApp().globalData;
var total = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: '',
    left: true,
    total: 0,
    sumMoney: 0.00,
    check: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(app.page);
    var that = this;
    var page = app.page;
    wx.request({
      url: app.url + 'shopping-cart/index',
      data: {
        account_id: app.account_id,
        page: page
      },
      success: function(res) {
        var data = res.data;
        for (let y = 0; y < data.length; y++) {
          data[y].check = false;
        }
        for (let i = 0; i < data.length; i++) {
          if (parseInt(data[i].summation) > 1) {
            data[i].left = true;
          } else {
            data[i].left = false;
          }
        }
        that.setData({
          shopList: data
        })
        // console.log(that.data.shopList);

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  reduce: function(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var property = e.currentTarget.dataset.property;
    // console.log(e.currentTarget.dataset.id);
    var that = this;
    var shopList = that.data.shopList;
    var summation = parseInt(shopList[index].summation);
    console.log(shopList);

    if (summation > 2) {
      var cal = parseInt(shopList[index].summation) - 1;

      wx.request({
        url: app.url + 'shopping-cart/add',
        data: {
          account_id: app.account_id,
          count: -1,
          product_id: id,
          property: property
        },
        success: function(res) {
          if (res.data) {
            //本地数据修改
            shopList[index].summation = cal;
            that.setData({
              shopList: shopList
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    } else if (summation == 2) {
      var cal = parseInt(shopList[index].summation) - 1;
      wx.request({
        url: app.url + 'shopping-cart/add',
        data: {
          account_id: app.account_id,
          count: -1,
          product_id: id,
          property: property
        },
        success: function(res) {
          console.log(res);
          //本地数据修改
          if (res.data) {
            shopList[index].summation = cal;
            shopList[index].left = false;
            that.setData({
              shopList: shopList
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    } else {
      shopList[index].left = false;
      that.setData({
        shopList: shopList
      })
    }

  },
  plus: function(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var property = e.currentTarget.dataset.property;
    // console.log(e.currentTarget.dataset.id);
    var that = this;
    var shopList = that.data.shopList;
    var cal = parseInt(shopList[index].summation) + 1;
    wx.request({
      url: app.url + 'shopping-cart/add',
      data: {
        account_id: app.account_id,
        count: 1,
        product_id: id,
        property: property
      },success:function(res){
        if(res.data){
          shopList[index].summation = cal;
          shopList[index].left = true;
          that.setData({
            shopList: shopList
          })
        }else{
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    
  },
  gg: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    // console.log(e);
    var shopList = that.data.shopList;
    var tf = shopList[index].check;
    shopList[index].check = !tf;
    if (shopList[index].check == false) {
      that.setData({
        check: false
      })
    } else {
      for (let i = 0; i < shopList.length; i++) {
        if (shopList[i].check == false) {
          // console.log(shopList[i].check);
          return
        }
        that.setData({
          check: true
        })
      }
    }
    that.setData({
      shopList: shopList
    })
  },
  allChoice: function(e) {
    var that = this;
    var check = that.data.check;
    var shopList = that.data.shopList;
    for (let i = 0; i < shopList.length; i++) {
      shopList[i].check = !check;
    }
    that.setData({
      check: !check,
      shopList: shopList
    })
  }
})