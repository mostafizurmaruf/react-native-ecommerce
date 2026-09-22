# React Native E-Commerce App (My First Project)

Hi! I am quite new to React Native. This is my very first project with it, I started from the official Expo template and built the store system on
top of it piece by piece. I ran into a lot of problems, and I fixed them one by one.

You will find my honest engineering reflection at the bottom of this file.

## What I built

A small e-commerce (shopping) app with:

- Login / logout flow (splash screen -> login -> home -> logout back to splash)
- Product catalog with images and prices
- Search, category filter, and sort (newest / old / price)
- Infinite scroll (loads 20 more products as you scroll)
- Product detail page with quantity picker
- Cart: add, remove, change quantity, see total price
- Demo checkout -> order confirmation screen
- Floating cart button on the home screen

## Engineering reflection (challenges and solutions)

### Architectural challenges I faced

**1. Keeping the user logged in after the app is restarted.**

I needed the session to survive app restarts, but I also had to make sure an old
or invalid token does not leave the app stuck on a half-broken logged-in state.

**2. Cart state vs the server.**

The cart lives in memory, but the mock server also stores a cart. Quantities should
never go below 1 or above the product stock. Also, when a screen unmounts, an old
async update must not call `setState` anymore (a common React error).

### How I solved them

**Solution 1 - Safe session storage (`src/lib/token-storage.ts`, `src/context/auth-context.tsx`)**

- Tokens are saved in `expo-secure-store`.
- On app start, the context reads them, then calls the API's "current user" with
  that token (`rehydrate`).
- If the token is invalid (401), I delete it and mark the user logged out.
- While state is still `loading`, I show a loading screen, so the user never sees
  the wrong screen flash for a moment.

**Solution 2 - Cart sync without crashes (`src/context/cart-context.tsx`, `src/lib/cart.ts`)**

- The UI updates "optimistically" (fast), and the server sync runs in the
  background. If the sync fails, the local cart stays because it is a mock server.
- Quantity is clamped between 1 and the product stock.
- Each fetch effect sets a `cancelled` flag and skips `setState` after unmount.

## Final note

I know I still have a lot to learn. With this project I tried to show that I can
take a feature, break it into small parts, solve problems step by step, and finish
the whole thing. I am comfortable learning new tools quickly, and I am excited to
keep building with React Native.

---

_This README documents my own work on this project (my first React Native app)._
