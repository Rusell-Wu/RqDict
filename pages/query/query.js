// pages/query/query.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word:null,//当前所查询的词
    result:null,//查词结果
    iscollected:false//是否已经收藏
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

  setQueryWord:function(e)
  {
    this.setData({
      word:e.detail.value
    })
  },

/**
 * 用户点击查词
 */
  queryBtntap:function(e)
  {
    var that=this;
      wx.showToast({
        title: '正在请求查询',
        icon: 'loading',
        duration: 10000
      })
      this.getResult(function (result) {
          wx.hideToast();
          that.setData({ result: result });
        });
  },

  //获取单词释义
  getResult:function(fn){
    var that=this;
    wx.request({
      url: 'https://tebiezan.cn/api/vocabulary/' + that.data.word,
      header:{
        token:app.getToken()
        },
      success:r=>{
        if(r.statusCode==200){
          fn(r.data.word);
          that.setData({
            iscollected: r.data.iscollected
          });
        }else if(r.statusCode==404){
          fn({id:0});
        }else{
          wx.showToast({
            title: '未知错误！',
            duration:2000
          })
        }
      }
    })
  },

  //登录情况下更新生词本
  collect:function(){
    var that=this;
    if(!this.data.iscollected)
    {
      wx.showLoading({
        title: '稍等',
        duration:10000
      });
      this.requestAdd(function(status){
        wx.hideLoading();
        if(status==1){
          that.setData({
            iscollected: true,
            'result.favnum': that.data.result.favnum+1
          });
          wx.showToast({
            title: '收藏成功',
            icon: "success"
          })
        }else if(status==0){
          wx.showLoading({
            title: '未登录！',
            duration: 1000
          })
        }else if(status==2){
          wx.showLoading({
            title: '重复收藏！',
            duration: 1000
          });
          that.setData({
            iscollected: true
          });
        }else{
          wx.showLoading({
            title: '未知错误',
            duration: 2000
          })
        }
        
      });
    }
  },

  //请求添加生词
  requestAdd:function(fn){
    var that = this;
    var wordid = this.data.result.id;
    wx.request({
      url: 'https://tebiezan.cn/api/user/collection/' + wordid,
      method:"POST",
      header:{
        token:app.getToken(),
        "content-type": 'application/x-www-form-urlencoded'
      },
      success:r=>{
        if(r.statusCode==200){
          fn(1);
        }else if(r.statusCode==401){
          //未登录或者token过期
          app.refreshToken(function(token){
            if(!token) fn(0);//用户未授权的时候登录不成功
            else that.requestAdd(fn);//登录成功后重新执行本次请求
          });
        }else if(r.statusCode==409){
          fn(2);
        }else{
          fn(-1);
        }
      }
    })
  }
})