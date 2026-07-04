# Suntek Designs — Premium Redesign PRD

## Problem Statement
Redesign https://suntekdesigns.com/ (Singapore interior design & renovation, est. 2007) as a premium, minimal, immersive, cinematic marketing website. Warm ivory / charcoal palette, editorial typography, subtle motion, working contact form with database + email notifications.

## Architecture
- Frontend: React 19 + Tailwind + Framer Motion + Lenis smooth scroll + Sonner toasts
- Backend: FastAPI + Motor (MongoDB) + Emergent-managed Resend email
- Fonts: Cormorant Garamond (headings), Outfit (body)

## User personas
- Homeowner researching renovators for HDB / condo / landed home
- Commercial client scoping fit-out or retail renovation
- Existing referral looking for contact / WhatsApp / studio address

## Core requirements (static)
- Warm luxury aesthetic, no SaaS gradients, no glassmorphism-everywhere
- Editorial typography, big spacing, restrained motion
- Working contact form → MongoDB + email → Suntek team
- WhatsApp CTA everywhere
- Fully responsive + prefers-reduced-motion respected

## What's been implemented (2025-12)
- Cinematic 360° panorama hero with scroll-driven horizontal camera pan and 4 phased captions
- Introduction with editorial typography + animated count-up stats
- Selected Projects — desktop cinematic horizontal scroll (6 real projects), mobile stack
- Services — desktop hover-reveal list with sticky image, mobile shadcn accordion
- Why Suntek — asymmetric editorial layout with parallax image
- Process — scroll-driven vertical timeline with animated bronze progress line
- Before / After — draggable clip-path slider
- Testimonials — editorial carousel (5 real testimonials from source site)
- Cinematic CTA — full-viewport image, zoom-out on scroll, WhatsApp CTA
- Contact form — 8 fields + honeypot, client + server validation, MongoDB persistence, Emergent Resend email notification, success + error states, sonner toasts
- Footer — giant Suntek wordmark, real Singapore addresses, socials
- WhatsApp floating CTA

## Testing status
- Backend: 8/8 tests passing (`/app/backend/tests/backend_test.py`)
- Frontend: all interactive flows verified
- Email: verified sending via Resend proxy (HTTP 202)

## P0 backlog (post-first-finish)
- Individual project detail pages with image galleries
- Blog / journal section for SEO
- Admin dashboard for viewing / managing enquiries

## P1 backlog
- WebP / responsive srcset for Unsplash images (already delivered as ivory-optimised)
- Structured data (LocalBusiness JSON-LD) for SEO
- Full projects catalogue (currently 6 featured)
