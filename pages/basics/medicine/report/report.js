// pages/basics/site/report/report.js
const app = getApp()
Page({

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
  PickerChange(e) {
    // console.log(e.detail.value);
    this.setData({
      pickindex: e.detail.value,
      showindex: 2,
      pickidx: ''
    })
    if (this.data.drugList[this.data.pickindex].list[0].id == 'other-standard' || this.data.drugList[this.data.pickindex].list[0].id == 'other-reagent') {
      this.setData({
        other: true
      })
    } else {
      this.setData({
        other: false
      })
    }
    // console.log(this.data.drugList[this.data.pickindex].name)
    this.data.tempmedicineList.drugsName = this.data.drugList[this.data.pickindex].name
    // console.log(this.data.tempmedicineList)
    this.setData({
      type: this.data.drugList[this.data.pickindex].list.map(({
        spec
      }) => spec)
    })
  },
  otherName(e) {
    // console.log(e.detail.value)
    this.data.tempmedicineList.drugsName = e.detail.value
    this.setData({
      otherName: e.detail.value
    })
  },
  otherNameAC() {
    this.setData({
      showindex: 3,
    })
    this.data.tempmedicineList.drugsId = this.data.drugList[this.data.pickindex].list[0].id
  },
  otherSpec(e) {
    // console.log(e.detail.value)
    this.data.tempmedicineList.spec = e.detail.value
    this.setData({
      otherSpec: e.detail.value
    })
  },
  otherSpecAC() {
    this.setData({
      showindex: 4,
    })
  },


  childPickerChange(e) {
    this.setData({
      pickidx: e.detail.value,
      showindex: 4
    })
    this.data.tempmedicineList.spec = this.data.drugList[this.data.pickindex].list[this.data.pickidx].spec
    this.data.tempmedicineList.drugsId = this.data.drugList[this.data.pickindex].list[this.data.pickidx].id
  },
  choseType(e) {
    this.setData({
      drugtype: e.currentTarget.dataset.target
    })
    app.request({
      url: app.api.M_SEARCH,
      data: {
        drugsType: this.data.drugtype,
      }
    }).then(res => {
      this.data.tempmedicineList.drugsType = this.data.drugtype
      // console.log(this.data.tempmedicineList)
      this.setData({
        showindex: 1,
        drugList: res.data.data,
        other: false,
        otherName: null,
        otherSpec: null,
        pickindex: '',
        pickidx: '',
        drug: res.data.data.map(({
          name
        }) => name)
      })

    })
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
    this.data.medicineList.push(this.data.tempmedicineList);
    this.setData({
      medicineList: this.data.medicineList,
      tempmedicineList: {
        amount: 1,
        appRecordId: "",
        createTime: "",
        createUser: "",
        drugsId: "",
        drugsName: "",
        drugsType: "",
        id: "",
        isDelete: 0,
        price: '',
        sort: 0,
        spec: "",
        totalPrice: '',
        updateTime: "",
        updateUser: ""
      },
      drugtype: '',
      editStatus: false,
      otherName: null,
      otherSpec: null,
    })
    setTimeout(() => {
      that.setData({
        showindex: 0
      })
    }, 600)
    this.hideModal()
  },
  submit() {
    const that = this
    if (this.data.medicineList.length != 0) {
      wx.showModal({
        title: '提示',
        content: '是否确定提交',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            app.request({
              url: app.api.M_SUBMIT,
              data: {
                appDrugsRecordItems: that.data.medicineList,
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
    } else {
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整',
        showCancel: false,
        success(res) {}
      })
    }
  },
  resubmit() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '将重新编辑表单',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.setData({
            detail: false
          })
        }
      }
    })
  },

  data: {
    drugList: [{
      name: 'COD',
      list: [{
        type: '100',
        id: '1'
      }, {
        type: '200',
        id: '2'
      }, {
        type: '300',
        id: '3'
      }]
    }, {
      name: 'TOC',
      list: [{
        type: '100',
        id: '1'
      }, {
        type: '200',
        id: '2'
      }, {
        type: '300',
        id: '3'
      }]
    }, {
      name: 'yaoji',
      list: [{
        type: '100',
        id: '1'
      }, {
        type: '200',
        id: '2'
      }, {
        type: '300',
        id: '3'
      }]
    }, ],
    drug: [],
    otherName: null,
    other: false,
    otherSpec: null,
    pickidx: '',
    type: [],
    drugtype: '',
    optionsId: '',
    tempmedicineList: {
      amount: 1,
      appRecordId: "",
      createTime: "",
      createUser: "",
      drugsId: "",
      drugsName: "",
      drugsType: "",
      id: "",
      isDelete: 0,
      price: '',
      sort: 0,
      spec: "",
      totalPrice: '',
      updateTime: "",
      updateUser: ""
    },
    siteId: '',
    editStatus: false,
    medicineList: [],
    detail: true,
    site_details: [],
    userInfo: null,
    showindex: 0,
    message: '',
    pickindex: '',
    index: null,
    result: ['a', 'b'],
  },
  onLoad: function (options) {
    // console.log(options.id)
    // var drug = this.data.drugList.map(({
    //   name
    // }) => name)

    this.setData({
      optionsId: options.id || null,
      userInfo: app.globalData.user_info || null
    })
    if (this.data.optionsId) {
      this.setData({
        detail: true
      })
      app.request({
        url: app.api.M_DETAIL + this.data.optionsId
      }).then(res => {
        this.setData({
          site_details: res.data.data,
          medicineList: res.data.data.appDrugsRecordItems,
          message: res.data.data.description,
          siteId: res.data.data.siteId
        })
      })
    } else {
      this.setData({
        detail: false
      })
    }
  },


  onShareAppMessage: function () {

  }
})