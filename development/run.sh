
mkdir -p tmp

echo '
redis-cli keys cache-geo-proxy:* | head
redis-cli keys cache-geo-proxy:* | wc -l
' | sed '/^$/d' | tee tmp/keys.sh | dash -x
cat tmp/keys.sh
ls -l tmp/keys.sh

(
  sleep 1
  curl -X -d '{address: "10 Downing Street, London"}' localhost:8888/maps/api/geocode/json
) &

apiKey=$MAPS_API_KEY node --harmony lib/index.js
