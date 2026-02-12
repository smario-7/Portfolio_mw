import type { ContentData } from '@/lib/types/content'

export const DEFAULT_CONTENT: ContentData = {
  home: {
    heroTitle: 'Cześć, jestem Michał Wolski',
    heroSubtitle: 'Tworzę systemy webowe, aplikacje AI i narzędzia do analizy danych.',
    heroDescription: 'Specjalizuję się w budowaniu wydajnych rozwiązań wykorzystujących nowoczesne technologie i machine learning.',
    button1Text: 'Zobacz projekty',
    button2Text: 'Pobierz CV',
    projectsTitle: 'Wybrane projekty',
    projectsDescription: 'Oto kilka projektów, nad którymi ostatnio pracowałem',
    skills: ['React', 'Python', 'AI & ML', 'Analiza Danych', 'TypeScript', 'Next.js'],
  },
  about: {
    introduction: 'Jestem pełnoetatowym developerem z ponad 5 latami doświadczenia w tworzeniu aplikacji webowych. Pasjonuję się tworzeniem eleganckich, wydajnych rozwiązań, które rozwiązują rzeczywiste problemy.',
    experience: [
      { year: '2023', title: 'Senior Developer', description: 'Pracuję nad zaawansowanymi systemami AI i ML' },
      { year: '2021', title: 'Full Stack Developer', description: 'Budowanie aplikacji webowych end-to-end' },
      { year: '2019', title: 'Junior Developer', description: 'Nauka i rozwój podstawowych umiejętności' },
    ],
    skills: {
      'Frontend': ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      'Backend': ['Node.js', 'Python', 'FastAPI', 'PostgreSQL'],
      'AI & ML': ['TensorFlow', 'Scikit-learn', 'PyTorch', 'NLP'],
      'Narzędzia': ['Docker', 'Git', 'AWS', 'CI/CD'],
    },
  },
  contact: {
    title: 'Skontaktuj się',
    description: 'Szukasz kogoś do współpracy? Mam otwarte zainteresowanie dla ciekawych projektów.',
    email: 'hello@example.com',
    phone: '+48 123 456 789',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
}
