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
    let page = app.page;
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
            payContent[i].bgcolor = 'rgba(255, 200, 180, 0.452)';
           
          } else if (payContent[i].invoice_status == 3){  
            // payContent[i].invoice_status = '刷卡';
            payContent[i].color = '#333';
            payContent[i].bgcolor = 'rgba(187, 255, 238, 0.534)';
          
          } else if (payContent[i].invoice_status == 2){
            // payContent[i].invoice_status = '微信';
            payContent[i].color = '#333';
            payContent[i].bgcolor ='rgba(204, 255, 153, 0.473)';
           
          } else if (payContent[i].invoice_status == 6) {
            // payContent[i].invoice_status = '现金';
            payContent[i].color = '#333';
            payContent[i].bgcolor = 'rgba(255, 255, 187, 0.445)';
           
          } else if (payContent[i].invoice_status == 8) {
            // payContent[i].invoice_status = '优惠';
            payContent[i].color = '#333';
            payContent[i].bgcolor = '#ccffcca8';
          
          }else{
            payContent[i].color = '#333';
            payContent[i].bgcolor = 'rgba(223, 222, 222, 0.692)';
            
          }
        }
        page+=1;
        wx.setStorageSync('payInfo', payContent);
        wx.setStorageSync('page', page);
        // var userInfo = wx.getStorageSync('userInfo');
        var userInfo = app.userInfo[app.signal];
        that.setData({
          payDetail: info.data,
          userInfo: userInfo
          // sumMoney: sumMoney.toFixed(2)
        });

        wx.hideLoading();
        // console.log(sumMoney);
      }
    })
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
      title: that.data.text
    })
    var url = app.url+'invoice/index';//根据实际情况定义请求的路径
    // var payIndex = wx.getStorageSync('realestate_id'); 
    var payIndex = app.realestate_id;
    var payInfo1 = wx.getStorageSync('payInfo');
    var page = wx.getStorageSync('page');                           //请求的参数
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
              payContent1[i].bgcolor = 'rgba(255, 200, 180, 0.452)';

              // sumMoney += Number(payContent1[i].invoice_amount);
            } else if (payContent1[i].invoice_status == 3) {
              // payContent1[i].invoice_status = '刷卡';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = 'rgba(187, 255, 238, 0.534)';
              
            } else if (payContent1[i].invoice_status == 2) {
              // payContent[i].invoice_status = '微信';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = 'rgba(204, 255, 153, 0.473)';
            
            } else if (payContent1[i].invoice_status == 6) {
              // payContent[i].invoice_status = '现金';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = 'rgba(255, 255, 187, 0.445)';
             
            } else if (payContent1[i].invoice_status == 8) {
              // payContent[i].invoice_status = '优惠';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = '#ccccff';
             
            }else{
              // payContent1[i].invoice_status = '已缴费';
              payContent1[i].color = '#333';
              payContent1[i].bgcolor = 'rgba(223, 222, 222, 0.692)';
             
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
        let order_id = res.data.order_id; //订单id
        let address = res.data.address; //订单地址
        wx.request({          
          url: app.url + 'pay/wx',//统一下单接口
          data: {  // 接口传参
             order_id: order_id,
             description: address,
             amount: amount,
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
              // var paySign = that.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=yanzushiwangbadan383838438888888").toUpperCase();
              // wx.requestPayment({
              //   'timeStamp': timeStamp,
              //   'nonceStr': payModel.data.nonce_str,
              //   'package': 'prepay_id=' + payModel.data.prepay_id,
              //   'signType': 'MD5',
              //   'paySign': paySign,

              //   'success': function (res) {
              //     wx.showToast({
              //       title: '支付成功',
              //       icon: 'success',
              //       duration: 2000
              //     })
              //     wx.redirectTo({ //如果支付成功转跳到订单页面
              //       url: '../../pages/order/order'
              //     })
              //   },
              //   'fail': function (res) {
              //     console.log(res);
              //   }
              // })
              var pay = 'appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=yanzushiwangbadan383838438888888";
              wx.request({
                url: 'https://api.gxydwy.com/md5/md5',
                data: {
                  value: pay,
                  type: '1' //1表示加密后把字母转换成大写
                },
                success: function (result) {
                  wx.requestPayment({
                    'timeStamp': timeStamp,
                    'nonceStr': payModel.data.nonce_str,
                    'package': 'prepay_id=' + payModel.data.prepay_id,
                    'signType': 'MD5',
                    'paySign': result.data,
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
})