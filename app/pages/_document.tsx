import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${
            process.env.NODE_ENV === "production"
              ? `/social-image-generator`
              : ""
          }/favicon-16x16.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${
            process.env.NODE_ENV === "production"
              ? `/social-image-generator`
              : ""
          }/favicon-32x32.png`}
        />
      </Head>
      <body data-color-mode="dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
