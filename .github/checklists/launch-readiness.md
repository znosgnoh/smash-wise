# Launch Readiness Checklist

Use this before any public release or major deployment.

## Product
- [ ] Core user flow works end-to-end without errors
- [ ] All routes load without errors
- [ ] Animations play smoothly
- [ ] Empty states handled gracefully
- [ ] Copy and terminology consistent throughout UI

## Technical
- [ ] `pnpm build` succeeds with zero errors
- [ ] `pnpm lint` passes with zero warnings
- [ ] No hardcoded localhost URLs or dev-only configurations
- [ ] Environment variables documented and set for production
- [ ] Database migrations are up to date
- [ ] No sensitive data exposed in client bundle

## Performance
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] First Contentful Paint < 1.5s
- [ ] No layout shifts during page load
- [ ] Images optimized (using `next/image`)
- [ ] Bundle size reviewed — no unnecessary dependencies

## Security
- [ ] All user inputs validated server-side
- [ ] No secrets in client code (only `NEXT_PUBLIC_` prefixed vars)
- [ ] CSRF protection on mutations
- [ ] Content Security Policy headers configured
- [ ] XSS vectors sanitized (dynamic content rendering)

## Accessibility
- [ ] Keyboard navigation through all interactive flows
- [ ] Screen reader tested (VoiceOver on macOS)
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible on all interactive elements
- [ ] `<html lang="en">` set

## Marketing
- [ ] Open Graph meta tags set (title, description, image)
- [ ] Favicon and app icons configured
- [ ] Landing page copy reviewed for clarity and conversion
- [ ] Screenshot/demo video ready for social media
