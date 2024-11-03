const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeMap: {
      middle: '普通',
      high: '紧急'
    },
    gradeTypeMap: {
      middle: 'success',
      high: 'danger'
    },
    typeMap: {
      produce: '制造',
      maintenance: '维修'
    },
    statusMap: {
      create: '已创建',
      receive: '已认领',
      producing: '生产中',
      completed: '已完成'
    },
    statusTypeMap: {
      create: 'primary',
      receive: 'danger',
      producing: 'warning',
      completed: 'success'
    },
    workOrderList: [],
    loading: false,
    max: 1,
    page: 2,
    size: 5,
    doneList: false
  },

  goToDetail (e) {
    wx.navigateTo({
      url: '/pages/basics/work/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

  queryList(page) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.MY_WORK_ORDER_PAGE,
        loading: loading,
        data: {
          pageParam: {
            page,
            size: this.data.size
          }
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryList(1)
      .then(res => {
        this.setData({
          workOrderList: res.records,
          max: res.pages
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
      })
      .then(() => {
        this.data.loading = false
      })
      .catch(err => {})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.setData({
          workOrderList: res.records,
          max: res.pages
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
  },

   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          this.setData({
            workOrderList: this.data.workOrderList.concat(res.records)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})