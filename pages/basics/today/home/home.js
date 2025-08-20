const app = getApp()
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
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
      executed: '待发货',
      completed: '已完成'
    },
    statusTypeMap: {
      create: 'primary',
      receive: 'danger',
      producing: 'warning',
      executed: 'primary',
      completed: 'success'
    },
    workOrderList: [],
    loading: false,
    max: 1,
    page: 2,
    size: 5,
    doneList: false,
    show: false,
    processList: [],
    choosedProcess: '',
    verify(action) {
      return new Promise((resolve) => {
        if (action === 'confirm') {
          this.onConfirm(resolve)
        } else {
          resolve(true)
        }
      })
    },
  },

  onSearch(e) {
    this.data.searchValue = e.detail
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
          title: '搜索成功',
          icon: 'none',
          duration: 2000
        })
      })
  },

  stop() {},

  goToDetail (e) {
    wx.navigateTo({
      url: '/pages/basics/today/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

  queryList(page) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.WORK_ORDER_PAGE,
        loading: loading,
        data: {
          pageParam: {
            page,
            size: this.data.size
          },
          queryParam: {
            keyword: this.data.searchValue
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
    this.setData({
      verify: this.data.verify.bind(this)
    })
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

  onCancel() {
    this.setData({
      show: false,
      processList: [],
      choosedProcess: ''
    })
  },

  onConfirm(resolve) {
    if (this.data.choosedProcess) {
      return app.request({
        url: app.api.RECEIVE_PROCESS,
        loading: false,
        data: {
          id: this.data.choosedProcess
        }
      }).then(res => {
        if (res.data.code === '00000') {
          console.log('000', res)
          Toast('认领成功')
          resolve(true)
        } else {
          Toast(res.data.message)
          resolve(false)
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      Toast({
        message: '请选择要认领的工序',
        zIndex: 10000
      })
      resolve(false)
    }
  },

  queryProcess(id) {
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.RECEIVE_PROCEDURE,
        loading: false,
        data: {
          id
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  openDialog(e) {
    this.queryProcess(e.detail.id).then(res => {
      const notArr = res.filter(n => !n.userId)
      this.setData({
        processList: res,
        show: true,
        choosedProcess: notArr[0]?.id || ''
      })
    })
  },

  onChange(event) {
    this.setData({
      choosedProcess: event.detail,
    })
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