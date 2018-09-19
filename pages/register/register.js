// pages/register/register.js
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tot_company: '',
    tot_companys: ["广西裕达集团物业服务有限公司"],
    t_company: 0,

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
    roomId: '', //房屋编号

    // region: ['广西壮族自治区', '来宾市', '兴宾区'],
    customItem: '全部',
    gender:['男','女'],
    gen: '',
    genderListIndex:'',
    cityInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.timeS = that.timeStamp();
    // console.log(timeStamp);
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res);
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })

    wx.request({      
      url: app.url+'login/companys?company=1',
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
    // wx.request({
    //   url: ''
    // })
  },
  //城市地区
  // bindRegionChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },
  // bindAllCompanysChange:function(e){
  //   var that = this;
  //   // console.log('picker发送选择改变，携带值为', e.detail.value)
  //   var d = e.detail.value
  //   // var p = this.data.comm[d].id

  //   that.setData({
  //     'a_number': d
      
  //   })

  // },
  bindCompanyChange:function(e){
    
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
      url: app.url+'login/community',
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
          'n_community':''
        }) 
        // app.community = d.name;     
      } 
    })
  },

  //多级联动获取楼宇
  bindCommunityChange: function(e){
    var that = this;
    var d = e.detail.value
    var c = this.data.communitys[d].id
    // app.comV = app.community[d];
    that.setData({
      'n_community': d
    })

    wx.request({
      url: app.url+'login/building',
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
          'n_building':''
        });
      }
    })
  },

  //由楼宇获取单元
  bindBuildingChange:function(e){
    var that = this;
    var d = e.detail.value
    that.setData({
      'n_building': d
    })
    // app.buildV = app.building[d];
    var b = this.data.buildings[d].id

    wx.request({
      url: app.url+'login/number',
      data: {
        building: b,
      },
      success: function (res) {
        //初始单元数据
        var u = res.data
        
        that.setData({
          'unit': u,
          'b': b,
          'room':'',
          'n_unit':''
        })
        // app.unit = u;
      }
    })
  },

  bindUnitChange: function(e){
    var that = this;
    var d = e.detail.value //选项值
    var u = this.data.unit[d] //获取对应的单元
    // app.unitV = u[d];
    that.setData({
      'n_unit': d
    })
    
    wx.request({
      url: app.url+'login/room',
      data: {
        building: this.data.b,
        number: u
      },

      success: function (res) { //多级联动获取房号
        //初始房号数据
        var d = res.data
        // app.room = d.name;
        that.setData({
          'room': d.name,
          'rooms': d.rooms,
          'n_room':''
        })
      }
    })
    
  },

  bindRoomChange: function(e){ //由选择获取房屋id
    var that = this;
    var d = e.detail.value
    var r = this.data.rooms[d].id //获取小区编号

    that.setData({
      'n_room': d,
      'roomId': r //重新赋值小区编号
    })
    // app.roomV = app.room[d];
  },

  bindGenderChange: function (e) {
    var that = this;
    that.setData({
      'gen': e.detail.value+1, //1=>男,2=>女
      'genderListIndex': e.detail.value
    })
  },
  timeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + '';
  },
  formSubmit:function(e){
    var that = this;
    // var openId = { "test": wx.getStorageSync('openId') };
    // var unionId = { "test": wx.getStorageSync('unionId') };
    // var openId = app.openId;
    // var unionId = app.unionId;
    var name = { "test": e.detail.value.name };
    var phone = { "test": e.detail.value.phone };
    var roomId = this.data.roomId ;
    // var passWord = { "test": e.detail.value.passWord };
    var gender = { "test": this.data.genderListIndex };
    var region = {"test":this.data.region};
    // console.log(e.detail.value.name);
    // console.log(e.detail.value.phone.length);
    // console.log(this.data.roomId);
    if (name.test == ""){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })

    } else if (phone.test.length != 11){
      wx.showToast({
        title: '请输入有效手机号码',
        icon: 'none',
        duration: 2000
      })

    } else if (roomId.test == ""){
      wx.showToast({
        title: '请完善房屋信息',
        icon: 'none',
        duration: 2000
      })

    } else {
      wx.request({
        url: app.url +'login/realestate',
        data:{
          realestate: roomId,
          name: name.test,
          phone: phone.test
        },success:function(res){
          app.registerNeed.room = roomId;
          app.registerNeed.gender = gender.test;
          app.registerNeed.name = name.test
          if(res.data == 1){
            wx.reLaunch({
                url: '../../pages/message/message'
            })   
          }else if(res.data == ''){
            wx.showToast({
              title: '验证失败，请核对验证信息',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    }
  }

})