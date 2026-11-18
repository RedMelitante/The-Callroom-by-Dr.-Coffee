// schema.org structured data for the coffee shop (used on Home and Visit Us).
export const shopSchema = (site) => ({
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'The Callroom by Dr. Coffee',
  url: site,
  image: new URL('/images/hero-drinks.webp', site).href,
  logo: new URL('/images/logo.webp', site).href,
  telephone: '+639327233849',
  email: 'thecallroombydc@gmail.com',
  servesCuisine: 'Coffee',
  priceRange: '₱100–₱190',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Madonna Hospital, 2nd Floor, JV Serina St',
    addressLocality: 'Cagayan de Oro',
    addressRegion: 'Misamis Oriental',
    postalCode: '9000',
    addressCountry: 'PH',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 8.4771923, longitude: 124.6352272 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '06:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://www.instagram.com/thecallroombydrcoffee', 'https://www.facebook.com/share/19KisJPYkX/'],
});
