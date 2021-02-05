const app = getApp()
Page({
  //防止页面点击穿透
  filterViewMove() {
    return true
  },

  /**
   * 节流,减少滚动监听次数，默认似乎为10ms
   */
  onPageScroll: app.throttle(function (e) {
    if (e.scrollTop > 500) {
      this.setData({
        floorstatus: true,
        modalName: null
      });
    } else {
      this.setData({
        floorstatus: false
      })
    }
  }, 70),

  gotop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 800
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级到最新微信版本后重试。'
      })
    }
  },

  //切换因子
  factor(e) {
    this.setData({
      factorData: e.currentTarget.dataset.key,
      name: e.currentTarget.dataset.name,
      unit: e.currentTarget.dataset.unit,
      // maxProgress: e.currentTarget.dataset.max,
      // minProgress: e.currentTarget.dataset.min,
    })
  },
  //显示侧边栏
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  //隐藏侧边栏
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //列表数据封装
  queryList(page) {
    let loading = this.data.loading
    let data = this.data.data
    let limit = this.data.limit
    return new Promise(function (resolve, reject) {
      app.request({
        url: app.api.HISTORY_LIST,
        loading: loading,
        data: {
          limit: limit,
          page: page,
          param: data
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


  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    factorData: 0,
    menu: [],
    list: [],
    page: 2,
    max: 1,
    doneList: false,
    loading: true,
    progress: '40%',
    limit: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      custombar: app.globalData.CustomBar
    })
    this.data.data = {
      dataType: options.type,
      monitorTimeRange: options.time,
      siteId: options.id,
      count: null
    }
    /**
     * 首次加载时发起请求
     */
    const data = this.data.data
    app.request({
        url: app.api.HISTORY_TOTAL,
        data
      })
      .then(result => {
        this.data.data.count = result.data.data && result.data.data.count
        if (this.data.data.count) {
          app.request({
              url: app.api.HISTORY_FACTOR,
              data
            })
            .then(res => {
              this.setData({
                menu: res.data.data
              })
            })
            .then(() => {
              if (this.data.menu.length > 0) {
                this.setData({
                  factorData: this.data.menu[0].fieldKey,
                  name: this.data.menu[0].fieldName,
                  unit: this.data.menu[0].fieldUnit,
                  // maxProgress: this.data.menu[0].max,
                  // minProgress: this.data.menu[0].min,
                })
              }
            })
            .then(() => {
              this.queryList(1)
                .then(res => {
                  this.setData({
                    ['list[0]']: res.data.data,
                    max: Math.ceil(res.data.count / this.data.limit)
                  })
                })
                .then(() => {
                  this.setData({
                    doneList: this.data.max >= this.data.page
                  })
                })
                .then(res => {
                  this.data.loading = false
                })
                .catch(err => {})
            })
        }
      })

  },

  /**
   * 触底加载下一页
   */
  onReachBottom: function () {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          this.setData({
            // list: this.data.list.concat(res.data.data)
            ["list[" + (this.data.page - 1) + "]"]: res.data.data,
          })
          this.data.page++
          this.setData({
            doneList: this.data.max >= this.data.page
          })
        })
        .catch(err => {})
    }
  },
  /**
   * 下拉刷新，仅加载第一页
   */
  onPullDownRefresh: function () {
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.setData({
          // list: res.data.data,
          ['list[0]']: res.data.data,
          max: Math.ceil(res.data.count / 30)
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
        wx.showToast({
          title: '刷新成功',
          icon: 'none',
          duration: 2000
        })
      })
      .then(() => {
        wx.stopPullDownRefresh({})
      })
  }
})