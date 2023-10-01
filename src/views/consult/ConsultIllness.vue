<script setup lang="ts">
import type { ConsultIllness } from '@/types/consult'
import { ref, computed, onMounted } from 'vue'
import { showConfirmDialog } from 'vant'
// 有赞提供的类型
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types'
import type { Image } from '@/types/consult'

import { uploadImage } from '@/api/consult'

import { useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'

// 导入患病时间选项和是否就诊选项
import { timeOptions, flagOptions } from '@/api/const'

const store = useConsultStore()
const router = useRouter()

// 表单变量(记录病情描述)
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})

// 以下三项有一个没选则不能点击下一步选项
const disabled = computed(
  () =>
    !form.value.illnessDesc ||
    !form.value.illnessTime ||
    // 说明：选择就诊过consultFlag的值为0,会有隐式转换
    form.value.consultFlag === undefined
)

// fileList 是配置图片预览使用的，同步 form 中的 pictures
const fileList = ref<Image[]>([])
const onAfterRead: UploaderAfterRead = (item) => {
  // 读取成功后，需要自己调用接口上传
  // TODO 上传图片：调用后台api上传接口

  // 排除多图上传数组的情况
  if (Array.isArray(item)) return
  // 非空判断
  if (!item.file) return
  // 开始上传 => 单图上传(如果要多图上传还要添加一些字段(官网))
  // 通过 status 属性可以标识上传状态，uploading 表示上传中，failed 表示上传失败，done 表示上传完成
  item.status = 'uploading'
  item.message = '上传中...'
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      // 给 item 加上 url 是为了删除可以根据 url 进行删除
      item.url = res.url
      // 存储上传成功图片url
      form.value.pictures?.push(res)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
const onDeleteImg = (item: UploaderFileListItem) => {
  // 删除成功后触发的事件，需要去删除 form 中的数据
  // TODO 删除图片
  // 删除已经上传图片
  // 本地预览的删除
  form.value.pictures = form.value.pictures?.filter((pic) => pic.url !== item.url)
}

const next = () => {
  // 存储病情描述
  store.setIllness(form.value)
  // 跳转档案管理：选择患者，需要根据 isChange 实现选择功能
  // 后续需要根据?isChange=1参数实现患者选择功能
  router.push('/user/patient?isChange=1')
}

// 回显数据
// 每次进入页面(页面挂载)时回显数据
onMounted(() => {
  // 一旦某一个有就行
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '提示',
      message: '您之前有填写病情描述的记录，需要回现吗？',
      closeOnPopstate: false // 是否在页面回退时这个confirm自动关闭,注意默认值为true
    }).then(() => {
      // 确认
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      // 图片回显预览
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 1. 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 2. 病情描述-表单 -->
    <div class="illness-form">
      <!-- 病情描述-基本情况 -->
      <van-field
        type="textarea"
        rows="3"
        v-model="form.illnessDesc"
        placeholder="请详细描述您的病情，病情描述不能为空"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag" />
      </div>
      <!-- 病情描述-图片上传 -->
      <div class="illness-img">
        <!-- 文件上传完毕后会触发 after-read 回调函数，获取到对应的 file 对象。 -->
        <van-uploader
          :after-read="onAfterRead"
          @delete="onDeleteImg"
          v-model="fileList"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          upload-icon="photo-o"
          upload-text="上传图片"
        ></van-uploader>
        <p class="tip">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
    </div>
    <!-- 下一步按钮: 保存病情描述并跳转到患者选择页面 -->
    <van-button :disabled="disabled" @click="next" type="primary" block round>下一步</van-button>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
