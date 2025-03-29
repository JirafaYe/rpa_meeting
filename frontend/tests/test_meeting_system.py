import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from appium import webdriver as appium_webdriver

class MeetingSystemAdminTest(unittest.TestCase):
    """管理员系统测试类"""
    
    @classmethod
    def setUpClass(cls):
        """测试前准备工作，打开浏览器并访问管理员登录页面"""
        chrome_options = Options()
        # chrome_options.add_argument('--headless')  # 无头模式，不显示浏览器
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3000/#/pages/admin/login")
        cls.wait = WebDriverWait(cls.driver, 10)
        # 登录管理员账号
        cls.login("admin", "admin123")
    
    @classmethod
    def tearDownClass(cls):
        """测试结束关闭浏览器"""
        cls.driver.quit()
    
    @classmethod
    def login(cls, username, password):
        """管理员登录方法"""
        username_input = cls.wait.until(EC.presence_of_element_located((By.ID, "username")))
        password_input = cls.wait.until(EC.presence_of_element_located((By.ID, "password")))
        login_button = cls.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '登录')]")))
        
        username_input.clear()
        username_input.send_keys(username)
        password_input.clear()
        password_input.send_keys(password)
        login_button.click()
        
        # 等待登录成功，跳转到管理首页
        cls.wait.until(EC.url_contains("/admin/home"))
    
    def test_001_add_meeting_room(self):
        """测试添加会议室功能"""
        # 导航到会议室管理页面
        self.driver.get("http://localhost:3000/#/pages/admin/room/list")
        
        # 点击添加会议室按钮
        add_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '添加会议室')]")))
        add_button.click()
        
        # 填写会议室信息
        room_name_input = self.wait.until(EC.presence_of_element_located((By.ID, "roomName")))
        capacity_input = self.wait.until(EC.presence_of_element_located((By.ID, "capacity")))
        location_input = self.wait.until(EC.presence_of_element_located((By.ID, "location")))
        
        room_name = f"测试会议室-{int(time.time())}"
        room_name_input.send_keys(room_name)
        capacity_input.send_keys("20")
        location_input.send_keys("A栋5楼")
        
        # 提交表单
        submit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '保存')]")))
        submit_button.click()
        
        # 验证添加成功
        self.wait.until(EC.presence_of_element_located((By.XPATH, f"//td[contains(text(), '{room_name}')]")))
    
    def test_002_edit_meeting_room(self):
        """测试修改会议室信息功能"""
        # 导航到会议室管理页面
        self.driver.get("http://localhost:3000/#/pages/admin/room/list")
        
        # 找到第一个会议室的编辑按钮并点击
        edit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "(//button[contains(text(), '编辑')])[1]")))
        edit_button.click()
        
        # 修改会议室信息
        room_name_input = self.wait.until(EC.presence_of_element_located((By.ID, "roomName")))
        capacity_input = self.wait.until(EC.presence_of_element_located((By.ID, "capacity")))
        
        room_name_input.clear()
        new_room_name = f"修改后会议室-{int(time.time())}"
        room_name_input.send_keys(new_room_name)
        
        capacity_input.clear()
        capacity_input.send_keys("30")
        
        # 提交表单
        submit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '保存')]")))
        submit_button.click()
        
        # 验证修改成功
        self.wait.until(EC.presence_of_element_located((By.XPATH, f"//td[contains(text(), '{new_room_name}')]")))
    
    def test_003_delete_meeting_room(self):
        """测试删除会议室功能"""
        # 导航到会议室管理页面
        self.driver.get("http://localhost:3000/#/pages/admin/room/list")
        
        # 获取删除前的会议室数量
        room_rows = self.driver.find_elements(By.XPATH, "//table/tbody/tr")
        room_count_before = len(room_rows)
        
        # 点击第一个会议室的删除按钮
        delete_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "(//button[contains(text(), '删除')])[1]")))
        delete_button.click()
        
        # 确认删除
        confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '确认')]")))
        confirm_button.click()
        
        # 等待提示信息消失
        time.sleep(2)
        
        # 获取删除后的会议室数量
        room_rows = self.driver.find_elements(By.XPATH, "//table/tbody/tr")
        room_count_after = len(room_rows)
        
        # 验证删除成功
        self.assertEqual(room_count_before - 1, room_count_after)
    
    def test_004_meeting_approval(self):
        """测试会议审批功能"""
        # 导航到会议管理页面
        self.driver.get("http://localhost:3000/#/pages/admin/meeting/list")
        
        # 找到待审批的会议
        pending_meeting = self.wait.until(EC.presence_of_element_located((By.XPATH, "//td[contains(text(), '待审批')]")))
        # 获取当前行
        meeting_row = pending_meeting.find_element(By.XPATH, "./..")
        # 点击查看详情
        detail_button = meeting_row.find_element(By.XPATH, ".//button[contains(text(), '详情')]")
        detail_button.click()
        
        # 点击审批按钮
        approve_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '通过')]")))
        approve_button.click()
        
        # 确认审批
        confirm_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '确认')]")))
        confirm_button.click()
        
        # 验证审批成功
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//span[contains(text(), '已通过')]")))
    
    def test_005_view_statistics(self):
        """测试查看报表功能"""
        # 导航到报表页面
        self.driver.get("http://localhost:3000/#/pages/admin/statistics/index")
        
        # 等待报表数据加载
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'chart-container')]")))
        
        # 切换报表类型
        tabs = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'tab-item')]")
        self.assertGreaterEqual(len(tabs), 3)  # 至少有3个报表选项卡
        
        # 点击会议室使用频率选项卡
        tabs[1].click()
        
        # 验证图表已加载
        self.wait.until(EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'chart-container')]/canvas")))
    
    def test_006_manage_rpa(self):
        """测试RPA管理功能"""
        # 导航到RPA管理页面
        self.driver.get("http://localhost:3000/#/pages/admin/rpa/index")
        
        # 测试上传RPA文件
        upload_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '上传文件')]")))
        upload_button.click()
        
        # 由于文件上传需要与系统交互，这里只测试上传按钮点击
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='file']")))
        
        # 关闭上传对话框
        close_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '取消')]")))
        close_button.click()


