<template>
    <el-submenu :index="item.id + ''" :key="item.id" v-if="item && item.children">
        <template slot="title">
            <i :class="item.icon ? item.icon : 'el-icon-location'"></i>
            <span slot="title">{{ item.name }}</span>
        </template>
        <sidebar-item v-for="child in item.children" :key="child.id" :item="child"></sidebar-item>
    </el-submenu>
    <el-menu-item :index="item.path + '/' + url(item.component)" class="single" :key="item.id" v-else>
        <i :class="item.icon ? item.icon : 'el-icon-setting'"></i>
        <span slot="title">{{ item.name }}</span>
    </el-menu-item>
</template>

<script>
    export default {
        name: "SidebarItem",
        props: {
            item: Object
        },
        methods: {
            url(str) {
                return this.$common.toLine(str)
            }
        }
    }
</script>

<style scoped>

</style>
