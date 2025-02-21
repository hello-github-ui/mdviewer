# 禁用自动更新设置-auto

## Human

*2025-02-21 13:56:54 UTC*

设置macbook air 的系统更新设置，开启禁用自动更新和更新检测？

## Assistant [使用模型: gpt-4o]

*2025-02-21 13:57:46 UTC*

在 macOS 上，你可以通过「系统设置」或「终端」来禁用自动更新和更新检测。以下是具体操作方法：

---

##### **方法 1：通过「系统设置」界面（适用于 macOS Ventura 及更新版本）**
1. **打开「系统设置」**（System Settings）。
2. 在左侧栏选择 **「一般」**（General）。
3. 点击 **「软件更新」**（Software Update）。
4. 在右侧，点击 **「自动更新」** 旁边的 **「i」** 图标（如果有）。
5. 关闭所有选项：
   - 关闭 **「检查更新」**（Check for updates）
   - 关闭 **「下载新更新」**（Download new updates when available）
   - 关闭 **「安装 macOS 更新」**（Install macOS updates）
   - 关闭 **「安装应用更新」**（Install app updates from the App Store）
6. 关闭窗口，设置生效。

---

##### **方法 2：使用终端（更彻底的方法）**
可以通过 `softwareupdate` 和 `defaults` 命令来完全禁用自动更新。

###### **1. 禁用 macOS 自动更新**
```bash
sudo softwareupdate --schedule off
```
> 这将禁用系统的自动更新计划。

###### **2. 禁止检查更新**
```bash
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled -bool false
```
> 这将阻止 macOS 进行自动更新检查。

###### **3. 禁用自动下载更新**
```bash
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticDownload -bool false
```

###### **4. 禁用 macOS 更新的自动安装**
```bash
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool false
```

###### **5. 禁用系统数据文件和安全更新自动安装**
```bash
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate CriticalUpdateInstall -bool false
```

###### **6. 禁用 App Store 自动更新**
```bash
defaults write com.apple.commerce AutoUpdate -bool false
```

###### **7. 让更改生效**
```bash
killall SystemUIServer
```

---

##### **如何验证是否已禁用？**
可以使用以下命令检查设置：
```bash
defaults read /Library/Preferences/com.apple.SoftwareUpdate
```
如果 `AutomaticCheckEnabled = 0;` 说明已成功禁用更新检查。

---

##### **如何重新启用自动更新？**
如果你以后想恢复自动更新，可以使用以下命令：
```bash
sudo softwareupdate --schedule on
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled -bool true
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticDownload -bool true
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool true
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate CriticalUpdateInstall -bool true
defaults write com.apple.commerce AutoUpdate -bool true
killall SystemUIServer
```

这样 macOS 就会恢复默认的自动更新行为。

---

##### **总结**
- **方法 1**：适合一般用户，通过 GUI 设置禁用自动更新。
- **方法 2**：适合高级用户，使用终端命令彻底禁用自动更新和更新检测。

如果你只是想暂时禁用，建议使用 **方法 1**。如果想永久禁用并阻止 macOS 背景检测更新，推荐 **方法 2**。