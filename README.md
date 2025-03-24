# rpa_meeting
毕设-rpa会议系统

## 开发规范
接口定义请遵守 Restful 风格
https://blog.csdn.net/D1842501760/article/details/124001581

**一定要写注释！！！！ 我最讨厌两种人 一种是让我写注释的人 另一种是不写注释的人**

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

#### 如何校验权限
在本系统中角色权限只精确到角色 这也足够用了
```java
    @GetMapping("/info")
    @PreAuthorize("@ss.hasRole('admin')")
    public AjaxResult getInfo()
    {
        return success(SecurityUtils.getLoginUser());
    }
    
    具体校验的方法可以查看 org.cuit.meeting.web.service.PermissionService 中提供的方法
    注解@PreAuthorize的value是一个SpEL表达式 我们在此基础上进行了自定义 让其满足了我们的需求
```


## 项目结构
```text

```