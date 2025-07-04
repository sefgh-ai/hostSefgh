# hostSefgh
well this si for hosting sefgh in case main server is down

## License
This project is licensed for non-commercial use only. Attribution is required.  
Commercial use is prohibited without written permission.  
See [LICENSE.md](./LICENSE.md) for full terms.

This is the metadata and SEO block that should be included in the <head> section of important pages (e.g., search pages) when hosting SEFGH, especially as a fallback in case the main server is down.

✅ Required <head> Block
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3J37CNB3YE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-3J37CNB3YE");
</script>

<!-- Primary Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SEFGH - AI-Powered GitHub Repository Search</title>
<meta name="description" content="Discover hidden GitHub gems with SEFGH's intelligent search. Go beyond keywords with natural language queries and find projects that truly match your needs. Perfect for developers, data scientists, and researchers." />
<meta name="keywords" content="GitHub search tool, GitHub project discovery, smart GitHub search, find GitHub projects, GitHub repository search engine, discover GitHub gems, open source project finder" />
<meta name="author" content="SEFGH" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://sefgh.org/" />
<link rel="icon" type="image/png" href="./assets/favicon.png" />
<link rel="sitemap" type="application/xml" title="Sitemap" href="sitemap.xml" />


<!-- Open Graph / Facebook Meta Tags -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://sefgh.org/" />
<meta property="og:title" content="SEFGH - Search Engine For Github, Smart GitHub Project Discovery Tool" />
<meta property="og:description" content="Discover hidden GitHub gems with SEFGH's intelligent search. Go beyond keywords with natural language queries and find projects that truly match your needs." />
<meta property="og:image" content="https://sefgh.org/assets/sefgh-social-preview.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="SEFGH" />

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://sefgh.org/" />
<meta name="twitter:title" content="SEFGH - Search Engine For Github" />
<meta name="twitter:description" content="Discover hidden GitHub gems with SEFGH's intelligent search. Go beyond keywords with natural language queries and find projects that truly match your needs." />
<meta name="twitter:image" content="https://sefgh.org/assets/sefgh-social-preview.jpg" />
<meta name="twitter:creator" content="@sefgh" />
<meta name="twitter:site" content="@sefgh" />

<!-- Web App Identity -->
<meta name="application-name" content="SEFGH" />
<meta name="theme-color" content="#2563eb" />
<meta name="msapplication-TileColor" content="#2563eb" />

<!-- Structured Data: Web Application -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SEFGH",
  "url": "https://sefgh.org",
  "description": "A smart GitHub project discovery tool that helps developers find repositories using natural language queries and intelligent matching based on LLM'S Agentic Frameworks.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "SEFGH",
    "url": "https://sefgh.org"
  },
  "featureList": [
    "Natural language GitHub search",
    "Multi-language project discovery",
    "Smart repository matching",
    "Hidden gem discovery",
    "Detailed project analysis",
    "Search Engine For Github"
  ]
}
</script>

<!-- Structured Data: Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SEFGH",
  "url": "https://sefgh.org",
  "logo": "https://sefgh.org/assets/sefgh-logo.png",
  "description": "SEFGH is a smart GitHub project discovery tool that helps developers find repositories using natural language queries.",
  "foundingDate": "2025",
  "sameAs": [
    "https://twitter.com/sefghai",
    "https://github.com/sefgh-ai"
  ]
}
</script>

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Stalinist+One&display=swap" rel="stylesheet" />
```

📝 Notes
- Always include this in <head> of your critical pages (especially the fallback or offline instance).
- Keep URLs and image paths up to date with your deployment (e.g., change sefgh.org if hosted elsewhere).
