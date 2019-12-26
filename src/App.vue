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
  #app{height: 100%;width: 100%;background-color: #f2f2f2;font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;font-size: 14px;}
  .vue-padding{border: none;padding: 20px;background-color: #fff;}
  .vue-top-padding{padding: 15px 20px;background-color: #fff;border-radius: 2px;}
  .tips{padding: 20px;border-radius: 4px;margin-bottom: 20px;color: #909399;font-size: 24px;font-weight: 600;background-color: #f4f4f5;}
  .el-input-height{input{height: 33px;line-height: 33px;width: 150px;}}
  /*::-webkit-scrollbar {display: none;}*/
  .el-left{float: left;}
  .el-right{float: right;}
  input:-webkit-autofill {-webkit-box-shadow: 0 0 0 1000px white inset;}
  .radius {background: #ffffff;border-radius: 0.3rem;box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);-webkit-box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);}
  /*.abs{position: absolute;bottom: 0;top:0;}*/
</style>
