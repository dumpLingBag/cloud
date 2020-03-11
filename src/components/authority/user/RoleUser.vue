<template>
    <div class="role-user">
        <el-dialog title="角色信息" :visible.sync="dialogRole" width="30%" center :modal-append-to-body='true'
                   :append-to-body="true" @closed="closeRole">
            <el-select v-model="selectRole" multiple collapse-tags filterable placeholder="请选择角色">
                <el-option-group v-for="group in roleList" :key="group.id" :label="group.name">
                    <el-option v-for="item in group.children" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-option-group>
            </el-select>
            <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogRole">取 消</el-button>
        <el-button type="primary" @click="dialogAddRole">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "RoleUser",
        data() {
            return {}
        },
        props: {
            dialogRole: Boolean,
            selectRole: Array,
            roleList: Array
        },
        methods: {
            dialogAddRole() {
                this.$emit('dialogAddRole', this.selectRole)
            },
            closeDialogRole() {
                this.$emit('closeDialogRole', false)
            }
        }
    }
</script>

<style scoped>

</style>