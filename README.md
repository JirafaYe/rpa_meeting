# rpa_meeting
毕设-rpa会议系统

## 开发规范
接口定义请遵守 Restful 风格
https://blog.csdn.net/D1842501760/article/details/124001581

#### 如何获取当前登录用户信息
```java
class TestController(){
    @GetMapping("/test")
    public void test(){
        // 在当前线程中任意位置都可以获取到当前登录用户信息
        // 以下是一些获取当前登录用户信息的方法
        SecurityUtils.getUserId(); // 获取当前登录用户id
        SecurityUtils.getUsername(); // 获取当前登录用户名
        SecurityUtils.getLoginUser(); // 获取当前登录用户信息
    }
}
```