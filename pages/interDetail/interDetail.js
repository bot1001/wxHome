// pages/interDetail/interDetail.js
const app = getApp().globalData;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'',
    time:'',
    index:'',
    state:'',
    content:'',
    people:'',
    replyInfo:[],
    textarea:'',
    fc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options);
    wx.request({
      url: app.url + 'ticket/one',
      data:{
        ticket_id: options.ticket_id,
      },
      success:function(res){
       var an = res.data.answer;
        for(var i=0;i<an.length;i++){
          if(an[i].role == "0"){
            an[i].bg = "#FFF";
            an[i].answer_name = '我';
          } else if (an[i].role == "1"){
            an[i].bg = "#FFF";
            an[i].tit = "#FFE4E1";
          }
        }
        that.setData({
          replyInfo: an
        })
      }
    })
    this.setData({
      num: options.num,
      index: options.ticket_id,
      content: options.content,
      people: options.people,
      state: options.state,
      time: options.time,
      fc: options.fc
    })
    // wx.setStorageSync('reply', this.replyInfo);
    // console.log(this.data.all);
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
  
  },
  bindFormSubmit: function (e){
    var that = this;
    var content = e.detail.value.textarea;
    var str = content.replace(/(^\s*)|(\s*$)/g, '');
    var account_id = app.account_id;
    if (str == '' || str == undefined || str == null){
      wx.showToast({
        title: '请输入有效内容',
        icon: 'none',
        duration: 2000
      })
    }else{
      // var currentTime = util.formatTime(new Date());
      
      // console.log(name);
     
      // // replyInfo.push(obj);
      wx.request({
        url: app.url+'ticket/reply',
        data:{ 
          ticket_id:that.data.index,
          account_id: account_id,
          content:content
        },
        header: {
          'content-type': 'application/json' // 默认值
        },success:function(res){
          let replyInfo = that.data.replyInfo;
          let name = app.userInfo;
          let obj = {};
          // obj.answer_name = name.name;
          obj.answer_name = '我';
          obj.content = res.data.content;
          obj.reply_time = res.data.time;
          obj.bg = "#FFF";
          replyInfo.push(obj);
          that.setData({
            replyInfo: replyInfo,
            textarea: ''
          })
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 2000
          })
        }
      })   
     
    } 
  }
})