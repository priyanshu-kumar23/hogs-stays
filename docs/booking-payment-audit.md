# HOGS Stays: Booking and Payment Audit

Date: 10 October 2026
Scope: The whole website (code only, nothing was changed).
Purpose: Find out where, if anywhere, Razorpay is needed.

---

## 1. The short answer

- **Room bookings already take payment through Aiosell.** Razorpay is not needed for rooms.
- **The website has no payment code at all.** There is no Razorpay, Stripe, Paytm, PhonePe or UPI code anywhere in the project. The only payment-related words are in the written policies.
- **The website shows no prices anywhere.** Room rates are on Aiosell. Packages say "Price on request". The cafe menu and ordering live on Petpooja.
- **Razorpay would only make sense for things Aiosell does not cover.** The main one is **Manali packages**, which today are only a "request a quote" form. A cafe table deposit or add-ons would be optional extras.
- **Razorpay has nothing to connect to yet.** For any payment to work, the site first needs a server route to create the payment, a way to confirm it, and somewhere to store orders. See section 6.

---

## 2. Every booking button on the site

"Aiosell" below means the one link `https://be.aiosell.com/book/5b1f04b124` (it opens in a new tab and currently loads fine).

| Page | Button / Feature | Currently goes to | Needs payment? |
|---|---|---|---|
| Every page (top bar, desktop) | **Book Now** | Aiosell (new tab) | No (Aiosell handles it) |
| Every page (mobile menu) | **Book Your Stay** | Aiosell (new tab) | No |
| Every page (mobile sticky bar, after scrolling) | **Book Now** | On Panorama pages: Aiosell. On package pages: the "Request to book" form. On every other page: the `/book` enquiry form | Mixed. See notes |
| Every page (mobile sticky bar) | WhatsApp icon | `https://wa.me/919251115478` | No |
| Every page (mobile floating bubble) | WhatsApp chat | WhatsApp | No |
| Home | Hero: **Book your stay** | `/book` (enquiry form, **not** Aiosell) | No |
| Home | Stays section, HOGS Panorama card: **Book this stay** | Aiosell (new tab) | No |
| Home | Stays section, cafe card: **Visit the Cafe** and **Get directions** | `/cafe` and Google Maps | No |
| Home | Booking teaser: **Plan your stay** | `/book` | No |
| Home | Booking teaser: **Continue on WhatsApp** | WhatsApp | No |
| Home | Booking teaser: phone and email links | `tel:+919251115478` and `mailto:info@hogsstays.com` | No |
| `/book` | Enquiry form: **Enquire About Your Stay** | Sends an email to the owner through Resend. If email is not set up, the page says to use WhatsApp or call | No |
| `/book` | **Continue on WhatsApp** | WhatsApp with the form details pre-filled | No |
| `/stays` | **Explore the stay** and **Visit the Cafe** | `/stays/panorama` and `/cafe` | No |
| `/stays` | **Book this stay** (Panorama row) | The package "Request to book" sheet (not Aiosell) | Ask client |
| `/stays` | **Plan my Panorama escape** | The same "Request to book" sheet | Ask client |
| `/stays/panorama` | **Book this stay** (hero and bottom banner) | Aiosell (new tab) | No |
| `/stays/panorama` | **Questions? Enquire on WhatsApp** and the floating **Enquire** pill | A 3-step enquiry panel that opens WhatsApp (or email) with a pre-filled message | No |
| `/stays/panorama` (each room card: Valley View, Signature View, Premium, Jacuzzi) | **Book now** | **The same generic Aiosell link** for every room | No |
| `/stays/panorama` (each room card) | **View room** | That room's own page | No |
| `/stays/panorama/valley-view`, `/signature-view`, `/premium` and `/jacuzzi-room` | **Book this room** (hero) | **The same generic Aiosell link** | No |
| Same four room pages | **Book {room name}** (bottom banner), **Live rates on the booking page** | The same generic Aiosell link | No |
| Same four room pages | **Questions? Enquire on WhatsApp**, **Enquire** pill | WhatsApp or email panel with the room pre-selected | No |
| `/packages` | **View itinerary** (each package card) | The package's own page | No |
| `/packages` | **Enquire** (each card) | The package page, which opens the "Request to book" sheet | **Yes / Ask client** |
| `/packages` | **Chat on WhatsApp** and **Plan your stay** | WhatsApp and `/book` | No |
| `/packages/{slug}` (all 5 packages) | **Book this journey**, **Start your booking request**, sticky **Book Now**, drawer **Book this journey** | The "Request to book" sheet (4 steps). It sends an email and offers WhatsApp or email as a fallback. It says "Nothing is booked or charged" | **Yes / Ask client** |
| `/packages/{slug}` | **Ask on WhatsApp** | WhatsApp with the package name | No |
| `/cafe` | **View menu & order** and the **Scan. Order. Do nothing.** QR code | `https://dinein.petpooja.com/qr/fkjin5o9m8/Lobby` (Petpooja, not built by us) | Ask client |
| `/cafe` | **Reserve a table** | WhatsApp with "I'd like to reserve a table" | Ask client (deposit?) |
| `/cafe` | **Get directions** | Google Maps | No |
| `/about`, `/features` | **Book now** | `/book` (enquiry form) | No |
| `/gallery` | **Book your stay** | `/book` | No |
| Footer (every page) | **Book Now** | On Panorama pages: Aiosell. On other pages: `/book` | No |
| Footer | Phone, email, Instagram, policy links | `tel:`, `mailto:`, Instagram, policy pages | No |
| Policy pages | Phone, WhatsApp, email | `tel:`, WhatsApp, `mailto:` | No |

