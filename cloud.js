'use strict';
// Optional cloud sync. Everything works locally without Supabase.
window.RusskiCloud = (() => {
  let client = null;
  let configured = '';
  const CONFIG_KEY = 'russki_cloud_config_v1';
  const loadConfig = () => { try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); } catch { return {}; } };
  const getConfig = () => loadConfig();
  const setConfig = (url, key) => localStorage.setItem(CONFIG_KEY, JSON.stringify({url:url.trim(),key:key.trim()}));
  async function connect() {
    const {url,key} = loadConfig();
    if (!url || !key) throw Error('Add your Supabase project URL and publishable/anon key first.');
    if (!/^https:\/\/[\w.-]+\.supabase\.co\/?$/.test(url)) throw Error('The project URL should look like https://your-project.supabase.co');
    if (client && configured === `${url}|${key}`) return client;
    const lib = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    client = lib.createClient(url.replace(/\/$/,''), key, {auth:{persistSession:true,detectSessionInUrl:true}});
    configured = `${url}|${key}`;
    return client;
  }
  async function user() { const c=await connect(); const {data,error}=await c.auth.getUser(); if(error) throw error; return data.user; }
  async function login(email) {
    const c=await connect();
    const {error}=await c.auth.signInWithOtp({email,options:{emailRedirectTo: location.origin+location.pathname}});
    if(error) throw error;
  }
  async function logout() { const c=await connect(); const {error}=await c.auth.signOut(); if(error) throw error; }
  async function upload(payload) {
    const c=await connect(); const u=await user(); if(!u) throw Error('Sign in with your email first.');
    const {error}=await c.from('user_state').upsert({user_id:u.id,payload,updated_at:new Date().toISOString()});
    if(error) throw error;
  }
  async function download() {
    const c=await connect(); const u=await user(); if(!u) throw Error('Sign in with your email first.');
    const {data,error}=await c.from('user_state').select('payload,updated_at').eq('user_id',u.id).maybeSingle();
    if(error) throw error;
    return data;
  }
  return {getConfig,setConfig,connect,user,login,logout,upload,download};
})();
