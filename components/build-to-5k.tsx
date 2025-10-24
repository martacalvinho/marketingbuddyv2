'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy, Calendar, TrendingUp, Target } from 'lucide-react';

type Task = {
  day: number;
  tasks: string[];
};

type WeekPlan = {
  weekNumber: number;
  focus: string;
  days: Task[];
  weeklyChallenge: string;
};

type BuildTo5KPlan = {
  overview: {
    title: string;
    description: string;
    totalWeeks: number;
    totalDays: number;
    focus: string;
  };
  weeks: WeekPlan[];
  successMetrics: { week: number; target: string }[];
  tips: string[];
};

export default function BuildTo5K() {
  const [plan, setPlan] = useState<BuildTo5KPlan | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // In a real app, you would fetch this from your API
        // const response = await fetch('/api/generate-build-to-5k', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ user: { /* user data */ } })
        // });
        // const data = await response.json();
        // setPlan(data.plan);
        
        // Mock data for now
        setPlan({
          overview: {
            title: "Build to 5K Marketing Plan",
            description: "A 9-week program to build consistent marketing habits and grow your audience to 5,000 engaged followers.",
            totalWeeks: 9,
            totalDays: 63,
            focus: "Building sustainable marketing habits through consistent, manageable actions"
          },
          weeks: Array(9).fill(0).map((_, weekIndex) => ({
            weekNumber: weekIndex + 1,
            focus: weekIndex < 3 ? "Laying the Foundation" : 
                   weekIndex < 6 ? "Engagement & Growth" : "Scaling Your Impact",
            days: Array(7).fill(0).map((_, dayIndex) => ({
              day: (weekIndex * 7) + dayIndex + 1,
              tasks: [
                `Task 1 for Day ${(weekIndex * 7) + dayIndex + 1}`,
                `Task 2 for Day ${(weekIndex * 7) + dayIndex + 1}`,
                `Task 3 for Day ${(weekIndex * 7) + dayIndex + 1}`
              ]
            })),
            weeklyChallenge: weekIndex < 3 ? "Post 3 times this week" : 
                            weekIndex < 6 ? "Increase engagement by 20%" : 
                            "Grow your following by 10% this week"
          })),
          successMetrics: [
            { week: 1, target: "10 new followers" },
            { week: 3, target: "100 total followers" },
            { week: 6, target: "1,000 total followers" },
            { week: 9, target: "5,000 total followers" }
          ],
          tips: [
            "Consistency is key - stick to the daily tasks even when busy",
            "Track your progress and celebrate small wins",
            "Engage with your audience daily for best results",
            "Adjust the plan as needed based on what works for your audience"
          ]
        });
        
        // Load completed days from local storage
        const savedCompletedDays = localStorage.getItem('buildTo5kCompletedDays');
        if (savedCompletedDays) {
          setCompletedDays(JSON.parse(savedCompletedDays));
        }
      } catch (err) {
        setError('Failed to load the Build to 5K plan');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const toggleDayComplete = (dayNumber: number) => {
    const newCompletedDays = completedDays.includes(dayNumber)
      ? completedDays.filter(d => d !== dayNumber)
      : [...completedDays, dayNumber];
    
    setCompletedDays(newCompletedDays);
    localStorage.setItem('buildTo5kCompletedDays', JSON.stringify(newCompletedDays));
  };

  const currentWeekPlan = plan?.weeks.find(w => w.weekNumber === currentWeek);
  const progress = plan ? Math.round((completedDays.length / plan.overview.totalDays) * 100) : 0;

  if (loading) {
    return <div className="flex justify-center p-8">Loading your Build to 5K plan...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!plan) {
    return <div>No plan found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{plan.overview.title}</h1>
        <p className="text-muted-foreground">{plan.overview.description}</p>
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Week Navigation */}
        <div className="md:col-span-1 space-y-2">
          <h2 className="font-semibold mb-2">Weeks</h2>
          {plan.weeks.map((week) => (
            <Button
              key={week.weekNumber}
              variant={currentWeek === week.weekNumber ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setCurrentWeek(week.weekNumber)}
            >
              Week {week.weekNumber}
              {week.weekNumber < currentWeek && (
                <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
              )}
            </Button>
          ))}
        </div>

        {/* Current Week Plan */}
        <div className="md:col-span-3 space-y-6">
          {currentWeekPlan && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Week {currentWeekPlan.weekNumber}: {currentWeekPlan.focus}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Days {((currentWeek - 1) * 7) + 1}-{currentWeek * 7}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-medium">Weekly Challenge</h3>
                    </div>
                    <p>{currentWeekPlan.weeklyChallenge}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Daily Tasks</h3>
                    <div className="space-y-4">
                      {currentWeekPlan.days.map((day) => (
                        <Card key={day.day} className="overflow-hidden">
                          <div className="flex">
                            <button
                              onClick={() => toggleDayComplete(day.day)}
                              className={`p-4 flex items-center justify-center ${
                                completedDays.includes(day.day) ? 'bg-green-50' : 'bg-muted/50'
                              }`}
                            >
                              <CheckCircle 
                                className={`h-6 w-6 ${
                                  completedDays.includes(day.day) ? 'text-green-500' : 'text-muted-foreground'
                                }`} 
                              />
                            </button>
                            <div className="p-4 flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Day {day.day}</h4>
                                {completedDays.includes(day.day) && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Completed
                                  </span>
                                )}
                              </div>
                              <ul className="space-y-2 text-sm">
                                {day.tasks.map((task, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <span className={completedDays.includes(day.day) ? 'line-through text-muted-foreground' : ''}>
                                      {task}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Success Metrics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Success Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plan.successMetrics.map((metric, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Week {metric.week}</div>
                <div className="text-lg font-semibold mt-1">{metric.target}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
