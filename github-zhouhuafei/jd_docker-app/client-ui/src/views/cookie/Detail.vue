<template>
  <el-card>
    <el-form label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="pt_key">
        <el-input v-model="form.pt_key"></el-input>
      </el-form-item>
      <el-form-item label="pt_pin">
        <el-input v-model="form.pt_pin"></el-input>
      </el-form-item>
      <el-form-item label="优先级">
        <el-input placeholder="值越小优先级越高" v-model="form.priority"></el-input>
      </el-form-item>
    </el-form>
    <div class="ui-edit-btn-wrapper">
      <el-button @click="goPrevPage">返回</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-card>
</template>
<script>
import ApiCookie from '@/api/cookie'

export default {
  data () {
    return {
      form: {
        _id: '',
        name: '',
        pt_key: '',
        pt_pin: '',
        priority: ''
      }
    }
  },
  async created () {
    let id = this.$route.query._id
    if (id) {
      this.form._id = id || ''
      this.getDetail()
    }
  },
  methods: {
    async save () {
      await ApiCookie.save(this.form)
      this.$message.success('成功')
      this.goPrevPage()
    },
    async getDetail () {
      const result = await ApiCookie.getDetail({ _id: this.form._id })
      this.form = {
        ...this.form,
        ...result
      }
    },
    goPrevPage () {
      this.$router.replace({ name: 'CookieList' })
    }
  }
}
</script>

<style scoped lang="scss"></style>
