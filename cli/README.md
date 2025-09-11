# 🌐 Clouly CLI - DNS Management Made Simple

A powerful command-line interface for managing DNS records and subdomains with Clouly. Connect your custom domains to any hosting service (Vercel, Netlify, etc.) in minutes!

## 📦 Quick Installation

```bash
npm install -g @nikhilthakur8/clouly-cli
```

Or install locally:

```bash
git clone https://github.com/nikhilthakur8/clouly.git
cd clouly/cli
npm install
npm link
```

## 🚀 Complete Setup Guide: From Zero to Live Website

### Step 1: Login to Clouly

```bash
clouly auth login
```

**Enter:**

-   Email: `your-email@example.com`
-   Password: `your-secure-password`
-   Name: `Your Name` (optional)

### Step 2: Create Your Subdomain

```bash
clouly subdomain create
```

**Enter:**

-   Subdomain name: `myapp` (will create `myapp.clouly.tech`)
-   Notes: `My awesome application` (optional)

### Step 3: Get Your Subdomain ID

```bash
clouly subdomain list
```

**Copy the ID** from the output (e.g., `68bf922f7d9eb50a97673b89`)

### Step 4: Deploy Your App to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Deploy your project** (Git repo, drag & drop, etc.)
3. **Go to Settings** → **Domains**
4. **Add Custom Domain**: `myapp.clouly.tech`
5. **Vercel will show you a CNAME record** like:
    ```
    CNAME: cname.vercel-dns.com
    ```

### Step 5: Add DNS Record in Clouly

```bash
clouly dns create YOUR_SUBDOMAIN_ID
```

**Enter:**

-   Record type: `CNAME`
-   Content: `cname.vercel-dns.com` (from Vercel)
-   TTL: `3600` (default)
-   Enable proxy: `No`

### Step 6: Verify Your Setup

```bash
clouly dns list YOUR_SUBDOMAIN_ID
```

**🎉 Your website is now live at `myapp.clouly.tech`!**

---

## 📋 Complete Command Reference

### Authentication Commands

```bash
clouly auth login          # Login or create account
clouly auth logout         # Logout and clear credentials
clouly auth status         # Check if logged in
```

### Subdomain Management

```bash
clouly subdomain create           # Create new subdomain
clouly subdomain list             # List all your subdomains
clouly subdomain get <id>         # Get subdomain details
clouly subdomain delete <id>      # Delete subdomain
```

### DNS Record Management

```bash
clouly dns create <subdomain-id>        # Add DNS record
clouly dns list <subdomain-id>          # List DNS records
clouly dns get <subdomain-id> <dns-id>  # Get DNS record details
clouly dns update <subdomain-id> <dns-id>  # Update DNS record
clouly dns delete <subdomain-id> <dns-id>  # Delete DNS record
```

### Utility Commands

```bash
clouly status              # Check API connectivity
clouly help                # Show help
clouly --version           # Show version
```

---

## 🛠️ Popular Hosting Service Examples

### Vercel Setup

```bash
# 1. Create subdomain
clouly subdomain create
# Enter: myapp

# 2. In Vercel: Add domain myapp.clouly.tech
# 3. Copy the CNAME from Vercel (e.g., cname.vercel-dns.com)

# 4. Add DNS record
clouly dns create <your-subdomain-id>
# Type: CNAME
# Content: cname.vercel-dns.com
# TTL: 3600
# Proxy: No
```

### Netlify Setup

```bash
# 1. Create subdomain
clouly subdomain create
# Enter: mysite

# 2. In Netlify: Add domain mysite.clouly.tech
# 3. Copy the CNAME from Netlify

# 4. Add DNS record
clouly dns create <your-subdomain-id>
# Type: CNAME
# Content: [netlify-cname-from-dashboard]
# TTL: 3600
# Proxy: No
```

### Custom Server (IP Address)

