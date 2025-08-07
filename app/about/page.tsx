import { Briefcase, Users, Shield, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Ivrex</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            At Ivrex, our mission is to democratize access to professional trading tools and strategies. We believe that
            with the right tools, education, and support, anyone can become a successful trader.
          </p>
          <p className="text-lg text-muted-foreground">
            We combine cutting-edge AI technology with expert human oversight to provide our clients with high-accuracy
            trading signals, comprehensive education, and secure investment opportunities.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Established 2018</h3>
                <p className="text-muted-foreground">
                  Founded by a team of traders and technologists with a vision to transform the trading industry.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Global Community</h3>
                <p className="text-muted-foreground">
                  Serving traders in over 50 countries with localized support and services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Regulatory Compliance</h3>
                <p className="text-muted-foreground">
                  Operating with transparency and adherence to financial regulations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Cletus Lieta",
                role: "CEO & Founder",
                bio: "Economist and the first Mosotho to manage and operate a globally recognized forex brokerage, bringing strategic vision and operational excellence to global finance.",
                image: "/cletus.jpg?height=300&width=300",
                profileLink: "/team/cletus-lieta",
              },
              {
                name: "Gibson Mabusa",
                role: "Financial Architect & Co-Founder",
                bio: "Financial Architect and Co-Founder with strong academic foundation in Mathematics and Statistics, specializing in creating governed trade structures and scalable financial infrastructure.",
                image: "/gib.jpg?height=300&width=300",
                profileLink: "/team/gibson-mabusa",
              },
              {
                name: "Hlalefang Brilliant",
                role: "Head of IT and Solutions",
                bio: "Technology innovator specializing in trading platforms and digital solutions.",
                image: "/brill3.jpg?height=300&width=300",
                profileLink: "/team/hlalefang-brilliant",
              },
              {
                name: "Mosotho Mohau",
                role: "Chief Technology Architect",
                bio: "Chief Technology Architect who played a major role in building the Ivrex platform, working with our team to create innovative trading solutions.",
                image: "/hause.jpg?height=300&width=300",
                profileLink: "/team/mosotho-mohau",
              },
              
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="rounded-full w-32 h-32 object-cover mb-4"
                />
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground mb-4">{member.bio}</p>
                <Link href={member.profileLink}>
                  <Button variant="outline" size="sm" className="text-primary hover:bg-primary hover:text-primary-foreground">
                    See more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-lg text-muted-foreground mb-4">
            We are committed to providing our clients with the highest level of service, security, and support. Our
            platform is built on the principles of transparency, integrity, and continuous innovation.
          </p>
          <p className="text-lg text-muted-foreground">
            As we grow, we remain dedicated to our core mission: empowering traders worldwide with professional-grade
            tools and knowledge previously available only to institutional investors.
          </p>
        </div>
      </div>
    </div>
  )
}
