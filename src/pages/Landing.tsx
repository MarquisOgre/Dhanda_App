import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Package, 
  BarChart3, 
  Truck, 
  CreditCard, 
  ShoppingCart, 
  Shield, 
  Check, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Menu,
  X,
  ChevronDown,
  Play,
  Download,
  Users,
  Smartphone,
  Monitor
} from "lucide-react";
import { toast } from "sonner";

const features = [
  {
    icon: FileText,
    title: "GST Billing",
    description: "Create professional GST-compliant invoices with automatic tax calculations"
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track stock levels, get low stock alerts, and manage multiple warehouses"
  },
  {
    icon: BarChart3,
    title: "Business Reports",
    description: "Comprehensive reports for sales, purchases, profit & loss, and more"
  },
  {
    icon: Truck,
    title: "E-Way Bill",
    description: "Generate and manage e-way bills directly from your invoices"
  },
  {
    icon: CreditCard,
    title: "Payment Collection",
    description: "Track payments, manage receivables, and send payment reminders"
  },
  {
    icon: ShoppingCart,
    title: "Purchase & Expenses",
    description: "Record purchase bills, track expenses, and manage vendor payments"
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your data is encrypted and backed up automatically in the cloud"
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description: "Add team members with role-based access control"
  }
];

// Fallback pricing plans (used if DB fetch fails)
const fallbackPricingPlans = [
  {
    name: "Free Trial",
    price: "₹0",
    period: "/15 days",
    description: "30 days free trial with all features",
    features: [
      "All features included",
      "Up to 2 users",
      "Email support"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Silver",
    price: "₹1,500",
    period: "/month",
    description: "1 Month - 30 Days access",
    features: [
      "Unlimited invoices",
      "Full inventory management",
      "Up to 2 users",
      "Priority support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Gold",
    price: "₹4,000",
    period: "/quarter",
    description: "3 Months - 90 Days access",
    features: [
      "Everything in Silver",
      "Up to 5 users",
      "Advanced reports",
      "E-Way bill integration"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Platinum",
    price: "₹15,000",
    period: "/year",
    description: "1 Year - 365 Days access",
    features: [
      "Everything in Gold",
      "Unlimited users",
      "API access",
      "Dedicated support",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

interface LicensePlan {
  id: string;
  plan_name: string;
  duration_days: number;
  price: number;
  description: string | null;
  is_active: boolean;
  sort_order: number | null;
}

const testimonials = [
  {
    name: "Rajesh Kumar",
    business: "Kumar Electronics",
    location: "Mumbai",
    content: "DhandhaApp has transformed how we manage our business. GST billing is now a breeze!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    business: "Sharma Textiles",
    location: "Delhi",
    content: "The inventory management feature saved us from stockouts. Highly recommended!",
    rating: 5
  },
  {
    name: "Mohammed Ali",
    business: "Ali Trading Co.",
    location: "Hyderabad",
    content: "Best billing software for small businesses. Simple to use and very affordable.",
    rating: 5
  }
];

const faqs = [
  {
    question: "Is DhandhaApp GST compliant?",
    answer: "Yes, DhandhaApp is fully GST compliant. It automatically calculates CGST, SGST, and IGST based on the transaction type and generates GST-ready invoices."
  },
  {
    question: "Can I use DhandhaApp on mobile?",
    answer: "Absolutely! DhandhaApp works seamlessly on Android, iOS, and Windows devices. You can access your business data from anywhere."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use bank-grade encryption to protect your data. All data is backed up automatically to secure cloud servers."
  },
  {
    question: "Can I import my existing data?",
    answer: "Yes, you can easily import your items, parties, and opening balances using our Excel import feature."
  },
  {
    question: "Do you offer customer support?",
    answer: "We provide support via email, phone, and WhatsApp. Premium plans get priority support with faster response times."
  }
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingPlans, setPricingPlans] = useState(fallbackPricingPlans);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Fetch pricing plans from database
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('license_plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) return;

        const formattedPlans = data.map((plan: LicensePlan, index: number) => {
          const period = plan.duration_days <= 15 ? `/${plan.duration_days} days` :
                        plan.duration_days <= 30 ? '/month' :
                        plan.duration_days <= 90 ? '/quarter' : '/year';
          
          return {
            name: plan.plan_name,
            price: `₹${plan.price.toLocaleString('en-IN')}`,
            period: period,
            description: plan.description || '',
            features: getDefaultFeatures(plan.plan_name),
            cta: plan.price === 0 ? 'Start Free' : index === data.length - 1 ? 'Contact Sales' : 'Get Started',
            popular: index === 2 // Third plan is popular
          };
        });

        setPricingPlans(formattedPlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const getDefaultFeatures = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free trial':
        return ['All features included', 'Up to 2 users', 'Email support'];
      case 'silver':
        return ['Unlimited invoices', 'Full inventory management', 'Up to 2 users', 'Priority support'];
      case 'gold':
        return ['Everything in Silver', 'Up to 5 users', 'Advanced reports', 'E-Way bill integration'];
      case 'platinum':
        return ['Everything in Gold', 'Unlimited users', 'API access', 'Dedicated support', 'Custom integrations'];
      default:
        return ['All features included'];
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for contacting us! We'll get back to you soon.");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary to-orange-400 text-primary-foreground text-center py-2 text-sm">
        🎉 Special Offer: Use code <strong>DHANDHA50</strong> for 50% off on yearly plans!
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/dark_logo.png" alt="DhandhaApp" className="h-16 mx-auto" />
              {/* <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">DhandhaApp</span> */}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Start Free Trial</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="outline" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">GST Billing Software</span>
                <br />
                for <span className="text-accent">Small Businesses</span> in India
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Create professional invoices, manage inventory, track payments, and grow your business with India's most trusted billing app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90" asChild>
                  <Link to="/signup">
                    <Download className="w-5 h-5 mr-2" />
                    Download DhandhaApp Now!
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">1 Crore+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">4.7</p>
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">App Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Multi</p>
                  <p className="text-sm text-muted-foreground">User Support</p>
                </div>
              </div>
            </div>

            {/* Hero Video/Dashboard Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 via-orange-100/50 to-accent/20 rounded-2xl p-6 shadow-2xl">
                <div className="relative rounded-xl overflow-hidden bg-white shadow-lg">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full rounded-xl"
                    poster="/dark_logo.png"
                  >
                    <source src="https://dhandha-website.vercel.app/demo-video.mp4" type="video/mp4" />
                    {/* Fallback to image if video doesn't load */}
                    <img 
                      src="/dark_logo.png" 
                      alt="DhandhaApp Dashboard" 
                      className="w-full rounded-xl"
                    />
                  </video>
                  {/* Play button overlay for mobile */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/30 to-orange-400/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-accent/30 to-green-400/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Grow Your Business</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From billing to inventory to reports - DhandhaApp has all the tools you need to run your business efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">1 Crore+ Businesses</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about DhandhaApp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.business}, {testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Transparent Pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include core billing features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link to="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get In <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions? We're here to help. Reach out to us and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">+91 8500 60 6000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">support@dhandhaapp.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-muted-foreground">Hyderabad, India</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-400 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join 1 Crore+ businesses already using DhandhaApp. Download now and start your free trial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg">
              <Smartphone className="w-5 h-5 mr-2" />
              Android App
            </Button>
            <Button size="lg" variant="secondary" className="text-lg">
              <Smartphone className="w-5 h-5 mr-2" />
              iOS App
            </Button>
            <Button size="lg" variant="secondary" className="text-lg">
              <Monitor className="w-5 h-5 mr-2" />
              Windows App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar-background text-sidebar-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/app-icon.png" alt="DhandhaApp" className="h-16 max-auto" />
                {/* <span className="text-lg font-bold">DhandhaApp</span> */}
              </div>
              <p className="text-sidebar-foreground/70 text-sm">
                India's #1 GST Billing Software for Small Businesses
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#features" className="hover:text-sidebar-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-sidebar-foreground">Pricing</a></li>
                <li><Link to="/auth" className="hover:text-sidebar-foreground">Login</Link></li>
                <li><Link to="/signup" className="hover:text-sidebar-foreground">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#faq" className="hover:text-sidebar-foreground">FAQ</a></li>
                <li><a href="#contact" className="hover:text-sidebar-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sidebar-border pt-8 text-center text-sm text-sidebar-foreground/70">
            <p>© {new Date().getFullYear()} DhandhaApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
