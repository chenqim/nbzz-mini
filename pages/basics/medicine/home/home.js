// pages/basics/site/operation/operation.js
const app = getApp()
Page({

  toDetails(e) {
    // console.log(e.currentTarget.dataset['item'].id)
    wx.navigateTo({
      url: '/pages/basics/medicine/report/report?id=' + e.currentTarget.dataset['item'].id,
    })
  },
  toReport() {
    wx.navigateTo({
      url: '/pages/basics/medicine/report/report',
    })
  },

  queryList(page) {
    return new Promise(function (resolve, reject) {
      const that = this
      app.request({
        url: app.api.M_PAGE,
        loading:false,
        data: {
          limit: 15,
          page: page
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    page: 2,
    max: 1,
    doneList: false,
    isadditem: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.request({
      url: app.api.M_PAGE,
      data: {
        limit: 15,
        page: 1
      }
    }).then(res => {
      this.setData({
        // list: res.data.data,
        ['list[0]']: res.data.data,
        max: Math.ceil(res.data.count / 15)
      })
      this.setData({
        doneList: this.data.max >= this.data.page
      })
    }).catch(err => {})
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
    if (this.data.isadditem) {
      // this.data.list.splice(1,this.data.list.length-1)
      this.setData({
        page:2,
        max:1,
        doneList: false,
        list:[],
        isadditem: false
      })
      this.onLoad()
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
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.data.list.splice(1,this.data.list.length-1)
        this.setData({
          list:this.data.list
        })
        this.setData({
          // list: res.data.data,
          ['list[0]']: res.data.data,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
        wx.showToast({
          title: '刷新成功',
          icon:'none',
          duration:2000
        })
        wx.stopPullDownRefresh({})
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          // console.log(this.data.siteList.concat(res.data.data))
          this.setData({
            // list: this.data.list.concat(res.data.data)
            ["list[" + (this.data.page-1) + "]"]:res.data.data,
          })
          this.setData({
            page: this.data.page + 1
          })
          this.setData({
            doneList: this.data.max >= this.data.page
          })
          // console.info(this.data.doneList)
        })
        .catch(err => {})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})