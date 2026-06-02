// ============================================================
// SEO / JSON-LD 스키마 헬퍼 (§G)
// ============================================================
import { CLINIC } from '../data/clinic'

const BASE = `https://${CLINIC.domain}`

export interface SeoMeta {
  title: string
  description: string
  path: string // canonical path
  ogImage?: string
  keywords?: string[]
  type?: 'website' | 'article'
}

export function canonical(path: string) {
  return `${BASE}${path === '/' ? '' : path}`
}

// LocalBusiness + Dentist 스키마 (전역)
export function dentistSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${BASE}/#dentist`,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    description: CLINIC.philosophy.mission,
    url: BASE,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    image: `${BASE}/images/clinic-exterior.jpg`,
    logo: `${BASE}/images/logo.png`,
    priceRange: '₩₩',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '명지오션시티4로 59 스타빌딩 601·602호',
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      postalCode: CLINIC.postalCode,
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CLINIC.geo.lat,
      longitude: CLINIC.geo.lng,
    },
    openingHoursSpecification: CLINIC.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayToSchema(h.day),
        opens: h.time.split(' - ')[0],
        closes: h.time.split(' - ')[1],
      })),
    medicalSpecialty: 'Dentistry',
  }
}

function dayToSchema(day: string) {
  const map: Record<string, string> = {
    월: 'Monday', 화: 'Tuesday', 수: 'Wednesday', 목: 'Thursday',
    금: 'Friday', 토: 'Saturday', 일: 'Sunday',
  }
  return map[day] || day
}

// Organization
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${BASE}/#organization`,
    name: CLINIC.name,
    url: BASE,
    logo: `${BASE}/images/logo.png`,
    telephone: CLINIC.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      addressCountry: 'KR',
    },
  }
}

// Person (의료진)
export function personSchema(doctor: { name: string; license: string; career: string[]; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE}/doctors/${doctor.slug}/#person`,
    name: doctor.name,
    jobTitle: doctor.license,
    worksFor: { '@id': `${BASE}/#dentist` },
    url: `${BASE}/doctors/${doctor.slug}`,
    description: doctor.career.join(', '),
    image: `${BASE}/images/doctor-${doctor.slug}.jpg`,
  }
}

// MedicalProcedure (시술)
export function procedureSchema(t: { name: string; slug: string; summary: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: t.name,
    description: t.summary,
    url: `${BASE}/treatments/${t.slug}`,
    procedureType: 'https://schema.org/SurgicalProcedure',
  }
}

// FAQPage
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

// BreadcrumbList
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  }
}

// Article / MedicalWebPage (칼럼)
export function articleSchema(a: {
  title: string; description: string; slug: string
  datePublished: string; dateModified: string; authorSlug: string; authorName: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: a.title,
    description: a.description,
    url: `${BASE}/column/${a.slug}`,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { '@type': 'Person', name: a.authorName, url: `${BASE}/doctors/${a.authorSlug}` },
    reviewedBy: { '@type': 'Person', name: a.authorName },
    publisher: { '@id': `${BASE}/#organization` },
  }
}

// City / AdministrativeArea (지역 SEO)
export function citySchema(area: { name: string; fullName: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: area.fullName,
  }
}

// SpeakableSpecification (음성검색)
export function speakableSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.aeo-answer'],
    },
  }
}
