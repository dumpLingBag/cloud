<template>
  <div class="AddMenu">
    <el-dialog :title="addOrEdit ? '添加菜单' : '修改菜单'" :visible.sync="dialogAddMenu" width="40%" :modal-append-to-body='false' @open="open"
               @closed="closed" :before-close="handleClose" :append-to-body="true">
      <el-form ref="menu" :model="menu" :rules="rules" label-width="80px">
        <el-form-item label="上级菜单">
            <treeselect v-model="menu.id" :show-count="true" placeholder="请选择上级菜单" :options="menuList"></treeselect>
          <!--<el-input :placeholder="topMenu" @focus="show" @blur="hide" v-model="filterText"></el-input>-->
<!--          <div class="tree-border">-->

<!--            <vue-scroll>-->

<!--              <el-tree class="filter-tree" :data="menuList" :props="defaultProps" style="max-height: 200px"-->
<!--                       :filter-node-method="filterNode" ref="tree">-->
<!--              </el-tree>-->
<!--            </vue-scroll>-->
<!--          </div>-->
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menu.menuType" size="medium">
            <el-radio border label="0">目录</el-radio>
            <el-radio border label="1">菜单</el-radio>
            <el-radio border label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" placeholder="菜单名称即菜单展示名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" :prop="isMenuProp ? '' : 'path'">
          <el-input v-model="menu.path" placeholder="菜单文件所在目录"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" :prop="isMenuProp ? '' : 'component'">
          <el-input v-model="menu.component" placeholder="菜单文件具体文件名"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" :prop="isMenuProp ? 'icon' : ''">
          <template v-if="isMenuProp">
            <el-popover placement="bottom-start" width="400" trigger="focus" popper-class="popper-icon" v-model="visible">
              <vue-scroll>
                <ul class="icon-list">
                  <li v-for="item in iconList" @click="addIcon(item.icon)" :key="item.id"><i :class="item.icon"></i></li>
                </ul>
              </vue-scroll>
              <el-input v-model="menu.icon" slot="reference" @click="visible = !visible" placeholder="菜单展示图标"></el-input>
            </el-popover>
          </template>
          <template v-else>
            <el-input v-model="menu.icon" :disabled="true" placeholder="菜单展示图标"></el-input>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogAddMenu">取 消</el-button>
        <el-button type="primary" @click="addMenu('menu')">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'AddMenu',
  // watch: {
  //   filterText(val) {
  //     this.$nextTick(() => {
  //       this.$refs.tree.filter(val);
  //     })
  //   }
  // },
  components: { Treeselect },
  data () {
    return {
      // 暂时没有数据
      menu: {
        name: '',
        path: '',
        component: '',
        icon: ''
      },
      topMenu: null,
      visible: false,
      iconList: [],
      filterText: '',
      showTree: false,
      defaultProps: {
        children: 'children',
        label: 'name' // 后端菜单名称不是 label 改成后端对应的名称
      },
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
        ]
      }
    }
  },
  props: {
    dialogAddMenu: Boolean,
    isMenuProp: Boolean,
    nodeData: Object,
    nodeSort: Number,
    nodeModify: Object,
    addOrEdit: Boolean,
    menuList: Array
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    show() {
      // if (this.nodeData.component) {
      //   this.topMenu = this.nodeData.name
      // }
      // this.filterText = ''
      this.showTree = true
    },
    hide() {
      // if (!this.nodeData.component) {
      //   this.topMenu = '主目录'
      //   this.filterText = '主目录'
      // } else {
      //   this.filterText = this.nodeData.name
      // }
      this.showTree = false
    },
    handleClose () {
      this.closeDialogAddMenu()
    },

    closeDialogAddMenu () {
      //this.clearVal('menu');
      this.$emit('closeDialogAddMenu', false)
    },

    addMenu (menu) {
      this.$refs[menu].validate((valid) => {
        if (valid) {
          let url = '';
          if (this.isMenuProp) {
            if (this.nodeModify.id) {
              url = this.$url.AuthorityMenu.update;
              this.menuUpdate()
            } else {
              this.menu.sort = this.nodeSort;
              this.menu.pid = 0;
              url = this.$url.AuthorityMenu.save
            }
          } else {
            if (this.nodeModify.id) {
              url = this.$url.AuthorityMenu.update;
              this.menu.icon = 'iconfont icon-xingzhuang-tuoyuanxing';
              this.menuUpdate()
            } else {
              url = this.$url.AuthorityMenu.save;
              this.menu.pid = this.nodeData.id;
              this.menu.icon = 'iconfont icon-xingzhuang-tuoyuanxing';
              const len = this.nodeData.children.length;
              this.menu.sort = len && len > 0 ? len : 0
            }
          }
          this.$api.httpPost(url, this.menu).then(res => {
            if (res.code === 0) {
              if (this.nodeModify.id) {
                this.$emit('updateMenu', this.menu)
              } else {
                this.$emit('addMenu', this.menu)
              }
              this.closeDialogAddMenu()
            }
          }).catch(() => {
            this.$message.warning(this.nodeModify.id ? '菜单更新失败' : '菜单添加失败')
          })
        } else {
          return false
        }
      })
    },

    menuUpdate () {
      this.menu.id = this.nodeModify.id;
      this.menu.pid = this.nodeModify.pid;
      this.menu.sort = this.nodeModify.sort
    },

    open () {
        console.log('menu', this.menuList)
      console.log('node', this.nodeData)
      if (this.nodeData.id) {
        if (this.nodeData.component) {
          this.filterText = this.nodeData.name
        } else {
          this.filterText = '主目录'
        }
        this.topMenu = this.nodeData.id
      }
      // if (this.nodeModify.id) {
      //   this.menu.icon = this.nodeModify.icon;
      //   this.menu.path = this.nodeModify.path;
      //   this.menu.name = this.nodeModify.name;
      //   this.menu.component = this.nodeModify.component;
      //   this.menu.id = this.nodeModify.id
      // }
      //this.clearVal('menu')
      /*try {
        this.clearVal('menu')
      } catch (e) {
      }*/
    },

    closed () {
      Object.keys(this.menu).forEach(key => {
        this.menu[key] = ''
      })
    },

    addIcon (icon) {
      this.visible = !this.visible;
      this.menu.icon = icon
    },

    clearVal (formName) {
      this.$refs[formName].clearValidate()
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
  /*.tree-border {*/
  /*  border: 1px solid #DCDFE6;*/
  /*  border-top: none;*/
  /*  padding: 10px 0;*/
  /*  position: absolute;*/
  /*  background: #ffffff;*/
  /*  z-index: 999;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  border-radius: 0 0 4px 4px;*/
  /*}*/
</style>
