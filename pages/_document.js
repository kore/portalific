import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/manifest.json' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#748e63' />
          <meta name='msapplication-TileColor' content='#748e63' />
          <meta name='theme-color' content='#748e63' />
        </Head>
        <body className='typography theme-transition'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
