type LogLevel = 'error' | 'warn' | 'info';

interface LogPayload {
  message: string;
  stack?: string;
  level: LogLevel;
  context?: Record<string, unknown>;
}

async function sendLog(payload: LogPayload) {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail - don't want logging to break the app
  }
}

export function logError(message: string, error?: Error, context?: Record<string, unknown>) {
  console.error(message, error, context);
  sendLog({
    message,
    stack: error?.stack,
    level: 'error',
    context,
  });
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  console.warn(message, context);
  sendLog({
    message,
    level: 'warn',
    context,
  });
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  console.info(message, context);
  sendLog({
    message,
    level: 'info',
    context,
  });
}

export function logDebug(message: string, context?: Record<string, unknown>) {
  // Only log to console in development, always send to server
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', message, context);
  }
  sendLog({
    message: `[DEBUG] ${message}`,
    level: 'info',
    context,
  });
}

// Setup global error handlers
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    logError('Unhandled error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError('Unhandled promise rejection', event.reason instanceof Error ? event.reason : undefined, {
      reason: String(event.reason),
    });
  });

  // Intercept console.error
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    originalError(...args);

    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    sendLog({
      message: `console.error: ${message}`,
      level: 'error',
    });
  };
}
