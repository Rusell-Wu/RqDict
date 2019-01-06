// pages/translate/translate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcContent:null, //源
    result:null       //对应的翻译结果
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
   * 保存用户输入
   */
  /*bindTextAreaBlur:function(e)
  {
      this.setData({
        srcContent: e.detail.value
      })
  },*/

  /**
   * 处理用户点击翻译
   */
  formSubmit:function(e)
  {
      var that=this;
      var src = e.detail.value.src;
      this.setData({
        srcContent: src
      });
      wx.showToast({
        title: '正在翻译',
        icon: 'loading',
        duration:10000
      });
      this.getResult(function(r){
          that.setData({
            result:r.dst
          });
      });
      wx.hideToast();
  },

  /**
   * 判断翻译语种,例源语种为英文则返回值为中文
   */
  checktoENorCN:function(str)
  {
      if(/[\u3220-\uFA29]+/.test(str))
      {
        return "en";
      }else
      {
        return "zh";
      }
  },

  /**
   * 获取翻译结果
   */
  getResult:function(fn){
    var that=this;
    var src = this.data.srcContent;
    var to = this.checktoENorCN(src);
    if(src==null||src.trim().length==0)
    {
      fn({dst:""});
      return;
    }
    wx.request({
      url: 'https://rqdict.top/api/trans/'+src,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        to:to
      },
      success:r=>{
        if(r.statusCode==200){
          fn(r.data);
        }else{
          that.setData({
            result:null
          });
        }
      }
    })
  },
/**
 * 复制译文
 */
  copyResult:function()
  {
    var that=this;
    wx.setClipboardData({
      data: that.data.result,
      success:function()
      {
        wx.showToast({
          title: '复制成功',
          duration:1000
        });
        /*wx.getClipboardData({
          success:res=>
          {
            console.log(res.data);
          }
        })*/
      }
    })
  }

})