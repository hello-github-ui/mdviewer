import React, { useState } from "react";
import MDXComponents from "@theme-original/MDXComponents";
import ImageModal from "../../components/ImageModal";

// 自定义图片组件
function CustomImg(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = (event) => {
        event.preventDefault();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <img
                {...props}
                onClick={handleImageClick}
                style={{
                    ...props.style,
                    cursor: "zoom-in",
                    borderRadius: "8px",
                    transition: "box-shadow 0.2s ease, filter 0.2s ease",
                    imageRendering: "auto",
                }}
                onMouseEnter={(e) => {
                    e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)";
                    e.target.style.filter = "brightness(1.05)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    e.target.style.filter = "brightness(1)";
                }}
                title="点击查看大图"
            />

            {isModalOpen && <ImageModal src={props.src} alt={props.alt} onClose={handleCloseModal} />}
        </>
    );
}

export default {
    ...MDXComponents,
    img: CustomImg,
};
