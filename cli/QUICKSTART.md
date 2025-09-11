# 🚀 Clouly CLI Quick Start - 5 Minutes to Live Website

## Copy & Paste Commands (Real Example)

### Step 1: Install & Login

```bash
# Install Clouly CLI
npm install -g clouly

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
