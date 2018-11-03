const app = getApp().globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    house: '',
    userInfo:'',
    houseDetail:'',
    tempInfo:[],
    animation: true,
    see: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
        show = [];
    // var houseInfo = app.userInfo[app.signal];
    this.setData({
      house: app.houseInfo,
      userInfo: app.userInfo
    })
    for(let i = 0;i<app.houseInfo.length;i++){
      show[i] = false;
    }
    that.setData({
      show: show
    })
    // console.log(this.data.show1);
    // console.log(that.data.house);
    // console.log(app.realestateArr);
    // console.log(that.data.house);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animationL = wx.createAnimation();
    this.animationR = wx.createAnimation();
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
  delhouse:function(e){
    var that = this;
    var ind = e.currentTarget.dataset.index;
    var realestateArr = app.realestateArr;
    var userInfo = that.data.userInfo;
    var signal = app.signal;
    wx.showModal({
      title: e.currentTarget.dataset.content,
      content: '确定要解除关联？',
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      cancelColor: '#2c8692',//取消文字的颜色
      confirmText: "是",//默认是“确定”
      confirmColor: '#2c8692',//确定文字的颜色
      success: function (res) {

        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          var houseInfo = app.houseInfo;
          if (houseInfo.length == 1){
            // wx.request({
            //   url: app.url + 'user/untie',
            //   data: {
            //     account_id: app.account_id,
            //     realestate_id: realestateArr[ind]
            //   }, success: function (res) {
            //     wx.reLaunch({
            //       url: '../../pages/index/index' //转跳到首页
            //     })
            //   }
            // })
            wx.showToast({
              title: '非法操作',
              icon: 'none',
              duration: 2000
            })
            return;
          }else{
            // console.log(app.userInfo);
            // console.log(app.realestateArr);
            // console.log(app.userInfo);
            // console.log(ind);
           wx.request({
             url: app.url + 'user/untie',
             data:{
               account_id: app.account_id,
               realestate_id: realestateArr[ind]
             },success:function(res){
              //  console.log(res);
               wx.showToast({
                 title: '解除成功',
                 icon: 'none',
                 duration: 2000
               })
             }
           })
            houseInfo.splice(ind, 1);
            realestateArr.splice(ind, 1);
            userInfo.splice(ind, 1);
            app.houseInfo = houseInfo;
            app.realestateArr = realestateArr;
            app.userInfo = userInfo;
            that.setData({
              house: houseInfo
            })
            if(signal == ind){
              app.signal = 0;
            }else if(signal<ind){    
              // console.log(app.signal);
              return;
            }else{
              app.signal = signal-1;
              // console.log(app.signal);
            }
            // console.log(app.signal);
         }
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { 
       
      },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  houseDetail:function(e){
    var that = this;
    // console.log(e.currentTarget.dataset.index);
    var houseIndex = e.currentTarget.dataset.index;
    var tf = that.data.show[houseIndex];
    wx.request({
      url: app.url + 'realestate/one?realestate=' + app.realestateArr[houseIndex],
      success:function(res){
        let show = that.data.show;
        for(let i=0;i<show.length;i++){
          if (i == houseIndex){
            show[houseIndex] = !tf;
          }else{
            show[i] = false;
          }
        }
        // show[houseIndex] = !tf
        that.setData({
          houseDetail: res.data,
          show: show
        })
        
        // console.log(that.data.show);
      }
    })
  },
  rotate:function(){
   
      this.animationL.translate(-50).step();
      this.animationR.translate(50).step();
      this.setData({
        animationL: this.animationL.export(),
        animationR: this.animationR.export(),
       see: false
      })
    
    
    
  },
  bg:function(){
    this.animationL.translate(0).step({ duration: 0 });
    this.animationR.translate(0).step({ duration: 0 });
    this.setData({
      see: true,
      animationL: this.animationL.export(),
      animationR: this.animationR.export()
    })
  }
})