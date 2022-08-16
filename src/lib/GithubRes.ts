import { api as axios } from 'src/boot/axios';

export async function getRepoFile(author: string, repo: string, branch: string, path: string): Promise<ArrayBuffer> {
  const response = await axios.get<ArrayBuffer>(
    `github/raw/${author}/${repo}/${branch}/${path.replace('\\', '/').replace(/\/+/, '/')}`,
    {
      responseType: 'arraybuffer'
    }
  );
  return response.data;
}
