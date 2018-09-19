// pages/noticeList/noticeList.js
const app = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    payShow: true,
   payDetail: '',
   sumMoney: 0,
   scrollTop: 0,
   text: '加载中..'
    // key:'yanzushiwangbadan383838438888888',
    // terminal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: that.data.text,
    })
    
    // let payIndex = wx.getStorageSync('realestate_id');
    let page = app.page;
    // let sumMoney = that.data.sumMoney;
  //  var realestate_id = wx.getStorageSync('realestate_id');
    var realestate_id = app.realestate_id;
    // 动态设置导航条标题
    wx.setNavigationBarTitle({
      title: '缴费'
    }); 
    wx.request({
      url: app.url+'invoice/sum',
      data:{
        realestate_id: realestate_id
      },success:function(res) {
        // console.log(res);
        if (res.data.amount == null){
          that.setData({
            payShow : false
          })
        }else{
          that.setData({
            sumMoney: res.data.amount
          })
        }
       
      }
    })

    wx.request({
      url: app.url+'invoice/index',
      data: {
        realestate: realestate_id,
        page:page
      },
      success: function (res) {
        var info = {};
        info = res;
        // console.log(info);
        var payContent = info.data;
        // console.log(payContent);
        for(var i=0;i<payContent.length;i++){
          if (payContent[i].invoice_status == 0){
            // payContent[i].invoice_status = '欠费';
            payContent[i].color = '#fd612b';
            payContent[i].bgcolor = '#FFC8B4';
           
          } else if (payContent[i].invoice_status == 3){  
            // payContent[i].invoice_status = '刷卡';
            payContent[i].color = '#333';
            payContent[i].bgcolor = '#BBFFEE';
          
          } else if (payContent[i].invoice_status == 2){
            // payContent[i].invoice_status = '微信';
            payContent[i].color = '#333';
            payContent[i].bgcolor ='#CCFF99';
           
          } else if (payContent[i].invoice_status == 6) {
            // payContent[i].invoice_status = '现金';
            payContent[i].color = '#333';
            payContent[i].bgcolor = '#FFFFBB';
           
          } else if (payContent[i].invoice_status == 8) {
            // payContent[i].invoice_status = '优惠';
            payContent[i].color = '#333';
            payContent[i].bgcolor = '#ccccff';
          
          }else{
            payContent[i].color = '#333';
            payContent[i].bgcolor = '#AAAAAA';
            
          }
        }
        page+=1;
        wx.setStorageSync('payInfo', payContent);
        wx.setStorageSync('page', page);
        // var userInfo = wx.getStorageSync('userInfo');
        var userInfo = app.userInfo;
        that.setData({
          payDetail: info.data,
          userInfo: userInfo
          // sumMoney: sumMoney.toFixed(2)
        });

        wx.hideLoading();
        // console.log(sumMoney);
      }
    })
    // const pd = wx.getStorageSync('payDetail');
    // this.setData({
    //   payDetail: pd
    // })

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /* 滑动触底事件 */
  onReachBottom: function () {
    // console.log(this.orderNumber());
    // 动态设置导航条标题
    // wx.setNavigationBarTitle({
    //   title: '加载中...'
    // });
    // wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    var that = this;
    wx.showLoading({
      title: that.data.text,
    })
    var url = app.url+'invoice/index';//根据实际情况定义请求的路径
    // var payIndex = wx.getStorageSync('realestate_id'); 
    var payIndex = app.realestate_id;
    var payInfo1 = wx.getStorageSync('payInfo');
    var page = wx.getStorageSync('page');                           //请求的参数
    // 验证参数合法性
    // flag = app.isParameterdValidate(user_id, '该用户不存在');
    // if (flag == false) { return; }
    // 发送请求
    wx.request({
      url: url,
      data: {
        realestate: payIndex,
        page:page
      },
      method: 'GET',
      //请求成功的函数处理
      success: function (res) {
        let info = {};
        info = res;
        let payContent1 = info.data;
        let dataTF = wx.getStorageSync('payInfo');
        // console.log(res);
        // let curData = payContent1[payContent1.length - 1].invoice_id;
        // let befData = dataTF[dataTF.length - 1].invoice_id;
        // let sumMoney = Number(that.data.sumMoney);
        // console.log(curData);
        // console.log(befData);
        if (payContent1 == ''){
          that.setData({
            text:'到底了..'
          })
          return;
        }else{
          for (var i = 0; i < payContent1.length; i++) {
            if (payContent1[i].invoice_status == 0) {
              // payContent1[i].invoice_status = '欠费';
              // payContent1[i].color = 'red';
              payContent1[i].color = '#fd612b';
              payContent1[i].bgcolor = '#FFC8B4';

              // sumMoney += Number(payContent1[i].invoice_amount);
            } else if (payContent1[i].invoice_status == 3) {
              // payContent1[i].invoice_status = '刷卡';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = '#BBFFEE';
              
            } else if (payContent1[i].invoice_status == 2) {
              // payContent[i].invoice_status = '微信';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = '#CCFF99';
            
            } else if (payContent1[i].invoice_status == 6) {
              // payContent[i].invoice_status = '现金';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = '#FFFFBB';
             
            } else if (payContent1[i].invoice_status == 8) {
              // payContent[i].invoice_status = '优惠';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = '#ccccff';
             
            }else{
              // payContent1[i].invoice_status = '已缴费';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = '#AAAAAA';
             
            }
          }
          var payInfo2 = payInfo1.concat(payContent1);
          page += 1;
          wx.setStorageSync('page', page);
          wx.setStorageSync('payInfo', payInfo2);
          that.setData({
            payDetail: payInfo2
          });
        }      
      },
      fail: function (res) {                             //请求失败的处理
        console.log(res.data.msg);
      },
      complete: function () {
        wx.hideNavigationBarLoading();                   //完成停止加载
         //动态设置导航条标题
        wx.setNavigationBarTitle({
          title: '缴费'
        });
        wx.hideLoading();
        // wx.stopPullDownRefresh();                       //停止下拉刷新
      }
    })
  },
  /* 点击缴费操作 */
  payBtn:function(event){
    //获取当前时间戳
    var that = this;
    // var openId = wx.getStorageSync('openId');
    var openId = app.openId;
    var amount = that.data.sumMoney;
    wx.request({
      url: app.url +'invoice/order-create',
      data:{
        realestate: app.realestate_id,
        account: app.account_id
      },success:function(res){
        // console.log(res);
        let order_id = res.data;
        wx.request({
          // url: app.url+'pay/wx?order_id=20180817171504315&description=%E7%89%A9%E4%B8%9A%E7%BC%B4%E8%B4%B9&community=16&amount=0.01&openid=oltpJ5AdykNk6FE6c2_5wIvASYPw',
          url: app.url + 'pay/wx?order_id=' + order_id + '&description=address&amount=' + amount + '&openid=' + openId,
          data: {  // 这里正常项目不会只有openid一个参数

          },
          method: 'GET',
          success: function (res) {
            // console.log(res);
            var appId = res.data.appid;
            var nonceStr = res.data.nonce_str;
            var pkg = 'prepay_id=' + res.data.prepay_id;
            var timeStamp = that.timeStamp();
            // console.log(that.orderNumber());
            if (res.result_code = 'SUCCESS') {
              var payModel = res;
              var paySign = that.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=yanzushiwangbadan383838438888888").toUpperCase();
              wx.requestPayment({
                'timeStamp': timeStamp,
                'nonceStr': payModel.data.nonce_str,
                'package': 'prepay_id=' + payModel.data.prepay_id,
                'signType': 'MD5',
                'paySign': paySign,
                'success': function (res) {
                  // console.log("SUCCESS");
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.redirectTo({
                    url: '../../pages/order/order'
                  })
                },
                'fail': function (res) {
                  console.log(res);
                }
              })
            }
          },
          fail: function () {

          }
        })
      }
    })

    
  
  }
  ,
  /*时间戳 */
  timeStamp:function() {
      return parseInt(new Date().getTime() / 1000) + '';
  },
  /* 加密算法准备 */
  safe_add:function(x, y){
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)

    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)

    return (msw << 16) | (lsw & 0xFFFF)
  },
  rol: function (num, cnt){
    return (num << cnt) | (num >>> (32 - cnt))
  },
  cmn: function (q, a, b, x, s, t){
    return this.safe_add(this.rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b)
  },
  ff: function (a, b, c, d, x, s, t) {
    return this.cmn((b & c) | ((~b) & d), a, b, x, s, t)
  },
  gg: function (a, b, c, d, x, s, t) {
    return this.cmn((b & d) | (c & (~d)), a, b, x, s, t)
  },
  hh: function (a, b, c, d, x, s, t) {
    return this.cmn(b ^ c ^ d, a, b, x, s, t)
  },
  ii: function (a, b, c, d, x, s, t) {
    return this.cmn(c ^ (b | (~d)), a, b, x, s, t)
  },
  /* MD5加密算法1 换成十六进制字符串*/
  binl2hex:function(binarray){
    var hex_tab = "0123456789abcdef"

    var str = ""

    for (var i = 0; i < binarray.length * 4; i++) {

      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +

        hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)

    }

    return str
  },
  /* 签名算法二 */
  coreMD5:function(x){
    var a = 1732584193

    var b = -271733879

    var c = -1732584194

    var d = 271733878



    for (var i = 0; i < x.length; i += 16) {

      var olda = a

      var oldb = b

      var oldc = c

      var oldd = d



      a = this.ff(a, b, c, d, x[i + 0], 7, -680876936)

      d = this.ff(d, a, b, c, x[i + 1], 12, -389564586)

      c = this.ff(c, d, a, b, x[i + 2], 17, 606105819)

      b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330)

      a = this.ff(a, b, c, d, x[i + 4], 7, -176418897)

      d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426)

      c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341)

      b = this.ff(b, c, d, a, x[i + 7], 22, -45705983)

      a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416)

      d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417)

      c = this.ff(c, d, a, b, x[i + 10], 17, -42063)

      b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162)

      a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682)

      d = this.ff(d, a, b, c, x[i + 13], 12, -40341101)

      c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290)

      b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329)



      a = this.gg(a, b, c, d, x[i + 1], 5, -165796510)

      d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632)

      c = this.gg(c, d, a, b, x[i + 11], 14, 643717713)

      b = this.gg(b, c, d, a, x[i + 0], 20, -373897302)

      a = this.gg(a, b, c, d, x[i + 5], 5, -701558691)

      d = this.gg(d, a, b, c, x[i + 10], 9, 38016083)

      c = this.gg(c, d, a, b, x[i + 15], 14, -660478335)

      b = this.gg(b, c, d, a, x[i + 4], 20, -405537848)

      a = this.gg(a, b, c, d, x[i + 9], 5, 568446438)

      d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690)

      c = this.gg(c, d, a, b, x[i + 3], 14, -187363961)

      b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501)

      a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467)

      d = this.gg(d, a, b, c, x[i + 2], 9, -51403784)

      c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473)

      b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734)



      a = this.hh(a, b, c, d, x[i + 5], 4, -378558)

      d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463)

      c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562)

      b = this.hh(b, c, d, a, x[i + 14], 23, -35309556)

      a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060)

      d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353)

      c = this.hh(c, d, a, b, x[i + 7], 16, -155497632)

      b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640)

      a = this.hh(a, b, c, d, x[i + 13], 4, 681279174)

      d = this.hh(d, a, b, c, x[i + 0], 11, -358537222)

      c = this.hh(c, d, a, b, x[i + 3], 16, -722521979)

      b = this.hh(b, c, d, a, x[i + 6], 23, 76029189)

      a = this.hh(a, b, c, d, x[i + 9], 4, -640364487)

      d = this.hh(d, a, b, c, x[i + 12], 11, -421815835)

      c = this.hh(c, d, a, b, x[i + 15], 16, 530742520)

      b = this.hh(b, c, d, a, x[i + 2], 23, -995338651)



      a = this.ii(a, b, c, d, x[i + 0], 6, -198630844)

      d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415)

      c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905)

      b = this.ii(b, c, d, a, x[i + 5], 21, -57434055)

      a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571)

      d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606)

      c = this.ii(c, d, a, b, x[i + 10], 15, -1051523)

      b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799)

      a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359)

      d = this.ii(d, a, b, c, x[i + 15], 10, -30611744)

      c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380)

      b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649)

      a = this.ii(a, b, c, d, x[i + 4], 6, -145523070)

      d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379)

      c = this.ii(c, d, a, b, x[i + 2], 15, 718787259)

      b = this.ii(b, c, d, a, x[i + 9], 21, -343485551)



      a = this.safe_add(a, olda)

      b = this.safe_add(b, oldb)

      c = this.safe_add(c, oldc)

      d = this.safe_add(d, oldd)

    }

    return [a, b, c, d]
  },
  /* 签名算法三 */
  str2binl:function(str){
    var nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks    

    var blks = new Array(nblk * 16)

    for (var i = 0; i < nblk * 16; i++) blks[i] = 0

    for (var i = 0; i < str.length; i++)

      blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)

    blks[i >> 2] |= 0x80 << ((i % 4) * 8)

    blks[nblk * 16 - 2] = str.length * 8

    return blks
  },
  /* MD5调用结果 */
  hexMD5: function(str){
    return this.binl2hex(this.coreMD5(this.str2binl(str))) 
  },
  /* 商户订单号 */
  orderNumber:function(){
    var myDate = new Date();
    var year = myDate.getFullYear();
    var mouth = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    var second = myDate.getSeconds();
    var msecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
    if (mouth < 10) { /*月份小于10  就在前面加个0*/
      mouth = String(String(0) + String(mouth));
    }
    if (day < 10) { /*日期小于10  就在前面加个0*/
      day = String(String(0) + String(day));
    }
    if (hour < 10) { /*时小于10  就在前面加个0*/
      hour = String(String(0) + String(hour));
    }
    if (minute < 10) { /*分小于10  就在前面加个0*/
      minute = String(String(0) + String(minute));
    }
    if (second < 10) { /*秒小于10  就在前面加个0*/
      second = String(String(0) + String(second));
    }
    if (msecond < 10) {
      msecond = String(String(0) + String(second));
    } else if (msecond >= 10 && msecond < 100) {
      msecond = String(String(0) + String(second));
    }

    var currentDate = String(year) + String(mouth) + String(day) + String(hour) + String(minute) + String(second) + String(msecond);
    return currentDate;

  }
//   /*终端ip*/
//   terminal:function(){
//     let that = this;
//     wx.request({
//       url: 'https://ip-api.com/json',
//       success: function (e) {
//        that.setData({
//          terminal: e.data.query
//        })
//       }
//     })
//   }
})