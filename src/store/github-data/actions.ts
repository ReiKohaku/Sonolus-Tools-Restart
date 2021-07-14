import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GithubDataStateInterface, RepoTreeInterface } from './state';
import { getRepoZipBall } from 'src/lib/GithubRes';
import { unZip } from 'src/lib/Utils';
// import { api } from 'boot/axios';

const actions: ActionTree<GithubDataStateInterface<string>, StateInterface> = {
  async updateGithubData(context) {
    const data: ArrayBuffer = await getRepoZipBall('ReiKohaku', 'Sonolus-Tools-Data', 'main')
    /*
    // These are test codes, please delete these before publish
    const data: ArrayBuffer = (await api.get<ArrayBuffer>('/example.zip', {
      responseType: 'arraybuffer'
    })).data
     */
    const jszip = await unZip(data)
    const tree: RepoTreeInterface<string> = {
      files: {},
      dir: {}
    }
    for (const p in jszip.files) {
      const file = jszip.files[p]
      const split = p.split('/')
      async function addIntoTree(dir: RepoTreeInterface<string>, start: number) {
        const name = split[start]
        if (!name || name.length === 0) return
        if (start >= split.length) return
        else if (start === split.length - 1) {
          if (/^(.*).(jpg|png|webp|ico|gif|mp4|ogg)$/.test(name)) {
            const readFile = (data: Blob): Promise<string> => {
              return new Promise<string>((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(data)
                fileReader.onerror = reject
                fileReader.onload = (ev: ProgressEvent<FileReader>) => {
                  if (ev.target) resolve(ev.target.result as string)
                  else reject()
                }
              })
            }
            dir.files[name] = await readFile(await file.async('blob'))
          } else dir.files[name] = (await file.async('string')).toString()
        }
        else {
          if (!dir.dir[name]) dir.dir[name] = {
            files: {},
            dir: {}
          }
          await addIntoTree(dir.dir[name], start + 1)
        }
      }
      await addIntoTree(tree, 1)
    }
    context.commit('setFileTree', tree)
  }
};

export default actions;
