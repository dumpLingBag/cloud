<template>
  <div class="AddMenu">
    <el-dialog :title="addOrEdit ? '添加菜单' : '修改菜单'" :visible.sync="dialogAddMenu" width="40%" :modal-append-to-body='true' @open="open"
               @closed="closed" :before-close="handleClose" :append-to-body="true">
      <el-form ref="menuData" :model="nodeData" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级菜单">
                <treeselect v-model="nodeData.id" :show-count="true" placeholder="请选择上级菜单" :options="menuList"></treeselect>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="nodeData.menuType" size="medium">
                <el-radio border label="0">目录</el-radio>
                <el-radio border label="1">菜单</el-radio>
                <el-radio border label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="nodeData.name" placeholder="菜单名称即菜单展示名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单排序" prop="sort">
              <el-input-number v-model="nodeData.sort" controls-position="right" @change="sortChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="nodeData.menuType === '1'">
            <el-form-item label="路由地址" :prop="isMenuProp ? '' : 'path'">
              <el-input v-model="nodeData.path" placeholder="路由文件所在目录"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="nodeData.menuType === '1'">
            <el-form-item label="路由名称" :prop="isMenuProp ? '' : 'component'">
              <el-input v-model="nodeData.component" placeholder="路由文件具体名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="nodeData.menuType === '1' || nodeData.menuType === '2'">
            <el-form-item label="权限标识" :prop="isMenuProp ? '' : 'authority'">
              <el-input v-model="nodeData.authority" placeholder="权限标识"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="nodeData.menuType !== '2'">
            <el-form-item label="菜单图标" :prop="isMenuProp ? 'icon' : ''">
              <el-popover placement="bottom-start" width="400" trigger="focus" popper-class="popper-icon" v-model="visible">
                <vue-scroll>
                  <ul class="icon-menu-list">
                    <li v-for="item in iconList" @click="addIcon(item.icon)" :key="item.id"><i :class="item.icon"></i></li>
                  </ul>
                </vue-scroll>
                <el-input v-model="nodeData.icon" :prefix-icon="nodeData.icon" slot="reference" @click="visible = !visible" placeholder="菜单展示图标"></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="nodeData.menuType !== '2'">
            <el-form-item label="菜单状态" prop="menuType">
              <el-radio-group v-model="nodeData.enabled" size="medium">
                <el-radio border label="1">显示</el-radio>
                <el-radio border label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogAddMenu">取 消</el-button>
        <el-button type="primary" @click="addMenu('menuData')">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'AddMenu',
  components: { Treeselect },
  data () {
    return {
      menu: {},
      topMenu: null,
      visible: false,
      iconList: [],
      rules: {
        name: [
          { required: true, message: '菜单只能是中文或英文名称', target: 'blur', pattern: '^[\u4e00-\u9fa5a-zA-Z]+$' }
        ],
        path: [
          { required: true, message: '菜单路径以/开头后面匹配英文', target: 'blur', pattern: '^[/][a-zA-Z/]+$' }
        ],
        component: [
          { required: true, message: '请输入菜单路由', target: 'blur', pattern: '^[A-Z][a-zA-Z]' }
        ],
        icon: [
          { required: true, message: '请选择菜单图标', target: 'blur' }
        ],
        authority: [
          { required: true, message: '请输入权限标识', target: 'blur' }
        ]
      }
    }
  },
  props: {
    dialogAddMenu: Boolean,
    isMenuProp: Boolean,
    nodeData: Object,
    addOrEdit: Boolean,
    menuList: Array
  },
  methods: {
    handleClose () {
      this.closeDialogAddMenu()
    },

    closeDialogAddMenu () {
      this.$emit('closeDialogAddMenu', false)
    },

    addMenu (menu) {
      this.$refs[menu].validate((valid) => {
        if (valid) {
          let url = this.$url.AuthorityMenu.update
          if (this.addOrEdit) { // 添加菜单
            this.nodeData.pid = this.nodeData.id
            this.nodeData.id = ''
            url = this.$url.AuthorityMenu.save
          }
          this.$api.request(url, this.addOrEdit ? this.$method.post : this.$method.put, this.nodeData).then(res => {
            if (res.code === 0) {
              this.$emit('updateMenu', this.addOrEdit ? '添加菜单成功' : '更新菜单成功')
              this.closeDialogAddMenu()
            }
          }).catch(() => {
            this.$message.warning(this.nodeData.id ? '菜单更新失败' : '菜单添加失败')
          })
        } else {
          return false
        }
      })
    },

    open () {
      this.clearVal('menuData')
    },

    closed () {
      Object.keys(this.menu).forEach(key => {
        this.menu[key] = ''
      })
    },

    addIcon (icon) {
      this.visible = !this.visible;
      this.nodeData.icon = icon
    },

    clearVal (formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  },
  mounted () {
    this.$api.request(this.$url.IconList.loadIcon).then(res => {
      this.iconList = res.data
    })
  }
}
</script>

<style lang="scss">
  .vue-treeselect__placeholder {
    line-height: 40px;
    padding: 0 10px;
  }
  .vue-treeselect__single-value {
    padding: 0 10px;
    line-height: 40px;
  }
</style>
