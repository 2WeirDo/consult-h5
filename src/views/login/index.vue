<script setup lang="ts">
import { ref } from 'vue'
const agree = ref(false)
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
    <van-form autocomplete="off">
      <van-field placeholder="请输入手机号" type="tel"></van-field>
      <van-field placeholder="请输入密码" type="password"></van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary">登 录</van-button>
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
