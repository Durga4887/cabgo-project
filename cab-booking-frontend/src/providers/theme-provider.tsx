import type { PropsWithChildren } from 'react'
import type { ThemeProviderProps } from 'next-themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: PropsWithChildren<ThemeProviderProps>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}