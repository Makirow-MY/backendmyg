import { faker } from '@faker-js/faker';

const defaultProjects = [
  // Graphic Design (5 projects)
  {
    title: 'Redesigning CamShop: A User-Centric E-commerce UI',
    slug: 'camshop-ecommerce-ui',
    images: [
            "https://picsum.photos/1920/1080?random=400",
            "https://picsum.photos/1920/1080?random=401",
            "https://picsum.photos/1920/1080?random=402"
    ],
    client: 'CamShop Ltd',
    description:
      'Revamped CamShop’s e-commerce platform with a user-centric UI, increasing user retention by 30%. Figma’s collaborative features enabled real-time stakeholder feedback, reducing design iterations by 40%. Accessibility (WCAG 2.1) ensured inclusivity for Cameroon’s diverse users, with dynamic prototyping streamlining developer handoff. Challenges like inconsistent branding were addressed with a cohesive design system, enhancing user trust and engagement.',
    projectcategory: 'Graphic Design',
    tags: ['Figma', 'Wireframing', 'Accessibility', 'Prototyping'],
    livepreview: 'https://demo.camshop.cm',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Figma', 'Adobe XD', 'Photoshop'],
    features: ['Responsive UI', 'Accessibility Compliance', 'Dynamic Prototypes'],
    platforms: ['Web', 'Mobile'],
    projectYear: 2024,
    repositoryUrl: 'https://github.com/camshop/redesign',
    documentationUrl: 'https://docs.camshop.cm',
    isResponsive: true,
    designTools: 'Figma, Adobe XD',
    userResearchMethods: 'Surveys, Usability Testing',
    designImpact: '30% increase in user retention, 25% faster checkout process',
  },
  {
    title: 'Africare: Healthcare App UI Kit for Sale',
    slug: 'africare-ui-kit',
    images: [
            "https://picsum.photos/1920/1080?random=410",
            "https://picsum.photos/1920/1080?random=421",
            "https://picsum.photos/1920/1080?random=432"
    ],
    description:
      'A comprehensive UI kit for healthcare apps, designed for developers to build intuitive interfaces. Includes 50+ customizable components, built with Sketch, ensuring scalability across iOS and Android. User research with 150 healthcare professionals informed design, achieving a 20% improvement in user task efficiency. Ideal for startups in Cameroon’s healthcare sector.',
    projectcategory: 'Graphic Design',
    tags: ['Sketch', 'Design Systems', 'Prototyping', 'Accessibility'],
    status: 'publish',
    projectType: 'For Sale',
    price: 299.99,
    licenseType: 'MIT',
    supportAvailable: true,
    technologies: ['Sketch', 'Figma'],
    features: ['Customizable Components', 'WCAG Compliance', 'Cross-Platform'],
    platforms: ['iOS', 'Android', 'Web'],
    projectYear: 2025,
    documentationUrl: 'https://docs.africare-ui.cm',
    isResponsive: true,
    designTools: 'Sketch, Figma',
    userResearchMethods: 'Interviews, Focus Groups',
    designImpact: '20% improvement in task efficiency, 15% faster prototyping',
  },
  {
    title: 'Brand Identity for EcoFarm Cameroon',
    slug: 'ecofarm-brand-identity',
    images: [
            "https://picsum.photos/1920/1080?random=430",
            "https://picsum.photos/1920/1080?random=431",
            "https://picsum.photos/1920/1080?random=432"
    ],
    client: 'EcoFarm Cameroon',
    description:
      'Developed a vibrant brand identity for EcoFarm, increasing brand recall by 25%. Adobe Illustrator crafted a scalable logo, with color palettes reflecting Cameroon’s agricultural heritage. User testing with local farmers ensured cultural resonance, while typography optimized readability across print and digital media.',
    projectcategory: 'Graphic Design',
    tags: ['Branding', 'Adobe XD', 'Typography', 'Design Systems'],
    livepreview: 'https://ecofarm.cm',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Adobe Illustrator', 'Adobe XD'],
    features: ['Scalable Logo', 'Cultural Design', 'Print/Digital Assets'],
    platforms: ['Print', 'Web', 'Mobile'],
    projectYear: 2023,
    isResponsive: true,
    designTools: 'Adobe Illustrator, Adobe XD',
    userResearchMethods: 'Field Testing, Surveys',
    designImpact: '25% increase in brand recall, 30% higher engagement',
  },
  {
    title: 'EduLearn: Interactive Learning Platform UI',
    slug: 'edulearn-ui-design',
    images: [
            "https://picsum.photos/1920/1080?random=440",
            "https://picsum.photos/1920/1080?random=441",
            "https://picsum.photos/1920/1080?random=442"
    ],
    client: 'EduTech Solutions',
    description:
      'Designed an interactive UI for EduLearn, boosting student engagement by 35%. Figma’s component-based design ensured consistency across 60+ screens, with accessibility features supporting visually impaired users. Real-time collaboration reduced design time by 30%, critical for Cameroon’s education sector.',
    projectcategory: 'Graphic Design',
    tags: ['Figma', 'Accessibility', 'Wireframing', 'Usability Testing'],
    livepreview: 'https://edulearn.cm',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Figma', 'Photoshop'],
    features: ['Interactive UI', 'Accessibility Features', 'Reusable Components'],
    platforms: ['Web', 'Mobile'],
    projectYear: 2024,
    isResponsive: true,
    designTools: 'Figma, Photoshop',
    userResearchMethods: 'Usability Testing, A/B Testing',
    designImpact: '35% increase in engagement, 20% faster navigation',
  },
  {
    title: 'TravelCam: Tourism App UI Template',
    slug: 'travelcam-ui-template',
   images: [
            "https://picsum.photos/1920/1080?random=450",
            "https://picsum.photos/1920/1080?random=451",
            "https://picsum.photos/1920/1080?random=452"
    ],
    description:
      'A premium UI template for tourism apps, designed for rapid deployment. Built with Adobe XD, it includes 40+ screens with vibrant visuals, increasing user bookings by 20% in testing. Optimized for Cameroon’s tourism market, with multilingual support and offline capabilities.',
    projectcategory: 'Graphic Design',
    tags: ['Adobe XD', 'Prototyping', 'Design Systems', 'Accessibility'],
    status: 'publish',
    projectType: 'For Sale',
    price: 199.99,
    licenseType: 'Apache',
    supportAvailable: true,
    technologies: ['Adobe XD', 'Figma'],
    features: ['Multilingual UI', 'Offline Support', 'Customizable Screens'],
    platforms: ['iOS', 'Android'],
    projectYear: 2025,
    documentationUrl: 'https://docs.travelcam.cm',
    isResponsive: true,
    designTools: 'Adobe XD, Figma',
    userResearchMethods: 'Surveys, Prototyping',
    designImpact: '20% increase in bookings, 15% faster design iteration',
  },
  // Website Development (5 projects)
  {
    title: 'ShopFast: Scalable E-commerce Platform',
    slug: 'shopfast-ecommerce',
    images: [
            "https://picsum.photos/1920/1080?random=460",
            "https://picsum.photos/1920/1080?random=461",
            "https://picsum.photos/1920/1080?random=462"
    ],
    client: 'FastRetail Co',
    description:
      'Built a scalable e-commerce platform with Next.js and Vercel, reducing load times by 40% and boosting sales by 25%. Integrated Stripe for payments and Redis for caching, handling 15,000 concurrent users. SEO optimizations increased organic traffic by 30%, vital for Cameroon’s retail market.',
    projectcategory: 'Website Development',
    tags: ['Next.js', 'SEO', 'Performance', 'REST API'],
    livepreview: 'https://shopfast.cm',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Next.js', 'Node.js', 'Redis'],
    features: ['Payment Integration', 'SEO Optimization', 'Scalable Backend'],
    platforms: ['Web'],
    projectYear: 2024,
    repositoryUrl: 'https://github.com/shopfast/ecommerce',
    isResponsive: true,
    frameworks: 'Next.js, Express',
    deploymentPlatform: 'Vercel',
    performanceMetrics: '40% faster load times, 25% sales increase',
  },
  {
    title: 'HealthTrack: SaaS Healthcare Dashboard',
    slug: 'healthtrack-saas',
    images: [
            "https://picsum.photos/1920/1080?random=403",
            "https://picsum.photos/1920/1080?random=404",
            "https://picsum.photos/1920/1080?random=405"
    ],
    description:
      'A SaaS dashboard for healthcare providers, built with React and AWS. Real-time analytics reduced patient wait times by 20%, with JWT authentication ensuring data security. Scalable microservices handled 10,000 daily users, perfect for Cameroon’s growing healthcare sector.',
    projectcategory: 'Website Development',
    tags: ['React', 'Backend', 'REST API', 'Performance'],
    status: 'publish',
    projectType: 'For Sale',
    price: 499.99,
    licenseType: 'Custom',
    supportAvailable: true,
    technologies: ['React', 'Node.js', 'AWS'],
    features: ['Real-Time Analytics', 'Secure Authentication', 'Microservices'],
    platforms: ['Web'],
    projectYear: 2025,
    documentationUrl: 'https://docs.healthtrack.cm',
    isResponsive: true,
    frameworks: 'React, Express',
    deploymentPlatform: 'AWS',
    performanceMetrics: '20% reduction in wait times, 99.9% uptime',
  },
  {
    title: 'EduPlatform: Online Learning Management System',
    slug: 'eduplatform-lms',
    images: [
            "https://picsum.photos/1920/1080?random=413",
            "https://picsum.photos/1920/1080?random=414",
            "https://picsum.photos/1920/1080?random=415"
    ],
    client: 'CamEdu Group',
    description:
      'Developed a learning management system with Node.js and MongoDB, increasing course completion rates by 30%. GraphQL APIs reduced data over-fetching by 25%, while Cloudflare CDN improved global access. Accessibility features supported diverse learners in Cameroon.',
    projectcategory: 'Website Development',
    tags: ['Node.js', 'GraphQL', 'SEO', 'Accessibility'],
    livepreview: 'https://eduplatform.cm',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Node.js', 'MongoDB', 'GraphQL'],
    features: ['Course Management', 'Accessibility Compliance', 'Global CDN'],
    platforms: ['Web'],
    projectYear: 2023,
    isResponsive: true,
    frameworks: 'Node.js, React',
    deploymentPlatform: 'Heroku',
    performanceMetrics: '30% higher completion rates, 25% less data fetching',
  },
  {
    title: 'JobConnect: Recruitment Portal Template',
    slug: 'jobconnect-portal',
    images: [
            "https://picsum.photos/1920/1080?random=423",
            "https://picsum.photos/1920/1080?random=424",
            "https://picsum.photos/1920/1080?random=425"
    ],
    description:
      'A customizable job portal template built with Next.js, designed for rapid deployment. Features like real-time job matching and resume uploads increased user engagement by 20%. Optimized for SEO and low-bandwidth environments, ideal for Cameroon’s job market.',
    projectcategory: 'Website Development',
    tags: ['Next.js', 'SEO', 'Performance', 'Frontend'],
    status: 'publish',
    projectType: 'For Sale',
    price: 399.99,
    licenseType: 'MIT',
    supportAvailable: true,
    technologies: ['Next.js', 'Tailwind CSS'],
    features: ['Job Matching', 'Resume Upload', 'SEO Optimization'],
    platforms: ['Web'],
    projectYear: 2025,
    documentationUrl: 'https://docs.jobconnect.cm',
    isResponsive: true,
    frameworks: 'Next.js',
    deploymentPlatform: 'Vercel',
    performanceMetrics: '20% higher engagement, 15% faster load times',
  },
  {
    title: 'AgriMarket: Farmer Marketplace Website',
    slug: 'agrimarket-website',
   images: [
            "https://picsum.photos/1920/1080?random=433",
            "https://picsum.photos/1920/1080?random=434",
            "https://picsum.photos/1920/1080?random=435"
    ],
    client: 'AgriCoop Cameroon',
    description:
      'Built a marketplace for farmers with React and AWS, increasing sales by 35%. Real-time inventory and payment integration streamlined transactions, while offline caching supported rural users. SEO optimizations boosted visibility in Cameroon’s agricultural sector.',
    projectcategory: 'Website Development',
    tags: ['React', 'Backend', 'SEO', 'Performance'],
    livepreview: 'https://agrimarket.cm',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['React', 'AWS', 'MongoDB'],
    features: ['Real-Time Inventory', 'Payment Integration', 'Offline Support'],
    platforms: ['Web', 'Mobile'],
    projectYear: 2024,
    isResponsive: true,
    frameworks: 'React, Express',
    deploymentPlatform: 'AWS',
    performanceMetrics: '35% sales increase, 99.8% uptime',
  },
  // Mobile Development (5 projects)
  {
    title: 'MediCare: Mobile Health Monitoring App',
    slug: 'medicare-health-app',
    images: [
            "https://picsum.photos/1920/1080?random=443",
            "https://picsum.photos/1920/1080?random=444",
            "https://picsum.photos/1920/1080?random=445"
    ],
    client: 'HealthPlus Cameroon',
    description:
      'Developed a React Native app for health monitoring, reducing patient follow-up times by 25%. Firebase integration enabled real-time data syncing, while biometric authentication ensured security. Offline support made it accessible in rural Cameroon.',
    projectcategory: 'Mobile Development',
    tags: ['React Native', 'Mobile Security', 'Push Notifications', 'App Store'],
    livepreview: 'https://play.google.com/store/apps/medicare',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['React Native', 'Firebase'],
    features: ['Real-Time Monitoring', 'Biometric Authentication', 'Offline Support'],
    platforms: ['iOS', 'Android'],
    projectYear: 2024,
    appStoreStatus: 'Published on App Store, Google Play',
    mobileFrameworks: 'React Native',
    targetDevices: 'iOS, Android',
  },
  {
    title: 'ShopEasy: Mobile E-commerce Solution',
    slug: 'shopeasy-mobile',
    images: [
            "https://picsum.photos/1920/1080?random=453",
            "https://picsum.photos/1920/1080?random=454",
            "https://picsum.photos/1920/1080?random=455"
    ],
    description:
      'A customizable e-commerce app template built with Flutter, designed for rapid market entry. Features like push notifications and in-app payments increased conversions by 20%. Optimized for low-end devices, ideal for Cameroon’s mobile market.',
    projectcategory: 'Mobile Development',
    tags: ['Flutter', 'Push Notifications', 'Mobile Security', 'App Store'],
    status: 'publish',
    projectType: 'For Sale',
    price: 249.99,
    licenseType: 'GPL',
    supportAvailable: true,
    technologies: ['Flutter', 'Dart'],
    features: ['In-App Payments', 'Push Notifications', 'Offline Caching'],
    platforms: ['iOS', 'Android'],
    projectYear: 2025,
    documentationUrl: 'https://docs.shopeasy.cm',
    appStoreStatus: 'Ready for Submission',
    mobileFrameworks: 'Flutter',
    targetDevices: 'iOS, Android',
  },
  {
    title: 'LearnCam: Mobile Education App',
    slug: 'learncam-education-app',
    images: [
            "https://picsum.photos/1920/1080?random=406",
            "https://picsum.photos/1920/1080?random=407",
            "https://picsum.photos/1920/1080?random=408"
    ],
    client: 'CamEdu Solutions',
    description:
      'Built a mobile education app with React Native, increasing student engagement by 30%. Offline video caching and gamified quizzes supported low-connectivity areas in Cameroon. Firebase Analytics tracked user progress, improving course completion rates.',
    projectcategory: 'Mobile Development',
    tags: ['React Native', 'Mobile UI', 'Push Notifications', 'App Store'],
    livepreview: 'https://play.google.com/store/apps/learncam',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['React Native', 'Firebase'],
    features: ['Offline Video', 'Gamified Quizzes', 'Progress Tracking'],
    platforms: ['iOS', 'Android'],
    projectYear: 2023,
    appStoreStatus: 'Published on Google Play',
    mobileFrameworks: 'React Native',
    targetDevices: 'iOS, Android',
  },
  {
    title: 'AgriApp: Farmer Productivity Tool',
    slug: 'agriapp-farmer-tool',
    images: [
            "https://picsum.photos/1920/1080?random=416",
            "https://picsum.photos/1920/1080?random=417",
            "https://picsum.photos/1920/1080?random=418"
    ],
    description:
      'A Flutter-based app for farmers, increasing productivity by 25%. Features like weather forecasting and market price tracking empowered rural users in Cameroon. Offline support and multilingual UI ensured accessibility across diverse regions.',
    projectcategory: 'Mobile Development',
    tags: ['Flutter', 'Mobile UI', 'Push Notifications', 'Mobile Security'],
    status: 'publish',
    projectType: 'For Sale',
    price: 199.99,
    licenseType: 'MIT',
    supportAvailable: true,
    technologies: ['Flutter', 'Dart'],
    features: ['Weather Forecasting', 'Price Tracking', 'Multilingual UI'],
    platforms: ['iOS', 'Android'],
    projectYear: 2025,
    documentationUrl: 'https://docs.agriapp.cm',
    appStoreStatus: 'Ready for Submission',
    mobileFrameworks: 'Flutter',
    targetDevices: 'iOS, Android',
  },
  {
    title: 'RideCam: Ride-Hailing Mobile App',
    slug: 'ridecam-ride-hailing',
    images: [
            "https://picsum.photos/1920/1080?random=426",
            "https://picsum.photos/1920/1080?random=427",
            "https://picsum.photos/1920/1080?random=428"
    ],
    client: 'CamTransport Ltd',
    description:
      'Developed a ride-hailing app with React Native, reducing booking times by 20%. Real-time GPS tracking and Firebase push notifications enhanced user experience. Optimized for low-bandwidth areas, supporting Cameroon’s urban mobility needs.',
    projectcategory: 'Mobile Development',
    tags: ['React Native', 'Mobile Security', 'Push Notifications', 'App Store'],
    livepreview: 'https://play.google.com/store/apps/ridecam',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['React Native', 'Firebase'],
    features: ['Real-Time GPS', 'Push Notifications', 'Low-Bandwidth Support'],
    platforms: ['iOS', 'Android'],
    projectYear: 2024,
    appStoreStatus: 'Published on App Store, Google Play',
    mobileFrameworks: 'React Native',
    targetDevices: 'iOS, Android',
  },
  // Network Design (5 projects)
  {
    title: 'CamTel: Enterprise 5G Network Deployment',
    slug: 'camtel-5g-network',
   images: [
            "https://picsum.photos/1920/1080?random=436",
            "https://picsum.photos/1920/1080?random=437",
            "https://picsum.photos/1920/1080?random=438"
    ],
    client: 'CamTel Solutions',
    description:
      'Deployed a 5G network for CamTel, achieving 1.5 Gbps speeds and 99.9% uptime in urban areas. Massive MIMO and sub-6 GHz bands supported 10,000 IoT devices, enhancing Cameroon’s digital infrastructure. Network automation reduced maintenance costs by 20%.',
    projectcategory: 'Network Design',
    tags: ['5G', 'Network Automation', 'Network Security', 'Cloud Networking'],
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Nokia AirScale', 'Cisco SDN'],
    features: ['High-Speed Connectivity', 'IoT Support', 'Automated Management'],
    platforms: ['Enterprise Networks'],
    projectYear: 2024,
    networkProtocols: '5G NR, TCP/IP',
    hardwareUsed: 'Nokia AirScale, Cisco Routers',
    networkMetrics: '1.5 Gbps speeds, 99.9% uptime',
  },
  {
    title: 'SecureNet: Zero-Trust Enterprise Solution',
    slug: 'securenet-zero-trust',
    images: [
            "https://picsum.photos/1920/1080?random=446",
            "https://picsum.photos/1920/1080?random=447",
            "https://picsum.photos/1920/1080?random=448"
    ],
    description:
      'A zero-trust network solution for enterprises, reducing breach risks by 70%. Built with Zscaler and Palo Alto firewalls, it features MFA and micro-segmentation. Scalable for Cameroon’s financial sector, with real-time monitoring ensuring security.',
    projectcategory: 'Network Design',
    tags: ['Network Security', 'Zero-Trust', 'Firewalls', 'Cloud Networking'],
    status: 'publish',
    projectType: 'For Sale',
    price: 999.99,
    licenseType: 'Custom',
    supportAvailable: true,
    technologies: ['Zscaler', 'Palo Alto'],
    features: ['Zero-Trust Security', 'MFA', 'Real-Time Monitoring'],
    platforms: ['Enterprise Networks'],
    projectYear: 2025,
    documentationUrl: 'https://docs.securenet.cm',
    networkProtocols: 'TLS, IPsec',
    hardwareUsed: 'Palo Alto Firewalls, Cisco Switches',
    networkMetrics: '70% risk reduction, 99.99% uptime',
  },
  {
    title: 'SmartCity: IoT Network for Urban Planning',
    slug: 'smartcity-iot-network',
    images: [
            "https://picsum.photos/1920/1080?random=466",
            "https://picsum.photos/1920/1080?random=467",
            "https://picsum.photos/1920/1080?random=468"
    ],
    client: 'Douala City Council',
    description:
      'Designed an IoT network for smart city applications, supporting 15,000 devices with 95% uptime. LoRaWAN and MQTT ensured low-power connectivity, while edge computing reduced latency by 30%. Enhanced urban planning in Cameroon’s cities.',
    projectcategory: 'Network Design',
    tags: ['IoT', 'Network Automation', 'Network Security', 'Cloud Networking'],
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['LoRaWAN', 'AWS IoT'],
    features: ['Low-Power Connectivity', 'Edge Computing', 'Scalable IoT'],
    platforms: ['City Networks'],
    projectYear: 2023,
    networkProtocols: 'LoRaWAN, MQTT',
    hardwareUsed: 'Semtech Gateways, Cisco Routers',
    networkMetrics: '95% uptime, 30% lower latency',
  },
  {
    title: 'VoIPCam: Enterprise VoIP Solution',
    slug: 'voipcam-enterprise',
    images: [
            "https://picsum.photos/1920/1080?random=56",
            "https://picsum.photos/1920/1080?random=57",
            "https://picsum.photos/1920/1080?random=58"
    ],
    description:
      'A VoIP solution for enterprises, reducing call jitter by 25%. Built with Asterisk and OpenFlow, it prioritizes voice traffic for clear communication. Scalable for Cameroon’s businesses, with automated QoS policies ensuring reliability.',
    projectcategory: 'Network Design',
    tags: ['Network Automation', 'Routing', 'VPN', 'Cloud Networking'],
    status: 'publish',
    projectType: 'For Sale',
    price: 799.99,
    licenseType: 'Apache',
    supportAvailable: true,
    technologies: ['Asterisk', 'OpenFlow'],
    features: ['Voice Prioritization', 'Automated QoS', 'Scalable VoIP'],
    platforms: ['Enterprise Networks'],
    projectYear: 2025,
    documentationUrl: 'https://docs.voipcam.cm',
    networkProtocols: 'SIP, RTP',
    hardwareUsed: 'Cisco Switches, Polycom Phones',
    networkMetrics: '25% lower jitter, 99.8% call reliability',
  },
  {
    title: 'CampusNet: University Network Upgrade',
    slug: 'campusnet-upgrade',
    images: [
            "https://picsum.photos/1920/1080?random=53",
            "https://picsum.photos/1920/1080?random=54",
            "https://picsum.photos/1920/1080?random=55"
    ],
    client: 'University of Yaoundé',
    description:
      'Upgraded a university network with Cisco SDN, increasing Wi-Fi coverage by 40%. Ansible automation reduced setup time by 50%, while zero-trust security ensured data protection. Supported 20,000 students in Cameroon’s academic environment.',
    projectcategory: 'Network Design',
    tags: ['Network Automation', 'Network Security', 'Routing', '5G'],
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Cisco SDN', 'Ansible'],
    features: ['Wi-Fi Expansion', 'Zero-Trust Security', 'Automated Setup'],
    platforms: ['Campus Networks'],
    projectYear: 2024,
    networkProtocols: 'Wi-Fi 6, TCP/IP',
    hardwareUsed: 'Cisco Access Points, Aruba Switches',
    networkMetrics: '40% more coverage, 50% faster setup',
  },
  // Video Editing (5 projects)
  {
    title: 'CamTour: Cinematic Tourism Campaign',
    slug: 'camtour-cinematic',
    images: [
            "https://picsum.photos/1920/1080?random=50",
            "https://picsum.photos/1920/1080?random=51",
            "https://picsum.photos/1920/1080?random=52"
    ],
    client: 'Cameroon Tourism Board',
    description:
      'Produced a cinematic tourism campaign with Premiere Pro, achieving 200K views. Dynamic linking with After Effects added stunning VFX, while Lumetri color grading enhanced visuals. Optimized for Cameroon’s tourism market, increasing engagement by 30%.',
    projectcategory: 'Video Editing',
    tags: ['Premiere Pro', 'VFX', 'Color Grading', 'Motion Graphics'],
    livepreview: 'https://youtube.com/camtour',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Premiere Pro', 'After Effects'],
    features: ['Cinematic VFX', 'Color Grading', 'Social Media Optimization'],
    platforms: ['YouTube', 'Social Media'],
    projectYear: 2024,
    editingSoftware: 'Premiere Pro, After Effects',
    videoType: 'Promotional',
    videoImpact: '200K views, 30% engagement increase',
  },
  {
    title: 'Corporate Video Suite: Branding Package',
    slug: 'corporate-video-suite',
    images: [
            "https://picsum.photos/1920/1080?random=76",
            "https://picsum.photos/1920/1080?random=77",
            "https://picsum.photos/1920/1080?random=78"
    ],
    description:
      'A customizable corporate video suite with DaVinci Resolve, featuring intros, outros, and ads. Color grading and motion graphics increased brand engagement by 25%. Proxy workflows ensured compatibility with standard hardware, ideal for Cameroon’s businesses.',
    projectcategory: 'Video Editing',
    tags: ['DaVinci Resolve', 'Motion Graphics', 'Color Grading', '4K Editing'],
    status: 'publish',
    projectType: 'For Sale',
    price: 149.99,
    licenseType: 'GPL',
    supportAvailable: true,
    technologies: ['DaVinci Resolve', 'After Effects'],
    features: ['Customizable Intros', '4K Support', 'Brand Consistency'],
    platforms: ['YouTube', 'Social Media'],
    projectYear: 2025,
    documentationUrl: 'https://docs.corporatevid.cm',
    editingSoftware: 'DaVinci Resolve',
    videoType: 'Corporate',
    videoImpact: '25% engagement increase, 20% faster production',
  },
  {
    title: 'EduVid: Educational Video Series',
    slug: 'eduvid-series',
    images: [
            "https://picsum.photos/1920/1080?random=73",
            "https://picsum.photos/1920/1080?random=74",
            "https://picsum.photos/1920/1080?random=75"
    ],
    client: 'CamEdu Solutions',
    description:
      'Produced a video series for online learning with Final Cut Pro, increasing viewer retention by 20%. Multicam editing synced lectures, while audio enhancements with Audition improved clarity. Optimized for Cameroon’s e-learning platforms.',
    projectcategory: 'Video Editing',
    tags: ['Final Cut', 'VFX', 'Color Grading', 'Motion Graphics'],
    livepreview: 'https://youtube.com/eduvid',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Final Cut Pro', 'Audition'],
    features: ['Multicam Editing', 'Audio Enhancement', 'Social Media Integration'],
    platforms: ['YouTube', 'Web'],
    projectYear: 2023,
    editingSoftware: 'Final Cut Pro, Audition',
    videoType: 'Educational',
    videoImpact: '20% higher retention, 15% better engagement',
  },
  {
    title: 'VFXPro: Cinematic Effects Template',
    slug: 'vfxpro-effects',
   images: [
            "https://picsum.photos/1920/1080?random=70",
            "https://picsum.photos/1920/1080?random=71",
            "https://picsum.photos/1920/1080?random=72"
    ],
    description:
      'A VFX template for After Effects, designed for cinematic intros and transitions. Particle effects and keyframe animations increased viewer engagement by 30%. Optimized for quick rendering, perfect for Cameroon’s content creators.',
    projectcategory: 'Video Editing',
    tags: ['After Effects', 'VFX', 'Motion Graphics', '4K Editing'],
    status: 'publish',
    projectType: 'For Sale',
    price: 99.99,
    licenseType: 'MIT',
    supportAvailable: true,
    technologies: ['After Effects'],
    features: ['Cinematic Transitions', 'Particle Effects', 'Fast Rendering'],
    platforms: ['YouTube', 'Social Media'],
    projectYear: 2025,
    documentationUrl: 'https://docs.vfxpro.cm',
    editingSoftware: 'After Effects',
    videoType: 'Promotional',
    videoImpact: '30% engagement increase, 20% faster rendering',
  },
  {
    title: 'AgriDoc: Documentary on Sustainable Farming',
    slug: 'agridoc-farming',
   images: [
            "https://picsum.photos/1920/1080?random=86",
            "https://picsum.photos/1920/1080?random=87",
            "https://picsum.photos/1920/1080?random=88"
    ],
    client: 'AgriCoop Cameroon',
    description:
      'Produced a documentary on sustainable farming with Premiere Pro, achieving 150K views. Advanced color grading and Foley effects created an immersive experience. Optimized for social media, boosting awareness in Cameroon’s agricultural sector.',
    projectcategory: 'Video Editing',
    tags: ['Premiere Pro', 'VFX', 'Color Grading', 'Motion Graphics'],
    livepreview: 'https://youtube.com/agridoc',
    status: 'publish',
    projectType: 'Showcase',
    technologies: ['Premiere Pro', 'After Effects'],
    features: ['Immersive Audio', 'Color Grading', 'Social Media Optimization'],
    platforms: ['YouTube', 'Social Media'],
    projectYear: 2024,
    editingSoftware: 'Premiere Pro, After Effects',
    videoType: 'Documentary',
    videoImpact: '150K views, 25% engagement increase',
  },
];

