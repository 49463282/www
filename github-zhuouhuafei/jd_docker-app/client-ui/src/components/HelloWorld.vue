<template>
  <div class="HelloWorld">
    <h1>HelloWorld</h1>
    <h2>
      <router-link :to="{name:'CookieList'}">
        <el-button type="primary">Go to cookie list page</el-button>
      </router-link>
    </h2>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
  .HelloWorld {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }
</style>
