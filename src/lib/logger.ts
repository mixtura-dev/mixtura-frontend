import { IS_FIREFOX, IS_SAFARI } from '@/environment/userAgent'

type LogLevel = 'log' | 'warn' | 'error' | 'debug'
interface Logger {
  (message: unknown, ...optionalParams: unknown[]): void
  warn: (message: unknown, ...optionalParams: unknown[]) => void
  error: (message: unknown, ...optionalParams: unknown[]) => void
  debug: (message: unknown, ...optionalParams: unknown[]) => void
  group: (...args: unknown[]) => void
  groupCollapsed: (...args: unknown[]) => void
  groupEnd: () => void
}
const IS_WEBKIT = IS_SAFARI || IS_FIREFOX
const STYLES_SUPPORTED = !IS_WEBKIT

const DEBUG = import.meta.env.DEV || localStorage.getItem('DEBUG') === 'true'

const TAG_COLOR = '#20b2aa'

const LEVEL_COLORS: Record<LogLevel, string> = {
  log: '#61dafb', // светло-голубой (как React DevTools)
  warn: '#f5a623', // тёплый янтарь (менее агрессивный, чем оранжевый)
  error: '#e74c3c', // насыщенный красный (но не "огненный")
  debug: '#5764f8', // серо-голубой — спокойный, не отвлекает
}

export function createLogger(tag: string): Logger {
  const fullTag = `[${tag}]`

  const makeLog =
    (level: LogLevel) =>
    (...args: unknown[]) => {
      if (level === 'debug' && !DEBUG) return

      if (STYLES_SUPPORTED) {
        const tagStyle = `color: ${TAG_COLOR}; font-weight: bold;`
        const levelStyle = `color: ${LEVEL_COLORS[level]}; font-weight: bold;`

        const [first, ...rest] = args
        if (typeof first === 'string') {
          console[level](`%c${fullTag} %c${first}`, tagStyle, levelStyle, ...rest)
        } else {
          console[level](`%c${fullTag}`, tagStyle, first, ...rest)
        }
      } else {
        console[level](fullTag, ...args)
      }
    }

  const makeGroup =
    (method: 'group' | 'groupCollapsed') =>
    (...args: unknown[]) => {
      if (STYLES_SUPPORTED) {
        const tagStyle = `color: ${TAG_COLOR}; font-weight: bold;`
        const [first, ...rest] = args
        if (typeof first === 'string') {
          console[method](`%c${fullTag} %c${first}`, tagStyle, 'font-weight: normal;', ...rest)
        } else {
          console[method](`%c${fullTag}`, tagStyle, ...args)
        }
      } else {
        console[method](fullTag, ...args)
      }
    }

  const logger = makeLog('log') as Logger
  logger.warn = makeLog('warn')
  logger.error = makeLog('error')
  logger.debug = makeLog('debug')
  logger.group = makeGroup('group')
  logger.groupCollapsed = makeGroup('groupCollapsed')
  logger.groupEnd = () => console.groupEnd()
  return logger
}
