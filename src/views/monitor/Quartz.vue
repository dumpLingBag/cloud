<template>
    <div class="quartz">
        <Search
            :search="search"
            :modelData="modelData"
            @saveChange="addJob"
            @submitSearch="onSubmit"
            @resetSearch="resetSearch"
        />
    </div>
</template>

<script>
import Search from '@/components/search/Index'
export default {
    name: "Quartz",
    components: {
        Search
    },
    data() {
        return {
            search: {
                typeSearch: [
                    {
                        label: '任务名称',
                        name: 'jobName'
                    },
                    {
                        label: '任务组名',
                        name: 'jobNameGroup'
                    },
                    {
                        label: '任务状态',
                        name: 'status',
                        dictType: 'sys_quartz_status',
                        type: 'select'
                    }
                ],
                btnSearch: [
                    {
                        btnType: this.$btnType.SAVE,
                        hasPerm: ['sys:quartz:add'],
                        name: '增加'
                    },
                    {
                        btnType: this.$btnType.REMOVE,
                        hasPerm: ['sys:quartz:delete'],
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
        addJob() {

        },

        resetSearch() {

        },

        onSubmit() {

        }
    }
}
</script>

<style scoped lang="scss">
    .quartz {

    }
</style>
