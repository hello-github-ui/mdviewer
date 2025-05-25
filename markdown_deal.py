import os

# 目标目录路径
target_dir = r'D:\code\my-docs\docs\谷粒学院在线教育项目'

# 遍历目录及子目录下的所有文件
for root, _, files in os.walk(target_dir):
    for filename in files:
        if filename.endswith('.md'):
            file_path = os.path.join(root, filename)
            base_name = os.path.splitext(filename)[0]

            # 读取原始内容
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()

            # 准备插入的 Front Matter
            front_matter = f"""---\nid: {base_name}\ntitle: {base_name}\ntags: [尚硅谷]\n---\n\n"""

            # 检查是否已经存在 front matter
            if original_content.lstrip().startswith('---'):
                print(f"已存在 front matter，跳过：{file_path}")
                continue

            # 写入新的内容（覆盖原文件）
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(front_matter + original_content)

            print(f"已处理：{file_path}")