function generateRandomReviews(project, projectId) {
  const companies = [
    'CamTech Solutions',
    'Innovatech Cameroon',
    'DigitalWave Ltd',
    'TechHub Africa',
    'SmartSolutions Inc',
    'NextGen Technologies',
    'FutureVision Ltd',
    'TechSavvy Cameroon',
    'Creative Way Ltd',
    'AfriTech Enterprises',
    'ConnectSphere Ltd',
    'DataWave Analytics',
    'SecureNet Solutions',
    'GlobalLink Tech',
    'WebScale Technologies',
    'NetOptic Solutions',
    'EduTech Cameroon',
    'HealthPlus Ltd',
  ];
  const roles = [
    'Project Manager',
    'CTO',
    'Marketing Director',
    'Product Owner',
    'IT Consultant',
    'Creative Director',
    'Network Engineer',
    'App Developer',
    'Video Producer',
    'UX Designer',
  ];

  const reviewTemplates = {
    'Graphic Design': [
      {
        type: 'testimonial',
        message:
          'The {tag} expertise in {title} transformed our app’s usability. Using {tag2} for prototyping cut our review cycles by 25%. A fantastic partner for Cameroon’s market!',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag} approach with {tag2} delivered a visually stunning UI that boosted user satisfaction by 20%. Highly recommend!',
      },
      {
        type: 'feedback',
        message:
          'Working on {title} was seamless. The {tag2} design system ensured consistency across platforms, saving us 15% in development time.',
      },
      {
        type: 'testimonial',
        message:
          '{title} redefined our brand’s digital presence. The {tag} focus on accessibility made our app inclusive, increasing engagement by 30%.',
      },
      {
        type: 'review',
        message:
          'Outstanding work on {title}! The {tag} designs with {tag2} tools were intuitive and scalable, perfect for our growing user base.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} process in {title} was collaborative. {tag2} wireframing clarified our vision, improving user flows by 18%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} elevated our user experience to new heights. The {tag2} prototyping ensured a polished, accessible UI for Cameroon’s diverse users.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag} expertise and {tag2} tools created a responsive design that works flawlessly across devices.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} approach in {title} was meticulous. Using {tag2} for user testing uncovered insights that boosted conversion rates by 22%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} set a new standard for our UI. The {tag} designs with {tag2} components were both beautiful and functional, driving engagement.',
      },
    ],
    'Website Development': [
      {
        type: 'testimonial',
        message:
          '{title} revolutionized our online platform. The {tag} optimizations with {tag2} reduced load times by 30%, boosting sales in Cameroon.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag2} framework delivered a fast, secure website that increased our conversions by 25%.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} expertise in {title} streamlined our deployment. Using {tag2} for caching ensured 99.9% uptime, critical for our users.',
      },
      {
        type: 'testimonial',
        message:
          '{title} transformed our digital strategy. The {tag} SEO enhancements with {tag2} drove 20% more organic traffic.',
      },
      {
        type: 'review',
        message:
          'Fantastic work on {title}! The {tag} approach with {tag2} APIs created a scalable platform that handles thousands of users.',
      },
      {
        type: 'feedback',
        message:
          'Working on {title} was efficient. The {tag2} integration for real-time analytics improved our decision-making by 15%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} delivered a robust website. The {tag} performance tweaks with {tag2} cut latency, enhancing user experience in Cameroon.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag} expertise and {tag2} deployment ensured a seamless, responsive site for our audience.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} process in {title} was top-notch. {tag2} optimizations reduced data overhead, making our site faster by 20%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} boosted our online presence. The {tag2} framework made our site scalable and user-friendly, driving engagement.',
      },
    ],
    'Mobile Development': [
      {
        type: 'testimonial',
        message:
          '{title} transformed our mobile strategy. The {tag} optimizations with {tag2} cut app latency by 20%, perfect for Cameroon’s users.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag2} framework delivered a secure, responsive app that increased engagement by 25%.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} approach in {title} was seamless. Using {tag2} for push notifications improved user retention by 18%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} set a new standard for our mobile app. The {tag} features with {tag2} ensured offline support for rural users.',
      },
      {
        type: 'review',
        message:
          'Outstanding work on {title}! The {tag} expertise with {tag2} created a fast, intuitive app for our audience.',
      },
      {
        type: 'feedback',
        message:
          'Working on {title} was smooth. The {tag2} integration for real-time tracking enhanced user experience by 15%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} delivered a game-changing app. The {tag} security with {tag2} ensured user trust, boosting downloads in Cameroon.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag} approach with {tag2} made our app scalable and user-friendly across devices.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} process in {title} was efficient. {tag2} optimizations for low-end devices improved performance by 20%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} elevated our mobile presence. The {tag2} features like gamification drove 30% higher user engagement.',
      },
    ],
    'Network Design': [
      {
        type: 'testimonial',
        message:
          '{title} transformed our network infrastructure. The {tag} automation with {tag2} cut setup time by 40%, vital for Cameroon’s market.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag2} framework delivered a secure, scalable network with 99.9% uptime.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} expertise in {title} was outstanding. Using {tag2} for zero-trust security reduced risks by 30%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} revolutionized our connectivity. The {tag} optimizations with {tag2} supported thousands of IoT devices seamlessly.',
      },
      {
        type: 'review',
        message:
          'Fantastic work on {title}! The {tag} approach with {tag2} ensured low-latency, reliable networking for our users.',
      },
      {
        type: 'feedback',
        message:
          'Working on {title} was efficient. The {tag2} integration for QoS improved performance by 25% in our network.',
      },
      {
        type: 'testimonial',
        message:
          '{title} delivered a robust network solution. The {tag} security with {tag2} ensured compliance and reliability.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag} expertise with {tag2} created a scalable, secure network for our enterprise.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} process in {title} was seamless. {tag2} automation saved us 20% in maintenance costs.',
      },
      {
        type: 'testimonial',
        message:
          '{title} set a new standard for our network. The {tag2} IoT support scaled to meet our growing demands in Cameroon.',
      },
    ],
    'Video Editing': [
      {
        type: 'testimonial',
        message:
          '{title} elevated our brand with stunning visuals. The {tag} expertise with {tag2} created a video that boosted engagement by 30%.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag2} editing delivered a cinematic experience that increased views by 25%.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} process in {title} was seamless. Using {tag2} for color grading enhanced the video quality significantly.',
      },
      {
        type: 'testimonial',
        message:
          '{title} transformed our marketing campaign. The {tag} VFX with {tag2} made our video stand out in Cameroon’s market.',
      },
      {
        type: 'review',
        message:
          'Outstanding work on {title}! The {tag} approach with {tag2} ensured fast rendering and high-quality output.',
      },
      {
        type: 'feedback',
        message:
          'Working on {title} was efficient. The {tag2} motion graphics added a professional touch, improving viewer retention by 20%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} delivered a visually stunning video. The {tag} expertise with {tag2} optimized it for social media, driving engagement.',
      },
      {
        type: 'review',
        message:
          '5 stars for {title}! The {tag} editing with {tag2} created an immersive experience for our audience.',
      },
      {
        type: 'feedback',
        message:
          'The {tag} approach in {title} was meticulous. Using {tag2} for audio enhancements improved clarity by 15%.',
      },
      {
        type: 'testimonial',
        message:
          '{title} set a new standard for our video content. The {tag2} VFX made our campaign memorable in Cameroon.',
      },
    ],
  };

  const reviews = [];
  const category = project.projectcategory;
  const availableTemplates = reviewTemplates[category] || [];

  for (let i = 0; i < 10; i++) {
    const name = faker.person.firstName() + ' ' + faker.person.lastName();
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    const tag1 = project.tags[Math.floor(Math.random() * project.tags.length)];
    const tag2 = project.tags[Math.floor(Math.random() * project.tags.length)] || tag1;
    const randomNum = Math.floor(Math.random() * 100) + 1;
    const gender = randomNum % 2 === 0 ? 'female' : 'male';
    const imageNumber = Math.floor(Math.random() * 100);
    const rateNumber = Math.floor(Math.random() * 3) + 3;

    const review = {
      name,
      image: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${imageNumber}.jpg`,
      email: faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] }),
      message: template.message
        .replace('{title}', project.title)
        .replace('{tag}', tag1)
        .replace('{tag2}', tag2)
        .replace('{category}', category),
      role,
      website: `https://${company.toLowerCase().replace(/\s+/g, '')}.cm`,
      company,
      project: projectId,
      projectName: project.title,
      projectSlug: project.slug,
      rating:
        rateNumber === 1
          ? '⭐'
          : rateNumber === 2
          ? '⭐⭐'
          : rateNumber === 3
          ? '⭐⭐⭐'
          : rateNumber === 4
          ? '⭐⭐⭐⭐'
          : rateNumber === 5
          ? '⭐⭐⭐⭐⭐'
          : '⭐⭐⭐⭐⭐⭐',
      consent: true,
      createdAt: new Date(),
    };

    reviews.push(review);
  }

  return reviews;
}


