const redis = require("../config/redis");

async function getCache(key) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttl = 60) {
  await redis.set(key, JSON.stringify(value), { EX: ttl });
}

async function delCache(pattern) {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
}

function clearInfoCache() { 
  const keys = myCache.keys();
  const targets = keys.filter(key => key.includes("/get-info"));
  if (targets.length > 0) myCache.del(targets);
}

function clearBookCache() { 
  const keys = myCache.keys();
  const targets = keys.filter(key => key.includes("/get-books"));
  if (targets.length > 0) myCache.del(targets);
}

function clearReviewCache(seller) { 
  const keys = myCache.keys();
  const targets = keys.filter(key => key.includes(`/reviews/${seller}`));
  if (targets.length > 0) myCache.del(targets);
}

module.exports = { getCache, setCache, delCache, clearInfoCache, clearBookCache, clearReviewCache };