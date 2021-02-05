<template>
    <div>
        <!--面包屑-->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">
                    <i class="el-icon-lx-home"></i> 首页
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="display: flex;flex-direction: column;justify-content: space-between;">
            <div>
                <div class="handle-box" style="min-width: 762px;">
                    <el-button type="primary" icon="el-icon-delete" class="handle-del mr10"
                               @click="delAllSelection"
                               :disabled="!currentStatus">
                        批量删除
                    </el-button>
                    <!--级联查询-->
                    <el-cascader ref="cascaderConditions"
                                 class="handle-select mr10"
                                 :options="options"
                                 :props="props"
                                 placeholder="选择类别"
                                 collapse-tags
                                 clearable
                                 @change="choiceConditions">
                    </el-cascader>
                    <el-input v-model="searchInfo" placeholder="请输入用户名" class="handle-input mr10" clearable></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="openAddUser">添加</el-button>
                </div>
                <el-table :data="userTableData" border class="table"
                          ref="multipleTable" header-cell-class-name="table-header"
                          @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="id" label="序号" align="center" width="55">
                        <template scope="scope">
                            <span>{{(query.pageIndex - 1) * 7 + (scope.$index + 1)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                    <el-table-column label="性别" align="center">
                        <template slot-scope="scope">
                            {{scope.row.gender===1?'男':'女'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="权限" align="center">、
                        <template slot-scope="scope">
                            {{scope.row.role==='admin'?'管理员':'用户'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="注册时间" align="center">
                        <template slot-scope="scope">
                            {{$moment(scope.row.datetimes).format('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.logicRemove===1?'primary':(scope.row.logicRemove===0?'danger':'')">
                                {{scope.row.logicRemove===1?'活跃':'注销'}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit"
                                       @click="openModifyUser(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button type="text" icon="el-icon-delete"
                                       :class="scope.row.logicRemove === 0?'greg':'red'"
                                       v-if="scope.row.id != userId" :disabled="scope.row.logicRemove === 0"
                                       @click="openDeleteUser(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination1">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="query.pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 添加用户弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addUserModel" width="40%" :show-close="false"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" :ref="form" label-width="80px">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="role">
                    <el-select v-model="form.role" placeholder="请选权限" style="width: 100%;">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="用户" value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="form.gender" placeholder="请选性别" style="width: 100%;">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddUser">取 消</el-button>
                <el-button type="primary" @click="saveUser(form)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加用户弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addUserModel" width="40%" :show-close="false"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" :ref="form" label-width="80px">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="role">
                    <el-select v-model="form.role" placeholder="请选权限" style="width: 100%;">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="用户" value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="form.gender" placeholder="请选性别" style="width: 100%;">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddUser">取 消</el-button>
                <el-button type="primary" @click="saveUser(form)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户弹出框 -->
        <el-dialog title="修改用户" :visible.sync="modifyUserModel" width="40%" :show-close="false"
                   :close-on-click-modal="false">
            <el-form ref="modifyForm" :model="modifyForm" :rules="rules" :ref="modifyForm" label-width="80px">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="modifyForm.nickname" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="modifyForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="modifyForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="logicRemove">
                    <el-select v-model="modifyForm.logicRemove" placeholder="请选权限" style="width: 100%;">
                        <el-option label="活跃" :value="1"></el-option>
                        <el-option label="注销" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限" prop="role">
                    <el-select v-model="modifyForm.role" placeholder="请选权限" style="width: 100%;">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="用户" value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="modifyForm.gender" placeholder="请选性别" style="width: 100%;">
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册日期" prop="datetimes">
                    <el-input v-model="$moment(modifyForm.datetimes).format('YYYY-MM-DD')" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModifyUser">取 消</el-button>
                <el-button type="primary" @click="modifyUser()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        queryUserAllList, saveUser, queryUserById, modifyUser, queryUserPaging, removeUser, queryUserByFuzzy,
        queryUserByConditions, removeUserList
    } from '../../service/api';

    export default {
        name: 'UserManagement',
        //data用于存放数据或者变量
        data() {
            return {
                userId: 0,
                rules: {
                    nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    role: [{ required: true, message: '请选权限', trigger: 'blur', type: 'number' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                    logicRemove: [{ required: true, message: '请选状态', trigger: 'blur' }],
                    gender: [{ required: true, message: '请选性别', trigger: 'blur', type: 'number' }]
                },
                //分页 query
                query: {
                    //当前页 index
                    pageIndex: 1,
                    //每页的数量
                    pageSize: 10,
                    //总记录数
                    pageTotal: 0
                },
                //分页 user
                userTableData: [],
                //添加 user
                form: {
                    nickname: '',
                    username: '',
                    role: '',
                    gender: null
                },
                //修改 user
                modifyForm: {
                    id: 0,
                    nickname: '',
                    username: '',
                    password: '',
                    role: '',
                    gender: null,
                    logicRemove: null,
                    datetimes: null
                },
                // 添加用户 Model
                addUserModel: false,
                // 修改用户 Model
                modifyUserModel: false,
                //搜索用户信息
                searchInfo: '',
                //类别
                category: '',
                multipleSelection: [],
                delList: [],
                editVisible: false,
                idx: -1,
                id: -1,
                //级联多选
                props: { multiple: true },
                //级联选择器
                options: [
                    {
                        value: 'gender',
                        label: '性别',
                        children: [
                            { value: '1', label: '男', name: 'gender' },
                            { value: '0', label: '女', name: 'gender' }
                        ]
                    },
                    {
                        value: 'role',
                        label: '权限',
                        children: [
                            { value: 'admin', label: '管理员', name: 'role' },
                            { value: 'user', label: '用户', name: 'role' }
                        ]
                    },
                    {
                        value: 'logicRemove',
                        label: '状态',
                        children: [
                            { value: '1', label: '活跃', name: 'logicRemove' },
                            { value: '0', label: '注销', name: 'logicRemove' }
                        ]
                    }
                ],
                //批量删除状态
                currentStatus: false,
                //批量删除条数
                currentNum: 0
            };
        },
        //用于数据初始化
        created() {
            this.getQueryUserPaging(this.query.pageIndex);
            this.userId = this.$cookieStore.getCookie('id');
        },
        //用于存放所有的事件方法集合
        methods: {
            //搜索
            async doSearch() {
                let res = await queryUserByFuzzy({
                    username: this.searchInfo
                });
                this.userTableData = res.data.list;
                this.query.pageSize = res.data.pageSize;
                this.query.pageTotal = res.data.total;
            },
            // 查询用户 (分页)
            async getQueryUserPaging(pageIndex) {
                let res = await queryUserPaging({
                    pageNum: pageIndex,
                    pageSize: 7
                });
                this.userTableData = res.data.list;
                this.query.pageSize = res.data.pageSize;
                this.query.pageTotal = res.data.total;
            },
            // 获取用户信息List
            async getUserAllList() {
                let res = await queryUserAllList({});
                this.userTableData = res.data;
            },
            //open 添加用户 Model
            openAddUser() {
                this.addUserModel = true;
            },
            //确定添加用户
            async saveUser(form) {
                if (this.form.nickname !== '' &&
                    this.form.username !== '' &&
                    this.form.role !== '' &&
                    this.form.gender !== null) {
                    let res = await saveUser({
                        nickname: this.form.nickname,
                        username: this.form.username,
                        role: this.form.role,
                        gender: this.form.gender,
                        password:'1qaz!QAZ'
                    });
                    this.$refs[form].resetFields();
                    this.addUserModel = false;
                    this.getQueryUserPaging(this.query.pageIndex);
                    //添加user成功
                    if (res.data === 1) {
                        this.$message({
                            message: '恭喜你，添加用户成功',
                            type: 'success',
                            duration: 1500
                        });
                    } else {
                        //添加user失败
                        this.$message({
                            type: 'error',
                            message: '不好意思，添加用户失败',
                            duration: 1500
                        });
                    }
                } else {
                    this.$message({
                        message: '请将信息填写完整',
                        type: 'warning',
                        duration: 1500
                    });
                }
            },
            //关闭添加用户Model
            closeAddUser() {
                this.addUserModel = false;
                //取消添加用户
                this.$message({
                    type: 'info',
                    message: '已取消添加',
                    duration: 1500
                });
            },
            //open 修改用户 Model
            async openModifyUser(index, row) {
                let res = await queryUserById({
                    id: row.id
                });
                this.modifyForm.id = res.data.id;
                this.modifyForm.nickname = res.data.nickname;
                this.modifyForm.username = res.data.username;
                this.modifyForm.password = res.data.password;
                this.modifyForm.logicRemove = res.data.logicRemove;
                this.modifyForm.role = res.data.role;
                this.modifyForm.gender = res.data.gender;
                this.modifyForm.datetimes = res.data.datetimes;
                this.modifyUserModel = true;
            },
            //确定修改用户
            async modifyUser() {
                let res = await modifyUser({
                    id: this.modifyForm.id,
                    nickname: this.modifyForm.nickname,
                    username: this.modifyForm.username,
                    password: this.modifyForm.password,
                    role: this.modifyForm.role,
                    gender: this.modifyForm.gender,
                    logicRemove: this.modifyForm.logicRemove
                });
                this.modifyUserModel = false;
                this.getQueryUserPaging(this.query.pageIndex);
                //修改user成功
                if (res.data === 1) {
                    this.$message({
                        message: '恭喜你，修改用户成功',
                        type: 'success',
                        duration: 1500
                    });
                } else {
                    //修改user失败
                    this.$message({
                        type: 'error',
                        message: '不好意思，修改用户失败',
                        duration: 1500
                    });
                }
            },
            //关闭修改用户 Model
            closeModifyUser() {
                this.modifyUserModel = false;
                //取消修改用户
                this.$message({
                    type: 'info',
                    message: '已取消修改',
                    duration: 1500
                });
            },
            //open 删除用户 Model
            openDeleteUser(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除用户吗? 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 确定删除用户
                    this.deleteUser(row.id);
                }).catch(() => {
                    //取消删除用户
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1500
                    });
                });
            },
            //确定删除用户
            async deleteUser(id) {
                let res = await removeUser({
                    id: id
                });
                if (res.data === 1) {
                    this.$message({
                        type: 'success',
                        message: '删除用户成功',
                        duration: 1500
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除用户失败',
                        duration: 1500
                    });
                }
                this.getQueryUserPaging(this.query.pageIndex);
            },
            // 分页导航
            handlePageChange(val) {
                // this.$set(this.query, 'pageIndex', val);
                this.query.pageIndex = val;
                this.getQueryUserPaging(val);
            },
            //级联选择器
            async choiceConditions() {
                let checkedNodes = this.$refs['cascaderConditions'].getCheckedNodes();
                let genderArr = [];
                let roleArr = [];
                let logicRemoveArr = [];
                //得到级联选择值
                for (let node of checkedNodes) {
                    if (node.hasChildren === false) {
                        //判断选择的属性为性别
                        if (node.data.name === 'gender') {
                            genderArr.push(node.data.value);
                        }
                        //判断选择的属性为权限
                        if (node.data.name === 'role') {
                            roleArr.push(node.data.value);
                        }
                        //判断选择的属性为逻辑删除
                        if (node.data.name === 'logicRemove') {
                            logicRemoveArr.push(node.data.value);
                        }
                    }
                }
                //设定不同属性值
                let gender, role, logicRemove;
                //性别没选或者全选则值为2
                if (genderArr.length === 2 || genderArr.length === 0) {
                    gender = 2;
                } else {
                    gender = genderArr[0];
                }
                //权限没选或者全选则值为2
                if (roleArr.length === 2 || roleArr.length === 0) {
                    role = '';
                } else {
                    role = roleArr[0];
                }
                //逻辑删除没选或者全选则值为2
                if (logicRemoveArr.length === 2 || logicRemoveArr.length === 0) {
                    logicRemove = 2;
                } else {
                    logicRemove = logicRemoveArr[0];
                }
                //级联选择查询
                let res = await queryUserByConditions({
                    role: role,
                    gender: gender,
                    logicRemove: logicRemove
                });
                this.userTableData = res.data.list;
                this.query.pageSize = res.data.pageSize;
                this.query.pageTotal = res.data.total;
            },
            //多选操作
            handleSelectionChange(val) {
                this.currentStatus = val.length > 0;
                this.currentNum = val.length;
                this.multipleSelection = val.map(m => m.id);
            },
            //批量删除
            delAllSelection() {
                this.$confirm(`此操作将批量删除选中的${this.currentNum}行, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.removeUserList();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1500
                    });
                });
            },
            //确认批量删除
            async removeUserList() {
                let length = this.multipleSelection.length;
                let ids = [];
                for (let id of this.multipleSelection) {
                    ids.push(parseInt(id));
                }
                let res = await removeUserList({ 'ids': ids, num: length });
                if (res.data === 1) {
                    this.$message({
                        type: 'success',
                        message: '批量删除成功',
                        duration: 1500
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '批量删除失败',
                        duration: 1500
                    });
                }
                this.getQueryUserPaging(this.query.pageIndex);
            }
        },
        //监听字段变化
        watch: {
            searchInfo() {
                this.doSearch();
            }
        }

    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 150px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .container {
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        height: calc(100vh - 220px);
    }

    .pagination1 {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
</style>
