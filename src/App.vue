<template>
    <el-container class="layout-container">
        <el-header class="header">
            <el-button
                :icon="btnIcon"
                @click="toggleSidebar"
                class="toggle-button"
                type="primary"
            ></el-button>
        </el-header>

        <el-container>
            <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
                <el-scrollbar>
                    <el-menu
                        :default-openeds="defaultOpeneds"
                        :default-active="activeIndex"
                        class="sidebar"
                        :collapse="isCollapse"
                        @select="handleSelect"
                    >
                        <template v-for="(item, index) in files" :key="item.path">
                            <el-sub-menu v-if="item.children && item.children.length" :index="index.toString()">
                                <template #title>
                                    <el-icon><Menu/></el-icon><span>{{ item.name }}</span>
                                </template>

                                <template v-for="(child, childIndex) in item.children" :key="child.path">
                                    <el-sub-menu v-if="child.children && child.children.length"
                                                 :index="index + '-' + childIndex">
                                        <template #title><span>{{ child.name }}</span></template>

                                        <template v-for="(subChild, subChildIndex) in child.children"
                                                  :key="subChild.path">
                                            <el-menu-item :index="subChild.path">
                                                {{ subChild.name.toString().replaceAll(".md", "") }}
                                            </el-menu-item>
                                        </template>
                                    </el-sub-menu>

                                    <el-menu-item v-else :index="child.path">
                                        {{ child.name.toString().replaceAll(".md", "") }}
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>

                            <el-menu-item v-else :index="item.path">
                                {{ item.name }}
                            </el-menu-item>
                        </template>
                    </el-menu>
                </el-scrollbar>
            </el-aside>

            <el-container>
                <el-main class="main">
                    <div id="editor">
                        <article id="view-area" class="markdown-body"></article>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import {Menu, ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue';

export default {
    components: {
        Menu, ArrowLeftBold, ArrowRightBold
    },
    data() {
        return {
            isCollapse: true,    // 侧边栏默认合并
            files: [],  // 读取 files.json 数据
            defaultOpeneds: [],  // 默认展开的菜单
            activeIndex: '',      // 当前激活的菜单项
            btnIcon: 'ArrowRightBold',
            isIcon: false,
        };
    },
    created() {
        this.loadFiles();
        this.loadSidebarState();    // 从 localStorage 读取菜单的展开和选中状态
    },
    methods: {
        async loadFiles() {
            try {
                const response = await axios.get('./files.json');
                this.files = response.data;
            } catch (error) {
                console.error('Error loading files:', error);
            }
        },
        toggleSidebar() {
            this.isCollapse = !this.isCollapse;
            // 跟新菜单的展开和选中状态
            this.saveSidebarState();
            // 更新icon
            this.isIcon = !this.isIcon;
            if (this.isIcon) {
                this.btnIcon = 'ArrowLeftBold'
            } else {
                this.btnIcon = 'ArrowRightBold'
            }
        },
        handleSelect(key, keyPath) {
            console.log(`key: ${key}, keyPath: ${keyPath}`)
            this.activeIndex = key;
            this.saveSidebarState();
            let file = "./文档/" + key;
            axios
                .get(file, {
                    headers: {
                        "Content-Type": "text/html; charset=utf-8"
                    },
                    withCredentials: true
                })
                .then(response => {
                    let md = response.data;
                    let dealMD = md.replaceAll(
                        "./assets/",
                        "./文档/" + key.substring(0, key.lastIndexOf("/")) + "/assets/"
                    );
                    let converter = new showdown.Converter();
                    converter.setOption("tables", true);
                    let viewHtml = converter.makeHtml(dealMD);
                    document.getElementById("view-area").innerHTML = viewHtml;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        saveSidebarState() {
            localStorage.setItem('sidebarState', JSON.stringify({
                isCollapse: this.isCollapse,
                defaultOpeneds: this.defaultOpeneds,
                activeIndex: this.activeIndex
            }));
        },
        loadSidebarState() {
            // 如果 localStorage 中存在之前保存的菜单的展开和选中状态，则删除掉
            const sidebarState = JSON.parse(localStorage.getItem('sidebarState'));
            if (sidebarState) {
                localStorage.removeItem('sidebarState');
                // 同时重置 菜单的展开和选中状态
                this.isCollapse = false;
                this.defaultOpeneds = [];
                this.activeIndex = '';
            }
        }
    }
}
</script>

<style scoped>
.layout-container {
    height: 100vh;
    overflow: hidden;
}

.header {
    background-color: #6bd2cf;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 56px;
}

.toggle-button {
    margin-left: 10px;
}

.sidebar {
    background-color: #6bd2cf;
    color: white;
    transition: width 0.3s;
    height: calc(100vh - 56px); /* Adjust height to fit screen */
}

.main {
    padding: 20px;
    background-color: #f0f2f5;
    height: calc(100vh - 56px); /* Adjust height to fit screen */
    overflow: auto;
}

#view-area {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 240px;
    min-height: 400px;
}

.el-scrollbar__wrap {
    background-color: transparent !important;
}

.el-menu {
    border-right: none;
}

.el-icon {
    margin-right: 10px;
}

.el-menu-item-group .el-menu-item {
    display: flex;
    align-items: center;
}
</style>
