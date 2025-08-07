import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weeklySchedule = [
  { day: "Monday", topic: "Beginners" },
  { day: "Tuesday", topic: "Beginners" },
  { day: "Wednesday", topic: "Intermediate" },
  { day: "Thursday", topic: "Advanced Trading" },
];

export default function WeeklySchedule() {
  return (
    <div className="mt-16">
        <div className="text-center mb-8">
            <h3 className="text-3xl font-bold">Weekly Activities</h3>
            <p className="text-muted-foreground">Our schedule for live sessions and training.</p>
        </div>
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                {weeklySchedule.map((item) => (
                    <div key={item.day} className="flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-muted/50">
                        <span className="font-semibold text-lg">{item.day}</span>
                        <span className="text-primary font-medium">{item.topic}</span>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
