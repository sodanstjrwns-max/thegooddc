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

// ============================================================
// 🚀 SEO·AEO 슈퍼머신 확장 스키마
// ============================================================

// WebSite + SearchAction (사이트링크 검색창 / 사이트 식별)
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    inLanguage: 'ko-KR',
    publisher: { '@id': `${BASE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/encyclopedia?cat={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

// MedicalClinic — 가장 강력한 의료기관 스키마 (Dentist 보강)
// 진료과목·결제수단·언어·지역서비스를 명시해 로컬/의료 검색에 최적화
export function medicalClinicSchema() {
  const streetAddress = CLINIC.address.replace(/^부산\s*강서구\s*/, '').trim()
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'Dentist'],
    '@id': `${BASE}/#medicalclinic`,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    description: CLINIC.philosophy?.mission,
    url: BASE,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    image: `${BASE}/images/clinic-exterior.jpg`,
    logo: `${BASE}/images/logo.png`,
    priceRange: '₩₩',
    currenciesAccepted: 'KRW',
    paymentAccepted: '현금, 신용카드, 계좌이체',
    availableLanguage: ['Korean'],
    medicalSpecialty: 'Dentistry',
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      postalCode: CLINIC.postalCode,
      addressCountry: 'KR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: CLINIC.geo.lat, longitude: CLINIC.geo.lng },
    hasMap: `https://map.naver.com/v5/search/${encodeURIComponent(CLINIC.name)}`,
    areaServed: ['부산 강서구 명지', '부산 강서구', '부산광역시', '경남 김해', '경남 창원'].map((n) => ({
      '@type': 'City',
      name: n,
    })),
    openingHoursSpecification: (CLINIC.hours || [])
      .filter((h: any) => !h.closed)
      .map((h: any) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayToSchema(h.day),
        opens: h.time.split(' - ')[0],
        closes: h.time.split(' - ')[1],
      })),
    availableService: (CLINIC as any).coreServiceNames || undefined,
  }
}

// AggregateRating — 별점 리치스니펫 (실제 수치 확보 전까지 호출처에서 주입)
export function aggregateRatingSchema(rating: { value: number; count: number; best?: number }) {
  return {
    '@type': 'AggregateRating',
    ratingValue: rating.value,
    reviewCount: rating.count,
    bestRating: rating.best ?? 5,
    worstRating: 1,
  }
}

// Review — 개별 후기 스키마 (환자 동의·실제 후기 확보 시)
export function reviewSchema(review: { author: string; rating: number; body: string; date?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': `${BASE}/#medicalclinic` },
    author: { '@type': 'Person', name: review.author },
    reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    reviewBody: review.body,
    datePublished: review.date,
  }
}

// HowTo — 시술/관리 단계 안내 (리치스니펫 + AI 단계형 답변)
export function howToSchema(howto: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howto.name,
    description: howto.description,
    totalTime: howto.totalTime,
    step: howto.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

// QAPage — 질의응답형 페이지 (FAQPage와 구분, 단일 핵심 질문 강조)
export function qaPageSchema(qa: { question: string; answer: string; author?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: qa.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
        author: { '@type': 'Organization', name: CLINIC.name },
      },
    },
  }
}

// ImageObject — 대표 이미지 (이미지 검색 최적화)
export function imageObjectSchema(img: { url: string; caption: string; width?: number; height?: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: canonical(img.url),
    url: canonical(img.url),
    caption: img.caption,
    width: img.width ?? 1200,
    height: img.height ?? 630,
    representativeOfPage: true,
  }
}

// MedicalProcedure 강화판 — 적응증·준비·결과를 담아 AI가 깊게 인용
export function procedureRichSchema(t: {
  name: string
  slug: string
  summary: string
  bodyLocation?: string
  preparation?: string
  followup?: string
  howPerformed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${BASE}/treatments/${t.slug}/#procedure`,
    name: t.name,
    description: t.summary,
    url: `${BASE}/treatments/${t.slug}`,
    procedureType: 'https://schema.org/TherapeuticProcedure',
    bodyLocation: t.bodyLocation || '구강',
    preparation: t.preparation,
    followup: t.followup,
    howPerformed: t.howPerformed,
    provider: { '@id': `${BASE}/#medicalclinic` },
  }
}

// DefinedTerm 강화판 (백과사전 — 용어집 소속 명시)
export function definedTermSchema(term: { slug: string; term: string; def: string; category: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE}/encyclopedia/${term.slug}/#term`,
    name: term.term,
    description: term.def,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${BASE}/encyclopedia/#glossary`,
      name: `${CLINIC.name} 치과 용어 백과사전`,
      url: `${BASE}/encyclopedia`,
    },
    termCode: term.category,
  }
}
