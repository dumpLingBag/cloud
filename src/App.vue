<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "app"
};
</script>

<style lang="scss">
  html,body{margin: 0;height: 100%;}
  ul, li, p, h1, h2, h3, h4, h5, h6, dl, dt, dd, button, textarea, input {margin: 0;padding: 0;list-style: none;border: none;outline: none;}
  a {text-decoration: none;}
  i{font-style:normal;}
  s{text-decoration:none;}
  #app{height: 100%;width: 100%;background-color: #f8f8f8;font-family: Arial, Helvetica, sans-serif;font-size: 14px;}
  .vue-padding{border: none;padding: 20px;background-color: #fff;-webkit-box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);border-radius: 0.5rem;}
  .vue-top-padding{padding: 15px 20px;background-color: #fff;-webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);border-radius: 2px;}
  .tips{padding: 20px;border-radius: 4px;margin-bottom: 20px;color: #909399;font-size: 24px;font-weight: 600;background-color: #f4f4f5;}
  .el-input-height{input{height: 33px;line-height: 33px;width: 150px;}}
  ::-webkit-scrollbar {display: none;}
  .el-left{float: left;}
  .el-right{float: right;}
  input:-webkit-autofill {-webkit-box-shadow: 0 0 0 1000px white inset;}

</style>
