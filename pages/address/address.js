// pages/address/address.js
const app = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addres: '',
    page: '1',
    address: '',
    address_edite: '',
    name: '',
    phone: '',
    show: false,
    and: "+",
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    //设置请求页面
    wx.request({
      url: app.url +'shopping-address/index',
      data:{
        account_id: app.account_id,
        page: '1'
      },
      success: function(res){
        that.setData({
          address: res.data
        })
      }
    })
  },

  //添加地址
  add: function(e){
    var phone = e.currentTarget.id;
    // console.log(phone);
    if (phone == '+') {//显示地址输入框
      this.setData({
        and: "-",
        show: !this.data.show,
        address_edite: '',
        name: '',
        phone: ''
      })
    }else if(phone == '-'){
      this.setData({
        and: "+",
        show: !this.data.show,
        name: '',
        address_edite: '',
        phone: '',
        id:''
      })
    }
  },

  //选择地址
  location: function(){
    var that = this;
    wx.chooseLocation({//获取用户地址，打开地图并输入
      success: function(res) {
        that.setData({
          address_edite: res.address + res.name
        })
      },
    })
  },

  //提交数据
  submit: function(e){
    var that = this
    var d = e.detail.value;
    var name = d.name;
    var phone = d.phone;
    var address = d.address;

    //提交数据
    if(name == '' || phone == '' || address == ''){
      wx.showToast({
        title: '数据不能为空',
        icon: 'none',
        duration: 2000
      })
    }else if(phone.length < 11 || phone.length > 12){
      wx.showToast({
        title: '手机号码有误，请检查',
      })
    }else{
      wx.request({
        url: app.url + 'shopping-address/add',
        data: {
          account_id: app.account_id,
          id: that.data.id,
          address: address,
          phone: phone,
          name: name
        },
        success: function(res){
          console.log(res.data)
          if(res.data != '1'){
            wx.showToast({
              title: '添加失败，请查看是否重复添加',
              icon: 'none',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '操作成功',
              duration: 1500
            }),
            //刷新数据
            wx.request({
              url: app.url + 'shopping-address/index',
              data: {
                account_id: app.account_id,
                page: '1'
              },
              success: function (res) {
                that.setData({
                  address: res.data
                })
              }
            })
          }
        }
      })
    }
    
  },

  //删除地址
  del: function(e){
    var that = this
    var id = e.currentTarget.id
    wx.vibrateLong();//震动提醒
    wx.showModal({
      title: '您确定要删除吗？',
      content: '此操作将不可逆',
      
      success: function(r){
        if(r.confirm){ //如果用户取消操作
          wx.request({
            url: app.url +'shopping-address/del',
            data:{
              id: id
            },
            success: function(result){
              if(result.data == '1'){
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                }),
                //刷新数据
                wx.request({
                  url: app.url + 'shopping-address/index',
                  data: {
                    account_id: app.account_id,
                    page: '1'
                  },
                  success: function (res) {
                    that.setData({
                      address: res.data
                    })
                  }
                })
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  curation: 2000
                })
              }
            }
          })
        }
      }
    })
  },

  //编辑地址
  edite: function(e){
    var that = this
    var d = e.currentTarget.dataset; //接收传参
    that.setData({
      id: d.id,
      address_edite: d.address,
      name: d.name,
      phone: d.phone
    })

    if(that.data.and == '+'){
      that.setData({
        and: '-',
        show: !this.data.show
      })
    }
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
    var that = this;
    wx.showLoading({ //显示加载信息
      title: '加载中……',
    })
    //设置请求页面
    wx.request({
      url: app.url + 'shopping-address/index',
      data: {
        account_id: app.account_id,
        page: '1'
      },
      success: function (res) {
        that.setData({
          address: res.data
        })
      }
    })
    wx.hideLoading(); //隐藏加载提醒 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.showNavigationBarLoading(); //在标题栏中显示加载
    wx.showLoading({
      title: '加载中……',
    })
    var that = this;
    var page = this.data.page;
    page++;

    //设置请求页面
    wx.request({
      url: app.url + 'shopping-address/index',
      data: {
        account_id: app.account_id,
        page: page
      },
      success: function (res) {
        if(res.data == ''){
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 2000
          })
          wx.vibrateLong() //震动提醒
          return; //直接返回
        }
        that.setData({
          address: that.data.address.concat(res.data), //合并请求到的数据,
          page: page
        })
      }
    })
    wx.hideLoading(); //隐藏加载提醒
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})