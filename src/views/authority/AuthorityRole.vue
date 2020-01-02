<template>
    <div class="sys-tree">
      <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
        <div class="el-left">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="appendRole">增加</el-button>
        </div>
      </div>
      <div class="vue-padding radius">
        <el-table :data="roleList" v-loading="loading" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="角色名称" sortable></el-table-column>
          <el-table-column prop="sort" label="角色排序" sortable></el-table-column>
          <el-table-column prop="enabled" label="状态" sortable></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="modify(scope.row)">编辑</el-button>
              <el-button size="mini" type="primary" @click="append(scope.row)">增加</el-button>
              <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="roleStatus ? '添加角色' : '修改角色'" :visible.sync="dialogRole" width="50%" :modal-append-to-body='true'
          :append-to-body="true">
        <el-form ref="roleData" :model="roleData" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级菜单">
                <treeselect v-model="roleData.id" :show-count="true" placeholder="请选择上级菜单" :options="roleListDialog"></treeselect>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="roleData.name" placeholder="菜单名称即菜单展示名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单状态" prop="enabled">
                <el-radio-group v-model="roleData.enabled" size="medium">
                  <el-radio border label="1">显示</el-radio>
                  <el-radio border label="0">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单排序" prop="sort">
                <el-input-number v-model="roleData.sort" controls-position="right" @change="sortChange" :min="1" :max="10"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRole = false">取 消</el-button>
          <el-button type="primary" @click="addRole('menuData')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'AuthorityRole',
  components: { Treeselect },
  data () {
    return {
      loading: false,
      dialogRole: false,
      roleStatus: false,
      roleData: {
        id: '',
        name: '',
        enabled: '',
        sort: '',
        createTime: ''
      },
      roleList: [],
      roleListDialog: [],
      rules: {

      }
    }
  },
  mounted () {
    // 加载角色信息
    this.loading = true
    this.$api.request(this.$url.AuthorityRole.load, this.$method.get).then(res => {
      if (res.code === 0) {
        this.roleList = res.data
      }
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },
  computed: {

  },
  methods: {
    appendRole () {
      this.dialogRole = true
      this.roleStatus = true
    },
    modify (data) {
      this.roleStatus = false
    },
    append (data) {
      this.roleStatus = true
    },
    remove (data) {

    },
    addRole (role) {
      this.$refs[role].validate((valid) => {
        if (valid) {
          this.$api.request(this.$url)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
    @import '~@/assets/scss/tree';
</style>
