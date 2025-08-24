// pages/basics/dispatch/home/home.js
const app = getApp()
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
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
    user_info: null,
    resetWorkOrderId: '',
    toDetailId: ''
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
    this.setData({
      toDetailId: e.detail.id
    })
    wx.navigateTo({
      url: '/pages/basics/dispatch/detail/detail?id=' + e.detail.id
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
            keyword: this.data.searchValue,
            type: 'maintenance'
          }
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
  },
  queryDetail(id) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.WORK_ORDER_PAGE,
        loading: loading,
        data: {
          pageParam: {
            page: 1,
            size: 10
          },
          queryParam: {
            id
          }
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
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
        url: app.api.CANCEL_ALLOCATE_WORK_ORDER,
        loading: false,
        data: {
          id: this.data.choosedProcess
        }
      }).then(res => {
        if (res.data.code === '00000') {
          resolve(true)
          Toast({
            message: '撤销派单成功',
            zIndex: 99999,
          })
        } else {
          resolve(false)
          Toast({
            message: res.data.message,
            zIndex: 9999,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      Toast({
        message: '请选择要撤销派单的工序',
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
    console.log('user', app.globalData.user_info)
    this.queryProcess(e.detail.id).then(res => {
      const canArr = res.filter(n => n.userId)
      this.setData({
        processList: res,
        show: true,
        choosedProcess: canArr?.[0]?.id || ''
      })
    })
  },

  onChange(event) {
    this.setData({
      choosedProcess: event.detail,
    })
  },

  // 重置派单
  beforeClose(action) {
    return new Promise((resolve) => {
      if (action === 'confirm') {
        this.onResetConfirm(resolve)
      } else {
        resolve(true)
      }
    })
  },
  openResetDialog(e) {
    this.setData({
      resetWorkOrderId: e.detail.id
    })
    Dialog.confirm({
      title: '重置派单',
      message: '该操作会清空所有派单人员和数量，请谨慎操作！',
      beforeClose: this.beforeClose,
    }).then((res) => {
      console.log('then', res)
    }).catch((err) => {
      console.log('catch', err)
    })
  },
  onResetConfirm(resolve) {
    return app.request({
      url: app.api.RESET_ALLOCATE_WORK_ORDER,
      loading: false,
      data: {
        id: this.data.resetWorkOrderId
      }
    }).then(res => {
      if (res.data.code === '00000') {
        Toast({
          message: '重置派单成功',
          zIndex: 9999,
        })
        resolve(true)
        // 单独刷新当前这条工单（状态会有变更，有些操作按钮会显示或者隐藏）
        this.queryDetail(this.data.resetWorkOrderId).then(res => {
          const wo = res?.records?.[0]
          if (wo) {
            const index = this.data.workOrderList.findIndex(n => n.id === this.data.resetWorkOrderId)
            this.data.workOrderList[index] = wo
            this.setData({
              workOrderList: this.data.workOrderList,
              resetWorkOrderId: ''
            })
          }
        })
        .then(() => {
          this.data.loading = false
        })
        .catch(err => {})
      } else {
        Toast({
          message: res.data.message,
          zIndex: 9999,
        })
        resolve(false)
      }
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      verify: this.data.verify.bind(this),
      user_info: app.globalData.user_info
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.data.toDetailId) {
      // 单独刷新当前这条工单（状态会有变更，有些操作按钮会显示或者隐藏）
      this.queryDetail(this.data.toDetailId).then(res => {
        const wo = res?.records?.[0]
        if (wo) {
          const index = this.data.workOrderList.findIndex(n => n.id === this.data.toDetailId)
          this.data.workOrderList[index] = wo
          this.setData({
            workOrderList: this.data.workOrderList,
            toDetailId: ''
          })
        }
      })
      .then(() => {
        this.data.loading = false
      })
      .catch(err => {})
    }
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