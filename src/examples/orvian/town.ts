// Monteluz, a made-up town in the farmland of the pampas, and a MapLibre style for it that follows the Orvian
// viewers' metadata conventions (alias, group, identify, fields, hover, isbaselayer, childs, legend…), the way a style
// served by MVT Server carries them. Everything here is invented: no data comes from a real server.
import type { StyleSpecification } from 'maplibre-gl'

export const CENTER: [number, number] = [-62.4, -33.1]

// Meters to degrees at the town's latitude
const M_LAT = 1 / 110900
const M_LNG = 1 / (111320 * Math.cos((CENTER[1] * Math.PI) / 180))
const at = (x: number, y: number): [number, number] => [CENTER[0] + x * M_LNG, CENTER[1] + y * M_LAT]
const rect = (x: number, y: number, w: number, h: number) => [[at(x, y), at(x + w, y), at(x + w, y + h), at(x, y + h), at(x, y)]]

// A seeded random generator: the same town on every visit
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const pick = <T>(list: T[]) => list[Math.floor(rand() * list.length)]!

const BLOCK = 100 // m
const STREET = 16 // m
const STEP = BLOCK + STREET
const COLS = 10
const ROWS = 7
const blockAt = (i: number, j: number) => ({ x: (i - COLS / 2) * STEP, y: (j - ROWS / 2) * STEP })

const PARKS = new Set(['4,3', '8,1'])
const zoneOf = (i: number, j: number) => (i >= 8 ? 'Industrial' : i >= 3 && i <= 6 && j >= 2 && j <= 4 ? 'Commercial' : 'Residential')
const FIRST = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Facundo', 'Gabriela', 'Hernán', 'Inés', 'Julián', 'Lucía', 'Martín', 'Nora', 'Pablo', 'Rocío', 'Santiago', 'Valeria']
const LAST = ['Acosta', 'Benítez', 'Castro', 'Domínguez', 'Ferreyra', 'Giménez', 'Herrera', 'Ibarra', 'Juárez', 'Luna', 'Medina', 'Navarro', 'Ortiz', 'Peralta', 'Quiroga', 'Ríos', 'Sosa']

type Feature = { type: 'Feature'; properties: Record<string, unknown>; geometry: { type: string; coordinates: unknown } }
const collection = (features: Feature[]) => ({ type: 'FeatureCollection' as const, features })

const blocks: Feature[] = []
const parcels: Feature[] = []
const zoning: Feature[] = []
const parks: Feature[] = []
for (let i = 0; i < COLS; i++) {
  for (let j = 0; j < ROWS; j++) {
    const { x, y } = blockAt(i, j)
    const id = `${String.fromCharCode(65 + j)}${i + 1}`
    const zone = zoneOf(i, j)
    zoning.push({ type: 'Feature', properties: { block: id, zone, max_height: zone === 'Commercial' ? 24 : zone === 'Industrial' ? 15 : 9 }, geometry: { type: 'Polygon', coordinates: rect(x, y, BLOCK, BLOCK) } })
    if (PARKS.has(`${i},${j}`)) {
      parks.push({
        type: 'Feature',
        properties: { name: i === 4 ? 'Plaza Mayor' : 'Parque del Molino', area: BLOCK * BLOCK, trees: Math.round(80 + rand() * 120) },
        geometry: { type: 'Polygon', coordinates: rect(x, y, BLOCK, BLOCK) },
      })
      continue
    }
    blocks.push({ type: 'Feature', properties: { block: id, zone }, geometry: { type: 'Polygon', coordinates: rect(x, y, BLOCK, BLOCK) } })
    // Ten lots a block: two rows of five, 20 × 50 m
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        const vacant = rand() < 0.12
        const use = vacant ? 'Vacant' : zone === 'Commercial' ? pick(['Shop', 'Office', 'Shop', 'Housing']) : zone === 'Industrial' ? pick(['Warehouse', 'Workshop']) : 'Housing'
        parcels.push({
          type: 'Feature',
          properties: {
            lot: `${id}-${r * 5 + c + 1}`,
            block: id,
            owner: `${pick(FIRST)} ${pick(LAST)}`,
            use,
            area: Math.round(950 + rand() * 120),
            value: Math.round((zone === 'Commercial' ? 95000 : zone === 'Industrial' ? 60000 : 70000) * (0.8 + rand() * 0.5) / 100) * 100,
            built: vacant ? null : 1955 + Math.floor(rand() * 68),
          },
          geometry: { type: 'Polygon', coordinates: rect(x + c * 20, y + r * 50, 20, 50) },
        })
      }
    }
  }
}

