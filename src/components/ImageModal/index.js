import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./styles.css";

export default function ImageModal({ src, alt, onClose }) {
    const [isLoading, setIsLoading] = useState(true);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // ESC键关闭弹窗
    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    // 图片加载完成
    const handleImageLoad = (event) => {
        setIsLoading(false);
        const { naturalWidth, naturalHeight } = event.target;
        setImageDimensions({ width: naturalWidth, height: naturalHeight });
    };

    // 点击背景关闭
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden"; // 禁止页面滚动

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [handleKeyDown]);

    if (typeof window === "undefined") return null; // SSR兼容

    return createPortal(
        <div className="image-modal-backdrop" onClick={handleBackdropClick}>
            <div className="image-modal-container">
                {isLoading && (
                    <div className="image-modal-loading">
                        <div className="loading-spinner"></div>
                        <p>加载中...</p>
                    </div>
                )}

                <img
                    src={src}
                    alt={alt}
                    className={`image-modal-img ${isLoading ? "hidden" : "visible"}`}
                    onLoad={handleImageLoad}
                    draggable={false}
                />

                <button className="image-modal-close" onClick={onClose} aria-label="关闭图片预览">
                    ✕
                </button>

                {!isLoading && (
                    <div className="image-modal-info">
                        <span>{alt || "图片"}</span>
                        <span className="image-dimensions">
                            {imageDimensions.width} × {imageDimensions.height}
                        </span>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
