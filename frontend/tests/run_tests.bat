@echo off
echo 开始执行会议系统自动化测试...

REM 检查Python环境
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 未找到Python环境，请确保已安装Python并添加到PATH环境变量中
    exit /b 1
)

REM 检查依赖
echo 安装测试依赖...
pip install -r requirements.txt

REM 创建报告目录
if not exist test_reports mkdir test_reports

REM 运行测试
echo 开始运行测试...
python test_meeting_system.py

echo 生成HTML测试报告...
pytest test_meeting_system.py -v --html=test_reports/report.html

echo 测试完成，请查看test_reports目录中的报告 