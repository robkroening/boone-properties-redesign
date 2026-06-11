import { useState } from 'react'
import './App.css'

import logo from './assets/logo/boone-logo.png'
import heroImage from './assets/hero.webp'
import listingHeroImage from './assets/listing-hero.webp'
import mountainHomeHero from './assets/mountain-home-hero.jpg'

import davidProfilePicture from './assets/people/david_profile_picture.webp'
import janeProfilePicture from './assets/people/jane_profile_picture.webp'
import robertProfilePicture from './assets/people/robert_profile_picture.jpeg'

type ServiceCardProps = {
  title: string
  description: string
  items: string[]
  buttonText: string
  href: string
}

type TeamMemberProps = {
  name: string
  role: string
  description: string
  image: string
  imageClassName?: string
}

type ListingStatus = 'Active' | 'Recently Sold' | 'Sold'

type Project = {
  id: string
  title: string
  category: string
  location: string
  description: string
  coverImage: string
  images: string[]
  status?: ListingStatus
}

const contactEmailLink = 'mailto:jbkroen@gmail.com?subject=Boone%20Properties%20Inquiry'

const projectImageModules = import.meta.glob('./assets/projects/**/*.{webp,png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

function getProjectAssets(projectFolderName: string) {
  const projectEntries = Object.entries(projectImageModules)
    .filter(([path]) => path.includes(`/projects/${projectFolderName}/`))
    .sort(([pathA], [pathB]) => naturalSort(pathA, pathB))

  const coverEntry = projectEntries.find(([path]) => path.endsWith('/cover.webp'))
  const galleryEntries = projectEntries.filter(([path]) => !path.endsWith('/cover.webp'))

  return {
    coverImage: coverEntry?.[1] ?? galleryEntries[0]?.[1] ?? '',
    images: galleryEntries.map(([, image]) => image),
  }
}

const customAduAssets = getProjectAssets('abingdon-adu')
const amityGardensAssets = getProjectAssets('amity-gardens')
const beverlyWoodsAssets = getProjectAssets('beverly-woods')
const madisonParkListingAssets = getProjectAssets('madison-park-listing')
const myersParkAssets = getProjectAssets('myers-park')
const sherwoodForestAssets = getProjectAssets('sherwood-forest')
const woodbridgeAssets = getProjectAssets('woodbridge')

const featuredListing: Project = {
  id: 'madison-park-listing',
  title: 'Madison Park',
  category: 'Featured Listing',
  status: 'Recently Sold',
  location: 'Charlotte, NC',
  description:
    'A recently sold Madison Park listing in Charlotte, NC. View the full property gallery, see interior and exterior photos, and contact Jane Kroening for buyer or seller representation.',
  coverImage: listingHeroImage || madisonParkListingAssets.coverImage,
  images: madisonParkListingAssets.images,
}

const listingArchiveRaw: Project[] = [
  featuredListing,
  {
    id: 'amity-gardens',
    title: 'Amity Gardens',
    category: 'Sold Listing',
    status: 'Sold',
    location: 'Charlotte, NC',
    description:
      'A completed Charlotte listing featuring exterior updates, clean presentation, and a polished market-ready result.',
    coverImage: amityGardensAssets.coverImage,
    images: amityGardensAssets.images,
  },
  {
    id: 'beverly-woods',
    title: 'Beverly Woods',
    category: 'Sold Listing',
    status: 'Sold',
    location: 'Charlotte, NC',
    description:
      'A Beverly Woods listing with bright interior spaces, clean finishes, refreshed rooms, and strong presentation throughout the home.',
    coverImage: beverlyWoodsAssets.coverImage,
    images: beverlyWoodsAssets.images,
  },
  {
    id: 'myers-park',
    title: 'Myers Park',
    category: 'Sold Listing',
    status: 'Sold',
    location: 'Charlotte, NC',
    description:
      'A completed Myers Park listing featuring updated interiors, clean finishes, bright living spaces, renovated bathrooms, and polished property presentation.',
    coverImage: myersParkAssets.coverImage,
    images: myersParkAssets.images,
  },
  {
    id: 'sherwood-forest',
    title: 'Sherwood Forest',
    category: 'Sold Listing',
    status: 'Sold',
    location: 'Charlotte, NC',
    description:
      'A Sherwood Forest listing showcasing a clean home presentation, updated spaces, and a full gallery of completed interior and exterior photos.',
    coverImage: sherwoodForestAssets.coverImage,
    images: sherwoodForestAssets.images,
  },
  {
    id: 'woodbridge',
    title: 'Woodbridge',
    category: 'Sold Listing',
    status: 'Sold',
    location: 'Charlotte, NC',
    description:
      'A Woodbridge listing featuring a full home gallery with exterior updates, interior spaces, and listing-ready presentation.',
    coverImage: woodbridgeAssets.coverImage,
    images: woodbridgeAssets.images,
  },
]

const listingArchive: Project[] = listingArchiveRaw.filter((listing) => listing.coverImage)

const projects: Project[] = [
  {
    id: 'abingdon-adu',
    title: 'Custom ADU',
    category: 'ADU Custom Build',
    location: 'Charlotte, NC',
    description:
      'A custom accessory dwelling unit featuring a finished kitchen, living space, loft area, exterior details, and flexible private living space designed for long-term property value.',
    coverImage: customAduAssets.coverImage,
    images: customAduAssets.images,
  },
].filter((project) => project.coverImage)

function ServiceCard({ title, description, items, buttonText, href }: ServiceCardProps) {
  return (
    <article className="service-card">
      <h3>{title}</h3>
      <p>{description}</p>

      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <a className="outline-link" href={href}>
        {buttonText}
      </a>
    </article>
  )
}

function TeamMember({ name, role, description, image, imageClassName }: TeamMemberProps) {
  return (
    <article className="team-card">
      <img
        src={image}
        alt={`${name} profile`}
        className={`team-headshot ${imageClassName ?? ''}`}
      />
      <h3>{name}</h3>
      <p className="team-role">{role}</p>
      <p>{description}</p>
    </article>
  )
}

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [returnTargetId, setReturnTargetId] = useState('projects')

  function openProject(project: Project, returnTo = 'projects') {
    setReturnTargetId(returnTo)
    setSelectedProject(project)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeProject(scrollTargetId = returnTargetId) {
    setSelectedProject(null)

    setTimeout(() => {
      const targetSection = document.getElementById(scrollTargetId)

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 0)
  }

  if (selectedProject) {
    return (
      <main>
        <header className="site-header">
          <button
            className="logo-link logo-button"
            onClick={() => closeProject('home')}
            aria-label="Back home"
          >
            <img src={logo} alt="Boone Properties logo" className="site-logo" />
          </button>

          <nav className="desktop-nav" aria-label="Project navigation">
            <button onClick={() => closeProject('home')}>Home</button>
            <button onClick={() => closeProject('testimonials')}>Testimonials</button>
            <button onClick={() => closeProject('projects')}>Our Projects</button>
            <button onClick={() => closeProject('adu')}>ADU</button>
            <button onClick={() => closeProject('real-estate')}>Listings</button>
          </nav>

          <a className="contact-button" href={contactEmailLink}>
            Contact Us
          </a>
        </header>

        <section
          className="project-detail-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.56), rgba(0,0,0,.56)), url(${selectedProject.coverImage})`,
          }}
        >
          <div className="project-detail-hero-content">
            <p className="project-detail-kicker">{selectedProject.status ?? selectedProject.category}</p>
            <h1>{selectedProject.title}</h1>
            <p>{selectedProject.location}</p>
          </div>
        </section>

        <section className="project-detail-intro">
          <button className="back-button" onClick={() => closeProject()}>
            ← Back
          </button>

          <div>
            <p className="section-kicker">{selectedProject.category}</p>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>
          </div>
        </section>

        <section className="project-gallery-section">
          <div className="section-heading centered">
            <p className="section-kicker">Gallery</p>
            <h2>Photos from {selectedProject.title}</h2>
          </div>

          <div className="project-photo-grid">
            {selectedProject.images.map((image, index) => (
              <button className="project-photo-card" key={image}>
                <img src={image} alt={`${selectedProject.title} project photo ${index + 1}`} />
              </button>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <h2>Interested in a Similar Home or Project?</h2>
          <p>
            Contact Boone Properties to talk about buying, selling, renovation, ADUs, or future
            construction work.
          </p>

          <a className="light-button" href={contactEmailLink}>
            Contact Us
          </a>
        </section>

        <footer className="site-footer">
          <img src={logo} alt="Boone Properties logo" className="footer-logo" />

          <div>
            <p>Boone Properties LLC</p>
            <span>Renovation & Real Estate</span>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main>
      <header className="site-header">
        <a className="logo-link" href="#home" aria-label="Boone Properties home">
          <img src={logo} alt="Boone Properties logo" className="site-logo" />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#projects">Our Projects</a>
          <a href="#adu">ADU</a>
          <a href="#real-estate">Listings</a>
        </nav>

        <a className="contact-button" href={contactEmailLink}>
          Contact Us
        </a>
      </header>

      <section
        className="hero-section"
        id="home"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url(${heroImage})`,
        }}
      >
        <div className="hero-content">
          <h1>Real Estate, Renovation & Custom Building</h1>
          <p>
            Boone Properties helps clients buy, sell, renovate, and build homes with a trusted
            family team combining real estate experience, general contracting knowledge, and
            hands-on project management.
          </p>

          <div className="hero-actions">
            <a className="light-button" href="#real-estate">
              View Listings
            </a>
            <a className="outline-button-light" href="#projects">
              View Projects
            </a>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <p className="section-kicker">Boone Properties LLC</p>
        <h2>Real Estate and General Contracting Under One Roof</h2>
        <p>
          Buying, selling, renovating, or building a home can feel overwhelming. Boone Properties
          brings real estate guidance and construction experience together so clients can make
          smarter decisions before, during, and after a move.
        </p>
      </section>

      <section className="split-services-section">
        <div className="section-heading">
          <p className="section-kicker">How We Can Help</p>
          <h2>Two Services. One Trusted Team.</h2>
        </div>

        <div className="service-grid">
          <ServiceCard
            title="Real Estate"
            description="Guidance for buyers, sellers, first-time homeowners, empty nesters, and families looking to make their next move with confidence."
            items={[
              'Featured listings',
              'Listing archive',
              'Buyer and seller support',
              'Charlotte market knowledge',
              'Preparing homes for market',
            ]}
            buttonText="Explore Listings"
            href="#real-estate"
          />

          <ServiceCard
            title="General Contracting"
            description="Renovation and building support for homeowners looking to improve, expand, or customize their living space."
            items={[
              'ADUs and guesthouses',
              'Home renovations',
              'Additions and improvements',
              'Custom finish work',
              'Future construction projects',
            ]}
            buttonText="Explore Projects"
            href="#projects"
          />
        </div>
      </section>

      <section className="featured-listing-section" id="real-estate">
        <div className="featured-listing-text">
          <p className="section-kicker">Featured Listing</p>
          <h2>{featuredListing.title}</h2>
          <p>
            Madison Park was recently sold in Charlotte, NC. View the full property gallery, see
            interior and exterior photos, and contact Jane Kroening for buyer or seller
            representation.
          </p>

          <div className="featured-listing-tags">
            <span>{featuredListing.status}</span>
            <span>{featuredListing.location}</span>
          </div>

          <div className="listing-actions">
            <button
              className="navy-button button-reset"
              onClick={() => openProject(featuredListing, 'real-estate')}
            >
              View Listing Gallery
            </button>

            <a className="outline-link listing-contact-link" href={contactEmailLink}>
              Contact Jane
            </a>
          </div>
        </div>

        <button
          className="featured-listing-image-card"
          onClick={() => openProject(featuredListing, 'real-estate')}
        >
          <img src={listingHeroImage} alt="Madison Park featured listing" />
        </button>
      </section>

      <section className="listing-archive-section" id="listing-archive">
        <div className="section-heading centered">
          <p className="section-kicker">Listing Archive</p>
          <h2>Sold Properties</h2>
          <p>
            A clean archive of homes Boone Properties has helped market, sell, renovate, or prepare
            for the Charlotte real estate market.
          </p>
        </div>

        <div className="listing-archive-grid">
          {listingArchive.map((listing) => (
            <button
              className="listing-archive-card"
              key={listing.id}
              onClick={() => openProject(listing, 'listing-archive')}
            >
              <img src={listing.coverImage} alt={`${listing.title} listing cover`} />

              <div className="listing-archive-card-content">
                <p>{listing.status}</p>
                <h3>{listing.title}</h3>
                <span>{listing.location}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-heading centered">
          <p className="section-kicker">Our Projects</p>
          <h2>Renovations, ADUs & Future Builds</h2>
          <p>A focused look at Boone Properties construction, renovation, and future build work.</p>
        </div>

        <div className="project-grid project-grid-single">
          {projects.map((project) => (
            <button
              className="real-project-card"
              key={project.id}
              onClick={() => openProject(project, 'projects')}
            >
              <img src={project.coverImage} alt={`${project.title} cover`} />
              <div className="real-project-card-content">
                <p>{project.category}</p>
                <h3>{project.title}</h3>
                <span>{project.location}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="adu-section" id="adu">
        <div
          className="adu-banner"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.52)), url(${customAduAssets.coverImage})`,
          }}
        >
          <h2>Custom ADU Build</h2>
        </div>

        <div className="adu-content">
          <div>
            <p className="section-kicker">Accessory Dwelling Units</p>
            <h2>Functional Living Space Built with Purpose</h2>
          </div>

          <div className="adu-text-card">
            <p>
              Accessory dwelling units create flexible living space for family, guests, rental
              potential, or long-term property value.
            </p>
            <p>
              Boone Properties helps bring these projects from planning to finished living space
              with thoughtful design, practical craftsmanship, and careful project coordination.
            </p>

            <button
              className="navy-button button-reset"
              onClick={() => openProject(projects[0], 'adu')}
            >
              View ADU Gallery
            </button>
          </div>
        </div>

        <div className="adu-gallery">
          {customAduAssets.images.slice(0, 4).map((image, index) => (
            <button className="adu-gallery-card" key={image} onClick={() => openProject(projects[0], 'adu')}>
              <img src={image} alt={`ADU preview ${index + 1}`} />
              <span>{['Kitchen', 'Living Space', 'Loft', 'Exterior'][index] ?? 'ADU'}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="future-section">
        <div
          className="future-image"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.22)), url(${mountainHomeHero})`,
          }}
        >
          <span>Blowing Rock, NC</span>
        </div>

        <div className="future-copy">
          <p className="section-kicker">Future Project</p>
          <h2>Mountain House Construction in Blowing Rock, NC</h2>
          <p>
            Boone Properties is preparing for a future mountain house construction project in
            Blowing Rock, North Carolina. This project will focus on thoughtful design, durable
            construction, and a warm, functional layout suited for mountain living.
          </p>
        </div>
      </section>

      <section className="testimonials-section" id="testimonials">
        <div className="section-heading centered">
          <p className="section-kicker">Testimonials</p>
          <h2>What Clients Are Saying</h2>
        </div>

        <div className="testimonial-grid">
          <article className="testimonial-card">
            <div className="testimonial-avatar" />
            <p>
              “Working with Boone Properties made the entire process smooth, organized, and easy to
              understand from start to finish.”
            </p>
            <div className="stars">★★★★★</div>
            <strong>Real Estate Client</strong>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-avatar" />
            <p>
              “David’s craftsmanship, communication, and attention to detail made a huge difference
              throughout our renovation.”
            </p>
            <div className="stars">★★★★★</div>
            <strong>Renovation Client</strong>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-avatar" />
            <p>
              “Having real estate and construction experience together helped us make confident
              decisions about our home.”
            </p>
            <div className="stars">★★★★★</div>
            <strong>Boone Properties Client</strong>
          </article>
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading centered">
          <p className="section-kicker">About Us</p>
          <h2>A Family Team Built Around Homes</h2>
          <p>
            Boone Properties is led by a family team combining local real estate knowledge, hands-on
            construction experience, and organized project support.
          </p>
        </div>

        <div className="team-grid">
          <TeamMember
            name="Jane Kroening"
            role="Realtor"
            image={janeProfilePicture}
            description="Helping buyers and sellers navigate the Charlotte market with personal guidance and local experience."
          />

          <TeamMember
            name="David Kroening"
            role="General Contractor"
            image={davidProfilePicture}
            imageClassName="david-headshot"
            description="Bringing hands-on renovation and building experience to ADUs, home improvements, and custom projects."
          />

          <TeamMember
            name="Robert Kroening"
            role="Project Manager"
            image={robertProfilePicture}
            description="Supporting project organization, digital systems, website management, and client-facing project coordination."
          />
        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2>Ready to Buy, Sell, Renovate, or Build?</h2>
        <p>
          Whether you are looking for your next home, preparing to sell, planning an ADU, renovating
          your current house, or thinking about a future construction project, Boone Properties would
          be happy to help.
        </p>

        <a className="light-button" href={contactEmailLink}>
          Contact Us
        </a>
      </section>

      <footer className="site-footer">
        <img src={logo} alt="Boone Properties logo" className="footer-logo" />

        <div>
          <p>Boone Properties LLC</p>
          <span>Renovation & Real Estate</span>
        </div>
      </footer>
    </main>
  )
}

export default App
