<script setup lang="ts">
import { ref } from 'vue'
import { mobileRules, passwordRules } from '@/utils/rules'
// 引入toast
import { showFailToast, showSuccessToast } from 'vant'
import 'vant/es/toast/style'

import { loginByPassword } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const agree = ref(false)
// 动态切换密码框眼睛图标 => 控制是否显示密码
const isShowPass = ref(false)

// 表单数据
const mobile = ref('13230000024')
const password = ref('abc12345')

// 表单提交
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const login = async () => {
  if (!agree.value) showFailToast('请勾选已同意')
  else {
    // 验证完毕，进行登录
    const res = await loginByPassword(mobile.value, password.value)
    store.setUser(res)
    // 如果有回跳地址就进行回跳，没有跳转到个人中心
    // 这个路由对象上如果有问号参数需要通过query拿到, 这里通过断言给转换为字符串
    router.push((route.query.returnUrl as string) || '/user')
    showSuccessToast('登录成功')
  }
}
</script>

<template>
  <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
  <div class="login">
    <!-- 头部 -->
    <div class="login-head">
      <h3>密码登录</h3>
      <a href="javascript:;">
        <span>短信验证码登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- == form 表单 == -->
    <!-- 通过@submit提交表单 -->
    <van-form autocomplete="off" @submit="login">
      <van-field
        placeholder="请输入手机号"
        type="tel"
        v-model="mobile"
        :rules="mobileRules"
      ></van-field>
      <van-field
        placeholder="请输入密码"
        v-model="password"
        :type="isShowPass ? 'text' : 'password'"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <!-- 通过native-type="submit"设置为提交按钮 -->
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  .van-form {
    padding: 0 14px;
    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
