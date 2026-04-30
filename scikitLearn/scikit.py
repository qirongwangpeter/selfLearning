# ===================== 1. 导入所需库 =====================
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing  # 加州房价数据集
from sklearn.model_selection import train_test_split   # 划分训练集/测试集
from sklearn.linear_model import LinearRegression      # 线性回归模型
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score  # 评估指标

# ===================== 2. 加载并查看数据 =====================
# 加载加州房价数据集
housing = fetch_california_housing()
# 特征：8个影响房价的指标（收入、房龄、房间数、人口、经纬度等）
X = pd.DataFrame(housing.data, columns=housing.feature_names)
# 目标：房屋价值中位数（单位：10万美元）
y = pd.Series(housing.target, name="MedHouseVal")

# 查看数据基本信息（可选）
print("数据集特征列：", X.columns.tolist())
print("\n数据前5行：")
print(X.head())
print("\n数据描述性统计：")
print(X.describe())

# ===================== 3. 划分训练集和测试集 =====================
# 80%数据训练，20%数据测试，random_state保证结果可复现
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ===================== 4. 创建并训练线性回归模型 =====================
# 初始化线性回归模型
model = LinearRegression()
# 用训练集拟合模型（学习房价和特征的线性关系）
model.fit(X_train, y_train)

# ===================== 5. 模型预测 =====================
# 对测试集进行预测
y_pred = model.predict(X_test)

# ===================== 6. 模型评估（核心指标） =====================
print("\n===== 线性回归模型评估结果 =====")
# 平均绝对误差：预测值与真实值的平均差值
mae = mean_absolute_error(y_test, y_pred)
# 均方误差：放大大误差的影响
mse = mean_squared_error(y_test, y_pred)
# 均方根误差：和房价单位一致，最直观的误差指标
rmse = np.sqrt(mse)
# 决定系数R²：模型拟合优度，越接近1越好
r2 = r2_score(y_test, y_pred)

print(f"平均绝对误差 (MAE): {mae:.2f} (10万美元)")
print(f"均方根误差 (RMSE): {rmse:.2f} (10万美元)")
print(f"决定系数 (R²): {r2:.4f}")

# ===================== 7. 查看线性回归方程 =====================
print("\n===== 线性回归模型参数 =====")
print(f"截距 (Intercept): {model.intercept_:.4f}")
print("特征系数 (Coefficients):")
for feat, coef in zip(housing.feature_names, model.coef_):
    print(f"  {feat}: {coef:.4f}")

# ===================== 8. 可视化：真实值 vs 预测值 =====================
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.5, color='blue')
# 绘制理想预测线（y=x）
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
plt.xlabel("真实房价 (10万美元)")
plt.ylabel("预测房价 (10万美元)")
plt.title("线性回归：房价真实值 vs 预测值")
plt.grid(True)
plt.show()

# ===================== 9. 用新数据预测房价（实战演示） =====================
print("\n===== 新样本房价预测 =====")
# 构造新房屋数据：[收入, 房龄, 均房间数, 均卧室数, 人口, 均居住人数, 纬度, 经度]
new_house = np.array([[8.3252, 41.0, 6.9841, 1.0238, 322.0, 2.5556, 37.88, -122.23]])
# 预测房价
pred_price = model.predict(new_house)
print(f"预测房屋价格：{pred_price[0]:.2f} (10万美元) → 折合美元：${pred_price[0]*100000:.2f}")