const defaultBlogs = [
    // Graphic Design (5 blogs)
    {
        title: "Designing the Future: The Power of Figma in Collaborative UI/UX",
        slug: "figma-collaborative-ui-ux",
        images: [
            "https://picsum.photos/1920/1080?random=101",
            "https://picsum.photos/1920/1080?random=102",
            "https://picsum.photos/1920/1080?random=103"
        ],
        description: "Figma has redefined collaborative UI/UX design, enabling real-time teamwork across global design teams. Its cloud-based platform supports rapid prototyping, with features like vector editing and auto-layout reducing design iteration time by 35%. In a recent e-commerce project, Figma’s component-based design streamlined workflows, ensuring consistency across 50+ screens while maintaining accessibility standards (WCAG 2.1). Real-time feedback loops with stakeholders accelerated approvals by 40%, critical for fast-paced markets like Cameroon’s growing digital economy.\n\nChallenges like version control were addressed using Figma’s branching feature, allowing parallel design explorations without conflicts. Design systems with reusable components ensured scalability, while plugins like Stark enhanced accessibility testing. In regions with diverse user needs, Figma’s collaborative tools empower designers to create inclusive, user-centric interfaces. This blog dives into practical workflows, sharing metrics from real projects to inspire designers. How are you leveraging Figma’s collaborative features to enhance your design process? Share your tips in the comments to spark innovation!",
        blogcategory: "Graphic Design",
        tags: ["Figma", "UI Design", "UX Design", "Prototyping", "Accessibility"],
        status: "publish",
        comments: []
    },
    {
        title: "Crafting Memorable Brands: The Art & Science of Logo Design",
        slug: "art-science-logo-design",
        images: [
            "https://picsum.photos/1920/1080?random=104",
            "https://picsum.photos/1920/1080?random=105",
            "https://picsum.photos/1920/1080?random=106"
        ],
        description: "Logo design blends creativity and strategy to create memorable brand identities. Using Adobe XD, a startup’s logo was crafted, balancing minimalist aesthetics with cultural resonance for Cameroon’s market, achieving a 20% increase in brand recall. Principles like color theory (using HSL for emotional impact) and typography (custom sans-serif fonts) ensured visual harmony. Iterative testing with user groups refined designs, aligning with brand values while maintaining versatility across digital and print media.\n\nChallenges like scalability were addressed by designing vector-based logos, ensuring clarity on billboards and mobile screens. Tools like Illustrator enhanced precision, while user feedback loops validated emotional impact. In competitive markets, a strong logo drives customer loyalty and brand recognition. This blog shares design principles and case studies, offering a roadmap for impactful logos. What strategies do you use to balance creativity and functionality in logo design? Join the discussion in the comments to share your expertise!",
        blogcategory: "Graphic Design",
        tags: ["Logo Design", "Branding", "Adobe XD", "Typography", "Color Theory"],
        status: "publish",
        comments: []
    },
    {
        title: "User-Centric Design: Leveraging User Research for Intuitive Interfaces",
        slug: "user-centric-design-research",
        images: [
            "https://picsum.photos/1920/1080?random=107",
            "https://picsum.photos/1920/1080?random=108",
            "https://picsum.photos/1920/1080?random=109"
        ],
        description: "User research is the cornerstone of intuitive UI/UX design, ensuring interfaces meet real user needs. In a mobile banking app project, surveys and usability testing with 200 users revealed navigation pain points, leading to a 30% increase in task completion rates after redesign. Techniques like card sorting and heatmaps, using tools like Optimal Workshop, informed information architecture, while A/B testing validated design choices. In Cameroon, where digital literacy varies, user research ensures accessibility for diverse audiences.\n\nChallenges like small sample sizes were mitigated by combining qualitative interviews with quantitative analytics, creating robust user personas. Tools like Sketch streamlined wireframing, enabling rapid iteration. This blog shares research methodologies and real-world metrics, offering a guide to user-centric design. How do you integrate user feedback into your design process? Share your insights in the comments to inspire better interfaces!",
        blogcategory: "Graphic Design",
        tags: ["User Research", "UI Design", "UX Design", "Wireframing", "Accessibility"],
        status: "publish",
        comments: []
    },
    {
        title: "Mastering Typography: Elevating UI with Strategic Font Choices",
        slug: "mastering-typography-ui",
        images: [
            "https://picsum.photos/1920/1080?random=110",
            "https://picsum.photos/1920/1080?random=111",
            "https://picsum.photos/1920/1080?random=112"
        ],
        description: "Typography shapes user experience by enhancing readability and emotional impact in UI design. In a recent e-learning platform, selecting accessible fonts like Open Sans and optimizing line spacing increased user engagement by 25%. Tools like FontPair and Google Fonts streamlined font selection, ensuring compatibility across devices. Contrast ratios (WCAG-compliant) improved accessibility for visually impaired users, critical for inclusive design in regions like Cameroon.\n\nChallenges like font rendering on low-end devices were addressed by subsetting fonts and using system fonts as fallbacks. Variable fonts reduced load times by 15%, enhancing performance. This blog explores typography principles, sharing case studies and metrics to guide designers. How do you choose fonts to balance aesthetics and accessibility? Join the conversation in the comments to share your strategies!",
        blogcategory: "Graphic Design",
        tags: ["Typography", "UI Design", "Accessibility", "Web Design", "Mobile Design"],
        status: "publish",
        comments: []
    },
    {
        title: "Prototyping with Sketch: Accelerating the Design-to-Development Pipeline",
        slug: "prototyping-sketch-pipeline",
        images: [
            "https://picsum.photos/1920/1080?random=113",
            "https://picsum.photos/1920/1080?random=114",
            "https://picsum.photos/1920/1080?random=115"
        ],
        description: "Sketch revolutionizes prototyping by bridging design and development with high-fidelity mockups. In a social media app project, Sketch’s symbol system enabled reusable components, reducing design time by 30%. Plugins like Craft synced designs to InVision, streamlining developer handoff. User testing with interactive prototypes validated navigation flows, improving user satisfaction by 20%. In fast-paced markets like Cameroon, rapid prototyping accelerates product launches.\n\nChallenges like cross-team collaboration were addressed using Sketch’s cloud sharing, enabling real-time feedback. Export presets ensured pixel-perfect assets for developers. This blog shares prototyping workflows and metrics, offering a guide to efficient design pipelines. What tools do you use to streamline prototyping? Share your experiences in the comments to inspire innovation!",
        blogcategory: "Graphic Design",
        tags: ["Sketch", "Prototyping", "UI Design", "Web Design", "Mobile Design"],
        status: "publish",
        comments: []
    },
    // Website Development (5 blogs)
    {
        title: "Building Scalable Web Apps with Next.js and Vercel",
        slug: "scalable-web-apps-nextjs",
        images: [
            "https://picsum.photos/1920/1080?random=116",
            "https://picsum.photos/1920/1080?random=117",
            "https://picsum.photos/1920/1080?random=118"
        ],
        description: "Next.js, paired with Vercel, empowers developers to build scalable, SEO-optimized web applications. In a recent e-commerce platform, server-side rendering (SSR) and incremental static regeneration (ISR) reduced page load times by 40%, boosting conversion rates by 15%. API routes simplified backend logic, while Tailwind CSS ensured responsive designs. Vercel’s automatic scaling handled 10,000 concurrent users seamlessly, critical for high-traffic markets like Cameroon’s digital economy.\n\nChallenges like client-side state management were addressed using Zustand, simplifying complex interactions. Automated testing with Jest ensured reliability, while CI/CD pipelines streamlined deployments. This blog shares deployment strategies and performance metrics, offering a roadmap for scalable web apps. How do you optimize Next.js apps for performance? Share your insights in the comments to drive innovation!",
        blogcategory: "Website Development",
        tags: ["Next.js", "React.js", "SEO", "Performance", "Deployment"],
        status: "publish",
        comments: []
    },
    {
        title: "Securing Web Apps with Robust Authentication Strategies",
        slug: "secure-web-authentication",
        images: [
            "https://picsum.photos/1920/1080?random=119",
            "https://picsum.photos/1920/1080?random=120",
            "https://picsum.photos/1920/1080?random=121"
        ],
        description: "Robust authentication is critical for secure web applications. Using Node.js and JWT, a multi-tenant platform implemented OAuth 2.0, reducing unauthorized access by 90%. Refresh tokens ensured session persistence, while bcrypt hashed passwords for data protection. In Cameroon, where cyber threats are rising, secure authentication builds user trust in platforms like e-commerce and banking.\n\nChallenges like token hijacking were mitigated with HTTPS and secure cookies, while rate limiting prevented brute-force attacks. This blog dives into authentication flows, sharing code snippets and security metrics to guide developers. How do you balance security and user experience in authentication systems? Join the discussion in the comments to share your expertise!",
        blogcategory: "Website Development",
        tags: ["Authentication", "Security", "Node.js", "JWT", "REST API"],
        status: "publish",
        comments: []
    },
    {
        title: "Optimizing Web Performance with Lazy Loading and Caching",
        slug: "web-performance-lazy-loading",
        images: [
            "https://picsum.photos/1920/1080?random=122",
            "https://picsum.photos/1920/1080?random=123",
            "https://picsum.photos/1920/1080?random=124"
        ],
        description: "Web performance is key to user retention, especially in bandwidth-constrained regions like Cameroon. In a news portal project, lazy loading images and code splitting with React reduced initial load times by 50%. Redis caching cut API response times by 60%, while CDN integration with Cloudflare ensured global content delivery. Performance monitoring with Lighthouse validated optimizations, achieving a 90+ score.\n\nChallenges like over-caching were addressed by setting proper cache headers and invalidation policies. This blog shares optimization techniques and metrics, offering a guide to high-performance web apps. What strategies do you use to boost web performance? Share your insights in the comments to inspire better solutions!",
        blogcategory: "Website Development",
        tags: ["Performance", "HTML/CSS", "JavaScript", "SEO", "Caching"],
        status: "publish",
        comments: []
    },
    {
        title: "Building Accessible Web Apps: Best Practices for Inclusivity",
        slug: "accessible-web-apps",
        images: [
            "https://picsum.photos/1920/1080?random=125",
            "https://picsum.photos/1920/1080?random=126",
            "https://picsum.photos/1920/1080?random=127"
        ],
        description: "Accessibility ensures web apps are usable by all, including those with disabilities. A healthcare platform achieved WCAG 2.1 compliance using semantic HTML and ARIA landmarks, improving navigation for screen readers by 30%. Automated testing with axe-core identified contrast issues, while keyboard navigation support enhanced usability. In Cameroon, where digital inclusion is critical, accessible apps expand user reach.\n\nChallenges like dynamic content updates were addressed with live region announcements, ensuring real-time accessibility. This blog shares accessibility best practices and case studies, guiding developers to inclusive design. How do you implement accessibility in your web projects? Join the conversation in the comments to share your strategies!",
        blogcategory: "Website Development",
        tags: ["Accessibility", "HTML/CSS", "JavaScript", "SEO", "React.js"],
        status: "publish",
        comments: []
    },
    {
        title: "GraphQL vs REST: Choosing the Right API for Your Web App",
        slug: "graphql-vs-rest-api",
        images: [
            "https://picsum.photos/1920/1080?random=128",
            "https://picsum.photos/1920/1080?random=129",
            "https://picsum.photos/1920/1080?random=130"
        ],
        description: "Choosing between GraphQL and REST impacts web app scalability and flexibility. In a social media app, GraphQL’s query flexibility reduced over-fetching by 40% compared to REST, while Apollo Client simplified state management. REST’s simplicity, however, shone in a payment gateway with clear endpoints. In Cameroon’s growing tech scene, API choice affects development speed and user experience.\n\nChallenges like GraphQL’s learning curve were mitigated with schema-first design and tools like PostGraphile. This blog compares both approaches with real-world metrics, guiding developers to informed decisions. Which API do you prefer for scalable apps, and why? Share your experiences in the comments to drive discussion!",
        blogcategory: "Website Development",
        tags: ["GraphQL", "REST API", "Scalability", "Node.js", "Performance"],
        status: "publish",
        comments: []
    },
    // Mobile Development (5 blogs)
    {
        title: "Building Real-Time Mobile Apps with React Native and Firebase",
        slug: "realtime-mobile-react-native",
        images: [
            "https://picsum.photos/1920/1080?random=131",
            "https://picsum.photos/1920/1080?random=132",
            "https://picsum.photos/1920/1080?random=133"
        ],
        description: "React Native and Firebase enable real-time mobile apps with minimal setup. A delivery app leveraged Firebase Realtime Database for live tracking, achieving sub-second updates for 5,000 users. React Native’s component-based architecture ensured 90% code reuse across iOS and Android, while Firebase Authentication secured user data. In Cameroon, where mobile apps drive e-commerce, this stack delivers scalable solutions.\n\nChallenges like offline support were addressed with Firebase’s offline persistence, ensuring functionality in low-connectivity areas. This blog shares integration strategies and performance metrics, offering a roadmap for real-time apps. How do you handle real-time updates in mobile apps? Share your insights in the comments to inspire innovation!",
        blogcategory: "Mobile Development",
        tags: ["React Native", "Firebase", "Real-Time", "Mobile UI", "Cross-platform"],
        status: "publish",
        comments: []
    },
    {
        title: "Optimizing Flutter Apps for Low-End Devices",
        slug: "flutter-low-end-devices",
        images: [
            "https://picsum.photos/1920/1080?random=134",
            "https://picsum.photos/1920/1080?random=135",
            "https://picsum.photos/1920/1080?random=136"
        ],
        description: "Flutter’s performance makes it ideal for low-end devices, critical for markets like Cameroon. A health app optimized with Flutter’s widget tree restructuring reduced memory usage by 30%, running smoothly on 2GB RAM devices. Techniques like asset compression and lazy loading cut load times by 40%. Dart’s AOT compilation ensured native performance, while CI/CD with Codemagic streamlined deployments.\n\nChallenges like animation lag were addressed with Skia rendering optimizations. This blog shares performance tuning strategies and metrics, guiding developers to build efficient apps. How do you optimize Flutter for resource-constrained devices? Join the discussion in the comments to share your expertise!",
        blogcategory: "Mobile Development",
        tags: ["Flutter", "Performance", "Mobile UI", "Cross-platform", "Testing"],
        status: "publish",
        comments: []
    },
    {
        title: "Securing Mobile Apps with Biometric Authentication",
        slug: "mobile-biometric-authentication",
        images: [
            "https://picsum.photos/1920/1080?random=137",
            "https://picsum.photos/1920/1080?random=138",
            "https://picsum.photos/1920/1080?random=139"
        ],
        description: "Biometric authentication enhances mobile app security, building user trust. A banking app integrated fingerprint and face recognition using React Native’s biometric APIs, reducing login times by 50% while ensuring security. Fallback to PIN-based authentication ensured accessibility, critical for diverse users in Cameroon. Secure storage with Keychain (iOS) and Keystore (Android) protected sensitive data.\n\nChallenges like device compatibility were addressed with graceful degradation, supporting older devices. This blog shares implementation details and security metrics, offering a guide to biometric integration. How do you secure mobile apps for sensitive data? Share your strategies in the comments to drive discussion!",
        blogcategory: "Mobile Development",
        tags: ["Mobile Security", "React Native", "Authentication", "iOS", "Android"],
        status: "publish",
        comments: []
    },
    {
        title: "Push Notifications: Engaging Users in Mobile Apps",
        slug: "mobile-push-notifications",
        images: [
            "https://picsum.photos/1920/1080?random=140",
            "https://picsum.photos/1920/1080?random=141",
            "https://picsum.photos/1920/1080?random=142"
        ],
        description: "Push notifications drive user engagement in mobile apps, delivering timely updates. A retail app used Firebase Cloud Messaging (FCM) to send personalized offers, increasing click-through rates by 25%. Segmentation based on user behavior ensured relevance, while silent notifications updated app data in the background. In Cameroon, where mobile commerce is booming, notifications enhance user retention.\n\nChallenges like notification fatigue were mitigated by rate limiting and user preferences. This blog shares FCM integration strategies and engagement metrics, guiding developers to effective notification systems. How do you balance engagement and user experience with notifications? Join the conversation in the comments to share your insights!",
        blogcategory: "Mobile Development",
        tags: ["Push Notifications", "Flutter", "React Native", "Mobile UI", "Engagement"],
        status: "publish",
        comments: []
    },
    {
        title: "Testing Mobile Apps: Ensuring Quality with Automated Frameworks",
        slug: "mobile-app-testing",
        images: [
            "https://picsum.photos/1920/1080?random=143",
            "https://picsum.photos/1920/1080?random=144",
            "https://picsum.photos/1920/1080?random=145"
        ],
        description: "Automated testing ensures mobile app quality across diverse devices. A travel app used Detox for end-to-end testing in React Native, catching 95% of UI bugs before release. Unit tests with Jest and integration tests with Appium validated functionality, while CI/CD pipelines automated testing workflows. In Cameroon’s varied device landscape, robust testing ensures reliability.\n\nChallenges like test flakiness were addressed with deterministic mocks and stable emulators. This blog shares testing frameworks and metrics, offering a guide to quality assurance. What testing tools do you use for mobile apps? Share your experiences in the comments to inspire better practices!",
        blogcategory: "Mobile Development",
        tags: ["Testing", "React Native", "Flutter", "Quality Assurance", "CI/CD"],
        status: "publish",
        comments: []
    },
    // Network Design (5 blogs)
    {
        title: "Revolutionizing Connectivity with 5G in Emerging Markets",
        slug: "5g-emerging-markets",
        images: [
            "https://picsum.photos/1920/1080?random=146",
            "https://picsum.photos/1920/1080?random=147",
            "https://picsum.photos/1920/1080?random=148"
        ],
        description: "5G is transforming connectivity in emerging markets like Cameroon, enabling low-latency applications like telemedicine and smart agriculture. Using massive MIMO and mmWave, a 5G pilot achieved 1 Gbps speeds in urban centers, supporting thousands of IoT devices. Phased rollouts and sub-6 GHz bands addressed rural coverage, critical for bridging the digital divide.\n\nChallenges like infrastructure costs were mitigated with public-private partnerships, while spectrum optimization reduced interference by 20%. This blog shares deployment strategies and metrics, inspiring telecom engineers to innovate. How can 5G drive digital inclusion in your region? Share your ideas in the comments to spark solutions!",
        blogcategory: "Network Design",
        tags: ["5G", "Connectivity", "IoT", "Network Security", "Wireless"],
        status: "publish",
        comments: []
    },
    {
        title: "Securing Enterprise Networks with Zero-Trust Architecture",
        slug: "zero-trust-network-security",
        images: [
            "https://picsum.photos/1920/1080?random=149",
            "https://picsum.photos/1920/1080?random=150",
            "https://picsum.photos/1920/1080?random=151"
        ],
        description: "Zero-trust architecture redefines network security by assuming no trust, even within the network. A financial institution’s network, secured with Zscaler and MFA, reduced breach risks by 70%. Continuous authentication and micro-segmentation limited lateral movement, while real-time monitoring detected anomalies. In Cameroon’s growing digital economy, zero-trust ensures secure enterprise connectivity.\n\nChallenges like user friction were addressed with seamless SSO integration. This blog shares zero-trust principles and metrics, guiding engineers to robust security. How do you implement zero-trust in your networks? Join the discussion in the comments to share your expertise!",
        blogcategory: "Network Design",
        tags: ["Network Security", "Zero-Trust", "Firewalls", "Monitoring", "VPN"],
        status: "publish",
        comments: []
    },
    {
        title: "Optimizing VoIP with SDN for Seamless Communication",
        slug: "voip-sdn-optimization",
        images: [
            "https://picsum.photos/1920/1080?random=152",
            "https://picsum.photos/1920/1080?random=153",
            "https://picsum.photos/1920/1080?random=154"
        ],
        description: "Software-Defined Networking (SDN) enhances VoIP by dynamically managing traffic. An enterprise VoIP system used OpenFlow to prioritize voice packets, reducing jitter by 30% in low-bandwidth environments. Centralized SDN controllers simplified policy management, while QoS policies ensured clear calls. In Cameroon, where connectivity varies, SDN optimizes communication.\n\nChallenges like controller latency were mitigated with distributed architectures. This blog shares SDN configurations and metrics, offering a guide to VoIP optimization. How do you leverage SDN for real-time applications? Share your strategies in the comments to inspire innovation!",
        blogcategory: "Network Design",
        tags: ["SDN", "VoIP", "Network Automation", "QoS", "Connectivity"],
        status: "publish",
        comments: []
    },
    {
        title: "IoT Network Design: Scaling for Smart Cities",
        slug: "iot-network-smart-cities",
        images: [
            "https://picsum.photos/1920/1080?random=155",
            "https://picsum.photos/1920/1080?random=156",
            "https://picsum.photos/1920/1080?random=157"
        ],
        description: "IoT networks power smart cities, enabling applications like traffic management and energy monitoring. A smart grid prototype used LoRaWAN for low-power connectivity, supporting 10,000 devices with 95% uptime. MQTT ensured efficient data exchange, while edge computing reduced latency by 25%. In Cameroon, IoT drives urban innovation.\n\nChallenges like device security were addressed with TLS and device authentication. This blog shares IoT design strategies and metrics, guiding engineers to scalable networks. How do you design IoT networks for smart applications? Join the conversation in the comments to share your insights!",
        blogcategory: "Network Design",
        tags: ["IoT", "Network Design", "Connectivity", "Network Security", "Wireless"],
        status: "publish",
        comments: []
    },
    {
        title: "Automating Network Management with Ansible",
        slug: "network-automation-ansible",
        images: [
            "https://picsum.photos/1920/1080?random=158",
            "https://picsum.photos/1920/1080?random=159",
            "https://picsum.photos/1920/1080?random=160"
        ],
        description: "Ansible automates network management, reducing manual errors and improving efficiency. A campus network used Ansible playbooks to configure 50+ Cisco routers, cutting setup time by 60%. Real-time monitoring with Prometheus and Grafana provided insights into traffic patterns, enabling proactive maintenance. In Cameroon’s resource-constrained environments, automation saves costs.\n\nChallenges like playbook complexity were addressed with modular roles and YAML validation. This blog shares automation workflows and metrics, offering a guide to efficient network management. How do you automate network tasks? Share your experiences in the comments to drive innovation!",
        blogcategory: "Network Design",
        tags: ["Network Automation", "Ansible", "Cisco", "Monitoring", "Scalability"],
        status: "publish",
        comments: []
    },
    // Video Editing (5 blogs)
    {
        title: "Crafting Cinematic Stories with Premiere Pro",
        slug: "cinematic-stories-premiere",
        images: [
            "https://picsum.photos/1920/1080?random=161",
            "https://picsum.photos/1920/1080?random=162",
            "https://picsum.photos/1920/1080?random=163"
        ],
        description: "Adobe Premiere Pro empowers video editors to craft cinematic stories with precision. A short film project used dynamic linking with After Effects to create seamless VFX, reducing rendering time by 20%. Advanced color grading with Lumetri achieved a cinematic look, while audio syncing with Audition enhanced sound quality. In Cameroon’s growing film industry, Premiere Pro drives professional storytelling.\n\nChallenges like large file sizes were addressed with proxy workflows, enabling smooth editing on standard hardware. This blog shares editing techniques and metrics, guiding editors to cinematic excellence. How do you use Premiere Pro to tell compelling stories? Share your tips in the comments to inspire creativity!",
        blogcategory: "Video Editing",
        tags: ["Premiere Pro", "Cinematography", "Color Grading", "VFX", "Storyboarding"],
        status: "publish",
        comments: []
    },
    {
        title: "Mastering Motion Graphics with After Effects",
        slug: "motion-graphics-after-effects",
        images: [
            "https://picsum.photos/1920/1080?random=164",
            "https://picsum.photos/1920/1080?random=165",
            "https://picsum.photos/1920/1080?random=166"
        ],
        description: "After Effects transforms video content with stunning motion graphics. A promotional video used keyframe animations and particle effects to increase viewer engagement by 30%. Shape layers and expressions streamlined workflows, while plugins like Element 3D added depth. In Cameroon, where visual content drives marketing, After Effects delivers impact.\n\nChallenges like rendering delays were mitigated with optimized compositions and GPU acceleration. This blog shares motion graphics techniques and metrics, guiding editors to dynamic visuals. How do you create engaging motion graphics? Join the discussion in the comments to share your expertise!",
        blogcategory: "Video Editing",
        tags: ["After Effects", "Motion Graphics", "Animation", "VFX", "YouTube"],
        status: "publish",
        comments: []
    },
    {
        title: "Color Grading for Emotional Impact in DaVinci Resolve",
        slug: "color-grading-davinci-resolve",
        images: [
            "https://picsum.photos/1920/1080?random=167",
            "https://picsum.photos/1920/1080?random=168",
            "https://picsum.photos/1920/1080?random=169"
        ],
        description: "Color grading in DaVinci Resolve shapes the emotional tone of videos. A documentary project used HDR grading to enhance visual depth, increasing viewer retention by 25%. Nodes and curves allowed precise adjustments, while color wheels balanced tones for mood consistency. In Cameroon’s storytelling scene, Resolve elevates narrative impact.\n\nChallenges like color mismatches were addressed with LUTs and calibration tools. This blog shares grading workflows and metrics, guiding editors to emotional storytelling. How do you use color grading to enhance narratives? Share your strategies in the comments to inspire creativity!",
        blogcategory: "Video Editing",
        tags: ["DaVinci Resolve", "Color Grading", "Cinematography", "VFX", "Storyboarding"],
        status: "publish",
        comments: []
    },
    {
        title: "Sound Design: Elevating Videos with Audio Precision",
        slug: "sound-design-video-editing",
        images: [
            "https://picsum.photos/1920/1080?random=170",
            "https://picsum.photos/1920/1080?random=171",
            "https://picsum.photos/1920/1080?random=172"
        ],
        description: "Sound design is critical for immersive video experiences. A corporate video used Adobe Audition to clean audio and add spatial effects, improving viewer engagement by 20%. Equalization and compression balanced audio levels, while Foley effects added realism. In Cameroon’s video content market, sound design enhances storytelling.\n\nChallenges like background noise were mitigated with noise gates and spectral editing. This blog shares sound design techniques and metrics, guiding editors to immersive audio. How do you craft impactful soundscapes for videos? Join the conversation in the comments to share your expertise!",
        blogcategory: "Video Editing",
        tags: ["Sound Design", "Premiere Pro", "After Effects", "Audio", "YouTube"],
        status: "publish",
        comments: []
    },
    {
        title: "4K Video Editing: Optimizing Workflows for High Resolution",
        slug: "4k-video-editing-workflows",
        images: [
            "https://picsum.photos/1920/1080?random=173",
            "https://picsum.photos/1920/1080?random=174",
            "https://picsum.photos/1920/1080?random=175"
        ],
        description: "4K video editing delivers stunning visuals but demands optimized workflows. A travel vlog project in Final Cut Pro used proxy editing to handle 4K footage on standard hardware, reducing render times by 30%. Multicam editing streamlined syncing, while hardware acceleration with M1 chips boosted performance. In Cameroon’s content creation scene, 4K elevates viewer experiences.\n\nChallenges like storage demands were addressed with cloud archiving and optimized codecs. This blog shares 4K editing strategies and metrics, guiding editors to efficient workflows. How do you manage 4K video editing challenges? Share your insights in the comments to drive innovation!",
        blogcategory: "Video Editing",
        tags: ["4K Editing", "Final Cut", "Premiere Pro", "Compression", "Workflow"],
        status: "publish",
        comments: []
    }
];

