import Link from "next/link";
import { company, contact, navLinks, certifications } from "@/content/company";
import { products } from "@/content/products";
import { Container } from "@/components/ui/container";
import { BrandMark } from "@/components/ui/brand-mark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t border-cream/10 bg-forest">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandMark tone="dark" />
            <p className="mt-4 font-display text-[1.35rem] leading-snug text-cream/90">
              {company.tagline}
            </p>
            <p className="mt-3 max-w-xs text-[13.5px] leading-[1.65] text-cream/45">
              {company.legalForm} · {company.sector}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {certifications.map((cert) => (
                <li
                  key={cert.short}
                  className="text-[11.5px] tracking-[0.06em] text-cream/40"
                >
                  {cert.label}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-chilli-warm">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-cream/60 underline-offset-4 transition-colors hover:text-cream hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-chilli-warm">
              Products
            </h2>
            <ul className="mt-4 space-y-2.5">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[14px] text-cream/60 underline-offset-4 transition-colors hover:text-cream hover:underline"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-cream/40">
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-cream/40">
            <a
              href={`mailto:${contact.email}`}
              className="underline-offset-4 transition-colors hover:text-cream/70 hover:underline"
            >
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phoneHref}`}
              className="underline-offset-4 transition-colors hover:text-cream/70 hover:underline"
            >
              {contact.phone}
            </a>
            <span>{contact.location}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
