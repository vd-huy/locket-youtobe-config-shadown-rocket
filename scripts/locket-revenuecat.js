(function () {
  var headers = $request.headers || {};
  var ua = headers['User-Agent'] || headers['user-agent'] || '';
  var body = $response.body;
  if (!/locket/i.test(ua)) return $done({body: body});
  try {
    var data = JSON.parse(body);
    if (!data || !data.subscriber || typeof data.subscriber !== 'object') return $done({body: body});
    var sub = data.subscriber;
    if (!sub.subscriptions || typeof sub.subscriptions !== 'object') sub.subscriptions = {};
    if (!sub.entitlements || typeof sub.entitlements !== 'object') sub.entitlements = {};
    var expires = '9999-01-09T10:10:14Z', purchased = '2026-11-03T17:00:00Z';
    [['Gold','locket_1600_1y'],['effect_pack_20','com.locket.Locket.FilterPack_20Photos_500']].forEach(function (pair) {
      sub.subscriptions[pair[1]] = {ownership_type:'PURCHASED',store:'app_store',period_type:'normal',is_sandbox:true,original_purchase_date:purchased,purchase_date:purchased,expires_date:expires,billing_issues_detected_at:null,unsubscribe_detected_at:null,grace_period_expires_date:null};
      sub.entitlements[pair[0]] = {product_identifier:pair[1],purchase_date:purchased,expires_date:expires,grace_period_expires_date:null};
    });
    return $done({body:JSON.stringify(data)});
  } catch (_) { return $done({body:body}); }
})();
