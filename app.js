//app.js
App({
  onLaunch: function () {
    // 读取token
    var token = wx.getStorageSync('token') || null;
    if(token!=null){
      this.globalData.token = token;
      //console.log(token);
    }else{
      this.refreshToken(function(token){});
    }
  },
  globalData: {
    token:null
  },
  refreshToken:function(fn)
  {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              wx.setStorageSync("avatar", res.userInfo.avatarUrl);
              //获取token
              wx.login({
                success: res1 => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res1.code) {
                    //发起网络请求
                    wx.request({
                      url: 'https://tebiezan.cn/api/user/wechat/' + res1.code,
                      method: "GET",
                      success: info => {
                        if (info.statusCode == 200) {
                          this.globalData.token = info.data;//获取token
                          fn(info.data);//刷新后的回调，传回最新的token
                          wx.setStorageSync("token", info.data);//放到本地存储
                          console.log("执行refreshToken完成");
                        } else if (info.statusCode == 404)//未注册
                        {
                          var nickname = res.userInfo.nickName;
                          var sex;
                          switch (res.userInfo.gender) {
                            case 0: sex = "secrecy"; break;
                            case 1: sex = "male"; break;
                            case 2: sex = "female"; break;
                          }
                          wx.login({
                            success: res3 => {
                              if (res3.code) {
                                //console.log(res.code);
                                wx.request({
                                  url: 'https://tebiezan.cn/api/user/wechat/' + res3.code,
                                  method: "POST",
                                  header:{
                                    'content-type': 'application/x-www-form-urlencoded'
                                  },
                                  data:{
                                      nickname:nickname,
                                      sex:sex
                                  },
                                  success: res4 => {
                                    if (res4.statusCode == 200) {
                                      this.globalData.token = res4.data;
                                      fn(res4.data);//刷新后的回调，传回最新的token
                                      wx.setStorageSync("token", res4.data);//放到本地存储
                                    }
                                  }
                                })
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }else{
          fn(null);
          this.globalData.token=null;
          wx.removeStorageSync("token");
        }
      }
    })
  },
  /**
   * 获取token
   */
  getToken:function(){
      return this.globalData.token;
  }
})