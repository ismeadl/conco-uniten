import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Video, 
  Clock, 
  Check, 
  Star,
  CreditCard,
  Timer,
  Gift,
  MessageCircle
} from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

useEffect(() => {
  const targetDate = new Date("2025-10-31T00:00:00+08:00"); // Malaysia time

  const timer = setInterval(() => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountdown({ days, hours, minutes, seconds });
  }, 1000);

  return () => clearInterval(timer);
}, []);
  const [slotsLeft, setSlotsLeft] = useState(200);
  const [selectedPackage, setSelectedPackage] = useState('combo');
  const [totalPrice, setTotalPrice] = useState(30);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: 'combo'
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Time-based slot countdown (auto-calculate every 1 min)
useEffect(() => {
  const calculateSlotsLeft = () => {
    const targetTime = new Date("2025-10-31T23:59:59+08:00").getTime();
    const startTime = new Date("2025-10-15T00:00:00+08:00").getTime(); // <-- adjust this to your actual start date
    const now = new Date().getTime();

    // 🚩 Add this guard so it doesn't drop before 2 Oct
    if (now < startTime) {
      setSlotsLeft(200); // initial slots
      return;
    }

    const totalDuration = targetTime - startTime;
    const elapsed = now - startTime;

    const totalSlots = 200;
    const slotsLeft = Math.max(
      Math.ceil(totalSlots * (1 - elapsed / totalDuration)),
      0
    );

    setSlotsLeft(slotsLeft);
  };

  calculateSlotsLeft();
  const timer = setInterval(calculateSlotsLeft, 60000); // every 1 minute
  return () => clearInterval(timer);
}, []);

  const packages = [
    {
      id: 'video',
      name: '360 Video only',
      description: '1x HD rotating video + instant download',
      price: 20,
      video: '/360.mp4' 
    },
    {
      id: 'polaroid',
      name: 'Photobooth only',
      description: '2x printed Polaroid (2R)',
      price: 20,
      image: 'https://i.ibb.co/xSx15wB0/SAMPLE-1.png' 
    },
    {
      id: 'combo',
      name: 'Combo Deal 🔥',
      description: '1x 360 video + 1x Photobooth (2 prints) + softcopies',
      price: 30,
      video: '/combo.mp4' ,
      popular: true
    },

  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    const selectedPkg = packages.find(p => p.id === packageId);
    setTotalPrice(selectedPkg?.price || 0);
    setFormData(prev => ({ ...prev, package: packageId }));
  };

  const handleBooking = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🎉 Booking Confirmed!",
      description: "Check your email for the QR code receipt. Show this at the booth for priority access!",
    });
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Hero + Packages */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center space-y-2 mb-6">
  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
     Majlis Pemasyhuran dan Konvokesyen Kali Ke-27 UNITEN
  </h1>
  <p className="text-lg text-muted-foreground font-medium">
    📍 Dewan Seri Sarjana, Kampus Putrajaya (1–2 November 2025)
  </p>
  <p className="text-sm text-destructive font-semibold">
    🎟️ Limited slots – only early bookers gets guaranteed spot!
  </p>
            
            {/* Inline Countdown */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm flex flex-wrap justify-center items-center gap-x-8 gap-y-2 mb-10 px-4 text-sm md:text-base">
  <div className="flex items-center gap-2">
    <Timer className="h-4 w-4 text-red-600 animate-pulse" />
    <span className="text-red-600 font-semibold">Pre-booking closes in:</span>
  </div>
  <div className="flex gap-2 text-xl font-bold text-black">
    <span>{countdown.days}d</span>
    <span>{countdown.hours}h</span>
    <span>{countdown.minutes}m</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="text-red-600 font-bold">{slotsLeft}</span>
    <span className="text-sm text-muted-foreground">slots left</span>
  </div>
</div>

          </div>

          {/* Packages Grid - Tesla Style */}
          <div className="grid gap-8 mb-16">
  {/* Top row: Video + Polaroid */}
  <div className="grid grid-cols-1">
    {packages
      .filter(pkg => pkg.id !== 'combo')
      .map((pkg) => (
        <div
          key={pkg.id}
          className={`relative bg-card border cursor-pointer transition-all duration-200 hover:shadow-subtle ${
  selectedPackage === pkg.id ? 'border-red-500' : 'border-border'
}`}
          onClick={() => handlePackageSelect(pkg.id)}
        >
          <div className="aspect-square border-b">
  {pkg.video ? (
    <video
      src={pkg.video}
      controls
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-contain p-2"
    />
  ) : (
    <img
      src={pkg.image}
      alt={pkg.name}
      className="w-full h-full object-contain p-2"
    />
  )}
</div>

          <div className="p-6">
            <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {pkg.description}
              {pkg.id === 'polaroid' && (
                <span className="block text-xs text-muted-foreground mt-2 italic">
                  Add-on print available at RM10 on request.
                </span>
              )}
            </p>
            <div className="text-2xl font-bold">RM{pkg.price}</div>
          </div>
        </div>
      ))}
  </div>

  {/* Bottom row: Combo */}
  <div className="grid grid-cols-1">
    {packages
      .filter(pkg => pkg.id === 'combo')
      .map((pkg) => (
        <div
  key={pkg.id}
  className={`relative bg-card border w-full cursor-pointer transition-all duration-200 hover:shadow-xl ${
    selectedPackage === pkg.id
      ? 'border-4 border-red-500 shadow-lg scale-[1.02]'
      : 'border-border'
  }`}
  onClick={() => handlePackageSelect(pkg.id)}
>
          {/* Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-red-600 text-white animate-pulse">🔥 Best Value</Badge>
          </div>

          {/* Icon */}
          <div className="aspect-square border-b">
  {pkg.video ? (
    <video
      src={pkg.video}
      controls
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-contain p-2"
    />
  ) : (
    <img
      src={pkg.image}
      alt={pkg.name}
      className="w-full h-full object-contain p-2"
    />
  )}
</div>

          {/* Content */}
          <div className="p-6 text-center">
            <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
            <div className="text-3xl font-bold text-primary">RM{pkg.price}</div>
          </div>
        </div>
      ))}
  </div>
</div>

          {/* Benefits - Force Single Row on All Screens */}
<div className="flex justify-center flex-wrap gap-6 mb-12 text-center text-sm">
  <div className="flex-1 min-w-[100px] max-w-[140px]">
    <Clock className="h-6 w-6 mx-auto mb-2 text-red-600" />
    <h3 className="font-semibold">VIP Queue</h3>
    <p className="text-xs text-muted-foreground">Priority access</p>
  </div>
  <div className="flex-1 min-w-[100px] max-w-[140px]">
    <Check className="h-6 w-6 mx-auto mb-2 text-red-600" />
    <h3 className="font-semibold">Guaranteed</h3>
    <p className="text-xs text-muted-foreground">Secure your session</p>
  </div>
  <div className="flex-1 min-w-[100px] max-w-[140px]">
    <Gift className="h-6 w-6 mx-auto mb-2 text-red-600" />
    <h3 className="font-semibold">Best Price</h3>
    <p className="text-xs text-muted-foreground">Save with combo deal</p>
  </div>
</div>


        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[400px]">
  <DialogHeader>
    <DialogTitle>Choose Your Package</DialogTitle>
    <DialogDescription>
      Select a package to proceed to payment.
    </DialogDescription>
  </DialogHeader>

  <div className="grid gap-4 py-4">
    <Button
      className="w-full bg-white text-black border hover:bg-muted"
      variant="outline"
      onClick={() => {
        window.open("https://catalog.billplz.com/vision360/pf/single-convo-2025", "_blank");
      }}
    >
      Single Package (RM20)
    </Button>

    <Button
      className="w-full bg-primary text-white hover:bg-primary/90"
      onClick={() => {
        window.open("https://catalog.billplz.com/vision360/pf/combo-convo-2025", "_blank");
      }}
    >
      Combo Deal 🔥 (RM30) 
    </Button>
  </div>
</DialogContent>
      </Dialog>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="refund">
              <AccordionTrigger>Can I redeem my booking anytime?</AccordionTrigger>
              <AccordionContent>
                Yes, feel free to drop by anytime during convocation. Just note that missed slots aren’t refundable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="event-day">
              <AccordionTrigger>Can I buy on event day?</AccordionTrigger>
              <AccordionContent>
                Yes, but only if slots are still available. Pre-booking guarantees your spot.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="walkin-price">
  <AccordionTrigger>Can I get the bundle deal if I buy on event day?</AccordionTrigger>
  <AccordionContent>
    No, combo deal is only available for pre-booking. You can still purchase single packages (360 video or photobooth) for RM20.
  </AccordionContent>
</AccordionItem>
            <AccordionItem value="friends">
              <AccordionTrigger>Can I bring friends?</AccordionTrigger>
              <AccordionContent>
                Absolutely! Group photos are welcome.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="redeem">
              <AccordionTrigger>Can I contact you to clarify anything?</AccordionTrigger>
              <AccordionContent>
                Of course! Just WhatsApp us at 011-2389 4356 and we’ll be happy to help.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Contact us via WhatsApp for any questions
          </p>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
<div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
  <div className="flex items-center justify-between max-w-4xl mx-auto gap-3">
    <div className="text-sm">
      <span className="font-bold text-primary">{slotsLeft}</span> slots left
    </div>
    <div className="flex items-center gap-2">
      <Button 
        onClick={() => window.open('https://wa.link/y199a1')}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="icon"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      <Button 
        onClick={() => setIsBookingOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Book Now
      </Button>
    </div>
  </div>
</div>
    </div>
  );
};

export default Index;