Notes:
- **Nothing on the site is a "nowhere" or placeholder button.** Every button goes somewhere real.
- There are **three different "Book" paths**: Aiosell, the `/book` email form, and the package "Request to book" sheet. Guests could be confused about which one is the real booking. See section 5.

---

## 3. Aiosell: one link or one per room?

- **There is only one Aiosell link on the whole site**, used by every property and every room. It lives in `lib/content.ts`, and `lib/rooms.ts` only mentions it in a comment.
- The Valley View, Signature View, Premium and Jacuzzi rooms all send the guest to the **same Aiosell page**. The room name on the button is only a label. The guest still has to pick the room again inside Aiosell.
- The "Jacuzzi Room" is a normal room page and uses the same link as the others.
- The link was tested and loads correctly (HTTP 200). There are no broken or placeholder Aiosell links.
- **Only HOGS Panorama is bookable.** The cafe is correctly marked as "not bookable".

If the client wants each room to open directly on its own room in Aiosell, we would need Aiosell's room-level links, if Aiosell offers them.

---

## 4. Things Aiosell does not cover

### Packages (Manali, Manali–Kasol, Shimla–Manali and others)
- There are **5 packages**. Every price says **"Price on request"**.
- A guest fills the 4-step "Request to book" sheet. It emails the owner (via Resend), with WhatsApp or email as a fallback. The wording says **"A request, not a booking. Nothing is charged."**
- The owner replies with a personal quote, so there is **no online payment today**.
- The site has no package prices and no description of what is included. Those questions are still marked "TODO" in the FAQ.

### Cafe DO NTHNG
- **Menu and ordering:** done by **Petpooja** (a separate restaurant system, opened by the "View menu & order" button and the QR code). We do not control payment there. Petpooja may have its own payment option, so ask the client.
- **Menu on our site:** no items and no prices. It shows three photos and the note "full menu is coming soon". The three menu cards still show placeholder text like **"TODO: mocktail name"** (see section 5).
- **Table booking:** "Reserve a table" opens WhatsApp. There is no deposit and no form.

