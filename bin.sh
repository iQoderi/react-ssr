#/bin/bash
scp ./dist/server/server.prod.js qcloud:/var/www/cnode_ssr/server
scp ./dist/views/index.html qcloud:/var/www/cnode_ssr/views
ssh qcloud
cd /var/www/node_ssr
pm2 restart 10
