import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wall calendar",
  description: "Interactive wall calendar with notes, ranges, and holidays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="filter-extension-dev-errors" strategy="beforeInteractive">
          {`
(function () {
  if (typeof window === "undefined") return;
  function extUrl(s) {
    return typeof s === "string" && /-extension:\\/\\//i.test(s);
  }
  function swallowRejection(reason) {
    if (reason == null) return false;
    var stack = reason.stack || "";
    if (/-extension:\\/\\//i.test(stack)) {
      return true;
    }
    var msg = (reason.message != null ? String(reason.message) : String(reason)) || "";
    if (/MetaMask|metamask/i.test(msg) && (/extension/i.test(msg) || /not found/i.test(msg))) {
      return true;
    }
    if (/Failed to connect to MetaMask/i.test(msg)) return true;
    return false;
  }
  window.addEventListener(
    "error",
    function (ev) {
      if (extUrl(ev.filename)) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    },
    true,
  );
  window.addEventListener(
    "unhandledrejection",
    function (ev) {
      if (swallowRejection(ev.reason)) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    },
    true,
  );
})();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
