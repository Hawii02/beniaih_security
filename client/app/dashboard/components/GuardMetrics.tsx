'use client'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";


const GuardMetrics = () => {
    const [metrics, setMetrics] = useState<any>(null);

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setMetrics({
                totalGuards: 54,
                activeGuards: 3,
                guardsOnLeave: 2,
                guardsAvailable: 49,
            });
        }, 1000);
    }, [])

    if (!metrics) {
        return (
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24"/>
                <Skeleton className="h-24"/>
            </div>
        )
    }

  return (
    <div className='grid grid-cols-2 gap-4 w-full h-1/4'>
      <div className='rounded-lg h-full space-y-4'>
        <Card className="flex  justify-center text-center">
            <CardHeader>
                <CardTitle className="text-lg font-medium mb-4">Total Guards</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-extrabold text-red-500">{metrics.totalGuards}</p>
            </CardContent>
        </Card>
        <Card className="flex  justify-center text-center">
            <CardHeader>
                <CardTitle className="text-lg font-medium mb-4">Active Guards</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-extrabold text-red-500">{metrics.activeGuards}</p>
            </CardContent>
        </Card>
        
      </div>
      <div className='rounded-lg h-full space-y-4'>
        <Card className="flex  justify-center text-center">
            <CardHeader>
                <CardTitle className="text-lg font-medium mb-4">Guards on Leave</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-extrabold text-red-500">{metrics.guardsOnLeave}</p>
            </CardContent>
        </Card>
        <Card className="flex  justify-center text-center">
            <CardHeader>
                <CardTitle className="text-lg font-medium mb-4">Guards Available</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-extrabold text-red-500">{metrics.guardsAvailable}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GuardMetrics