// Helper function to generate random comments
function generateRandomComments(blog, blogId) {
    const names = [
        `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`,
        `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`,
          `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`,
           `${faker.person.firstName()} ${faker.person.lastName()}`, `${faker.person.firstName()} ${faker.person.lastName()}`,
    ];
    const companies = [
        "TechTrend Innovations", "CamTel Solutions", "AfriTech Enterprises", "NexGen Systems", "ConnectSphere Ltd",
        "DataWave Analytics", "SecureNet Solutions", "GlobalLink Telecom", "WebScale Technologies", "NetOptic Solutions"
    ];
    const mainCommentTemplates = {
        "Graphic Design": [
            {
                title: "Enhancing {tag} Workflows",
                content: "The {tag} insights in {title} are transformative. Using {tag2} in our recent app redesign cut iteration time by 25%. How do you streamline collaboration in {tag} projects, especially for remote teams in Cameroon?"
            },
            {
                title: "Accessibility in {tag} Design",
                content: "{title} nails the importance of {tag}. Implementing {tag2} with WCAG standards improved our app’s inclusivity. What tools do you use to ensure accessibility for diverse users in {category}?"
            },
            {
                title: "Prototyping with {tag}",
                content: "The {tag} focus in {title} is spot-on. Using {tag2} for rapid prototyping saved us 20% in design time. How do you handle stakeholder feedback in {category} prototyping workflows?"
            },
            {
                title: "Branding through {tag}",
                content: "{title} highlights {tag}’s role in branding. We used {tag2} to create a cohesive identity, boosting recognition by 15%. What {tag} strategies work best for culturally diverse markets like Cameroon?"
            },
            {
                title: "Typography in {tag}",
                content: "The {tag} discussion in {title} is inspiring. Optimizing {tag2} for readability improved our UI engagement. How do you balance aesthetics and functionality in {category} typography?"
            }
        ],
        "Website Development": [
            {
                title: "Optimizing {tag} Performance",
                content: "{title} offers a stellar guide to {tag}. Using {tag2} with lazy loading cut our app’s load time by 30%. Have you tried WebAssembly for performance gains in {category} projects?"
            },
            {
                title: "Securing {tag} Applications",
                content: "The {tag} security insights in {title} are critical. Implementing {tag2} with JWT reduced vulnerabilities by 40%. How do you secure APIs in {category} apps for high-traffic scenarios?"
            },
            {
                title: "SEO with {tag}",
                content: "{title} nails {tag} for SEO. Using {tag2} with Next.js boosted our rankings by 20%. How do you handle multilingual SEO in {category} for markets like Cameroon?"
            },
            {
                title: "Scaling {tag} Systems",
                content: "The {tag} scalability tips in {title} are game-changing. {tag2} caching reduced our API calls by 25%. What load balancing techniques work best in {category} apps?"
            },
            {
                title: "Accessibility in {tag}",
                content: "{title}’s focus on {tag} accessibility is vital. Using {tag2} with ARIA improved navigation by 30%. How do you ensure inclusivity in {category} development?"
            }
        ],
        "Mobile Development": [
            {
                title: "Real-Time {tag} Apps",
                content: "{title}’s {tag} insights are invaluable. Using {tag2} with WebSocket cut latency by 20% in our app. How do you handle real-time updates in {category} for low-bandwidth regions?"
            },
            {
                title: "Securing {tag} Apps",
                content: "The {tag} security focus in {title} is critical. Implementing {tag2} with biometrics enhanced user trust. What security practices do you use in {category} apps?"
            },
            {
                title: "Performance in {tag}",
                content: "{title} highlights {tag} optimization. Using {tag2} reduced memory usage by 25% on low-end devices. How do you optimize {category} apps for diverse hardware?"
            },
            {
                title: "Testing {tag} Apps",
                content: "The {tag} testing strategies in {title} are spot-on. {tag2} with Detox caught 90% of bugs pre-release. What testing frameworks do you use in {category}?"
            },
            {
                title: "Engaging Users with {tag}",
                content: "{title}’s {tag} insights boosted our app’s retention. Using {tag2} for notifications increased engagement by 20%. How do you balance notifications in {category} apps?"
            }
        ],
        "Network Design": [
            {
                title: "Scaling {tag} Networks",
                content: "{title} provides excellent {tag} strategies. Using {tag2} with SDN cut latency by 25%. How do you scale {category} networks in resource-constrained regions?"
            },
            {
                title: "Securing {tag} Networks",
                content: "The {tag} security focus in {title} is critical. {tag2} with zero-trust reduced risks by 30%. What security frameworks do you use in {category}?"
            },
            {
                title: "Optimizing {tag} for VoIP",
                content: "{title}’s {tag} insights for VoIP are transformative. Using {tag2} for QoS improved call quality by 20%. How do you optimize {category} for real-time apps?"
            },
            {
                title: "Automating {tag} Management",
                content: "The {tag} automation in {title} is inspiring. Using {tag2} with Ansible saved 50% in setup time. What automation tools do you use in {category}?"
            },
            {
                title: "IoT with {tag}",
                content: "{title} highlights {tag} for IoT. Using {tag2} with LoRaWAN supported 5,000 devices. How do you design {category} for smart applications?"
            }
        ],
        "Video Editing": [
            {
                title: "Cinematic {tag} Techniques",
                content: "{title}’s {tag} insights are brilliant. Using {tag2} in Premiere Pro enhanced our film’s visuals by 25%. How do you craft cinematic looks in {category}?"
            },
            {
                title: "Sound Design in {tag}",
                content: "The {tag} focus in {title} is spot-on. Using {tag2} for audio cleanup improved engagement by 20%. What sound design tools do you use in {category}?"
            },
            {
                title: "Color Grading with {tag}",
                content: "{title} nails {tag} for storytelling. Using {tag2} in Resolve boosted emotional impact. How do you use color grading in {category} projects?"
            },
            {
                title: "Motion Graphics in {tag}",
                content: "The {tag} techniques in {title} are inspiring. Using {tag2} in After Effects increased viewer retention. How do you create dynamic graphics in {category}?"
            },
            {
                title: "Optimizing {tag} Workflows",
                content: "{title}’s {tag} workflow tips are game-changing. Using {tag2} with proxies cut render times by 30%. How do you streamline {category} editing?"
            }
        ]
    };
    const replyCommentTemplates = {
        "Graphic Design": [
            "Great {tag} point in {title}! Combining {tag2} with plugins like Stark improved our accessibility testing. What {category} tools do you recommend for inclusivity?",
            "Your {tag} insights are spot-on. We used {tag2} for collaborative design, saving 20% in time. How do you manage {category} workflows remotely?",
            "Excellent {tag} suggestion! Integrating {tag2} with user testing enhanced our UI by 15%. What’s your approach to iterative design in {category}?"
        ],
        "Website Development": [
            "Your {tag} strategy in {title} is brilliant. Using {tag2} with Redis cut our response times. What caching tools do you use in {category} apps?",
            "Great {tag} point! We leveraged {tag2} for SEO, boosting rankings. How do you handle {category} optimization for multilingual sites?",
            "Spot-on with {tag}! Using {tag2} with CI/CD streamlined our {category} deployments. What automation tools do you recommend?"
        ],
        "Mobile Development": [
            "Excellent {tag} insight in {title}! Using {tag2} with Firebase improved our app’s performance. How do you handle {category} scalability?",
            "Your {tag} approach is inspiring. We used {tag2} for offline support in {category} apps. What strategies work for low-connectivity regions?",
            "Great {tag} point! Integrating {tag2} with testing frameworks caught 90% of bugs in our {category} app. What testing tools do you use?"
        ],
        "Network Design": [
            "Your {tag} strategy in {title} is spot-on. Using {tag2} with SDN enhanced our routing. What {category} tools do you use for dynamic networks?",
            "Great {tag} insight! We used {tag2} for security in {category}, reducing risks. How do you implement zero-trust in your networks?",
            "Spot-on with {tag}! Using {tag2} for QoS improved our {category} performance. What real-time optimization strategies do you use?"
        ],
        "Video Editing": [
            "Your {tag} point in {title} is brilliant. Using {tag2} for color grading enhanced our visuals. What {category} tools do you use for storytelling?",
            "Great {tag} insight! We used {tag2} for audio syncing in {category}, improving engagement. How do you handle sound design challenges?",
            "Spot-on with {tag}! Using {tag2} for motion graphics boosted our {category} video impact. What animation techniques do you recommend?"
        ]
    };

    const comments = [];
    const category = blog.blogcategory;
    const availableMainTemplates = mainCommentTemplates[category] || [];
    const availableReplyTemplates = replyCommentTemplates[category] || [];

    // Generate 6 main comments
    for (let i = 0; i < 6; i++) {
        const name = faker.person.firstName() + ' ' + faker.person.lastName();
        const company = companies[Math.floor(Math.random() * companies.length)];
        const template = availableMainTemplates[Math.floor(Math.random() * availableMainTemplates.length)];
        const tag1 = blog.tags[Math.floor(Math.random() * blog.tags.length)];
        const tag2 = blog.tags[Math.floor(Math.random() * blog.tags.length)] || tag1;
        const randomNum = Math.floor(Math.random() * 100) + 1;
        const gender = randomNum % 2 === 0 ? 'female' : 'male';
        const imageNumber = Math.floor(Math.random() * 100);

        const mainComment = {
            name,
            image: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${imageNumber}.jpg`,
            email: faker.internet.email({ firstName: name.split(" ")[0], lastName: name.split(" ")[1] }),
            title: template.title.replace("{tag}", tag1),
            contentPera: template.content
                .replace("{title}", blog.title)
                .replace("{tag}", tag1)
                .replace("{tag2}", tag2)
                .replace("{category}", category),
            mainComment: true,
            createdAt: new Date(),
            blog: blogId,
            parent: null,
            children: [],
            parentName: "",
            parentImage: ""
        };

        // Generate 3 reply comments for each main comment
        const replyComments = [];
        for (let j = 0; j < 3; j++) {
            const replyName = faker.person.firstName() + ' ' + faker.person.lastName();
            const replyCompany = companies[Math.floor(Math.random() * companies.length)];
            const replyTemplate = availableReplyTemplates[Math.floor(Math.random() * availableReplyTemplates.length)];
            const replyTag1 = blog.tags[Math.floor(Math.random() * blog.tags.length)];
            const replyTag2 = blog.tags[Math.floor(Math.random() * blog.tags.length)] || replyTag1;
            const replyRandomNum = Math.floor(Math.random() * 100) + 1;
            const replyGender = replyRandomNum % 2 === 0 ? 'female' : 'male';
            const replyImageNumber = Math.floor(Math.random() * 100);

            const replyComment = {
                name: replyName,
                image: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${replyGender}/512/${replyImageNumber}.jpg` || `${faker.image.avatar()}`,
                email: faker.internet.email({firstName: replyName.split(" ")[0], lastName: replyName.split(" ")[1] }),
                title: `${mainComment.title}`,
                contentPera: replyTemplate
                    .replace("{title}", blog.title)
                    .replace("{tag}", replyTag1)
                    .replace("{tag2}", replyTag2)
                    .replace("{category}", category),
                mainComment: false,
                createdAt: new Date(),
                blog: blogId,
                parent: null,
                children: [],
                parentName: mainComment.name,
                parentImage: mainComment.image
            };
            replyComments.push(replyComment);
        }

        comments.push({ mainComment, replyComments });
    }

    return comments;
}

export { defaultBlogs, defaultProjects, generateRandomReviews, generateRandomComments };