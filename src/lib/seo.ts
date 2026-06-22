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
  const streetAddress = CLINIC.address.replace(/^부산\s*강서구\s*/, '').trim()
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
    image: `${BASE}/images/og-default.jpg`,
    logo: `${BASE}/images/logo.png`,
    priceRange: '₩₩',
    address: {
      '@type': 'PostalAddress',
      streetAddress,
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
export function personSchema(doctor: { name: string; license: string; career: string[]; slug: string; photo?: string }) {
  // 사진 주소는 데이터(doctor.photo)를 신뢰 — slug로 파일명을 추측하면 404가 난다
  const img = doctor.photo
    ? doctor.photo.startsWith('http')
      ? doctor.photo
      : `${BASE}${doctor.photo}`
    : `${BASE}/images/og-default.jpg`
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE}/doctors/${doctor.slug}/#person`,
    name: doctor.name,
    jobTitle: doctor.license,
    worksFor: { '@id': `${BASE}/#dentist` },
    url: `${BASE}/doctors/${doctor.slug}`,
    description: doctor.career.join(', '),
    image: img,
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
  image?: string; wordCount?: number; section?: string
}) {
  const img = a.image ? (/^https?:\/\//.test(a.image) ? a.image : canonical(a.image)) : `${BASE}/images/og-default.jpg`
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: a.title,
    description: a.description,
    url: `${BASE}/column/${a.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/column/${a.slug}` },
    image: { '@type': 'ImageObject', url: img, width: 1200, height: 630 },
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { '@type': 'Person', name: a.authorName, url: `${BASE}/doctors/${a.authorSlug}` },
    reviewedBy: { '@type': 'Person', name: a.authorName },
    publisher: { '@id': `${BASE}/#organization` },
    inLanguage: 'ko-KR',
  }
  if (a.wordCount) schema.wordCount = a.wordCount
  if (a.section) schema.articleSection = a.section
  return schema
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
    image: `${BASE}/images/og-default.jpg`,
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
  indications?: string[] // 적응증 — MedicalIndication
  status?: string // 회복·관리 안내
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
    followup: t.followup || t.status,
    howPerformed: t.howPerformed,
    ...(t.indications && t.indications.length
      ? { indication: t.indications.map((i) => ({ '@type': 'MedicalIndication', name: i })) }
      : {}),
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

// ============================================================
// 🏎️ 부가티급 지역 SEO 전용 스키마
// ============================================================

// City 강화판 — 지역명 + 행정 전체명 + (가능하면) 좌표·소속 지역
export function cityRichSchema(area: {
  name: string
  fullName: string
  region?: string
  landmarks?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: area.fullName,
    alternateName: area.name,
    ...(area.region ? { containedInPlace: { '@type': 'AdministrativeArea', name: `${area.region}권` } } : {}),
    ...(area.landmarks && area.landmarks.length
      ? { containsPlace: area.landmarks.map((l) => ({ '@type': 'LandmarksOrHistoricalBuildings', name: l })) }
      : {}),
  }
}

// 지역 허브(랜딩) 전용 LocalBusiness — 해당 지역을 명시적으로 서비스 대상으로 선언
// 본원 #medicalclinic을 areaServed=특정 지역으로 좁혀 "이 지역 치과" 신호를 강화
export function areaLocalBusinessSchema(area: {
  slug: string
  name: string
  fullName: string
  desc: string
  distance?: string
  transit?: string
  geo?: { lat: number; lng: number }
}) {
  const streetAddress = CLINIC.address.replace(/^부산\s*강서구\s*/, '').trim()
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'Dentist'],
    '@id': `${BASE}/clinic/${area.slug}/#localclinic`,
    name: `${CLINIC.name} (${area.name} 인근 치과)`,
    alternateName: CLINIC.nameEn,
    description: `${area.fullName} 인근에서 임플란트·교정·심미치료를 제공하는 통합치의학과 치과. ${area.desc}.`,
    url: `${BASE}/clinic/${area.slug}`,
    mainEntityOfPage: { '@id': `${BASE}/#medicalclinic` },
    telephone: CLINIC.phone,
    priceRange: '₩₩',
    image: `${BASE}/images/og-default.jpg`,
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
    areaServed: [
      { '@type': 'City', name: area.fullName, alternateName: area.name },
      // 해당 지역 좌표 중심 반경 서비스 영역 — 로컬 검색 강화
      ...(area.geo
        ? [{
            '@type': 'GeoCircle',
            geoMidpoint: { '@type': 'GeoCoordinates', latitude: area.geo.lat, longitude: area.geo.lng },
            geoRadius: '5000',
          }]
        : []),
    ],
    openingHoursSpecification: (CLINIC.hours || [])
      .filter((h: any) => !h.closed)
      .map((h: any) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayToSchema(h.day),
        opens: h.time.split(' - ')[0],
        closes: h.time.split(' - ')[1],
      })),
  }
}

// GeoCircle 서비스 반경 — "본원 좌표 중심 N km" 서비스 영역 (로컬 검색 강화)
export function serviceAreaSchema(radiusKm = 20) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: '치과 진료 (임플란트·교정·심미치료)',
    provider: { '@id': `${BASE}/#medicalclinic` },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: CLINIC.geo.lat, longitude: CLINIC.geo.lng },
      geoRadius: String(radiusKm * 1000), // meters
    },
  }
}

// CollectionPage — 지역 허브가 여러 진료를 묶는 컬렉션임을 명시
export function collectionPageSchema(opts: { name: string; path: string; description: string; items: { name: string; url: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    url: `${BASE}${opts.path}`,
    description: opts.description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: `${BASE}${it.url}`,
      })),
    },
  }
}

// ============================================================
// 🏎️ 부가티급 진료 상세 전용 강화 스키마
// ============================================================

// MedicalWebPage — 의료 콘텐츠 신뢰 신호(작성·검토 주체, 검토일). 구글 의료 E-E-A-T 친화.
export function medicalWebPageSchema(opts: {
  name: string
  path: string
  description: string
  about?: string // 다루는 시술/주제명
  lastReviewed?: string // YYYY-MM-DD
  doctorName?: string
  doctorLicense?: string
}) {
  const reviewed = opts.lastReviewed || new Date().toISOString().slice(0, 10)
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${BASE}${opts.path}/#medicalwebpage`,
    name: opts.name,
    url: `${BASE}${opts.path}`,
    description: opts.description,
    inLanguage: 'ko-KR',
    lastReviewed: reviewed,
    ...(opts.about ? { about: { '@type': 'MedicalProcedure', name: opts.about } } : {}),
    ...(opts.doctorName
      ? {
          reviewedBy: {
            '@type': 'Physician',
            name: opts.doctorName,
            ...(opts.doctorLicense ? { identifier: opts.doctorLicense } : {}),
            medicalSpecialty: 'Dentistry',
          },
        }
      : {}),
    publisher: { '@id': `${BASE}/#medicalclinic` },
    isPartOf: { '@id': `${BASE}/#website` },
  }
}

// ItemList — 세부 진료(subProcedures)를 구조화 목록으로 노출(리치 결과 후보)
export function itemListSchema(opts: { name: string; path: string; items: { name: string; description?: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    url: `${BASE}${opts.path}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.description ? { description: it.description } : {}),
    })),
  }
}
