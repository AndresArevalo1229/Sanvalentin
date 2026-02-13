import { asset } from "../utils/assets";

export type IntroReelItem = {
  src: string;
  title: string;
  date: string;
};

export type HeartSpec = {
  left: number;
  top: number;
  size: number;
  delay: number;
};

export type StarSpec = {
  left: number;
  top: number;
  size: number;
  delay: number;
};

export type TimelineItem = {
  date: string;
  title: string;
  text: string;
  photo?: string;
  photos?: string[];
};

export type GalleryPhoto = {
  src: string;
  caption: string;
};

export type Track = {
  title: string;
  note: string;
  src: string;
  tags: string[];
};

export type SectionMenuIcon = "letter" | "timeline" | "music" | "gallery" | "puzzle";
export type AnimationVariant = "suave" | "impactante";

export type SectionMenuItem = {
  id: "letter" | "timeline" | "music" | "gallery" | "puzzle";
  label: string;
  hint: string;
  description: string;
  icon: SectionMenuIcon;
  accent: string;
  preview: string;
};

export type ContentData = {
  youName: string;
  herName: string;
  youNick: string;
  herNick: string;
  letterLines: string[];
  timeline: TimelineItem[];
  gallery: GalleryPhoto[];
  coverPhoto: string;
  letterPhoto: string;
  letterPhotoCaption: string;
  introReel: IntroReelItem[];
  puzzleImages: string[];
  secretMessage: string;
};

const photosCita: string[] = [
  asset("photos/cita primera vez navideña/foto primera cita navideña.jpeg"),
  asset("photos/cita primera vez navideña/IMG_1153.jpeg"),
  asset("photos/cita primera vez navideña/IMG_1156.jpeg"),
  asset("photos/cita primera vez navideña/IMG_1159.jpeg")
];

const photosDeclaracion: string[] = [
  asset("photos/declaracion 10 de enero de 2025/0c8286b7-f2a4-49ab-ba20-5139d4b38e6b.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/1babefeb-6f68-49b0-b69b-ac7c4fce8858.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/3aff7f2e-5c31-4a0e-94c9-c5f99f50742d.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/8a219acf-7645-455a-a645-6022e4ec4d90.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/957cae4d-02a9-4430-bf1d-4ad05d67edb0.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/IMG_1814.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/IMG_2804.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/IMG_2807.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/IMG_3557.jpeg"),
  asset("photos/declaracion 10 de enero de 2025/IMG_3559.jpeg")
];

const photosAniversario: string[] = [
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9108.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9116.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9119.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9127.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9138.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9141.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9146.jpeg"),
  asset("photos/1 año de novios 10 de enero acuario michin/IMG_9147.jpeg")
];

const photosMomentos: string[] = [
  asset("photos/Momentos/4e158c68-60cb-4546-a8b4-ec83b47a18eb.jpeg"),
  asset("photos/Momentos/IMG_5703.jpeg"),
  asset("photos/Momentos/fc3b5ba5-dc33-4021-9bc9-abad856d8a10.jpeg")
];
const firstDatePhoto = asset("photos/Momentos/c78b8497-1b25-44f5-9a9a-0ba403f5c59d.JPG");
const secondDatePhoto = photosCita[1];
const thirdDatePhoto = asset("photos/cita primera vez navideña/2fbdf4a3-3fe7-4668-aab2-7713b8b5d010.jpeg");
const fourthDateMainPhoto = asset("photos/cita primera vez navideña/IMG_3384.jpg");
const fourthDateAltPhoto = asset("photos/cita primera vez navideña/IMG_3382.jpg");
const fifthDatePhoto = asset("photos/declaracion 10 de enero de 2025/1babefeb-6f68-49b0-b69b-ac7c4fce8858.jpeg");

const photosPlayita: string[] = [
  asset("photos/playita/19957e32-3058-4da3-a0ec-4fd809f02e7b.jpeg"),
  asset("photos/playita/3a425edf-7c90-4f0c-b77b-746bd618f5f6.jpeg"),
  asset("photos/playita/5edf1f60-22cd-450e-9527-ce0d34b9fd73.jpeg"),
  asset("photos/playita/770eff98-11c3-4307-9154-45a76b8d31c7.jpeg"),
  asset("photos/playita/b6e0b387-db8c-477c-9883-e2c504420643.jpeg"),
  asset("photos/playita/e57edfa3-ee34-4042-b761-21b622b70768.jpeg")
];

