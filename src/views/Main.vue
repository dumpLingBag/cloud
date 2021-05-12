<template>
    <div class="main-index vue-margin">
        <v-main-card :option="easyDataOption"></v-main-card>
        <v-main-chart></v-main-chart>
    </div>
</template>

<script>
import vMainCard from '@/components/main/MainCard'
import vMainChart from '@/components/main/MainChart'

export default {
    name: 'Main',
    components: {vMainCard, vMainChart},
    data() {
        return {
            easyDataOption: {
                span: 6,
                data: [
                    {
                        title: '分类统计',
                        subtitle: '实时',
                        count: 7993,
                        allCount: 10222,
                        text: '当前分类总记录数',
                        color: 'rgb(49, 180, 141)',
                        key: '类',
                        type: 'success'
                    },
                    {
                        title: '附件统计',
                        subtitle: '实时',
                        count: 3112,
                        allCount: 10222,
                        text: '当前上传的附件数',
                        color: 'rgb(56, 161, 242)',
                        key: '附',
                        type: 'primary'
                    },
                    {
                        title: '文章统计',
                        subtitle: '实时',
                        count: 908,
                        allCount: 10222,
                        text: '评论次数',
                        color: 'rgb(117, 56, 199)',
                        key: '评',
                        type: 'warning'
                    },
                    {
                        title: '新闻统计',
                        subtitle: '实时',
                        count: 908,
                        allCount: 10222,
                        text: '评论次数',
                        color: 'rgb(59, 103, 164)',
                        key: '新',
                        type: 'danger'
                    }
                ]
            }
        }
    }
}
</script>

<style lang="scss">
    @import '~@/assets/scss/data-tabs';

    .card-table {
        margin-bottom: 15px;
    }

    .card-table:last-child {
        margin-bottom: 0;
    }
</style>
