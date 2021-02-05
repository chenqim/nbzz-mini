// pages/basics/site/home/home.js
const app = getApp()
Page({

  gotop: function (e) { // 一键回到顶部
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300,
        })
  },

  toDetails(e) {
    // console.log(e.currentTarget.dataset['item'])
    wx.navigateTo({
      url: '/pages/basics/site/details/details?id=' + e.currentTarget.dataset['item'],
    })
  },

  clear() {
    this.gotop()
    this.setData({
      name: ''
    })
    this.queryList(1)
      .then(res => {
        this.setData({
          // siteList: {...this.data.siteList,...res.data.data}
          siteList: res.data.data,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
        // console.log(this.data.doneList)
        // console.log(this.data.max)
      })
      .then(() => {
        this.data.loading = false
      })
      .catch(err => {})
  },

  queryList(page) {
    let loading = this.data.loading
    let name = this.data.name
    // console.log(this.data.name)
    return new Promise(function (resolve, reject) {
      const that = this
      app.request({
        url: app.api.SITE_PAGE,
        loading: loading,
        data: {
          limit: 15,
          page: page,
          param: {
            name: name
          }
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        wx.showToast({
          title: "列表获取失败",
          icon: 'none',
          duration: 2000
        })
        return reject(err)
      })
    })
  },
  name(event) {
    // console.log(event.detail.value)
    this.setData({
      name: event.detail.value
    })
  },
  search() {
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.gotop()
        this.setData({
          siteList: res.data.data,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
      })
  },

  data: {
    siteList: null,
    page: 2,
    loading: true,
    name: '',
    custom: app.globalData.CustomBar,
    max: 1,
    doneList: false,
    topStatus: false,
  },

  onLoad: function (options) {
    this.queryList(1)
      .then(res => {
        this.setData({
          // siteList: {...this.data.siteList,...res.data.data}
          siteList: res.data.data,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
        // console.log(this.data.doneList)
        // console.log(this.data.max)
      })
      .then(() => {
        this.data.loading = false
      })
      .catch(err => {})
  },


  onReachBottom: function () {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          // console.log(this.data.siteList.concat(res.data.data))
          this.setData({
            siteList: this.data.siteList.concat(res.data.data)
          })
          this.data.page++
          this.setData({
            doneList: this.data.max >= this.data.page
          })
          // console.info(this.data.doneList)
        })
        .catch(err => {})
    }
  },

  onPullDownRefresh: function () {
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.setData({
          siteList: res.data.data,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
        wx.showToast({
          title: '刷新成功',
          icon: 'none',
          duration: 2000
        })
        wx.stopPullDownRefresh({})
      })
  }
})