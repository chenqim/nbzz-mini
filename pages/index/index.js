const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.request({
      url: app.api.APP_CONFIG,
      toShow: true,
      loading: false
    }).then(resolve => {
      if (resolve.data.code == 1){
        app.globalData.appConfig = resolve.data.data
      }
      app.request({
        url: app.api.CURRENT_USER_INFO,
        toShow: true,
        loading: false
      }).then(res => {
        // console.log(res.data.code)
        if (res.data.code == 1) {
          app.globalData.user_info = res.data.data || null
          return setTimeout(() => {
            wx.switchTab({
              url: '/pages/basics/home/home',
              fail: function (res) {
                console.log(res)
              }
            })
          }, 1000)
        } else {
          return setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/home',
              fail: function (err) {
                console.log(err)
              }
            })
          }, 1000)
        }
      }).catch(err => {
        return wx.reLaunch({
          url: '/pages/login/home',
        })
      })
    }).catch(err => {
      return wx.reLaunch({
        url: '/pages/login/home'
      })
    })
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