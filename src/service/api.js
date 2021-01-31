import Api from './index';
import Axios from './request';

/*****************************************************************/
/*****************************************************************/
/**********************   API 接口集合   **************************/
/*****************************************************************/
/*****************************************************************/
/*****************************************************************/


/**
 * 用户 User API
 * @param reqData
 * @returns {AxiosPromise<any>}
 */

//登录
export async function login(reqData) {
    return Api.login(reqData);
}

//与原始密码比较
export async function oldPasswordToCompare(reqData) {
    return Api.oldPasswordToCompare(reqData);
}

//修改密码
export async function modifyPassword(reqData) {
    return Api.modifyPassword(reqData);
}

// 获取用户信息List
export async function queryUserAllList() {
    return Api.queryUserAllList();
}

//确定添加用户
export async function saveUser(reqData) {
    return Api.saveUser(reqData);
}

//根据id查询用户
export async function queryUserById(reqData) {
    return Api.queryUserById(reqData);
}

//修改用户
export async function modifyUser(reqData) {
    return Api.modifyUser(reqData);
}

//查询用户 (分页)
export async function queryUserPaging(reqData) {
    return Api.queryUserPaging(reqData);
}

// 删除用户
export async function removeUser(reqData) {
    return Api.removeUser(reqData);
}

//批量删除
export async function removeUserList(reqData) {
    return Api.removeUserList(reqData);
}

//模糊查询用户
export async function queryUserByFuzzy(reqData) {
    return Api.queryUserByFuzzy(reqData);
}

//条件查询用户
export async function queryUserByConditions(reqData) {
    return Api.queryUserByConditions(reqData);
}

//查询用户数count
export async function queryUserCount() {
    return Api.queryUserCount();
}

/**
 * 博客 Blog API
 * @param reqData
 * @returns {AxiosPromise<any>}
 */
//上传md文件
export async function uploadMarkdownFile(reqData) {
    return Api.postMd(reqData);
}

//上传图片
export async function uploadPhotoFile(reqData) {
    return Api.uploadFile(reqData);
}

//MongoDB 查询ID
export async function queryBlogById(reqData) {
    return Api.queryBlogById(reqData);
}

//MongoDB 查询所有
export async function queryBlogAllList(reqData) {
    return Api.queryBlogAllList(reqData);
}

//MongoDB 删除
export async function removeMongoDbById(reqData) {
    return Api.removeMongoDbById(reqData);
}

//MongoDB 模糊查询博客
export async function queryFuzzyBlog(reqData) {
    return Api.queryFuzzyBlog(reqData);
}

//MongoDB 查询博客数count
export async function queryBlogCount() {
    return Api.queryBlogCount();
}

/**
 * 待办事项 Todo API
 * @param reqData
 * @returns {AxiosPromise<any>}
 */
//MySQL 增加待办事项
export async function saveTodo(reqData) {
    return Api.saveTodo(reqData);
}

//MySQL 删除待办事项
export async function removeTodoById(reqData) {
    return Api.removeTodoById(reqData);
}

//MySQL 查询待办事项(分页)
export async function queryTodoPaging(reqData) {
    return Api.queryTodoPaging(reqData);
}

//更新待办事项状态
export async function modifyTodo(reqData) {
    return Api.modifyTodo(reqData);
}
