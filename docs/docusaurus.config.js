// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Maskbook Dveloper Dcoumentation',
  tagline: 'Maskbook are cool',
  url: 'https://dimensiondev.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'DimensionDev', // Usually your GitHub org/user name.
  projectName: 'Maskbook', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/DimensionDev/Maskbook/tree/develop/docs/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/DimensionDev/Maskbook/tree/develop/docs/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      },
      zh:{
        htmlLang: 'zh-Hans'
      }
    },
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
      id: 'support_us',
      content:
        'We are hiring, please contact us by  <a target="_blank" rel="noopener noreferrer" href="mailto:job@mask.io">job@mask.io</a>',
      backgroundColor: '#2563eb',
      textColor: '#fff',
      isCloseable: true,
    },
      navbar: {
        title: 'Maskbook Dveloper Dcoumentation',
        logo: {
          alt: 'Maskbook Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'guide/intro',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/maskbook',
              },
               {
                label: 'Telegram',
                href: 'https://t.me/maskbook_group',
              },
              {
                label: 'Discord',
                href: 'http://discord.gg/masknetwork',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/realMaskNetwork',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/DimensionDev/Maskbook',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mask Network, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
