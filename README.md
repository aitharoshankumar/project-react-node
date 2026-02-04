
CHECK LINE-NUM 77 WITH SATRT :
this is nginx/nginx.conf file 
server {
    listen 80;
    server_name rohsantech.in;
  {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;                         $http_upgrade -> Upgrade: websocket
        proxy_set_header Connection 'upgrade';                          $Connection 'upgrade' -> Connection: upgrade -> If missing → WebSocket handshake fails.
        proxy_set_header Host $host;                                    $host	->Domain name
        proxy_set_header X-Real-IP $remote_addr;                        $remote_addr	-> Client IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;    $proxy_add_x_forwarded_for ->	IP chain
        proxy_set_header X-Forwarded-Proto $scheme;                     $scheme	->http / https
        proxy_cache_bypass $http_upgrade;                               $http_upgrade ->	Upgrade header from browser
    
}

Variable	-> Meaning

$host	->Domain name
$scheme	->http / https
$http_upgrade ->	Upgrade header from browser
$proxy_add_x_forwarded_for ->	IP chain 















































Line-by-line explanation
1️⃣
proxy_http_version 1.1;


What it does

Forces Nginx to use HTTP/1.1 when talking to the backend.

Why needed

Required for:

WebSockets

HTTP keep-alive

Upgrade headers

Without this, WebSockets will not work.

2️⃣
proxy_set_header Upgrade $http_upgrade;


What it does

Forwards the client’s Upgrade header to the backend.

Why needed

WebSockets use:

Upgrade: websocket


This tells the backend:
👉 “Hey, switch this HTTP connection to a WebSocket.”

$http_upgrade = value sent by the browser.

3️⃣
proxy_set_header Connection 'upgrade';


What it does

Forces the connection to stay open and upgrade protocol.

Why needed

WebSockets require:

Connection: upgrade


If missing → WebSocket handshake fails.

4️⃣
proxy_set_header Host $host;


What it does

Sends the original domain name to the backend.

Example:

rohsantech.in


Why needed

Backend apps use this for:

Multi-domain support

Absolute URLs

Logging

Security checks

Without it, backend may see:

Host: localhost

5️⃣
proxy_set_header X-Real-IP $remote_addr;


What it does

Passes the real client IP to backend.

Example:

X-Real-IP: 49.37.xxx.xxx


Why needed

Backend otherwise sees only:

127.0.0.1


Used for:

Logging

Rate limiting

Geo IP

Security audits

6️⃣
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;


What it does

Maintains a chain of IPs.

Example:

X-Forwarded-For: clientIP, cloudflareIP, nginxIP


Why needed

When traffic passes through:

Browser → Cloudflare → Nginx → Backend


Backend can know the original visitor IP.

7️⃣
proxy_set_header X-Forwarded-Proto $scheme;


What it does

Tells backend whether request was:

http or https


Why needed

Very important for:

Redirects

Cookies (Secure flag)

OAuth

Absolute URLs

Example:

X-Forwarded-Proto: https

8️⃣
proxy_cache_bypass $http_upgrade;


What it does

Disables caching when connection is upgraded.

Why needed

WebSockets must not be cached

Prevents broken real-time connections

So… what is $remote_addr, $host, $scheme?

These are Nginx built-in variables, NOT files.

They exist in memory per request.

Variable	Meaning
$remote_addr	Client IP
$host	Domain name
$scheme	http / https
$http_upgrade	Upgrade header from browser
$proxy_add_x_forwarded_for	IP chain
❓ “Where can I see the output of these variables?”
✅ Method 1: Log them (BEST way)

Edit /etc/nginx/nginx.conf:

log_format custom '$remote_addr - $host - $scheme - $http_upgrade - $http_user_agent';

access_log /var/log/nginx/access.log custom;


Reload Nginx:

sudo nginx -s reload


View logs:

tail -f /var/log/nginx/access.log

✅ Method 2: Send variables back in response (debug)
location /debug {
    return 200 "IP=$remote_addr\nHOST=$host\nSCHEME=$scheme\n";
}


Visit:

http://yourdomain/debug

✅ Method 3: See headers from backend

If backend is Node.js:

app.get("/headers", (req, res) => {
  res.json(req.headers);
});


Then:

curl http://yourdomain/headers

When do you NEED this config?

Use this block when:

✅ Reverse proxy (Nginx → Node / React / API)

✅ WebSockets (Socket.io, ws)

✅ HTTPS termination

✅ Cloudflare in front

✅ Docker containers

Basically: almost every production setup

Real-world mental model
Browser
   ↓
Cloudflare
   ↓
Nginx (this config)
   ↓
Backend (Node / API)
