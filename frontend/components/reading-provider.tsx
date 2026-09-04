"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  DEFAULT_SETTINGS,
  PROFILES,
  type ReadingSettings,
} from "@/lib/profiles"

interface ReadingState {
  settings: ReadingSettings
  profileId: string
  ready: boolean
  setSetting: <K extends keyof ReadingSettings>(
    key: K,
    value: ReadingSettings[K],
  ) => void
  applyProfile: (id: string) => void
  reset: () => void
}

const ReadingContext = createContext<ReadingState | null>(null)

const STORAGE_KEY = "readable:settings"
const PROFILE_KEY = "readable:profile"

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS)
  const [profileId, setProfileId] = useState<string>("standard")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      const p = sessionStorage.getItem(PROFILE_KEY)
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) })
      if (p) setProfileId(p)
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      sessionStorage.setItem(PROFILE_KEY, profileId)
    } catch {
      /* ignore */
    }
  }, [settings, profileId, ready])

  const setSetting = useCallback(
    <K extends keyof ReadingSettings>(key: K, value: ReadingSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
      setProfileId((prev) => (prev === "custom" ? prev : "custom"))
    },
    [],
  )

  const applyProfile = useCallback((id: string) => {
    const profile = PROFILES.find((p) => p.id === id)
    if (!profile) return
    setProfileId(id)
    if (id === "custom") return
    setSettings({ ...DEFAULT_SETTINGS, ...profile.settings })
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setProfileId("standard")
  }, [])

  const value = useMemo<ReadingState>(
    () => ({ settings, profileId, ready, setSetting, applyProfile, reset }),
    [settings, profileId, ready, setSetting, applyProfile, reset],
  )

  return (
    <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>
  )
}

export function useReading() {
  const ctx = useContext(ReadingContext)
  if (!ctx) throw new Error("useReading must be used within ReadingProvider")
  return ctx
}
