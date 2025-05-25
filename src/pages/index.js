import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Home() {
    console.log("coming index.js...")
    return <Redirect to={useBaseUrl('docs/intro')} />;
}