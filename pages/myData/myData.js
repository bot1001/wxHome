// pages/myData/myData.js
const app = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广西壮族自治区', '来宾市', '兴宾区'],
    customItem: '全部',
    gender:['男','女'],
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var userInfo = wx.getStorageSync('userInfo');
    var userInfo = app.userInfo[app.signal];
    this.setData({
      userInfo: userInfo
    });
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // getUserInfo: function (e) {
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

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
  
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit:function(e){
    var that = this;
    var val = e.detail.value;
    var gender = '';
    var userInfo = app.userInfo;
    if (val.gender == '男'){
      gender = 1;
    } else if (val.gender == '女'){
      gender = 2;
    }else{
      wx.showToast({
        title: '请输入合法信息',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var user = that.data.userInfo;
    // console.log(user);
    if (val.name.replace(/(^\s*)|(\s*$)/g, '') != '' && val.gender.replace(/(^\s*)|(\s*$)/g, '') != '' && val.realname.replace(/(^\s*)|(\s*$)/g, '') != ''){
      wx.request({
        url: app.url + 'personal/update',
        data:{
          province:that.data.region[0],
          city: that.data.region[1],
          area: that.data.region[2],
          account: user.account,
          gender: gender,
          face:'',
          name: val.realname,
          nickname: val.name
        },success:function(res){
          // console.log(res);
          if(res.data == 1){
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
            for(let i=0;i<userInfo.length;i++){
              userInfo[i].name = val.name;
              userInfo[i].gender = parseInt(that.data.gender.indexOf(val.gender)) + 1;
              userInfo[i].realname = val.realname;
            }
            app.userInfo = userInfo;
          }
        }
      })
    }else{
      wx.showToast({
        title: '请输入合法信息',
        icon: 'none',
        duration: 2000
      })
    }
    // console.log(e.detail.value);
  }
})