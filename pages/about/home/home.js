// pages/about/home/home.js
const app = getApp()
Page({


  queryMessage() {
    var that = this
    return new Promise(function (resolve, reject) {
      app.request({
        url: app.api.MESSAGE_COUNT,
        toShow: true,
        loading: false
      }).then(res => {
        if(res.data.code == '-2'||res.data.code == '-4'){
          return wx.showModal({
            title: '提示',
            content: res.data.message+'',
            showCancel: false,
            confirmColor: '#0081ff',
            success(res) {
              if (res.confirm) {
                return wx.redirectTo({
                  url: '/pages/login/home'
                })
              }
            }
          })}
        // if(!res.data){
          
          if(res.data.data){
            app.globalData.message = res.data.data.unreadMsgCount
            that.setData({
             messageCount: app.globalData.message
            })
        }else{
          wx.showToast({
            title: "消息获取失败，请检查您的网络",
            icon: 'none',
            duration: 2000
          })
        }
        return resolve(res)
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    greeting:'',
    user_info: null,
    message:app.globalData.message
  },

  handleGreeting: function () {
    var hour = new Date().getHours()
    var greeting = ''

    if (hour < 6) { greeting = '凌晨好！' }
    else if (hour < 9) { greeting = '早上好！' }
    else if (hour < 12) { greeting = '上午好！' }
    else if (hour < 14) { greeting = '中午好！' }
    else if (hour < 17) { greeting = '下午好！' }
    else if (hour < 19) { greeting = '傍晚好！' }
    else if (hour < 22) { greeting = '晚上好！' }
    else { greeting = '晚上好！' }

    this.setData({ greeting })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    app.watch(that.watchBack)
    this.handleGreeting()
    this.setData({user_info:app.globalData.user_info})
  },
  watchBack: function (message){
    this.setData({message:message})
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
    // this.queryMessage()
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