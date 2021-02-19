<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">YG博客后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="nickname">
                    <el-input v-model="param.nickname" placeholder="用户昵称">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="param.password" placeholder="密码" type="password" show-password>
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-checkbox v-model="rememberMe" class="autoCheck">记住密码</el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
                <p class="login-tips">提示 : 记住密码一天内有效</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { login, queryUserAllList } from '../service/api';
    export default {
        data: function() {
            return {
                param: {
                    nickname: '',
                    password: ''
                },
                rules: {
                    nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                },
                rememberMe:false
            };
        },
        methods: {
            async submitForm() {
                let res = await login({
                    nickname: this.param.nickname,
                    password: this.param.password
                });
                if (res.code === 200) {
                    if (res.data.role === 'admin'){
                        this.$cookieStore.setCookie('username', res.data.username); //存入用户名，设置有效时间1分钟
                        this.$cookieStore.setCookie('nickname', res.data.nickname); //存入用户名，设置有效时间1分钟
                        this.$cookieStore.setCookie('role', res.data.role);
                        this.$cookieStore.setCookie('id', res.data.id);
                        this.$message.success(`欢迎${res.data.username}登录YG博客后台管理系统`);
                        this.$router.push('/dashboard');
                    }else {
                        this.$message({
                            message: '对不起，权限不够~',
                            type: 'warning'
                        });
                    }
                } else {
                    this.$message.error('请输入正确的账号和密码');
                    return false;
                }
            }
        },
        watch:{
            rememberMe(val){
                if (val === true){
                    console.log(true);
                    this.$cookieStore.setCookie('nickname',this.param.nickname, 60 * 1000 * 60 *24);
                    this.$cookieStore.setCookie('password',this.param.password, 60 * 1000 * 60 *24);
                }else {
                    this.$cookieStore.setCookie('nickname','');
                    this.$cookieStore.setCookie('password','');
                }
            }
        }
    };
</script>

<style scoped>
    .login-wrap {
        background-size: cover; /* 使图片平铺满整个浏览器（从宽和高的最大需求方面来满足，会使某些部分无法显示在区域中） */
        position: absolute; /* 不可缺少 */
        width: 100%;
        height: 100%;
        background-image: url(../assets/img/background-05.jpg);
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }

    .autoCheck{
        margin-bottom: 10px;
    }
</style>