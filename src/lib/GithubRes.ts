export function githubResLink(author: string, repo: string, branch: string, path: string) {
  // https://api.reikohaku.fun/githubusercontent/ReiKohaku/My-Notice/master/img/my_alipay.jpg
  return `https://api.reikohaku.fun/githubusercontent/${author}/${repo}/${branch}/${path}`;
}

import { api as axios } from 'src/boot/axios';

export async function getRepoZipBall(author: string, repo: string, branch: string): Promise<ArrayBuffer> {
  // https://api.github.com/repos/ReiKohaku/My-Notice/zipball/master
  // https://codeload.github.com/ReiKohaku/My-Notice/legacy.zip/refs/heads/master
  // https://archive.fastgit.org/ReiKohaku/Sonolus-Tools-Data/archive/refs/heads/main.zip
  const response = await axios.get<ArrayBuffer>(
    `github/archive/${author}/${repo}/archive/refs/heads/${branch}.zip`,
    {
      responseType: 'arraybuffer'
    });
  return response.data;
}
