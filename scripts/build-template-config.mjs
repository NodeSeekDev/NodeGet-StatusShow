import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import themeTemplate from '../nodeget-theme.json' with { type: 'json' }
import pkg from '../package.json' with { type: 'json' }
import { buildDefaultConfig } from "../config/default.mjs"

themeTemplate.version = pkg.version
const defaultConfig = buildDefaultConfig()

// 项目根目录
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// 输出配置路径
const themeConfigPath = resolve(projectRoot, 'dist/nodeget-theme.json')
const userConfigPath = resolve(projectRoot, 'dist/config.json')

// 写入主题 JSON 文件
writeFileSync(themeConfigPath, JSON.stringify(themeTemplate, null, 2) + '\n', 'utf-8')
writeFileSync(userConfigPath, JSON.stringify(defaultConfig, null, 2) + '\n', 'utf-8')