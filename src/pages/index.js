import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function Home() {
    console.log("coming index.js...")
    return <Redirect to="/docs/intro" />;
}