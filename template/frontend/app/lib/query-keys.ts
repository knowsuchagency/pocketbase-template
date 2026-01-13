export const queryKeys = {
  user: {
    all: ['user'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
  },
  theme: {
    all: ['theme'] as const,
    current: () => [...queryKeys.theme.all, 'current'] as const,
  },
};
