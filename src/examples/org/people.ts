// A made-up company of 28, who reports to whom. Names are invented.
export type Dept = 'Leadership' | 'Engineering' | 'Design' | 'Product' | 'Sales' | 'Operations'

export interface Person {
  id: string
  name: string
  role: string
  dept: Dept
  location: string
  managerId: string | null
  since: number
}

export const depts: { id: Dept; icon: string; tone: string }[] = [
  { id: 'Leadership', icon: 'star', tone: 'bg-inverse-surface text-inverse-on-surface' },
  { id: 'Engineering', icon: 'code', tone: 'bg-primary-container text-on-primary-container' },
  { id: 'Design', icon: 'palette', tone: 'bg-tertiary-container text-on-tertiary-container' },
  { id: 'Product', icon: 'lightbulb', tone: 'bg-secondary-container text-on-secondary-container' },
  { id: 'Sales', icon: 'handshake', tone: 'bg-error-container text-on-error-container' },
  { id: 'Operations', icon: 'settings', tone: 'bg-surface-container-highest text-on-surface-variant' },
]
export const deptOf = (d: Dept) => depts.find((x) => x.id === d)!

export const people: Person[] = [
  { id: 'p1', name: 'Amara Okafor', role: 'Chief Executive Officer', dept: 'Leadership', location: 'Lisbon', managerId: null, since: 2017 },
  { id: 'p2', name: 'Tomás Herrera', role: 'Chief Technology Officer', dept: 'Engineering', location: 'Buenos Aires', managerId: 'p1', since: 2017 },
  { id: 'p3', name: 'Ines Duarte', role: 'Head of Design', dept: 'Design', location: 'Lisbon', managerId: 'p1', since: 2018 },
  { id: 'p4', name: 'Kenji Watanabe', role: 'Head of Product', dept: 'Product', location: 'Tokyo', managerId: 'p1', since: 2019 },
  { id: 'p5', name: 'Freya Lindqvist', role: 'VP of Sales', dept: 'Sales', location: 'Stockholm', managerId: 'p1', since: 2019 },
  { id: 'p6', name: 'Omar Haddad', role: 'Head of Operations', dept: 'Operations', location: 'Lisbon', managerId: 'p1', since: 2020 },
  { id: 'p7', name: 'Lucía Benítez', role: 'Engineering Manager, Web', dept: 'Engineering', location: 'Buenos Aires', managerId: 'p2', since: 2019 },
  { id: 'p8', name: 'Dmitri Volkov', role: 'Engineering Manager, Platform', dept: 'Engineering', location: 'Berlin', managerId: 'p2', since: 2020 },
  { id: 'p9', name: 'Priya Raman', role: 'Staff Engineer', dept: 'Engineering', location: 'Bangalore', managerId: 'p2', since: 2018 },
  { id: 'p10', name: 'Noah Fischer', role: 'Frontend Engineer', dept: 'Engineering', location: 'Berlin', managerId: 'p7', since: 2021 },
  { id: 'p11', name: 'Valentina Rossi', role: 'Frontend Engineer', dept: 'Engineering', location: 'Milan', managerId: 'p7', since: 2022 },
  { id: 'p12', name: 'Mateo Silva', role: 'Mobile Engineer', dept: 'Engineering', location: 'São Paulo', managerId: 'p7', since: 2023 },
  { id: 'p13', name: 'Aisha Bello', role: 'Backend Engineer', dept: 'Engineering', location: 'Lagos', managerId: 'p8', since: 2021 },
  { id: 'p14', name: 'Lars Eriksen', role: 'Site Reliability Engineer', dept: 'Engineering', location: 'Oslo', managerId: 'p8', since: 2022 },
  { id: 'p15', name: 'Mei Chen', role: 'Data Engineer', dept: 'Engineering', location: 'Singapore', managerId: 'p8', since: 2024 },
  { id: 'p16', name: 'Sofia Marques', role: 'Product Designer', dept: 'Design', location: 'Porto', managerId: 'p3', since: 2021 },
  { id: 'p17', name: 'Elijah Brooks', role: 'Product Designer', dept: 'Design', location: 'Toronto', managerId: 'p3', since: 2022 },
  { id: 'p18', name: 'Hana Kobayashi', role: 'UX Researcher', dept: 'Design', location: 'Tokyo', managerId: 'p3', since: 2023 },
  { id: 'p19', name: 'Rafael Costa', role: 'Product Manager, Growth', dept: 'Product', location: 'Lisbon', managerId: 'p4', since: 2021 },
  { id: 'p20', name: 'Zoe Martin', role: 'Product Manager, Core', dept: 'Product', location: 'Paris', managerId: 'p4', since: 2022 },
  { id: 'p21', name: 'Ahmed Saleh', role: 'Account Executive', dept: 'Sales', location: 'Dubai', managerId: 'p5', since: 2021 },
  { id: 'p22', name: 'Ingrid Berg', role: 'Account Executive', dept: 'Sales', location: 'Stockholm', managerId: 'p5', since: 2022 },
  { id: 'p23', name: 'Carlos Mendoza', role: 'Sales Engineer', dept: 'Sales', location: 'Mexico City', managerId: 'p5', since: 2023 },
  { id: 'p24', name: 'Grace Mwangi', role: 'Customer Success Lead', dept: 'Sales', location: 'Nairobi', managerId: 'p5', since: 2020 },
  { id: 'p25', name: 'Julien Moreau', role: 'Finance Manager', dept: 'Operations', location: 'Paris', managerId: 'p6', since: 2020 },
  { id: 'p26', name: 'Nadia Kowalski', role: 'People Partner', dept: 'Operations', location: 'Warsaw', managerId: 'p6', since: 2021 },
  { id: 'p27', name: 'Ben Carter', role: 'IT Specialist', dept: 'Operations', location: 'Lisbon', managerId: 'p6', since: 2024 },
  { id: 'p28', name: 'Yara Nasser', role: 'Customer Success Manager', dept: 'Sales', location: 'Beirut', managerId: 'p24', since: 2024 },
]

export const emailOf = (p: Person) => `${p.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '.')}@crew.example`
