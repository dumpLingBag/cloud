<template>
    <div class="sys-tree vue-padding radius" :style="{ 'max-height': maxHeight+'px'}">
      <div class="tips">{{$route.name}}</div>
      <div class="tree-btn">
        <div style="float: left;width: 60%">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        </div>
        <div style="float: right">
          <el-button type="primary" icon="el-icon-edit" @click="() => appendNode()">添加一级角色</el-button>
        </div>
      </div>
      <div class="tree-content">
        <div class="custom-tree-container">
          <div class="block">
            <p style="margin-bottom: 10px">资源路径树结构&nbsp;&nbsp;<span style="color: #F56C6C;font-size: 14px">
            操作说明：先勾选左边的角色(单个子节点)，然后选择右边的菜单地址</span></p>
            <div class="line"></div>
            <el-row>
              <el-col :span="12">
                <vue-scroll>
                  <el-tree :data="roleList" :show-checkbox="true" node-key="id" default-expand-all :expand-on-click-node="false"
                           :filter-node-method="filterNode" ref="roleTree" :props="defaultPropsRole" :check-on-click-node="false"
                           @check="checkNodeRole" @node-click="nodeClick" :style="{ 'max-height': treeHeight+'px' }">
                    <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="showTree = data.id" @mouseleave="showTree = 0">
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
                  <el-tree :data="menuList" :show-checkbox="true" node-key="id" default-expand-all :expand-on-click-node="false"
                           :filter-node-method="filterNode" ref="menuTree" :props="defaultPropsMenu" :check-on-click-node="false"
                           @check="checkNodeMenuCheck" :style="{ 'max-height': treeHeight+'px' }">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.name }}</span>
                  </span>
                  </el-tree>
                </vue-scroll>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'AuthorityRole',
  watch: {
    filterText (val) {
      this.$refs.roleTree.filter(val)
    }
  },
  data () {
    return {
      filterText: '',
      roleList: [],
      menuList: [],
      menuPidList: [], // 用来排除未全选状态下 PID 为 0 的节点
      maxHeight: this.$common.maxHeight,
      treeHeight: this.$common.treeHeight,
      currentKey: Number,
      checkMenuList: [],
      showTree: 0,
      defaultPropsRole: {
        children: 'children',
        label: 'name'
      },
      defaultPropsMenu: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted () {
    // 加载角色信息
    this.$api.httpGet(this.$url.AuthorityRole.load).then(res => {
      if (res.code === 0) {
        this.roleList = res.data
      }
    });
    // 加载菜单信息
    this.$api.httpGet(this.$url.AuthorityRoleMenu.load).then(res => {
      if (res.code === 0) {
        this.menuList = res.data
      }
    });
    // 加载要过滤的菜单
    this.$api.httpGet(this.$url.AuthorityMenu.loadByPid).then(res => {
      if (res.code === 0) {
        for (let i = 0; i < res.data.length; i++) {
          this.menuPidList.push(res.data[i].id)
        }
      }
    })
  },
  methods: {
    filterNode (value, data) { // 角色筛选
      if (!value) return true;
      return data.name.indexOf(value) !== -1
    },

    appendNode () { // 添加一级角色
      this.addRole()
    },

    checkNode (children, currentKey) { // 修改为单选通用方法
      if (children.length > 0) {
        this.$refs.roleTree.setCheckedKeys([])
      } else {
        if (currentKey !== this.currentKey) {
          this.currentKey = currentKey;
          this.$refs.roleTree.setCheckedKeys([]);
          this.$refs.roleTree.setCheckedKeys([currentKey]);
          this.loadMenu(currentKey)
        } else {
          this.currentKey = Number;
          this.$refs.roleTree.setCheckedKeys([]);
          this.$refs.menuTree.setCheckedKeys([])
        }
      }
    },

    loadMenu (data) { // 点击角色加载角色分配菜单
      if (data) {
        this.$api.httpGet(this.$url.AuthorityRoleMenu.loadMenu + '?roleId=' + data).then(res => {
          if (res.code === 0) {
            this.$refs.menuTree.setCheckedKeys([]); // 取消菜单的选中
            this.checkMenuList = res.data;
            if (res.data && res.data.length > 0) {
              let arr = [];
              for (let i = 0; i < res.data.length; i++) {
                arr.push(res.data[i].menuId)
              }
              for (let i = 0; i < this.menuPidList.length; i++) {
                arr = arr.filter(item => {
                  return item !== this.menuPidList[i]
                })
              }
              this.$refs.menuTree.setCheckedKeys(arr)
            }
          }
        }).catch(() => {
          this.checkMenuList = []
        })
      }
    },

    checkNodeRole (data) { // 角色复选框点击事件
      this.checkNode(data.children, data.id)
    },

    nodeClick (data) { // 角色节点被点击事件,禁用了点击选中功能，所以要自己手动设置选中
      this.checkNode(data.children, this.$refs.roleTree.getCurrentKey())
    },

    append (data) { // 添加角色
      if (data.pid !== 0) {
        this.$message.warning('角色最多添加两级')
      } else {
        this.addRole(data, false)
      }
    },

    modify (data) { // 修该角色
      this.addRole(data, true)
    },

    remove (node, data) { // 删除角色
      this.$confirm(data.pid === 0 ? '确定删除所有子角色吗？' : '是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arr = [data.id];
        if (data && data.pid === 0) {
          this.delRole(arr, data)
        }
        this.$api.httpPost(this.$url.AuthorityRole.delete, { roleIdList: arr }).then(res => {
          if (res.code === 0) {
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

    delRole (arr, data) {
      if (data) {
        for (let i = 0; i < data.children.length; i++) {
          arr.push(data.children[i].id);
          if (data.children[i].children.length > 0) {
            this.delRole(data.children[i].children)
          }
        }
      }
    },

    checkNodeMenuCheck (data) { // 为角色添加或取消菜单
      const role = this.$refs.roleTree.getCheckedNodes(true, false);
      if (!role || role.length <= 0) {
        let check = this.$refs.menuTree.getCheckedKeys();
        if (check && check.length > 0) {
          this.$alert('请先勾选左侧的菜单', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              this.$refs.menuTree.setCheckedKeys([])
            }
          })
        }
      } else {
        let roleId = this.$refs.roleTree.getCheckedNodes(true, false)[0].id;
        let menu = this.$refs.menuTree.getCheckedKeys(false);
        let menuPid = this.$refs.menuTree.getCheckedNodes(false, true)[0];
        if (roleId && menu) {
          let roleList = [];
          let menuList = [];
          if (this.checkMenuList.length <= 0) {
            let arr = [];
            for (let i = 0; i < menu.length; i++) {
              arr.push({ checked: 1, menuId: menu[i] })
            }
            roleList = arr
          } else {
            if (data && data.pid === 0) {
              for (let i = 0; i < this.checkMenuList.length; i++) { // 将原来的菜单对象存到新的数组中，以实现不改变原来菜单
                menuList.push(this.checkMenuList[i])
              }
              for (let i = 0; i < menu.length; i++) { // 将新存的原权限对象进行过滤，筛选已改变的权限
                menuList = menuList.filter(item => {
                  return item.menuId !== menu[i]
                })
              }
              for (let i = 0; i < this.checkMenuList.length; i++) { // 新增加的权限
                menu = menu.filter(item => {
                  return item !== this.checkMenuList[i].menuId
                })
              }
              let menuNode = this.diffNode(menu, 1, true); // 这是新增的菜单
              let menuListNode = this.diffNode(menuList, 0, false); // 这是取消的菜单
              if (menuNode && menuNode.length > 0) {
                roleList = roleList.concat(menuNode)
              }
              if (menuListNode && menuListNode.length > 0) {
                roleList = roleList.concat(menuListNode)
              }
            } else {
              roleList.push({ checked: 1, menuId: menuPid.id });
              let some = this.checkMenuList.some(k => { // 判断点击的菜单在原来选中的菜单中是否存在，true 存在 false 不存在
                return k.menuId === data.id
              });
              roleList.push({ checked: some ? 0 : 1, menuId: data.id }) // 存在则是禁用菜单，否则启用
            }
          }
          this.$api.httpPost(this.$url.AuthorityRoleMenu.update, { roleMenu: roleList, roleId: roleId }).then(res => {
            if (res.code === 0) {
              this.loadMenu(roleId);
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

    diffNode (menu, checked, isArr) {
      if (menu && menu.length > 0) {
        let arr = [];
        for (let i = 0; i < menu.length; i++) {
          if (isArr) {
            arr.push({ checked: checked, menuId: menu[i] })
          } else {
            arr.push({ checked: checked, menuId: menu[i].menuId })
          }
        }
        return arr
      }
    },

    addRole (data, boo) {
      this.$prompt('请输入角色名称', boo ? '编辑角色' : '添加角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: boo ? data.name : '新角色',
        inputValidator: res => {
          if (!res || res === '') {
            return '请输入角色名称'
          }
        }
      }).then(({ value }) => {
        if (value) {
          if (data) {
            if (boo) {
              data.name = value;
              this.$api.httpPost(this.$url.AuthorityRole.update, data).then(res => {
                if (res.code === 0) {
                  data.name = value;
                  this.$message.success('角色修改成功')
                }
              })
            } else {
              let role = { name: value };
              role.pid = data.id;
              role.sort = data.children && data.children.length > 0 ? data.children.length + 1 : 0;
              this.$api.httpPost(this.$url.AuthorityRole.save, role).then(res => {
                if (res.code === 0) {
                  data.children.push({ id: res.data, name: value, pid: 0, sort: role.sort, children: [] });
                  this.$message.success('角色添加成功')
                }
              })
            }
          } else {
            let role = { pid: 0, name: value };
            role.sort = this.roleList.length > 0 ? this.roleList.length + 1 : 0;
            this.$api.httpPost(this.$url.AuthorityRole.save, role).then(res => {
              if (res.code === 0) {
                this.roleList.push({ id: res.data, name: value, pid: 0, sort: role.sort, children: [] });
                this.$message.success('角色添加成功')
              }
            })
          }
        }
      }).catch(() => {
        this.$message.info('取消输入')
      })
    }
  }
}
</script>

<style lang="scss">
    @import '~@/assets/scss/tree';
</style>
