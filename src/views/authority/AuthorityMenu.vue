<template>
  <div class="sys-tree vue-padding" :style="{ 'max-height': maxHeight+'px'}">
    <div class="tips">{{$route.name}}</div>
    <div class="tree-btn">
      <div style="float: left;width: 60%">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      </div>
      <div style="float: right">
        <el-button type="primary" icon="el-icon-edit" @click="() => appendNode()">添加一级菜单</el-button>
      </div>
    </div>
    <div class="tree-content">
      <div class="custom-tree-container">
        <div class="block">
          <p style="margin-bottom: 10px">资源路径树结构&nbsp;&nbsp;<span style="color: #F56C6C;font-size: 14px">
            操作说明：先勾选左边的菜单(单个子节点)，然后选择右边的权限地址</span></p>
          <div class="line"></div>
          <el-row>
            <el-col :span="12">
              <vue-scroll>
                <el-tree :data="menuList" :show-checkbox="true" node-key="id" default-expand-all :expand-on-click-node="false"
                         :filter-node-method="filterNode" ref="tree" :props="defaultProps" :check-on-click-node="false" draggable
                         @check="checkNodeMenu" @node-drop="menuNodeDrop" @node-click="nodeClick" :style="{ 'max-height': treeHeight+'px' }">
                  <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="showTree = data.id" @mouseleave="showTree = 0">
                    <template v-if="data.icon == undefined || data.icon == ''">
                      <i class="iconfont icon-icon_zhanghao"></i>
                    </template>
                    <template v-else>
                      <i :class="data.icon"></i>
                    </template>
                    <span>{{ data.name }}</span>
                    <span v-show="data.id === showTree">
                      <span class="el-icon-circle-plus btn" @click.prevent.stop="() => append(data)"></span>
                      <span class="iconfont icon-bianjisekuai btn" @click.prevent.stop="() => modify(data)"></span>
                      <span class="iconfont icon-shanchusekuai btn" @click.prevent.stop="() => remove(node, data)"></span>
                    </span>
                  </span>
                </el-tree>
              </vue-scroll>
            </el-col>
            <el-col :span="12">
              <vue-scroll>
                <el-tree :data="urlList" :show-checkbox="true" node-key="id" default-expand-all :expand-on-click-node="false"
                         :filter-node-method="filterNode" ref="urlTree" :props="defaultPropsUrl" :check-on-click-node="false"
                         @check="checkNodeUrlCheck" :style="{ 'max-height': treeHeight+'px' }">
                  <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="urlTree = data.id" @mouseleave="urlTree = 0">
                    <span>{{ data.name }}</span>
                    <span v-if="data.id === urlTree"> / {{ data.url }}</span>
                  </span>
                </el-tree>
              </vue-scroll>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 添加路由弹框 -->
    <v-add-menu :dialogAddMenu="dialogAddMenu" :isMenuProp="isMenuProp" :nodeData="nodeData"
                :nodeSort="nodeSort" :nodeModify="nodeModify" v-on:closeDialogAddMenu="closeDialogAddMenu"
                v-on:addMenu="addMenu" v-on:updateMenu="updateMenu"></v-add-menu>
  </div>
</template>

<script>
import vAddMenu from '@/components/authority/menu/AddMenu'