### Enquiry and contact forms: where do submissions go?
| Form | Where it goes |
|---|---|
| `/book` enquiry form | Email to the owner via Resend (needs email set up first). WhatsApp as a fallback |
| Package "Request to book" sheet | Email to the owner via Resend. WhatsApp or email as a fallback |
| Panorama and room "Enquire" panel | Opens WhatsApp (or the guest's email app). **Nothing is saved on our side** |
| Cafe "Reserve a table" | WhatsApp |

Nothing is stored in a database. If WhatsApp or email fails, the enquiry is lost.

### Anything else with a price
- **No add-ons, experiences, gift vouchers, events or merchandise are sold on the site.**
- Meal plans are listed (Breakfast, Breakfast + Lunch) with **no prices**. The room pages say "Early check-in or late check-out may be chargeable".
- Live music sessions at the cafe are only mentioned ("ask us").

---

## 5. Razorpay: where it could be used and where it should not

### Should NOT use Razorpay
- **Room bookings on HOGS Panorama.** Aiosell is the booking engine and already takes the payment (as described on the site's "Secure booking" label). A second payment system would risk double charges and a confusing guest experience, and it would not update Aiosell's availability.
- **All the room "Book now" buttons.** Keep them going to Aiosell.

### Could use Razorpay (needs the client's decision)
1. **Manali packages: advance deposit or full payment.** This is the clearest fit. Today it is a quote request, so after the owner sends a quote, a Razorpay payment link or checkout could collect the advance.
2. **Cafe table-reservation deposit** (optional), for example for groups or special evenings.
3. **Cafe ordering.** Only if the client wants to leave Petpooja. Probably not worth it, because Petpooja already does this.
4. **Future extras** such as add-ons (for example bonfire or cab pickup), gift vouchers or events. None exist today.
5. **Staged payments for room stays (40% / 30% / 30%).** The policies describe this schedule. Ask whether Aiosell actually collects it or whether the team collects the rest by hand (see questions). If it is collected by hand, **Razorpay Payment Links** could be used by the team without building anything on the site.

**Simplest option:** Razorpay **Payment Links**, which the team sends on WhatsApp after agreeing a package quote. It needs no new website code, only the Razorpay account.

---

## 6. Existing payment code and what a payment flow would need

### Search results for the payment keywords
| Keyword | Result |
|---|---|
| razorpay, rzp_ | **No matches** |
| stripe, paytm, phonepe | **No matches** |
| checkout, payment, upi | Only matches in written policy text and a few date field names (such as "check-out"), plus one note in `docs/cafe-redesign.md`. **No payment code** |
| aiosell | The one booking link in `lib/content.ts` and comments in `lib/rooms.ts` and a few components |
| `package.json` | No payment library installed (the only service library is `resend`, for email) |

### Environment files
- **No `.env` or `.env.local` file exists** in the project folder. Only `.env.example` exists, and it is in the repository.
- Variable names in `.env.example`: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `BOOKING_EMAIL`, `BOOKING_FROM_EMAIL`. **None is payment-related.**
- `.gitignore` **does** ignore `.env`, `.env.local` and `.env*` (except `.env.example`). No env file was ever committed.
- So the Razorpay keys the client shared are not stored anywhere in the project. **Keep it that way:** keys must go in `.env.local` (and the hosting provider's settings), never in the code. Do not paste the **secret** key into chat, email or the repository.

### Policy pages (Razorpay asks for these)
| Page | Exists? | Address |
|---|---|---|
| Terms & Conditions | Yes | `/terms-conditions` |
| Privacy Policy | Yes | `/privacy-policy` |
| Cancellation & Refund Policy | Yes | `/cancellation-refund-policy` |
| House Rules & Guest Guidelines | Yes | `/house-rules-guest-guidelines` |
| FAQs | Yes | `/faqs` |
| **Contact page** | **No separate page.** Contact details are in the footer and at the bottom of each policy page | n/a |

The policies already mention a 40% / 30% / 30% payment schedule, partial refunds with processing charges, and a non-refundable period from 23 Dec to 1 Jan. Refunds are promised "within 7 to 10 working days". The policies also mention payments by "UPI, bank transfer, or payment gateway links provided by HOGS", which already matches a Razorpay setup. The Privacy Policy says card details are not stored.

### Backend (what exists and what is missing)
| Item | Status |
|---|---|
| API routes | **2 exist:** `/api/booking` (stay enquiry email) and `/api/package-enquiry` (package request email) |
| Email service | **Resend** is used, but needs `RESEND_API_KEY`, `BOOKING_FROM_EMAIL` and `BOOKING_EMAIL` plus a verified domain. Without them, the forms answer "email is not available" and point to WhatsApp |
| Database | **None.** Nothing is saved |
| Payment routes (create order, verify payment, webhook) | **None** |
| Order or payment records | **None** |
| Spam and rate protection | **None** (the README says to add this at hosting level before launch) |
| Customer login or accounts | **None** |

To add Razorpay checkout for packages, the work would be roughly: create a payment order on the server, show Razorpay Checkout, verify the payment signature, handle Razorpay's webhook, store the order, send a confirmation, and handle refunds. Razorpay Payment Links need none of this.

---

## 7. Anything broken, missing or inconsistent

1. **Three different "Book" experiences.** The navbar and room pages go to Aiosell. The home hero, gallery, about and features pages go to the `/book` email form. The `/stays` page and packages use the "Request to book" sheet. The home page even has **two different Book buttons** pointing to different places (hero to `/book`, Stays card to Aiosell). A guest could think an email enquiry is a real booking.
2. **Mobile sticky "Book Now" and the navbar disagree.** On the same page, the top bar goes to Aiosell and the sticky bar goes to `/book` (except on Panorama pages).
3. **`/stays` "Book this stay" does not go to Aiosell.** It opens the package request sheet, even though the wording is "Book this stay".
4. **All rooms share one Aiosell link.** The guest has to choose the room again on Aiosell.
5. **Email may not work yet.** Without the Resend settings, `/book` and the package form cannot send email. Guests only see an error and a WhatsApp suggestion. This must be set up and tested before launch.
6. **No saved record of enquiries.** If an email or WhatsApp message is missed, the enquiry is lost.
7. **Cafe menu placeholders.** The three menu cards show text such as **"TODO: mocktail name"** and **"TODO: mocktail description"**. The cafe address is also a placeholder ("Cafe DO NTHNG, Manali") and the packages FAQ has several "TODO" answers.
8. **No Contact page.** Razorpay asks for a clear Contact Us page (address, phone, email). The details exist but not on a page of their own.
9. **No business name or address block.** Policies show HOGS Stays, phone and email, but no registered business name or full postal address in one place. Razorpay's review usually checks this.
10. **Staged payments (40/30/30) unclear.** Aiosell may only collect one amount online. The policies say the balance is paid in two later steps, but the site does not say how.
11. **A large file sits in the public folder.** `public/images/OneDrive_2026-10-09.zip` is not ignored by git. If it is committed and deployed, **anyone could download it from the live site.** Move it out of `public/` before the next commit or deploy. Several new, unused photos are also in `public/images/` and have not been committed yet.
12. **Package prices and inclusions are not published.** Guests cannot compare packages, so a payment step would have no amount to charge until prices are agreed.

---

## 8. Questions to ask the client

**About rooms and Aiosell**
1. Does Aiosell collect the **full payment** online, or only the **advance (40%)**? How is the remaining 30% + 30% collected?
2. Is the client happy that **room payments stay entirely in Aiosell** and Razorpay is not used for rooms?
3. Does Aiosell offer a **separate link for each room**, so the room buttons can open the right room directly?

**About packages**
4. Should guests **pay online** for packages, or should it stay a **request, quote and then pay** process?
5. If online: should they pay the **full price** or an **advance deposit** (and how much)?
6. Can we publish **package prices** ("from ₹...") or do they stay "on request"? What does each price include?
7. Is a **Razorpay Payment Link** sent on WhatsApp after the quote enough, or does the client want checkout built into the website?

**About the cafe**
8. Is the cafe happy with **Petpooja** for menu and ordering, or should payment be added to the website?
9. Should **table reservations** stay on WhatsApp, or need a **deposit**?
10. Can they send the real **menu items and prices** and the cafe's **full street address**?

**About other things**
11. Does the client plan to sell **anything else online** (add-ons like bonfire or cab pickup, gift vouchers, events)?
12. Who should receive enquiry emails (**which email address**), and is the Resend email account set up? Should enquiries also be saved somewhere (a sheet, CRM or the team's WhatsApp number)?

**About the Razorpay account**
13. Is the Razorpay account **live or still in test mode**? (Test keys have `rzp_test_`; live keys have `rzp_live_`.) Please do not send the **secret** key by chat or email.
14. Can they confirm the **legal business name, registered address, GST details (if any) and a Contact Us page** for Razorpay's review?
15. Are the refund timeline (7 to 10 working days) and the cancellation rules in the policies final? Razorpay checks that the website matches the account.
