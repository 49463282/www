<template>
  <el-card>
    <div style="text-align: right;">
      <el-button type="text" size="small">
        <a target="_blank" href="https://work.weixin.qq.com/api/doc/90000/90136/91770">
          非必填，如有需要，请参阅官方文档
        </a>
      </el-button>
    </div>
    <el-form label-width="220px">
      <el-form-item label="企业微信推送webhook后面的key">
        <el-input v-model="form.QYWX_KEY"></el-input>
      </el-form-item>
    </el-form>
    <div class="ui-edit-btn-wrapper">
      <el-button @click="goPrevPage">返回</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-card>
</template>
<script>
import ApiUser from '@/api/user'

export default {
  data () {
    return {
      form: {
        _id: '',
        QYWX_KEY: ''
      }
    }
  },
  async created () {
    this.getDetail()
  },
  methods: {
    async save () {
      await ApiUser.setting(this.form)
      this.$message.success('成功')
      this.goPrevPage()
    },
    async getDetail () {
      const result = await ApiUser.setting({ _id: this.form._id })
      this.form = result
    },
    goPrevPage () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss"></style>
