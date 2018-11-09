const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: '',
    left: true,
    sumMoney: 0,
    check: false,
    num: 0
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
      // url: '192.168.172.84/shopping-cart/index',
      data: {
        account_id: app.account_id,
        page: page
      },
      success: function(res) {
        var data = res.data;
        if (data) {

          for (let i = 0; i < data.length; i++) {
            data[i].check = false;
            if (parseInt(data[i].summation) > 1) {
              data[i].left = true;
            } else {
              data[i].left = false;
            }
          }
          that.setData({
            shopList: data
          })

        } else {
          var location = [{
              name: "冬瓜",
              subhead: '炖汤不错',
              price: '2.8',
              id: '7',
              summation: '3',
              amount: '7.4',
              property: '6'
            }, {
              name: "猪肉",
              subhead: '今日新鲜上市',
              price: '12.00',
              id: '1',
              summation: '2',
              amount: '24.00',
              property: '5'
            }

          ]

          for (let i = 0; i < location.length; i++) {
            location[i].check = false;
            if (parseInt(location[i].summation) > 1) {
              location[i].left = true;
            } else {
              location[i].left = false;
            }
          }

          that.setData({
            shopList: location
          })
        }

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
  //单个商品减少
  reduce: function(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var property = e.currentTarget.dataset.property;
    // console.log(e.currentTarget.dataset.id);
    var that = this;
    var shopList = that.data.shopList;
    var sum = that.sum(shopList, index);

    var summation = parseInt(shopList[index].summation);


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
            shopList[index].check = true;
            shopList[index].summation = cal;
            shopList[index].amount = parseFloat(shopList[index].summation) * parseFloat(shopList[index].price);
            sum -= shopList[index].price;
            if (that.judge(shopList)) {
              // console.log(shopList[i].check);
              that.setData({
                check: true,
                sumMoney: sum,
                shopList: shopList
              })

            } else {
              that.setData({
                check: false,
                sumMoney: sum,
                shopList: shopList
              })
            }
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

          //本地数据修改
          if (res.data) {
            shopList[index].check = true;
            shopList[index].summation = cal;
            shopList[index].amount = parseFloat(shopList[index].summation) * parseFloat(shopList[index].price)
            shopList[index].left = false;
            sum -= shopList[index].price;

            if (that.judge(shopList)) {
              // console.log(shopList[i].check);
              that.setData({
                check: true,
                sumMoney: sum,
                shopList: shopList
              })

            } else {
              that.setData({
                check: false,
                sumMoney: sum,
                shopList: shopList
              })
            }
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
  //单个商品增加
  plus: function(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var property = e.currentTarget.dataset.property;
    // console.log(e.currentTarget.dataset.id);
    var that = this;
    var shopList = that.data.shopList;
    var sum = that.sum(shopList, index);
    var cal = parseInt(shopList[index].summation) + 1;

    wx.request({
      url: app.url + 'shopping-cart/add',
      data: {
        account_id: app.account_id,
        count: 1,
        product_id: id,
        property: property
      },
      success: function(res) {
        if (res.data) {
          shopList[index].check = true;
          shopList[index].summation = cal;
          shopList[index].amount = parseFloat(shopList[index].price) * parseFloat(shopList[index].summation)
          shopList[index].left = true;
          sum += parseFloat(shopList[index].price);
          if (that.judge(shopList)) {
            // console.log(shopList[i].check);
            that.setData({
              check: true,
              sumMoney: sum,
              shopList: shopList
            })

          } else {
            that.setData({
              check: false,
              sumMoney: sum,
              shopList: shopList
            })
          }
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },
  //计算已选择商品的总额
  sum: function(shopList, index) {
    var s = 0;
    var shopList = shopList;
    var index = index;
    for (let i = 0; i < shopList.length; i++) {
      if (shopList[i].check == true) {
        s += parseFloat(shopList[i].amount);
      // } else if (shopList[i].check == true || i == index) {
      //   s += parseFloat(shopList[i].amount);
      } 
    }
    return s;
  },
  num: function(shopList, index) {
      var s = 0;
      var shopList = shopList;
      var index = index;
      for (let i = 0; i < shopList.length; i++) {
        if (shopList[i].check == true) {
          s += parseInt(shopList[i].summation);
        // } else if (i == index) {
        //   s += parseInt(shopList[i].summation);
        }
      }
      return s;
    }
    //选中单个商品函数
    ,
  gg: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var shopList = that.data.shopList;
    var tf = shopList[index].check;
    shopList[index].check = !tf;
    var sum = that.sum(shopList, index);
    var num = that.num(shopList, index);
    // console.log(that.judge(shopList));
    if (shopList[index].check == true) {
      // sum = sum - parseFloat(shopList[index].amount);
      // num = num - parseInt(shopList[index].summation);
      // console.log(that.judge(shopList));
       if (that.judge(shopList)) {
        
        // console.log(shopList[i].check);
        that.setData({
          check: true,
          sumMoney: sum,
          shopList: shopList,
          num: num
        })
        // console.log('all');
      } else {
     
         that.setData({
           check: false,
           sumMoney: sum,
           shopList: shopList,
           num: num
         })
      }
    } else {
      // console.log(num);
      // num = num + parseInt(shopList[index].summation);
      // sum = sum + parseFloat(shopList[index].amount);

      // if (that.judge(shopList)) {
      //   // console.log(shopList[i].check);
      //   that.setData({
      //     check: true,
      //     sumMoney: sum,
      //     shopList: shopList,
      //     num: num
      //   })
      //   // console.log('all');
      // } else {
        // console.log('notAll');
        that.setData({
          check: false,
          sumMoney: sum,
          shopList: shopList,
          num: num
        })
      
      // console.log(that.data.num);
    }
  },
  //全选函数
  allChoice: function(e) {
      var sum = 0;
      var num = 0;
      var that = this;
      var check = that.data.check;
      var shopList = that.data.shopList;
      check = !check;
      if (check == true) {
        for (let i = 0; i < shopList.length; i++) {
          sum += parseFloat(shopList[i].amount);
          shopList[i].check = true;
          num += parseInt(shopList[i].summation);
        }
      } else {
        for (let y = 0; y < shopList.length; y++) {
          shopList[y].check = false;
        }
      }
      that.setData({
        check: check,
        shopList: shopList,
        sumMoney: sum,
        num: num
      })
    }
    //判断增减商品时是否已经全选
    ,
  judge: function(e) {
    var t = true;
    // console.log(e);
    for (var i = 0; i < e.length; i++) {
      if (e[i].check == false) {
        t = false;
        // return t;
        // console.log(t);
      }
    }
    return t;
  },
  shopPay:function(){
    var that = this;
    var num = that.data.num;
    if (num == '0'){
      wx.showToast({
        title: '您还没有选择任何商品哦',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: '../../pages/shopPay/shopPay'
      })
    }
  }

})