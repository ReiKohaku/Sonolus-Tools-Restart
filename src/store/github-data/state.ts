export interface GithubContentStateInterface {
  content: GithubContentDirInterface | null
  cache: Record<string, ArrayBuffer>
  defaultLang: string
}

export interface GithubContentFileInterface {
  name: string
  title: Record<string, string>
}

export interface GithubContentDirInterface {
  title: Record<string, string>
  files: GithubContentFileInterface[]
  dir?: Record<string, GithubContentDirInterface>
}

function state(): GithubContentStateInterface {
  return {
    content: null,
    cache: {},
    defaultLang: 'en-US'
  }
};

export default state;
