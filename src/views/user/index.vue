<script setup lang="ts">
import { getUserInfo } from '@/api/user'
import type { UserInfo } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 这里使用断言来传递类型
const user = ref({} as UserInfo)
onMounted(async () => {
  const res = await getUserInfo()
  user.value = res
})

const tools = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]

// 实现退出功能
import 'vant/es/dialog/style'
import { showConfirmDialog, showSuccessToast } from 'vant'
import { useUserStore } from '@/stores/index'
const store = useUserStore()
const router = useRouter()
const logout = async () => {
  await showConfirmDialog({
    theme: 'round-button',
    title: '提示',
    message: '亲，确定退出问诊吗？'
  })
  store.delUser()
  showSuccessToast('退出成功')
  router.push('/login')
}
</script>

<template>
  <!-- 这里也可以不加v-if, 因为user是通过断言来添加类型的, 有初始值了, 不会报错 -->
  <div class="user-page" v-if="user">
    <!-- 1. 头部展示 -->
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="user.avatar" />
        <div class="name">
          <p>{{ user.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ user.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ user.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ user.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ user.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order">全部订单 <van-icon name="arrow" /></router-link>
      </div>
      <van-row v-if="user.orderInfo">
        <!-- 因为请求是异步的, 所以还要判断, 当然也可以加可选链 -->
        <van-col span="6">
          <!-- van-badge 标签可以设置徽章的样式、颜色、字体等属性，支持自定义徽章的显示内容。 -->
          <van-badge :content="user.orderInfo.paidNumber || ''">
            <cp-icon name="user-paid" />
          </van-badge>
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-badge dot color="#1989fa" :content="user.orderInfo.shippedNumber || ''">
            <cp-icon name="user-shipped" />
          </van-badge>
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user.orderInfo.receivedNumber || ''">
            <cp-icon name="user-received" />
          </van-badge>
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="user.orderInfo.finishedNumber || ''">
            <cp-icon name="user-finished" />
          </van-badge>
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <!-- 2. 快捷工具 -->
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        :title="item.label"
        is-link
        :to="item.path"
        :border="false"
        v-for="(item, index) in tools"
        :key="index"
      >
        <template #icon><cp-icon :name="`user-tool-0${index + 1}`" /></template>
      </van-cell>
    </div>
    <!-- 3. 退出登录 -->
    <a class="logout" @click="logout" href="javascript:;">退出登录</a>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;
  // 头部
  &-head {
    height: 200px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0.46), rgba(44, 181, 165, 0));
    margin: 0 -15px;
    padding: 0 15px;
    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;
      .van-image {
        width: 70px;
        height: 70px;
      }
      .name {
        padding-left: 10px;
        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }
    .van-row {
      margin: 0 -15px;
      padding-top: 15px;
      p {
        text-align: center;
        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }
        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
  // 订单
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;
      a {
        color: var(--cp-tip);
      }
    }
    .van-col {
      .van-badge__wrapper {
        font-size: 30px;
      }
      text-align: center;
      .cp-icon {
        font-size: 28px;
      }
      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }
  // 分组
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }
  .logout {
    display: block;
    background-color: rgb(230, 230, 230);
    margin: 20px auto;
    width: 100px;
    box-shadow: 1px 1px 1px black;
    text-align: center;
    color: black;
    border-radius: 20px;
  }
}
</style>
