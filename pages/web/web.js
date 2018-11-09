// pages/about/about.js
const app = getApp().globalData;
Page({

  /** 
   * 适合两个参数传参访问网页
   */
  data: {
     url: '',
     id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ //设置传参并拼接路由
      url: options.url + '?id='+options.id,
    })    
  },
})