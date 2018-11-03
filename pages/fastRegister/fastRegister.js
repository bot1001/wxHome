const app = getApp().globalData;
var userInfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    houseList:'',
    register: true,
    dataIndex:'',
    dataName: '',
    name:'',
    curId: '',
    text: '加载中..'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      var that = this;
      var phone = that.data.phone;
      wx.showLoading({
        title: that.data.text
      })
      var repage = wx.getStorageSync('rpage');
      wx.request({
        url: app.url + 'register/phone?phone=' + phone + '&page=' + repage,
        success: function (res) {
          var data = res.data;
          var ownData = app.realestateArr;
          var befNeed = that.data.houseList;
          var houseList = [];
          // console.log(data);
          if (data) {
            for (let i = 0; i < data.length; i++) {
              // console.log(ownData.indexOf(data[i].id));
              if (ownData.indexOf(data[i].id) == -1) {
                houseList.push({
                  'id': data[i].id,
                  'room': data[i].room,
                  'name': data[i].owners_name,
                  'color':'#fff'
                });
              } else { }
            }
            var dataSum = befNeed.concat(houseList);
            repage += 1;
            wx.setStorageSync('rpage', repage);
            // wx.setStorageSync('payInfo', dataSum);
            that.setData({
              houseList: dataSum
            })
            // console.log(that.data.houseList);
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
  onShareAppMessage: function () {

  },
  bindnick:function(e){
    // console.log(e);
    this.setData({
      phone:e.detail.value
    })
  },
  search:function(e){
    var that = this;
    var page = app.page;
    wx.showLoading({
      title: '查询中..',
    })
    setTimeout(function(){
     
      var phone = that.data.phone;
      if (phone.split('').length != 11) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.request({
          url: app.url + 'register/phone?phone=' + phone + '&page=' + page,
          success: function (res) {
            if (res.data) {
              var data = res.data;
              var dataIndex = [];
              var dataName = [];
              for (let i = 0; i < data.length; i++) {
                if (i == 0) {
                  data[i].color = 'green';
                } else {
                  data[i].color = '#fff';
                }
                dataIndex.push(data[i].id);
                dataName.push(data[i].owners_name);
              }
              that.setData({
                houseList: data,
                register: false,
                dataIndex: dataIndex,
                dataName: dataName
              })
            } else {
              wx.showToast({
                title: '该号码并未绑定任何房屋,如有疑问请与物业中心联系',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
      page += 1;
      wx.setStorageSync('rpage', page); 
    },500)
    wx.hideLoading()
  },
  houseChoice:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var houseList = that.data.houseList;
    var curId = houseList[index].id;
    var name = houseList[index].owners_name;
    for(let i =0;i<houseList.length;i++){
      if(i == index){
        houseList[i].color = "green";
      }else{
        houseList[i].color = "#fff";
      }
    }
    that.setData({
      houseList: houseList,
      curId: curId,
      name: name
    })
    
  }
  // formSubmit:function(e){
  //   var that = this;
   
  //   var curIndex = that.data.curIndex;
  //   var phone = that.data.phone;
  //   var houseList =  that.data.houseList;
  //       wx.request({
  //         url: app.url + 'register/new',
  //         data:{
  //           realestate: houseList[curIndex].id,
  //           phone: phone,
  //           name: houseList[curIndex].owners_name,
  //           nick: houseList[curIndex].owners_name,
  //           weixin_openid: app.openid,
  //           unionid: app.unionid,
  //           face: '',
  //           gender: 0
  //         },
  //         success: function (res) {
  //           // console.log(res);
  //           var u = res.data.user;
  //           var a = res.data.address[0];
  //           if (res && res.data != '') {
  //             app.account_id = u.account_id;
  //             app.realestate_id = u.realestate_id;
  //             userInfo.community = a.community;
  //             userInfo.building = a.building;
  //             userInfo.unit = a.number;
  //             userInfo.room = a.room;
  //             userInfo.phone = u.mobile_phone;
  //             userInfo.name = u.nickname;
  //             app.userInfo = userInfo;
  //             //公告栏首页
  //             app.show = true;
  //             app.fastRegist = 1;
  //             wx.reLaunch({
  //               url: '../../pages/index/index' //转跳到首页
  //             })
  //             wx.showToast({
  //               title: '注册成功',
  //               icon: 'none',
  //               duration: 2000
  //             })
  //           } else {
  //             wx.showToast({
  //               title: '注册失败',
  //               icon: 'none',
  //               duration: 2000
  //             })
  //           }
  //         }
  //       })
  // }
})