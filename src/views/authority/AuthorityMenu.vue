<template>
  <div class="sys-tree">
    <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
      <div class="el-left">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="appendNode">增加</el-button>
      </div>
      <!--<div class="el-right">
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
      </div>-->
    </div>
    <div class="vue-padding radius">
      <!--<div class="tips">{{$route.name}}</div>-->
      <el-table :data="menuList" v-loading="loading" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="菜单名称" sortable width="150"></el-table-column>
        <el-table-column prop="icon" label="图标" sortable width="100">
          <template slot-scope="scope">
            <span :class="scope.row.icon"></span>
          </template>
        </el-table-column>
        <el-table-column label="类型" sortable width="120">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.menuType === 0">目录</el-tag>
            <el-tag size="medium" v-if="scope.row.menuType === 1" type="success">菜单</el-tag>
            <el-tag size="medium" v-if="scope.row.menuType === 2" type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="路径" :show-overflow-tooltip="true" sortable width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.path && scope.row.component">{{scope.row.path + '/' + url(scope.row.component)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="路由名称" prop="component" :show-overflow-tooltip="true" sortable width="180">
        </el-table-column>
        <el-table-column prop="enabled" label="可见" sortable width="100">
          <template slot-scope="scope">
            <el-tag size="medium" @click="tagEnabled(scope.$index, scope.row)" :type="String(scope.row.enabled) === '1' ? 'success' : 'warning'">
              {{String(scope.row.enabled) === '1' ? '可见' : '隐藏'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" sortable width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable width="160"></el-table-column>
        <el-table-column label="操作" fixed="right" width="260">
          <template slot-scope="scope">
            <el-button size="mini" @click="modify(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="append(scope.row)">增加</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加路由弹框 -->
      <v-add-menu :dialogAddMenu="dialogAddMenu" :isMenuProp="isMenuProp" :nodeData="nodeData" :menuList="addMenuList"
                  v-on:closeDialogAddMenu="closeDialogAddMenu" v-on:updateMenu="updateMenu" :addOrEdit="addOrEdit"></v-add-menu>
    </div>
  </div>
</template>

<script>
import vAddMenu from '@/components/authority/menu/AddMenu'
import lineUtil from '@/utils/humpToLine'

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
      addMenuList: [{ id: '0', label: '主目录', children: []}],
      loading: false,
      urlList: [], // url 路径树结构
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
      nodeData: {
        component: '',
        enabled: '',
        icon: '',
        id: '',
        label: '',
        menuType: '',
        name: '',
        path: '',
        pid: '',
        sort: '',
        authority: ''
      },
      node: '',
      addOrEdit: false,
      currentKey: Number,
      checkUrlList: []
    }
  },
  mounted () {
    this.loadMenu()
  },
  computed: {
    treeHeight () {
      let store = this.$store.state;
      return store.tagsTop ? store.innerHeight - this.$common.menuTreeHeight - 50 : store.innerHeight - this.$common.menuTreeHeight;
    }
  },
  methods: {
    loadMenu() {
      this.loading = true
      this.$api.request(this.$url.AuthorityMenu.load).then(res => {
        if (res.code === 0) {
          this.menuList = res.data
          this.addMenuList[0].children = res.data
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    url (str) {
      return lineUtil.line(str)
    },
    append (data) { // 添加菜单
      this.addOrEdit = true
      Object.keys(this.nodeData).forEach(key => {
        if (key === 'enabled' || key === 'menuType') {
          this.nodeData[key] = '1'
        } else {
          if (key === 'id') {
            this.nodeData[key] = data[key]
          } else {
            this.nodeData[key] = ''
          }
        }
      })
      let children = data.children
      this.nodeData.sort = children && children.length > 0 ? children.length + 1 : 0;
      this.dialog()
    },

    keysNode (data) {
      Object.keys(this.nodeData).forEach(key => {
        if (key !== 'children' && key !== 'meta') {
          if (key === 'enabled' || key === 'menuType') {
            this.nodeData[key] = String(data[key])
          } else {
            this.nodeData[key] = data[key]
          }
        }
      })
    },

    tagEnabled (index, row) {
      let enabled = String(row.enabled) === '1' ? '0' : '1';
      let text = enabled === '1' ? '显示' : '隐藏'
      this.$confirm(String(row.pid) === '0' ? '确定'+text+'所有子菜单吗？' : '确定'+text+'该菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let array = [row.id]
        if (String(row.pid) === '0') {
          this.delMenu(array, row)
        }
        let obj = { enabled: enabled, menuIdList: array}
        this.$api.request(this.$url.AuthorityMenu.updateInList, this.$method.put, obj).then(res => {
          if (res.code === 0) {
            this.$message.success('菜单状态更新成功')
            this.loadMenu()
          }
        }).catch(() => {
          this.$message.success('菜单状态更新失败')
        })
      })
    },

    updateMenu (tips) { // 暂时通过重新加载菜单的方式来显示修改状态
      this.$message.success(tips)
      this.loadMenu()
    },

    modify (data) { // 修改菜单
      this.addOrEdit = false
      this.keysNode(data)
      this.dialog();
    },

    dialog () {
      this.dialogAddMenu = !this.dialogAddMenu
    },

    remove (data) { // 删除菜单
      this.$confirm(String(data.pid) === '0' ? '删除所有子菜单吗？' : '是否删除该菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let array = [data.id]
        if (String(data.pid) === '0') {
          this.delMenu(array, data)
        }
        this.$api.request(this.$url.AuthorityMenu.delete, this.$method.delete, {menuIdList: array}).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功!')
            this.loadMenu()
          }
        })
      }).catch(() => {
        this.$message.info('取消删除!')
      })
    },

    delMenu (array, data) { // 递归将要删除的菜单及子菜单添加到数组中
      if (data && data.children) {
        for (let i = 0; i < data.children.length; i++) {
          array.push(data.children[i].id);
          let children = data.children[i]
          if (children.children && children.children.length > 0) {
            this.delMenu(children.children)
          }
        }
      }
    },

    filterNode (value, data) { // 菜单筛选
      if (!value) return true;
      return data.name.indexOf(value) !== -1
    },

    appendNode () { // 开启添加菜单弹框
      this.addOrEdit = true;
      this.nodeData.id = '0'
      this.nodeData.enabled = '1'
      this.nodeData.menuType = '0'
      this.nodeData.sort = this.menuList.length + 1
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
            let menuUrls = res.data;
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
    }
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/tree';
</style>
