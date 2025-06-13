### Technical Analysis & Debugging Plan: `/create` Page Redirect Loop

**To:** Lead Developer, QA Team
**From:** Roo, Senior Full-Stack Developer
**Date:** June 13, 2025
**Subject:** Investigation of Intermittent Redirect Bug on `/create` Page

**1. Executive Summary**

This document outlines a diagnostic plan for a critical, intermittent bug on the `/create` page. After a user uploads a document, they are incorrectly redirected back to the upload step instead of proceeding to the model selection step. The bug's reappearance after an initial fix suggests a subtle root cause, likely related to client-side state management, race conditions with the backend, or improper use of browser storage.

The following analysis details the most probable causes, key files for inspection within our Next.js/React codebase, and specific, non-invasive debugging actions to pinpoint the failure. The primary suspects are the state handling in [`app/create/page.tsx`](app/create/page.tsx) and its interaction with the step components (e.g., [`components/steps/source-documents-step.tsx`](components/steps/source-documents-step.tsx)), as well as the logic that gates the transition between steps.

**2. Detailed Technical Analysis**

#### 2.1. Client-Side State Management

*   **Hypothesis:** The React state indicating a successful file upload (e.g., a file object, ID, or boolean flag) is being lost, reset prematurely, or is not available when the component re-renders to show the next step. This is the most likely cause, especially given the "works on the first try" behavior, which points to improper state cleanup or initialization on subsequent attempts.
*   **Key Files to Inspect:**
    *   [`app/create/page.tsx`](app/create/page.tsx): As the main container for the multi-step process, this file likely holds the primary state (e.g., `useState`, `useReducer`) that controls the current step and shared data.
    *   [`components/steps/source-documents-step.tsx`](components/steps/source-documents-step.tsx): The "Upload" component. We need to see how it signals a successful upload to its parent.
    *   [`components/steps/configuration-step.tsx`](components/steps/configuration-step.tsx): A likely candidate for the "Select Model" component. We need to see what props it receives and what conditions must be met for it to render.
    *   **State Management Files:** If using Zustand or Redux, inspect the relevant store/slice for any logic that might reset the creation state.
*   **Debugging Actions:**
    1.  **React DevTools:** Use the component inspector to watch the state variables in `CreatePage` and its children in real-time during the bug reproduction flow. Pay close attention to the state right before and right after the redirect occurs.
    2.  **Targeted Logging:** Add `console.log` statements inside `useEffect` hooks in [`app/create/page.tsx`](app/create/page.tsx) to trace the value of the file upload state. Log its value on initial render, after the upload completes, and in any dependency arrays that might trigger a re-render.
    3.  **Prop Drilling:** Verify that props are correctly passed from [`app/create/page.tsx`](app/create/page.tsx) down to the step components and that callback functions (`onUploadSuccess`, etc.) are correctly updating the parent's state.

#### 2.2. Client-Side Routing & Conditional Rendering

*   **Hypothesis:** The logic that conditionally renders the model selection step is incorrectly evaluating its condition on the second attempt, defaulting to the upload step. This is often a direct symptom of the state management issue described above.
*   **Key Files to Inspect:**
    *   [`app/create/page.tsx`](app/create/page.tsx): The core rendering logic (e.g., `if (step === 1) { ... } else if (step === 2) { ... }` or `!fileId ? <UploadComponent /> : <ModelComponent />`) resides here.
*   **Debugging Actions:**
    1.  **Examine Render Logic:** Scrutinize the conditional check. Is it checking for a boolean, a string, or the existence of an object? An incorrect check (e.g., checking for a truthy object that later becomes `null`) would explain the redirect.
    2.  **Analyze `useEffect` Hooks:** Look for any `useEffect` in [`app/create/page.tsx`](app/create/page.tsx) whose dependencies might trigger a state reset. For example, a dependency on a router object or a query parameter that changes unexpectedly could cause the component to revert to its initial state.
    3.  **Check Navigation Calls:** While less likely in this component-based switching flow, ensure no programmatic navigation (`useRouter().push('/create')`) is being triggered by mistake.

#### 2.3. Backend API & Session Management

*   **Hypothesis:** A race condition exists where the frontend navigates to the model selection step before the backend has fully processed the upload and confirmed its status. A subsequent API poll for the status then returns "pending" or "failed," causing the UI to revert to the upload step.
*   **Key Files to Inspect:**
    *   **Next.js Route Handlers (e.g., `app/api/upload/route.ts`)**: Inspect the backend logic that handles the file upload and status updates. (Assuming standard Next.js API routing).
    *   [`components/steps/source-documents-step.tsx`](components/steps/source-documents-step.tsx): Analyze the code that performs the `fetch` or `axios` call to the upload endpoint.
