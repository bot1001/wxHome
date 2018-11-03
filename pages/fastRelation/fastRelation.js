const app = getApp().globalData;
var indexArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    needData: '',
    text: '加载中..'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let phone = app.userInfo[app.signal].phone;
    // this.setData({
    //   phone: phone
    // })
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
    var that = this;
    var phone = that.data.phone;
    wx.showLoading({
      title: that.data.text
    })
    var repage = wx.getStorageSync('repage');
    wx.request({
      url: app.url + 'register/phone?phone=' + phone + '&page=' + repage,
      success:function(res){
        var data = res.data;
        var ownData = app.realestateArr;
        var befNeed = that.data.needData;
        var needData = [];
        // console.log(data);
        if (data) {
          for (let i = 0; i < data.length; i++) {
            // console.log(ownData.indexOf(data[i].id));
            if (ownData.indexOf(data[i].id) == -1) {
              needData.push({
                'id': data[i].id,
                'room': data[i].room,
                'name': data[i].owners_name,
                'color':"#fff"
              });
            } else { }
          }
          var dataSum = befNeed.concat(needData);
          repage += 1;
          wx.setStorageSync('repage', repage);
          // wx.setStorageSync('payInfo', dataSum);
          that.setData({
            needData: dataSum
          })
          // console.log(that.data.needData);
        } else {
          that.setData({
            text: '到底了..'
          })
        }
        //   wx.showToast({
        //     title: '该号码并未查询到更多的房屋',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      
      },
      complete: function () {
        wx.hideNavigationBarLoading();                   //完成停止加载
        //动态设置导航条标题
        wx.setNavigationBarTitle({
          title: '一键关联'
        });
        wx.hideLoading();
        // wx.stopPullDownRefresh();                       //停止下拉刷新
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindnick: function(e) {
    // console.log(e);
    this.setData({
      phone: e.detail.value
    })
  },
  search: function(e) {
    wx.showLoading({
      title: '查询中..',
    })
    var that = this;
    setTimeout(function(){
      var phone = that.data.phone;
      var page = app.page;
      //调用手机号码查询接口
      wx.request({
        url: app.url + 'register/phone?phone=' + phone + '&page=' + page,
        success: function (res) {
          var data = res.data;
          var ownData = app.realestateArr;
          var needData = [];
          if (data) {
            for (let i = 0; i < data.length; i++) {
              // console.log(ownData.indexOf(data[i].id));
              if (ownData.indexOf(data[i].id) == -1) {
                needData.push({
                  'id': data[i].id,
                  'room': data[i].room,
                  'name': data[i].owners_name,
                  'color': '#fff'
                });
              }
            }
            if (needData.length == 0){
              wx.showToast({
                title: '该号码无更多房屋信息',
                icon: 'none',
                duration: 2000
              })
            }else{
              that.setData({
                needData: needData
              })
            }
          } else {
            that.setData({
              needData: ''
            })
            wx.showToast({
              title: '该号码并未绑定任何房屋，请核实',
              icon: 'none',
              duration: 2000
            })
          }
          //   wx.showToast({
          //     title: '该号码并未查询到更多的房屋',
          //     icon: 'none',
          //     duration: 2000
          //   })
          // }
        }
      })
      page += 1;
      wx.setStorageSync('repage', page); 
      wx.hideLoading()
    },500)
  },
  //一键关联提交函数
  formSubmit: function(e) {
    var that = this;
    //获取将要关联的用户id数组
    var needData = that.data.needData;
    if (indexArr.length>0) {
      for (var i = 0; i < indexArr.length; i++) {
        wx.request({
          url: app.url + 'user/relevancy',
          data: {
            account_id: app.account_id,
            realestate_id: needData[indexArr[i]].id
          },
          success: function(res) {
            //关联成功后重新请求用户信息，用于更新全局变量
            wx.request({
              url: app.url + 'login/index',
              data: {
                unionid: app.unionid
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function(res) {
                var userInfo = res.data.address;
                var u = res.data.user;
                var realestateArr = [];
                for (let i = 0; i < userInfo.length; i++) {
                  realestateArr.push(userInfo[i].realestate);
                  userInfo[i].phone = u.mobile_phone;
                  userInfo[i].name = u.real_name;
                }
                app.realestateArr = realestateArr;
                app.userInfo = userInfo;
                app.houseInfo = that.fn(userInfo);
              }
            })

          },
          complete: function(res) {
            // console.log(res);
            wx.showToast({
              title: '关联成功！',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function(){
              wx.reLaunch({
                url: '../../pages/personal/personal',
              })
            },500)
            
          }
        })
      }
      //存储数据更新，延时返回页面
      var transfer = setTimeout(function() {
        wx.reLaunch({
          url: '../../pages/personal/personal'
        })
      }, 1000)

    } else {
      wx.showToast({
        title: '请先获取房屋信息',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //房屋信息数组处理函数
  fn: function(a) {
    let ai = [];
    for (let i = 0; i < a.length; i++) {
      let pi = a[i].community + ' ' + a[i].building + ' ' + a[i].number + ' ' + a[i].room;
      ai.push(pi);
    }
    return ai;
  },
  select:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var gg = indexArr.indexOf(index);
    var needData = that.data.needData;
    // console.log(needData);
    if (indexArr.indexOf(index) == -1){
      indexArr.push(index);
      needData[index].color = "green";
      // for (var i = 0; i < indexArr.length;i++){
      //   needData[indexArr[i]].color = "gree";
      // }
    }else{
     
      needData[index].color = "#fff";
      indexArr.splice(gg, 1);
    }
    that.setData({
      needData: needData
    })
    // console.log(that.data.needData);
    // console.log(indexArr);
    // var houseList = that.data.houseList;
    // for (let i = 0; i < houseList.length; i++) {
    //   if (i == index) {
    //     houseList[i].color = "green";
    //   } else {
    //     houseList[i].color = "#fff";
    //   }
    // }
    // that.setData({
    //   houseList: houseList,
    //   curIndex: index
    // })
  }
})