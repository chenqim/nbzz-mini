// pages/about/setting/setting.js
const app = getApp()
// var api = require('../../../utils/api')
// var {request} = require('../../../utils/request')
Page({
  logout(){
    return wx.showModal({
      title: '提示',
      content: "是否确认退出登录？",
      confirmColor: '#0081ff',
      success(res) {
        if (res.confirm) {
          app.request({
            url:app.api.LOGOUT
          }).then(res =>{
            // console.log(res)
            // wx.clearStorage()
            app.globalData.user_info = null
            app.globalData.internal = true
            clearInterval(app.globalData.queryMessage)
            wx.reLaunch({
              url: '/pages/login/home',
            })
          }).catch(err =>{
            console.log(err)
          })
        }
      }
    })
    
  },
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

  }
})