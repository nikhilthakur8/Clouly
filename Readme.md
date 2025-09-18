# Clouly.in

![Clouly Banner](https://clouly.in/favicon-96x96.png) <!-- Replace with actual banner image -->

**Clouly.in** is a free service that allows you to create **unlimited subdomains** under `clouly.in` and manage all DNS records effortlessly. It's perfect for hosting your projects, portfolios, or apps on a custom subdomain without worrying about DNS configuration.

Website: [https://clouly.in](https://clouly.in)  
Setup Guide: [https://clouly.in/learn-more](https://clouly.in/learn-more)

---

## Features

-   **Unlimited Free Subdomains**
    -   Create as many subdomains as you want under `clouly.in`.
-   **Easy DNS Management**

    -   Add, edit, and manage DNS records (CNAME, A, TXT, etc.) directly from the dashboard.

-   **Quick Setup**

    -   Connect your projects hosted on platforms like **Vercel, Render**, or any other hosting provider in minutes.

-   **Customizable TTL**
    -   Manage Time-To-Live for each DNS record for fine-grained control.

---

##  How to Set Up Your Subdomain

Follow these 5 simple steps to get your project live under `clouly.in`:

### **Step 1: Create Your Project**

Go to **Vercel** or **Render** and create a new project.  
Example subdomain: `nikhil-portfolio.clouly.in`.

### **Step 2: Copy CNAME**

Copy the CNAME value provided by your hosting platform for your project. This will be used in Clouly’s DNS settings.

### **Step 3: Add Subdomain in Clouly**

Visit [Clouly.in](https://clouly.in) and create your subdomain, for example: `nikhil-portfolio`.

### **Step 4: Create CNAME Record**

-   Go to your subdomain dashboard.
-   Add a **DNS record** of type **CNAME**.
-   Paste the copied value from Step 2.
-   Keep the default TTL or adjust if needed.

### **Step 5: Wait for DNS Propagation**

-   DNS changes can take **10–30 minutes** to propagate.
-   Once propagation is complete, your project will be live on your subdomain!

---

## Tech Stack

-   **Frontend:** React, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB / Appwrite (for DNS management and user data)
-   **Authentication:** Google OAuth for secure login
-   **Deployment:** Vercel / Render

---

## Useful Links

-   **Website:** [https://clouly.in](https://clouly.in)
-   **Learn More / Setup Guide:** [https://clouly.in/learn-more](https://clouly.in/learn-more)

---

## Contributing

We welcome contributions to improve Clouly!  
To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](./LICENSE).


---

## Author

**Your Name** – [Nikhil Thakur](https://github.com/nikhilthakur8)  
Made with ❤️ for developers looking for free, easy subdomain management.
