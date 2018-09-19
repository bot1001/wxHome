//index.js
//获取应用实例
const app = getApp().globalData
var userInfo = {}
Page({
  data: {
    imgUrls: [
      'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2462475058.jpg',
      'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2472784892.jpg',
      'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2479605659.jpg',
      'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2459944375.jpg',
      'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p2461834877.jpg'
    ],
    show:app.show,
    indicatorDots:true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    userInfo: app.userInfo,
    notice: app.notice,
    // more: app.more,
    loading: true,
    community:'',
    payIn: app.sum.payIn,
    payC: app.sum.payC,
    sumMoney: app.sum.sumMoney,
    cur: app.sum.cur,
    bef: app.sum.bef,
    page:1
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    var u = setInterval(function(){
      if(app.unionId){
        clearInterval(u);
        wx.request({
          url: app.url + 'login/index',
          data: {
            unionid: app.unionId
            // unionid: 'oHq83uPL9OP0e-Hy5-DVSdp_YZr7'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {


            var r = res.data;
            if (!r) {
              wx.reLaunch({
                // url: '../../pages/index/index', //转跳到首页
                url: '../../pages/register/register', //转条到注册页面
              })
            } else {
              app.account_id = r.user.account_id;
              app.realestate_id = r.user.realestate_id;
              //如果登陆成功则设置首页为可显示状态

              //欠费提示
              wx.request({
                url: app.url + 'invoice/sum',
                data: {
                  realestate_id: r.user.realestate_id
                }, success: function (res) {
                  var amount = res.data.amount;
                  // console.log(res);
                  if (amount == null) {
                    that.setData({
                      payIn: '#17b3ec',
                      cur: 0,
                      bef: 0,
                      payC: '缴费记录',
                      sumMoney: 0
                    })
                  } else {
                    wx.request({
                      url: app.url +'invoice/invoice',
                      data:{
                        realestate: r.user.realestate_id
                      },success:function(r){
                       that.setData({
                         sumMoney: amount,
                         cur: r.data.month,
                         bef : (amount - r.data.month).toFixed(2),
                         payC: '我要缴费',
                         payIn: '#FF4500'
                       })
                      }
                    })
                  }
                  that.setData({
                    show: true
                  })
                }
              })

              //订单提示
              // wx.request({
              //   // url: app.url+'invoice/orders',
              //   url: app.url + "order/orders",
              //   data: {
              //     account_id: app.account_id,
              //     page: that.data.page
              //   },
              //   success: function (res) {
              //     if(res.data == ''){
              //       // that
              //     }
              //   }
              // })

              userInfo.community = res.data.address[0].community;
              userInfo.building = res.data.address[0].building;
              userInfo.unit = res.data.address[0].number;
              userInfo.room = res.data.address[0].room;
              userInfo.phone = res.data.user.mobile_phone;
              userInfo.name = res.data.user.real_name;
              // wx.setStorageSync('userInfo', userInfo);
              // console.log(app.show);
              app.userInfo = userInfo;
              // console.log(app.userInfo);
              that.setData({
                userInfo: userInfo,
                loading: false,
                realestate_id: res.data.user.realestate_id
              })

              //公告栏首页
              wx.request({
                url: app.url + 'news/home?community=' + userInfo.community,
                // url: app.url + 'news/home?community=金碧天誉',
                success: function (res) {
                  // console.log(res);
                  if (res.data) {
                    that.setData({
                      notice: res.data
                    })
                  } else {
                    var n = { title: "敬请期待！", content: "", time: "" };
                    that.setData({
                      notice: n
                    })
                  }

                }
              })
              //公告栏更多
              wx.request({
                url: app.url + 'news/home',
                data: {
                  community: userInfo.community,
                  // community:'金碧天誉',
                  page: 1
                }, success: function (res) {
                  // console.log(res);
                  if (res.data) {
                    return;
                  } else {
                    // that.setData({
                    //   more: false
                    // })
                  }
                }
              })
            }
          }
        })
      }else{
        return;
      }
    
    },500)
  },
  dateYM:function(){
    var t = {};
    var y = new Date().getFullYear().toString();
    var m = (new Date().getMonth() + 1).toString();
    if (m.split('').length == 1){
      m = '0'+ m;
    }
    t.y = y;
    t.m = m;
    return t
  },
  onShow:function(){
    this.onLoad();
  }
})
