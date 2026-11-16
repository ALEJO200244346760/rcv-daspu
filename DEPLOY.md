# Deploy gratis: Cloudflare Pages + Oracle Cloud

- **Frontend** (`riesgo-cardiovascular`) → Cloudflare Pages (gratis)
- **Backend + MySQL** (`rcv_Backend`) → VM "Always Free" de Oracle Cloud con Docker (gratis)
- **HTTPS** del backend → Caddy, certificado automático de Let's Encrypt (gratis)

Orden recomendado: 1 → 2 → 3 → 4 → 5. No apagues Railway hasta terminar el paso 5.

---

## 1. Backup de la base actual en Railway

En Railway → servicio MySQL → **Variables**, copiá `MYSQLHOST` (público: usá el "TCP Proxy"), puerto, usuario, clave y base. Desde tu Mac:

```bash
mysqldump -h HOST -P PUERTO -u USUARIO -p --single-transaction --routines --no-tablespaces NOMBRE_BASE > rcv-railway.sql
```

(Si no tenés `mysqldump`: `brew install mysql-client`.) Guardá ese archivo en un lugar seguro: tiene datos de pacientes.

---

## 2. Crear la VM en Oracle Cloud

1. Creá cuenta en <https://www.oracle.com/cloud/free/>. Pide tarjeta para verificar identidad; mientras uses recursos "Always Free" no cobra.
   Elegí como *home region* una con capacidad ARM (ej. **Brazil East (São Paulo)** o **Chile Central (Santiago)**). No se puede cambiar después.
2. **Compute → Instances → Create instance**
   - Image: **Ubuntu 24.04**
   - Shape: **Ampere → VM.Standard.A1.Flex**, 2 OCPU y 12 GB RAM (dentro del free tier: hasta 4 OCPU / 24 GB)
   - Descargá la clave SSH que te ofrece (o subí la tuya).
   - Si dice "Out of capacity", reintentá más tarde o en otro *availability domain*.
3. Abrí los puertos 80 y 443:
   - **Networking → Virtual Cloud Networks → (tu VCN) → Security Lists → Default** → *Add Ingress Rules*: Source `0.0.0.0/0`, TCP, puertos `80,443`.
4. Anotá la **IP pública** de la instancia.

---

## 3. Instalar y levantar el backend en la VM

```bash
ssh -i ~/Downloads/ssh-key.key ubuntu@IP_PUBLICA
```

Dentro de la VM:

```bash
# Firewall interno de Ubuntu en Oracle (bloquea 80/443 por defecto)
sudo iptables -I INPUT 6 -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT
sudo apt-get update && sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
exit   # salí y volvé a entrar para que tome el grupo docker
```

```bash
ssh -i ~/Downloads/ssh-key.key ubuntu@IP_PUBLICA
git clone https://github.com/ALEJO200244346760/rcv-daspu.git
cd rcv-daspu/deploy
cp .env.example .env
openssl rand -base64 48     # copiá el resultado en JWT_SECRET
nano .env                   # completá todo
```

En `.env`:
- `API_DOMAIN`: si no tenés dominio, usá la IP con guiones + `.sslip.io` (IP `129.151.10.20` → `129-151-10-20.sslip.io`). Si tenés dominio, creá un registro A `api.tudominio.com` → IP (en Cloudflare DNS, con la nube **gris**/DNS only).
- `CORS_ALLOWED_ORIGINS`: la URL de Cloudflare Pages (paso 4). Podés poner una provisoria y cambiarla después.

Levantar todo (el primer build tarda unos minutos):

```bash
docker compose up -d --build
docker compose logs -f backend   # esperá "Started RcvApplication"
```

Probar: abrí `https://API_DOMAIN/` en el navegador. Debería responder (aunque sea 401/403) con candado HTTPS válido.

### Importar los datos de Railway

Desde tu Mac:

```bash
scp -i ~/Downloads/ssh-key.key rcv-railway.sql ubuntu@IP_PUBLICA:~/
```

En la VM:

```bash
cd ~/rcv-daspu/deploy && set -a && source .env && set +a
docker compose exec -T db mysql -uroot -p"$DB_ROOT_PASSWORD" "$DB_NAME" < ~/rcv-railway.sql
docker compose restart backend
rm ~/rcv-railway.sql
```

### Backups automáticos

```bash
crontab -e
# agregar esta línea:
0 3 * * * /home/ubuntu/rcv-daspu/deploy/backup.sh
```

Quedan en `deploy/backups/` (últimos 14 días). Bajalos a tu compu de vez en cuando con `scp`.

---

## 4. Frontend en Cloudflare Pages

1. <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages → Connect to Git** → elegí `rcv-daspu`.
2. Configuración del build:
   - Production branch: `main`
   - Framework preset: **Create React App**
   - Root directory: `riesgo-cardiovascular`
   - Build command: `npm run build`
   - Build output directory: `build`
3. **Environment variables**:
   - `REACT_APP_API_URL` = `https://API_DOMAIN` (sin barra al final)
   - `NODE_VERSION` = `20`
4. Deploy. Te da una URL tipo `https://rcv-daspu.pages.dev`.
5. Poné esa URL en `CORS_ALLOWED_ORIGINS` del `.env` de la VM y aplicá:
   `docker compose up -d backend`

El archivo `public/_redirects` hace que recargar la página en rutas como `/enfermeria` funcione.

Cada `git push` a `main` redeploya el frontend solo.

---

## 5. Probar y apagar Railway

- Entrá a la URL de Pages, logueate, cargá y editá un paciente, mirá estadísticas.
- Si todo anda: en Railway borrá los servicios (o el proyecto) para que deje de cobrar.

> Al cambiar `JWT_SECRET` todos los usuarios tienen que volver a iniciar sesión (normal).

---

## Actualizar el backend después de cambios

```bash
ssh -i ~/Downloads/ssh-key.key ubuntu@IP_PUBLICA
cd ~/rcv-daspu && git pull && cd deploy && docker compose up -d --build backend
```

## Comandos útiles

| Qué | Comando (en `~/rcv-daspu/deploy`) |
|---|---|
| Ver logs | `docker compose logs -f backend` |
| Reiniciar | `docker compose restart backend` |
| Estado | `docker compose ps` |
| Consola MySQL | `docker compose exec db mysql -uroot -p` |

## Importante

- Oracle puede reclamar instancias Always Free **inactivas** (CPU muy baja durante 7 días) en cuentas gratis. Si te pasa, pasá la cuenta a "Pay As You Go": sigue sin cobrar mientras te quedes en los límites free, y no reclaman.
- El usuario `admin@example.com` / `admin123` se crea solo si no existe (`AdminConfig.java`). Si existe en tu base, **cambiale la clave**.
