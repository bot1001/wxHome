const app = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tot_company: '',
    tot_companys: '',
    t_company: '',

    companys: '',
    comm: '',
    c_company: '',

    community: '',
    communitys: '',
    n_community: '',

    building: '',
    buildings: '',
    n_building: '',
    b: '', //小区编号

    unit: '',
    units: '',
    n_unit: '',

    room: '',
    rooms: '',
    n_room: '',
    roomId: '' //房屋编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.url + 'login/company',
      data: {
        yuda: ''
      }, success: function (res) {
        var c = res.data;
        that.setData({
          'tot_company': c.name,
          'tot_companys': c.company
        })
      }
    })
  },
  bindCompanyChange: function (e) {
    var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var d = e.detail.value
    var p = this.data.tot_companys[d].id
    // console.log(d);
    that.setData({
      't_company': d
    })
    wx.request({
      url: app.url + 'login/companys?company=' + p,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var d = res.data;
        that.setData({
          'comm': d.companys,
          'companys': d.name
        });

      }

    })
  },
  bindCompanysChange: function (e) {
    var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var d = e.detail.value
    var p = this.data.comm[d].id
    // console.log(d);
    that.setData({
      'c_company': d
    })

    // console.log(parseInt(e.detail.value) + 2);
    wx.request({
      url: app.url + 'login/community',
      data: {
        'company': p
      },
      success: function (res) {
        var d = res.data
        that.setData({
          'community': d.name,
          'communitys': d.communitys,
          'building': '',
          'unit': '',
          'room': '',
          'n_community': ''
        })
        // app.community = d.name;     
      }
    })
  },

  //多级联动获取楼宇
  bindCommunityChange: function (e) {
    var that = this;
    var d = e.detail.value
    var c = this.data.communitys[d].id
    // app.comV = app.community[d];
    that.setData({
      'n_community': d
    })

    wx.request({
      url: app.url + 'login/building',
      data: {
        community: c
      },
      success: function (res) {
        //buildingIndex用于请求单元数据
        var d = res.data;
        // app.building = d.name;
        that.setData({
          'building': d.name,
          'buildings': d.buildings,
          'unit': '',
          'room': '',
          'n_building': ''
        });
      }
    })
  },

  //由楼宇获取单元
  bindBuildingChange: function (e) {
    var that = this;
    var d = e.detail.value
    that.setData({
      'n_building': d
    })
    // app.buildV = app.building[d];
    var b = this.data.buildings[d].id

    wx.request({
      url: app.url + 'login/number',
      data: {
        building: b,
      },
      success: function (res) {
        //初始单元数据
        var u = res.data

        that.setData({
          'unit': u,
          'b': b,
          'room': '',
          'n_unit': ''
        })
        // app.unit = u;
      }
    })
  },

  bindUnitChange: function (e) {
    var that = this;
    var d = e.detail.value //选项值
    var u = this.data.unit[d] //获取对应的单元
    // app.unitV = u[d];
    that.setData({
      'n_unit': d
    })

    wx.request({
      url: app.url + 'login/room',
      data: {
        building: this.data.b,
        number: u
      },

      success: function (res) { //多级联动获取房号
        //初始房号数据
        var d = res.data;
        // app.room = d.name;
        that.setData({
          'room': d.name,
          'rooms': d.rooms,
          'n_room': ''
        })
      }
    })

  },

  bindRoomChange: function (e) { //由选择获取房屋id
    var that = this;
    var d = e.detail.value
    var r = this.data.rooms[d].id //获取小区编号
    that.setData({
      'n_room': d,
      'roomId': r //重新赋值小区编号
    })
    // app.roomV = app.room[d];
  },
  //提交关联房屋
  relation:function(e){
    var that = this;
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    if(that.data.roomId == ''){
      wx.showToast({
        title: '请完善房屋信息',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (name == ""){
      wx.showToast({
        title: '请完善身份信息',
        icon: 'none',
        duration: 2000
      })
    } else if (phone.length != 11) {
      wx.showToast({
        title: '请核对预留手机号',
        icon: 'none',
        duration: 2000
      })
    }else{
      //身份验证
      wx.request({
        url: app.url + 'login/realestate',
        data: {
          realestate: that.data.roomId,
          name: name,
          phone: phone
        }, success: function (res) {
          if (res.data == 1) {
            //关联房屋
            wx.request({
              url: app.url + 'user/relevancy',
              data: {
                account_id: app.account_id,
                realestate_id: that.data.roomId
              },
              method: 'GET',
              success: function (res) {
                wx.request({
                  url: app.url + 'login/index',
                  data: {
                    unionid: app.unionid
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    var userInfo = res.data.address;
                    var u = res.data.user;
                    // console.log(userInfo);
                    var realestateArr = [];
                    // for (var y = 0; y < userInfo.length; y++){
                    //   realestateArr.push(userInfo[y].realestate);
                    // }
                    for (var i = 0; i < userInfo.length; i++) {
                      realestateArr.push(userInfo[i].realestate);
                      // userInfo[i].houseArr = that.fnk(userInfo);
                      userInfo[i].phone = u.mobile_phone;
                      userInfo[i].name = u.real_name;
                    }
                    //  console.log(userInfo);
                    app.realestateArr = realestateArr;
                    app.userInfo = userInfo;
                    app.houseInfo = that.fn(userInfo);
                    wx.reLaunch({
                      url: '../../pages/personal/personal'
                    })
                  }
                })
              },
              fail: function (res) { },
              complete: function (res) {
                // console.log(res);
                wx.showToast({
                  title: '关联成功！',
                  icon: 'none',
                  duration: 2000
                })
              },
            })
          } else if (res.data == '') {
            wx.showToast({
              title: '验证失败，请核对关联信息',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      //关联房屋
     
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
  fn: function (a) {
    let ai = [];
    for (let i = 0; i < a.length; i++) {
      let pi = a[i].community + ' ' + a[i].building + ' ' + a[i].number + ' ' + a[i].room;
      ai.push(pi);
    }
    return ai;
  }
  // fnk: function (a) {
  //   let ai = [];
  //   for (let i = 0; i < a.length; i++) {
  //     let pi = {};
  //     pi.message = a[i].community + ' ' + a[i].building + ' ' + a[i].number + ' ' + a[i].room;
  //     ai.push(pi);
  //   }
  //   return ai;
  // }
})