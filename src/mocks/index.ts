export async function initMocks() {
  if (typeof window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_USE_MOCKS !== 'true') return;

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });

  console.log('[MSW] Mock Service Worker started');
}
