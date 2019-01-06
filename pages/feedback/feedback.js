// pages/feedback/feedback.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    return {
      title: "嘿，这有个查词小程序 ~",
      imageUrl: "/images/english.png",
      path: "/pages/home/home"
    }
  },

  /**
   * 提交
   */
  formSubmit:function(e){
    var that=this;
    var token=app.getToken();
    var title=e.detail.value.title;
    var content=e.detail.value.content;
    if(title==""||content==""){
      wx.showModal({
        title: '格式错误',
        content: '标题和内容都不能为空哦！',
        showCancel:false,
        confirmText:'好的'
      });
    }else{
      wx.showToast({
        title: '正在提交',
        icon:'loading',
        duration:10000
      });
      wx.request({
        url: 'https://rqdict.top/api/feedback/wechat',
        method:"POST",
        header:{
          token: app.getToken(),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          title:title,
          content:content
        },
        success:res=>{
          if (res.statusCode ==200)
          {
            wx.hideToast();
            wx.showModal({
              title: '提交成功',
              content: '反馈成功，感谢您的支持！',
              showCancel:false,
              success:function(e){
                if(e.confirm)
                {
                  wx.navigateBack({
                  });
                }
              }
            });
            
          } else if (res.statusCode ==429){
            wx.hideToast();
            wx.showModal({
              title: '操作太频繁',
              content: '刚刚才反馈过，休息会吧！',
              showCancel:false
            });
          } else if (res.statusCode==401){
            //token过期
            app.refreshToken(function(token){
              that.formSubmit(e);
            });
          }else{
            wx.showModal({
              title: '未知错误',
              content: '好像出错了呀，待会儿再来试试吧！',
              showCancel: false,
              success: function (e) {
                if (e.confirm) {
                  wx.navigateBack({
                  });
                }
              }
            });
          }
        }
      })
    }
  }
})