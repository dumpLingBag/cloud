<template>
    <div class="sys-auth vue-padding radius">
        <div class="tips">{{$route.name}}</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户角色管理" name="userRole">
                <el-row>
                    <el-col :span="5" class="colSpan">
                        <div class="roleFilter">
                            <el-input placeholder="输入角色关键字进行过滤" v-model="filterText"></el-input>
                        </div>
                            <el-tree :data="roleList" show-checkbox accordion :expand-on-click-node="false"
                                :props="defaultProps" @check-change="checkRoleUserChange" @check="checkRoleUser" @node-click="nodeRoleUser">
                            </el-tree>
                    </el-col>
                    <el-col :span="19">222</el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="角色权限设置" name="userAuth">
                <el-row>
                    <el-col :span="5" class="colSpan">
                        <div class="roleFilter">
                            <el-input placeholder="输入角色关键字进行过滤" v-model="filterText"></el-input>
                        </div>
                        <el-tree :data="roleList" show-checkbox accordion :expand-on-click-node="false"
                                 :props="defaultProps" @check-change="checkRoleUserChange" @check="checkRoleUser" @node-click="nodeRoleUser">
                        </el-tree>
                    </el-col>
                    <el-col :span="19">

                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="用户部门管理" name="userDept">
                <el-row>
                    <el-col :span="5" class="colSpan">

                    </el-col>
                    <el-col :span="19">222</el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  name: 'AuthorityAuth',
  data() {
      return {
          activeName: 'userRole',
          roleList: [],
          defaultProps: {
              label: 'name',
              children: 'children'
          },
          checkRoleUserName: ''
      }
  },
  mounted() {
      this.$api.request(this.$url.AuthorityRole.load, this.$method.get).then(res => {
          if (res.code === 0) {
              this.roleList = res.data
          }
      }).catch(() => {

      })
  },
  methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      nodeRoleUser(data) {
        console.log(data)
      },
      checkRoleUser(data) {
          console.log('11111')
      },
      checkRoleUserChange(data) {
          console.log(data)
      }
  }
}
</script>

<style lang="scss">
    .sys-auth {
        .el-input {
            margin-bottom: 10px;
        }
        .colSpan {
            border-right: 1px solid rgba(235, 235, 235, 1);
        }
        .roleFilter {
            padding: 0 20px;
            margin-bottom: 10px
        }
        .el-tree-node__content {
            height: 2.5rem;
            line-height: 2.5rem;
        }
        .el-tree-node__content:hover {
            color: rgb(16, 142, 233);
            border-right: 2px solid rgb(16, 142, 233);
            background-color: rgba(230, 247, 255, 1);
        }
        .is-current {
            .el-tree-node__content {
                color: rgb(16, 142, 233);
                border-right: 2px solid rgb(16, 142, 233);
                background-color: rgba(230, 247, 255, 1)!important;
            }
        }
    }
</style>
