<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">YG博客后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!--                <div class="btn-fullscreen" @click="handleFullScreen">-->
                <!--                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">-->
                <!--                        <i class="el-icon-rank"></i>-->
                <!--                    </el-tooltip>-->
                <!--                </div>-->
                <!-- 消息中心 -->
                <!--                <div class="btn-bell">-->
                <!--                    <el-tooltip-->
                <!--                        effect="dark"-->
                <!--                        :content="message?`有${message}条未读消息`:`消息中心`"-->
                <!--                        placement="bottom"-->
                <!--                    >-->
                <!--                        <router-link to="/tabs">-->
                <!--                            <i class="el-icon-bell"></i>-->
                <!--                        </router-link>-->
                <!--                    </el-tooltip>-->
                <!--                    <span class="btn-bell-badge" v-if="message"></span>-->
                <!--                </div>-->
                <!-- 用户头像 -->
                <!--                <div class="user-avator">-->
                <!--                    <img src="../../assets/img/img.jpg" />-->
                <!--                </div>-->
                <!-- 用户名下拉菜单 -->
                <i class="el-icon-user"></i>
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="modifyPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginOut">账号注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <!-- 与原始密码比较弹出框 -->
        <el-dialog :title="oldOrNew?'修改密码':'原始密码'" :visible.sync="showModel" width="30%" :show-close="false"
                   :close-on-click-modal="false">
            <div v-if="!oldOrNew">
                <el-form ref="form" :model="form" label-width="70px">
                    <el-form-item label="原始密码" prop="oldPassword">
                        <el-input placeholder="请输入密码" v-model="form.oldPassword" show-password></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closePasswordToCompare">取 消</el-button>
                    <el-button type="primary" @click="passwordToCompare">确 定</el-button>
                </span>
            </div>
            <div v-else>
                <el-form ref="form" :model="form" :rules="rules" :ref="form" label-width="80px">
                    <el-form-item label="新密码" prop="newPassword" label-width="80px">
                        <el-input placeholder="请输入新密码" v-model="form.newPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password" label-width="80px">
                        <el-input placeholder="请确认密码" v-model="form.password" show-password></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeModifyPasswordModel">取 消</el-button>
                <el-button type="primary" @click="modifyPassword">确 定</el-button>
            </span>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import { modifyPassword, oldPasswordToCompare } from '../../service/api';

    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                username: 'like',
                nickname: '',
                message: 2,
                form: {
                    oldPassword: '',
                    password: '',
                    newPassword: ''
                },
                rules: {
                    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                    password: [{ required: true, message: '请确认密码', trigger: 'blur' }]
                },
                showModel: false,
                oldOrNew: false
            };
        },
        created() {
            this.username = this.$cookieStore.getCookie('username');
            this.nickname = this.$cookieStore.getCookie('nickname');
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command === 'loginOut') {
                    this.loginOut();
                }
                if (command === 'modifyPassword') {
                    this.showModel = true;
                }
            },

            //与原始密码比较
            async passwordToCompare() {
                let res = await oldPasswordToCompare({
                    oldPassword: this.form.oldPassword,
                    nickName: this.nickname
                });
                if (res.code === 200) {
                    if (res.data === false) {
                        this.$message.error('原始密码输入错误');
                    } else {
                        this.$message({
                            type: 'success',
                            message: '原始密码输入正确',
                            duration: 1500
                        });
                        this.openModifyPassword();
                    }
                }
            },

            //关闭与原始密码比较 Dialog
            closePasswordToCompare() {
                this.showModel = false;
                this.form.oldPassword = '';
                //取消修改密码
                this.$message({
                    type: 'info',
                    message: '已取消校验原始密码',
                    duration: 1500
                });
            },

            //打开修改密码(原始密码) Dialog
            openModifyPassword() {
                this.oldOrNew = true;
                this.form.oldPassword = '';
            },

            //修改密码(原始密码)
            async modifyPassword() {
                let res = await modifyPassword({
                    newPassword: this.form.newPassword,
                    nickName: this.nickname
                });
                if (res.code === 200) {
                    if (res.data === 0) {
                        this.$message.error('新密码更新错误');
                    }
                    if (res.data === 1) {
                        this.showModel = false;
                        this.form.newPassword = '';
                        this.form.password = '';
                        this.$message.success({
                            message: '新密码更新成功,请重新登录',
                            duration: 1000
                        });
                        this.$router.push('/login');
                    }
                }
            },

            //关闭修改密码(原始密码) Dialog
            closeModifyPasswordModel() {
                this.showModel = false;
                this.oldOrNew = false;
                this.form.newPassword = '';
                this.form.password = '';
                //取消修改密码
                this.$message({
                    type: 'info',
                    message: '已取消修改原始密码',
                    duration: 1500
                });
            },

            // 退出登录
            loginOut() {
                this.$confirm('注销账号,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                    center: true
                }).then(() => {
                    this.$cookieStore.removeCookie('username');
                    this.$cookieStore.removeCookie('nickname');
                    this.$cookieStore.removeCookie('role');
                    this.$cookieStore.removeCookie('password');
                    this.$cookieStore.removeCookie('id');
                    this.$router.push('/login');
                    this.$message({
                        type: 'success',
                        message: '注销账号成功'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消注销账号'
                    });
                });
            },

            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },

            // 全屏事件
            // handleFullScreen() {
            //     let element = document.documentElement;
            //     if (this.fullscreen) {
            //         if (document.exitFullscreen) {
            //             document.exitFullscreen();
            //         } else if (document.webkitCancelFullScreen) {
            //             document.webkitCancelFullScreen();
            //         } else if (document.mozCancelFullScreen) {
            //             document.mozCancelFullScreen();
            //         } else if (document.msExitFullscreen) {
            //             document.msExitFullscreen();
            //         }
            //     } else {
            //         if (element.requestFullscreen) {
            //             element.requestFullscreen();
            //         } else if (element.webkitRequestFullScreen) {
            //             element.webkitRequestFullScreen();
            //         } else if (element.mozRequestFullScreen) {
            //             element.mozRequestFullScreen();
            //         } else if (element.msRequestFullscreen) {
            //             // IE11
            //             element.msRequestFullscreen();
            //         }
            //     }
            //     this.fullscreen = !this.fullscreen;
            // }
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
        }
    };
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .dialog-footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
</style>
