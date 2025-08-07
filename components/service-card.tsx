import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ServiceCardProps {
  title: string;
  description: string;
  details: string[];
  pricing: string;
}

export default function ServiceCard({ title, description, details, pricing }: ServiceCardProps) {
  const router = useRouter()

  const handleLearnMore = () => {
    router.push("/support")
  }

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">What&apos;s Included:</h4>
          <ul className="space-y-2 text-sm">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-0">
        <div className="w-full pb-4">
          <div className="text-sm font-medium">Pricing:</div>
          <div className="text-primary font-bold">{pricing}</div>
        </div>
        <Button onClick={handleLearnMore} className="w-full">Learn More</Button>
      </CardFooter>
    </Card>
  )
} 