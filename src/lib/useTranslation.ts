import { useSettingsStore } from '../store/useSettingsStore'
import { translations } from './i18n'

export function useTranslation() {
  const language = useSettingsStore((s) => s.language)
  return { t: translations[language], language }
}
