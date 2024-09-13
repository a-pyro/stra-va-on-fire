/* eslint-disable no-console -- TODO: remove this */
import { exec } from 'node:child_process'

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const domain = process.env.NGROK_DOMAIN

console.log('NGROK_DOMAIN:', domain) // Debug log

if (!domain) {
  console.error('NGROK_DOMAIN is not set in the environment variables')
  process.exit(1)
}

exec(`ngrok http --domain=${domain} 3000`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(`stdout: ${stdout}`)
})
