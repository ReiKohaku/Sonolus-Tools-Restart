import JSZip from 'jszip';
export function unZip (data: ArrayBuffer): Promise<JSZip> {
  const zip = new JSZip()
  return zip.loadAsync(data)
}

import showdown from 'showdown';
const converter = new showdown.Converter()
export function getMarkdownFirstLine(markdown: string): string {
  const line = markdown.split(/(\r|\n|<br\s*\/?>)/)[0]
  const html = converter.makeHtml(line)
  return html.replace(/<\/?(.*?)>/g, '')
}
