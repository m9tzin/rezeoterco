import withPWA from '@ducanh2912/next-pwa'
import { pwaOptions } from './pwa.config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withPWA(pwaOptions)(nextConfig)
