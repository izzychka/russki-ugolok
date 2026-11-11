'use strict';
// One private cloud save for a single-person website. No email login.
// The database is protected by a randomly generated, unguessable sync code.
window.RusskiCloud = (() => {
  let client = null;
  let configured = '';
  const CONFIG_KEY = 'russki_cloud_config_v2';
  const OLD_KEY = 'russki_cloud_config_v1';

  function getConfig() {
    try {
      const current = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
      if (current.url && current.key) return current;
      const legacy = JSON.parse(localStorage.getItem(OLD_KEY) || '{}');
      return {url: legacy.url || '', key: legacy.key || '', code: current.code || ''};
    } catch { return {}; }
  }
  function setConfig(url, key, code) {
    const config = {url:url.trim().replace(/\/$/,''),key:key.trim(),code:code.trim().toLowerCase()};
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url)) {
      throw Error('The Project URL should look like https://your-project.supabase.co');
    }
    if (!config.key || !/^(sb_publishable_|eyJ)/.test(config.key)) {
      throw Error('Use your Supabase publishable or anon key — never a secret key.');
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(config.code)) {
      throw Error('Enter the UUID sync code shown by your Supabase SQL setup.');
    }
    localStorage.setItem(CONFIG_KEY,JSON.stringify(config));
    client=null; configured='';
    return config;
  }
  const isConfigured = () => { const c=getConfig(); return !!(c.url && c.key && c.code); };
  async function connect() {
    const {url,key,code}=getConfig();
    if (!url || !key || !code) throw Error('Enter your Project URL, publishable key and sync code first.');
    if (client && configured===`${url}|${key}`) return client;
    const lib=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    client=lib.createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    configured=`${url}|${key}`;
    return client;
  }
  async function download() {
    const c=await connect(),{code}=getConfig();
    const {data,error}=await c.rpc('russki_load',{p_code:code});
    if(error) throw Error(error.message || 'Could not load cloud data.');
    return data;
  }
  async function upload(payload,expectedRevision) {
    const c=await connect(),{code}=getConfig();
    const {data,error}=await c.rpc('russki_save',{p_code:code,p_payload:payload,p_expected_revision:expectedRevision});
    if(error) throw Error(error.message || 'Could not save cloud data.');
    return data;
  }
  return {getConfig,setConfig,isConfigured,download,upload};
})();