*   **Debugging Actions:**
    1.  **Browser Network Tab:** During the bug reproduction, filter for `fetch/XHR` requests. Inspect the API call that uploads the file and any subsequent calls to a `/api/status` endpoint. Check the exact response body and HTTP status code. Does the frontend wait for a definitive "success" response before proceeding?
    2.  **Review Backend Session Logic:** Confirm how the uploaded file is associated with the user session. If this link is weak or expires, the status check might fail to find the file, leading the frontend to believe no upload occurred.
    3.  **Simulate Latency:** Use browser devtools to throttle the network speed. This can often make race conditions easier to reproduce consistently.

#### 2.4. Local Storage / Session Storage

*   **Hypothesis:** State is being persisted to browser storage, but it is either being cleared incorrectly or a stale value is being read during the second attempt, leading to an inconsistent state that triggers the redirect.
*   **Key Files to Inspect:**
    *   [`lib/utils.ts`](lib/utils.ts): Check for any utility functions that wrap `localStorage` or `sessionStorage`.
    *   **Global Search:** Perform a project-wide search for `localStorage` and `sessionStorage` to find all interaction points.
*   **Debugging Actions:**
    1.  **Browser Application Tab:** Monitor `localStorage` and `sessionStorage` in real-time. Watch the relevant keys as you perform the first successful run and then the second failing run. Note when keys are added, modified, or deleted.
    2.  **Code Review:** Look for any code that might be clearing storage globally (`localStorage.clear()`) or removing the specific item (`removeItem()`) at an inappropriate time, such as in a layout component's cleanup effect.

**3. User Interface Test Plan**

This test plan is designed for QA to execute, focusing on reliably reproducing the bug and testing related edge cases.

| Test Case ID | Description | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-01 | **Happy Path** | 1. Navigate to `/create`. 2. Upload a valid document. 3. Select a model. 4. Submit for processing. | User successfully navigates through all steps without being redirected. |
| TC-02 | **Bug Reproduction** | 1. Navigate to `/create`. 2. Upload a valid document. 3. Wait for the UI to show the model selection step. 4. Click to select a model. | User is redirected back to the document upload step. |
| TC-03 | **Repeat Flow** | 1. Successfully complete the flow once (as in TC-01). 2. Without refreshing, navigate back to `/create` and attempt the flow a second time. | User successfully navigates through all steps on the second attempt. |
| TC-04 | **Page Refresh** | 1. Navigate to `/create`. 2. Upload a valid document. 3. Once the model selection UI is visible, refresh the page. | The application should either persist the uploaded state and remain on the model selection step or gracefully return to the upload step. |
| TC-05 | **Browser Navigation** | 1. Navigate to `/create`. 2. Upload a valid document. 3. Once the model selection UI is visible, use the browser's back button, then the forward button. | The application state should be correctly restored, keeping the user on the model selection step. |
| TC-06 | **Different File Types** | 1. Repeat TC-02 with various supported file types (e.g., .pdf, .docx, .txt). | The bug's occurrence should be consistent or noted if it's file-type dependent. |
| TC-07 | **Invalid Action** | 1. Navigate to `/create`. 2. Attempt to access the model selection step directly (e.g., via URL manipulation if possible) without uploading a document. | The user should be properly firewalled at the upload step. |


---

Error: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <HotReload assetPrefix="" globalError={[...]}>
      <AppDevOverlay state={{nextId:1, ...}} globalError={[...]}>
        <AppDevOverlayErrorBoundary globalError={[...]} onError={function bound dispatchSetState}>
          <ReplaySsrOnlyErrors>
          <DevRootHTTPAccessFallbackBoundary>
            <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
              <HTTPAccessFallbackErrorBoundary pathname="/create" notFound={<NotAllowedRootHTTPFallbackError>} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <Head>
                    <link>
                    <RootLayout>
                      <html lang="en">
                        <body
-                         data-new-gr-c-s-check-loaded="14.1107.0"
-                         data-gr-ext-installed=""
                        >
                    ...
        ...

    at createUnhandledError (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/errors/console-error.js:27:71)
    at handleClientError (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/errors/use-error-handler.js:45:56)
    at console.error (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/globals/intercept-console-error.js:47:56)
    at eval (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:13502:19)
    at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:1511:30)
    at emitPendingHydrationWarnings (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:13501:9)
    at completeWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:13662:18)
    at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:1514:13)
    at completeUnitOfWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:15256:19)
    at performUnitOfWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:15137:11)
    at workLoopConcurrentByScheduler (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:15114:9)
    at renderRootConcurrent (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:15089:15)
    at performWorkOnRoot (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:14410:13)
    at performWorkOnRootViaSchedulerTask (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:16275:7)
    at MessagePort.performWorkUntilDeadline (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/scheduler/cjs/scheduler.development.js:45:48)
    at body (<anonymous>)
    at RootLayout (rsc://React/Server/webpack-internal:///(rsc)/./app/layout.tsx?0:19:94)