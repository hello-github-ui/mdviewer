import os
import json

def generate_file_structure(root_dir):
    def traverse_dir(directory, parent_path=""):
        folder_structure = []
        for item in sorted(os.listdir(directory)):
            item_path = os.path.join(directory, item)
            relative_path = os.path.join(parent_path, item)

            # 跳过 "assets" 和含有“随堂笔记”字样的目录
            if item == "assets" or "随堂笔记" in item:
                continue

            if os.path.isdir(item_path):
                children = traverse_dir(item_path, relative_path)
                if children:  # 仅在有子项时添加目录
                    folder_structure.append({
                        "name": item,
                        "path": relative_path.replace("\\", "/"),
                        "children": children,
                        "open": False
                    })
            elif item.endswith(".md"):
                folder_structure.append({
                    "name": item,
                    "path": relative_path.replace("\\", "/")
                })
        return folder_structure

    structure = traverse_dir(root_dir)
    return structure

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

public_directory = "C:\\Users\\EDY\\code\\mdviewer\\public"
root_directory = public_directory + "\\文档\\"  # 请根据实际情况修改目录
output_file = public_directory + "\\files.json"

file_structure = generate_file_structure(root_directory)
save_to_json(file_structure, output_file)
print(f"File structure saved to {output_file}")