const photosPuzzle: string[] = [
  asset("photos/rompecabeza/126a3f17-bb63-492a-9c9b-7aa1c531a6f5.jpeg"),
  asset("photos/rompecabeza/B81D6BCB-CB03-4BFF-985D-E7D46FE828A3.jpeg"),
  asset("photos/rompecabeza/IMG_4153.jpeg"),
  asset("photos/rompecabeza/IMG_7178.jpeg"),
  asset("photos/rompecabeza/IMG_7204.jpeg"),
  asset("photos/rompecabeza/a5de1734-3b4e-4f50-8cb3-0528dae807fd.jpeg"),
  asset("photos/rompecabeza/c869de51-6367-4373-bfe9-dbb85bbb2686.jpeg"),
  asset("photos/rompecabeza/c9eaf630-aed0-417c-869a-18b706c58346.jpeg"),
  asset("photos/rompecabeza/d13db5b7-5b27-48bc-8520-e4ce2d548d89.jpeg")
];

const introReel: IntroReelItem[] = [
  {
    src: photosCita[0],
    title: "Primera cita navideña",
    date: "25 de diciembre de 2024"
  },
  {
    src: photosDeclaracion[6],
    title: "Nos hicimos novios",
    date: "10 de enero de 2025"
  },
  {
    src: photosAniversario[4],
    title: "Un año juntos",
    date: "10 de enero de 2026"
  }
];

const heartSpecs: HeartSpec[] = Array.from({ length: 48 }, (_, i) => ({
  left: 6 + (i * 13) % 88,
  top: 40 + (i * 9) % 50,
  size: [16, 20, 24, 28, 32][i % 5],
  delay: 0.2 + i * 0.1
}));

const starSpecs: StarSpec[] = Array.from({ length: 28 }, (_, i) => ({
  left: 10 + (i * 17) % 80,
  top: 8 + (i * 11) % 50,
  size: [12, 16, 20, 24][i % 4],
  delay: 0.4 + i * 0.16
}));

