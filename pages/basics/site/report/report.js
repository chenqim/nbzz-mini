// pages/basics/site/report/report.js
// 此处注释信息在其他report中同样适用
const app = getApp()
Page({
  // 查询站点列表
  querysitelist() {
    return new Promise(function (resolve, reject) {
      app.request({
        url: app.api.SITE_LIST,
      }).then(res => {
        resolve(res)
      })
    })
  },
  // 重新提交
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
            // console.log(res.data.data)
            var index = res.data.data.findIndex((item, index) => {
              return that.data.siteId == item.id;
            })
            // console.log(index)
            // this.data.site = res.data.data
            that.setData({
              site: res.data.data,
              pickindex: index,
              siteList: res.data.data.map(({
                name
              }) => name)
            })
            // console.log(res.data.data)
          })
          // 解析事项为对象数组
          let ops = that.data.site_details.opsItem.split(',')
          for (let i = 0; i < ops.length; i++) {
            that.data.checkbox.filter(e => {
              if (e.value == ops[i])
                return e.checked = true
            })
          }
          let tempdata = that.data.checkbox
          // 提取数组中所有checked为true的name值，转字符串
          that.setData({
            checkbox: tempdata,
            checked: tempdata.filter(e => e.checked == true).map(({
              name
            }) => name).toString()
          })
        }
      }
    })

  },
  // 选择图片
  ChooseImage() {
    const that = this
    var path = []
    wx.chooseImage({
      count: this.data.imgList.length < 8 ? 1 : 0, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], //从相册选择
      success: (res) => {
        wx.showLoading({
          mask: true,
          title: '拼命上传中....'
        })
        app.upload(res.tempFilePaths[0], app.baseurl + app.api.FU_MAINTAIN_SITE_IMG)
          .then(uploadres => {
            this.data.siteImage = this.data.siteImage.concat(uploadres.data.fileId)
            // console.log(this.data.siteImage)
            if (this.data.imgList.length != 0) {
              this.setData({
                imgList: this.data.imgList.concat(res.tempFilePaths),
                viewimage: this.data.imgList.concat(res.tempFilePaths)
              })
            } else {
              this.setData({
                imgList: res.tempFilePaths,
                viewimage: res.tempFilePaths,
              })
            }
            wx.hideLoading({})
          })
          .catch(err => {
            wx.showToast({
              title: "上传失败",
              icon: 'none',
              duration: 2500
            })
          })
      },
      fail: (err) => {}
    });
  },
  // 查看图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.viewimage,
      current: e.currentTarget.dataset.url
    });
  },
  // 选择图片
  ChoosePic() {
    const that = this
    wx.chooseImage({
      count: this.data.fileList.length < 8 ? 1 : 0, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], //从相册选择
      success: (res) => {
        wx.showLoading({
          mask: true,
          title: '拼命上传中....'
        })
        app.upload(res.tempFilePaths[0], app.baseurl + app.api.FU_MAINTAIN_FORM_IMG)
          .then(uploadres => {
            this.data.formImage = this.data.formImage.concat(uploadres.data.fileId)
            if (this.data.fileList.length != 0) {
              this.setData({
                fileList: this.data.fileList.concat(res.tempFilePaths),
                viewfile: this.data.fileList.concat(res.tempFilePaths),
              })
            } else {
              this.setData({
                fileList: res.tempFilePaths,
                viewfile: res.tempFilePaths,
              })
            }
            wx.hideLoading({})
            // console.log(this.data.formImage)
          })
          .catch(err => {
            wx.showToast({
              title: "上传失败",
              icon: 'none',
              duration: 2500
            })
          })
      },
      fail: (err) => {}
    });
  },
  // 查看图片
  ViewForm(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: this.data.viewfile,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  DelImg(e) {
    wx.showModal({
      content: '确定要删除这张照片吗？',
      cancelText: '点错了',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.viewimage.splice(e.currentTarget.dataset.index, 1);
          this.data.siteImage.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            viewimage: this.data.viewimage,
          })
        }
      }
    })
  },
  //删除图片
  Delfile(e) {
    wx.showModal({
      content: '确定要删除这张照片吗？',
      cancelText: '点错了',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.fileList.splice(e.currentTarget.dataset.index, 1);
          this.data.viewfile.splice(e.currentTarget.dataset.index, 1);
          this.data.formImage.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            fileList: this.data.fileList,
            viewfile: this.data.viewfile,
          })
        }
      }
    })
  },
  // 备注
  description(event) {
    this.setData({
      message: event.detail
    })
    // console.log(event.detail)
  },
  // 打开模态框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 关闭模态框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 事项选择
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    // console.log(items)
    this.setData({
      checkbox: items,
      checked: items.filter(e => e.checked == true).map(({
        name
      }) => name).toString()
    })
    // console.log(this.data.checked)
  },
  // 站点选择
  PickerChange(e) {
    this.setData({
      pickindex: parseInt(e.detail.value)
    })
  },
  // 提交
  submit() {
    let opsItem = this.data.checkbox.filter(e => e.checked == true).map(({
      value
    }) => value).toString() || ''
    let siteImgIds = this.data.siteImage.toString() || ''
    let opsFormImgIds = this.data.formImage.toString() || ''

    // console.log(typeof this.data.pickindex,typeof 1,typeof undefined , typeof null)
    if (typeof this.data.pickindex == 'number') {
      var siteId = this.data.site[this.data.pickindex].id || ''
    }
    console.log(opsItem, siteImgIds, opsFormImgIds, siteId)
    if (!opsItem || !siteImgIds || !opsFormImgIds || !siteId) {
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整',
        showCancel: false,
        success(res) {
          if (res.confirm) {}
        }
      })
    } else {
      var that = this
      wx.showModal({
        title: '提示',
        content: '是否确定提交',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            app.request({
              url: app.api.SITE_SUBMIT,
              data: {
                description: that.data.message,
                id: that.data.optionsId,
                opsItem: opsItem,
                siteId: siteId,
                siteImgIds: siteImgIds,
                opsFormImgIds: opsFormImgIds
              }
            }).then(res => {
              wx.showModal({
                title: '提示',
                content: '提交成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    let pages = getCurrentPages(); // 当前页的数据，
                    console.log(getCurrentPages())
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


  data: {
    optionsId: '',
    siteId: '',
    detail: true,
    site_details: [],
    siteImage: [],
    formImage: [],
    checked: '',
    userInfo: null,
    message: '',
    imgList: [],
    index: null,
    fileList: [],
    site: [],
    siteList: [],
    pickindex: null,
    opscheck: '',
    viewimage: [],
    viewfile: [],
    checkbox: [{
      value: 'daily',
      name: '日常运维',
      checked: false,
    }, {
      value: 'contrast',
      name: '验收对比',
      checked: false,
    }, {
      value: 'repair',
      name: '故障维修',
      checked: false,
    }]
  },
  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      optionsId: options.id || null,
      userInfo: app.globalData.user_info || null
    })

    if (this.data.optionsId) {
      this.setData({
        detail: true
      })
      app.request({
        url: app.api.SITE_PARTICULARS + this.data.optionsId
      }).then(res => {
        this.setData({
          site_details: res.data.data,
          message: res.data.data.description,
          siteId: res.data.data.siteId
        })
        let stooges = this.data.site_details.opsItem.split(',')
        for (let i = 0; i < stooges.length; i++) {
          if (stooges[i] == 'repair') {
            stooges[i] = '故障维修'
          }
          if (stooges[i] == 'contrast') {
            stooges[i] = '验收对比'
          }
          if (stooges[i] == 'daily') {
            stooges[i] = '日常运维'
          }
        }
        this.setData({
          opscheck: stooges.toString()
        })
      })
      app.request({
        url: app.api.SITE_SITEIMG + this.data.optionsId
      }).then(res => {
        // console.log(app.baseurl)
        let imglist = []
        let viewimage = []
        let siteImageId = []
        for (let i = 0; i < res.data.data.length; i++) {
          imglist = imglist.concat(app.baseurl + res.data.data[i].thumbnailUrl)
          viewimage = viewimage.concat(app.baseurl + res.data.data[i].fileUrl)
          siteImageId = siteImageId.concat(res.data.data[i].fileId)
        }
        this.data.siteImage = siteImageId
        this.setData({
          imgList: imglist,
          viewimage: viewimage
        })
      })
      app.request({
        url: app.api.SITE_OPSIMG + this.data.optionsId
      }).then(res => {
        // console.log(app.baseurl)
        let filelist = []
        let opsFormImgIds = []
        let viewfile = []
        for (let i = 0; i < res.data.data.length; i++) {
          filelist = filelist.concat(app.baseurl + res.data.data[i].thumbnailUrl)
          viewfile = viewfile.concat(app.baseurl + res.data.data[i].fileUrl)
          opsFormImgIds = opsFormImgIds.concat(res.data.data[i].fileId)
        }
        this.data.formImage = opsFormImgIds
        this.setData({
          fileList: filelist,
          viewfile: viewfile,
        })
      })
    } else {
      this.setData({
        detail: false
      })
      app.request({
        url: app.api.SITE_LIST,
      }).then(res => {
        this.data.site = res.data.data
        this.setData({
          // site: res.data.data,
          siteList: res.data.data.map(({
            name
          }) => name)
        })
      })
    }
  },


  onShareAppMessage: function () {

  }
})