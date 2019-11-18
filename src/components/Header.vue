<template>
  <el-header class="el-header-nav" height="60px">
    <ul class="el-ul el-ul-left ul-icon" :style="collapse ? 'left:69px' : 'left:230px'">
      <li @click="isHeader()" :title='collapse ? "打开侧栏" : "关闭侧栏"'>
        <a href="javascript:;"><i :class="collapse ? 'iconfont icon-icon_work_fill' : 'iconfont icon-icon_work'"></i></a>
      </li>
    </ul>
    <ul class="el-ul el-ul-right ul-icon">
      <li @click="notice()">
        <a href="javascript:;"><i class="iconfont icon-guangbo"></i></a>
      </li>
      <li @click="screen()"><a href="javascript:;"><i class="iconfont icon-quanping"></i></a></li>
      <li>
        <a href="javascript:;">
          <el-dropdown trigger="hover" @command="commandUser">
            <span class="el-dropdown-link">
              <span style="font-size: 16px">{{user.name === undefined || user.name === '' ? '请登录' : user.name}}</span>
              <img class="photo" src="../../src/assets/logo.png">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="personal">个人中心</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="loginOut" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </a>
      </li>
    </ul>
  </el-header>
</template>

<script>
import screenfull from 'screenfull'
      export default {
        name: 'Header',
        data () {
          return {
            collapse: false
          }
        },
      methods: {
        isHeader () {
        this.collapse = !this.collapse;
        this.$store.dispatch('collapse', this.collapse)
      },
      commandUser (command) {
        switch (command) {
        case 'personal':
        this.$router.push('/userInfo');
        break;
        case 'password':
        this.$emit('password', true);
        break;
        case 'loginOut':
        this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('loginOut');
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
        type: 'info',
        message: '取消退出登录'
      })
      });
        break
      }
      },
      notice () {
        this.$router.push('/message')
      },
      screen () {
        if (screenfull.enabled) {
        screenfull.toggle()
      } else {
          this.$message({ message: '不支持全屏', type: 'warning' })
        }
      }
      },
      computed: {
        user () {
        return this.$store.state.user
      }
      }
      }
    </script>

    <style lang="scss" scoped>
    .el-header {
      padding: 0;
      z-index: 1;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;
      border-bottom: 1px solid #f6f6f6;
      .el-header-nav {
        height: 60px;
      position: relative;
      .el-dropdown {
        display: block;
      }
    }
    .el-ul {
      padding: 0 10px;
      li {
        height: 60px;
        float: left;
        line-height: 60px;
        a {
          display: block;
          color: #000;
          padding: 0 15px;
          font-size: 18px;
          .photo {
            width: 45px;
            height: 45px;
          }
        }
        .el-badge__content {
          margin-top: 12px;
          padding: 0 5px;
        }
      }
    }
    .el-ul-left {
      position: absolute;
      top: 0;
      left: 230px;
      -webkit-transition: left .3s ease-in-out;
      transition: left .3s ease-in-out;
    }
    .el-ul-right {
      position: absolute;
      right: 0;
      top: 0;
    }
    .icon-gengduo{
      transform:rotate(90deg);
      -ms-transform:rotate(90deg); /* Internet Explorer */
      -moz-transform:rotate(90deg); /* Firefox */
      -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
      -o-transform:rotate(90deg);
    }
  }
</style>
