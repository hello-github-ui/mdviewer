import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common";
import "./styles.css";

export default function GiscusComments() {
    const { colorMode } = useColorMode();

    return (
        <div className="giscus-comments">
            <h3>💬 评论区</h3>
            <Giscus
                repo="hello-github-ui/mdviewer"
                repoId="R_kgDOMU21mw" // 需要替换为实际的 repoId
                category="General"
                categoryId="DIC_kwDOMU21m84CsqE0" // 需要替换为实际的 categoryId
                mapping="pathname"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={colorMode === "dark" ? "dark" : "light"}
                lang="zh-CN"
                loading="lazy"
            />
        </div>
    );
}
