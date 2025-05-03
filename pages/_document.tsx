import TabataTimer from '@/components/TabataTimer';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Link to the manifest */}
          <link rel="manifest" href="/manifest.json" />
          {/* Add icons and other meta tags as needed */}
          <link rel="icon" href="/icons/icon-192x192.png" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, user-scalable=no"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
