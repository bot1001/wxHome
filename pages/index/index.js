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
    page:1,
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    wx.login({
      success: function(res){
        var code = res.code;
        wx.request({ //向后台请求unionID和openID
          url: app.url + 'login/openid',
          data: {
            appid: app.appid,
            secret: app.secret,
            js_code: code,
            grant_type: 'authorization_code'
          },
          success: function(res) {
            var r = res.data;
            if(!r.unionid && r.openid){ //判断用户是否关注公众号
              wx.reLaunch({ //如果未关注则转跳到提醒页面
                url: '../../pages/remind/remind',
              })
            }else{
              app.openid = r.openid;
              app.unionid = r.unionid;
              wx.request({
                url: app.url + 'login/index',
                data: {
                  unionid: r.unionid
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  var r = res.data;
                  if (!r) {
                    wx.reLaunch({
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
                            payC: '费用明细',
                            sumMoney: 0
                          })
                        } else {
                          wx.request({
                            url: app.url + 'invoice/invoice',
                            data: {
                              realestate: r.user.realestate_id
                            }, success: function (r) {
                              that.setData({
                                sumMoney: amount,
                                cur: r.data.month,
                                bef: (amount - r.data.month).toFixed(2),
                                payC: '立即缴费',
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

                    var re = res.data.address[0];
                    var u = res.data.user

                    userInfo.community = re.community;
                    userInfo.building = re.building;
                    userInfo.unit = re.number;
                    userInfo.room = re.room;
                    userInfo.phone = u.mobile_phone;
                    userInfo.name = u.real_name;
                    app.userInfo = userInfo;
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
            }            
          }
        })
      }
    })
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