```bash
# For A record (IPv4)
clouly dns create <your-subdomain-id>
# Type: A
# Content: 192.168.1.100
# TTL: 3600
# Proxy: Yes (optional)

# For AAAA record (IPv6)
clouly dns create <your-subdomain-id>
# Type: AAAA
# Content: 2001:db8::1
# TTL: 3600
# Proxy: Yes (optional)
```

---

## 🎯 Quick Commands (Copy & Paste Ready)

### Complete New Project Setup

```bash
# Step 1: Login
clouly auth login

# Step 2: Create subdomain
clouly subdomain create

# Step 3: Get subdomain ID
clouly subdomain list

# Step 4: Add CNAME record (replace YOUR_ID and YOUR_CNAME)
clouly dns create YOUR_SUBDOMAIN_ID
# Select: CNAME → Enter your CNAME → 3600 → No
```

### Check Everything is Working

```bash
# Verify your setup
clouly subdomain list
clouly dns list YOUR_SUBDOMAIN_ID

# Test connection
ping myapp.clouly.tech
curl -I https://myapp.clouly.tech
```

---

## 🔧 DNS Record Types Explained

| Type      | Purpose                 | Example Content                | When to Use           |
| --------- | ----------------------- | ------------------------------ | --------------------- |
| **A**     | Point to IPv4 address   | `192.168.1.100`                | Direct server hosting |
| **AAAA**  | Point to IPv6 address   | `2001:db8::1`                  | IPv6 servers          |
| **CNAME** | Point to another domain | `myapp.vercel.app`             | Vercel, Netlify, etc. |
| **TXT**   | Text verification       | `google-site-verification=...` | Domain verification   |

---

## ⚠️ Important DNS Rules

1. **CNAME Conflicts**: Cannot have CNAME + other records for same subdomain
2. **TXT Records**: Cannot be proxied (automatically set to No)
3. **TTL Minimum**: Use at least 60 seconds for TTL
4. **Propagation**: DNS changes take 5-10 minutes to take effect

---

## 🐛 Troubleshooting

### "Please login first"

```bash
clouly auth login
```

### "Subdomain not found"

```bash
# Get correct subdomain ID
clouly subdomain list
```

### "DNS record already exists"

```bash
# Check existing records
clouly dns list <subdomain-id>

# Update existing record instead
clouly dns update <subdomain-id> <dns-record-id>
```

### "Cannot create CNAME"

CNAME records cannot coexist with other record types. Delete existing records first:

```bash
clouly dns delete <subdomain-id> <dns-record-id>
```

### Website not loading

1. **Wait 5-10 minutes** for DNS propagation
2. **Check DNS records**: `clouly dns list <subdomain-id>`
3. **Verify CNAME content** matches your hosting provider
4. **Test with**: `nslookup myapp.clouly.tech`

---

## 🌟 Advanced Examples

### Multiple Environments

```bash
# Development
clouly subdomain create  # dev-myapp
clouly dns create <dev-id>  # Point to dev.vercel.app

# Staging
clouly subdomain create  # staging-myapp
clouly dns create <staging-id>  # Point to staging.vercel.app

# Production
clouly subdomain create  # myapp
clouly dns create <prod-id>  # Point to prod.vercel.app
```

### Domain Verification

```bash
# Add Google verification
clouly dns create <subdomain-id>
# Type: TXT
# Content: google-site-verification=your-verification-code
```

### Load Balancing

```bash
# Multiple A records for the same subdomain
clouly dns create <subdomain-id>  # Type: A, Content: 192.168.1.100
clouly dns create <subdomain-id>  # Type: A, Content: 192.168.1.101
```

---

## 📞 Support

-   **Website**: https://clouly.tech
-   **API**: https://api.clouly.tech
-   **Issues**: https://github.com/nikhilthakur8/clouly/issues
-   **Email**: support@clouly.tech

---

## 🎉 Success! Your website is now live!

After following this guide, your custom domain should be working. Test it by visiting `https://your-subdomain.clouly.tech` in your browser.

**Happy hosting! 🚀**