export default {
  name: 'AuthorityMenu',
  components: { vAddMenu },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      filterText: '',
      menuList: [], // 菜单树结构
      urlList: [], // url 路径树结构
      maxHeight: this.$common.maxHeight,
      treeHeight: this.$common.menuTreeHeight,
      showTree: 0,
      urlTree: 0,
      defaultProps: {
        children: 'children',
        label: 'name' // 后端菜单名称不是 label 改成后端对应的名称
      },
      defaultPropsUrl: {
        children: 'children',
        label: 'url'
      },
      dialogAddMenu: false, // 是否显示添加菜单弹框
      isMenuProp: false, // 不同层级菜单校验字段不一致
      nodeData: {},
      node: '',
      nodeSort: 0,
      nodeModify: {},
      currentKey: Number,
      checkUrlList: []
    }
  },
  mounted () {
    this.$api.httpGet(this.$url.AuthorityMenu.load).then(res => {
      if (res.code === 0) {
        this.menuList = res.data
      }
    });
    this.$api.httpGet(this.$url.AuthorityMenuUrl.load).then(res => {
      if (res.code === 0) {
        this.urlList = res.data
      }
    })
  },
  methods: {
    append (data) { // 添加菜单
      this.isMenuProp = false; // 是否是添加一级菜单
      this.dialog(); // 开关添加菜单弹窗
      this.nodeData = data;
      this.nodeModify = {} // 用于修改菜单时给子路由传值
    },

    addMenu (menu) {
      if (this.isMenuProp) {
        this.menuList.push({ id: menu.id, name: menu.name, path: menu.path, icon: menu.icon, children: [] })
      } else {
        this.nodeData.children.push({ id: menu.id, name: menu.name, path: menu.path, icon: menu.icon, children: [] })
      }
    },

    updateMenu (menu) { // 暂时通过重新加载菜单的方式来显示修改状态
      this.nodeModify.name = menu.name;
      this.nodeModify.icon = menu.icon;
      this.nodeModify.component = menu.component;
      this.nodeModify.path = menu.path
    },

    modify (data) { // 修改菜单
      data && data.pid === 0 ? this.isMenuProp = true : this.isMenuProp = false
      this.dialog();
      this.nodeModify = data // 修改菜单信息数据
    },

    dialog () {
      this.dialogAddMenu = !this.dialogAddMenu
    },

    remove (node, data) { // 删除菜单
      this.$confirm(data.pid === 0 ? '删除所有子菜单吗？' : '是否删除该菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arr = [data.id];
        if (data.pid === 0) {
          this.delMenu(arr, data)
        }
        this.$api.httpPost(this.$url.AuthorityMenu.delete, { menuIdList: arr }).then(res => {
          if (res && res.code === 0) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.$message.success('删除成功!')
          }
        })
      }).catch(() => {
        this.$message.info('取消删除!')
      })
    },

    delMenu (arr, data) { // 递归将要删除的菜单及子菜单添加到数组中
      if (data) {
        for (let i = 0; i < data.children.length; i++) {
          arr.push(data.children[i].id);
          if (data.children[i].children.length > 0) {
            this.delMenu(data.children[i].children)
          }
        }
      }
    },

    filterNode (value, data) { // 菜单筛选
      if (!value) return true;
      return data.name.indexOf(value) !== -1
    },

    appendNode () { // 开启添加菜单弹框
      this.isMenuProp = true;
      this.nodeSort = this.menuList.length; // 如果是添加一级菜单则根据总的菜单个数计算 sort 的值
      this.dialog()
    },

    closeDialogAddMenu (dialogAddMenu) { // 关闭添加菜单弹框
      this.dialogAddMenu = dialogAddMenu
    },

    loadUrl (data, component) { // 点击菜单加载选中权限地址
      if (data) {
        let obj = [];
        let ent = this.$url[component];
        if (ent) {
          Object.keys(ent).forEach(k => {
            obj.push({ checked: 1, urlId: ent[k] })
          })
        }
        this.$api.httpPost(this.$url.AuthorityMenuUrl.loadUrl, { menuUrl: obj, menuId: data }).then(res => {
          if (res.code === 0) {
            this.$refs.urlTree.setCheckedKeys([]);
            let menuUrls = res.data.menuUrls;
            this.checkUrlList = menuUrls;
            if (menuUrls && menuUrls.length > 0) {
              let arr = [];
              for (let i = 0; i < menuUrls.length; i++) {
                arr.push(menuUrls[i].urlId)
              }
              this.$refs.urlTree.setCheckedKeys(arr)
            }
          }
        }).catch(err => {
          this.$message.error(err);
        })
      }
    },

    checkNode (data, currentKey) { // 修改为单选通用方法
      if (data.children.length > 0) {
        this.$refs.tree.setCheckedKeys([])
      } else {
        if (currentKey !== this.currentKey) {
          this.currentKey = currentKey;
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.tree.setCheckedKeys([currentKey]);
          this.loadUrl(currentKey, data.component)
        } else {
          this.currentKey = Number;
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.urlTree.setCheckedKeys([])
        }
      }
    },

    checkNodeMenu (data) { // 菜单复选框被点击事件
      this.checkNode(data, data.id)
    },

    nodeClick (data) { // 菜单节点被点击事件,禁用了点击选中功能，所以要自己手动设置选中
      this.checkNode(data, this.$refs.tree.getCurrentKey())
    },

    checkNodeUrlCheck (data) { // 权限地址点击事件
      const menu = this.$refs.tree.getCheckedNodes(true, false);
      if (!menu || menu.length <= 0) { // node.checkedNodes.length
        let check = this.$refs.urlTree.getCheckedKeys();
        if (check && check.length > 0) {
          this.$alert('请先勾选左侧的菜单', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              this.$refs.urlTree.setCheckedKeys([])
            }
          })
        }
      } else {
        let urlData = [];
        let menuData = [];
        let menuId = this.$refs.tree.getCheckedNodes(true, false)[0].id;
        let url = this.$refs.urlTree.getCheckedKeys(true, false);
        if (menuId && url) {
          if (this.checkUrlList.length <= 0) {
            let arr = [];
            for (let i = 0; i < url.length; i++) {
              arr.push({ checked: 1, urlId: url[i] })
            }
            menuData = arr
          } else {
            if (data && data.pid === 'null') {
              for (let i = 0; i < this.checkUrlList.length; i++) { // 将原来的菜单对象存到新的数组中，以实现不改变原来菜单
                urlData.push(this.checkUrlList[i])
              }
              for (let i = 0; i < url.length; i++) { // 将新存的原权限对象进行过滤，筛选已改变的权限
                urlData = urlData.filter(item => {
                  return item.urlId !== url[i]
                })
              }
              for (let i = 0; i < this.checkUrlList.length; i++) { // 新增加的权限
                url = url.filter(item => {
                  return item !== this.checkUrlList[i].urlId
                })
              }
              let urlNode = this.diffNode(url, 1, true); // 封装成后台接受的格式，这是新增的菜单
              let urlDataNode = this.diffNode(urlData, 0, false); // 封装成后台接受的格式，这是取消的菜单
              if (urlNode && urlNode.length > 0) {
                menuData = menuData.concat(urlNode)
              }
              if (urlDataNode && urlDataNode.length > 0) {
                menuData = menuData.concat(urlDataNode)
              }
            } else {
              let some = this.checkUrlList.some(k => {
                return k.urlId === data.id
              });
              menuData.push({ checked: some ? 0 : 1, urlId: data.id })
            }
          }
          this.$api.httpPost(this.$url.AuthorityMenuUrl.update, { menuUrl: menuData, menuId: menuId }).then(res => {
            if (res.code === 0) {
              this.loadUrl(menuId);
              this.$notify({
                title: '成功',
                message: '更新菜单权限成功',
                duration: 2000,
                type: 'success'
              })
            }
          })
        }
      }
    },

    diffNode (url, checked, isArr) { // 将菜单数据封装成后端接收的格式
      if (url && url.length > 0) {
        let arr = [];
        for (let i = 0; i < url.length; i++) {
          if (isArr) {
            arr.push({ checked: checked, urlId: url[i] })
          } else {
            arr.push({ checked: checked, urlId: url[i].urlId })
          }
        }
        return arr
      }
    },

    menuNodeDrop (before, after, inner) {
    }
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/tree';
</style>
