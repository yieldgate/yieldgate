/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
let nextConfig = {}

const withTwin = require('./withTwin.js')
nextConfig = withTwin(nextConfig)

const withTM = require('next-transpile-modules')(['@yieldgate/contracts'])
nextConfig = withTM(nextConfig)

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
nextConfig = withBundleAnalyzer(nextConfig)

module.exports = nextConfig
