// pages/detail/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:null,//当前词的id
      wordinfo:null,//当前词的信息
    hiddenEditModal:true,//是否隐藏编辑对话框
    newInfo:null,  //记录新笔记值
    isEditing:false //编辑时不显示原来的textarea
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id)
    {
      this.setData({
        id: options.id
      });
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
    if(this.data.id!=null)
    {
      var that = this;
      wx.showToast({
        title: '正在获取数据',
        icon: 'loading',
        duration: 100000
      });
      this.getWordInfo(function (r) {
        r.addtime = r.addtime.toString().substring(0, 10);
        that.setData({
          wordinfo: r,
          newInfo:r.remark
        })
      });
      wx.hideToast();
    }
    
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

  onShareAppMessage: function () {
    return {
      title: "嘿，这有个查词小程序 ~",
      imageUrl: "/images/english.png",
      path: "/pages/home/home"
    }
  },


  /**
   * 获取单词信息
   */
  getWordInfo:function(fn){
    var that=this;
    var id=this.data.id;
    wx.request({
      url: 'https://tebiezan.cn/api/user/collection/'+id,
      method:"GET",
      header:{
        token:app.getToken()
      },
      success:res=>{
        if(res.statusCode==200){
          fn(res.data);
        }else{
          wx.showLoading({
            title: '未知错误',
            duration:2000
          })
          wx.navigateBack();
        }
      }
    })
  },

  

  /**
   * 弹出编辑框
   */
  gotoedit:function(){
    this.setData({
      hiddenEditModal:false,
      isEditing:true
    });
  },

  /**
   * 点击弹出框取消按钮
   */
  cancel:function(){
    this.setData({
      hiddenEditModal: true,
      isEditing: false
    });
  },

  /**
   * 点击弹出框保存按钮
   */
  confirm:function(){
    var that=this;
    wx.showLoading({
      title: '正在保存',
      duration: 10000
    });
    wx.request({
      url: 'https://tebiezan.cn/api/user/collection/'+that.data.id,
      method:"PUT",
      data:{
          remark:that.data.newInfo
      },
      header:{
        token:app.getToken(),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:res=>{
        var code = res.statusCode;
        if(code==200){ //保存到服务器成功
          wx.hideLoading();
          that.setData({
            hiddenEditModal: true,
            isEditing: false,
            'wordinfo.remark':that.data.newInfo
          });
          wx.showToast({
            title: '保存成功',
            icon:"success"
          });
        }else if(code==401){
          //token过期
          app.refreshToken(function(token){
            that.confirm();
          });
        }else{
          wx.showLoading({
            title: '未知错误',
            duration:1000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络超时,请稍后再试',
          icon: 'loading',
          duration:2000,
          complete: function () {
            wx.navigateBack({
            });
          }
        })
      }
    })
  },

  /**
   * 记录编辑框内容
   */
  editinput:function(e){
    var newInfo = this.data.newInfo;
    newInfo=e.detail.value;
    this.setData({
      newInfo: newInfo
    })
  }
})