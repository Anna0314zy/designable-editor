import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_us from './locales/en.json'
import zh_cn from './locales/zh.json'
export const languageKey = {
  en_us: 'English',
  zh_cn: '中文',
}
export const defaultNS = 'header'
export const resources = {
  en_us,
  zh_cn,
} as const
const defaultLanguage = 'zh'
i18n
  .use(initReactI18next) //init i18next
  .init({
    //引入资源文件
    resources: {
      en: {
        translation: resources.en_us,
      },
      zh: {
        translation: resources.zh_cn,
      },
    },
    //选择默认语言，选择内容为上述配置中的key，即en/zh
    fallbackLng: defaultLanguage,
    // debug: process.env.AS_ENV === 'dev',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export const t = i18n.t.bind(i18n)

export default i18n
