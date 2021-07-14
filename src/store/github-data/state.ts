export interface RepoTreeInterface<T> {
  files: Record<string, T>
  dir: Record<string, RepoTreeInterface<T>>
}

export interface GithubDataStateInterface<T> {
  files: null | RepoTreeInterface<T>
  assets: null | RepoTreeInterface<string>
}

function state(): GithubDataStateInterface<string> {
  return {
    files: null,
    assets: null
  }
};

export default state;
