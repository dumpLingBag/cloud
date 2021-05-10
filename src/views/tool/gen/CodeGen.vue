<template>
    <div class="code-gen">
        <search
            :search="search"
            :modelData="modelData"
            @importGen="importGen"
            @submitSearch="submitSearch"
            @resetSearch="resetSearch"
            @removeChange="removeGen"
            @generator="generator"
        />
        代码生成
    </div>
</template>

<script>
import Search from '@/components/search/Index'

export default {
    name: "CodeGen",
    components: {
        Search
    },
    data() {
        return {
            search: {
                typeSearch: [
                    {
                        label: '表名称',
                        name: 'tableName'
                    },
                    {
                        label: '表描述',
                        name: 'tableComment'
                    },
                    {
                        label: '创建时间',
                        name: 'createTime',
                        type: 'date'
                    }
                ],
                btnSearch: [
                    /*{
                        btnType: this.$btnType.SAVE,
                        hasPerm: ['sys:quartz:add'],
                        name: '增加'
                    },*/
                    {
                        btnType: {
                            type: 'primary',
                            icon: 'el-icon-download',
                            event: 'generator'
                        },
                        hasPerm: ['sys:gen:generator'],
                        name: '生成'
                    },
                    {
                        btnType: {
                            type: 'info',
                            icon: 'el-icon-upload',
                            event: 'importGen'
                        },
                        hasPerm: ['sys:gen:import'],
                        name: '导入'
                    },
                    {
                        btnType: this.$btnType.REMOVE,
                        hasPerm: ['sys:gen:delete'],
                        name: '删除'
                    }
                ]
            },
            modelData: {}
        }
    },
    mounted() {

    },
    methods: {
        /**
         * 导入数据库表
         * */
        importGen() {

        },

        /**
         * 提交
         * */
        submitSearch() {

        },

        /**
         * 重置搜索
         * */
        resetSearch() {

        },

        /**
         * 删除代码
         * */
        removeGen() {

        },

        /**
         * 生成代码
         */
        generator() {

        }
    }
}
</script>

<style scoped lang="scss">
.code-gen {

}
</style>
