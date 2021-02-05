const app = getApp()
Page({

  onPageScroll: function (e) {
    //     console.log(e)
    if (e.scrollTop > 200) {
      this.setData({
        modalName: null
      });
      // this.onLoad()
    }
  },

  queryList(page) {
    let loading = this.data.loading
    return new Promise(function (resolve, reject) {
      const that = this
      app.request({
        url: app.api.MESSAGE_PAGE,
        loading: loading,
        data: {
          limit: 15,
          page: page,
          param: {}
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  toPage(e) {
    // console.log(e)
    let path = '';
    switch (e.target.dataset['type']) {
      case 'alert':
        //报警消息
        path = '/pages/basics/police/home/home';
        break;
      case 'drugs_app':
        //药剂审批消息
        path = '/pages/basics/medicine/home/home';
        break;
      case 'accessory_app':
        //配件审批消息
        path = '/pages/basics/kits/home/home';
        break;
      case 'site_maintain_app':
        //站点运维审批消息
        path = '/pages/basics/site/operation/operation';
        break;
    }
    // console.log(path)
    if (path != '') {
      wx.navigateTo({
        url: path,
      })
    }
  },

  showModal(e) {
    // console.log(e.currentTarget.dataset)
    let idx = e.currentTarget.dataset.idx
    let index = e.currentTarget.dataset.index
    this.setData({
      modalName: 'show',
      message: this.data.messageList[`${idx}`][`${index}`]
    })
    let context = this.data.messageList[`${idx}`][`${index}`].context
    // console.log(res.data.data.context)
    let left = context.indexOf("<");
    let right = context.indexOf(">");
    if (left >= 0 && right >= 0) {
      let arr = context.split("<");
      let arr1 = arr[1].split(">");
      this.setData({
        contextOne: arr[0],
        contextTwo: '<' + arr1[0] + '>',
        contextThree: arr1[1],
        left: left,
        right: right,
        type: this.data.messageList[`${idx}`][`${index}`].type
      })
    } else {
      this.setData({
        contextOne: '',
        contextTwo: '',
        contextThree: '',
        left: -1,
        right: -1,
        type: ''
      })
    }
    setTimeout(() => {
      this.setData({
        //避免列表重复渲染，仅重渲染当前点击项
        [`messageList[${idx}][${index}].readStatus`]:'1',
        // messageList: this.data.messageList,
      })
    }, 500)
    app.request({
      url: app.api.MESSAGE_ID + e.currentTarget.dataset.item,
      loading: false
    }).then(res => {
      // this.data.messageList[e.currentTarget.dataset.idx][e.currentTarget.dataset.index].readStatus = 1
    })
    
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  readall() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '将所有的消息全部标记为已读？',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          app.request({
              url: app.api.MESSAGE_READ
            })
            .then(res => {
              that.onLoad()
            })
        }
      }
    })
  },
  cleanall() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '将所有的消息全部清空？',
      confirmColor: '#e54d42',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          app.request({
              url: app.api.MESSAGE_CLEAN
            })
            .then(res => {
              that.onLoad()
            })
        }
      }
    })
  },


  /**
   * 页面的初始数据
   */
  data: {
    messageList: null,
    page: 2,
    max: 1,
    doneList: false,
    modalName: null,
    message: {},
    active: 0,
    custom: app.globalData.CustomBar,
    contextOne: '',
    contextTwo: '',
    contextThree: '',
    loading: true,
    left: -1,
    right: -1,
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryList(1)
      .then(res => {
        this.setData({
          ['messageList[0]']: res.data.data,
          max: Math.ceil(res.data.count / 15)
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
  onPullDownRefresh: function () {
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.setData({
          ['messageList[0]']: res.data.data,
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
            // messageList: this.data.messageList.concat(res.data.data)
            ["messageList[" + (this.data.page-1) + "]"]:res.data.data,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})