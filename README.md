# UserOS - React Native + Expo 项目

这是一个使用最新 Expo 框架构建的 React Native 应用程序，支持在 Expo Go、iOS 模拟器和 Android 虚拟机（模拟器）上运行。

## 📋 前置要求

在开始之前，请确保您的开发环境已安装以下工具：

### 必需工具

1. **Node.js** (推荐 v18 或更高版本)
   ```bash
   node --version
   ```

2. **npm** 或 **yarn**
   ```bash
   npm --version
   ```

3. **Xcode** (仅 macOS，用于 iOS 模拟器)
   - 从 App Store 安装最新版本的 Xcode
   - 安装 Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

4. **Android Studio** (用于 Android 模拟器)
   - 下载并安装 [Android Studio](https://developer.android.com/studio)
   - 安装 Android SDK (API Level 33 或更高)
   - 配置 Android 环境变量：
     ```bash
     # 添加到 ~/.zshrc 或 ~/.bash_profile
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     ```
   - 重新加载配置：
     ```bash
     source ~/.zshrc  # 或 source ~/.bash_profile
     ```
   - 验证安装：
     ```bash
     adb version
     ```

5. **Expo CLI** (可选，已包含在项目中)
   ```bash
   npm install -g expo-cli
   ```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

这将启动 Expo 开发服务器，并显示一个二维码和多个选项。

### 3. 运行应用

#### 方式一：在 iOS 模拟器上运行

**选项 A：使用 npm 脚本**
```bash
npm run ios
```

**选项 B：在 Expo 开发服务器中按 `i` 键**

启动开发服务器后，在终端中按 `i` 键，Expo 会自动启动 iOS 模拟器。

**选项 C：指定特定模拟器**
```bash
npm run ios:simulator
```

#### 方式二：在 Expo Go 中运行

1. 在您的 iOS 设备上安装 [Expo Go](https://apps.apple.com/app/expo-go/id982107779) 应用
2. 启动开发服务器后，使用 Expo Go 扫描终端中显示的二维码
3. 应用将在您的设备上加载

#### 方式三：在 Android 虚拟机（模拟器）上运行

**前置步骤：设置 Android 模拟器**

1. **打开 Android Studio**
   - 启动 Android Studio
   - 点击 "More Actions" → "Virtual Device Manager" (或 Tools → Device Manager)

2. **创建虚拟设备**
   - 点击 "Create Device"
   - 选择设备型号（推荐：Pixel 5 或 Pixel 6）
   - 选择系统镜像（推荐：API 33 或更高，带有 Google Play）
   - 完成创建

3. **启动模拟器**
   - 在 Virtual Device Manager 中点击播放按钮启动模拟器
   - 或者使用命令行：
     ```bash
     emulator -avd <设备名称>
     ```
   - 查看可用设备：
     ```bash
     emulator -list-avds
     ```

**运行应用**

**选项 A：使用 npm 脚本（推荐）**
```bash
npm run android
```

**选项 B：在 Expo 开发服务器中按 `a` 键**

启动开发服务器后，确保 Android 模拟器已运行，然后在终端中按 `a` 键，Expo 会自动在模拟器中打开应用。

**选项 C：手动指定设备**
```bash
# 先启动模拟器，然后运行
npm run android:emulator
```

**选项 D：在真实 Android 设备上运行**
1. 在设备上启用"开发者选项"和"USB 调试"
2. 通过 USB 连接设备
3. 运行 `npm run android` 或按 `a` 键

**选项 E：在 Expo Go 中运行（Android）**
1. 在您的 Android 设备上安装 [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) 应用
2. 启动开发服务器后，使用 Expo Go 扫描终端中显示的二维码
3. 应用将在您的设备上加载

#### 方式四：在 Web 浏览器中运行

```bash
npm run web
```

## 📱 项目结构

```
UserOS/
├── App.tsx              # 主应用组件
├── index.ts             # 应用入口点
├── app.json             # Expo 配置文件
├── package.json         # 项目依赖和脚本
├── tsconfig.json        # TypeScript 配置
├── assets/              # 静态资源（图标、图片等）
└── node_modules/        # 依赖包
```

## 🛠️ 技术栈

- **Expo SDK**: ~54.0.31
- **React**: 19.1.0
- **React Native**: 0.81.5
- **TypeScript**: ~5.9.2
- **新架构**: 已启用 (`newArchEnabled: true`)

## 📝 可用脚本

- `npm start` - 启动 Expo 开发服务器
- `npm run ios` - 在 iOS 模拟器上运行
- `npm run ios:simulator` - 在 iOS 模拟器上运行（明确指定）
- `npm run android` - 在 Android 模拟器/设备上运行
- `npm run android:emulator` - 在 Android 模拟器上运行（明确指定）
- `npm run web` - 在 Web 浏览器中运行

## 🔧 常见问题排查

### iOS 模拟器无法启动

1. **确保 Xcode 已正确安装**
   ```bash
   xcode-select -p
   ```

2. **检查可用的模拟器**
   ```bash
   xcrun simctl list devices
   ```

3. **清理并重新安装依赖**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **清理 Expo 缓存**
   ```bash
   npx expo start -c
   ```

### Android 模拟器无法启动或连接

1. **确保 Android 模拟器正在运行**
   ```bash
   # 检查运行的模拟器
   adb devices
   ```
   应该显示类似 `emulator-5554` 的设备

2. **如果设备未显示，尝试重启 ADB**
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

3. **确保 ANDROID_HOME 环境变量已设置**
   ```bash
   echo $ANDROID_HOME
   ```
   如果为空，请按照前置要求中的步骤配置环境变量

4. **检查 Android SDK 路径**
   ```bash
   # macOS
   ls ~/Library/Android/sdk
   
   # 如果路径不同，更新 ANDROID_HOME
   ```

5. **确保已安装必要的 Android SDK 组件**
   - 打开 Android Studio
   - 进入 Preferences → Appearance & Behavior → System Settings → Android SDK
   - 确保安装了：
     - Android SDK Platform-Tools
     - Android Emulator
     - Android SDK Build-Tools

6. **如果模拟器启动缓慢或卡住**
   ```bash
   # 关闭所有模拟器
   adb emu kill
   
   # 清理模拟器缓存（可选）
   # 在 Android Studio 中：Tools → Device Manager → 右键设备 → Wipe Data
   ```

7. **检查端口占用**
   ```bash
   # 检查 8081 端口（Metro）
   lsof -i :8081
   
   # 检查 5554 端口（模拟器）
   lsof -i :5554
   ```

### Metro 打包器问题

如果遇到 Metro 打包器错误，尝试：

```bash
# 清理缓存
npx expo start -c

# 或者重置 Metro 缓存
npx react-native start --reset-cache
```

### 端口被占用

如果 8081 端口被占用，可以指定其他端口：

```bash
npx expo start --port 8082
```

## 📚 学习资源

- [Expo 文档](https://docs.expo.dev/)
- [React Native 文档](https://reactnative.dev/)
- [Expo SDK 54 发布说明](https://blog.expo.dev/expo-sdk-54-is-now-available-4d5cba0b3f3e)

## 🎯 下一步

1. 编辑 `App.tsx` 开始构建您的应用
2. 添加新的屏幕和组件
3. 安装 Expo 模块来扩展功能
4. 配置原生代码（如需要）

## 📄 许可证

此项目为私有项目。
