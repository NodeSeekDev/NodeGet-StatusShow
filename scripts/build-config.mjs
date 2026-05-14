import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import themeTemplate from '../nodeget-theme.json' with { type: 'json' }
import { buildConfig } from "../config/index.mjs"


// 计算项目根目录和输出文件路径
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = resolve(projectRoot, 'dist/config.json')
// 写入输出文件
const finalConfig = buildConfig()
writeFileSync(outputPath, JSON.stringify(finalConfig, null, 2) + '\n')
console.log(`[build-config] wrote ${finalConfig.site_tokens.length} site_tokens to ${outputPath}`)