// Streets run between the blocks; Main Avenue and Mill Road are the wide ones
const streets: Feature[] = []
const half = STREET / 2
const west = blockAt(0, 0).x - half
const east = blockAt(COLS - 1, 0).x + BLOCK + half
const south = blockAt(0, 0).y - half
const north = blockAt(0, ROWS - 1).y + BLOCK + half
for (let j = 0; j <= ROWS; j++) {
  const y = blockAt(0, j).y - half
  const main = j === 4
  streets.push({ type: 'Feature', properties: { name: main ? 'Main Avenue' : `${j + 1}${['st', 'nd', 'rd'][j] ?? 'th'} Street`, kind: main ? 'Avenue' : 'Street', width: main ? 24 : 16 }, geometry: { type: 'LineString', coordinates: [at(west, y), at(east, y)] } })
}
const avenues = ['Mill Road', 'Alder', 'Birch', 'Cedar', 'Elm', 'Hazel', 'Linden', 'Maple', 'Oak', 'Poplar', 'Willow']
for (let i = 0; i <= COLS; i++) {
  const x = blockAt(i, 0).x - half
  const mill = i === 0
  streets.push({ type: 'Feature', properties: { name: mill ? 'Mill Road' : `${avenues[i]} Street`, kind: mill ? 'Avenue' : 'Street', width: mill ? 24 : 16 }, geometry: { type: 'LineString', coordinates: [at(x, south), at(x, north)] } })
}
const mainY = blockAt(0, 4).y - half
const bikeLanes: Feature[] = [
  { type: 'Feature', properties: { name: 'Main Avenue lane', length: (east - west) / 1000, lanes: 2 }, geometry: { type: 'LineString', coordinates: [at(west, mainY - 6), at(east, mainY - 6)] } },
  { type: 'Feature', properties: { name: 'Mill Road lane', length: (north - south) / 1000, lanes: 1 }, geometry: { type: 'LineString', coordinates: [at(west + 6, south), at(west + 6, north)] } },
]

const inBlock = (i: number, j: number, dx: number, dy: number) => { const { x, y } = blockAt(i, j); return at(x + dx, y + dy) }
const schools: Feature[] = [
  { name: 'Monteluz Primary School', level: 'Primary', students: 412, at: inBlock(2, 5, 50, 50) },
  { name: 'Normal School No. 2', level: 'Secondary', students: 655, at: inBlock(6, 1, 30, 70) },
  { name: 'Little Mills Kindergarten', level: 'Kindergarten', students: 120, at: inBlock(1, 1, 60, 30) },
].map(({ at: p, ...properties }) => ({ type: 'Feature', properties, geometry: { type: 'Point', coordinates: p } }))
const health: Feature[] = [
  { name: 'Monteluz Hospital', kind: 'Hospital', beds: 48, at: inBlock(5, 5, 50, 50) },
  { name: 'North Health Center', kind: 'Health center', beds: 0, at: inBlock(7, 6, 40, 40) },
].map(({ at: p, ...properties }) => ({ type: 'Feature', properties, geometry: { type: 'Point', coordinates: p } }))

/** The town's extent, to frame it. */
export const BOUNDS: [[number, number], [number, number]] = [at(west - 60, south - 60), at(east + 60, north + 60)]

