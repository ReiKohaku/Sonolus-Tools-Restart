interface LeftDrawerItemBase {
  type?: 'link' | 'dir'
  name: string | Record<string, string>
}

export interface LeftDrawerItemLink extends LeftDrawerItemBase {
  type?: 'link'
  link: string
}

export interface LeftDrawerItemDir extends LeftDrawerItemBase {
  type: 'dir'
  links: LeftDrawerItem[]
}

export type LeftDrawerItem = LeftDrawerItemLink | LeftDrawerItemDir