const data: ContentData = {
  youName: "Andres",
  herName: "Andrea",
  youNick: "Andresito",
  herNick: "Chocolatita",
  letterLines: [
    "Mi Chocolatita, desde que llegaste mi mundo tiene más luz.",
    "Gracias por este año de amor y de aprender a querernos mejor.",
    "Amo cómo transformas lo simple en arte con tus manos y tu mirada.",
    "Tus dibujos, tus ideas y tu ternura hacen que cada día sea especial.",
    "Quiero seguir construyendo recuerdos contigo, paso a paso.",
    "Eres mi calma, mi risa favorita y mi mejor historia.",
    "Si alguna vez dudas, mira esta página y recuerda lo mucho que te amo.",
    "Con todo mi corazón, tu Andresito."
  ],
  timeline: [
    {
      date: "26 de octubre de 2024",
      title: "La noche en que te conoci",
      text: "En esa fiesta te vi por primera vez y algo en mi se encendio. Me encantaste desde el inicio, incluso cuando estabas incomoda y con cero ganas de estar ahi. Entre idas y vueltas no podia dejar de buscarte con la mirada, y nuestra charla de plantas carnivoras se convirtio en el primer recuerdo de nosotros.",
      photo: firstDatePhoto
    },
    {
      date: "13 de noviembre de 2024",
      title: "Nuestra primera salida",
      text: "Ese dia fui feliz desde que te vi llegar. Estabas hermosa y yo iba nervioso, pero contigo todo se me hacia facil. Fuimos por telas, hubo momentos incomodos, pero aun asi lo convertiste en algo lindo. Entre risas, besos y miradas, confirme que queria cuidarte y estar contigo en serio.",
      photo: secondDatePhoto
    },
    {
      date: "Diciembre de 2024",
      title: "Cines, palomitas y tu cumple",
      text: "Nuestras salidas al cine me enamoraron de ti todavia mas: tomarte de la mano, compartir palomitas y reirnos como ninos. De todos esos dias, uno de mis favoritos fue en tu cumple, cuando fuimos a ver Moana y te vi tan bonita que no podia dejar de admirarte.",
      photo: thirdDatePhoto
    },
    {
      date: "Enero de 2025",
      title: "Noche de Hatsune Miku",
      text: "Esa noche de Hatsune Miku me encanto porque, aun con los nervios de conocer mas gente, nunca me soltaste. Me hiciste sentir en casa entre luces, musica y risas. Verte sonreir ahi conmigo me confirmo que contigo quiero vivir cada aventura, desde las mas tranquilas hasta las mas intensas.",
      photo: fourthDateMainPhoto,
      photos: [fourthDateAltPhoto]
    },
    {
      date: "10 de enero de 2025",
      title: "La promesa bajo la lluvia",
      text: "Este cuarto marca el momento donde ya no era solo ilusion, sino decision de caminar juntos. Ese dia frio y lluvioso te pedi ser mi novia y mi corazon se sintio en paz al escucharte. Es una promesa que guardo con felicidad, porque ahi comenzo oficialmente nuestra historia.",
      photo: fifthDatePhoto
    },
    {
      date: "5 de abril de 2025",
      title: "Balneario: juntos en todo momento",
      text: "Ese dia en el balneario me marco mucho porque te vi enfrentar tus miedos y no te solte ni un segundo. Quise que sintieras mi mano, mi calma y mi apoyo en cada instante. Verte confiar en mi y sonreir al final fue de las cosas mas bonitas que me has regalado."
    },
    {
      date: "Junio de 2025",
      title: "Nuestras salidas al centro",
      text: "Ir contigo al centro, aunque parezca algo simple, se volvio especial para mi. Me encanta verte feliz con los detalles que te gustan y poder consentirte. Si pudiera, te daria todo: tus cosas favoritas, tus hobbies, y mil formas nuevas de recordarte cuanto te amo."
    },
    {
      date: "Agosto de 2025",
      title: "Complicidad, ternura y confianza",
      text: "Entre abrazos largos y momentos solo nuestros descubrimos una conexion unica. Contigo todo se siente intenso y tierno al mismo tiempo, y eso me encanta. Son recuerdos que guardo con respeto y amor, porque me recuerdan la confianza real que hemos construido."
    },
    {
      date: "22 de noviembre y 20 de diciembre de 2025",
      title: "Temporada elegante: boda y graduacion",
      text: "La boda y la graduacion se volvieron recuerdos enormes por verte ahi conmigo. Te veias preciosa, elegante y llena de luz. Bailar contigo y compartir esas noches me dejo una promesa: seguir creciendo juntos y disfrutar cada etapa como equipo."
    },
    {
      date: "10 de enero, 31 de enero y 5 de febrero de 2026",
      title: "Aniversario, graduacion y noche de gala",
      text: "Nuestro aniversario en Michin, tu graduacion y aquella noche de gala fueron una confirmacion de lo mucho que te amo. Verte feliz, arreglada y brillando me deja claro que te quiero en mi presente y en mi futuro. Quiero seguir caminando contigo, cuidarte y elegirte todos los dias."
    }
  ],
  gallery: [
    {
      src: firstDatePhoto,
      caption: "Dia 1: La noche en que te conoci"
    },
    {
      src: secondDatePhoto,
      caption: "Dia 2: Nuestra primera salida"
    },
    {
      src: photosDeclaracion[0],
      caption: "Una sonrisa"
    },
    {
      src: photosDeclaracion[1],
      caption: "10 de enero 2025"
    },
    {
      src: photosDeclaracion[2],
      caption: "Nuestra declaración"
    },
    {
      src: photosDeclaracion[3],
      caption: "Nuestro momento"
    },
    {
      src: photosAniversario[0],
      caption: "Acuario Michin"
    },
    {
      src: photosAniversario[1],
      caption: "Un año de novios"
    },
    {
      src: photosPlayita[0],
      caption: "Tu mirada"
    }
  ],
  coverPhoto: photosMomentos[0],
  letterPhoto: photosCita[1],
  letterPhotoCaption: "Un recuerdo que guardo contigo",
  introReel,
  puzzleImages: photosPuzzle,
  secretMessage: "Te elijo hoy y siempre, mi Chocolatita."
};

