import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import GiscusComments from "../../../components/GiscusComments";

export default function LayoutWrapper(props) {
    return (
        <>
            <Layout {...props} />
            <GiscusComments />
        </>
    );
}
