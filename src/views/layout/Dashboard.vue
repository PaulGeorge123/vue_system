<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num information-title"
                                         @click="userCountRouter">{{userCount}}
                                    </div>
                                    <div>用户注册量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-chat-dot-round grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-document-copy grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num information-title"
                                         @click="blogCountRouter">{{blogCount}}
                                    </div>
                                    <div>博客总数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:450px;">
                    <div slot="header">
                        <span>备忘录</span>
                        <el-button style="float: right;" type="text" @click="openAddTodo">添加</el-button>
                    </div>
                    <el-table :data="todoList" style="width:100%;">
                        <el-table-column width="55" prop="id" label="序号" align="center">
                            <template slot-scope="scope">
                                <span>{{(query.pageIndex - 1) * 7 + (scope.$index + 1)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="待办事项" width="500" prop="todo" align="center">
                            <template slot-scope="scope">
                                <context-tooltip
                                        :content="scope.row.todo"
                                        class="newline"
                                        refName="supplierName"
                                ></context-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" align="center">
                            <template slot-scope="scope">
                                {{$moment(scope.row.dateday).format('YYYY-MM-DD')}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.status===1?'warning':scope.row.status===2?'':'success'">
                                    {{scope.row.status===1?'待办理':scope.row.status===2?'办理中':'已完成'}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="完成度" align="center">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-switch v-if="scope.row.status === 3"
                                               v-model="scope.row.status"
                                               inactive-color="#13ce66"
                                               disabled>
                                    </el-switch>
                                    <el-switch v-else
                                               v-model="scope.row.status"
                                               :active-value="1"
                                               :inactive-value="2"
                                               active-color="#E6A23C"
                                               inactive-color="#409EFF"
                                               @change="changeSwitch(scope.row)"/>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-check"
                                           :style="{'color': (scope.row.status === 3?'':'#409EFF')}"
                                           @click="isDone(scope.row,3)"
                                           :disabled="scope.row.status === 3">完成
                                </el-button>
                                <el-button type="text" icon="el-icon-delete" style="color: red"
                                           @click="openDeleteTodo(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <div class="block">
                    <el-pagination
                            layout="total, prev, pager, next"
                            :current-page="query.pageIndex"
                            :page-size="query.pageSize"
                            :total="query.pageTotal"
                            @current-change="handlePageChange">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 添加待办事项弹出框 -->
        <el-dialog title="添加待办事项" :visible.sync="addTodoModel" width="40%" :show-close="false"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" :ref="form" label-width="80px">
                <el-form-item label="待办事项" prop="nickname">
                    <el-input
                            type="textarea"
                            :rows="2"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="form.todo">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddTodo">取 消</el-button>
                <el-button type="primary" @click="saveTodo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        saveTodo, removeTodoById, queryTodoPaging, modifyTodo, queryUserCount, queryBlogCount
    } from '../../service/api';
    import ContextTooltip from '../../components/common/Tooltip';

    export default {
        name: 'dashboard',
        data() {
            return {
                rules: {
                    todo: [{ required: true, message: '请输入待办事项', trigger: 'blur' }]
                },
                todoList: [],
                data: [
                    {
                        name: '2018/09/04',
                        value: 1083
                    },
                    {
                        name: '2018/09/05',
                        value: 941
                    },
                    {
                        name: '2018/09/06',
                        value: 1139
                    },
                    {
                        name: '2018/09/07',
                        value: 816
                    },
                    {
                        name: '2018/09/08',
                        value: 327
                    },
                    {
                        name: '2018/09/09',
                        value: 228
                    },
                    {
                        name: '2018/09/10',
                        value: 1065
                    }
                ],
                //分页 query
                query: {
                    //当前页 index
                    pageIndex: 1,
                    //每页的数量
                    pageSize: 7,
                    //总记录数
                    pageTotal: 0
                },
                //添加 todo
                form: {
                    todo: ''
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
                addTodoModel: false,
                //用户数
                userCount: 0,
                //博客数
                blogCount: 0
            };
        },
        components: {
            ContextTooltip
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        async created() {
            await this.getUserCount();
            await this.getBlogCount();
            await this.getTodoAllList(this.query.pageIndex);
            await this.getTodoAllList(this.query.pageIndex);
        },
        methods: {
            //查询待办事项(分页)
            async getTodoAllList(pageIndex) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let res = await queryTodoPaging({
                    pageNum: pageIndex,
                    pageSize: 7
                });
                loading.close();
                this.todoList = res.data.list;
                this.query.pageSize = res.data.pageSize;
                this.query.pageTotal = res.data.total;
            },

            // 分页导航
            async handlePageChange(val) {
                // this.$set(this.query, 'pageIndex', val);
                this.query.pageIndex = val;
                await this.getTodoAllList(val);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                await this.getTodoAllList(val);
                loading.close();
            },

            //添加待办事项
            openAddTodo() {
                this.addTodoModel = true;
            },

            //确认添加待办事项
            async saveTodo() {
                let todo = { todo: this.form.todo };
                let res = await saveTodo(todo);
                if (res.code === 200) {
                    this.$message({
                        message: '恭喜你，添加待办事项成功',
                        type: 'success',
                        duration: 1500
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '不好意思，添加待办事项失败',
                        duration: 1500
                    });
                }
                await this.getTodoAllList(this.query.pageIndex);
                this.addTodoModel = false;
            },

            //关闭待办事项
            closeAddTodo() {
                this.addTodoModel = false;
            },

            //open 删除待办事项 Model
            openDeleteTodo(id) {
                // 二次确认删除
                this.$confirm('确定要删除待办事项吗? 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 确定删除用户
                    this.deleteTodo(id);
                }).catch(() => {
                    //取消删除用户
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1500
                    });
                });
            },

            //确定待办事项
            async deleteTodo(id) {
                let res = await removeTodoById({
                    id: id
                });
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除待办事项成功',
                        duration: 1500
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除待办事项失败',
                        duration: 1500
                    });
                }
                await this.getTodoAllList(this.query.pageIndex);
            },

            //改变状态
            async changeSwitch(row) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                await modifyTodo({
                    id: row.id,
                    status: row.status
                });
                await this.getTodoAllList(this.query.pageIndex);
                loading.close();
            },

            //完成
            async isDone(row, i) {
                let res = await modifyTodo({
                    id: row.id,
                    status: i
                });
                await this.getTodoAllList(this.query.pageIndex);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                await this.getTodoAllList(this.query.pageIndex);
                loading.close();
                await this.getTodoAllList(this.query.pageIndex);
                if (res.code === 200) {
                    this.$message({
                        message: '待办事项完成',
                        type: 'success',
                        duration: 1500
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '不好意思，修改待办事项失败',
                        duration: 1500
                    });
                }
            },

            //查询用户数count
            async getUserCount() {
                let res = await queryUserCount();
                this.userCount = res.data;
            },

            //查询博客数count
            async getBlogCount() {
                let res = await queryBlogCount();
                this.blogCount = res.data;
            },

            //跳转到用户列表
            userCountRouter() {
                this.$router.push('/usermanage');
            },

            //跳转到博客列表
            blogCountRouter() {
                this.$router.push('/blog/blogall');
            }
        }
    };
</script>


<style scoped>
    .information-title {
        color: #19d3ea;
        font-size: 18px;
        cursor: pointer; /*鼠标悬停变小手*/
        width: 100%;
    }

    .scrollbarStyle {
        height: calc(100vh - 250px);
    }

    .block {
        margin-top: 1px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        background: white;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 15px;
    }

    .newline {
        width: 500px;
    }

    .memo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
