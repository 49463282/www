<template>
  <div>
    <el-card>
      <el-form label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input @keyup.13.native="save" v-model="form.captcha"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <img height="70" @click="getCaptchaUrl" :src="captchaUrl" alt="">
        </el-form-item>
      </el-form>
      <div class="ui-edit-btn-wrapper">
        <el-button style="margin-right: 0;" type="primary" @click="save">登陆</el-button>
      </div>
      <div v-if="userCount<=0" style="text-align: center;margin-top: -20px;">
        <router-link :to="{name:'Register'}">
          <el-button type="text" size="small">没有账号，去注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>
<script>
import ApiUser from '@/api/user'
import { v4 } from 'uuid'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      userCount: 0,
      captchaUrl: '',
      form: {
        name: '',
        password: '',
        uuid: '',
        captcha: ''
      }
    }
  },
  async created () {
    this.getCaptchaUrl()
    this.getUserCount()
  },
  methods: {
    async getUserCount () {
      const r = await ApiUser.count()
      this.userCount = r.count
    },
    async getCaptchaUrl () {
      this.form.uuid = v4()
      const r = await ApiUser.captcha({ uuid: this.form.uuid })
      this.captchaUrl = r.base64
    },
    async save () {
      const result = await ApiUser.login(this.form)
      Cookies.set('Authorization', `Bearer ${result.Authorization}`)
      this.$message.success('成功')
      this.goPrevPage()
    },
    goPrevPage () {
      const from = this.$getStorageSync('to')
      if (from) {
        this.$router.replace(from)
      } else {
        this.$router.replace({ name: 'CookieList' })
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
