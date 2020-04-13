//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    hasUserInfo: false, //是否已获取用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),//getuserinfo需要用户点击授权
    bguserInfo:null,//用户信息
    avatarUrl:null//头像url
  },
  onLoad: function () {
    //获取userinfo
    if(app.globalData.token){
      this.getBguserInfo();
      this.setData({
        avatarUrl: wx.getStorageSync('avatar')
      });
    }
  },
  onShow:function(){
    if(app.globalData.token){
      this.getBguserInfo();
    }
  },
  getUserInfo: function (e) {
    var that=this;
    if (e.detail.userInfo) {
      //用户点击了授权按钮
      //获取token
      wx.showLoading({
        title: '正在登录',
        duration:10000
      });
      app.refreshToken(function(token){
        wx.request({
          url: 'https://tebiezan.cn/api/user/info',
          header: {
            token: token
          },
          method: "GET",
          success: info => {
            if (info.statusCode == 200) {
              that.setData({
                bguserInfo: info.data,
                hasUserInfo: true,
                avatarUrl: wx.getStorageSync('avatar')
              });
              wx.hideLoading();
            } else {
              wx.showToast({
                title: '未知错误！',
                icon: 'loading',
                duration: 1000
              })
            }
          }
        })
      });
    } else {
      //用户按了拒绝按钮
    }
  },
  
  //获取查词数、等级等信息
  getBguserInfo:function()
  {
    var that=this;
    wx.request({
      url: 'https://tebiezan.cn/api/user/info',
      header: {
        token: app.getToken()
      },
      method: "GET",
      success: info => {
        if (info.statusCode == 200) {
          that.setData({
            bguserInfo: info.data,
            hasUserInfo: true
          });
        } else if(info.statusCode==401){
          //token过期
          app.refreshToken(function(token){
            that.getBguserInfo();
          });
        }
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: "嘿，这有个查词小程序 ~",
      imageUrl: "/images/english.png",
      path: "/pages/home/home"
    }
  }
})