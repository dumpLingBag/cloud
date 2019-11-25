<template>
  <div class="AddMenu">
    <el-dialog title="添加菜单" :visible.sync="dialogAddMenu" width="40%" :modal-append-to-body='false' @open="open"
               @closed="closed" :before-close="handleClose">
      <el-form ref="menu" :model="menu" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" placeholder="菜单名称即菜单展示名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" :prop="isMenuProp ? '' : 'path'">
          <el-input v-model="menu.path" placeholder="菜单文件所在目录"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" :prop="isMenuProp ? '' : 'component'">
          <el-input v-model="menu.component" placeholder="菜单文件具体文件名"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="isMenuProp" :prop="isMenuProp ? 'icon' : ''">
          <el-popover placement="bottom-start" width="400" trigger="focus" popper-class="popper-icon" v-model="visible">
            <vue-scroll>
              <ul class="icon-list">
                <li v-for="item in iconList" @click="addIcon(item.icon)" :key="item.id"><i :class="item.icon"></i></li>
              </ul>
            </vue-scroll>
            <el-input v-model="menu.icon" slot="reference" @click="visible = !visible" placeholder="菜单展示图标"></el-input>
          </el-popover>
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
export default {
  name: 'AddMenu',
  data () {
    return {
      // 暂时没有数据
      menu: {
        name: '',
        path: '',
        component: '',
        icon: ''
      },
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
        ]
      }
    }
  },
  props: {
    dialogAddMenu: Boolean,
    isMenuProp: Boolean,
    nodeData: Object,
    nodeSort: Number,
    nodeModify: Object
  },
  methods: {
    handleClose () {
      this.closeDialogAddMenu()
    },

    closeDialogAddMenu () {
      this.clearVal('menu');
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
      if (this.nodeModify.id) {
        this.menu.icon = this.nodeModify.icon;
        this.menu.path = this.nodeModify.path;
        this.menu.name = this.nodeModify.name;
        this.menu.component = this.nodeModify.component;
        this.menu.id = this.nodeModify.id
      }
      try {
        this.clearVal('menu')
      } catch (e) {
      }
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
    this.$api.httpGet(this.$url.IconList.loadIcon).then(res => {
      this.iconList = res.data
    })
  }
}
</script>

<style scoped>

</style>
