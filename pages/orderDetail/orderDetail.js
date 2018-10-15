// pages/orderDetail/orderDetail.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:'',
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.url + 'order/order',
      data:{
        order: options.id,
        invoice: ''
      },
      success:function(res){
        var order = res.data.order;
        var gateway = order.gateway;
        var invoice = res.data.invoice;
        var status = order.status;
        switch (gateway){
          case "0":
            order.gatetype = "欠费";
            break;
          case "1":
            order.gatetype = "支付宝";
            break;
          case "2":
            order.gatetype = "微信";
            break;
          case "3":
            order.gatetype = "刷卡";
            break;
          case "4":
            order.gatetype = "银行";
            break;
          case "5":
            order.gatetype = "政府";
            break;
          case "6":
            order.gatetype = "现金";
            break;
          case "7":
            order.gatetype = "建行";
            break;
          case "8":
            order.gatetype = "优惠";
            break;   
        }

        switch (status) {
          case "1":
            order.sta = "未支付";
            break;
          case "2":
            order.sta = "已支付";
            break;
          case "3":
            order.sta = "已取消";
            break;
          case "4":
            order.sta = "送货中";
            break;
          case "5":
            order.sta = "已签收";
            break;
        }
        //判断缴费状态是否使用支付功能
        // if(){

        // }
        that.setData({
          orderInfo: order,
          status: status,
          invoice: invoice
        })
        console.log(that.data.orderInfo);
      }
    })
    // this.setData({
    //   id: options.id,
    //   address: options.address,
    //   amount: options.amount,
    //   create_time: options.create_time,
    //   description: options.description,
    //   name: options.name,
    //   payment_time: options.payment_time,
    //   sta: options.sta
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  payBtn:function(){
    var that = this;
    var orderData = that.data.orderInfo;
    wx.request({
      url: app.url + 'pay/wx',//统一下单接口
      data: {  // 接口传参
        order_id: orderData.order_id,
        description: orderData.address,
        amount: orderData.amount,
        openid: app.openid
      },
      method: 'GET',
      success: function (res) {
        // 发起微信支付
        var appId = res.data.appid;
        var nonceStr = res.data.nonce_str;
        var pkg = 'prepay_id=' + res.data.prepay_id;
        var timeStamp = that.timeStamp();
        // console.log(that.orderNumber());
        if (res.result_code = 'SUCCESS') {
          var payModel = res;
          // 微信信息加密
          var paySign = that.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=yanzushiwangbadan383838438888888").toUpperCase();
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': payModel.data.nonce_str,
            'package': 'prepay_id=' + payModel.data.prepay_id,
            'signType': 'MD5',
            'paySign': paySign,

            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
              })
              wx.redirectTo({ //如果支付成功转跳到订单页面
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
  },
  timeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + '';
  },
  /* MD5调用结果 */
  hexMD5: function (str) {
    return this.binl2hex(this.coreMD5(this.str2binl(str)))
  },
  /* 加密算法准备 */
  safe_add: function (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)

    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)

    return (msw << 16) | (lsw & 0xFFFF)
  },
  rol: function (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  },
  cmn: function (q, a, b, x, s, t) {
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
  binl2hex: function (binarray) {
    var hex_tab = "0123456789abcdef"

    var str = ""

    for (var i = 0; i < binarray.length * 4; i++) {

      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +

        hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)

    }

    return str
  },
  /* 签名算法二 */
  coreMD5: function (x) {
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
  str2binl: function (str) {
    var nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks    

    var blks = new Array(nblk * 16)

    for (var i = 0; i < nblk * 16; i++) blks[i] = 0

    for (var i = 0; i < str.length; i++)

      blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)

    blks[i >> 2] |= 0x80 << ((i % 4) * 8)

    blks[nblk * 16 - 2] = str.length * 8

    return blks
  }
})