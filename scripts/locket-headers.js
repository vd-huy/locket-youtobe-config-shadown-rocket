(function () {
  var headers = $request.headers || {}, ua = headers['User-Agent'] || headers['user-agent'] || '';
  if (!/locket/i.test(ua)) return $done({headers:headers});
  var result = {}, remove = ['x-revenuecat-etag','if-none-match','if-modified-since','x-goog-if-none-match'];
  Object.keys(headers).forEach(function (key) { if (remove.indexOf(key.toLowerCase()) < 0) result[key] = headers[key]; });
  return $done({headers:result});
})();
