// pages/basics/site/details/details.js
const app = getApp()
Page({
  goSite(){
    wx.openLocation({
      latitude: Number(this.data.details.positionLat),
      longitude: Number(this.data.details.positionLng),
      scale: 18,
      name: this.data.details.name,
      address:this.data.details.address
    })
  },
  goPhone(e){
    if (this.data.details.biEnterpriseInfo.mobile){
      wx.makePhoneCall({
        phoneNumber: this.data.details.biEnterpriseInfo.mobile
      });  
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    siteId:'',
    details:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      siteId: options.id
    })
    app.request({
      url:app.api.SITE_DETAILS+this.data.siteId
    }).then(res=>{
      this.setData({
        details:res.data.data
      })
    }).catch(err=>{})
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

  }
})