// Legends as SVG data URIs (an MVT Server server would render them from the style)
const svg = (body: string, h: number) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="${h}" font-family="Roboto, sans-serif" font-size="12">${body}</svg>`)}`
const swatch = (rows: [string, string, string?][]) => svg(rows.map(([color, label, kind], k) => {
  const y = 6 + k * 22
  const mark = kind === 'line' ? `<rect x="4" y="${y + 6}" width="22" height="4" rx="2" fill="${color}"/>`
    : kind === 'point' ? `<circle cx="15" cy="${y + 8}" r="6" fill="${color}" stroke="#fff" stroke-width="2"/>`
      : `<rect x="4" y="${y}" width="22" height="16" rx="3" fill="${color}" fill-opacity="0.45" stroke="${color}"/>`
  return `${mark}<text x="34" y="${y + 12}" fill="#666">${label}</text>`
}).join(''), rows.length * 22 + 8)

const COLORS = { parcel: '#8d6e63', zoneR: '#f9a825', zoneC: '#d81b60', zoneI: '#5e35b1', street: '#546e7a', bike: '#00897b', park: '#43a047', school: '#1e88e5', health: '#e53935' }

const tileThumb = (url: string) => url.replace('{z}/{x}/{y}', '13/2676/4894')
const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TOPO = 'https://tile.opentopomap.org/{z}/{x}/{y}.png'

