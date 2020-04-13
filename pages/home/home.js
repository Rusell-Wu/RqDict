// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    everydata:null,
    ttsurl:null,
    imageurl:null
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
    var that=this;
    //设置加载模态框
    wx.showToast({
      title: '首页数据加载中',
      icon:'loading',
      duration:10000
    })
    that.getEveryday(function(d)
    {
      wx.hideToast();
      if (d.statusCode==200){
        that.setData({ 
          everydata: d.data,
          ttsurl: "https://tebiezan.cn/mp3/" + d.data.date.substring(0, 10) + ".mp3",
          imageurl: "https://tebiezan.cn/image/" + d.data.date.substring(0, 10) + ".jpg"
        });
      }else{
        wx.showToast({
          title: ""+d.statusCode,
          icon: 'loading',
          duration: 1000
        })
      }
    })
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
   * 获取每日一句
   */
  getEveryday:function(fn){
    var today = new Date();
    wx.request({
      url: 'https://tebiezan.cn/api/daily/sentence/default',
      success: info => {
        fn(info);
      }
    })
  },
  /**
   * 播放语音
   */
  playtts: function (event)
  {
    var that=this;
    wx.playBackgroundAudio({
      dataUrl: that.data.ttsurl
    })
  }
})