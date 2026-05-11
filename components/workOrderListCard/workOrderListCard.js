// pages/workOrderListCard.js
const splitProductName = (name) => {
  const fullName = String(name || '')
  const match = fullName.match(/^(.*?)(\[[^\]]+\])$/)

  if (match) {
    return {
      productNameMain: match[1],
      productNameHighlight: match[2]
    }
  }

  return {
    productNameMain: fullName,
    productNameHighlight: ''
  }
}

const formatCodeSuffix = (code) => {
  const suffix = String(code || '').slice(-7)
  if (suffix.length !== 7) return suffix
  return `${suffix.slice(0, 2)}-${suffix.slice(2, 4)}-${suffix.slice(4)}`
}

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
      observer(newVal) {
        const code = String((newVal && newVal.code) || '')
        const productName = newVal && newVal.productInfo ? newVal.productInfo.name : ''
        const { productNameMain, productNameHighlight } = splitProductName(productName)
        this.setData({
          itemCodeSuffix: formatCodeSuffix(code),
          productNameMain,
          productNameHighlight
        })
      }
    },
    from: {
      type: String,
      value: 'work' // work：我的工单 today：工单池 situation：工单进度 dispatch：派单 dashboard：总览
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemCodeSuffix: '',
    productNameMain: '',
    productNameHighlight: '',
    gradeMap: {
      middle: '普通',
      high: '紧急'
    },
    gradeTypeMap: {
      middle: 'success',
      high: 'danger'
    },
    typeMap: {
      produce: '新刀',
      maintenance: '维修',
      rework: '返工'
    },
    typeColorMap: {
      produce: '#0a0a0a',
      maintenance: '#ff7051',
      rework: '#ffd437'
    },
    typeTextColorMap: {
      produce: '#bfa075',
      maintenance: '#ffffff',
      rework: '#ffffff'
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openResetDialog(e) {
      this.triggerEvent('openresetdialog', { id: e.currentTarget.dataset.id })
    },
    goToDetail (e) {
      this.triggerEvent('gotodetail', { id: e.currentTarget.dataset.id })
    },
    openDialog (e) {
      this.triggerEvent('opendialog', { id: e.currentTarget.dataset.id })
    }
  }
})