#!/bin/bash
# ============================================
# Erisci TMS - VDS Sunucu Kurulum Scripti
# Bu scripti sunucunda BIR KEZ calistir
# ============================================

set -e

echo "🔧 Erisci TMS Sunucu Kurulumu Basliyor..."

# 1. Nginx kur
echo "📦 Nginx kuruluyor..."
sudo apt update
sudo apt install -y nginx

# 2. Web dizini olustur
echo "📁 Web dizini olusturuluyor..."
sudo mkdir -p /var/www/teknikservis
sudo chown -R $USER:$USER /var/www/teknikservis

# 3. Nginx konfigurasyonu
echo "⚙️  Nginx yapilandiriliyor..."
sudo tee /etc/nginx/sites-available/teknikservis > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;  # Buraya domain adini yaz (ornek: tms.erisci.com)

    root /var/www/teknikservis;
    index index.html;

    # Gzip sıkıştırma - daha hızlı yükleme
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;

    # React SPA routing - tüm istekler index.html'e yönlendirilir
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static dosyalar için cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# 4. Site'i aktif et
sudo ln -sf /etc/nginx/sites-available/teknikservis /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 5. Nginx'i test et ve baslat
echo "🚀 Nginx baslatiliyor..."
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo ""
echo "✅ Kurulum tamamlandi!"
echo ""
echo "📋 Simdi GitHub'da su Secret'lari ayarla:"
echo "   Repository > Settings > Secrets and variables > Actions"
echo ""
echo "   VDS_HOST     = Sunucu IP adresin (ornek: 185.123.456.78)"
echo "   VDS_USER     = SSH kullanici adin (ornek: root)"
echo "   VDS_SSH_KEY  = SSH private key (asagidaki komutu calistir):"
echo ""
echo "   Eger SSH key yoksa olustur:"
echo "   ssh-keygen -t ed25519 -C 'github-deploy' -f ~/.ssh/github_deploy"
echo "   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys"
echo "   cat ~/.ssh/github_deploy  # Bu ciktiyi VDS_SSH_KEY olarak yapistir"
echo ""
echo "   VDS_PORT     = SSH portu (varsayilan: 22, degistirdiysen yaz)"
echo ""
echo "🌐 Sunucu IP adresini tarayicida ac: http://$(curl -s ifconfig.me)"
