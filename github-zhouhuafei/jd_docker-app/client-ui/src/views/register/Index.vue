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
        <el-button style="margin-right: 0;" type="primary" @click="save">注册</el-button>
      </div>
      <div style="text-align: center;margin-top: -20px;">
        <router-link :to="{name:'Login'}">
          <el-button type="text" size="small">已有账号，去登陆</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>
<script>
import ApiUser from '@/api/user'
import { v4 } from 'uuid'

export default {
  data () {
    return {
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
  },
  methods: {
    async getCaptchaUrl () {
      this.form.uuid = v4()
      const r = await ApiUser.captcha({ uuid: this.form.uuid })
      this.captchaUrl = r.base64
    },
    async save () {
      await ApiUser.register(this.form)
      this.$message.success('注册成功')
      this.goPrevPage()
    },
    goPrevPage () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss"></style>
