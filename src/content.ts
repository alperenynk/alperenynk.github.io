export type Lang = "en" | "tr";

export const LINKS = {
  email: "alperenyanik@hotmail.com",
  github: "https://github.com/alperenynk",
  linkedin: "https://www.linkedin.com/in/alperenyanik/",
};

export const CV_FILES: Record<Lang, { href: string; filename: string }> = {
  en: { href: "./cv-en.pdf", filename: "Alperen-Yanik-CV-EN.pdf" },
  tr: { href: "./cv-tr.pdf", filename: "Alperen-Yanik-CV-TR.pdf" },
};

export interface Content {
  nav: { about: string; experience: string; projects: string; skills: string; education: string; awards: string; contact: string };
  hero: { eyebrow: string; role: string; tagline: string; viewProjects: string; contactMe: string; downloadCv: string };
  stats: { value: string; label: string }[];
  code: { role: string; comment: string };
  about: { title: string; subtitle: string; text: string; basedIn: string; basedInValue: string; focus: string; focusValue: string; languages: string; languagesValue: string };
  experience: { title: string; subtitle: string; items: { company: string; place: string; role: string; period: string; points: string[]; tags: string[] }[] };
  projects: { title: string; subtitle: string; code: string; items: { name: string; desc: string; tags: string[]; href?: string; badge?: string }[] };
  skills: { title: string; subtitle: string; groups: { name: string; items: string[] }[] };
  education: { title: string; subtitle: string; school: string; degree: string; period: string; meta: string };
  awards: { title: string; subtitle: string; items: { name: string; desc: string }[] };
  contact: { title: string; heading: string; text: string };
  footer: { built: string; top: string };
  avatar: { sections: Record<string, string>; open: string };
  ui: { theme: string; language: string; menu: string };
}

