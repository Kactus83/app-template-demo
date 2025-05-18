import { NavigationType } from '@prisma/client';

export const initialUserNavigation = {
  type: NavigationType.ADMIN,
  compact: [
    {
      id: 'example',
      title: 'Example',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/example',
    },
    {
      id: 'templates-overview',
      title: 'Templates Overview',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/demo/templates-overview',
    },
  ],
  default: [
    {
      id: 'example',
      title: 'Example',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/example',
    },
    {
      id: 'templates-overview',
      title: 'Templates Overview',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/demo/templates-overview',
    },
  ],
  futuristic: [
    {
      id: 'example',
      title: 'Example',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/example',
    },
    {
      id: 'templates-overview',
      title: 'Templates Overview',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/demo/templates-overview',
    },
  ],
  horizontal: [
    {
      id: 'example',
      title: 'Example',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/example',
    },
    {
      id: 'templates-overview',
      title: 'Templates Overview',
      type: 'basic',
      icon: 'heroicons_outline:chart-pie',
      link: '/demo/templates-overview',
    },
  ],
};
