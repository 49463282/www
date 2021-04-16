<template>
  <div>
    <el-card>
      <div slot="header" class="flex-space-between">
        <span>列表</span>
        <div class="flex-space-between">
          <router-link class="mr10" :to="{name:'Message'}">
            <el-button type="primary">企微消息推送设置</el-button>
          </router-link>
          <el-button @click="importAccount" type="primary">导入账号</el-button>
          <el-button @click="exportAccount" type="primary">导出账号</el-button>
          <el-button @click="lookLogs" type="primary">查看日志</el-button>
          <el-button @click="scriptStart" type="primary">重启脚本</el-button>
          <el-button @click="scriptStop" type="primary">停止脚本</el-button>
          <el-button @click="scriptStart" type="primary">启动脚本</el-button>
          <router-link class="ml10" :to="{name:'CookieDetail'}">
            <el-button type="primary">新增账号</el-button>
          </router-link>
        </div>
      </div>
      <div class="ui-search-header-block dark">
        <el-form inline label-width="100px" @submit.native.prevent="handleCurrentChange(1)">
          <el-form-item label="名称">
            <el-input v-model="search.name"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="btn-search" type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">搜索
        </el-button>
      </div>
      <el-table :data="tableData" ref="table">
        <el-table-column align="center" label="_id" prop="_id"></el-table-column>
        <el-table-column align="center" label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="pt_key" prop="pt_key"></el-table-column>
        <el-table-column align="center" label="pt_pin" prop="pt_pin"></el-table-column>
        <el-table-column align="center" label="优先级" prop="priority"></el-table-column>
        <el-table-column align="center" label="更新时间" v-slot="{row}">{{new Date(row.updatedAt).toLocaleString()}}
        </el-table-column>
        <el-table-column align="center" label="创建时间" v-slot="{row}">{{new Date(row.createdAt).toLocaleString()}}
        </el-table-column>
        <el-table-column align="center" label="操作" v-slot="scope">
          <router-link :to="{name:'CookieDetail',query:{_id:scope.row._id}}">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="del(scope.row)" class="ml10">删除</el-button>
        </el-table-column>
      </el-table>
      <div class="block" style="padding-top: 10px;text-align: right;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.page"
          :page-sizes="[10,100,200,300,400]"
          :page-size="search.limit"
          layout="total,sizes,prev,pager,next,jumper"
          :total="search.count">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import ApiUser from '@/api/user'
import ApiCookie from '@/api/cookie'
import XLSX from 'xlsx'

export default {
  data () {
    return {
      search: {
        name: '',
        page: 1, // 当前是第几页
        limit: 10, // 每页数据条数
        count: 300, // 数据总条数
        pageCount: 30 // 总共多少页
      },
      tableData: []
    }
  },
  async created () {
    this.getList()
  },
  methods: {
    chooseFile (opts = {}) {
      const input = document.createElement('input')
      input.addEventListener('change', (e) => {
        const tempFilePaths = [...e.target.files]
        if (tempFilePaths.length > opts.count) {
          const message = `最多上传${opts.count}个文件`
          console.error(message)
          opts.fail && opts.fail({ message })
        } else {
          opts.success && opts.success({ tempFilePaths })
        }
      })
      input.type = 'file'
      if (opts.count > 1) {
        input.setAttribute('multiple', 'multiple')
      }
      input.click()
    },
    importAccount () {
      // 參考：https://www.cnblogs.com/liuxianan/p/js-excel.html
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetNames = workbook.SheetNames // 工作表名称集合
        const worksheet = workbook.Sheets[sheetNames[0]] // 这里我们只读取第一张sheet
        let arrJson = XLSX.utils.sheet_to_json(worksheet)
        arrJson = arrJson.map(v => {
          return {
            'name': v['名称'],
            'pt_key': v.pt_key,
            'pt_pin': v.pt_pin,
            'priority': v['优先级']
          }
        })
        await ApiCookie.importExcel({ list: arrJson })
        this.$message.success('导入成功')
        this.getList()
      }
      this.chooseFile({
        success: ({ tempFilePaths }) => {
          reader.readAsBinaryString(tempFilePaths[0])
        }
      })
    },
    async exportAccount () {
      // 參考：https://www.kitesky.com/archives/218
      const result = await ApiCookie.getList({
        ...this.search,
        limit: 0 // 直接一页查出全部
      })
      const filename = 'cookie.xlsx'
      const workbook = XLSX.utils.book_new()
      const arrJson = result.list.map(v => {
        return {
          '名称': v.name,
          'pt_key': v.pt_key,
          'pt_pin': v.pt_pin,
          '优先级': v.priority
        }
      })
      // 数组转excel
      const ws1 = XLSX.utils.json_to_sheet(arrJson)
      // 表格转excel
      // const ws1 = XLSX.utils.table_to_sheet(this.$refs.table.$el)
      XLSX.utils.book_append_sheet(workbook, ws1, 'Sheet1')
      XLSX.writeFile(workbook, filename)
    },
    lookLogs () {
      window.open('/jd_docker-app/logs', '_blank')
    },
    async scriptStart () {
      await ApiUser.scriptStart()
    },
    async scriptStop () {
      await ApiUser.scriptStop()
    },
    async getList () {
      const result = await ApiCookie.getList({ ...this.search })
      this.tableData = result.list
      this.search.count = result.count
    },
    async del (row) {
      await ApiCookie.delete({ ...row })
      this.$message.success('成功')
      this.getList()
    },
    handleSizeChange (val) {
      this.search.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.search.page = val
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss"></style>