const musicTracks: Track[] = [
  {
    title: "Instrumental inspiradora",
    note: "Luz suave para comenzar.",
    src: asset("music/musica-instrumental-inspiradora-para-videos.m4a"),
    tags: ["Instrumental", "Dulce"]
  },
  {
    title: "Instrumental para videos",
    note: "Ritmo ligero y soñador.",
    src: asset("music/musica-instrumental-para-videos.m4a"),
    tags: ["Instrumental", "Clasica"]
  },
  {
    title: "Fondo romantico",
    note: "Para acompañar cartas y suspiros.",
    src: asset("music/musica-de-fondo-para-videos.m4a"),
    tags: ["Romantica", "Serena"]
  },
  {
    title: "Boda y matrimonio",
    note: "Promesas que suenan a eterno.",
    src: asset("music/musica-para-videos-de-boda-y-matrimonio.m4a"),
    tags: ["Elegante", "Bodas"]
  },
  {
    title: "Dia de San Valentin",
    note: "Corazones encendidos.",
    src: asset("music/musica-para-el-dia-de-san-valentin.m4a"),
    tags: ["San Valentin", "Brillo"]
  },
  {
    title: "Piano inspirador",
    note: "Teclas que cuentan historias.",
    src: asset("music/piano-inspirador-para-videos.m4a"),
    tags: ["Piano", "Intima"]
  },
  {
    title: "Melodias inspiradoras",
    note: "Un aire que lo ilumina todo.",
    src: asset("music/transforma-tu-contenido-con-melodias-inspiradoras.m4a"),
    tags: ["Inspiradora", "Suave"]
  },
  {
    title: "Hermosa instrumental",
    note: "Textura calida y envolvente.",
    src: asset("music/hermosa-musica-instrumental-para-videos-inspiradores.m4a"),
    tags: ["Instrumental", "Calida"]
  },
  {
    title: "Fondo emotivo",
    note: "Para momentos que abrazan.",
    src: asset("music/musica-de-fondo-emotiva-para-bodas-y-videos-sentimentales.m4a"),
    tags: ["Emotiva", "Bodas"]
  },
  {
    title: "Fondo tranquilo",
    note: "Respira y quedate aqui.",
    src: asset("music/musica-de-fondo-tranquila-para-videos.m4a"),
    tags: ["Tranquila", "Serena"]
  },
  {
    title: "Sentimental de matrimonio",
    note: "Un susurro de promesa.",
    src: asset("music/musica-de-fondo-para-matrimonio-musica-sentimental-de-fondo-para-videos.m4a"),
    tags: ["Sentimental", "Dulce"]
  },
  {
    title: "Piano sentimental",
    note: "Un latido en cada nota.",
    src: asset("music/musica-de-piano-sentimental-musica-de-fondo-para-videos-musica-para-bodas.m4a"),
    tags: ["Piano", "Sentimental"]
  }
];

const musicCovers: string[] = [
  photosDeclaracion[4],
  photosDeclaracion[5],
  photosDeclaracion[7],
  photosDeclaracion[8],
  photosDeclaracion[9],
  photosAniversario[2],
  photosAniversario[3],
  photosAniversario[5],
  photosAniversario[6],
  photosAniversario[7],
  photosPlayita[1],
  photosPlayita[2]
];

const sectionMenu: SectionMenuItem[] = [
  {
    id: "letter",
    label: "La carta",
    hint: "Mensaje chibi",
    description: "Ábrela con amor para descubrir un detalle tierno con estilo chibi.",
    icon: "letter",
    accent: "#c92c55",
    preview: photosMomentos[1]
  },
  {
    id: "timeline",
    label: "Línea del tiempo",
    hint: "Arte clásico y moderno",
    description: "Recorre nuestros momentos clave con una vibra de galería artística.",
    icon: "timeline",
    accent: "#7b1632",
    preview: photosPlayita[3]
  },
  {
    id: "music",
    label: "Música",
    hint: "Playlist para dibujar",
    description: "Canciones que abrazan cada recuerdo mientras florece tu arte.",
    icon: "music",
    accent: "#f3c97a",
    preview: photosPlayita[4]
  },
  {
    id: "gallery",
    label: "Galería",
    hint: "Álbum artístico",
    description: "Un álbum con nuestras sonrisas, colores suaves y detalles tiernos.",
    icon: "gallery",
    accent: "#d56c90",
    preview: photosPlayita[5]
  },
  {
    id: "puzzle",
    label: "Rompecabezas",
    hint: "Juego sorpresa de gatitos",
    description: "Arma la imagen para revelar el mensaje secreto final.",
    icon: "puzzle",
    accent: "#2b0b10",
    preview: photosMomentos[2]
  }
];

const animationVariant: AnimationVariant = "impactante";

export { animationVariant, data, heartSpecs, musicCovers, musicTracks, sectionMenu, starSpecs };
