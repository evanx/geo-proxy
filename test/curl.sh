
set -u -x

  curl 'http://localhost:8888/maps/api/geocode/json' -G --data-urlencode 'address=20 Falstaff Close, Eynsham OX29 4QA'
  curl 'http://localhost:8888/maps/api/geocode/json' -G --data-urlencode 'address=14 Grays Inn Road, Chancery Lane, London'
  sleep 1
  redis-cli keys cache-geo-proxy:* 

