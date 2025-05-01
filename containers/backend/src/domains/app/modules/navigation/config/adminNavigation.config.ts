import { NavigationType } from '@prisma/client';

export const initialAdminNavigation = {
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
      id: 'token-buy',
      title: 'Buy Tokens',
      type: 'basic',
      icon: 'heroicons_outline:currency-dollar', 
      link: '/web3/token-buy', 
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
      id: 'token-buy',
      title: 'Buy Tokens',
      type: 'basic',
      icon: 'heroicons_outline:currency-dollar',
      link: '/web3/token-buy',
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
      id: 'token-buy',
      title: 'Buy Tokens',
      type: 'basic',
      icon: 'heroicons_outline:currency-dollar',
      link: '/web3/token-buy',
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
      id: 'token-buy',
      title: 'Buy Tokens',
      type: 'basic',
      icon: 'heroicons_outline:currency-dollar',
      link: '/web3/token-buy',
    },
  ],
};
