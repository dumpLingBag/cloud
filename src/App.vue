<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>

    export default {
        name: "app",
        provide () {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        methods: {
            reload () {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            }
        }
    };
</script>

<style lang="scss">
    html, body {
        margin: 0;
        height: 100%;
    }

    ul, li, p, h1, h2, h3, h4, h5, h6, dl, dt, dd, button, textarea, input {
        margin: 0;
        padding: 0;
        list-style: none;
        border: none;
        outline: none;
    }

    a {
        text-decoration: none;
    }

    i {
        font-style: normal;
    }

    s {
        text-decoration: none;
    }

    #app {
        height: 100%;
        width: 100%;
        background-color: #f2f2f2;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
        font-size: 14px;
    }

    .vue-padding {
        border: none;
        padding: 20px;
        background-color: #fff;
    }

    .vue-top-padding {
        padding: 15px 20px;
        background-color: #fff;
        border-radius: 2px;
    }

    .tips {
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 20px;
        color: #909399;
        font-size: 24px;
        font-weight: 600;
        background-color: #f4f4f5;
    }

    .el-input-height {
        input {
            height: 33px;
            line-height: 33px;
            width: 150px;
        }
    }

    .el-left {
        float: left;
    }

    .el-right {
        float: right;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px white inset;
    }

    .radius {
        background: #ffffff;
        border-radius: 0.3rem;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
        -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    }

    .el-tag {
        cursor: pointer;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .el-search {
        overflow: hidden;

        .el-form-item {
            margin-bottom: 0;
        }
    }

    .el-pagination {
        text-align: right;
        margin-top: 30px;
    }

    table thead tr th:first-child > .cell {
        padding-left: 14px;
    }
</style>
