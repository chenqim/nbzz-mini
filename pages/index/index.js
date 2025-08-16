const app = getApp();
var config = require('../../utils/config')
import Toast from '@vant/weapp/toast/toast'

Page({
  data: {
    CustomBar: app.globalData.CustomBar
  },

  switchToIndex () {
    wx.switchTab({
      url: '/pages/basics/home/home',
      fail: function (res) {
        console.log(res)
      }
    })
  },

  switchToLogin () {
    wx.reLaunch({
      url: '/pages/login/home',
      fail: function (err) {
        console.log(err)
      }
    })
  },

  auoLogin (code) {
    const that = this
    const token = wx.getStorageSync('token')
    console.log('tkkk', token)
    wx.request({
      method: "POST",
      header:{
        "Auth-Token":token
      },
      url: config.apiPrefix + app.api.AUTO_LOGIN,
      data: {
        code
      },
      success(res) {
        if (res.statusCode === 200) {
          // 自动登录成功直接存token，获取用户信息，跳转到首页
          Toast('自动登录成功')
          console.log('自动登录成功', res)
          if (res.header["Auth-Token"]) {
            wx.setStorageSync('token', res.header["Auth-Token"])
          }
          app.request({
            url: app.api.CURRENT_USER_INFO,
            toShow: true,
            loading: false
          }).then(res => {
            console.log('user res >>>', res)
            if (res.data.code == '00000') {
              app.globalData.user_info = res.data.data || null
              return setTimeout(() => {
                that.switchToIndex()
              }, 1000)
            } else {
              return setTimeout(() => {
                that.switchToLogin()
              }, 1000)
            }
          })
        } else {
          // 自动登录失败去账号密码登录页面登录
          if (res.data.code === 'A0200') {
            console.log('自动登录失败', res)
            return setTimeout(() => {
              that.switchToLogin()
            }, 1000)
          }
        }
      },
      fail(err){
        wx.showToast({
          title: '网络开小差了，请稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('===== 首屏 ===== ')
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          that.auoLogin(res.code)
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    // app.request({
    //   url: app.api.APP_CONFIG,
    //   toShow: true,
    //   loading: false
    // }).then(resolve => {
    //   if (resolve.data.code == 1){
    //     app.globalData.appConfig = resolve.data.data
    //   }
    //   app.request({
    //     url: app.api.CURRENT_USER_INFO,
    //     toShow: true,
    //     loading: false
    //   }).then(res => {
    //     if (res.data.code == '00000') {
    //       app.globalData.user_info = res.data.data || null
    //       return setTimeout(() => {
    //         wx.switchTab({
    //           url: '/pages/basics/home/home',
    //           fail: function (res) {
    //             console.log(res)
    //           }
    //         })
    //       }, 1000)
    //     } else {
    //       return setTimeout(() => {
    //         wx.reLaunch({
    //           url: '/pages/login/home',
    //           fail: function (err) {
    //             console.log(err)
    //           }
    //         })
    //       }, 1000)
    //     }
    //   }).catch(err => {
    //     return wx.reLaunch({
    //       url: '/pages/login/home',
    //     })
    //   })
    // }).catch(err => {
    //   return wx.reLaunch({
    //     url: '/pages/login/home'
    //   })
    // })
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