// 用于生成配置文件 config.json

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import nodegetTheme from '../nodeget-theme.json' with { type: 'json' }
import pkg from '../package.json' with { type: 'json' }


export const defaultSiteTokens = [
    {
        "name": "master server node 1",
        "backend_url": "wss://your-backend.example.com",
        "token": "YOUR_TOKEN_HERE"
    }
]

export function buildDefaultConfig() {
    const userPreferencesForm = nodegetTheme.user_preferences_form
    let defaultUserpreferences = {}
    if (userPreferencesForm) {
        userPreferencesForm.items.forEach(item => {
            defaultUserpreferences[item.key] = item.default
        })
    }
    let defaultConfig = {
        "user_preferences":defaultUserpreferences,
        "site_tokens": defaultSiteTokens
    }
    
    return defaultConfig
}
