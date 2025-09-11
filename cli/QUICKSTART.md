# 🚀 Clouly CLI Quick Start - 5 Minutes to Live Website

## Copy & Paste Commands (Real Example)

### Step 1: Install & Login

```bash
# Install Clouly CLI
npm install -g @nikhilthakur8/clouly-cli

# Login to your account
clouly auth login
```

**Enter your email and password (creates account if new)**

### Step 2: Create Your Subdomain

```bash
clouly subdomain create
```

**Example:**

-   Subdomain name: `myawesomeapp`
-   Notes: `My React portfolio website`

### Step 3: Get Subdomain ID

```bash
clouly subdomain list
```

**Copy the ID** (looks like: `68bf922f7d9eb50a97673b89`)

### Step 4: Deploy to Vercel & Get CNAME

1. **Deploy to Vercel**: https://vercel.com/new
2. **Add custom domain**: `myawesomeapp.clouly.tech`
3. **Copy the CNAME** Vercel gives you (e.g., `cname.vercel-dns.com`)

### Step 5: Add DNS Record

```bash
clouly dns create 68bf922f7d9eb50a97673b89
```

**Enter:**

-   Record type: `CNAME`
-   Content: `cname.vercel-dns.com`
-   TTL: `3600`
-   Proxy: `No`

### Step 6: Verify

```bash
clouly dns list 68bf922f7d9eb50a97673b89
```

**🎉 Visit `https://myawesomeapp.clouly.tech` - Your site is live!**

---

## Real-World Examples

### React App + Vercel

```bash
# 1. Login
clouly auth login

# 2. Create subdomain
clouly subdomain create
# Name: react-portfolio
# Notes: My React.js portfolio

# 3. Get ID
clouly subdomain list
# Copy ID: 68c21d14257519c0d954cc1b

# 4. Add CNAME (replace with your Vercel CNAME)
clouly dns create 68c21d14257519c0d954cc1b
# Type: CNAME
# Content: cname.vercel-dns.com
# TTL: 3600
# Proxy: No

# 5. Check it works
curl -I https://react-portfolio.clouly.tech
```

### Next.js App + Custom Server

```bash
# Create subdomain
clouly subdomain create
# Name: nextjs-blog

# Add A record for your server
clouly dns create <subdomain-id>
# Type: A
# Content: 192.168.1.100
# TTL: 3600
# Proxy: Yes
```

### Static Site + Netlify

```bash
# Create subdomain
clouly subdomain create
# Name: docs-site

# Add Netlify CNAME
clouly dns create <subdomain-id>
# Type: CNAME
# Content: elegant-newton-123456.netlify.app
# TTL: 3600
# Proxy: No
```

---

## Quick Commands Reference

```bash
# Authentication
clouly auth login                    # Login/register
clouly auth status                   # Check login status

# Subdomain Management
clouly subdomain create              # Create new subdomain
clouly subdomain list                # List your subdomains
clouly subdomain get <id>            # View subdomain details
clouly subdomain delete <id>         # Delete subdomain

# DNS Records
clouly dns create <subdomain-id>     # Add DNS record
clouly dns list <subdomain-id>       # List DNS records
clouly dns update <subdomain-id> <record-id>  # Update record
clouly dns delete <subdomain-id> <record-id>  # Delete record

# Utilities
clouly status                        # Check API status
clouly help                          # Show help
clouly --version                     # Show version
```

---

## Common Workflows

### New Project Deployment

```bash
clouly auth login
clouly subdomain create
clouly subdomain list
clouly dns create <id>  # Add CNAME from hosting provider
```

### Update Existing Domain

```bash
clouly subdomain list
clouly dns list <subdomain-id>
clouly dns update <subdomain-id> <dns-id>
```

### Multiple Environment Setup

```bash
# Development
clouly subdomain create  # dev-myapp
clouly dns create <dev-id>  # Point to dev.vercel.app

# Production
clouly subdomain create  # myapp
clouly dns create <prod-id>  # Point to prod.vercel.app
```

---

## Troubleshooting Quick Fixes

### Website not loading?

```bash
# Check DNS records
clouly dns list <subdomain-id>

# Test DNS resolution
nslookup myapp.clouly.tech

# Wait 5-10 minutes for propagation
```

### Wrong CNAME?

```bash
# Update existing record
clouly dns list <subdomain-id>
clouly dns update <subdomain-id> <record-id>
```

### Delete everything and start over?

```bash
clouly dns list <subdomain-id>
clouly dns delete <subdomain-id> <record-id>
clouly subdomain delete <subdomain-id>
```

---

## Success Checklist ✅

-   [ ] Installed Clouly CLI
-   [ ] Logged in with `clouly auth login`
-   [ ] Created subdomain with `clouly subdomain create`
-   [ ] Deployed app to hosting service (Vercel/Netlify)
-   [ ] Added custom domain in hosting dashboard
-   [ ] Copied CNAME from hosting service
-   [ ] Created DNS record with `clouly dns create`
-   [ ] Verified with `clouly dns list`
-   [ ] Tested website in browser

**You're done! 🎉 Your website is live!**