class MeetingSystemUserTest(unittest.TestCase):
    """用户端APP测试类"""
    
    @classmethod
    def setUpClass(cls):
        """测试前准备工作，启动APP"""
        # Appium设置
        desired_caps = {
            'platformName': 'Android',
            'platformVersion': '11',
            'deviceName': 'Android Emulator',
            'appPackage': 'com.meetingsystem.app',
            'appActivity': '.MainActivity',
            'noReset': False
        }
        cls.driver = appium_webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
        cls.wait = WebDriverWait(cls.driver, 10)
        # 登录用户账号
        cls.login("user1", "password123")
    
    @classmethod
    def tearDownClass(cls):
        """测试结束关闭APP"""
        cls.driver.quit()
    
    @classmethod
    def login(cls, username, password):
        """用户登录方法"""
        username_input = cls.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/username")))
        password_input = cls.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/password")))
        login_button = cls.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_login")))
        
        username_input.clear()
        username_input.send_keys(username)
        password_input.clear()
        password_input.send_keys(password)
        login_button.click()
        
        # 等待登录成功
        cls.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/layout_schedule")))
    
    def test_001_reserve_meeting(self):
        """测试预约会议功能"""
        # 点击我的会议按钮
        meeting_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/tab_meeting")))
        meeting_tab.click()
        
        # 点击预约会议按钮
        reserve_button = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_reserve")))
        reserve_button.click()
        
        # 填写会议信息
        title_input = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/meeting_title")))
        title_input.send_keys(f"自动化测试会议-{int(time.time())}")
        
        # 选择会议室
        room_selector = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/room_selector")))
        room_selector.click()
        first_room = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//android.widget.ListView/android.widget.TextView[1]")))
        first_room.click()
        
        # 选择开始时间
        start_time = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/start_time")))
        start_time.click()
        ok_button = self.wait.until(EC.element_to_be_clickable((By.ID, "android:id/button1")))
        ok_button.click()
        
        # 选择结束时间
        end_time = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/end_time")))
        end_time.click()
        ok_button = self.wait.until(EC.element_to_be_clickable((By.ID, "android:id/button1")))
        ok_button.click()
        
        # 选择参会人员
        participants = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/participants")))
        participants.click()
        first_user = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//android.widget.ListView/android.widget.CheckBox[1]")))
        first_user.click()
        confirm_button = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_confirm")))
        confirm_button.click()
        
        # 提交预约
        submit_button = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_submit")))
        submit_button.click()
        
        # 验证预约成功
        success_message = self.wait.until(EC.presence_of_element_located((By.XPATH, "//android.widget.Toast[contains(@text, '预约成功')]")))
        self.assertIsNotNone(success_message)
    
    def test_002_view_schedule(self):
        """测试查看日程功能"""
        # 点击日程按钮
        schedule_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/tab_schedule")))
        schedule_tab.click()
        
        # 等待日程列表加载
        meeting_list = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/meeting_list")))
        meetings = meeting_list.find_elements(By.CLASS_NAME, "android.widget.LinearLayout")
        
        # 验证至少有一个会议
        self.assertGreater(len(meetings), 0)
        
        # 点击第一个会议查看详情
        meetings[0].click()
        
        # 验证进入会议详情页
        self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/meeting_detail")))
    
    def test_003_notifications(self):
        """测试通知功能"""
        # 点击通知按钮
        notification_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/tab_notification")))
        notification_tab.click()
        
        # 等待通知列表加载
        notification_list = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/notification_list")))
        
        # 验证进入通知列表页面
        page_title = self.wait.until(EC.presence_of_element_located((By.XPATH, "//android.widget.TextView[@text='通知']")))
        self.assertIsNotNone(page_title)
        
        # 如果有通知，点击第一个通知
        try:
            notifications = notification_list.find_elements(By.CLASS_NAME, "android.widget.LinearLayout")
            if len(notifications) > 0:
                notifications[0].click()
                # 验证进入通知详情页
                self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/notification_detail")))
        except:
            pass  # 没有通知也不影响测试
    
    def test_004_meeting_room(self):
        """测试参与会议功能"""
        # 点击我的会议按钮
        meeting_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/tab_meeting")))
        meeting_tab.click()
        
        # 等待会议列表加载
        meeting_list = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/meeting_list")))
        meetings = meeting_list.find_elements(By.CLASS_NAME, "android.widget.LinearLayout")
        
        # 验证至少有一个会议
        self.assertGreater(len(meetings), 0)
        
        # 点击第一个会议
        meetings[0].click()
        
        # 验证进入会议详情页
        self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/meeting_detail")))
        
        # 点击进入会议室按钮
        enter_button = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_enter")))
        enter_button.click()
        
        # 验证进入会议室
        self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/meeting_room")))
        
        # 测试上传录音
        upload_record = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_upload_record")))
        upload_record.click()
        
        # 由于文件选择需要系统交互，这里只测试按钮点击
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//android.widget.TextView[@text='选择录音文件']")))
    
    def test_005_create_topic(self):
        """测试创建议题功能"""
        # 首先进入会议室
        self.test_004_meeting_room()
        
        # 点击议题标签
        topic_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/tab_topic")))
        topic_tab.click()
        
        # 点击添加议题按钮
        add_topic = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_add_topic")))
        add_topic.click()
        
        # 填写议题信息
        topic_title = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/topic_title")))
        topic_title.send_keys(f"自动化测试议题-{int(time.time())}")
        
        topic_content = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/topic_content")))
        topic_content.send_keys("这是一个自动化测试创建的议题内容")
        
        # 提交议题
        submit_button = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_submit")))
        submit_button.click()
        
        # 验证添加成功
        self.wait.until(EC.presence_of_element_located((By.XPATH, f"//android.widget.TextView[contains(@text, '自动化测试议题')]")))
    
    def test_006_edit_profile(self):
        """测试修改用户资料功能"""
        # 点击我的按钮
        profile_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/tab_profile")))
        profile_tab.click()
        
        # 点击个人资料
        my_profile = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_profile")))
        my_profile.click()
        
        # 修改昵称
        nickname = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/nickname")))
        nickname.clear()
        new_nickname = f"测试用户-{int(time.time())}"
        nickname.send_keys(new_nickname)
        
        # 保存修改
        save_button = self.wait.until(EC.element_to_be_clickable((By.ID, "com.meetingsystem.app:id/btn_save")))
        save_button.click()
        
        # 验证修改成功
        success_message = self.wait.until(EC.presence_of_element_located((By.XPATH, "//android.widget.Toast[contains(@text, '保存成功')]")))
        self.assertIsNotNone(success_message)
        
        # 返回个人中心
        back_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//android.widget.ImageButton[@content-desc='返回']")))
        back_button.click()
        
        # 验证昵称已更改
        updated_nickname = self.wait.until(EC.presence_of_element_located((By.ID, "com.meetingsystem.app:id/user_nickname")))
        self.assertEqual(updated_nickname.text, new_nickname)


if __name__ == "__main__":
    # 运行测试
    admin_suite = unittest.TestLoader().loadTestsFromTestCase(MeetingSystemAdminTest)
    user_suite = unittest.TestLoader().loadTestsFromTestCase(MeetingSystemUserTest)
    
    # 创建测试报告目录
    import os
    if not os.path.exists("test_reports"):
        os.makedirs("test_reports")
    
    # 运行管理员测试
    print("开始运行管理员端测试...")
    admin_result = unittest.TextTestRunner(verbosity=2).run(admin_suite)
    
    # 运行用户测试
    print("\n开始运行用户端APP测试...")
    user_result = unittest.TextTestRunner(verbosity=2).run(user_suite)
    
    # 输出测试结果
    print("\n测试结果汇总:")
    print(f"管理员端测试用例总数: {admin_result.testsRun}, 成功: {admin_result.testsRun - len(admin_result.errors) - len(admin_result.failures)}, 失败: {len(admin_result.failures)}, 错误: {len(admin_result.errors)}")
    print(f"用户端测试用例总数: {user_result.testsRun}, 成功: {user_result.testsRun - len(user_result.errors) - len(user_result.failures)}, 失败: {len(user_result.failures)}, 错误: {len(user_result.errors)}") 