export const style = {
  version: 8,
  name: 'Monteluz · Urban planning',
  metadata: {
    groups: [
      { name: 'cadastre', alias: 'Cadastre' },
      { name: 'planning', alias: 'Urban planning' },
      { name: 'mobility', alias: 'Mobility' },
      { name: 'services', alias: 'Public services' },
    ],
  },
  sources: {
    osm: { type: 'raster', tiles: [OSM], tileSize: 256, attribution: '© OpenStreetMap contributors', maxzoom: 19 },
    topo: { type: 'raster', tiles: [TOPO], tileSize: 256, attribution: '© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)', maxzoom: 17 },
    blocks: { type: 'geojson', data: collection(blocks) },
    parcels: { type: 'geojson', data: collection(parcels) },
    zoning: { type: 'geojson', data: collection(zoning) },
    streets: { type: 'geojson', data: collection(streets) },
    bikes: { type: 'geojson', data: collection(bikeLanes) },
    parks: { type: 'geojson', data: collection(parks) },
    schools: { type: 'geojson', data: collection(schools) },
    health: { type: 'geojson', data: collection(health) },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm', metadata: { isbaselayer: true, alias: 'OpenStreetMap', image: tileThumb(OSM) } },
    { id: 'topo', type: 'raster', source: 'topo', layout: { visibility: 'none' }, metadata: { isbaselayer: true, alias: 'Topographic', image: tileThumb(TOPO) } },
    {
      id: 'zoning',
      type: 'fill',
      source: 'zoning',
      layout: { visibility: 'none' },
      paint: { 'fill-color': ['match', ['get', 'zone'], 'Commercial', COLORS.zoneC, 'Industrial', COLORS.zoneI, COLORS.zoneR], 'fill-opacity': 0.35 },
      metadata: {
        alias: 'Zoning',
        group: 'planning',
        description: 'What each block may be used for, and how high it may be built',
        identify: true,
        fields: { block: { alias: 'Block' }, zone: { alias: 'Zone' }, max_height: { alias: 'Maximum height', suffix: 'm' } },
        legend: { wmslegend: swatch([[COLORS.zoneR, 'Residential'], [COLORS.zoneC, 'Commercial'], [COLORS.zoneI, 'Industrial']]) },
      },
    },
    {
      id: 'parks',
      type: 'fill',
      source: 'parks',
      paint: { 'fill-color': COLORS.park, 'fill-opacity': 0.5 },
      metadata: {
        alias: 'Parks and squares',
        group: 'planning',
        identify: true,
        fields: { name: { alias: 'Name' }, area: { alias: 'Area', suffix: 'm²', mask: '#,###' }, trees: { alias: 'Trees' } },
        hover: { enable: true, fields: [{ name: { alias: 'Park' } }] },
        legend: { wmslegend: swatch([[COLORS.park, 'Park or square']]) },
      },
    },
    {
      id: 'blocks',
      type: 'fill',
      source: 'blocks',
      paint: { 'fill-color': '#ffffff', 'fill-opacity': 0.15 },
      metadata: { alias: 'Blocks', group: 'cadastre', description: 'City blocks', legend: { show: false } },
    },
    {
      id: 'parcels',
      type: 'fill',
      source: 'parcels',
      paint: { 'fill-color': ['match', ['get', 'use'], 'Vacant', '#bdbdbd', COLORS.parcel], 'fill-opacity': 0.25 },
      metadata: {
        alias: 'Parcels',
        group: 'cadastre',
        description: 'Lots with their owner, use, area and assessed value',
        identify: true,
        childs: ['parcels-outline'],
        fields: {
          lot: { alias: 'Lot' },
          owner: { alias: 'Owner' },
          use: { alias: 'Use' },
          area: { alias: 'Area', suffix: 'm²', mask: '#,###' },
          value: { alias: 'Assessed value', prefix: 'US$', mask: '#,###' },
          built: { alias: 'Built in' },
          exclude: ['block'],
        },
        hover: { enable: true, fields: [{ lot: { alias: 'Lot' } }, { owner: { alias: 'Owner' } }, { use: { alias: 'Use' } }] },
        legend: { wmslegend: swatch([[COLORS.parcel, 'Built'], ['#bdbdbd', 'Vacant']]) },
        download: `data:application/geo+json,${encodeURIComponent(JSON.stringify(collection(parcels.slice(0, 50))))}`,
      },
    },
    { id: 'parcels-outline', type: 'line', source: 'parcels', paint: { 'line-color': COLORS.parcel, 'line-width': 0.8 }, metadata: { show_in_layerlist: false, group: 'cadastre' } },
    {
      id: 'streets',
      type: 'line',
      source: 'streets',
      paint: { 'line-color': COLORS.street, 'line-width': ['match', ['get', 'kind'], 'Avenue', 5, 2.5] },
      metadata: {
        alias: 'Streets',
        group: 'mobility',
        identify: true,
        fields: { name: { alias: 'Name' }, kind: { alias: 'Kind' }, width: { alias: 'Width', suffix: 'm' } },
        hover: { enable: true, fields: [{ name: { alias: 'Street' } }] },
        legend: { wmslegend: swatch([[COLORS.street, 'Avenue or street', 'line']]) },
      },
    },
    {
      id: 'bikes',
      type: 'line',
      source: 'bikes',
      paint: { 'line-color': COLORS.bike, 'line-width': 3, 'line-dasharray': [2, 1] },
      metadata: {
        alias: 'Bike lanes',
        group: 'mobility',
        identify: true,
        fields: { name: { alias: 'Name' }, length: { alias: 'Length', suffix: 'km', mask: '#.00' }, lanes: { alias: 'Lanes' } },
        legend: { wmslegend: swatch([[COLORS.bike, 'Bike lane', 'line']]) },
      },
    },
    {
      id: 'schools',
      type: 'circle',
      source: 'schools',
      paint: { 'circle-color': COLORS.school, 'circle-radius': 7, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 },
      metadata: {
        alias: 'Schools',
        group: 'services',
        identify: true,
        fields: { name: { alias: 'Name' }, level: { alias: 'Level' }, students: { alias: 'Students', mask: '#,###' } },
        hover: { enable: true, fields: [{ name: { alias: 'School' } }, { students: { alias: 'Students' } }] },
        legend: { wmslegend: swatch([[COLORS.school, 'School', 'point']]) },
      },
    },
    {
      id: 'health',
      type: 'circle',
      source: 'health',
      paint: { 'circle-color': COLORS.health, 'circle-radius': 7, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 },
      metadata: {
        alias: 'Health',
        group: 'services',
        identify: true,
        fields: { name: { alias: 'Name' }, kind: { alias: 'Kind' }, beds: { alias: 'Beds' } },
        hover: { enable: true, fields: [{ name: { alias: 'Center' } }, { kind: { alias: 'Kind' } }] },
        legend: { wmslegend: swatch([[COLORS.health, 'Hospital or health center', 'point']]) },
      },
    },
  ],
} as unknown as StyleSpecification
