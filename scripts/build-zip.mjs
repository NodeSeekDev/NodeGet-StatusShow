import { writeFileSync, createWriteStream, renameSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZipArchive } from 'archiver';
import themeTemplate from '../nodeget-theme.json' with { type: 'json' }
import pkg from '../package.json' with { type: 'json' }

themeTemplate.version = pkg.version

// 项目根目录
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 输出文件路径
const zipFilename = 'NodeGet-StatusShow.zip'
const zipTempPath = resolve(projectRoot, zipFilename)
const zipDistPath = resolve(projectRoot, 'dist', zipFilename)

// 输出 JSON 配置路径
const themeJsonPath = resolve(projectRoot, 'dist/nodeget-theme.json')

// 写入主题 JSON 文件
writeFileSync(themeJsonPath, JSON.stringify(themeTemplate, null, 2) + '\n', 'utf-8')

// 创建 ZIP 输出流
const zipOutput = createWriteStream(zipTempPath)
const archive = new ZipArchive('zip', { zlib: { level: 9 } })

// 监听完成事件
zipOutput.on('close', () => {
  console.log(`[zip] 压缩完成，总共 ${archive.pointer()} 字节`)
  renameSync(zipTempPath, zipDistPath)
  console.log(`[zip] 移动到 ${zipDistPath}`)
})

// 监听错误
archive.on('error', err => {
  throw err
})

// 关联输出流
archive.pipe(zipOutput)

// 添加整个 dist 文件夹到压缩包根目录
archive.directory('dist/', false)

// 完成压缩
archive.finalize()