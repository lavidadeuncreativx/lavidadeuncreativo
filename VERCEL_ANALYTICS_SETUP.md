# Getting Started with Vercel Web Analytics

This guide explains how to set up and use Vercel Web Analytics on your project. Follow the steps below to enable tracking, deploy your app, and view your analytics data in the Vercel dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, install it using:

```bash
npm i vercel
# or
yarn i vercel
# or
pnpm i vercel
# or
bun i vercel
```

## Step 1: Enable Web Analytics in Vercel

1. Go to the [Vercel dashboard](/dashboard)
2. Select your Project
3. Click the **Analytics** tab
4. Click **Enable** in the dialog

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Step 2: Add Analytics to Your Project

### For Static HTML Sites

For plain HTML sites, add the following scripts to your `.html` files in the `<head>` section:

```html
<!-- Vercel Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>

<!-- Vercel Speed Insights (Optional) -->
<script defer src="/_vercel/speed-insights/script.js"></script>
```

**Note:** When using the HTML implementation, there is no need to install the `@vercel/analytics` package. However, there is no route support.

### For Framework-Based Projects

#### Next.js (Pages Router)

If you are using the `pages` directory, add the `@vercel/analytics` package:

```bash
npm i @vercel/analytics
```

Then add the following code to your main app file:

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

#### Next.js (App Router)

For Next.js 13+, add the following code to your root layout:

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### React (Create React App)

Install the package:

```bash
npm i @vercel/analytics
```

Add to your main app file:

```tsx
// App.tsx
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* Your content */}
      <Analytics />
    </div>
  );
}
```

#### Remix

Install the package:

```bash
npm i @vercel/analytics
```

Add to your root file:

```tsx
// app/root.tsx
import { Analytics } from "@vercel/analytics/remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

#### Vue.js

Install the package:

```bash
npm i @vercel/analytics
```

Add to your main component:

```vue
<!-- App.vue -->
<script setup>
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- Your content -->
</template>
```

#### Svelte/SvelteKit

Install the package:

```bash
npm i @vercel/analytics
```

Add to your main layout:

```ts
// src/routes/+layout.ts
import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });
```

#### Nuxt

Install the package:

```bash
npm i @vercel/analytics
```

Add to your main component:

```vue
<!-- app.vue -->
<script setup>
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

#### Astro

For Astro 4.3.0+, install the package:

```bash
npm i @vercel/analytics
```

Add to your base layout:

```astro
---
import Analytics from '@vercel/analytics/astro';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Site</title>
    <Analytics />
  </head>
  <body>
    <slot />
  </body>
</html>
```

For earlier versions of Astro, configure the Vercel adapter in your `astro.config.mjs`:

```mjs
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
```

#### Other Frameworks

For other frameworks, import and call the `inject` function:

```js
// main.js
import { inject } from "@vercel/analytics";

inject();
```

**Note:** There is no route support with the `inject` function.

## Step 3: Deploy Your App

Deploy your app using the Vercel CLI:

```bash
vercel deploy
```

Or, connect your project's Git repository to enable automatic deployments:

```bash
vercel link
# This connects your Git repository
```

Once your app is deployed, it will start tracking visitors and page views automatically.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request to `/_vercel/insights/view` in your browser's Network tab when you visit any page.

## Step 4: View Your Analytics Data

Once your app is deployed and users have visited your site:

1. Go to your [Vercel dashboard](/dashboard)
2. Select your project
3. Click the **Analytics** tab

After a few days of visitor activity, you'll be able to explore your data by viewing and filtering panels.

Users on Pro and Enterprise plans can also:
- Add [custom events](/docs/analytics/custom-events) to track user interactions (button clicks, form submissions, purchases, etc.)
- Access more detailed filtering and reporting features

## Implementation in This Project

This project is a static HTML site and uses the plain HTML implementation of Vercel Web Analytics. The analytics script is included in both `index.html` and `blog-post.html` in the following way:

```html
<!-- Vercel Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>

<!-- Vercel Speed Insights -->
<script defer src="/_vercel/speed-insights/script.js"></script>
```

This lightweight implementation:
- Requires no npm package installation
- Tracks page views and user interactions automatically
- Sends data to Vercel's analytics endpoints
- Works seamlessly with static HTML sites

## Next Steps

Now that you have Vercel Web Analytics set up, explore these topics:

- [Learn more about the `@vercel/analytics` package](https://github.com/vercel/analytics)
- [Set up custom events](/docs/analytics/custom-events)
- [Filter and analyze your data](/docs/analytics/filtering)
- [Privacy and compliance information](/docs/analytics/privacy-policy)
- [Analytics pricing and limits](/docs/analytics/limits-and-pricing)
- [Troubleshooting guide](/docs/analytics/troubleshooting)

## Resources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [Web Analytics Pricing](https://vercel.com/pricing/analytics)
- [Vercel Community](https://vercel.com/help)
