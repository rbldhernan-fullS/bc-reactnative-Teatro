// ============================================
// MOCK DATA — Semana 03: Dominio Teatro
// 12 obras en cartelera con datos detallados y lista de favoritos
// ============================================

import type { Item } from '../types';

export const ITEMS: Item[] = [
  {
    id: '1',
    name: 'Hamlet',
    subtitle: 'Dir. Laura Gómez · Compañía Real de Arte',
    imageUri: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    genre: 'Drama',
    date: '2026-11-14',
    time: '20:00',
    price: 45000,
    hall: 'Sala Principal',
    duration: '150 min',
    availableSeats: 32,
    rating: 4.9,
    synopsis:
      'El príncipe de Dinamarca se enfrenta al dilema moral de vengar el asesinato de su padre a manos de su tío Claudio. Una tragedia cumbre sobre la traición, la locura fingida y el peso ineludible del destino.',
  },
  {
    id: '2',
    name: 'La Casa de Bernarda Alba',
    subtitle: 'Dir. Andrés Rojas · Teatro del Silencio',
    imageUri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    genre: 'Tragedia',
    date: '2026-11-21',
    time: '19:30',
    price: 40000,
    hall: 'Sala de Cámara',
    duration: '105 min',
    availableSeats: 18,
    rating: 4.8,
    synopsis:
      'Tras enviudar por segunda vez, Bernarda somete a sus cinco hijas a un luto riguroso y claustrofóbico de ocho años. El deseo reprimido y la llegada de Pepe el Romano desatarán pasiones incontrolables.',
  },
  {
    id: '3',
    name: 'El Fantasma de la Ópera',
    subtitle: 'Dir. Camila Ortiz · Ensamble Lírico Nacional',
    imageUri: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    genre: 'Musical',
    date: '2026-12-05',
    time: '20:30',
    price: 75000,
    hall: 'Sala Principal',
    duration: '160 min',
    availableSeats: 8,
    rating: 5.0,
    synopsis:
      'En las catacumbas de la Ópera de París habita un genio musical desfigurado que aterroriza a los directores para elevar al estrellato a la joven soprano Christine Daaé, desencadenando un romance oscuro y sublime.',
  },
  {
    id: '4',
    name: 'Noche de Reyes',
    subtitle: 'Dir. Julián Pardo · Elenco Clásico',
    imageUri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    genre: 'Comedia',
    date: '2026-12-12',
    time: '18:00',
    price: 35000,
    hall: 'Teatro Experimental',
    duration: '110 min',
    availableSeats: 45,
    rating: 4.7,
    synopsis:
      'Viola naufraga en las costas de Iliria y se disfraza de paje bajo el nombre de Cesario. Los malentendidos amorosos, las cartas falsas y las confusiones cómicas marcan esta deslumbrante comedia de enredos.',
  },
  {
    id: '5',
    name: 'Bodas de Sangre',
    subtitle: 'Dir. Federico Manrique · Compañía Andaluza',
    imageUri: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
    genre: 'Tragedia',
    date: '2026-12-18',
    time: '20:00',
    price: 48000,
    hall: 'Sala de Cámara',
    duration: '100 min',
    availableSeats: 26,
    rating: 4.8,
    synopsis:
      'El día de su boda, la novia huye a caballo con su antiguo amante Leonardo. La persecución por el bosque bajo la luz de la luna culmina en un trágico duelo dictado por el honor campesino.',
  },
  {
    id: '6',
    name: 'Los Miserables',
    subtitle: 'Dir. Mariana Restrepo · Gran Compañía Musical',
    imageUri: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&auto=format&fit=crop&q=80',
    genre: 'Musical',
    date: '2026-12-22',
    time: '19:00',
    price: 80000,
    hall: 'Sala Principal',
    duration: '170 min',
    availableSeats: 12,
    rating: 4.9,
    synopsis:
      'La epopeya de redención de Jean Valjean en la convulsa Francia del siglo XIX, perseguido implacablemente por el inspector Javert en medio de los levantamientos revolucionarios estudiantiles.',
  },
  {
    id: '7',
    name: 'La Vida es Sueño',
    subtitle: 'Dir. Salvador Echeverri · Calderón Teatro',
    imageUri: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=80',
    genre: 'Clásico',
    date: '2027-01-09',
    time: '19:30',
    price: 42000,
    hall: 'Sala Principal',
    duration: '130 min',
    availableSeats: 50,
    rating: 4.6,
    synopsis:
      'Segismundo vive encadenado en una torre solitaria por temor a una profecía astrológica. Al ser llevado a palacio, deberá descubrir el valor del libre albedrío frente a la ilusión de la existencia.',
  },
  {
    id: '8',
    name: 'Romeo y Julieta',
    subtitle: 'Dir. Sofía Valenzuela · Verona Producciones',
    imageUri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    genre: 'Drama',
    date: '2027-01-16',
    time: '20:00',
    price: 50000,
    hall: 'Sala Principal',
    duration: '140 min',
    availableSeats: 20,
    rating: 4.9,
    synopsis:
      'Dos jóvenes amantes desafían el odio visceral entre las familias Montesco y Capuleto en las calles de Verona, pagando el precio definitivo por su amor eterno e incondicional.',
  },
  {
    id: '9',
    name: 'Esperando a Godot',
    subtitle: 'Dir. Tomás Beltrán · Laboratorio Absurdo',
    imageUri: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop&q=80',
    genre: 'Drama',
    date: '2027-01-23',
    time: '18:30',
    price: 38000,
    hall: 'Teatro Experimental',
    duration: '115 min',
    availableSeats: 30,
    rating: 4.5,
    synopsis:
      'Vladimir y Estragón aguardan junto a un camino solitario a alguien llamado Godot, entablando diálogos filosóficos y situaciones tragicómicas en una alegoría sobre la incertidumbre de la vida humana.',
  },
  {
    id: '10',
    name: 'Don Juan Tenorio',
    subtitle: 'Dir. Ignacio Cardona · Grupo de Teatro Romántico',
    imageUri: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&auto=format&fit=crop&q=80',
    genre: 'Clásico',
    date: '2027-01-30',
    time: '20:00',
    price: 44000,
    hall: 'Sala de Cámara',
    duration: '125 min',
    availableSeats: 22,
    rating: 4.7,
    synopsis:
      'El legendario seductor Don Juan apuesta a conquistar a la novicia Doña Inés. Su desenfreno desafiará el orden terrenal hasta enfrentarse con las sombras espectrales de su pasado en el cementerio.',
  },
  {
    id: '11',
    name: 'Cyrano de Bergerac',
    subtitle: 'Dir. Gabriel Morales · Teatro de Espada y Verso',
    imageUri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    genre: 'Comedia',
    date: '2027-02-06',
    time: '19:00',
    price: 46000,
    hall: 'Sala Principal',
    duration: '135 min',
    availableSeats: 35,
    rating: 4.8,
    synopsis:
      'Cyrano, espadachín brillante y poeta de nariz descomunal, ama en secreto a su prima Roxane, y presta su elocuencia y sus versos al apuesto pero torpe Christian para que ella sea feliz.',
  },
  {
    id: '12',
    name: 'El Principito sobre las Tablas',
    subtitle: 'Dir. Valentina Cruz · Teatro Infantil Mágico',
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    genre: 'Infantil',
    date: '2027-02-13',
    time: '16:00',
    price: 30000,
    hall: 'Sala de Cámara',
    duration: '75 min',
    availableSeats: 60,
    rating: 4.9,
    synopsis:
      'Una hermosa adaptación teatral para toda la familia del clásico de Saint-Exupéry, con títeres gigantes, música en vivo y una profunda reflexión sobre lo esencial que es invisible a los ojos.',
  },
];

// Obras favoritas guardadas por el usuario (mínimo 3 según la rúbrica)
export const FAVORITES: Item[] = [
  ITEMS[2], // El Fantasma de la Ópera (5.0)
  ITEMS[0], // Hamlet (4.9)
  ITEMS[5], // Los Miserables (4.9)
  ITEMS[7], // Romeo y Julieta (4.9)
];

// Alias para compatibilidad con código anterior
export const MOCK_ITEMS = ITEMS;
