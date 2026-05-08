// OAM Framework — locked constants per System Blueprint v1.0
// DO NOT modify without versioning a new formula in oam_formulas table.

export const DRIVERS = [
  { id: "D1",  name: "Vision & Direction Clarity",                   layer: "strategic_foundation"   },
  { id: "D2",  name: "Strategy & Priority to Team Alignment",        layer: "management_cascade"     },
  { id: "D3",  name: "Leadership Alignment & Consistency",           layer: "leadership_system"      },
  { id: "D4",  name: "Role & Responsibility Clarity",                layer: "management_cascade"     },
  { id: "D5",  name: "Decision Making Effectiveness",                layer: "management_cascade"     },
  { id: "D6",  name: "Management System Alignment & KPI Clarity",    layer: "management_cascade"     },
  { id: "D7",  name: "Performance & Accountability",                 layer: "team_execution"         },
  { id: "D8",  name: "Communication Flow",                           layer: "team_execution"         },
  { id: "D9",  name: "Cross-Team Collaboration",                     layer: "team_execution"         },
  { id: "D10", name: "Capability & Skill Readiness",                 layer: "individual_development" },
  { id: "D11", name: "Ownership & Initiative",                       layer: "individual_development" },
  { id: "D12", name: "Feedback & Continuous Learning",               layer: "individual_development" },
] as const;

export type DriverId = (typeof DRIVERS)[number]["id"];

export const LAYERS = [
  { id: "strategic_foundation",   name: "Strategic Foundation",   drivers: ["D1"] as string[] },
  { id: "leadership_system",      name: "Leadership System",      drivers: ["D3"] as string[] },
  { id: "management_cascade",     name: "Management Cascade",     drivers: ["D2","D4","D5","D6"] as string[] },
  { id: "team_execution",         name: "Team Execution",         drivers: ["D7","D8","D9"] as string[] },
  { id: "individual_development", name: "Individual Development", drivers: ["D10","D11","D12"] as string[] },
] as const;

export type LayerId = (typeof LAYERS)[number]["id"];

export const GAPS = [
  { id: "strategic_clarity",   name: "Strategic Clarity",   fps: ["FP1","FP2","FP3","FP4","FP5"] },
  { id: "leadership_alignment",name: "Leadership Alignment", fps: ["FP6","FP7"] },
  { id: "management_system",   name: "Management System",   fps: ["FP8","FP9","FP10","FP11","FP12","FP13","FP14","FP15","FP20","FP21"] },
  { id: "collaboration",       name: "Collaboration",        fps: ["FP16","FP17","FP18","FP19"] },
  { id: "capability",          name: "Capability",           fps: ["FP22","FP23"] },
  { id: "culture",             name: "Culture",              fps: ["FP24","FP25","FP26","FP27"] },
] as const;

export type GapId = (typeof GAPS)[number]["id"];

export const FAILURE_POINTS: Record<string, string> = {
  FP1:  "Vision Clarity",
  FP2:  "Strategy Clarity",
  FP3:  "Priority Clarity",
  FP4:  "Goal Clarity",
  FP5:  "Strategy Translation",
  FP6:  "Leadership Alignment",
  FP7:  "Leadership Consistency",
  FP8:  "Role Clarity",
  FP9:  "Decision Authority",
  FP10: "Decision Effectiveness",
  FP11: "Leadership Accountability",
  FP12: "Strategy Cascade",
  FP13: "Goal Cascade",
  FP14: "KPI Ownership",
  FP15: "Performance Monitoring",
  FP16: "Cross-Team Alignment",
  FP17: "Communication Flow",
  FP18: "Cross-Team Collaboration",
  FP19: "Conflict Handling",
  FP20: "Decision Speed",
  FP21: "Accountability",
  FP22: "Skill Gap",
  FP23: "Training Effectiveness",
  FP24: "Ownership",
  FP25: "Initiative",
  FP26: "Feedback Loop",
  FP27: "Continuous Improvement",
};

// Which FPs belong to each driver (derived from weight_map structure)
export const DRIVER_FPS: Record<string, string[]> = {
  D1:  ["FP1","FP2","FP3","FP4","FP5"],
  D2:  ["FP12"],
  D3:  ["FP6","FP7"],
  D4:  ["FP8"],
  D5:  ["FP9","FP10","FP20"],
  D6:  ["FP13","FP14","FP15"],
  D7:  ["FP21","FP11"],
  D8:  ["FP17"],
  D9:  ["FP16","FP18","FP19"],
  D10: ["FP22","FP23"],
  D11: ["FP24","FP25"],
  D12: ["FP26","FP27"],
};

