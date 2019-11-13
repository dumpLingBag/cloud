<template>
  <div class="sys-user">
    <div class="el-search vue-top-padding" style="margin-bottom: 10px;height: 33px">
      <div class="el-left">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addUser">增加</el-button>
      </div>
      <div class="el-right">
        <el-form ref="page" :model="page.search" :inline="true" label-width="10px" size="small"
                 class="demo-form-inline el-input-height">
          <el-form-item prop="enable">
            <el-select v-model="page.search.enable" @change="enableSelect($event)" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="page.search.username" placeholder="请输入用户账号"></el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input v-model="page.search.nickname" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
            <el-button @click="resetSearch('page')" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog :title="addOrEdit ? '添加用户' : '编辑用户'" v-dialogDrag :visible.sync="dialogUser" width="50%" @closed="closeDialog" :modal-append-to-body='false'>
      <el-form :label-position="labelPosition" :rules="rules" ref="userForm" label-width="80px" :model="userForm">
        <el-form-item label="用户名称" prop="nickname" :error="error.nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入用户名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号名称" prop="username" :error="error.username">
          <el-input v-model="userForm.username" placeholder="请输入账号名称" autocomplete="off" :disabled="!addOrEdit && userForm.account == 'admin' ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="账号密码" prop="password" v-if="addOrEdit">
          <el-input type="password" v-model="userForm.password" placeholder="请输入账号密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword" v-if="addOrEdit">
          <el-input type="password" v-model="userForm.checkPassword" placeholder="请再次输入账号密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入用户邮箱" :error="error.email"></el-input>
        </el-form-item>
        <el-form-item label="用户号码" prop="mobile" :error="error.mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户号码"></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="enable">
          <el-select v-model="userForm.enable" placeholder="请选择账号状态" :disabled="!addOrEdit && userForm.account == 'admin' ? true : false">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('userForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="角色信息" :visible.sync="dialogRole" width="30%" center :modal-append-to-body='false' @closed="closeRole">
      <el-select v-model="selectRole" multiple collapse-tags filterable placeholder="请选择角色">
        <el-option-group v-for="group in roleList" :key="group.id" :label="group.name">
          <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-option-group>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRole = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <div class="user-main vue-padding">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="userList" :height="maxHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="用户ID" width="80"></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="nickname" label="名称"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag size="medium" @click="tagEnable(scope.$index, scope.row)" :type="Number(scope.row.enable) === 1 ? 'success' : 'warning'">
              {{ Number(scope.row.enable) === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="userRole(scope.row)" :disabled="scope.row.account === 'admin'">角色</el-button>
            <el-button type="warning" size="mini" @click="resetPassword(scope.row)" :disabled="scope.row.account === 'admin'">重置</el-button>
            <el-button type="danger" size="mini" @click="delUser(scope.row)" :disabled="scope.row.account === 'admin'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :current-page="page.currentPage" :total="page.totalSize" :page-size="page.pageSize" @current-change="currentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import { httpData } from '@/common/httpData'

export default {
  name: 'AuthorityUser',
  data () {
    const password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg = new RegExp('(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$');
        if (!reg.test(value)) {
          callback(new Error('密码必须包含大小写字母数字，长度为6~16位'))
        }
        if (this.userForm.checkPassword !== '') {
          this.$refs.userForm.validateField('checkPassword')
        }
        callback()
      }
    };
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    };
    const mobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        const reg = new RegExp('^((13\\d)|(14[5-9])|(15[0-35-9])|(166)|(17[0-8])|(18\\d)|(19[8-9]))\\d{8}$');
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
    };
    return {
      userList: [], // 表格数据
      tableHeight: '', // 动态设置最大高度
      maxHeight: this.$common.treeHeight,
      addOrEdit: false, // 添加或者编辑用户
      dialogRole: false,
      roleList: [], // 机构拥有的角色
      selectRole: [], // 用户选中后拥有的角色ID
      selectAddRoleValue: [], // 用来筛选新增的角色
      selectDiffRoleValue: [], // 用来筛选修改的角色
      userId: '',
      userForm: {// 添加用户表单数据
        nickname: '',
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        mobile: '',
        enable: ''
      },
      error: {
        nickname: '',
        username: '',
        mobile: '',
        email: ''
      },
      labelPosition: 'left',
      dialogUser: false, // 新增表单弹框
      loading: false,
      multipleSelection: [], // 表格多选框数据
      formLabelWidth: '120px',
      rules: {
        nickname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: password, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: checkPassword, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { validator: mobile, required: true, trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '请选择账号状态', trigger: 'blur' }
        ]
      },
      page: {// 初始分页数据
        pageSize: 10,
        currentPage: 1,
        search: {
          username: '',
          enable: '',
          nickname: ''
        }
      }
    }
  },
  mounted () {
    this.currentChange(); // 分页获取用户信息
    this.getRoleList() // 获取对应账号的角色信息
  },
  methods: {
    // 添加或编辑用户
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {};
          Object.keys(this.userForm).forEach(key => {
            obj[key] = this.userForm[key]
          });
          if (this.addOrEdit) {
            obj.password = this.$md5(obj.password);
            obj.checkPassword = this.$md5(obj.checkPassword)
          }
          if (!this.userForm.id) {
            this.$api.httpPost(this.$url.AuthorityUser.addUser, obj).then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '提示',
                  message: '添加用户成功',
                  type: 'success'
                });
                this.dialogUser = false;
                this.pageList(this.page)
              } else {
                this.$toolUtil.msg(res, this.error)
              }
            })
          } else {
            this.$api.httpPost(this.$url.AuthorityUser.editUser, obj).then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '提示',
                  message: '编辑用户成功',
                  type: 'success'
                });
                this.dialogUser = false;
                this.pageList(this.page)
              } else {
                this.$toolUtil.msg(res, this.error)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 分页获取用户数据
    pageList (data) {
      this.$api.httpPost(this.$url.AuthorityUser.pageList, httpData(data)).then(res => {
        if (res.code === 0) {
            if (res.data && res.data.records) {
              this.userList = res.data.records;
              this.page.totalSize = res.data.total
            } else {
              this.userList = []
            }
        }
      })
    },
    // 获取对应角色信息
    getRoleList () {
      this.$api.httpGet(this.$url.AuthorityRole.loadByPid).then(res => {
        if (res.code === 0) {
          this.roleList = res.data
        }
      })
    },
    // 清除表单校验信息
    clearValidate (formName) {
      this.$refs[formName].clearValidate()
    },
    // 清除表单校验信息
    closeDialog () {
      this.clearValidate('userForm');
      if (!this.addOrEdit) {
        this.$toolUtil.clearForm(this.userForm)
      }
    },
    // 表格复选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 模糊搜索
    onSubmit () {
      this.currentChange()
    },
    // 重置搜索表单数据
    resetSearch (formName) {
      this.$refs[formName].resetFields(); // 这个只是清除了表单数据，对象并没有重新赋值，所以调用下面的方法赋空值
      this.$toolUtil.clearForm(this.page.search);
      this.currentChange() // 重新加载分页数据
    },
    // 模糊搜索下拉框监听事件
    enableSelect (enable) {
      this.page.search.enable = enable;
      this.currentChange()
    },
    // 获取用户拥有的角色
    userRole (row) {
      this.userId = row.id;
      this.dialogRole = !this.dialogRole;
      this.$api.httpGet(this.$url.AuthorityUserRole.load + '?userId=' + row.id).then(res => {
        if (res.code === 0) {
          this.selectRole = [];
          this.selectAddRoleValue = res.data;
          this.selectDiffRoleValue = res.data;
          if (res.data && res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.selectRole.push(res.data[i].roleId)
            }
          }
        }
      }).catch(() => {
        this.selectRole = []
      })
    },
    // 添加用户
    addUser () {
      this.dialogUser = true;
      this.addOrEdit = true
    },
    // 关闭弹框
    cancel () {
      this.dialogUser = false
    },
    // 编辑用户信息
    editUser (row) {
      this.dialogUser = true;
      this.addOrEdit = false;
      Object.keys(this.userForm).forEach(key => {
        if (key === 'enable') {
          this.userForm[key] = String(row[key])
        } else {
          this.userForm[key] = row[key]
        }
      });
      this.userForm.id = row.id
    },
    // 删除用户信息
    delUser (row) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.httpGet(this.$url.AuthorityUser.delete + '/' + row.id).then(res => {
          if (res.code === 0) {
            this.$message.success('删除用户成功');
            this.pageList(this.page)
          }
        })
      }).catch(() => {
        this.$message.info('取消删除!')
      })
    },
    // 重置用户密码
    resetPassword (row) {
      this.$confirm('确定重置该用户的密码为 123456 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.httpGet(this.$url.AuthorityUser.resetPassword + '/' + row.id).then(res => {
          if (res.code === 0) {
            this.$message.success('重置密码成功')
          }
        })
      }).catch(() => {
        this.$message.info('已取消重置密码')
      })
    },
    // 分页获取用户信息
    currentChange (currentPage) {
      this.loading = !this.loading;
      this.page.currentPage = currentPage === undefined || currentPage === '' ? 1 : currentPage;
      this.$api.httpPost(this.$url.AuthorityUser.pageList, httpData(this.page)).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.records) {
              this.userList = res.data.records;
              this.page.totalSize = res.data.total
          } else {
              this.userList = []
          }
        }
        this.loading = !this.loading;
      }, () => {
        this.loading = !this.loading
      })
    },
    tagEnable (index, row) {
      if (row.account === 'admin') {
        this.$message.warning('禁止修改超级管理员状态')
      } else {
        const enable = row.enable === 1 ? 0 : 1;
        this.$api.httpGet(this.$url.AuthorityUser.enable + '/' + row.id + '/' + enable).then(res => {
          if (res.code === 0) {
            this.currentChange(this.page.currentPage)
          } else {
            this.$message(res.msg)
          }
        })
      }
    },
    closeRole () {
      this.selectRole = []
    },
    dialogAddRole () { // 添加或修改用户角色
      let obj = [];
      if (this.selectAddRoleValue.length > 0 && this.selectDiffRoleValue.length > 0) {
        for (let i = 0; i < this.selectAddRoleValue.length; i++) { // 新增的角色
          this.selectRole = this.selectRole.filter(item => {
            return item !== this.selectAddRoleValue[i].roleId
          })
        }
        for (let i = 0; i < this.selectRole.length; i++) { // 取消的角色
          this.selectDiffRoleValue = this.selectDiffRoleValue.filter(item => {
            return item.roleId !== this.selectRole[i]
          })
        }
        let addRole = this.diffRole(this.selectRole, 1, true);
        let diffRole = this.diffRole(this.selectDiffRoleValue, 0, false);
        if (addRole && addRole.length > 0) {
          obj = obj.concat(addRole)
        }
        if (diffRole && diffRole.length > 0) {
          obj = obj.concat(diffRole)
        }
      } else {
        obj = obj.concat(this.diffRole(this.selectRole, 1, true))
      }
      this.$api.httpPost(this.$url.AuthorityUserRole.update, { userId: this.userId, roleId: obj }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: '成功',
            message: '更新角色成功',
            duration: 2000,
            type: 'success'
          })
        }
      })
    },
    diffRole (role, checked, isArr) {
      if (role && role.length > 0) {
        let arr = [];
        for (let i = 0; i < role.length; i++) {
          if (isArr) {
            arr.push({ checked: checked, roleId: role[i] })
          } else {
            arr.push({ checked: checked, roleId: role[i].roleId })
          }
        }
        return arr
      }
    }
  }
}
</script>

<style lang="scss">
  .sys-user {
    .user-main {
      overflow: hidden;
    }
    .el-dialog__body {
      padding: 30px 80px;
    }
    .el-pagination {
      margin-top: 30px;
      float: right;
    }
    .el-select{
      width: 100%;
    }
    .el-tag{
      cursor: pointer;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
</style>
