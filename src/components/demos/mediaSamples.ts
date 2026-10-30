// Real media for the media pages, all from Wikimedia Commons (CORS-enabled): Blender Foundation open movies
// (CC BY 3.0, blender.org) and Kevin MacLeod's music (CC BY 3.0, incompetech.com)
const commons = 'https://upload.wikimedia.org/wikipedia/commons'

export interface SampleVideo {
  id: string
  title: string
  src: string
  poster: string
  duration: number
}

export const films: SampleVideo[] = [
  {
    id: 'bunny',
    title: 'Big Buck Bunny',
    src: `${commons}/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm`,
    poster: `${commons}/thumb/c/c0/Big_Buck_Bunny_4K.webm/1280px--Big_Buck_Bunny_4K.webm.jpg`,
    duration: 635,
  },
  {
    id: 'sintel',
    title: 'Sintel',
    src: `${commons}/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.480p.vp9.webm`,
    poster: `${commons}/thumb/f/f1/Sintel_movie_4K.webm/1280px--Sintel_movie_4K.webm.jpg`,
    duration: 888,
  },
  {
    id: 'steel',
    title: 'Tears of Steel',
    src: `${commons}/transcoded/1/10/Tears_of_Steel_in_4k_-_Official_Blender_Foundation_release.webm/Tears_of_Steel_in_4k_-_Official_Blender_Foundation_release.webm.480p.vp9.webm`,
    poster: `${commons}/thumb/1/10/Tears_of_Steel_in_4k_-_Official_Blender_Foundation_release.webm/1280px--Tears_of_Steel_in_4k_-_Official_Blender_Foundation_release.webm.jpg`,
    duration: 734,
  },
]

// Sintel's subtitles, as Commons serves them (WebVTT)
const timedText = (lang: string) =>
  `https://commons.wikimedia.org/w/api.php?action=timedtext&title=File:Sintel_movie_4K.webm&lang=${lang}&trackformat=vtt&origin=*`
export const sintelTracks = [
  { src: timedText('en'), srclang: 'en', label: 'English', default: true },
  { src: timedText('es'), srclang: 'es', label: 'Español' },
]

export const bunnyChapters = [
  { start: 0, title: 'Opening' },
  { start: 75, title: 'Morning in the meadow' },
  { start: 175, title: 'The bullies' },
  { start: 330, title: 'Preparing the traps' },
  { start: 480, title: 'Payback' },
  { start: 590, title: 'Credits' },
]

// HLS: Mux's public test stream (Big Buck Bunny)
export const hlsStream = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

// Covers drawn as SVG: two of the track's colors and its initial
function cover(a: string, b: string, letter: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="88" cy="34" r="22" fill="#fff" fill-opacity=".18"/><text x="16" y="104" font-family="sans-serif" font-size="56" font-weight="700" fill="#fff" fill-opacity=".9">${letter}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export interface SampleTrack {
  title: string
  artist: string
  src: string
  artwork: string
}

const transcoded = (path: string, file: string) => `${commons}/transcoded/${path}/${file}/${file}.mp3`
export const tracks: SampleTrack[] = [
  { title: 'Carefree', artist: 'Kevin MacLeod', src: transcoded('5/58', 'Kevin_MacLeod_-_Carefree.ogg'), artwork: cover('#f59e0b', '#db2777', 'C') },
  { title: 'Windswept', artist: 'Kevin MacLeod', src: transcoded('2/23', 'Kevin_MacLeod_-_Windswept.ogg'), artwork: cover('#0ea5e9', '#4f46e5', 'W') },
  { title: 'Tranquility', artist: 'Kevin MacLeod', src: transcoded('3/3d', 'Kevin_MacLeod_-_Tranquility.ogg'), artwork: cover('#10b981', '#0f766e', 'T') },
  { title: 'Schmetterling', artist: 'Kevin MacLeod', src: transcoded('e/e3', 'Kevin_MacLeod_-_Schmetterling.ogg'), artwork: cover('#a855f7', '#e11d48', 'S') },
]
