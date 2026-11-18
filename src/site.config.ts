// All of the site's words live here, so copy can change without touching layout code.
// Anything marked TODO is placeholder text: replace it with the real thing.

export const site = {
  name: 'The Callroom',
  byline: 'by Dr. Coffee',
  // TODO: one sentence that says what The Callroom is.
  description:
    'The Callroom by Dr. Coffee: a place to pause between pages, refill, and talk shop.',

  hero: {
    eyebrow: 'Now brewing',
    title: 'Step into the callroom.',
    // TODO: replace with the real pitch.
    lede: 'Straight talk, good coffee and a quiet corner between shifts. Dr. Coffee is putting the kettle on.',
    primaryCta: { label: 'Get notified', href: '#join' },
    secondaryCta: { label: 'What is it?', href: '#about' },
  },

  about: {
    title: 'What is The Callroom?',
    // TODO: replace with the real story.
    paragraphs: [
      'Every hospital has one: the small room down the hall where you catch your breath, swap stories and grab a cup before the next page.',
      'The Callroom is that room, opened up. Dr. Coffee hosts it.',
    ],
  },

  // TODO: swap these for what The Callroom actually offers.
  features: [
    {
      title: 'Conversations',
      body: 'Honest, unhurried talks about the work and the people who do it.',
    },
    {
      title: 'Coffee',
      body: 'Recommendations, rituals and the occasional strong opinion about beans.',
    },
    {
      title: 'Community',
      body: 'A room full of people who get it, whatever hour you clock in.',
    },
  ],

  join: {
    title: 'Pull up a chair.',
    body: 'Be the first to hear when the doors open.',
    // TODO: point this at a signup form or newsletter (e.g. a Mailchimp/ConvertKit/Substack link).
    cta: { label: 'Email Dr. Coffee', href: 'mailto:hello@example.com' },
  },

  // TODO: add real profile URLs, or leave the list empty to hide the links.
  social: [] as { label: string; href: string }[],
};
