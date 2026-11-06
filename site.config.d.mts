export interface SiteTargetDefinition {
  origin: string
  base: string
  cname: string | null
}

export interface SiteTarget extends SiteTargetDefinition {
  name: 'pages' | 'domain'
  url: string
}

export const targets: Record<'pages' | 'domain', SiteTargetDefinition>
export const LIVE_TARGET: 'pages' | 'domain'
export function siteTarget(mode?: string): SiteTarget
