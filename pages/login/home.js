var config = require('../../utils/config')
const app = getApp()


Page({

  getToken() {
    console.log('getttt')
    const that = this
    const token = wx.getStorageSync('token') || ''
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            method: "POST",
            header: {
              "Auth-Token": token
            },
            url: app.baseurl+app.api.SEND_CODE,
            data: {
              code: res.code
            },
            success(res) {
              if (res.header["Auth-Token"]) {
                wx.setStorageSync('token', res.header["Auth-Token"])
              }
              
            },
            fail(err) {
              wx.showToast({
                title: '网络开小差了，请稍后再试',
                icon: 'none',
                duration: 2000
              })
            }
          })
          // console.log(res.code)
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 手机号一键登录
  getPhoneNumber(e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    if (e.detail.iv !== undefined) {
      app.request({
        url: app.api.GET_TOKEN,
        toShow: true,
        data: {
          phoneInfo: {
            ivStr: e.detail.iv,
            encryptedData: e.detail.encryptedData
          },
          loginType: 'phone'
        }
      }).then(res => {
        if (res.data.code == '1') {
          wx.switchTab({
            url: '../basics/home/home',
            fail: function (res) {
              console.log(res)
            }
          })
        } else if (res.data.code == '0') {
          wx.showToast({
            title: res.data.msg + '',
            icon: 'none',
            duration: 2500
          })
        } else {
          wx.showToast({
            title: "登录失败，请重试",
            icon: 'none',
            duration: 2500
          })
          this.getToken()
        }
      }).catch((e) => {})

    }
  },
  //账号密码登录
  accountLogin() {
    if (!this.data.account || !this.data.password) {
      return wx.showToast({
        title: '请输入账号和密码~',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.password.length >= 20 || this.data.password.length < 2) {
      return wx.showToast({
        title: '密码长度不对哦~',
        icon: 'none',
        duration: 2000
      })
    }

    let data = {
      loginInfo: {
        account: this.data.account,
        password: this.data.password
      },
      loginType: 'account'
    }
    app.request({
      url: app.api.GET_TOKEN,
      toShow: true,
      data
    }).then(res => {
      if (res.data.code == '00000') {
        wx.switchTab({
          url: '../basics/home/home',
          fail: function (res) {
            console.log(res)
          }
        })
      } else {
        wx.showToast({
          title: res.data.message + '',
          icon: 'none',
          duration: 2500
        })
        this.getToken()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  account(e) {
    this.setData({
      account: e.detail.value
    })
  },
  password(e) {
    this.setData({
      password: e.detail.value
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: '',
    verification: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('===== 登录页 ===== ')
    const that = this
    const token = wx.getStorageSync('token') || ''
    app.globalData.internal = true
    clearInterval(app.globalData.queryMessage)
    //获取token信息
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            method: "POST",
            header:{
              "Auth-Token":token
            },
            url: config.apiPrefix + app.api.SEND_CODE,
            data: {
              code: res.code
            },
            success(res) {
              // wx.setStorageSync('token', res.header["Auth-Token"])
              if (res.header["Auth-Token"]) {
                wx.setStorageSync('token', res.header["Auth-Token"])
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
          // console.log(res.code)
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

    // setTimeout(()=>{
    //   this.getToken()
    // },300000)

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
    // this.setData({
    //   verification : new Date().valueOf() + Math.random().toString(36).substr(2)
    // })
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