"use client"

import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, LinkedinIcon, TwitterIcon, Facebook, MessageCircle } from "lucide-react"
import Link from "next/link"

interface TeamMemberData {
  slug: string;
  name: string;
  role: string;
  bio: string;
  fullBio: string;
  image: string;
  email: string;
  experience: string[];
  achievements: string[];
  specialties: string[];
  education: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

const teamMembers: TeamMemberData[] = [
  {
    slug: "cletus-lieta",
    name: "Cletus Lieta",
    role: "CEO & Founder",
    bio: "Economist and the first Mosotho to manage and operate a globally recognized forex brokerage, bringing strategic vision and operational excellence to global finance.",
    fullBio: "Cletus Lieta is an economist and the first Mosotho to manage and operate a globally recognized forex brokerage — a milestone that reflects both strategic vision and operational excellence in one of the most competitive sectors of global finance. With a strong foundation in macroeconomic analysis and market structure, he brings a data-driven, disciplined approach to the world of forex trading. As a professional trader and CEO across multiple companies, his focus lies in creating sustainable financial ecosystems that blend innovation, risk management, and long-term value. His work bridges institutional-grade strategy with emerging market insights, positioning him uniquely at the intersection of frontier markets and global capital flows.",
    image: "/cletus.jpg",
    email: "cletus.ivrex@gmail.com",
    experience: [
      "Economist with strong foundation in macroeconomic analysis",
      "First Mosotho to manage a globally recognized forex brokerage",
      "Professional trader and CEO across multiple companies",
      "Expert in institutional-grade strategy and emerging markets",
      "Pioneer in frontier markets and global capital flows",
      "Founded Ivrex with focus on sustainable financial ecosystems"
    ],
    achievements: [
      "First Mosotho to manage and operate a globally recognized forex brokerage",
      "Author of 'Traders Eclipse' and 'One Good Trade'",
      "Built sustainable financial ecosystems blending innovation and risk management",
      "Bridged institutional-grade strategy with emerging market insights",
      "Created platform connecting global financial community",
      "Recognized leader in forex trading and brokerage operations"
    ],
    specialties: [
      "Macroeconomic Analysis",
      "Forex Brokerage Management",
      "Market Structure Analysis",
      "Risk Management",
      "Emerging Markets Strategy",
      "Financial Ecosystem Development",
      "Institutional Trading",
      "Capital Flows Analysis"
    ],
    education: [
      "Studied Economics",
      "Advanced Macroeconomic Analysis",
      "Financial Markets Specialist",
      "Forex Brokerage Operations"
    ],
    socialLinks: {
      facebook: "https://www.facebook.com/cletuslinvizaz.lieta.7",
      whatsapp: "https://wa.me/+26653031435"
    }
  },
  {
    slug: "gibson-mabusa",
    name: "Gibson Mabusa",
    role: "Financial Architect & Co-Founder",
    bio: "Financial Architect and Co-Founder with strong academic foundation in Mathematics and Statistics, specializing in creating governed trade structures and scalable financial infrastructure.",
    fullBio: "Gibson Mabusa is a Financial Architect and Co-Founder of IVREX, with a strong academic foundation in Mathematics and Statistics—disciplines that govern the structure and behavior of financial markets. His background enables him to interpret volatility as governance, price as probability alignment, and trades as structured votes that shape the future value of markets. At IVREX, he focuses on designing systems that govern the trade itself—not the personality of the trader. His work ensures that what IVREX delivers to the market is not just service, but scalable infrastructure that aligns decision-making, risk management, and value flow. As Co-Founder, his role is structural, not supportive—sitting at the core of execution integrity and ensuring that every partnership and collaboration works with complete accountability.",
    image: "/gib.jpg",
    email: "gibson.ivrex@gmail.com",
    experience: [
      "Financial Architect and Co-Founder of IVREX",
      "Strong academic foundation in Mathematics and Statistics",
      "Expert in interpreting market structure and behavior",
      "Designer of governed trade systems and infrastructure",
      "Developer of mentorship curriculum and signal intelligence systems",
      "Creator of copy trading framework and psychological onboarding tools"
    ],
    achievements: [
      "Co-Founded IVREX with focus on structural trading governance",
      "Authored 'The Perfect AIM' philosophy",
      "Created the F.O.R.E.X. Language Model",
      "Developed mentorship curriculum and signal intelligence systems",
      "Built copy trading framework and psychological onboarding tools",
      "Transformed trading into governed economic function",
      "Created scalable infrastructure for decision-making and risk management"
    ],
    specialties: [
      "Financial Architecture",
      "Mathematics and Statistics",
      "Market Structure Analysis", 
      "Systems Governance",
      "Risk Management Infrastructure",
      "Signal Intelligence Systems",
      "Trading Psychology",
      "Economic Function Design",
      "Execution Integrity"
    ],
    education: [
      "Strong academic foundation in Mathematics",
      "Advanced Statistics and Market Structure",
      "Financial Markets Governance",
      "Economic System Architecture"
    ],
    socialLinks: {
      facebook: "https://www.facebook.com/profile.php?id=100092334437146",
      whatsapp: "https://wa.me/+26659457496"
    }
  },
  {
    slug: "hlalefang-brilliant",
    name: "Hlalefang Brilliant",
    role: "Head of IT and Solutions",
    bio: "Technology innovator specializing in trading platforms and digital solutions.",
    fullBio: "Hlalefang Brilliant oversees all technology infrastructure and digital solutions at Ivrex. As CEO of Brilliant Technologies and with a strong passion for financial markets and entrepreneurship, Hlalefang brings innovative solutions to our trading platform while ensuring cutting-edge technology implementation.",
    image: "/brill3.jpg",
    email: "brilliantramotsokoane2001@gmail.com",
    experience: [
      "3+ years in financial markets",
      "1 year experience in web development",
      "CEO of Brilliant Technologies",
      "Strong passion for financial markets",
      "Entrepreneurship experience"
    ],
    achievements: [
      "Built Ivrex's scalable trading platform from ground up",
      "Degree in BSc Computer Science",
      "CEO of Brilliant Technologies",
      "Innovative technology solutions for financial platforms",
      "Strong leadership in IT development"
    ],
    specialties: [
      "Full-Stack Development",
      "Financial Markets Technology",
      "Entrepreneurship",
      "Mobile Development",
      "Trading Platform Development"
    ],
    education: [
      "BSc in Computer Science - National University of Lesotho"
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/hlalefang-brilliant",
      facebook: "https://www.facebook.com/me/",
            whatsapp: "https://wa.me/+26668500386"
    }
  },
  {
    slug: "mosotho-mohau",
    name: "Mosotho Mohau",
    role: "Chief Technology Architect",
    bio: "Chief Technology Architect who played a major role in building the Ivrex platform, working with our team to create innovative trading solutions.",
    fullBio: "Mosotho Mohau serves as Chief Technology Architect at Ivrex, bringing valuable expertise in web development and platform design. Mosotho has been instrumental in building and maintaining the Ivrex platform. His technical contributions and collaborative approach have significantly contributed to the development of our trading infrastructure and user experience. LinkedIn: linkedin.com/in/mohau-mosotho-951a2a24b",
    image: "/hause.jpg",
    email: "mosotho.ivrex@gmail.com",
    experience: [
      "Chief Technology Architect and platform design",
      "Major contributor to Ivrex platform development",
      "Platform architecture and maintenance",
      "User experience optimization",
      "Technical infrastructure development",
      "Collaborative team development"
    ],
    achievements: [
      "Key contributor to Ivrex platform development",
      "Successful web development projects",
      "Platform optimization and enhancement",
      "Technical problem-solving expertise",
      "Collaborative team development"
    ],
    specialties: [
      "Web Development",
      "Platform Architecture",
      "Frontend & Backend Development",
      "User Experience",
      "Technical Problem-solving",
      "Team Collaboration"
    ],
    education: [
      "BSc in Computer Science - National University of Lesotho"
    ],
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/mohau-mosotho-951a2a24b",
      whatsapp: "https://wa.me/+26662230241"
    }
  }
];

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const resolvedParams = await params;
  const member = teamMembers.find(m => m.slug === resolvedParams.slug);

  if (!member) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/about">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to About
          </Button>
        </Link>

        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/3">
            <img
              src={member.image || "/placeholder.svg"}
              alt={member.name}
              className="rounded-lg w-full max-w-sm object-cover shadow-lg"
            />
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
            <h2 className="text-2xl text-primary font-semibold mb-4">{member.role}</h2>
            <p className="text-lg text-muted-foreground mb-6">{member.fullBio}</p>
            
            {/* Contact and social links */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                {member.email}
              </Button>
              {member.socialLinks.linkedin && (
                <Link href={member.socialLinks.linkedin} target="_blank">
                  <Button variant="outline" size="sm">
                    <LinkedinIcon className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                </Link>
              )}
              {member.socialLinks.twitter && (
                <Link href={member.socialLinks.twitter} target="_blank">
                  <Button variant="outline" size="sm">
                    <TwitterIcon className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                </Link>
              )}
              {member.socialLinks.facebook && (
                <Link href={member.socialLinks.facebook} target="_blank">
                  <Button variant="outline" size="sm">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </Link>
              )}
              {member.socialLinks.whatsapp && (
                <Link href={member.socialLinks.whatsapp} target="_blank">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {member.experience.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Key Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {member.achievements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {member.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {member.education.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Interested in working with {member.name}?</h3>
              <p className="text-muted-foreground mb-4">
                Get in touch to learn more about our services and how our expert team can help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/support">
                  <Button>Contact Our Team</Button>
                </Link>
                <Link href="/#our-services">
                  <Button variant="outline">View Our Services</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 