export const content: Record<Lang, Content> = {
  en: {
    nav: { about: "About", experience: "Experience", projects: "Projects", skills: "Skills", education: "Education", awards: "Awards", contact: "Contact" },
    hero: {
      eyebrow: "Information Systems Engineer · Istanbul, Türkiye",
      role: "Information Systems Engineer",
      tagline:
        "I build clean, maintainable apps — from React Native to Python, security and computer vision.",
      viewProjects: "View Projects",
      contactMe: "Contact Me",
      downloadCv: "Download CV",
    },
    stats: [
      { value: "3.10 / 4.00", label: "GPA · Honor student" },
      { value: "99.27%", label: "Traffic sign accuracy" },
      { value: "Google", label: "AI & Technology Academy" },
      { value: "3", label: "Internships & roles" },
    ],
    code: { role: "Information Systems Engineer", comment: "honor student" },
    about: {
      title: "About",
      subtitle: "Who I am, in short.",
      text:
        "Information Systems Engineer with hands-on experience in software and cross-platform application development. Skilled in Python, TypeScript, React and React Native, with a strong focus on clean architecture, maintainable code and reliable software solutions. Passionate about building high-quality applications and continuously improving my technical expertise.",
      basedIn: "Based in",
      basedInValue: "Pendik, Istanbul",
      focus: "Focus",
      focusValue: "React Native · Python · TypeScript",
      languages: "Languages",
      languagesValue: "Turkish (native) · English (C1)",
    },
    experience: {
      title: "Experience",
      subtitle: "Where I have worked.",
      items: [
        {
          company: "Poder",
          place: "Remote, Istanbul",
          role: "Mobile Developer",
          period: "Feb 2026 – Apr 2026",
          points: [
            "Rebuilt a cross-platform mobile application from scratch as part of a major application update.",
            "Implemented mobile interfaces and integrated application features with REST APIs and authentication.",
            "Independently managed development using Git/GitHub, from implementation and integration to testing and bug fixing.",
          ],
          tags: ["React Native", "TypeScript", "REST API", "Git"],
        },
        {
          company: "Turkish State Railways (TCDD)",
          place: "Kadıköy, Istanbul",
          role: "IT Intern",
          period: "Jun 2025 – Jul 2025",
          points: ["Worked on internal IT systems and participated in system monitoring."],
          tags: ["IT Systems", "Monitoring"],
        },
        {
          company: "Era Markt Import & Export Ltd.",
          place: "Küçükyalı, Istanbul",
          role: "E-Commerce Intern",
          period: "Jul 2024 - Aug 2024",
          points: ["Organized and categorized site content to improve user experience and site navigation."],
          tags: ["E-Commerce", "UX"],
        },
      ],
    },
    projects: {
      title: "Projects",
      subtitle: "Things I have built.",
      code: "Code",
      items: [
        {
          name: "Secure Information Hiding in Audio Signals Using Steganography Techniques",
          desc:
            "Graduation project. A secure audio steganography system using AES-256-GCM encryption and Parity Coding to embed multiple file types into audio files with lossless recovery.",
          tags: ["Python", "AES-256-GCM", "Parity Coding", "Sinyal İşleme", "React Native", "Expo", "TypeScript", "FastAPI"],
          badge: "Graduation project",
        },
        {
          name: "Traffic Sign Detection",
          desc: "Traffic sign detection system built with computer vision and machine learning, reaching 99.27% classification accuracy.",
          tags: ["Python", "Computer Vision", "Machine Learning"],
          href: "https://github.com/alperenynk/Traffic-Sign-Detection",
        },
        {
          name: "Peak Form",
          desc: "Fitness application that helps users track their workouts and monitor their progress.",
          tags: ["React Native", "Expo", "TypeScript"],
          href: "https://github.com/alperenynk/Peak-Form",
        },
        {
          name: "TasteFind",
          desc: "A full-stack cross-platform recipe app built with Expo, React Native, Express, PostgreSQL and Clerk. Discover recipes, search by ingredient, and manage account-specific favorites through a secure authenticated API.",
          tags: [
            "React Native",
            "Expo",
            "TypeScript",
            "Express",
            "PostgreSQL",
            "Clerk",
          ],
          href: "https://github.com/alperenynk/Taste-Find",
        },
      ],
    },
    skills: {
      title: "Skills",
      subtitle: "Tools I use day to day.",
      groups: [
        { name: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "HTML5", "CSS3"] },
        { name: "Frameworks", items: ["React", "React Native", "Expo", "FastAPI", "Express", "Django", "Selenium"] },
        { name: "Databases", items: ["PostgreSQL", "MongoDB", "Firebase", "Supabase"] },
        { name: "Tools", items: ["Git", "GitHub"] },
      ],
    },
    education: {
      title: "Education",
      subtitle: "Where I studied.",
      school: "Piri Reis University",
      degree: "B.S. Information Systems Engineering",
      period: "Aug 2022 – Jul 2026",
      meta: "GPA 3.10 / 4.00 · Honor student",
    },
    awards: {
      title: "Awards & Recognition",
      subtitle: "Highlights.",
      items: [
        {
          name: "IEEE SIU 2026",
          desc: "Selected to present my graduation project, 'Secure Information Hiding in Audio Signals Using Steganography Techniques', at the 34th IEEE Signal Processing and Communications Applications Conference.",
        },
        {
          name: "Scientific Research Project (BAP)",
          desc: "My graduation thesis 'Secure Information Hiding in Audio Signals Using Steganography Techniques' was selected for the university's Scientific Research Projects program, where I achieved a placement.",
        },
        {
          name: "Google AI and Technology Academy",
          desc: "Completed a competitive training program with limited enrollment, organized by Google Türkiye, T3 Entrepreneurship Center and the Turkish Entrepreneurship Foundation.",
        },
      ],
    },
    contact: {
      title: "Contact",
      heading: "Let's build something reliable.",
      text: "Open to software and mobile development roles. The fastest way to reach me is email.",
    },
    footer: { built: "♥", top: "Back to Top ↑" },
    avatar: {
      sections: {
        top: "Welcome to my page!",
        about: "Hi, I'm Alperen!",
        experience: "Here's where I've worked",
        projects: "These are the apps that I've built",
        skills: "React Native, Python, TypeScript...",
        education: "My education and learning journey",
        awards: "Milestones along the way",
        contact: "Keep in touch!",
      },
      open: "Say hi to Alperen",
    },
    ui: { theme: "Toggle Theme", language: "Change Language", menu: "Menu" },
  },

  tr: {
    nav: { about: "Hakkımda", experience: "Deneyim", projects: "Projeler", skills: "Yetenekler", education: "Eğitim", awards: "Ödüller", contact: "İletişim" },
    hero: {
      eyebrow: "Bilişim Sistemleri Mühendisi · İstanbul, Türkiye",
      role: "Bilişim Sistemleri Mühendisi",
      tagline:
        "Temiz ve sürdürülebilir uygulamalar geliştiriyorum — React Native, Python, güvenlik ve görüntü işleme alanlarında.",
      viewProjects: "Projeleri Gör",
      contactMe: "İletişime Geç",
      downloadCv: "CV İndir",
    },
    stats: [
      { value: "3.10 / 4.00", label: "Not ortalaması · Onur öğrencisi" },
      { value: "%99.27", label: "Trafik işareti doğruluğu" },
      { value: "Google", label: "Yapay Zeka ve Teknoloji Akademisi" },
      { value: "3", label: "Staj ve görev" },
    ],
    code: { role: "Bilişim Sistemleri Mühendisi", comment: "onur öğrencisi" },
    about: {
      title: "Hakkımda",
      subtitle: "Kısaca ben kimim.",
      text:
        "Yazılım ve çapraz platform uygulama geliştirme alanlarında uygulamalı deneyime sahip bir Bilişim Sistemleri Mühendisiyim. Python, TypeScript, React ve React Native konularında yetkinim; temiz mimari, sürdürülebilir kod ve güvenilir yazılım çözümlerine odaklanıyorum. Yüksek kaliteli uygulamalar geliştirmeye ve teknik yetkinliklerimi sürekli geliştirmeye önem veriyorum.",
      basedIn: "Konum",
      basedInValue: "Pendik, İstanbul",
      focus: "Odak",
      focusValue: "React Native · Python · TypeScript",
      languages: "Diller",
      languagesValue: "Türkçe (anadil) · İngilizce (C1)",
    },
    experience: {
      title: "Deneyim",
      subtitle: "Nerelerde çalıştım.",
      items: [
        {
          company: "Poder",
          place: "Uzaktan, İstanbul",
          role: "Mobil Geliştirici",
          period: "Şub 2026 – Nis 2026",
          points: [
            "Büyük bir uygulama güncellemesi kapsamında çapraz platform bir mobil uygulamayı sıfırdan yeniden geliştirdim.",
            "Mobil arayüzleri geliştirdim; uygulama özelliklerini REST API'ler ve kimlik doğrulama ile entegre ettim.",
            "Git/GitHub kullanarak geliştirme sürecini uçtan uca, yani uygulama, entegrasyon, test ve hata ayıklama aşamalarını bağımsız yönettim.",
          ],
          tags: ["React Native", "TypeScript", "REST API", "Git"],
        },
        {
          company: "Türkiye Cumhuriyeti Devlet Demiryolları (TCDD)",
          place: "Kadıköy, İstanbul",
          role: "BT Stajyeri",
          period: "Haz 2025 – Tem 2025",
          points: ["Kurum içi BT sistemleri üzerinde çalıştım ve sistem izleme faaliyetlerine katıldım."],
          tags: ["BT Sistemleri", "İzleme"],
        },
        {
          company: "Era Markt Import & Export Ltd.",
          place: "Küçükyalı, İstanbul",
          role: "E-Ticaret Stajyeri",
          period: "Tem 2024 - Ağu 2024",
          points: ["Kullanıcı deneyimini ve site gezinmesini iyileştirmek için site içeriklerini düzenledim ve kategorilendirdim."],
          tags: ["E-Ticaret", "UX"],
        },
      ],
    },
    projects: {
      title: "Projeler",
      subtitle: "Geliştirdiklerim.",
      code: "Kod",
      items: [
        {
          name: "Ses Sinyalleri Üzerinde Steganografi Yöntemleriyle Güvenli Veri Saklama",
          desc:
            "Mezuniyet projesi. AES-256-GCM şifreleme ve Parity Coding kullanarak birden fazla dosya türünü ses dosyalarına kayıpsız geri kurtarma özelliğiyle gömen güvenli bir ses steganografisi sistemi.",
          tags: ["Python", "AES-256-GCM", "Parity Coding", "Sinyal İşleme", "React Native", "Expo", "TypeScript", "FastAPI"],
          badge: "Mezuniyet projesi",
        },
        {
          name: "Trafik İşareti Tespiti",
          desc: "Görüntü işleme ve makine öğrenmesi ile geliştirilen, %99.27 sınıflandırma doğruluğuna ulaşan trafik işareti tespit sistemi.",
          tags: ["Python", "Görüntü İşleme", "Makine Öğrenmesi"],
          href: "https://github.com/alperenynk/Traffic-Sign-Detection",
        },
        {
          name: "Peak Form",
          desc: "Kullanıcıların antrenmanlarını takip etmesine ve ilerlemesini izlemesine yardımcı olan fitness uygulaması.",
          tags: ["React Native", "Expo", "TypeScript"],
          href: "https://github.com/alperenynk/Peak-Form",
        },
        {
          name: "TasteFind",
          desc: "Expo ve React Native ile geliştirilen full-stack çapraz platform tarif uygulaması. Express, PostgreSQL ve Clerk kullanarak tarif keşfetme, malzemeye göre arama yapma ve kullanıcı hesabına özel favorileri güvenli bir API üzerinden yönetme imkânı sunar.",
          tags: [
            "React Native",
            "Expo",
            "TypeScript",
            "Express",
            "PostgreSQL",
            "Clerk",
          ],
          href: "https://github.com/alperenynk/Taste-Find",
        },
      ],
    },
    skills: {
      title: "Yetenekler",
      subtitle: "Günlük kullandığım araçlar.",
      groups: [
        { name: "Diller", items: ["Python", "TypeScript", "JavaScript", "SQL", "HTML5", "CSS3"] },
        { name: "Framework'ler", items: ["React", "React Native", "Expo", "FastAPI", "Express", "Django", "Selenium"] },
        { name: "Veritabanları", items: ["PostgreSQL", "MongoDB", "Firebase", "Supabase"] },
        { name: "Araçlar", items: ["Git", "GitHub"] },
      ],
    },
    education: {
      title: "Eğitim",
      subtitle: "Nerede okudum.",
      school: "Piri Reis Üniversitesi",
      degree: "Bilişim Sistemleri Mühendisliği, Lisans",
      period: "Ağu 2022 – Tem 2026",
      meta: "Not ortalaması 3.10 / 4.00 · Onur öğrencisi",
    },
    awards: {
      title: "Ödüller ve Başarılar",
      subtitle: "Öne çıkanlar.",
      items: [
        {
          name: "IEEE SIU 2026",
          desc: "'Ses Sinyalleri Üzerinde Steganografi Yöntemleriyle Güvenli Veri Saklama' isimli mezuniyet projemi 34. IEEE Sinyal İşleme ve İletişim Uygulamaları Konferansı'nda (SIU 2026) sunmak üzere seçildim.",
        },
        {
          name: "Bilimsel Araştırma Projesi (BAP)",
          desc: "'Ses Sinyalleri Üzerinde Steganografi Yöntemleriyle Güvenli Veri Saklama' isimli mezuniyet tezim Bilimsel Araştırma Projeleri programına seçildi ve derece elde ettim.",
        },
        {
          name: "Google Yapay Zeka ve Teknoloji Akademisi",
          desc: "Google Türkiye, T3 Girişim Merkezi ve Türkiye Girişimcilik Vakfı iş birliğiyle yürütülen, sınırlı kontenjanlı teknoloji eğitim programına kabul edilerek başarıyla tamamladım.",
        },
      ],
    },
    contact: {
      title: "İletişim",
      heading: "Güvenilir bir şeyler inşa edelim.",
      text: "Yazılım ve mobil geliştirme pozisyonlarına açığım. Bana ulaşmanın en hızlı yolu e-posta.",
    },
    footer: { built: "♥", top: "Yukarı Çık ↑" },
    avatar: {
      sections: {
        top: "Sayfama hoş geldin!",
        about: "Merhaba, ben Alperen!",
        experience: "Deneyimlerim",
        projects: "Geliştirdiğim uygulamalar",
        skills: "React Native, Python, TypeScript...",
        education: "Eğitim hayatım ve öğrenme sürecim",
        awards: "Elde ettiğim başarılar",
        contact: "Benimle iletişime geç",
      },
      open: "Alperen'e merhaba de",
    },
    ui: { theme: "Temayı Değiştir", language: "Dili Değiştir", menu: "Menü" },
  },
};
