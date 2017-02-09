
set -u -e

mkdir -p tmp

redis-cli keys cache-geo-proxy:* | xargs -n 1 redis-cli del

echo '
redis-cli keys cache-geo-proxy:* | head
redis-cli keys cache-geo-proxy:* | wc -l
' | sed '/^$/d' | tee tmp/keys.sh | dash -x
cat tmp/keys.sh
ls -l tmp/keys.sh

(
  echo 'client sleep'
  sleep 1
  echo 'client curl'
  curl -X POST -d '{"address": "20 Falstaff Close, Eynsham OX29 4QA"}' \
    --header 'Content-Type: application/json' \
    http://localhost:8888/maps/api/geocode/json
) &

echo 'start server'
apiKey=$MAPS_API_KEY node --harmony lib/index.js
