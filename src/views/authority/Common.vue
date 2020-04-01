<template>
    <div class="sys-tree vue-padding radius">
        <div class="tips">{{$route.name}}</div>
        <div class="tree-btn">
            <div style="float: left;width: 60%">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            </div>
        </div>
        <div class="tree-content">
            <div class="custom-tree-container">
                <div class="block">
                    <vue-scroll>
                        <el-tree :data="urlList" :show-checkbox="true" node-key="id" :expand-on-click-node="false"
                                 :filter-node-method="filterNode" ref="urlTree" :props="defaultProps"
                                 :check-on-click-node="false"
                                 @check="checkNodeUrlCheck" :style="{ 'max-height': treeHeight+'px' }">
                  <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="commonUrlTree = data.id"
                        @mouseleave="commonUrlTree = 0">
                    <span>{{ data.name }}</span>
                    <span v-if="commonUrlTree === data.id"> / {{ data.url }}</span>
                  </span>
                        </el-tree>
                    </vue-scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AuthorityCommon',
        watch: {
            filterText(val) {
                this.$refs.urlTree.filter(val)
            }
        },
        data() {
            return {
                filterText: '',
                urlList: [],
                openUrl: [],
                openDiffUrl: [],
                commonUrlTree: 0,
                defaultProps: {
                    children: 'children',
                    label: 'name' // 后端菜单名称不是 label 改成后端对应的名称
                }
            }
        },
        mounted() {
            this.$api.request(this.$url.AuthorityCommonUrl.load, this.$method.get).then(res => {
                if (res.code === 0) {
                    this.urlList = res.data
                }
            });
            this.loadOpen()
        },
        computed: {
            treeHeight() {
                let store = this.$store.state;
                return store.tagsTop ? store.innerHeight - this.$common.treeHeight - 45 : store.innerHeight - this.$common.treeHeight;
            }
        },
        methods: {
            loadOpen() {
                this.$api.request(this.$url.AuthorityCommonUrl.loadOpen, this.$method.get).then(res => {
                    if (res.code === 0) {
                        this.openUrl = res.data;
                        this.openDiffUrl = res.data;
                        this.$refs.urlTree.setCheckedKeys([]);
                        if (res.data.length > 0) {
                            let arr = [];
                            for (let i = 0; i < res.data.length; i++) {
                                arr.push(res.data[i].id)
                            }
                            this.$refs.urlTree.setCheckedKeys(arr)
                        }
                    }
                })
            },
            filterNode(value, data) { // 菜单筛选
                if (!value) return true;
                return data.name.indexOf(value) !== -1
            },
            checkNodeUrlCheck() {
                let obj = [];
                let url = this.$refs.urlTree.getCheckedNodes(true, false);
                if (url) {
                    if (this.openUrl.length <= 0) {
                        obj = obj.concat(this.diffNode(url, 1))
                    } else {
                        for (let i = 0; i < url.length; i++) { // 筛选改变的权限
                            this.openUrl = this.openUrl.filter(item => {
                                return url[i].id !== item.id
                            })
                        }
                        for (let i = 0; i < this.openDiffUrl.length; i++) { // 新增加的权限
                            url = url.filter(item => {
                                return this.openDiffUrl[i].id !== item.id
                            })
                        }
                        let diffUrl = this.diffNode(this.openUrl, 0);
                        let addUrl = this.diffNode(url, 1);
                        if (diffUrl && diffUrl.length > 0) {
                            obj = obj.concat(diffUrl)
                        }
                        if (addUrl && addUrl.length > 0) {
                            obj = obj.concat(addUrl)
                        }
                    }
                }
                this.$api.request(this.$url.AuthorityCommonUrl.update, this.$method.put, {urlId: obj}).then(res => {
                    if (res.code === 0) {
                        this.loadOpen();
                        this.$notify({
                            title: '成功',
                            message: '更新菜单权限成功',
                            duration: 2000,
                            type: 'success'
                        })
                    }
                })
            },
            diffNode(data, common) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i].common = common
                    }
                    return data
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '~@/assets/scss/tree';
</style>
