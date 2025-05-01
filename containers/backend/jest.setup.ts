jest.mock('./src/core/services/prisma.service', () => {
    return {
      PrismaService: jest.fn().mockImplementation(() => ({
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
        },
      })),
    };
  });
  