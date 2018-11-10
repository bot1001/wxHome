//index.js
//获取应用实例
const app = getApp().globalData
Page({
  data: {
    imgUrls:'',
    show:app.show,
    indicatorDots:true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    userInfo: '',
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
            app.session_key = r.session_key; //贮存session密钥
            if(!r.unionid && r.openid){ //判断用户是否关注公众号
              wx.reLaunch({ //如果未关注则转跳到提醒页面
                url: '../../pages/remind/remind'
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
                  // console.log(r);
                  if (!r) {
                    wx.reLaunch({
                    url: '../../pages/registerMethod/registerMethod', //转条到注册选择页面
                    })
                  } else {
                    app.account_id = r.user.account_id;
                    app.realestate_id = r.address[app.signal].realestate;
                    //如果登陆成功则设置首页为可显示状态

                    //欠费提示
                    wx.request({
                      url: app.url + 'invoice/sum',
                      data: {
                        realestate_id: r.address[app.signal].realestate
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
                              realestate: r.address[app.signal].realestate
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

                    // var re = res.data.address[app.signal];
                    var userInfo = res.data.address;
                    var u = res.data.user;
                    // console.log(userInfo);
                    var realestateArr = [];
                    // for (var y = 0; y < userInfo.length; y++){
                    //   realestateArr.push(userInfo[y].realestate);
                    // }
                    for (var i = 0; i < userInfo.length;i++){
                      realestateArr.push(userInfo[i].realestate);
                      // userInfo[i].community = address[i].community;
                      // userInfo[i].building = address[i].building;
                      // userInfo[i].unit = address[i].number;
                      // userInfo[i].room = address[i].room;
                      // userInfo[i].address = address;
                      // userInfo[i].houseInfo = that.fn(userInfo);
                      // userInfo[i].houseArr = that.fnk(userInfo);
                      userInfo[i].phone = u.mobile_phone;
                      userInfo[i].name = u.nickname;
                      userInfo[i].gender = u.gender;
                      userInfo[i].account = u.account_id;
                      userInfo[i].realname = u.real_name;
                      // userInfo[i].realestateArr = realestateArr;
                    }
                  //  console.log(userInfo);
                    app.realestateArr = realestateArr;
                    app.userInfo = userInfo;
                    // console.log(userInfo);
                    app.houseInfo = that.fn(userInfo);
                    that.setData({
                      userInfo: userInfo[app.signal],
                      loading: false,
                      realestate_id: r.address[app.signal].realestate
                    })
                    wx.request({
                      url: app.url + 'advertise/index',
                      data:{
                        community: userInfo[app.signal].community
                      },
                      success:function(res){
                        var imgData = res.data;
                        var imgUrls = [];
                        for (let i = 0; i < imgData.length;i++){
                          imgUrls.push(imgData[i].poster);
                        }
                        that.setData({
                          imgUrls: imgUrls
                        })
                      }
                    })
                    // console.log(userInfo.houseInfo);
                    //公告栏首页
                    wx.request({
                      url: app.url + 'news/home?community=' + userInfo[app.signal].community,
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
                  }
                }
              })
            }            
          }
        })
      }
    })
    if(app.fastRegist == 1){
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '注册信息是系统默认信息，请及时核对、修改个人信息',
        success(res) {
         
        }
      })
    }
    app.fastRegist = 0;
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
  },
  fn:function(a){
      let ai = [];
      for (let i = 0; i < a.length; i++) {
        let pi = a[i].community + ' ' + a[i].building + ' ' + a[i].number + ' ' + a[i].room;
        ai.push(pi);
      }
      return ai;
  }
  // fnk:function(a){
  //   let ai = [];
  //   for (let i = 0; i < a.length; i++) {
  //     let pi = {};
  //      pi.message = a[i].community + ' ' + a[i].building + ' ' + a[i].number + ' ' + a[i].room;
  //     ai.push(pi);
  //   }
  //   return ai;
  // }
})
