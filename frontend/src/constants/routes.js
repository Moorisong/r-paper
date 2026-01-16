export const ROUTES = {
  home: '/',
  paper: '/r/:slug',
  paperView: (slug) => `/r/${slug}`,
  notFound: '*',
};
