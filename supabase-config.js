/*
 * Browser-safe Supabase configuration.
 *
 * Only the public/anon key belongs here. Never put a service-role or secret
 * key in this file: anything in the frontend is visible to site visitors.
 */
window.SUPABASE_CONFIG = Object.freeze({
  supabaseUrl: 'https://drherxqgflrptzotkyjm.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaGVyeHFnZmxycHR6b3RreWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjQxMzYsImV4cCI6MjEwNTgwMDEzNn0.P_2LhNwk-sw5FcSyPkMTt_BGsYpzOI6_mCltMPSu_2Q',
  // Cloudinary > Settings > Product environment credentials > Cloud name
  cloudinaryCloudName: 'bai3mzvl',
  // Cloudinary > Settings > Upload > Upload presets. This must be unsigned.
  cloudinaryUploadPreset: 'ruwa_products',
  cloudinaryFolder: 'ruwa/products'
});

window.supabaseRequest = async (path, options = {}) => {
  const config = window.SUPABASE_CONFIG;
  const request = { ...options, headers: { ...(options.headers || {}) } };
  request.headers.apikey = config.supabaseAnonKey;
  request.headers.Authorization = `Bearer ${config.supabaseAnonKey}`;

  if (request.body && !request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, request);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  const result = await response.json();
  if (request.headers.Prefer?.includes('return=representation') && Array.isArray(result) && result.length === 0) {
    throw new Error('Supabase returned no saved row. Check the products table INSERT/UPDATE RLS policy for the current admin user.');
  }
  return result;
};
