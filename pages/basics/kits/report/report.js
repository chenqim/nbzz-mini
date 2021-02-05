// pages/basics/site/report/report.js
const app = getApp()
Page({

  querysitelist() {
    return new Promise(function (resolve, reject) {
      app.request({
        url: app.api.SITE_LIST,
      }).then(res => {
        resolve(res)
      })
    })
  },


  description(event) {
    this.setData({
      message: event.detail
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  deldrug(e) {
    //console.log(this.data.medicineList.splice(e.currentTarget.dataset.index,1)) //二选一注释
    let arr = this.data.medicineList.splice(e.currentTarget.dataset.index, 1) //二选一注释
    this.setData({
      medicineList: this.data.medicineList,
      editStatus: this.data.medicineList.length != 0
    })
    // console.log(this.data.medicineList)
  },
  sitePickerChange(e) {
    // console.log(e);
    this.setData({
      sitepickindex: parseInt(e.detail.value)
    })
  },
  PickerChange(e) {
    // console.log(e.detail.value);
    this.setData({
      pickindex: e.detail.value,
      showindex: 1,
      pickidx: ''
    })
    // console.log(this.data.drugList[this.data.pickindex])
    if (this.data.drugList[this.data.pickindex].list[0].id == 'other-accessory') {
      this.setData({
        other: true
      })
    } else {
      this.setData({
        other: false
      })
    }
    this.data.tempmedicineList.accessoryGroupName = this.data.drugList[this.data.pickindex].name
    // console.log(this.data.tempmedicineList)
    this.setData({
      type: this.data.drugList[this.data.pickindex].list.map(({
        name
      }) => name)
    })
  },
  otherName(e) {
    // console.log(e.detail.value)
    this.data.tempmedicineList.accessoryName = e.detail.value
    this.setData({
      otherName: e.detail.value
    })
  },
  otherAC() {
    this.setData({
      showindex: 2,
    })
    this.data.tempmedicineList.accessoryId = this.data.drugList[this.data.pickindex].list[0].id
  },


  childPickerChange(e) {
    // console.log(e.detail.value);
    this.setData({
      pickidx: e.detail.value,
      showindex: 2
    })
    // console.log(this.data.drugList[this.data.pickindex].list[this.data.pickidx])
    // console.log(this.data.drugList[this.data.pickindex].list[this.data.pickidx].spec)
    this.data.tempmedicineList.accessoryName = this.data.drugList[this.data.pickindex].list[this.data.pickidx].name
    this.data.tempmedicineList.accessoryId = this.data.drugList[this.data.pickindex].list[this.data.pickidx].id
    // console.log(this.data.tempmedicineList)
  },
  showEdit() {
    this.setData({
      editStatus: !this.data.editStatus
    })
  },
  onChange(event) {
    // console.log(event.detail);
    this.data.tempmedicineList.amount = event.detail
    this.setData({
      tempmedicineList: this.data.tempmedicineList
    })
    // console.log(this.data.tempmedicineList)
  },
  additem() {
    const that = this
    // console.log(this.data.medicineList.push(this.data.tempmedicineList)) //注释这行需要解除注释下一行
    this.data.medicineList.push(this.data.tempmedicineList); //注释这行需要解除注释上一行
    this.setData({
      medicineList: this.data.medicineList,
      pickindex: null,
      otherName: null,
      tempmedicineList: {
        amount: 1,
        isDelete: 0,
        editStatus: false,
      },
      drugtype: ''
    })
    setTimeout(() => {
      that.setData({
        showindex: 0
      })
    }, 600)
    console.log(this.data.medicineList)
    this.hideModal()
  },
  submit() {
    const that = this
    if (typeof this.data.sitepickindex == 'number') {
      var siteId = this.data.site[this.data.sitepickindex].id || ''
    }
    // console.log(siteId, this.data.medicineList)
    if (!siteId || this.data.medicineList.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整',
        showCancel: false,
        success(res) {}
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确定提交',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            app.request({
              url: app.api.K_SUBMIT,
              data: {
                appAccessoryRecordItems: that.data.medicineList,
                siteId: siteId,
                description: that.data.description,
                id: that.data.optionsId
              }
            }).then(res => {
              wx.showModal({
                title: '提示',
                content: '提交成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    let pages = getCurrentPages(); // 当前页的数据，
                    let prevPage = pages[pages.length - 2]; // 上一页的数据
                    prevPage.setData({
                      isadditem: true, // 修改上一页的属性值；
                    })
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                }
              })
            })
          }
        }
      })
    }
  },
  resubmit() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '需重新编辑本页数据',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.setData({
            detail: false
          })
          that.querysitelist().then(res => {
            var index = res.data.data.findIndex((item, index) => {
              return that.data.siteId == item.id;
            })
            that.setData({
              site: res.data.data,
              sitepickindex: index,
              siteList: res.data.data.map(({
                name
              }) => name)
            })
          })
        }
      }
    })
  },

  data: {
    drug: [],
    pickidx: '',
    type: [],
    otherName: null,
    drugtype: '',
    optionsId: '',
    tempmedicineList: {
      amount: 1,
      isDelete: 0
    },
    siteId: '',
    sitepickindex: null,
    editStatus: false,
    medicineList: [],
    detail: true,
    site_details: [],
    userInfo: null,
    showindex: 0,
    message: '',
    pickindex: '',
    site: null,
    siteList: []
  },
  onLoad: function (options) {

    this.setData({
      optionsId: options.id || null,
      userInfo: app.globalData.user_info || null
    })
    app.request({
      url: app.api.K_SEARCH,
    }).then(res => {
      this.setData({
        drugList: res.data.data,
        pickindex: '',
        pickidx: '',
        drug: res.data.data.map(({
          name
        }) => name)
      })
    })

    if (this.data.optionsId) {
      this.setData({
        detail: true
      })
      app.request({
        url: app.api.K_DETAIL + this.data.optionsId
      }).then(res => {
        this.setData({
          site_details: res.data.data,
          medicineList: res.data.data.appAccessoryRecordItems,
          message: res.data.data.description,
          siteId: res.data.data.siteId
        })
      })
    } else {
      this.setData({
        detail: false
      })
      app.request({
        url: app.api.SITE_LIST,
      }).then(res => {
        this.setData({
          site: res.data.data,
          siteList: res.data.data.map(({
            name
          }) => name)
        })
      })
    }
  }
})