export const STATUS_THRESHOLDS = [
  { key: "critical", label: "Critical", min: 1.0,  max: 2.0,  color: "#ef4444", bg: "bg-red-500/10",    text: "text-red-600 dark:text-red-400"    },
  { key: "weak",     label: "Weak",     min: 2.0,  max: 2.8,  color: "#f97316", bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  { key: "stable",   label: "Stable",   min: 2.8,  max: 3.5,  color: "#eab308", bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
  { key: "strong",   label: "Strong",   min: 3.5,  max: 4.01, color: "#22c55e", bg: "bg-green-500/10",  text: "text-green-600 dark:text-green-400"  },
] as const;

export type StatusKey = (typeof STATUS_THRESHOLDS)[number]["key"];

// Default weight map — matches seed data oam12-v1
export const DEFAULT_WEIGHT_MAP: Record<string, Record<string, Record<string, number>>> = {
  D1:  { Q1: {FP1:0.7,FP2:0.3}, Q2: {FP2:0.7,FP5:0.3}, Q3: {FP2:0.2,FP3:0.7,FP5:0.1}, Q4: {FP4:0.7,FP5:0.3}, Q5: {FP2:0.2,FP5:0.8}, Q6: {FP1:0.2,FP2:0.3,FP3:0.2,FP4:0.3} },
  D2:  { Q1: {FP12:0.3}, Q2: {FP12:0.3}, Q3: {FP12:0.2}, Q4: {FP12:0.2} },
  D3:  { Q1: {FP6:0.7,FP7:0.3}, Q2: {FP6:0.8,FP7:0.2}, Q3: {FP6:0.2,FP7:0.8}, Q4: {FP6:0.3,FP7:0.7} },
  D4:  { Q1: {FP8:0.25}, Q2: {FP8:0.3}, Q3: {FP8:0.25}, Q4: {FP8:0.2} },
  D5:  { Q1: {FP9:0.8,FP10:0.2}, Q2: {FP9:0.7,FP20:0.3}, Q3: {FP10:0.8,FP20:0.2}, Q4: {FP10:0.8,FP20:0.2}, Q5: {FP10:0.2,FP20:0.8}, Q6: {FP9:0.3,FP20:0.7} },
  D6:  { Q1: {FP13:0.7,FP14:0.3}, Q2: {FP13:0.8,FP14:0.2}, Q3: {FP15:0.8,FP14:0.2}, Q4: {FP15:0.8,FP14:0.2}, Q5: {FP14:1.0}, Q6: {FP13:0.2,FP15:0.3,FP14:0.5} },
  D7:  { Q1: {FP21:0.7,FP11:0.3}, Q2: {FP21:0.8,FP11:0.2}, Q3: {FP21:0.3,FP11:0.7}, Q4: {FP21:0.2,FP11:0.8}, Q5: {FP21:0.7,FP11:0.3} },
  D8:  { Q1: {FP17:0.3}, Q2: {FP17:0.25}, Q3: {FP17:0.2}, Q4: {FP17:0.25} },
  D9:  { Q1: {FP16:0.8,FP18:0.2}, Q2: {FP18:0.8,FP19:0.2}, Q3: {FP16:0.2,FP18:0.8}, Q4: {FP18:0.2,FP19:0.8}, Q5: {FP16:0.2,FP19:0.8} },
  D10: { Q1: {FP22:0.8,FP23:0.2}, Q2: {FP22:0.8,FP23:0.2}, Q3: {FP22:0.2,FP23:0.8}, Q4: {FP22:0.2,FP23:0.8}, Q5: {FP22:0.7,FP23:0.3} },
  D11: { Q1: {FP24:0.6,FP25:0.4}, Q2: {FP24:0.8,FP25:0.2}, Q3: {FP24:0.8,FP25:0.2}, Q4: {FP24:0.2,FP25:0.8}, Q5: {FP24:0.3,FP25:0.7} },
  D12: { Q1: {FP26:0.8,FP27:0.2}, Q2: {FP26:0.7,FP27:0.3}, Q3: {FP26:0.3,FP27:0.7}, Q4: {FP26:0.2,FP27:0.8}, Q5: {FP26:0.2,FP27:0.8} },
};

export const DRIVER_QUESTIONS: Record<string, { questions: string[]; openEnded: string }> = {
  D1: {
    questions: [
      "Saya dapat menjelaskan arah utama organisasi saat ini dengan bahasa yang sederhana dan tidak perlu menebak-nebak sendiri.",
      "Strategi organisasi yang sedang dijalankan cukup jelas bagi saya untuk dipahami sebagai perubahan tindakan, bukan hanya slogan atau istilah umum.",
      "Ketika ada banyak tuntutan pekerjaan, saya tahu mana yang harus diprioritaskan lebih dulu karena urutan prioritas organisasi cukup jelas.",
      "Target atau fokus kerja yang diberikan kepada saya/tim terhubung jelas dengan tujuan organisasi yang lebih besar.",
      "Arah dan strategi organisasi sudah diterjemahkan ke pekerjaan sehari-hari, sehingga saya tahu apa yang perlu dilakukan secara spesifik dalam peran saya.",
      "Perubahan arah, prioritas, atau target kerja biasanya dijelaskan dengan cukup jelas sehingga tidak menimbulkan interpretasi yang berbeda-beda.",
    ],
    openEnded: "Bagian mana dari arah, strategi, prioritas, atau target organisasi yang saat ini paling membingungkan dalam praktik kerja? Jelaskan contoh nyatanya.",
  },
  D2: {
    questions: [
      "Saya memahami dengan jelas bagaimana strategi organisasi diterjemahkan ke arah kerja tim saya.",
      "Saya mengetahui perubahan nyata apa yang seharusnya terjadi di tim saya sebagai dampak dari strategi organisasi.",
      "Pemahaman mengenai arah dan prioritas organisasi di tim saya tidak berbeda jauh dengan tim atau unit lain.",
      "Strategi organisasi benar-benar mempengaruhi cara kerja sehari-hari tim saya, bukan hanya berhenti di level manajemen.",
    ],
    openEnded: "Bagian mana dari proses turunnya strategi ke level tim yang paling membingungkan atau tidak berjalan dengan jelas? Berikan contoh nyatanya.",
  },
  D3: {
    questions: [
      "Para pimpinan di organisasi ini menyampaikan arah dan prioritas yang sejalan satu sama lain.",
      "Saya jarang menerima arahan yang saling bertentangan dari pimpinan yang berbeda.",
      "Pesan dan keputusan yang disampaikan pimpinan relatif konsisten dari waktu ke waktu.",
      "Ketika terjadi perubahan arah atau keputusan, pimpinan menjelaskan perubahan tersebut dengan cukup jelas kepada tim.",
    ],
    openEnded: "Di bagian mana kepemimpinan paling sering terasa tidak selaras atau tidak konsisten? Berikan contoh situasi nyatanya.",
  },
  D4: {
    questions: [
      "Saya memahami dengan jelas peran dan tanggung jawab saya dalam pekerjaan sehari-hari.",
      "Dalam tim saya, jarang terjadi kebingungan mengenai siapa yang bertanggung jawab atas suatu pekerjaan.",
      "Pembagian tugas di tim saya jelas dan tidak sering terjadi overlap atau kekosongan tanggung jawab.",
      "Ketika terjadi pekerjaan lintas fungsi atau masalah, tetap jelas siapa yang harus mengambil tanggung jawab.",
    ],
    openEnded: "Dalam pengalaman Anda, di bagian mana paling sering terjadi kebingungan terkait peran atau tanggung jawab? Berikan contoh situasi nyatanya.",
  },
  D5: {
    questions: [
      "Saya memahami dengan jelas siapa yang memiliki kewenangan untuk mengambil keputusan dalam situasi kerja saya.",
      "Keputusan biasanya diambil di level yang tepat tanpa harus selalu naik ke level yang lebih tinggi.",
      "Keputusan yang diambil umumnya jelas dan dapat dipahami oleh pihak yang terlibat.",
      "Keputusan jarang perlu diulang atau direvisi karena kesalahan atau ketidakjelasan.",
      "Keputusan dapat diambil dengan cukup cepat tanpa proses yang berlarut-larut.",
      "Proses pengambilan keputusan tidak terlalu banyak melibatkan pihak yang tidak diperlukan.",
    ],
    openEnded: "Dalam pengalaman Anda, di mana proses pengambilan keputusan paling sering mengalami hambatan atau tidak berjalan efektif? Berikan contoh nyatanya.",
  },
  D6: {
    questions: [
      "KPI atau target yang saya terima memiliki hubungan yang jelas dengan tujuan organisasi.",
      "Target di tim saya selaras dengan target di level organisasi dan tidak saling bertabrakan.",
      "Kinerja tim dimonitor secara rutin menggunakan indikator yang jelas.",
      "Ketika performa tidak sesuai target, ada tindak lanjut yang jelas berdasarkan data atau hasil monitoring.",
      "Setiap KPI memiliki pemilik (owner) yang jelas dan diketahui oleh semua pihak terkait.",
      "Sistem yang ada memastikan adanya akuntabilitas terhadap pencapaian KPI, bukan hanya bergantung pada individu.",
    ],
    openEnded: "Di bagian mana sistem KPI atau monitoring kinerja saat ini paling tidak jelas atau tidak efektif? Berikan contoh nyatanya.",
  },
  D7: {
    questions: [
      "Ketika target atau KPI tidak tercapai, biasanya ada tindak lanjut yang jelas untuk memperbaiki situasi.",
      "Masalah atau kegagalan dalam pekerjaan tidak dibiarkan berulang tanpa perbaikan yang nyata.",
      "Pimpinan secara aktif melakukan follow-up terhadap kinerja tim, bukan hanya menetapkan target.",
      "Pimpinan menunjukkan tanggung jawab yang jelas terhadap hasil tim atau organisasi.",
      "Terdapat konsekuensi atau tindakan yang jelas ketika performa tidak sesuai dengan target.",
    ],
    openEnded: "Apa yang biasanya terjadi ketika target tidak tercapai di organisasi Anda? Jelaskan contoh nyatanya.",
  },
  D8: {
    questions: [
      "Informasi penting yang saya butuhkan untuk bekerja biasanya tersedia tepat waktu.",
      "Informasi yang disampaikan dalam organisasi jarang berubah atau terdistorsi saat diteruskan.",
      "Saya memahami dengan jelas pesan atau informasi yang disampaikan oleh pihak lain.",
      "Miskomunikasi jarang menyebabkan pekerjaan harus diulang atau diperbaiki.",
    ],
    openEnded: "Jenis informasi apa yang paling sering terlambat, tidak jelas, atau menimbulkan miskomunikasi? Berikan contoh nyatanya.",
  },
  D9: {
    questions: [
      "Prioritas antar tim atau divisi di organisasi ini umumnya selaras dan tidak sering bertabrakan.",
      "Bekerja sama dengan tim atau divisi lain dapat dilakukan dengan cukup lancar tanpa hambatan berarti.",
      "Ketergantungan antar tim (handover, approval, dll) dikelola dengan cukup baik dan tidak sering menjadi bottleneck.",
      "Ketika terjadi konflik antar tim, masalah tersebut biasanya diselesaikan secara konstruktif.",
      "Konflik antar tim tidak dibiarkan berlarut-larut atau berulang tanpa penyelesaian yang jelas.",
    ],
    openEnded: "Apa tantangan terbesar dalam bekerja lintas tim atau divisi saat ini? Berikan contoh situasi nyatanya.",
  },
  D10: {
    questions: [
      "Tim saya memiliki kemampuan yang cukup untuk menjalankan pekerjaan tanpa kesulitan berarti.",
      "Pekerjaan jarang tertunda atau bermasalah karena keterbatasan skill dalam tim.",
      "Program pelatihan atau pengembangan yang ada membantu meningkatkan performa kerja secara nyata.",
      "Setelah mengikuti training, terdapat perubahan yang terlihat dalam cara kerja atau hasil kerja tim.",
      "Kebutuhan skill yang diperlukan untuk pekerjaan saat ini dapat diidentifikasi dengan cukup jelas.",
    ],
    openEnded: "Di bagian mana keterbatasan skill atau training paling sering menjadi hambatan dalam pekerjaan? Berikan contoh nyatanya.",
  },
  D11: {
    questions: [
      "Anggota tim biasanya menyelesaikan masalah tanpa harus selalu menunggu arahan dari atasan.",
      "Ketika terjadi masalah, individu yang terlibat cenderung mengambil tanggung jawab sampai selesai.",
      "Jarang terjadi saling melempar tanggung jawab dalam pekerjaan sehari-hari.",
      "Tim secara aktif mengusulkan ide atau perbaikan tanpa harus diminta.",
      "Individu dalam tim tidak hanya menjalankan tugas, tetapi juga berusaha meningkatkan cara kerja.",
    ],
    openEnded: "Dalam pengalaman Anda, kapan terakhir kali Anda melihat ownership atau inisiatif yang kuat atau lemah dalam tim? Jelaskan situasinya.",
  },
  D12: {
    questions: [
      "Feedback diberikan secara rutin dan cukup spesifik untuk membantu perbaikan kerja.",
      "Feedback yang diberikan biasanya benar-benar digunakan untuk memperbaiki cara kerja.",
      "Setelah terjadi kesalahan atau masalah, dilakukan evaluasi yang jelas.",
      "Perbaikan dilakukan secara nyata setelah evaluasi, bukan hanya dibahas saja.",
      "Masalah yang sama tidak sering terulang karena sudah ada perbaikan sebelumnya.",
    ],
    openEnded: "Bagaimana biasanya organisasi Anda belajar dari kesalahan atau feedback? Berikan contoh situasi nyatanya.",
  },
};
