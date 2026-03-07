"use client";

import Script from "next/script";

export function InstagramFeed() {
    return (
        <section className="py-16 md:py-24 bg-bg-main overflow-hidden">
            <div className="container">
                <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
                <div className="elfsight-app-3113a761-00d8-42e6-afba-ae4f7e2ee832 max-w-6xl mx-auto rounded-3xl overflow-hidden" data-elfsight-app-lazy></div>
            </div>
        </section>
    );
}
