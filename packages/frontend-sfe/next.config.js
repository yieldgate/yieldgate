/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
let nextConfig = {}

// eslint-disable-next-line
const withTM = require('next-transpile-modules')(['@yieldgate/contracts'])
nextConfig = withTM(nextConfig)

// eslint-disable-next-line
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
nextConfig = withBundleAnalyzer(nextConfig)

module.exports = nextConfig
