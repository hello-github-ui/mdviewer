import os

# 目标目录路径
target_dir = r'D:\code\my-docs\docs\个人博客'

# 遍历目录下的所有文件
for filename in os.listdir(target_dir):
    # 检查是否为 Markdown 文件
    if filename.endswith('.md'):
        file_path = os.path.join(target_dir, filename)
        base_name = os.path.splitext(filename)[0]

        # 读取原始内容
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # 准备插入的 Front Matter
        front_matter = f"""---\nid: {base_name}\ntitle: {base_name}\ntags: [个人博客]\n---\n\n"""

        # 检查是否已经存在 front matter，避免重复添加（可选）
        if original_content.lstrip().startswith('---'):
            print(f"已存在 front matter，跳过：{filename}")
            continue

        # 写入新的内容（覆盖原文件）
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(front_matter + original_content)

        print(f"已处理：{filename}")
